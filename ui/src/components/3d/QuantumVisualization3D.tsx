/**
 * @license
 * Copyright 2026 P31 Labs
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                    QUANTUM VISUALIZATION 3D                                    ║
 * ║         Real-time 3D quantum state visualization with Bloch Spheres            ║
 * ║                                                                                 ║
 * ║  "In the quantum realm, we don't observe reality—                              ║
 * ║   we participate in its creation."                                               ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Sphere, Text } from '@react-three/drei';
import * as THREE from 'three';
import {
  useQuantumStore,
  useGlobalCoherence,
  useQuantumEntanglements,
  useQuantumNode,
} from '../../stores/quantum.store';

// ═══════════════════════════════════════════════════════════════════════════════
// BLOCH SPHERE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface BlochSphereProps {
  position: [number, number, number];
  nodeId: string;
  scale?: number;
}

function BlochSphere({ position, nodeId, scale = 1 }: BlochSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const node = useQuantumNode(nodeId);
  useGlobalCoherence(); // consumed for store subscription

  // Hooks must run unconditionally; guard inside callbacks
  useFrame((state) => {
    if (!node || !meshRef.current) return;
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 + node.phase;
  });

  const color = useMemo(() => {
    if (!node) return new THREE.Color(0x888888);
    if (node.collapsed) return new THREE.Color(0x888888); // Gray when collapsed
    const hue = (node.coherence * 120) / 360; // Green (0) to Cyan (120)
    return new THREE.Color().setHSL(hue, 0.8, 0.5);
  }, [node]);

  if (!node) return null;

  const x = Math.sin(node.theta) * Math.cos(node.phi);
  const y = Math.cos(node.theta);
  const z = Math.sin(node.theta) * Math.sin(node.phi);
  const stateVector = new THREE.Vector3(x, y, z);
  const sphereRadius = 0.8 * scale;
  const coherence = node.coherence;

  return (
    <group position={position}>
      {/* Sphere outline (wireframe) */}
      <Sphere args={[sphereRadius, 32, 32]}>
        <meshStandardMaterial
          color={color}
          wireframe
          opacity={0.3}
          transparent
          emissive={color}
          emissiveIntensity={coherence * 0.5}
        />
      </Sphere>

      {/* Axes */}
      <Line
        points={[
          [0, -sphereRadius, 0],
          [0, sphereRadius, 0],
        ]}
        color="#666666"
        lineWidth={1}
        opacity={0.3}
      />
      <Line
        points={[
          [-sphereRadius, 0, 0],
          [sphereRadius, 0, 0],
        ]}
        color="#666666"
        lineWidth={1}
        opacity={0.3}
      />
      <Line
        points={[
          [0, 0, -sphereRadius],
          [0, 0, sphereRadius],
        ]}
        color="#666666"
        lineWidth={1}
        opacity={0.3}
      />

      {/* State vector (quantum state) */}
      <Line
        points={[
          [0, 0, 0],
          [stateVector.x * sphereRadius, stateVector.y * sphereRadius, stateVector.z * sphereRadius],
        ]}
        color={color}
        lineWidth={3}
      />

      {/* State point */}
      <Sphere
        args={[0.1, 16, 16]}
        position={[
          stateVector.x * sphereRadius,
          stateVector.y * sphereRadius,
          stateVector.z * sphereRadius,
        ]}
      >
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={coherence}
        />
      </Sphere>

      {/* Coherence indicator (pulsing ring) */}
      {!node.collapsed && (
        <Sphere args={[sphereRadius * 1.1, 32, 32]} ref={meshRef}>
          <meshStandardMaterial
            color={color}
            wireframe
            opacity={coherence * 0.5}
            transparent
            emissive={color}
            emissiveIntensity={coherence * 0.3}
          />
        </Sphere>
      )}

      {/* Label */}
      <Text
        position={[0, sphereRadius + 0.3, 0]}
        fontSize={0.15}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {node.label}
      </Text>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENTANGLEMENT LINE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface EntanglementLineProps {
  nodeA: string;
  nodeB: string;
  positionA: [number, number, number];
  positionB: [number, number, number];
  strength: number;
  phase: number;
}

function EntanglementLine({
  nodeA: _nodeA,
  nodeB: _nodeB,
  positionA,
  positionB,
  strength,
  phase,
}: EntanglementLineProps) {
  const lineRef = useRef<THREE.Line>(null);

  // Animate entanglement (quantum phase oscillation)
  useFrame((state) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial;
      const oscillation = Math.sin(state.clock.elapsedTime * 2 + phase) * 0.5 + 0.5;
      material.opacity = strength * (0.3 + oscillation * 0.7);
      material.color.setHSL((phase / (2 * Math.PI)) % 1, 0.8, 0.6);
    }
  });

  const color = useMemo(() => {
    const hue = (phase / (2 * Math.PI)) % 1;
    return new THREE.Color().setHSL(hue, 0.8, 0.6);
  }, [phase]);

  return (
    <Line
      ref={lineRef}
      points={[positionA, positionB]}
      color={color}
      lineWidth={strength * 3}
      transparent
      opacity={strength * 0.8}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function QuantumVisualization3D() {
  const nodes = useQuantumStore((state) => state.nodes);
  const entanglements = useQuantumEntanglements();
  const globalCoherence = useGlobalCoherence();

  // Tetrahedron positions for 4 nodes
  const nodePositions: Record<string, [number, number, number]> = useMemo(() => {
    const radius = 2;
    return {
      'node-a': [radius, radius, radius], // Self
      'node-b': [radius, -radius, -radius], // Other
      'node-c': [-radius, radius, -radius], // Context
      'node-d': [-radius, -radius, radius], // Engine
    };
  }, []);

  // Render entanglement lines
  const entanglementLines = useMemo(() => {
    return entanglements.map((ent) => {
      const posA = nodePositions[ent.nodeA];
      const posB = nodePositions[ent.nodeB];
      if (!posA || !posB) return null;

      return (
        <EntanglementLine
          key={ent.id}
          nodeA={ent.nodeA}
          nodeB={ent.nodeB}
          positionA={posA}
          positionB={posB}
          strength={ent.strength}
          phase={ent.phase}
        />
      );
    });
  }, [entanglements, nodePositions]);

  return (
    <group>
      {/* Global coherence indicator (ambient glow) */}
      <ambientLight intensity={globalCoherence * 0.5} color="#8b5cf6" />

      {/* Render Bloch Spheres for each node */}
      {nodes.map((node) => {
        const position = nodePositions[node.id];
        if (!position) return null;
        return <BlochSphere key={node.id} position={position} nodeId={node.id} />;
      })}

      {/* Render entanglement lines */}
      {entanglementLines}

      {/* Global coherence text */}
      <Text
        position={[0, -3.5, 0]}
        fontSize={0.2}
        color="#8b5cf6"
        anchorX="center"
        anchorY="middle"
      >
        Coherence: {(globalCoherence * 100).toFixed(1)}%
      </Text>
    </group>
  );
}

export default QuantumVisualization3D;
