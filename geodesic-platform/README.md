# P31 Geodesic Platform

Colyseus game server + REST API for the P31 Quantum Geodesic Platform: `geodesic_world` room with Redis persistence, worlds/structures/marketplace/portals.

## Quick start (no DB/Redis)

```bash
npm install
npm run dev
```

- Colyseus: `ws://localhost:2567`
- No API (set DB_* and JWT_SECRET for API on port 3001)

## With Postgres + Redis

1. Copy `.env.example` to `.env` and set `DB_PASSWORD`, `JWT_SECRET`, optional `REDIS_PASSWORD`.
2. Run migrations: `npm run migrate` (requires DB_* in `.env`).
3. Start: `npm run dev`.

Or with Docker:

```bash
docker compose up --build
```

- Colyseus: `ws://localhost:2567`
- API: `http://localhost:3001`

## Environment

| Variable        | Description |
|----------------|-------------|
| COLYSEUS_PORT  | Colyseus server port (default 2567) |
| API_PORT       | REST API port when DB configured (default 3001) |
| DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD | Postgres (optional) |
| REDIS_HOST, REDIS_PORT, REDIS_PASSWORD | Redis for driver/presence (optional) |
| JWT_SECRET     | Required for API auth |

## UI (P31 Scope)

Point `VITE_COLYSEUS_URL` to `ws://localhost:2567` (or your Colyseus URL). The Scope already uses `geodesic_world` and `structureUpdate` messages.

## Rust WASM engine (optional)

From repo root:

```bash
cd geodesic-engine
wasm-pack build --target web --out-dir ../ui/src/wasm
wasm-pack build --target nodejs --out-dir ../geodesic-platform/server/wasm
```

Then the platform can call the WASM `analyze_structure` for server-side analysis; until then the JS fallback in `src/utils/geodesicAnalysis.ts` is used.

The mesh holds. 🔺💜
