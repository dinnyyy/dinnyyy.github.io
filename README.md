# dinnyyy.github.io

Personal portfolio site for **Joshua Dinn** — a second résumé covering projects,
experience, and certifications. Built as a single scrollable page with anchored
navigation.

**Live:** https://dinnyyy.github.io/

## Stack

Plain static HTML, CSS, and vanilla JavaScript — no build step, no dependencies.
Served directly by GitHub Pages from the `main` branch (user site).

## Structure

```
.
├── index.html            # The whole site (single page, anchored sections)
├── css/styles.css        # Design tokens + layout (dark-first, light toggle)
├── js/main.js            # Theme toggle, mobile nav, smooth scroll, scrollspy
├── assets/
│   ├── img/              # Project placeholder art (SVG) + photos
│   ├── resume/           # Downloadable résumés (software / analyst)
│   ├── certs/            # Certificate PDFs + images
│   └── projects/         # Project supporting files (e.g. GARCH report PDF)
└── .nojekyll             # Serve files as-is (skip Jekyll processing)
```

## Editing content

All content lives in `index.html`, grouped by `<section>`. Search for the section
id (`#about`, `#experience`, `#projects`, `#certifications`, `#contact`) to jump to it.

### Swapping placeholder images

Project cards use SVG placeholders in `assets/img/`. To use a real screenshot,
drop the image into `assets/img/` and update the `src` on that card's `<img>`.

## Local preview

Any static server works, e.g.:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/.
