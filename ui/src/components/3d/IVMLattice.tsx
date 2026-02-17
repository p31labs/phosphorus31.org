/**
 * IVM Lattice — Full isotropic vector matrix in the 3D scene
 *
 * Wraps IVMLatticePoints + IVMLatticeEdges with generateIVM().
 * Use as background layer in P31 Quantum Console / cockpit.
 */

import { useMemo } from 'react';
import { generateIVM } from '../../engine/ivm';
import { IVMLatticePoints } from './IVMLatticePoints';
import { IVMLatticeEdges } from './IVMLatticeEdges';

interface IVMLatticeProps {
  radius?: number;
  spacing?: number;
  color?: string;
  showPoints?: boolean;
  showEdges?: boolean;
}

export function IVMLattice({
  radius = 10,
  spacing = 1.2,
  color = '#2ecc71',
  showPoints = true,
  showEdges = true,
}: IVMLatticeProps) {
  const { points, edges } = useMemo(
    () => generateIVM(radius, spacing),
    [radius, spacing]
  );

  return (
    <group>
      {showEdges && (
        <IVMLatticeEdges points={points} edges={edges} color={color} />
      )}
      {showPoints && (
        <IVMLatticePoints points={points} color={color} />
      )}
    </group>
  );
}

export default IVMLattice;
