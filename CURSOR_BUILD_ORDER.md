# CURSOR BUILD ORDER
## P31 Labs — February 19, 2026

Read this first. Do everything in order. Do not skip steps. Do not start the next step until the current step's tests pass.

---

## CONTEXT

You have already completed merge plan steps 1–3:
- ✅ Step 1: buffer-core canonicalized (README added)
- ✅ Step 2: network-core added (5 tests passing)
- ✅ Step 3: game-core added (4 tests passing)

**Two new packages are ready to integrate.** Both were designed by external agents (DeepSeek and Gemini) and their complete source code is included in this handoff.

**After this build order completes, the monorepo will have:**
- `packages/buffer-core` — scoring math (existing, ~32 tests)
- `packages/game-engine` — XP/quests/L.O.V.E. (existing, 91 tests)
- `packages/network-core` — LoRa codec (existing, 5 stub + 44 target)
- `packages/game-core` — freeze/thaw (existing, 4 tests)
- `packages/bus` — **NEW** universal state bus (target: 20+ tests)
- `apps/shelter` — Shelter PWA (existing, consumes all packages)
- `apps/navigator` — **NEW** Jitterbug Navigator (target: Lighthouse > 90)
- `firmware/` — Node One ESP32 (existing, unchanged)
- `docs/GOD.md` — **NEW** agent entry point
- `docs/P31_MASTER_SYNTHESIS.md` — **NEW** full ecosystem map

---

## STEP 4: Assemble `@p31labs/bus`

**Source:** `packages/bus/` in this handoff (all files provided, copy verbatim)

**What it is:** Zero-dependency universal state bus. Bridges Shelter (Zustand) with standalone HTMLs (localStorage) and React artifacts (useBus hook). Three adapters: localStorage, BroadcastChannel, Web Serial stub.

**Actions:**
1. Copy entire `packages/bus/` directory into the monorepo workspace
2. Add `"packages/bus"` to root `pnpm-workspace.yaml`
3. Run `pnpm install` from root
4. Run `pnpm --filter @p31labs/bus test`
5. Run `pnpm --filter @p31labs/bus build`
6. Verify: `dist/index.js` exists and is < 4KB

**Expected test count:** 12+ tests (core: 5, localStorage: 3, broadcast: 1, keys: 1, react: 2+)

**Do not proceed until all tests pass and build succeeds.**

---

## STEP 5: Wire bus into Shelter

**What:** Shelter's Zustand stores emit state changes onto the bus. External apps (BONDING, Scope) can read Shelter state via localStorage.

**Actions:**
1. Add `"@p31labs/bus": "workspace:*"` to `apps/shelter/package.json` dependencies
2. Create `apps/shelter/src/lib/bus-bridge.ts`:

```typescript
import { createBus, BUS_KEYS } from '@p31labs/bus';

const bus = createBus();

/**
 * Call from any Zustand store's subscribe() to sync state to bus.
 * Example: useSpoonStore.subscribe(state => syncToBus(state))
 */
export function syncSpoons(spoons: number) {
  bus.emit(BUS_KEYS.SPOONS, spoons);
}

export function syncVoltage(voltage: number) {
  bus.emit(BUS_KEYS.VOLTAGE, voltage);
}

export function syncMode(mode: string) {
  bus.emit(BUS_KEYS.MODE, mode);
}

export function syncGameState(xp: number, level: number, love: number) {
  bus.emit(BUS_KEYS.XP, xp);
  bus.emit(BUS_KEYS.LEVEL, level);
  bus.emit(BUS_KEYS.LOVE, love);
}

/** Listen for molecule events from BONDING (standalone HTML) */
export function onMoleculeBuilt(callback: (molecule: string) => void) {
  return bus.on<string>(BUS_KEYS.MOLECULE, (event) => {
    callback(event.value);
  });
}

export function onAtomsChanged(callback: (count: number) => void) {
  return bus.on<number>(BUS_KEYS.ATOMS, (event) => {
    callback(event.value);
  });
}

export { bus, BUS_KEYS };
```

3. In `apps/shelter/src/stores/spoon-store.ts` (or wherever spoons are managed): add a subscribe call that invokes `syncSpoons()` on every state change
4. Same for voltage in `buffer-store.ts` and game state in `game-store.ts`
5. Verify: open Shelter, check that `localStorage.getItem('p31:spoons')` returns a value in browser devtools

**No new tests required for this step.** The bus package tests already cover the emit/persist round-trip. This step is pure wiring.

---

## STEP 6: Wire bus into standalone HTMLs

**What:** BONDING, Scope, and Buffer HTML pages import the bus ESM bundle instead of the old bus.js.

**Actions:**
1. After `pnpm --filter @p31labs/bus build`, copy `packages/bus/dist/index.js` to wherever Level 1 static assets are served (e.g., `ui/public/bus.esm.js` or the p31ca.org static directory)
2. In each standalone HTML (bonding/play, scope, buffer), replace:
   ```html
   <script src="bus.js"></script>
   ```
   with:
   ```html
   <script type="module">
     import { createBus } from './bus.esm.js';
     const BUS_KEYS = {
       SPOONS: 'p31:spoons', VOLTAGE: 'p31:voltage', MODE: 'p31:mode',
       ATOMS: 'p31:atoms', MOLECULE: 'p31:molecule', TIER: 'p31:tier',
       HEARTBEAT: 'p31:heartbeat', PHASE: 'p31:phase'
     };
     const bus = createBus();
     // ... rest of app code uses bus.get(), bus.emit(), bus.on()
   </script>
   ```
3. OR: if the old bus.js already writes `p31:` prefixed keys to localStorage, it's already compatible. In that case, just verify both systems read from the same keys and skip the replacement.

**Validation:** Open Shelter in tab A. Open BONDING in tab B. In Shelter, change spoons. In BONDING's console: `localStorage.getItem('p31:spoons')` should reflect the new value.

---

## STEP 7: Build `@p31labs/navigator` (Jitterbug)

**Source:** `apps/navigator/NAVIGATOR_BUILD_SPEC.md` in this handoff (actionable spec, not research)

**What it is:** The single interactive shell at phosphorus31.org. Dark screen → breathing Vector Equilibrium → press-and-hold → contracts to tetrahedron → four labeled vertices → tap to navigate.

**Actions:**
1. Create `apps/navigator/` in the monorepo
2. Initialize: React 19 + Vite + Tailwind (match Shelter's stack)
3. Follow NAVIGATOR_BUILD_SPEC.md exactly for geometry, states, colors, interactions
4. Add `"@p31labs/bus": "workspace:*"` as dependency (or use bus-stub.ts that reads localStorage directly)
5. Build and verify:
   - `pnpm --filter @p31labs/navigator build`
   - Bundle < 50KB gzipped
   - Lighthouse Performance > 90
   - All four vertices interactive
   - MAR10 Day star visible (current date is in range)
   - Keyboard accessible (Tab cycles, Enter activates, Escape closes)
   - prefers-reduced-motion skips animation

**This is the largest single task.** Expect 4–6 hours. The spec has every coordinate, every color, every interaction defined. No design decisions needed — execute.

---

## STEP 8: Unified test command

**What:** One command runs all tests across the entire monorepo and reports a single number.

**Actions:**
1. Ensure every workspace with tests is in the turbo pipeline:
   - `packages/buffer-core` (vitest)
   - `packages/game-engine` (vitest)
   - `packages/network-core` (vitest)
   - `packages/game-core` (vitest)
   - `packages/bus` (vitest)
   - `apps/shelter` (vitest)
   - Any others with test scripts
2. Run `pnpm test` from root (turbo should cascade)
3. Verify total passing count ≥ **200**
4. Add to CI if CI exists; otherwise add a root script:
   ```json
   { "scripts": { "test:all": "turbo run test" } }
   ```

**Test threshold: 200 passing.** This is the merge plan's agreed number.

---

## STEP 9: Documentation

**Actions:**
1. Copy `docs/GOD.md` from this handoff into `docs/GOD.md` in the repo
2. Copy `docs/P31_MASTER_SYNTHESIS.md` from this handoff into `docs/P31_MASTER_SYNTHESIS.md`
3. Update root `README.md` (or create one) to reference both:
   ```markdown
   ## For AI Agents
   Read `.cursorrules` first, then `docs/GOD.md`.
   Full ecosystem map: `docs/P31_MASTER_SYNTHESIS.md`
   ```
4. Update `.cursorrules` if needed to point to `docs/GOD.md`

---

## STEP 10: Deploy

**Actions:**
1. `pnpm --filter @p31labs/navigator build` → `apps/navigator/dist/`
2. Deploy `apps/navigator/dist/` to Cloudflare Pages → `phosphorus31.org`
3. Archive current static site to `phosphorus31.org/legacy` or remove
4. Verify: `phosphorus31.org` shows the Jitterbug Navigator
5. Verify: tapping SHELTER vertex navigates to `p31ca.org`

---

## DONE CRITERIA

After all steps complete:

```
✅ packages/bus — 12+ tests, < 4KB bundle, zero deps
✅ Shelter emits spoons/voltage/mode onto bus (localStorage)
✅ Standalone HTMLs read from bus (same localStorage keys)
✅ apps/navigator — Jitterbug at phosphorus31.org, < 50KB, Lighthouse > 90
✅ MAR10 Day gold star visible in navigator center
✅ pnpm test from root: 200+ tests passing
✅ docs/GOD.md and docs/P31_MASTER_SYNTHESIS.md in repo
✅ phosphorus31.org is the navigator (not static HTML)
✅ p31ca.org Shelter vertex glows based on live spoon count
```

**The organism breathes. Nine islands are one continent.**

---

## CONSTRAINTS (same as always)

- Zero military/submarine/naval metaphors (Christyn's father was Navy — it's a trigger)
- AGPL v3 license on all new code
- Offline-first: everything works without network
- Spoon-aware: respect prefers-reduced-motion, degrade gracefully
- No Three.js / WebGL / heavy 3D libs (documented WebGL context exhaustion crisis)
- The bus has zero runtime dependencies
- Source of truth is per-key, not per-system (see bus keys.ts)

🔺
