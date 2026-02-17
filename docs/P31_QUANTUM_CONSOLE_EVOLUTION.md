# P31 Quantum Console — Evolution Map

**From "on a screen" to "in a screen."** This document maps the P31 Quantum Console vision to the current codebase and provides a file-level roadmap for building the immersive cockpit.

---

## 1. Current State Summary

### 1.1 What Exists Today

| Asset | Location | Role |
|-------|----------|------|
| **QuantumCanvas** | `ui/src/components/ui/QuantumCanvas.tsx` | 2D canvas: Fisher–Escolà, tetrahedron, golden spirals, particles. **Not** Three.js. |
| **R3F Canvas** | `ui/src/App.tsx` | Single full-screen `<Canvas>` with `OrbitControls`, `Grid`, `Environment`, fog. |
| **QuantumVisualization3D** | `ui/src/components/3d/QuantumVisualization3D.tsx` | R3F: Bloch spheres, entanglement lines, tetrahedron node positions. Uses `@react-three/drei` (`Line`, `Sphere`, `Text`). |
| **Quantum store** | `ui/src/stores/quantum.store.ts` | Zustand: coherence, phase, purity, entangledNodes, quantumField, uiAdaptation. (Note: some components expect `nodeStates` / `nodes` / `evolve` / `NodeId`; align or extend store as needed.) |
| **geodesic-engine** | `ui/src/engine/geodesic-engine.ts` | Message/voltage analysis (curvature, complexity), **not** 3D IVM geometry. |
| **CatchersMitt / history** | `ui/src/lib/catchers-mitt.ts`, `ui/src/services/history.service.ts` | Buffered messages, voltage strip; used by `shield.store`, `MessageHistory`, `SystemsPanel`. |
| **PerformanceMonitor** | `ui/src/components/3d/PerformanceMonitor.tsx` | FPS/performance overlay. Keep for 60/90 FPS targets. |
| **Post-processing** | `ui/src/components/quantum/QuantumPostProcessing.tsx` | `EffectComposer`, `Bloom`, `ChromaticAberration`, `Noise` from `@react-three/postprocessing`. |
| **Website** | `website/` | Static landing (index.html, hero, metrics). Canvas layers: `#mesh-bg`, `#hero-geometry`. No 3D cockpit yet. |

### 1.2 Gaps vs. Console Vision

- **No IVM lattice** — Isotropic vector matrix not yet in codebase.
- **No curved FBO cockpit** — UI is flat overlay; no wraparound cylinder with RenderTexture.
- **No GPGPU particle field** — "Green mist" not implemented; only 2D particle system in QuantumCanvas.
- **No WebXR** — `@react-three/xr` not in dependencies.
- **Data → 3D** — Telemetry (history, voltage, coherence) not yet piped into 3D scene (lattice distortion, particle turbulence, qubit colors).

---

## 2. Architecture: Where Things Live

```
ui/
├── src/
│   ├── engine/
│   │   ├── geodesic-engine.ts    # Message analysis (keep). Add IVM here or in utils.
│   │   └── ivm.ts                # NEW: IVM lattice generation (points + edges)
│   ├── components/
│   │   ├── ui/
│   │   │   └── QuantumCanvas.tsx # 2D canvas; keep or eventually feed into FBO
│   │   ├── 3d/
│   │   │   ├── QuantumVisualization3D.tsx  # Extend with IVM + Bloch at IVM nodes
│   │   │   ├── PerformanceMonitor.tsx      # Keep
│   │   │   ├── IVMLatticePoints.tsx        # NEW: InstancedMesh for IVM points
│   │   │   ├── IVMLatticeEdges.tsx        # NEW: LineSegments for IVM edges
│   │   │   └── P31Cockpit.tsx              # NEW: Curved FBO + IVM + particles
│   │   └── quantum/
│   │       └── ... (existing)
│   ├── stores/
│   │   ├── quantum.store.ts      # Extend for qubit-at-lattice, telemetry
│   │   └── shield.store.ts       # Already uses history + CatchersMitt
│   ├── lib/
│   │   └── catchers-mitt.ts      # Data source for "message events" in 3D
│   └── services/
│       └── history.service.ts    # Data source for trends in 3D
website/
├── index.html                    # Future: lightweight 3D portal, "Enter the Mesh"
├── main.js
└── styles.css
```

---

## 3. Phase-by-Phase Map

### Phase 1 — Foundation: Curved FBO + IVM

| Goal | Current | Target | Files to add/modify |
|------|---------|--------|----------------------|
| IVM lattice | None | Generate points + edges in 60° basis | **Add** `ui/src/engine/ivm.ts` |
| IVM in 3D | N/A | Instanced points + line segments | **Add** `ui/src/components/3d/IVMLatticePoints.tsx`, `IVMLatticeEdges.tsx` |
| Curved cockpit | Flat overlay | Cylinder with RenderTexture for 2D UI | **Add** `ui/src/components/3d/P31Cockpit.tsx` (or `CurvedDashboard.tsx`); use `RenderTexture` from drei |
| Integrate in app | Single Canvas with Omega + QuantumVisualization3D | Optional "cockpit mode" that wraps scene in cylinder + IVM | **Modify** `ui/src/App.tsx`: route or toggle to `<P31Cockpit>` instead of raw `<group>` |

**Deliverables:** IVM utility, IVM components in scene, one curved surface with a simple 2D UI texture (e.g. "P31 QUANTUM CONSOLE" + one button). No raycast on curved UI yet.

---

### Phase 2 — Volumetrics: Green Mist

| Goal | Current | Target | Files to add/modify |
|------|---------|--------|----------------------|
| Particle system | 2D only (QuantumCanvas) | GPGPU 500k+ particles in 3D | **Add** `ui/src/components/3d/ParticleSimulation.tsx`, `ParticleField.tsx` (data texture + points shader) |
| Motion | N/A | Noise/vector field, boundary (sphere) | Shader in ParticleSimulation; uniforms for time, noise scale |
| Color | N/A | Green → red for decoherence | Fragment shader or uniform `uCoherence` |

**Deliverables:** Dense particle fog in scene; coherence (from store or mock) drives color. No backend telemetry yet.

---

### Phase 3 — Interactivity

| Goal | Current | Target | Files to add/modify |
|------|---------|--------|----------------------|
| Raycast on curved UI | N/A | Hit cylinder → UV → pixel → button regions | **Add** `ui/src/hooks/useCurvedRaycast.ts`; **Modify** P31Cockpit to dispatch `ui-interaction` or callbacks |
| Controls | N/A | Dials/sliders in cockpit UI that affect demo circuit or coherence | **Add** control widgets in CockpitUI; wire to quantum store or demo state |

**Deliverables:** Click/tap on curved dashboard triggers actions; at least one control (e.g. "J-Gate") updates store or demo state.

---

### Phase 4 — WebXR

| Goal | Current | Target | Files to add/modify |
|------|---------|--------|----------------------|
| XR entry | None | VRButton + XR session | **Add** `@react-three/xr`; **Modify** App or P31Cockpit: wrap in `<XR>`, add `<VRButton />` |
| Camera | OrbitControls | XR camera in VR; OrbitControls fallback on desktop | Use `<Player>` / XR camera when session active |
| Interaction | Mouse | Controller ray / hand tracking | **Add** controller raycast or `Interactive` for cockpit buttons |

**Deliverables:** "Enter VR" launches cockpit in headset; same scene, no new scene graph. Graceful fallback when XR unavailable.

---

### Phase 5 — Data Integration

| Goal | Current | Target | Files to add/modify |
|------|---------|--------|----------------------|
| Telemetry → lattice | N/A | Coherence/error rate per qubit at IVM nodes | **Modify** IVMLatticePoints: instance color/size from store; **Modify** quantum.store or add qubit-at-lattice slice |
| Telemetry → particles | N/A | Global error rate or message rate drives turbulence | **Modify** ParticleSimulation: uniforms from `useQubitStore.getState()` or shield/history |
| Geodesic / CatchersMitt | Used in 2D/panels | Events (e.g. new message, voltage spike) drive ripples or lattice pulse | **Modify** shield.store or a bridge: on message/voltage event, set a "pulse" uniform or store field; 3D reads it in useFrame |

**Deliverables:** Coherence and message/voltage events visibly affect lattice and particle field. Prefer Zustand for high-frequency updates; keep React out of hot path.

---

### Phase 6 — Landing Page Portal

| Goal | Current | Target | Files to add/modify |
|------|---------|--------|----------------------|
| Landing 3D | Static canvas (mesh-bg, hero-geometry) | Lightweight 3D (IVM sphere or glimpse of cockpit) | **Modify** `website/`: add small Three.js or R3F bundle; or embed iframe to ui app in "portal" mode |
| "Enter the Mesh" | N/A | Button lazy-loads full dashboard (ui app) | **Modify** `website/main.js`: dynamic import of ui app and mount on click |
| Performance | — | Keep landing fast; full experience on demand | Lazy load; optional reduced IVM/particles on landing |

**Deliverables:** phosphorus31.org hints at cockpit (e.g. rotating IVM); one button loads full P31 dashboard/console.

---

## 4. Fullerian Principles in Practice

- **Ephemeralization** — IVM + instancing: many lattice points with one draw call; GPGPU particles: one pass for 500k+ particles. Fewer resources, more structure.
- **Synergetics** — IVM as scaffold: every qubit and control lives on the same lattice; coherence and decoherence appear as symmetry and distortion of the same geometry.
- **Tensegrity** — Balance of forces in the lattice mirrors balance of coherence (e.g. error correction); visualize as stability vs. strain in the grid.

---

## 5. Technical Notes

- **Performance:** 60 FPS desktop, 90 FPS VR. Use `PerformanceMonitor`; if FPS drops, reduce particle count or IVM radius. Instancing and LOD (e.g. fewer edges at distance) as needed.
- **Tooling:** Keep Vite, TypeScript, R3F, drei. Add `@react-three/xr` in Phase 4. Prefer Zustand for telemetry; optional valtio for UI state.
- **Browser:** WebXR fallback: detect `navigator.xr`; if missing, keep curved 2D cockpit + OrbitControls.
- **P31 naming:** All user-facing strings and docs use P31 product names (P31 Compass, P31 Buffer, etc.) and banned-term replacements per P31 master system prompt.

---

## 6. Recommended First Step

Start with **Phase 1**:

1. Implement **`ui/src/engine/ivm.ts`** — `generateIVM(radius, spacing)` returning `{ points, edges }` with 60° basis vectors.
2. Add **IVMLatticePoints** and **IVMLatticeEdges** and render them inside the existing Canvas (e.g. inside the same `<group>` as `QuantumVisualization3D`).
3. Add **P31Cockpit** (or CurvedDashboard): one cylinder with `RenderTexture` and a minimal 2D UI (title + one button). Optionally make cockpit mode a toggle so the rest of the app is unchanged.

Once the curved surface and IVM are visible, Phase 2 (particles) and Phase 3 (raycast + controls) build directly on this foundation.

---

**The Mesh Holds. 🔺**
