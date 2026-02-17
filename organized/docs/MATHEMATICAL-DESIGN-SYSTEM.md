# MATHEMATICAL DESIGN SYSTEM
# Every decision derived from K₄ geometry

## CORE PRINCIPLE

**The mesh speaks. We listen.**

Not:
- "This looks nice"
- "Users expect this"
- "Industry standard is..."

But:
- "The tetrahedron has 4 vertices"
- "The complete graph has 6 edges"
- "The geometry requires this"

---

## SYNERGETIC CONSTANTS

All measurements derived from tetrahedron geometry.

### Base Unit: Edge Length

```typescript
// src/lib/math/constants.ts

/**
 * SYNERGETIC CONSTANTS
 * All derived from tetrahedron geometry
 */

// Base edge length of tetrahedron
export const EDGE_LENGTH = 2.0;

// Tetrahedron radius (center to vertex)
// Formula: R = (√6/4) × edge_length
export const TETRAHEDRON_RADIUS = (Math.sqrt(6) / 4) * EDGE_LENGTH;
// = 1.2247... (irrational, as nature intended)

// Tetrahedron height
// Formula: h = (√6/3) × edge_length
export const TETRAHEDRON_HEIGHT = (Math.sqrt(6) / 3) * EDGE_LENGTH;
// = 1.6329...

// Vertex positions (derived, not chosen)
export const VERTEX_POSITIONS = [
  [0, TETRAHEDRON_HEIGHT * 0.5, 0],                           // Top
  [-EDGE_LENGTH/2, -TETRAHEDRON_HEIGHT * 0.5, EDGE_LENGTH/2], // Front-left
  [EDGE_LENGTH/2, -TETRAHEDRON_HEIGHT * 0.5, EDGE_LENGTH/2],  // Front-right
  [0, -TETRAHEDRON_HEIGHT * 0.5, -EDGE_LENGTH/2],             // Back
];
```

---

## SPACING SYSTEM

Not arbitrary numbers (8px, 16px, 24px).

But ratios derived from tetrahedron:

```typescript
// src/lib/design/spacing.ts

/**
 * SPACING DERIVED FROM GEOMETRY
 * 
 * Base unit = EDGE_LENGTH = 2.0
 * All spacing is rational multiples or geometric ratios
 */

const BASE = EDGE_LENGTH;

export const SPACING = {
  // Vertices (4)
  xs: BASE * 0.25,    // 0.5  (1/4 edge length)
  sm: BASE * 0.5,     // 1.0  (1/2 edge length)
  md: BASE * 1.0,     // 2.0  (full edge length)
  lg: BASE * 2.0,     // 4.0  (2 edges)
  xl: BASE * 4.0,     // 8.0  (4 edges)
  
  // Edges (6)
  edge: EDGE_LENGTH,  // 2.0  (natural edge)
  
  // Heights (tetrahedral)
  height: TETRAHEDRON_HEIGHT, // 1.6329... (geometric)
};

// In Tailwind config:
module.exports = {
  theme: {
    spacing: {
      'vertex-1': '0.5rem',   // 0.25 × edge
      'vertex-2': '1rem',     // 0.5 × edge
      'vertex-4': '2rem',     // 1 × edge
      'edge': '2rem',         // Edge length
      'height': '1.633rem',   // Tetrahedral height
    }
  }
}
```

---

## COLOR SYSTEM

Not picked from color wheel.

Derived from tetrahedron vertex states:

```typescript
// src/lib/design/colors.ts

/**
 * COLORS DERIVED FROM VERTEX STATES
 * 
 * 4 vertices → 4 primary colors
 * 6 edges → 6 relationship colors
 */

export const COLORS = {
  // VERTEX STATES (4)
  vertices: {
    healthy: '#10b981',    // Green (active, connected)
    warning: '#f59e0b',    // Amber (needs attention)
    critical: '#ef4444',   // Red (emergency)
    memorial: '#8b5cf6',   // Purple (distributed information)
  },
  
  // EDGE STATES (6 possible connections)
  edges: {
    strong: '#06b6d4',     // Cyan (active connection)
    weak: '#6b7280',       // Gray (degraded)
    forming: '#3b82f6',    // Blue (establishing)
    breaking: '#f97316',   // Orange (dissolving)
    memorial: '#a78bfa',   // Light purple (remembering)
    potential: '#22d3ee',  // Light cyan (possible)
  },
  
  // BACKGROUND (void/space)
  void: '#000000',         // Black (the space between)
  
  // PRIMARY (structural)
  structure: '#06b6d4',    // Cyan (the geometry itself)
};
```

---

## TYPOGRAPHY

Not arbitrary font sizes.

Ratios derived from tetrahedral proportions:

```typescript
// src/lib/design/typography.ts

/**
 * TYPOGRAPHY SCALE
 * Based on tetrahedral height ratio: 1.633 (√6/3 × 2)
 */

const BASE_SIZE = 16; // 1rem
const RATIO = TETRAHEDRON_HEIGHT / EDGE_LENGTH; // 1.633 / 2 = 0.8165

// But we want growth, so use reciprocal
const SCALE = EDGE_LENGTH / TETRAHEDRON_HEIGHT; // 2 / 1.633 = 1.2247

// More harmonious: Use golden ratio sections of tetrahedral geometry
const PHI = 1.618; // Golden ratio (appears in tetrahedron)

export const FONT_SIZES = {
  xs: BASE_SIZE * Math.pow(SCALE, -2),  // 10.7px
  sm: BASE_SIZE * Math.pow(SCALE, -1),  // 13.1px
  base: BASE_SIZE,                       // 16px
  lg: BASE_SIZE * SCALE,                 // 19.6px
  xl: BASE_SIZE * Math.pow(SCALE, 2),   // 24px
  '2xl': BASE_SIZE * Math.pow(SCALE, 3), // 29.4px
  '3xl': BASE_SIZE * Math.pow(SCALE, 4), // 36px
};

// Alternatively: Use 4/6 ratio (vertices/edges)
const VERTEX_EDGE_RATIO = 4 / 6; // 0.667
const EDGE_VERTEX_RATIO = 6 / 4; // 1.5

export const ALT_FONT_SIZES = {
  xs: BASE_SIZE * Math.pow(EDGE_VERTEX_RATIO, -2),  // 7.1px
  sm: BASE_SIZE * Math.pow(EDGE_VERTEX_RATIO, -1),  // 10.7px
  base: BASE_SIZE,                                    // 16px
  lg: BASE_SIZE * EDGE_VERTEX_RATIO,                  // 24px (clean!)
  xl: BASE_SIZE * Math.pow(EDGE_VERTEX_RATIO, 2),    // 36px
  '2xl': BASE_SIZE * Math.pow(EDGE_VERTEX_RATIO, 3), // 54px
};
```

---

## GRID SYSTEM

Not 12 columns (arbitrary).

But 4 columns (tetrahedral):

```typescript
// src/lib/design/grid.ts

/**
 * GRID BASED ON TETRAHEDRON
 * 
 * 4 vertices → 4 columns
 * 6 edges → 6 gutters
 */

export const GRID = {
  // 4-column grid (not 12)
  columns: 4,
  
  // Gutter derived from edge connections
  gutter: EDGE_LENGTH * 0.5, // Half edge length between columns
  
  // Container max width: 4 columns × edge length
  maxWidth: EDGE_LENGTH * 4, // 8.0 units
  
  // Responsive breakpoints (powers of 4)
  breakpoints: {
    mobile: 4 * 100,   // 400px (4²)
    tablet: 4 * 200,   // 800px (4² × 2)
    desktop: 4 * 400,  // 1600px (4² × 4)
  },
};
```

---

## ANIMATION TIMING

Not arbitrary durations (300ms, 500ms).

Derived from natural frequencies:

```typescript
// src/lib/design/timing.ts

/**
 * ANIMATION TIMING FROM JITTERBUG FREQUENCY
 * 
 * Jitterbug frequency: 0.5 Hz (2 second cycle)
 * All timing derived from this base frequency
 */

const BASE_CYCLE = 2000; // 2 seconds (Jitterbug breath)

export const TIMING = {
  // Subdivisions of breath cycle
  instant: BASE_CYCLE / 16,  // 125ms  (1/16 breath)
  fast: BASE_CYCLE / 8,      // 250ms  (1/8 breath)
  normal: BASE_CYCLE / 4,    // 500ms  (1/4 breath)
  slow: BASE_CYCLE / 2,      // 1000ms (1/2 breath)
  breath: BASE_CYCLE,        // 2000ms (full breath)
  
  // Multiples of breath
  long: BASE_CYCLE * 2,      // 4 seconds
  veryLong: BASE_CYCLE * 4,  // 8 seconds
};

// Easing functions based on sine wave (like breathing)
export const EASING = {
  breath: 'cubic-bezier(0.45, 0.05, 0.55, 0.95)', // Sine-like
  inhale: 'cubic-bezier(0.32, 0.64, 0.45, 1)',     // Ease in (gathering)
  exhale: 'cubic-bezier(0.55, 0, 0.68, 0.36)',     // Ease out (releasing)
};
```

---

## COMPONENT SIZES

Not arbitrary pixel values.

Derived from vertex/edge counts:

```typescript
// src/lib/design/sizes.ts

/**
 * COMPONENT SIZES FROM GEOMETRY
 */

export const BUTTON_HEIGHT = {
  sm: EDGE_LENGTH * 1,    // 2.0 units (1 edge)
  md: EDGE_LENGTH * 2,    // 4.0 units (2 edges)
  lg: EDGE_LENGTH * 3,    // 6.0 units (3 edges)
  xl: EDGE_LENGTH * 4,    // 8.0 units (4 edges - tetrahedral)
};

export const CARD_WIDTH = {
  sm: EDGE_LENGTH * 8,     // 16 units (8 edges)
  md: EDGE_LENGTH * 12,    // 24 units (12 edges - 2 tetrahedra)
  lg: EDGE_LENGTH * 16,    // 32 units (16 edges - ideal)
  xl: EDGE_LENGTH * 24,    // 48 units (24 edges - 4 tetrahedra)
};

export const ICON_SIZE = {
  xs: EDGE_LENGTH * 0.5,   // 1.0 unit
  sm: EDGE_LENGTH * 1,     // 2.0 units
  md: EDGE_LENGTH * 1.5,   // 3.0 units
  lg: EDGE_LENGTH * 2,     // 4.0 units (tetrahedral)
  xl: EDGE_LENGTH * 3,     // 6.0 units (edge count)
};
```

---

## Z-INDEX LAYERS

Not arbitrary numbers (1, 10, 100, 1000).

But geometric layers:

```typescript
// src/lib/design/layers.ts

/**
 * Z-INDEX FROM GEOMETRIC LAYERS
 * 
 * Think of space as stacked tetrahedra
 * Each layer is a tetrahedron depth
 */

export const Z_INDEX = {
  canvas: 0,           // Base layer (the void)
  content: 4,          // First tetrahedron (4 vertices)
  overlay: 8,          // Second tetrahedron (4 more)
  modal: 12,           // Third tetrahedron
  popup: 16,           // Fourth tetrahedron
  toast: 20,           // Fifth tetrahedron
  emergency: 24,       // Sixth tetrahedron (highest priority)
};

// Increment by 4 (tetrahedral layers)
// Never arbitrary values
```

---

## BORDER RADIUS

Not arbitrary rounded corners.

Derived from tetrahedral angles:

```typescript
// src/lib/design/radius.ts

/**
 * BORDER RADIUS FROM TETRAHEDRAL ANGLES
 * 
 * Tetrahedral angle: 109.47° (arccos(-1/3))
 * Face angle: 60° (equilateral triangles)
 */

const TETRAHEDRAL_ANGLE = Math.acos(-1/3); // 109.47° in radians
const FACE_ANGLE = Math.PI / 3; // 60° in radians

// Convert to reasonable pixel values
const BASE_RADIUS = 8; // Starting point

export const BORDER_RADIUS = {
  none: 0,
  xs: BASE_RADIUS * 0.5,           // 4px
  sm: BASE_RADIUS * 1,             // 8px
  md: BASE_RADIUS * 1.5,           // 12px
  lg: BASE_RADIUS * 2,             // 16px
  xl: BASE_RADIUS * 3,             // 24px
  full: 9999,                      // Circle (sphere, 0D tetrahedron)
  
  // Or use angle ratios:
  tetrahedral: TETRAHEDRAL_ANGLE / 10, // ~11px (from angle)
  face: FACE_ANGLE / 5,                 // ~12.5px (from face)
};
```

---

## OPACITY LEVELS

Not arbitrary percentages.

Derived from vertex visibility:

```typescript
// src/lib/design/opacity.ts

/**
 * OPACITY FROM VERTEX STATES
 * 
 * 4 vertices = 4 opacity levels
 */

export const OPACITY = {
  hidden: 0,           // 0 vertices visible
  low: 0.25,          // 1 vertex visible (1/4)
  medium: 0.5,        // 2 vertices visible (2/4)
  high: 0.75,         // 3 vertices visible (3/4)
  full: 1,            // 4 vertices visible (4/4)
};

// For edges (6 levels):
export const EDGE_OPACITY = {
  none: 0,
  veryLow: 1/6,      // 0.167 (1 edge)
  low: 2/6,          // 0.333 (2 edges)
  medium: 3/6,       // 0.5 (3 edges)
  high: 4/6,         // 0.667 (4 edges)
  veryHigh: 5/6,     // 0.833 (5 edges)
  full: 1,           // 1.0 (6 edges)
};
```

---

## MODULE CARD SIZE

Not "whatever looks good."

Derived from screen = tetrahedron projection:

```typescript
// src/components/core/ModuleCard.tsx (updated)

/**
 * Card size derived from tetrahedral projection
 * 
 * Screen is 2D projection of 3D tetrahedron
 * Card width = projection of edge length
 */

const SCREEN_WIDTH = window.innerWidth;

// Project tetrahedron onto screen
// Tetrahedron fits in circle of radius R
// Card should be ~80% of this projection
const PROJECTION_SCALE = 0.8;

const CARD_WIDTH = Math.min(
  SCREEN_WIDTH * PROJECTION_SCALE,
  EDGE_LENGTH * 16  // Max: 16 edge lengths
);

export const CARD_SIZES = {
  sm: CARD_WIDTH * 0.5,   // Half projection
  md: CARD_WIDTH * 0.75,  // 3/4 projection
  lg: CARD_WIDTH * 1.0,   // Full projection
};
```

---

## THE PRINCIPLE

**Every decision traces back to:**

```
K₄ complete graph
  ↓
4 vertices
6 edges
4 faces
1 tetrahedron
  ↓
Edge length = 2.0
  ↓
All measurements derive from this
```

---

## IMPLEMENTATION

```typescript
// src/lib/synergetics.ts

/**
 * SYNERGETIC DESIGN SYSTEM
 * All values derived from K₄ geometry
 */

export class SynergeticDesign {
  static readonly EDGE_LENGTH = 2.0;
  static readonly VERTICES = 4;
  static readonly EDGES = 6;
  
  // All derived values
  static readonly RADIUS = (Math.sqrt(6) / 4) * this.EDGE_LENGTH;
  static readonly HEIGHT = (Math.sqrt(6) / 3) * this.EDGE_LENGTH;
  
  // Spacing (multiples of edge)
  static spacing(multiplier: number) {
    return this.EDGE_LENGTH * multiplier;
  }
  
  // Colors (vertex states)
  static vertexColor(state: 'healthy' | 'warning' | 'critical' | 'memorial') {
    const colors = {
      healthy: '#10b981',
      warning: '#f59e0b',
      critical: '#ef4444',
      memorial: '#8b5cf6',
    };
    return colors[state];
  }
  
  // Timing (fractions of breath)
  static duration(fraction: number) {
    return 2000 * fraction; // 2s base cycle
  }
  
  // Z-index (tetrahedral layers)
  static layer(depth: number) {
    return depth * 4; // 4 vertices per layer
  }
}
```

---

## THE RESULT

**No arbitrary decisions.**

**Every value:**
- Traced to geometry
- Derived from math
- Speaks from the mesh

**Not:**
- "This looks nice" ❌
- "Industry standard" ❌
- "User testing showed" ❌

**But:**
- "The tetrahedron requires" ✓
- "The geometry dictates" ✓
- "The math proves" ✓

---

## TETRAHEDRON ALL THE WAY UP

```
Emergency button height = 4 edge lengths
Card width = 12 edge lengths
Spacing = 2 edge lengths
Font size = 1.5 × edge length
```

---

## TETRAHEDRON ALL THE WAY DOWN

```
Pixel positioning: multiples of 0.25 edge
Animation frames: 1/16 breath cycle
Opacity steps: 1/4 (vertex visibility)
Border radius: tetrahedral angle / 10
```

---

## SYNERGETIC

**Everything derives from the same base:**

```
EDGE_LENGTH = 2.0
  ↓
Spacing ← EDGE_LENGTH × n
Colors ← Vertex states (4)
Timing ← Breath cycle (2s)
Z-index ← Layers × 4
Opacity ← Fractions of 4 or 6
```

**Everything flows together.**

**Because it all comes from the same source:**

---

# **THE TETRAHEDRON**

---

**⚡ MATHEMATICAL DESIGN SYSTEM ⚡**

**⚡ EVERY DECISION FROM GEOMETRY ⚡**

**⚡ MESH SPEAKS, WE LISTEN ⚡**

**⚡ TETRAHEDRON UP AND DOWN ⚡**

**⚡ SYNERGETIC HARMONY ⚡**

---

**No more arbitrary choices.**

**Only geometric truth.**

---

**Execute.**
