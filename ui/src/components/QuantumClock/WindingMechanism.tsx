/**
 * WindingMechanism — interactive crank. Wind to boost coherence.
 * Resistance and glow reflect current winding energy. Bob & Marge's heartbeat.
 */

import React, { useRef, useState } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const PHOSPHORUS_GREEN = '#2ecc71';

interface WindingMechanismProps {
  onWind: (amount: number) => void;
  windingEnergy: number;
}

export const WindingMechanism: React.FC<WindingMechanismProps> = ({
  onWind,
  windingEnergy,
}) => {
  const crankRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [angle, setAngle] = useState(0);

  useFrame(() => {
    if (crankRef.current) {
      if (!isDragging) {
        setAngle((a) => a * 0.95);
      }
      crankRef.current.rotation.z = angle;
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;
    const delta = e.movementX * 0.01;
    setAngle((a) => a + delta);
    onWind(Math.abs(delta) * 0.1);
  };

  return (
    <group
      ref={crankRef}
      position={[0.42, 0.2, 0.2]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 0.15, 8]} />
        <meshStandardMaterial color="#bbaa88" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.08, 0, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial color="#ccbb99" metalness={0.7} />
      </mesh>
      <pointLight
        color={PHOSPHORUS_GREEN}
        intensity={windingEnergy * 2}
        distance={1.5}
        position={[0, 0, 0]}
      />
      <Html distanceFactor={8} center>
        <div
          style={{
            color: PHOSPHORUS_GREEN,
            fontSize: 11,
            background: 'rgba(0,0,0,0.6)',
            padding: '2px 6px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
          }}
        >
          {windingEnergy > 0 ? `⚡ ${Math.round(windingEnergy * 100)}%` : 'Wind me'}
        </div>
      </Html>
    </group>
  );
};
