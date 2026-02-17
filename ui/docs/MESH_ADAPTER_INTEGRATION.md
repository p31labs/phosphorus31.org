# Mesh adapter — swapping simulator for real NODE ONE

**When NODE ONE firmware or Whale Channel transport is ready**, replace the in-app simulator with a real client so Sprout signals go over the mesh. No code changes in Sprout or mesh log UI; only the adapter implementation and bootstrap change.

---

## Contract (`MeshAdapter`)

Defined in `ui/src/services/meshAdapter.ts`:

```ts
export type SproutSignalType = 'break' | 'help';

export interface MeshAdapter {
  /** Emit a Sprout signal (break or help). No identity; no payload. */
  emitSproutSignal(signal: SproutSignalType): void;
}
```

- **break** — “I need a break” (quiet mode / spoons → 3).
- **help** — “I need help” (surfaces in Buffer as “Someone needs help” + optional draft).

No kid data, no identity. Signal type and timestamp only.

---

## In-app event (keep for UI)

The mesh log (e.g. MATA cockpit) subscribes to:

- **Event:** `p31:mesh:signal`
- **Detail:** `{ signal: 'break' | 'help', timestamp: number }`

Your real adapter should **still dispatch this event** after sending over the mesh so the in-app mesh log can show “Sprout → SPROUT: I need a break” (or help). Same contract as the simulator.

---

## Where to swap

**File:** `ui/src/main.tsx`

**Current (dev):** Simulator is set only in `import.meta.env.DEV`:

```ts
if (import.meta.env.DEV) {
  const { setMeshAdapter, createWhaleChannelSimulatorAdapter } = await import('./services/meshAdapter');
  setMeshAdapter(createWhaleChannelSimulatorAdapter());
  // ...
}
```

**Production (real client):**

1. Implement a `MeshAdapter` that talks to NODE ONE (e.g. WebSocket to Buffer/bridge, or serial/Web Serial to device).
2. In bootstrap, when real transport is available:
   - Create the real adapter.
   - Call `setMeshAdapter(realClient)`.
3. Inside your real adapter’s `emitSproutSignal(signal)`:
   - Send the signal over the mesh/transport.
   - Optionally dispatch `p31:mesh:signal` with `{ signal, timestamp: Date.now() }` so the mesh log still updates.

Example (pseudo):

```ts
// When real client exists, e.g.:
const realClient = createNodeOneMeshAdapter(transport); // you implement
setMeshAdapter(realClient);
```

---

## WebSocket adapter (hardware on board)

When the Buffer (or a mesh bridge) is running, set `VITE_MESH_WS_URL` to its WebSocket URL (e.g. `ws://localhost:4000`). Scope will use `createNodeOneWebSocketAdapter(wsUrl)` at bootstrap and send Sprout signals over WS. Payload: `{ type: 'sprout_signal', signal: 'break' | 'help', timestamp }`. The Buffer WebSocket server accepts this and broadcasts to all connected clients.

## Checklist for real NODE ONE client

- [x] WebSocket adapter: `createNodeOneWebSocketAdapter(wsUrl)` — set `VITE_MESH_WS_URL` when Buffer/bridge is on board.
- [ ] Implement `MeshAdapter` for direct device (e.g. Whale Channel / LoRa): `emitSproutSignal('break' | 'help')` sends over your transport (Whale Channel / LoRa / WebSocket bridge).
- [x] No identity or kid data in the payload.
- [x] After sending, dispatch `p31:mesh:signal` with `{ signal, timestamp }` so Scope mesh log stays in sync.
- [x] Call `setMeshAdapter(realClient)` at app bootstrap (e.g. in `main.tsx` when transport is ready).
- [x] Dev path: keep simulator when `import.meta.env.DEV` and no real transport; production or “device connected” path: use real adapter.

---

*The mesh holds. 🔺*
