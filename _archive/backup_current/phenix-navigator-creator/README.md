# Phenix Navigator Creator

**Sovereign Stack — A quantum-native creation platform bridging digital imagination to physical reality.**

A consciousness-compatible voxel creation interface built on the Fisher-Escolà quantum coherence model, Fuller's synergetic geometry, and the Vacuum Pressure Impregnation (VPI) cognitive state machine.

This tool is a component of the **Cognitive Shield** ecosystem, designed as an assistive technology for neurodivergent individuals. See the [Phenix Manifesto](https://github.com/trimtab-signal/cognitive-shield/blob/main/MANIFESTO.md) for the guiding philosophy.

## Architecture

| Layer | Implementation |
|-------|---------------|
| **Quantum Core** | Fisher-Escolà coherence engine with 8 Posner molecules, exponential T₂ decay, RAF simulation loop at 60fps physics with 60ms throttled broadcasts to React |
| **State** | Zustand with Map-based O(1) voxel lookup, VPI phase machine (VACUUM→FLOOD→PRESSURIZE→CURE), voltage drift, fabrication pipeline status |
| **3D Engine** | React Three Fiber Canvas, InstancedMesh (2000-block cap, single draw call), Tetrahedron Protocol rotation invariants (1/3, 1/6, 1/12), CoherenceOrb with satellite molecules |
| **Voice** | Trimtab singleton via Context, Fuller persona tuning (pitch 0.9, rate 0.92), 6 command routes, priority queue speech |
| **Hardware** | ESP32-S3 serial bridge, JSON protocol, knob→voltage, button→block, auto-reconnect |
| **Fabrication** | GLTFExporter → Kiri:Moto headless FDM → G-code download, abort signals, progress callbacks |
| **UI** | Glassmorphism, voltage-driven chromatic aberration + scanlines, VPI phase visualization |

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173 in Chrome or Edge (required for Web Speech + Web Serial APIs).

## Voice Commands

- **"help"** / **"wisdom"** / **"trim tab"** — Fuller guidance
- **"build"** / **"create"** — Enter construction mode
- **"view"** / **"observe"** — Enter observation mode (disables block placement)
- **"materialize"** / **"fabricate"** / **"print"** — Trigger slicing pipeline
- **"reset"** / **"clear"** / **"wipe"** / **"void"** — Clear the voxel world
- **"status"** — System state report

## Hardware Integration

Connect an ESP32-S3 Phenix Navigator via USB. The device should output JSON lines:

```jsonc
// Protocol: Newline-delimited JSON @ 115200 baud
// All keys must be lowercase.
{"type":"knob","value":2048}      // value: 0-4095 ADC range
{"type":"button","pressed":true}  // pressed: true or false
```

Knob values (0-4095 ADC range) map to voltage (0-100). Button presses add blocks at origin.

## Fabrication Setup

1. Clone [GridSpace Kiri:Moto](https://github.com/GridSpace/grid-apps)
2. Copy `engine.js` and `worker.js` into `/public/kiri/`
3. Ensure `manifold.wasm` is co-located if required

Click **MATERIALIZE** to export the voxel world as G-code.

## Quantum Model

The Fisher-Escolà engine simulates 8 Posner molecules (Ca₉(PO₄)₆) with:

- **T₂ decay**: Exponential decoherence, accelerated by voltage
- **Recoherence**: Block placement boosts coherence
- **Q Statistic**: `Q = 4 × Σ(coherence²) / N` — quantum regime when Q > 1

## VPI Phase Machine

| Phase | Threshold | Description |
|-------|-----------|-------------|
| VACUUM | 0 | Stripping noise. Preparing the void. |
| FLOOD | 3 | Introducing resin into the zone. |
| PRESSURIZE | 10 | Forcing structure into the void. |
| CURE | 25 | Mesh hardening. Coherence achieved. |

## Controls

- **Left click** — Place block (only in BUILD mode)
- **Alt/Ctrl + click** — Remove block (only in BUILD mode)
- **Scroll** — Zoom
- **Drag** — Orbit camera

## Project Structure

```
src/
├── quantum/
│   ├── fisherEscola.js      # Posner molecule simulation
│   └── coherenceEngine.js   # RAF loop wrapper
├── hooks/
│   ├── useQuantumState.js   # Engine lifecycle
│   ├── useTrimtab.js        # Voice guidance
│   └── useWebSerial.js      # Hardware bridge
├── components/
│   ├── CreationPipeline.jsx # Main R3F canvas
│   ├── VoxelWorld.jsx       # Instanced mesh
│   ├── Hologram.jsx         # Tetrahedron protocol
│   ├── CoherenceOrb.jsx     # Quantum visualizer
│   ├── HUD.jsx              # Status panels
│   ├── ActionDeck.jsx       # Control bar
│   ├── VPIOverlay.jsx       # Phase indicator
│   └── GlitchOverlay.jsx    # Visual effects
├── store.js                 # Zustand state
├── constants.js             # Key simulation & UI parameters
├── fabricator.js            # Kiri:Moto G-code pipeline
├── TrimtabContext.jsx       # Voice singleton
├── App.jsx                  # Root component
├── main.jsx                 # Entry point
└── index.css                # Global styles
```

## License

MIT — JLS Trading Co.

---

*"Call me Trim Tab."* — R. Buckminster Fuller
