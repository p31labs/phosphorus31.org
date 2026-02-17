# phosphorus31.org — Cloudflare Pages Launch Checklist

Use this checklist when connecting the repo to Cloudflare Pages and going live. The actual Cloudflare connection is done manually in the dashboard.

---

## Pre-launch (this repo)

- [x] `index.html` loads correctly
- [x] Asset paths are relative (favicon, logos) so the site works from any base URL
- [x] `_headers` includes security headers (X-Frame-Options DENY, Content-Security-Policy, etc.)
- [x] `_redirects` configured (www → apex, favicon, guides → docs)
- [x] `CNAME` contains `phosphorus31.org`
- [x] `wrangler.toml` present for Cloudflare Pages (bucket = "./", no build)
- [x] No design or content changes — deployable as-is

---

## Cloudflare Dashboard (manual)

- [ ] Connect repo to Cloudflare Pages dashboard  
  - **Pages:** [Create project (Cloudflare)](https://dash.cloudflare.com/ee05f70c889cb6f876b9925257e3a2fa/workers-and-pages/create/pages) → **Connect to Git** → select repo (e.g. `p31labs/phosphorus31.org` or monorepo with root directory `apps/web`)

- [ ] Set build command and output directory  
  - **Build command:** leave empty (static site, no build)  
  - **Build output directory:** `/` (root)  
  - If using monorepo: set **Root directory** to `apps/web` so the built “output” is the web app root

- [ ] Add custom domain  
  - **Custom domains** → Add custom domain → `phosphorus31.org`  
  - Add `www.phosphorus31.org` if desired (redirect to apex is in `_redirects`)

- [ ] **Verify DNS: CNAME to *.pages.dev**  
  - CNAME for `phosphorus31.org` (and optionally `www`) to the project’s *.pages.dev target shown in dashboard

- [ ] Test HTTPS redirect  
  - Visit `http://phosphorus31.org` → should redirect to `https://phosphorus31.org`  
  - Certificate should be active (may take a few minutes)

- [ ] **Verify _headers and _redirects work**  
  - Check response headers on a few URLs (X-Frame-Options, CSP, etc.)  
  - Test `https://www.phosphorus31.org` → should 301 to `https://phosphorus31.org`  
  - Test `/favicon.ico` → should 302 to `/assets/logos/favicon.svg`

---

## Post-launch

- [ ] Homepage loads: https://phosphorus31.org
- [ ] Key subpages load: /about/, /docs/, /donate/, /roadmap/
- [ ] No console errors on homepage
- [ ] Mobile view and basic accessibility check
- [ ] Run `.\verify-launch.ps1` from `apps/web` when site is live

---

**The mesh holds. Ready to launch.** 🔺
