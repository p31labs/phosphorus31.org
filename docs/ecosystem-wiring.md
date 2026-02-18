# P31 Ecosystem Wiring

How the P31 components communicate.

## Architecture

```
  Scope (5173)          Shelter PWA (5174)
       \                    /
        \                  /
    ShelterBridge       ShelterBridge
          \              /
           Centaur (3001)
          /api/shelter/*
               |
          BufferClient
               |
       Buffer Server (4000)
          /api/messages
          /api/ping/heartbeat
               |
          ESP32 / LoRa mesh
```

## Port Map

| Service | Port | Role |
|---------|------|------|
| Buffer Server | 4000 | Hardware message queue; accepts messages from Centaur, drains to ESP32 on heartbeat |
| Centaur | 3001 | Backend AI protocol; exposes `/api/shelter/*` for Scope, proxies to Buffer Server |
| Scope | 5173 | Frontend dashboard; calls Centaur via ShelterBridge |
| Shelter PWA | 5174 | Communication processing UI; same ShelterBridge contract |

## Data Flow

### L.O.V.E. Mining (Scope -> Centaur)

1. User builds a molecule in Scope
2. `loveMining.store.ts` calls `mine()` from game-engine
3. New LOVE balance computed locally, persisted to localStorage
4. Fire-and-forget: `ShelterBridge.syncState(fingerprint, { wallet })` sends to Centaur
5. Centaur stores in-memory (future: DataStore/PGLite)

### Genesis (Scope -> Centaur)

1. User completes Quantum Hello World ceremony
2. `game-client.ts#genesis()` calls `initGameClient()` + `ShelterBridge.registerMolecule()`
3. Molecule registered on Centaur's `/api/shelter/molecule`

### Hardware Delivery (Centaur -> Buffer Server -> ESP32)

1. Centaur's BufferClient posts message to `http://localhost:4000/api/messages`
2. Buffer Server queues the message
3. ESP32 pings heartbeat at `/api/ping/heartbeat` with its `nodeId`
4. Buffer Server drains matching queue entries and returns them in the response
5. ESP32 processes the messages (haptic, display, etc.)

## Canonical Identity

**`fingerprint`** is the single identity across all systems.

- Generated during molecule formation (Quantum Hello World)
- Stored in localStorage at `p31:molecule`
- Used in all ShelterBridge calls
- Used as wallet key on Centaur
- Used as message recipient on Buffer Server

Do not introduce `memberId`, `userId`, or `operatorOdometer` as alternatives.

## Environment Variables

| Variable | Where | Default | Purpose |
|----------|-------|---------|---------|
| `VITE_SHELTER_URL` | Scope, Shelter PWA | `http://localhost:3001` | Centaur's Shelter API base URL |
| `VITE_SHELTER_KEY` | Scope, Shelter PWA | (empty) | Optional API key |
| `PORT` | Centaur | 3001 | Centaur listen port |
| `BUFFER_URL` | Centaur | `http://localhost:4000` | Buffer Server URL for BufferClient |
| `PORT` | Buffer Server | 4000 | Buffer Server listen port |
