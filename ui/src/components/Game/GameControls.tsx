/**
 * Game Controls Component
 * UI controls for game engine
 */

import React from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import { SimpleButton } from '../Accessibility/SimpleButton';

export const GameControls: React.FC = () => {
  const {
    isInitialized,
    isRunning,
    gameState,
    error,
    start,
    stop,
    pause,
    resume,
    createNewStructure,
    testStructure,
    completeChallenge,
  } = useGameEngine();

  if (!isInitialized) {
    return (
      <div className="game-controls">
        <div className="loading">Initializing game engine...</div>
        {error && <div className="error-message">Error: {error.message}</div>}
      </div>
    );
  }

  const isPaused = gameState?.isPaused || false;

  return (
    <div className="game-controls">
      <h3>Game Controls</h3>

      <div className="control-buttons">
        {!isRunning ? (
          <SimpleButton label="▶️ Start Game" onClick={start} variant="primary" size="medium" />
        ) : (
          <>
            {isPaused ? (
              <SimpleButton label="▶️ Resume" onClick={resume} variant="success" size="medium" />
            ) : (
              <SimpleButton label="⏸️ Pause" onClick={pause} variant="secondary" size="medium" />
            )}
            <SimpleButton label="🛑 Stop" onClick={stop} variant="danger" size="medium" />
          </>
        )}
      </div>

      {gameState && (
        <div className="game-info">
          <div className="info-item">
            <span>Status:</span>
            <strong>{isPaused ? 'Paused' : isRunning ? 'Running' : 'Stopped'}</strong>
          </div>
          {gameState.currentStructure && (
            <div className="info-item">
              <span>Structure:</span>
              <strong>{gameState.currentStructure.name}</strong>
            </div>
          )}
          {gameState.playerProgress && (
            <div className="info-item">
              <span>Tier:</span>
              <strong>{gameState.playerProgress.tier}</strong>
            </div>
          )}
        </div>
      )}

      <div className="action-buttons">
        <SimpleButton
          label="🏗️ New Structure"
          onClick={() => createNewStructure('New Structure')}
          variant="primary"
          size="small"
        />
        <SimpleButton
          label="🧪 Test Structure"
          onClick={testStructure}
          variant="warning"
          size="small"
        />
        {gameState?.currentChallenge && (
          <SimpleButton
            label="✅ Complete Challenge"
            onClick={completeChallenge}
            variant="success"
            size="small"
          />
        )}
      </div>

      <style>{`
        .game-controls {
          padding: 1rem;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 8px;
          color: white;
        }

        .control-buttons {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .game-info {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.25rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
};
