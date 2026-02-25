# Asset gallery — integration notes

This file explains how to preview the asset gallery and how to integrate delivered visual assets into the project.

## Preview the gallery (local)

- The gallery preview page is at the repository root: `index.html` (editor preview or open in a browser).
- To preview with a local static server from the repository root (recommended):
  - `npx http-server -p 8080` (then open http://localhost:8080)
  - or `python -m http.server 8080` (if Python is available)

> Note: the app `npm start` serves the `./src` folder (dev server). The gallery page lives at the repo root for editor preview.

## Where to place delivered assets

- Put files under `assets/` using the filenames from `gallery.md`.
- Recommended folders:
  - `assets/icons/` — app & UI icons
  - `assets/illustrations/` — world illustrations + thumbnails
  - `assets/badges/` — badges & stars
  - `assets/sprites/` — sprite sheets + JSON
  - `assets/animations/` — Lottie JSON + static fallbacks

## Integration checklist (what I will do after you add assets)

- Add optimized WebP/PNG + SVG into `/assets/`
- Update cache list in `sw.js` if new assets are large or critical
- Wire thumbnails into `modules-data.js` and `src/modules-data.js` where appropriate
- Update `src/game/index.html` to use sprites / Lottie
- Add/adjust unit + e2e tests to verify image availability

## Quick commands

- Serve app (dev): `npm start` — serves `./src` on port 8000
- Preview gallery only: `npx http-server -p 8080` (open http://localhost:8080)
- Run unit tests: `npm test` (CI uses headless Puppeteer)
- Run e2e: `npx cypress open` or `npx cypress run`

If you upload assets I’ll integrate them, run the tests, and open a PR with changes.
