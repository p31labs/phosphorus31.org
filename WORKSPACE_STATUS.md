# P31 Workspace Status

**Last updated:** 2026-02-18
**Git branch:** `main`

---

## Component Health Matrix

### Frontend

| Component | Path | Stack | Runs | Tests | Build | Maturity |
|-----------|------|-------|------|-------|-------|----------|
| P31 Spectrum | `ui/` | React 18, TS, Vite, Three.js, Zustand | Yes | Vitest (partial) | Warnings | 70% |
| P31 Scope | `apps/scope/` | React 19, TS, Vite, Recharts | Scaffold | Minimal | Unknown | 15% |
| P31 Sprout | `apps/sprout/` | React 19, TS, Vite | Scaffold | Minimal | Unknown | 10% |
| P31 Greenhouse | `ui/public/apps/` | Standalone HTML/CSS/JS | Yes (static) | None | N/A | 50% |

### Backend

| Component | Path | Stack | Runs | Tests | Build | Maturity |
|-----------|------|-------|------|-------|-------|----------|
| P31 Buffer | `apps/shelter/` | Express, TS, Redis, SQLite, WS | Yes | Vitest (good) | Clean | 75% |
| P31 Tandem | `SUPER-CENTAUR/` | Express, TS, PG/SQLite, Redis, Neo4j | Yes | Jest (150+) | 451 TS errors | 75% |
| P31 Entangle | `GENESIS_GATE_APPS_SCRIPT/` | Google Apps Script | Yes (GAS) | None | N/A | 40% |
| P31 Brain | `scripts/p31-brain-v8/` | Google Apps Script | Yes (GAS) | Manual | N/A | 60% |

### Hardware

| Component | Path | Stack | Runs | Tests | Build | Maturity |
|-----------|------|-------|------|-------|-------|----------|
| P31 NodeZero FW | `firmware/node-one-esp-idf/` | ESP-IDF, C++, LVGL, RadioLib | Builds | None | Requires ESP-IDF 5.4+ | 30% |
| PCB: Node 1 | `hardware/node1/` | KiCad | N/A | N/A | Gerbers exist | 50% |
| PCB: Cyberdeck | `hardware/sensory/` | KiCad | N/A | N/A | Gerbers exist | 30% |

### Shared Packages

| Package | Path | Exports | Tests | Version |
|---------|------|---------|-------|---------|
| @p31/protocol | `packages/protocol/` | Types, tokens, constants, voltage, mesh, L.O.V.E. | None | 0.1.0 |
| @p31/game-integration | `packages/game-integration/` | Game bridge, metabolism gating | None | — |

### Static Sites

| Site | Path | Live? | Notes |
|------|------|-------|-------|
| phosphorus31.org | `website/` | Yes (Cloudflare Pages) | Static HTML, fully functional |
| p31ca.org | `ui/` (build output) | Partially | Vite build with warnings |

---

## Known Issues

### Blocking

1. **SUPER-CENTAUR: 451 TypeScript errors** — Mostly from `noUncheckedIndexedAccess` in strict mode. Code runs but won't produce a clean build.
2. **ui/: Import mismatches** — Some components reference store properties that don't exist. Shield Store / CatchersMitt API mismatch.
3. **No CI/CD pipeline active** — `.github/workflows/` exists but status unknown.

### Non-Blocking

4. **apps/scope and apps/sprout** — Scaffolded but mostly empty. Need data integration.
5. **firmware: No test framework** — ESP-IDF components exist but no unit tests.
6. **packages: No tests** — Both shared packages lack test coverage.
7. **GENESIS_GATE_APPS_SCRIPT** — Uses old naming (PHENIX_NAVIGATOR, ZONE_ALPHA, etc.). Needs rename pass.

---

## Dependency Graph

```
ui/ (P31 Spectrum)
  ├── imports @p31/protocol
  ├── imports @p31/game-integration
  ├── connects to → apps/shelter/ (WebSocket + HTTP)
  └── connects to → SUPER-CENTAUR/ (HTTP)

apps/shelter/ (P31 Buffer)
  ├── imports @p31/protocol (planned, currently inline types)
  ├── connects to → SUPER-CENTAUR/ (HTTP via centaur-client.ts)
  └── connects to → Redis (optional, fallback queue if unavailable)

apps/scope/ (P31 Scope)
  └── connects to → apps/shelter/ (HTTP for dashboard data)

apps/sprout/ (P31 Sprout)
  └── connects to → apps/shelter/ (WebSocket for signals)

SUPER-CENTAUR/ (P31 Tandem)
  ├── connects to → PostgreSQL/SQLite
  ├── connects to → Redis
  ├── connects to → Neo4j (optional)
  └── connects to → OpenAI (optional, for Legal AI)

firmware/ (P31 NodeZero)
  ├── LoRa mesh → apps/shelter/ (via Meshtastic/serial bridge)
  └── USB serial → host machine

GENESIS_GATE_APPS_SCRIPT/ (P31 Entangle)
  ├── Google Sheets (data store)
  └── Google Drive (file sync)
```

---

## Port Assignments

| Port | Service | Notes |
|------|---------|-------|
| 3000 | P31 Buffer (`apps/shelter/`) | Also Docker `p31_shelter` |
| 3001 | P31 Tandem API | SUPER-CENTAUR REST endpoints |
| 4000 | P31 Tandem (`SUPER-CENTAUR/`) | Docker `p31_tandem` |
| 5173 | P31 Spectrum dev server (`ui/`) | Vite default |
| 5174 | P31 Scope dev server (`apps/scope/`) | Vite |
| 5175 | P31 Sprout dev server (`apps/sprout/`) | Vite |
| 6379 | Redis | Docker `p31_redis` |
| 5432 | PostgreSQL | Docker `p31_db` |

---

## Test Coverage Summary

| Component | Framework | Tests | Coverage | Command |
|-----------|-----------|-------|----------|---------|
| ui/ | Vitest | ~30 | Partial (~40%) | `npm run test:scope` |
| apps/shelter/ | Vitest | ~20 | Good (~60%) | `npm run test:shelter` |
| SUPER-CENTAUR/ | Jest | ~150 | Partial (~50%) | `npm run test:centaur` |
| firmware/ | — | 0 | 0% | — |
| packages/protocol/ | — | 0 | 0% | — |

---

## Docker Services

```yaml
# docker-compose.yml (root)
redis:     Redis 7 Alpine          # Port 6379
db:        PostgreSQL 15 Alpine    # Port 5432, user: operator
shelter:   P31 Buffer              # Port 3000, depends: redis, db
centaur:   P31 Tandem              # Port 4000, depends: redis, db
```

Requires `DB_PASSWORD` in `.env`.

---

## File Counts by Component

| Directory | Files | Lines (approx) |
|-----------|-------|-----------------|
| ui/src/ | 200+ | 15,000+ |
| SUPER-CENTAUR/src/ | 100+ | 12,000+ |
| apps/shelter/src/ | 30+ | 3,000+ |
| firmware/ | 30+ | 2,000+ |
| docs/ | 600+ | — |
| website/ | 100+ | — |
| packages/ | 20+ | 500+ |

---

## Entry Points for Common Tasks

| Task | Start Here |
|------|-----------|
| Add a new Greenhouse app | `ui/public/apps/_template.html` → copy and modify |
| Add a new Buffer filter pattern | `apps/shelter/src/filter.ts` |
| Add a new Tandem API route | `SUPER-CENTAUR/src/core/super-centaur-server.ts` |
| Add a new firmware component | `firmware/node-one-esp-idf/components/` → new folder |
| Add a shared type | `packages/protocol/src/` → add module, re-export from index.ts |
| Add documentation | `docs/` → appropriate subdirectory |
| Update the website | `website/` → static HTML files |
| Modify design tokens | `packages/protocol/src/tokens.ts` |
| Modify voltage thresholds | `packages/protocol/src/constants.ts` |

---

*Updated by P31 Build Agent — 2026-02-18*
