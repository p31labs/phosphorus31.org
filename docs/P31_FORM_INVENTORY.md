# P31 Form Design System — Inventory & Validation

**Date:** 2026-02-16  
**Scope:** Scope, Web, Shelter, Buffer UI (ui), P31 Buffer frontend.

---

## Design system reference

All form elements use:

- **Surface:** `#0A0A1F` (surface1)
- **Border:** `1px solid rgba(255,255,255,0.08)`
- **Focus:** `1px solid #00FF88` + `box-shadow: 0 0 0 1px #00FF88, 0 0 12px rgba(0, 255, 136, 0.25)` (green glow only; no blue/purple focus rings)
- **Text:** `#E0E0EE`, **Space Mono** 13px (inputs) / 11px uppercase letter-spacing 2px (buttons)
- **Placeholder:** `#4A4A7A`, italic
- **Border-radius:** 4px (inputs/textarea/select), 6px (buttons)
- **Padding:** 8px 12px (inputs), 8px 16px (buttons)
- **Heights:** 36px standard, 44px on mobile (touch targets ≥ 44×44px)
- **Disabled:** opacity 0.4, cursor not-allowed, no glow/hover

---

## Inventory by app

### 1. Scope (`apps/scope`)

| Location | Element | Before | After |
|----------|---------|--------|--------|
| `AccommodationLog.tsx` | 2× date input (From, To) | Inline: surface3, panel-border, 12px | `.p31-input` — surface1, 13px, green focus |
| `AccommodationLog.tsx` | Export CSV button | Inline secondary style | `.p31-btn .p31-btn-secondary` |
| `AccommodationLog.tsx` | Load more button | Inline secondary style | `.p31-btn .p31-btn-secondary` |
| `MessageQueue.tsx` | Expand (per message) | Ghost button, no class | Kept as-is (card toggle) |
| `MessageQueue.tsx` | "Show original" / "Show kernel" | Inline text button | `.p31-btn .p31-btn-secondary` (overrides for non-uppercase) |
| `MessageQueue.tsx` | Release (held message) | Inline green bg | `.p31-btn .p31-btn-danger` — magenta border + glow |
| `SignalPanel.tsx` | Send calm / Draft / Acknowledge | `triageBtnStyle` inline | `.p31-btn .p31-btn-secondary` (×2), `.p31-btn .p31-btn-primary` (Acknowledge) |

**CSS:** Form rules added to `apps/scope/src/index.css` (`.p31-input`, `.p31-btn`, `.p31-btn-primary`, `.p31-btn-secondary`, `.p31-btn-danger`).

---

### 2. Buffer UI / Scope (`ui`)

| Location | Element | Before | After |
|----------|---------|--------|--------|
| `BufferDashboard.tsx` | Textarea (draft message) | `.message-input` — purple focus (#6366f1) | `.p31-textarea` — surface1, green focus, min-height 80px, resize vertical |
| `BufferDashboard.tsx` | Priority select | `.priority-select` — purple/gray | `.p31-select` — surface1, custom chevron #7878AA, green focus |
| `BufferDashboard.tsx` | Submit to Buffer | `.submit-button` — purple bg | `.p31-btn .p31-btn-primary` — green border + glow |
| `BufferDashboard.tsx` | Draft message for me | Inline #2ecc71 bg | `.p31-btn .p31-btn-primary` |
| `BufferDashboard.tsx` | Dismiss (sprout help) | Inline border #2ecc71 | `.p31-btn .p31-btn-secondary` |

**CSS:** `ui/src/styles/p31-forms.css` (global); BufferDashboard `<style>` block updated for `.message-input.p31-textarea`, `.priority-select.p31-select`, `.submit-button.p31-btn`.

---

### 3. Web (`apps/web`)

| Location | Element | Before | After |
|----------|---------|--------|--------|
| `styles.css` | `.btn-primary:focus` | outline 2px calcium (blue) | outline none; box-shadow green glow |
| `styles.css` | `.btn-ghost:focus` | (none) | outline none; box-shadow green glow |
| `docs/index.html` | Search input | #0a0a1a, #1e293b border, JetBrains Mono | #0A0A1F, rgba(255,255,255,0.08), Space Mono 13px, magnifying glass icon #4A4A7A, green focus |
| `docs/index.html` | Clear search button | Green bg, Outfit | Transparent, 1px border, #7878AA, Space Mono 11px uppercase, green focus |
| `roadmap/index.html` | Filter buttons (×6) | Green tint, JetBrains Mono, 2rem radius | surface1, border rgba(255,255,255,0.08), 6px radius, Space Mono 11px uppercase, green focus + active state #00FF88 |
| `wallet/index.html` | Connect Wallet | #2ecc71 border, JetBrains Mono | #00FF88 border/text, Space Mono 11px uppercase, green focus glow |
| `wallet/index.html` | Disconnect | #ef4444 | #FF00CC border/text (danger), magenta focus glow |
| `index.html` | Copy Address (btn-ghost) | — | Uses global .btn-ghost (green focus) |
| `index.html` | Range slider (morph) | — | Already styled in styles.css (phosphorus thumb, green glow) |

---

### 4. Shelter (`apps/shelter`)

| Location | Element | Before | After |
|----------|---------|--------|--------|
| `index.css` | All `input` (not checkbox/radio), `textarea`, `select` | Generic inherit | P31 form system: surface1 (#0A0A1F), border, 13px Space Mono, green focus glow |
| `index.css` | All `button` | Generic | min-height 36px, min-width 80px, 11px uppercase Space Mono, focus-visible green glow |
| `index.css` | — | — | `.p31-btn-primary`, `.p31-btn-secondary` added for use in components |

Any form in Shelter (e.g. message intake, manual entry) will pick up the global input/textarea/select/button styles.

---

### 5. Buffer / P31 Shelter (`apps/shelter`; Buffer UI may live in `ui/`)

| Location | Element | Before | After |
|----------|---------|--------|--------|
| `App.tsx` | Demo mode checkbox | Unstyled native | `.p31-checkbox` — 16×16, accent #00FF88, surface1, green focus glow |
| `App.tsx` | Spoon check-in buttons (2,4,6,8,10) | Inline calcium bg, void color | `.p31-btn .p31-btn-primary` — green border + glow |

**CSS:** `frontend/src/styles/index.css` — P31 tokens updated (#00FF88), `.p31-checkbox`, `.p31-btn`, `.p31-btn-primary`, `.p31-btn-secondary` added.

---

## Shared form CSS

- **Canonical:** `packages/protocol/p31-forms.css` — full set (inputs, textarea, select, buttons primary/secondary/danger, search, checkbox). Import after `tokens.css` where the protocol package is used.
- **Scope:** Form rules inlined in `apps/scope/src/index.css` (no protocol dependency).
- **UI:** `ui/src/styles/p31-forms.css` imported in `main.tsx`.
- **Shelter:** Form system inlined in `apps/shelter/src/index.css`.
- **Cognitive-shield:** Form system inlined in `frontend/src/styles/index.css`.

---

## Validation checklist

- **Tab order:** Logical (date From → date To → Export; message list → expand → Show original → Release; form: textarea → select → submit).
- **Focus ring:** Green glow (`box-shadow`) on all interactive form elements; no browser default blue/purple outline.
- **Enter:** Submit on forms where expected (BufferDashboard: Enter in textarea does not submit; submit is explicit — acceptable. Scope/Shelter: no single-field forms that require Enter-to-submit.)
- **Disabled:** Buttons (e.g. Submit when empty or submitting) use `disabled`; opacity 0.4, no hover/glow.
- **Mobile:** Touch targets ≥ 44×44px via min-height 44px and padding on buttons/inputs at `max-width: 767px` / `768px`.

---

## Before/after summary

| Area | Before | After |
|------|--------|--------|
| Focus rings | Blue (calcium) or purple (indigo) in places | Green glow only (#00FF88) |
| Inputs | Mixed surfaces (surface3, #0a0a1a, black-0.3) | Unified #0A0A1F, 1px rgba(255,255,255,0.08) |
| Buttons | Mixed (filled purple, inline greens, ghost) | Primary = green border + glow; Secondary = muted border; Danger = #FF00CC |
| Font | JetBrains Mono, Outfit, inherit | Space Mono 13px (inputs), 11px uppercase (buttons) |
| Placeholder | Various | #4A4A7A italic |
| Search (docs) | Green fill button, different input style | Surface1 input + magnifying glass, secondary-style clear, green focus |

All fixes applied. The mesh holds.
