/**
 * QuantumGameBridge — Unified quantum + game experience
 *
 * - Syncs game progress (structure created, challenge completed) to quantum coherence
 * - Renders a compact strip: Coherence % + LOVE balance when game is initialized
 * - Single source of truth for "unified quantum" HUD
 */

import React, { useEffect, useRef } from 'react';
import { useGameEngineContext } from './GameEngineProvider';
import { useQuantumStore } from '../../stores/quantum.store';
import { useCoherence } from '../../stores/quantum.store';

const COHERENCE_NUDGE_ON_GAME_ACTION = 0.03;
const MAX_COHERENCE = 0.98;

export const QuantumGameBridge: React.FC = () => {
  const ctx = useGameEngineContext();
  const gameState = ctx.gameState;
  const loveBalance = ctx.loveBalance ?? 0;
  const isInitialized = ctx.isInitialized;
  const isRunning = ctx.isRunning;
  const coherence = useCoherence();
  const updateCoherence = useQuantumStore((s) => s.updateCoherence);
  const lastStructureId = useRef<string | null>(null);
  const lastChallengeId = useRef<string | null>(null);

  // Nudge quantum coherence when game progress happens (structure or challenge)
  useEffect(() => {
    if (!isInitialized || !gameState) return;

    const structure = gameState.currentStructure;
    const challenge = gameState.currentChallenge;

    const currentCoherence = useQuantumStore.getState().quantumState.coherence;
    if (structure && structure.id !== lastStructureId.current) {
      lastStructureId.current = structure.id ?? null;
      updateCoherence(
        Math.min(MAX_COHERENCE, currentCoherence + COHERENCE_NUDGE_ON_GAME_ACTION),
        'game-structure'
      );
    }
    if (challenge && challenge.id !== lastChallengeId.current) {
      lastChallengeId.current = challenge.id ?? null;
      updateCoherence(
        Math.min(MAX_COHERENCE, currentCoherence + COHERENCE_NUDGE_ON_GAME_ACTION),
        'game-challenge'
      );
    }
  }, [gameState, isInitialized, updateCoherence]);

  if (!isInitialized) return null;

  return (
    <div
      className="flex items-center gap-4 px-3 py-1.5 rounded-lg border border-cyan-500/50 bg-black/60 backdrop-blur-sm"
      style={{ borderColor: 'rgba(0, 255, 255, 0.4)' }}
      role="status"
      aria-label="Unified Quantum: Coherence and LOVE balance"
    >
      <span className="text-xs uppercase tracking-widest text-cyan-300/80">
        Coherence
      </span>
      <span className="font-mono font-bold text-cyan-400">
        {(coherence * 100).toFixed(0)}%
      </span>
      <span className="w-px h-4 bg-cyan-500/40" aria-hidden />
      <span className="text-xs uppercase tracking-widest text-amber-300/80">
        LOVE
      </span>
      <span className="font-mono font-bold text-amber-400">
        {Number(loveBalance).toFixed(1)}
      </span>
      {isRunning && (
        <span className="text-[10px] text-green-400/90 uppercase">Live</span>
      )}
    </div>
  );
};

export default QuantumGameBridge;
