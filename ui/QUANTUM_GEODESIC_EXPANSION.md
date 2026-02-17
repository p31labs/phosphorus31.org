# Quantum Geodesic Platform Expansion

## Implemented

### 1. Quantum Grandfather-Cuckoo Clock (full implementation)

Placeable 3D object in the main Canvas at `[5, 0, 5]`.

- **Cabinet** — Wood-style body with P31 green trim.
- **BlochSphereFace** — Clock face as Bloch sphere; time encoded in rotation, coherence as color/glow and percentage label.
- **Pendulum** — Swing amplitude = `coherence * 0.5 + 0.3`; low coherence adds slight erratic motion.
- **CuckooNest** — Door and cuckoo; when `triggerChirpCount` increments (e.g. structure completed), door opens, cuckoo extends, and a procedural chirp plays via Web Audio. Chirp melody reflects stability (major vs minor intervals).

**Integration**

- Uses `useCoherence()` from `stores/quantum.store.ts`.
- Optional `triggerChirpCount` for game engine: increment when a player completes a structure to trigger the cuckoo.
- Optional `onMeasurement` callback and `measurementStability` for chirp tuning.

**Files**

- `src/components/QuantumClock/QuantumClock.tsx` — Main container.
- `src/components/QuantumClock/Cabinet.tsx`
- `src/components/QuantumClock/BlochSphereFace.tsx`
- `src/components/QuantumClock/Pendulum.tsx`
- `src/components/QuantumClock/CuckooNest.tsx`
- `src/components/QuantumClock/cuckooChirp.ts` — Web Audio chirp/melody.
- `src/components/QuantumClock/index.ts`

**App**

- Clock is mounted in the main 3D group next to `IVMLattice`, `OmegaProtocol`, `QuantumVisualization3D`, `GameEngine3D`.

---

### 2. Geodesic Portal (stub)

Types and a minimal ring component for future “quantum teleportation” between IVM points.

- **Types** — `GeodesicPortalState`, `CreatePortalPayload` (fromId, toId, playerCoherence).
- **GeodesicPortalRing** — Shimmering green torus; `active` and `scale` props; rotation animation. Placeholder for full ring + particle flow.

**Files**

- `src/components/GeodesicPortal/types.ts`
- `src/components/GeodesicPortal/GeodesicPortalRing.tsx`
- `src/components/GeodesicPortal/index.ts`

**Next steps for portals**

- Server/room handler: `createPortal(fromId, toId)` with cost = geodesic distance × 0.1, coherence check.
- Wire portal state into World Builder / game engine.
- Add second ring at destination and particle flow along geodesic path.

---

## Roadmap (from spec — not yet built)

- **Oracle** — LSTM/ONNX coherence prediction; at-risk structure auras.
- **Fractal Forge** — L-system DSL extension in P31 Language; real-time growth.
- **Jitterbug Universe** — Vertex shader tetra↔octa interpolation; timing-based bonus.
- **Family Constellations** — Persistent families, shared blueprints, weekly challenges (DB + API).
- **ChronoSynclastic Infundibulum** — OT log rewind/branch (git for geometry).
- **WebXR** — `@react-three/xr`, foveated rendering, asset streaming.
- **Curriculum Packs** — Lesson modules and teacher dashboard.
- **Sonic Coherence** — Web Audio; vertices as notes, coherence as volume/pitch.
- **Mesh Guardian** — Anti-griefing classifier + community voting.
- **3D Printing Hub** — Export to STL and slicing service.

---

*The mesh holds. 🔺*
