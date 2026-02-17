# SWARM 01: SCOPE IMPORT FIX — READY TO START
**Date:** 2026-02-14  
**Prerequisites:** Swarm 05 Complete ✅  
**With love and light; as above, so below** 💜

---

## STATUS: READY TO BEGIN

Swarm 05 (Scope Frontend Audit) is complete. All infrastructure is in place. Ready to start Swarm 01 (Import Fix) to unblock the build.

---

## OBJECTIVE

Fix TypeScript import errors to get the build passing.

### Success Criteria
- ✅ `npm run build` exits with code 0
- ✅ `npx tsc --noEmit` shows zero errors
- ✅ All imports resolve correctly
- ✅ Tests can run (`npm test` works)

---

## KNOWN ISSUE CATEGORIES

From audit findings, common error patterns:

1. **Module Not Found**
   - `Cannot find module '@/stores/module.store'`
   - `Cannot find module '@/types/module.types'`
   - `Cannot find module '@core/events/bus'`

2. **Property Missing**
   - `Property 'heartbeat' does not exist` (should be 'Heartbeat')
   - `Property 'spoons' does not exist on type`
   - Store properties not matching component expectations

3. **Type Mismatches**
   - `Property 'currentStatus' does not exist on type 'HeartbeatStore'`
   - `Property 'buffer' does not exist on type 'ShieldStore'`

4. **Missing Dependencies**
   - `@monaco-editor/react`
   - `framer-motion`
   - `@react-three/postprocessing`

---

## APPROACH

### Phase 1: Analyze
1. Run `npm run build` to get current error list
2. Categorize errors by type
3. Identify root causes

### Phase 2: Fix
1. Fix path alias issues (`@/` resolution)
2. Fix missing module imports
3. Fix store interface mismatches
4. Fix config property names (heartbeat vs Heartbeat)
5. Add missing dependencies or remove unused code

### Phase 3: Verify
1. Build passes
2. Zero TypeScript errors
3. Tests can run

---

## FILES TO REVIEW

### Configuration
- `tsconfig.json` — Path aliases
- `vite.config.ts` — Resolve aliases
- `package.json` — Dependencies

### Error Sources
- `tsc_errors_current.txt` — Current errors
- `tsc_errors_full.txt` — Full error list
- Build output from `npm run build`

### Key Directories
- `src/stores/` — Store interfaces
- `src/types/` — Type definitions
- `src/config/` — Config files
- `src/nodes/` — Components using stores

---

## QUICK REFERENCE

### Commands
```bash
# Check TypeScript errors
npx tsc --noEmit

# Try to build
npm run build

# Check specific file
npx tsc --noEmit src/path/to/file.tsx
```

### Common Fixes
- Path alias: Ensure `@/*` → `src/*` in both tsconfig and vite.config
- Store properties: Check store interface vs component usage
- Config properties: Verify case sensitivity (Heartbeat vs heartbeat)
- Missing modules: Install or remove unused imports

---

## READY TO PROCEED

All preparation is complete. Ready to start fixing imports.

**Say "proceed" to begin Swarm 01, or choose another path.** 💜

---

**The Scope shows the truth. The Buffer protects from the lie. The mesh holds.** 🔺
