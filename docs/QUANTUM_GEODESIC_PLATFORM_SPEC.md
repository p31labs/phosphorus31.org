# P31 Quantum Geodesic Platform — Production Spec

**Status:** Canonical vision and technical reference for the “way better” platform.  
**Alignment:** P31 Codex, Tetrahedron topology, P31 naming (P31 Compass, P31 Buffer, P31 Spectrum, etc.).  
**Coherence economy:** Platform uses **Coherence Tokens (CT)** in-app; aligns with P31 Spark / L.O.V.E. Protocol at the ledger layer.

---

## 1. Vision

A living universe on the **isotropic vector matrix (IVM)** where:

- **Geometry is law** — All creation snaps to the IVM; every block, vertex, and edge is part of a perfect lattice.
- **Coherence as currency** — Build stable structures to earn Coherence Tokens (CT). High coherence unlocks abilities, visual effects, and worlds.
- **Real-time geodesic physics** — WebAssembly-powered geodesic engine: Maxwell’s rule, stability, weak points, stress, natural frequencies.
- **Multiplayer by design** — Colyseus rooms, many concurrent builders, conflict-free collaboration, voice chat, shared annotations.
- **P31 Language** — Human-readable DSL compiling to IVM structures (tetrahedra to complex machines). Full grammar via ANTLR when needed.
- **Family Co-Op** — Four roles (foundation, structure, connection, completion) mirror the tetrahedron’s four vertices.
- **Quantum Grandfather–Cuckoo Clock** — Heart of every world: classical rhythm + quantum measurement (cuckoo on “measurement” events).

---

## 2. System Architecture

```
Client (Browser/XR)
  React 18, TypeScript, Vite
  Three.js / R3F / Drei / Postprocessing
  WebAssembly (Geodesic Engine)
  WebRTC (voice) / WebSocket (Colyseus)
  Zustand / Valtio
        ↕ WebSocket / WebRTC
Edge
  Colyseus (rooms, state sync, authoritative physics)
  Geodesic microservice (Rust + WASI)
  PostgreSQL, Redis, S3
```

---

## 3. Tech Stack

| Layer        | Technology                                              |
|-------------|----------------------------------------------------------|
| Frontend    | React 18, TypeScript, Vite, TailwindCSS                 |
| 3D          | Three.js, React Three Fiber, Drei, Postprocessing        |
| State       | Zustand (transient), Valtio (UI), React Query (API)     |
| Multiplayer | Colyseus (WebSocket), WebRTC (voice)                    |
| Geodesic    | Rust → WASM (client) + Rust microservice (server)       |
| Language    | P31 DSL (TypeScript parser; ANTLR for full grammar)     |
| Data        | PostgreSQL, Redis, S3                                   |
| Auth        | OAuth + email/password (JWT)                            |

---

## 4. Core Modules

### 4.1 Geodesic Engine

- **Current:** `ui/src/engine/structure-analysis.ts` — Maxwell’s rule, stability, weak points (pure JS).
- **Target:** Rust + WASM with same interface: `stability`, `maxwellValid`, `weakPoints`, `stress` (per edge), `naturalFrequencies`.
- **Build:** `wasm-pack build --target web --out-dir ../ui/src/geodesic-engine`.

### 4.2 P31 Language

- **Current:** `ui/src/lib/p31-compiler.ts` — regex-based; tetrahedron and simple structures.
- **Target:** ANTLR grammar (`P31.g4`) for family/structure/generate/slice/repeat; TypeScript visitor → vertices/edges.

### 4.3 WorldBuilder

- IVM lattice, structure visualization, code/visual modes, Colyseus sync.
- **Add:** QuantumClock (3D), GeodesicHeatmap (stress/weak-point overlay), voice indicator, export glTF/STL.

### 4.4 Coherence Economy (Backend)

- PostgreSQL: `users` (coherence_balance), `assets` (structure_data, price, listed), `transactions`.
- API: `GET /api/marketplace`, `POST /api/marketplace/buy`, `GET /api/user/balance`, `POST /api/user/nudge-coherence`.

### 4.5 Multiplayer

- Colyseus: room state, persist worlds to DB on leave, reload on join.
- Conflict resolution: authoritative server; clients send edits, server validates and broadcasts.
- Voice: WebRTC + signaling (e.g. Colyseus or dedicated).

---

## 5. UX Highlights

- **Onboarding:** Guided first tetrahedron + P31 language + coherence feedback.
- **Family Mode:** Four roles, UI shows each member’s contribution; bonuses when in sync.
- **Exploration:** Fly through worlds; geodesic trails.
- **VR:** WebXR — grab vertices, haptic on coherence.

---

## 6. Performance

- Instanced rendering for IVM and repeated elements.
- LOD for distant structures.
- Web Workers for parser and analysis.
- Dynamic quality (particles, shadows) from FPS (PerformanceMonitor).

---

## 7. Deployment

- Docker per service; Kubernetes; GitHub Actions; Prometheus/Grafana.
- DB snapshots; S3 versioning for assets.

---

## 8. Roadmap

- CT as ERC-20 (optional).
- AI-generated structures on IVM.
- Inter-world portals (geodesic wormholes).
- Mobile (React Native + embedded Three.js).
- Educational curricula.

---

*The mesh holds. 🔺*
