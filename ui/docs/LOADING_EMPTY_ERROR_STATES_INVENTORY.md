# P31 Apps — Loading, Empty, and Error States Inventory

**Date:** 2026-02-16  
**Scope:** Scope (P31 Spectrum), Sprout (P31 Sprout), Web (root/SPA).

---

## 1. Scope (P31 Spectrum / Dashboard)

### Loading states

| Area | Implementation | Notes |
|------|----------------|------|
| **Message queue** | `ScopeMessageQueueSkeleton` — 3 skeleton cards, surface3 `#1A1A3E`, pulse 0.3→0.6→0.3 over 1.5s ease-in-out | Cards match real message card dimensions. `prefers-reduced-motion`: static gray (opacity 0.4), no pulse. |
| **Accommodation log** | `ScopeAccommodationLogSkeleton` — 3 skeleton table rows, same pulse | Same surface3 + reduced-motion behavior. |
| **Web page load** | N/A for Scope (Scope is a view inside the SPA). | For static/marketing pages: use content fade-in 400ms, stagger 100ms per section. |

**Files:** `ui/src/components/Scope/ScopeSkeleton.tsx`, `ui/src/components/Scope/scope.css` (keyframes + reduced-motion override).

### Empty states

| Area | Implementation | Notes |
|------|----------------|------|
| **Message queue** | `ScopeEmptyMessageQueue` — center of panel: Posner mark (40px, 40% opacity), "No messages in queue" (Oxanium 300, 14px, #4A4A7A), "Messages will appear here as they're processed" (12px, #4A4A7A) | Not blank; inviting. |
| **Accommodation log** | `ScopeEmptyAccommodationLog` — "No accommodation events recorded" + "Events log automatically as you use the system" (same dim styling) | Same Posner mark + typography. |
| **Voltage meter (no data)** | `VoltageGauge` with `voltage={undefined}` or `null`: gauge shows **GREEN**, label "VOLTAGE: GREEN", flat green line at bottom | Default safe state; never empty or zero. |

**Files:** `ui/src/components/Scope/ScopeEmptyStates.tsx`, `ui/src/components/Scope/PosnerMark.tsx`, `ui/src/nodes/node-b-them/VoltageDetector.tsx`.

### Error / connection states

| Scenario | Implementation | Notes |
|----------|----------------|------|
| **API fetch fails after initial load** | `connectionInterrupted` from `useScopeBufferData` → `ScopeConnectionBanner`: "Connection interrupted · Retrying..." (#FFB800, 10px Space Mono). Banner at top of Tasks panel; last known data kept. | Never "Error", "Failed", "Something went wrong". Banner auto-dismisses when connection restored (auto-retry every 5s). |
| **First load fails (no data yet)** | No banner; show "Start the P31 Shelter backend (port 4000)…" | No scary copy. |
| **Refresh** | Button: "Refreshing…" / "Refresh"; disabled while loading. | Calm language. |

**Files:** `ui/src/hooks/useScopeBufferData.ts`, `ui/src/components/Scope/ScopeConnectionBanner.tsx`, `ui/src/organisms/ScopeDashboard.tsx`.

### Error boundary

- **Component:** `ScopeErrorBoundary`
- **Fallback:** Posner mark + "Scope is restarting..." + "Something unexpected happened. You can try again." + "Try again" button.
- **Behavior:** Logs to console only; never shows stack traces to user.
- **Wrapping:** `ScopeDashboard` is wrapped in `ScopeErrorBoundary` in `App.tsx`.

**File:** `ui/src/components/ErrorBoundary/ScopeErrorBoundary.tsx`.

---

## 2. Sprout (P31 Sprout)

### Loading states

- **Spec:** NO loading state. Buttons are **always** rendered. WebSocket connects in background.
- **Implementation:** No skeleton or spinner; panel renders immediately with feeling buttons and wins. Mesh adapter connects silently.

### Empty states

- **Spec:** No empty states (always has 4 feeling buttons + wins section).
- **Implementation:** No dedicated empty UI.

### Error / connection states

- **Spec:** ZERO visible error states. Network/WebSocket errors → silent reconnect + amber dot only.
- **Implementation:**
  - No "Error", "Failed", or alert modals.
  - `useMeshConnection()` listens to `p31:mesh:connection` (dispatched by WebSocket adapter on open/close).
  - When `reconnecting === true`: small amber dot + "Reconnecting..." (top-right, 10px font-mono). No other error text.
  - "Sent ✓" still appears even if disconnected (signals queued locally / event still fires).
- **JS crash:** `SproutErrorBoundary` renders the four feeling buttons in static mode (no WebSocket); buttons still pressable for comfort.

**Files:** `ui/src/components/Sprout/P31SproutPanel.tsx`, `ui/src/hooks/useMeshConnection.ts`, `ui/src/services/meshAdapter.ts`, `ui/src/components/ErrorBoundary/SproutErrorBoundary.tsx`.

### Error boundary

- **Component:** `SproutErrorBoundary`
- **Fallback:** Four feeling buttons (I'm okay, I need a break, I need a hug, I need help) in static mode; "P31 Sprout" + "You're safe here. The mesh holds."
- **Behavior:** Logs to console only; no stack traces to user.
- **Wrapping:** `P31SproutPanel` is wrapped in `SproutErrorBoundary` in `App.tsx`.

**File:** `ui/src/components/ErrorBoundary/SproutErrorBoundary.tsx`.

---

## 3. Web (root / SPA)

- **Static content:** Current app is a single SPA; no separate "Web" static site in this repo.
- **404:** Not implemented in SPA. For a future static/marketing site: use Posner mark + "This page doesn't exist yet" + link home.
- **Content fade-in:** Spec (opacity 0→1, 400ms, stagger 100ms per section) applies to multi-section static pages; not applied to current SPA. Can add a utility class when building static pages.
- **Error boundary:** Root app wrapped in `WebErrorBoundary` in `main.tsx`. Fallback: "Something unexpected happened" + "Go home" link. No stack traces.

**Files:** `ui/src/main.tsx`, `ui/src/components/ErrorBoundary/WebErrorBoundary.tsx`.

---

## 4. Offline behavior

| App | Behavior |
|-----|----------|
| **Sprout** | Buttons always work; presses queued; "Reconnecting..." dot when mesh was connected and dropped. |
| **Scope** | Last known state displayed; connection banner at top; auto-retry every 5s. |
| **Web** | Service worker (if implemented) serves cached version. Not implemented in this audit. |
| **All** | No white screens, blank pages, or "cannot connect" modals. |

---

## 5. Accessibility (prefers-reduced-motion)

- **Scope skeletons:** In `scope.css`, `@media (prefers-reduced-motion: reduce)` disables skeleton pulse; static gray (opacity 0.4) only.
- **Global:** `styles/accessibility.css` already disables animations when `prefers-reduced-motion: reduce` is set.

---

## 6. Screenshot descriptions (for QA)

1. **Scope — Message queue loading:** Tasks view with three rectangular skeleton cards (dark blue-gray #1A1A3E), gently pulsing (or static if reduced-motion). No raw "Loading" text.
2. **Scope — Message queue empty:** Same panel with small Posner molecule mark (40px, faint), "No messages in queue", and helper line below. Dim purple-gray text (#4A4A7A).
3. **Scope — Connection interrupted:** Yellow/amber banner at top of Tasks: "Connection interrupted · Retrying...". List below shows last known messages (if any).
4. **Scope — Accommodation log empty:** Posner mark + "No accommodation events recorded" + "Events log automatically as you use the system".
5. **VoltageGauge — No data:** Gauge shows green bar (full width, subtle), label "VOLTAGE: GREEN". Not empty, not zero.
6. **Sprout — Reconnecting:** Top-right amber dot + "Reconnecting...". No error message, no modal. Buttons and wins section visible.
7. **Sprout — Error boundary fallback:** Four large feeling buttons (😊 🌿 🤗 🖐️) with labels; "P31 Sprout" and "You're safe here. The mesh holds." No error text.
8. **Scope — Error boundary fallback:** Posner mark, "Scope is restarting...", "Try again" button.
9. **Web — Error boundary fallback:** "Something unexpected happened" + "Go home" link.

---

## 7. Files touched (summary)

| Category | Files |
|----------|--------|
| **Scope loading** | `ScopeSkeleton.tsx`, `scope.css` |
| **Scope empty** | `PosnerMark.tsx`, `ScopeEmptyStates.tsx` |
| **Scope connection** | `ScopeConnectionBanner.tsx`, `useScopeBufferData.ts` |
| **Scope dashboard** | `ScopeDashboard.tsx` (ViewTasks + accommodation section) |
| **Voltage no-data** | `VoltageDetector.tsx` (optional `voltage`, GREEN default) |
| **Sprout** | `P31SproutPanel.tsx`, `P31SproutPanel.css`, `useMeshConnection.ts`, `meshAdapter.ts` |
| **Error boundaries** | `ScopeErrorBoundary.tsx`, `SproutErrorBoundary.tsx`, `WebErrorBoundary.tsx`, `ErrorBoundary/index.ts` |
| **App wiring** | `App.tsx`, `main.tsx` |
