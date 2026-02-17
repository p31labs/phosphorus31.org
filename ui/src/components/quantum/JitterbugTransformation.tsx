/**
 * JITTERBUG TRANSFORMATION - Fuller's Geometric Phase Transition
 * 
 * Continuous transformation: Vector Equilibrium → Icosahedron → Octahedron → Tetrahedron
 * 
 * Phase mapping:
 * - t=0.00: Vector Equilibrium (Cuboctahedron) - Idle/Open - Electric Teal
 * - t=0.35: Icosahedron - Processing - Yellow/Orange
 * - t=0.70: Octahedron - Converging - Love Purple
 * - t=1.00: Tetrahedron - Locked/Trust - Gold/White
 * 
 * The transformation represents cognitive load and coherence state.
 * Final tetrahedron snap triggers haptic feedback via Node One.
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMetabolism } from '../../hooks/useMetabolism';

interface JitterbugTransformationProps {
  phase?: number; // 0.0 to 1.0 - manual phase control
  autoPhase?: boolean; // Auto-calculate phase from spoon level
  onTetrahedronLock?: () => void; // Callback when t=1.0 (tetrahedron locked)
}

// Vector Equilibrium (Cuboctahedron) vertices
// 12 vertices at (±1, ±1, 0) and all permutations
function generateVectorEquilibriumVertices(): THREE.Vector3[] {
  const vertices: THREE.Vector3[] = [];
  const coords = [
    [1, 1, 0], [1, -1, 0], [-1, 1, 0], [-1, -1, 0],
    [1, 0, 1], [1, 0, -1], [-1, 0, 1], [-1, 0, -1],
    [0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, -1],
  ];
  coords.forEach(([x, y, z]) => {
    vertices.push(new THREE.Vector3(x, y, z).normalize());
  });
  return vertices;
}

// Icosahedron vertices (12 vertices)
function generateIcosahedronVertices(): THREE.Vector3[] {
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
  const vertices: THREE.Vector3[] = [
    new THREE.Vector3(0, 1, phi).normalize(),
    new THREE.Vector3(0, 1, -phi).normalize(),
    new THREE.Vector3(0, -1, phi).normalize(),
    new THREE.Vector3(0, -1, -phi).normalize(),
    new THREE.Vector3(1, phi, 0).normalize(),
    new THREE.Vector3(1, -phi, 0).normalize(),
    new THREE.Vector3(-1, phi, 0).normalize(),
    new THREE.Vector3(-1, -phi, 0).normalize(),
    new THREE.Vector3(phi, 0, 1).normalize(),
    new THREE.Vector3(phi, 0, -1).normalize(),
    new THREE.Vector3(-phi, 0, 1).normalize(),
    new THREE.Vector3(-phi, 0, -1).normalize(),
  ];
  return vertices;
}

// Octahedron vertices (6 vertices)
function generateOctahedronVertices(): THREE.Vector3[] {
  return [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0, 1),
    new THREE.Vector3(0, 0, -1),
  ];
}

// Tetrahedron vertices (4 vertices)
function generateTetrahedronVertices(): THREE.Vector3[] {
  return [
    new THREE.Vector3(1, 1, 1).normalize(),
    new THREE.Vector3(1, -1, -1).normalize(),
    new THREE.Vector3(-1, 1, -1).normalize(),
    new THREE.Vector3(-1, -1, 1).normalize(),
  ];
}

// Interpolate between two vertex sets
function interpolateVertices(
  start: THREE.Vector3[],
  end: THREE.Vector3[],
  t: number
): THREE.Vector3[] {
  // Use the smaller set as base, interpolate to larger
  const base = start.length <= end.length ? start : end;
  const target = start.length <= end.length ? end : start;
  const reverse = start.length > end.length;

  return base.map((v, i) => {
    // Find closest vertex in target set
    const closest = target.reduce((closest, candidate) => {
      return v.distanceTo(candidate) < v.distanceTo(closest) ? candidate : closest;
    }, target[0]);

    const tAdjusted = reverse ? 1 - t : t;
    return v.clone().lerp(closest, tAdjusted);
  });
}

// Get geometry state for phase t
function getGeometryForPhase(t: number): {
  vertices: THREE.Vector3[];
  color: string;
  rotation: number;
  volumeIndex: number;
} {
  if (t <= 0.35) {
    // Vector Equilibrium → Icosahedron
    const ve = generateVectorEquilibriumVertices();
    const ico = generateIcosahedronVertices();
    const localT = t / 0.35;
    return {
      vertices: interpolateVertices(ve, ico, localT),
      color: '#00E5FF', // Electric Teal
      rotation: 0,
      volumeIndex: 20.0 - localT * 1.49,
    };
  } else if (t <= 0.70) {
    // Icosahedron → Octahedron
    const ico = generateIcosahedronVertices();
    const oct = generateOctahedronVertices();
    const localT = (t - 0.35) / 0.35;
    return {
      vertices: interpolateVertices(ico, oct, localT),
      color: '#F1C40F', // Yellow/Orange
      rotation: 22.2 + localT * 37.8,
      volumeIndex: 18.51 - localT * 10.51,
    };
  } else {
    // Octahedron → Tetrahedron
    const oct = generateOctahedronVertices();
    const tet = generateTetrahedronVertices();
    const localT = (t - 0.70) / 0.30;
    return {
      vertices: interpolateVertices(oct, tet, localT),
      color: '#e879f9', // Love Purple → Gold at t=1.0
      rotation: 60,
      volumeIndex: 8.0 - localT * 7.0,
    };
  }
}

export function JitterbugTransformation({
  phase: manualPhase,
  autoPhase = true,
  onTetrahedronLock,
}: JitterbugTransformationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const edgesRef = useRef<THREE.LineSegments>(null);
  const verticesRef = useRef<THREE.Points>(null);
  const lastPhaseRef = useRef(0);
  const { metabolism } = useMetabolism();

  // Calculate phase from spoon level if autoPhase is enabled
  const phase = useMemo(() => {
    if (!autoPhase && manualPhase !== undefined) {
      return Math.max(0, Math.min(1, manualPhase));
    }

    if (!metabolism) return 0.0;

    // Map spoon level to phase:
    // High spoons (8-12) = 0.0 (VE - open/idle)
    // Medium spoons (5-7) = 0.35 (Icosahedron - processing)
    // Low spoons (3-4) = 0.70 (Octahedron - converging)
    // Critical spoons (0-2) = 1.0 (Tetrahedron - locked)
    const spoonRatio = metabolism.currentSpoons / metabolism.maxSpoons;

    if (spoonRatio >= 0.67) return 0.0; // High energy
    if (spoonRatio >= 0.42) return 0.35; // Medium energy
    if (spoonRatio >= 0.25) return 0.70; // Low energy
    return 1.0; // Critical energy - tetrahedron lock
  }, [autoPhase, manualPhase, metabolism]);

  // Detect tetrahedron lock (phase crosses 0.95 threshold)
  useFrame(() => {
    if (phase >= 0.95 && lastPhaseRef.current < 0.95 && onTetrahedronLock) {
      onTetrahedronLock();
    }
    lastPhaseRef.current = phase;
  });

  const geometryState = useMemo(() => getGeometryForPhase(phase), [phase]);

  // Generate edges from vertices (simplified - connect all vertices)
  const edges = useMemo(() => {
    const positions: number[] = [];
    const vertices = geometryState.vertices;

    // Connect each vertex to its nearest neighbors
    for (let i = 0; i < vertices.length; i++) {
      const sorted = vertices
        .map((v, idx) => ({ v, idx, dist: vertices[i].distanceTo(v) }))
        .sort((a, b) => a.dist - b.dist)
        .slice(1, 4); // Connect to 3 nearest neighbors

      sorted.forEach(({ v }) => {
        positions.push(vertices[i].x, vertices[i].y, vertices[i].z);
        positions.push(v.x, v.y, v.z);
      });
    }

    return new Float32Array(positions);
  }, [geometryState.vertices]);

  useFrame((state) => {
    if (!groupRef.current) return;

    // Rotate based on phase
    groupRef.current.rotation.y += 0.005;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;

    // Breathing pulse at 0.1 Hz (vagal tone) when idle
    if (phase < 0.1) {
      const breath = Math.sin(state.clock.elapsedTime * 0.1 * Math.PI * 2) * 0.05 + 1.0;
      groupRef.current.scale.setScalar(breath);
    } else {
      groupRef.current.scale.setScalar(1.0);
    }
  });

  const color = new THREE.Color(geometryState.color);
  const finalColor = phase >= 0.95 ? new THREE.Color('#fbbf24') : color; // Gold at lock

  return (
    <group ref={groupRef}>
      {/* Edges */}
      <lineSegments ref={edgesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={edges.length / 3}
            array={edges}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color={finalColor} linewidth={2} />
      </lineSegments>

      {/* Vertices */}
      <points ref={verticesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={geometryState.vertices.length}
            array={new Float32Array(
              geometryState.vertices.flatMap((v) => [v.x, v.y, v.z])
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={finalColor}
          size={phase >= 0.95 ? 0.3 : 0.15}
          sizeAttenuation
          emissive={finalColor}
          emissiveIntensity={phase >= 0.95 ? 1.0 : 0.5}
        />
      </points>

      {/* Center indicator */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={finalColor}
          emissive={finalColor}
          emissiveIntensity={phase >= 0.95 ? 2.0 : 0.8}
        />
      </mesh>
    </group>
  );
}
