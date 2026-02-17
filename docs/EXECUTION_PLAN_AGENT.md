# P31 Agent Execution Plan

**Purpose:** Plan-first work: prioritize from TODO_AUDIT + PREP_FOR_LAUNCH, then execute in order.  
**Updated:** 2026-02-17

---

## 1. Plan (source of truth)

### Phase A — Maintenance / unblock launch

| # | Task | Source | Status |
|---|------|--------|--------|
| A1 | Schema sync: `shared/schema/GameState.ts` ↔ `server/schema/GameState.ts` | TODO_AUDIT § Schema sync | ✅ Verified in sync |
| A2 | Wire SpoonMeter `maxSpoons` from config/store | TODO_AUDIT § Store wiring | ✅ Done |
| A3 | (Optional) Add buffer test when implementation ready | TODO_AUDIT § Launch/integration | Deferred |

### Phase B — Store / config wiring (TODO_AUDIT)

| # | File | TODO | Notes |
|---|------|------|--------|
| B1 | `SpoonMeter.tsx` | Get `maxSpoons` from config | ✅ Use heartbeat store (already has MetabolismConfig) |
| B2 | `CalibrationReport.tsx` | processed / deepProcessingQueue from store | ✅ Done: historyService + useDeepProcessingQueue |
| B3 | `CatchersMitt.tsx` | batchTimeRemaining, processBatch from mitt | ✅ Done: getBatchTimeRemaining + processBatchNow on shield store |
| B4 | `MessageList.tsx` | Message history from store | ✅ Done: historyService.getHistoryByType('message') + currentMessage |
| B5 | `MeshStatus.tsx` | Mesh status from device store | ✅ Done: useMeshConnection, genesis (phenix, isOnline, meshPeers), floatingNeutral (topology, ground) |

#### Phase B completion summary (2026-02-17)

- **Shield store:** `deepProcessingQueue` in state and synced with `bufferedMessages`; `getBatchTimeRemaining()` → `mitt.getBatchTimeRemaining()` (ms); `processBatchNow()` releases all buffered IDs via `mitt.release(id)` then updates state; `useDeepProcessingQueue` selector added.
- **CalibrationReport:** `processed` from `historyService.getHistoryByType('message')`; `deepProcessingQueue` from `useDeepProcessingQueue()`.
- **CatchersMitt:** Uses store `useProcessBatchNow` and `useBatchTimeRemaining` (polling + Process Now button); store implements the APIs.
- **MessageList:** Uses `historyService.getHistoryByType('message')` and `useProcessedMessage()`.
- **MeshStatus:** Uses `useMeshConnection()`, `useGenesisStore()` (phenixConnected, isOnline, meshPeers), `useFloatingNeutralStore()` (networkTopology, groundReference). UI shows Buffer/WebSocket, NODE ONE (LoRa), Network, peers/topology/ground.
- **RestorativeReset:** `useShieldStore().deepProcessingQueue` is satisfied by the new store state.

### Phase C — Stub modules (implement or remove)

Per TODO_AUDIT: either implement or delete; avoid non-functional exports.  
Stubs: stress-test, native-bridge, module-registry, navigator.service, module.types, module.store, vibe-coder, harmonic-linter, fisher-escola-physics, family-mesh, TimelineView, module-sandbox.

### Phase D — Pre-flight (PREP_FOR_LAUNCH)

- No secrets in repo; OPSEC check
- Website local check and go-live steps
- Shelter build/run/verify
- Scope + Sprout + Shelter dev and verify

---

## 2. Work the plan (this session)

1. **A1** — Confirm schema sync (read both files; already done: identical).
2. **A2 / B1** — SpoonMeter: get `maxSpoons` from `useHeartbeatStore(state => state.operator.maxSpoons)`; remove hardcoded 12 and TODO.
3. **Doc** — Update TODO_AUDIT to mark SpoonMeter row done (or remove row and add “Done” note).

---

## 3. How to use

- **Before launch:** Complete Phase A and as much of Phase B as blocks preflight.
- **Stub modules:** Schedule Phase C; implement or remove to avoid dead code.
- **After each change:** Run `npm run test:scope:unit` (or root `npm test`) to confirm nothing regressed.

The mesh holds. 🔺
