# P31 Full Audit and Test Suite Report

**Date:** 2026-02-16  
**Scope:** p31 monorepo (ui, SUPER-CENTAUR, apps/shelter). Legacy cognitive-shield (standalone) archived; Buffer canonical in apps/shelter.

---

## 1. Executive Summary

| Component | Test framework | Status | Notes |
|-----------|----------------|--------|-------|
| **ui (P31 Spectrum/Scope)** | Vitest | 235 pass, 11 fail (run completed) | Missing dep, 1 assertion fix, integration tests need mocks |
| **SUPER-CENTAUR (P31 Tandem backend)** | Jest | OOM on run | Recommend `--maxWorkers=1` or run by directory |
| **apps/shelter (P31 Buffer in-repo)** | Vitest | Not in root `npm test` | 2 test files; add to root script when stable |
| **cognitive-shield (archived)** | Vitest | OOM on full run | Legacy; Buffer canonical in apps/shelter |

**Root `npm test`** runs `test:centaur` then `test:scope`. Root also has `test:shelter`, `test:buffer` (apps/shelter), and `test:all`; use `test:scope:unit` to run Scope without integration tests.

---

## 2. Test Infrastructure by Component

### 2.1 ui (P31 Spectrum)

- **Config:** `ui/vitest.config.ts` — jsdom, coverage thresholds 60% stmt/line, 50% branches.
- **Setup:** `ui/src/test/setup.ts`.
- **Scripts:** `test` = `vitest run`, `test:watch`, `test:coverage`.

**Test layout:**

- **Engine (unit):** `src/engine/__tests__/` — filter-patterns, genre-detector, shield-filter, spoon-calculator, voltage-calculator; `src/engine/shield-filter.test.ts` (duplicate location, now fixed).
- **Stores:** `src/stores/__tests__/swarm-goals.test.ts`.
- **Components:** CognitiveFlow, P31MoleculeViewer, HeartbeatPanel, SpoonMeter, YouAreSafe, CatchersMitt, MessageInput, VoltageGauge — **failed to load** due to missing `@testing-library/dom`.
- **Integration:** `src/__tests__/integration/` — scope-buffer, scope-centaur, scope-node-one, end-to-end. Some failures due to no live Buffer/Centaur or incomplete mocks.

**Fixes applied this session:**

1. **@testing-library/dom** added to `ui/package.json` so React component tests load (required by `@testing-library/react`).
2. **shield-filter.test.ts** — "blocks high voltage messages with high severity threats": message updated to `very high voltage message with high threat patterns` so mocked voltage is ≥8 and the block branch is taken.

**Remaining failures (to fix in follow-up):**

- **scope-buffer:** "auto-held messages appear in held queue, not inbox" — assertion on API response shape (or run with mocked Buffer).
- **scope-centaur:** "Scope handles malformed Centaur responses" — test expects `getMessages()` to reject; implementation may return `[]` on parse error.
- **end-to-end:** Multiple failures from `response.ok` undefined — `fetch` not mocked or mock not returning a proper Response; Buffer/Centaur not running.

---

### 2.2 SUPER-CENTAUR (P31 Tandem backend)

- **Config:** `SUPER-CENTAUR/jest.config.js` — ts-jest ESM, node env, roots in `src`, coverage from `src/**/*.ts`.
- **Script:** `npm test` → `jest`.

**Test layout (from glob search):**

- `src/engine/` — SnapSystem, integration, P31 Language (parser/executor), synergy, core (VestingPhases, SafetySystems, ProofOfCare, LoveTransactionTypes, CloudSyncManager, WalletIntegration, SpatialAudioManager, NetworkManager, GameEngine).
- `src/security/__tests__/`, `src/monitoring/__tests__/`, `src/medical/__tests__/`, `src/legal/__tests__/`, `src/cognitive-prosthetics/__tests__/`.
- `tests/` — integration.test.js, family-support.test.js, legal-ai.test.js, quantum-brain.test.js.

**Run result:** Jest ran out of memory (Fatal process out of memory). Heavy dependency graph (Three.js, Rapier3D, etc.) and many test files.

**Recommendations:**

- Run with limited workers: `npm test -- --maxWorkers=1` or `NODE_OPTIONS=--max-old-space-size=4096 npm test`.
- Run by path to validate critical paths: `npm test -- src/legal/ src/security/ src/engine/core/__tests__/`.
- Consider migrating to Vitest and/or splitting test runs by package or directory in CI.

---

### 2.3 apps/shelter (P31 Buffer in monorepo)

- **Package:** `@p31/shelter`, Vitest ^1.2.0.
- **Scripts:** `test` = `vitest`.
- **Test files:** `src/__tests__/buffer.test.ts`, `src/__tests__/integration/buffer-centaur.test.ts`.

Not included in root `package.json` script `test` (only `test:centaur` and `test:scope`). Phase 1 report noted Shelter has many pre-existing TS errors; build may use backend-only `tsconfig.build.json`.

**Recommendation:** Once Shelter builds and tests pass, add `test:buffer` and include in root `test` script.

---

### 2.4 cognitive-shield (archived; Buffer canonical in apps/shelter)

- **Backend:** Vitest, 90% engine coverage target; tests for voltage, accommodation, API, db (Redis, SQLite), stress.
- **Frontend:** Vitest, React Testing Library; tests for voltage-calculator, filter-patterns, crypto, heartbeat store, App.

Full `npm test` in repo root (backend) hit OOM in this audit. Engine tests (voltage, patterns, accommodation) are the critical surface; run with:

- `npm test -- src/engine/` (backend), or
- From `frontend/`: `npm test` (frontend only).

---

## 3. Root Test Script and Recommendations

**Current root `package.json`:**
```json
"test": "npm run test:centaur && npm run test:scope",
"test:centaur": "cd SUPER-CENTAUR && npm test",
"test:scope": "cd ui && npm test"
```

**Suggested additions:**

1. **test:scope-only** (unit only, no integration): e.g. `vitest run --exclude 'src/__tests__/integration/**'` to avoid failures when Buffer/Centaur are down.
2. **test:buffer**: `cd apps/shelter && npm test` (canonical Buffer).
3. **test:scope; test:centaur** with Centaur under memory limit: `cd SUPER-CENTAUR && npm test -- --maxWorkers=1`.
4. Document in README or `docs/` that full integration tests require Buffer (port 4000) and optionally Centaur (3001) to be running, or use mocks.

---

## 4. Coverage and Quality Notes

- **ui:** Engine and stores have solid unit coverage; integration tests need either live services or consistent fetch/API mocks.
- **SUPER-CENTAUR:** CLAUDE.md states legal, medical, security, monitoring, cognitive-prosthetics, engine have tests; blockchain, backup, quantum-brain do not.
- **apps/shelter (Buffer):** Voltage and pattern logic target same behavior; false-positive prevention is a stated requirement ("Can you pick up the kids?" must pass).

---

## 5. Checklist for “Full Audit and Test Suite”

- [x] Inventory test frameworks and configs (Vitest, Jest) across p31 and apps/shelter.
- [x] Run ui tests and record pass/fail and causes.
- [x] Run SUPER-CENTAUR tests (OOM; document mitigation).
- [x] Run legacy cognitive-shield tests (OOM; Buffer now in apps/shelter).
- [x] Add missing ui dependency (@testing-library/dom) and fix one failing unit test (shield-filter).
- [x] Produce this audit document.
- [ ] Fix remaining ui integration test failures (mocks or env).
- [ ] Add test:buffer to root and document in README.
- [ ] Establish CI-friendly test commands (e.g. scope unit-only, centaur with --maxWorkers=1).

---

## 6. Quick Reference — Run Tests

| Where | Command |
|-------|--------|
| p31 root | `npm test` → Centaur + Scope (Centaur may OOM) |
| Scope only | `cd ui && npm test` |
| Scope unit only (no integration) | `cd ui && npx vitest run --exclude 'src/__tests__/integration/**'` |
| Centaur (low memory) | `cd SUPER-CENTAUR && npm test -- --maxWorkers=1` |
| Centaur single dir | `cd SUPER-CENTAUR && npm test -- src/legal/` |
| Buffer (canonical) | `cd apps/shelter && npm test` |
| Buffer (legacy repo) | `cd cognitive-shield && npm test` (if repo present) |
| Shelter (in-repo) | `cd apps/shelter && npm test` |

---

*The mesh holds. 🔺*
