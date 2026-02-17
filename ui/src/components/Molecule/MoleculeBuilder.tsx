/**
 * P31 Molecule Builder
 * Interactive 3D molecule builder with quantum coherence visualization
 * Optimized for performance and accessibility
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { PosnerMolecule, Atom, Bond } from '../../types/molecule';
import { generatePosnerMolecule } from '../../utils/moleculeBuilder';
import { Atom3D } from './Atom3D';
import { Bond3D } from './Bond3D';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import './MoleculeBuilder.css';

export const MoleculeBuilder: React.FC = () => {
  const [molecule, setMolecule] = useState<PosnerMolecule | null>(null);
  const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);
  const [showQuantum, setShowQuantum] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const { fontSize, animationReduced } = useAccessibilityStore();

  // Initialize with a Posner molecule (fixed: use useEffect instead of useMemo)
  useEffect(() => {
    if (!molecule) {
      setMolecule(generatePosnerMolecule('posner_1'));
    }
  }, [molecule]);

  // Memoize atom lookup map for O(1) access instead of O(n) find operations
  const atomMap = useMemo(() => {
    if (!molecule) return new Map<string, Atom>();
    return new Map(molecule.atoms.map((atom) => [atom.id, atom]));
  }, [molecule]);

  // Memoize event handlers to prevent unnecessary re-renders
  const handleAtomClick = useCallback((atom: Atom) => {
    setSelectedAtom(atom);
    setSelectedBond(null);
  }, []);

  const handleBondClick = useCallback((bond: Bond) => {
    setSelectedBond(bond);
    setSelectedAtom(null);
  }, []);

  const createNewMolecule = useCallback(() => {
    const newMolecule = generatePosnerMolecule(`posner_${Date.now()}`);
    setMolecule(newMolecule);
    setSelectedAtom(null);
    setSelectedBond(null);
  }, []);

  // Memoize rendered atoms for performance
  const renderedAtoms = useMemo(
    () =>
      molecule?.atoms.map((atom) => (
        <Atom3D
          key={atom.id}
          atom={atom}
          selected={selectedAtom?.id === atom.id}
          showLabel={showLabels}
          showQuantum={showQuantum}
          onClick={handleAtomClick}
        />
      )) || [],
    [molecule?.atoms, selectedAtom?.id, showLabels, showQuantum, handleAtomClick]
  );

  // Memoize rendered bonds - OPTIMIZED: use atomMap for O(1) lookup instead of O(n) find
  const renderedBonds = useMemo(
    () =>
      molecule?.bonds
        .map((bond) => {
          const atom1 = atomMap.get(bond.atom1Id);
          const atom2 = atomMap.get(bond.atom2Id);
          if (!atom1 || !atom2) return null;

          return (
            <Bond3D
              key={bond.id}
              bond={bond}
              atom1={atom1}
              atom2={atom2}
              selected={selectedBond?.id === bond.id}
            />
          );
        })
        .filter(Boolean) || [],
    [molecule?.bonds, atomMap, selectedBond?.id]
  );

  if (!molecule) {
    return (
      <div className="molecule-builder">
        <div className="loading">Initializing molecule builder...</div>
      </div>
    );
  }

  return (
    <div className="molecule-builder">
      <div className="builder-header">
        <h2>P31 Molecule Builder</h2>
        <div className="molecule-info">
          <div className="info-item">
            <span>Molecule:</span>
            <strong>{molecule.name}</strong>
          </div>
          <div className="info-item">
            <span>Formula:</span>
            <strong>{molecule.formula}</strong>
          </div>
          <div className="info-item">
            <span>Quantum Coherence:</span>
            <strong>{(molecule.quantumState.coherence * 100).toFixed(1)}%</strong>
          </div>
        </div>
      </div>

      <div className="builder-controls">
        <button
          onClick={createNewMolecule}
          className={`control-button ${fontSize === 'xlarge' ? 'control-button-large' : ''}`}
          aria-label="Create new Posner molecule"
        >
          ✨ New Posner Molecule
        </button>
        <label className="control-toggle">
          <input
            type="checkbox"
            checked={showQuantum}
            onChange={(e) => setShowQuantum(e.target.checked)}
            aria-label="Toggle quantum coherence visualization"
          />
          <span>Show Quantum Coherence</span>
        </label>
        <label className="control-toggle">
          <input
            type="checkbox"
            checked={showLabels}
            onChange={(e) => setShowLabels(e.target.checked)}
            aria-label="Toggle atom labels"
          />
          <span>Show Labels</span>
        </label>
      </div>

      <div className="builder-canvas" role="application" aria-label="3D molecule visualization">
        <Canvas
          camera={{ position: [10, 10, 10], fov: 50 }}
          shadows={!animationReduced}
          dpr={animationReduced ? 1 : [1, 2]}
          performance={{ min: 0.5 }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow={!animationReduced} />
          <pointLight position={[-10, -10, -5]} intensity={0.3} />

          {/* Conditionally load Environment only if not reduced motion */}
          {!animationReduced && <Environment preset="sunset" />}

          {/* Grid can be expensive - make it optional or simpler */}
          {!animationReduced && (
            <Grid infiniteGrid fadeDistance={50} fadeStrength={2} cellSize={1} sectionSize={5} />
          )}

          <OrbitControls
            enableDamping={!animationReduced}
            dampingFactor={0.05}
            minDistance={5}
            maxDistance={50}
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
          />

          {/* Render atoms - memoized for better performance */}
          {renderedAtoms}

          {/* Render bonds - OPTIMIZED: use atomMap for O(1) lookup instead of O(n) find */}
          {renderedBonds}
        </Canvas>
      </div>

      {selectedAtom && (
        <div className="atom-details" role="region" aria-label="Selected atom information">
          <h3>Atom Details</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span>Element:</span>
              <strong>{selectedAtom.element}</strong>
            </div>
            <div className="detail-item">
              <span>Charge:</span>
              <strong>{selectedAtom.charge}</strong>
            </div>
            {selectedAtom.coherence !== undefined && (
              <div className="detail-item">
                <span>Coherence:</span>
                <strong>{(selectedAtom.coherence * 100).toFixed(1)}%</strong>
              </div>
            )}
            {selectedAtom.spin !== undefined && (
              <div className="detail-item">
                <span>Spin:</span>
                <strong>{selectedAtom.spin}</strong>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
