# P31 Buffer — AI Agent Context

**Communication voltage assessment and processing layer.**

---

## Quick Reference

- **Location:** `apps/shelter/`
- **Package:** `@p31labs/shelter`
- **Stack:** TypeScript, Express, Redis, SQLite, WebSocket
- **Status:** 75% complete. Core message processing, queue, ping, and game integration all work.
- **License:** AGPL-3.0
- **Node:** >= 20.0.0

---

## What This Does

The Buffer sits between raw incoming communication and the operator. It scores every message for "voltage" — how emotionally charged, coercive, or urgent something is — then batches, filters, and releases messages at a pace a neurodivergent brain can handle.

Key behaviors:
- **60-second batch windows** to prevent overwhelm
- **Voltage scoring** (0-10 scale) with auto-hold at 6+, critical alert at 8+
- **Priority queue** (urgent/high/normal/low) backed by Redis, with in-memory fallback
- **Ping system** for object permanence ("Dad is still here")
- **Accommodation logging** for SSA/legal evidence (PII-free)
- **Game integration** for P31 Sprout (molecule builder, L.O.V.E. economy)
- **Metabolism gating** (brain-state-aware transaction costs)

---

## Architecture

```
BufferServer (server.ts)
├── Express API (REST endpoints)
├── WebSocket Server (real-time mesh)
│   ├── Sprout clients (child signals)
│   └── Scope clients (dashboard subscribers)
├── MessageQueue (queue.ts) — Redis-backed, fallback to in-memory
├── BufferStore (store.ts) — SQLite local-first message history
├── MessageFilter (filter.ts) — Voltage keywords + caps ratio detection
├── Ping (ping.ts) — Object permanence heartbeat
├── Metabolism (metabolism.ts) — Brain state + spoon tracking
├── CentaurClient (centaur-client.ts) — HTTP bridge to P31 Tandem
├── AccommodationLogStore — SQLite log for legal evidence
├── GameStore (game-store.ts) — Molecule state, LOVE transactions
└── Security middleware — Rate limiting, payload validation, helmet
```

---

## API Endpoints

### Health
- `GET /health` — Health check with version, uptime, queue depth

### Messages
- `POST /api/messages` — Submit message for voltage assessment
- `GET /api/messages` — Get message history
- `GET /api/messages/:messageId` — Get message status
- `GET /api/messages/stats` — Message statistics
- `POST /api/messages/:messageId/process` — Process a held message

### Queue
- `GET /api/queue/status` — Queue depth and status

### Ping
- `GET /api/ping/status` — Ping system status
- `POST /api/ping/heartbeat` — Send heartbeat

### Game (via router)
- `GET /api/game/molecules` — List molecules
- `POST /api/game/molecules` — Create molecule
- `GET /api/game/love/balance` — LOVE balance
- `POST /api/game/love/transaction` — Record LOVE transaction
- `GET /api/game/mesh/directory` — Mesh directory
- `GET /api/game/brain-state` — Current brain state

### Sprout (via router)
- Sprout signal routes for child-facing interface

---

## WebSocket Protocol

Connect to `ws://localhost:3000`.

### Client → Server
```json
{ "type": "sprout:signal", "data": { "emotion": "happy", "intensity": 0.8 } }
{ "type": "scope:subscribe" }
```

### Server → Client
```json
{ "type": "message:new", "data": { "id": "...", "voltage": 3.2 } }
{ "type": "message:processed", "data": { "id": "...", "status": "released" } }
{ "type": "sprout:signal", "data": { "emotion": "happy" } }
{ "type": "voltage:update", "data": { "level": "green" } }
```

---

## Key Files

| File | Purpose |
|------|---------|
| `src/server.ts` | Main BufferServer class (~1060 lines). All routes, WS, lifecycle. |
| `src/index.ts` | Entry point. Loads env, starts server. |
| `src/filter.ts` | MessageFilter — keyword detection, caps ratio, voltage scoring |
| `src/queue.ts` | MessageQueue — Redis priority queue with in-memory fallback |
| `src/store.ts` | BufferStore — SQLite message persistence |
| `src/ping.ts` | Ping — object permanence automation |
| `src/monitoring.ts` | Health monitoring and metrics |
| `src/encryption.ts` | EncryptedBlob support (G.O.D. Protocol) |
| `src/metabolism.ts` | Brain state tracking, spoon-aware gating |
| `src/centaur-client.ts` | HTTP client for P31 Tandem |
| `src/game-store.ts` | Molecule + LOVE transaction storage |
| `src/accommodation-log-store.ts` | PII-free legal evidence logging |
| `src/security/security-middleware.ts` | Rate limiting, validation, payload caps |
| `src/routes/game.ts` | Game API router |
| `src/routes/sprout.ts` | Sprout signal router |

---

## Configuration

### Environment Variables (`.env.example`)
```
PORT=3000
REDIS_URL=redis://localhost:6379
DATABASE_URL=./data/shelter.db
BUFFER_WINDOW_MS=60000
MAX_BATCH_SIZE=100
ENCRYPTION_KEY=                # 32-byte hex for EncryptedBlob
CENTAUR_URL=http://localhost:4000
```

Redis is **optional** — the queue falls back to in-memory if Redis is unavailable. SQLite is the primary persistence layer (local-first).

---

## Testing

```bash
npm test           # Vitest, run once
npm run dev        # Watch mode (tsx)
```

Test files: `src/__tests__/` and `test/`

---

## Integration Points

- **P31 Spectrum** (`ui/`) → connects via WebSocket + HTTP
- **P31 Tandem** (`SUPER-CENTAUR/`) → HTTP via CentaurClient
- **P31 Sprout** (`apps/sprout/`) → WebSocket signals
- **P31 Scope** (`apps/scope/`) → HTTP for dashboard data
- **P31 NodeZero** (`firmware/`) → LoRa mesh via serial bridge (planned)

---

## Voltage Scale

| Range | Tier | Color | Action |
|-------|------|-------|--------|
| 0-3 | Green | Safe | Pass through |
| 4-5 | Yellow | Mild | Pass with note |
| 6-7 | Orange | Hold | Auto-held for review |
| 8-9 | Red | High | Critical alert |
| 10 | Black | Max | Immediate flag |

Thresholds defined in `@p31/protocol` → `packages/protocol/src/constants.ts`.

---

## Development

```bash
cd apps/shelter
npm install
cp .env.example .env
npm run start:server    # Start with tsx (dev)
npm run dev             # Watch mode
npm run build           # TypeScript compile
npm start               # Run compiled output
```

---

**The Buffer protects from the noise. The mesh holds.**
