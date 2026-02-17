/**
 * Quantum Coherence Ring
 * Beautiful animated ring showing quantum coherence
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, RingGeometry, MeshStandardMaterial } from 'three';
import { useAccessibilityStore } from '../../stores/accessibility.store';

interface QuantumCoherenceRingProps {
  radius: number;
  coherence: number;
  phase?: number;
  color?: string;
}

export const QuantumCoherenceRing: React.FC<QuantumCoherenceRingProps> = ({
  radius,
  coherence,
  phase = 0,
  color = '#00FFFF',
}) => {
  const ringRef = useRef<Mesh>(null);
  const { animationReduced } = useAccessibilityStore();

  useFrame((state) => {
    if (ringRef.current && !animationReduced) {
      // Rotate slowly
      ringRef.current.rotation.z += 0.01;

      // Pulse with coherence
      const pulse = Math.sin(state.clock.elapsedTime * 2 + phase) * 0.1 + 1;
      const scale = coherence * pulse;
      ringRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius * 1.1, radius * 1.2, 64]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={coherence * 0.9}
        emissive={color}
        emissiveIntensity={coherence * 0.8}
        side={2} // DoubleSide
      />
    </mesh>
  );
};
