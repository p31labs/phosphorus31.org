# P31 Quantum Geodesic Platform — Implementation Status

**Purpose:** Single source of truth for what is built and wired in the Quantum Geodesic Platform.  
**Companion:** [QUANTUM_GEODESIC_PLATFORM_SPEC.md](./QUANTUM_GEODESIC_PLATFORM_SPEC.md) (vision, architecture, roadmap).  
**Updated:** 2026-02-17

---

## 1. Canonical spec

- **`docs/QUANTUM_GEODESIC_PLATFORM_SPEC.md`** — Vision (IVM, Coherence Tokens, geodesic physics, multiplayer, P31 Language, Family Co-Op, Quantum Clock), architecture (client ↔ Colyseus/Postgres/Redis/S3), stack table, core modules, UX, performance, deployment, roadmap. Coherence Tokens (CT) aligned with P31 Spark / L.O.V.E. at the ledger.

---

## 2. Geodesic analysis (WASM-ready)

- **`ui/src/engine/structure-analysis.ts`**
  - **StructureAnalysisResult** extended with: `stress: number[]` (per-edge, 0–1), `naturalFrequencies: number[]` (for sonification/UI).
  - Weak-point rule: degree &lt; 3.
  - Sierpinski detection: `(4·4^d, 6·4^d)` → fractal stability bonus +0.05 (capped at 1); optional `fractalStabilityBonus` on result.
  - Same interface as spec’s Rust WASM; can swap in `analyze_structure(vertices, edges)` later.

---

## 3. Sierpinski scaling

- **`ui/src/utils/sierpinski.ts`** — `generateSierpinski(depth, scale, origin)` (depth 0–7), flat `vertices`/`edges`, `tetraCount`; `sierpinskiEdgeCount(depth)`, `SIERPINSKI_EDGE_WARN_THRESHOLD`.
- **`ui/src/lib/p31-compiler.ts`** — Parses `sierpinski N` and `sierpinski depth: N`; calls `generateSierpinski` with index offset.
- **`ui/src/components/WorldBuilder/StructureVisualization.tsx`** — When vertex count &gt; 64, draws vertices with a single `<points>` + BufferGeometry; line segments unchanged.
- **`ui/src/components/Game/FamilyCodingView.tsx`** — Block palette: Tetrahedron + Sierpinski (depth 0–7). “Use in World” compiles `sierpinski <depth>` or `structure tetrahedron`.

---

## 4. Colyseus and shared schema

- **`p31/shared/schema/GameState.ts`** (or equivalent) — Colyseus `Player`, `Structure`, `GameState` with `@colyseus/schema`.
- **`p31/server/schema/GameState.ts`** — Server copy for Colyseus.
- **`p31/server/rooms/GeodesicRoom.ts`** — Room with `playerMove`, `structureUpdate`, `requestCoherenceNudge`; Maxwell/stability analysis.
- **`p31/server/index.ts`** — Colyseus server, `geodesic_world` room, port 2567.
- **`ui/package.json`** — `colyseus.js` dependency.
- **`ui/.env.example`** — `VITE_COLYSEUS_URL=ws://localhost:2567`.

---

## 5. Client hooks and context

- **`ui/src/hooks/useRoom.ts`** — Colyseus room hook (dynamic import of `colyseus.js`); returns `room`, `error`, `players`, `structures`, `send`, `leave`. Room type includes `onMessage?(type, callback)` for clock sync.
- **`ui/src/contexts/GeodesicRoomContext.tsx`** — Single `useRoom('geodesic_world')`; `useGeodesicRoom()` so CoherenceSync and WorldBuilder share one connection.
- **`ui/src/hooks/useGeodesicAnalysis.ts`** — Uses JS `structure-analysis.ts`; can later branch to WASM.

---

## 6. Coherence and sync

- **`ui/src/stores/coherence.store.ts`** — `globalCoherence`, `playerCoherence`, `updateGlobalCoherence`, `updatePlayerCoherence`, `nudgeCoherence`.
- **`ui/src/components/CoherenceSync.tsx`** — Syncs room `players` / `globalCoherence` into coherence store. Place inside `GeodesicRoomProvider`.

---

## 7. P31 compiler and editor wiring

- **`ui/src/lib/p31-compiler.ts`** — `compileP31(code)` → `{ vertices, edges }`; tetrahedron + `sierpinski`/`sierpinski depth: N`.
- **`ui/src/components/P31Language/P31LanguageEditor.tsx`** — Optional `onCompile?: (vertices, edges) => void`; on Run, calls `compileP31` and `onCompile` when provided.
- **`ui/src/components/Game/FamilyCodingView.tsx`** — Optional `onUpdate?: (vertices, edges) => void`; “Use in World Builder” calls `onUpdate` with compiled structure.

---

## 8. WorldBuilder and related UI

- **`ui/src/components/WorldBuilder/CoherenceHUD.tsx`** — Reads `useCoherenceStore`; player coherence bar, global coherence %; Heart icon, ARIA.
- **`ui/src/components/WorldBuilder/StructureVisualization.tsx`** — R3F: flat `vertices`/`edges` → BufferGeometry (line segments + spheres or points when &gt; 64 vertices); P31 green, emissive.
- **`ui/src/components/WorldBuilder/GeodesicHeatmap.tsx`** — Overlay from `vertices`, `edges`, `analysis` (stress, weakPoints); edges by stress (green→red), weak-point vertices as red spheres.
- **`ui/src/components/WorldBuilder/WorldBuilder.tsx`** — Full-screen: Code and Visual tabs; Code: Add Tetrahedron, Clear, P31 Language editor; Visual: embeds FamilyCodingView. Canvas: IVM lattice (radius 20, spacing 1.5), Grid, OrbitControls, StructureVisualization, GeodesicHeatmap. Uses `useGeodesicAnalysis(vertices, edges)`; shows Stability %, Maxwell’s Rule, Weak points. Nudges coherence when adding tetrahedron / analysis &gt; 0.8. Syncs `structureUpdate` via `useGeodesicRoom()`; renders other structures from room. State: `lastMeasurementAt` for clock. Renders CoherenceHUD bottom-left; `onClose`, world id in overlay.
- **`ui/src/components/WorldBuilder/index.ts`** — Re-exports WorldBuilder, CoherenceHUD, StructureVisualization, GeodesicHeatmap.

---

## 9. Quantum Grandfather–Cuckoo Clock (Bob & Marge)

### 9.1 Full clock (love-letter version)

- **`ui/src/components/QuantumClock/QuantumClock.tsx`** — Inline Cabinet, Pendulum (BOB), CuckooNest (MARGE), WindingMechanism, Bloch-sphere face, weights. Uses `useCoherenceStore`, `useGeodesicRoom()`, optional `GameEngineContext` for `structureComplete`. World hour every 5s; chime on hour 0 and on stable structures; `worldId` optional (default `'default'`). Sends `clockWind` / `clockChime` when room exists; subscribes to room messages for sync.
- **`ui/src/components/QuantumClock/ChimeGenerator.ts`** — Class `ChimeGenerator.generateMelody(structures, type)`, `ChimeGenerator.maxwellChord(valid)`; backward-compat `generateMelody` / `maxwellChord` and `StructureLike`.
- **`ui/src/components/QuantumClock/ClockSonificationAudio.ts`** — Web Audio: `playMelody(notes)`, `playWindSound(amount)`, `playHeartWhisper()`.
- **`ui/src/components/QuantumClock/ClockSonification.tsx`** — React component that listens for `play-melody` and `wind-sound` events; used in App.
- **Subcomponents (still present):** Cabinet, BlochSphereFace, Pendulum, Weights, CuckooNest, WindingMechanism (in same folder); cuckoo uses gsap for door/bird and heart particles; BOB/MARGE text via drei.

### 9.2 Simple 3D clock (WorldBuilder)

- **`ui/src/components/3d/QuantumClock.tsx`** — 3D clock with `lastMeasurementAt`; when it changes, cuckoo animates. WorldBuilder passes `lastMeasurementAt={Date.now()}` on each compile.

---

## 10. Marketplace and App

- **`ui/src/components/Marketplace/Marketplace.tsx`** — Full-screen overlay; fetches `/api/marketplace`, mock fallback (Tetra House, IVM Dome, Coherent Prism); cards with Buy; `handleBuy(assetId)` POST to `/api/marketplace/buy`; `onClose`, Escape.
- **`ui/src/App.tsx`** — State: `showWorldBuilder`, `showMarketplace`, `currentWorldId`. Toolbar: World Builder, Marketplace. Renders WorldBuilder when `showWorldBuilder && currentWorldId`, Marketplace when `showMarketplace`. Main canvas: IVM lattice, OmegaProtocol, QuantumVisualization3D, GameEngine3D, **QuantumClock** at [5, 0, 5]. `GeodesicRoomProvider` wraps content; `<CoherenceSync />` inside. Escape closes modals.

---

## 11. Geodesic Portal (stub)

- **`ui/src/components/GeodesicPortal/types.ts`** — GeodesicPortalState, CreatePortalPayload.
- **`ui/src/components/GeodesicPortal/GeodesicPortalRing.tsx`** — Green torus, rotation, `active` prop; placeholder for full shimmer + particle flow.

---

## 12. Posner Navigation (PosnerHome)

- **`ui/src/components/Starfield.tsx`** — Canvas-based particle system. 800 stars (desktop) / 400 (mobile). Parallax with mouse/touch. Nebula clouds. Stars drift toward viewer with depth perception. Respects `prefers-reduced-motion`.
- **`ui/src/components/PosnerNav.tsx`** — SVG interactive Posner molecule (Ca₉(PO₄)₆). 9 calcium atoms = 9 route links. 6 phosphorus atoms = pulsing decoration. 3D→2D projection. 35-second rotation. Depth sorting. Hover glow + labels. Molecule hash orbit ring.
- **`ui/src/lib/ambient-engine.ts`** — Continuous atmospheric music. Drone at P31_BASE (172.35 Hz). Random pentatonic notes. Route-to-note mapping (hover atom → play its note). Reverb (8s decay, 0.6 wet). User-gesture gated.
- **`ui/src/components/PosnerHome.tsx`** — Full-screen molecule navigation replacing MeshLayout. Starfield + PosnerNav + floating HUD (P³¹ wordmark, dome name, mute toggle, LOVE balance, fingerprint, footer). Sub-routes open as overlay panels. /sprout is full-screen standalone.
- **`ui/src/routes/P31Routes.tsx`** — All routes now wrap through PosnerHome. /mesh, /scope, /fold, /wallet, /challenges, /identity, /dome/:fp, /connections, /bonding, **/studio** (Quantum Clock + World Builder, lazy-loaded).
- **`ui/src/views/StudioView.tsx`** — Studio (4th vertex): tabs for QUANTUM CLOCK (Bob & Marge) and WORLD BUILDER; lazy-loads `StudioCanvas` (R3F + GeodesicRoomProvider, CoherenceSync, ClockSonification). Excluded from strict build type-check (see §18).

---

## 13. Greenhouse (10 Standalone HTML Apps)

- **`ui/public/apps/apps.json`** — Catalog of all 10 apps with metadata.
- **`ui/public/apps/index.html`** — Standalone marketplace page. Fetches apps.json. Search, category filters, responsive grid.
- **Apps (all single-file HTML, offline-first, zero dependencies):**
  1. `spoon-counter.html` — Spoon Theory energy tracker (12 spoons, daily reset, 7-day history)
  2. `breathing-pacer.html` — Guided box breathing (4s phases, SVG circle, Web Audio chimes)
  3. `focus-timer.html` — ADHD-friendly timer (10/15/25/45 min, SVG countdown, snooze, session log)
  4. `spark-journal.html` — Thought capture (auto-save, search, export markdown)
  5. `sensory-check.html` — 5-channel sensory assessment (sliders, recommendations, sparkline history)
  6. `task-triangles.html` — Break impossible tasks into 3 steps (SVG triangle, completion animation)
  7. `stim-board.html` — Digital fidget board (toggle, spinner, pressure, slider, ripple, color — Web Audio)
  8. `shutdown-sequence.html` — End-of-day checklist (customizable, daily reset, progress bar)
  9. `sound-garden.html` — Ambient soundscapes (6 synthesized layers: rain, thunder, wind, birds, fire, waves)
  10. `mesh-ping.html` — Standalone Sprout signals (OK, HELP, LOVE, THINK — Web Audio pentatonic notes)

---

## 14. Connections View

- **`ui/src/views/ConnectionsView.tsx`** — "THE NERVOUS SYSTEM" — Shows all integration status: Gmail Buffer (GAS), Sheets Dashboard, Calendar (growing), Drive Backup (growing), Shelter Backend (auto-detect from env), Phosphorus Voice (AI key detection), Node One (growing). Expandable config. Status dots pulse when connected.

---

## 15. Bonding (Multiplayer Molecule Builder)

- **`ui/src/lib/chemistry.ts`** — Simplified chemistry engine. 20+ elements in 4 unlock tiers. Valence rules. Stability scoring. 20 known molecules (H₂O through Ca₉(PO₄)₆). Bond site calculation. Element sound frequencies. 20+ achievements across SEEDLING/SPROUT/SAPLING/CANOPY tiers.
- **`ui/src/types/bonding.ts`** — TypeScript types: GameAtom, GamePing, GamePlayer, BondingGame.
- **`ui/src/views/BondingView.tsx`** — Full game: Lobby (create/join/resume), Game (SVG canvas + periodic table + stats + pings), Completion (celebration + LOVE awards). Turn-based multiplayer via localStorage polling. Web Audio API for element sounds, turn notifications, completion chords. Ping system (💚 NICE, 🤔 HMMMM, 😂 LOL, 🔺 WOW). Every turn + every ping = timestamped parental engagement log for Exhibit A.

---

## 16. Prosthetic Layer (Legal/SSA)

- **`ui/src/components/FrictionLog.tsx`** — One-tap incident logger. 8 categories (sensory overload, executive paralysis, communication spike, medication disruption, emotional flooding, physical crash, social demand, routine break). Spoon cost, severity (managed/marked/shutdown). SSA-ready data.
- **`ui/src/components/SafeHarbor.tsx`** — Medication compliance tracker (MedsCard) + sleep tracker (SleepCard). Daily reset. Late/missed detection. 7-day streak indicators.
- **`ui/src/components/InverseDashboard.tsx`** — "WITHOUT THE LATTICE" — Counterfactual analysis. 6 cards: voltage caught, overdraft hours, medication gaps, sleep debt, connection gaps, friction cascades. Generated summary statement for ALJ.
- **`ui/src/components/OverloadGuard.tsx`** — Visual noise cancelling at 0–2 spoons. Blur everything except BREATHE and LOG FRICTION. Respects user autonomy (dismiss).
- **`ui/src/lib/exhibit-a.ts`** — Court-ready PDF generator (window.print()). Cover, executive summary, spoon history, friction log, parental engagement, LOVE economy, accommodation statement with DSM-5 citations, counterfactual section.
- **`ui/src/lib/haptics.ts`** — Haptic engine. Heartbeat, breath cycle, interaction feedback, Sprout signals, anchor, formation patterns. Gated behind user preference.

---

## 17. Build status

- **Build (`npm run build`):** Runs `vite build` only; produces a working production bundle. Studio route and lazy chunk (Quantum Clock, World Builder) are included. **Requires:** `gsap`, `colyseus.js`, `@tensorflow/tfjs` in `ui/package.json` (all added).
- **Typecheck (`npm run typecheck`):** Runs `tsc -p tsconfig.build.json`. May report errors in `3d/`, `QuantumClock/`, `Buddy/`, etc., due to duplicate `@types/three` / R3F type conflicts; optional for CI.
- **Strict build (`npm run build:strict`):** Runs typecheck then Vite; use when three.js type stack is unified.

---

## 18. Shelter (Buffer) dev

- **Port:** Shelter binds to `PORT` or 4000; if 4000 is in use it tries 4001–4010. Log shows actual URL.
- **Redis:** Optional. If Redis is not running, one line is logged (“Redis unavailable, using fallback mode”) and the in-memory queue is used.
- **SQLite:** Buffer DB `./buffer.db`, Game DB `./game.db`, Accommodation DB `apps/shelter/data/accommodation.db`. If accommodation DB hits SQLITE_MISUSE during init, startup continues in fallback mode.
- **WebSocket origins (dev):** localhost:5173–5180 (Scope/Sprout on any Vite port), so no “origin not in allowlist” when using dynamic ports.
- **Scope:** Uses `VITE_SHELTER_URL` (default `http://localhost:4000`) for API and accommodation log.
- **Sprout:** Uses `VITE_WS_URL` (default `ws://localhost:4000/ws`) for Buffer WebSocket. Set to match Shelter’s port if Shelter used a fallback port (e.g. `VITE_WS_URL=ws://localhost:4001/ws`).
- **Tests:** Root `npm test` runs ui unit tests and Shelter tests (both pass). ui `npm run test:integration` runs scope-buffer, scope-centaur, scope-node-one, and end-to-end (58 tests); all use mocked fetch/Node One mock server — no live Shelter/Centaur required.
- **Live wiring check:** With Shelter (and optionally Centaur, Scope) running, root **`npm run verify`** runs `scripts/verify-integration.ts` — health checks on :3000, :4000, :5173 and a Buffer→Centaur message flow test.
- **Full test matrix:** See `tests/README.md` (live Shelter integration, UI mocked integration, verify).
- **Launch prep status:** Shelter runs with `node dist/index.js` (ESM; relative imports use `.js` in source). With Shelter running on :4000, root `npm run test:integration` (live) passes (rate limit default 200 so full suite passes). Root `npm run preflight` runs verify-assets → health → live integration. Excluded UI component tests: node-a-you, node-b-them, CognitiveFlow, P31MoleculeViewer (React conflict); re-enable after React unification.

---

## 19. Optional / not yet done

- **Colyseus persistence** — Room persists structures to Postgres and reloads on join (per spec).
- **Rust WASM geodesic** — `geodesic-engine` (Rust), `wasm-pack build --target web`; UI calls WASM `analyze_structure` when available; JS remains fallback.
- **Backend API** — `nudge-coherence`, marketplace, balance endpoints when ready for CT.
- **P31 grammar** — Full DSL via ANTLR `P31.g4` and visitor when needed.
- **Portal logic** — `createPortal(fromId, toId)`, coherence cost/drain, second ring + geodesic particles.

---

## How to run

1. **Full dev (Shelter + Scope + Sprout):**  
   From repo root: `npm run dev`.  
   - Shelter (Buffer): http://localhost:4000 (or next free port 4001–4010). Redis optional.  
   - Scope: Vite on 5174+ (e.g. http://localhost:5176). Set `VITE_SHELTER_URL` if Shelter is on a non-4000 port.  
   - Sprout: Vite on 5174+ (e.g. http://localhost:5177). Set `VITE_WS_URL=ws://localhost:4001/ws` if Shelter is on 4001.

2. **UI only (no multiplayer):**  
   `cd ui && npm install && npm run dev`  
   World Builder works offline; coherence and structure analysis use local state and JS engine.

3. **With Colyseus:**  
   - `cd server && npm install && npx ts-node index.ts` (or `npm run dev`).  
   - In `ui`, set `VITE_COLYSEUS_URL=ws://localhost:2567` (e.g. from `.env.example`).  
   - World Builder syncs structures and clock wind/chimes to the room.

4. **Optional WASM:**  
   `cd geodesic-engine && wasm-pack build --target web`; copy `pkg/` to `ui/src/geodesic-engine` and point `useGeodesicAnalysis` at WASM when that branch is added.

---

*The mesh holds.*
