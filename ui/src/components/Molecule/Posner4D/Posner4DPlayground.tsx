/**
 * 4D Posner Molecule Playground
 * Ca₉(PO₄)₆ with quantum phase slider, coherence-driven glow, selection and entanglement
 */

import React, { useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { generatePosnerMolecule } from '../../../utils/posnerGeometry';
import { usePosnerPlaygroundStore } from '../../../stores/posnerPlayground.store';
import { useCoherenceStore } from '../../../stores/coherence.store';
import { PosnerAtom4D } from './PosnerAtom4D';
import { PosnerBond4D } from './PosnerBond4D';
import { EntanglementLine4D } from './EntanglementLine4D';

const TAU = 2 * Math.PI;

export const Posner4DPlayground: React.FC = () => {
  const { atoms, bonds } = useMemo(() => generatePosnerMolecule(), []);
  const selectedAtomIndices = usePosnerPlaygroundStore((s) => s.selectedAtomIndices);
  const entangledPairs = usePosnerPlaygroundStore((s) => s.entangledPairs);
  const toggleAtom = usePosnerPlaygroundStore((s) => s.toggleAtom);
  const entangle = usePosnerPlaygroundStore((s) => s.entangle);
  const atomPhases = usePosnerPlaygroundStore((s) => s.atomPhases);
  const setAtomPhase = usePosnerPlaygroundStore((s) => s.setAtomPhase);
  const coherence = useCoherenceStore((s) => s.globalCoherence);
  const [phase, setPhase] = useState(0);
  const [selectedPhase, setSelectedPhase] = useState(0);

  const phosphorusIndices = useMemo(
    () => atoms.filter((a) => a.element === 'P').map((a) => a.index),
    [atoms]
  );
  const canEntangle =
    selectedAtomIndices.length === 2 &&
    selectedAtomIndices.every((i) => phosphorusIndices.includes(i));

  const handleEntangle = () => {
    if (selectedAtomIndices.length === 2) {
      entangle(selectedAtomIndices[0], selectedAtomIndices[1]);
    }
  };

  return (
    <div className="posner-4d-playground flex flex-col h-full w-full bg-[#050510] text-white">
      <div className="flex-1 min-h-0 relative">
        <Canvas camera={{ position: [5, 5, 10], fov: 50 }} dpr={[1, 2]}>
          <color attach="background" args={['#050510']} />
          <ambientLight intensity={0.35} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-8, -8, 8]} intensity={0.4} color="#22c55e" />
          <Environment preset="night" />
          <Grid
            infiniteGrid
            fadeDistance={40}
            fadeStrength={2}
            cellSize={1}
            sectionSize={4}
            sectionColor="#0f172a"
            cellColor="#1e293b"
          />
          <group>
            {atoms.map((atom) => (
              <PosnerAtom4D
                key={atom.index}
                atom={atom}
                isSelected={selectedAtomIndices.includes(atom.index)}
                coherence={coherence}
                phaseOffset={phase}
                atomPhase={atomPhases[atom.index]}
                onSelect={() => toggleAtom(atom.index)}
              />
            ))}
            {bonds.map((bond, i) => (
              <PosnerBond4D
                key={`bond-${i}`}
                from={atoms[bond.from].position}
                to={atoms[bond.to].position}
              />
            ))}
            {entangledPairs.map(([a, b], i) => (
              <EntanglementLine4D
                key={`ent-${i}`}
                from={atoms[a].position}
                to={atoms[b].position}
                coherence={coherence}
              />
            ))}
          </group>
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            minDistance={4}
            maxDistance={25}
          />
        </Canvas>
      </div>

      {/* Controls */}
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end gap-4 z-10">
        <div className="bg-black/70 backdrop-blur rounded-lg p-4 min-w-[200px]">
          <label className="block text-sm font-medium text-cyan-300 mb-2">
            Quantum phase φ
          </label>
          <input
            type="range"
            min={0}
            max={TAU}
            step={0.01}
            value={phase}
            onChange={(e) => setPhase(parseFloat(e.target.value))}
            className="w-full h-2 rounded accent-cyan-500"
            aria-label="Quantum phase"
          />
          <span className="text-xs text-white/70 mt-1 block">
            {(phase / Math.PI).toFixed(2)} π
          </span>
        </div>

        {selectedAtomIndices.length > 0 && (
          <div className="bg-black/70 backdrop-blur rounded-lg p-4 min-w-[200px]">
            <label className="block text-sm font-medium text-cyan-300 mb-2">
              Selected atom phase (w)
            </label>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.01}
              value={
                selectedAtomIndices.length === 1
                  ? atomPhases[selectedAtomIndices[0]] ?? 0
                  : selectedPhase
              }
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                setSelectedPhase(v);
                selectedAtomIndices.forEach((idx) => setAtomPhase(idx, v));
              }}
              className="w-full h-2 rounded accent-cyan-500"
              aria-label="Selected atom phase"
            />
          </div>
        )}

        {canEntangle && (
          <button
            type="button"
            onClick={handleEntangle}
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium transition"
            aria-label="Entangle selected phosphorus atoms"
          >
            Entangle P–P
          </button>
        )}

        <div className="ml-auto bg-black/50 rounded-lg px-3 py-2 text-sm text-white/80">
          Coherence: <span className="text-cyan-400">{(coherence * 100).toFixed(0)}%</span>
        </div>
      </div>

      <div className="absolute top-4 left-4 z-10 bg-black/50 rounded-lg px-3 py-2 text-sm">
        <span className="text-cyan-400 font-medium">Ca₉(PO₄)₆</span>
        <span className="text-white/60 ml-2">4D Posner · Click atoms, entangle P–P</span>
      </div>
    </div>
  );
};
