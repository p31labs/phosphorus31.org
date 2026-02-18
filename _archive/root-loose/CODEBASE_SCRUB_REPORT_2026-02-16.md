# Codebase scrub report — 2026-02-16

Meticulous scrub for build/lint/config errors across the P31 ecosystem and cognitive-shield.

---

## Summary

| Area | Status | Notes |
|------|--------|------|
| **p31/ui — WorldBuilder.tsx** | Fixed | Missing closing `</div>` for overlay panel (JSX structure). |
| **p31/apps/shelter — ESLint** | Fixed | Replaced React-focused config with Node/TS-only config; added `no-unused-expressions` options to avoid crash. |
| **cognitive-shield — tsconfig.build.json** | Fixed | Set `allowImportingTsExtensions: false` so build can emit (TS5096). |
| **cognitive-shield — ESLint** | Fixed | Added `eslint.config.js` (flat config) using `@typescript-eslint/parser` and plugin; lint scoped to `src/**/*.ts`. |
| **cognitive-shield — accommodation.ts** | Fixed | Unused `operatorState` / `_existingHash` lint errors resolved (rename + disable for destructure-omit). |

---

## Fixes applied

### 1. `ui/src/components/WorldBuilder/WorldBuilder.tsx`
- **Issue:** `JSX element 'div' has no corresponding closing tag` (TS17008).
- **Cause:** The overlay panel `<div>` opened at line 215 was never closed before `</SwitchControlManager>`.
- **Change:** Added the missing `</div>` before `</SwitchControlManager>`.

### 2. `apps/shelter/eslint.config.js`
- **Issue:** ESLint crashed with `Cannot read properties of undefined (reading 'allowShortCircuit')` in `@typescript-eslint/no-unused-expressions`.
- **Cause:** Config was a copy of the UI config (React hooks/refresh); strict TypeScript rules were applied without explicit options for `no-unused-expressions`.
- **Change:** Replaced with a Node/TS-only config (no React plugins) and added explicit `@typescript-eslint/no-unused-expressions` options: `allowShortCircuit: true`, `allowTernary: true`, `allowTaggedTemplates: true`.

### 3. `cognitive-shield/tsconfig.build.json`
- **Issue:** Build failed with TS5096: `allowImportingTsExtensions` can only be used when `noEmit` or `emitDeclarationOnly` is set.
- **Cause:** Base `tsconfig.json` has `allowImportingTsExtensions: true` and `noEmit: true`; build config set `noEmit: false` but did not override the flag.
- **Change:** Set `allowImportingTsExtensions: false` in `tsconfig.build.json`.

### 4. `cognitive-shield/eslint.config.js`
- **Issue:** ESLint 9 could not find `eslint.config.js`; after adding one that used `typescript-eslint`, the package was not installed.
- **Change:** Added `eslint.config.js` using existing deps (`@typescript-eslint/parser`, `@typescript-eslint/eslint-plugin`), restricted to `src/**/*.ts`, and ignored non-TS paths (apps-script, shared, frontend, configs, `.d.ts`). Updated npm script to `eslint "src/**/*.ts"`.

### 5. `cognitive-shield/src/engine/accommodation.ts`
- **Issue:** Two `@typescript-eslint/no-unused-vars` errors: unused `operatorState` in destructuring, and unused `_existingHash` when destructuring to omit `hash`.
- **Change:** Renamed to `_operatorState` in the map callback; for the hash omit, added an `eslint-disable-next-line` and kept `_hash` (intentional destructure to exclude field).

---

## Remaining known issues (not fixed in this scrub)

### p31/ui
- **TypeScript:** Many TS errors remain (e.g. missing `@p31/shared`, React/Three type mismatches, integration test typings, `App_old.tsx` and other legacy files). The only fix applied here was the WorldBuilder JSX so that one blocking syntax error is gone.
- **ESLint:** `.eslintrc.cjs` does not use the TypeScript parser, so `.ts`/`.tsx` are parsed as JS and produce many “Unexpected token” / “interface is reserved” parse errors. To fix properly, add `@typescript-eslint/parser` (and plugin) to the UI and point the parser at the TS config.

### p31/apps/shelter
- **Lint:** After the config fix, lint runs but reports many rule violations (e.g. `no-unsafe-assignment`, `restrict-template-expressions`, `require-await`, `no-console` in easter-eggs). These are left for a follow-up; the runner no longer crashes.

### cognitive-shield
- **Build:** `tsc -p tsconfig.build.json` still fails for other reasons: `rootDir` (shared/god.config not under `src`), `allowSyntheticDefaultImports` for default imports, and implicit `any` in server routes. Only the `allowImportingTsExtensions` issue was fixed.
- **Lint:** Exit code 0 with 10 warnings (all `no-console`). Warnings left as-is.

### @ts-ignore
- **ui:** `FamilyConnection.tsx` (lines 135, 137) uses `// @ts-ignore` for WebSerial API; noted, not changed.

---

## Recommendations

1. **ui:** Add TypeScript parser and `@typescript-eslint` to `.eslintrc.cjs` (or migrate to flat config) so lint runs on TS/TSX without parse errors.
2. **ui:** Resolve or isolate legacy/duplicate files (e.g. `App_old.tsx`, integration tests) so `tsc --noEmit` can be tightened (e.g. exclude or fix).
3. **shelter:** Triage lint findings (template expressions, unsafe any, async/await, console) and either fix or relax rules in `eslint.config.js`.
4. **cognitive-shield:** Adjust build layout (e.g. include `shared` in `rootDir` or split projects) and add `allowSyntheticDefaultImports` / type middleware so `npm run build` succeeds.

---

## Addendum 2026-02-17 — "Dirty work" pass

| Area | Change |
|------|--------|
| **ui/.eslintrc.cjs** | Added `@typescript-eslint/parser` and `plugin:@typescript-eslint/recommended` so `.ts`/`.tsx` parse correctly; added `no-unused-expressions` options to avoid crash; delegated `no-unused-vars` to `@typescript-eslint/no-unused-vars`. |
| **ui/package.json** | Added devDependencies: `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`. |
| **ui/src/engine/shield-filter.test.ts** | Fixed "blocks high voltage + high severity" test: use `mockReturnValueOnce` for voltage (score 9, category 'high') and `hasHighSeverityThreats` (true) so the implementation consistently takes the block branch. |
| **ui/src/components/3d/QuantumVisualization3D.tsx** | Fixed conditional hooks in `BlochSphere`: moved `useFrame` and `useMemo` above the `if (!node) return null` and guarded inside callbacks; prefixed unused `EntanglementLine` args with `_`. |
| **ui/src/nodes/node-d-shield/ProgressiveDisclosure.tsx** | Fixed conditional `useShieldStore`: call `useShieldStore` at top of component, then early-return when `!message`. |
| **ui build** | `npm run build` completes successfully. |

Lint still reports many warnings (unused vars, `any`, `no-console`, etc.) and some errors in other files (e.g. `prefer-const`, `@ts-ignore` → `@ts-expect-error`, empty blocks). Those remain for follow-up; hook errors in QuantumVisualization3D and ProgressiveDisclosure are resolved.

---

*Scrub completed. The mesh holds.*
