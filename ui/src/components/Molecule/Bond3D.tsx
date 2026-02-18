/**
 * Bond 3D Component
 * Renders a chemical bond between two atoms
 */

import React, { useMemo } from 'react';
import { Vector3, Quaternion } from 'three';
import { Bond, Atom } from '../../types/molecule';

interface Bond3DProps {
  bond: Bond;
  atom1: Atom;
  atom2: Atom;
  selected?: boolean;
}

export const Bond3D: React.FC<Bond3DProps> = ({ bond, atom1, atom2, selected = false }) => {
  const { midpoint, length, quaternion } = useMemo(() => {
    const start = new Vector3(atom1.position.x, atom1.position.y, atom1.position.z);
    const end = new Vector3(atom2.position.x, atom2.position.y, atom2.position.z);
    const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);
    const length = start.distanceTo(end);
    const up = new Vector3(0, 1, 0);
    const direction = new Vector3().subVectors(end, start).normalize();
    const axis = new Vector3().crossVectors(up, direction);
    const axisLength = axis.length();
    const q = new Quaternion();
    if (axisLength > 0.001) {
      axis.normalize();
      const angle = Math.acos(Math.max(-1, Math.min(1, up.dot(direction))));
      q.setFromAxisAngle(axis, angle);
    }
    return { midpoint, length, quaternion: q };
  }, [atom1, atom2]);

  const thickness = bond.order === 1 ? 0.1 : bond.order === 2 ? 0.15 : 0.2;

  return (
    <mesh position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[thickness, thickness, length, 8]} />
      <meshStandardMaterial
        color={selected ? '#FFFF00' : '#CCCCCC'}
        metalness={0.5}
        roughness={0.3}
      />
    </mesh>
  );
};
