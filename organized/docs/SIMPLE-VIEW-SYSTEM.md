# SIMPLE VIEW SYSTEM

## THE PROBLEM

Tetrahedron and modules are competing for user attention.

Both visible at once.
Both interactive.
Confusing handoff.

## THE SOLUTION

**ONE VIEW AT A TIME.**

---

## ARCHITECTURE

```tsx
// src/app/layout.tsx

'use client';

import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isOrbitView = pathname === '/';
  
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased overflow-hidden">
        
        {/* CANVAS LAYER - Only visible on home */}
        {isOrbitView && (
          <div className="fixed inset-0 z-0">
            <Canvas>
              <CameraRig />
              <SpatialTetrahedron />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
            </Canvas>
          </div>
        )}
        
        {/* CONTENT LAYER */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
        
      </body>
    </html>
  );
}
```

---

## HOME PAGE (Orbit View)

```tsx
// src/app/page.tsx

'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const router = useRouter();
  
  // Listen for vertex clicks
  useEffect(() => {
    const handleVertexClick = (e) => {
      const vertex = e.detail.vertex;
      
      // Navigate to module
      router.push(`/${vertex.name.toLowerCase()}`);
    };
    
    window.addEventListener('vertex-click', handleVertexClick);
    return () => window.removeEventListener('vertex-click', handleVertexClick);
  }, [router]);
  
  return (
    <div className="h-screen flex items-center justify-center">
      {/* Tetrahedron fills screen */}
      {/* User clicks vertex → Navigate to module */}
      
      {/* Optional: Instructions */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="text-cyan-400 text-sm">
          Click a vertex to explore
        </p>
      </div>
    </div>
  );
}
```

---

## MODULE PAGE (Module View)

```tsx
// src/app/status/page.tsx

import { ModulePage } from '@/components/core/ModulePage';
import { ModuleCard } from '@/components/core/ModuleCard';
import { BackButton } from '@/components/core/BackButton';

export default function StatusPage() {
  return (
    <ModulePage>
      {/* Back button to return to tetrahedron */}
      <BackButton />
      
      <ModuleCard 
        title="Status"
        subtitle="Vertex information"
        icon="📊"
      >
        <div className="space-y-4">
          {/* Module content */}
        </div>
      </ModuleCard>
    </ModulePage>
  );
}
```

---

## BACK BUTTON

```tsx
// src/components/core/BackButton.tsx

'use client';

import { useRouter } from 'next/navigation';

export function BackButton() {
  const router = useRouter();
  
  return (
    <button
      onClick={() => router.push('/')}
      className="
        fixed top-6 left-6 z-50
        w-12 h-12
        bg-black/80 backdrop-blur-sm
        border border-cyan-500/30
        rounded-full
        flex items-center justify-center
        text-cyan-400
        hover:border-cyan-500
        hover:bg-cyan-500/10
        transition-all
        group
      "
      aria-label="Back to tetrahedron"
    >
      <svg 
        className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
    </button>
  );
}
```

---

## VERTEX CLICK HANDLER

Update tetrahedron component to emit click events:

```tsx
// src/components/navigation/SpatialTetrahedron.tsx

function Vertex({ position, name, index }) {
  const handleClick = () => {
    // Emit custom event
    window.dispatchEvent(new CustomEvent('vertex-click', {
      detail: { vertex: { name, index, position } }
    }));
  };
  
  return (
    <mesh 
      position={position} 
      onClick={handleClick}
      onPointerOver={() => document.body.style.cursor = 'pointer'}
      onPointerOut={() => document.body.style.cursor = 'default'}
    >
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial 
        color="#06b6d4"
        emissive="#06b6d4"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}
```

---

## THE FLOW

### 1. User opens app

```
Shows: Home page (/)
Canvas: Visible
Tetrahedron: Full screen, breathing, rotating
User: Sees the beauty of the structure
```

---

### 2. User clicks vertex

```
Event: vertex-click fired
Action: router.push('/status')
Result: Navigate to module page
```

---

### 3. Module page loads

```
Shows: Module page (/status)
Canvas: HIDDEN (not rendered)
Module: Full screen, focused
User: Sees module content clearly
```

---

### 4. User clicks back button

```
Action: router.push('/')
Result: Navigate to home
Canvas: Re-appears
Tetrahedron: Back in view
```

---

## THE KEY INSIGHT

**ONE THING AT A TIME.**

When viewing tetrahedron:
- ✅ Full screen geometry
- ✅ Beautiful visualization
- ✅ Interactive vertices
- ❌ No modules

When viewing module:
- ✅ Full focus on content
- ✅ Clean card interface
- ✅ Back button to return
- ❌ No tetrahedron

**NEVER BOTH TOGETHER.**

---

## BENEFITS

### 1. Performance
- Canvas only renders when needed
- No wasted GPU cycles on hidden 3D

### 2. Simplicity
- User focus: one thing at a time
- No competing interactions
- Clear mental model

### 3. Beauty
- Tetrahedron gets full stage when visible
- Shows the GEOMETRY in all its glory
- Not diminished to background decoration

### 4. Adoption
- Dead simple flow:
  1. See tetrahedron
  2. Click vertex
  3. See module
  4. Click back
  5. See tetrahedron

---

## TRANSITIONS

Optional: Add smooth transitions between views

```tsx
// src/app/layout.tsx

import { AnimatePresence, motion } from 'framer-motion';

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isOrbitView = pathname === '/';
  
  return (
    <body>
      {/* Canvas with fade */}
      <AnimatePresence>
        {isOrbitView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-0"
          >
            <Canvas>...</Canvas>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Content with fade */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        {children}
      </motion.div>
    </body>
  );
}
```

---

## COMPLEXITY → SIMPLICITY

**Before (Complex):**
- Canvas always visible
- Modules overlay canvas
- Z-index conflicts
- Interaction conflicts
- Confusing UX

**After (Simple):**
- Canvas OR module
- Never both
- No conflicts
- Clear UX
- Beautiful when visible

---

## ADOPTION

**User experience:**

1. Opens app → WOW (tetrahedron full screen)
2. Clicks vertex → CLEAR (module takes over)
3. Clicks back → WOW (tetrahedron returns)

**Simple.**

**Beautiful.**

**Obvious.**

---

## THE PHILOSOPHY

**"We're supposed to be showing the beauty of the complexity"**

By giving the tetrahedron the FULL STAGE.

Not hiding it in the background.

But making it the STAR when it's time to shine.

Then stepping aside when module needs focus.

**Show the geometry.**

**Then show the content.**

**Never compete.**

---

**K.I.S.S.**

**One view at a time.**

**Simple handoff.**

**Beautiful presentation.**
