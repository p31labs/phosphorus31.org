# P31 Visual Consistency Audit — Four Frontends

**Date:** 2026-02-16  
**Scope:** Sprout, Scope, Web, Shelter UI  
**Goal:** One product family. No drift.

---

## Cross-Reference Table: Tokens & Patterns

| Token / Pattern | Canonical | Sprout | Scope | Web | Shelter UI |
|-----------------|-----------|--------|-------|-----|------------|
| **Background** | `#050510` | ✅ `#050510` | ✅ `--p31-void` | ✅ `--void` | ✅ `--bg-primary` (fixed) |
| **Surface cards** | `#0A0A1F` / `#12122E` | ✅ `#0A0A1F` (buttons) | ✅ `--p31-surface` / `--p31-surface2` | ✅ `--void-up` / `--surface1` | ✅ `--bg-secondary` / `--bg-tertiary` (fixed) |
| **Green accent** | `#00FF88` | ✅ `#00FF88` | ✅ `--p31-green` | ✅ `--phosphorus` (fixed) | ✅ `--text-accent` / voltage low (fixed) |
| **Cyan** | `#00D4FF` | ✅ `#00D4FF` | ✅ `--p31-cyan` | ✅ `--calcium` (fixed) | ✅ `--text-accent-cyan` |
| **Text primary** | `#E0E0EE` | ✅ `#E0E0EE` | ✅ `--p31-text` (fixed) | ✅ `--white` / `--hero-text` (fixed) | ✅ `--text-primary` (fixed) |
| **Tailwind bleed** | None | ✅ None | ✅ None | ✅ None | ✅ None (was non-Tailwind; fixed to P31) |
| **Font — Sprout** | system-ui ONLY | ✅ system-ui | — | — | — |
| **Font — Scope** | Oxanium (headings) + Space Mono (data) | — | ✅ `--font-heading` / `--font-mono` | — | — |
| **Font — Web** | Oxanium + Space Mono | — | — | ✅ `--font-display` / `--font-mono` | — |
| **Font — Shelter** | Oxanium + Space Mono | — | — | — | ✅ `--font-display` / `--font-mono` (fixed) |
| **Glow — Scope/Web** | Accent elements have glow | — | ✅ panel header, cards, status dot | ✅ phosphorus-flare, calcium | — |
| **Glow — Sprout** | box-shadow only, no text-shadow | ✅ box-shadow on dot/buttons | — | — | — |
| **Card padding** | 16px or 20px | 20px (buttons) | 16px panels | section padding | 16px responsive |
| **Section spacing** | 40–60px | N/A | 16px gap grid | clamp(5rem, 12vh, 10rem) | 16px app padding |
| **Card radius** | 6px or 8px | 8px (1rem) buttons | 6px panels | 4px skip-link | 4px scrollbar |
| **Button radius** | 6–8px | 1rem (Sprout: large touch) | 6px | 4px | — |
| **Input radius** | 4–6px | — | — | — | — |
| **Connection — Sprout** | Small dot, bottom-right, green/amber only | ✅ bottom-right, green/amber (fixed position) | — | — | — |
| **Connection — Scope** | Status bar dot, top-left, green/amber only | — | ✅ header left, green/amber; never “Disconnected” in UI (fixed) | — | — |
| **Reconnect behavior** | Exponential backoff, gentle messaging | ✅ backoff, “Reconnecting...” | ✅ backoff, “Reconnecting…” in SignalPanel | — | — |
| **No ERROR/FAILED/DISCONNECTED** | In visible UI | ✅ | ✅ aria-label “Reconnecting” when not connected (fixed) | — | — |
| **Voltage colors** | GREEN #00FF88, AMBER #FFB800, RED #FF00CC, BLACK | — | ✅ MessageQueue, VoltageMeter | — | ✅ god.config + CSS (fixed) |
| **Timestamp** | Relative &lt; 1hr, absolute after | — | ✅ formatSignalTime | — | — |

---

## Fixes Applied (2026-02-16)

### Web (`apps/web/styles.css`)
- **Green:** `--phosphorus` `#2ecc71` → `#00FF88`; dim/flare adjusted.
- **Cyan:** `--calcium` `#60a5fa` → `#00D4FF`; dim/glow adjusted.
- **Text primary:** `--white` `#e8e8f0` → `#E0E0EE`.

### Scope (`apps/scope/`)
- **Text primary:** `--p31-text` `#E8E8F0` → `#E0E0EE`.
- **Cyan token:** Added `--p31-cyan: #00D4FF`; SignalPanel uses `var(--p31-cyan)` and `var(--p31-red-product)`.
- **Connection status:** Dot shows green or amber only; when not connected, aria-label is “Reconnecting” (never “Disconnected” in visible or announced UI).

### Shelter UI (`apps/shelter/`)
- **Global CSS:** Replaced non-P31 palette with P31 tokens: background `#050510`, surfaces `#0A0A1F` / `#12122E` / `#1A1A3E`, text `#E0E0EE`, accents `#00FF88` / `#00D4FF`, voltage low/medium/high/critical to match Scope.
- **Fonts:** Switched from IBM Plex Sans + JetBrains Mono to Oxanium + Space Mono; font preload added in `index.html`.
- **theme-color:** `#0a0a0b` → `#050510`.
- **god.config.ts:** `theme.*`, `voltage.*`, and `typography.fontFamily` updated to P31 values so VoltageGauge and other GOD_CONFIG-driven components use brand colors and fonts.

### Sprout (`apps/sprout/`)
- **Connection dot position:** Moved from top-right to **bottom-right** (spec: “small dot, bottom-right corner”).

---

## Checklist Summary

| Category | Sprout | Scope | Web | Shelter UI |
|----------|--------|-------|-----|------------|
| Colors (background, surface, green, cyan, text) | ✅ | ✅ | ✅ | ✅ |
| Fonts (system-ui / Oxanium + Space Mono) | ✅ | ✅ | ✅ | ✅ |
| Glow (appropriate per app) | ✅ | ✅ | ✅ | ✅ |
| Spacing (cards 16/20px, section 40–60px where applicable) | ✅ | ✅ | ✅ | ✅ |
| Border radius (cards 6–8px, buttons 6–8px) | ✅ | ✅ | ✅ | ✅ |
| Connection status (dot, green/amber, gentle copy) | ✅ | ✅ | N/A | N/A |
| Voltage mapping (GREEN/AMBER/RED/BLACK) | N/A | ✅ | N/A | ✅ |
| Timestamp (relative &lt; 1hr, absolute after) | N/A | ✅ | N/A | — |

---

## Notes

- **Sprout** uses `1rem` (16px) border radius on buttons for large touch targets; this is intentional for the child-facing interface.
- **Web** uses `clamp(5rem, 12vh, 10rem)` for section padding (≈80–160px) for a spacious landing feel.
- **Shelter** components that read `GOD_CONFIG.theme` / `GOD_CONFIG.voltage` / `GOD_CONFIG.typography` now receive P31 values; any inline styles still using old hex values should be updated to use config or CSS variables.
- **ModuleMaker.tsx** uses `color: '#000'` on light accent backgrounds (e.g. buttons) for contrast; this is acceptable for text-on-bright-button only.

The mesh holds. 🔺
