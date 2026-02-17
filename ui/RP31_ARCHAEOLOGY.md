# RP31-FINAL Phase 1: Archaeology — Living vs Dead Code

**Entry point:** `main.tsx` → `P31Routes` only (no App, LandingGate, GenesisProvider, TrimtabProvider).

## ALIVE — Imported by main.tsx → P31Routes → route tree

- `src/main.tsx`
- `src/lib/p31-storage.ts`
- `src/routes/P31Routes.tsx`
- `src/components/ErrorBoundary/index.ts`, `WebErrorBoundary.tsx`
- `src/core/events/bus.ts`
- `src/services/meshAdapter.ts`
- `src/components/QuantumHelloWorld/QuantumHelloWorld.tsx`, `PosnerViz.tsx`, `constants.ts`, `types.ts`
- `src/components/SonicMolecule.tsx`
- `src/components/Waveform.tsx`
- `src/components/MeshLayout.tsx`
- `src/lib/resonance-engine.ts`
- `src/lib/game-client.ts`
- `src/views/MeshView.tsx`, `ScopeView.tsx`, `FoldView.tsx`, `WalletView.tsx`, `ChallengesView.tsx`, `SproutView.tsx`, `IdentityView.tsx`, `DomeView.tsx`
- `src/styles.css`, `src/styles/accessibility.css`, `src/styles/p31-forms.css`, `src/styles/molecule-builder.css`
- `src/vite-env.d.ts`

## DEAD — Not in the live route tree (do not compile for production)

- `src/App.tsx`, `src/App_old.tsx` — old entry points
- `src/components/LandingGate.tsx` — replaced by QuantumHelloWorld at /
- GenesisProvider, TrimtabProvider — not used by main
- `src/nodes/**`, `src/components/Scope/**`, `src/components/Buffer/**`, `src/components/DemoDashboard/**`, `src/components/WorldBuilder/**`, `src/components/3d/**`, `src/components/QuantumClock/**`, `src/components/Buddy/**`, `src/components/Game/**`, `src/components/MVP/**`, `src/components/Marketplace/**`, `src/components/P31Dashboard/**`, `src/components/GeodesicPortal/**`, `src/components/agents/**`, `src/components/Oracle/**`, `src/components/Molecule/**`, `src/components/quantum/**`, `src/components/ui/QuantumCanvas.tsx`, `src/components/Toolbar/**`, `src/components/CoherenceSync.tsx`, `src/components/demo/**`, `src/components/Icons/**` (unless used by live tree), `src/organisms/**`, `src/pages/**`, `src/contexts/**`, `src/quantum/**`
- `src/stores/**` (heartbeat, shield, buffer, swarm, etc.) — not imported by P31Routes tree
- `src/bridge/**`, `src/engine/**` (except any used by live tree; live tree uses only lib/resonance-engine, lib/game-client)
- `src/__tests__/**`, `src/**/*.test.*`, `src/**/*.stories.*`
- `src/store/**`, `src/config/god.config.ts` (legacy), `src/services/oracle.ts`, `src/services/*.ts` except meshAdapter
- `src/test-dev-server.ts`, `src/test-p31-import.ts`, `src/demo-data.ts`
- All other files not reachable from main.tsx → P31Routes

**Do not delete yet.** Isolated via tsconfig.build.json include list.
