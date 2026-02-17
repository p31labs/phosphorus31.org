# AGENT 1: IMPORT GRAPH EXTRACTION REPORT

**Date:** 2026-02-14  
**Status:** ✅ COMPLETE  
**Output:** `src/IMPORT_REWRITE_MAP.json`

---

## SUMMARY

Extracted all import statements from the `ui/src/` directory and built a comprehensive rewrite map for fixing broken imports after the tetrahedron node restructuring.

---

## KEY FINDINGS

### 1. Path Aliases Configuration ✅
- **tsconfig.json:** Path alias `@/*` → `src/*` is configured
- **vite.config.ts:** Path alias `@` → `src` is configured
- **Status:** Path aliases are properly set up

### 2. God Config Duplication ⚠️
- **`src/god.config.ts`:** Full config (136 lines) - **CANONICAL**
- **`src/config/god.config.ts`:** Minimal config (42 lines) - **OUTDATED**
- **Issue:** Nodes use `@/config/god.config` which points to the outdated file
- **Solution:** All `@/config/god.config` imports should be rewritten to `@/god.config`

### 3. Services → Engine Migration
- **Old:** `services/geodesic-engine.ts` (still exists)
- **New:** `engine/geodesic-engine.ts` (created during restructuring)
- **Files affected:** 
  - `stores/shield.store.ts`
  - `test-dev-server.ts`
  - `App.jsx`

### 4. Store Path Inconsistencies
- **Old pattern:** `../store/shield.store` or `../store/heartbeat.store`
- **New pattern:** `@/stores/shield.store` or `@/stores/heartbeat.store`
- **Files affected:** Multiple components in `components/` directory

### 5. Relative vs Absolute Imports
- **Current state:** Mix of relative (`../`, `./`) and absolute (`@/`) imports
- **Target state:** All internal imports should use `@/` alias for consistency

---

## REWRITE MAP STATISTICS

- **Total rewrite rules:** 15
- **Total affected files:** ~70+ files
- **Primary patterns:**
  1. `../services/geodesic-engine` → `@/engine/geodesic-engine` (3 files)
  2. `../god.config` → `@/god.config` (50+ files)
  3. `@/config/god.config` → `@/god.config` (7 files)
  4. `../store/*` → `@/stores/*` (6 files)

---

## FILES REQUIRING REWRITES

### Critical (Blocking Build)
1. `stores/shield.store.ts` - `services/geodesic-engine` → `engine/geodesic-engine`
2. `test-dev-server.ts` - `services/geodesic-engine` → `engine/geodesic-engine`
3. `App.jsx` - `services/geodesic-engine` → `engine/geodesic-engine`

### High Priority (Many Files)
- All components using `../god.config` (50+ files)
- All nodes using `@/config/god.config` (7 files)
- Components using `../store/*` (6 files)

### Medium Priority (Consistency)
- Files using relative imports that could use `@/` alias
- Type imports that could be standardized

---

## EDGE CASES IDENTIFIED

1. **God Config Duplication:**
   - Two config files exist
   - Nodes reference the outdated one
   - Need to standardize on `@/god.config` (the full version)

2. **Store Naming:**
   - Some files reference `phenix.store` which should be `genesis` store
   - Need to verify if `phenix.store` exists or is renamed

3. **Missing Files (from TS errors):**
   - `types/checkin.types` - may need to be created
   - `lib/checkin-scoring` - may need to be created
   - Various config files referenced but not found

4. **Barrel Exports:**
   - `types/index.ts` exists - check if it re-exports correctly
   - Some imports use `../types` which should resolve via barrel

---

## NEXT STEPS (Agent 2)

1. Execute all rewrites from `IMPORT_REWRITE_MAP.json`
2. Verify path aliases are working in vite.config.ts
3. Handle god.config duplication (update or remove outdated file)
4. Check for circular dependencies after rewrites
5. Run TypeScript check to verify error count reduction

---

## VALIDATION

After Agent 2 completes, verify:
- ✅ `npx tsc --noEmit` shows reduced error count
- ✅ All "Cannot find module" errors for moved files are resolved
- ✅ Build succeeds: `npm run build`
- ✅ No circular dependency warnings

---

**Agent 1 Status:** ✅ COMPLETE  
**Output File:** `src/IMPORT_REWRITE_MAP.json`  
**Ready for Agent 2:** ✅ YES
