/**
 * Bond as a simple line between two 3D points (P–O bonds)
 */

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface PosnerBond4DProps {
  from: [number, number, number];
  to: [number, number, number];
}

export const PosnerBond4D: React.FC<PosnerBond4DProps> = ({ from, to }) => {
  const [positions, lineCount] = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const arr = new Float32Array([a.x, a.y, a.z, b.x, b.y, b.z]);
    return [arr, 2];
  }, [from, to]);

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={lineCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.35} />
    </line>
  );
};
