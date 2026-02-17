/**
 * Cabinet — grandfather clock body.
 * Warm wood tone; P31 phosphorus green accent trim.
 */

import React from 'react';
import * as THREE from 'three';

const WOOD_COLOR = new THREE.Color(0x4a3728);
const TRIM_COLOR = new THREE.Color(0x21c55e); // P31 phosphorus green

export const Cabinet: React.FC = () => {
  return (
    <group>
      {/* Main body — box */}
      <mesh castShadow receiveShadow position={[0, 0.6, 0]}>
        <boxGeometry args={[0.8, 1.2, 0.35]} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.8} metalness={0.1} />
      </mesh>
      {/* Face frame (trim) */}
      <mesh position={[0, 0.6, 0.176]} castShadow>
        <boxGeometry args={[0.75, 1.1, 0.02]} />
        <meshStandardMaterial color={TRIM_COLOR} roughness={0.6} emissive={TRIM_COLOR} emissiveIntensity={0.15} />
      </mesh>
      {/* Base */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.9, 0.15, 0.4]} />
        <meshStandardMaterial color={WOOD_COLOR} roughness={0.8} metalness={0.1} />
      </mesh>
    </group>
  );
};
