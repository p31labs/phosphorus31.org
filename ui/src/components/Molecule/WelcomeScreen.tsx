/**
 * Welcome Screen for Molecule Builder
 * Beautiful landing screen when first opening
 */

import React from 'react';
import { useAccessibilityStore } from '../../stores/accessibility.store';

interface WelcomeScreenProps {
  onStart: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  const { fontSize } = useAccessibilityStore();

  return (
    <div className="welcome-screen">
      <div className="welcome-content">
        <div className="welcome-icon">🧬</div>
        <h1
          className="welcome-title"
          style={{ fontSize: fontSize === 'xlarge' ? '3rem' : '2.5rem' }}
        >
          P31 Molecule Builder
        </h1>
        <p className="welcome-subtitle">The biological qubit. The atom in the bone.</p>
        <p className="welcome-description">
          Explore Posner molecules (Ca9(PO4)6) containing Phosphorus-31 - the nuclear spin that
          carries quantum coherence in biological systems.
        </p>

        <div className="welcome-features">
          <div className="feature-item">
            <span className="feature-icon">⚛️</span>
            <span>Quantum Coherence Visualization</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🧬</span>
            <span>Interactive 3D Posner Molecules</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔬</span>
            <span>Real-time Atom & Bond Details</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✨</span>
            <span>Beautiful Quantum Effects</span>
          </div>
        </div>

        <button
          onClick={onStart}
          className="welcome-button"
          style={{ fontSize: fontSize === 'xlarge' ? '1.5rem' : '1.25rem' }}
        >
          <span>Start Building</span>
          <span className="button-arrow">→</span>
        </button>
      </div>

      <style>{`
        .welcome-screen {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #000011 0%, #001122 50%, #000011 100%);
          color: white;
        }

        .welcome-content {
          text-align: center;
          max-width: 600px;
          padding: 2rem;
        }

        .welcome-icon {
          font-size: 6rem;
          margin-bottom: 1rem;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        .welcome-title {
          font-weight: 900;
          background: linear-gradient(135deg, #00FFFF 0%, #FF4000 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .welcome-subtitle {
          font-size: 1.5rem;
          color: #00FFFF;
          margin-bottom: 1rem;
          font-style: italic;
        }

        .welcome-description {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .welcome-features {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(0, 255, 255, 0.1);
          border: 1px solid rgba(0, 255, 255, 0.3);
          border-radius: 8px;
          text-align: left;
        }

        .feature-icon {
          font-size: 1.5rem;
        }

        .welcome-button {
          display: inline-flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 3rem;
          background: linear-gradient(135deg, #00FFFF 0%, #0088FF 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 8px 25px rgba(0, 255, 255, 0.4);
        }

        .welcome-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(0, 255, 255, 0.6);
        }

        .button-arrow {
          font-size: 1.5rem;
          transition: transform 0.3s;
        }

        .welcome-button:hover .button-arrow {
          transform: translateX(5px);
        }
      `}</style>
    </div>
  );
};
