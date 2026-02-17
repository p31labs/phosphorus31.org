# OPERATION: SPATIAL OS
## Tetrahedron as Living Navigation System

---

## THE VISION

**Not a menu.**

**Not decoration.**

**The GEOMETRY is the OS.**

---

## THE CONCEPT

```
Home = Tetrahedron floating in void
Nodes = 4 vertices (Mission, Forge, Docs, Gov)
Navigation = Click a vertex
Transition = Camera flies into that vertex
Page = Loads as you arrive
Experience = Moving through geometric space
```

---

## IMPLEMENTATION PLAN

### Phase 1: Living Nodes (State-Aware Geometry)
- Vertices pulse with system state
- Colors change based on alerts
- Breathing animation reacts to health
- Interactive hover/click

### Phase 2: Kill Old Navigation
- Remove GeometricNavEngine
- Remove all menu components
- Tetrahedron is ONLY way to navigate

### Phase 3: Spatial Routing
- Camera flies to clicked vertex
- Route changes as you arrive
- Smooth transitions
- Context preserved

---

## FILE STRUCTURE

```
New files:
✅ src/lib/store/sceneStore.ts (view state management)
✅ src/components/canvas/SceneController.tsx (camera control)

Updated files:
✅ src/components/canvas/Vertex.tsx (living, clickable)
✅ src/components/canvas/SpatialTetrahedron.tsx (interactive)
✅ src/components/layout/CanvasLayer.tsx (scene composition)
✅ src/app/layout.tsx (pointer events, layering)

Deleted files:
❌ src/components/navigation/GeometricNavEngine.tsx (mutiny)
❌ src/components/navigation/* (all old nav)
```

---

## CURSOR PROMPT: IMPLEMENT SPATIAL OS

```
TASK: Implement Spatial OS - Tetrahedron as living navigation

PRIORITY: CRITICAL - Core UX paradigm shift

STEP 1: Create scene state store

File: src/lib/store/sceneStore.ts (NEW FILE)

```typescript
'use client';

import { create } from 'zustand';

export type ViewState = 'ORBIT' | 'HOME' | 'NODE';

interface SceneState {
  viewState: ViewState;
  focusedNode: number | null; // 0-3 (which vertex we're zoomed into)
  
  // Actions
  enterOrbit: () => void;
  goHome: () => void;
  focusNode: (index: number) => void;
  back: () => void;
}

export const useSceneStore = create<SceneState>((set, get) => ({
  viewState: 'HOME',
  focusedNode: null,
  
  enterOrbit: () => set({ viewState: 'ORBIT', focusedNode: null }),
  
  goHome: () => set({ viewState: 'HOME', focusedNode: null }),
  
  focusNode: (index: number) => set({ 
    viewState: 'NODE', 
    focusedNode: index 
  }),
  
  back: () => {
    const current = get().viewState;
    if (current === 'NODE') {
      set({ viewState: 'HOME', focusedNode: null });
    } else if (current === 'HOME') {
      set({ viewState: 'ORBIT' });
    }
  },
}));
```

---

STEP 2: Create scene controller (camera transitions)

File: src/components/canvas/SceneController.tsx (NEW FILE)

```typescript
'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { usePathname } from 'next/navigation';
import { VERTEX_POSITIONS } from '@/lib/math/constants';

// Camera positions for different views
const CAMERA_POSITIONS = {
  ORBIT: new Vector3(0, 0, 15),  // Far out, overview
  HOME: new Vector3(0, 0, 8),    // Home view (current)
  NODE: (nodePos: Vector3) => {
    // Zoom to 1.5x the node position, offset slightly forward
    return nodePos.clone().multiplyScalar(1.5).add(new Vector3(0, 0, 2));
  },
};

// Map routes to vertex indices
const ROUTE_TO_NODE: Record<string, number> = {
  '/dashboard': 0,           // Mission (Node 0 - top)
  '/workbench': 1,           // Forge (Node 1 - front-left)
  '/docs/briefing': 2,       // Docs (Node 2 - front-right)
  '/governance/monolith': 3, // Gov (Node 3 - back)
};

export function SceneController() {
  const { camera } = useThree();
  const pathname = usePathname();
  
  useFrame(() => {
    // Determine target based on current route
    let target: Vector3;
    
    if (pathname === '/') {
      // Home view - see whole tetrahedron
      target = CAMERA_POSITIONS.HOME;
    } else {
      // On specific page - zoom to that node
      const nodeIndex = ROUTE_TO_NODE[pathname];
      if (nodeIndex !== undefined) {
        const nodePos = new Vector3(...VERTEX_POSITIONS[nodeIndex]);
        target = CAMERA_POSITIONS.NODE(nodePos);
      } else {
        // Unknown route - default to home
        target = CAMERA_POSITIONS.HOME;
      }
    }
    
    // Smooth camera movement (lerp)
    camera.position.lerp(target, 0.05);
    
    // Always look at center of tetrahedron
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}
```

---

STEP 3: Update Vertex component (living, interactive)

File: src/components/canvas/Vertex.tsx

REPLACE ENTIRE FILE:

```typescript
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useHaptics } from '@/lib/hooks/useHaptics';
import * as THREE from 'three';

// Node definitions (could move to constants)
const NODES = [
  { id: 0, label: 'MISSION', path: '/dashboard', color: '#06b6d4' },      // Cyan
  { id: 1, label: 'FORGE', path: '/workbench', color: '#a855f7' },        // Purple
  { id: 2, label: 'DOCS', path: '/docs/briefing', color: '#eab308' },     // Yellow
  { id: 3, label: 'GOV', path: '/governance/monolith', color: '#ef4444' }, // Red
];

interface VertexProps {
  position: [number, number, number];
  index: number;
  status?: 'healthy' | 'warning' | 'critical'; // Future: system state
}

export function Vertex({ position, index, status = 'healthy' }: VertexProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const router = useRouter();
  const { trigger } = useHaptics();
  const [hovered, setHover] = useState(false);
  
  const nodeData = NODES[index] || NODES[0];
  
  // Status affects animation speed
  const isAlert = status === 'critical';
  const isWarning = status === 'warning';
  
  // Animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation speed based on state
      const baseSpeed = 0.3;
      const speed = hovered ? 1.5 : (isAlert ? 2.5 : isWarning ? 1.2 : baseSpeed);
      
      meshRef.current.rotation.x += delta * speed;
      meshRef.current.rotation.y += delta * speed * 1.5;
      
      // Breathing (scale pulse)
      const breathSpeed = isAlert ? 10 : isWarning ? 5 : 2;
      const breathAmount = isAlert ? 0.1 : 0.05;
      const breath = 1 + Math.sin(state.clock.elapsedTime * breathSpeed) * breathAmount;
      
      // Target scale (larger when hovered)
      const baseScale = 1.0;
      const targetScale = hovered ? 1.3 : baseScale;
      
      // Smooth scale transition
      const currentScale = meshRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale * breath, 0.1);
      meshRef.current.scale.setScalar(newScale);
    }
    
    // Halo rotation
    if (haloRef.current) {
      haloRef.current.rotation.z -= delta * 0.2;
    }
  });
  
  const handleClick = (e: THREE.Event) => {
    e.stopPropagation();
    trigger('heavy');
    
    // Navigate to node's page
    router.push(nodeData.path);
  };
  
  return (
    <group position={new THREE.Vector3(...position)}>
      {/* Core sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          trigger('light');
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshStandardMaterial
          color={hovered ? '#ffffff' : nodeData.color}
          emissive={nodeData.color}
          emissiveIntensity={hovered ? 2 : isAlert ? 1.5 : 0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      
      {/* Orbital halo */}
      <mesh ref={haloRef} scale={[1.3, 1.3, 1.3]}>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={nodeData.color}
          wireframe
          transparent
          opacity={hovered ? 0.4 : 0.2}
        />
      </mesh>
      
      {/* Label */}
      <Html
        distanceFactor={10}
        position={[0, 0.6, 0]}
        center
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`
            px-3 py-1 rounded-full
            backdrop-blur-md border
            transition-all duration-300
            whitespace-nowrap
            ${hovered 
              ? 'bg-white/90 border-white text-black scale-110' 
              : 'bg-black/60 border-gray-600 text-gray-300'
            }
          `}
        >
          <span className="text-[10px] font-black tracking-widest">
            {nodeData.label}
          </span>
        </div>
      </Html>
      
      {/* Point light (glow) */}
      <pointLight
        distance={5}
        intensity={hovered ? 4 : isAlert ? 2 : 1}
        color={nodeData.color}
      />
    </group>
  );
}
```

---

STEP 4: Update SpatialTetrahedron (interactive)

File: src/components/canvas/SpatialTetrahedron.tsx

```typescript
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vertex } from './Vertex';
import { Edge } from './Edge';
import { VERTEX_POSITIONS, EDGE_INDICES } from '@/lib/math/constants';
import { useViewport } from '@/lib/hooks/useViewport';
import * as THREE from 'three';

export function SpatialTetrahedron() {
  const groupRef = useRef<THREE.Group>(null);
  const layout = useViewport();
  
  // Constrain scale
  const maxScale = 0.8;
  const constrainedScale = Math.min(layout.tetrahedronScale, maxScale);
  
  // Gentle auto-rotation (can be disabled when user interacts)
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });
  
  return (
    <group ref={groupRef} scale={constrainedScale}>
      {/* Vertices (living, clickable nodes) */}
      {VERTEX_POSITIONS.map((pos, i) => (
        <Vertex key={i} position={pos as [number, number, number]} index={i} />
      ))}
      
      {/* Edges (connections between nodes) */}
      {EDGE_INDICES.map(([start, end], i) => (
        <Edge
          key={i}
          start={VERTEX_POSITIONS[start] as [number, number, number]}
          end={VERTEX_POSITIONS[end] as [number, number, number]}
        />
      ))}
    </group>
  );
}
```

---

STEP 5: Update CanvasLayer (scene composition)

File: src/components/layout/CanvasLayer.tsx

```typescript
'use client';

import { Canvas } from '@react-three/fiber';
import { SpatialTetrahedron } from '@/components/canvas/SpatialTetrahedron';
import { SceneController } from '@/components/canvas/SceneController';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { Suspense, useContext } from 'react';
import { CanvasKeyContext } from './CanvasKeyProvider';

export function CanvasLayer() {
  const canvasKey = useContext(CanvasKeyContext);
  
  return (
    <CanvasErrorBoundary>
      <Canvas
        key={canvasKey}
        className="w-full h-full"
        camera={{ 
          position: [0, 0, 8],
          fov: 45 
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
        dpr={[1, 2]}
      >
        {/* Scene controller - handles camera transitions */}
        <SceneController />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        
        {/* The world */}
        <Suspense fallback={null}>
          <SpatialTetrahedron />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}
```

---

STEP 6: Update layout (pointer events, layering)

File: src/app/layout.tsx

CRITICAL CHANGES to pointer events:

```typescript
import { Inter } from 'next/font/google';
import './globals.css';
import { CanvasLayer } from '@/components/layout/CanvasLayer';
import { CanvasKeyProvider } from '@/components/layout/CanvasKeyProvider';
import { LayoutDebug } from '@/components/debug/LayoutDebug';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white overflow-hidden`}>
        <CanvasKeyProvider>
          {/* LAYER 0: Canvas (Background + Navigation) */}
          {/* CRITICAL: pointer-events-auto so vertices are clickable */}
          <div className="fixed inset-0 z-canvas pointer-events-auto">
            <CanvasLayer />
          </div>
          
          {/* LAYER 1: Content (Overlays) */}
          {/* CRITICAL: pointer-events-none by default */}
          <div className="relative z-content pointer-events-none">
            {/* Re-enable pointer events for actual content */}
            <div className="pointer-events-auto">
              {children}
            </div>
          </div>
          
          {/* Debug overlay */}
          <LayoutDebug />
        </CanvasKeyProvider>
      </body>
    </html>
  );
}
```

---

STEP 7: Update home page (minimal, let tetrahedron be nav)

File: src/app/page.tsx

```typescript
'use client';

import { useViewport } from '@/lib/hooks/useViewport';

export default function HomePage() {
  const layout = useViewport();
  
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-end pb-20 pointer-events-none">
      {/* Minimal footer hint */}
      <div className="text-center space-y-2">
        <p className={`tracking-[0.3em] uppercase font-bold text-cyan-400 ${layout.breakpoint === 'xs' ? 'text-xs' : 'text-sm'}`}>
          CLICK A VERTEX TO NAVIGATE
        </p>
        {layout.breakpoint !== 'xs' && (
          <p className="text-xs text-gray-600">
            Each node represents a system sector
          </p>
        )}
      </div>
    </div>
  );
}
```

---

STEP 8: Delete old navigation

REMOVE these files completely:

```bash
rm -rf src/components/navigation/GeometricNavEngine.tsx
rm -rf src/components/navigation/JitterbugNav.tsx
rm -rf src/components/navigation/NavOrb.tsx
# Remove entire navigation directory if it only contains old nav
```

---

STEP 9: Add OrbitControls for manual rotation (optional)

If you want users to be able to rotate the tetrahedron manually:

File: src/components/canvas/SpatialTetrahedron.tsx

Add at bottom of component:

```typescript
import { OrbitControls } from '@react-three/drei';

// In return statement, after edges:
return (
  <group ref={groupRef} scale={constrainedScale}>
    {/* ... vertices and edges ... */}
    
    {/* Manual rotation controls */}
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      rotateSpeed={0.5}
      dampingFactor={0.05}
      enableDamping
    />
  </group>
);
```

---

STEP 10: Test the spatial navigation

TEST CHECKLIST:

**Home page (/):**
[ ] See full tetrahedron
[ ] Camera at position [0, 0, 8]
[ ] All 4 vertices visible
[ ] Labels showing
[ ] Can hover vertices (glow, scale up)
[ ] Cursor changes to pointer on hover
[ ] Click vertex navigates to page

**Navigation:**
[ ] Click Mission (top) → goes to /dashboard
[ ] Click Forge (front-left) → goes to /workbench
[ ] Click Docs (front-right) → goes to /docs/briefing
[ ] Click Gov (back) → goes to /governance/monolith

**Camera transitions:**
[ ] Smooth fly-in when clicking vertex
[ ] Camera zooms to clicked vertex position
[ ] Tetrahedron stays visible in background
[ ] Can still see other vertices
[ ] Can click back button to return home
[ ] Camera flies back out smoothly

**Interactions:**
[ ] Vertices respond to hover
[ ] Haptic feedback on click (if supported)
[ ] Labels readable at all distances
[ ] Point lights create glow effect
[ ] Rotation animations smooth

**Pointer events:**
[ ] Can click vertices through content layer
[ ] Can click buttons on content pages
[ ] No conflicts between layers
[ ] Cursor changes appropriately

---

EXPECTED EXPERIENCE:

**User opens app:**
1. Sees tetrahedron floating in center
2. 4 glowing vertices labeled
3. Text at bottom: "CLICK A VERTEX TO NAVIGATE"

**User hovers Mission vertex (cyan, top):**
1. Vertex scales up 1.3x
2. Glow intensifies
3. Label brightens
4. Cursor becomes pointer
5. Haptic feedback (light)

**User clicks Mission vertex:**
1. Haptic feedback (heavy)
2. Camera begins flying toward vertex
3. Tetrahedron rotates slightly
4. Dashboard page loads
5. Camera settles at vertex position
6. User can still see tetrahedron (now from inside)

**User navigates:**
- Can click other vertices to move between sections
- Camera flies smoothly between nodes
- Always maintains spatial context
- Feels like moving through a geometric structure

**User clicks back:**
- Camera flies back to home position
- Full tetrahedron view restored
- Ready to navigate again

---

TROUBLESHOOTING:

**If vertices not clickable:**
- Check pointer-events-auto on canvas layer
- Check pointer-events-none on content layer
- Verify onClick handlers on Vertex mesh

**If camera doesn't move:**
- Check SceneController is mounted
- Verify VERTEX_POSITIONS imported correctly
- Check route mapping in ROUTE_TO_NODE

**If transitions jerky:**
- Increase lerp factor (currently 0.05)
- Add easing function
- Check frame rate (should be 60fps)

**If can't click content:**
- Check pointer-events-auto on children wrapper
- Verify z-index layering
- Test with simple button on page

---

EXECUTE THIS PROMPT NOW.

Implement Spatial OS.
Tetrahedron becomes navigation.
Kill old menu system.
Camera flies to vertices.
Experience geometric space.
```

---

**⚡ OPERATION: SPATIAL OS ⚡**
