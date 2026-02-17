# OPERATION: CLEAN SLATE
## Reset to Simple Perfection

---

## THE PROBLEMS

```
❌ Absolute chaos
❌ Screen vomit
❌ Too many effects
❌ Skips orb homepage
❌ Skips onboarding
❌ Orbs look different on each screen
❌ Too many wireframes
❌ Labels always visible
❌ Info cards opaque
❌ Can't zoom/throw
❌ Single click instead of double
```

---

## THE SOLUTION

**SIMPLE. CLEAN. CONSISTENT.**

```
✅ ONE orb design (everywhere)
✅ Liquid blob inside ONE wireframe
✅ All orbs visible (dull when locked)
✅ Labels ONLY on hover
✅ Info cards transparent/minimal
✅ Particle flow between orbs (keep)
✅ Can zoom in/out
✅ Can throw (momentum)
✅ Double-click to activate
✅ Orb homepage first
✅ Onboarding works
```

---

## CURSOR PROMPT: CLEAN SLATE

```
TASK: Reset to clean, simple tetrahedron

PRIORITY: CRITICAL - Complete reset needed

STEP 1: Simple Vertex (ONE design for all screens)

File: src/components/canvas/Vertex.tsx

REPLACE ENTIRE FILE:

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
  
  // Determine if locked
  const isLocked = config.state === 'locked' && !isUnlocked;
  
  // Animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      
      // Subtle breathing
      const breath = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.03;
      meshRef.current.scale.setScalar(breath);
    }
    
    // Wireframe rotation (opposite direction)
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y -= delta * 0.3;
      wireframeRef.current.rotation.z += delta * 0.2;
    }
  });
  
  // Double-click handler
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
      {/* Liquid blob core */}
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
        <sphereGeometry args={[0.4, 64, 64]} />
        <MeshDistortMaterial
          color={isLocked ? '#333333' : config.color}
          emissive={isLocked ? '#111111' : config.color}
          emissiveIntensity={isLocked ? 0.1 : 0.5}
          roughness={0.2}
          metalness={0.8}
          distort={0.3}
          speed={2}
          opacity={isLocked ? 0.3 : 1}
          transparent={isLocked}
        />
      </mesh>
      
      {/* Single wireframe cage */}
      <mesh ref={wireframeRef} scale={[1.5, 1.5, 1.5]}>
        <icosahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={isLocked ? '#333333' : config.color}
          wireframe
          transparent
          opacity={isLocked ? 0.1 : 0.3}
        />
      </mesh>
      
      {/* Lock icon (if locked) */}
      {isLocked && (
        <Html position={[0, 0, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="text-2xl opacity-50">🔒</div>
        </Html>
      )}
      
      {/* Label - ONLY on hover */}
      {hovered && (
        <Html
          distanceFactor={10}
          position={[0, 0.7, 0]}
          center
          style={{ pointerEvents: 'none' }}
        >
          <div className="
            px-3 py-1.5 rounded-full
            bg-black/80 backdrop-blur-sm
            border border-cyan-500/50
            whitespace-nowrap
            animate-in fade-in duration-200
          ">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{config.icon}</span>
              {config.label}
            </span>
          </div>
        </Html>
      )}
      
      {/* Point light */}
      {!isLocked && (
        <pointLight
          distance={6}
          intensity={hovered ? 2 : 0.8}
          color={config.color}
        />
      )}
    </group>
  );
}
```

---

STEP 2: Simple tetrahedron with zoom/throw controls

File: src/components/canvas/DynamicTetrahedron.tsx

REPLACE ENTIRE FILE:

```typescript
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vertex } from './Vertex';
import { Edge } from './Edge';
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
      
      {/* Controls - can zoom, throw, rotate */}
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        rotateSpeed={1.0}
        zoomSpeed={0.8}
        dampingFactor={0.05}
        enableDamping={true}
        minDistance={4}
        maxDistance={15}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI - Math.PI / 6}
      />
    </>
  );
}
```

---

STEP 3: Simple Edge with particle flow

File: src/components/canvas/Edge.tsx

REPLACE ENTIRE FILE:

```typescript
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EdgeProps {
  start: [number, number, number];
  end: [number, number, number];
}

export function Edge({ start, end }: EdgeProps) {
  const lineRef = useRef<THREE.Line>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Create line geometry
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array([...start, ...end]);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [start, end]);
  
  // Create particles along edge
  const { particlePositions, particleProgress } = useMemo(() => {
    const count = 20;
    const positions = new Float32Array(count * 3);
    const progress = new Float32Array(count);
    
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const pos = startVec.clone().lerp(endVec, t);
      positions[i * 3] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;
      progress[i] = t;
    }
    
    return { particlePositions: positions, particleProgress: progress };
  }, [start, end]);
  
  // Animate particles
  useFrame((state, delta) => {
    if (!particlesRef.current) return;
    
    const positions = particlesRef.current.geometry.attributes.position;
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    
    for (let i = 0; i < positions.count; i++) {
      // Update progress
      particleProgress[i] += delta * 0.2;
      if (particleProgress[i] > 1) particleProgress[i] = 0;
      
      // Update position
      const pos = startVec.clone().lerp(endVec, particleProgress[i]);
      positions.array[i * 3] = pos.x;
      positions.array[i * 3 + 1] = pos.y;
      positions.array[i * 3 + 2] = pos.z;
    }
    
    positions.needsUpdate = true;
  });
  
  return (
    <group>
      {/* Edge line */}
      <line ref={lineRef} geometry={geometry}>
        <lineBasicMaterial color="#06b6d4" opacity={0.3} transparent />
      </line>
      
      {/* Flowing particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlePositions.length / 3}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          color="#00ffff"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
    </group>
  );
}
```

---

STEP 4: Remove chaos from CanvasLayer

File: src/components/layout/CanvasLayer.tsx

REPLACE ENTIRE FILE:

```typescript
'use client';

import { Canvas } from '@react-three/fiber';
import { DynamicTetrahedron } from '@/components/canvas/DynamicTetrahedron';
import { Starfield } from '@/components/canvas/Starfield';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { useNavigationStore } from '@/lib/store/navigationStore';
import { TETRAHEDRON_CONFIGS } from '@/lib/types/tetrahedron';
import { Suspense, useContext } from 'react';
import { CanvasKeyContext } from './CanvasKeyProvider';

export function CanvasLayer() {
  const canvasKey = useContext(CanvasKeyContext);
  const currentTetrahedronId = useNavigationStore((s) => s.currentTetrahedronId);
  
  const config = TETRAHEDRON_CONFIGS[currentTetrahedronId?.toUpperCase()] 
    || TETRAHEDRON_CONFIGS.BASE;
  
  return (
    <CanvasErrorBoundary>
      <Canvas
        key={canvasKey}
        className="w-full h-full"
        camera={{ 
          position: [0, 0, 8],
          fov: 50
        }}
        gl={{ 
          antialias: true,
          alpha: true,
        }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        {/* Starfield */}
        <Suspense fallback={null}>
          <Starfield />
        </Suspense>
        
        {/* Tetrahedron */}
        <Suspense fallback={null}>
          <DynamicTetrahedron config={config} />
        </Suspense>
      </Canvas>
    </CanvasErrorBoundary>
  );
}
```

---

STEP 5: Fix home page routing

File: src/app/page.tsx

REPLACE ENTIRE FILE:

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProgressStore } from '@/lib/store/progressStore';
import { useNavigationStore } from '@/lib/store/navigationStore';

export default function HomePage() {
  const router = useRouter();
  const hasCompleted = useProgressStore((s) => s.hasCompletedOnboarding);
  const navigate = useNavigationStore((s) => s.navigate);
  
  useEffect(() => {
    if (!hasCompleted) {
      // First time - show onboarding
      navigate('onboarding');
      router.push('/onboarding/welcome');
    } else {
      // Returning user - show BASE tetrahedron
      navigate('base');
    }
  }, [hasCompleted, navigate, router]);
  
  // Show hint if completed onboarding
  if (!hasCompleted) return null;
  
  return (
    <div className="fixed inset-0 flex items-end justify-center pb-12 pointer-events-none">
      <div className="text-center space-y-2">
        <p className="text-sm tracking-[0.3em] uppercase font-bold text-cyan-400/60">
          Double-click vertices to navigate
        </p>
        <p className="text-xs text-gray-600">
          Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  );
}
```

---

STEP 6: Clean info cards (unlock requirements)

File: src/components/canvas/UnlockInfo.tsx (NEW)

```typescript
'use client';

import { Html } from '@react-three/drei';
import { VertexConfig } from '@/lib/types/tetrahedron';
import { useProgressStore } from '@/lib/store/progressStore';

interface UnlockInfoProps {
  config: VertexConfig;
  position: [number, number, number];
  show: boolean;
}

export function UnlockInfo({ config, position, show }: UnlockInfoProps) {
  const totalHz = useProgressStore((s) => s.totalHzEarned);
  
  if (!show || !config.unlockRequirement) return null;
  
  const requirement = config.unlockRequirement;
  const canAfford = requirement.type === 'hz' && totalHz >= (requirement.value as number);
  
  return (
    <Html
      position={[position[0], position[1] - 0.8, position[2]]}
      center
      style={{ pointerEvents: 'none' }}
    >
      <div className="
        px-3 py-2 rounded-lg
        bg-black/60 backdrop-blur-sm
        border border-gray-700
        text-center
        animate-in fade-in duration-200
      ">
        <div className="text-xs text-gray-400 mb-1">
          Unlock Required
        </div>
        <div className={`text-sm font-bold ${canAfford ? 'text-green-400' : 'text-yellow-400'}`}>
          {requirement.value} Hz
        </div>
      </div>
    </Html>
  );
}
```

---

STEP 7: Update Vertex to show unlock info on hover

File: src/components/canvas/Vertex.tsx

ADD unlock info display:

```typescript
// Import at top
import { UnlockInfo } from './UnlockInfo';

// In return statement, after label:
<UnlockInfo
  config={config}
  position={position}
  show={hovered && isLocked}
/>
```

---

STEP 8: Remove SceneController camera transitions

File: src/components/canvas/SceneController.tsx

DELETE ENTIRE FILE or make it do nothing:

```typescript
export function SceneController() {
  return null;
}
```

---

TESTING CHECKLIST:

**Orb Appearance:**
[ ] Same on all screens
[ ] Liquid distortion
[ ] ONE wireframe
[ ] Dull when locked
[ ] Bright when unlocked
[ ] Breathing animation
[ ] Rotating gently

**Labels:**
[ ] Hidden by default
[ ] Show ONLY on hover
[ ] Clean, minimal
[ ] Black background, cyan border
[ ] Icon + text

**Info Cards:**
[ ] Show unlock requirement on hover (if locked)
[ ] Transparent background
[ ] Minimal, unobtrusive
[ ] Show Hz needed
[ ] Green if can afford

**Particle Flow:**
[ ] Visible along edges
[ ] Smooth animation
[ ] Cyan color
[ ] Continuous loop

**Controls:**
[ ] Click and drag to rotate
[ ] Momentum/throw works
[ ] Scroll to zoom in/out
[ ] Min/max zoom limits
[ ] Smooth damping
[ ] Can't pan

**Interactions:**
[ ] Double-click to activate
[ ] Hover shows label
[ ] Hover shows unlock info (if locked)
[ ] Locked orbs do nothing
[ ] Unlocked orbs navigate

**Navigation:**
[ ] First visit → orb homepage? (if you want)
[ ] Then → onboarding
[ ] After onboarding → BASE tetrahedron
[ ] Returning user → BASE tetrahedron

---

EXECUTE THIS PROMPT NOW.

Clean slate.
Simple perfection.
One orb design.
Proper controls.
No chaos.
```

---

**⚡ OPERATION: CLEAN SLATE ⚡**
