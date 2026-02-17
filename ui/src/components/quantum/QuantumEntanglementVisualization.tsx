/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║              QUANTUM ENTANGLEMENT VISUALIZATION                                ║
 * ║         3D Visualization of Quantum Entanglement Between Nodes                ║
 * ║                                                                                 ║
 * ║  "When two nodes are entangled, measuring one instantly affects the other."    ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useQuantumStore, type NodeId } from '../../stores/quantum.store';

// ═══════════════════════════════════════════════════════════════════════════════
// TETRAHEDRON VERTEX POSITIONS
// ═══════════════════════════════════════════════════════════════════════════════

const TETRAHEDRON_VERTICES: Record<NodeId, [number, number, number]> = {
  A: [0, 1.5, 0], // Self - Top
  B: [1.414, -0.5, 0], // Other - Right
  C: [-0.707, -0.5, 1.225], // Context - Left-Front
  D: [-0.707, -0.5, -1.225], // Engine - Left-Back
};

// ═══════════════════════════════════════════════════════════════════════════════
// ENTANGLED EDGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface EntangledEdgeProps {
  node1: NodeId;
  node2: NodeId;
  entanglement: number;
  phase: number;
}

function EntangledEdge({ node1, node2, entanglement, phase }: EntangledEdgeProps) {
  const lineRef = useRef<THREE.Line>(null);
  const timeRef = useRef(0);
  
  const start = TETRAHEDRON_VERTICES[node1];
  const end = TETRAHEDRON_VERTICES[node2];
  
  // Animate quantum phase
  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime;
    if (lineRef.current) {
      // Quantum phase oscillation
      const phaseOffset = Math.sin(timeRef.current * 2 + phase) * 0.1;
      lineRef.current.material.opacity = 0.3 + entanglement * 0.7 + phaseOffset * 0.2;
    }
  });
  
  // Color based on entanglement strength
  const color = useMemo(() => {
    if (entanglement > 0.7) return '#00ff88'; // Strong entanglement - green
    if (entanglement > 0.4) return '#00b4d8'; // Medium entanglement - cyan
    return '#7c3aed'; // Weak entanglement - purple
  }, [entanglement]);
  
  // Create wavy line for quantum state
  const points = useMemo(() => {
    const segments = 50;
    const points: THREE.Vector3[] = [];
    
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const x = THREE.MathUtils.lerp(start[0], end[0], t);
      const y = THREE.MathUtils.lerp(start[1], end[1], t);
      const z = THREE.MathUtils.lerp(start[2], end[2], t);
      
      // Add quantum wave interference
      const wave = Math.sin(t * Math.PI * 4 + phase) * entanglement * 0.1;
      points.push(new THREE.Vector3(x + wave, y + wave, z + wave));
    }
    
    return points;
  }, [start, end, entanglement, phase]);
  
  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={entanglement * 3 + 1}
      transparent
      opacity={0.3 + entanglement * 0.7}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// QUANTUM NODE SPHERE
// ═══════════════════════════════════════════════════════════════════════════════

interface QuantumNodeProps {
  nodeId: NodeId;
  position: [number, number, number];
  label: string;
  coherence: number;
  phase: number;
  onClick?: (nodeId: NodeId) => void;
}

function QuantumNode({ nodeId, position, label, coherence, phase, onClick }: QuantumNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);
  
  // Quantum state visualization
  useFrame((state) => {
    timeRef.current = state.clock.elapsedTime;
    if (meshRef.current) {
      // Coherence-based pulsing
      const pulse = 1 + Math.sin(timeRef.current * 2 + phase) * coherence * 0.1;
      meshRef.current.scale.setScalar(pulse);
      
      // Phase rotation
      meshRef.current.rotation.y = phase + timeRef.current * 0.5;
    }
  });
  
  // Color based on coherence
  const color = useMemo(() => {
    if (coherence > 0.8) return '#00ff88'; // High coherence - green
    if (coherence > 0.5) return '#00b4d8'; // Medium coherence - cyan
    return '#7c3aed'; // Low coherence - purple
  }, [coherence]);
  
  return (
    <group position={position}>
      {/* Main node sphere */}
      <mesh ref={meshRef} onClick={() => onClick?.(nodeId)}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={coherence * 0.5}
          transparent
          opacity={0.8 + coherence * 0.2}
        />
      </mesh>
      
      {/* Coherence ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.25, 0.3, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={coherence * 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Quantum phase indicator */}
      <mesh rotation={[0, phase, 0]}>
        <coneGeometry args={[0.05, 0.15, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, 0.5, 0]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
      
      {/* Coherence value */}
      <Text
        position={[0, -0.4, 0]}
        fontSize={0.1}
        color={color}
        anchorX="center"
        anchorY="middle"
      >
        {coherence.toFixed(2)}
      </Text>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface QuantumEntanglementVisualizationProps {
  interactive?: boolean;
  onNodeClick?: (nodeId: NodeId) => void;
}

export function QuantumEntanglementVisualization({
  interactive = false,
  onNodeClick,
}: QuantumEntanglementVisualizationProps) {
  const nodeStates = useQuantumStore((state) => state.nodeStates);
  const entanglements = useQuantumStore((state) => state.entanglements);
  const globalCoherence = useQuantumStore((state) => state.globalCoherence);
  
  const nodeLabels: Record<NodeId, string> = {
    A: 'Self',
    B: 'Other',
    C: 'Context',
    D: 'Engine',
  };
  
  return (
    <group>
      {/* Ambient lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} color="#7c3aed" />
      
      {/* Render nodes */}
      {(Object.keys(nodeStates) as NodeId[]).map((nodeId) => {
        const state = nodeStates[nodeId];
        return (
          <QuantumNode
            key={nodeId}
            nodeId={nodeId}
            position={TETRAHEDRON_VERTICES[nodeId]}
            label={nodeLabels[nodeId]}
            coherence={state.coherence}
            phase={state.phase}
            onClick={interactive ? onNodeClick : undefined}
          />
        );
      })}
      
      {/* Render entangled edges */}
      {entanglements.map((entanglement, index) => (
        <EntangledEdge
          key={`${entanglement.node1}-${entanglement.node2}-${index}`}
          node1={entanglement.node1}
          node2={entanglement.node2}
          entanglement={entanglement.entanglement}
          phase={entanglement.phase}
        />
      ))}
      
      {/* Global coherence indicator */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={globalCoherence * 0.5}
        />
      </mesh>
      
      {/* Coherence field visualization */}
      <mesh>
        <sphereGeometry args={[2, 32, 32]} />
        <meshBasicMaterial
          color="#00ff88"
          transparent
          opacity={globalCoherence * 0.05}
          side={THREE.BackSide}
          wireframe
        />
      </mesh>
    </group>
  );
}

export default QuantumEntanglementVisualization;
