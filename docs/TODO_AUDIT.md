# P31 TODO Audit

**Purpose:** Single list of in-code TODOs, prioritized so the work nobody wants to do is visible.  
**Updated:** 2026-02-17

---

## Priority: Launch / integration

| File | Line | TODO | Notes |
|------|------|------|--------|
| `ui/src/__tests__/integration/scope-centaur.test.ts` | 224–240 | WebSocket: connection, message reception, reconnection, buffering | Implement when live Scope–Centaur WS is required |
| `apps/shelter/src/__tests__/buffer.test.ts` | 13 | Add actual buffer tests when implementation is ready | Unblocks LAUNCH-01 confidence |
| `ui/src/hooks/useFloatingNeutralSync.ts` | 23 | `hasWebRTCPeers` when WebRTC data channels are added | Placeholder until WebRTC exists |

---

## Priority: Store / config wiring

| File | Line | TODO | Notes |
|------|------|------|--------|
| `ui/src/nodes/node-c-context/CalibrationReport.tsx` | 53–54 | ~~Get `processed` and `deepProcessingQueue` from store~~ | ✅ Done: historyService.getHistoryByType('message') + useBufferedMessages |
| `ui/src/nodes/node-c-context/CalibrationReport.tsx` | 48 | Add provider to ShieldStore if needed (currently hardcoded `ollama`) | Optional |
| `ui/src/nodes/node-a-you/SpoonMeter.tsx` | 13 | ~~Get `maxSpoons` from config~~ | ✅ Done: uses `useHeartbeatStore(s => s.operator.maxSpoons)` (from GOD_CONFIG via store init) |
| `ui/src/nodes/node-b-them/CatchersMitt.tsx` | 15–16 | ~~`batchTimeRemaining`, `processBatch` from mitt~~ | ✅ Done: shield store getBatchTimeRemaining + processBatchNow; component polls + Process Now |
| `ui/src/nodes/node-b-them/MessageList.tsx` | 10 | ~~Get message history from store~~ | ✅ Done: historyService.getHistoryByType('message') + useProcessedMessage fallback |
| `ui/src/nodes/node-c-context/MeshStatus.tsx` | 7 | ~~Get mesh status from device store~~ | ✅ Done: useMeshConnection (Buffer/WebSocket); LoRa/WiFi N/A until device API |
| `apps/shelter/src/components/ModuleMaker.tsx` | 48 | Get user spoons from actual spoon budget | Shelter ↔ Scope spoon state |
| `ui/src/lib/catchers-mitt.ts` | 241 | Calculate trend from history | Voltage strip trend |

---

## Priority: Stub modules (implement or remove)

| File | TODO | Notes |
|------|------|--------|
| `ui/src/lib/stress-test.ts` | Implement stress testing | Or remove if not used |
| `ui/src/lib/native-bridge.ts` | Implement native bridge for platform integration | Or remove if not used |
| `ui/src/services/module-registry.service.ts` | Implement module registry | Stub |
| `ui/src/services/navigator.service.ts` | Implement navigator service | Stub |
| `ui/src/types/module.types.ts` | Full module type definitions | Stub |
| `ui/src/stores/module.store.ts` | Full module store functionality | Stub |
| `ui/src/lib/vibe-coder.ts` | Implement vibe coder | Stub |
| `ui/src/lib/harmonic-linter.ts` | Implement harmonic linter | Stub |
| `ui/src/lib/fisher-escola-physics.ts` | Implement Fisher–Escolà physics engine | Stub |
| `ui/src/lib/family-mesh.ts` | Implement family mesh | Stub |
| `ui/src/nodes/node-c-context/TimelineView.tsx` | Implement timeline view | Placeholder component |
| `apps/shelter/src/lib/module-sandbox.ts` | Execute module code safely | Security-critical when enabled |

---

## Priority: Product / engine

| File | Line | TODO | Notes |
|------|------|------|--------|
| `ui/src/lib/p31-compiler.ts` | 3 | translate, scale, etc. for World Builder | Base tetrahedron + Sierpinski done |
| `ui/src/services/geodesic-engine.ts` | 192–193 | HumanOS detection, extract domain from sender | Enriches ProcessedMessage |

---

## Schema sync (maintenance)

- **`shared/schema/GameState.ts`** and **`server/schema/GameState.ts`** must be kept in sync (server has its own copy so `rootDir` build works). When you change Colyseus schema, update both.

---

## How to use this doc

1. **Before launch:** Clear or implement all “Launch / integration” and “Store / config wiring” TODOs that block preflight.
2. **Stub modules:** Either implement or delete; avoid leaving non-functional exports in the build.
3. **Product / engine:** Schedule with roadmap; not blocking for basic launch.

The mesh holds. 🔺
