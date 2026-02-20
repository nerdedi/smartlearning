# Visual asset gallery — Smart Learning for Independence

This document lists the visual assets required for the SmartLearning UI and game feature. Deliverables should follow the filenames and sizes in the repository so they can be dropped into `/assets/` and immediately verified.

## Priority assets

- **App icons & favicons**
  - `assets/icons/icon.svg` (master vector)
  - `assets/icons/icon-192x192.png`, `assets/icons/icon-512x512.png`
  - `assets/icons/favicon.ico` (multi-size)

- **UI icon set** (24px baseline, provide 48px @2x PNG)
  - `assets/icons/icon-play.svg`, `icon-pause.svg`, `icon-settings.svg`, `icon-help.svg`, `icon-export.svg`, `icon-badge.svg`, `icon-star.svg`, etc.

- **World illustrations & thumbnails**
  - `assets/illustrations/world-town-thumb.png` (320×180)
  - `assets/illustrations/world-banking-thumb.png` (320×180)
  - `assets/illustrations/world-privacy-thumb.png` (320×180)
  - `assets/illustrations/world-jobs-thumb.png` (320×180)

- **Badges & stars**
  - `assets/badges/badge-bronze.svg`, `badge-silver.svg`, `badge-gold.svg` (256×256)
  - `assets/badges/star-1.svg`, `star-2.svg`, `star-3.svg` (64×64)

- **Sprites**
  - `assets/sprites/player-sprite.png` (64×64 frames + `player-sprite.json`)
  - `assets/sprites/enemy-1.png`

- **Animations** (Lottie JSON + PNG fallback)
  - `assets/animations/loading-owl.json` + `loading-owl.png`
  - `assets/animations/level-complete.json`

## Naming & format rules

- SVGs: editable layers, exported with viewBox
- PNG/WebP: WebP preferred + PNG fallback; optimize <200KB (hero), <50KB (icons)
- Sprites: PNG atlas + JSON frame map
- Lottie: export JSON (Bodymovin) + static PNG fallback

## Where to drop files

- `assets/icons/` — app & UI icons
- `assets/illustrations/` — world art & thumbnails
- `assets/badges/` — badges & stars
- `assets/sprites/` — game sprite sheets
- `assets/animations/` — Lottie JSON + fallbacks

## Acceptance checklist

- Filenames match the spec
- SVGs are optimized (no embedded raster data)
- Contrast: text-on-surface meets WCAG AA
- `prefers-reduced-motion` alternatives provided for animations
- Provide retina (2×) exports for UI icons and screenshots

---

When assets are ready, add them to `/assets/` and ping me — I will integrate and open a PR with the wiring and updated previews.
