# CLAUDE.md — ChordPetals

## What is this?
ChordPetals is a single-page music web app for visualizing and exploring chord progressions. Built as a self-contained `index.html` with no external dependencies.

## Architecture
- **Single file:** `index.html` (~41KB) — all HTML, CSS, and JS inline
- **No build step:** Just serve the file
- **Mobile-first:** Designed for phone screens (max-width 500px viewport)

## Running locally
```bash
python3 -m http.server 8888
# or
npx serve .
```

## Deploying (quick tunnel)
```bash
cloudflared tunnel --url http://localhost:8888
```
This gives a temporary `*.trycloudflare.com` URL. Note: URL changes each restart.

## Design
- Dark theme with color-coded chord types (major, minor, dim, aug, dom7, etc.)
- SF Pro Display / system font stack
- Japandi-influenced minimal UI
