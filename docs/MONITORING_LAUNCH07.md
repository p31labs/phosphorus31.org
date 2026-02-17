# LAUNCH-07: Monitoring & health

How to monitor P31 Shelter (Buffer) in production. Health endpoint contract and what to alert on.

---

## Health endpoint

**URL:** `GET {SHELTER_URL}/health`  
**Expected:** 200 OK, JSON. Response time &lt; 50 ms (p99) per LAUNCH-03.

### Response shape

```json
{
  "status": "ok",
  "uptime": 12345,
  "version": "1.0.0",
  "timestamp": "2026-02-16T12:00:00.000Z",
  "systems": {
    "queue": true,
    "store": true,
    "accommodationLog": true,
    "ping": true,
    "centaur": false,
    "metabolism": "idle"
  }
}
```

| Field | Meaning |
|-------|--------|
| `status` | Always `"ok"` when the process is up. |
| `uptime` | Seconds since server start. |
| `version` | From package.json (P31 version). |
| `systems.queue` | Redis (or in-memory) message queue connected. |
| `systems.store` | Buffer SQLite store ready. |
| `systems.accommodationLog` | Accommodation log SQLite ready (LAUNCH-04). |
| `systems.ping` | Ping/heartbeat subsystem active. |
| `systems.centaur` | Centaur reachable (often `false`; not awaited on health). |
| `systems.metabolism` | Metabolism state (e.g. `"idle"`). |

### Use in load balancers and orchestrators

- **Kubernetes/Docker:** Use `/health` as liveness and readiness (200 = healthy).
- **Uptime checks:** GET every 60s; alert if non-200 or latency &gt; 200 ms.
- **Dashboards:** Plot `uptime` and boolean `systems.*`; alert if any `systems.*` becomes `false` (except `centaur` if not used).

---

## What to monitor

| Check | Action |
|-------|--------|
| Health returns 200 | Alert if 5xx or timeout. |
| `systems.queue` false | Redis down or disconnected; check REDIS_URL and Redis. |
| `systems.store` false | Buffer DB not ready; check disk and logs. |
| `systems.accommodationLog` false | Accommodation DB not initialized; check ACCOMMODATION_DB_DIR and startup logs. |
| High latency on /health | Investigate load or blocking work; target &lt; 50 ms. |
| High error rate on POST /process | Check rate limits, validation, and logs. |

No PII or message content should appear in logs (LAUNCH-02). If logging is extended, keep accommodation and process logs PII-free.

---

## Go-live verification

After going live, run the full checklist in **`docs/GO_LIVE_VERIFICATION_LAUNCH07.md`**: HTTPS, health, CORS, process endpoint, Scope ↔ Buffer, and OPSEC sign-off.

---

*The mesh holds. 🔺*
