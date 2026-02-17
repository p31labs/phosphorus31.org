/**
 * Weights — classical (winding) and quantum (coherence) progress.
 * Visual metaphor: weight drops as you wind; quantum weight reflects coherence.
 */

import React from 'react';
import * as THREE from 'three';

const PHOSPHORUS_GREEN = '#2ecc71';

interface WeightsProps {
  /** 0–1: classical weight position (drops as you wind) */
  classicalProgress: number;
  /** 0–1: quantum / coherence */
  quantumProgress: number;
  /** 0–1: player entanglement offset */
  entanglementOffset?: number;
}

export const Weights: React.FC<WeightsProps> = ({
  classicalProgress,
  quantumProgress,
  entanglementOffset = 0,
}) => {
  const classicalY = -0.15 - classicalProgress * 0.25;
  const quantumY = -0.2 - (1 - quantumProgress) * 0.2 + entanglementOffset * 0.05;

  return (
    <group position={[-0.35, 0.5, 0.18]}>
      {/* Classical weight (brass) — winding */}
      <mesh position={[0, classicalY, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.035, 0.08, 8]} />
        <meshStandardMaterial color="#b8860b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, classicalY - 0.06, 0]}>
        <cylinderGeometry args={[0.006, 0.006, 0.12, 6]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.6} />
      </mesh>
      {/* Quantum weight (phosphor glow) */}
      <mesh position={[0.12, quantumY, 0]} castShadow>
        <sphereGeometry args={[0.035, 12, 12]} />
        <meshStandardMaterial
          color={PHOSPHORUS_GREEN}
          emissive={PHOSPHORUS_GREEN}
          emissiveIntensity={0.2 + quantumProgress * 0.3}
          metalness={0.3}
          roughness={0.5}
        />
      </mesh>
      <mesh position={[0.12, quantumY - 0.04, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.08, 6]} />
        <meshStandardMaterial color="#1a2a1a" metalness={0.5} />
      </mesh>
    </group>
  );
};
