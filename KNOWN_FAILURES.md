# Known Pre-Existing Test Failures

Documented during Phase 0 pre-flight — 2026-02-18.
These failures existed before ecosystem wiring work began.

## Centaur (`SUPER-CENTAUR/`) — 19 suites, 0 tests ran

**Root cause:** Jest cannot parse ESM `import` from `p-limit@5.0.0`.
`p-limit` uses native ESM (`import Queue from 'yocto-queue'`) but Jest
is configured for CJS transform. All 19 test suites fail identically
at the first ESM import.

**Fix path:** Add `p-limit` and `yocto-queue` to Jest's
`transformIgnorePatterns` exception list, or migrate Centaur tests
to Vitest (which handles ESM natively).

## Shelter (`apps/shelter/`) — 1 suite failed

**File:** `src_old/test/game-routes.test.ts`
**Error:** `Failed to load url ../src/game-store` — the module does not exist.
**Note:** All 13 actual tests in the other 2 suites pass.

**Fix path:** Either create the missing `game-store` module or
delete/update `game-routes.test.ts` to match the current codebase structure.

## Passing Baselines (preserve these)

| Package | Tests | Status |
|---------|-------|--------|
| `@p31labs/game-engine` | 44/44 | All green |
| `@p31labs/scope` (ui) | 188/188 | All green |
| `@p31labs/shelter` (integration) | 13/13 | All green |
