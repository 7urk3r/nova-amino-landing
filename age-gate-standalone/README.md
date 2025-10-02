# Age Gate (Standalone)

This folder contains a self‑contained, build‑free version of the Nova Amino age gate. Copy this folder into another project and open `index.html`.

## Contents
- `index.html` – HTML shell that links styles and script
- `styles.css` – All styles for the background, card, layout, and language switch
- `script.js` – Minimal JS for language toggle, vertical alignment, and scroll width matching

## Usage
- Open `index.html` directly in a browser, or serve via any static server.
- To integrate into an existing project, embed the `.age-gate` block and include `styles.css` and `script.js`.

## Notes
- No external dependencies. All visuals are CSS/SVG.
- The language switch mirrors the logo’s left inset on the right side and keeps vertical alignment to the logo.
- The scrollable text box edges match the white card edges exactly across resizes.
