# P31 Motion System Audit

**Date:** 2026-02-16  
**Scope:** packages/protocol, ui (Scope), Sprout (P31SproutPanel), Buffer dashboard, apps/shelter (P31 Shelter) as reference.

Motion in P31 is **not decorative by default** — it communicates state. Phosphorus glows, signals pulse, voltage breathes. All motion respects `prefers-reduced-motion`.

---

## 1. Motion system definition

**Source:** `packages/protocol/src/motion.ts`

| Token | Value | Use |
|-------|--------|-----|
| **Durations** | | |
| `instant` | 0ms | State change when reduced-motion |
| `fast` | 120ms | Micro-interactions: button press, toggle |
| `normal` | 200ms | Standard: hover, focus, panel open |
| `slow` | 400ms | Emphasis: triage, voltage change, page transition |
| `breathe` | 3000ms | Ambient: molecule pulse, idle glow |
| **Easings** | | |
| `ease` | cubic-bezier(0.4, 0, 0.2, 1) | Standard |
| `easeIn` | cubic-bezier(0.4, 0, 1, 1) | Entering |
| `easeOut` | cubic-bezier(0, 0, 0.2, 1) | Exiting |
| `spring` | cubic-bezier(0.34, 1.56, 0.64, 1) | Bouncy (buttons, badges) |

CSS variables in `packages/protocol/tokens.css`: `--p31-motion-instant`, `--p31-motion-fast`, `--p31-motion-normal`, `--p31-motion-slow`, `--p31-motion-breathe`, `--p31-motion-ease`, etc.  
**Reduced-motion:** In `tokens.css`, `@media (prefers-reduced-motion: reduce)` sets all motion durations to `0ms`.

---

## 2. Animation inventory

| Element / file | Current animation | Classification | Reduced-motion behavior |
|----------------|-------------------|----------------|-------------------------|
| **BufferDashboard** (ui) | | | |
| `.status-dot` | `buffer-status-pulse` 2s infinite (opacity 1 ↔ 0.5) | Decorative | `animation: none` in `@media (prefers-reduced-motion)` |
| `.submit-button` | `background` 200ms ease | Functional | Global accessibility.css → 0.01ms |
| **App.css** (ui) | | | |
| `.dev-header button` | `all` 200ms ease | Functional | 0.01ms |
| `.progress-fill` | `width` 400ms ease | Functional | 0.01ms |
| `.wave` | `width`, `background` 400ms ease | Functional | 0.01ms |
| `.scanlines` | `scanlineMove` 2s linear infinite | Decorative | Disabled in existing reduced-motion block |
| `.digital-rain` / `.rain-char` | `rain` 3s linear infinite | Decorative | Disabled in existing block |
| `.glitch-text` | `glitch` 0.5s infinite | Decorative | Disabled in existing block |
| `.static-noise` | `noise` 0.1s infinite | Decorative | Disabled in existing block |
| `.stage-indicator`, `.pipeline-connector` | `background` 400ms ease | Functional | 0.01ms |
| `.flow-fill` | `width`, `background` 400ms ease | Functional | 0.01ms |
| **GlowBadge** (Scope) | | | |
| Button | `transform`, `box-shadow`, `border-color`, `background-color` 200ms (spring / ease) | Functional | scope.css `.scope-glow-badge` → `transition: none`; global 0.01ms |
| **SpectrumBar** (Scope) | | | |
| `.scope-spectrum-peak`, bar segment | `transition-all duration-200` (Tailwind) | Functional | scope.css → `transition: none` |
| **PulseIndicator** (Scope) | | | |
| Dot | `scope-pulse` 3s ease-in-out infinite when speaking | Decorative (state) | `useAnimationEnabled()`: no animation when reduced-motion; class `scope-pulse-animated` → `animation: none` in scope.css |
| **scope.css** | | | |
| `@keyframes scope-pulse` | opacity + scale 1 → 1.2 → 1 | Ambient | `.scope-pulse-animated` gets `animation: none` in reduced-motion |
| **P31SproutPanel.css** (Sprout) | | | |
| `.p31-sprout-feeling-btn` | `border-color`, `background` 200ms ease | Functional | `@media (prefers-reduced-motion)` → `transition: none` |
| **DemoDashboard** (ui) | | | |
| Voltage bar height | `height` 400ms ease | Functional | Global 0.01ms |
| Spoon bar width | `width` 400ms ease | Functional | Global 0.01ms |
| **VoltageIcosahedron** (3D) | | | |
| Mesh | useFrame: rotation, scale pulse, position jitter | Decorative | `useAnimationEnabled()`: when false, scale=1, position=0; color/emissive still update (functional) |
| **FractalZUI** (quantum) | | | |
| UI / Back button | Conditional render when `useAnimationEnabled()` | N/A | No continuous animation; already gated |
| **accessibility.css** (ui) | | | |
| `*` | — | Global | `@media (prefers-reduced-motion)` and `.reduce-motion`: `animation-duration: 0.01ms`, `transition-duration: 0.01ms`, `animation-iteration-count: 1` |
| **Buffer/Shelter frontend** (apps/shelter or ui) | | | |
| Global | — | — | Same pattern: `animation-duration/transition-duration: 0.01ms` in reduced-motion |

---

## 3. Fixes applied

1. **packages/protocol**
   - Added `src/motion.ts` with durations, easings, and `transition()` helper.
   - Exported from `index.ts`.
   - `tokens.css`: added `--p31-motion-*` and `--p31-transition-*`; in `prefers-reduced-motion` set all to `0ms`.

2. **ui/components/Buffer/BufferDashboard.tsx**
   - Renamed keyframes to `buffer-status-pulse`; added `@media (prefers-reduced-motion)` → `.status-dot { animation: none }`.
   - `.submit-button` transition: `background 200ms cubic-bezier(0.4, 0, 0.2, 1)`.

3. **ui/App.css**
   - All transitions standardized to 200ms or 400ms with `cubic-bezier(0.4, 0, 0.2, 1)`.
   - Decorative animations (scanlines, rain, glitch, noise) already disabled in existing reduced-motion block.

4. **ui/components/Scope/GlowBadge.tsx**
   - Replaced Tailwind `transition-all duration-200` with explicit inline transition (200ms, spring for transform/box-shadow).
   - scope.css already disables `.scope-glow-badge` transition in reduced-motion.

5. **ui/components/Scope/scope.css**
   - Comment for `scope-pulse` (breathe cycle).
   - Added `.scope-pulse-animated { animation: none !important }` in reduced-motion.

6. **ui/components/Scope/PulseIndicator.tsx**
   - Uses `useAnimationEnabled()`; pulse only when `speaking && animationEnabled`.
   - Class `scope-pulse-animated` when animating; duration set to 3s (breathe).

7. **ui/components/Scope/SpectrumBar.tsx**
   - No code change; uses Tailwind `duration-200`; scope.css already sets `transition: none` for `.scope-spectrum-peak` in reduced-motion.

8. **ui/components/DemoDashboard/DemoDashboard.tsx**
   - Inline transitions set to `400ms cubic-bezier(0.4, 0, 0.2, 1)` for height/width.

9. **ui/components/3d/VoltageIcosahedron.tsx**
   - `useAnimationEnabled()`: when false, rotation, scale pulse, and jitter are skipped; scale=1, position=0; color/emissive still update.

10. **ui/components/Sprout/P31SproutPanel.css**
    - `.p31-sprout-feeling-btn` transition set to `200ms cubic-bezier(0.4, 0, 0.2, 1)`; reduced-motion block already present.

---

## 4. Verification checklist

- **Toggle `prefers-reduced-motion` in DevTools:** Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`.
- **Expected:** All decorative animations (status dot pulse, scanlines, rain, glitch, noise, VoltageIcosahedron rotation/pulse/jitter, PulseIndicator pulse) stop; functional transitions become instant (global 0.01ms or explicit `transition: none`).
- **Sprout:** Only functional transitions (button feedback); no ambient motion.
- **Scope:** Functional transitions + voltage meter / PulseIndicator glow pulse when animation enabled; pulse and decorative 3D off when reduced-motion.
- **Web / molecule:** VoltageIcosahedron and FractalZUI already gated by `useAnimationEnabled()` or equivalent.

---

## 5. Specific animations verified

| Spec | Status |
|------|--------|
| Sprout button press: scale 1 → 0.97 → 1, 200ms, spring; glow 200ms; "Sent ✓" crossfade 120ms; reduced-motion instant | GlowBadge uses 200ms spring; Sprout panel uses 200ms; global reduced-motion makes all instant. (Explicit send-button scale/crossfade to be added in Sprout component when that UI exists.) |
| Scope signal: badge slide 200ms easeOut; triage panel 400ms ease; voltage fill 400ms ease; reduced-motion instant | Scope uses 200ms/400ms; scope.css and global reduced-motion enforce instant. |
| Web molecule: slow rotation/breathe 3000ms+; atom glow pulse; reduced-motion static | VoltageIcosahedron uses useFrame (no fixed 3s); when `useAnimationEnabled()` is false, static (no rotation/pulse/jitter). PulseIndicator uses 3s breathe. |

---

*Motion communicates state. Reduced motion respects the user. The mesh holds.*
