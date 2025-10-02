#!/usr/bin/env python3
"""
Quote Source Validator

Reads the scientific and peptide-specific quote JSON files and attempts to
validate that the quoted text appears in the cited source. Works best with
HTML sources (PMC, PubMed, Frontiers, etc.). PDF parsing and HTML parsing are
optional if third-party libraries are available.

Outputs a JSON report with per-quote validation results.
Optionally emits filtered, high-quality JSON files (only academically
validated quotes) next to the inputs or in a specified directory.

Run:
  python3 scripts/validate_quotes.py \
    --files src/data/scientific-quotes.json src/data/peptide-specific-quotes.json \
    --out validation_report.json

Note: Network access is required to fetch sources.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
import time
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

try:
    # Optional, for better HTML parsing
    from bs4 import BeautifulSoup  # type: ignore
except Exception:  # pragma: no cover - optional
    BeautifulSoup = None  # type: ignore

try:
    # Optional, for parsing PDFs
    import PyPDF2  # type: ignore
except Exception:  # pragma: no cover - optional
    PyPDF2 = None  # type: ignore

try:
    # Optional, for better fuzzy matching
    from difflib import SequenceMatcher
except Exception:  # pragma: no cover - standard lib
    SequenceMatcher = None  # type: ignore

try:
    # Standard library HTTP
    import urllib.request as urllib_request
    import urllib.error as urllib_error
except Exception:
    urllib_request = None  # type: ignore
    urllib_error = None  # type: ignore


FETCH_TIMEOUT = 30
USER_AGENT = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)


@dataclass
class QuoteItem:
    id: Any
    quote: str
    source: str
    context: Dict[str, Any]


@dataclass
class ValidationResult:
    id: Any
    source: str
    source_type: Optional[str]
    exact_match: bool
    fuzzy_score: float
    matched_excerpt: Optional[str]
    content_type: Optional[str]
    status: str
    notes: Optional[str]
    file: Optional[str] = None


def load_quotes(file_path: Path) -> List[QuoteItem]:
    data = json.loads(file_path.read_text(encoding="utf-8"))
    quotes: List[QuoteItem] = []
    for q in data.get("quotes", []):
        quote_text = q.get("quote") or ""
        source = q.get("source") or ""
        if not quote_text or not source:
            continue
        quotes.append(
            QuoteItem(
                id=q.get("id"),
                quote=quote_text.strip(),
                source=source.strip(),
                context={k: v for k, v in q.items() if k not in ("id", "quote", "source")},
            )
        )
    return quotes


def fetch_url(url: str) -> Tuple[Optional[bytes], Optional[str], str]:
    if urllib_request is None:
        return None, None, "urllib not available"
    req = urllib_request.Request(url, headers={"User-Agent": USER_AGENT})
    try:
        with urllib_request.urlopen(req, timeout=FETCH_TIMEOUT) as resp:
            content_type = resp.headers.get("Content-Type")
            data = resp.read()
            return data, content_type, "ok"
    except Exception as e:  # pragma: no cover - network issues
        return None, None, f"fetch_error: {e}"


def html_to_text(html: str) -> str:
    if BeautifulSoup is not None:
        soup = BeautifulSoup(html, "html.parser")
        # remove scripts and styles
        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()
        text = soup.get_text(separator="\n")
        return re.sub(r"\n+", "\n", text)
    # Fallback: crude tag strip
    text = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.I)
    text = re.sub(r"<style[\s\S]*?</style>", " ", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text


def extract_pdf_text(pdf_bytes: bytes) -> str:
    if PyPDF2 is None:
        return ""
    try:
        reader = PyPDF2.PdfReader(io.BytesIO(pdf_bytes))  # type: ignore
    except Exception:
        # Some PDFs are scanned; return empty
        return ""
    texts: List[str] = []
    for page in getattr(reader, "pages", [])[:50]:  # limit pages
        try:
            texts.append(page.extract_text() or "")
        except Exception:
            continue
    return "\n".join(texts)


def normalize(s: str) -> str:
    s = re.sub(r"\s+", " ", s)
    return s.strip().lower()


def best_fuzzy_contains(needle: str, haystack: str) -> Tuple[float, Optional[str]]:
    """Return a simple fuzzy ratio [0..1] and a short matching excerpt if any.
    Uses difflib as a fallback approximate scorer; exact match gets 1.0.
    """
    if not needle or not haystack:
        return 0.0, None
    n_norm = normalize(needle)
    h_norm = normalize(haystack)
    if n_norm in h_norm:
        # Extract a small excerpt around first occurrence in original haystack
        idx = h_norm.find(n_norm)
        start = max(0, idx - 80)
        end = min(len(haystack), idx + len(needle) + 80)
        return 1.0, haystack[start:end]

    # Fallback approximate: slide windows over haystack
    if SequenceMatcher is None:
        return 0.0, None

    # Limit haystack size for performance
    h = h_norm
    n = n_norm
    n_len = len(n)
    if n_len == 0:
        return 0.0, None

    best = 0.0
    best_span: Optional[Tuple[int, int]] = None
    step = max(20, n_len // 4)
    window = min(len(h), max(1000, n_len + 200))
    for i in range(0, len(h), step):
        segment = h[i : i + window]
        ratio = SequenceMatcher(None, n, segment).ratio()
        if ratio > best:
            best = ratio
            best_span = (i, min(i + window, len(h)))
    excerpt = None
    if best_span is not None:
        s, e = best_span
        excerpt = haystack[max(0, s - 80) : min(len(haystack), e + 80)]
    return best, excerpt


def classify_source(source: str, source_type: Optional[str]) -> str:
    s = source.lower()
    if s.endswith(".pdf") or "content-type=application/pdf" in s:
        return "pdf"
    if "pmc.ncbi.nlm.nih.gov" in s:
        return "pmc_html"
    if "pubmed.ncbi.nlm.nih.gov" in s:
        return "pubmed_html"
    if s.startswith("https://doi.org/") or s.startswith("http://doi.org/"):
        return "doi_landing"
    if any(d in s for d in [
        "frontiersin.org","nature.com","embopress.org","sciencedirect.com",
        "springer.com","wiley.com","cell.com","thelancet.com","nejm.org",
        "jamanetwork.com","bmj.com","karger.com","mdpi.com","plos.org",
        "sagepub.com","tandfonline.com","acs.org","rsc.org","oup.com",
        "academic.oup.com","cambridge.org","icmje.org","biomedcentral.com",
        "onlinelibrary.wiley.com","link.springer.com","ingentaconnect.com",
        "pnas.org","europepmc.org","elifesciences.org","onlinelibrary.wiley.com",
        "onlinelibrary.wiley.com","nature.com","jamanetwork.com","bmj.com",
        "frontiersin.org","mdpi.com","sciencedirect.com","cell.com",
        "onlinelibrary.wiley.com","tandfonline.com","spandidos-publications.com",
        "oncotarget.com","liebertpub.com","aacrjournals.org","physiology.org"
    ]):
        return "journal_html"
    if "youtube.com" in s or "youtu.be" in s:
        return "video"
    return "web_html"


def validate_single(quote: QuoteItem) -> ValidationResult:
    s_type_hint = quote.context.get("source_type")
    s_class = classify_source(quote.source, s_type_hint)
    data, content_type, status = fetch_url(quote.source)
    if data is None:
        return ValidationResult(
            id=quote.id,
            source=quote.source,
            source_type=s_type_hint,
            exact_match=False,
            fuzzy_score=0.0,
            matched_excerpt=None,
            content_type=None,
            status=status,
            notes=f"Could not fetch source ({s_class}).",
        )

    ctype = content_type or ""
    text = ""
    notes = None
    exact = False
    score = 0.0
    excerpt = None

    if "pdf" in ctype or s_class == "pdf":
        if PyPDF2 is None:
            notes = "PDF detected but PyPDF2 not installed; skipping text extraction."
        else:
            try:
                import io  # local import to avoid top-level dependency
                reader = PyPDF2.PdfReader(io.BytesIO(data))  # type: ignore
                pages_text: List[str] = []
                for page in getattr(reader, "pages", [])[:75]:
                    try:
                        pages_text.append(page.extract_text() or "")
                    except Exception:
                        continue
                text = "\n".join(pages_text)
            except Exception as e:
                notes = f"PDF extraction error: {e}"
    else:
        # Treat as HTML/text
        try:
            # Assume utf-8, fallback to latin-1
            html = data.decode("utf-8", errors="ignore")
        except Exception:
            html = data.decode("latin-1", errors="ignore")
        text = html_to_text(html)

    if text:
        score, excerpt = best_fuzzy_contains(quote.quote, text)
        exact = score >= 0.999

    # Heuristics for clear non-academic sources
    if s_class in ("video", "web_html") and not exact:
        if not s_type_hint or not any(
            kw in (s_type_hint or "").lower()
            for kw in ("journal", "clinical", "trial", "fda", "review")
        ):
            if notes:
                notes += " | Non-academic source detected"
            else:
                notes = "Non-academic source detected"

    return ValidationResult(
        id=quote.id,
        source=quote.source,
        source_type=s_type_hint,
        exact_match=exact,
        fuzzy_score=round(float(score), 3),
        matched_excerpt=(excerpt[:400] if excerpt else None),
        content_type=ctype,
        status="ok",
        notes=notes,
        file=None,
    )


def main(argv: Optional[List[str]] = None) -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--files", nargs="+", required=True, help="JSON files to validate")
    p.add_argument("--out", default="validation_report.json", help="Output report path")
    p.add_argument("--delay", type=float, default=1.0, help="Delay between fetches (sec)")
    p.add_argument("--min-score", type=float, default=0.9, help="Minimum fuzzy score to accept as verified if not exact")
    p.add_argument("--verified-out-dir", default=None, help="If set, emit filtered high-quality JSONs here with .verified.json suffix")
    p.add_argument("--scholar-fallback", action="store_true", help="Attempt Google Scholar fallback for non-academic or low-score quotes if scholarly is installed")
    p.add_argument("--scholar-max", type=int, default=3, help="Max results per fallback search")
    p.add_argument("--proposed-out-dir", default=None, help="If set, emit a parallel .verified.proposed.json containing Scholar-proposed replacements for filtered items")
    args = p.parse_args(argv)

    all_results: Dict[str, Any] = {"files": [], "results": []}
    per_file_quotes: Dict[str, List[QuoteItem]] = {}
    per_file_results: Dict[str, List[Dict[str, Any]]] = {}
    for f in args.files:
        path = Path(f)
        if not path.exists():
            print(f"File not found: {path}", file=sys.stderr)
            return 2
        quotes = load_quotes(path)
        per_file_quotes[str(path)] = quotes
        all_results["files"].append({"file": str(path), "count": len(quotes)})
        file_results: List[Dict[str, Any]] = []
        for q in quotes:
            res = validate_single(q)
            # enrich with minimal context
            entry = asdict(res)
            entry["quote_text"] = q.quote
            entry["scientist"] = q.context.get("scientist")
            entry["peptide_name"] = q.context.get("peptide_name")
            entry["file"] = str(path)
            file_results.append(entry)
            time.sleep(args.delay)
        per_file_results[str(path)] = file_results
        all_results["results"].extend(file_results)

    # Optional: Scholar fallback to suggest replacements
    proposed_per_file: Dict[str, List[Dict[str, Any]]] = {}
    if args.scholar_fallback:
        try:
            from .scholar_integration import try_scholar_replacements  # type: ignore
        except Exception:
            try:
                from scholar_integration import try_scholar_replacements  # type: ignore
            except Exception:
                try_scholar_replacements = None  # type: ignore
        if try_scholar_replacements is not None:
            for file_path, file_results in per_file_results.items():
                for r in file_results:
                    low_score = (not r.get("exact_match")) and (r.get("fuzzy_score", 0.0) < args.min_score)
                    non_ac = (r.get("notes") or "").find("Non-academic") >= 0
                    if low_score or non_ac:
                        qtxt = r.get("quote_text", "")
                        peptide = r.get("peptide_name")
                        scientist = r.get("scientist")
                        suggestions = try_scholar_replacements(qtxt, peptide=peptide, scientist=scientist, limit=args.scholar_max)
                        if suggestions:
                            r["scholar_suggestions"] = suggestions
                            proposed_per_file.setdefault(file_path, []).extend(suggestions)

    out_path = Path(args.out)
    out_path.write_text(json.dumps(all_results, indent=2), encoding="utf-8")
    print(f"Wrote report to {out_path}")

    # Optionally emit filtered high-quality JSON files
    if args.verified_out_dir:
        out_dir = Path(args.verified_out_dir)
        out_dir.mkdir(parents=True, exist_ok=True)
        # Load original JSONs to preserve metadata
        for f in args.files:
            srcp = Path(f)
            original = json.loads(srcp.read_text(encoding="utf-8"))
            quotes = original.get("quotes", [])
            # Join with results
            file_results = [r for r in all_results["results"] if r.get("file") == str(srcp)]
            # Decide acceptance criteria
            verified_quotes = []
            for q in quotes:
                rid = q.get("id")
                rlist = [r for r in file_results if r.get("id") == rid]
                if not rlist:
                    continue
                r = rlist[0]
                sclass = classify_source(q.get("source", ""), q.get("source_type"))
                academic = sclass in {"pmc_html","pubmed_html","journal_html","doi_landing","pdf"}
                non_ac_flag = (r.get("notes") or "").find("Non-academic") >= 0
                ok = (r.get("exact_match") or 0) or (r.get("fuzzy_score", 0.0) >= args.min_score)
                if academic and ok and not non_ac_flag:
                    verified_quotes.append(q)
            # Rebuild document
            new_doc = dict(original)
            new_doc["quotes"] = verified_quotes
            # Update metadata counts
            if "metadata" in new_doc and isinstance(new_doc["metadata"], dict):
                new_doc["metadata"]["total_quotes"] = len(verified_quotes)
                new_doc["metadata"]["verification_status"] = f"Filtered: {len(verified_quotes)} academically verified quotes"
            # Write with .verified.json suffix
            dst = out_dir / (srcp.stem + ".verified.json")
            dst.write_text(json.dumps(new_doc, indent=2), encoding="utf-8")
            print(f"Wrote verified JSON: {dst}")

            # Optionally, also write proposed replacements alongside
            if args.proposed_out_dir:
                pdir = Path(args.proposed_out_dir)
                pdir.mkdir(parents=True, exist_ok=True)
                proposed = proposed_per_file.get(str(srcp), [])
                proposed_doc = {
                    "metadata": {
                        "title": original.get("metadata", {}).get("title", "Proposed Academic Replacements"),
                        "note": "These are Scholar-proposed candidate quotes for items that failed validation or were non-academic. Review before use."
                    },
                    "proposed_quotes": proposed,
                }
                dstp = pdir / (srcp.stem + ".verified.proposed.json")
                dstp.write_text(json.dumps(proposed_doc, indent=2), encoding="utf-8")
                print(f"Wrote proposed JSON: {dstp}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
