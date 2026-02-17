# DEAD CODE PURGE REPORT
**Date:** 2026-02-14  
**Swarm:** SWARM 05 — SCOPE FRONTEND AUDIT  
**Agent:** 2 — Dead Code Purge

---

## UNUSED DEPENDENCIES

### Potentially Unused (Verify Before Removing)
- `autoprefixer` — May be used by PostCSS/Tailwind
- `eventemitter3` — Check if used in bridge/services
- `postcss` — Used by Tailwind
- `rollup-plugin-visualizer` — Build tool, may be optional
- `tailwindcss` — Used by Tailwind (keep)

### Missing Dependencies (Referenced but not installed)
- `@axe-core/react` — Needed for Agent 6 (a11y audit)
- `@react-three/rapier` — Used in CoherenceKeeper.tsx
- `@monaco-editor/react` — Used in ModuleMaker.tsx
- `framer-motion` — Used in PerfectOnboarding.tsx
- `@react-three/postprocessing` — Used in PhenixNavigatorDemo.tsx
- `postprocessing` — Used in PhenixNavigatorDemo.tsx
- `qrcode` — Used in core/FamilyOnboarding.tsx

**Action:** Install missing dependencies or remove/comment out code that uses them.

---

## GHOST FILES

### Duplicate Files
1. **`src/services/geodesic-engine.ts`** vs **`src/engine/geodesic-engine.ts`**
   - Check if both are used
   - If `engine/` is canonical, remove `services/` version

2. **`src/App_old.tsx`**
   - Excluded from tsconfig.json
   - Likely a backup/old version
   - **Action:** Delete if confirmed unused

### Old Service Files
- `src/services/` directory exists with 4 files
- `src/engine/` directory exists with 12 files
- Verify if `services/` files are replaced by `engine/` modules

---

## DEAD EXPORTS (ts-prune)

Many exports marked as "used in module" are actually used. Focus on:
- Exports with no "used in module" marker
- Default exports that might be unused

**Note:** ts-prune output shows many exports are actually used. Manual review needed for truly dead exports.

---

## CIRCULAR DEPENDENCIES

**Action Required:** Run `npx madge --circular src/` to detect circular imports.

---

## RECOMMENDATIONS

1. **Delete `App_old.tsx`** if confirmed unused
2. **Resolve duplicate `geodesic-engine.ts`** — keep one canonical version
3. **Install missing dependencies** or remove code that requires them
4. **Run circular dependency check** with madge
5. **Review unused dependencies** — some may be build-time only

---

**Next:** Agent 3 — Zustand Store Audit
