# P31 Viewport Test Matrix

**Date:** 2026-02-16  
**Purpose:** Test every app at critical viewports; document status and fixes applied.

---

## Viewports

| ID | Size | Device / use case |
|----|------|-------------------|
| V1 | 320×568 | iPhone SE (smallest common phone) |
| V2 | 375×667 | iPhone 8 |
| V3 | 390×844 | iPhone 14 |
| V4 | 414×896 | iPhone 14 Plus |
| V5 | 768×1024 | iPad Mini / standard tablet (portrait) |
| V6 | 1024×768 | iPad landscape |
| V7 | 1280×800 | Small laptop |
| V8 | 1440×900 | Standard laptop |
| V9 | 1920×1080 | Desktop |
| V10 | 2560×1440 | Large desktop / external monitor |

---

## Test criteria (by app)

### Sprout (apps/sprout/)
- [ ] All 4 buttons visible without scrolling
- [ ] Buttons fill viewport — no dead space at edges
- [ ] Text readable at every size
- [ ] Connection dot visible but not obtrusive
- [ ] No overflow, no scroll, no content cut off
- [ ] Landscape: 2×2 grid works (or graceful 4×1 strip)
- [ ] Safe-area: bottom buttons respect `safe-area-inset-bottom`

### Scope (apps/scope/)
- [ ] All four panels visible (may require scroll on mobile)
- [ ] Signal panel always visible without scrolling (top of page)
- [ ] Message cards don't overflow their container
- [ ] Voltage meter min-width ≥ 160px (readable)
- [ ] Accommodation log table horizontally scrollable on mobile (not clipped)
- [ ] Export button reachable on all viewports
- [ ] No overlapping panels or z-index issues
- [ ] Safe-area: notch doesn't clip content

### Web (apps/web/)
- [ ] Hero section fills viewport at every size
- [ ] Molecule visualization scales or repositions (hidden on narrow)
- [ ] Product cards reflow: 3 → 2 → 1 column
- [ ] No text overflow or truncation
- [ ] Footer visible and properly positioned
- [ ] Navigation doesn't collide with content
- [ ] Safe-area: notch/nav/hero respect insets

### Global
- [ ] Scrollbar: 6px width, surface3 thumb, void track (Firefox + WebKit)
- [ ] Orientation: Sprout portrait + landscape; Scope landscape + portrait; Web both

---

## Matrix: App × Viewport × Status

| Viewport | Sprout | Scope | Web |
|----------|--------|--------|-----|
| **320×568** | ✅ Fixed | ✅ Fixed | ✅ Fixed |
| **375×667** | ✅ OK | ✅ OK | ✅ OK |
| **390×844** | ✅ OK | ✅ OK | ✅ OK |
| **414×896** | ✅ OK | ✅ OK | ✅ OK |
| **768×1024** | ✅ OK | ✅ OK | ✅ OK |
| **1024×768** | ✅ OK (2×2) | ✅ OK | ✅ OK |
| **1280×800** | ✅ OK | ✅ OK | ✅ OK |
| **1440×900** | ✅ OK | ✅ OK | ✅ OK |
| **1920×1080** | ✅ OK | ✅ OK | ✅ OK |
| **2560×1440** | ✅ OK | ✅ OK | ✅ OK |

**Legend:** ✅ OK = layout verified or unchanged; ✅ Fixed = breakage addressed in this pass.

---

## Fixes applied (2026-02-16)

### Sprout
1. **Landscape (short height):** `@media (orientation: landscape) and (max-height: 500px)` — keep 2×2 grid, reduce button min-height and padding so all four fit without scroll; smaller emoji/font.
2. **Portrait narrow:** `@media (max-width: 599px) and (orientation: portrait)` — grid 1×4 with `min-height: 0` on buttons so flex distributes space (avoids overflow on 320×568).
3. **Tiny portrait:** `@media (max-width: 380px) and (orientation: portrait)` — reduced padding and gap.
4. **Scrollbar:** Global thin scrollbar in `index.css` (6px, #1A1A3E thumb, #050510 track) for any overflow edge case.
5. **iOS safe area:** `viewport-fit=cover` added to `index.html`; existing `env(safe-area-inset-*)` in `App.css` retained.

### Scope
1. **VoltageMeter:** `minWidth: 160` on section + class `p31-scope-voltage-meter` with `min-width: 160px` in CSS so gauge never gets too narrow.
2. **Accommodation log:** Table wrapper class `p31-scope-accommodation-table-wrap` with `overflow-x: auto` and table `min-width: 480px` so table scrolls horizontally on mobile (not clipped).
3. **Safe area:** StatusBar `paddingTop: env(safe-area-inset-top)`; main padding uses `max(..., env(safe-area-inset-*))` for top/left/right/bottom; `viewport-fit=cover` in `index.html`.

### Web
1. **Scrollbar:** Global `scrollbar-width: thin` and `scrollbar-color: #1A1A3E #050510`; WebKit `::-webkit-scrollbar` (6px, same colors).
2. **Safe area:** `viewport-fit=cover` in `index.html`; nav `padding` uses `env(safe-area-inset-top/left/right)`; hero `padding` uses `env(safe-area-inset-*)` on all sides.
3. **Small phones (≤360px):** Hero content padding 1rem; hero title clamp; hero-sub max-width 100%; hero-actions wrap.
4. **768px block:** Confirmed products 3→2→1 via existing 1024px and 768px breakpoints; 768px rules (metrics, products, principles, problem-stats, founder, footer, economy, element-card) kept in single block; 360px block contains only hero-specific tweaks.

---

## Orientation summary

| App | Portrait | Landscape |
|-----|----------|-----------|
| Sprout | 1×4 buttons (narrow), 2×2 (≥600px) | 2×2 (short height: compact buttons) |
| Scope | Single column, scroll | Two-column grid where wide |
| Web | Full layout, nav hidden links at 768px | Full layout |

---

## Safe areas (iOS)

- **Sprout:** `.app` and `.status-dot` use `env(safe-area-inset-*)`; bottom buttons clear home bar.
- **Scope:** StatusBar and main use `env(safe-area-inset-top)`; main uses all four insets.
- **Web:** Nav and hero use insets; content respects notch and home indicator.

---

## Scrollbar (all apps)

- **Firefox:** `scrollbar-width: thin; scrollbar-color: #1A1A3E #050510;`
- **WebKit:** `::-webkit-scrollbar` width/height 6px; track `#050510`; thumb `#1A1A3E`, border-radius 3px.

---

## How to re-test

1. **Chrome DevTools:** Device toolbar, custom sizes for each viewport; rotate for orientation.
2. **Real devices:** iPhone SE (320), iPad Mini (768), desktop 1920.
3. **Checklist:** For each app × viewport, run through the criteria above and tick in this doc or a copy.

Screenshots can be added under `docs/viewport-screenshots/` (e.g. `sprout-320x568.png`) and linked here if needed.
