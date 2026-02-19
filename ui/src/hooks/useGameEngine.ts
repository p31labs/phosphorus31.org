/**
 * Game Engine Hook
 * React hook for integrating GameEngine with P31 Spectrum
 *
 * Manages game engine lifecycle and provides control functions
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import { useAccessibilityStore } from '../stores/accessibility.store';

// Lazy import to avoid issues if GameEngine isn't available
let GameEngineClass: any = null;
try {
  GameEngineClass = require('../../../SUPER-CENTAUR/src/engine/core/GameEngine').GameEngine;
} catch (error) {
  console.warn('[useGameEngine] GameEngine not available:', error);
}

interface GameState {
  isRunning: boolean;
  isPaused: boolean;
  currentStructure: any;
  playerProgress: any;
  currentChallenge: any;
  buildMode: any;
}

export interface UseGameEngineReturn {
  engine: any;
  isInitialized: boolean;
  isRunning: boolean;
  gameState: GameState | null;
  loveBalance: number;
  error: Error | null;
  start: () => void;
  stop: () => void;
  pause: () => void;
  resume: () => void;
  createNewStructure: (name: string) => void;
  testStructure: () => void;
  completeChallenge: () => void;
}

export const useGameEngine = (): UseGameEngineReturn => {
  const engineRef = useRef<any>(null);
  const stateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loveBalance, setLoveBalance] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const { animationReduced } = useAccessibilityStore();

  // Cleanup function
  const cleanup = useCallback(() => {
    if (stateIntervalRef.current) {
      clearInterval(stateIntervalRef.current);
      stateIntervalRef.current = null;
    }
    if (engineRef.current) {
      try {
        engineRef.current.dispose();
      } catch (err) {
        console.error('[useGameEngine] Error disposing engine:', err);
      }
      engineRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!GameEngineClass) {
      setError(new Error('GameEngine not available'));
      return;
    }

    const initEngine = async () => {
      try {
        setError(null);
        const engine = new GameEngineClass();
        await engine.init();
        engineRef.current = engine;
        setIsInitialized(true);

        // Update game state and LOVE balance periodically
        stateIntervalRef.current = setInterval(() => {
          if (engineRef.current) {
            try {
              setGameState(engineRef.current.getGameState());
              const wm = engineRef.current.getWalletManager?.();
              if (wm && typeof wm.getFamilyWallets === 'function') {
                const wallets = wm.getFamilyWallets();
                const total = wallets.reduce((s: number, w: { balance?: number }) => s + (w.balance ?? 0), 0);
                setLoveBalance(total);
              }
            } catch (err) {
              console.error('[useGameEngine] Error getting game state:', err);
            }
          }
        }, 1000);
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to initialize game engine');
        setError(error);
        console.error('[useGameEngine] Failed to initialize:', error);
      }
    };

    initEngine();

    return cleanup;
  }, [cleanup]);

  const start = useCallback(() => {
    if (engineRef.current && !isRunning) {
      try {
        engineRef.current.start();
        setIsRunning(true);
      } catch (err) {
        console.error('[useGameEngine] Error starting engine:', err);
        setError(err instanceof Error ? err : new Error('Failed to start engine'));
      }
    }
  }, [isRunning]);

  const stop = useCallback(() => {
    if (engineRef.current && isRunning) {
      try {
        engineRef.current.stop();
        setIsRunning(false);
      } catch (err) {
        console.error('[useGameEngine] Error stopping engine:', err);
      }
    }
  }, [isRunning]);

  const pause = useCallback(() => {
    if (engineRef.current) {
      try {
        engineRef.current.pause();
      } catch (err) {
        console.error('[useGameEngine] Error pausing engine:', err);
      }
    }
  }, []);

  const resume = useCallback(() => {
    if (engineRef.current) {
      try {
        engineRef.current.resume();
      } catch (err) {
        console.error('[useGameEngine] Error resuming engine:', err);
      }
    }
  }, []);

  const createNewStructure = useCallback((name: string) => {
    if (engineRef.current && name.trim()) {
      try {
        engineRef.current.createNewStructure(name.trim());
      } catch (err) {
        console.error('[useGameEngine] Error creating structure:', err);
      }
    }
  }, []);

  const testStructure = useCallback(() => {
    if (engineRef.current) {
      try {
        engineRef.current.testStructure();
      } catch (err) {
        console.error('[useGameEngine] Error testing structure:', err);
      }
    }
  }, []);

  const completeChallenge = useCallback(() => {
    if (engineRef.current) {
      try {
        engineRef.current.completeChallenge();
      } catch (err) {
        console.error('[useGameEngine] Error completing challenge:', err);
      }
    }
  }, []);

  // Respect reduced motion preference
  useEffect(() => {
    if (engineRef.current && animationReduced) {
      // Reduce physics update rate when motion is reduced
      // This would need to be implemented in GameEngine
      // For now, we can pause if motion is reduced
      if (isRunning) {
        pause();
      }
    }
  }, [animationReduced, isRunning, pause]);

  return {
    engine: engineRef.current,
    isInitialized,
    isRunning,
    gameState,
    loveBalance,
    error,
    start,
    stop,
    pause,
    resume,
    createNewStructure,
    testStructure,
    completeChallenge,
  };
};
