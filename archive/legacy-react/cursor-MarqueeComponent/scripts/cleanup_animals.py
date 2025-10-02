#!/usr/bin/env python3
from __future__ import annotations
import json, re
from pathlib import Path

DATA = Path('src/data')
FINAL = DATA / 'peptide-quotes.final.json'
STAGING = DATA / 'peptide-quotes.staging.json'

ANIMAL_TERMS = [
    ' rat', ' rats', ' mouse', ' mice', ' murine', ' hamster', ' guinea pig',
    ' rabbit', ' canine', ' feline', ' porcine', ' ovine', ' bovine', ' primate',
    ' avian', 'avian', ' chicken', 'chicken', ' zebrafish', ' fish', ' yak', ' yaks',
    ' sprague-dawley', ' c57bl/6', ' in rats', ' in mice', ' in yaks',
]

def cleanse_file(path: Path) -> int:
    if not path.exists():
        return 0
    j = json.loads(path.read_text(encoding='utf-8'))
    if 'quotes' not in j:
        return 0
    before = len(j['quotes'])
    def is_animal(q):
        s = (q.get('quote') or '').lower()
        return any(term in s for term in ANIMAL_TERMS)
    j['quotes'] = [q for q in j['quotes'] if not is_animal(q)]
    after = len(j['quotes'])
    if after != before:
        path.write_text(json.dumps(j, indent=2), encoding='utf-8')
    print(f"Cleaned {path}: removed {before-after} animal-context quotes")
    return before - after

def main() -> int:
    removed = 0
    removed += cleanse_file(FINAL)
    removed += cleanse_file(STAGING)
    print('Total removed:', removed)
    return 0

if __name__ == '__main__':
    raise SystemExit(main())
