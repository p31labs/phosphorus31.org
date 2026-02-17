/**
 * Game Engine Provider
 * Provides game engine context to children
 */

import React, { createContext, useContext } from 'react';
import { useGameEngine } from '../../hooks/useGameEngine';
import type { UseGameEngineReturn } from '../../hooks/useGameEngine';

interface GameEngineContextType extends UseGameEngineReturn {}

export const GameEngineContext = createContext<GameEngineContextType | null>(null);

export const GameEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const gameEngine = useGameEngine();

  return <GameEngineContext.Provider value={gameEngine}>{children}</GameEngineContext.Provider>;
};

export const useGameEngineContext = () => {
  const context = useContext(GameEngineContext);
  if (!context) {
    throw new Error('useGameEngineContext must be used within GameEngineProvider');
  }
  return context;
};
