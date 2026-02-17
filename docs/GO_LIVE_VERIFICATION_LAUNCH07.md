# LAUNCH-07: Go-Live Verification

**Date:** 2026-02-16  
**Purpose:** Post-launch smoke tests and production readiness sign-off. Run after website and/or Shelter are live.

---

## Prerequisites

- LAUNCH-01 (integration tests) and LAUNCH-03 (benchmarks) passing in a pre-production environment.
- LAUNCH-02 (security audit) and LAUNCH-04 (persistence) addressed per their reports.

---

## 1. Website (phosphorus31.org)

**When:** After pushing to Cloudflare Pages (or other host) and adding custom domain.

| Check | How | Pass |
|-------|-----|------|
| Site loads over HTTPS | Open https://phosphorus31.org | [ ] |
| Certificate valid | Browser shows valid lock; no mixed content | [ ] |
| Index and key routes | /, /about, /docs (if present) load | [ ] |
| robots.txt | https://phosphorus31.org/robots.txt returns 200 | [ ] |
| sitemap.xml | https://phosphorus31.org/sitemap.xml returns 200 | [ ] |
| Mobile OK | Resize or real device; no horizontal scroll / broken layout | [ ] |
| No secrets in client | View source; no API keys or env in HTML/JS | [ ] |

**Quick curl (from repo or any shell):**

```bash
curl -sI https://phosphorus31.org | head -5
curl -sI https://phosphorus31.org/robots.txt
curl -sI https://phosphorus31.org/sitemap.xml
```

---

## 2. P31 Shelter (Buffer backend)

**When:** After Shelter is running in production (or staging) on a known URL.

| Check | How | Pass |
|-------|-----|------|
| Health endpoint | GET {SHELTER_URL}/health returns 200, JSON with status/uptime/version/systems (queue, store, accommodationLog, ping) | [ ] |
| Latency | Health response < 50 ms (p99) from same region | [ ] |
| CORS | Request from Scope origin (e.g. scope.p31.io or localhost:5173) has valid CORS headers | [ ] |
| Process | POST {SHELTER_URL}/process with valid body returns voltage + triage | [ ] |
| No PII in logs | Trigger a process; confirm logs have no message content or real names | [ ] |

**Quick curl (replace BASE with actual Shelter URL):**

```bash
BASE=https://your-shelter-host.example.com
curl -s "$BASE/health" | head -5
curl -s -X POST "$BASE/process" -H "Content-Type: application/json" -d "{\"content\":\"Hello\",\"source\":\"manual\"}" | head -5
```

---

## 3. Scope (P31 Spectrum) ↔ Buffer

**When:** Scope is built and pointed at production (or staging) Buffer.

| Check | How | Pass |
|-------|-----|------|
| Buffer URL env | VITE_BUFFER_URL (or equivalent) set to live Shelter URL | [ ] |
| Health in UI | Scope dashboard shows "Buffer connected" or equivalent when backend is up | [ ] |
| Process from Scope | Send a test message through Scope; it appears in Tasks / history | [ ] |
| WebSocket (if used) | Sprout signal or mesh event reaches Scope when WS URL is set | [ ] |

---

## 4. OPSEC and compliance

| Check | How | Pass |
|-------|-----|------|
| No full names | Grep public-facing site and app bundles for operator/kid surnames | [ ] |
| No addresses/case numbers | Same; no home address, city/ZIP, or case/docket refs in client code | [ ] |
| .env not deployed | Production build does not embed .env contents; use host env only | [ ] |

---

## 5. Sign-off

- **Website only:** Complete section 1 and 4. Sign-off = all checks passed.
- **Website + Shelter:** Complete sections 1, 2, and 4. Optional: section 3 if Scope is live.
- **Full stack (Web + Shelter + Scope):** Complete all sections.

**Sign-off template:**

```text
LAUNCH-07 Go-Live Verification — [DATE]
- Website: [ PASS / FAIL / N/A ]
- Shelter: [ PASS / FAIL / N/A ]
- Scope ↔ Buffer: [ PASS / FAIL / N/A ]
- OPSEC: [ PASS / FAIL ]
- Notes: [ any follow-ups ]
```

---

## Related

- **MONITORING_LAUNCH07.md** — Health endpoint contract and what to monitor.
- **PREP_FOR_LAUNCH.md** (repo root) — Pre-flight and launch steps.
- **apps/web/LAUNCH_NOW.md** — Website deploy and post-deploy checklist.
- **LAUNCH-01** — Integration tests (run before go-live).
- **LAUNCH-03** — Performance report (benchmarks and bundle sizes).

🔺 The mesh holds.
