/**
 * AgentVisual — single agent as a glowing tetrahedron with point light
 * R3F component; must be used inside Canvas. useFrame syncs position and pulse.
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { Agent } from '../../../types/agent';
import { useSwarmStore } from '../../../stores/swarm.store';

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
      const t = Date.now() * 0.002;
      const baseIntensity = 0.5 + Math.sin(t) * 0.2 * current.energy;
      const goodSite = (current.taskData?.buildSiteQuality ?? 0) > 0;
      lightRef.current.intensity = goodSite ? baseIntensity + 1.2 : baseIntensity;
    }
  });

  const color = TASK_COLORS[agent.task];
  const goodBuildSite = (agent.taskData?.buildSiteQuality ?? 0) > 0;

  return (
    <group>
      <pointLight ref={lightRef} color={color} distance={3} decay={2} />
      <mesh ref={meshRef}>
        <tetrahedronGeometry args={[0.15, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={goodBuildSite ? 1.4 : 0.8}
        />
      </mesh>
    </group>
  );
};
