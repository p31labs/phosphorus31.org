# QA-01: Design Token Audit — Violations Report

**Date:** 2026-02-16  
**Scope:** apps/web, apps/sprout, apps/scope, ui/ (monorepo frontends). apps/shelter has no `src/ui/`.  
**Deliverables:** `packages/protocol/src/tokens.ts`, `packages/protocol/tokens.css`, this report.

---

## 1. Artifacts Created

| File | Purpose |
|------|---------|
| `packages/protocol/src/tokens.ts` | Single source of truth: colors, productColors, fonts, typeScale, glow, spacing, radii, transitions |
| `packages/protocol/tokens.css` | CSS custom properties (--p31-void, --p31-surface-1, --p31-green, --p31-font-display, etc.) |
| `packages/protocol/src/index.ts` | Exports tokens (import from `@p31/protocol`) |

**Usage:**  
- **CSS apps:** Import `packages/protocol/tokens.css` at root (or copy into app).  
- **JS/TS:** `import { colors, fonts, glow, productColors } from '@p31/protocol'`.

---

## 2. Violations: Hardcoded Hex / Colors

### apps/web

| File | Line | Hardcoded value | Correct token |
|------|------|------------------|---------------|
| apps/web/education/index.html | 10 | theme-color #050510 | var(--p31-void) or colors.void |
| apps/web/docs/guides/index.html | 8 | theme-color #050510 | var(--p31-void) |
| apps/web/docs/index.html | 10, 90 | theme-color #050510; color #050510 | var(--p31-void) |
| apps/web/press/index.html | 10, 94, 316 | #050510 (theme, color, swatch) | var(--p31-void) |
| apps/web/node-one/index.html | 10, 85, 86, 118 | #050510; #2ecc71; #60a5fa | var(--p31-void); colors.green → #00FF88 (brand); colors.cyan → #00D4FF (brand) — node-one uses non-brand greens/blues |
| apps/web/roadmap/index.html | 10, 47, 79 | #050510 (theme, color, border) | var(--p31-void) |
| apps/web/manifesto/index.html | 10 | theme-color #050510 | var(--p31-void) |
| apps/web/accessibility/index.html | 10, 59 | #050510 | var(--p31-void) |
| apps/web/donate/index.html | 10 | theme-color #050510 | var(--p31-void) |
| apps/web/legal/index.html | 10 | theme-color #050510 | var(--p31-void) |
| apps/web/games/index.html | 10, 47, 126 | #050510 | var(--p31-void) |
| apps/web/wallet/index.html | 10, 140, 155 | #050510; #2ecc71 in .status-dot | var(--p31-void); var(--p31-green) |
| apps/web/about/index.html | 10, 114, 145 | #050510 (theme, border, color) | var(--p31-void) |
| apps/web/blog/index.html | 10, 101, 153, 297 | #050510 | var(--p31-void) |
| apps/web/index.html | 15 | theme-color #050510 | var(--p31-void) |
| apps/web/styles.css | 8 | --void: #050510 | Keep or alias to --p31-void; other vars (--phosphorus #2ecc71, --calcium #60a5fa) → use --p31-green, --p31-cyan |

### apps/sprout

| File | Line | Hardcoded value | Correct token |
|------|------|------------------|---------------|
| apps/sprout/src/App.css | 32–33 | #00FF88 background, box-shadow | var(--p31-green) or colors.green; glow.box(colors.green) |
| apps/sprout/src/App.css | 37–38 | #FFB800 background, box-shadow | var(--p31-amber) or colors.amber |
| apps/sprout/src/App.css | 69 | --btn-color: #00FF88 | var(--p31-green) |
| apps/sprout/src/App.css | 74 | #0a0a1a (color-mix) | var(--p31-surface-1) / #0A0A1F |
| apps/sprout/src/App.css | 75 | #e0e0e0 | var(--p31-text-primary) / #E0E0EE |
| apps/sprout/src/App.css | 121 | color #00FF88 | var(--p31-green) |
| apps/sprout/src/App.css | 130 | color #00D4FF | var(--p31-cyan) |
| apps/sprout/src/App.css | 49 | #888 | var(--p31-text-secondary) or --p31-text-tertiary |

### apps/scope

| File | Line | Hardcoded value | Correct token |
|------|------|------------------|---------------|
| apps/scope/src/index.css | 2–10 | All :root hex (--p31-void, --p31-surface, etc.) | Source from tokens.css; align names (--p31-text → --p31-text-primary, --p31-muted → --p31-text-secondary). --p31-red #FF4444, --p31-black #330000 not in tokens — add to tokens if needed or use colors.magenta |
| apps/scope/src/components/SignalPanel.tsx | 7–8 | hug: '#00D4FF', help: '#FF00CC' | Use var(--p31-cyan), var(--p31-magenta) or import colors.cyan, colors.magenta |

### ui/ (Scope/Sprout/Buffer unified app)

| File | Line | Hardcoded value | Correct token |
|------|------|------------------|---------------|
| ui/src/components/Scope/TelemetryDashboard.tsx | 21 | void: '#050510' | colors.void |
| ui/src/components/Scope/SpectrumBar.tsx | 45 | bg-[#050510] | var(--p31-void) or theme |
| ui/src/components/MVP/QuantumMVPView.tsx | 39 | bg-[#050510] | var(--p31-void) |
| ui/src/components/Buffer/BufferDashboard.tsx | 191 | color: '#050510' | colors.void |
| ui/src/components/Buffer/SimpleBuffer.tsx | 115 | color: '#050510' | colors.void |
| ui/src/styles.css | 14 | --p31-void: #050510 | Import tokens.css or keep alias to --p31-void |
| ui/src/components/Scope/LoRaStatus.tsx | 8 | phosphorus: '#2ecc71', void: '#050510', slate, amber | colors.green, colors.void; use tokens for amber (colors.amber #FFB800) |
| ui/src/components/Molecule/Posner4D/Posner4DPlayground.tsx | 45, 48 | bg-[#050510], color attach #050510 | colors.void |
| ui/src/App.tsx | 184, 898, 912 | bg-[#050510] | var(--p31-void) |
| ui/src/App.tsx | 189, 902, 917 | bg-[#2ecc71], text-[#050510], ring-[#2ecc71] | colors.green, colors.void (brand green is #00FF88 not #2ecc71) |
| ui/src/organisms/ScopeDashboard.tsx | 303 | bg-[#050510] | var(--p31-void) |
| ui/src/components/Sprout/P31SproutPanel.css | 4 | var(--p31-void, #050510) | Use --p31-void from tokens |
| ui/src/quantum/FractalZUI.tsx | 257 | color attach #050510 | colors.void |
| ui/src/components/Scope/VoltageAlert.tsx | 8 | phosphorus #2ecc71, void #050510, amber #f59e0b, crimson #dc2626 | colors.green, colors.void, colors.amber; magenta for “crimson” or add token |
| ui/src/components/P31Wallet.tsx | 12 | bg: "#050510", bg2: "#0a0a18", card: "#0c0c1c" | colors.void, colors.surface1, surface2 |

---

## 3. Violations: Hardcoded font-family

### apps/web

| File | Line | Hardcoded value | Correct token |
|------|------|------------------|---------------|
| apps/web/education/index.html | 82 | var(--font-mono) | Align --font-mono to --p31-font-data (Space Mono) |
| apps/web/docs/index.html | 33, 74, 117 | 'JetBrains Mono', monospace | fonts.data → 'Space Mono', monospace (--p31-font-data) |
| apps/web/docs/index.html | 88 | 'Outfit', sans-serif | fonts.display → 'Oxanium', sans-serif (--p31-font-display) |
| apps/web/press/index.html | 64, 82, 358 | 'JetBrains Mono', monospace | --p31-font-data |
| apps/web/node-one/index.html | 46, 61, 109, 155, 158, 161, 165 | 'JetBrains Mono'; fill #2ecc71, #60a5fa, #ff9f43, #e2e8f0 | --p31-font-data; colors.green, colors.cyan, colors.amber, colors.textPrimary |
| apps/web/roadmap/index.html | 32, 119, 150, 182, 194 | 'JetBrains Mono' | --p31-font-data |
| apps/web/manifesto/index.html | 230 | 'JetBrains Mono'; color #2ecc71 | --p31-font-data; --p31-green |
| apps/web/accessibility/index.html | 79 | 'JetBrains Mono' | --p31-font-data |
| apps/web/donate/index.html | 34 | 'JetBrains Mono' | --p31-font-data |
| apps/web/legal/index.html | 65 | 'JetBrains Mono' | --p31-font-data |
| apps/web/games/index.html | 32, 103, 116 | 'JetBrains Mono' | --p31-font-data |
| apps/web/wallet/index.html | 32, 133, 148 | 'JetBrains Mono' | --p31-font-data |
| apps/web/wallet/index.html | 60 | 'Outfit', sans-serif | --p31-font-display |
| apps/web/styles.css | 21–22 | --font-display: 'Outfit'; --font-mono: 'JetBrains Mono' | --p31-font-display (Oxanium), --p31-font-data (Space Mono) |

### apps/scope

| File | Line | Hardcoded value | Correct token |
|------|------|------------------|---------------|
| apps/scope/src/index.css | 10–11 | --font-heading: 'Oxanium'...; --font-mono: 'Space Mono' | Already aligned; can replace with var(--p31-font-display), var(--p31-font-data) from tokens.css |

### ui/

| File | Line | Hardcoded value | Correct token |
|------|------|------------------|---------------|
| ui/src/components/Buffer/BufferDashboard.tsx | 384 | font-family: inherit | OK (inherit) or use fonts.system |
| ui/src/components/DemoDashboard/DemoDashboard.tsx | 25 | -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif | fonts.system |
| ui/src/components/DemoDashboard/DemoDashboard.tsx | 218 | fontFamily: 'monospace' | fonts.data |
| ui/src/App.css | 42, 72, 132, 204, 235, 322, 348, 421 | 'JetBrains Mono', monospace | fonts.data / --p31-font-data |
| ui/src/components/ui/QuantumCanvas.tsx | 629 | fontFamily: 'monospace' | fonts.data |
| ui/src/components/Molecule/MoleculeBuilderHero.tsx | 782 | font-family: monospace | fonts.data |
| ui/src/components/P31Language/P31LanguageEditor.tsx | 287, 329, 373, 383 | 'Courier New', monospace | fonts.data |
| ui/src/components/demo/MATADemoCockpit.tsx | 72 | "JetBrains Mono", monospace | fonts.data |
| ui/src/styles.css | 25 | var(--font-main) | Align --font-main to --p31-font-display |
| ui/src/components/Sprout/P31SproutPanel.css | 7 | -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui | fonts.system (Sprout uses system only — correct) |
| ui/src/components/Sprout/P31SproutPanel.css | 62 | 'Courier New', Monaco, monospace | fonts.data |
| ui/src/components/quantum/QuantumNavigation.tsx | 276 | fontFamily: 'monospace' | fonts.data |
| ui/src/components/quantum/QuantumCoherenceIndicator.tsx | 115, 132 | GOD_CONFIG.typography.fontFamily.body; 'monospace' | fonts.display / fonts.data |
| ui/src/components/P31Wallet.tsx | 226, 268, 297, 307–308, 313–314 | fontFamily: "monospace" | fonts.data |

---

## 4. Violations: Hardcoded box-shadow / text-shadow

### apps/web

| File | Line | Hardcoded value | Correct token |
|------|------|------------------|---------------|
| apps/web/docs/index.html | 81 | box-shadow 0 0 0 2px rgba(46,204,113,0.2) | glow.box(colors.green, intensity) or var(--p31-glow-green) |
| apps/web/roadmap/index.html | 80, 88–90 | box-shadow green/blue rgba | Use glow.* or --p31-glow-* |
| apps/web/wallet/index.html | 41 | box-shadow 0 0 8px #2ecc71 | glow.box(colors.green) |
| apps/web/blog/index.html | 155, 173, 181, 333 | box-shadow rgba(96,165,250), rgba(46,204,113) | Use tokens; #2ecc71 → colors.green |
| apps/web/styles.css | 196–197, 200, 229, 259, 279, 307, 375, 379, 390, 401, 431, 474, 550, 678–679, 682, 690, 716, 720, 739, 766, 782, 854, 880 | text-shadow / box-shadow with rgba(46,204,113,…) or var(--phosphorus-glow) | Map --phosphorus-glow to token; use glow.text(hex), glow.box(hex) or --p31-glow-green |

### apps/sprout

| File | Line | Hardcoded value | Correct token |
|------|------|------------------|---------------|
| apps/sprout/src/App.css | 84, 89 | box-shadow color-mix / 0 0 20px | Use glow.box(colors.green) or var(--p31-glow-green) for .sprout-button |

### apps/scope

No additional shadow violations beyond index.css (already listed under colors).

### ui/

| File | Line | Hardcoded value | Correct token |
|------|------|------------------|---------------|
| ui/src/App.css | 46, 86, 124, 227, 447 | box-shadow rgba(0,255,255,…), #00ffff | colors.cyan + glow.box(colors.cyan) |
| ui/src/App.css | 148, 351, 608 | text-shadow | glow.text() or var |
| ui/src/components/Molecule/MoleculeBuilderHero.tsx | 476, 534, 559, 668, 673, 678, 682 | text-shadow/box-shadow rgba(0,255,255), rgba(255,64,0) | glow.* with colors.cyan / accent |
| ui/src/styles.css | 112 | box-shadow 0 4px 8px rgba(0,0,0,0.2) | Optional token for “shadow” or leave |
| ui/src/components/Sprout/P31SproutPanel.css | 48, 53 | box-shadow rgba(232,121,249), rgba(46,204,113) | glow with colors.magenta, colors.green |
| ui/src/components/Scope/scope.css | 17 | text-shadow rgba(46,204,113,0.6) | glow.text(colors.green) |
| ui/src/components/WillowsWorld/*.tsx | 96, 135, 448, 604, 609 | rgba(255,105,180,…) (pink) | Closest: colors.magenta; or add brand “pink” if needed |
| ui/src/components/ToolsForLife/ToolsForLifePanel.tsx | 214, 295 | box-shadow pink | Same |
| ui/src/components/Molecule/WelcomeScreen.tsx | 145, 150 | box-shadow cyan | glow.box(colors.cyan) |
| ui/src/components/Molecule/Tooltip3D.tsx | 36 | box-shadow cyan | glow.box(colors.cyan) |
| ui/src/components/Molecule/QuantumTimeline.tsx | 92 | box-shadow currentColor | OK or use glow.* |
| ui/src/components/Molecule/CoherenceMeter.tsx | 89 | text-shadow currentColor | OK or use glow.* |

---

## 5. Summary counts (approximate)

| Category | apps/web | apps/sprout | apps/scope | ui/ |
|----------|----------|-------------|------------|-----|
| Hardcoded hex/color | 40+ | 9 | 12+ | 25+ |
| Hardcoded font-family | 25+ | 0 | 0 (already vars) | 20+ |
| Hardcoded box-shadow/text-shadow | 30+ | 2 | 0 | 25+ |

**Total:** 100+ violation sites. No refactors were applied in this pass (audit only).

---

## 6. Next steps (for QA-02+ and refactor)

1. **Wire tokens.css:** In each app root CSS, add:  
   `@import '@p31/protocol/tokens.css';`  
   or copy `packages/protocol/tokens.css` into the app and import it.  
2. **Replace hex/color:** Replace every hardcoded hex and non-token color with `var(--p31-*)` or `colors.*` / `productColors.*` from `@p31/protocol`.  
3. **Replace fonts:** Use `var(--p31-font-display)`, `var(--p31-font-data)`, `var(--p31-font-system)` or `fonts.display`, `fonts.data`, `fonts.system`.  
4. **Replace shadows:** Use `glow.text(hex, intensity)` and `glow.box(hex, intensity)` in JS; in CSS use `var(--p31-glow-green)` etc. or define local vars from tokens.  
5. **Brand alignment:** Where apps use `#2ecc71` (Tailwind green) or `#60a5fa` (Tailwind blue), standardize to P31 `#00FF88` (green) and `#00D4FF` (cyan).

---

*If it doesn’t glow, it doesn’t ship.* 🔺
