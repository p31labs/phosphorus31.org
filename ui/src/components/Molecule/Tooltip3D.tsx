/**
 * 3D Tooltip
 * Hover tooltip for atoms
 */

import React from 'react';
import { Html } from '@react-three/drei';
import { Atom } from '../../types/molecule';

interface Tooltip3DProps {
  atom: Atom;
  position: [number, number, number];
  visible: boolean;
}

export const Tooltip3D: React.FC<Tooltip3DProps> = ({ atom, position, visible }) => {
  if (!visible) return null;

  return (
    <Html position={position} center>
      <div className="atom-tooltip">
        <div className="tooltip-header">{atom.element}</div>
        {atom.coherence !== undefined && (
          <div className="tooltip-coherence">Coherence: {(atom.coherence * 100).toFixed(1)}%</div>
        )}
        <style>{`
          .atom-tooltip {
            background: rgba(0, 0, 0, 0.9);
            padding: 0.5rem 0.75rem;
            border-radius: 6px;
            border: 1px solid rgba(0, 255, 255, 0.5);
            color: white;
            font-size: 0.875rem;
            white-space: nowrap;
            backdrop-filter: blur(10px);
            box-shadow: 0 4px 20px rgba(0, 255, 255, 0.3);
          }

          .tooltip-header {
            font-weight: 700;
            color: #00FFFF;
            margin-bottom: 0.25rem;
          }

          .tooltip-coherence {
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.8);
          }
        `}</style>
      </div>
    </Html>
  );
};
