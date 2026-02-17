/**
 * IVM Lattice Edges — Line segments between neighboring IVM vertices
 *
 * Renders the isotropic vector matrix as a faint wireframe; entanglement
 * or communication pathways can later be shown along these edges.
 */

import { useMemo } from 'react';
import * as THREE from 'three';
import type { IVMPoint } from '../../engine/ivm';

const DEFAULT_COLOR = '#2ecc71'; // P31 Phosphorus Green

interface IVMLatticeEdgesProps {
  points: IVMPoint[];
  edges: [number, number][];
  color?: string;
  opacity?: number;
}

export function IVMLatticeEdges({
  points,
  edges,
  color = DEFAULT_COLOR,
  opacity = 0.2,
}: IVMLatticeEdgesProps) {
  const geometry = useMemo(() => {
    const positionArray = new Float32Array(edges.length * 2 * 3);
    edges.forEach(([i, j], idx) => {
      const a = points[i]?.position;
      const b = points[j]?.position;
      if (!a || !b) return;
      const o = idx * 6;
      positionArray[o + 0] = a.x;
      positionArray[o + 1] = a.y;
      positionArray[o + 2] = a.z;
      positionArray[o + 3] = b.x;
      positionArray[o + 4] = b.y;
      positionArray[o + 5] = b.z;
    });
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    return geom;
  }, [points, edges]);

  return (
    <lineSegments geometry={geometry as any}>
      <lineBasicMaterial
        color={color}
        opacity={opacity}
        transparent
      />
    </lineSegments>
  );
}

export default IVMLatticeEdges;
