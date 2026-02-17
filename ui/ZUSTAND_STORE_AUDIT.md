# ZUSTAND STORE AUDIT REPORT
**Date:** 2026-02-14  
**Swarm:** SWARM 05 — SCOPE FRONTEND AUDIT  
**Agent:** 3 — Zustand Store Audit

---

## STORE INVENTORY

### 1. `heartbeat.store.ts` — Node A (You) ✅
**Status:** Well-structured, type-safe

**Strengths:**
- ✅ Fully typed (extends `HeartbeatState`, `HeartbeatActions`)
- ✅ Uses `persist` middleware correctly (only persists non-sensitive data)
- ✅ Uses `devtools` middleware
- ✅ Immutable state updates (uses `set()` correctly)
- ✅ Good selector hooks exported
- ✅ No direct state mutation

**Issues:**
- ⚠️ Components expect properties like `currentStatus`, `checkInInterval`, `peers`, etc. that don't exist in the store
- ⚠️ Store structure may not match component expectations (see TypeScript errors)

**Recommendations:**
- Review component usage to ensure store interface matches expectations
- Consider adding missing properties or updating components

---

### 2. `shield.store.ts` — Node D (Shield) ⚠️
**Status:** Good structure, but has bugs

**Strengths:**
- ✅ Fully typed (extends `ShieldState`, `ShieldActions`)
- ✅ Uses `persist` middleware correctly
- ✅ Uses `devtools` middleware
- ✅ Integrates CatchersMitt correctly
- ✅ Immutable state updates

**Issues:**
- ❌ **BUG:** Line 267 — `mitt.blacklist(sender)` — `blacklist` is a `Set<string>`, not a function
- ❌ **BUG:** Line 260 — `mitt.whitelist(sender)` — `whitelist is a `Set<string>`, not a function
- ⚠️ Components expect properties like `buffer`, `isBatching`, `batchTimeRemaining`, `processBatch`, `ingestMessage` that don't exist
- ⚠️ Components expect `userHumanOS`, `provider`, `ollamaEndpoint`, `ollamaModel` that don't exist

**Recommendations:**
- Fix `whitelistSender` and `blacklistSender` methods to use correct CatchersMitt API
- Review component expectations vs. store interface
- Consider adding missing properties or updating components

---

### 3. `buffer.store.ts` — Buffer Service ✅
**Status:** Well-structured, type-safe

**Strengths:**
- ✅ Fully typed (extends `BufferState`, `BufferActions`)
- ✅ **Correctly does NOT use persist** (ephemeral data)
- ✅ Uses `devtools` middleware
- ✅ Immutable state updates
- ✅ Good selector hooks

**Issues:**
- None identified

**Recommendations:**
- None

---

### 4. `accessibility.store.ts` — A11y Settings ⚠️
**Status:** Good structure, but missing persist

**Strengths:**
- ✅ Fully typed (extends `AccessibilityConfig`)
- ✅ Uses `devtools` middleware
- ✅ Immutable state updates
- ✅ Good preset system

**Issues:**
- ⚠️ **Missing `persist` middleware** — Accessibility settings should persist across sessions
- ⚠️ Line 50: `toggleHighContrast` exists but `setHighContrast` is also defined (redundant?)

**Recommendations:**
- Add `persist` middleware for accessibility settings (user preferences should persist)
- Consider removing redundant `setHighContrast` or consolidating

---

### 5. `genesis.ts` — Genesis Provider Store
**Status:** Not audited (file not read)

**Action Required:**
- Review `genesis.ts` for type safety and patterns

---

## CRITICAL ISSUES

### Issue 1: Shield Store — CatchersMitt API Mismatch
**Location:** `shield.store.ts:260, 267`

**Problem:**
```typescript
whitelistSender: (sender: string) => {
  mitt.whitelist(sender); // ❌ whitelist is a Set, not a function
},
blacklistSender: (sender: string) => {
  mitt.blacklist(sender); // ❌ blacklist is a Set, not a function
},
```

**Fix Required:**
Check CatchersMitt API — likely need to use `mitt.addToWhitelist(sender)` or similar method.

---

### Issue 2: Store-Component Interface Mismatch
**Problem:**
Many components expect properties that don't exist in stores:
- `heartbeat.store`: Missing `currentStatus`, `checkInInterval`, `peers`, `connectionCode`, etc.
- `shield.store`: Missing `buffer`, `isBatching`, `ingestMessage`, `userHumanOS`, etc.

**Action Required:**
- Review component usage
- Either add missing properties to stores OR update components to use correct store structure

---

## PATTERNS VERIFIED

✅ **No direct state mutation** — All stores use `set()` correctly  
✅ **Persist middleware usage** — Correctly applied to persistent data (heartbeat, shield)  
✅ **No persist on ephemeral data** — Buffer store correctly omits persist  
⚠️ **Missing persist on settings** — Accessibility store should persist user preferences  
✅ **Devtools middleware** — All stores use devtools  
✅ **Type safety** — All stores are fully typed  
✅ **Selector hooks** — Good pattern for component usage  

---

## RECOMMENDATIONS

1. **Fix CatchersMitt API calls** in `shield.store.ts`
2. **Add persist middleware** to `accessibility.store.ts`
3. **Resolve store-component interface mismatches** — Review all component usages
4. **Audit `genesis.ts`** store
5. **Verify stores don't import other stores** — Check for circular dependencies

---

**Next:** Agent 4 — Component Tests
