# Prep for launch

**One-page checklist before going live.**  
**Updated:** 2026-02-17  
**Complete printable + sign-off:** [docs/LAUNCH_CHECKLIST_COMPLETE.md](docs/LAUNCH_CHECKLIST_COMPLETE.md) — verified items and Phase A/B/C human sign-off.

**Complete the launch checklist (run in this order):**
1. **Automated (no server):** `npm run verify:assets` → exit 0.  
2. **Tests:** `npm test` → Scope + Shelter pass.  
3. **Start Shelter** (other terminal): `npm run dev:shelter`.  
4. **Preflight:** `npm run preflight` → assets + health + integration pass.  
5. **Tick the printable table** below for every row (sections 1–5i).  
6. **Phase A/B/C sign-off:** [docs/LAUNCH_CHECKLIST_COMPLETE.md](docs/LAUNCH_CHECKLIST_COMPLETE.md) — Phase A (before launch) → Phase B (launch day) → Phase C (after go-live).

**Launch checklist complete** = steps 1–4 green, printable table fully ticked, and Phase A/B/C signed off in LAUNCH_CHECKLIST_COMPLETE.md.

---

## Complete launch checklist (printable)

Tick every row before go-live. Details for each block are in the sections below.

| # | Section | Item | Done |
|---|---------|------|------|
| 1 | Pre-flight | No secrets in repo (.env not committed) | |
| 1 | Pre-flight | OPSEC: no full names, addresses, case numbers, kid data | |
| 1 | Pre-flight | Tailscale (optional) for family sharing | |
| 2 | Website | Local check: `apps/web` → serve :8000, index/CNAME/robots/sitemap | |
| 2 | Website | Go live: Cloudflare Pages, domain phosphorus31.org | |
| 2 | Website | After launch: HTTPS, mobile, robots/sitemap | |
| 3 | Shelter | Install (apps/shelter, npm install) | |
| 3 | Shelter | Build (npm run build) | |
| 3 | Shelter | Run (npm run dev or start:server), verify /health | |
| 4 | Scope+Shelter | Full dev: npm run dev (Shelter + Scope + Sprout) | |
| 4 | Scope+Shelter | Verify live: npm run verify when stack up | |
| 5 | NodeZero | ESP-IDF 5.5, FLASH_PREP.md, flash_now.ps1 (optional) | |
| 5a | LAUNCH-01 | Integration tests (live + mocked), npm run verify | |
| 5a | LAUNCH-02 | Security audit: docs/SECURITY_AUDIT_LAUNCH02.md | |
| 5a | LAUNCH-03 | Performance: npm run benchmark, PERFORMANCE_REPORT_LAUNCH03 | |
| 5a | LAUNCH-04 | Persistence: Shelter SQLite + accommodation log | |
| 5a | LAUNCH-05 | Accessibility: docs/ACCESSIBILITY_AUDIT_LAUNCH05.md | |
| 5b | Git | No secrets; .gitignore data/, *.db, backups/ | |
| 5b | Git | Conventional commits; author P31 Labs / will@p31ca.org | |
| 5b | Git | Release tag per docs/RELEASE_TAGGING.md | |
| 5c | LAUNCH-06 | Shelter Docker, compose, config/env-reference.md | |
| 5c | LAUNCH-06 | Website/Scope deploy: LAUNCH_CLOUDFLARE, ui/DEPLOYMENT | |
| 5d | LAUNCH-07 | Health GET /health; MONITORING_LAUNCH07, GO_LIVE_VERIFICATION | |
| 5e | LAUNCH-08 | docs/index.md Launch section; DOCUMENTATION_CHECKLIST_LAUNCH08 | |
| 5f | LAUNCH-09 | Legal/regulatory: entity, FDA, ADA, OPSEC; LEGAL_REGULATORY_CHECKLIST | |
| 5g | LAUNCH-10 | npm run verify:assets (Shelter, Scope, Website dist) | |
| 5h | LAUNCH-11 | npm run preflight (assets + health + integration, Shelter up) | |
| 5i | LAUNCH-12 | LAUNCH_SEQUENCE_LAUNCH12 Phase A/B/C; launch-day checklist | |

---

## Launch prep status (handoff)

- **Asset verification** — `npm run verify:assets` passes (Shelter dist, Scope dist, Website index present).
- **Root `npm test`** — Passes (ui unit + Shelter; 188 + 20).
- **UI mocked integration** — `cd ui && npm run test:integration` passes (58 tests, no server).
- **Live integration** — With Shelter running on :4000, `npm run test:integration` passes; requires `ws` at root.
- **Preflight** — With Shelter up and assets built, `npm run preflight` passes (verify-assets → health → integration). Integration test tolerates "ok" signal (green or no broadcast) and skips on 429 (connection/rate limit). See `tests/README.md`, `docs/LAUNCH_CHECKLIST_COMPLETE.md`.
- **Live wiring** — `npm run verify` documented for when Shelter/Centaur/Scope are up.
- **Excluded component tests** — `node-a-you/**/*.test.tsx`, `node-b-them/**/*.test.tsx`, `CognitiveFlow.test.tsx`, `Molecule/P31MoleculeViewer.test.tsx`; skipped in default run due to React 18/19 monorepo conflict; re-enable after React unification.

---

## 1. Pre-flight (do once)

- [ ] **No secrets in repo** — No `.env` with real API keys committed. Use `.env.example` only.
- [ ] **OPSEC** — No full names, addresses, case numbers, or kid data in public-facing code or docs. See `01_OPSEC_RULES.md`.
- [ ] **Tailscale (optional)** — For sharing Scope/Shelter with family on your network: install from [tailscale.com/download](https://tailscale.com/download), invite family from admin panel. Not required for website or local dev.

---

## 2. Website (phosphorus31.org)

**Location:** `apps/web/`

- [x] **Local check (files present):** `apps/web/` has `index.html`, `CNAME`, `robots.txt`, `sitemap.xml`. *(Verified 2026-02-17.)* Run `npx serve . -l 8000` from `apps/web` and open http://localhost:8000 to confirm in browser.
- [ ] **Go live:** Push to GitHub; connect repo to **Cloudflare Pages** (or upload zip). Build output = root of repo or `apps/web` depending on project config. Add custom domain `phosphorus31.org`.
- [ ] **After launch:** Verify https://phosphorus31.org loads, HTTPS valid, mobile OK, robots.txt and sitemap.xml work.

**Guides:** `apps/web/LAUNCH_NOW.md`, `apps/web/LAUNCH_CLOUDFLARE.md`, `apps/web/LAUNCH_NOW.ps1` (run from `apps/web` for status/reminders).

---

## 3. P31 Shelter (Buffer backend)

**Location:** `apps/shelter/`

- [ ] **Install:** `cd apps/shelter && npm install` (use `--legacy-peer-deps` if needed).
- [ ] **Build:** `npm run build` (uses `tsconfig.build.json` — backend only). Fix any TS errors in `src/` if build fails.
- [ ] **Run:** From repo root `npm run dev` (Shelter + Scope + Sprout), or `cd apps/shelter && npm run start:server` alone. Buffer API binds to **port 4000** (or 4001–4010 if 4000 is in use; log shows actual URL). Redis is optional (fallback in-memory queue).
- [ ] **Verify:** `curl http://localhost:4000/health` (or the port shown in the Shelter log).

Scope, Sprout, and ui use **VITE_SHELTER_URL** (or **VITE_BUFFER_URL** in ui) for the Buffer API; set to the URL Shelter logs (e.g. `http://localhost:4001` if it used a fallback port). See `docs/QUANTUM_GEODESIC_PLATFORM_STATUS.md` §18 and “How to run”, `ui/.env.example`, `apps/scope/.env.example`, `apps/sprout/.env.example`.

---

## 4. Scope + Sprout + Shelter (full dev)

**Preferred:** From repo root run **`npm run dev`** to start Shelter, Scope, and Sprout together. See `docs/QUANTUM_GEODESIC_PLATFORM_STATUS.md` “How to run” for ports and env.

**Or run ui only:** `cd ui && npm install && npm run dev` → e.g. http://localhost:5173. Set **VITE_SHELTER_URL** (or VITE_BUFFER_URL) so Tasks/Health use the Buffer; **VITE_MESH_WS_URL** for live mesh/Sprout WebSocket.

**Verify live wiring:** With Shelter (and optionally Centaur, Scope) running, from repo root run **`npm run verify`** (`scripts/verify-integration.ts`). It checks `/health` on Centaur :3000, Buffer :4000, Scope :5173, then submits a test message to the Buffer; exit 0 only when all checked components are healthy.

**Docs:** `docs/DEMO_RUN.md` (one-page demo run), `ui/README_SCOPE_AND_DEMO.md`, `ui/docs/MESH_ADAPTER_INTEGRATION.md`, `BUILD_NEXT.md`.

---

## 5. Optional: NODE ONE (NodeZero) flash

**Location:** `firmware/node-one-esp-idf/`

- [ ] **ESP-IDF:** Use **ESP-IDF 5.5 PowerShell** (e.g. Desktop shortcut), then `cd firmware/node-one-esp-idf`.
- [ ] **Checklist:** Follow `firmware/node-one-esp-idf/FLASH_PREP.md`.
- [ ] **Flash:** `.\flash_now.ps1` (or `.\flash_now.ps1 -BuildOnly -NoMonitor` for build only).

---

## 5a. LAUNCH gates (01–05)

| Gate | What | Doc / command |
|------|------|----------------|
| LAUNCH-01 | Integration tests | **Live:** `npm run test:integration` (Shelter on :4000, `ws` dep). **Mocked:** `cd ui && npm run test:integration` (58 tests, no server). **Live wiring:** `npm run verify` when Shelter/Centaur/Scope up. See `tests/README.md`. |
| LAUNCH-02 | Security audit | `docs/SECURITY_AUDIT_LAUNCH02.md` |
| LAUNCH-03 | Performance | `npm run benchmark`, `docs/PERFORMANCE_REPORT_LAUNCH03.md` |
| LAUNCH-04 | Persistence | Shelter SQLite + accommodation log |
| LAUNCH-05 | Accessibility | `docs/ACCESSIBILITY_AUDIT_LAUNCH05.md` — Lighthouse, keyboard, reduced-motion |

---

## 5b. Git hygiene & release tagging

- [ ] **No secrets:** `.env` not committed; `.env.example` only. No API keys, DB paths with secrets, or PII in repo.
- [x] **Ignore runtime data:** Root `.gitignore` includes `.env`, `/data/`, `*.db`, `backups/`. Shelter DB and backups stay local. *(Verified 2026-02-17.)*
- [ ] **Commits:** Conventional format `type(scope): description` (see CONTRIBUTING.md). Author: P31 Labs / will@p31ca.org.
- [ ] **Release tag:** When cutting a release, follow `docs/RELEASE_TAGGING.md` — update CHANGELOG, bump version, `git tag -a vX.Y.Z -m "Release vX.Y.Z"`, push tag.

---

## 5c. LAUNCH-06 — Infrastructure & deployment

- [x] **Shelter Docker:** `apps/shelter/Dockerfile` — Node 18, SQLite + optional Redis. Build: `cd apps/shelter && docker build -t p31-shelter .` *(Present; verified 2026-02-17.)*
- [x] **Compose:** `deploy/docker-compose.yml` — Redis + Shelter. Run from repo root: `docker compose -f deploy/docker-compose.yml up -d`. Shelter on :4000. *(Verified 2026-02-17.)*
- [x] **Env reference:** `config/env-reference.md` — Buffer (Shelter) vars: PORT, REDIS_URL, ACCOMMODATION_DB_DIR, etc. *(Verified 2026-02-17.)*
- [ ] **Website/Scope:** Static sites — see `apps/web/LAUNCH_CLOUDFLARE.md`, `ui/DEPLOYMENT.md` (Cloudflare Pages / GitHub Pages).

---

## 5d. LAUNCH-07 — Monitoring & go-live verification

- [ ] **Health:** Shelter `GET /health` returns 200 with `status`, `uptime`, `version`, and `systems` (queue, store, accommodationLog, ping). See `docs/MONITORING_LAUNCH07.md`.
- [ ] **Go-live:** After website and/or Shelter are live, run `docs/GO_LIVE_VERIFICATION_LAUNCH07.md` — HTTPS, health, CORS, process, Scope ↔ Buffer, OPSEC sign-off.

---

## 5e. LAUNCH-08 — Documentation completeness

- [x] **Docs index:** `docs/index.md` has a **Launch & operations** section linking to PREP_FOR_LAUNCH, deployment, RELEASE_TAGGING, LAUNCH-02/03/05/07 docs, and env reference. *(Verified 2026-02-17.)*
- [ ] **Checklist:** Run through `docs/DOCUMENTATION_CHECKLIST_LAUNCH08.md` — required docs present, README and PREP_FOR_LAUNCH accurate, no broken links.

---

## 5f. LAUNCH-09 — Legal & regulatory checklist

- [ ] **Entity/tax:** 501(c)(3) status and public wording correct; fiscal sponsor if used.
- [ ] **FDA:** Node One (P31 NodeZero) — Class II 510(k)-exempt (21 CFR § 890.3710) noted in public materials where appropriate; no therapeutic claims.
- [ ] **ADA:** Accommodation log (Shelter) and export available; immutable, PII-free.
- [ ] **OPSEC:** No full names, addresses, case numbers, or kid PII in public code/docs. See `01_OPSEC_RULES.md`, `docs/LEGAL_REGULATORY_CHECKLIST_LAUNCH09.md`.

---

## 5g. LAUNCH-10 — Asset verification

- [x] **Build outputs:** Shelter `apps/shelter/dist/index.js`, Scope `ui/dist/index.html`, Website `apps/web/index.html` exist after build. *(Verified 2026-02-17.)*
- [x] **Check:** Run `npm run verify:assets` from repo root; exit 0 when all required assets present. See `docs/ASSET_VERIFICATION_LAUNCH10.md`. *(Verified 2026-02-17.)*

---

## 5h. LAUNCH-11 — Pre-flight smoke test

- [x] **One command:** With Shelter already running, from repo root run `npm run preflight`. This runs asset verification, health check on :4000, then full integration test (LAUNCH-01). *(Passes when Shelter is running; restart Shelter after server changes. See `docs/LAUNCH_CHECKLIST_COMPLETE.md`.)*
- [ ] **If preflight fails:** Start Shelter in another terminal (`npm run dev:shelter`), then run `npm run preflight` again.
- [ ] **Optional after pass:** `npm run benchmark` for latency and bundle checks. See `docs/PREFLIGHT_SMOKE_LAUNCH11.md`.

---

## 5i. LAUNCH-12 — Launch sequence (human-executed)

- [ ] **Order of operations:** Follow `docs/LAUNCH_SEQUENCE_LAUNCH12.md` — Phase A (before launch), Phase B (launch day: build → Shelter → preflight → go-live), Phase C (after go-live: verification, backup, tag, sign-off).
- [ ] **Go-live is human:** Pushing the site, starting production Shelter, and cutting a release tag are always human decisions and actions.
- [ ] **One-page checklist:** Use the printable checklist at the end of LAUNCH_SEQUENCE_LAUNCH12.md on launch day.

---

## 6. Quick reference

| What              | Where        | Command / action                          |
|-------------------|-------------|-------------------------------------------|
| **Launch check**  | repo root   | `npm run launch:check` (assets + unit tests, no server) |
| Preflight         | repo root   | `npm run preflight` (Shelter must be running on :4000) |
| Website           | `apps/web/` | `npx serve . -l 8000` → Cloudflare Pages  |
| Shelter backend   | `apps/shelter/` | `npm run build && npm start` → :4000 |
| Scope + demo      | `ui/`       | `npm run dev` → :5173                     |
| Verify live stack | repo root   | `npm run verify` (Shelter + optional Centaur/Scope up) |
| NodeZero flash    | `firmware/node-one-esp-idf/` | See FLASH_PREP.md + flash_now.ps1 |

---

## 7. Root launch scripts

- **`LAUNCH.ps1`** (repo root) — Launches Shield frontend if run from a directory that has a built `dist/` (e.g. cognitive-shield standalone or after building Shield UI). For **Buffer API only**, use `apps/shelter`: `npm run build && npm start`.
- **`apps/web/LAUNCH_NOW.ps1`** — Run from `apps/web` for website launch reminders and verification checklist.
- **`apps/shelter/LAUNCH.ps1`** — Serves Shield frontend on port 3000 when `dist/` exists; for backend-only, use `npm start` in `apps/shelter`.

---

## Checklist completion status (2026-02-17)

**Last automated run:** `npm run verify:assets` ✅ (exit 0); `npm test` ✅ (188 ui + 20 Shelter). Re-run before go-live.

**Verified (automated or file check):**
- LAUNCH-10: Asset verification — `npm run verify:assets` passes; Shelter/Scope/Website build outputs present.
- Root `npm test` — 188 (ui) + 20 (Shelter) pass.
- Git hygiene: `.gitignore` includes `.env`, `data/`, `*.db`, `backups/`.
- LAUNCH-08: `docs/index.md` has Launch & operations section with all LAUNCH doc links.
- Website key files: `apps/web/index.html`, CNAME, robots.txt, sitemap.xml present.

**Requires human action:**
- §1: No secrets in repo (spot-check); OPSEC; Tailscale optional.
- §2: Website go-live (Cloudflare Pages, domain); after-launch HTTPS check.
- §3–4: Shelter install/build/run and Scope dev (one-time or per env).
- §5: NODE ONE flash (hardware + ESP-IDF).
- §5b: No secrets (human); commits/release tag (human).
- §5c–5d: Docker/Compose, env reference, health/go-live verification (human run).
- §5e: DOCUMENTATION_CHECKLIST_LAUNCH08 run-through (human).
- §5f: LAUNCH-09 legal/regulatory (entity, FDA, ADA, OPSEC) (human).
- §5h: LAUNCH-11 preflight — run with Shelter running (`npm run dev:shelter` then `npm run preflight`).
- §5i: LAUNCH-12 launch sequence (human-executed).

**The mesh holds. 🔺**
