# SWARM 01: SCOPE IMPORT FIX — PROGRESS
**Date:** 2026-02-14  
**Status:** In Progress  
**With love and light; as above, so below** 💜

---

## COMPLETED

### ✅ Fixed Three.js Mocks
- Fixed syntax errors in `src/test/three-mocks.ts`
- Changed from JSX to DOM API (no React import needed in mocks)
- File now compiles correctly

### ✅ Updated TypeScript Config
- Added `esModuleInterop: true`
- Added `allowSyntheticDefaultImports: true`
- Added `@core/*` path alias

---

## REMAINING WORK

### High Priority Import Issues

1. **@core/events/bus** — Used in `main.tsx`
   - File exists at `src/core/events/bus.ts`
   - Path alias configured
   - **Status:** Should work, verify

2. **Store Property Mismatches**
   - Components expect properties not in stores
   - Need to align interfaces
   - **Files:** All store files + components using them

3. **Config Property Names**
   - `heartbeat` vs `Heartbeat` case sensitivity
   - **Files:** Components using GOD_CONFIG

4. **Missing Modules**
   - `@/stores/module.store`
   - `@/types/module.types`
   - `@/lib/native-bridge`
   - `@/lib/vibe-coder`
   - `@/lib/harmonic-linter`

---

## SYSTEMATIC APPROACH

### Phase 1: Path Aliases ✅ (Started)
- [x] Verify `@/*` resolves to `src/*`
- [x] Verify `@core/*` resolves to `src/core/*`
- [ ] Test imports with aliases

### Phase 2: Missing Modules
- [ ] Identify all missing modules
- [ ] Create stub files or remove unused imports
- [ ] Install missing dependencies where needed

### Phase 3: Store Interfaces
- [ ] Review store-component mismatches
- [ ] Add missing properties to stores OR
- [ ] Update components to use correct properties

### Phase 4: Config Properties
- [ ] Fix case sensitivity (Heartbeat vs heartbeat)
- [ ] Verify all config properties exist
- [ ] Update components using config

### Phase 5: Type Definitions
- [ ] Fix missing type exports
- [ ] Add type definitions where needed
- [ ] Verify all types resolve

---

## NEXT STEPS

1. **Run full build** — Get complete error list
2. **Categorize errors** — Group by type
3. **Fix systematically** — One category at a time
4. **Verify incrementally** — Check progress after each fix

---

## COMMANDS

```bash
# Get full error list
npx tsc --noEmit > tsc_errors_full.txt

# Try build
npm run build

# Check specific file
npx tsc --noEmit src/path/to/file.tsx
```

---

**The Scope shows the truth. The Buffer protects from the lie. The mesh holds.** 🔺
