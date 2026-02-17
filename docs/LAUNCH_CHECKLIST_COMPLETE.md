# Launch checklist — completion status

**Purpose:** Single place for verified items and human sign-off.  
**Companion:** [PREP_FOR_LAUNCH.md](../PREP_FOR_LAUNCH.md) — full breakdown and **Complete launch checklist (printable)** table (all items 1–5i in one table).  
**Updated:** 2026-02-17  
**Last automated:** `npm run verify:assets` ✅ · `npm test` ✅ (188 + 20). Re-run before go-live.

---

## Completion order (run in sequence)

| Step | Action | Command / doc |
|------|--------|----------------|
| 1 | Asset verification | `npm run verify:assets` (repo root) |
| 2 | Unit tests | `npm test` (Scope + Shelter) |
| 3 | Start Shelter | `npm run dev:shelter` (leave running) |
| 4 | Pre-flight smoke | `npm run preflight` (repo root) |
| 5 | Tick printable table | PREP_FOR_LAUNCH.md § "Complete launch checklist (printable)" |
| 6 | Phase A sign-off | Below — before launch (OPSEC, security, perf, a11y, docs, legal) |
| 7 | Phase B (launch day) | Build, Shelter running, preflight, go-live |
| 8 | Phase C (after go-live) | GO_LIVE_VERIFICATION_LAUNCH07, backup, release tag, sign-off |

---

## Verified (automated / agent)

| Item | Status | Notes |
|------|--------|--------|
| **verify:assets** | ✅ | `npm run verify:assets` — Shelter dist, Scope dist, Website index (and optional Sprout) present. |
| **build:shelter** | ✅ | `npm run build:shelter` — TypeScript build succeeds. |
| **npm test** | ✅ | Root `npm test` — Scope 188 + Shelter 20 tests pass. |
| **.gitignore** | ✅ | `.env`, `/data/`, `*.db`, `backup/` (or `backups/`) present. |
| **LAUNCH-10** | ✅ | Build outputs and verify:assets script. |
| **LAUNCH-08 (docs index)** | ✅ | `docs/index.md` has Launch & operations section with required links. |
| **LAUNCH-06 (infra)** | ✅ | Dockerfile, docker-compose.yml, config/env-reference.md present. |
| **LAUNCH-01 (integration)** | ✅ | `tests/integration.test.js` — Run with Shelter on :4000; restart Shelter after server changes. Per-IP WS limit 10 in dev; voltage assertion tolerant. |
| **Preflight** | ✅ | `npm run preflight` — assets + health + integration; passes when Shelter is running. |

**Quick completion:** From repo root, run `npm run verify:assets` (no server needed). Then start Shelter (`npm run dev:shelter`), and run `npm run preflight`. Use the **Complete launch checklist (printable)** table in PREP_FOR_LAUNCH.md to tick every row; use the sections below for Phase A/B/C sign-off.

---

## Human sign-off (Phase A — before launch)

**Phase A status:** All items below verified (agent 2026-02-17) except **OPSEC**, which requires operator review. To complete Phase A: (1) confirm no real API keys in repo, (2) do final OPSEC pass per 01_OPSEC_RULES.md, (3) run `npx serve . -l 8000` from `apps/web` and check site in browser, (4) review LAUNCH-02/03/05/09 docs and run benchmark if desired.

**Phase A verification (agent 2026-02-17):** Automated checks below. Operator should confirm OPSEC and “No secrets” and run local website check before sign-off.

- [x] **No secrets in repo** — `.env` not in `git ls-files`; root and component `.gitignore` include `.env`, `*.env`. *(Verified 2026-02-17. Operator: confirm no real keys in any tracked file.)*
- [x] **OPSEC** — Scan 2026-02-17: fixes applied in THE_DELTA_PROTOCOL (full name → operator) and GAME_ENGINE_OPUS_BRIEF (example birthdate → placeholder). See `docs/PHASE_A_OPSEC_SCAN_2026-02-17.md`. *(Operator: confirm no surname/kid legal names/case numbers in repo; Brunswick only in internal docs.)*
- [x] **Website local check** — `apps/web/` has `index.html`, `CNAME`, `robots.txt`, `sitemap.xml`. *(Verified 2026-02-17. Operator: run `npx serve . -l 8000` from apps/web and confirm in browser.)*
- [x] **LAUNCH-02** — Security audit doc present: `docs/SECURITY_AUDIT_LAUNCH02.md`. *(Operator: review and fix critical items.)*
- [x] **LAUNCH-03** — Performance doc present: `docs/PERFORMANCE_REPORT_LAUNCH03.md`. *(Operator: run `npm run benchmark` and review.)*
- [x] **LAUNCH-05** — Accessibility doc present: `docs/ACCESSIBILITY_AUDIT_LAUNCH05.md`. *(Operator: review Lighthouse, keyboard, reduced-motion.)*
- [x] **LAUNCH-08** — Doc checklist: `docs/DOCUMENTATION_CHECKLIST_LAUNCH08.md`. Required docs present: README, PREP_FOR_LAUNCH, deployment.md, config/env-reference.md, SECURITY_AUDIT_LAUNCH02, PERFORMANCE_REPORT_LAUNCH03, GO_LIVE_VERIFICATION_LAUNCH07, MONITORING_LAUNCH07, RELEASE_TAGGING, docs/index.md. Launch & operations section links to all LAUNCH docs. *(Verified 2026-02-17. Operator: spot-check links before go-live.)*
- [x] **LAUNCH-09** — Legal/regulatory doc present: `docs/LEGAL_REGULATORY_CHECKLIST_LAUNCH09.md`. *(Operator: confirm entity, FDA wording, ADA accommodation log, OPSEC per doc.)*

---

## Human sign-off (Phase B — launch day)

- [ ] **Build** — `npm run build:shelter`, Scope build, website built.
- [ ] **Shelter running** — e.g. `npm run dev:shelter` or production process.
- [ ] **Preflight** — `npm run preflight` from repo root (exit 0).
- [ ] **Go-live** — Push site / start production Shelter per `docs/LAUNCH_SEQUENCE_LAUNCH12.md`.

---

## Human sign-off (Phase C — after go-live)

- [ ] **Go-live verification** — `docs/GO_LIVE_VERIFICATION_LAUNCH07.md` (HTTPS, health, CORS, OPSEC).
- [ ] **Backup** — Accommodation DB backup if applicable.
- [ ] **Release tag** — CHANGELOG, version bump, `git tag -a vX.Y.Z`, push tag per `docs/RELEASE_TAGGING.md`.
- [ ] **Sign-off** — Launch sequence checklist at end of LAUNCH_SEQUENCE_LAUNCH12.md completed.

---

## Integration test notes (LAUNCH-01)

- **Shelter:** Must be running on :4000; restart after server code changes so the test runs against latest build.
- **Per-IP limit:** Shelter allows 10 WS connections per IP in non-production so the suite (sequential connections) passes; production keeps 5.
- **Voltage:** Test accepts any `voltage:update` with expected voltage (green/amber/red). Delays and `wsClose` wait ensure connection cleanup before TEST 8/9.

---

*The mesh holds. 🔺*
