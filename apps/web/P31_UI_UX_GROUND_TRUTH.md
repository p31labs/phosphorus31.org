# P31 Labs — UI/UX & Style Ground Truth

**Version:** 1.0  
**Date:** 2026-02-14  
**Status:** CANONICAL  
**Classification:** Design System Reference

---

## PRINCIPLES

### Core Design Philosophy

1. **Warm, Luminous, Curious, Alive** — Not dark, edgy, or tactical
2. **Kids First** — Every element must pass: "Would I put this on a shirt Willow wears to school?"
3. **Offline-First** — Zero external dependencies. Pure HTML/CSS/JS.
4. **Accessibility First** — WCAG 2.1 AA minimum. Keyboard navigation. Screen reader support.
5. **Physics-Based** — Visual elements reflect structural principles (tetrahedron, mesh, quantum states)
6. **Progressive Enhancement** — Works without JavaScript. Enhanced with it.
7. **Personalization** — Users can choose their element from the periodic table, changing colors and shapes throughout the UI

### Visual Identity

**Brand Essence:** The biological qubit. The atom in the bone. Phosphorus-31 — the only stable isotope.

**Aesthetic:** Scientific minimalism. Periodic table precision. Quantum coherence made visible.

**Emotional Tone:** Warm, hopeful, precise. Technology as prosthetic, not luxury.

---

## DESIGN TOKENS

### Color Palette

#### Primary Colors

```css
/* Phosphorus Green — Primary brand color */
--phosphorus: #2ecc71;              /* Main brand color, primary actions */
--phosphorus-dim: #1a7a43;         /* Darker variant for borders/hover states */
--phosphorus-glow: rgba(46, 204, 113, 0.15);  /* Subtle glow effects */
--phosphorus-flare: rgba(46, 204, 113, 0.4);   /* Stronger glow for hover */

/* Calcium Blue — Secondary brand color */
--calcium: #60a5fa;                 /* Secondary actions, accents, links */
--calcium-dim: #2563eb;             /* Darker variant */
--calcium-glow: rgba(96, 165, 250, 0.12);      /* Subtle glow effects */
```

**Usage Rules:**
- **Phosphorus Green:** Primary actions, brand elements, primary CTAs
- **Calcium Blue:** Secondary actions, informational elements, links, superscripts
- **Gradients:** Use `linear-gradient(135deg, var(--phosphorus) 0%, var(--calcium) 100%)` for hero text and special accents

#### Background Colors (The Void)

```css
/* Void — The dark space */
--void: #050510;                     /* Primary background (almost black) */
--void-up: #0a0a1a;                 /* Elevated surfaces (cards, sections) */
--void-surface: #0f0f24;            /* Interactive surfaces */
--void-border: #1a1a3a;             /* Borders, dividers */
```

**Usage Rules:**
- **--void:** Main page background
- **--void-up:** Cards, elevated sections, navigation backgrounds
- **--void-surface:** Interactive elements, hover states
- **--void-border:** All borders, dividers, subtle separations

#### Text Colors

```css
/* Text hierarchy */
--white: #e8e8f0;                    /* Primary text, high contrast */
--white-dim: #9898b0;                /* Secondary text, body copy */
--white-muted: #585870;              /* Tertiary text, labels, metadata */
```

**Usage Rules:**
- **--white:** Headings, important text, primary content
- **--white-dim:** Body text, descriptions, secondary content
- **--white-muted:** Labels, metadata, timestamps, fine print

### Typography

#### Font Families

```css
/* Display font — Headings, hero text */
--font-display: 'Outfit', sans-serif;
/* Weights: 200, 300, 400, 600, 800 */

/* Monospace font — Code, labels, technical text */
--font-mono: 'JetBrains Mono', monospace;
/* Weights: 300, 400, 500, 700 */
```

**Usage Rules:**
- **Outfit (Display):** All headings (h1-h6), hero text, large display text
- **JetBrains Mono (Monospace):** Code blocks, labels, technical specifications, navigation links, metrics

#### Type Scale

```css
/* Headings */
h1: clamp(2.5rem, 6vw, 5rem);       /* Hero titles */
h2: clamp(2rem, 4.5vw, 3.5rem);   /* Section headers */
h3: 1.6rem;                          /* Card titles */
h4: 1.2rem;                          /* Subsection headers */

/* Body */
body: 1rem;                          /* Base body text */
p: 0.95rem - 1.1rem;                /* Paragraph text */
small: 0.75rem - 0.85rem;            /* Small text, captions */
tiny: 0.55rem - 0.65rem;            /* Labels, metadata */
```

**Responsive Typography:**
- Use `clamp()` for fluid scaling
- Minimum readable size: 0.75rem (12px)
- Maximum comfortable line length: 70ch

#### Line Height

```css
/* Line heights */
headings: 1.05 - 1.1;               /* Tight for display */
body: 1.6 - 1.7;                     /* Comfortable reading */
code: 1.4;                           /* Code blocks */
```

### Spacing System

```css
/* Base unit: 0.25rem (4px) */
/* Scale: 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10, 12 */

/* Common spacing values */
padding-xs: 0.3rem;
padding-sm: 0.5rem - 0.75rem;
padding-md: 1rem - 1.5rem;
padding-lg: 2rem - 2.5rem;
padding-xl: 3rem - 4rem;

/* Section spacing */
section-padding: clamp(5rem, 12vh, 10rem) 0;
container-padding: clamp(1.5rem, 4vw, 3rem);
```

**Usage Rules:**
- Use consistent spacing scale
- Responsive padding with `clamp()` for fluid scaling
- Vertical rhythm: maintain consistent spacing between elements

### Shadows & Glows

```css
/* Glow effects */
--phosphorus-glow: rgba(46, 204, 113, 0.15);      /* Subtle ambient glow */
--phosphorus-flare: rgba(46, 204, 113, 0.4);      /* Strong hover glow */
--calcium-glow: rgba(96, 165, 250, 0.12);         /* Calcium accent glow */

/* Shadow examples */
box-shadow: 0 0 30px var(--phosphorus-glow);      /* Subtle glow */
box-shadow: 0 0 50px var(--phosphorus-flare), 0 4px 20px rgba(46, 204, 113, 0.3);  /* Strong hover */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);       /* Depth shadow */
```

**Usage Rules:**
- Glows indicate interactivity and importance
- Use phosphorus glow for primary elements
- Use calcium glow for secondary/informational elements
- Combine glows with depth shadows for elevation

### Border Radius

```css
/* Border radius scale */
radius-none: 0;                      /* Sharp corners (default) */
radius-sm: 1px;                      /* Subtle rounding */
radius-md: 2px - 3px;               /* Standard buttons, cards */
radius-lg: 1rem;                     /* Large cards, modals */
radius-full: 50%;                   /* Pills, circles */
```

**Usage Rules:**
- Default: sharp corners (0 or 2px) for technical aesthetic
- Use minimal rounding (1-3px) for buttons and cards
- Reserve larger radius for special elements (isotope cards, modals)

### Animation & Timing

```css
/* Easing functions */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);   /* Smooth, natural deceleration */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);  /* Bouncy, playful */

/* Duration scale */
fast: 0.2s;                         /* Hover states, micro-interactions */
normal: 0.3s - 0.4s;                /* Standard transitions */
slow: 0.6s - 1s;                    /* Page transitions, reveals */
```

**Animation Principles:**
- **Respect `prefers-reduced-motion`** — Always check `@media (prefers-reduced-motion: reduce)`
- **Purposeful motion** — Every animation should communicate state change
- **Natural timing** — Use ease-out-expo for most transitions
- **Spring physics** — Use ease-spring sparingly for playful elements

---

## COMPONENT PATTERNS

### Buttons

#### Primary Button

```css
.btn-primary {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.85rem 1.8rem;
  border-radius: 2px;
  letter-spacing: 0.04em;
  background: var(--phosphorus);
  color: var(--void);
  box-shadow: 0 0 30px var(--phosphorus-glow), inset 0 1px 0 rgba(255,255,255,0.15);
  transition: all 0.3s var(--ease-out-expo);
}

.btn-primary:hover {
  background: #34d67d;
  box-shadow: 0 0 50px var(--phosphorus-flare), 0 4px 20px rgba(46, 204, 113, 0.3);
  transform: translateY(-1px);
}

.btn-primary:focus {
  outline: 2px solid var(--calcium);
  outline-offset: 2px;
}
```

**Usage:** Primary CTAs, main actions, important buttons

#### Ghost Button

```css
.btn-ghost {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0.85rem 1.8rem;
  border-radius: 2px;
  letter-spacing: 0.04em;
  background: transparent;
  color: var(--white-dim);
  border: 1px solid var(--void-border);
  transition: all 0.3s var(--ease-out-expo);
}

.btn-ghost:hover {
  color: var(--white);
  border-color: var(--phosphorus-dim);
  box-shadow: 0 0 20px var(--phosphorus-glow);
}
```

**Usage:** Secondary actions, navigation, less prominent CTAs

### Cards

#### Stack Card (Product/Feature Card)

```css
.stack-card {
  position: relative;
  padding: 2rem;
  background: var(--void-up);
  border: 1px solid var(--void-border);
  border-radius: 3px;
  overflow: hidden;
  transition: all 0.4s var(--ease-out-expo);
}

.stack-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--phosphorus), var(--calcium), var(--phosphorus));
  background-size: 200% 100%;
  opacity: 0;
  animation: shimmer 3s linear infinite;
}

.stack-card:hover {
  border-color: var(--phosphorus-dim);
  transform: translateY(-4px);
  box-shadow:
    0 0 40px var(--phosphorus-glow),
    0 20px 60px rgba(0, 0, 0, 0.4);
}

.stack-card:hover::before {
  opacity: 1;
}
```

**Structure:**
- Card header with tag and registration mark
- Title (h3)
- Description (p)
- Optional footer with links/actions

### Navigation

#### Main Navigation

```css
nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 1rem 0;
  background: linear-gradient(to bottom, var(--void) 0%, transparent 100%);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.nav-logo {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--phosphorus);
  letter-spacing: -0.02em;
  text-shadow: 0 0 20px var(--phosphorus-glow), 0 0 40px rgba(46, 204, 113, 0.08);
}

.nav-logo sup {
  font-size: 0.6em;
  color: var(--calcium);
  vertical-align: super;
}

.nav-links a {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--white-dim);
  position: relative;
}

.nav-links a::after {
  content: '';
  position: absolute;
  bottom: -4px; left: 0;
  width: 0; height: 1px;
  background: var(--phosphorus);
  transition: width 0.3s var(--ease-out-expo);
  box-shadow: 0 0 8px var(--phosphorus-glow);
}

.nav-links a:hover {
  color: var(--white);
}

.nav-links a:hover::after {
  width: 100%;
}
```

### Periodic Table Element Card

**Isotope Card Pattern** — Used for brand identity, hero elements

```css
.hero-isotope {
  position: absolute;
  width: 140px;
  padding: 1rem;
  border: 1px solid var(--void-border);
  background: rgba(5, 5, 16, 0.8);
  text-align: center;
}

.isotope-num {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  color: var(--white-muted);
}

.isotope-symbol {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 800;
  color: var(--phosphorus);
  line-height: 1;
  text-shadow: 0 0 40px var(--phosphorus-glow);
}

.isotope-mass {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--white-dim);
}

.isotope-note {
  font-size: 0.55rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--white-muted);
  border-top: 1px solid var(--void-border);
  padding-top: 0.5rem;
}
```

**Structure:**
- Atomic number (top left, small, muted)
- Element symbol (center, large, phosphorus green)
- Atomic mass (bottom center, small, dim)
- Note/description (bottom, tiny, uppercase, bordered top)

### Metrics Display

```css
.metric-val {
  font-family: var(--font-mono);
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  font-weight: 700;
  color: var(--phosphorus);
  text-shadow: 0 0 30px var(--phosphorus-glow);
}

.metric-unit {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--white-muted);
}
```

**Usage:** Statistics, key metrics, numerical highlights

### Section Headers

```css
.section-label {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--phosphorus);
  display: block;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: clamp(2rem, 4.5vw, 3.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}
```

**Structure:**
- Label (mono, uppercase, phosphorus green)
- Heading (display font, large, white)
- Optional description (body text, white-dim)

---

## LAYOUT SYSTEM

### Container

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(1.5rem, 4vw, 3rem);
}
```

**Usage:** All content sections, maintains consistent max-width and responsive padding

### Grid System

```css
/* Auto-fit grid for cards */
.stack-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

/* Fixed column grid for metrics */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}
```

**Responsive Breakpoints:**
- Mobile: < 480px (single column)
- Tablet: 480px - 768px (2 columns)
- Desktop: 768px+ (3-4 columns)

### Sections

```css
.section {
  padding: clamp(5rem, 12vh, 10rem) 0;
  position: relative;
}

.section-dark {
  background: var(--void-up);
  border-top: 1px solid var(--void-border);
  border-bottom: 1px solid var(--void-border);
}
```

---

## GEOMETRY ENGINE

### Canvas Layers

```css
/* Background mesh layer */
#mesh-bg {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  z-index: 0;
  pointer-events: none;
  opacity: 0.6;
}

/* Hero geometry layer */
#hero-geometry {
  position: absolute;
  top: 0; right: 0;
  width: 50vw; height: 100vh;
  z-index: 1;
  pointer-events: none;
  opacity: 0.8;
  mask-image: radial-gradient(ellipse 80% 70% at 60% 50%, black 30%, transparent 70%);
}
```

### Geometry Constants

```javascript
const PHI = (1 + Math.sqrt(5)) / 2;  // Golden ratio
const TAU = Math.PI * 2;              // Full circle
const PHOSPHORUS = '#2ecc71';         // Primary color
const CALCIUM = '#60a5fa';            // Secondary color
const VOID = '#050510';               // Background
```

### Mesh Background

- **Particle count:** 80 particles
- **Connection distance:** 150px
- **Color:** Phosphorus green with opacity gradients
- **Behavior:** Gentle movement, mouse repulsion, connection lines

### Hero Geometry

- **3D Tetrahedron:** Rotating, perspective projection
- **Jitterbug transformation:** Animated state transitions
- **SIC-POVM visualization:** Four-state quantum measurement display

---

## ANIMATIONS

### Keyframe Animations

```css
@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

### Animation Usage

```css
/* Staggered reveals */
.hero-equation {
  opacity: 0;
  animation: fadeSlideUp 0.8s var(--ease-out-expo) 0.2s forwards;
}

.hero h1 {
  opacity: 0;
  animation: fadeSlideUp 1s var(--ease-out-expo) 0.4s forwards;
}

.hero-sub {
  opacity: 0;
  animation: fadeSlideUp 1s var(--ease-out-expo) 0.6s forwards;
}
```

**Reduced Motion Support:**

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## ACCESSIBILITY STANDARDS

### WCAG 2.1 AA Compliance

#### Color Contrast

- **Text on void:** White (#e8e8f0) on void (#050510) = 15.8:1 ✅
- **Phosphorus on void:** #2ecc71 on #050510 = 4.8:1 ⚠️ (use for large text only)
- **White-dim on void:** #9898b0 on #050510 = 6.2:1 ✅
- **Calcium on void:** #60a5fa on #050510 = 4.9:1 ⚠️ (use for large text only)

**Rules:**
- Body text must meet 4.5:1 contrast ratio
- Large text (18px+) must meet 3:1 contrast ratio
- Interactive elements must have visible focus indicators

#### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Focus indicators: 2px solid calcium blue, 2px offset
- Tab order must be logical
- Skip link must be first focusable element

#### Screen Reader Support

```html
<!-- Skip link -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<!-- ARIA labels for decorative elements -->
<canvas id="mesh-bg" aria-hidden="true"></canvas>

<!-- Semantic HTML -->
<nav aria-label="Main navigation">
<main id="main-content">
```

#### Focus Management

```css
.skip-link:focus {
  top: 0;
  outline: 3px solid var(--calcium);
  outline-offset: 2px;
}

.btn-primary:focus {
  outline: 2px solid var(--calcium);
  outline-offset: 2px;
}
```

---

## BRAND ELEMENTS

### Logo

**Primary Logo:** `P<sup>31</sup>`

```css
.nav-logo {
  font-family: var(--font-mono);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--phosphorus);
  letter-spacing: -0.02em;
}

.nav-logo sup {
  font-size: 0.6em;
  color: var(--calcium);
  vertical-align: super;
}
```

**Logo Variations:**
- Text logo: `P31` (monospace, phosphorus green)
- Full logo: `P<sup>31</sup>` (with calcium blue superscript)
- Isotope card: Periodic table element card format

### Tagline

**Primary:** "The Mesh Holds. 🔺"

**Secondary:** "Assistive technology for neurodivergent minds"

**Usage:**
- Primary tagline: Footer, closing statements
- Secondary tagline: Hero section, meta descriptions

### Chemical Signature

**Formula:** `Ca₁₀(PO₄)₆(OH)₂` (hydroxyapatite)

**Isotope Badge:** "PHOSPHORUS-31 · THE ONLY STABLE ISOTOPE"

**Usage:** Technical documentation, about pages, scientific context

---

## RESPONSIVE DESIGN

### Breakpoints

```css
/* Mobile First Approach */
/* Base: < 480px (mobile) */
/* Tablet: 480px - 768px */
/* Desktop: 768px+ */
/* Large: 1200px+ */
```

### Fluid Typography

```css
/* Use clamp() for all responsive typography */
font-size: clamp(min, preferred, max);

/* Examples */
h1: clamp(2.5rem, 6vw, 5rem);
h2: clamp(2rem, 4.5vw, 3.5rem);
body: clamp(1rem, 1.2vw, 1.1rem);
```

### Fluid Spacing

```css
/* Use clamp() for responsive spacing */
padding: clamp(1.5rem, 4vw, 3rem);
margin: clamp(2rem, 5vw, 4rem);
gap: clamp(1rem, 2vw, 1.5rem);
```

---

## IMPLEMENTATION CHECKLIST

### Required Elements

- [ ] CSS custom properties (design tokens) defined in `:root`
- [ ] Typography scale using Outfit and JetBrains Mono
- [ ] Color palette with all variants
- [ ] Spacing system with consistent scale
- [ ] Button components (primary, ghost)
- [ ] Card components (stack-card pattern)
- [ ] Navigation (fixed, backdrop blur)
- [ ] Skip link for accessibility
- [ ] Focus indicators on all interactive elements
- [ ] Reduced motion media query
- [ ] Responsive typography with `clamp()`
- [ ] Geometry engine (mesh background, hero geometry)
- [ ] Element personalization system (element selector, theme switching)
- [ ] LocalStorage for user preferences
- [ ] Dynamic color updates in geometry engine

### Quality Checks

- [ ] All colors meet WCAG 2.1 AA contrast ratios
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader tested (NVDA/JAWS/VoiceOver)
- [ ] Reduced motion respected
- [ ] Mobile responsive (320px - 480px)
- [ ] Tablet responsive (480px - 768px)
- [ ] Desktop optimized (768px+)
- [ ] No external dependencies (fonts loaded async)
- [ ] Offline-first (works without internet)

---

## FILE STRUCTURE

```
website/
├── styles.css              # Main stylesheet (design tokens, components)
├── element-selector.css    # Element selector UI styles
├── element-themes.js       # Element theme definitions and switching
├── main.js                 # Geometry engine, animations
├── index.html              # Homepage (reference implementation)
└── [subpages]/            # All pages use same design system
```

---

## CANONICAL STATUS

This document is the **ground truth** for all UI/UX and style decisions in the P31 Labs ecosystem. All design work must:

1. **Reference this document** before making style decisions
2. **Use design tokens** from this document (no hardcoded values)
3. **Follow component patterns** exactly as specified
4. **Maintain accessibility standards** (WCAG 2.1 AA minimum)
5. **Respect the kids-first principle** (warm, luminous, curious, alive)

**Updates to this document require:**
- Operator approval
- Version increment
- Update date
- Change log entry

---

**The Mesh Holds. 🔺**

*"Structure determines performance. Language determines structure. Design determines experience."*
