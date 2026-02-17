# Remaining Manual Fixes Required

**Generated:** 2026-01-03  
**After Auto-Fix:** Yes  
**Status:** 600 issues remaining (498 errors, 102 warnings)

---

## Summary

Auto-fix resolved **159 errors and 1 warning**. The following **498 errors and 102 warnings** require manual intervention.

**DO NOT manually fix TypeScript type errors** — that's Agent 2's job.  
**DO NOT restructure files** — that's Agent 4's job.  
**ONLY fix:** formatting, auto-fixable lint rules, import ordering (already done).

---

## CRITICAL Issues (Must Fix First)

### 1. Promise Handling Errors (~30 files)

**Rule:** `@typescript-eslint/no-misused-promises`  
**Rule:** `@typescript-eslint/no-floating-promises`

**Files with most issues:**
- `src/components/CalibrationReport.tsx:686:21`
- `src/components/CatchersMitt.tsx:164:17`
- `src/components/BreathEngine.tsx:480:36`
- `src/components/PreLaunchSequence.tsx:248:5`
- `src/components/ProcessedPayloadCard.tsx:41:13,315:17`
- `src/components/ResponseComposer.tsx:176:17,259:21`
- `src/components/SettingsPanel.tsx:61:7,366:31`
- `src/components/SonicShield.tsx:935:34,971:36`
- `src/store/heartbeat.store.ts:38:3,459:5`
- `src/store/shield.store.ts:95:11`

**Fix Pattern:**
```typescript
// ❌ Before
onClick={asyncFunction}

// ✅ After
onClick={() => { void asyncFunction(); }}
// OR
onClick={() => { asyncFunction().catch(console.error); }}
```

---

### 2. Unsafe Type Operations (~50 files)

**Rule:** `@typescript-eslint/no-unsafe-*`

**Files with most issues:**
- `src/components/ResponseComposer.tsx` - Multiple unsafe any operations
- `src/components/SettingsPanel.tsx` - Unsafe any assignments
- `src/lib/vibe-coder.ts` - Many unsafe operations
- `src/store/shield.store.ts` - Unsafe any operations
- `src/components/SimulatedAbdicationReport.tsx` - Unsafe error handling

**Fix Pattern:**
```typescript
// ❌ Before
const data: any = response.json();

// ✅ After
const data: unknown = response.json();
// Then add type guards
if (isValidData(data)) {
  // use data
}
```

**Note:** These require proper type definitions. Agent 2 should handle this.

---

## HIGH Priority Issues

### 3. Unused Variables/Imports (~60 files)

**Rule:** `@typescript-eslint/no-unused-vars`

**Examples:**
- `src/components/BreathEngine.tsx:163:9` - `targetSize`
- `src/components/BreathEngine.tsx:363:9` - `oscillatorRef`
- `src/components/FAQ.tsx:25:3` - `MessageCircle`
- `src/components/RestorativeReset.tsx:7:10` - `Heart`, `Shield`, `Activity`
- `src/lib/vibe-coder.ts:16:8` - `GOD_CONFIG`
- `src/lib/tetrahedron-math.ts:101:36` - `sicPOVMs`
- `src/types/heartbeat.types.ts:6:15` - `GOD_CONFIG`

**Fix:** Remove unused imports/variables or prefix with `_` if intentionally unused.

---

### 4. Template Expression Errors (~80 files)

**Rule:** `@typescript-eslint/restrict-template-expressions`

**Examples:**
- `src/components/BreathEngine.tsx:326:21` - Number in template
- `src/components/CalibrationReport.tsx:90:40` - Multiple number templates
- `src/components/CheckInHistory.tsx:234:32` - Number in template
- `src/components/PeerStatus.tsx:143:32` - Union type in template

**Fix Pattern:**
```typescript
// ❌ Before
`Count: ${count}`

// ✅ After
`Count: ${String(count)}`
// OR
`Count: ${count.toString()}`
```

---

### 5. Non-Null Assertions (~15 files)

**Rule:** `@typescript-eslint/no-non-null-assertion`  
**Rule:** `@typescript-eslint/no-unnecessary-type-assertion`

**Examples:**
- `src/components/CalibrationReport.tsx:185:55` - Unnecessary assertion
- `src/main.tsx:10:12` - Non-null assertion
- `src/store/heartbeat.store.ts:71:11` - Multiple assertions

**Fix:** Replace with proper null checks or optional chaining.

---

## MEDIUM Priority Issues

### 6. Void Expressions in Arrow Functions (~70 files)

**Rule:** `@typescript-eslint/no-confusing-void-expression`

**Examples:**
- `src/App.tsx:61:40,62:18,315:48`
- `src/components/BreathEngine.tsx:530:42`
- `src/components/CalibrationReport.tsx:61:18`
- `src/components/CatchersMitt.tsx:18:38,19:20`

**Fix Pattern:**
```typescript
// ❌ Before
onClick={() => setState(value)}

// ✅ After
onClick={() => { setState(value); }}
```

---

### 7. React Hooks Exhaustive Deps (~10 files)

**Rule:** `react-hooks/exhaustive-deps`

**Examples:**
- `src/App.tsx:66:59` - Unnecessary dependency `tick`
- `src/components/DailyCheckIn.tsx:33:6` - Missing dependency `questions`
- `src/components/FirstLightVerification.tsx:143:6` - Missing dependency

**Fix:** Add missing dependencies or remove unnecessary ones.

---

### 8. Unnecessary Conditionals (~40 files)

**Rule:** `@typescript-eslint/no-unnecessary-condition`

**Examples:**
- `src/components/BreathEngine.tsx:129:15` - Always truthy
- `src/components/PreLaunchSequence.tsx:34:17` - Always true (`4 === 4`)
- `src/components/DailyCheckIn.tsx:87:70` - Types have no overlap

**Fix:** Remove unnecessary conditionals or fix type narrowing.

---

## LOW Priority Issues

### 9. Prefer Nullish Coalescing (~25 warnings)

**Rule:** `@typescript-eslint/prefer-nullish-coalescing`

**Examples:**
- `src/App.tsx:797:34`
- `src/components/CheckInStatusBadge.tsx:72:28,112:31`
- `src/components/FAQ.tsx:503:63,526:55,532:58`

**Fix Pattern:**
```typescript
// ❌ Before
const value = obj?.prop || 'default';

// ✅ After
const value = obj?.prop ?? 'default';
```

---

### 10. Duplicate Imports (~3 files)

**Rule:** `no-duplicate-imports`

**Examples:**
- `src/components/SimulatedAbdicationReport.tsx:15:1` - Duplicate `native-bridge` import
- `src/lib/module-executor.ts:9:1` - Duplicate `react` import
- `src/store/shield.store.ts:18:1` - Duplicate `god.config` import

**Fix:** Merge duplicate imports.

---

## File-by-File Breakdown

### Top 10 Files Needing Most Work

1. **`src/components/NerdLab.tsx`** - ~80 issues
   - Void expressions, template expressions, floating promises

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

1. **CRITICAL:** Fix promise handling (30 files) - 4-6 hours
2. **CRITICAL:** Fix unsafe type operations (50 files) - Agent 2's job
3. **HIGH:** Remove unused variables (60 files) - 2-3 hours
4. **HIGH:** Fix template expressions (80 files) - 3-4 hours
5. **HIGH:** Remove non-null assertions (15 files) - 1 hour
6. **MEDIUM:** Fix void expressions (70 files) - 2-3 hours
7. **MEDIUM:** Fix React hooks deps (10 files) - 1 hour
8. **MEDIUM:** Remove unnecessary conditionals (40 files) - 2 hours
9. **LOW:** Prefer nullish coalescing (25 files) - 1 hour
10. **LOW:** Fix duplicate imports (3 files) - 15 minutes

---

## Next Agent Assignments

- **Agent 2 (Type Safety):** All `no-unsafe-*` errors, type definitions
- **Agent 3 (Code Quality):** Unused vars, template expressions, void expressions
- **Agent 4 (Refactoring):** React hooks, unnecessary conditionals, code structure

---

**End of Remaining Manual Fixes**
