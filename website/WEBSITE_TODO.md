# Website — Remaining Work

Quick fixes applied: favicon redirect, guides routes, `_redirects` for production.

## Done
- **Favicon:** `_redirects` sends `/favicon.ico` → `/assets/logos/favicon.svg` (Cloudflare/Netlify). Local `npx serve` may still 404 on `/favicon.ico`; harmless.
- **Guides:** `/guides/` and `/docs/guides/` now resolve. `/guides/` redirects to `/docs/`; `/docs/guides/` has a Development Guides landing page.

## Console noise (not site bugs)
- **SES / runtime.lastError:** From browser extensions (e.g. Cursor, password managers). No fix in site code.
- **Unchecked runtime.lastError: Could not establish connection:** Same; extension messaging. Safe to ignore.

## Major work still to do
- [ ] Copy and content pass on all subpages (about, node-one, donate, roadmap, docs, education, blog, legal, accessibility, press, manifesto).
- [ ] Ensure every nav/footer link has a matching page or redirect.
- [ ] Add `/docs/api/` if linked; add `/docs/guides/developer/`, `/docs/guides/user/`, `/docs/guides/educator/` if you want dedicated guide pages.
- [ ] Favicon: for zero 404s on local dev, add a real `favicon.ico` at root (e.g. export from `assets/logos/favicon.svg` via a build step or tool).
- [ ] Deploy to Cloudflare Pages and point phosphorus31.org at it (see WEBSITE_STATUS.md).
