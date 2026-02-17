# P31 Quantum Ecosystem — North Star Blueprint

**Version:** 1.0  
**Purpose:** Canonical vision for the P31 Quantum Console and "in a screen" experience. This document is the North Star for all quantum visualization, MATA demo, and cockpit work.

---

## 1. Vision: From "On a Screen" to "In a Screen"

The web today is a flat pane of glass. The P31 Quantum Console treats the screen as a **portal**—a window into a 3D environment that surrounds the operator. The user sits inside a curved wraparound display, watching the "green mist" of quantum noise, interacting with controls that feel tangible, and perceiving the **isotropic vector matrix (IVM)** as the underlying lattice of reality.

### Key Principles

- **Spatial Continuity:** The UI wraps around you (curved panoramic on flatscreen; true 3D in VR/AR).
- **Data as Environment:** Telemetry flows as particles, waves, and geometry—not just graphs.
- **Physical Metaphors:** Controls feel tangible (dials, sliders, gates) with haptic-like feedback (sound and animation).
- **Fuller's Synergetics:** The IVM is the coordinate system for all spatial arrangement—every data point, control, and visualization lives on this universal grid.

---

## 2. The Isotropic Vector Matrix (IVM)

Buckminster Fuller's IVM is the closest packing of spheres—a lattice of tetrahedra and octahedra that fills space with maximum symmetry. In P31 it serves as:

- **Coordinate system:** Position elements along 60° axes (not Cartesian).
- **Visualization scaffold:** Qubit states at lattice nodes; entanglement as edges.
- **Metaphor for coherence:** Perfect IVM = coherent, noise-free; decoherence = distortion, color shift, breakage.

Basis vectors (normalized):

- a = (1, 0, 0)
- b = (0.5, √3/2, 0)
- c = (0.5, √3/6, √(2/3))

---

## 3. Product Roles in the Quantum Ecosystem

| Product | Role in Quantum Ecosystem |
|--------|----------------------------|
| **P31 Buffer** | Communication processing; voltage scoring. The "Buffer" icosahedron in the demo represents system state (voltage → rotation, color, jitter). |
| **P31 Compass** | Direction, coherence measurement, Fisher–Escolà Q. |
| **P31 Spectrum (Scope)** | Dashboard: Ontological Volume, spoons, voltage timeline, mesh logs. |
| **P31 NodeZero** | Hardware: LoRa mesh, haptics. Mesh logs in the demo reflect N1 traffic. |
| **P31 Tandem** | Human–AI collaboration; the cockpit is the operator’s seat. |

---

## 4. MATA Demo Narrative (Phase 0)

For the **MATA accelerator demo (Due Feb 27)**, we tell a single visual story:

**Dysregulation → Intervention → Stability**

- **08:00** — Waking state (low voltage, high spoons). Buffer: green, slow, gentle.
- **10:15** — Context switch spike (high voltage). Buffer: amber, faster.
- **10:20** — Haptic intervention. Buffer: calcium, calming.
- **14:30** — Sensory overload (critical voltage, low spoons). Buffer: red, fast rotation, jitter.
- **15:00** — Recovery/grounding. Buffer: slate/green, settling.

The **timeline slider** scrubs through this "day"; the **3D Buffer (icosahedron)** reacts in real time. Mesh logs and spoon gauge complete the cockpit. This is the shot for the video: scrubbing to 14:30 and showing the geometry turn red and vibrate.

---

## 5. Technical Pillars

- **Rendering:** React Three Fiber, drei, postprocessing (bloom, chromatic aberration, phosphor feel).
- **IVM:** `ui/src/engine/ivm.ts` + IVMLatticePoints / IVMLatticeEdges for lattice.
- **Data:** Synthetic demo timeline and mesh logs (`ui/src/demo-data.ts`); later, live telemetry from CatchersMitt, history, geodesic-engine.
- **State:** Zustand for telemetry and demo timeline index; keep React out of the hot path where possible.
- **Performance:** 60 FPS desktop, 90 FPS VR; instancing, LOD, culling; PerformanceMonitor for tuning.

---

## 6. Phased Roadmap (Summary)

| Phase | Focus | Key Deliverables |
|-------|--------|-------------------|
| **Phase 0** | MATA Demo | Demo data, Voltage Icosahedron (Buffer), cockpit layout, timeline slider. |
| **Phase 1** | Foundation | Curved FBO cockpit, IVM lattice in scene. |
| **Phase 2** | Volumetrics | GPGPU particle system ("green mist"). |
| **Phase 3** | Interactivity | Raycast on curved UI, control widgets. |
| **Phase 4** | WebXR | VR/AR support, hand tracking. |
| **Phase 5** | Data integration | Real telemetry → lattice and particles. |
| **Phase 6** | Portal | Landing page as 3D gateway, "Enter the Mesh." |

---

## 7. Design Constants

- **P31 tokens:** phosphorus (green), void (background), amber (alert), calcium (stability), crimson (critical), slate (neutral). See `god.config.ts` / `P31.tokens`.
- **Ontological Volume:** Spoons, voltage, coherence—the quantities that the dashboard and 3D visuals represent.
- **Mesh:** LoRa/N1 traffic; status ONLINE/CONNECTED in the cockpit bar.

---

## 8. Success Criteria for the MATA Demo

1. Run app → see cockpit: top bar (P31 NODE ZERO // STATUS: ONLINE // MESH: CONNECTED).
2. Center: 3D icosahedron (Buffer) reacting to voltage (green = calm, red = overload).
3. Left: Spoon Fuel gauge (vertical, draining over the day).
4. Right: Live log terminal (streaming MESH_LOGS).
5. Bottom: Timeline slider; scrub to 14:30 → Buffer turns red and vibrates ("Sensory Overload").
6. Video-ready: one clear shot showing problem (overload) and solution (intervention) through data-driven visuals.

---

**The Mesh Holds. 🔺**

*This blueprint is the single source of truth for the P31 Quantum Ecosystem and MATA demo execution.*
