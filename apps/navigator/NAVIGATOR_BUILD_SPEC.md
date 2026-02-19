# NAVIGATOR BUILD SPEC
## `@p31labs/navigator` — The Jitterbug

Actionable build spec. No research. No citations. Just what to build.

---

## Stack

- React 19 + Vite + Tailwind (match Shelter)
- Pure SVG for geometry (NO Three.js, NO WebGL, NO Canvas)
- `@p31labs/bus` for state reads (or localStorage fallback)
- Target: < 50KB gzipped, Lighthouse > 90, works offline

---

## Three States

### State 0: BREATHE (default on load)

Dark screen `#050508`. One shape centered: a 2D wireframe of a Vector Equilibrium (cuboctahedron). 12 vertices, 24 edges. Phosphor green `#39FF14` wireframe, stroke-width 1, opacity 0.3.

**Breathing animation:** Scale oscillates `1.0 → 1.03 → 1.0` at exactly 0.1 Hz (6 cycles per minute). This matches baroreflex resonance frequency for vagal activation. Use CSS animation or requestAnimationFrame.

**Slow rotation:** Y-axis rotation at 0.5 RPM. Implemented as a rotation matrix applied to 3D coordinates before projection.

**No UI chrome.** No labels. No buttons. Just geometry on void.

**Interaction:** Click/touch/press-and-hold anywhere → begin State 1.

### State 1: JITTERBUG (transition, 1.5 seconds)

The 12 VE vertices contract into 4 tetrahedron vertices.

**Vertex grouping:**
- VE vertices 0,1,2 → Tet vertex 0 (SHELTER)
- VE vertices 3,4,5 → Tet vertex 1 (NODE ONE)
- VE vertices 6,7,8 → Tet vertex 2 (THE FOLD)
- VE vertices 9,10,11 → Tet vertex 3 (GENESIS GATE)

**Interpolation:** For each VE vertex `i` in group targeting tet vertex `j`:
```
position(t) = lerp(VE_position[i], TET_position[j], easeInOutCubic(t))
```
where `t` goes from 0 to 1 over 1.5 seconds.

**Edge handling:** The 6 edges that form the tetrahedron brighten to full opacity. The other 18 edges fade to opacity 0.

**Audio (optional):** If WebAudio available and `!prefers-reduced-motion`, play rising pentatonic: C4 (261.63 Hz) → E4 (329.63 Hz) → G4 (392.00 Hz) → C5 (523.25 Hz) over 1.5 seconds. Sine waves, short decay.

**Reduced motion:** Skip entirely. Jump to State 2.

### State 2: NAVIGATE (stable)

Four vertices of tetrahedron, labeled and interactive. Tetrahedron continues slow rotation (0.5 RPM). Labels billboard-face the camera (always readable).

| Vertex | Label | Sublabel | Color | Status | Tap Action |
|--------|-------|----------|-------|--------|------------|
| 0 (top) | SHELTER | Score your messages | `#39FF14` | 🟢 LIVE | Navigate to p31ca.org |
| 1 (left) | NODE ONE | Hold the thick click | `#06B6D4` | 🔵 DESIGNED | Open info panel |
| 2 (right) | THE FOLD | Trust the geometry | `#F59E0B` | 🟡 COMING SOON | Open info panel |
| 3 (bottom) | GENESIS GATE | Infrastructure | `#8B5CF6` | 🟣 BUILDING | Open panel with donate/docs |

**Vertex rendering:** Each vertex is an SVG `<g>` containing:
- `<circle>` (r=8, filled with vertex color, opacity based on status)
- Glow: second `<circle>` (r=16, same color, opacity 0.15, filter blur)
- `<text>` label (9px monospace, vertex color, uppercase, letter-spacing 2px)
- `<text>` sublabel (7px monospace, #666680, appears on hover/focus)

**Vertex interaction:**
- Hover: pulse glow brighter, show sublabel
- Tap SHELTER: `window.location.href = 'https://p31ca.org'`
- Tap others: open Info Panel (State 3)

**Shelter vertex dynamic brightness:** Read `p31:spoons` from bus/localStorage.
- Spoons 10-12: full brightness (opacity 1.0)
- Spoons 4-9: dimmed (opacity 0.4 + spoons/12 * 0.6)
- Spoons 0-3: pulsing red instead of green

### State 3: INFO PANEL (overlay)

Dark glass panel slides in from the edge nearest the tapped vertex.

**Style:**
- Background: `rgba(15, 15, 20, 0.95)`
- `backdrop-filter: blur(12px)`
- Border: `1px solid rgba(57, 255, 20, 0.1)`
- Border-radius: 12px
- Padding: 20px

**Contents:**
- Title (vertex label, 12px, vertex color, uppercase, letter-spacing 3px)
- Status badge (colored dot + text)
- Description paragraph (10px, #8888a0, line-height 1.6)
- Action buttons (if any)
- Close button (X, top right) or swipe to dismiss

**Panel content per vertex:**

**NODE ONE:**
- Title: NODE ONE — The Phosphorus Nucleus
- Status: 🔵 DESIGNED — Hardware prototype in development
- Description: A handheld ESP32-S3 device with haptic feedback, LoRa mesh radio, and biometric sensors. The "Thick Click" provides proprioceptive input that costs zero spoons.
- Button: "Learn More" → docs link (future)

**THE FOLD:**
- Title: THE FOLD — The Oxygen Bonds
- Status: 🟡 COMING 2027
- Description: Encrypted mesh network between trusted nodes. Four people. Mutual consent. No central authority. Trust the geometry.
- Button: "Constructor's Challenge" → future link

**GENESIS GATE:**
- Title: GENESIS GATE — The Geometry
- Status: 🟣 BUILDING
- Description: Infrastructure and governance. The substrate that makes everything else work.
- Buttons:
  - "Donate USD (tax-deductible)" → HCB fiscal sponsor link
  - "Donate ETH (anonymous)" → stealth address page
  - "Documentation" → docs link

---

## Geometry Math

### Vector Equilibrium Coordinates (12 vertices)

Permutations of `(±1, ±1, 0)`, `(±1, 0, ±1)`, `(0, ±1, ±1)`:

```typescript
const VE_VERTICES = [
  [1, 1, 0], [1, -1, 0], [-1, 1, 0], [-1, -1, 0],   // xy plane
  [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1],   // xz plane
  [0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, -1],   // yz plane
];
```

### VE Edges (24)

Each vertex connects to its 4 nearest neighbors (distance = √2 in normalized coords). Precompute adjacency list.

### Tetrahedron Coordinates (4 vertices)

```typescript
const TET_VERTICES = [
  [1, 1, 1],     // vertex 0: SHELTER
  [1, -1, -1],   // vertex 1: NODE ONE
  [-1, 1, -1],   // vertex 2: THE FOLD
  [-1, -1, 1],   // vertex 3: GENESIS GATE
];
```

Normalize both to same bounding radius.

### Tetrahedron Edges (6)

Complete graph K₄: every vertex connected to every other.

### Y-axis Rotation

```
x' = x * cos(θ) + z * sin(θ)
y' = y
z' = -x * sin(θ) + z * cos(θ)
```

Where θ increments at 0.5 RPM = π/60 radians per second.

### Orthographic Projection (3D → 2D)

```
screenX = centerX + x' * scale
screenY = centerY - y' * scale
```

Discard z' for positioning. Retain z' for depth sorting (higher z = drawn on top).

Scale = `min(viewportWidth, viewportHeight) * 0.3`

---

## MAR10 Day Easter Egg

**Active:** Feb 18 – Mar 10, 2026

```typescript
const now = new Date();
const MAR10_START = new Date('2026-02-18');
const MAR10_END = new Date('2026-03-11');
const isMAR10 = now >= MAR10_START && now < MAR10_END;
```

**If active:** Render a gold star (`#FFD700`) at the center of the tetrahedron (average of all 4 vertex positions after projection). Scale animation (pulse). Label: "MAR10 DAY". Sublabel: "Build the Super Star Molecule".

**Tap action:** Navigate to BONDING game birthday quest.

**After Mar 10:** Fade opacity over 24 hours, then remove.

---

## PWA

```json
{
  "name": "P31 Navigator",
  "short_name": "P31",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#050508",
  "theme_color": "#39FF14"
}
```

Service worker: precache the shell (HTML, JS, CSS). Navigator works fully offline.

---

## Accessibility

- All vertices are `<button role="button">` with `aria-label` (e.g., "Shelter, live, 8 spoons")
- Tab cycles through vertices in order (0→1→2→3)
- Enter activates vertex
- Escape closes info panel
- `prefers-reduced-motion`: skip all animation, render static tetrahedron
- High contrast: thicker strokes (3px), solid fills, no glow effects
- Screen reader announcement on state change: "Navigator ready. Four products available."

---

## File Structure

```
apps/navigator/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── VectorEquilibrium.tsx    # State 0: breathing wireframe
│   │   ├── Tetrahedron.tsx          # State 2: four interactive vertices
│   │   ├── JitterbugTransition.tsx  # State 0→2: lerp animation
│   │   ├── Vertex.tsx               # Single vertex with glow + label
│   │   ├── InfoPanel.tsx            # Slide-in overlay
│   │   └── Mar10Star.tsx            # Birthday quest center star
│   ├── lib/
│   │   ├── geometry.ts              # VE + Tet coords, edges, rotation, projection
│   │   ├── bus-stub.ts              # Read p31: from localStorage (until bus wired)
│   │   └── constants.ts             # Colors, labels, URLs
│   ├── hooks/
│   │   └── useJitterbug.ts          # State machine: breathe → jitterbug → navigate
│   └── index.css
├── public/
│   ├── manifest.json
│   └── sw.js
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Validation

1. Load → dark screen, breathing wireframe (0.1 Hz)
2. Click → wireframe contracts to tetrahedron (1.5s)
3. Four vertices glow with correct colors
4. Tap SHELTER → navigates to p31ca.org
5. Tap NODE ONE → info panel slides in
6. Tap GENESIS GATE → donate buttons visible
7. Gold star in center (MAR10 Day active)
8. Lighthouse Performance > 90
9. Bundle < 50KB gzipped
10. Works offline after first load
11. All vertices keyboard-navigable
12. Reduced motion: instant tetrahedron, no animation
