# LAUNCH-10: Asset verification

Verify that build outputs and key deployable assets exist and are usable before launch.

---

## 1. Shelter (Buffer backend)

| Asset | Location | Verify |
|-------|----------|--------|
| Built server | `apps/shelter/dist/index.js` | Present after `cd apps/shelter && npm run build` |
| Package runnable | `node apps/shelter/dist/index.js` or `npm start` from apps/shelter | Starts and serves /health |

**Command:** `cd apps/shelter && npm run build && node dist/index.js` (then curl http://localhost:4000/health).

---

## 2. Scope (P31 Spectrum — ui)

| Asset | Location | Verify |
|-------|----------|--------|
| Build output | `ui/dist/` | Present after `cd ui && npm run build` |
| Entry HTML | `ui/dist/index.html` | Exists |
| SPIFFS (optional) | `ui/dist/` under 500 KB for ESP32 | See ui README for build:spiffs |

**Command:** `cd ui && npm run build` → check `dist/index.html` exists.

---

## 3. Sprout (child UI)

| Asset | Location | Verify |
|-------|----------|--------|
| Build output | `apps/sprout/dist/` | Present after build |
| Entry | `apps/sprout/dist/index.html` or `dist/assets/` | Exists |

**Command:** From repo root, build Sprout per apps/sprout README; confirm dist exists.

---

## 4. Website (phosphorus31.org)

| Asset | Location | Verify |
|-------|----------|--------|
| Static site | `apps/web/` | index.html at root |
| CNAME / redirects | Per LAUNCH_NOW.md | For Cloudflare Pages |

**Command:** `ls apps/web/index.html` (or equivalent). No build step if static.

---

## 5. Bundle sizes (LAUNCH-03)

Run `npm run benchmark` (with Shelter running) to report bundle sizes for Sprout, Scope, Web. Targets: Sprout &lt; 50 KB gzip, Scope &lt; 200 KB gzip. See `docs/PERFORMANCE_REPORT_LAUNCH03.md`.

---

## 6. Automated check

From repo root:

```bash
npm run verify:assets
```

This runs `scripts/verify-assets.mjs`, which checks for the presence of:

- `apps/shelter/dist/index.js`
- `ui/dist/index.html`
- `apps/web/index.html`

Optional (not required for exit 0): `apps/sprout/dist/index.html` or `apps/sprout/dist/` with assets.

Exit 0 = all required assets present; exit 1 = one or more missing (e.g. run builds first).

---

## Checklist before go-live

- [ ] Shelter builds and starts; `/health` returns 200.
- [ ] Scope (ui) builds; `ui/dist/index.html` exists.
- [ ] Website (apps/web) has `index.html` and any CNAME/redirects.
- [ ] Optional: Sprout builds if deploying child UI.
- [ ] Optional: Run `npm run benchmark` for bundle size report.

**Related:** [PERFORMANCE_REPORT_LAUNCH03.md](PERFORMANCE_REPORT_LAUNCH03.md), [GO_LIVE_VERIFICATION_LAUNCH07.md](GO_LIVE_VERIFICATION_LAUNCH07.md)

🔺 The mesh holds.
