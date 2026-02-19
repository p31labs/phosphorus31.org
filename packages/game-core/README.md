# @p31labs/game-core

Phase transition — freeze/thaw physics for bonding and mesh. Zero app dependencies.

## API

- `freeze()` — Lock current state into rigid geometry (phase transition).
- `thaw()` — Release back to fluid/editable state.
- `getPhase()` — Current phase: `"fluid"` | `"frozen"`.
- `resetPhase()` — Reset to fluid (tests / new session).

## Wiring

Bonding UI (`ui/src/views/BondingView.tsx` or future `apps/bonding`) imports `@p31labs/game-core` and uses freeze/thaw in its physics loop. game-engine remains the source for XP, L.O.V.E., quests; game-core is only for phase transition.

## Claude merge

Full phase logic can be adopted from Claude's p31-universe when merged. No tests required for merge; add more as needed.
