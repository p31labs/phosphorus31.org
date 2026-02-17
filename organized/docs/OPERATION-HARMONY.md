# OPERATION: HARMONY
## Fix Tetrahedron Overflow + Subtle Debug Overlay

---

## THE PROBLEMS

**Problem 1: Tetrahedron too big**
```
Current: Goes off screen at top
Cause: Camera too close or tetrahedron too large
Fix: Adjust camera position and scale
```

**Problem 2: Debug overlay intrusive**
```
Current: Big opaque boxes blocking view
Cause: Poor design, too much information
Fix: Minimal, translucent, corner-only display
```

---

## CURSOR PROMPT: FIX HARMONY

```
TASK: Fix tetrahedron overflow and make debug overlay subtle

PRIORITY: CRITICAL - Visual harmony broken

STEP 1: Fix tetrahedron positioning and scaling

File: src/components/canvas/SpatialTetrahedron.tsx

```typescript
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useViewport } from '@/lib/hooks/useViewport';
import * as THREE from 'three';

export function SpatialTetrahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  const layout = useViewport();
  
  // FIXED: Constrain tetrahedron scale to prevent overflow
  // Maximum scale is 0.8 to leave room for rotation
  const maxScale = 0.8;
  const constrainedScale = Math.min(layout.tetrahedronScale, maxScale);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.002;
      
      // Subtle breathing (only ±3% to prevent overflow)
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.03;
      meshRef.current.scale.setScalar(constrainedScale * breathe);
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
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

STEP 2: Adjust camera positioning

File: src/components/layout/CanvasLayer.tsx

```typescript
'use client';

import { Canvas } from '@react-three/fiber';
import { SpatialTetrahedron } from '@/components/canvas/SpatialTetrahedron';
import { Suspense, useContext } from 'react';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { CanvasKeyContext } from './CanvasKeyProvider';

export function CanvasLayer() {
  const canvasKey = useContext(CanvasKeyContext);
  
  return (
    <CanvasErrorBoundary>
      <Canvas
        key={canvasKey}
        className="w-full h-full"
        // FIXED: Move camera back further to fit entire tetrahedron
        camera={{ 
          position: [0, 0, 8],  // Changed from 7 to 8
          fov: 45 
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        <Suspense fallback={null}>
          <SpatialTetrahedron />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}
```

---

STEP 3: Create minimal debug overlay

File: src/components/debug/LayoutDebug.tsx

REPLACE ENTIRE FILE:

```typescript
'use client';

import { useState } from 'react';
import { useViewport } from '@/lib/hooks/useViewport';

export function LayoutDebug() {
  const layout = useViewport();
  const [expanded, setExpanded] = useState(false);
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <>
      {/* Compact indicator - bottom right corner */}
      {!expanded && (
        <button
          onClick={() => setExpanded(true)}
          className="
            fixed bottom-4 right-4 z-[100]
            px-3 py-2
            bg-black/50 backdrop-blur-sm
            border border-cyan-500/20
            rounded
            text-xs font-mono text-cyan-400/60
            hover:border-cyan-500/40 hover:text-cyan-400
            transition-all
          "
        >
          {layout.viewportWidth}×{layout.viewportHeight} · {layout.breakpoint.toUpperCase()}
        </button>
      )}
      
      {/* Expanded panel - only when clicked */}
      {expanded && (
        <div className="fixed bottom-4 right-4 z-[100] animate-in fade-in duration-200">
          <div className="
            px-4 py-3
            bg-black/80 backdrop-blur-md
            border border-cyan-500/30
            rounded-lg
            text-xs font-mono
            min-w-[200px]
          ">
            {/* Close button */}
            <button
              onClick={() => setExpanded(false)}
              className="
                absolute top-2 right-2
                text-gray-500 hover:text-white
                transition-colors
              "
            >
              ×
            </button>
            
            {/* Metrics */}
            <div className="space-y-1.5">
              <div className="text-cyan-400 font-bold mb-2">Layout Metrics</div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Viewport:</span>
                <span className="text-white">{layout.viewportWidth}×{layout.viewportHeight}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Breakpoint:</span>
                <span className="text-cyan-400">{layout.breakpoint.toUpperCase()}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Card:</span>
                <span className="text-white">{layout.cardWidth}×{layout.cardHeight}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Gap:</span>
                <span className="text-white">{layout.cardGap}px</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-500">Tetra:</span>
                <span className="text-white">{layout.tetrahedronScale.toFixed(2)}×</span>
              </div>
              
              <div className="pt-2 mt-2 border-t border-gray-700">
                <div className="flex justify-between">
                  <span className="text-gray-500">Available:</span>
                  <span className="text-white">{layout.availableHeight}px</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
```

---

STEP 4: Update layout calculator to prevent overflow

File: src/lib/utils/layoutCalculator.ts

Update tetrahedronScale calculation:

```typescript
// ... existing code ...

export function calculateLayout(width: number, height: number): LayoutMetrics {
  // ... existing breakpoint code ...
  
  // ... existing calculations ...
  
  // FIXED: Tetrahedron scale with hard maximum
  // Prevents overflow on any screen size
  const rawScale = height / 900;
  const tetrahedronScale = Math.min(0.8, Math.max(0.4, rawScale));
  
  return {
    viewportWidth: width,
    viewportHeight: height,
    headerHeight: baseHeaderHeight,
    footerHeight: baseFooterHeight,
    availableHeight,
    cardHeight,
    cardWidth,
    cardGap,
    cardPadding,
    titleSize,
    subtitleSize,
    iconSize,
    columns,
    rows,
    tetrahedronScale,  // Now capped at 0.8
    breakpoint,
  };
}
```

---

STEP 5: Remove verbose viewport indicator from Xbox page

File: src/app/xbox-clone/page.tsx

REMOVE the viewport info box (bottom right corner that shows full metrics)

Keep ONLY the minimal debug toggle in layout.tsx

---

STEP 6: Ensure all pages use subtle debug

File: src/app/layout.tsx

Ensure LayoutDebug is imported and placed correctly:

```typescript
import { LayoutDebug } from '@/components/debug/LayoutDebug';

// In body, AFTER children:
<body className="relative h-screen w-screen overflow-hidden bg-black text-white">
  {/* Canvas Layer */}
  <div className="fixed inset-0 z-canvas">
    <CanvasLayer />
  </div>
  
  {/* Content Layer */}
  <div className="relative z-content h-screen w-screen">
    {children}
  </div>
  
  {/* Debug Layer - Subtle, only in development */}
  <LayoutDebug />
</body>
```

---

STEP 7: Test tetrahedron visibility

Open in browser and verify:

[ ] Tetrahedron fully visible (no overflow at top)
[ ] Tetrahedron centered in viewport
[ ] Breathing animation subtle (doesn't cause overflow)
[ ] Rotation smooth
[ ] Debug overlay minimal (small corner button)
[ ] Debug expands on click
[ ] Debug closes cleanly
[ ] No visual clutter
[ ] All elements harmonious

---

VISUAL HARMONY CHECKLIST:

**Tetrahedron:**
[ ] Fits entirely on screen (all viewports)
[ ] Centered properly
[ ] Doesn't obstruct UI
[ ] Breathing is subtle (±3%)
[ ] Scale never exceeds 0.8
[ ] Camera distance correct (8 units)

**Debug Overlay:**
[ ] Minimal when collapsed (just dimensions + breakpoint)
[ ] Translucent background
[ ] Subtle cyan accent
[ ] Bottom-right corner only
[ ] Expands on demand
[ ] Shows full metrics when expanded
[ ] Close button visible
[ ] Doesn't block content
[ ] Auto-collapses? (optional)

**Overall:**
[ ] Clean visual hierarchy
[ ] Nothing fighting for attention
[ ] Background elements subtle
[ ] Foreground clear
[ ] Balanced composition
[ ] Professional appearance

---

EXPECTED RESULT:

**Before:**
❌ Tetrahedron overflows top of screen
❌ Debug boxes everywhere blocking content
❌ Visual chaos
❌ Information overload

**After:**
✅ Tetrahedron perfectly framed
✅ Single small debug button (bottom corner)
✅ Expands only when clicked
✅ Visual harmony
✅ Clean, professional

---

ALTERNATIVE: If you want NO debug overlay at all

Option 1: Remove from layout.tsx entirely
Option 2: Add environment check:

```typescript
// In layout.tsx
{process.env.NEXT_PUBLIC_SHOW_DEBUG === 'true' && <LayoutDebug />}

// Then in .env.local:
NEXT_PUBLIC_SHOW_DEBUG=true
```

Option 3: Keyboard toggle (press 'D' to show/hide)

```typescript
// In LayoutDebug component:
useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'd' || e.key === 'D') {
      setExpanded(prev => !prev);
    }
  };
  window.addEventListener('keydown', handleKey);
  return () => window.removeEventListener('keydown', handleKey);
}, []);
```

---

EXECUTE THIS PROMPT NOW.

Fix tetrahedron overflow.
Make debug overlay subtle.
Restore visual harmony.
```

---

**⚡ OPERATION: HARMONY ⚡**
