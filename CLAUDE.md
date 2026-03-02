# CLAUDE.md — FLWmap

## What This App Does
Interactive map exploring 37 Frank Lloyd Wright buildings across the United States. Features include:
- Searchable/filterable Mapbox GL map with circular image markers
- Filter by architectural style (Prairie, Usonian, Textile Block, Organic, Other)
- Filter by era (Early 1887-1909, Mid 1910-1935, Late 1936-1959)
- Filter by UNESCO World Heritage designation and public tour availability
- Virtual time lapse animation showing buildings chronologically
- Detailed popups with building info, badges, and photos

## Tech Stack
Plain HTML/CSS/JS (single-file app), no build step, Cloudflare Workers
- External: Mapbox GL JS v3.4.0 (CDN), Google Fonts (Playfair Display, Josefin Sans, DM Sans)

## Domain
flwmap.devlab502.net (custom domain on Workers)

## Build & Deploy
- No build step — static HTML served by Worker via `@cloudflare/kv-asset-handler`
- Deploys via GitHub Actions → `wrangler deploy` on push to main
- Worker entry point: `worker.js`
- Static files served from `public/` directory

## Environment Variables
None required (Mapbox access token is hardcoded as a public client-side token)

## Database Needs
Current: none — all building data is hardcoded in a JS array (BUILDINGS, 37 entries)

## Image Storage
Building images served from ArchDaily CDN (images.adsttc.com) — no local images or R2 storage needed

## Contact
devlab502@proton.me
