/**
 * AgentVisual — one glowing tetrahedron agent in the 3D scene
 * Position and light pulse updated every frame from swarm store.
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Agent } from '../../types/agent';
import { useSwarmStore } from '../../stores/swarm.store';

const TASK_COLORS: Record<Agent['task'], string> = {
  explore: '#3498db',
  build: '#2ecc71',
  repair: '#f39c12',
  sleep: '#95a5a6',
};

export const AgentVisual: React.FC<{ agent: Agent }> = ({ agent }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(() => {
    const current = useSwarmStore.getState().agents.get(agent.id);
    if (!current) return;
    if (meshRef.current) {
      meshRef.current.position.copy(current.position);
      meshRef.current.rotation.y += 0.02;
      meshRef.current.rotation.x += 0.01;
    }
    if (lightRef.current) {
      lightRef.current.position.copy(current.position);
      const intensity =
        0.5 + Math.sin(Date.now() * 0.003) * 0.2 * current.energy;
      lightRef.current.intensity = intensity;
    }
  });

  const color = TASK_COLORS[agent.task];

  return (
    <group>
      <pointLight
        ref={lightRef}
        color={color}
        distance={3}
        decay={2}
      />
      <mesh ref={meshRef}>
        <tetrahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.8}
        />
      </mesh>
    </group>
  );
};
