# P31 Inventory and Dependency Map

**Purpose:** Factual inventory of product-facing artifacts, build status, runtime dependencies, and blocking issues. No marketing — "is" and "depends on" only.

**Date:** 2026-02-15  
**Owner:** Cursor (Build agent) — per MVP research workflow

---

## 1. Product-facing artifacts

### 1.1 Scope (dashboard / visualization)

| Artifact | Location | Type | Notes |
|----------|----------|------|--------|
| **Scope (GAS)** | External — Google Apps Script | Production | 1,888 lines, 15 files. Daily driver since late 2025. Medication tracker, spoon economy, coherence, ping, alerts, accommodation log. Not in repo. |
| **Scope (React)** | `ui/` | React SPA | React 18, TypeScript, Vite, Tailwind, Zustand, Three.js/R3F. Tetrahedron nodes (node-a-you, node-b-them, node-c-context, node-d-shield). Engine (voltage, spoon, shield-filter, geodesic). Bridge (api-client, websocket-client, lora-bridge, audio-bridge). |

### 1.2 Buffer (communication processing)

| Artifact | Location | Type | Notes |
|----------|----------|------|--------|
| **Buffer server** | `apps/shelter/` | Node.js Express | Main: `src/server/index.ts`. Routes: POST `/process`, GET `/history`, GET `/accommodation-log`, GET `/health`. Voltage/pattern/triage in engine; CentaurClient forwards to Centaur. |
| **Buffer client (browser)** | Same repo, frontend | PWA / in-ui | Voltage display, CatchersMitt, etc. can live in `ui/` (node-b-them) talking to Buffer server. |

### 1.3 Centaur (backend AI protocol)

| Artifact | Location | Type | Notes |
|----------|----------|------|--------|
| **SUPER-CENTAUR server** | `SUPER-CENTAUR/` | Node.js Express | Entry: `src/core/super-centaur-server.ts`. Single server; many routes and mounted routers. |

**User-facing routes (main server):**

- Health: `GET /health`, `GET /api/health/quantum-brain/status`
- Auth: `POST /api/auth/login`, `register`, `GET /api/auth/me`, MFA routes
- Legal: `POST /api/legal/generate`, `POST /api/legal/emergency`
- Medical: `POST /api/medical/document`, `GET /api/medical/conditions`
- Blockchain: `POST /api/blockchain/deploy`, `GET /api/blockchain/status`
- Agents: `POST /api/agents/create`, `GET /api/agents/status`
- Chat: `POST /api/chat/message`
- Messages (from Buffer): `POST /api/messages`, `GET /api/messages`, `GET /api/messages/:id`
- Family: `GET /api/family/status`, `POST /api/family/support`
- Google Drive: auth, callback, status, files, import, disconnect
- Wallet/L.O.V.E.: transaction, transfer (and more in server)
- Game: structures, progress (via routes)
- Spoons: today, log, history
- Routers: `/api/quantum-brain/sop`, `/api/quantum-lab`, `/api/cognitive-prosthetics`, `/api/strategic/deadlines`, `/api/synergy`

### 1.4 Node One (hardware + firmware)

| Artifact | Location | Type | Notes |
|----------|----------|------|--------|
| **Firmware (primary)** | `firmware/node-one-esp-idf/` | ESP-IDF v5.x C/C++ | Target: ESP32-S3-Touch-LCD-3.5B. main/main.cpp, BSP, audio (ES8311), LoRa (E22-900M30S), MCP23017 buttons, LVGL display, WiFi AP + HTTP server + WebSocket. SWARM 08 complete. |
| **P31 Buffer Web (on device)** | Optional | Served from device | Not required for MVP hardware test (per SWARM 08). HTTP server can serve static files; ui/ can be built for SPIFFS (`npm run build:spiffs` in ui/, copy to firmware SPIFFS). |
| **Other firmware variants** | Various | — | Git status and docs reference ESP32-S3-Touch-LCD-3.5-2Dand3D, ESP32-S3-Touch-LCD-3.5-Demo, etc. Primary build path documented: `firmware/node-one-esp-idf` (BUILD_AND_TEST.ps1, QUICK_START_BUILD.md). |

### 1.5 Website (public)

| Artifact | Location | Type | Notes |
|----------|----------|------|--------|
| **phosphorus31.org** | `website/` | Static HTML/JS/CSS | Landing, docs, roadmap. Deployment: GitHub + Cloudflare (manual steps per MVP_FINAL_PUSH_CHECKLIST). |

### 1.6 Donation wallet

| Artifact | Location | Type | Notes |
|----------|----------|------|--------|
| **Docs** | `docs/donation-wallet.md` (in phenix-navigator-creator67) | Doc only | Architecture: Chrome extension (Manifest V3), ERC-5564, Node One signing, memo-to-file. |
| **Code** | Separate workspace: `phenix-donation-wallet-v2/donation-wallet-v2/` | Chrome extension + firmware | popup.js, background.js, lib (stealth, memo, webusb, vault, error-recovery), firmware (e.g. phenix_wallet_webusb.ino). Not inside phenix-navigator-creator67 repo. |

---

## 2. Build status (factual)

| Component | Build command | Status (as documented / observed) |
|-----------|----------------|-----------------------------------|
| **cognitive-shield** | `npm run build` (tsc) | Builds. Tests: vitest. |
| **ui** | `npm run build` (vite build) | MVP_FINAL_PUSH_STATUS: type errors (~400+), non-blocking for MVP; build may still succeed. Known: GOD_CONFIG/store type mismatches, HeartbeatPanel, SomaticRegulation, CalibrationReport, ResponseComposer, shield.store, buffer.store. |
| **SUPER-CENTAUR** | `npm run build` (tsc \|\| exit 0) | Build script exits 0 even on TS errors. CLAUDE.md: 451 TS errors (noUncheckedIndexedAccess). Code runs; type safety incomplete. |
| **firmware (node-one-esp-idf)** | ESP-IDF build (BUILD_AND_TEST.ps1) | SWARM 08: ready for build; hardware-dependent for flash/test. Prerequisites: ESP-IDF v5.5, board. |
| **website** | Static files | No build step; deploy as-is. |
| **Donation wallet** | Separate repo build | Not inventoried in this repo. |

---

## 3. Runtime dependencies (who calls whom)

### 3.1 Default ports (from code and tests)

- **Buffer server:** 3000 in cognitive-shield startServer (optional override). Docs/tests often use 4000 for Buffer — confirm in env.
- **Centaur server:** 3000 (config.server.port).
- **Scope (React) dev:** Vite default (e.g. 5173).
- **Node One HTTP (device):** 8080 in ui integration tests; firmware exposes AP + HTTP server.

### 3.2 Dependency graph (facts only)

```
GAS Scope (external)
  └── no in-repo runtime dependency

Buffer server (cognitive-shield)
  ├── Optional: SQLite (dbPath), Redis (queue/real-time)
  └── CentaurClient: POST to CENTAUR_API_URL/api/messages (default localhost:3000)

Centaur (SUPER-CENTAUR)
  ├── BufferClient: BUFFER_URL (default localhost:4000) — GET/POST /api/messages, /api/queue/status, /api/ping/status
  ├── DataStore (in-memory, SQLite-backed)
  ├── Optional: PostgreSQL, Redis, OpenAI, Neo4j, Google APIs (config-driven)
  └── Receives: POST /api/messages from Buffer (when Buffer forwards after process)

Scope (React, ui/)
  ├── Buffer: VITE_BUFFER_URL or constants BUFFER.BASE (default localhost:4000) — for voltage/process
  ├── Centaur: VITE_CENTAUR_API_URL or constants CENTAUR.BASE (default localhost:3000) — health, /api/messages, /api/spoons/*
  └── Node One: ApiClient baseUrl (e.g. localhost:8080 for device HTTP)

Node One (firmware)
  ├── WiFi AP + HTTP server; optional static web (SPIFFS)
  └── Can receive HTTP from Scope or other clients; LoRa mesh independent
```

### 3.3 API shape mismatch (blocking integration)

- **Buffer server** exposes: `POST /process`, `GET /history`, `GET /accommodation-log`, `GET /health`.
- **Centaur BufferClient** expects: `POST /api/messages`, `GET /api/queue/status`, `GET /api/ping/status`, `GET /api/messages/:id`.
- **Conclusion:** Centaur cannot use its BufferClient against the current Buffer server without an adapter or Buffer adding/compatibility routes. Buffer → Centaur works (Buffer’s CentaurClient posts to Centaur `/api/messages`). Centaur → Buffer (polling/status) does not match current Buffer API.

---

## 4. If we ship MVP with GAS Scope only (no React Scope)

| Required in repo | Purpose |
|------------------|---------|
| **Buffer (cognitive-shield)** | Voltage processing, accommodation log; GAS or other clients can call POST /process. |
| **Centaur** | Optional for “GAS-only” MVP if GAS does not talk to Centaur. If GAS or Buffer forwards to Centaur, Centaur required. |
| **Node One firmware** | If device ships: build and flash from firmware/node-one-esp-idf. |
| **Website** | For public/accelerator: phosphorus31.org from website/. |

**Not required for this slice:** ui/ (React Scope), unless Node One serves a minimal web UI from SPIFFS.

---

## 5. If we ship MVP with React Scope (ui/)

| Required in repo | Purpose |
|------------------|---------|
| **ui/** | Dashboard, nodes, engine, bridge. |
| **Buffer (cognitive-shield)** | ui/ expects Buffer at default 4000 for voltage/process. |
| **Centaur (SUPER-CENTAUR)** | ui/ expects Centaur at default 3000 for health, messages, spoons. |
| **Node One** | Optional for full demo; ui/ can talk to device HTTP (e.g. 8080). |
| **Website** | As above. |

**Additional:** Resolve or accept ui/ type errors; ensure Buffer and Centaur are running and reachable at the URLs ui/ uses (env or constants). Fix or adapt Centaur ↔ Buffer API shape if Centaur must query Buffer status.

---

## 6. Blocking issues summary

| Issue | Where | Impact |
|-------|--------|--------|
| Buffer API vs Centaur BufferClient | Buffer has /process, /history, /health. Centaur expects /api/messages, /api/queue/status, /api/ping/status. | Centaur cannot poll Buffer or submit via BufferClient as implemented. |
| ui/ TypeScript errors | GOD_CONFIG, stores, nodes (HeartbeatPanel, SomaticRegulation, CalibrationReport, ResponseComposer, shield.store, buffer.store) | Build may succeed; type safety and maintainability reduced. |
| Centaur TypeScript errors | noUncheckedIndexedAccess and others (451 per CLAUDE.md) | Build uses \|\| exit 0; runtime works; type safety incomplete. |
| Buffer default port | Code uses 3000 in startServer; some docs/tests use 4000 | Must align port and CENTAUR_API_URL / BUFFER_URL everywhere. |
| Firmware “right” version | Multiple board/variants (e.g. 3.5B, 2Dand3D, Demo) | Single canonical target for MVP: node-one-esp-idf (ESP32-S3-Touch-LCD-3.5B) per SWARM 08. |

---

## 7. One-line wiring summary

- **GAS Scope:** External; no repo runtime deps.
- **Buffer:** Standalone server; forwards to Centaur; Centaur’s BufferClient does not match Buffer’s API.
- **Centaur:** Depends on Buffer only for *receiving* messages (Buffer → Centaur). Depends on DataStore, optional DB/Redis/APIs.
- **React Scope:** Depends on Buffer + Centaur (and optionally Node One HTTP) at known URLs.
- **Node One:** Independent; can serve HTTP and optional SPIFFS web; LoRa standalone.
- **Donation wallet:** Separate codebase; doc in repo; not wired into Buffer/Centaur/Scope in this inventory.

---

*Document generated for MVP research workflow. Update when artifacts or dependencies change.*
