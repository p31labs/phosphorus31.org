# OPERATION: LIVING GEOMETRY
## Restore Life + Center Resonance Hub

---

## THE FIXES

### 1. Orb Appearance
```
BEFORE: Flat, lifeless
AFTER: Liquid blob, alive, breathing
```

**All orbs:**
- Liquid distortion material
- Vibrant color (even when locked, just 60% brightness)
- Wireframe LARGER than blob (cage effect)
- Breathing animation
- Gentle rotation
- Point light emission

---

### 2. Center Resonance Orb
```
CONCEPT: The Hub

Position: Center of tetrahedron (0, 0, 0)
Appearance: Larger liquid blob
Color: White/cyan gradient
Function: Navigation hub
Interaction: Double-click to enter next level
Visual: Pulsing, breathing, ALIVE
```

**The Door:**
- Double-click center orb → Navigate to customization space
- Pulsing animation (heartbeat)
- Brighter than vertex orbs
- Label: "RESONANCE HUB" or "ENTER"

---

### 3. Zoom Range
```
BEFORE: 4-15 units (limited)
AFTER: 2-30 units (massive range)

Close: See individual orb details
Far: See full structure
```

---

### 4. Starting Size
```
Camera: [0, 0, 12] (current screenshot size)
FOV: 50
Perfect starting view
```

---

## CURSOR PROMPT: LIVING GEOMETRY

```
TASK: Restore life to geometry + add center resonance hub

PRIORITY: CRITICAL - Make it ALIVE

STEP 1: Fix Vertex appearance (liquid blob + life)

File: src/components/canvas/Vertex.tsx

UPDATE appearance:

```typescript
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFrame } from '@react-three/fiber';
import { Html, MeshDistortMaterial } from '@react-three/drei';
import { useHaptics } from '@/lib/hooks/useHaptics';
import { useNavigationStore } from '@/lib/store/navigationStore';
import { useProgressStore } from '@/lib/store/progressStore';
import { VertexConfig } from '@/lib/types/tetrahedron';
import * as THREE from 'three';

interface VertexProps {
  position: [number, number, number];
  index: number;
  config: VertexConfig;
  tetrahedronId: string;
}

export function Vertex({ position, index, config, tetrahedronId }: VertexProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);
  const router = useRouter();
  const { trigger } = useHaptics();
  const navigate = useNavigationStore((s) => s.navigate);
  const isUnlocked = useProgressStore((s) => 
    s.isVertexUnlocked(tetrahedronId, index)
  );
  
  const [hovered, setHover] = useState(false);
  
  const isLocked = config.state === 'locked' && !isUnlocked;
  
  // Animation with more life
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation
      meshRef.current.rotation.x += delta * 0.3;
      meshRef.current.rotation.y += delta * 0.4;
      
      // Breathing (more pronounced)
      const breath = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.08;
      meshRef.current.scale.setScalar(breath);
    }
    
    // Wireframe rotation (opposite, slower)
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y -= delta * 0.25;
      wireframeRef.current.rotation.z += delta * 0.15;
    }
  });
  
  const handleDoubleClick = (e: THREE.Event) => {
    e.stopPropagation();
    
    if (isLocked) {
      trigger('error');
      return;
    }
    
    trigger('heavy');
    
    if (config.path) {
      router.push(config.path);
    } else if (config.tetrahedronId) {
      navigate(config.tetrahedronId);
    }
  };
  
  return (
    <group position={new THREE.Vector3(...position)}>
      {/* Liquid blob - ALIVE */}
      <mesh
        ref={meshRef}
        onDoubleClick={handleDoubleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHover(true);
          if (!isLocked) {
            trigger('light');
            document.body.style.cursor = 'pointer';
          }
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.35, 64, 64]} />
        <MeshDistortMaterial
          color={isLocked ? new THREE.Color(config.color).multiplyScalar(0.6) : config.color}
          emissive={config.color}
          emissiveIntensity={isLocked ? 0.3 : 0.6}
          roughness={0.2}
          metalness={0.8}
          distort={0.4} // More distortion
          speed={2.5}
          opacity={1} // Always solid
          transparent={false}
        />
      </mesh>
      
      {/* Wireframe cage - LARGER than blob */}
      <mesh ref={wireframeRef} scale={[1.8, 1.8, 1.8]}>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={config.color}
          wireframe
          transparent
          opacity={isLocked ? 0.2 : 0.4}
          emissive={config.color}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Lock icon */}
      {isLocked && (
        <Html position={[0, 0, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="text-xl opacity-60">🔒</div>
        </Html>
      )}
      
      {/* Label - only on hover */}
      {hovered && (
        <Html
          distanceFactor={10}
          position={[0, 0.8, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="
            px-4 py-2 rounded-full
            bg-black/90 backdrop-blur-sm
            border border-cyan-500/60
            whitespace-nowrap
            animate-in fade-in duration-200
          ">
            <span className="text-sm font-bold text-white flex items-center gap-2">
              <span className="text-lg">{config.icon}</span>
              {config.label}
            </span>
          </div>
        </Html>
      )}
      
      {/* Point light - always emit */}
      <pointLight
        distance={6}
        intensity={isLocked ? 0.5 : hovered ? 2 : 1}
        color={config.color}
      />
    </group>
  );
}
```

---

STEP 2: Create Center Resonance Orb (The Hub)

File: src/components/canvas/ResonanceHub.tsx (NEW)

```typescript
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useFrame } from '@react-three/fiber';
import { Html, MeshDistortMaterial } from '@react-three/drei';
import { useHaptics } from '@/lib/hooks/useHaptics';
import * as THREE from 'three';

export function ResonanceHub() {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const router = useRouter();
  const { trigger } = useHaptics();
  const [hovered, setHover] = useState(false);
  
  // Pulsing heartbeat animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Slow rotation
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      
      // Heartbeat pulse (two beats)
      const time = state.clock.elapsedTime;
      const beat1 = Math.sin(time * 3) * 0.5 + 0.5;
      const beat2 = Math.sin(time * 6) * 0.3 + 0.7;
      const pulse = 1 + (beat1 * beat2) * 0.15;
      
      meshRef.current.scale.setScalar(pulse);
    }
    
    // Outer cage rotation (opposite)
    if (outerRef.current) {
      outerRef.current.rotation.y -= delta * 0.4;
      outerRef.current.rotation.z += delta * 0.2;
    }
  });
  
  const handleDoubleClick = (e: THREE.Event) => {
    e.stopPropagation();
    trigger('heavy');
    
    // Navigate to customization/next level
    router.push('/customize');
  };
  
  return (
    <group position={[0, 0, 0]}>
      {/* Core resonance orb */}
      <mesh
        ref={meshRef}
        onDoubleClick={handleDoubleClick}
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
        <sphereGeometry args={[0.25, 64, 64]} />
        <MeshDistortMaterial
          color="#ffffff"
          emissive="#00ffff"
          emissiveIntensity={hovered ? 2 : 1}
          roughness={0.1}
          metalness={0.9}
          distort={0.5}
          speed={3}
        />
      </mesh>
      
      {/* Outer wireframe */}
      <mesh ref={outerRef} scale={[1.6, 1.6, 1.6]}>
        <octahedronGeometry args={[0.25, 0]} />
        <meshStandardMaterial
          color="#00ffff"
          wireframe
          transparent
          opacity={hovered ? 0.6 : 0.3}
          emissive="#00ffff"
          emissiveIntensity={0.4}
        />
      </mesh>
      
      {/* Label on hover */}
      {hovered && (
        <Html
          distanceFactor={10}
          position={[0, 0.5, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="
            px-4 py-2 rounded-full
            bg-white/95 backdrop-blur-sm
            border-2 border-cyan-400
            whitespace-nowrap
            animate-in fade-in duration-200
          ">
            <span className="text-sm font-black text-black flex items-center gap-2">
              <span className="text-lg">⚡</span>
              RESONANCE HUB
            </span>
          </div>
        </Html>
      )}
      
      {/* Bright point light */}
      <pointLight
        distance={10}
        intensity={hovered ? 4 : 2}
        color="#00ffff"
      />
      
      {/* Ambient glow */}
      <pointLight
        distance={5}
        intensity={1}
        color="#ffffff"
      />
    </group>
  );
}
```

---

STEP 3: Add ResonanceHub to DynamicTetrahedron

File: src/components/canvas/DynamicTetrahedron.tsx

UPDATE to include center orb:

```typescript
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vertex } from './Vertex';
import { Edge } from './Edge';
import { ResonanceHub } from './ResonanceHub';
import { VERTEX_POSITIONS, EDGE_INDICES } from '@/lib/math/constants';
import { TetrahedronConfig } from '@/lib/types/tetrahedron';
import * as THREE from 'three';

interface DynamicTetrahedronProps {
  config: TetrahedronConfig;
}

export function DynamicTetrahedron({ config }: DynamicTetrahedronProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Very slow auto-rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });
  
  return (
    <>
      <group ref={groupRef}>
        {/* Center Resonance Hub */}
        <ResonanceHub />
        
        {/* Vertices */}
        {config.vertices.map((vertexConfig, i) => (
          <Vertex
            key={i}
            position={VERTEX_POSITIONS[i] as [number, number, number]}
            index={i}
            config={vertexConfig}
            tetrahedronId={config.id}
          />
        ))}
        
        {/* Edges */}
        {EDGE_INDICES.map(([start, end], i) => (
          <Edge
            key={i}
            start={VERTEX_POSITIONS[start] as [number, number, number]}
            end={VERTEX_POSITIONS[end] as [number, number, number]}
          />
        ))}
      </group>
      
      {/* Controls - WIDER zoom range */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        rotateSpeed={1.0}
        zoomSpeed={0.8}
        dampingFactor={0.05}
        enableDamping={true}
        minDistance={2} // Very close
        maxDistance={30} // Very far
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />
    </>
  );
}
```

---

STEP 4: Adjust starting camera position

File: src/components/layout/CanvasLayer.tsx

UPDATE camera to match screenshot:

```typescript
<Canvas
  key={canvasKey}
  className="w-full h-full"
  camera={{ 
    position: [0, 0, 12], // Starting size from screenshot
    fov: 50
  }}
  gl={{ 
    antialias: true,
    alpha: true,
  }}
  dpr={[1, 2]}
>
```

---

STEP 5: Create customization page (where center orb leads)

File: src/app/customize/page.tsx (NEW)

```typescript
'use client';

import { useRouter } from 'next/navigation';

export default function CustomizePage() {
  const router = useRouter();
  
  return (
    <div className="fixed inset-0 flex items-center justify-center p-6 pointer-events-none">
      <div className="w-full max-w-4xl pointer-events-auto">
        <div className="
          p-8
          bg-black/20
          backdrop-blur-md
          border border-cyan-500/30
          rounded-2xl
        ">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-cyan-400 mb-2">
                ⚡ Resonance Hub
              </h1>
              <p className="text-gray-400">
                Customize your tetrahedron
              </p>
            </div>
            
            <button
              onClick={() => router.push('/')}
              className="
                px-6 py-3
                bg-gray-900/80 backdrop-blur-sm
                border border-cyan-500/30
                rounded-lg
                text-cyan-400 font-bold
                hover:border-cyan-500/60
                transition-all
              "
            >
              ← Back
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vertex Colors */}
            <div className="p-6 bg-black/30 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Vertex Colors
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Customize the color of each vertex
              </p>
              <div className="space-y-3">
                {['Mission', 'Forge', 'Docs', 'Gov'].map((name, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-cyan-500" />
                    <span className="text-white font-medium">{name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Particle Effects */}
            <div className="p-6 bg-black/30 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Particle Flow
              </h2>
              <p className="text-sm text-gray-400 mb-4">
                Adjust particle animation
              </p>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Speed</label>
                  <input type="range" min="0" max="100" className="w-full" />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Density</label>
                  <input type="range" min="0" max="100" className="w-full" />
                </div>
              </div>
            </div>
            
            {/* More options... */}
            <div className="md:col-span-2 p-6 bg-black/30 rounded-lg border border-gray-700">
              <h2 className="text-xl font-bold text-white mb-4">
                Coming Soon
              </h2>
              <p className="text-gray-400">
                More customization options in development...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

STEP 6: Update hint text

File: src/app/page.tsx

UPDATE hint:

```typescript
<div className="fixed inset-0 flex items-end justify-center pb-12 pointer-events-none">
  <div className="text-center space-y-2">
    <p className="text-sm tracking-[0.3em] uppercase font-bold text-cyan-400/60">
      Double-click orbs to navigate
    </p>
    <p className="text-xs text-gray-600">
      Center orb → Customize • Drag to rotate • Scroll to zoom
    </p>
  </div>
</div>
```

---

TESTING CHECKLIST:

**Orb Life:**
[ ] Liquid distortion visible
[ ] Breathing animation (8% scale)
[ ] Rotating smoothly
[ ] Vibrant colors (even when locked)
[ ] Locked = 60% brightness (still colorful)
[ ] Point light emission
[ ] Feels ALIVE

**Wireframes:**
[ ] Larger than blob (1.8× scale)
[ ] Cage effect visible
[ ] Rotating opposite direction
[ ] Transparent (0.2-0.4 opacity)
[ ] Matches orb color

**Center Resonance Hub:**
[ ] Visible at center (0,0,0)
[ ] Larger presence
[ ] White/cyan color
[ ] Pulsing heartbeat
[ ] Brighter than vertices
[ ] Hover shows label
[ ] Double-click navigates to /customize
[ ] Feels like THE HUB

**Zoom Range:**
[ ] Can zoom VERY close (minDistance: 2)
[ ] Can zoom VERY far (maxDistance: 30)
[ ] Starting position: 12 units (screenshot size)
[ ] Smooth zoom
[ ] No jump/jank

**Controls:**
[ ] Drag to rotate (smooth)
[ ] Throw works (momentum)
[ ] Scroll to zoom
[ ] Can't pan
[ ] Damping feels good

**Navigation:**
[ ] Vertex double-click → their page
[ ] Center orb double-click → /customize
[ ] Locked vertices → error haptic
[ ] Labels show on hover only

---

EXECUTE THIS PROMPT NOW.

Restore life to orbs.
Add center resonance hub.
Make it ALIVE.
Make it the DOOR.
```

---

**⚡ OPERATION: LIVING GEOMETRY ⚡**
