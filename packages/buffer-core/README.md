# @p31labs/buffer-core

The Buffer scoring engine — voltage calculator, spoon tracker, P31 Governor PID controller. Pure TypeScript math layer; no app dependencies.

## Canonical export surface

- **scorer** — `computeVoltage`, `scoreAxis`, `getGateConfig` (V = U×0.4 + E×0.3 + C×0.3)
- **governor** — `SamsonV2Controller` (PID: Kp=0.15, Ki=0.05, Kd=0.01, anti-windup ±10)
- **spoons** — `SpoonTracker` (max 12, recharge 0.5/hr)
- **bluf** — `extractBLUF` (Bottom Line Up Front)
- **patterns** — `detectPassiveAggressive`
- **constants** — `MARK1`, `LARMOR_HZ`, `GATES`, `SPOON_COSTS`, `HEARTBEATS`, `SAMSON` (governor config), etc.
- **types** — `VoltageScore`, `GateName`, `SpoonState`, `SamsonState`, etc.

## Where bus and config live

- **bus** — Not in this package. The nervous system (`bus.js`) is a standalone file in the p31ca.org Level 1 static site (e.g. `apps/web/` or launch root). Offline: localStorage + BroadcastChannel; online: Centaur sync.
- **god.config** — Repo root `god.config.ts`. Shared by apps; not part of buffer-core so the package stays dependency-free.

## Tests

`pnpm test` (Vitest). Do not rewrite the math; this package is the canonical source for scoring and PID.
