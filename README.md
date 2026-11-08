# Sword Ekel · portfolio

Live at **https://swordekel.arswordlab.com**

A static site with no framework and no dependencies. `bangun.mjs` assembles `src/` into `public/`, and `public/` is committed because the host runs no build step.

## What is where

| Path | What it holds |
|---|---|
| `src/data.mjs` | Profile, experience, and the 18 sites on arswordlab.com, each with an honest label (product, client, proposal, concept, course project) |
| `src/arah/personal/` | The page that ships: markup in `halaman.mjs`, plus `gaya.css`, `main.js`, `ikon.svg` |
| `src/arah/{laporan,gambar,boarding,standar}/` | Four earlier design directions, kept as source only |
| `src/js/suara.js` | UI sounds synthesized with the Web Audio API (no audio files), with a mute toggle that is remembered |
| `src/js/ping.js` | Checks from the visitor's browser that each site is up, shown as "Live · 45 ms from you" |
| `src/_headers` | Security headers (strict Content-Security-Policy, HSTS, no framing) and long caching for versioned files |
| `worker/index.js` | Answers byte-range requests for the project videos (Safari only plays video served as 206 Partial Content) |
| `alat/` | Tools: site captures (`tangkap.py`), images (`media.py`), screen recordings (`rekam.py`, `video_ada.py`), share image and icons (`ikon_og.py`), header check (`periksa.py`) |
| `sumber/uji-*` | Checks: smoothness and load (`uji-personal/kinerja.py`), Safari engine (`uji-personal/webkit.py`), sound levels (`uji-suara/`) |

## Build and deploy

```bash
node bangun.mjs
python -I -X utf8 alat/ikon_og.py   # only when the first screen changes
git push origin main
node ../arsword-pos/node_modules/wrangler/bin/wrangler.js deploy
```

The build drops media files that the page does not reference. `alat/media.py` recreates them when they are needed again.

The old address, sword-portfolio.vercel.app, only redirects here: `vercel.json` sends every path (the CV link included) to the same path on swordekel.arswordlab.com with a permanent 308.

## Earlier directions

`node bangun.mjs gambar` builds one earlier direction into `public/gambar/` for a local look; do not commit that output. Their fonts left `public/font/` at release, so restore them first with `git checkout e886c86 -- public/font/gambar` (or the direction's own name).
