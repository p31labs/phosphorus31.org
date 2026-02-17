/**
 * Pendulum — swing driven by coherence. Bob's steady heartbeat.
 * Engraved with "BOB" in IVM lettering as a living tribute.
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface PendulumProps {
  /** 0–1. Amplitude: coherence * 0.5 + 0.3 */
  swing: number;
  /** 0–1. Winding energy; slightly steadies the swing when high */
  windingEnergy?: number;
}

export const Pendulum: React.FC<PendulumProps> = ({ swing, windingEnergy = 0 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    timeRef.current += delta;
    const t = timeRef.current;
    const noise = swing < 0.5 ? Math.sin(t * 7) * 0.03 : 0;
    const steadiness = 1 - windingEnergy * 0.3;
    const angle = (Math.sin(t * 2.2) * swing + noise) * steadiness;
    groupRef.current.rotation.z = angle;
  });

  return (
    <group ref={groupRef} position={[0.22, 0.55, 0.19]}>
      {/* Rod */}
      <mesh position={[0, -0.2, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.4, 8]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Bob — engraved BOB (IVM lettering) */}
      <group position={[0, -0.4, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.5} />
        </mesh>
        <Text
          position={[0, 0, 0.041]}
          fontSize={0.022}
          color="#8b7355"
          anchorX="center"
          anchorY="middle"
          maxWidth={0.08}
        >
          BOB
        </Text>
      </group>
    </group>
  );
};
