#!/usr/bin/env python3
"""
Normalize 'scientist' to the first author name for every quote in the
staging and final quote files.

Targets:
  - src/data/peptide-quotes.final.json
  - src/data/peptide-quotes.staging.json

Logic:
  - If 'scientist' is a placeholder (e.g., 'Study authors', 'Review authors',
    'Systematic review authors', 'Meta-analysis authors', 'SURMOUNT-1 investigators',
    empty, or None), try to fetch the source URL and extract the first author
    from meta tags (citation_author) or page author blocks (PMC pages).
  - If 'scientist' contains a comma-separated author list, trim to the first
    author.
  - Write updated files in place.
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Dict, List, Optional

DATA_DIR = Path('src/data')
FILES = [DATA_DIR / 'peptide-quotes.final.json', DATA_DIR / 'peptide-quotes.staging.json']

PLACEHOLDERS = {
    'study authors', 'review authors', 'systematic review authors',
    'meta-analysis authors', 'surmount-1 investigators', 'peer-reviewed clinical research',
    'peer-reviewed journal', 'peer-reviewed journal review', 'authors', 'author',
}

try:
    from bs4 import BeautifulSoup  # type: ignore
except Exception:
    BeautifulSoup = None  # type: ignore

try:
    # stdlib HTTP
    import urllib.request as urllib_request
except Exception:
    urllib_request = None  # type: ignore

UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)


def fetch(url: str) -> Optional[str]:
    if not urllib_request:
        return None
    try:
        req = urllib_request.Request(url, headers={'User-Agent': UA})
        with urllib_request.urlopen(req, timeout=30) as resp:
            data = resp.read()
        try:
            return data.decode('utf-8', errors='ignore')
        except Exception:
            return data.decode('latin-1', errors='ignore')
    except Exception:
        return None


def extract_first_author_from_html(html: str) -> Optional[str]:
    if not BeautifulSoup or not html:
        return None
    soup = BeautifulSoup(html, 'html.parser')
    # Prefer meta citation_author tags (common across publishers/PMC)
    metas = soup.find_all('meta', attrs={'name': re.compile('^citation_author$', re.I)})
    names: List[str] = []
    for m in metas:
        content = (m.get('content') or '').strip()
        if content:
            names.append(content)
    if names:
        return names[0]
    # PMC structured author list fallback
    # Look for class patterns in PMC pages
    for sel in [
        {'name': 'span', 'attrs': {'class': re.compile('^name', re.I)}},
        {'name': 'a', 'attrs': {'class': re.compile('^full-name', re.I)}},
        {'name': 'span', 'attrs': {'class': re.compile('^citation-author', re.I)}},
    ]:
        node = soup.find(sel['name'], attrs=sel['attrs'])
        if node:
            t = node.get_text(' ', strip=True)
            if t:
                return t
    # Some pages list authors as "Author1, Author2, ..."
    # Try to grab a candidate block
    cand = soup.find(string=re.compile(r".+,\s*.+,\s*.+"))
    if cand:
        txt = str(cand)
        # split by commas and join first two tokens to form a name if possible
        parts = [p.strip() for p in txt.split(',') if p.strip()]
        if parts:
            return parts[0]
    return None


def normalize_scientist(current: Optional[str], source_url: Optional[str]) -> Optional[str]:
    s = (current or '').strip()
    sl = s.lower()
    if not s or sl in PLACEHOLDERS:
        # need to fetch
        html = fetch(source_url) if source_url else None
        a = extract_first_author_from_html(html) if html else None
        return a or current
    # if the field already contains a list of authors, return first
    if ',' in s:
        first = s.split(',')[0].strip()
        # further trim any trailing roles
        return first
    return current


def process_file(path: Path) -> int:
    if not path.exists():
        return 0
    doc = json.loads(path.read_text(encoding='utf-8'))
    quotes = doc.get('quotes', [])
    changed = 0
    for q in quotes:
        before = q.get('scientist')
        after = normalize_scientist(before, q.get('source'))
        if after and after != before:
            q['scientist'] = after
            changed += 1
    if changed:
        path.write_text(json.dumps(doc, indent=2), encoding='utf-8')
    print(f"Updated {changed} quotes in {path}")
    return changed


def main() -> int:
    total = 0
    for f in FILES:
        total += process_file(f)
    print(f"Total updated: {total}")
    return 0


if __name__ == '__main__':
    raise SystemExit(main())

