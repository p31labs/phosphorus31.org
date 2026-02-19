# SUPER-CENTAUR ALIGNMENT
## Add-on to CURSOR_BUILD_ORDER.md — read after step 10

---

## What SUPER-CENTAUR Is

The server-side counterpart to Shelter. Express backend with quantum lab, IMU interface, sample entropy, SOP generator, and brain bridge. Lives at `SUPER-CENTAUR/` in the repo root. Uses Jest (not Vitest). Has its own test suite separate from the pnpm workspace.

**Do not move SUPER-CENTAUR into packages/.** It's an app, not a library. It stays at root.

---

## Alignment Map

| SUPER-CENTAUR File | Monorepo Target | Action | When |
|---|---|---|---|
| `src/quantum/sample-entropy.ts` | `packages/buffer-core/src/entropy.ts` | **Extract.** Copy the algorithm. This is the biological input for Samson PID. `coherence = 1 - normalized_entropy` feeds `H_obs(t)`. | Post March 12 |
| `src/quantum/qmi8658-interface.ts` | `packages/bus` via `p31:harmony` key | **Wire.** When Node One hardware ships, IMU data flows: QMI8658 → sample entropy → harmony score → bus emit → PID consumes. | When Node One ships |
| `src/quantum/quantum-lab.ts` | `apps/shelter` as a future Lab view | **Keep.** API routes at `/api/quantum-lab/*` serve real-time coherence data. Shelter calls these when online. | Post March 12 |
| `src/quantum-brain/sop-generator.ts` | Oracle AI layer in Centaur | **Keep.** SOP generation is server-side AI orchestration. Not a package. | No change |
| `src/quantum-brain/index.ts` | Centaur backend bridge | **Keep.** Decision engine + consciousness monitoring. Future LiteLLM routing. | No change |
| `ui/src/components/Molecule/MoleculeBuilder.tsx` | BONDING Tier 3/4 | **Do not rebuild.** This IS the 3D Posner visualization. Wire to `@p31labs/bus` and game-engine quest tracker. | Step 11 below |

---

## New Bus Keys for Quantum Features

Add these to `packages/bus/src/keys.ts` when quantum hardware integration begins:

```typescript
// Quantum (source: SUPER-CENTAUR quantum-lab via WebSocket, or Node One via serial)
COHERENCE: 'p31:coherence',       // number (0-1, from sample entropy)
ENTROPY_RAW: 'p31:entropyRaw',   // number (raw sample entropy value)
IMU_ACTIVE: 'p31:imuActive',     // boolean (QMI8658 connected and streaming)
LAB_STATE: 'p31:labState',       // 'idle' | 'measuring' | 'entangled'
```

**Do not add these now.** Add when the hardware path is active. The bus supports arbitrary keys — these are just the canonical names to use.

---

## Step 11 (Future): Wire MoleculeBuilder to Game Engine

**What:** The existing `MoleculeBuilder.tsx` in `ui/src/components/Molecule/` becomes BONDING Tier 3/4 (3D orbital visualization). It needs to emit molecule events onto the bus so the game-engine's quest tracker registers completion.

**Actions:**
1. Import `createBus` and `BUS_KEYS` in MoleculeBuilder
2. On molecule completion: `bus.emit(BUS_KEYS.MOLECULE, formula)`
3. On atom placement: `bus.emit(BUS_KEYS.ATOMS, count)`
4. Read spoons from bus: adapt particle complexity based on `bus.get(BUS_KEYS.SPOONS)`

**This connects the existing 3D visualization to the game loop without rewriting it.**

---

## Step 12 (Future): Extract Sample Entropy to buffer-core

**What:** The `sample-entropy.ts` algorithm is pure math with zero server dependencies. It belongs in `packages/buffer-core` alongside scorer and samson.

**Actions:**
1. Copy `SUPER-CENTAUR/src/quantum/sample-entropy.ts` to `packages/buffer-core/src/entropy.ts`
2. Strip any Express/server imports (should be none — it's pure math)
3. Export: `calculateSampleEntropy(data: number[], m: number, r: number): number`
4. Export: `entropyToCoherence(entropy: number): number` (just `1 - normalize(entropy)`)
5. Add to buffer-core barrel export
6. Write tests (target: 8+ covering edge cases, empty data, known sequences)
7. In Samson PID: optionally accept coherence from entropy as `H_obs(t)` input

**This closes the loop:** IMU → entropy → coherence → PID → voltage → bus → UI.

---

## Planned Features That Already Exist as Artifacts

| Planned Feature | Status in SUPER-CENTAUR | Already Built By |
|---|---|---|
| Entanglement Visualization | ❌ Not implemented | Claude: Posner Spin Model (standalone HTML, 6 nuclei, singlet pairs) |
| Drift Animation | ❌ Not implemented | Claude: Consciousness artifact (entropy slider, coherence decay) |
| Phase Visualization | ❌ Not implemented | Claude: Consciousness artifact (strobe vase/face oscillation) |
| Real-Time Simulation | 20% (foundation) | Claude: Consciousness artifact (live PID + spoon economy) |

**These artifacts become the Quantum Lab frontend when wired to the bus.** Don't rebuild them inside SUPER-CENTAUR. Wire the existing visualizations to real data via bus keys.

---

## Test Impact

SUPER-CENTAUR uses Jest. The monorepo uses Vitest via turbo. They don't interfere.

- `pnpm test` runs Vitest across all workspace packages (bus, buffer-core, game-engine, etc.)
- `cd SUPER-CENTAUR && npm test` runs Jest for the Centaur server
- Both should pass. The 200+ threshold in the build order counts only the pnpm workspace.

🔺
