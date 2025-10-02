Project housekeeping summary

- Created `archive/` to store nonessential legacy files, tests, builds, and large image assets that are no longer needed at runtime.
- Production‑relevant files now live primarily in `index.html`, `public/` (logo + icons), and `src/{css,js,styles}`.

Archive structure

- `archive/reference-assets` – Original heavy images and working design assets
- `archive/legacy-react` – Old React/HeadlessUI marquee + helpers not used in the vanilla build
- `archive/tests-debug` – Playwright configs, reports, and dev utilities
- `archive/build/dist` – Previous built output
- `archive/docs` – Notes, workspace files, agent/debug docs
- `archive/logs` – Local dev logs

Restoring any file is as simple as moving it back to its original path.

