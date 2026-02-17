# OPERATION: UNIFORMITY
## Global Theme Engine - Mathematical Visual Language

---

## THE ARCHITECT'S MANDATE

```
"Arbitrary design is entropy."
"Clashing styles are cognitive friction."
"For a neurodivergent mind, Consistency is Calm."
```

---

## THE SOLUTION

**Single Source of Truth:**
- ONE file defines ALL visual values
- NO arbitrary hex codes
- NO random margins
- SEMANTIC naming
- MATHEMATICAL spacing
- COGNITIVE EASE

---

## CURSOR PROMPT: UNIFORMITY

```
TASK: Implement complete theme uniformity system

PRIORITY: CRITICAL - Foundation for entire visual language

PHASE 1: Design Tokens (The DNA)

File: src/lib/theme/tokens.ts (NEW)

```typescript
/**
 * G.O.D. THEME TOKENS
 * 
 * The Single Source of Truth for all visual design.
 * 
 * RULES:
 * 1. These are the ONLY allowed values
 * 2. NO arbitrary hex codes in components
 * 3. Use semantic names (bg-surface, text-main)
 * 4. Update here to change entire app
 */

export const GOD_THEME = {
  // ===================
  // COLORS
  // ===================
  
  colors: {
    // THE VOID (Backgrounds)
    void: '#000000',        // Deepest black - space itself
    surface: '#09090b',     // Zinc-950 - card backgrounds
    surfaceDim: '#18181b',  // Zinc-900 - slightly lighter
    overlay: 'rgba(9, 9, 11, 0.8)', // Glassmorphism base
    
    // THE ENERGY (Actions/States)
    primary: '#06b6d4',     // Cyan-500 - systems nominal
    primaryDim: '#0e7490',  // Cyan-700 - subdued
    primaryGlow: '#a5f3fc', // Cyan-200 - highlights
    
    secondary: '#a855f7',   // Purple-500 - creation/forge
    secondaryDim: '#7e22ce', // Purple-700
    secondaryGlow: '#e9d5ff', // Purple-200
    
    alert: '#ef4444',       // Red-500 - critical/danger
    alertDim: '#b91c1c',    // Red-700
    alertGlow: '#fca5a5',   // Red-300
    
    success: '#22c55e',     // Green-500 - stable
    successDim: '#15803d',  // Green-700
    successGlow: '#86efac', // Green-300
    
    warning: '#eab308',     // Yellow-500 - caution
    warningDim: '#a16207',  // Yellow-700
    warningGlow: '#fde047', // Yellow-300
    
    // THE STRUCTURE (Borders/Lines)
    border: '#1e293b',      // Slate-800 - subtle containment
    borderDim: '#0f172a',   // Slate-900 - very subtle
    borderActive: '#06b6d4', // Cyan - focus state
    
    // THE DATA (Text)
    textMain: '#f8fafc',    // Slate-50 - high legibility
    textMuted: '#94a3b8',   // Slate-400 - low visual noise
    textDim: '#475569',     // Slate-600 - watermarks
  },
  
  // ===================
  // SPACING (The Rhythm)
  // 4px Grid System
  // ===================
  
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  
  // ===================
  // RADIUS (The Geometry)
  // ===================
  
  radius: {
    none: '0',
    sm: '0.25rem',   // 4px - sharp/technical
    md: '0.5rem',    // 8px - standard UI
    lg: '1rem',      // 16px - containers
    xl: '1.5rem',    // 24px - large cards
    full: '9999px',  // Orbs/buttons
  },
  
  // ===================
  // SHADOWS
  // ===================
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.5)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    
    // Glow effects
    glowPrimary: '0 0 20px rgba(6, 182, 212, 0.3)',
    glowAlert: '0 0 20px rgba(239, 68, 68, 0.3)',
    glowSuccess: '0 0 20px rgba(34, 197, 94, 0.3)',
  },
  
  // ===================
  // MOTION (The Physics)
  // ===================
  
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  // ===================
  // TYPOGRAPHY
  // ===================
  
  fontSize: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    black: '900',
  },
  
  // ===================
  // Z-INDEX (The Layers)
  // ===================
  
  zIndex: {
    canvas: 0,
    content: 10,
    overlay: 20,
    modal: 30,
    toast: 40,
    debug: 50,
  },
};

// Export individual sections for convenience
export const COLORS = GOD_THEME.colors;
export const SPACING = GOD_THEME.spacing;
export const RADIUS = GOD_THEME.radius;
export const SHADOWS = GOD_THEME.shadows;
export const TRANSITION = GOD_THEME.transition;
```

---

PHASE 2: Tailwind Configuration (The Bridge)

File: tailwind.config.ts

REPLACE ENTIRE FILE:

```typescript
import type { Config } from "tailwindcss";
import { GOD_THEME } from "./src/lib/theme/tokens";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ===================
      // COLORS (Semantic)
      // ===================
      colors: {
        // Backgrounds
        void: GOD_THEME.colors.void,
        surface: GOD_THEME.colors.surface,
        'surface-dim': GOD_THEME.colors.surfaceDim,
        overlay: GOD_THEME.colors.overlay,
        
        // Brand
        primary: {
          DEFAULT: GOD_THEME.colors.primary,
          dim: GOD_THEME.colors.primaryDim,
          glow: GOD_THEME.colors.primaryGlow,
        },
        secondary: {
          DEFAULT: GOD_THEME.colors.secondary,
          dim: GOD_THEME.colors.secondaryDim,
          glow: GOD_THEME.colors.secondaryGlow,
        },
        
        // States
        alert: {
          DEFAULT: GOD_THEME.colors.alert,
          dim: GOD_THEME.colors.alertDim,
          glow: GOD_THEME.colors.alertGlow,
        },
        success: {
          DEFAULT: GOD_THEME.colors.success,
          dim: GOD_THEME.colors.successDim,
          glow: GOD_THEME.colors.successGlow,
        },
        warning: {
          DEFAULT: GOD_THEME.colors.warning,
          dim: GOD_THEME.colors.warningDim,
          glow: GOD_THEME.colors.warningGlow,
        },
        
        // Structure
        'border-base': GOD_THEME.colors.border,
        'border-dim': GOD_THEME.colors.borderDim,
        'border-active': GOD_THEME.colors.borderActive,
        
        // Text
        'text-main': GOD_THEME.colors.textMain,
        'text-muted': GOD_THEME.colors.textMuted,
        'text-dim': GOD_THEME.colors.textDim,
      },
      
      // ===================
      // SPACING
      // ===================
      spacing: GOD_THEME.spacing,
      
      // ===================
      // BORDER RADIUS
      // ===================
      borderRadius: GOD_THEME.radius,
      
      // ===================
      // BOX SHADOW
      // ===================
      boxShadow: {
        'glow-primary': GOD_THEME.shadows.glowPrimary,
        'glow-alert': GOD_THEME.shadows.glowAlert,
        'glow-success': GOD_THEME.shadows.glowSuccess,
      },
      
      // ===================
      // ANIMATIONS
      // ===================
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'breathe': 'breathe 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      
      // ===================
      // TRANSITION
      // ===================
      transitionDuration: {
        'fast': '150ms',
        'normal': '300ms',
        'slow': '500ms',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
```

---

PHASE 3: Theme Engine (The Enforcer)

File: src/components/layout/ThemeEngine.tsx (NEW)

```typescript
'use client';

import { useEffect } from 'react';
import { GOD_THEME } from '@/lib/theme/tokens';

export function ThemeEngine({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    
    // INJECT DNA INTO CSS VARIABLES
    // This allows Three.js, Framer Motion, and CSS modules to stay synced
    
    // Colors
    Object.entries(GOD_THEME.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    // Spacing
    Object.entries(GOD_THEME.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    
    // Radius
    Object.entries(GOD_THEME.radius).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
    
    // Shadows
    Object.entries(GOD_THEME.shadows).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
    
    // Transition
    Object.entries(GOD_THEME.transition).forEach(([key, value]) => {
      root.style.setProperty(`--transition-${key}`, value);
    });
    
    // FORCE DARK MODE (Constitutional Requirement)
    root.classList.add('dark');
    root.style.colorScheme = 'dark';
    
    console.log('✅ Theme Engine initialized');
  }, []);
  
  return <>{children}</>;
}
```

---

PHASE 4: Update Layout

File: src/app/layout.tsx

ADD ThemeEngine wrapper:

```typescript
import { ThemeEngine } from '@/components/layout/ThemeEngine';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-void text-text-main overflow-x-hidden">
        <ThemeEngine>
          <CanvasKeyProvider>
            {/* Canvas Layer */}
            <div className="fixed inset-0 z-canvas pointer-events-auto">
              <CanvasLayer />
            </div>
            
            {/* Content Layer */}
            <div className="relative z-content pointer-events-none">
              <div className="pointer-events-auto">
                {children}
              </div>
            </div>
            
            {/* Debug */}
            <LayoutDebug />
          </CanvasKeyProvider>
        </ThemeEngine>
      </body>
    </html>
  );
}
```

---

PHASE 5: Example Refactor (ModuleCard)

File: src/components/ui/ModuleCard.tsx

BEFORE (Chaotic):
```typescript
<div className="bg-gray-900 border border-gray-700 text-white p-6 rounded-lg">
```

AFTER (Semantic):
```typescript
<div className="bg-surface/80 border border-border-base text-text-main p-lg rounded-lg">
```

COMPLETE REFACTOR:

```typescript
'use client';

import React, { ReactNode } from 'react';

interface ModuleCardProps {
  title: string;
  subtitle: string;
  icon: string;
  children: ReactNode;
  accent?: 'primary' | 'secondary' | 'alert' | 'success' | 'warning';
}

export function ModuleCard({ 
  title, 
  subtitle, 
  icon, 
  children,
  accent = 'primary' 
}: ModuleCardProps) {
  const accentColor = {
    primary: 'border-primary/50 shadow-glow-primary',
    secondary: 'border-secondary/50',
    alert: 'border-alert/50 shadow-glow-alert',
    success: 'border-success/50 shadow-glow-success',
    warning: 'border-warning/50',
  }[accent];
  
  return (
    <div className={`
      h-fit w-full p-lg
      bg-surface/80 backdrop-blur-md
      border border-border-base
      rounded-xl shadow-lg
      transition-all duration-normal
      hover:${accentColor}
    `}>
      {/* Header */}
      <div className="
        flex items-center justify-between
        border-b border-border-base
        pb-md mb-md
        shrink-0
      ">
        <div className="flex items-center gap-md">
          <span className={`
            text-3xl
            text-${accent}
            drop-shadow-[0_0_8px_var(--color-${accent})]
          `}>
            {icon}
          </span>
          
          <div>
            <h2 className="text-xl font-bold text-text-main tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-text-muted font-mono uppercase tracking-wider">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="text-text-muted">
        {children}
      </div>
    </div>
  );
}
```

---

PHASE 6: Update Three.js Materials

File: src/components/canvas/Vertex.tsx

USE CSS variables in Three.js:

```typescript
// Get colors from CSS variables
const getPrimaryColor = () => {
  if (typeof window === 'undefined') return '#06b6d4';
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--color-primary')
    .trim();
};

// Use in material
<MeshDistortMaterial
  color={isLocked ? '#333333' : getPrimaryColor()}
  emissive={getPrimaryColor()}
  // ...
/>
```

---

PHASE 7: Refactoring Guide

CREATE: src/docs/REFACTORING-GUIDE.md

```markdown
# Theme Refactoring Guide

## The Rules

1. **NO arbitrary hex codes** - Use tokens only
2. **NO arbitrary spacing** - Use spacing scale (xs/sm/md/lg/xl)
3. **NO custom colors** - Use semantic names
4. **NO inline styles** - Use Tailwind classes

## Color Migration

| Old (Bad) | New (Good) |
|-----------|------------|
| `bg-black` | `bg-void` |
| `bg-gray-900` | `bg-surface` |
| `bg-gray-800` | `bg-surface-dim` |
| `text-white` | `text-text-main` |
| `text-gray-400` | `text-text-muted` |
| `text-gray-600` | `text-text-dim` |
| `border-gray-700` | `border-border-base` |
| `border-cyan-500` | `border-primary` |

## Spacing Migration

| Old (Bad) | New (Good) |
|-----------|------------|
| `p-2` | `p-sm` |
| `p-4` | `p-md` |
| `p-6` | `p-lg` |
| `gap-4` | `gap-md` |
| `mb-8` | `mb-xl` |

## Component Checklist

For each component:

- [ ] Replace all arbitrary colors
- [ ] Replace all arbitrary spacing
- [ ] Use semantic class names
- [ ] Remove inline styles
- [ ] Test in dark mode
- [ ] Verify hover states
- [ ] Check focus states
```

---

TESTING CHECKLIST:

**Theme Engine:**
[ ] CSS variables injected
[ ] Accessible via getComputedStyle()
[ ] Three.js can read colors
[ ] Framer Motion can read values
[ ] Dark mode forced

**Tailwind:**
[ ] bg-surface works
[ ] text-text-main works
[ ] border-border-base works
[ ] p-lg works (spacing)
[ ] rounded-lg works (radius)
[ ] shadow-glow-primary works

**Visual Consistency:**
[ ] All backgrounds use void/surface
[ ] All text uses text-main/muted/dim
[ ] All borders use border-base
[ ] All buttons use primary/secondary
[ ] All alerts use alert/success/warning
[ ] No arbitrary colors anywhere

**Component Refactors:**
[ ] ModuleCard uses theme
[ ] Buttons use theme
[ ] Cards use theme
[ ] Modals use theme
[ ] Forms use theme
[ ] Navigation uses theme

---

BENEFITS:

✅ **Cognitive Ease:** Learn once, apply everywhere
✅ **Self-Healing:** Change one value, update entire app
✅ **Type Safety:** Tokens are importable TypeScript
✅ **Visual Silence:** Consistent, calm, predictable
✅ **Semantic Meaning:** Colors have PURPOSE
✅ **Mathematical Spacing:** 4px grid enforced
✅ **Three.js Sync:** CSS variables bridge to WebGL
✅ **Future-Proof:** Easy to add themes later

---

EXECUTE THIS PROMPT NOW.

Create theme tokens.
Bridge to Tailwind.
Inject via ThemeEngine.
Refactor all components.
Achieve uniformity.
```

---

**⚡ OPERATION: UNIFORMITY ⚡**
