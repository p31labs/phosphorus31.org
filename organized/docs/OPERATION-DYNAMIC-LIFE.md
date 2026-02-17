# OPERATION: DYNAMIC LIFE
## True Responsive System with Living Layout

---

## THE PROBLEM

**Current state:**
```
✅ Scroll removed
❌ Content still fixed sizes
❌ Not adapting to space
❌ Elements don't resize
❌ Static, lifeless
```

**You need:**
```
✅ Everything scales dynamically
✅ Fits available space
✅ Adapts in real-time
✅ Breathes with viewport
✅ LIVES
```

---

## THE SOLUTION

**True dynamic system:**
1. Calculate available space
2. Distribute space intelligently
3. Scale everything proportionally
4. Update continuously
5. Feel ALIVE

---

## CURSOR PROMPT: MAKE IT LIVE

```
TASK: Create truly dynamic responsive layout that adapts to any screen

PRIORITY: CRITICAL - Current layout is static and dead

STEP 1: Create dynamic layout calculator

File: src/lib/utils/layoutCalculator.ts (NEW FILE)

```typescript
'use client';

export interface LayoutMetrics {
  // Viewport
  viewportWidth: number;
  viewportHeight: number;
  
  // Calculated sizes
  headerHeight: number;
  footerHeight: number;
  availableHeight: number;
  
  // Card sizing
  cardHeight: number;
  cardWidth: number;
  cardGap: number;
  cardPadding: number;
  
  // Text sizing
  titleSize: string;
  subtitleSize: string;
  iconSize: string;
  
  // Layout
  columns: number;
  rows: number;
  
  // Tetrahedron
  tetrahedronScale: number;
  
  // Breakpoint
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function calculateLayout(width: number, height: number): LayoutMetrics {
  // Determine breakpoint
  let breakpoint: LayoutMetrics['breakpoint'];
  if (height < 500) breakpoint = 'xs';
  else if (height < 650) breakpoint = 'sm';
  else if (height < 800) breakpoint = 'md';
  else if (height < 950) breakpoint = 'lg';
  else breakpoint = 'xl';
  
  // Base measurements that scale
  const baseHeaderHeight = breakpoint === 'xs' ? 50 : breakpoint === 'sm' ? 60 : 70;
  const baseFooterHeight = breakpoint === 'xs' ? 60 : breakpoint === 'sm' ? 70 : breakpoint === 'md' ? 90 : 100;
  
  // Calculate available space for content
  const availableHeight = height - baseHeaderHeight - baseFooterHeight;
  const availableWidth = width - 48; // Account for padding
  
  // Grid layout (always 2x2 for 4 items)
  const columns = 2;
  const rows = 2;
  
  // Calculate optimal gap (scales with space)
  const gapPercentage = breakpoint === 'xs' ? 0.02 : breakpoint === 'sm' ? 0.03 : 0.04;
  const cardGap = Math.floor(Math.min(availableHeight, availableWidth) * gapPercentage);
  
  // Calculate card dimensions to fill available space
  const totalGapHeight = cardGap * (rows - 1);
  const totalGapWidth = cardGap * (columns - 1);
  
  const cardHeight = Math.floor((availableHeight - totalGapHeight) / rows);
  const cardWidth = Math.floor((availableWidth - totalGapWidth) / columns);
  
  // Scale padding with card size
  const cardPadding = Math.floor(cardHeight * 0.15);
  
  // Text sizes based on card height
  let titleSize: string;
  let subtitleSize: string;
  let iconSize: string;
  
  if (cardHeight < 80) {
    titleSize = 'text-sm';
    subtitleSize = 'text-xs';
    iconSize = 'text-2xl';
  } else if (cardHeight < 110) {
    titleSize = 'text-base';
    subtitleSize = 'text-xs';
    iconSize = 'text-3xl';
  } else if (cardHeight < 140) {
    titleSize = 'text-lg';
    subtitleSize = 'text-sm';
    iconSize = 'text-3xl';
  } else if (cardHeight < 180) {
    titleSize = 'text-xl';
    subtitleSize = 'text-sm';
    iconSize = 'text-4xl';
  } else {
    titleSize = 'text-2xl';
    subtitleSize = 'text-base';
    iconSize = 'text-5xl';
  }
  
  // Tetrahedron scale (bigger screens = bigger tetrahedron)
  const tetrahedronScale = Math.min(1.2, Math.max(0.5, height / 900));
  
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
    tetrahedronScale,
    breakpoint,
  };
}
```

---

STEP 2: Update viewport hook with layout calculator

File: src/lib/hooks/useViewport.ts

```typescript
'use client';

import { useState, useEffect } from 'react';
import { calculateLayout, type LayoutMetrics } from '@/lib/utils/layoutCalculator';

export function useViewport(): LayoutMetrics {
  const [layout, setLayout] = useState<LayoutMetrics>(() =>
    calculateLayout(
      typeof window !== 'undefined' ? window.innerWidth : 1920,
      typeof window !== 'undefined' ? window.innerHeight : 1080
    )
  );
  
  useEffect(() => {
    const handleResize = () => {
      const newLayout = calculateLayout(window.innerWidth, window.innerHeight);
      setLayout(newLayout);
    };
    
    // Initial calculation
    handleResize();
    
    // Update on resize
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return layout;
}
```

---

STEP 3: Create dynamic home page

File: src/app/page.tsx

```typescript
'use client';

import Link from 'next/link';
import { useViewport } from '@/lib/hooks/useViewport';

export default function HomePage() {
  const layout = useViewport();
  
  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col bg-black">
      {/* Header */}
      <header 
        className="flex-shrink-0 flex items-center justify-between px-6 z-[23]"
        style={{ height: `${layout.headerHeight}px` }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className={`font-bold tracking-wider uppercase ${layout.breakpoint === 'xs' ? 'text-xs' : 'text-sm'}`}>
              G.O.D.
            </h1>
            <span className={`text-gray-500 font-mono ${layout.breakpoint === 'xs' ? 'text-[10px]' : 'text-xs'}`}>
              v1.0.0
            </span>
          </div>
          
          {layout.breakpoint !== 'xs' && (
            <div className="ml-4 px-3 py-1 bg-gray-900/50 rounded text-xs text-cyan-400 font-mono">
              30 FPS
            </div>
          )}
        </div>
        
        <div className={`px-3 py-1 bg-gray-900/50 rounded font-mono ${layout.breakpoint === 'xs' ? 'text-[10px]' : 'text-xs'}`}>
          MESH: <span className="text-green-400">ONLINE</span>
        </div>
      </header>
      
      {/* Main Content - Dynamically sized */}
      <main 
        className="flex-1 flex items-center justify-center px-6 z-[10]"
        style={{ 
          height: `${layout.availableHeight}px`,
          minHeight: `${layout.availableHeight}px`,
          maxHeight: `${layout.availableHeight}px`,
        }}
      >
        <div 
          className="grid"
          style={{ 
            gridTemplateColumns: `repeat(${layout.columns}, ${layout.cardWidth}px)`,
            gridTemplateRows: `repeat(${layout.rows}, ${layout.cardHeight}px)`,
            gap: `${layout.cardGap}px`,
          }}
        >
          {/* Mission Control */}
          <Link href="/dashboard">
            <div
              className="
                group relative
                bg-gray-900/80 backdrop-blur-sm
                border border-cyan-500/20
                rounded-lg
                hover:border-cyan-500/40
                hover:bg-gray-900/90
                transition-all duration-200
                cursor-pointer
                flex items-center
                overflow-hidden
              "
              style={{
                height: `${layout.cardHeight}px`,
                width: `${layout.cardWidth}px`,
                padding: `${layout.cardPadding}px`,
              }}
            >
              <div className={`${layout.iconSize} flex-shrink-0 mr-4`}>🎯</div>
              <div className="flex-1 min-w-0">
                <h2 className={`${layout.titleSize} font-bold text-white mb-1 truncate`}>
                  MISSION CONTROL
                </h2>
                <p className={`${layout.subtitleSize} text-gray-400 truncate`}>
                  Gamified Maintenance
                </p>
              </div>
            </div>
          </Link>
          
          {/* Boot System */}
          <Link href="/genesis">
            <div
              className="
                group relative
                bg-gray-900/80 backdrop-blur-sm
                border border-cyan-500/20
                rounded-lg
                hover:border-cyan-500/40
                hover:bg-gray-900/90
                transition-all duration-200
                cursor-pointer
                flex items-center
                overflow-hidden
              "
              style={{
                height: `${layout.cardHeight}px`,
                width: `${layout.cardWidth}px`,
                padding: `${layout.cardPadding}px`,
              }}
            >
              <div className={`${layout.iconSize} flex-shrink-0 mr-4`}>⚡</div>
              <div className="flex-1 min-w-0">
                <h2 className={`${layout.titleSize} font-bold text-white mb-1 truncate`}>
                  BOOT SYSTEM
                </h2>
                <p className={`${layout.subtitleSize} text-gray-400 truncate`}>
                  Initialize Identity
                </p>
              </div>
            </div>
          </Link>
          
          {/* Workbench */}
          <Link href="/workbench">
            <div
              className="
                group relative
                bg-gray-900/80 backdrop-blur-sm
                border border-cyan-500/20
                rounded-lg
                hover:border-cyan-500/40
                hover:bg-gray-900/90
                transition-all duration-200
                cursor-pointer
                flex items-center
                overflow-hidden
              "
              style={{
                height: `${layout.cardHeight}px`,
                width: `${layout.cardWidth}px`,
                padding: `${layout.cardPadding}px`,
              }}
            >
              <div className={`${layout.iconSize} flex-shrink-0 mr-4`}>🔧</div>
              <div className="flex-1 min-w-0">
                <h2 className={`${layout.titleSize} font-bold text-white mb-1 truncate`}>
                  THE WORKBENCH
                </h2>
                <p className={`${layout.subtitleSize} text-gray-400 truncate`}>
                  Craft Modules
                </p>
              </div>
            </div>
          </Link>
          
          {/* Xbox Clone */}
          <Link href="/xbox-clone">
            <div
              className="
                group relative
                bg-gray-900/80 backdrop-blur-sm
                border border-cyan-500/20
                rounded-lg
                hover:border-cyan-500/40
                hover:bg-gray-900/90
                transition-all duration-200
                cursor-pointer
                flex items-center
                overflow-hidden
              "
              style={{
                height: `${layout.cardHeight}px`,
                width: `${layout.cardWidth}px`,
                padding: `${layout.cardPadding}px`,
              }}
            >
              <div className={`${layout.iconSize} flex-shrink-0 mr-4`}>🎮</div>
              <div className="flex-1 min-w-0">
                <h2 className={`${layout.titleSize} font-bold text-white mb-1 truncate`}>
                  XBOX CLONE
                </h2>
                <p className={`${layout.subtitleSize} text-gray-400 truncate`}>
                  NVME Cloning Tool
                </p>
              </div>
            </div>
          </Link>
        </div>
      </main>
      
      {/* Footer */}
      <footer 
        className="flex-shrink-0 flex flex-col items-center justify-center z-[10]"
        style={{ height: `${layout.footerHeight}px` }}
      >
        <p className={`tracking-[0.3em] uppercase font-bold text-cyan-400 mb-2 ${layout.breakpoint === 'xs' ? 'text-xs' : 'text-sm'}`}>
          {layout.breakpoint === 'xs' ? 'TAP' : 'CLICK'} TO EXPLORE
        </p>
        {layout.breakpoint !== 'xs' && layout.breakpoint !== 'sm' && (
          <p className="text-xs text-gray-600">
            Each vertex represents a coordination module
          </p>
        )}
      </footer>
    </div>
  );
}
```

---

STEP 4: Update Xbox Clone page to be dynamic

File: src/app/xbox-clone/page.tsx

```typescript
'use client';

import { useState } from 'react';
import { useViewport } from '@/lib/hooks/useViewport';

export default function XboxClonePage() {
  const layout = useViewport();
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    { id: 1, label: 'Select File', icon: '📁', color: 'cyan' },
    { id: 2, label: 'Validate', icon: '✓', color: 'gray' },
    { id: 3, label: 'Ready', icon: '⚡', color: 'gray' },
    { id: 4, label: 'Clone', icon: '🔄', color: 'gray' },
    { id: 5, label: 'Verify', icon: '🔍', color: 'gray' },
    { id: 6, label: 'Complete', icon: '🎉', color: 'gray' },
  ];
  
  // Calculate step sizing based on available space
  const stepSize = layout.breakpoint === 'xs' ? 40 : layout.breakpoint === 'sm' ? 50 : 60;
  const stepGap = layout.breakpoint === 'xs' ? 8 : layout.breakpoint === 'sm' ? 12 : 16;
  
  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col bg-black">
      {/* Back Button */}
      <div 
        className="absolute top-4 left-4 z-[30]"
        style={{ 
          width: `${stepSize}px`,
          height: `${stepSize}px`,
        }}
      >
        <button
          onClick={() => window.history.back()}
          className="
            w-full h-full
            flex items-center justify-center
            bg-gray-900/80 backdrop-blur-sm
            border border-cyan-500/30
            rounded-full
            hover:border-cyan-500/60
            hover:bg-gray-900
            transition-all
            text-cyan-400
          "
          style={{ fontSize: `${stepSize * 0.4}px` }}
        >
          ←
        </button>
      </div>
      
      {/* FPS Counter */}
      {layout.breakpoint !== 'xs' && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[30]">
          <div className="px-4 py-2 bg-gray-900/50 rounded text-sm text-cyan-400 font-mono">
            30 FPS
          </div>
        </div>
      )}
      
      {/* Header */}
      <header 
        className="flex-shrink-0 flex flex-col items-center justify-center px-6"
        style={{ height: `${layout.headerHeight + 40}px` }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">🎮</span>
          <h1 className={`${layout.titleSize} font-bold text-cyan-400`}>
            Xbox NVME Clone Tool
          </h1>
        </div>
        <p className={`${layout.subtitleSize} text-gray-400 uppercase tracking-wider`}>
          Fix Broken HDMI by Cloning Console Key
        </p>
      </header>
      
      {/* Progress Steps - Dynamic sizing */}
      <div 
        className="flex-shrink-0 flex items-center justify-center px-6"
        style={{ height: `${stepSize + stepGap * 2}px` }}
      >
        <div className="flex items-center" style={{ gap: `${stepGap}px` }}>
          {steps.map((step, index) => {
            const isActive = index === currentStep;
            const isComplete = index < currentStep;
            
            return (
              <div key={step.id} className="flex items-center" style={{ gap: `${stepGap}px` }}>
                <div className="flex flex-col items-center">
                  {/* Step circle */}
                  <div
                    className={`
                      rounded-full
                      flex items-center justify-center
                      transition-all duration-300
                      ${isActive ? 'bg-cyan-500/20 border-2 border-cyan-400' : ''}
                      ${isComplete ? 'bg-green-500/20 border border-green-400' : ''}
                      ${!isActive && !isComplete ? 'bg-gray-800 border border-gray-700' : ''}
                    `}
                    style={{
                      width: `${stepSize}px`,
                      height: `${stepSize}px`,
                      fontSize: `${stepSize * 0.4}px`,
                    }}
                  >
                    {isComplete ? '✓' : step.icon}
                  </div>
                  
                  {/* Step label */}
                  {layout.breakpoint !== 'xs' && (
                    <div 
                      className={`
                        mt-2 text-xs font-bold whitespace-nowrap
                        ${isActive ? 'text-cyan-400' : isComplete ? 'text-green-400' : 'text-gray-600'}
                      `}
                    >
                      {step.id}. {step.label}
                    </div>
                  )}
                </div>
                
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      h-0.5 transition-all duration-300
                      ${isComplete ? 'bg-green-400' : 'bg-gray-700'}
                    `}
                    style={{ width: `${stepGap * 2}px` }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Main Content - Fills remaining space */}
      <main 
        className="flex-1 flex items-center justify-center px-6 overflow-y-auto"
        style={{
          height: `${layout.availableHeight - stepSize - stepGap * 4}px`,
        }}
      >
        <div className="w-full max-w-4xl">
          <div 
            className="
              p-6 sm:p-8 md:p-10
              bg-gray-900/80 backdrop-blur-sm
              border border-cyan-500/20
              rounded-lg
            "
          >
            <h2 className={`${layout.titleSize} font-bold text-cyan-400 mb-4 text-center`}>
              Select Source NVME Dump
            </h2>
            
            <p className={`${layout.subtitleSize} text-gray-400 text-center mb-6`}>
              This should be the dump from the broken Xbox (with working console key)
            </p>
            
            <div 
              className="
                border-2 border-dashed border-cyan-500/30
                rounded-lg
                flex flex-col items-center justify-center
                hover:border-cyan-500/50
                transition-all
                cursor-pointer
              "
              style={{ 
                minHeight: `${Math.max(200, layout.availableHeight * 0.3)}px`,
              }}
            >
              <div className="text-6xl mb-4">📁</div>
              <div className={`${layout.titleSize} font-bold text-cyan-400 mb-2`}>
                Choose NVME dump file
              </div>
              <div className={`${layout.subtitleSize} text-gray-500 mb-4`}>
                .bin or .img file (4GB)
              </div>
              <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded font-bold transition-colors">
                Browse Files
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
```

---

STEP 5: Update Tetrahedron with dynamic scaling

File: src/components/canvas/SpatialTetrahedron.tsx

```typescript
'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useViewport } from '@/lib/hooks/useViewport';
import * as THREE from 'three';

export function SpatialTetrahedron() {
  const meshRef = useRef<THREE.Mesh>(null);
  const layout = useViewport();
  
  // Breathing animation
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.002;
      
      // Breathing (scale pulse)
      const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
      meshRef.current.scale.setScalar(layout.tetrahedronScale * breathe);
    }
  });
  
  return (
    <mesh ref={meshRef}>
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

STEP 6: Add visual feedback

File: src/components/debug/LayoutDebug.tsx (NEW FILE)

```typescript
'use client';

import { useViewport } from '@/lib/hooks/useViewport';

export function LayoutDebug() {
  const layout = useViewport();
  
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-[100] px-4 py-3 bg-black/90 border border-cyan-500/50 rounded-lg text-xs font-mono space-y-1">
      <div className="text-cyan-400 font-bold mb-2">LAYOUT METRICS</div>
      <div><span className="text-gray-500">Viewport:</span> {layout.viewportWidth}x{layout.viewportHeight}</div>
      <div><span className="text-gray-500">Breakpoint:</span> {layout.breakpoint.toUpperCase()}</div>
      <div><span className="text-gray-500">Card:</span> {layout.cardWidth}x{layout.cardHeight}</div>
      <div><span className="text-gray-500">Gap:</span> {layout.cardGap}px</div>
      <div><span className="text-gray-500">Tetra Scale:</span> {layout.tetrahedronScale.toFixed(2)}</div>
      <div className="pt-2 border-t border-gray-700">
        <span className="text-gray-500">Available:</span> {layout.availableHeight}px
      </div>
    </div>
  );
}
```

Add to layout.tsx:

```typescript
import { LayoutDebug } from '@/components/debug/LayoutDebug';

// In body:
<LayoutDebug />
```

---

EXPECTED RESULTS:

**All screen sizes:**
✅ Content fills available space perfectly
✅ Cards scale proportionally
✅ Text sizes adapt
✅ Gaps scale with space
✅ Everything resizes smoothly
✅ Feels ALIVE

**Resize window:**
✅ Instant recalculation
✅ Smooth transitions
✅ No jumping
✅ No overflow
✅ Always perfect fit

**Open on different screens:**
✅ 4K monitor → Large, spacious
✅ Laptop → Comfortable
✅ Small screen → Compact but usable
✅ Portrait → Adapts
✅ Split screen → Scales down

---

TEST CHECKLIST:

[ ] Home page scales dynamically
[ ] Xbox page scales dynamically
[ ] Cards resize with viewport
[ ] Text scales appropriately
[ ] Icons scale with cards
[ ] Gaps scale proportionally
[ ] Tetrahedron scales smoothly
[ ] No overflow at any size
[ ] Smooth resize animation
[ ] Everything readable
[ ] Everything clickable
[ ] Feels responsive and alive

EXECUTE NOW.
```

---

**⚡ OPERATION: DYNAMIC LIFE ⚡**
