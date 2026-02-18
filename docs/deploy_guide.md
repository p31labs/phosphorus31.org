# P31 Labs — Dual-Domain Deploy Guide

**P31 Labs, Inc. · Sovereign Stack Deployment**

## Architecture

Two domains. Two purposes. One organism.

| Domain | Source | Build | Purpose |
|--------|--------|-------|---------|
| **phosphorus31.org** | `website/` submodule | None (static HTML) | Corporate nonprofit face |
| **p31ca.org** | `ui/` (Vite/React) | `cd ui && npm install && npm run build` | The living product suite |

---

## phosphorus31.org (Static Site)

The `website/` submodule deploys to GitHub Pages or Cloudflare Pages with zero build step. Push to `github.com/p31labs/phosphorus31.org` and the site updates.

- CNAME: `phosphorus31.org`
- JSON-LD structured data included
- Print stylesheet included (`Ctrl+P` produces legal-packet-ready output)
- No JS, no build step, no dependencies

---

## p31ca.org (Vite App)

### Step 1: Verify the build locally

```bash
bash scripts/verify_build.sh
```

Or manually:

```bash
npm run buildd ui
# Expected: dist/ with index.html, assets/, apps/, _redirects, _headers
```

**If the build fails:**

| Error | Fix |
|-------|-----|
| `Cannot find module 'three'` | `npm install three` |
| `gsap not found` | `npm install gsap` |
| `Tone is not defined` | `npm install tone` |
| TypeScript errors blocking build | Fix TS or use `tsc --noEmit` only for check |
| Vite OOM / chunk size | `chunkSizeWarningLimit: 2000` in vite.config.ts |

**Confirm Greenhouse apps in output:**

```bash
ls ui/dist/apps/
# Should list: entangled-buffer.html, breathing-pacer.html, content-forge.html, etc.
```

Vite copies `public/` to `dist/` automatically. If `dist/apps/` is empty, ensure `ui/public/apps/` exists.

---

### Step 2: Config files (already in repo)

These live in `ui/public/` and are copied to `dist/` on every build:

- **`ui/public/_redirects`** — SPA fallback: `/*` to `/index.html` 200; `/apps/*` stays as real files.
- **`ui/public/_headers`** — Security headers (CSP, HSTS, cache) and per-path rules.
- **`ui/public/CNAME`** — `p31ca.org`

No extra step; they ship with the build.

---

### Step 3: Connect repo to Cloudflare Pages

1. **Cloudflare Dashboard** > Workers & Pages > Create Application > **Pages**
2. Connect GitHub and select the P31 monorepo
3. Build configuration:

| Setting | Value |
|---------|--------|
| **Framework preset** | None (Vite — manual) |
| **Build command** | `cd ui && npm install && npm run build` |
| **Build output directory** | `ui/dist` |
| **Root directory** | `/` (repo root) |
| **Node.js version** | `20` |

4. Save and Deploy

---

### Step 4: Environment variables (optional)

Pages > Settings > Environment Variables:

| Variable | Value | Notes |
|----------|-------|-------|
| `NODE_ENV` | `production` | Vite reads this |
| `VITE_BACKEND_URL` | your backend URL | Only if UI calls an API |
| `VITE_SHELTER_URL` | your Shelter URL | Only if Buffer log is live |

All `VITE_*` vars are baked into the client bundle — no secrets.

---

### Step 5: Custom domain

1. Pages > your project > **Custom Domains** > Set up a custom domain
2. Enter: `p31ca.org`
3. Cloudflare will create the CNAME if DNS is already on Cloudflare. Activate.
4. Add `www.p31ca.org` > same project.
5. SSL is automatic (Universal SSL).

**DNS created:**

```
CNAME  p31ca.org      <project>.pages.dev
CNAME  www.p31ca.org  <project>.pages.dev
```

---

### Step 6: Verify deploy

```bash
# SPA routing
curl -I https://p31ca.org/dashboard
# Expect: 200

# Greenhouse app
curl -I https://p31ca.org/apps/content-forge.html
# Expect: 200, Content-Type: text/html

# Security headers
curl -I https://p31ca.org | grep -i "x-frame\|content-security\|x-content"
```

---

### Step 7: Lock deploy branch

Pages > Settings > Builds & Deployments:

- **Production branch:** `main` (or your stable branch)
- **Preview branches:** enable for `dev` or `feature/*` if you want QA before main
- **Build watch paths:** `ui/**` — so changes outside `ui/` don't trigger rebuilds

---

## Rollback

Pages > Deployments > select last good deploy > **Rollback to this deployment**. One click.

---

## Post-deploy checklist

- [ ] phosphorus31.org loads with molecule annotation and print stylesheet
- [ ] p31ca.org resolves with valid SSL
- [ ] All UI routes render (no blank SPA pages)
- [ ] `/apps/breathing-pacer.html` loads
- [ ] `/apps/content-forge.html` loads
- [ ] `/apps/entangled-buffer.html` loads
- [ ] No console errors from CSP blocking Three.js or Tone.js
- [ ] phosphorus31.org links to p31ca.org (identity grid, codebase section)
- [ ] Cloudflare Analytics shows traffic on both domains

---

## Blocker: CSP

If the app breaks after deploy, **CSP in `_headers`** is the first place to check. The policy includes `'unsafe-eval'` for Three.js shader compilation. If you add a stricter CSP elsewhere (meta tag, server), it can conflict. Run `scripts/verify_build.sh` locally first; fix any CSP issues before pushing.

---

## OPSEC

- The Pages URL (`<project>.pages.dev`) is public. Don't put secrets in the build output.
- Shelter and GENESIS_GATE run separately; the UI calls them via `VITE_*` URLs (visible in the bundle). Acceptable for public nonprofit use.
- Enable **Cloudflare Bot Fight Mode** (free) to reduce scrapers.

---

*P31 Labs, Inc. · phosphorus31.org · p31ca.org · Georgia 501(c)(3)*
