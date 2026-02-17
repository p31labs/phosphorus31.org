/**
 * BlochSphereFace — clock face showing time and coherence.
 * Sphere represents quantum state; rotation encodes time of day.
 */

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

interface BlochSphereFaceProps {
  time: number;
  coherence: number;
}

const FACE_RADIUS = 0.28;

export const BlochSphereFace: React.FC<BlochSphereFaceProps> = ({ time: _time, coherence }) => {
  const groupRef = useRef<THREE.Group>(null);

  // Time of day → rotation (hours * 15° around Y, slight tilt for readibility)
  useFrame(() => {
    if (!groupRef.current) return;
    const date = new Date();
    const hours = date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
    const angle = (hours / 12) * Math.PI;
    groupRef.current.rotation.y = angle;
  });

  const color = useMemo(() => {
    const hue = (coherence * 0.35); // Green band
    return new THREE.Color().setHSL(hue, 0.7, 0.5);
  }, [coherence]);

  return (
    <group ref={groupRef} position={[0, 0.95, 0.19]}>
      {/* Bloch sphere as face */}
      <Sphere args={[FACE_RADIUS, 24, 24]}>
        <meshStandardMaterial
          color={color}
          wireframe
          transparent
          opacity={0.4}
          emissive={color}
          emissiveIntensity={coherence * 0.4}
        />
      </Sphere>
      {/* Inner glow */}
      <Sphere args={[FACE_RADIUS * 0.92, 20, 20]}>
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.15 + coherence * 0.2}
          emissive={color}
          emissiveIntensity={coherence * 0.3}
        />
      </Sphere>
      {/* Axis lines */}
      <Line points={[[0, -FACE_RADIUS, 0], [0, FACE_RADIUS, 0]]} color="#444" lineWidth={1} />
      <Line points={[[-FACE_RADIUS, 0, 0], [FACE_RADIUS, 0, 0]]} color="#444" lineWidth={1} />
      {/* Coherence label */}
      <Text
        position={[0, -FACE_RADIUS - 0.08, 0]}
        fontSize={0.06}
        color="#aaa"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.5}
      >
        {`${Math.round(coherence * 100)}%`}
      </Text>
    </group>
  );
};
