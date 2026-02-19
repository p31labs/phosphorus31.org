# @p31labs/network-core

LoRa codec — DataView bit-packing, Posner payload (119 bytes). Zero app dependencies.

## Current state

- **Scaffold** — Package exists with canonical `POSNER_PAYLOAD_BYTES = 119` and stub `encodePosnerPayload` / `decodePosnerPayload`.
- **Full implementation** — Adopt from Claude's p31-universe: full codec logic and **44 tests**. Do not rewrite; replace stubs when Claude's tree is merged.

## Usage (after merge)

```ts
import { encodePosnerPayload, decodePosnerPayload, POSNER_PAYLOAD_BYTES } from "@p31labs/network-core";
```

## Tests

`pnpm test` (Vitest). Stub tests pass; full 44-test suite will pass once Claude's codec is in place.
