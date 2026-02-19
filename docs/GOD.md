# G.O.D. — Geometry of Operations
## P31 Labs Agent Protocol v1.0

Read this before writing any code.

---

## What P31 Labs Is

A 501(c)(3) nonprofit building open-source assistive technology for neurodivergent individuals. The architecture is modeled on the Posner molecule Ca₉(PO₄)₆ — a calcium cage protecting quantum coherence from environmental noise. The software does the same thing for human cognition.

## The Four Vertices

Everything maps to a tetrahedron. Never more than four things at any level.

| Vertex | Name | Domain | Status |
|--------|------|--------|--------|
| Ca | SHELTER | p31ca.org | ✅ Live PWA |
| P | NODE ONE | hardware | 📐 Designed |
| O | THE FOLD | mesh network | 📝 Spec'd |
| Geometry | GENESIS GATE | phosphorus31.org | 🔄 Building |

## Monorepo Structure

```
packages/
  buffer-core/     — Scoring math (scorer, governor PID, spoons, BLUF). DO NOT REWRITE.
  game-engine/     — XP, L.O.V.E., quests, achievements, birthday quest
  network-core/    — LoRa codec, DataView bit-packing
  game-core/       — Phase transition (freeze/thaw)
  bus/             — Universal state bus (localStorage + BroadcastChannel)
apps/
  shelter/         — Shelter PWA (React 19, Vite 6, Zustand, Dexie)
  navigator/       — Jitterbug Navigator (React 19, Vite, SVG geometry)
SUPER-CENTAUR/     — P31 Tandem backend (Express). Quantum lab, IMU (QMI8658), sample entropy, SOP generator, brain bridge. Jest tests. Server-side counterpart to Shelter. See docs/SUPER_CENTAUR_ALIGNMENT.md.
firmware/
  node-one-esp-idf/ — ESP32-S3 firmware (C++)
docs/
  GOD.md           — This file
  P31_MASTER_SYNTHESIS.md — Full ecosystem map (all agents, all products)
  SUPER_CENTAUR_ALIGNMENT.md — SUPER-CENTAUR ↔ monorepo map (sample entropy → buffer-core, MoleculeBuilder → BONDING Tier 3/4)
```

## Dependency Direction

```
buffer-core ← game-engine ← apps/shelter
buffer-core ← apps/shelter
game-core ← apps/bonding
bus ← apps/shelter
bus ← apps/navigator
bus ← standalone HTMLs (via ESM import)
network-core → (standalone, future mesh integration)
```

Arrow means "imports from". Packages in `packages/` NEVER import from `apps/`.

## Constraints

1. **Offline-first.** Everything works without network. No cloud dependencies for core function.
2. **Spoon-aware.** Respect `prefers-reduced-motion`. Degrade gracefully. Track metabolic cost.
3. **No WebGL.** Documented context exhaustion crisis. Use SVG for geometry.
4. **Zero military metaphors.** No submarine, naval, ship, fleet, torpedo, anchor, etc.
5. **AGPL v3.** All new code. Copyleft protects the commons.
6. **Source of truth per key.** See `packages/bus/src/keys.ts` for who owns what.
7. **Test threshold: 200+.** `pnpm test` from root must pass 200+ tests.

## The Bus

`@p31labs/bus` is the nervous system. Every product emits state onto it. Every product reads from it. The bus uses localStorage for persistence and BroadcastChannel for cross-tab sync. No backend required.

```typescript
import { createBus, BUS_KEYS } from '@p31labs/bus';
const bus = createBus();
bus.emit(BUS_KEYS.SPOONS, 8);
bus.on(BUS_KEYS.SPOONS, ({ value }) => { /* react */ });
```

## The Math

- **Voltage:** `V = U×0.4 + E×0.3 + C×0.3` (urgency, emotional, cognitive)
- **PID:** P31 Governor controller. Kp=0.15, Ki=0.05, Kd=0.01. Anti-windup ±10. Target: H ≈ 0.349
- **Spoons:** 0–12 scale. Recharge 0.5/hr. Drain proportional to entropy.
- **Maxwell:** E = 3V − 6. At V=4 (tetrahedron), E=6. Minimum rigid structure.

## Build Commands

```bash
pnpm install                              # Install all workspaces
pnpm test                                 # Run all tests (turbo). Threshold: 200+ passing.
pnpm --filter @p31labs/bus test           # Bus tests only
pnpm --filter @p31labs/bus build          # Build bus ESM bundle
pnpm --filter @p31labs/navigator build    # Build navigator
pnpm --filter @p31labs/navigator preview  # Preview navigator locally
```

## Launch

- **phosphorus31.org** → `apps/navigator/dist/` (Cloudflare Pages)
- **p31ca.org** → Shelter PWA (Cloudflare Pages)
- Both work offline. Both read from the same localStorage bus.

## Who

- **Will** — Founder, CEO, Operator. DoD civilian engineer (16 years), AuDHD, hypoparathyroidism.
- **Claude (Opus)** — Built buffer-core math, network-core codec, game-core physics, firmware prototype, documentation.
- **Gemini** — Built mathematical formalizations, Jitterbug research, Posner spin model.
- **DeepSeek** — Built game-engine, Oracle, Shelter PWA, bus architecture, Sovereign AI.
- **Cursor** — Executes merge plan, assembles packages, launches.

## One Rule

If you're about to create a new standalone artifact that doesn't connect to the bus, stop. Wire it in or don't build it.

🔺
