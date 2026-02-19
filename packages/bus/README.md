# @p31labs/bus

Universal state bus for the P31 ecosystem. Zero dependencies. Under 4KB.

Bridges Shelter (Zustand), standalone HTMLs (localStorage), React artifacts (useBus hook), and Node One (Web Serial stub).

## API

```typescript
import { createBus, BUS_KEYS } from '@p31labs/bus';
const bus = createBus();

bus.emit(BUS_KEYS.SPOONS, 8);           // Write
const v = bus.get(BUS_KEYS.SPOONS);     // Read (synchronous)
const unsub = bus.on(BUS_KEYS.SPOONS, (e) => {}); // Subscribe
unsub();                                 // Unsubscribe
bus.snapshot();                          // All key-value pairs
bus.destroy();                           // Cleanup
```

## React Hook

```typescript
import { useBus } from '@p31labs/bus/react';
const spoons = useBus<number>('p31:spoons') ?? 12;
```

## Standalone HTML

```html
<script type="module">
  import { createBus } from './bus.esm.js';
  const bus = createBus();
  bus.on('p31:spoons', ({ value }) => console.log(value));
</script>
```

## Canonical Keys

See `src/keys.ts`. All keys prefixed with `p31:`. Source of truth is per-key (Shelter owns spoons, BONDING owns molecule, etc).

## Adapters

- **localStorage** — persistence + cross-tab storage events
- **BroadcastChannel** — instant cross-tab messaging
- **Web Serial** — stub for Node One hardware (future)

## License

AGPL-3.0
