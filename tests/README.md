# P31 Integration Tests (LAUNCH-01)

## Prerequisites

- **Shelter** must be running on port 4000 before running the integration test.
- Start it with: `npm run dev:shelter` (from repo root) or `npx tsx src/index.ts` (from `apps/shelter`).
- Redis is optional; Shelter uses an in-memory fallback if Redis is not available.

## Run

**Live Shelter test (this suite):** From repo root, with Shelter running on :4000. After changing Shelter code, restart Shelter (`npm run dev:shelter`) so the integration test runs against the latest build.

```bash
npm run test:integration
```

Or:

```bash
node tests/integration.test.js
```

Requires `ws` at repo root (`npm install ws --save-dev`). Shelter uses a default rate limit of 200 req/min so the full suite passes; if you hit 429, start Shelter with `BUFFER_RATE_LIMIT_MAX=500`. Preflight (`npm run preflight`) runs asset verification, then health check, then this script.

**UI Vitest integration (mocked):** No server required. From repo root: `cd ui && npm run test:integration` — runs 58 tests (scope-buffer, scope-centaur, scope-node-one, end-to-end) with mocked fetch and a mock Node One server.

**Live wiring check:** When Shelter (and optionally Centaur, Scope) are running, from repo root: `npm run verify` — health checks and Buffer→Centaur message flow.

## What it tests

1. **Health** — `GET /health` returns 200, status/uptime/version, &lt; 50ms.
2. **Signal loop** — Sprout → Shelter → Scope for signals `ok`, `break`, `hug`, `help`; voltage and accommodation log.
3. **Scope → Sprout response** — `scope:respond` → Sprout receives `scope:response`, log updated.
4. **Message pipeline** — `POST /process` voltage tiers (GREEN/AMBER/RED) and hold for high-voltage content.
5. **Hold and release** — `GET /queue`, `POST /queue/:id/release`, no PII in queue.
6. **Accommodation log** — JSON, CSV export, summary.
7. **Reconnection** — Manual check (restart Shelter, verify clients reconnect).
8. **Concurrent connections** — Multiple Sprout/Scope clients, correct routing.
9. **Malformed input** — 400 for bad `/process` body; WebSocket tolerates invalid JSON and unknown events.
10. **Persistence** — Accommodation log shape; full SQLite persistence is covered in LAUNCH-04.

No test framework — plain Node.js, `fetch` and `ws`. Exit code 1 if any assertion fails.

## Performance benchmarks (LAUNCH-03)

From repo root, with Shelter running:

```bash
npm run benchmark
```

Measures HTTP latency (health, process, accommodation-log, export), WebSocket broadcast latency, and bundle sizes (Sprout/Scope/Web). See `docs/PERFORMANCE_REPORT_LAUNCH03.md`.

## Accessibility audit (LAUNCH-05)

Lighthouse (Accessibility ≥ 95), keyboard-only navigation, reduced-motion, and P31-critical flows (YouAreSafe, SpoonMeter, CatchersMitt). See `docs/ACCESSIBILITY_AUDIT_LAUNCH05.md`.

## Go-live verification (LAUNCH-07)

After website and/or Shelter are live, run the post-launch checklist in `docs/GO_LIVE_VERIFICATION_LAUNCH07.md`: HTTPS, health endpoint, CORS, OPSEC, and sign-off.

🔺 The mesh holds.
