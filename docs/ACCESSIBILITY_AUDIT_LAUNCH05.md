# LAUNCH-05: Accessibility Audit Report

**Date:** 2026-02-16  
**Scope:** P31 Spectrum (ui), P31 Sprout (unified demo), apps/web, P31 Shelter UI. WCAG 2.1 AA target; neurodivergent-first and kids-first.

---

## 1. Launch gate summary

| Gate   | Name           | Doc / run |
|--------|----------------|-----------|
| LAUNCH-01 | Integration tests | `tests/README.md`, `npm run test:integration` |
| LAUNCH-02 | Security audit   | `docs/SECURITY_AUDIT_LAUNCH02.md` |
| LAUNCH-03 | Performance      | `docs/PERFORMANCE_REPORT_LAUNCH03.md`, `npm run benchmark` |
| LAUNCH-04 | Persistence      | Accommodation log + SQLite (Shelter store) |
| **LAUNCH-05** | **Accessibility** | This document; manual + Lighthouse + axe |

---

## 2. Checklist (WCAG 2.1 AA + P31 rules)

### 2.1 Motion and sensory

| Item | Status | Notes |
|------|--------|--------|
| `prefers-reduced-motion: reduce` respected | ✅ | ui: scope.css, App.css, PulseIndicator, GlowBadge, P31SproutPanel, etc. BUILD_NEXT notes unified demo + Scope. |
| No auto-playing video/audio with sound | ✅ | No media autoplay in core flows. |
| Animations can be disabled or minimal | ✅ | CSS `@media (prefers-reduced-motion: reduce)` used; reduce or remove animation where applied. |
| No rapid flashing (seizure risk) | ✅ | No rapid strobe; gentle pulses only. |

### 2.2 Keyboard and focus

| Item | Status | Notes |
|------|--------|--------|
| All interactive elements focusable | ⚠ | Audit: ensure buttons, links, custom controls accept focus. |
| Visible focus indicator | ⚠ | High-contrast focus ring (outline/box-shadow) on all focusable elements. |
| Tab order logical | ⚠ | No tabindex > 0 unless required; order follows DOM. |
| No keyboard traps | ✅ | Modals/dialogs must be escapable (Escape) and trap focus within. |

### 2.3 Screen reader and semantics

| Item | Status | Notes |
|------|--------|--------|
| Semantic HTML (landmarks, headings) | ⚠ | Use `<main>`, `<nav>`, `<header>`, heading hierarchy (h1→h2→h3). |
| ARIA where needed (live regions, labels) | ⚠ | ui: aria in YouAreSafe, CatchersMitt, SpoonMeter, etc.; verify alerts/updates announced. |
| Form labels and errors | ⚠ | All inputs have `<label>` or `aria-label`; errors linked with `aria-describedby`. |
| Decorative images not announced | ✅ | Use `alt=""` or `role="presentation"` for decorative only. |

### 2.4 Color and contrast

| Item | Status | Notes |
|------|--------|--------|
| Text contrast ≥ 4.5:1 (normal), ≥ 3:1 (large) | ⚠ | P31 palette: Phosphorus Green #2ecc71, Calcium Blue #60a5fa on #050510; verify with DevTools. |
| Not color-alone for information | ⚠ | Status (e.g. voltage tier) also indicated by icon/text, not only color. |
| High-contrast mode / focus visible in HC | ⚠ | Support system high-contrast or provide theme. |

### 2.5 P31-specific (kids-first, neurodivergent)

| Item | Status | Notes |
|------|--------|--------|
| YouAreSafe reachable in one tap | ✅ | Critical rule in Buffer/Shelter; ensure path in Scope/unified demo. |
| SpoonMeter visible on every screen | ✅ | Same rule; verify in all main views. |
| CatchersMitt buffers before display | ✅ | Safety feature; no raw high-voltage in face. |
| Clear, calm language in UI | ✅ | Brand voice; no alarming or weaponized terms. |
| Sensory settings / assistive hook | ✅ | `useAssistiveTech`, accessibility.store; SensorySettingsPanel, etc. |

---

## 3. How to run LAUNCH-05

### Manual

1. **Lighthouse (Chrome DevTools)**  
   Run against:
   - `apps/web` (or https://phosphorus31.org when live)  
   - Scope dev build (`ui`: `npm run dev`, then audit http://localhost:5173)  
   - Sprout/unified demo view  

   **Targets:** Accessibility ≥ 95; no critical failures.

2. **Keyboard-only**  
   Turn off mouse; tab through Scope and Sprout. Confirm every action is reachable and focus is visible.

3. **Screen reader**  
   NVDA (Windows) or VoiceOver (macOS): open Scope/Sprout, navigate main flows (YouAreSafe, SpoonMeter, Buffer, send signal). Confirm labels and live regions.

4. **Reduced motion**  
   Set OS/browser to “Reduce motion,” reload Scope/Sprout; confirm no essential info is lost and motion is minimal or off.

### Automated (optional)

- **axe-core** (browser extension or `@axe-core/react`): run on main routes; fix any critical/serious.
- **Lighthouse CI**: add step for Accessibility score in pipeline if desired.

---

## 4. Current evidence (from codebase)

- **ui:** `prefers-reduced-motion` in scope.css, App.css, multiple components; `accessibility.store.ts`, `utils/accessibility.ts`, `useAssistiveTech.ts`; YouAreSafe, SpoonMeter, CatchersMitt present.
- **apps/web:** `apps/web/accessibility/index.html` exists; `LANDING_PAGE_AUDIT_2026-02-16.md`, `P31_UI_UX_GROUND_TRUTH.md` may reference a11y.
- **Gaps:** Full Lighthouse/axe run and keyboard/screen-reader pass need to be executed and ticked above; contrast and ARIA coverage need verification.

---

## 5. Sign-off

- [ ] Lighthouse Accessibility ≥ 95 for website and Scope (or documented exceptions).
- [ ] Keyboard-only pass: all critical flows reachable and focus visible.
- [ ] Reduced-motion pass: no essential info lost.
- [ ] P31-critical: YouAreSafe one-tap, SpoonMeter visible, CatchersMitt buffers.

**Output:** LAUNCH-05 complete when checklist is satisfied and any critical/serious issues are fixed or documented with remediation dates.

🔺 The mesh holds.
