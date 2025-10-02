#!/usr/bin/env python3
"""
Harvest positive academic quotes per peptide using Google Scholar.

Reads peptide list from src/data/peptide-compounds.json, focuses on peptides
with zero quotes in the current dataset (P0), and attempts to collect at least
three peer-reviewed candidate quotes per peptide. Results are written to:

- src/data/harvested-proposals.json: aggregated proposed quotes per peptide
- src/data/harvested-todo.json: checklist of needed counts per peptide

Run:
  python3 scripts/harvest_quotes.py --min 3 --limit 15 --max-peptides 5

Requires: scholarly, beautifulsoup4
"""
from __future__ import annotations

import argparse
import json
from pathlib import Path
from collections import defaultdict
from typing import Any, Dict, List, Optional

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
DATA_DIR = ROOT / "src" / "data"
STAGING_PATH = DATA_DIR / "peptide-quotes.staging.json"
FINAL_PATH = DATA_DIR / "peptide-quotes.final.json"
ALLOWED = set()
try:
    comp = json.loads((DATA_DIR / 'peptide-compounds.json').read_text(encoding='utf-8'))
    ALLOWED = {p['name'] for p in comp.get('peptides', [])}
except Exception:
    ALLOWED = set()


def load_json(p: Path) -> Dict[str, Any]:
    return json.loads(p.read_text(encoding="utf-8"))


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--min", type=int, default=3, help="Minimum proposals per peptide")
    ap.add_argument("--limit", type=int, default=15, help="Max papers to scan per peptide")
    ap.add_argument("--max-peptides", type=int, default=5, help="Max number of peptides to process (focus on those with <3 verified)")
    ap.add_argument("--peptides", type=str, default="", help="Optional comma-separated peptide names to target explicitly")
    args = ap.parse_args()

    compounds = load_json(DATA_DIR / "peptide-compounds.json")
    peptide_names = [p["name"] for p in compounds.get("peptides", [])]

    try:
        all_quotes = load_json(DATA_DIR / "peptide-specific-quotes.json").get("quotes", [])
    except FileNotFoundError:
        all_quotes = []
    try:
        verified_quotes = load_json(DATA_DIR / "peptide-specific-quotes.verified.json").get("quotes", [])
    except FileNotFoundError:
        verified_quotes = []

    # Count existing quotes per peptide
    counts = defaultdict(int)
    for q in all_quotes:
        n = q.get("peptide_name")
        if n:
            counts[n] += 1
    vcounts = defaultdict(int)
    for q in verified_quotes:
        n = q.get("peptide_name")
        if n:
            vcounts[n] += 1

    # Build target set
    if args.peptides.strip():
        requested = [s.strip() for s in args.peptides.split(',') if s.strip()]
        # keep only known peptides
        target = [p for p in requested if p in peptide_names]
        if not target:
            target = requested  # fallback to requested if names differ slightly
    else:
        # Focus on peptides with <3 verified quotes
        focus = [n for n in peptide_names if vcounts.get(n, 0) < 3]
        # Sort by (verified asc, total asc) to prioritize least-covered first
        focus.sort(key=lambda n: (vcounts.get(n, 0), counts.get(n, 0)))
        # Limit to max-peptides
        target = focus[: max(1, args.max_peptides)]

    # Import harvester
    try:
        from .scholar_integration import (
            harvest_peptide_quotes,
            PEPTIDE_SYNONYMS,
            POSITIVE_KEYWORDS,
            extract_marketing_sentences,
        )  # type: ignore
    except Exception:
        from scholar_integration import (
            harvest_peptide_quotes,
            PEPTIDE_SYNONYMS,
            POSITIVE_KEYWORDS,
            extract_marketing_sentences,
        )  # type: ignore
    # Make synonyms and keywords available to fallback functions
    global PEPTIDE_SYNONYMS, POSITIVE_KEYWORDS
    # Utilities for HTTP and parsing
    try:
        from .validate_quotes import html_to_text, fetch_url, classify_source  # type: ignore
    except Exception:
        from validate_quotes import html_to_text, fetch_url, classify_source  # type: ignore
    # expose helpers for fallback
    global html_to_text, fetch_url, classify_source

    harvested: Dict[str, List[Dict[str, Any]]] = {}
    for name in target:
        res: Optional[List[Dict[str, Any]]] = harvest_peptide_quotes(name, min_quotes=args.min, max_papers=args.limit)
        if not res:
            # Europe PMC fallback: search OA full text on PMC
            proposals = harvest_via_epmc(name, min_quotes=args.min)
            res = proposals
        if res:
            harvested[name] = res

    # Curate marketing value: remove weak/non-benefit sentences
    curated = curate_marketing_value(harvested)

    # Write a single staging quote file (canonical gathering file)
    staging_quotes = [q for q in curated_to_quotes(curated) if (not ALLOWED or q.get('peptide_name') in ALLOWED)]
    staging_doc = {
        "metadata": {
            "title": "Peptide Quotes (Staging)",
            "note": "Benefit-focused, peer-reviewed quotes awaiting approval before promotion.",
            "targets": target,
            "generated_by": "scripts/harvest_quotes.py",
        },
        "quotes": staging_quotes,
    }
    STAGING_PATH.write_text(json.dumps(staging_doc, indent=2), encoding="utf-8")

    # Skip writing any additional files; we maintain only staging + final quote files
    print(f"Wrote staging quotes to {STAGING_PATH}")
    return 0


def harvest_via_epmc(peptide: str, min_quotes: int = 3) -> Optional[List[Dict[str, Any]]]:
    # local import to avoid module-level package context issues
    try:
        from .scholar_integration import extract_marketing_sentences  # type: ignore
    except Exception:
        from scholar_integration import extract_marketing_sentences  # type: ignore
    import urllib.request, urllib.parse, json as _json
    base = "https://www.ebi.ac.uk/europepmc/webservices/rest/search"
    # Expand with synonyms for better recall
    try:
        from .scholar_integration import PEPTIDE_SYNONYMS  # type: ignore
    except Exception:
        from scholar_integration import PEPTIDE_SYNONYMS  # type: ignore
    syns = PEPTIDE_SYNONYMS.get(peptide.lower(), [])
    terms = [peptide] + syns
    term_query = " OR ".join(terms)
    # Require human/clinical context in search
    human_clause = " AND (human OR humans OR patient OR patients OR clinical OR randomized OR trial)"
    extra = human_clause
    if peptide.lower() in ("ahk-cu", "ahk cu"):
        extra += " AND (hair OR skin OR dermal OR dermis)"
    query = f"({term_query}) AND OPEN_ACCESS:y{extra}"
    url = f"{base}?query={urllib.parse.quote(query)}&resultType=core&pageSize=25&format=json"
    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            data = resp.read().decode("utf-8", errors="ignore")
    except Exception:
        return None
    try:
        j = _json.loads(data)
    except Exception:
        return None
    results = j.get("resultList", {}).get("result", [])
    if not results:
        return None
    proposals: List[Dict[str, Any]] = []
    seen = set()
    for r in results:
        pmcid = r.get("pmcid")
        if not pmcid:
            continue
        pmc_url = f"https://pmc.ncbi.nlm.nih.gov/articles/{pmcid}/"
        body, ctype, status = fetch_url(pmc_url)
        if not body:
            continue
        stype = classify_source(pmc_url, None)
        if stype not in {"pmc_html", "journal_html"}:
            continue
        html = body.decode("utf-8", errors="ignore")
        candidates = extract_marketing_sentences(html, peptide, positive_only=True)
        for s, score, section in candidates:
            key = (s.lower()[:400])
            if key in seen:
                continue
            seen.add(key)
            proposals.append({
                "peptide_name": peptide,
                "replacement_quote": s.strip()[:600],
                "paper_title": r.get("title"),
                "authors": r.get("authorString"),
                "year": r.get("pubYear"),
                "url": pmc_url,
                "source": "EuropePMC",
                "positivity_score": round(float(score), 2),
                "section": section,
            })
            if len(proposals) >= min_quotes:
                return proposals
    return proposals or None


def split_sentences(text: str) -> List[str]:
    import re as _re
    return _re.split(r"(?<=[.!?])\s+", text)


def sanitize_proposals(harvested: Dict[str, List[Dict[str, Any]]]) -> Dict[str, List[Dict[str, Any]]]:
    import re as _re
    def clean_text(t: str) -> str:
        # remove bracket citations and lingering nav text patterns
        t = _re.sub(r"\[[^\]]+\]", "", t)
        t = _re.sub(r"\(ref\.?\s*\d+\)", "", t, flags=_re.I)
        # drop leading numbering like "34\n "
        t = _re.sub(r"^\s*\d+\s+", "", t)
        # collapse whitespace
        t = _re.sub(r"\s+", " ", t).strip()
        # ensure ending punctuation
        if t and t[-1] not in ".!?":
            t += "."
        return t
    out: Dict[str, List[Dict[str, Any]]] = {}
    for pep, items in harvested.items():
        cleaned = []
        for it in items:
            it = dict(it)
            q = it.get("replacement_quote", "")
            it["replacement_quote"] = clean_text(q)
            cleaned.append(it)
        out[pep] = cleaned
    return out


def curate_marketing_value(harvested: Dict[str, List[Dict[str, Any]]]) -> Dict[str, List[Dict[str, Any]]]:
    """Filter to benefit-focused proposals with adequate positivity score and readable text."""
    # import benefit/exclude lexicons
    try:
        from .scholar_integration import BENEFIT_TERMS, EXCLUDE_TERMS, ANIMAL_TERMS  # type: ignore
    except Exception:
        from scholar_integration import BENEFIT_TERMS, EXCLUDE_TERMS, ANIMAL_TERMS  # type: ignore
    curated: Dict[str, List[Dict[str, Any]]] = {}
    for pep, items in harvested.items():
        keep: List[Dict[str, Any]] = []
        for it in items or []:
            qt = (it.get("replacement_quote", "") or "").strip()
            sl = qt.lower()
            if len(qt) < 60 or len(qt) > 350:
                continue
            if any(x in sl for x in EXCLUDE_TERMS):
                continue
            if any(x in sl for x in ANIMAL_TERMS):
                continue
            if not any(bt in sl for bt in BENEFIT_TERMS):
                continue
            score = float(it.get("positivity_score", 0.0) or 0.0)
            if score < 1.8:  # require decent positivity
                continue
            keep.append(it)
        if keep:
            curated[pep] = keep[:3]  # cap at 3 per peptide
    return curated


def curated_to_quotes(curated: Dict[str, List[Dict[str, Any]]]) -> List[Dict[str, Any]]:
    """Flatten curated proposals into a quotes[] list compatible with peptide-specific schema."""
    quotes: List[Dict[str, Any]] = []
    next_id = 1
    for pep, items in curated.items():
        for it in items:
            quote_text = (it.get("replacement_quote") or "").strip()
            title = it.get("paper_title") or "Peer-reviewed study"
            authors = it.get("authors") or "Study authors"
            url = it.get("url") or ""
            entry = {
                "id": next_id,
                "peptide_name": pep,
                "quote": quote_text,
                "scientist": str(authors),
                "organization": str(title),
                "credentials": "",
                "logo": "/logos/medical.svg",
                "source": url,
                "source_type": "Peer-Reviewed (Abstract/Conclusion)",
                "verification_status": "Staging - Needs approval"
            }
            quotes.append(entry)
            next_id += 1
    return quotes


if __name__ == "__main__":
    raise SystemExit(main())
