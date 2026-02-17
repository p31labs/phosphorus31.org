/**
 * P31 Molecule Builder Hero
 * The centerpiece - beautiful landing and main interface
 */

import React, { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Grid, Text, Html } from '@react-three/drei';
import { EnhancedOrbitControls } from './OrbitControls';
import { PosnerMolecule, Atom, Bond } from '../../types/molecule';
import { generatePosnerMolecule } from '../../utils/moleculeBuilder';
import { Atom3D } from './Atom3D';
import { P31Atom } from './P31Atom';
import { Bond3D } from './Bond3D';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import { useMoleculeBuilder } from '../../hooks/useMoleculeBuilder';
import { QuantumField } from './QuantumField';
import { QuantumParticles } from './QuantumParticles';
import { CoherenceMeter } from './CoherenceMeter';
import { QuantumTimeline } from './QuantumTimeline';
import { SaveLoadMolecule } from './SaveLoadMolecule';
import { Posner4DPlayground } from './Posner4D';
import * as THREE from 'three';

const QuantumParticle: React.FC<{ position: THREE.Vector3; coherence: number }> = ({
  position,
  coherence,
}) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1 * coherence, 16, 16]} />
      <meshStandardMaterial
        color="#00FFFF"
        emissive="#00FFFF"
        emissiveIntensity={coherence * 0.8}
        transparent
        opacity={coherence}
      />
    </mesh>
  );
};

const MoleculeScene: React.FC<{
  molecule: PosnerMolecule;
  selectedAtom: Atom | null;
  showQuantum: boolean;
  showLabels: boolean;
  onAtomClick: (atom: Atom) => void;
  hoveredAtom: Atom | null;
}> = ({ molecule, selectedAtom, showQuantum, showLabels, onAtomClick, hoveredAtom }) => {
  return (
    <>
      {/* Ambient quantum field */}
      {showQuantum && <ambientLight intensity={0.3} color="#00FFFF" />}

      {/* Render atoms - Special handling for P31 */}
      {molecule.atoms.map((atom) => {
        if (atom.element === 'P31') {
          return (
            <P31Atom
              key={atom.id}
              atom={atom}
              selected={selectedAtom?.id === atom.id}
              showQuantum={showQuantum}
              onClick={onAtomClick}
            />
          );
        }
        return (
          <Atom3D
            key={atom.id}
            atom={atom}
            selected={selectedAtom?.id === atom.id}
            showLabel={showLabels}
            showQuantum={showQuantum}
            onClick={onAtomClick}
          />
        );
      })}

      {/* Render bonds */}
      {molecule.bonds.map((bond) => {
        const atom1 = molecule.atoms.find((a) => a.id === bond.atom1Id);
        const atom2 = molecule.atoms.find((a) => a.id === bond.atom2Id);
        if (!atom1 || !atom2) return null;

        return <Bond3D key={bond.id} bond={bond} atom1={atom1} atom2={atom2} selected={false} />;
      })}

      {/* Quantum coherence visualization */}
      {showQuantum && molecule.quantumState.coherence > 0 && (
        <>
          <QuantumField coherence={molecule.quantumState.coherence} radius={5} />
          <QuantumParticles count={150} coherence={molecule.quantumState.coherence} />
        </>
      )}
    </>
  );
};

export const MoleculeBuilderHero: React.FC = () => {
  const {
    molecule,
    selectedAtom,
    setSelectedAtom,
    setMolecule,
    createNewMolecule,
    updateQuantumCoherence,
  } = useMoleculeBuilder();

  const [showQuantum, setShowQuantum] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [viewMode, setViewMode] = useState<'3d' | '4d'>('3d');
  const [hoveredAtom, setHoveredAtom] = useState<Atom | null>(null);
  const { fontSize, animationReduced } = useAccessibilityStore();

  // Initialize with a Posner molecule
  React.useEffect(() => {
    if (!molecule) {
      createNewMolecule();
    }
  }, [molecule, createNewMolecule]);

  const handleAtomClick = (atom: Atom) => {
    setSelectedAtom(atom);
  };

  const handleAtomHover = (atom: Atom | null) => {
    setHoveredAtom(atom);
  };

  const coherencePercentage = molecule ? (molecule.quantumState.coherence * 100).toFixed(1) : '0.0';

  const p31Atoms = molecule?.atoms.filter((a) => a.element === 'P31') || [];
  const totalAtoms = molecule?.atoms.length || 0;
  const totalBonds = molecule?.bonds.length || 0;

  if (viewMode === '4d') {
    return (
      <div className="molecule-builder-hero flex flex-col h-full">
        <div className="hero-header flex-shrink-0">
          <div className="hero-title-section flex flex-wrap items-center gap-4">
            <h1 className="hero-title">
              <span className="title-main">P31</span>
              <span className="title-subtitle">Molecule Builder</span>
            </h1>
            <div className="flex gap-2" role="tablist" aria-label="View mode">
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === '4d' ? 'true' : 'false'}
                onClick={() => setViewMode('4d')}
                className="px-3 py-1.5 rounded bg-cyan-600 text-white font-medium"
              >
                4D Playground
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={viewMode === '3d' ? 'true' : 'false'}
                onClick={() => setViewMode('3d')}
                className="px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20"
              >
                3D Builder
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 min-h-0">
          <Posner4DPlayground />
        </div>
      </div>
    );
  }

  return (
    <div className="molecule-builder-hero">
      {/* Hero Header */}
      <div className="hero-header">
        <div className="hero-title-section">
          <h1 className="hero-title">
            <span className="title-main">P31</span>
            <span className="title-subtitle">Molecule Builder</span>
          </h1>
          <p className="hero-description">
            The biological qubit. The atom in the bone. Phosphorus-31 in Posner molecules.
          </p>
          <div className="flex gap-2 mt-3" role="tablist" aria-label="View mode">
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === '3d' ? 'true' : 'false'}
              onClick={() => setViewMode('3d')}
              className="px-3 py-1.5 rounded bg-cyan-600 text-white font-medium"
            >
              3D Builder
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === '4d' ? 'true' : 'false'}
              onClick={() => setViewMode('4d')}
              className="px-3 py-1.5 rounded bg-white/10 text-white hover:bg-white/20"
            >
              4D Playground
            </button>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-card quantum">
            <div className="stat-icon">⚛️</div>
            <div className="stat-content">
              <div className="stat-label">Quantum Coherence</div>
              <div className="stat-value">{coherencePercentage}%</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🧬</div>
            <div className="stat-content">
              <div className="stat-label">P31 Atoms</div>
              <div className="stat-value">{p31Atoms.length}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚛️</div>
            <div className="stat-content">
              <div className="stat-label">Total Atoms</div>
              <div className="stat-value">{totalAtoms}</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🔗</div>
            <div className="stat-content">
              <div className="stat-label">Bonds</div>
              <div className="stat-value">{totalBonds}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="hero-content">
        {/* 3D Canvas */}
        <div className="canvas-container">
          <Canvas
            camera={{ position: [15, 15, 15], fov: 50 }}
            shadows
            dpr={animationReduced ? 1 : [1, 2]}
            gl={{ antialias: true, alpha: true }}
          >
            <color attach="background" args={['#000011']} />

            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00FFFF" />
            <pointLight position={[10, -10, 5]} intensity={0.3} color="#FF4000" />

            <Environment preset="night" />

            <Grid
              infiniteGrid
              fadeDistance={100}
              fadeStrength={3}
              cellSize={2}
              sectionSize={10}
              sectionColor="#00FFFF"
              cellColor="#004444"
              cellThickness={0.5}
            />

            <EnhancedOrbitControls autoRotate={true} autoRotateSpeed={0.5} />

            {molecule && (
              <MoleculeScene
                molecule={molecule}
                selectedAtom={selectedAtom}
                showQuantum={showQuantum}
                showLabels={showLabels}
                onAtomClick={handleAtomClick}
                hoveredAtom={hoveredAtom}
              />
            )}

            {/* Center text */}
            <Html position={[0, 8, 0]} center>
              <div className="floating-label">
                <div className="label-text">Ca9(PO4)6</div>
                <div className="label-subtitle">Posner Molecule</div>
              </div>
            </Html>
          </Canvas>
        </div>

        {/* Control Panel */}
        <div className="control-panel">
          <div className="panel-section">
            <h3 className="panel-title">Controls</h3>
            <div className="control-group">
              <button
                onClick={createNewMolecule}
                className="control-button primary"
                style={{ fontSize: fontSize === 'xlarge' ? '1.25rem' : '1rem' }}
              >
                <span className="button-icon">🧬</span>
                <span>New Posner Molecule</span>
              </button>
              <button
                onClick={() => {
                  if (molecule) {
                    const updated = {
                      ...molecule,
                      quantumState: {
                        ...molecule.quantumState,
                        coherence: 1.0, // Reset coherence
                      },
                    };
                    setMolecule(updated);
                  }
                }}
                className="control-button"
                style={{ fontSize: fontSize === 'xlarge' ? '1.25rem' : '1rem' }}
                disabled={!molecule}
              >
                <span className="button-icon">⚛️</span>
                <span>Reset Coherence</span>
              </button>
            </div>

            <div className="control-group">
              <label className="control-toggle">
                <input
                  type="checkbox"
                  checked={showQuantum}
                  onChange={(e) => setShowQuantum(e.target.checked)}
                />
                <span className="toggle-label">
                  <span className="toggle-icon">⚛️</span>
                  Quantum Coherence
                </span>
              </label>
              <label className="control-toggle">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                />
                <span className="toggle-label">
                  <span className="toggle-icon">🏷️</span>
                  Element Labels
                </span>
              </label>
            </div>
          </div>

          {/* Atom Details */}
          {selectedAtom && (
            <div className="panel-section atom-details-panel">
              <h3 className="panel-title">Atom Details</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Element</span>
                  <span className="detail-value highlight">{selectedAtom.element}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Atomic Number</span>
                  <span className="detail-value">{selectedAtom.atomicNumber}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Charge</span>
                  <span className="detail-value">
                    {selectedAtom.charge > 0 ? '+' : ''}
                    {selectedAtom.charge}
                  </span>
                </div>
                {selectedAtom.coherence !== undefined && (
                  <div className="detail-item quantum-detail">
                    <span className="detail-label">Coherence</span>
                    <span className="detail-value quantum-value">
                      {(selectedAtom.coherence * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
                {selectedAtom.spin !== undefined && (
                  <div className="detail-item quantum-detail">
                    <span className="detail-label">Nuclear Spin</span>
                    <span className="detail-value quantum-value">{selectedAtom.spin}</span>
                  </div>
                )}
                {selectedAtom.entangledWith && selectedAtom.entangledWith.length > 0 && (
                  <div className="detail-item quantum-detail">
                    <span className="detail-label">Entangled</span>
                    <span className="detail-value quantum-value">
                      {selectedAtom.entangledWith.length} atoms
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Molecule Info */}
          {molecule && (
            <div className="panel-section">
              <h3 className="panel-title">Molecule Info</h3>
              <div className="info-content">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{molecule.name}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Formula:</span>
                  <span className="info-value formula">{molecule.formula}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Geometry:</span>
                  <span className="info-value">{molecule.geometry.type}</span>
                </div>
                <div className="info-item quantum-info">
                  <span className="info-label">Coherence Lifetime:</span>
                  <span className="info-value">
                    {(molecule.quantumState.lifetime / 1000).toFixed(0)}s
                  </span>
                </div>
              </div>

              {/* Quantum Timeline */}
              {showQuantum && (
                <div className="timeline-section">
                  <QuantumTimeline
                    initialCoherence={molecule.quantumState.coherence}
                    decoherenceRate={molecule.quantumState.lifetime}
                    onCoherenceUpdate={(coherence) => {
                      // Could update molecule coherence here
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .molecule-builder-hero {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: linear-gradient(135deg, #000011 0%, #001122 50%, #000011 100%);
          color: white;
          overflow: hidden;
        }

        .hero-header {
          padding: 2rem;
          background: linear-gradient(180deg, rgba(0, 255, 255, 0.1) 0%, transparent 100%);
          border-bottom: 2px solid rgba(0, 255, 255, 0.3);
        }

        .hero-title-section {
          margin-bottom: 1.5rem;
        }

        .hero-title {
          display: flex;
          align-items: baseline;
          gap: 1rem;
          margin: 0;
          font-size: 3rem;
          font-weight: 900;
          background: linear-gradient(135deg, #00FFFF 0%, #FF4000 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-shadow: 0 0 40px rgba(0, 255, 255, 0.5);
          animation: title-glow 3s ease-in-out infinite;
        }

        @keyframes title-glow {
          0%, 100% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.2);
          }
        }

        .title-main {
          font-size: 4rem;
          letter-spacing: 0.1em;
        }

        .title-subtitle {
          font-size: 2rem;
          font-weight: 300;
          opacity: 0.8;
        }

        .hero-description {
          margin-top: 0.5rem;
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.8);
          font-style: italic;
        }

        .hero-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          position: relative;
          overflow: hidden;
        }

        .stat-meter {
          margin-left: auto;
        }

        .stat-card.quantum {
          background: linear-gradient(135deg, rgba(0, 255, 255, 0.2) 0%, rgba(255, 64, 0, 0.2) 100%);
          border-color: rgba(0, 255, 255, 0.5);
          box-shadow: 0 0 30px rgba(0, 255, 255, 0.4);
          animation: quantum-glow 3s ease-in-out infinite;
        }

        .stat-icon {
          font-size: 2rem;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #00FFFF;
        }

        .stat-value.quantum-text {
          text-shadow: 0 0 20px rgba(0, 255, 255, 0.8);
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 350px;
          flex: 1;
          overflow: hidden;
        }

        .canvas-container {
          position: relative;
          background: radial-gradient(circle at center, #001122 0%, #000000 100%);
          overflow: hidden;
        }

        .canvas-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% 50%, rgba(0, 255, 255, 0.05) 0%, transparent 70%);
          pointer-events: none;
          animation: quantum-pulse-bg 4s ease-in-out infinite;
        }

        @keyframes quantum-pulse-bg {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.6;
          }
        }

        .floating-label {
          background: rgba(0, 0, 0, 0.8);
          padding: 1rem 2rem;
          border-radius: 12px;
          border: 2px solid rgba(0, 255, 255, 0.5);
          text-align: center;
          backdrop-filter: blur(10px);
        }

        .label-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #00FFFF;
          margin-bottom: 0.25rem;
        }

        .label-subtitle {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .control-panel {
          background: rgba(0, 0, 0, 0.6);
          border-left: 2px solid rgba(0, 255, 255, 0.3);
          padding: 1.5rem;
          overflow-y: auto;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .panel-section {
          margin-bottom: 2rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .panel-title {
          font-size: 1.25rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #00FFFF;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .control-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .control-button:disabled:hover {
          transform: none;
          box-shadow: none;
        }

        .control-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: linear-gradient(135deg, #00FFFF 0%, #0088FF 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
        }

        .control-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 255, 255, 0.5);
        }

        .control-button.primary {
          background: linear-gradient(135deg, #FF4000 0%, #FF8000 100%);
          box-shadow: 0 4px 15px rgba(255, 64, 0, 0.3);
        }

        .control-button.primary:hover {
          box-shadow: 0 6px 20px rgba(255, 64, 0, 0.5);
        }

        .button-icon {
          font-size: 1.25rem;
        }

        .control-toggle {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .control-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .control-toggle input[type="checkbox"] {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .toggle-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
        }

        .toggle-icon {
          font-size: 1.25rem;
        }

        .detail-grid {
          display: grid;
          gap: 0.75rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
        }

        .detail-item.quantum-detail {
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.3);
        }

        .detail-label {
          color: rgba(255, 255, 255, 0.6);
          font-size: 0.875rem;
        }

        .detail-value {
          font-weight: 600;
          color: white;
        }

        .detail-value.highlight {
          color: #00FFFF;
          font-size: 1.125rem;
        }

        .detail-value.quantum-value {
          color: #00FFFF;
          font-weight: 700;
        }

        .info-content {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
        }

        .info-label {
          color: rgba(255, 255, 255, 0.6);
        }

        .info-value {
          font-weight: 600;
          color: white;
        }

        .info-value.formula {
          color: #00FFFF;
          font-family: monospace;
          font-size: 1.125rem;
        }

        .info-item.quantum-info {
          padding: 0.75rem;
          background: rgba(0, 255, 255, 0.1);
          border-radius: 6px;
        }

        .timeline-section {
          margin-top: 1rem;
        }

        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
          }

          .control-panel {
            border-left: none;
            border-top: 2px solid rgba(0, 255, 255, 0.3);
            max-height: 40vh;
          }
        }
      `}</style>
    </div>
  );
};
