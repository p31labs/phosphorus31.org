/**
 * Saturn to Aries Transformation
 * Structural discipline (Saturn) → Creative action (Aries)
 *
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import React, { useState, useEffect } from 'react';
import './SaturnToAries.css';

interface TransformationState {
  phase: 'saturn' | 'transition' | 'aries';
  saturnEnergy: number; // 0-100 (structure, discipline, boundaries)
  ariesEnergy: number; // 0-100 (action, initiation, courage)
  transformationProgress: number; // 0-100
}

export const SaturnToAries: React.FC = () => {
  const [state, setState] = useState<TransformationState>({
    phase: 'saturn',
    saturnEnergy: 100,
    ariesEnergy: 0,
    transformationProgress: 0,
  });

  const [code, setCode] = useState(`// Saturn: Structure and Discipline
// Boundaries define the space for action

const saturn = {
  structure: "defines",
  discipline: "focuses",
  boundaries: "protects",
  time: "patient"
};

// Transformation begins...
// Saturn energy → Aries energy
// Structure → Action
// Discipline → Initiative
// Boundaries → Courage

const transformation = (saturn, aries) => {
  // The structure becomes the foundation
  // The discipline becomes the fuel
  // The boundaries become the launch pad
  return {
    foundation: saturn.structure,
    fuel: saturn.discipline,
    launchPad: saturn.boundaries,
    action: aries.initiative,
    courage: aries.boldness
  };
};

// Aries: Action and Initiation
// The structured foundation enables bold action

const aries = {
  initiative: "starts",
  courage: "acts",
  boldness: "creates",
  fire: "ignites"
};

// Complete transformation
const result = transformation(saturn, aries);
// Structure → Action
// Discipline → Initiative  
// Boundaries → Courage
// Saturn → Aries`);

  useEffect(() => {
    // Auto-transform on mount
    const interval = setInterval(() => {
      setState((prev) => {
        if (prev.phase === 'saturn' && prev.transformationProgress < 50) {
          return {
            ...prev,
            transformationProgress: prev.transformationProgress + 2,
            saturnEnergy: Math.max(0, prev.saturnEnergy - 2),
            ariesEnergy: Math.min(100, prev.ariesEnergy + 2),
          };
        } else if (prev.phase === 'saturn' && prev.transformationProgress >= 50) {
          return {
            ...prev,
            phase: 'transition',
          };
        } else if (prev.phase === 'transition' && prev.transformationProgress < 100) {
          return {
            ...prev,
            transformationProgress: prev.transformationProgress + 2,
            saturnEnergy: Math.max(0, prev.saturnEnergy - 2),
            ariesEnergy: Math.min(100, prev.ariesEnergy + 2),
          };
        } else if (prev.phase === 'transition' && prev.transformationProgress >= 100) {
          return {
            ...prev,
            phase: 'aries',
          };
        }
        return prev;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const triggerTransformation = () => {
    setState({
      phase: 'saturn',
      saturnEnergy: 100,
      ariesEnergy: 0,
      transformationProgress: 0,
    });
  };

  const getPhaseDescription = () => {
    switch (state.phase) {
      case 'saturn':
        return {
          title: 'Saturn: Structure & Discipline',
          description: 'Building the foundation. Setting boundaries. Creating structure.',
          color: '#6B7280', // Gray
          symbol: '♄',
        };
      case 'transition':
        return {
          title: 'Transformation: Saturn → Aries',
          description:
            'Structure becomes foundation. Discipline becomes fuel. Boundaries become launch pad.',
          color: '#F59E0B', // Amber
          symbol: '⚡',
        };
      case 'aries':
        return {
          title: 'Aries: Action & Initiation',
          description: 'Bold action. Courageous initiation. Creative fire.',
          color: '#EF4444', // Red
          symbol: '♈',
        };
    }
  };

  const phaseInfo = getPhaseDescription();

  return (
    <div className="saturn-to-aries">
      <div className="transformation-header">
        <h2>
          <span className="phase-symbol">{phaseInfo.symbol}</span>
          {phaseInfo.title}
        </h2>
        <button onClick={triggerTransformation} className="reset-button">
          🔄 Reset Transformation
        </button>
      </div>

      <div className="energy-display">
        <div className="energy-bar-container">
          <div className="energy-label">Saturn Energy</div>
          <div className="energy-bar saturn-bar">
            <div
              className="energy-fill"
              style={{
                width: `${state.saturnEnergy}%`,
                backgroundColor: '#6B7280',
              }}
            />
            <span className="energy-value">{state.saturnEnergy}%</span>
          </div>
        </div>

        <div className="transformation-indicator">
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${state.transformationProgress}%` }} />
          </div>
          <div className="progress-text">Transformation: {state.transformationProgress}%</div>
        </div>

        <div className="energy-bar-container">
          <div className="energy-label">Aries Energy</div>
          <div className="energy-bar aries-bar">
            <div
              className="energy-fill"
              style={{
                width: `${state.ariesEnergy}%`,
                backgroundColor: '#EF4444',
              }}
            />
            <span className="energy-value">{state.ariesEnergy}%</span>
          </div>
        </div>
      </div>

      <div className="phase-description">
        <p style={{ color: phaseInfo.color }}>{phaseInfo.description}</p>
      </div>

      <div className="code-transformation">
        <div className="code-section">
          <h3>Saturn Code (Structure)</h3>
          <pre className="saturn-code">{code.split('\n').slice(0, 8).join('\n')}</pre>
        </div>

        <div className="transformation-arrow">
          <div className="arrow-line" />
          <div className="arrow-head" style={{ borderColor: phaseInfo.color }} />
        </div>

        <div className="code-section">
          <h3>Aries Code (Action)</h3>
          <pre className="aries-code">{code.split('\n').slice(18, 26).join('\n')}</pre>
        </div>
      </div>

      <div className="transformation-principles">
        <h3>Transformation Principles</h3>
        <div className="principles-grid">
          <div className="principle">
            <div className="principle-icon">🏗️</div>
            <div className="principle-title">Structure → Foundation</div>
            <div className="principle-text">
              Saturn's structure becomes the solid foundation for Aries' action
            </div>
          </div>
          <div className="principle">
            <div className="principle-icon">⚡</div>
            <div className="principle-title">Discipline → Fuel</div>
            <div className="principle-text">
              Saturn's discipline becomes the focused energy for Aries' initiative
            </div>
          </div>
          <div className="principle">
            <div className="principle-icon">🚀</div>
            <div className="principle-title">Boundaries → Launch Pad</div>
            <div className="principle-text">
              Saturn's boundaries become the safe space for Aries' bold action
            </div>
          </div>
          <div className="principle">
            <div className="principle-icon">🔥</div>
            <div className="principle-title">Time → Action</div>
            <div className="principle-text">
              Saturn's patience becomes the timing for Aries' courageous initiation
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
