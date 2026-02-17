/**
 * Quantum Particles
 * Floating particles showing quantum field
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, BufferGeometry, BufferAttribute, PointsMaterial } from 'three';
import { useAccessibilityStore } from '../../stores/accessibility.store';

interface QuantumParticlesProps {
  count?: number;
  coherence: number;
}

export const QuantumParticles: React.FC<QuantumParticlesProps> = ({ count = 100, coherence }) => {
  const pointsRef = useRef<Points>(null);
  const { animationReduced } = useAccessibilityStore();

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Random positions in sphere
      const radius = 8 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Cyan color
      colors[i * 3] = 0; // R
      colors[i * 3 + 1] = 1; // G
      colors[i * 3 + 2] = 1; // B
    }

    return { positions, colors };
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current && !animationReduced) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
    }
  });

  if (coherence < 0.1) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.1 * coherence}
        vertexColors
        transparent
        opacity={coherence * 0.6}
        emissive="#00FFFF"
        emissiveIntensity={coherence}
      />
    </points>
  );
};
