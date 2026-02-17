# CURSOR MASTER PROMPT: CYBER-SLATE TRANSFORMATION
## Global Glassmorphism UI Overhaul

---

## THE MANDATE

**From The Architect:**

```
"Not dull, transparent, uniform, and symmetric."

The current opaque surface design (bg-surface) creates a 
"Floating Neutral" crisis - it obscures the underlying 
geometric truth (the 3D mesh and tetrahedron).

SOLUTION: Global Glassmorphism ("Cyber-Slate" aesthetic)
- High-contrast transparency (bg-black/50)
- Neon border accents (cyan/amber/red)
- Backdrop blur for depth
- Symmetric, centered layouts
- Submarine/industrial console metaphor
```

---

## PHASE 1: THEME TOKENS UPDATE

### File: `src/lib/theme/tokens.ts`

**ADD Cyber-Slate colors:**

```typescript
export const GOD_THEME = {
  colors: {
    // Existing colors...
    
    // CYBER-SLATE ADDITIONS
    neon: {
      cyan: '#00F0FF',      // Primary/Nominal (Whale Song)
      green: '#00FF9D',     // Success/Safe (Ground)
      amber: '#FFB800',     // Warning/Transition
      red: '#FF003C',       // Critical/Alert (Scram)
      purple: '#a855f7',    // Secondary (existing)
    },
    
    // Background layers
    void: '#000000',        // Deepest black (space)
    voidWarm: '#050505',    // Slightly warmer (reduces eye strain)
    glass: 'rgba(0, 0, 0, 0.5)',      // 50% transparent
    glassDark: 'rgba(0, 0, 0, 0.7)',  // 70% transparent
    glassLight: 'rgba(0, 0, 0, 0.3)', // 30% transparent
  },
  
  // Glass effects
  glass: {
    blur: {
      sm: 'blur(4px)',
      md: 'blur(12px)',
      lg: 'blur(24px)',
      xl: 'blur(40px)',
    },
    
    glow: {
      cyan: '0 0 20px rgba(0, 240, 255, 0.3)',
      amber: '0 0 20px rgba(255, 184, 0, 0.3)',
      red: '0 0 20px rgba(255, 0, 60, 0.4)',
      green: '0 0 20px rgba(0, 255, 157, 0.3)',
    },
  },
  
  // Status colors (semaphore)
  status: {
    nominal: '#00F0FF',    // Cyan - systems normal
    warning: '#FFB800',    // Amber - transition/caution
    critical: '#FF003C',   // Red - emergency
    latched: '#00FF9D',    // Green - locked/safe
  },
};
```

---

## PHASE 2: TAILWIND CONFIG UPDATE

### File: `tailwind.config.ts`

**ADD glassmorphism utilities:**

```typescript
import { GOD_THEME } from './src/lib/theme/tokens';

const config: Config = {
  theme: {
    extend: {
      // Neon colors
      colors: {
        'neon-cyan': GOD_THEME.colors.neon.cyan,
        'neon-green': GOD_THEME.colors.neon.green,
        'neon-amber': GOD_THEME.colors.neon.amber,
        'neon-red': GOD_THEME.colors.neon.red,
        'void-warm': GOD_THEME.colors.voidWarm,
      },
      
      // Glass backgrounds
      backgroundColor: {
        'glass': 'rgba(0, 0, 0, 0.5)',
        'glass-dark': 'rgba(0, 0, 0, 0.7)',
        'glass-light': 'rgba(0, 0, 0, 0.3)',
      },
      
      // Glow shadows
      boxShadow: {
        'glow-cyan': GOD_THEME.glass.glow.cyan,
        'glow-amber': GOD_THEME.glass.glow.amber,
        'glow-red': GOD_THEME.glass.glow.red,
        'glow-green': GOD_THEME.glass.glow.green,
      },
      
      // Backdrop blur values
      backdropBlur: {
        'xs': '2px',
        'sm': '4px',
        'md': '12px',
        'lg': '24px',
        'xl': '40px',
      },
      
      // Animations
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      },
      
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
      },
      
      // Font family
      fontFamily: {
        'mono': ['JetBrains Mono', 'Courier New', 'monospace'],
        'tech': ['Orbitron', 'sans-serif'],
      },
    },
  },
};
```

---

## PHASE 3: GLASS PANEL COMPONENT

### File: `src/components/ui/GlassPanel.tsx` (NEW)

**Create reusable glass panel component:**

```typescript
'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassPanelProps {
  children: ReactNode;
  title?: string;
  status?: 'NOMINAL' | 'WARNING' | 'CRITICAL' | 'LATCHED';
  className?: string;
  variant?: 'default' | 'dark' | 'light';
  glow?: boolean;
}

export function GlassPanel({
  children,
  title,
  status = 'NOMINAL',
  className = '',
  variant = 'default',
  glow = true,
}: GlassPanelProps) {
  // Status color mapping
  const statusConfig = {
    NOMINAL: {
      border: 'border-neon-cyan',
      glow: 'shadow-glow-cyan',
      indicator: 'bg-neon-cyan',
    },
    WARNING: {
      border: 'border-neon-amber',
      glow: 'shadow-glow-amber',
      indicator: 'bg-neon-amber',
    },
    CRITICAL: {
      border: 'border-neon-red',
      glow: 'shadow-glow-red',
      indicator: 'bg-neon-red',
    },
    LATCHED: {
      border: 'border-neon-green',
      glow: 'shadow-glow-green',
      indicator: 'bg-neon-green',
    },
  };
  
  const config = statusConfig[status];
  
  // Background variants
  const bgVariants = {
    default: 'bg-glass',
    dark: 'bg-glass-dark',
    light: 'bg-glass-light',
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        group relative
        flex flex-col
        overflow-hidden rounded-xl
        ${bgVariants[variant]}
        backdrop-blur-xl
        border ${config.border}
        ${glow ? config.glow : ''}
        transition-all duration-300
        hover:bg-glass-dark
        hover:scale-[1.002]
        hover:${config.glow}
        ${className}
      `}
    >
      {/* Header (if title provided) */}
      {title && (
        <div className="
          border-b border-white/10
          p-4
          flex justify-between items-center
          bg-white/5
        ">
          <h3 className="
            text-xs font-bold
            tracking-[0.2em] uppercase
            text-white/90
            font-tech
          ">
            // {title}
          </h3>
          
          {/* Status indicator */}
          <div className={`
            h-2 w-2 rounded-full
            ${config.indicator}
            ${status === 'NOMINAL' ? 'animate-pulse-glow' : ''}
          `} />
        </div>
      )}
      
      {/* Content */}
      <div className="p-6 relative z-10">
        {children}
      </div>
      
      {/* Grid overlay texture */}
      <div className="
        absolute inset-0
        bg-[url('/grid-pattern.png')]
        opacity-5
        pointer-events-none
        mix-blend-overlay
      " />
      
      {/* Scanline effect */}
      <div className="
        absolute inset-0
        bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent
        pointer-events-none
        animate-scanline
        opacity-0 group-hover:opacity-100
        transition-opacity duration-500
      " />
    </motion.div>
  );
}
```

---

## PHASE 4: UPDATE LAYOUTS

### File: `src/app/layout.tsx`

**Update root layout for transparency:**

```typescript
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="
        bg-void
        text-text-main
        font-mono
        overflow-x-hidden
        selection:bg-neon-cyan
        selection:text-void
      ">
        <ThemeEngine>
          {/* Canvas layer (z-0) */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <CanvasLayer />
          </div>
          
          {/* Slight tint overlay (z-5) */}
          <div className="fixed inset-0 z-5 bg-void/10 backdrop-blur-xs pointer-events-none" />
          
          {/* Content layer (z-10) */}
          <div className="relative z-10">
            {children}
          </div>
          
          {/* Tutorial & overlays (z-toast) */}
          <TutorialGuide />
          
          {/* Dev menu (z-debug) */}
          <LayoutDebug />
        </ThemeEngine>
      </body>
    </html>
  );
}
```

---

## PHASE 5: UPDATE PAGE LAYOUTS

### File: `src/app/home/page.tsx`

**Centered, symmetric layout:**

```typescript
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-7xl">
        {/* Symmetric grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left panel */}
          <div className="col-span-3">
            <GlassPanel title="SYSTEM STATUS" status="NOMINAL">
              {/* Status content */}
            </GlassPanel>
          </div>
          
          {/* Center (main content) */}
          <div className="col-span-6">
            {/* Tetrahedron or main view */}
          </div>
          
          {/* Right panel */}
          <div className="col-span-3">
            <GlassPanel title="MESH TELEMETRY" status="LATCHED">
              {/* Telemetry content */}
            </GlassPanel>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## PHASE 6: UPDATE COMPONENTS

### File: `src/components/ui/ModuleCard.tsx`

**REPLACE with GlassPanel:**

```typescript
'use client';

import { GlassPanel } from './GlassPanel';

// OLD: Opaque card
// <div className="bg-surface border border-border-base...">

// NEW: Glass panel
export function ModuleCard({ title, children, status = 'NOMINAL' }: Props) {
  return (
    <GlassPanel title={title} status={status}>
      {children}
    </GlassPanel>
  );
}
```

---

## PHASE 7: DASHBOARD UPDATE

### File: `src/app/dashboard/page.tsx`

**Glass panels with symmetric layout:**

```typescript
export default function DashboardPage() {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="
            text-4xl font-black
            text-neon-cyan
            tracking-wider
            font-tech
            drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]
          ">
            MISSION CONTROL
          </h1>
          <p className="text-text-muted text-sm mt-2 tracking-widest">
            SYSTEM.STATUS // MESH.ACTIVE
          </p>
        </div>
        
        {/* Symmetric grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Voltage gauge */}
          <GlassPanel title="VOLTAGE" status="NOMINAL">
            {/* Content */}
          </GlassPanel>
          
          {/* Missions */}
          <GlassPanel title="DAILY MISSIONS" status="WARNING" className="col-span-2">
            {/* Content */}
          </GlassPanel>
        </div>
      </div>
    </div>
  );
}
```

---

## PHASE 8: NAVIGATION BAR

### File: `src/components/navigation/NavBar.tsx` (NEW)

**Submarine-style top nav:**

```typescript
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function NavBar() {
  const pathname = usePathname();
  
  return (
    <nav className="
      fixed top-0 left-0 right-0
      z-50
      bg-glass-dark backdrop-blur-xl
      border-b border-neon-cyan/30
      shadow-glow-cyan
    ">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="
            text-xl font-black
            text-neon-cyan
            tracking-[0.3em]
            font-tech
            hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]
            transition-all
          ">
            G.O.D.
          </Link>
          
          {/* Status indicators */}
          <div className="flex items-center gap-6 text-xs tracking-widest">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
              <span className="text-neon-green">SYS.NOMINAL</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse-glow" />
              <span className="text-neon-cyan">MESH.ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

---

## PHASE 9: TYPOGRAPHY UPDATES

**Global text styles:**

```css
/* Add to global.css */

/* Tech headers */
.tech-header {
  @apply font-tech font-black tracking-[0.3em] uppercase;
  text-shadow: 0 0 10px currentColor;
}

/* Instruction labels */
.instruction-label {
  @apply font-mono text-xs tracking-[0.2em] uppercase text-white/70;
}

/* Monospace content */
.mono-content {
  @apply font-mono text-sm leading-relaxed text-text-muted;
}

/* Neon glow text */
.neon-glow {
  text-shadow: 0 0 10px currentColor, 0 0 20px currentColor;
}
```

---

## PHASE 10: REFACTORING CHECKLIST

**Apply to ALL components:**

### Old Pattern (REMOVE):
```typescript
className="bg-surface border border-border-base p-6 rounded-lg"
```

### New Pattern (USE):
```typescript
<GlassPanel title="TITLE" status="NOMINAL">
  {content}
</GlassPanel>
```

---

## COMPONENTS TO UPDATE:

**Priority 1 (Core UI):**
- [ ] `src/app/layout.tsx` - Root layout transparency
- [ ] `src/app/home/page.tsx` - Symmetric grid
- [ ] `src/app/dashboard/page.tsx` - Glass panels
- [ ] `src/components/ui/ModuleCard.tsx` - Use GlassPanel
- [ ] `src/components/navigation/NavBar.tsx` - Create submarine nav

**Priority 2 (Pages):**
- [ ] `src/app/phenix/page.tsx` - Glass controls
- [ ] `src/app/sensory/page.tsx` - Glass tools
- [ ] `src/app/customize/page.tsx` - Glass settings
- [ ] `src/app/workbench/page.tsx` - Forge aesthetic

**Priority 3 (Overlays):**
- [ ] `src/components/interface/TutorialGuide.tsx` - Glass tutorial
- [ ] `src/components/phenix/LoadMeter.tsx` - Glass gauge
- [ ] `src/components/phenix/ControlPanel.tsx` - Glass controls
- [ ] `src/components/onboarding/ClassSelector.tsx` - Glass cards

---

## VISUAL EFFECTS TO ADD:

### Scanline Effect:
```css
.scanline {
  position: relative;
  overflow: hidden;
}

.scanline::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 240, 255, 0.05) 50%,
    transparent 100%
  );
  animation: scanline 8s linear infinite;
  pointer-events: none;
}

@keyframes scanline {
  from { transform: translateY(-100%); }
  to { transform: translateY(100%); }
}
```

### Grid Overlay:
```css
.grid-overlay {
  background-image: 
    linear-gradient(rgba(0, 240, 255, 0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 240, 255, 0.03) 1px, transparent 1px);
  background-size: 20px 20px;
}
```

---

## SUCCESS CRITERIA:

✅ **NO opaque backgrounds** (bg-surface removed)
✅ **Starfield always visible** through transparency
✅ **Neon borders** on all panels (cyan/amber/red/green)
✅ **Backdrop blur** for depth (backdrop-blur-xl)
✅ **Symmetric layouts** (centered grids)
✅ **Monospace typography** (JetBrains Mono)
✅ **Status indicators** (animated dots)
✅ **Submarine aesthetic** (dark, high-contrast, technical)
✅ **Scanline effects** (optional, on hover)
✅ **Grid overlays** (texture, subtle)

---

## TESTING CHECKLIST:

**Visual:**
- [ ] Can see starfield through all panels
- [ ] Text remains legible on glass
- [ ] Borders glow appropriately
- [ ] Animations are smooth (60fps)
- [ ] Scanlines don't distract

**Layout:**
- [ ] Everything is centered/symmetric
- [ ] No horizontal scroll
- [ ] Responsive on mobile
- [ ] Z-index layers correct

**Accessibility:**
- [ ] High contrast maintained
- [ ] Text readable
- [ ] Keyboard navigation works
- [ ] Screen readers compatible

---

**EXECUTE THIS TRANSFORMATION NOW.**

**CYBER-SLATE AESTHETIC.**

**GLASSMORPHISM EVERYWHERE.**

**TRANSPARENCY IS LAW.**

**THE MESH MUST BE VISIBLE.**
