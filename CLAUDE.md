# CLAUDE.md — ChordPetals

## What is this?
ChordPetals is an interactive chord progression visualizer and explorer. Tap petals to hear chords, navigate between keys, and explore music theory relationships — all in the browser.

## Architecture
- **Single file:** `index.html` — all HTML, CSS, and JS inline (~85KB)
- **No build step, no bundler, no framework** — just serve the file
- **Mobile-first:** Designed for phone screens, works on desktop too
- **Audio engines:**
  - **Web Audio** — built-in Tone.js-style synths (Warm, Bright, Pad, Keys, Pluck, Organ)
  - **SuperSonic** — Sonic Pi's scsynth compiled to WASM via AudioWorklet (Prophet, Blade, Dark Ambience, Piano, Pretty Bell)
- **AI Improvisation:** Magenta.js (MelodyVAE / ImprovRNN) generates melodies over chord changes
- **MIDI:** WebMIDI input/output + Bluetooth MIDI support

## Key Features
- Chord petal visualization with diatonic, circle of 5ths, relative/parallel, tritone sub, and modal interchange views
- Tap to play chords, double-tap to navigate, long-press to cycle voicing extensions (7th, 9th, 13th)
- Drag petals to reorder, swipe center to change scale type
- Voicing modes: close, open, spread
- Phrasing: block, strum, arpeggio
- SuperSonic FX: reverb (convolver) and delay with feedback
- Multi-palette support for saving chord progressions

## Files
- `index.html` — the entire app
- `_headers` — Cloudflare Pages headers (COOP/COEP for SharedArrayBuffer)
- `coi-serviceworker.js` — fallback cross-origin isolation for non-Cloudflare hosting
- `dist/` — SuperSonic WASM binaries and AudioWorklet files
- `MAGENTA-NOTES.md` — notes on Magenta.js integration

## Running Locally
```bash
python3 -m http.server 8888
# or
npx serve .
```
Note: SuperSonic requires SharedArrayBuffer, which needs COOP/COEP headers. The `coi-serviceworker.js` handles this automatically for local dev.

## Deploying to Cloudflare Pages

**Live URL:** https://chord-petals.pages.dev

Deploys via `wrangler pages deploy` — **NOT auto-deploy from GitHub**. Must run manually after each push.

```bash
export CLOUDFLARE_API_TOKEN="<token>"
npx wrangler pages deploy . --project-name=chord-petals
```

- **Account ID:** `e4c92c46f0e895a2e1729342186cf594`
- **Project:** `chord-petals`
- No build step — deploys the directory contents as-is
- Wrangler auto-detects git branch/commit from the repo

**After every `git push`, also run the wrangler deploy to update the live site.**

### GitHub Pages (alternative)
The repo also deploys to https://jhurlbut.github.io/chord-petals/ via GitHub Pages (auto-deploy on push). However, GitHub Pages doesn't support custom `_headers`, so SuperSonic may not work there (no SharedArrayBuffer without COOP/COEP).

## Design
- Dark theme with color-coded chord types (major=pink, minor=cyan, dim=dark blue, aug=gold, dom7=coral)
- SF Pro Display / system font stack
- Japandi-influenced minimal UI
- Full-screen settings panels (voicing, AI improv, MIDI)

## iOS Notes
- SuperSonic takes ~20 seconds to fully warm up after init
- AudioContext gets killed when backgrounding the tab — app auto-reinitializes on return
- The mute switch on iPhone silences Web Audio output
- Center chord tap uses touchend (not click) for reliability
