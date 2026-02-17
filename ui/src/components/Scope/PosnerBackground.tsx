/**
 * P31 Scope — Low-opacity Posner molecule in background (home state).
 */

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { generatePosnerMolecule } from '@/utils/posnerGeometry';

const SCALE = 0.4;

/** Simple sphere cloud for Posner P/Ca positions (low-opacity background). */
function PosnerDots() {
  const { atoms } = useMemo(() => generatePosnerMolecule(), []);
  return (
    <group>
      {atoms
        .filter((a) => a.element === 'P' || a.element === 'Ca')
        .map((a, i) => (
          <mesh
            key={i}
            position={[a.position[0] * SCALE, a.position[1] * SCALE, a.position[2] * SCALE]}
          >
            <sphereGeometry args={[a.element === 'P' ? 0.08 : 0.05, 8, 6]} />
            <meshBasicMaterial
              color={a.element === 'P' ? '#2ecc71' : '#60a5fa'}
              transparent
              opacity={0.25}
            />
          </mesh>
        ))}
    </group>
  );
}

export function PosnerBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
      <Canvas camera={{ position: [0, 0, 4], fov: 50 }} gl={{ alpha: true }}>
        <ambientLight intensity={0.5} />
        <PosnerDots />
      </Canvas>
    </div>
  );
}
