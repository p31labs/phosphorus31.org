# p31ca.org

**P31 Labs** — public site (landing + P31 Scope).

- **Landing:** Static site for phosphorus31.org / p31ca.org (about, donate, Node One, docs).
- **Scope:** [P31 Scope](https://github.com/p31labs/p31) — quantum-optimized dashboard (coherence, swarm, building, wallet). Served at `/app/` when both are deployed together.

Source for both lives in the main P31 monorepo:

- **Landing:** `website/`
- **Scope:** `ui/` (build with `VITE_BASE_PATH=/app/` for subpath, or `/` for root)

This repo is the **deployment target**: built artifacts are published here (e.g. via GitHub Actions from the main repo). GitHub Pages or Cloudflare Pages can serve the site from this repository.

## Deploy

- **Landing:** Copy contents of `website/` to the repo root (or the path that serves `/`).
- **Scope:** From monorepo: `cd ui && VITE_BASE_PATH=/app/ npm run build`; copy `ui/dist/*` to `app/` in this repo. See [ui/DEPLOYMENT.md](https://github.com/p31labs/p31/blob/main/ui/DEPLOYMENT.md) for base path, SPA fallback, and static hosts.

## Links

- **Monorepo (source):** [github.com/p31labs/p31](https://github.com/p31labs/p31)
- **Site:** phosphorus31.org · p31ca.org
- **Contact:** will@p31ca.org

Apache-2.0. The mesh holds. 🔺
