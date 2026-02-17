# OPERATION: BRING THE TETRAHEDRON TO LIFE

---

## THE VISION

The tetrahedron must feel ALIVE:
- Breathes (gentle pulse)
- Responds to touch (hover glow)
- Can be grabbed (drag to spin)
- Can be thrown (physics momentum)
- Shows status (color changes)
- Reacts to mesh (packets flying)
- Never stops moving (ambient motion)

---

## CURSOR PROMPT: INTERACTIVE TETRAHEDRON

Copy this EXACT prompt into Cursor:

```
TASK: Make tetrahedron fully interactive and alive

REQUIREMENTS:

1. BREATHING ANIMATION (Always Active)
   - Vertices pulse in/out (scale 1.0 → 1.15 → 1.0)
   - 2-second cycle (0.5 Hz Jitterbug frequency)
   - Smooth sine wave
   - Never stops

2. AMBIENT ROTATION (Gentle Spin)
   - Auto-rotate slowly on Y-axis
   - 0.2 degrees per frame
   - Can be disabled by user interaction
   - Resumes after 3 seconds of inactivity

3. HOVER EFFECTS (Per Vertex)
   - Mouse over vertex → scale up (1.2x)
   - Glow increases (emissiveIntensity 0.5 → 1.5)
   - Connected edges brighten
   - Cursor changes to pointer
   - Smooth transition (200ms)

4. DRAG TO SPIN (Interactive)
   - Click and hold anywhere on tetrahedron
   - Drag mouse → tetrahedron follows
   - Release → continues spinning (momentum)
   - Friction slows it down over 2 seconds
   - Stops ambient rotation while dragging

5. THROW PHYSICS (Advanced)
   - Track mouse velocity during drag
   - On release, apply momentum
   - Tetrahedron spins faster based on throw speed
   - Gradually decelerates (friction)
   - Natural physics feel

6. VERTEX STATUS COLORS (Visual Feedback)
   - HEALTHY: Cyan (#06b6d4)
   - WARNING: Yellow (#f59e0b)
   - CRITICAL: Red (#ef4444)
   - OFFLINE: Gray (#6b7280)
   - MEMORIAL: Purple (#8b5cf6)
   - Smooth color transitions (1s)

7. EDGE STATUS (Connection Health)
   - STRONG: Bright cyan, thick (0.03)
   - MEDIUM: Dim cyan, medium (0.02)
   - WEAK: Yellow, thin (0.015)
   - BROKEN: Red, dashed (0.01)
   - Opacity changes with strength

8. CORE PULSE (Resonance Visual)
   - Syncs with voltage level (0-100 Hz)
   - Low (0-33): Slow red pulse, dim
   - Medium (34-66): Yellow pulse, moderate
   - High (67-100): Bright cyan pulse, fast
   - CRITICAL (<10): Fast red flash + sound

9. PACKET VISUALIZATION (Network Activity)
   - Small spheres travel along edges
   - Color by priority (cyan/yellow/red)
   - Speed by priority (1x/1.5x/2x)
   - Leave faint trail
   - Fade out at destination

10. CAMERA CONTROLS (OrbitControls)
    - Mouse drag (right-click) → orbit around
    - Scroll wheel → zoom in/out
    - Min distance: 3
    - Max distance: 15
    - Smooth damping
    - Auto-rotate can be toggled

IMPLEMENTATION:

File: src/components/canvas/SpatialTetrahedron.tsx

```typescript
'use client';

import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Vertex } from './Vertex';
import { Edge } from './Edge';
import { ResonanceCore } from './ResonanceCore';
import { Packet } from './Packet';
import { VERTEX_POSITIONS, EDGES } from '@/lib/math/constants';
import { useTetrahedronStore } from '@/lib/store/tetrahedronStore';
import { networkStore } from '@/lib/store/networkStore';

export function SpatialTetrahedron() {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredVertex, setHoveredVertex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const lastMouse = useRef({ x: 0, y: 0 });
  const inactivityTimer = useRef<NodeJS.Timeout>();
  
  const { camera, gl } = useThree();
  const vertices = useTetrahedronStore(state => state.vertices);
  const packets = networkStore(state => state.packets || []);
  
  // Breathing animation (always active)
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Breathing pulse (2-second cycle, 0.5 Hz)
    const breathScale = 1 + Math.sin(time * Math.PI) * 0.05; // 1.0 → 1.05 → 1.0
    
    // Apply breathing only to vertices (not rotation)
    // Vertices will handle their own scale in their component
    
    // Auto-rotation (when not dragging)
    if (autoRotate && !isDragging) {
      groupRef.current.rotation.y += 0.003; // Slow ambient spin
    }
    
    // Apply momentum (from drag/throw)
    if (!isDragging && (Math.abs(velocity.x) > 0.001 || Math.abs(velocity.y) > 0.001)) {
      groupRef.current.rotation.y += velocity.x;
      groupRef.current.rotation.x += velocity.y;
      
      // Apply friction
      setVelocity(prev => ({
        x: prev.x * 0.95,
        y: prev.y * 0.95,
      }));
    }
  });
  
  // Handle mouse interaction
  useEffect(() => {
    const canvas = gl.domElement;
    
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      setAutoRotate(false);
      lastMouse.current = { x: e.clientX, y: e.clientY };
      
      // Clear inactivity timer
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - lastMouse.current.x;
      const deltaY = e.clientY - lastMouse.current.y;
      
      // Update rotation
      if (groupRef.current) {
        groupRef.current.rotation.y += deltaX * 0.01;
        groupRef.current.rotation.x += deltaY * 0.01;
      }
      
      // Track velocity (for throw)
      setVelocity({
        x: deltaX * 0.01,
        y: deltaY * 0.01,
      });
      
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
      
      // Resume auto-rotate after 3 seconds of inactivity
      inactivityTimer.current = setTimeout(() => {
        setAutoRotate(true);
      }, 3000);
    };
    
    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, [isDragging, gl.domElement]);
  
  return (
    <group ref={groupRef}>
      {/* Resonance Core (center) */}
      <ResonanceCore />
      
      {/* Vertices */}
      {VERTEX_POSITIONS.map((position, index) => (
        <Vertex
          key={index}
          position={position as [number, number, number]}
          index={index}
          isHovered={hoveredVertex === index}
          onHover={() => setHoveredVertex(index)}
          onUnhover={() => setHoveredVertex(null)}
          status={vertices[index]?.state || 'HEALTHY'}
        />
      ))}
      
      {/* Edges */}
      {EDGES.map(([startIdx, endIdx], index) => (
        <Edge
          key={index}
          start={VERTEX_POSITIONS[startIdx] as [number, number, number]}
          end={VERTEX_POSITIONS[endIdx] as [number, number, number]}
          isHighlighted={hoveredVertex === startIdx || hoveredVertex === endIdx}
          strength={getEdgeStrength(startIdx, endIdx)}
        />
      ))}
      
      {/* Network Packets */}
      {packets.map(packet => (
        <Packet
          key={packet.id}
          packet={packet}
          onComplete={() => networkStore.getState().removePacket(packet.id)}
        />
      ))}
      
      {/* Camera Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={3}
        maxDistance={15}
        autoRotate={autoRotate && !isDragging}
        autoRotateSpeed={0.5}
      />
    </group>
  );
}

// Helper function to determine edge strength
function getEdgeStrength(start: number, end: number): 'STRONG' | 'MEDIUM' | 'WEAK' | 'BROKEN' {
  // Get connection health from network store
  // For now, default to STRONG
  // TODO: Implement actual connection health tracking
  return 'STRONG';
}
```

---

File: src/components/canvas/Vertex.tsx (UPDATE)

```typescript
'use client';

import { useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';
import GOD_CONFIG from '@/god.config';

interface VertexProps {
  position: [number, number, number];
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onUnhover: () => void;
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL' | 'OFFLINE' | 'MEMORIAL';
}

export function Vertex({ 
  position, 
  index, 
  isHovered, 
  onHover, 
  onUnhover,
  status 
}: VertexProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const router = useRouter();
  
  // Status colors
  const statusColors = {
    HEALTHY: '#06b6d4',   // Cyan
    WARNING: '#f59e0b',   // Yellow
    CRITICAL: '#ef4444',  // Red
    OFFLINE: '#6b7280',   // Gray
    MEMORIAL: '#8b5cf6',  // Purple
  };
  
  const currentColor = statusColors[status];
  
  // Animation
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Breathing animation (2-second cycle)
    const breathScale = 1 + Math.sin(time * Math.PI) * 0.15; // 1.0 → 1.15 → 1.0
    
    // Hover scale boost
    const hoverScale = isHovered ? 1.2 : 1.0;
    
    // Combined scale
    meshRef.current.scale.setScalar(breathScale * hoverScale);
    
    // Glow intensity
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    material.emissiveIntensity = isHovered ? 1.5 : 0.5;
    
    // Smooth color transition
    const targetColor = new THREE.Color(currentColor);
    material.color.lerp(targetColor, 0.1);
    material.emissive.lerp(targetColor, 0.1);
  });
  
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    
    // Dispatch custom event for navigation
    const event = new CustomEvent('vertex-click', {
      detail: { vertexIndex: index }
    });
    window.dispatchEvent(event);
  };
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onUnhover();
        document.body.style.cursor = 'default';
      }}
    >
      <sphereGeometry args={[0.2, 32, 32]} />
      <meshStandardMaterial
        color={currentColor}
        emissive={currentColor}
        emissiveIntensity={0.5}
        metalness={0.3}
        roughness={0.4}
      />
      
      {/* Glow effect */}
      <pointLight
        color={currentColor}
        intensity={isHovered ? 2 : 1}
        distance={2}
      />
    </mesh>
  );
}
```

---

File: src/components/canvas/Edge.tsx (UPDATE)

```typescript
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EdgeProps {
  start: [number, number, number];
  end: [number, number, number];
  isHighlighted: boolean;
  strength: 'STRONG' | 'MEDIUM' | 'WEAK' | 'BROKEN';
}

export function Edge({ start, end, isHighlighted, strength }: EdgeProps) {
  const lineRef = useRef<THREE.Line>(null);
  
  // Edge properties by strength
  const edgeConfig = {
    STRONG: { color: '#06b6d4', opacity: 1.0, width: 0.03 },
    MEDIUM: { color: '#06b6d4', opacity: 0.6, width: 0.02 },
    WEAK: { color: '#f59e0b', opacity: 0.4, width: 0.015 },
    BROKEN: { color: '#ef4444', opacity: 0.2, width: 0.01 },
  };
  
  const config = edgeConfig[strength];
  
  // Create line geometry
  const points = [
    new THREE.Vector3(...start),
    new THREE.Vector3(...end),
  ];
  
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  
  // Animation
  useFrame((state) => {
    if (!lineRef.current) return;
    
    const material = lineRef.current.material as THREE.LineBasicMaterial;
    
    // Highlight effect
    const targetOpacity = isHighlighted 
      ? Math.min(config.opacity + 0.4, 1.0) 
      : config.opacity;
    
    material.opacity += (targetOpacity - material.opacity) * 0.1;
    
    // Pulse on hover
    if (isHighlighted) {
      const pulse = Math.sin(state.clock.elapsedTime * 4) * 0.1 + 0.9;
      material.opacity *= pulse;
    }
  });
  
  return (
    <line ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color={config.color}
        transparent
        opacity={config.opacity}
        linewidth={config.width}
      />
    </line>
  );
}
```

---

File: src/components/canvas/ResonanceCore.tsx (UPDATE)

```typescript
'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gameStore } from '@/lib/store/gameStore';

export function ResonanceCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  const voltage = gameStore(state => state.voltage);
  
  // Determine state by voltage
  const getState = (v: number) => {
    if (v < 10) return 'CRITICAL';
    if (v < 34) return 'LOW';
    if (v < 67) return 'MEDIUM';
    return 'HIGH';
  };
  
  const state = getState(voltage);
  
  // State colors and speeds
  const stateConfig = {
    CRITICAL: { color: '#ef4444', speed: 8, intensity: 2 },
    LOW: { color: '#ef4444', speed: 2, intensity: 0.5 },
    MEDIUM: { color: '#f59e0b', speed: 3, intensity: 1 },
    HIGH: { color: '#06b6d4', speed: 4, intensity: 1.5 },
  };
  
  const config = stateConfig[state];
  
  // Animation
  useFrame((state) => {
    if (!meshRef.current || !lightRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Pulse scale
    const pulse = Math.sin(time * config.speed) * 0.2 + 1;
    meshRef.current.scale.setScalar(pulse);
    
    // Pulse light intensity
    lightRef.current.intensity = config.intensity * pulse;
    
    // Slow rotation
    meshRef.current.rotation.y += 0.01;
    
    // Color transition
    const material = meshRef.current.material as THREE.MeshStandardMaterial;
    const targetColor = new THREE.Color(config.color);
    material.color.lerp(targetColor, 0.05);
    material.emissive.lerp(targetColor, 0.05);
  });
  
  return (
    <group>
      {/* Core sphere */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={config.color}
          emissive={config.color}
          emissiveIntensity={1}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>
      
      {/* Point light */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 0]}
        color={config.color}
        intensity={config.intensity}
        distance={5}
      />
      
      {/* Particle ring (for HIGH state) */}
      {state === 'HIGH' && <ParticleRing />}
    </group>
  );
}

// Particle ring for high resonance
function ParticleRing() {
  const particlesRef = useRef<THREE.Points>(null);
  
  // Create particle geometry
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const angle = (i / particleCount) * Math.PI * 2;
    const radius = 0.8;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius * 0.3;
    positions[i * 3 + 2] = Math.sin(angle) * radius;
  }
  
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  
  useFrame((state) => {
    if (!particlesRef.current) return;
    particlesRef.current.rotation.y = state.clock.elapsedTime * 0.5;
  });
  
  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        size={0.05}
        color="#06b6d4"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}
```

---

TEST CHECKLIST:

[ ] Tetrahedron breathes (vertices pulse)
[ ] Auto-rotates slowly (ambient spin)
[ ] Hover over vertex → glows brighter
[ ] Hover over vertex → cursor changes
[ ] Hover over vertex → connected edges brighten
[ ] Click and drag → tetrahedron spins
[ ] Drag fast → throws with momentum
[ ] Release → slows down gradually
[ ] Inactive for 3s → resumes auto-rotate
[ ] Vertex colors change by status
[ ] Edge opacity changes by strength
[ ] Core pulses faster when voltage low
[ ] Core changes color by state
[ ] Particle ring appears when HIGH
[ ] OrbitControls work (right-click drag)
[ ] Zoom works (scroll wheel)
[ ] Everything smooth (60fps)

RESULT:
- Living, breathing organism
- Responds to touch
- Physics feel natural
- Visual feedback clear
- Status always visible
- Never stops moving
- Engaging to interact with

This transforms the tetrahedron from a static 3D model into an ALIVE entity that your users will want to play with and watch.
```

---

**⚡ OPERATION: BRING TO LIFE ⚡**
