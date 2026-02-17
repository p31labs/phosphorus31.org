# P31 Labs Branding System
## Complete visual identity and design guidelines

**Version:** 2026-02-14 · **Status:** ACTIVE · **Classification:** PUBLIC

---

## EXECUTIVE SUMMARY

P31 Labs branding is built on the periodic table metaphor: **Phosphorus-31** (the only stable isotope) and **Calcium** (the balancing element). The visual identity uses dark, scientific aesthetics with bright teal/mint green accents, reflecting both the technical precision of assistive technology and the organic nature of human-neurodivergent interfaces.

**Core Principle:** The branding must work offline, be accessible to neurodivergent users, and communicate technical credibility without corporate polish.

---

## LOGO SYSTEM

### Primary Logo — Periodic Table Element Card

**Format:** Square element card with periodic table styling

**Specifications:**
- **Border:** Thin, bright teal/mint green (`#50E3C2`)
- **Atomic Number:** Top-left corner, smaller font, light teal (`#50E3C2`)
- **Element Symbol:** Large, bold, uppercase "P", centered, bright teal (`#50E3C2`)
- **Element Name:** Below symbol, uppercase "PHOSPHORUS", light gray (`#E8E8F0`)
- **Atomic Mass:** Bottom center, smaller font, light teal (`#50E3C2`), value: `30.97376`
- **Background:** Very dark green/black (`#1A201E` or `#050510`)

**Usage:**
- Website headers
- Business cards
- Presentation slides
- Official documentation

### Icon Variations

#### 1. Squircle Icon (App Icon)
- **Shape:** Square with significantly rounded corners
- **Background:** Very dark green (`#1A201E`)
- **Border:** Subtle dark green outline
- **Symbol:** Large serif "P" in bright teal (`#50E3C2`)
- **Subscript:** "31" in smaller teal, positioned bottom-right of "P"
- **Accent:** Small dark green dot near top edge (optional)

**Usage:** Mobile apps, favicons, social media profile images

#### 2. Circular Logo
- **Shape:** Perfect circle
- **Background:** Very dark green/black (`#1A201E`)
- **Border:** Thin teal circle (`#50E3C2`)
- **Symbol:** Large serif "P" centered in bright teal (`#50E3C2`)
- **Atomic Number:** "15" above and left of "P" in teal
- **Isotope Number:** "31" below and right of "P" in teal
- **Text:** "LABS" below "P" in light gray (`#E8E8F0`)
- **Orbital Dots:** Three small teal dots along dashed circle path (optional)

**Usage:** Social media, circular avatars, badges

### Logo Clear Space

- **Minimum clear space:** 0.5x the height of the element symbol
- **Never place text or graphics within the clear space**
- **Maintain aspect ratio in all applications**

### Logo Don'ts

- ❌ Do not stretch or distort the logo
- ❌ Do not change the color of the element symbol
- ❌ Do not place on busy backgrounds without sufficient contrast
- ❌ Do not use the periodic table card format for icons (use squircle/circular variants)
- ❌ Do not add effects (drop shadows, gradients, glows) to the primary logo

---

## COLOR PALETTE

### Primary Colors

| Name | Hex | RGB | Usage | Accessibility |
|------|-----|-----|-------|--------------|
| **Phosphorus Teal** | `#50E3C2` | rgb(80, 227, 194) | Primary brand color, logos, CTAs, active states | WCAG AA on dark backgrounds |
| **Calcium Orange** | `#FF6B35` | rgb(255, 107, 53) | Chemistry sections, element cards, accents | WCAG AA on dark backgrounds |
| **Protocol Blue** | `#4A90E2` | rgb(74, 144, 226) | Protocol sections, technical documentation | WCAG AA on dark backgrounds |

### Secondary Colors

| Name | Hex | RGB | Usage |
|------|-----|-----|-------|
| **Phosphorus Green** | `#2ecc71` | Legacy primary (deprecated, use Phosphorus Teal) | Historical references only |
| **Green Dim** | `#1b7a5a` | Borders, secondary elements | Subtle accents |
| **Green Deep** | `#0d3b2e` | Button backgrounds, dark accents | Depth and contrast |
| **Calcium Blue** | `#60a5fa` | Chemistry sections, donation UI | Alternative to Protocol Blue |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Love Purple** | `#e879f9` | LOVE economy, sovereignty pool |
| **Gold** | `#fbbf24` | Milestones, bonds, achievements |
| **Alert Red** | `#ef4444` | Critical alerts, danger states |
| **Warning Orange** | `#f59e0b` | Warnings, offline mode |

### Neutral Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Background** | `#050510` | Primary background (near-black) |
| **Background Alt** | `#1A201E` | Card backgrounds, elevated surfaces |
| **Card** | `#0c0c1c` | Card/panel background |
| **Text Primary** | `#e8e8f0` | Primary text, headings |
| **Text Dim** | `#6b7280` | Secondary text, captions |
| **Text Muted** | `#3a3a52` | Tertiary text, borders, disabled states |

### Color Usage Guidelines

1. **Primary Brand Color:** Use Phosphorus Teal (`#50E3C2`) for all primary brand elements
2. **Contrast:** Ensure WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
3. **Dark Mode First:** All designs must work on dark backgrounds (`#050510` or `#1A201E`)
4. **Accessibility:** Test all color combinations with color blindness simulators
5. **No Pure White:** Avoid `#FFFFFF` — use `#E8E8F0` for text on dark backgrounds

---

## TYPOGRAPHY

### Font Stack

**Primary (Body Text):**
```css
font-family: 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Roboto', sans-serif;
```

**Monospace (Code, Metrics, Formulas):**
```css
font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
```

**No External Fonts:** Delta principle — no Wye dependencies. Use system fonts only.

### Type Scale

| Size | Usage | Example |
|------|-------|---------|
| **48px / 3rem** | Hero headlines | "P31 Labs" |
| **32px / 2rem** | Section headers | "HARDWARE" |
| **24px / 1.5rem** | Subsection headers | "Node One" |
| **18px / 1.125rem** | Large body text | Taglines, important content |
| **16px / 1rem** | Body text | Default paragraph text |
| **14px / 0.875rem** | Small text | Captions, metadata |
| **12px / 0.75rem** | Tiny text | Atomic numbers, subscripts |

### Typography Guidelines

1. **Headings:** Use sentence case for most headings. ALL CAPS only for navigation labels (HARDWARE, SOFTWARE, PROTOCOL)
2. **Chemical Notation:** Use proper superscripts/subscripts (P³¹, Ca²⁺, Ca₁₀(PO₄)₆(OH)₂)
3. **Monospace:** Use for all metrics, code, chemical formulas, and technical data
4. **Line Height:** 1.5 for body text, 1.2 for headings
5. **Letter Spacing:** -0.02em for large headings, 0 for body text

---

## ELEMENT CARDS

### Phosphorus Card

**Design Pattern:** Periodic table element card

- **Border:** Bright teal (`#50E3C2`)
- **Atomic Number:** 15 (top-left, teal)
- **Symbol:** Large "P" (center, teal)
- **Name:** "PHOSPHORUS" (below symbol, light gray)
- **Mass:** 30.97376 (bottom, teal)

**Usage:** Primary branding, hero sections, chemistry explanations

### Calcium Card

**Design Pattern:** Periodic table element card

- **Border:** Bright orange (`#FF6B35`)
- **Atomic Number:** 20 (top-left, orange)
- **Symbol:** Large "Ca" (center, orange)
- **Name:** "CALCIUM" (below symbol, light gray)
- **Mass:** 40.078 (bottom, orange)

**Usage:** Chemistry sections, balance metaphors, donation UI

### Element Card Usage

- Use side-by-side with equals sign (=) to show relationship: P + Ca = Balance
- Never use element cards for non-chemical concepts
- Maintain consistent sizing and spacing when used together

---

## NAVIGATION STRUCTURE

### Primary Navigation

**Format:** Horizontal navigation with category labels and accent lines

**Categories:**
1. **HARDWARE** — Dark green accent line (`#1b7a5a`)
2. **SOFTWARE** — Dark orange/brown accent line (`#8B4513` or `#FF6B35`)
3. **PROTOCOL** — Dark blue/teal accent line (`#4A90E2`)

**Styling:**
- Light green text (`#50E3C2` or `#6b7280`)
- Small dots between categories (faint green)
- Thin horizontal lines below each category
- Color-coded accent lines match category theme

**Usage:** Website headers, main navigation, section dividers

---

## BANNER/HEADER DESIGN

### Standard Header Layout

**Background:**
- Very dark greenish-black (`#050510` or `#1A201E`)
- Subtle gradient (slightly lighter towards bottom)
- Faint green speckles/dots for texture (optional)

**Layout:**
- **Left:** Periodic table element card (P with 15 and 30.97376)
- **Center-Left:** "P31 Labs" (large, bold, white)
- **Center-Right:** Tagline "Assistive technology for neurodivergent minds" (smaller, white)
- **Bottom:** Navigation categories (HARDWARE, SOFTWARE, PROTOCOL) with accent lines

**Spacing:**
- Logo to text: 24px minimum
- Text to tagline: 8px
- Tagline to navigation: 32px

---

## BADGES AND INDICATORS

### Isotope Badge
**Text:** `PHOSPHORUS-31 · THE ONLY STABLE ISOTOPE`
**Style:** Small, light gray text, monospace font
**Usage:** Footer, about pages, technical documentation

### Chemical Signature
**Text:** `Ca₁₀(PO₄)₆(OH)₂`
**Style:** Monospace, teal color (`#50E3C2`)
**Usage:** Chemistry sections, mission statements

### Tagline
**Text:** `The Mesh Holds. 🔺`
**Style:** Regular weight, white or light gray
**Usage:** Email signatures, social media bios, footer

### Status Indicators
- **Green dot** (`#50E3C2`) = Online/nominal (GREEN BOARD)
- **Orange dot** (`#f59e0b`) = Offline/warning (YELLOW BOARD)
- **Red dot** (`#ef4444`) = Critical (RED BOARD)

---

## IMAGERY AND ILLUSTRATION

### Style Guidelines

1. **Dark Backgrounds:** All imagery should work on dark backgrounds
2. **Minimal:** Avoid busy, cluttered compositions
3. **Technical:** Prefer diagrams, schematics, and technical illustrations over stock photos
4. **Accessible:** High contrast, clear shapes, readable text overlays
5. **No People:** Avoid showing faces or identifiable people (privacy-first)

### Illustration Themes

- **Geometric:** Tetrahedrons, mesh networks, delta topology diagrams
- **Chemical:** Periodic table elements, molecular structures, atomic models
- **Technical:** Circuit diagrams, hardware schematics, system architecture
- **Abstract:** Quantum coherence visualizations, energy flows, network topologies

---

## ACCESSIBILITY REQUIREMENTS

### Color Contrast

- **Normal Text:** Minimum 4.5:1 contrast ratio (WCAG AA)
- **Large Text (18px+):** Minimum 3:1 contrast ratio (WCAG AA)
- **Interactive Elements:** Minimum 3:1 contrast ratio for focus indicators

### Visual Accessibility

- **High Contrast Mode:** All designs must work in high contrast mode
- **Color Blindness:** Never rely solely on color to convey information
- **Text Alternatives:** All icons and images must have alt text
- **Focus Indicators:** Clear, visible focus states for all interactive elements

### Neurodivergent Accessibility

- **Sensory Regulation:** Avoid flashing animations, rapid transitions
- **Cognitive Load:** Clear hierarchy, minimal distractions
- **Executive Function:** Consistent navigation, predictable patterns
- **Stim-Friendly:** Support for "Stim Comm" integration, haptic feedback

---

## USAGE EXAMPLES

### Website Header
```
[P Element Card] P31 Labs
                 Assistive technology for neurodivergent minds
                 
                 HARDWARE · SOFTWARE · PROTOCOL
                 ─────────  ─────────  ────────
```

### Business Card
- Front: Squircle icon + "P31 Labs" + tagline
- Back: Element cards (P + Ca) + contact info

### Social Media
- Profile: Circular logo
- Cover: Banner design with navigation
- Posts: Dark background, teal accents, minimal text

### Documentation
- Header: Periodic table card + "P31 Labs"
- Body: Dark background, light text, monospace for code
- Footer: Isotope badge + chemical signature

---

## BRAND VOICE ALIGNMENT

The visual identity supports the brand voice:

- **Technical Precision:** Periodic table metaphor, chemical notation, scientific accuracy
- **Radical Empathy:** Accessible design, neurodivergent-first, sensory regulation support
- **Direct Communication:** Clear hierarchy, minimal decoration, functional aesthetics
- **Delta Resilience:** System fonts, offline-capable, no external dependencies

---

## IMPLEMENTATION CHECKLIST

### For Designers
- [ ] Use Phosphorus Teal (`#50E3C2`) as primary brand color
- [ ] Test all color combinations for WCAG AA compliance
- [ ] Use system fonts only (no external CDNs)
- [ ] Maintain logo clear space (0.5x symbol height)
- [ ] Ensure designs work on dark backgrounds (`#050510`)

### For Developers
- [ ] Implement color tokens in CSS/design system
- [ ] Use semantic color names (not hex values directly)
- [ ] Test with screen readers and keyboard navigation
- [ ] Validate contrast ratios with automated tools
- [ ] Support high contrast mode

### For Content Creators
- [ ] Use proper chemical notation (P³¹, Ca²⁺, subscripts/superscripts)
- [ ] Include isotope badge in footer when appropriate
- [ ] Use tagline "The Mesh Holds. 🔺" consistently
- [ ] Follow typography scale for headings and body text
- [ ] Maintain brand voice (engineer who cares, not corporate)

---

## REFERENCE

**Related Documents:**
- `02_BRAND_VOICE.md` — Voice and terminology guide
- `P31_NODE_ZERO_NAMING.md` — Naming conventions
- `00_AGENT_BIBLE.md` — Core mission and identity

**External Resources:**
- WCAG 2.1 AA Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Color Contrast Checker: https://webaim.org/resources/contrastchecker/
- Periodic Table Reference: https://www.rsc.org/periodic-table

---

## CONCLUSION

The Mesh Holds. 🔺

**Phosphorus-31. The only stable isotope. The atom in the bone.**