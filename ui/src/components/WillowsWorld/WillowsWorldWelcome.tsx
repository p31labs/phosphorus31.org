/**
 * Willow's World Welcome Screen
 * Beautiful landing screen when first opening Willow's World
 */

import React from 'react';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import { SimpleButton } from '../Accessibility/SimpleButton';

interface WillowsWorldWelcomeProps {
  onEnter: () => void;
}

export const WillowsWorldWelcome: React.FC<WillowsWorldWelcomeProps> = ({ onEnter }) => {
  const { fontSize } = useAccessibilityStore();

  return (
    <div className="willow-welcome">
      <div className="welcome-content">
        <div className="welcome-icon">🌟</div>
        <h1 className="welcome-title" style={{ fontSize: fontSize === 'xlarge' ? '4rem' : '3rem' }}>
          Welcome to Willow's World!
        </h1>
        <p className="welcome-subtitle">A magical place for exploring, creating, and learning</p>
        <p className="welcome-description">
          In this world, you can paint with colors, make music, draw pictures, explore molecules,
          and learn about the stars. Everything is connected with love and light! 💜
        </p>

        <div className="welcome-features">
          <div className="feature-item">
            <span className="feature-icon">🌈</span>
            <span>Color Magic</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎵</span>
            <span>Music Maker</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🎨</span>
            <span>Drawing Board</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🧬</span>
            <span>Molecule Explorer</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⭐</span>
            <span>Star Stories</span>
          </div>
        </div>

        <SimpleButton
          label="🌟 Enter Willow's World"
          onClick={onEnter}
          variant="primary"
          size="large"
          style={{ fontSize: fontSize === 'xlarge' ? '2rem' : '1.5rem', marginTop: '2rem' }}
        />
      </div>

      <style>{`
        .willow-welcome {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: linear-gradient(135deg, #1a0033 0%, #4a0080 50%, #1a0033 100%);
          color: white;
        }

        .welcome-content {
          text-align: center;
          max-width: 700px;
          padding: 2rem;
        }

        .welcome-icon {
          font-size: 8rem;
          margin-bottom: 1rem;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }

        .welcome-title {
          font-weight: 900;
          background: linear-gradient(135deg, #FF69B4 0%, #87CEEB 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
          text-shadow: 0 0 40px rgba(255, 105, 180, 0.5);
        }

        .welcome-subtitle {
          font-size: 1.75rem;
          color: #FF69B4;
          margin-bottom: 1rem;
          font-style: italic;
        }

        .welcome-description {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.8;
          margin-bottom: 2rem;
        }

        .welcome-features {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .feature-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem;
          background: rgba(255, 105, 180, 0.1);
          border: 2px solid rgba(255, 105, 180, 0.3);
          border-radius: 12px;
          transition: all 0.3s;
        }

        .feature-item:hover {
          background: rgba(255, 105, 180, 0.2);
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(255, 105, 180, 0.4);
        }

        .feature-icon {
          font-size: 3rem;
        }
      `}</style>
    </div>
  );
};
