# Lint Report - Cognitive Shield

**Generated:** 2026-01-03  
**After Auto-Fix:** Yes  
**Prettier Applied:** Yes

---

## Summary

- **Total Errors:** 498
- **Total Warnings:** 102
- **Total Issues:** 600
- **Auto-Fixable:** 159 errors, 1 warning (already fixed)
- **Remaining Manual Fixes:** 339 errors, 101 warnings

---

## Errors by Category

### CRITICAL (Type Safety & Promise Handling)
**Count:** ~150 errors

**Rule Categories:**
- `@typescript-eslint/no-misused-promises` - Promise-returning functions in wrong contexts
- `@typescript-eslint/no-floating-promises` - Unhandled promises
- `@typescript-eslint/no-unsafe-*` - Unsafe type operations (assignment, call, member access, return, argument)
- `@typescript-eslint/no-deprecated` - Use of deprecated APIs

**Examples:**
- `src/components/CalibrationReport.tsx:686:21` - Promise-returning function in attribute
- `src/components/CatchersMitt.tsx:164:17` - Promise-returning function in attribute
- `src/components/BreathEngine.tsx:480:36` - Floating promise
- Multiple `no-unsafe-*` violations in `ResponseComposer.tsx`, `SettingsPanel.tsx`, `vibe-coder.ts`

**Fix Priority:** 🔴 **IMMEDIATE** - These can cause runtime errors

---

### HIGH (Code Quality & Type Safety)
**Count:** ~180 errors

**Rule Categories:**
- `@typescript-eslint/no-unused-vars` - Unused variables/imports
- `@typescript-eslint/no-explicit-any` - Explicit `any` types
- `@typescript-eslint/no-non-null-assertion` - Non-null assertions
- `@typescript-eslint/no-unnecessary-type-assertion` - Unnecessary type assertions
- `@typescript-eslint/restrict-template-expressions` - Invalid template literal types

**Examples:**
- `src/components/BreathEngine.tsx:163:9` - Unused variable `targetSize`
- `src/components/BreathEngine.tsx:363:9` - Unused variable `oscillatorRef`
- `src/components/FAQ.tsx:25:3` - Unused import `MessageCircle`
- Multiple template expression errors (numbers in template literals)

**Fix Priority:** 🟠 **HIGH** - Code cleanup and type safety

---

### MEDIUM (React Hooks & Code Patterns)
**Count:** ~100 errors

**Rule Categories:**
- `@typescript-eslint/no-confusing-void-expression` - Void expressions in arrow functions
- `react-hooks/exhaustive-deps` - Missing dependencies in hooks
- `@typescript-eslint/require-await` - Async functions without await
- `@typescript-eslint/no-unnecessary-condition` - Unnecessary conditionals

**Examples:**
- `src/App.tsx:61:40` - Void expression in arrow function
- `src/components/DailyCheckIn.tsx:33:6` - Missing dependency in useEffect
- `src/lib/native-bridge.ts:22:8` - Async function without await

**Fix Priority:** 🟡 **MEDIUM** - Code quality improvements

---

### LOW (Style & Preferences)
**Count:** ~70 warnings + ~50 errors

**Rule Categories:**
- `@typescript-eslint/prefer-nullish-coalescing` - Prefer `??` over `||`
- `@typescript-eslint/prefer-optional-chain` - Prefer optional chaining
- `@typescript-eslint/no-redundant-type-constituents` - Redundant types
- `no-duplicate-imports` - Duplicate imports

**Examples:**
- `src/App.tsx:797:34` - Prefer nullish coalescing
- `src/components/CheckInStatusBadge.tsx:72:28` - Prefer nullish coalescing
- `src/components/SimulatedAbdicationReport.tsx:15:1` - Duplicate import

**Fix Priority:** 🟢 **LOW** - Style improvements

---

## Top 10 Most Violated Rules

1. **`@typescript-eslint/restrict-template-expressions`** - ~80 violations
   - Numbers and other types in template literals need explicit conversion

2. **`@typescript-eslint/no-confusing-void-expression`** - ~70 violations
   - Arrow functions returning void need braces

3. **`@typescript-eslint/no-unused-vars`** - ~60 violations
   - Unused variables, imports, and parameters

4. **`@typescript-eslint/no-unsafe-*`** - ~50 violations
   - Unsafe type operations (any types)

5. **`@typescript-eslint/no-unnecessary-condition`** - ~40 violations
   - Unnecessary conditionals that are always true/false

6. **`@typescript-eslint/no-misused-promises`** - ~30 violations
   - Promises used in wrong contexts

7. **`@typescript-eslint/prefer-nullish-coalescing`** - ~25 warnings
   - Prefer `??` over `||`

8. **`@typescript-eslint/no-floating-promises`** - ~20 violations
   - Unhandled promises

9. **`@typescript-eslint/no-non-null-assertion`** - ~15 warnings
   - Non-null assertions

10. **`react-hooks/exhaustive-deps`** - ~10 warnings
    - Missing dependencies in React hooks

---

## Files with Most Issues (Top 10)

1. **`src/components/NerdLab.tsx`** - ~80 issues
   - Many void expressions, template expressions, floating promises

2. **`src/components/ModuleManager.tsx`** - ~60 issues
   - Void expressions, template expressions

3. **`src/components/PreLaunchSequence.tsx`** - ~50 issues
   - Template expressions, unnecessary conditions, floating promises

4. **`src/components/ResponseComposer.tsx`** - ~45 issues
   - Unsafe any operations, void expressions, template expressions

5. **`src/components/SettingsPanel.tsx`** - ~40 issues
   - Void expressions, unsafe operations, template expressions

6. **`src/components/SonicShield.tsx`** - ~35 issues
   - Void expressions, floating promises, template expressions

7. **`src/components/SomaticRegulation.tsx`** - ~30 issues
   - Void expressions, template expressions

8. **`src/lib/vibe-coder.ts`** - ~30 issues
   - Unsafe any operations, unused vars, template expressions

9. **`src/store/shield.store.ts`** - ~25 issues
   - Unsafe any operations, floating promises, template expressions

10. **`src/components/BreathEngine.tsx`** - ~20 issues
    - Unused vars, unsafe operations, template expressions

---

## Recommended Fix Order

### Phase 1: CRITICAL (Do First)
1. Fix all `no-misused-promises` errors - Wrap async handlers properly
2. Fix all `no-floating-promises` errors - Add `.catch()` or `void` operator
3. Fix all `no-unsafe-*` errors - Add proper type guards and assertions

**Estimated Time:** 4-6 hours  
**Files Affected:** ~30 files

### Phase 2: HIGH (Do Second)
1. Remove unused variables and imports
2. Replace explicit `any` types with proper types
3. Fix template expression errors (convert numbers to strings)
4. Remove unnecessary type assertions

**Estimated Time:** 3-4 hours  
**Files Affected:** ~40 files

### Phase 3: MEDIUM (Do Third)
1. Fix void expressions in arrow functions (add braces)
2. Fix React hooks exhaustive deps warnings
3. Remove unnecessary conditionals
4. Fix async functions without await

**Estimated Time:** 2-3 hours  
**Files Affected:** ~25 files

### Phase 4: LOW (Do Last)
1. Replace `||` with `??` where appropriate
2. Remove duplicate imports
3. Fix redundant type constituents

**Estimated Time:** 1-2 hours  
**Files Affected:** ~20 files

---

## Auto-Fix Results

✅ **Fixed:**
- Duplicate imports (removed)
- Formatting (Prettier applied)
- Some auto-fixable lint rules

❌ **Remaining (Manual Fix Required):**
- Type safety issues (CRITICAL)
- Unused variables (HIGH)
- Void expressions (MEDIUM)
- Template expressions (HIGH)
- Promise handling (CRITICAL)

---

## Manual Fix Examples

### CRITICAL: Fix Floating Promises
```typescript
// ❌ Before
someAsyncFunction();

// ✅ After
void someAsyncFunction();
// OR
someAsyncFunction().catch(console.error);
```

### HIGH: Fix Template Expressions
```typescript
// ❌ Before
`Count: ${count}`

// ✅ After
`Count: ${String(count)}`
// OR
`Count: ${count.toString()}`
```

### MEDIUM: Fix Void Expressions
```typescript
// ❌ Before
onClick={() => setState(value)}

// ✅ After
onClick={() => { setState(value); }}
```

### HIGH: Remove Unused Variables
```typescript
// ❌ Before
const unused = compute();

// ✅ After
// Remove or prefix with _ if intentionally unused
const _unused = compute();
```

---

## Next Steps

1. **Agent 2 (Type Safety):** Fix all CRITICAL type errors
2. **Agent 3 (Code Quality):** Fix HIGH priority issues
3. **Agent 4 (Refactoring):** Fix MEDIUM priority issues
4. **Final Polish:** Fix LOW priority style issues

---

**End of Lint Report**