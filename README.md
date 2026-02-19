# Smart Learning for Independence 🎓

[![CI](https://github.com/nerdedi/smartlearning/actions/workflows/ci.yml/badge.svg)](https://github.com/nerdedi/smartlearning/actions/workflows/ci.yml) [![Lighthouse CI](https://github.com/nerdedi/smartlearning/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/nerdedi/smartlearning/actions/workflows/lighthouse.yml) [![Icons regenerate](https://github.com/nerdedi/smartlearning/actions/workflows/icons-regenerate.yml/badge.svg)](https://github.com/nerdedi/smartlearning/actions/workflows/icons-regenerate.yml)

> Interactive digital skills training modules for adults and youth with disabilities

**A Windgap Foundation Project** — Part of the LLND & Transition program, funded by Transurban Community Grants.

## Overview

Smart Learning for Independence is a Progressive Web App (PWA) delivering 24 interactive learning modules across four life-skill strands. Designed with Universal Design for Learning (UDL) principles, it provides accessible, self-paced digital skills training.

### Key Features

- **📱 Progressive Web App** — Install on any device, works offline
- **♿ UDL-First Design** — High contrast mode, large text, speak-aloud functionality
- **🎯 24 Interactive Modules** — Covering digital, financial, community, and work skills
- **📊 Portfolio Building** — Learners document achievements with photos and reflections
- **👩‍🏫 Educator Dashboard** — Track progress, export reports, manage content
- **📹 Media Support** — Upload images, videos, and YouTube content

## Curriculum Structure

### Strand 1: Digital Foundations (Modules 1-6)

| #   | Module           | Skills                                |
| --- | ---------------- | ------------------------------------- |
| 1   | Device Basics    | Power on, charge, volume, brightness  |
| 2   | Touch & Navigate | Tap, swipe, scroll, pinch-zoom        |
| 3   | Internet Safety  | Passwords, phishing, privacy settings |
| 4   | Email Basics     | Compose, reply, attachments           |
| 5   | Video Calls      | Join, mute, camera, etiquette         |
| 6   | Smart Searching  | Browser, keywords, reliable sources   |

### Strand 2: Financial Independence (Modules 7-12)

| #   | Module           | Skills                               |
| --- | ---------------- | ------------------------------------ |
| 7   | Money Awareness  | Notes, coins, card types             |

| 9   | Budgeting        | Income/expenses, pay yourself first  |
| 10  | Safe Payments    | Tap-to-pay, receipts, scam detection |
| 11  | Shopping Smart   | Compare prices, needs vs wants       |
| 12  | Opal & Transport | Top-up, tap on/off, fare calculation |

### Strand 3: Community & Travel (Modules 13-18)

| #   | Module             | Skills                              |
| --- | ------------------ | ----------------------------------- |
| 13  | Trip Planning      | Apps, timetables, journey planning  |
| 14  | Transport Safety   | Stations, vehicles, emergencies     |
| 15  | Maps & Navigation  | GPS, directions, landmarks          |
| 16  | Community Services | Library, Medicare, Service NSW      |
| 17  | Social Skills      | Greetings, personal space, conflict |
| 18  | Emergency Response | 000, contacts, first aid basics     |

### Strand 4: Work Readiness (Modules 19-24)

```

| #   | Module            | Skills                                        |
| --- | ----------------- | --------------------------------------------- |
| 19  | Job Exploring     | Interest matching, local opportunities        |
| 20  | Workplace Skills  | Punctuality, teamwork, following instructions |
| 21  | Resume Building   | Personal details, skills, references          |
| 22  | Interview Prep    | Common questions, body language               |
| 23  | Workplace Safety  | Hazards, PPE, reporting injuries              |
| 24  | Your Independence | Goal setting, self-advocacy, celebration!     |

## Getting Started

### Quick Start

1. **Open** `index.html` in any modern browser
2. **Enter** your name to create a profile
3. **Choose** a module and start learning!

### Installation as PWA

1. Open the app in Chrome/Edge/Safari
2. Click "Install" when prompted (or use browser menu → "Add to Home Screen")
3. App will work offline once installed

### For Development

```bash
# Clone the repository
git clone https://github.com/your-org/smartlearning.git
cd smartlearning

# Start a local dev server (serves `src/`)
npm start        # runs a simple http-server at http://localhost:8000

# Useful dev scripts
npm run lint     # ESLint checks
npm test         # Run headless QUnit tests (requires Chromium libs locally)
npm run e2e      # Run Cypress end-to-end tests (CI/runner environment)
npm run lhci     # Run Lighthouse CI (uses temporary-public-storage)

# To run QUnit headless locally (Puppeteer), install required system libs on Debian/Ubuntu:
# sudo apt-get install -y libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0 libnss3 libxss1 libx11-xcb1 libxcomposite1 libasound2 libgbm1

# CI checks
- The repository includes CI checks that enforce linting, unit tests, and Lighthouse performance/accessibility thresholds.
- The CI also verifies that `assets/icons/favicon.ico` is generated from the source SVG; run `node tools/generate-favicon.mjs` after updating the logo.

# Open http://localhost:8000
```

## Architecture

```text
learning/
├── index.html          # Main entry point
├── manifest.json       # PWA manifest
├── sw.js               # Service worker (offline support)
├── offline.html        # Offline fallback page
├── css/
│   └── styles.css      # All styles (UDL themes included)
├── js/
│   ├── app.js          # Core routing & rendering
│   ├── modules.js      # 24 module definitions & content
│   ├── storage.js      # LocalStorage abstraction
│   ├── media.js        # Media upload/gallery
│   ├── educator.js     # Educator dashboard
│   └── export.js       # CSV/PDF report generation
└── assets/
    └── icons/          # PWA icons (72-512px)
```

### Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+), CSS3 with custom properties
- **Storage**: LocalStorage (client-side persistence)
- **PWA**: Service Worker with cache-first strategy
- **No Build Step**: Runs directly in browser

## Accessibility Features

### Built-in Accommodations

- **🔲 High Contrast Mode** — Enhanced visibility for low vision
- **🔠 Large Text Mode** — 130% font scaling
- **🔊 Speak Aloud** — Text-to-speech using Web Speech API
- **⌨️ Keyboard Navigation** — Full keyboard accessibility
- **📱 Touch Friendly** — Large tap targets (min 44px)
- **🎨 Color Independence** — Never relies on color alone

### Technical Accessibility

- Semantic HTML5 structure
- ARIA labels on interactive elements
- Focus management and visible focus states
- Reduced motion support (`prefers-reduced-motion`)
- High contrast support (`prefers-contrast`)

## Educator Dashboard

### Access

1. Click "🔐 Educator Login" on welcome screen
2. Enter PIN: `2026`

### Features

- **📊 Overview Stats** — Total learners, modules completed, quiz scores
- **👤 Learner Details** — Individual progress, quiz history, portfolio
- **✅ Skills Checklist** — Baseline and post-assessment comparison
- **📥 Export Reports** — CSV for spreadsheets, PDF for acquittal

## Data Management

### Storage

All data is stored locally in the browser's LocalStorage:

- `sl_profiles` — Learner profiles and progress
- `sl_settings` — App settings (theme, text size)
- `sl_activeProfile` — Current active profile ID
- `sl_media_{profileId}` — Media library per profile

### Export Options

| Format | Contents             | Use Case             |
| ------ | -------------------- | -------------------- |
| CSV    | All learner progress | Spreadsheet analysis |
| PDF    | Summary report       | Print/acquittal      |
| JSON   | Complete backup      | Data migration       |

### Privacy

- No data leaves the device
- No external analytics
- No account creation required
- Learner can delete their profile anytime

## Assessment

### Skills Checklist

Administered at baseline and post-program:

- 24 skills mapped to NDIS goals
- 5-point confidence scale (1 = Not at all → 5 = Always)
- Automatic gain calculation

### Module Quizzes

- 3 questions per module
- Immediate feedback with explanations
- Retry available (score tracked)
- 80%+ required for completion badge

### Portfolio

- Photo upload capability
- Written reflections
- Mapped to NDIS evidence requirements

## Budget & Funding

| Item                       | Amount      |
| -------------------------- | ----------- |
| Transurban Community Grant | $10,000     |
| Windgap Internal           | $5,000      |
| **Total**                  | **$15,000** |

### Allocation

- App Development & Design: 45%
- Content Creation: 25%
- Training Materials: 15%
- Evaluation & Reporting: 15%

## Timeline

| Phase    | Dates        | Deliverables                  |
| -------- | ------------ | ----------------------------- |
| Build    | Jan–Feb 2026 | App v1.0, content complete    |
| Pilot    | Mar–Apr 2026 | User testing with 10 learners |
| Rollout  | May–Jul 2026 | Full deployment, 50 learners  |
| Evaluate | Aug 2026     | Impact report, acquittal      |

## Contributing

### Development Guidelines

1. **No Build Tools** — Keep it simple, no npm/webpack
2. **UDL First** — Every feature must be accessible
3. **Mobile First** — Design for phones, enhance for desktop
4. **Offline First** — App must work without internet

### Code Style

- Use `const`/`let`, no `var`
- ES6+ features (arrow functions, template literals)
- Descriptive function names
- Comment complex logic

## License

© 2026 Windgap Foundation. All rights reserved.

This project was developed with funding from Transurban Community Grants for use in Windgap Foundation disability programs.

## Contact

**Windgap Foundation**
LLND & Transition Program
[windgap.org.au](https://windgap.org.au)

---

### Built with ❤️ for the Windgap community
