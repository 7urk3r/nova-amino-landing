#!/usr/bin/env python3
"""
Promote curated quotes from staging to final, with extra marketing-value checks.

Reads:
  - src/data/peptide-quotes.staging.json
  - src/data/peptide-quotes.final.json (created if missing)

Writes:
  - updated src/data/peptide-quotes.final.json (appends non-duplicates)
  - updated src/data/peptide-quotes.staging.json (removes promoted + prunes weak)

Rules:
  - Only benefit-focused sentences; reject negatives and speculative language.
  - No duplicates (same peptide + quote text) in final.
  - Cap promotions per run if desired (default unlimited here).
"""
from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any, Dict, List

DATA_DIR = Path('src/data')
STAGING = DATA_DIR / 'peptide-quotes.staging.json'
FINAL = DATA_DIR / 'peptide-quotes.final.json'

NEGATIVE_TERMS = [
    'hindered', 'lack evidence', 'not statistically significant', 'no significant',
    'may be', 'may', 'potential to', 'in mice', 'mouse', 'mice', 'rat', 'fish',
    'aquafeeds', 'in vitro', 'in vivo imaging', 'liposomes would become accessible',
]

ANIMAL_TERMS = [
    ' rat', ' rats', ' mouse', ' mice', ' murine', ' hamster', ' guinea pig',
    ' rabbit', ' canine', ' feline', ' porcine', ' ovine', ' bovine', ' primate',
    ' avian', ' chicken', ' zebrafish', ' fish', ' yak', ' yaks', ' sprague-dawley', ' c57bl/6',
]

def load_json(p: Path) -> Dict[str, Any]:
    if not p.exists():
        return {'metadata': {}, 'quotes': []}
    return json.loads(p.read_text(encoding='utf-8'))

def is_negative(q: str) -> bool:
    s = q.lower()
    if any(t in s for t in NEGATIVE_TERMS):
        return True
    if any(t.strip() in s for t in ANIMAL_TERMS):
        return True
    return False

def main() -> int:
    staging = load_json(STAGING)
    final = load_json(FINAL)

    s_quotes: List[Dict[str, Any]] = staging.get('quotes', [])
    f_quotes: List[Dict[str, Any]] = final.get('quotes', [])

    # Build dedupe set
    seen = set((q.get('peptide_name',''), (q.get('quote','') or '').strip()) for q in f_quotes)

    promoted: List[Dict[str, Any]] = []
    kept_staging: List[Dict[str, Any]] = []

    for q in s_quotes:
        pep = q.get('peptide_name','')
        qt = (q.get('quote') or '').strip()
        if not qt or is_negative(qt):
            continue
        key = (pep, qt)
        if key in seen:
            # already in final; drop from staging
            continue
        # Enforce allowed peptide list
        if ALLOWED and pep not in ALLOWED:
            continue
        # Promote
        nq = dict(q)
        nq['verification_status'] = 'Approved - Benefit-focused'
        promoted.append(nq)
        seen.add(key)

    # Append promoted to final with new ids continuing sequence
    next_id = 1
    if f_quotes:
        # IDs may be arbitrary; preserve existing and append without reindexing
        next_id = max((int(q.get('id',0)) for q in f_quotes if isinstance(q.get('id'), int)), default=0) + 1
    for q in promoted:
        if 'id' not in q or not isinstance(q['id'], int):
            q['id'] = next_id
            next_id += 1
        f_quotes.append(q)

    # Write final and staging (staging cleared of promoted and negatives)
    final['quotes'] = f_quotes
    FINAL.write_text(json.dumps(final, indent=2), encoding='utf-8')

    # Keep only non-promoted and non-negative in staging
    # Note: Since we promoted all positives, we clear staging to keep it lean
    staging['quotes'] = []
    STAGING.write_text(json.dumps(staging, indent=2), encoding='utf-8')

    print(f'Promoted {len(promoted)} quotes. Final now has {len(f_quotes)} quotes.')
    return 0
ALLOWED = set()
try:
    comp = json.loads((DATA_DIR / 'peptide-compounds.json').read_text(encoding='utf-8'))
    ALLOWED = {p['name'] for p in comp.get('peptides', [])}
except Exception:
    ALLOWED = set()

if __name__ == '__main__':
    raise SystemExit(main())
