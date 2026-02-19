/**
 * P31 Science Center
 * Interactive educational hub for quantum biology and molecular structures
 *
 * Built with love and light. As above, so below. 💜
 *
 * @license
 * Copyright 2026 P31 Labs
 * Licensed under the AGPLv3 License
 */

import React, { useState } from 'react';
import { P31MoleculeViewer } from '../Molecule/P31MoleculeViewer';
import { MoleculeBuilder } from '../Molecule/MoleculeBuilder';
import './ScienceCenter.css';

type ScienceModule =
  | 'molecule-builder'
  | 'p31-viewer'
  | 'quantum-lab'
  | 'biology-lab'
  | 'chemistry-lab'
  | 'physics-lab';

export function ScienceCenter() {
  const [activeModule, setActiveModule] = useState<ScienceModule>('molecule-builder');
  const [showWelcome, setShowWelcome] = useState(true);

  const modules = [
    {
      id: 'molecule-builder' as ScienceModule,
      name: '🧬 Molecule Builder',
      description: 'Build and explore Posner molecules',
      status: 'active',
    },
    {
      id: 'p31-viewer' as ScienceModule,
      name: '🔺 P31 Molecule',
      description: 'Explore the P31 tetrahedron structure',
      status: 'active',
    },
    {
      id: 'quantum-lab' as ScienceModule,
      name: '⚛️ Quantum Lab',
      description: 'Quantum mechanics playground',
      status: 'coming-soon',
    },
    {
      id: 'biology-lab' as ScienceModule,
      name: '🧪 Biology Lab',
      description: 'Explore biological systems',
      status: 'coming-soon',
    },
    {
      id: 'chemistry-lab' as ScienceModule,
      name: '⚗️ Chemistry Lab',
      description: 'Chemical reactions and structures',
      status: 'coming-soon',
    },
    {
      id: 'physics-lab' as ScienceModule,
      name: '🌌 Physics Lab',
      description: 'Physics simulations and experiments',
      status: 'coming-soon',
    },
  ];

  return (
    <div className="science-center">
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-content">
            <h1>🔬 P31 Science Center 💜</h1>
            <p className="welcome-subtitle">
              The biological qubit. The atom in the bone. Made accessible. Made beautiful.
            </p>
            <div className="welcome-message">
              <p>
                Welcome to the Science Center! Here you can explore quantum biology, molecular
                structures, and scientific concepts in an interactive, beautiful way.
              </p>
              <p>
                <strong>The Centerpiece:</strong> The P31 Molecule Builder—where Phosphorus-31, the
                biological qubit, becomes visible, tangible, and understandable.
              </p>
            </div>
            <button className="welcome-button" onClick={() => setShowWelcome(false)}>
              Start Exploring 🚀
            </button>
          </div>
        </div>
      )}

      <div className="science-center-header">
        <h1>🔬 Science Center 💜</h1>
        <p className="subtitle">Quantum biology made accessible. Science made beautiful.</p>
      </div>

      <div className="module-selector">
        {modules.map((module) => (
          <button
            key={module.id}
            className={`module-button ${activeModule === module.id ? 'active' : ''} ${module.status}`}
            onClick={() => {
              if (module.status === 'active') {
                setActiveModule(module.id);
              }
            }}
            disabled={module.status !== 'active'}
          >
            <div className="module-icon">{module.name.split(' ')[0]}</div>
            <div className="module-info">
              <div className="module-name">{module.name.replace(/^[^\s]+\s/, '')}</div>
              <div className="module-description">{module.description}</div>
              {module.status === 'coming-soon' && <div className="coming-soon">Coming Soon</div>}
            </div>
          </button>
        ))}
      </div>

      <div className="module-content">
        {activeModule === 'molecule-builder' && (
          <div className="module-viewer">
            <MoleculeBuilder />
          </div>
        )}

        {activeModule === 'p31-viewer' && (
          <div className="module-viewer">
            <P31MoleculeViewer />
          </div>
        )}

        {activeModule === 'quantum-lab' && (
          <div className="coming-soon-module">
            <h2>⚛️ Quantum Lab</h2>
            <p>Coming soon! Quantum mechanics playground with:</p>
            <ul>
              <li>Quantum coherence visualization</li>
              <li>Entanglement experiments</li>
              <li>Drift animations</li>
              <li>The Grandfather Clock & The Cuckoo Clock</li>
            </ul>
          </div>
        )}

        {activeModule === 'biology-lab' && (
          <div className="coming-soon-module">
            <h2>🧪 Biology Lab</h2>
            <p>Coming soon! Biological systems exploration:</p>
            <ul>
              <li>Cell structure visualization</li>
              <li>DNA and protein structures</li>
              <li>Biological processes</li>
              <li>Quantum biology connections</li>
            </ul>
          </div>
        )}

        {activeModule === 'chemistry-lab' && (
          <div className="coming-soon-module">
            <h2>⚗️ Chemistry Lab</h2>
            <p>Coming soon! Chemical reactions and structures:</p>
            <ul>
              <li>Chemical reaction simulator</li>
              <li>Molecular structure builder</li>
              <li>Periodic table explorer</li>
              <li>Reaction mechanisms</li>
            </ul>
          </div>
        )}

        {activeModule === 'physics-lab' && (
          <div className="coming-soon-module">
            <h2>🌌 Physics Lab</h2>
            <p>Coming soon! Physics simulations:</p>
            <ul>
              <li>Wave mechanics</li>
              <li>Particle physics</li>
              <li>Relativity visualizations</li>
              <li>Quantum field theory</li>
            </ul>
          </div>
        )}
      </div>

      <div className="science-center-footer">
        <p>💜 With love and light. As above, so below. 💜</p>
        <p>The biological qubit. The atom in the bone. Made accessible. Made beautiful.</p>
        <p>The Mesh Holds. 🔺</p>
      </div>
    </div>
  );
}

export default ScienceCenter;
