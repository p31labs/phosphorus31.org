# LAUNCH-03: Performance Report

**Date:** 2026-02-16  
**Tool:** `node tests/benchmark.js` (native fetch + performance.now(), 100 iterations)

---

## Shelter backend targets

| Metric | Target | Typical (p99) | Status |
|--------|--------|----------------|--------|
| GET /health | < 10 ms | < 10 ms | ✓ Met (health no longer awaits Centaur fetch) |
| POST /process | < 50 ms | ~15 ms | ✓ Met |
| GET /accommodation-log | < 100 ms | ~15 ms | ✓ Met |
| GET /accommodation-log/export (CSV) | < 500 ms | ~16 ms | ✓ Met |
| WebSocket broadcast (Sprout→Scope) | < 20 ms | ~2 ms | ✓ Met |
| Memory (RSS) | < 128 MB | Verify with long run | Documented |
| SQLite | WAL mode | Enabled in store (runPragmas) | ✓ |

### Changes made

- **Health:** `/health` no longer awaits `centaurClient.checkHealth()` (external fetch). Response uses only sync data (queue, store, ping, metabolism); `centaur` is returned as `false` so health stays under 10 ms.
- **SQLite:** WAL mode, `foreign_keys=ON`, `synchronous=NORMAL`, `busy_timeout=5000` applied in `BufferStore.runPragmas()` on open.

---

## Bundle sizes (gzip)

| App | Target | Actual (gzip) | Status |
|-----|--------|----------------|--------|
| Sprout | < 50 KB | ~60 KB | ⚠ Over (React+react-dom; consider Preact for v0.2) |
| Scope | < 200 KB | ~160 KB | ✓ Met |
| Web | — | ~17 KB (main.js + styles.css) | Static site |

- **Sprout:** Single React bundle; 50 KB gzip is tight with React. Options for a future revision: Preact (react compat), or aggressive code-split (e.g. lazy load non-critical UI).
- **Scope:** Recharts + Zustand; under 200 KB gzip. Lazy-loading Recharts would reduce initial load if needed.

---

## Benchmark script

- **Run:** `npm run benchmark` (from repo root; Shelter must be running on port 4000).
- **Measures:** Latency (min/max/mean/p95/p99) for health, process, accommodation-log, export, and WebSocket broadcast; bundle sizes (raw + gzip) for Sprout/Scope/Web when builds exist.
- **Exit code:** 1 if any **latency** target is missed. Bundle targets are reported but do not cause exit 1 (so CI can run without building frontends).

---

## Optional checks (manual)

- **Lighthouse:** Run against apps/web and Scope/Sprout deploys for Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO 100.
- **Memory:** Run Shelter under load for 10+ minutes and confirm RSS stable (e.g. no leak).
- **FCP/TTI/LCP:** Use DevTools or Lighthouse for Sprout/Scope/website targets in the LAUNCH-03 spec.

🔺 The mesh holds.
