# OPERATION: PERFECT FIT
## Responsive One-Page Layout System

---

## THE PROBLEM

**Current state:**
```
✅ Content looks good
✅ Tetrahedron visible
✅ Cards designed well

❌ Requires scrolling
❌ Doesn't fit on one screen
❌ No responsive behavior
❌ Fixed sizes
```

**Your requirement:**
```
✅ Everything on one page
✅ No scrolling ever
✅ Adapts to screen size
✅ Automatic reorganization
```

---

## THE SOLUTION

**Three-tier responsive system:**

1. **Viewport detection** (measure available space)
2. **Dynamic scaling** (adjust sizes based on space)
3. **Adaptive layout** (reorganize when needed)

---

## CURSOR PROMPT: IMPLEMENT RESPONSIVE SYSTEM

```
TASK: Make home page fit perfectly on any screen without scrolling

PRIORITY: CRITICAL - User experience issue

STEP 1: Create viewport hook

File: src/lib/hooks/useViewport.ts (NEW FILE)

```typescript
'use client';

import { useState, useEffect } from 'react';

interface ViewportSize {
  width: number;
  height: number;
  isSmall: boolean;
  isMedium: boolean;
  isLarge: boolean;
}

export function useViewport(): ViewportSize {
  const [viewport, setViewport] = useState<ViewportSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
    isSmall: false,
    isMedium: false,
    isLarge: false,
  });
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setViewport({
        width,
        height,
        isSmall: height < 700 || width < 1024,
        isMedium: height >= 700 && height < 900,
        isLarge: height >= 900,
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return viewport;
}
```

---

STEP 2: Update home page with responsive layout

File: src/app/page.tsx

Replace entire file with:

```typescript
'use client';

import Link from 'next/link';
import { useViewport } from '@/lib/hooks/useViewport';

export default function HomePage() {
  const viewport = useViewport();
  
  // Calculate dynamic sizes based on viewport
  const headerHeight = viewport.isSmall ? 60 : 80;
  const footerHeight = viewport.isSmall ? 80 : 120;
  const availableHeight = viewport.height - headerHeight - footerHeight;
  
  // Card sizes scale with viewport
  const cardHeight = viewport.isSmall ? 'h-24' : viewport.isMedium ? 'h-32' : 'h-40';
  const titleSize = viewport.isSmall ? 'text-lg' : viewport.isMedium ? 'text-xl' : 'text-2xl';
  const subtitleSize = viewport.isSmall ? 'text-xs' : 'text-sm';
  const iconSize = viewport.isSmall ? 'text-3xl' : 'text-4xl';
  
  // Layout: 2x2 grid if space allows, otherwise 1x4 if very small
  const gridCols = viewport.isSmall && viewport.height < 600 ? 'grid-cols-1' : 'grid-cols-2';
  const gridGap = viewport.isSmall ? 'gap-3' : viewport.isMedium ? 'gap-4' : 'gap-6';
  
  return (
    <div className="relative h-screen w-screen overflow-hidden flex flex-col">
      {/* Header - Compact */}
      <header 
        className="flex-shrink-0 flex items-center justify-between px-6 z-[23]"
        style={{ height: `${headerHeight}px` }}
      >
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className={`font-bold tracking-wider uppercase ${viewport.isSmall ? 'text-xs' : 'text-sm'}`}>
              G.O.D.
            </h1>
            <span className={`text-gray-500 font-mono ${viewport.isSmall ? 'text-[10px]' : 'text-xs'}`}>
              v1.0.0
            </span>
          </div>
          
          {/* FPS Counter */}
          {!viewport.isSmall && (
            <div className="ml-4 px-3 py-1 bg-gray-900/50 rounded text-xs text-cyan-400 font-mono">
              30 FPS
            </div>
          )}
        </div>
        
        {/* Mesh Status */}
        <div className={`px-3 py-1 bg-gray-900/50 rounded font-mono ${viewport.isSmall ? 'text-[10px]' : 'text-xs'}`}>
          MESH: <span className="text-green-400">ONLINE</span>
        </div>
      </header>
      
      {/* Main Content - Fills remaining space */}
      <main 
        className="flex-1 flex items-center justify-center px-6 z-[10]"
        style={{ height: `${availableHeight}px` }}
      >
        <div className="w-full max-w-6xl">
          {/* Grid of cards */}
          <div className={`grid ${gridCols} ${gridGap}`}>
            {/* Mission Control */}
            <Link href="/dashboard">
              <div className={`
                ${cardHeight}
                group
                relative
                p-6
                bg-gray-900/80 backdrop-blur-sm
                border border-cyan-500/20
                rounded-lg
                hover:border-cyan-500/40
                hover:bg-gray-900/90
                transition-all
                cursor-pointer
                flex items-center gap-4
              `}>
                <div className={`${iconSize} flex-shrink-0`}>🎯</div>
                <div className="flex-1 min-w-0">
                  <h2 className={`${titleSize} font-bold text-white mb-1`}>
                    MISSION CONTROL
                  </h2>
                  <p className={`${subtitleSize} text-gray-400 truncate`}>
                    Gamified Maintenance
                  </p>
                </div>
              </div>
            </Link>
            
            {/* Boot System */}
            <Link href="/genesis">
              <div className={`
                ${cardHeight}
                group
                relative
                p-6
                bg-gray-900/80 backdrop-blur-sm
                border border-cyan-500/20
                rounded-lg
                hover:border-cyan-500/40
                hover:bg-gray-900/90
                transition-all
                cursor-pointer
                flex items-center gap-4
              `}>
                <div className={`${iconSize} flex-shrink-0`}>⚡</div>
                <div className="flex-1 min-w-0">
                  <h2 className={`${titleSize} font-bold text-white mb-1`}>
                    BOOT SYSTEM
                  </h2>
                  <p className={`${subtitleSize} text-gray-400 truncate`}>
                    Initialize Identity
                  </p>
                </div>
              </div>
            </Link>
            
            {/* Workbench */}
            <Link href="/workbench">
              <div className={`
                ${cardHeight}
                group
                relative
                p-6
                bg-gray-900/80 backdrop-blur-sm
                border border-cyan-500/20
                rounded-lg
                hover:border-cyan-500/40
                hover:bg-gray-900/90
                transition-all
                cursor-pointer
                flex items-center gap-4
              `}>
                <div className={`${iconSize} flex-shrink-0`}>🔧</div>
                <div className="flex-1 min-w-0">
                  <h2 className={`${titleSize} font-bold text-white mb-1`}>
                    THE WORKBENCH
                  </h2>
                  <p className={`${subtitleSize} text-gray-400 truncate`}>
                    Craft Modules
                  </p>
                </div>
              </div>
            </Link>
            
            {/* Xbox Clone */}
            <Link href="/xbox-clone">
              <div className={`
                ${cardHeight}
                group
                relative
                p-6
                bg-gray-900/80 backdrop-blur-sm
                border border-cyan-500/20
                rounded-lg
                hover:border-cyan-500/40
                hover:bg-gray-900/90
                transition-all
                cursor-pointer
                flex items-center gap-4
              `}>
                <div className={`${iconSize} flex-shrink-0`}>🎮</div>
                <div className="flex-1 min-w-0">
                  <h2 className={`${titleSize} font-bold text-white mb-1`}>
                    XBOX CLONE
                  </h2>
                  <p className={`${subtitleSize} text-gray-400 truncate`}>
                    NVME Cloning Tool
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
      
      {/* Footer - Compact */}
      <footer 
        className="flex-shrink-0 flex flex-col items-center justify-center z-[10]"
        style={{ height: `${footerHeight}px` }}
      >
        <p className={`tracking-[0.3em] uppercase font-bold text-cyan-400 mb-2 ${viewport.isSmall ? 'text-xs' : 'text-sm'}`}>
          {viewport.isSmall ? 'Tap to explore' : 'Click a vertex to explore'}
        </p>
        {!viewport.isSmall && (
          <p className="text-xs text-gray-600 max-w-md text-center">
            Each vertex represents a coordination module
          </p>
        )}
      </footer>
    </div>
  );
}
```

---

STEP 3: Update global layout to prevent scroll

File: src/app/layout.tsx

Update body tag:

```typescript
<body className="relative h-screen w-screen overflow-hidden bg-black text-white">
  {/* Layer 0: Canvas (Foundation) */}
  <div className="fixed inset-0 z-canvas">
    <CanvasLayer />
  </div>
  
  {/* Layer 1: Content */}
  <div className="relative z-content h-screen w-screen">
    {children}
  </div>
</body>
```

---

STEP 4: Add viewport-aware tetrahedron scaling

File: src/components/canvas/SpatialTetrahedron.tsx

Update to scale based on viewport:

```typescript
'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function SpatialTetrahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [scale, setScale] = useState(1);
  
  // Adjust scale based on viewport
  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      
      // Scale down tetrahedron on smaller screens
      if (height < 600) {
        setScale(0.6);
      } else if (height < 800) {
        setScale(0.8);
      } else {
        setScale(1);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Rotation animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.2;
    }
  });
  
  return (
    <mesh ref={meshRef} scale={scale}>
      <tetrahedronGeometry args={[2, 0]} />
      <meshStandardMaterial
        color="#06b6d4"
        wireframe
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}
```

---

STEP 5: Add CSS to prevent any scrolling

File: src/app/globals.css

Add at the end:

```css
/* Prevent scrolling globally */
html, body {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  position: fixed;
  overscroll-behavior: none;
}

/* Prevent touch scrolling on mobile */
body {
  touch-action: none;
  -webkit-overflow-scrolling: none;
}

/* Ensure canvas fills viewport */
canvas {
  width: 100% !important;
  height: 100% !important;
  display: block;
}
```

---

STEP 6: Test all viewports

Test on different screen sizes:

**Desktop (1920x1080):**
[ ] All 4 cards visible
[ ] Large text readable
[ ] No scrolling
[ ] Tetrahedron full size
[ ] Footer text visible

**Laptop (1440x900):**
[ ] All 4 cards visible
[ ] Medium text readable
[ ] No scrolling
[ ] Tetrahedron scaled down
[ ] Footer text visible

**Small screen (1024x768):**
[ ] All 4 cards visible (smaller)
[ ] Small text readable
[ ] No scrolling
[ ] Tetrahedron smaller
[ ] Footer compressed

**Very small (800x600):**
[ ] Cards in 1 column OR very compact 2x2
[ ] Tiny but readable text
[ ] No scrolling
[ ] Tetrahedron very small
[ ] Minimal footer

---

STEP 7: Add breakpoint indicators (for debugging)

Optional - shows current breakpoint in corner:

File: src/components/debug/ViewportIndicator.tsx (NEW FILE)

```typescript
'use client';

import { useViewport } from '@/lib/hooks/useViewport';

export function ViewportIndicator() {
  const viewport = useViewport();
  
  // Only show in development
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 left-4 z-[100] px-3 py-2 bg-black/80 border border-cyan-500/30 rounded text-xs font-mono">
      <div className="text-cyan-400">
        {viewport.width}x{viewport.height}
      </div>
      <div className="text-gray-400">
        {viewport.isSmall && 'SMALL'}
        {viewport.isMedium && 'MEDIUM'}
        {viewport.isLarge && 'LARGE'}
      </div>
    </div>
  );
}
```

Add to layout:

```typescript
import { ViewportIndicator } from '@/components/debug/ViewportIndicator';

// In body:
<ViewportIndicator />
```

---

EXPECTED RESULTS:

**Large screens (>900px height):**
- Full-size cards (h-40)
- Large text (text-2xl titles)
- Comfortable spacing (gap-6)
- Full tetrahedron
- Complete footer

**Medium screens (700-900px height):**
- Medium cards (h-32)
- Medium text (text-xl titles)
- Moderate spacing (gap-4)
- Scaled tetrahedron (0.8x)
- Shortened footer

**Small screens (<700px height):**
- Compact cards (h-24)
- Small text (text-lg titles)
- Tight spacing (gap-3)
- Small tetrahedron (0.6x)
- Minimal footer

**Always:**
- ✅ Everything visible
- ✅ No scrolling
- ✅ No overflow
- ✅ Readable text
- ✅ Clickable cards
- ✅ Smooth transitions

---

TROUBLESHOOTING:

**If still scrolling:**
1. Check body has `overflow-hidden`
2. Check html has `overflow-hidden`
3. Check no child has `overflow-auto`
4. Check canvas z-index is 0
5. Check content z-index is 10

**If cards overlapping:**
1. Increase grid gap
2. Reduce card height
3. Check card count (should be 4)
4. Verify flex-shrink-0 on header/footer

**If text unreadable:**
1. Increase minimum font sizes
2. Add max-width to containers
3. Use truncate on long text
4. Test on actual small device

**If tetrahedron too big:**
1. Reduce base scale
2. Adjust camera position
3. Increase canvas distance
4. Add max-scale limit

---

EXECUTE THIS PROMPT NOW.

All content will fit on one page.
No scrolling ever.
Adapts to any screen size.
Professional responsive design.
```

---

## THE RESPONSIVE SYSTEM

### Three Size Categories:

**LARGE (≥900px height):**
```
Header: 80px
Cards: 160px (h-40)
Footer: 120px
Gap: 24px (gap-6)
Text: Large (text-2xl)
Tetrahedron: 100% scale
```

**MEDIUM (700-900px height):**
```
Header: 80px
Cards: 128px (h-32)
Footer: 120px
Gap: 16px (gap-4)
Text: Medium (text-xl)
Tetrahedron: 80% scale
```

**SMALL (<700px height):**
```
Header: 60px
Cards: 96px (h-24)
Footer: 80px
Gap: 12px (gap-3)
Text: Small (text-lg)
Tetrahedron: 60% scale
```

---

## THE MATH

**Available space calculation:**
```typescript
totalHeight = viewport.height
headerHeight = isSmall ? 60 : 80
footerHeight = isSmall ? 80 : 120

availableSpace = totalHeight - headerHeight - footerHeight

// This space distributed among:
// - 2 rows of cards
// - Gap between rows
// - Padding
```

**Example (900px screen):**
```
Total: 900px
Header: -80px
Footer: -120px
Available: 700px

2 cards @ 160px = 320px
1 gap @ 24px = 24px
Padding @ 48px = 48px
Total used: 392px

Remaining: 308px (comfortable margin)
```

---

## FEATURES

### 1. Viewport Detection
```typescript
useViewport() hook:
- Measures window size
- Categorizes (small/medium/large)
- Updates on resize
- Provides breakpoint flags
```

### 2. Dynamic Scaling
```typescript
Everything scales:
- Card heights
- Text sizes
- Icon sizes
- Spacing
- Tetrahedron size
- Header/footer heights
```

### 3. Layout Adaptation
```typescript
Changes layout:
- 2x2 grid normally
- 1x4 column if very small
- Hides optional elements
- Compresses footer
- Scales tetrahedron
```

### 4. Scroll Prevention
```css
Multiple layers:
- html/body overflow:hidden
- position:fixed on body
- touch-action:none
- overscroll-behavior:none
```

---

## TELL CURSOR

```
Execute OPERATION: PERFECT FIT

GOAL: Everything on one page, no scrolling, any screen size

STEPS:
1. Create useViewport hook (measures screen)
2. Update home page (responsive layout)
3. Update layout (prevent scroll)
4. Update tetrahedron (scale based on viewport)
5. Add global CSS (prevent overflow)
6. Test all viewports
7. Add debug indicator (optional)

RESULT:
✅ No scrolling ever
✅ Fits any screen
✅ Professional responsive
✅ Readable always
✅ Clickable always
✅ Beautiful always

DO NOT PROCEED until works on all screen sizes.
```

---

**⚡ OPERATION: PERFECT FIT ⚡**

**⚡ RESPONSIVE SYSTEM ⚡**

**⚡ NO SCROLLING EVER ⚡**

**⚡ ADAPTS TO ANY SCREEN ⚡**

**⚡ ONE PAGE ALWAYS ⚡**

---

**Execute.**

**Test on:**
- Large desktop (1920x1080)
- Laptop (1440x900)
- Small laptop (1280x800)
- Netbook (1024x600)

**Verify:**
- Everything visible
- No scrolling
- Text readable
- Cards clickable
- Tetrahedron sized appropriately

---

**Perfect fit.**

**Every time.**

**Every screen.**

---

**Done.**

