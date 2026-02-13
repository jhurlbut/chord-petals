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

## Deploying to Cloudflare Pages

**Live URL:** https://chord-petals.pages.dev

Deploys via `wrangler pages deploy` (NOT auto-deploy from GitHub — must be run manually after each push).

```bash
# Requires CLOUDFLARE_API_TOKEN env var
export CLOUDFLARE_API_TOKEN="<token>"
npx wrangler pages deploy . --project-name=chord-petals
```

- **Account ID:** `e4c92c46f0e895a2e1729342186cf594`
- **Project:** `chord-petals`
- Wrangler auto-detects git branch/commit from the repo
- No build step — deploys the directory as-is

**Important:** After every `git push`, also run the wrangler deploy command above to update the live site. GitHub pushes alone do NOT update `chord-petals.pages.dev`.

### Quick tunnel (alternative, temporary)
```bash
cloudflared tunnel --url http://localhost:8888
```
This gives a temporary `*.trycloudflare.com` URL. Note: URL changes each restart.

## Design
- Dark theme with color-coded chord types (major, minor, dim, aug, dom7, etc.)
- SF Pro Display / system font stack
- Japandi-influenced minimal UI
