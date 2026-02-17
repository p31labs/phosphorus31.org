/**
 * Quantum Clock — minimal MVP version
 * Pendulum and face react to global coherence; no winding/cuckoo.
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useCoherenceStore } from '../../stores/coherence.store';

interface QuantumClockMVPProps {
  position?: [number, number, number];
}

export const QuantumClockMVP: React.FC<QuantumClockMVPProps> = ({
  position = [0, 2, 6],
}) => {
  const pendulumRef = useRef<THREE.Group>(null);
  const coherence = useCoherenceStore((s) => s.globalCoherence);

  useFrame((state) => {
    if (pendulumRef.current) {
      const maxAngle = 0.3 + coherence * 0.4;
      const angle = Math.sin(state.clock.elapsedTime * 2) * maxAngle;
      pendulumRef.current.rotation.z = angle;
    }
  });

  return (
    <group position={position}>
      {/* Cabinet */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 3, 1]} />
        <meshStandardMaterial color="#4a2c1a" roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Pendulum */}
      <group ref={pendulumRef} position={[0, -0.5, 0.5]}>
        <mesh position={[0, -1, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
          <meshStandardMaterial
            color="#2ecc71"
            emissive="#2ecc71"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[0, -2, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial
            color="#ffaa00"
            emissive="#ffaa00"
            emissiveIntensity={coherence * 0.5}
          />
        </mesh>
      </group>
      {/* Face */}
      <mesh position={[0, 0.8, 0.51]}>
        <cylinderGeometry args={[0.8, 0.8, 0.1, 32]} />
        <meshStandardMaterial
          color="#2ecc71"
          emissive="#2ecc71"
          emissiveIntensity={coherence * 0.3}
        />
      </mesh>
    </group>
  );
};

export default QuantumClockMVP;
