# Session plan — 2026-02-17

**Principle:** Plan your work, work your plan.

## Goal

Verify launch-prep pipeline from repo root: assets, Shelter build, tests, preflight.

## Plan (ordered)

| # | Step | Success criterion | Notes |
|---|------|-------------------|--------|
| 1 | Run `npm run verify:assets` | Exit 0; Shelter dist, Scope dist, Website index present | Build any missing assets. |
| 2 | Run `npm run build:shelter` | Exit 0; no TS/build errors | Fix build if broken. |
| 3 | Run `npm test` (root) | Exit 0; scope + shelter tests pass | Fix test failures. |
| 4 | Run `npm run preflight` | Exit 0 when Shelter is running, or document "start Shelter then preflight" | Preflight needs Shelter on :4000. |

## Execution log

| Step | Command | Result |
|------|---------|--------|
| 1 | `node scripts/verify-assets.mjs` | **Pass** — Shelter dist, Scope dist, Website index, Sprout (optional) all present. |
| 2 | `npm run build:shelter` | **Pass** — `tsc -p tsconfig.build.json` completed. |
| 3 | `npm test` | **Pass** — Scope 188 tests, Shelter 20 tests; all passed. |
| 4 | `npm run preflight` | **Partial** — Asset verification passed; Shelter health OK; integration test ran. **4 failures:** (1) Scope receives voltage:update for "ok"; (2) Voltage matches "ok" → green (got none); (3) Concurrent test → 429; (4) Malformed input test → 429. 429 suggests rate limiting when many requests hit in quick succession. |

## Outcome

- **verify:assets, build:shelter, npm test:** All pass. Pipeline is green for build and unit/integration tests from root.
- **preflight:** Fails on 4 integration-test assertions. Follow-up: (a) fix or relax "ok" → voltage:update / green expectations in `tests/integration.test.js` if behavior is correct; (b) review rate limiting (429) for concurrent and malformed-input tests — consider higher limit or serializing those tests.
