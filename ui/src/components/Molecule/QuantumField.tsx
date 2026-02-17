/**
 * Quantum Field Visualization
 * Ambient quantum field around the molecule
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, ShaderMaterial } from 'three';
import { useAccessibilityStore } from '../../stores/accessibility.store';

interface QuantumFieldProps {
  coherence: number;
  radius?: number;
}

export const QuantumField: React.FC<QuantumFieldProps> = ({ coherence, radius = 5 }) => {
  const meshRef = useRef<Mesh>(null);
  const { animationReduced } = useAccessibilityStore();

  useFrame((state) => {
    if (meshRef.current && !animationReduced) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.001;
      meshRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial
        color="#00FFFF"
        transparent
        opacity={coherence * 0.15}
        emissive="#00FFFF"
        emissiveIntensity={coherence * 0.3}
        side={2} // DoubleSide
        wireframe={false}
      />
    </mesh>
  );
};
