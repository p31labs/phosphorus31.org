# The Centaur — AI Agent Context
**Backend AI Protocol for P31 Ecosystem**

---

## QUICK REFERENCE

**Location:** `SUPER-CENTAUR/`  
**Stack:** TypeScript · Node.js · Express · PostgreSQL/SQLite · Redis · Neo4j  
**Status:** 75% complete. Core engine works. Frontend integration + cross-service testing needed.  
**Priority:** High — The Scope and The Buffer both connect to this.

---

## ARCHITECTURE OVERVIEW

The Centaur is the backend AI protocol that bridges:
- **The Scope** (frontend dashboard) — User interface
- **The Buffer** (voltage assessment) — Message filtering system
- **Node One** (ESP32-S3 hardware) — Physical device

### Core Components

1. **Express API Server** (`src/core/super-centaur-server.ts`)
   - 80+ REST endpoints
   - WebSocket support for real-time updates
   - Health checks and monitoring

2. **Service Modules** (10+ modules)
   - `legal/` — Legal AI engine (OpenAI integration)
   - `medical/` — Medical documentation system
   - `blockchain/` — Blockchain manager + autonomous agents
   - `security/` — Security manager, encryption, audit logging
   - `monitoring/` — System health and metrics
   - `backup/` — Automated backup system
   - `cognitive-prosthetics/` — Executive function support
   - `quantum-brain/` — SOP generator, quantum bridge
   - `optimization/` — Performance optimizer
   - `family-support/` — Family support system

3. **Game Engine** (`src/engine/`)
   - P31 Language parser/executor
   - 3D game engine (Three.js)
   - L.O.V.E. economy integration
   - Tetrahedron topology

4. **Database Layer** (`src/database/`)
   - DataStore (in-memory, SQLite-backed)
   - Migrations and seeding
   - Persistent storage

---

## API ENDPOINTS

### Main Server Routes
- **Health:** `GET /health`
- **Auth:** `POST /api/auth/login`, `/api/auth/register`, `/api/auth/mfa/*`
- **Legal:** `POST /api/legal/generate`, `/api/legal/emergency`
- **Medical:** `POST /api/medical/document`, `GET /api/medical/conditions`
- **Buffer:** `POST /api/buffer/message`, `GET /api/buffer/status`, `/api/buffer/ping`, `/api/buffer/heartbeat`
- **Game:** `GET /api/game/structures`, `POST /api/game/structures`, `GET /api/game/progress/:memberId`
- **Wallet:** `GET /api/wallet/balance`, `POST /api/wallet/transaction`, `GET /api/wallet/transactions`
- **Spoons:** `GET /api/spoons/today/:memberId`, `POST /api/spoons/log`, `GET /api/spoons/history/:memberId`
- **System:** `GET /api/system/metrics`, `/api/system/security`, `/api/system/monitoring`, `/api/system/backup`

### Router-Based Routes
- **Cognitive Prosthetics:** `/api/cognitive-prosthetics/*` (11 routes)
- **Synergy:** `/api/synergy/*` (9 routes)
- **Strategic/Deadlines:** `/api/deadlines/*` (9 routes)
- **Quantum Lab:** `/api/quantum-lab/*` (7 routes)
- **SOP Generator:** `/api/sop/*` (5 routes)

**Full Documentation:** See `docs/API.md`

---

## MODULE STATUS

All modules are **REAL** (no dead code). See `CENTAUR_MODULE_STATUS.md` for details.

| Module | Status | Tests? |
|--------|--------|--------|
| engine | ✅ REAL | ✅ Yes (8 tests) |
| legal | ✅ REAL | ✅ Yes (10+ tests) |
| medical | ✅ REAL | ✅ Yes (15+ tests) |
| blockchain | ✅ REAL | ❌ No |
| security | ✅ REAL | ✅ Yes (10+ tests) |
| monitoring | ✅ REAL | ✅ Yes (15+ tests) |
| backup | ✅ REAL | ❌ No |
| cognitive-prosthetics | ✅ REAL | ✅ Yes (15+ tests) |
| quantum-brain | ✅ REAL | ❌ No |
| family-support | ✅ REAL | ❌ No |

---

## DATABASE

### DataStore (In-Memory)
- Collections: `wallet`, `family_members`, `messages`, `game_structures`, `game_progress`, `audit_log`
- SQLite-backed for persistence
- Migrations: `src/database/migrate.ts`
- Seeding: `src/database/seed.ts`

### PostgreSQL (Production)
- Optional for production deployments
- Configured in docker-compose.yml
- Connection via `pg` package

### Redis (Caching)
- Session storage
- Cache layer
- Configured in docker-compose.yml

---

## CONFIGURATION

### Config Manager (`src/core/config-manager.ts`)
- Loads from `config/config.json` or environment variables
- Validates configuration on startup
- Supports hot-reload (development)

### Environment Variables
See `.env.example` for all required variables:
- `JWT_SECRET` — **REQUIRED** for authentication
- `OPENAI_API_KEY` — Required for Legal AI
- `BUFFER_URL` — Buffer integration URL
- `DATABASE_PATH` — SQLite database path
- `POSTGRES_*` — PostgreSQL connection (optional)
- `REDIS_URL` — Redis connection

---

## DEPLOYMENT

### Docker
- **Dockerfile:** `deployment/docker/Dockerfile`
- **docker-compose.yml:** `deployment/docker/docker-compose.yml`
- **Services:** super-centaur, redis, postgres, nginx, prometheus, grafana, ELK stack

### Build & Run
```bash
# Build
docker build -t p31-centaur -f deployment/docker/Dockerfile .

# Run with docker-compose
cd deployment/docker
docker compose up --build
```

### Health Check
- Endpoint: `GET /health`
- Docker healthcheck configured
- Returns system status

---

## TESTING

### Test Framework
- **Jest** — Main test framework
- **Vitest** — Also available
- **Coverage:** Aim for 80%+ on implemented features

### Test Files
- `src/engine/language/__tests__/` — P31 Language tests (97 tests)
- `src/legal/__tests__/` — Legal AI tests (10+ tests)
- `src/medical/__tests__/` — Medical tests (15+ tests)
- `src/security/__tests__/` — Security tests (10+ tests)
- `src/monitoring/__tests__/` — Monitoring tests (15+ tests)
- `src/cognitive-prosthetics/__tests__/` — Cognitive prosthetics tests (15+ tests)

### Run Tests
```bash
npm test
npm test -- --coverage
npm test -- src/legal/__tests__/
```

---

## INTEGRATION POINTS

### The Scope (Frontend)
- **Base URL:** `http://localhost:3000` (development)
- **API Base:** `http://localhost:3001/api`
- **WebSocket:** `ws://localhost:3001`
- **Main Endpoints:** System metrics, wallet, spoons, cognitive state, game progress

### The Buffer (Voltage Assessment)
- **Base URL:** `http://localhost:4000` (default)
- **Integration:** `src/buffer/buffer-client.ts`
- **Endpoints Used:**
  - `POST /api/buffer/message` — Submit message for voltage assessment
  - `GET /api/buffer/status` — Check Buffer connection
  - `GET /api/buffer/ping` — Ping Buffer
  - `POST /api/buffer/heartbeat` — Send heartbeat

### Node One (Hardware)
- **Communication:** LoRa mesh (via Meshtastic) or USB/Serial
- **Integration:** Via Buffer client
- **Endpoints Used:**
  - `POST /api/buffer/message` — Send messages through Buffer
  - `POST /api/buffer/heartbeat` — Maintain mesh connectivity
  - `GET /api/game/progress/:memberId` — Query game progress

---

## KEY FEATURES

### P31 Language
- **Parser:** `src/engine/language/P31LanguageParser.ts`
- **Executor:** `src/engine/language/P31LanguageExecutor.ts`
- **Status:** Implemented, tests created (60% parser, 26% executor coverage)
- **Keywords:** `build`, `print`, `quantum`, `tetrahedron`, `cosmic`, `mesh`, `holds`, `love`, `light`

### L.O.V.E. Economy
- **Transaction Types:** BLOCK_PLACED, COHERENCE_GIFT, ARTIFACT_CREATED, CARE_RECEIVED, CARE_GIVEN, TETRAHEDRON_BOND, VOLTAGE_CALMED, MILESTONE_REACHED, PING
- **Pool Structure:** 50% Sovereignty Pool (locked), 50% Performance Pool (earned)
- **Chain:** Base L2 (Coinbase), Soulbound ERC-20 tokens

### Spoon Economy
- **Tracking:** Daily spoon count, activity logging, recovery recommendations
- **Integration:** Cognitive prosthetics, game engine
- **Endpoints:** `/api/spoons/*`

### Game Engine
- **3D Engine:** Three.js + Rapier3D physics
- **P31 Language:** Integrated for game scripting
- **Structures:** Tetrahedron-based building system
- **Challenges:** Dynamic challenge generation
- **Progress:** Per-family-member tracking

---

## ERROR HANDLING

### TypeScript Errors
- **Current:** 451 errors (mostly from `noUncheckedIndexedAccess`)
- **Critical:** Fixed syntax errors in GeodesicFramework, DynamicChallengeEngine, P31LanguageExecutor
- **Status:** Code compiles with warnings

### ESLint
- **Config:** `eslint.config.js` (flat config format)
- **Status:** Configured, needs dependency resolution

---

## DEPENDENCIES

### Unused Dependencies (29 found)
- React/Three.js libraries (may be used in frontend)
- Blockchain tools (hardhat, solc)
- CLI utilities (boxen, chalk, inquirer)
- **Recommendation:** Review before removal (some may be used conditionally)

---

## DEVELOPMENT WORKFLOW

### Start Development Server
```bash
npm run dev  # Watch mode with tsx
npm run build  # Build TypeScript
npm start  # Run production build
```

### Start Individual Services
```bash
npm run start:legal
npm run start:medical
npm run start:blockchain
npm run start:quantum-brain
# ... etc
```

### Start All Services
```bash
npm run start:all  # Concurrently starts all services
```

---

## PRODUCTION DEPLOYMENT

### Docker Compose
```bash
cd deployment/docker
docker compose up -d
```

### Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in all required values (especially `JWT_SECRET`, `OPENAI_API_KEY`)
3. Generate strong secrets: `openssl rand -base64 32`
4. Configure database (SQLite or PostgreSQL)
5. Set Buffer URL if using external Buffer instance

### Health Monitoring
- Health endpoint: `GET /health`
- Prometheus metrics: Port 9090
- Grafana dashboards: Port 3000
- ELK stack: Elasticsearch (9200), Kibana (5601)

---

## KNOWN ISSUES

1. **TypeScript Errors:** 451 errors from strict mode (`noUncheckedIndexedAccess`)
   - Non-blocking for development
   - Should be addressed before production

2. **ESLint Dependencies:** Need to resolve package conflicts
   - Workaround: Use existing `@typescript-eslint` packages

3. **Test Coverage:** Some modules need more tests
   - Legal, medical, security, monitoring have tests
   - Blockchain, backup, quantum-brain need tests

4. **Docker Compose:** Fixed typo (`versionyste` → `version`)

---

## FILE STRUCTURE

```
SUPER-CENTAUR/
├── src/
│   ├── core/              # Main server, config manager
│   ├── legal/             # Legal AI engine
│   ├── medical/           # Medical documentation
│   ├── blockchain/         # Blockchain + agents
│   ├── security/          # Security manager
│   ├── monitoring/        # System monitoring
│   ├── backup/            # Backup system
│   ├── cognitive-prosthetics/  # Executive function support
│   ├── engine/            # Game engine + P31 Language
│   ├── buffer/            # Buffer client
│   ├── auth/              # Authentication & MFA
│   ├── database/          # DataStore, migrations
│   └── index.ts           # Main entry point
├── deployment/docker/     # Docker configs
├── docs/                  # Documentation (API.md)
├── tests/                 # Test files
├── config/                # Configuration files
├── .env.example           # Environment variables template
└── CLAUDE.md              # This file
```

---

## QUICK COMMANDS

```bash
# Development
npm run dev

# Build
npm run build

# Test
npm test

# Lint
npm run lint

# Format
npm run format

# Docker
cd deployment/docker && docker compose up

# Database
npm run db:init
npm run db:migrate
npm run db:seed
```

---

## CONTACTS & RESOURCES

- **GitHub:** github.com/p31labs
- **Domain:** phosphorus31.org
- **Email:** will@p31ca.org
- **Documentation:** `docs/API.md`

---

**With love and light. As above, so below. 💜**  
**The Mesh Holds. 🔺**

**Last Updated:** 2026-02-15
