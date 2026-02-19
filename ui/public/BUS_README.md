# Bus ESM bundle

`bus.esm.js` is the built bundle of `@p31labs/bus`. Level 1 standalone HTMLs can:

- **Option A:** `import { createBus } from '/bus.esm.js'` (or relative path) and use `bus.emit()`, `bus.get()`, `bus.on()`.
- **Option B:** Read the same keys from localStorage: `localStorage.getItem('p31:spoons')`, `p31:voltage`, `p31:mode`, etc. Shelter (p31ca.org) writes these via the bus, so cross-tab and same-origin HTMLs see the same state.

Keys are defined in `@p31labs/bus` / `packages/bus/src/keys.ts`.
