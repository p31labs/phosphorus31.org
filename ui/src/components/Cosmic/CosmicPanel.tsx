/**
 * Cosmic Panel
 * Interface for planetary transitions and cosmic timing
 */

import React, { useState, useEffect } from 'react';
import { useGameEngineContext } from '../Game/GameEngineProvider';
import { SimpleButton } from '../Accessibility/SimpleButton';

export const CosmicPanel: React.FC = () => {
  const { gameEngine } = useGameEngineContext();
  const [planets, setPlanets] = useState<any[]>([]);
  const [transitions, setTransitions] = useState<any[]>([]);
  const [cosmicTiming, setCosmicTiming] = useState<any>(null);
  const [selectedPlanet, setSelectedPlanet] = useState<string>('saturn');
  const [targetSign, setTargetSign] = useState<string>('aries');

  useEffect(() => {
    if (!gameEngine) return;

    const cosmic = gameEngine.getCosmicTransition();
    setPlanets(cosmic.getPlanets());
    setTransitions(cosmic.getActiveTransitions());
    setCosmicTiming(cosmic.getCosmicTiming('build'));

    // Listen for transition events
    const handleTransitionStarted = () => {
      setTransitions(cosmic.getActiveTransitions());
    };

    const handleTransitionCompleted = () => {
      setTransitions(cosmic.getActiveTransitions());
      setPlanets(cosmic.getPlanets());
    };

    window.addEventListener('cosmic:transitionStarted', handleTransitionStarted);
    window.addEventListener('cosmic:transitionCompleted', handleTransitionCompleted);

    return () => {
      window.removeEventListener('cosmic:transitionStarted', handleTransitionStarted);
      window.removeEventListener('cosmic:transitionCompleted', handleTransitionCompleted);
    };
  }, [gameEngine]);

  const handleStartTransition = () => {
    if (!gameEngine) return;

    const cosmic = gameEngine.getCosmicTransition();
    const zodiacSigns = cosmic.getZodiacSigns();
    const target = zodiacSigns.find((s) => s.id === targetSign);

    if (target) {
      const transition = cosmic.calculateTransition(selectedPlanet, target);
      if (transition) {
        setTransitions(cosmic.getActiveTransitions());
        alert(`🌌 ${transition.description} started!`);
      }
    }
  };

  return (
    <div className="cosmic-panel">
      <div className="panel-header">
        <h1>🌌 Cosmic Transitions</h1>
        <p className="subtitle">Saturn into Aries. With love and light. As above, so below. 💜</p>
      </div>

      {/* Cosmic Timing */}
      {cosmicTiming && (
        <section className="section timing">
          <h3>⏰ Cosmic Timing</h3>
          <div className="timing-card">
            <p className="timing-message">{cosmicTiming.message}</p>
            <div className="timing-details">
              <span className={`favorable ${cosmicTiming.favorable ? 'yes' : 'no'}`}>
                {cosmicTiming.favorable ? '✅ Favorable' : '⚠️ Challenging'}
              </span>
              <span className="intensity">
                Intensity: {(cosmicTiming.intensity * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Planets */}
      <section className="section">
        <h3>🪐 Planets</h3>
        <div className="planets-grid">
          {planets.map((planet) => (
            <div
              key={planet.id}
              className={`planet-card ${selectedPlanet === planet.id ? 'selected' : ''}`}
              onClick={() => setSelectedPlanet(planet.id)}
            >
              <div className="planet-symbol" style={{ color: planet.color }}>
                {planet.symbol}
              </div>
              <div className="planet-info">
                <h4>{planet.name}</h4>
                <p className="current-sign">
                  {planet.currentSign.symbol} {planet.currentSign.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Active Transitions */}
      <section className="section">
        <h3>🌌 Active Transitions ({transitions.length})</h3>
        {transitions.length === 0 ? (
          <p>No active transitions. Start one below!</p>
        ) : (
          <div className="transitions-list">
            {transitions.map((transition) => {
              const planet = planets.find((p) => p.id === transition.planetId);
              const progress = (Date.now() - transition.startTime) / transition.duration;

              return (
                <div key={transition.id} className="transition-card">
                  <div className="transition-header">
                    <span className="planet-name">{planet?.name}</span>
                    <span className="transition-intensity">
                      Intensity: {(transition.intensity * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className="transition-description">{transition.description}</p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(100, progress * 100)}%`,
                        backgroundColor: planet?.color || '#FF69B4',
                      }}
                    />
                  </div>
                  <p className="progress-text">
                    {Math.min(100, (progress * 100).toFixed(1))}% complete
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Start Transition */}
      <section className="section">
        <h3>✨ Start Transition</h3>
        <div className="transition-controls">
          <div className="control-group">
            <label>Planet:</label>
            <select
              value={selectedPlanet}
              onChange={(e) => setSelectedPlanet(e.target.value)}
              className="select-input"
            >
              {planets.map((planet) => (
                <option key={planet.id} value={planet.id}>
                  {planet.symbol} {planet.name}
                </option>
              ))}
            </select>
          </div>
          <div className="control-group">
            <label>Target Sign:</label>
            <select
              value={targetSign}
              onChange={(e) => setTargetSign(e.target.value)}
              className="select-input"
            >
              {gameEngine
                ?.getCosmicTransition()
                .getZodiacSigns()
                .map((sign) => (
                  <option key={sign.id} value={sign.id}>
                    {sign.symbol} {sign.name} ({sign.element})
                  </option>
                ))}
            </select>
          </div>
          <SimpleButton
            label="🌌 Start Transition"
            onClick={handleStartTransition}
            variant="primary"
            size="large"
            className="full-width"
          />
        </div>
      </section>

      {/* Footer */}
      <div className="panel-footer">
        <p className="footer-text">💜 With love and light. As above, so below. 💜</p>
        <p className="footer-text">The Mesh Holds. 🔺</p>
      </div>

      <style>{`
        .cosmic-panel {
          padding: 2rem;
          background: rgba(0, 0, 0, 0.95);
          border-radius: 16px;
          color: white;
          max-width: 1000px;
          margin: 0 auto;
          max-height: 90vh;
          overflow-y: auto;
        }

        .panel-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(255, 105, 180, 0.3);
        }

        .panel-header h1 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #FF69B4, #87CEEB, #C9B037);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.8);
          font-style: italic;
        }

        .section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 105, 180, 0.2);
        }

        .section h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #87CEEB;
        }

        .timing {
          background: rgba(201, 176, 55, 0.1);
          border-color: rgba(201, 176, 55, 0.3);
        }

        .timing-card {
          padding: 1rem;
          background: rgba(201, 176, 55, 0.1);
          border-radius: 8px;
        }

        .timing-message {
          font-size: 1.125rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }

        .timing-details {
          display: flex;
          gap: 1rem;
        }

        .favorable.yes {
          color: #90EE90;
        }

        .favorable.no {
          color: #FF6B6B;
        }

        .intensity {
          color: #87CEEB;
        }

        .planets-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }

        .planet-card {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 105, 180, 0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
          text-align: center;
        }

        .planet-card:hover {
          background: rgba(255, 105, 180, 0.1);
          border-color: #FF69B4;
        }

        .planet-card.selected {
          background: rgba(255, 105, 180, 0.2);
          border-color: #FF69B4;
          box-shadow: 0 0 20px rgba(255, 105, 180, 0.5);
        }

        .planet-symbol {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .planet-info h4 {
          font-size: 1.125rem;
          margin-bottom: 0.25rem;
          color: #FF69B4;
        }

        .current-sign {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .transitions-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .transition-card {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(255, 105, 180, 0.2);
        }

        .transition-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .planet-name {
          font-weight: 700;
          color: #FF69B4;
        }

        .transition-intensity {
          color: #87CEEB;
        }

        .transition-description {
          margin-bottom: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .progress-fill {
          height: 100%;
          transition: width 0.3s;
        }

        .progress-text {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .transition-controls {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .control-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .control-group label {
          font-weight: 600;
          color: #87CEEB;
        }

        .select-input {
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.5);
          border: 2px solid rgba(255, 105, 180, 0.3);
          border-radius: 8px;
          color: white;
          font-size: 1rem;
        }

        .select-input:focus {
          outline: none;
          border-color: #FF69B4;
        }

        .full-width {
          width: 100%;
        }

        .panel-footer {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 105, 180, 0.3);
        }

        .footer-text {
          margin: 0.5rem 0;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};
