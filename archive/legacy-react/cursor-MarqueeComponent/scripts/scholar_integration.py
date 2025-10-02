"""
Google Scholar fallback integration using the `scholarly` library.

This module searches for peer-reviewed replacements when a quoted text is
non-academic or not found in its cited source. It returns a short list of
candidate quotes (exact sentences) with basic citation metadata.

Usage (from validator): try_scholar_replacements(quote_text, peptide, scientist)

Notes:
- Requires: pip install scholarly
- Respects a small delay internally to be polite.
"""
from __future__ import annotations

import re
import time
from typing import Any, Dict, List, Optional

try:
    from scholarly import scholarly  # type: ignore
except Exception:
    scholarly = None  # type: ignore

try:
    from bs4 import BeautifulSoup  # type: ignore
except Exception:
    BeautifulSoup = None  # type: ignore

try:
    from .validate_quotes import html_to_text, fetch_url, best_fuzzy_contains, classify_source  # type: ignore
except Exception:  # when run as a script without package context
    from validate_quotes import html_to_text, fetch_url, best_fuzzy_contains, classify_source  # type: ignore

# Lightweight synonym dictionaries to improve recall
PEPTIDE_SYNONYMS = {
    "semaglutide": ["ozempic", "wegovy", "glp-1 receptor agonist", "glp-1ra"],
    "tirzepatide": ["mounjaro", "glp-1 gip dual agonist", "glp-1/gip"],
    "bpc-157": ["body protection compound", "pentadecapeptide bpc157", "bpc 157"],
    "mots-c": ["mots c", "mitochondrial-derived peptide", "mdp"],
    "thymosin alpha-1": ["tα1", "thymalfasin", "thymosin a1"],
    "tb-500": ["thymosin beta-4", "tb4", "tβ4"],
    "cjc-1295": ["cjc1295", "growth hormone releasing hormone analog", "ghrh analog", "cjc-1295 dac"],
    "sermorelin": ["ghrh 1-29", "sermorelin acetate"],
    "ipamorelin": ["gh secretagogue", "ghrelin receptor agonist"],
    "ghrp-2": ["pralmorelin", "growth hormone releasing peptide-2"],
    "ghrp-6": ["growth hormone releasing peptide-6"],
    "igf-1 lr3": ["lr3 igf-1", "insulin-like growth factor long r3"],
    "aod9604": ["gh fragment 177-191", "hgh fragment 176-191"],
    "dsip": ["delta sleep-inducing peptide"],
    "nad+": ["nicotinamide adenine dinucleotide", "nad plus"],
    "tesamorelin": ["egrifta", "th9507", "grf 1-44 analog", "ghrh analog"],
    "pt-141": ["bremelanotide"],
    "bremelanotide": ["pt-141", "pt141"],
    "kisspeptin-10": ["kisspeptin", "kp-10", "kiss1"],
    "ll-37": ["cathelicidin", "hcap18", "camp"],
    "ghk-cu": ["copper peptide", "gly-his-lys-cu", "ghk cu", "ghk"],
    "ahk-cu": ["ala-his-lys-cu", "ahk cu", "ahk"],
    "afamelanotide": ["melanotan-1", "melanotan 1", "scenesse"],
    "melanotan-1": ["afamelanotide", "scenesse"],
    "gonadorelin": ["gnrh", "gonadotropin-releasing hormone", "lhrh"],
    "ss-31": ["elamipretide", "mtp-131"],
    "elamipretide": ["ss-31", "mtp-131"],
    "retatrutide": ["ly3437943"],
    "survodutide": ["bi 456906"],
}

TERM_SYNONYMS = {
    "wound": ["injury", "lesion", "tissue repair", "healing"],
    "healing": ["repair", "regeneration", "restoration"],
    "inflammation": ["inflammatory", "anti-inflammatory", "inflamm"],
    "neuroprotective": ["neuroprotection", "neuroprotect"],
    "weight": ["obesity", "adiposity", "body weight"],
    "sleep": ["rem", "insomnia", "sleep quality"],
    "growth hormone": ["hgh", "somatotropin", "gh"],
}

POSITIVE_KEYWORDS = [
    "effective",
    "efficacy",
    "beneficial",
    "significant",
    "improved",
    "improves",
    "improvement",
    "promotes",
    "promote",
    "protective",
    "well tolerated",
    "safe",
    "reduced",
    "reduces",
    "increase",
    "increases",
    "enhanced",
    "enhances",
    "favorable",
    # strength/marketing value terms
    "robust",
    "marked",
    "clinically significant",
    "substantial",
    "potent",
    "well-established",
    "favorable safety",
    "well tolerated",
    "safe and effective",
]

# Weighting for positivity scoring
KEYWORD_WEIGHTS = {
    "effective": 2.0,
    "efficacy": 1.5,
    "beneficial": 1.5,
    "significant": 1.5,
    "clinically significant": 2.0,
    "improved": 1.5,
    "improves": 1.5,
    "improvement": 1.5,
    "promotes": 1.25,
    "protective": 1.25,
    "well tolerated": 2.0,
    "safe": 1.5,
    "safe and effective": 2.5,
    "reduced": 1.5,
    "reduces": 1.5,
    "increase": 1.0,
    "increases": 1.0,
    "enhanced": 1.2,
    "enhances": 1.2,
    "favorable": 1.2,
    "favorable safety": 1.7,
    "robust": 1.3,
    "substantial": 1.3,
    "potent": 1.2,
}

# Marketing benefit lexicon (prioritize outcome-focused language)
BENEFIT_TERMS = [
    # efficacy/outcomes
    "reduces", "reduced", "reduction", "decreases", "decreased",
    "improves", "improved", "improvement", "enhances", "enhanced",
    "effective", "efficacy", "efficacious", "superior",
    # clinical metrics
    "weight loss", "body weight", "bmi", "waist circumference", "vat",
    "pain", "wound healing", "healing time", "symptoms", "severity",
    "quality of life", "qol", "response rate", "remission", "clearance",
    # safety/tolerability
    "well tolerated", "tolerability", "adverse events", "safety profile",
]

# Exclude mechanistic/assay-heavy sentences (low marketing value)
EXCLUDE_TERMS = [
    "receptor", "pathway", "binding affinity", "affinity",
    "gene expression", "mrna", "protein expression",
    "in vitro", "in vivo imaging", "radiolabel", "radiolabeling",
    "assay", "cell line", "cells were", "fragmented",
    "sequence", "synthesis", "solid-phase", "peptide synthesis",
    "transfected", "western blot", "immunostaining", "chromatography",
    # avoid plant/genotype false positives for AHK-Cu
    "ahk-200", "cucumis", "melon genotype", "plant",
]

# Exclude animal/preclinical contexts (human-only marketing)
ANIMAL_TERMS = [
    "rat", "rats", "mouse", "mice", "murine", "hamster", "guinea pig",
    "rabbit", "canine", "feline", "porcine", "ovine", "bovine", "primate",
    "avian", "chicken", "zebrafish", "fish", "yak", "yaks",
    # common model phrasing
    "sprague-dawley", "c57bl/6", "in rats", "in mice", "in yaks", "rat models",
]


def _keywords_from_quote(quote: str) -> List[str]:
    # crude keyword selection: words >=5 chars, dedup, take up to 5
    words = re.findall(r"[A-Za-z][A-Za-z\-]{4,}", quote)
    seen = set()
    kws = []
    for w in words:
        wl = w.lower()
        if wl not in seen:
            seen.add(wl)
            kws.append(wl)
        if len(kws) >= 5:
            break
    return kws


def _expand_with_synonyms(peptide: Optional[str], quote: str) -> List[str]:
    expansions: List[str] = []
    p = (peptide or "").lower()
    if p in PEPTIDE_SYNONYMS:
        expansions.extend(PEPTIDE_SYNONYMS[p])
    # add term synonyms from the quote
    ql = quote.lower()
    for term, syns in TERM_SYNONYMS.items():
        if term in ql:
            expansions.extend(syns)
    return expansions


def _build_query(quote: str, peptide: Optional[str], scientist: Optional[str]) -> List[str]:
    base_parts = []
    if peptide:
        base_parts.append(peptide)
    kws = _keywords_from_quote(quote)[:3]
    base_parts.extend(kws)
    if not base_parts:
        base_parts = quote.split()[:4]

    # create multiple query variants with synonyms
    variants: List[str] = []
    expansions = _expand_with_synonyms(peptide, quote)
    # primary
    variants.append(" ".join(base_parts))
    # add synonyms in permutations (limited)
    for e in expansions[:4]:
        variants.append(" ".join(base_parts + [e]))
    # favor peer-reviewed hits
    variants = [v + " review randomized site:pmc.ncbi.nlm.nih.gov" for v in variants]
    return variants


def try_scholar_replacements(
    quote_text: str,
    peptide: Optional[str] = None,
    scientist: Optional[str] = None,
    limit: int = 3,
    delay: float = 1.0,
) -> Optional[List[Dict[str, Any]]]:
    if not scholarly:
        return None
    queries = _build_query(quote_text, peptide, scientist)
    suggestions: List[Dict[str, Any]] = []
    for query in queries:
        try:
            search = scholarly.search_pubs(query)
        except Exception:
            continue
        for i, paper in enumerate(search):
            if i >= max(1, limit):
                break
            bib = paper.get("bib", {}) if isinstance(paper, dict) else {}
            title = bib.get("title")
            year = bib.get("pub_year")
            authors = bib.get("author")
            url = paper.get("pub_url") or paper.get("eprint_url")
            if not url:
                continue
            data, content_type, status = fetch_url(url)
            if not data:
                continue
            try:
                html = data.decode("utf-8", errors="ignore")
            except Exception:
                html = data.decode("latin-1", errors="ignore")
            text = html_to_text(html)
            score, excerpt = best_fuzzy_contains(quote_text, text)
            matched_sentence = None
            if score >= 0.8 and excerpt:
                matched_sentence = excerpt.strip()
            else:
                # find a sentence mentioning peptide or its synonyms
                targets = [peptide.lower()] if peptide else []
                targets += [t for t in _expand_with_synonyms(peptide, quote_text)]
                sentences = re.split(r"(?<=[.!?])\s+", text)
                for s in sentences:
                    sl = s.lower()
                    if any(t and t in sl for t in targets) and 40 <= len(s) <= 400:
                        matched_sentence = s.strip()
                        break
            if matched_sentence:
                suggestions.append(
                    {
                        "replacement_quote": matched_sentence[:600],
                        "paper_title": title,
                        "authors": authors,
                        "year": year,
                        "url": url,
                        "fuzzy_score": round(float(score), 3),
                        "query": query,
                    }
                )
        if suggestions:
            break
        time.sleep(delay)

    return suggestions or None


def _peptide_queries(peptide: str) -> List[str]:
    p = peptide.lower()
    terms = [peptide]
    if p in PEPTIDE_SYNONYMS:
        terms += PEPTIDE_SYNONYMS[p]
    # Bias toward human clinical content
    base = [
        f"{peptide} human randomized site:pmc.ncbi.nlm.nih.gov",
        f"{peptide} human clinical site:pmc.ncbi.nlm.nih.gov",
        f"{peptide} humans review site:pmc.ncbi.nlm.nih.gov",
        f"{peptide} patients efficacy site:pmc.ncbi.nlm.nih.gov",
    ]
    for t in terms[:4]:
        base.append(f"{t} site:pmc.ncbi.nlm.nih.gov")
    # add broader queries without site restriction as backup
    base += [
        f"{peptide} randomized clinical human",
        f"{peptide} efficacy patients",
        f"{peptide} review clinical",
    ]
    return base


def harvest_peptide_quotes(
    peptide: str,
    min_quotes: int = 3,
    max_papers: int = 15,
    positive_only: bool = True,
    delay: float = 1.0,
) -> Optional[List[Dict[str, Any]]]:
    if not scholarly:
        return None
    queries = _peptide_queries(peptide)
    seen_sentences = set()
    proposals: List[Dict[str, Any]] = []

    for query in queries:
        try:
            search = scholarly.search_pubs(query)
        except Exception:
            continue
        count = 0
        for paper in search:
            if count >= max_papers:
                break
            count += 1
            bib = paper.get("bib", {}) if isinstance(paper, dict) else {}
            title = bib.get("title")
            year = bib.get("pub_year")
            authors = bib.get("author")
            url = paper.get("pub_url") or paper.get("eprint_url")
            if not url:
                continue
            data, content_type, status = fetch_url(url)
            if not data:
                continue
            # Filter non-academic domains using classify_source
            stype = classify_source(url, None)
            if stype not in {"pmc_html", "pubmed_html", "journal_html", "doi_landing", "pdf"}:
                continue
            try:
                html = data.decode("utf-8", errors="ignore")
            except Exception:
                html = data.decode("latin-1", errors="ignore")

            candidates = extract_marketing_sentences(html, peptide, positive_only=True)
            for s, score, section in candidates:
                key = (s.lower()[:400])
                if key in seen_sentences:
                    continue
                seen_sentences.add(key)
                proposals.append({
                    "peptide_name": peptide,
                    "replacement_quote": s.strip()[:600],
                    "paper_title": title,
                    "authors": authors,
                    "year": year,
                    "url": url,
                    "query": query,
                    "positivity_score": round(score, 2),
                    "section": section,
                })
                if len(proposals) >= min_quotes:
                    return proposals
        time.sleep(delay)
    return proposals or None


def extract_marketing_sentences(html: str, peptide: str, positive_only: bool = True) -> List[tuple[str, float, str]]:
    """Extract sentences from Abstract/Conclusion first, rank by positivity and relevance."""
    # Clean helper
    def strip_citations(s: str) -> str:
        # remove any bracketed citations like [1], [12, 13], or multi-line like [ 12 ]
        s = re.sub(r"\[[^\]]+\]", "", s)
        # remove in-text citations like (ref. 12) loosely
        s = re.sub(r"\(ref\.?\s*\d+\)", "", s, flags=re.I)
        s = re.sub(r"\s+", " ", s).strip()
        return s

    sections: List[tuple[str, str]] = []  # (section_name, text)
    if BeautifulSoup is not None:
        soup = BeautifulSoup(html, "html.parser")
        # Prefer explicit abstract/conclusion containers
        abstract_nodes = []
        for sel in [
            {'name': 'section', 'attrs': {'id': re.compile('abstract', re.I)}},
            {'name': 'div', 'attrs': {'class': re.compile('abstract', re.I)}},
            {'name': 'div', 'attrs': {'id': re.compile('abstract', re.I)}},
        ]:
            abstract_nodes += soup.find_all(sel['name'], attrs=sel['attrs'])
        for node in abstract_nodes:
            txt = node.get_text(" ", strip=True)
            if txt:
                sections.append(("abstract", txt))

        conclusion_nodes = []
        for header in soup.find_all(["h1", "h2", "h3", "strong"]):
            hn = (header.get_text(" ", strip=True) or "").lower()
            if any(key in hn for key in ["conclusion", "conclusions"]):
                texts = []
                for sib in header.next_siblings:
                    if getattr(sib, "name", None) in ["h1", "h2", "h3", "strong"]:
                        break
                    texts.append(getattr(sib, "get_text", lambda **k: str(sib))(" ", strip=True))
                sec_text = " ".join([t for t in texts if t]).strip()
                if sec_text:
                    sections.append(("conclusion", sec_text))
        # Fallback: entire article text
        if not sections:
            body_text = soup.get_text("\n")
            sections.append(("fulltext", body_text))
    else:
        # Fallback to plain text conversion
        from .validate_quotes import html_to_text  # type: ignore
        sections.append(("fulltext", html_to_text(html)))

    targets = [peptide.lower()]
    if peptide.lower() in PEPTIDE_SYNONYMS:
        targets += [t.lower() for t in PEPTIDE_SYNONYMS[peptide.lower()]]

    sentences_ranked: List[tuple[str, float, str]] = []
    for section_name, text in sections:
        # If fulltext and positive_only, skip to avoid noise; we want Abstract/Conclusions
        if section_name == "fulltext" and positive_only:
            continue
        # Split into sentences
        sents = re.split(r"(?<=[.!?])\s+", text)
        for s in sents:
            s_clean = strip_citations(s)
            sl = s_clean.lower()
            if not sl or len(s_clean) < 60 or len(s_clean) > 350:
                continue
            # filter out navigation/boilerplate/noise
            noise_terms = [
                "skip to main content",
                "official website",
                "view in nlm catalog",
                "add to search",
                "open in a new tab",
                "figure",
                "table",
                "supplementary",
                "copyright",
                "license",
                "click here",
                "journal list",
                "pmc",
            ]
            if any(t in sl for t in noise_terms):
                continue
            if not any(t in sl for t in targets):
                continue
            # Exclude mechanistic/assay-heavy sentences
            if any(t in sl for t in EXCLUDE_TERMS):
                continue
            # Exclude animal contexts
            if any(t in sl for t in ANIMAL_TERMS):
                continue
            # Positivity scoring
            score = 0.0
            for k, w in KEYWORD_WEIGHTS.items():
                if k in sl:
                    score += w
            # Require clear benefit terms for marketing value
            if not any(bt in sl for bt in BENEFIT_TERMS):
                continue
            # Boost sentences mentioning RCT/meta-analysis/systematic review
            if any(tag in sl for tag in ["randomized", "double-blind", "placebo-controlled", "meta-analysis", "systematic review", "trial"]):
                score += 0.8
            # Boost human clinical context (patients, participants, adults)
            if any(tag in sl for tag in ["patients", "participants", "adults", "men", "women", "human"]):
                score += 0.5
            # Prefer quantified outcomes
            if re.search(r"\b\d+\s?%|\b(p\s?<\s?0\.[0-9]+)\b", sl):
                score += 0.5
            if positive_only and score <= 0:
                continue
            # Lightly prefer Abstract/Conclusion
            if any(tag in section_name for tag in ["abstract", "conclusion", "conclusions"]):
                score += 0.7
            sentences_ranked.append((s_clean, score, section_name))

    sentences_ranked.sort(key=lambda t: t[1], reverse=True)
    # Return top 2 from strong sections, then more if needed
    return sentences_ranked[:5]
