/**
 * IVM Lattice Points — Instanced spheres at each IVM vertex
 *
 * P31 Quantum Console: qubit positions, control nodes, and data streams
 * live on these lattice points. Phosphor green by default.
 */

import { useRef, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';
import type { IVMPoint } from '../../engine/ivm';

const DEFAULT_COLOR = '#2ecc71'; // P31 Phosphorus Green

interface IVMLatticePointsProps {
  points: IVMPoint[];
  color?: string;
  size?: number;
}

export function IVMLatticePoints({
  points,
  color = DEFAULT_COLOR,
  size = 0.05,
}: IVMLatticePointsProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    if (!meshRef.current || points.length === 0) return;
    points.forEach((point, i) => {
      dummy.position.copy(point.position);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [points, dummy]);

  if (points.length === 0) return null;

  return (
    <instancedMesh ref={meshRef as any} args={[undefined, undefined, points.length]}>
      <sphereGeometry args={[size, 8, 8]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </instancedMesh>
  );
}

export default IVMLatticePoints;
