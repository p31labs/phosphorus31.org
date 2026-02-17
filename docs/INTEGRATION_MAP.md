# P31 Labs — Integration Map
## Complete system topology and contract verification

**Generated:** 2026-02-14  
**Status:** Integration testing phase  
**Purpose:** Document all connections between The Scope, The Buffer, The Centaur, and NODE ONE

---

## SYSTEM TOPOLOGY

```
┌─────────────────────────────────────────────────────────────────┐
│                         THE SCOPE (UI)                           │
│  React + TypeScript + Vite                                       │
│  Port: 5173 (dev) / 3000 (prod)                                 │
└─────────────────────────────────────────────────────────────────┘
         │                    │                    │
         │ HTTP + WS           │ HTTP + WS          │ WiFi AP
         │                     │                    │
         ▼                     ▼                    ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  THE CENTAUR    │   │  THE BUFFER     │   │   NODE ONE      │
│  (Backend AI)   │   │  (Voltage)      │   │   (ESP32-S3)    │
│  Port: 3000     │   │  Port: 4000     │   │   Port: 80      │
└─────────────────┘   └─────────────────┘   └─────────────────┘
         │                    │                    │
         │ HTTP                │                    │ LoRa
         │                     │                    │
         ▼                     ▼                    ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  PostgreSQL     │   │  Redis          │   │  Meshtastic     │
│  Port: 5432     │   │  Port: 6379     │   │  Mesh Network   │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

---

## INTEGRATION MATRIX

### 1. SCOPE → CENTAUR

| Protocol | Endpoints | Purpose | Auth | Status |
|----------|-----------|---------|------|--------|
| HTTP | `GET /health` | Health check | None | ✅ |
| HTTP | `GET /api/messages` | Get message history | None | ✅ |
| HTTP | `GET /api/messages/:messageId` | Get specific message | None | ✅ |
| HTTP | `POST /api/messages` | Send message | None | ✅ |
| HTTP | `GET /api/spoons/today/:memberId` | Get spoon count | None | ✅ |
| HTTP | `POST /api/spoons/log` | Log spoon activity | None | ✅ |
| HTTP | `GET /api/spoons/history/:memberId` | Get spoon history | None | ✅ |
| WebSocket | `ws://localhost:3000/ws` | Real-time updates | None | ⚠️ Not implemented |

**Client:** `ui/src/services/centaur.service.ts`  
**Server:** `SUPER-CENTAUR/src/core/super-centaur-server.ts`

**Contract:**
- Request: `{ content: string, source?: string, priority?: string, metadata?: object }`
- Response: `{ success: boolean, messageId?: string, response?: string, error?: string }`

**Error Handling:**
- Scope handles offline Centaur gracefully (returns empty arrays, shows offline indicator)
- Timeout: 30s default (browser fetch)

---

### 2. SCOPE → BUFFER

| Protocol | Endpoints | Purpose | Auth | Status |
|----------|-----------|---------|------|--------|
| HTTP | `GET /health` | Health check | None | ✅ |
| HTTP | `POST /api/messages` | Submit message for voltage scoring | None | ✅ |
| HTTP | `GET /api/messages` | Get message history | None | ✅ |
| HTTP | `GET /api/messages/:messageId` | Get message status | None | ✅ |
| HTTP | `GET /api/queue/status` | Get queue status | None | ✅ |
| HTTP | `GET /api/ping/status` | Get ping grid status | None | ✅ |
| HTTP | `POST /api/ping/heartbeat` | Send heartbeat | None | ✅ |
| HTTP | `GET /api/messages/stats` | Get message statistics | None | ✅ |
| HTTP | `GET /api/monitoring/metrics` | Get monitoring metrics | None | ✅ |
| WebSocket | `ws://localhost:4000` | Real-time updates | None | ✅ |

**Client:** `ui/src/services/buffer.service.ts`  
**Server:** `cognitive-shield/src/server.ts`

**Contract:**
- Request: `{ message: string, priority?: 'low'|'normal'|'high'|'urgent', metadata?: object }`
- Response: `{ success: boolean, messageId: string, status: string, priority: string, filterReason?: string }`

**WebSocket Messages:**
- `{ type: 'subscribe', channel: 'buffer' }` → Subscribe to updates
- `{ type: 'status', data: {...} }` → Queue status
- `{ type: 'batch_processed', count: number, priorities: {...} }` → Batch completion
- `{ type: 'alerts', alerts: [...] }` → Health alerts

**Error Handling:**
- Scope handles offline Buffer gracefully (returns default values, shows offline indicator)
- Heartbeat failures are silent (debug log only)

---

### 3. BUFFER → CENTAUR

| Protocol | Endpoints | Purpose | Auth | Status |
|----------|-----------|---------|------|--------|
| HTTP | `GET /health` | Health check | Optional API key | ✅ |
| HTTP | `POST /api/messages` | Forward processed message for AI translation | Optional API key | ✅ |

**Client:** `cognitive-shield/src/centaur-client.ts`  
**Server:** `SUPER-CENTAUR/src/core/super-centaur-server.ts`

**Contract:**
- Request: `{ content: string, source: string, priority: string, metadata: object, timestamp: string }`
- Response: `{ messageId?: string, response?: string, content?: string }`

**Retry Logic:**
- Max retries: 3 (configurable via `CENTAUR_RETRY_COUNT`)
- Retry delay: 1000ms * attempt (configurable via `CENTAUR_RETRY_DELAY`)
- Exponential backoff with jitter

**CRITICAL FALLBACK:**
- Buffer MUST function WITHOUT Centaur
- Voltage scoring works locally (no Centaur dependency)
- AI translation is enhancement only
- If Centaur is down, message is saved locally but marked as "translation pending"
- Queue drains when Centaur comes back online

---

### 4. CENTAUR → BUFFER

| Protocol | Endpoints | Purpose | Auth | Status |
|----------|-----------|---------|------|--------|
| HTTP | `POST /api/buffer/message` | Submit message to Buffer | None | ✅ |
| HTTP | `GET /api/buffer/status` | Get Buffer queue status | None | ✅ |
| HTTP | `GET /api/buffer/ping` | Get ping status | None | ✅ |
| HTTP | `POST /api/buffer/heartbeat` | Send heartbeat | None | ✅ |

**Client:** `SUPER-CENTAUR/src/buffer/buffer-client.ts`  
**Server:** `cognitive-shield/src/server.ts`

**Contract:**
- Request: `{ message: string, priority?: string, metadata?: object }`
- Response: `{ success: boolean, messageId?: string, status?: string }`

**Note:** This is reverse flow (Centaur can push to Buffer), but primary flow is Buffer → Centaur.

---

### 5. SCOPE → NODE ONE (WiFi AP)

| Protocol | Endpoints | Purpose | Auth | Status |
|----------|-----------|---------|------|--------|
| HTTP | `GET /api/status` | Device status (battery, WiFi, LoRa) | None | ⚠️ Mock only |
| HTTP | `POST /api/audio/record` | Start audio recording | None | ⚠️ Mock only |
| HTTP | `POST /api/audio/stop` | Stop recording, get audio buffer | None | ⚠️ Mock only |
| HTTP | `GET /api/messages` | Get LoRa messages | None | ⚠️ Mock only |
| WebSocket | `ws://192.168.4.1/ws` | Real-time device events | None | ⚠️ Mock only |

**Client:** `ui/src/bridge/api-client.ts`  
**Server:** NODE ONE firmware (ESP32-S3) — **NOT YET IMPLEMENTED**

**Contract:** TBD — Hardware not yet available for testing

**Mock Server:** For integration testing, create Express mock server at `192.168.4.1:80`

---

### 6. NODE ONE → MESH (LoRa)

| Protocol | Endpoints | Purpose | Auth | Status |
|----------|-----------|---------|------|--------|
| LoRa | Meshtastic protocol | Off-grid mesh communication | Meshtastic encryption | ⚠️ Hardware only |

**Note:** This is hardware-level communication. Integration testing will mock LoRa messages.

---

## STARTUP ORDER

1. **PostgreSQL** (if using persistent storage)
2. **Redis** (Buffer message queue)
3. **The Centaur** (`cd SUPER-CENTAUR && npm run dev`)
4. **The Buffer** (`cd cognitive-shield && npm run dev`)
5. **The Scope** (`cd ui && npm run dev`)
6. **NODE ONE** (hardware or mock server)

---

## HEALTH CHECK ENDPOINTS

| Component | Endpoint | Response |
|-----------|----------|----------|
| The Centaur | `GET /health` | `{ status: 'healthy', timestamp: string }` |
| The Buffer | `GET /health` | `{ status: 'healthy', timestamp: string, systems: {...} }` |
| The Scope | N/A (frontend) | Check via service health checks |
| NODE ONE | `GET /api/status` | `{ battery: number, wifi: {...}, lora: {...} }` |

---

## FALLBACK BEHAVIOR MATRIX

| Scenario | Scope | Buffer | Centaur | NODE ONE | Result |
|----------|-------|--------|---------|----------|--------|
| All up | ✅ | ✅ | ✅ | ✅ | Full functionality |
| Centaur down | ✅ | ✅ | ❌ | ✅ | Buffer works locally, no AI translation |
| Buffer down | ✅ | ❌ | ✅ | ✅ | Scope shows offline, can't process messages |
| NODE ONE down | ✅ | ✅ | ✅ | ❌ | No LoRa, no device status, manual input works |
| Centaur + Buffer down | ✅ | ❌ | ❌ | ✅ | Scope shows offline indicators |
| All down | ✅ | ❌ | ❌ | ❌ | Scope shows all offline, manual input cached locally |

**Key Principle:** The Buffer is the shield. It MUST work independently. Centaur enhances but is not required.

---

## AUTHENTICATION

**Current Status:** No authentication implemented (development mode)

**Future:**
- JWT tokens for Centaur API
- API keys for Buffer → Centaur
- Device certificates for NODE ONE

---

## ERROR HANDLING CONVENTIONS

1. **HTTP Errors:**
   - 400: Bad request (malformed payload)
   - 404: Not found (message ID doesn't exist)
   - 500: Internal server error
   - 503: Service unavailable (Buffer low energy, Centaur down)

2. **WebSocket Errors:**
   - Auto-reconnect with exponential backoff
   - Max reconnect attempts: 10 (configurable)
   - Reconnect interval: 3s (configurable)

3. **Timeout Values:**
   - HTTP requests: 30s default
   - WebSocket: Browser default (no timeout)
   - Buffer batch processing: 60s window (configurable)

---

## TESTING STRATEGY

1. **Unit Tests:** Each component tested independently
2. **Integration Tests:** Test each connection pair (Scope↔Centaur, Scope↔Buffer, etc.)
3. **End-to-End Tests:** Full message lifecycle across all components
4. **Degraded Mode Tests:** Test fallback behavior when components are down
5. **Load Tests:** Test with high message volume

---

## CONTRACT VERIFICATION CHECKLIST

- [x] Scope → Centaur: Request/response schemas match
- [x] Scope → Buffer: Request/response schemas match
- [x] Buffer → Centaur: Request/response schemas match
- [x] WebSocket message formats documented
- [x] Error handling exists on both sides
- [x] Timeout/retry logic implemented
- [ ] Auth mechanism agreed upon (currently none)
- [ ] NODE ONE contracts defined (hardware pending)

---

**Last Updated:** 2026-02-14  
**Next Review:** After integration tests complete
