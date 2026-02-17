/**
 * Quantum MVP — single view: IVM lattice, place tetrahedra, geodesic analysis, coherence, clock.
 * Swarm wired in: agents build into the same structure; optional Sierpiński rule in MVPUI.
 * No backend; analysis runs locally. Perfect for demos and pitching.
 */

import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import { IVMLattice } from '../3d/IVMLattice';
import { StructureVisualization } from '../WorldBuilder/StructureVisualization';
import { SwarmScene } from '../WorldBuilder/agents/SwarmScene';
import { SwarmControl } from '../WorldBuilder/agents/SwarmControl';
import { QuantumClockMVP } from './QuantumClockMVP';
import { MVPUI } from './MVPUI';
import { useStructureStore } from '../../stores/structure.store';
import { useCoherenceStore } from '../../stores/coherence.store';
import { analyzeStructure } from '../../engine/structure-analysis';

const SMOOTHING = 0.95;

interface QuantumMVPViewProps {
  onClose: () => void;
}

export const QuantumMVPView: React.FC<QuantumMVPViewProps> = ({ onClose }) => {
  const { vertices, edges } = useStructureStore();
  const updateGlobalCoherence = useCoherenceStore((s) => s.updateGlobalCoherence);
  const smoothedRef = useRef(1.0);

  useEffect(() => {
    if (vertices.length === 0) return;
    const { stability } = analyzeStructure(vertices, edges);
    smoothedRef.current = smoothedRef.current * SMOOTHING + stability * (1 - SMOOTHING);
    updateGlobalCoherence(Math.min(1, Math.max(0, smoothedRef.current)));
  }, [vertices, edges, updateGlobalCoherence]);

  return (
    <div className="fixed inset-0 z-50 bg-[#050510] flex flex-col">
      <header className="flex items-center justify-between px-4 py-2 bg-black/50 border-b border-[#2ecc71]/20">
        <h1 className="text-lg font-bold text-[#2ecc71]">Quantum MVP — The Mesh Holds 🔺</h1>
        <button
          type="button"
          onClick={onClose}
          className="px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-[#2ecc71]"
          aria-label="Close Quantum MVP"
        >
          Close
        </button>
      </header>
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [5, 5, 10], fov: 50 }}
          dpr={[1, 2]}
          className="w-full h-full"
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={0.8} />
          <Grid
            infiniteGrid
            fadeDistance={30}
            cellSize={1}
            sectionSize={5}
            sectionColor="#404040"
            cellColor="#2ecc71"
            cellThickness={0.5}
          />
          <IVMLattice radius={12} spacing={1.2} color="#2ecc71" />
          {vertices.length > 0 && (
            <StructureVisualization vertices={vertices} edges={edges} color="#2ecc71" />
          )}
          <SwarmScene />
          <QuantumClockMVP position={[0, 2, 6]} />
          <OrbitControls enableDamping dampingFactor={0.05} />
        </Canvas>
        <MVPUI />
        <SwarmControl />
      </div>
    </div>
  );
};

export default QuantumMVPView;
