# p31ca.org — Public Site (Landing + Scope)

**Repository:** [github.com/p31labs/p31ca.org](https://github.com/p31labs/p31ca.org)  
**Purpose:** Canonical public site for P31 Labs. Hosts the **landing** and the **P31 Scope** app.

---

## What Lives There

| Part | Description | Source in monorepo |
|------|-------------|--------------------|
| **Landing** | Static marketing/org site (phosphorus31.org). Hero, about, donate, node-one, docs links. | `website/` |
| **Scope** | P31 Scope — quantum-optimized dashboard (coherence, swarm, building, wallet bridge). | `ui/` (Vite build) |

Landing is static (no build). Scope is built with Vite; use a base path when served under a subpath (e.g. `/app/`).

---

## Deployment Model

- **Option A — Single repo (p31ca.org):** Build landing from `website/` and Scope from `ui/` in the main p31 repo; push built artifacts to p31ca.org (e.g. `main` or `gh-pages`). GitHub Pages (or Cloudflare Pages) serves:
  - `/` → landing (contents of `website/`)
  - `/app/` → Scope (contents of `ui/dist/` built with `VITE_BASE_PATH=/app/`)
- **Option B — Separate repos:** Landing at phosphorus31.org from one repo; Scope at p31ca.org/app/ or a subdomain from another. Both sources still live in the main p31 monorepo; each deployment repo gets the relevant build output.

**Recommended:** Single repo [p31ca.org](https://github.com/p31labs/p31ca.org): landing at root, Scope at `/app/`. One GitHub Actions workflow can build both from the main monorepo and deploy to p31ca.org.

---

## Build Commands (from p31 monorepo)

**Landing** (no build; copy `website/` as-is):
```bash
# Copy website/ to deployment root
cp -r website/* path/to/p31ca.org-deploy/
# Or rsync, etc.
```

**Scope** (for subpath `/app/`):
```bash
cd ui
VITE_BASE_PATH=/app/ npm run build
# Copy ui/dist/* to path/to/p31ca.org-deploy/app/
```

For Scope at root (e.g. if Scope is the only app at p31ca.org):
```bash
cd ui
VITE_BASE_PATH=/ npm run build
```

---

## SPA and 404

- **Landing:** Static HTML; no special routing.
- **Scope:** Single-page app. For GitHub Pages, copy `dist/index.html` to `dist/404.html` (or `app/404.html` in the deploy folder). For Cloudflare Pages, `ui/public/_redirects` already has `/* /index.html 200`; when deploying only the Scope subtree (e.g. `/app/`), ensure the host serves `app/index.html` for `app/*` routes.

---

## Links

- **Repo:** [github.com/p31labs/p31ca.org](https://github.com/p31labs/p31ca.org)
- **Landing source:** `website/` in main p31 repo
- **Scope source:** `ui/` in main p31 repo
- **Scope deployment details:** [ui/DEPLOYMENT.md](../ui/DEPLOYMENT.md) (GitHub Pages, Cloudflare Pages, base path, wallet graceful degradation)

---

*The mesh holds.* 🔺
