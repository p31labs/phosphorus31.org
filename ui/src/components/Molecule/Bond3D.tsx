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
  const { start, end, midpoint } = useMemo(() => {
    const start = new Vector3(atom1.position.x, atom1.position.y, atom1.position.z);
    const end = new Vector3(atom2.position.x, atom2.position.y, atom2.position.z);
    const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);
    return { start, end, midpoint };
  }, [atom1, atom2]);

  const length = start.distanceTo(end);

  // Bond thickness based on bond order
  const thickness = bond.order === 1 ? 0.1 : bond.order === 2 ? 0.15 : 0.2;

  // Calculate rotation to align cylinder with bond direction
  const up = new Vector3(0, 1, 0);
  const direction = new Vector3().subVectors(end, start).normalize();
  const axis = new Vector3().crossVectors(up, direction);
  const axisLength = axis.length();

  let quaternion = new Quaternion();
  if (axisLength > 0.001) {
    axis.normalize();
    const angle = Math.acos(Math.max(-1, Math.min(1, up.dot(direction))));
    quaternion.setFromAxisAngle(axis, angle);
  }

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
