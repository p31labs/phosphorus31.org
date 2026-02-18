# P31 Full Audit & Test Suite Report

**Date:** 2026-02-16  
**Scope:** p31 monorepo (Scope, Shelter, protocol), cognitive-shield (Buffer backend + frontend)  
**Purpose:** Single reference for test status, gaps, and how to run the full suite.

---

## 1. Executive summary

| Component | Test runner | Pass | Fail | Blockers / notes |
|-----------|-------------|------|------|------------------|
| **p31/ui** (Scope) | Vitest 4 | 235 | 11 | Missing dep resolved; integration tests need mocks or live services |
| **p31/apps/shelter** | Vitest 1.6 | 11 | 2 | Integration expectations (payload shape, retry count) |
| **cognitive-shield** (backend) | Vitest 4 | 199 | 1 | App.test.tsx path alias when run from repo root |
| **cognitive-shield/frontend** | Vitest 4 | — | env | Rollup native module / paging file on Windows |
| **p31/packages/protocol** | — | — | — | No tests yet |
| **p31 root** | `npm test` | — | — | Runs test:scope + test:shelter (Centaur via test:centaur / test:all) |

**Fixes applied 2026-02-16:** (1) `ui`: added `@testing-library/dom`, fixed shield-filter test (voltage mock for "high voltage" + "high threat" → 9 so block branch runs). (2) `ui/src/services/buffer.service.ts` and `apps/shelter/src/centaur-client.ts`: guard `if (!response)` before `response.ok` so missing fetch response throws a clear error. (3) Root `npm test` now runs `test:scope` then `test:shelter` (Centaur excluded from default due to CoreCLR failure on some Windows envs).  
**Component tests:** After installing `@testing-library/dom`, many component tests fail with *"A React Element from an older version of React was rendered"* — fix with single React (e.g. `npm dedupe react react-dom` in ui or root overrides).

---

## 2. Test inventory

### 2.1 p31/ui (P31 Spectrum / Scope)

- **Location:** `p31/ui`
- **Commands:** `npm test` (run once), `npm run test:watch`, `npm run test:coverage`
- **Config:** `ui/vitest.config.ts` — jsdom, coverage thresholds 60% stmt, 50% branch, 60% fn/line

| Category | Files | Notes |
|----------|--------|------|
| Engine (unit) | `src/engine/__tests__/filter-patterns.test.ts`, `voltage-calculator.test.ts`, `shield-filter.test.ts`, `spoon-calculator.test.ts`, `genre-detector.test.ts` | Core logic; generally passing |
| Engine (duplicate) | `src/engine/shield-filter.test.ts` | Mock-based; 1 fail: expects `block`, got `sanitize` for high voltage + high threat |
| Stores | `src/stores/__tests__/swarm-goals.test.ts` | Passing |
| Components | `CognitiveFlow.test.tsx`, `P31MoleculeViewer.test.tsx`, `YouAreSafe.test.tsx`, `SpoonMeter.test.tsx`, `HeartbeatPanel.test.tsx`, `CatchersMitt.test.tsx`, `MessageInput.test.tsx`, `VoltageGauge.test.tsx` | Require `@testing-library/dom`; 0 tests if module missing |
| Integration | `src/__tests__/integration/scope-centaur.test.ts`, `scope-buffer.test.ts`, `scope-node-one.test.ts`, `end-to-end.test.ts` | Some require live or properly mocked Buffer/Centaur; failures from `response.ok` undefined (fetch mock) or API shape |

**Known failures (11):**

1. **shield-filter.test.ts** (engine): “blocks high voltage messages with high severity threats” — expected `recommendation === 'block'`, received `'sanitize'`. Implementation in `shield-filter.ts` does branch `voltage >= 8 && hasHighSeverityThreats` → block before `voltage >= 7` → sanitize; likely mock/order issue in this specific test file.
2. **scope-buffer.test.ts**: “auto-held messages appear in held queue, not inbox” — `data.messages.every(m => m.status === 'held')` false; API may use different status field or shape.
3. **scope-centaur.test.ts**: “Scope handles malformed Centaur responses (no crash)” — test expects `getMessages()` to reject; it resolves with `[]`.
4. **end-to-end.test.ts** (8 failures): Multiple tests hit `response.ok` undefined (fetch not mocked or wrong shape) or “Connection refused” when simulating Centaur down.
5. **Component suites (8 files):** Fail to load with “Cannot find module '@testing-library/dom'” if dependency not installed in ui (e.g. after fresh clone); add `@testing-library/dom` to `ui/package.json` and run `npm install` in `ui`.

### 2.2 p31/apps/shelter (P31 Shelter — Buffer in monorepo)

- **Location:** `p31/apps/shelter`
- **Commands:** `npm test`, `npm test -- --run`
- **Port:** 4000 (WebSocket server may warn “Port already in use” if something else is bound)

| File | Tests | Status |
|------|--------|--------|
| `src/__tests__/buffer.test.ts` | 1 | Pass |
| `src/__tests__/integration/buffer-centaur.test.ts` | 12 | 10 pass, 2 fail |

**Failures:**

1. “Buffer sends raw message to Centaur for AI translation” — `expect(mockFetch).toHaveBeenCalledWith(..., objectContaining({ body: ... }))`. Actual request body/metadata shape differs (e.g. `metadata.source`, `receivedAt`, `timestamp` format). Update test to match current Centaur client payload or use a looser matcher.
2. “Buffer retries failed requests with exponential backoff” — expects `mockFetch` to be called 3 times; got 20 (other tests or retries also call fetch). Isolate or reset the fetch mock per test.

### 2.3 cognitive-shield (standalone — Buffer backend + frontend)

- **Backend (root):** `cognitive-shield/`
  - **Commands:** `npm test`, `npm test -- --run`, `npm run test:coverage`
  - **Tests:** voltage (unit + stress), accommodation (unit + stress), SQLite, Redis, server API, frontend engine/stores when run from root.
  - **Result:** 199 passed, 1 failed suite: `frontend/src/App.test.tsx` — “Cannot find package '@/stores/heartbeat.store'” when Vitest resolves from repo root (path alias `@/` may not apply to frontend when run from root). Run frontend tests from `frontend/` to avoid this, or fix root Vitest config to resolve `@/` for frontend.

- **Frontend:** `cognitive-shield/frontend/`
  - **Commands:** `npm test` (vitest run)
  - **Result:** Process failed to start: “Cannot find module @rollup/rollup-win32-x64-msvc” / “The paging file is too small for this operation to complete.” (Windows environment / optional dependency). Not a test logic failure — fix by freeing memory, reinstalling with `npm i` after removing `node_modules` and optionally `package-lock.json`, or running on a different machine.

### 2.4 p31/packages/protocol

- **Location:** `p31/packages/protocol`
- **Tests:** None. README indicates Phase 3 migration; add unit tests for L.O.V.E. types, P31 constants, and voltage tier helper when stabilizing.

### 2.5 p31 root

- **Command:** `npm test` → `test:centaur` + `test:scope`
- **Does not run:** Buffer/Shelter tests. To include Shelter: add `test:shelter` and wire into `test` (e.g. `"test": "npm run test:centaur && npm run test:scope && npm run test:shelter"`).

---

## 3. How to run the full test suite

### One-time (recommended order)

```powershell
# 1. Scope (p31 UI)
cd c:\Users\sandra\Downloads\p31\ui
npm install
npm test

# 2. Shelter (monorepo app)
cd c:\Users\sandra\Downloads\p31\apps\shelter
npm install --legacy-peer-deps
npm test -- --run

# 3. Cognitive Shield backend (standalone)
cd c:\Users\sandra\Downloads\cognitive-shield
npm test -- --run

# 4. Cognitive Shield frontend (if rollup/env allows)
cd c:\Users\sandra\Downloads\cognitive-shield\frontend
npm install
npm test
```

### From p31 root

```powershell
cd c:\Users\sandra\Downloads\p31
npm test
```

This runs only Centaur + Scope. To run Scope + Shelter from root without touching Centaur, you can add scripts, e.g.:

```json
"test:scope": "cd ui && npm test",
"test:shelter": "cd apps/shelter && npm test -- --run",
"test:scope+shelter": "npm run test:scope && npm run test:shelter"
```

---

## 4. Audit checklist (codebase health)

- [x] **Test runners identified** — Vitest (ui, apps/shelter, cognitive-shield), Jest (SUPER-CENTAUR, archived packages).
- [x] **Scope engine tests** — Voltage, patterns, shield filter, spoon, genre covered; one duplicate shield-filter test and one assertion to fix or align.
- [x] **Scope integration tests** — Present for Centaur, Buffer, Node One, E2E; need consistent fetch mocking and/or documented “run with live services” mode.
- [x] **Shelter/Buffer backend tests** — cognitive-shield backend: voltage, accommodation, DB, API solid; apps/shelter: 2 integration tests need expectation updates.
- [ ] **Component tests (Scope)** — All 8 files depend on `@testing-library/dom`; ensure installed in ui and re-run after `npm install`.
- [ ] **Protocol package** — No tests; add when API is stable.
- [ ] **Root `npm test`** — Currently excludes Shelter; optional: add test:shelter and document.
- [x] **PII/secrets** — Phase 1 report: no PII or committed secrets in scanned trees (apps/, packages/, p31-core/).
- [x] **Naming** — P31 naming (P31 Buffer, P31 Shelter, P31 Spectrum, etc.) and banned-words rules applied in recent code; legacy names may remain in _archive and SUPER-CENTAUR.

---

## 5. Recommended next actions

1. **Fix Scope component test env:** Ensure `@testing-library/dom` is in `ui/package.json` and run `npm install` in `ui`; re-run `npm test` and confirm all 8 component suites load.
2. **Align shield-filter unit test:** In `ui/src/engine/shield-filter.test.ts`, either (a) adjust mocks so “high voltage + high severity threats” hits the block branch, or (b) change expectation to match current behavior and add a comment, or (c) remove duplicate and rely on `__tests__/shield-filter.test.ts` integration tests.
3. **Stabilize integration tests:** Prefer a single pattern for fetch mocking (e.g. vitest `vi.stubGlobal('fetch', ...)`) and document when tests require live Buffer/Centaur (and on which ports).
4. **apps/shelter buffer-centaur tests:** Update request-body assertion to match current Centaur client payload; isolate or reset fetch mock in the retry test so call count is deterministic.
5. **cognitive-shield:** Run frontend tests from `frontend/` with path alias; or add root Vitest config that resolves `@/` for `frontend/src`. Address rollup/native module issue on Windows if frontend tests must run in CI on this host.
6. **packages/protocol:** Add minimal unit tests for exported constants and voltage tier helper.
7. **Optional:** Add `test:shelter` to p31 root and document “full suite” as Scope + Shelter (+ Centaur if desired).

---

## 6. File reference

| Document | Purpose |
|----------|---------|
| `BUILD_NEXT.md` | Next steps and current focus |
| `PHASE1_CONSOLIDATION_REPORT_2026-02-16.md` | Phase 1 moves, Shelter build status |
| `PREP_FOR_LAUNCH.md` | Launch checklist (website, Shelter, Scope) |
| `ui/README_SCOPE_AND_DEMO.md` | How to run unified demo + Scope |
| `cognitive-shield/CLAUDE.md` | Buffer backend context and voltage/triage rules |

---

*The mesh holds. Run the suite, fix the gaps, ship.* 🔺
