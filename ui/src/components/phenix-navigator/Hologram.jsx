import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store';

/**
 * Hologram - Floating holographic projections and data streams
 */
export default function Hologram() {
  const groupRef = useRef();
  const hologramRef = useRef();
  const dataStreamRef = useRef();

  const coherence = useStore((s) => s.coherence);
  const qStatistic = useStore((s) => s.qStatistic);

  // Single subtle animation: one slow rotation so centerpiece (CoherenceOrb) dominates
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (hologramRef.current) {
      hologramRef.current.rotation.y = t * 0.04;
      hologramRef.current.material.opacity = 0.08 + coherence * 0.06;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Single faint ring behind centerpiece (no streams/particles) */}
      <mesh ref={hologramRef} position={[0, 2, 0]}>
        <torusGeometry args={[2, 0.06, 12, 48]} />
        <meshBasicMaterial
          transparent
          opacity={0.12}
          color="#00ffff"
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Data Streams: hidden to avoid clashing with centerpiece */}
      <group ref={dataStreamRef} visible={false}>
        {Array.from({ length: 8 }, (_, i) => (
          <mesh
            key={i}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 2,
              0,
              Math.sin((i / 8) * Math.PI * 2) * 2
            ]}
          >
            <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
            <meshBasicMaterial
              transparent
              opacity={0.3}
              color={qStatistic > 1 ? '#00ff88' : '#888888'}
            />
          </mesh>
        ))}
      </group>

      {/* Floating Particles: hidden */}
      <group visible={false}>
        {Array.from({ length: 20 }, (_, i) => (
          <mesh
            key={i}
            position={[
              (Math.random() - 0.5) * 4,
              Math.random() * 3,
              (Math.random() - 0.5) * 4
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial
              transparent
              opacity={0.6}
              color="#ffff00"
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}