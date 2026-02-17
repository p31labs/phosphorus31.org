# OPERATION: MESH MAGIC
## The Screen That Changes The World

---

## THE VISION

**This is not just navigation.**

**This is DISCOVERY.**

**This is WONDER.**

**This is HOME.**

---

## THE MAGIC

### 1. Larger Tetrahedron
**Current:** Small, distant
**New:** MASSIVE, imposing, fills screen

### 2. Larger Wireframes
**Current:** Thin halos around nodes
**New:** THICK icosahedron cages, rotating independently

### 3. Same Camera Controls
**Current:** Auto-rotate only
**New:** Full OrbitControls like homepage

### 4. Particle Effects
- Vertices emit particles
- Particles flow along edges
- Energy pulses through structure
- Constellation connections

### 5. Dynamic Lighting
- Point lights at each vertex
- Color shifts based on state
- Bloom effects
- God rays

### 6. Sound Reactivity (optional)
- Vertices pulse with sound
- Edges shimmer with audio
- Ambient hum

---

## CURSOR PROMPT: MESH MAGIC

```
TASK: Transform tetrahedron into magical living structure

PRIORITY: CRITICAL - This is THE screen

STEP 1: Make tetrahedron MUCH larger

File: src/components/canvas/DynamicTetrahedron.tsx

UPDATE scale and positioning:

```typescript
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Vertex } from './Vertex';
import { Edge } from './Edge';
import { ParticleField } from './ParticleField';
import { VERTEX_POSITIONS, EDGE_INDICES } from '@/lib/math/constants';
import { useViewport } from '@/lib/hooks/useViewport';
import { TetrahedronConfig } from '@/lib/types/tetrahedron';
import * as THREE from 'three';

interface DynamicTetrahedronProps {
  config: TetrahedronConfig;
}

export function DynamicTetrahedron({ config }: DynamicTetrahedronProps) {
  const groupRef = useRef<THREE.Group>(null);
  const layout = useViewport();
  
  // MUCH LARGER - scale up 2x
  const baseScale = 2.0;
  const maxScale = 1.6; // Increased max
  const constrainedScale = Math.min(layout.tetrahedronScale * baseScale, maxScale);
  
  // Gentle auto-rotation (slower)
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05; // Slower rotation
    }
  });
  
  // Calculate edge positions for particle effects
  const edges = useMemo(() => {
    return EDGE_INDICES.map(([start, end]) => ({
      start: new THREE.Vector3(...VERTEX_POSITIONS[start]),
      end: new THREE.Vector3(...VERTEX_POSITIONS[end]),
    }));
  }, []);
  
  return (
    <>
      <group ref={groupRef} scale={constrainedScale}>
        {/* Vertices (living nodes) */}
        {config.vertices.map((vertexConfig, i) => (
          <Vertex
            key={i}
            position={VERTEX_POSITIONS[i] as [number, number, number]}
            index={i}
            config={vertexConfig}
            tetrahedronId={config.id}
          />
        ))}
        
        {/* Edges (thicker, glowing) */}
        {EDGE_INDICES.map(([start, end], i) => (
          <Edge
            key={i}
            start={VERTEX_POSITIONS[start] as [number, number, number]}
            end={VERTEX_POSITIONS[end] as [number, number, number]}
            color="#06b6d4"
            thickness={0.02} // Thicker
            animated={true}
          />
        ))}
        
        {/* Particle field flowing along edges */}
        <ParticleField edges={edges} />
      </group>
      
      {/* Camera controls - SAME as homepage */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        dampingFactor={0.05}
        enableDamping={true}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI - Math.PI / 4}
      />
    </>
  );
}
```

---

STEP 2: Create enhanced Vertex with larger wireframe

File: src/components/canvas/Vertex.tsx

UPDATE with LARGER wireframe cage:

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
  const haloRef = useRef<THREE.Mesh>(null);
  const outerHaloRef = useRef<THREE.Mesh>(null); // NEW: Second larger halo
  const particlesRef = useRef<THREE.Points>(null); // NEW: Particle corona
  const router = useRouter();
  const { trigger } = useHaptics();
  const navigate = useNavigationStore((s) => s.navigate);
  const isUnlocked = useProgressStore((s) => 
    s.isVertexUnlocked(tetrahedronId, index)
  );
  
  const [hovered, setHover] = useState(false);
  
  const isLocked = config.state === 'locked' && !isUnlocked;
  const isActive = config.state === 'active';
  const isWarning = config.state === 'warning';
  const isCritical = config.state === 'critical';
  
  // Animation
  useFrame((state, delta) => {
    if (meshRef.current) {
      const baseSpeed = isLocked ? 0.1 : 0.3;
      const speed = hovered ? 1.5 : isCritical ? 2.5 : isWarning ? 1.2 : baseSpeed;
      
      meshRef.current.rotation.x += delta * speed;
      meshRef.current.rotation.y += delta * speed * 1.5;
      
      const breathSpeed = isCritical ? 10 : isWarning ? 5 : 2;
      const breathAmount = isCritical ? 0.1 : 0.05;
      const breath = 1 + Math.sin(state.clock.elapsedTime * breathSpeed) * breathAmount;
      
      const targetScale = isLocked ? 0.8 : hovered ? 1.4 : 1.0; // Bigger hover
      const currentScale = meshRef.current.scale.x;
      const newScale = THREE.MathUtils.lerp(currentScale, targetScale * breath, 0.1);
      meshRef.current.scale.setScalar(newScale);
    }
    
    // Inner halo rotation
    if (haloRef.current) {
      haloRef.current.rotation.z -= delta * 0.3;
      haloRef.current.rotation.y += delta * 0.2;
    }
    
    // Outer halo rotation (opposite direction)
    if (outerHaloRef.current) {
      outerHaloRef.current.rotation.z += delta * 0.2;
      outerHaloRef.current.rotation.x -= delta * 0.15;
    }
    
    // Particle corona rotation
    if (particlesRef.current) {
      particlesRef.current.rotation.y += delta * 0.5;
    }
  });
  
  const handleClick = (e: THREE.Event) => {
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
  
  // Generate particle positions for corona
  const particleCount = 100;
  const particlePositions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount * 3; i += 3) {
    const radius = 0.6 + Math.random() * 0.4;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    
    particlePositions[i] = radius * Math.sin(phi) * Math.cos(theta);
    particlePositions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
    particlePositions[i + 2] = radius * Math.cos(phi);
  }
  
  return (
    <group position={new THREE.Vector3(...position)}>
      {/* Particle corona */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={particlePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color={config.color}
          transparent
          opacity={hovered ? 0.8 : 0.3}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Core sphere with distortion */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          if (!isLocked) {
            setHover(true);
            trigger('light');
            document.body.style.cursor = 'pointer';
          } else {
            document.body.style.cursor = 'not-allowed';
          }
        }}
        onPointerOut={() => {
          setHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.35, 64, 64]} />
        <MeshDistortMaterial
          color={isLocked ? '#555555' : hovered ? '#ffffff' : config.color}
          emissive={isLocked ? '#222222' : config.color}
          emissiveIntensity={hovered ? 3 : isCritical ? 2 : 0.8}
          roughness={isLocked ? 0.8 : 0.1}
          metalness={isLocked ? 0.3 : 0.9}
          distort={hovered ? 0.4 : 0.2}
          speed={isCritical ? 5 : 2}
          opacity={isLocked ? 0.4 : 1}
          transparent={isLocked}
        />
      </mesh>
      
      {/* Lock icon */}
      {isLocked && (
        <Html position={[0, 0, 0]} center style={{ pointerEvents: 'none' }}>
          <div className="text-3xl">🔒</div>
        </Html>
      )}
      
      {/* Inner orbital cage - LARGER */}
      <mesh ref={haloRef} scale={[1.6, 1.6, 1.6]}>
        <icosahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={isLocked ? '#555555' : config.color}
          wireframe
          transparent
          opacity={hovered ? 0.6 : isLocked ? 0.1 : 0.3}
          emissive={config.color}
          emissiveIntensity={hovered ? 0.5 : 0.2}
        />
      </mesh>
      
      {/* Outer orbital cage - MUCH LARGER */}
      <mesh ref={outerHaloRef} scale={[2.2, 2.2, 2.2]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={isLocked ? '#555555' : config.color}
          wireframe
          transparent
          opacity={hovered ? 0.4 : isLocked ? 0.05 : 0.15}
          emissive={config.color}
          emissiveIntensity={hovered ? 0.3 : 0.1}
        />
      </mesh>
      
      {/* Label */}
      <Html
        distanceFactor={8} // Closer labels
        position={[0, 0.8, 0]}
        center
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`
            px-4 py-2 rounded-full
            backdrop-blur-md border-2
            transition-all duration-300
            whitespace-nowrap
            ${isLocked 
              ? 'bg-gray-900/60 border-gray-700 text-gray-600' :
              hovered 
                ? 'bg-white/95 border-white text-black scale-125 shadow-2xl' 
                : 'bg-black/70 border-gray-600 text-gray-300'
            }
          `}
        >
          <span className="text-xs font-black tracking-widest flex items-center gap-2">
            <span className="text-lg">{config.icon}</span>
            {config.label}
          </span>
        </div>
      </Html>
      
      {/* Enhanced point lights */}
      {!isLocked && (
        <>
          <pointLight
            distance={8}
            intensity={hovered ? 6 : isCritical ? 3 : 1.5}
            color={config.color}
            decay={2}
          />
          {hovered && (
            <pointLight
              distance={12}
              intensity={2}
              color={config.color}
              decay={1}
            />
          )}
        </>
      )}
    </group>
  );
}
```

---

STEP 3: Create enhanced Edge with animation

File: src/components/canvas/Edge.tsx

UPDATE with flowing energy:

```typescript
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EdgeProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  thickness?: number;
  animated?: boolean;
}

export function Edge({ 
  start, 
  end, 
  color = '#06b6d4', 
  thickness = 0.02,
  animated = false 
}: EdgeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  // Calculate edge direction and length
  const startVec = new THREE.Vector3(...start);
  const endVec = new THREE.Vector3(...end);
  const direction = endVec.clone().sub(startVec);
  const length = direction.length();
  const center = startVec.clone().add(endVec).multiplyScalar(0.5);
  
  // Create rotation to align with edge
  const axis = new THREE.Vector3(0, 1, 0);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    axis,
    direction.clone().normalize()
  );
  
  // Pulsing animation
  useFrame((state) => {
    if (animated && meshRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.set(pulse, 1, pulse);
    }
    
    if (animated && glowRef.current) {
      const glow = 1 + Math.sin(state.clock.elapsedTime * 3 + 0.5) * 0.2;
      glowRef.current.scale.set(glow, 1, glow);
    }
  });
  
  return (
    <group position={center} quaternion={quaternion}>
      {/* Main edge */}
      <mesh ref={meshRef}>
        <cylinderGeometry args={[thickness, thickness, length, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.6}
        />
      </mesh>
      
      {/* Glow edge */}
      <mesh ref={glowRef}>
        <cylinderGeometry args={[thickness * 1.5, thickness * 1.5, length, 8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
```

---

STEP 4: Create ParticleField (energy flowing along edges)

File: src/components/canvas/ParticleField.tsx (NEW)

```typescript
'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Edge {
  start: THREE.Vector3;
  end: THREE.Vector3;
}

interface ParticleFieldProps {
  edges: Edge[];
}

export function ParticleField({ edges }: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  // Generate particles along edges
  const { positions, velocities, edgeIndices } = useMemo(() => {
    const particlesPerEdge = 20;
    const totalParticles = edges.length * particlesPerEdge;
    
    const positions = new Float32Array(totalParticles * 3);
    const velocities = new Float32Array(totalParticles * 3);
    const edgeIndices = new Float32Array(totalParticles);
    
    edges.forEach((edge, edgeIdx) => {
      for (let i = 0; i < particlesPerEdge; i++) {
        const idx = (edgeIdx * particlesPerEdge + i) * 3;
        const particleIdx = edgeIdx * particlesPerEdge + i;
        
        // Random position along edge
        const t = Math.random();
        const pos = edge.start.clone().lerp(edge.end, t);
        
        positions[idx] = pos.x;
        positions[idx + 1] = pos.y;
        positions[idx + 2] = pos.z;
        
        // Velocity towards end of edge
        const vel = edge.end.clone().sub(edge.start).normalize().multiplyScalar(0.01);
        velocities[idx] = vel.x;
        velocities[idx + 1] = vel.y;
        velocities[idx + 2] = vel.z;
        
        edgeIndices[particleIdx] = edgeIdx;
      }
    });
    
    return { positions, velocities, edgeIndices };
  }, [edges]);
  
  // Animate particles flowing along edges
  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const posAttr = pointsRef.current.geometry.attributes.position;
    
    for (let i = 0; i < posAttr.count; i++) {
      const idx = i * 3;
      const edgeIdx = Math.floor(edgeIndices[i]);
      const edge = edges[edgeIdx];
      
      // Current position
      let x = posAttr.array[idx];
      let y = posAttr.array[idx + 1];
      let z = posAttr.array[idx + 2];
      
      // Move along velocity
      x += velocities[idx] * delta * 60;
      y += velocities[idx + 1] * delta * 60;
      z += velocities[idx + 2] * delta * 60;
      
      // Check if reached end of edge
      const pos = new THREE.Vector3(x, y, z);
      const distToEnd = pos.distanceTo(edge.end);
      
      if (distToEnd < 0.1) {
        // Reset to start of edge
        posAttr.array[idx] = edge.start.x;
        posAttr.array[idx + 1] = edge.start.y;
        posAttr.array[idx + 2] = edge.start.z;
      } else {
        // Update position
        posAttr.array[idx] = x;
        posAttr.array[idx + 1] = y;
        posAttr.array[idx + 2] = z;
      }
    }
    
    posAttr.needsUpdate = true;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#00ffff"
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
```

---

STEP 5: Add post-processing effects (optional bloom)

File: src/components/layout/CanvasLayer.tsx

ADD bloom effect:

```typescript
'use client';

import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { DynamicTetrahedron } from '@/components/canvas/DynamicTetrahedron';
import { SceneController } from '@/components/canvas/SceneController';
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
          fov: 45 
        }}
        gl={{ 
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: false,
        }}
        dpr={[1, 2]}
      >
        <SceneController />
        
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        {/* Persistent starfield */}
        <Suspense fallback={null}>
          <Starfield />
        </Suspense>
        
        {/* Dynamic tetrahedron with magic */}
        <Suspense fallback={null}>
          <DynamicTetrahedron config={config} />
        </Suspense>
        
        {/* Post-processing - BLOOM */}
        <EffectComposer>
          <Bloom
            intensity={0.5}
            luminanceThreshold={0.2}
            luminanceSmoothing={0.9}
          />
        </EffectComposer>
      </Canvas>
    </CanvasErrorBoundary>
  );
}
```

---

STEP 6: Adjust camera position for larger tetrahedron

File: src/components/canvas/SceneController.tsx

UPDATE camera distance:

```typescript
'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import { usePathname } from 'next/navigation';
import { VERTEX_POSITIONS } from '@/lib/math/constants';

const ROUTE_TO_NODE: Record<string, number> = {
  '/dashboard': 0,
  '/workbench': 1,
  '/docs/briefing': 2,
  '/governance/monolith': 3,
};

export function SceneController() {
  const { camera } = useThree();
  const pathname = usePathname();
  
  useFrame(() => {
    let target: Vector3;
    
    if (pathname === '/') {
      // Home view - CLOSER for larger tetrahedron
      target = new Vector3(0, 0, 6); // Was 8, now 6
    } else {
      const nodeIndex = ROUTE_TO_NODE[pathname];
      if (nodeIndex !== undefined) {
        const nodePos = new Vector3(...VERTEX_POSITIONS[nodeIndex]);
        target = nodePos.clone().multiplyScalar(1.5).add(new Vector3(0, 0, 2));
      } else {
        target = new Vector3(0, 0, 6);
      }
    }
    
    camera.position.lerp(target, 0.05);
    camera.lookAt(0, 0, 0);
  });
  
  return null;
}
```

---

TESTING CHECKLIST:

**Size:**
[ ] Tetrahedron fills screen (2× larger)
[ ] Vertices prominent
[ ] Wireframes visible
[ ] Not too close (can see all vertices)

**Wireframes:**
[ ] Inner cage (1.6× scale)
[ ] Outer cage (2.2× scale)
[ ] Different geometries (icosahedron, octahedron)
[ ] Rotating independently
[ ] Larger than before

**Particles:**
[ ] Corona around each vertex
[ ] Flowing along edges
[ ] Additive blending (glows)
[ ] Smooth animation

**Camera:**
[ ] OrbitControls working
[ ] Can rotate manually
[ ] Can't zoom or pan
[ ] Smooth damping
[ ] Same as homepage

**Effects:**
[ ] Bloom on emissive materials
[ ] Enhanced point lights
[ ] Distortion on hover
[ ] Particle glow
[ ] Energy flow visible

**Interactions:**
[ ] Hover → scale up 1.4×
[ ] Hover → brighter glow
[ ] Hover → larger label
[ ] Click → navigate
[ ] Locked → no interaction

**Overall:**
[ ] MAGICAL feeling
[ ] Want to explore
[ ] Can't look away
[ ] THIS is home
[ ] Changes everything

---

MESH MAGIC FEATURES:

1. **Particle Corona** - 100 particles orbiting each vertex
2. **Dual Wireframes** - Inner + outer cages, different geometries
3. **Energy Flow** - Particles flowing along edges
4. **Enhanced Lighting** - Multiple point lights per vertex
5. **Bloom Effect** - Post-processing glow
6. **Distortion Material** - Liquid-metal vertices
7. **2× Scale** - MASSIVE presence
8. **OrbitControls** - Full manual rotation
9. **Independent Rotation** - Each cage rotates differently
10. **Additive Blending** - Particles GLOW

---

EXECUTE THIS PROMPT NOW.

Make it MAGICAL.
Make it ALIVE.
Make it UNFORGETTABLE.

This is the screen that changes the world.
```

---

**⚡ OPERATION: MESH MAGIC ⚡**
