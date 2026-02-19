# LAUNCH-12: Launch sequence (human-executed)

**Purpose:** Single ordered sequence for going live. No automation of the actual go-live — a human runs each step and signs off.

**Updated:** 2026-02-16

---

## Scope

- **LAUNCH-12** ties together LAUNCH-01 through LAUNCH-11 and defines the **order** in which to run them on and around launch day.
- **Go-live** (pushing the site, starting production Shelter, cutting a release tag) is always a **human decision** and human action.

---

## Phase A: Before launch day

Complete these once; re-check if anything material changed.

| Order | Item | Action | Doc / command |
|-------|------|--------|----------------|
| A1 | OPSEC & secrets | No full names, addresses, case numbers, kid PII in repo or builds. No `.env` committed. | `01_OPSEC_RULES.md`, PREP §1 |
| A2 | Legal & regulatory | Entity/tax, FDA wording, ADA accommodation log, IP/OPSEC. | `docs/LEGAL_REGULATORY_CHECKLIST_LAUNCH09.md` |
| A3 | Security & accessibility | LAUNCH-02 security audit, LAUNCH-05 accessibility. | `docs/SECURITY_AUDIT_LAUNCH02.md`, `docs/ACCESSIBILITY_AUDIT_LAUNCH05.md` |
| A4 | Docs & release process | LAUNCH-08 docs checklist; RELEASE_TAGGING read. | `docs/DOCUMENTATION_CHECKLIST_LAUNCH08.md`, `docs/RELEASE_TAGGING.md` |
| A5 | Infrastructure | Docker/Compose and env known; LAUNCH-06. | `deploy/README.md`, `config/env-reference.md` |

---

## Phase B: Launch day (ordered steps)

Run in this order. Do not go live until the preflight step passes (or you explicitly accept known failures).

| Order | Step | Command / action | Pass condition |
|-------|------|------------------|----------------|
| B1 | Build Shelter | `cd apps/shelter && npm run build` | Exit 0; `apps/shelter/dist/index.js` exists |
| B2 | Build Scope (if going live) | `cd ui && npm run build` | Exit 0; `ui/dist/index.html` exists |
| B3 | Build Website (if going live) | Ensure `apps/web/index.html` (and any build step) | Required assets present |
| B4 | Asset check | From repo root: `npm run verify:assets` | Exit 0 |
| B5 | Start Shelter | In a separate terminal: `npm run dev:shelter` (or production start) | `curl http://localhost:4000/health` → 200, JSON |
| B6 | Preflight smoke | From repo root: `npm run preflight` | Exit 0 (or accept known failures and document) |
| B7 | Optional benchmark | `npm run benchmark` | Latency and bundle sizes acceptable |
| B8 | Go-live (human) | **Website:** Push to GitHub / Cloudflare Pages; add domain. **Shelter:** Start on production host. **Scope:** Launch static build; set `VITE_BUFFER_URL` to live Shelter. | You choose what to launch; do one or all. |

**Notes:**

- If **website only:** B1/B2 can be skipped if you are not building Scope; B5–B6 can be skipped if Shelter is not going live today.
- If **Shelter only:** B2/B3 optional; B5–B6 required.
- **Full stack:** Run B1–B6, then B8 for website, Shelter, and Scope.

---

## Phase C: After go-live

| Order | Step | Action | Doc |
|-------|------|--------|-----|
| C1 | Go-live verification | Run through `docs/GO_LIVE_VERIFICATION_LAUNCH07.md` for each launched component. | GO_LIVE_VERIFICATION_LAUNCH07 |
| C2 | Backup (Shelter) | If Shelter is live with SQLite: run `npm run backup` (or schedule it). | PREP §5b, `scripts/backup-accommodation-db.mjs` |
| C3 | Release tag (optional) | If cutting a release: CHANGELOG, bump version, `git tag -a vX.Y.Z -m "Release vX.Y.Z"`, push. | `docs/RELEASE_TAGGING.md` |
| C4 | Sign-off | Fill LAUNCH-07 sign-off; note any follow-ups. | GO_LIVE_VERIFICATION_LAUNCH07 §5 |

---

## One-page checklist (print or copy)

```text
LAUNCH-12 — Launch day
Date: _______________

Phase A (before launch day)
[ ] A1 OPSEC & secrets
[ ] A2 Legal & regulatory
[ ] A3 Security & accessibility
[ ] A4 Docs & release process
[ ] A5 Infrastructure

Phase B (launch day)
[ ] B1 Build Shelter
[ ] B2 Build Scope (if going live)
[ ] B3 Build Website (if going live)
[ ] B4 npm run verify:assets
[ ] B5 Shelter running (:4000 or production URL)
[ ] B6 npm run preflight
[ ] B7 npm run benchmark (optional)
[ ] B8 Go-live: Website [ ]  Shelter [ ]  Scope [ ]

Phase C (after go-live)
[ ] C1 GO_LIVE_VERIFICATION_LAUNCH07
[ ] C2 Backup (Shelter DB)
[ ] C3 Release tag (if applicable)
[ ] C4 Sign-off recorded
```

---

## Related

- [PREP_FOR_LAUNCH](../PREP_FOR_LAUNCH.md) — One-page prep and all LAUNCH gates
- [PREFLIGHT_SMOKE_LAUNCH11](PREFLIGHT_SMOKE_LAUNCH11.md) — What `npm run preflight` runs
- [GO_LIVE_VERIFICATION_LAUNCH07](GO_LIVE_VERIFICATION_LAUNCH07.md) — Post-launch verification
- [RELEASE_TAGGING](RELEASE_TAGGING.md) — Semver and CHANGELOG

🔺 The mesh holds.
