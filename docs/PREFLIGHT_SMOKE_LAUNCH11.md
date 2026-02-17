# LAUNCH-11: Pre-flight smoke test

Run immediately before launch to confirm the stack is ready. **Order matters.**

---

## What this covers

1. **Assets** — Required build outputs exist (Shelter dist, Scope dist, Web index).
2. **Shelter up** — Backend responds on port 4000.
3. **Integration** — Health, process, accommodation-log, WebSocket Sprout→Scope loop (LAUNCH-01).

Optional after: `npm run benchmark` (LAUNCH-03) for latency and bundle sizes.

---

## One-command preflight (recommended)

From repo root, with **Shelter already running** in another terminal:

```bash
npm run preflight
```

This runs:

1. `npm run verify:assets` — exits 1 if any required asset is missing.
2. Check `GET http://localhost:4000/health` — exits 1 if Shelter is not up.
3. `node tests/integration.test.js` — full LAUNCH-01 integration suite; exits 1 if any test fails.

If you see "Start Shelter: npm run dev:shelter" then start Shelter in another terminal and run `npm run preflight` again.

---

## Manual sequence

| Step | Command | Pass condition |
|------|---------|-----------------|
| 1 | `npm run verify:assets` | Exit 0 |
| 2 | Start Shelter | `npm run dev:shelter` (or `cd apps/shelter && npm run start:server`) |
| 3 | `npm run test:integration` | Exit 0, all tests pass |
| 4 (optional) | `npm run benchmark` | Latency targets met; bundle sizes reported |

---

## Before first run

- **Build Shelter:** `cd apps/shelter && npm run build` (so `dist/index.js` exists).
- **Build Scope (optional for smoke):** `cd ui && npm run build` (for verify:assets).
- **Website:** `apps/web/index.html` must exist (static site).

---

## Related

- [LAUNCH-01](tests/README.md) — Integration test description
- [LAUNCH-10](ASSET_VERIFICATION_LAUNCH10.md) — Asset verification
- [LAUNCH-07](GO_LIVE_VERIFICATION_LAUNCH07.md) — Post-launch verification (after go-live)

🔺 The mesh holds.
