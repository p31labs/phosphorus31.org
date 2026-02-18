// ══════════════════════════════════════════════════════════════════════════════
// USE QUANTUM STATE HOOK
// Manages CoherenceEngine lifecycle, syncs voltage, triggers recoherence.
// Writes directly to Zustand store — no local state needed.
// ══════════════════════════════════════════════════════════════════════════════

import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store.js';
import { CoherenceEngine } from '../quantum/coherenceEngine.js';

/**
 * Hook to manage quantum coherence simulation
 * @returns {{ resetCoherence: () => void }}
 */
export function useQuantumState() {
  const engineRef = useRef(null);
  const prevBlockCountRef = useRef(0);
  
  // Subscribe to voltage and block count
  const voltage = useStore((s) => s.voltage);
  const blockCount = useStore((s) => s.blocks.size);
  
  // ── Initialize engine on mount ─────────────────────────────────────────────
  useEffect(() => {
    const { setQuantumState } = useStore.getState();
    
    // Create engine with callback that writes directly to store
    engineRef.current = new CoherenceEngine((coherence, qStatistic, molecules) => {
      setQuantumState(coherence, qStatistic, molecules);
    });
    
    engineRef.current.start();
    
    return () => {
      if (engineRef.current) {
        engineRef.current.stop();
        engineRef.current = null;
      }
    };
  }, []);

  // ── Sync voltage to engine ─────────────────────────────────────────────────
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setVoltage(voltage);
    }
  }, [voltage]);

  // ── Trigger recoherence on block addition ──────────────────────────────────
  useEffect(() => {
    if (!engineRef.current) return;
    
    if (blockCount > prevBlockCountRef.current) {
      // Block added — boost coherence
      engineRef.current.triggerRecoherence();
    } else if (blockCount === 0 && prevBlockCountRef.current > 0) {
      // World cleared — reset coherence
      engineRef.current.reset();
    }
    
    prevBlockCountRef.current = blockCount;
  }, [blockCount]);

  // ── Public API ─────────────────────────────────────────────────────────────
  const resetCoherence = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.reset();
    }
  }, []);

  return { resetCoherence };
}
