# P31 — Full Audit & Test Suite

**Date:** 2026-02-16  
**Purpose:** Single reference for audit commands, test layout, coverage expectations, and remediation.

---

## 1. Audit (codebase health)

### Run full audit

From repo root:

```bash
npm run audit
```

This runs `scripts/audit.mjs`, which:

| Section | What it checks |
|--------|-----------------|
| **Port health** | 3000 (Centaur), 4000 (Buffer/Shelter), 5173 (Scope) |
| **Banned-word scan** | deploy, kill, lockdown, tactical, etc. → use P31 vocabulary |
| **Legacy naming** | Phenix Navigator, Genesis Gate, SIMPLEX, etc. → P31 names |
| **PII / secrets** | SSN-like, case numbers, legal names, API keys, private keys |

### Scanned directories

`apps`, `ui`, `packages`, `p31-core`, `SUPER-CENTAUR`, `cognitive-shield`, `firmware/node-one-esp-idf`, `website`, `docs`.  
Excludes: `node_modules`, `dist`, `.git`, `_archive`, `build`, `coverage`.

### Manual checks (not in script)

- **OPSEC:** No full names, kids’ names, or addresses in committed code (see `.cursor/rules/01-opsec-rules.mdc`).
- **Naming:** P31 product names in new code (P31 Compass, P31 Shelter, P31 Buffer, P31 NodeZero, etc.).
- **prefers-reduced-motion:** Animations disabled or reduced when user prefers reduced motion.

---

## 2. Test suite layout

### 2.1 By package

| Package | Runner | Location | Notes |
|---------|--------|----------|--------|
| **Scope (ui)** | Vitest | `ui/` | Engine, stores, nodes, integration. Full run can OOM on low-memory machines — use `test:scope:engine` for engine-only. |
| **P31 Shelter (apps/shelter)** | Vitest | `apps/shelter/` | Buffer server. Placeholder tests; full engine tests live in **cognitive-shield** (standalone). Build currently blocked by TS errors (Phase 1). |
| **Cognitive Shield (standalone)** | Vitest | `cognitive-shield/` (if in workspace) or separate repo | **Reference Buffer implementation.** Voltage, patterns, triage, accommodation, API, Redis, SQLite. 90% coverage target on engine. |
| **SUPER-CENTAUR (P31 Tandem)** | Jest / Vitest | `SUPER-CENTAUR/` | Engine core, security, monitoring, legal/medical. |
| **packages/protocol** | — | `packages/protocol/` | No tests yet (minimal types + constants). |

### 2.2 Scope (ui) — test files

- **Engine:** `src/engine/__tests__/` — voltage-calculator, spoon-calculator, shield-filter, genre-detector, filter-patterns; plus `shield-filter.test.ts` at engine root.
- **Stores:** `src/stores/__tests__/swarm-goals.test.ts`.
- **Nodes:** `node-a-you/` (YouAreSafe, SpoonMeter, HeartbeatPanel), `node-b-them/` (VoltageGauge, MessageInput, CatchersMitt).
- **Components:** CognitiveFlow, P31MoleculeViewer.
- **Integration:** `src/__tests__/integration/` — scope-centaur, scope-buffer, scope-node-one, end-to-end.

### 2.3 Cognitive Shield (Buffer backend) — test files

- **Engine:** `src/engine/voltage.test.ts`, `voltage.stress.test.ts`, `accommodation.test.ts`, `accommodation.stress.test.ts`.
- **API:** `src/server/api.test.ts`.
- **DB:** `src/db/redis.test.ts`, `src/db/sqlite.test.ts`.
- **Frontend (if present):** `frontend/src/engine/voltage-calculator.test.ts`, `filter-patterns.test.ts`, `e2ee/crypto.test.ts`, `stores/heartbeat.store.test.ts`, `App.test.tsx`.

### 2.4 P31 Shelter (apps/shelter)

- `src/__tests__/buffer.test.ts` — placeholder (expect true).
- `src/__tests__/integration/buffer-centaur.test.ts` — integration when Centaur is available.

---

## 3. How to run tests

### From repo root

| Command | What runs |
|---------|-----------|
| `npm test` | test:centaur + test:scope (default) |
| `npm run test:centaur` | SUPER-CENTAUR tests |
| `npm run test:scope` | ui Vitest (full; may OOM) |
| `npm run test:scope:engine` | ui engine + stores only (lighter) |
| `npm run test:shelter` | apps/shelter Vitest |
| `npm run test:all` | centaur + scope + shelter |

### Per-package (from package dir)

```bash
# Scope
cd ui && npm run test          # or npm run test:coverage

# Scope engine-only (fewer workers, less memory)
cd ui && npx vitest run src/engine src/stores/__tests__

# Shelter (when build passes)
cd apps/shelter && npm test

# Cognitive Shield (standalone repo or workspace)
cd cognitive-shield && npm test
cd cognitive-shield && npm run test:coverage
```

### If Scope tests run out of memory

- Use **engine-only**: `cd ui && npx vitest run src/engine src/stores/__tests__`.
- Or use `npm run test:scope:engine` from root (if added).
- `ui/vitest.config.ts` can set `pool: 'forks'` and `poolOptions.forks.singleFork: true` (or `maxForks: 1`) to reduce memory at the cost of speed.

---

## 4. Coverage expectations

| Area | Target | Notes |
|------|--------|------|
| **Buffer engine (cognitive-shield)** | 90% | Voltage, patterns, triage — false positives are bugs. |
| **Scope engine (ui)** | 60%+ (statements/lines) | Vitest thresholds in `ui/vitest.config.ts`. |
| **Accommodation log** | Critical path 100% | Immutable evidence; every write/verify path must be tested. |

---

## 5. Test suite checklist (audit)

Use this to verify suite health:

- [ ] `npm run audit` — no PII/secrets; banned words and legacy names reviewed.
- [ ] `npm run test:scope` or `npm run test:scope:engine` — Scope tests pass.
- [ ] `npm run test:shelter` — Shelter tests pass (after TS/build fixes).
- [ ] In **cognitive-shield**: `npm test` and `npm run test:coverage` — backend engine meets 90% target.
- [ ] No `any` or `@ts-ignore` in new test or production code (Buffer/Scope).
- [ ] Safe parenting phrases (“Can you pick up the kids?”) never trigger hold in voltage tests.

---

## 6. Gaps and next steps

1. **apps/shelter** — Fix TS/build (Phase 1 report); then add real buffer tests or delegate to cognitive-shield engine.
2. **packages/protocol** — Add unit tests for L.O.V.E. constants and voltage tier helper when used by Scope/Shelter.
3. **Scope OOM** — Keep `test:scope:engine` and/or Vitest pool options for low-memory CI/machines.
4. **Integration** — scope-buffer and scope-node-one tests may require Buffer and/or mesh URL; document env (e.g. `VITE_BUFFER_URL`, `VITE_MESH_WS_URL`) in README or `ui/.env.example`.

---

*The mesh holds. Run `npm run audit` and `npm test` regularly. 🔺*
