/**
 * Entanglement Visualization
 * Shows quantum entanglement between atoms
 */

import React from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';
import { Atom } from '../../types/molecule';

interface EntanglementVisualizationProps {
  atom1: Atom;
  atom2: Atom;
  strength: number; // 0-1
}

export const EntanglementVisualization: React.FC<EntanglementVisualizationProps> = ({
  atom1,
  atom2,
  strength,
}) => {
  const pos1 = new Vector3(atom1.position.x, atom1.position.y, atom1.position.z);
  const pos2 = new Vector3(atom2.position.x, atom2.position.y, atom2.position.z);

  if (strength < 0.1) return null;

  return (
    <Line
      points={[pos1, pos2]}
      color="#FF00FF"
      lineWidth={strength * 3}
      transparent
      opacity={strength * 0.6}
      dashed
      dashScale={0.5}
      dashSize={0.1}
      gapSize={0.1}
    />
  );
};
