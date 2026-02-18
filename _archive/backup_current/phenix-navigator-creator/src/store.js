// ══════════════════════════════════════════════════════════════════════════════
// ZUSTAND STORE
// Central state for the Phenix Navigator Creator.
// Voxel data in Map for O(1) lookup. VPI phase machine auto-advances.
// ══════════════════════════════════════════════════════════════════════════════

import { create } from 'zustand';
import { VPI_PHASES, VPI_PHASE_ORDER } from './constants.js';

// ── Initial State ────────────────────────────────────────────────────────────
const INITIAL_STATE = {
  // Voxel world
  blocks: new Map(),
  
  // System voltage (0-100)
  voltage: 50,
  
  // Mode: BUILD | VIEW | SLICE | PRINT
  mode: 'BUILD',
  
  // VPI phase: VACUUM | FLOOD | PRESSURIZE | CURE
  vpiPhase: 'VACUUM',
  
  // Quantum state (written by CoherenceEngine)
  coherence: 0.5,
  qStatistic: 1.0,
  molecules: [],
  
  // Fabrication pipeline status
  fabrication: {
    status: 'idle',      // idle | slicing | preparing | exporting | complete | error
    progress: 0,
    error: null
  },
  
  // Hardware connection
  hardware: {
    connected: false,
    lastInput: null
  }
};

/**
 * Create fresh state (for reset)
 * Must deep-clone nested objects
 */
const freshState = () => ({
  ...INITIAL_STATE,
  blocks: new Map(),
  fabrication: { ...INITIAL_STATE.fabrication },
  hardware: { ...INITIAL_STATE.hardware }
});

// ── Store Definition ─────────────────────────────────────────────────────────
export const useStore = create((set, get) => ({
  ...INITIAL_STATE,

  // ── Block Management ─────────────────────────────────────────────────────
  
  /**
   * Add a block at position key "x,y,z"
   * Decreases voltage, advances VPI phase if threshold met
   */
  addBlock: (pos) => set((state) => {
    if (state.blocks.has(pos)) return {};
    
    const newBlocks = new Map(state.blocks);
    newBlocks.set(pos, { type: 'standard', placedAt: Date.now() });
    
    // Block placement reduces voltage (creative act = calming)
    const newVoltage = Math.max(0, state.voltage - 3);
    
    // Check VPI phase advancement
    const count = newBlocks.size;
    const currentIdx = VPI_PHASE_ORDER.indexOf(state.vpiPhase);
    let advanceIdx = currentIdx;
    
    // Loop through phases to find appropriate level
    while (advanceIdx < VPI_PHASE_ORDER.length - 1) {
      const nextPhase = VPI_PHASE_ORDER[advanceIdx + 1];
      const nextThreshold = VPI_PHASES[nextPhase].threshold;
      if (count >= nextThreshold) {
        advanceIdx++;
      } else {
        break;
      }
    }
    
    const newPhase = VPI_PHASE_ORDER[advanceIdx];
    
    return { 
      blocks: newBlocks, 
      voltage: newVoltage, 
      vpiPhase: newPhase 
    };
  }),

  /**
   * Remove a block at position key
   * Increases voltage (destruction = tension)
   */
  removeBlock: (pos) => set((state) => {
    if (!state.blocks.has(pos)) return {};
    
    const newBlocks = new Map(state.blocks);
    newBlocks.delete(pos);
    
    const newVoltage = Math.min(100, state.voltage + 2);
    
    return { blocks: newBlocks, voltage: newVoltage };
  }),

  /**
   * Clear all blocks, reset VPI phase
   */
  clearBlocks: () => set({
    blocks: new Map(),
    voltage: 70,
    vpiPhase: 'VACUUM'
  }),

  // ── Voltage ──────────────────────────────────────────────────────────────
  
  setVoltage: (v) => set({ 
    voltage: Math.max(0, Math.min(100, Math.round(v))) 
  }),
  
  /**
   * Passive voltage drift (increases over time without action)
   */
  driftVoltage: () => set((state) => ({
    voltage: Math.min(100, state.voltage + 0.15)
  })),

  // ── Mode ─────────────────────────────────────────────────────────────────
  
  setMode: (m) => set({ mode: m }),

  // ── VPI Phase ────────────────────────────────────────────────────────────
  
  setVpiPhase: (p) => set({ vpiPhase: p }),

  // ── Quantum State (written by CoherenceEngine) ───────────────────────────
  
  setQuantumState: (coherence, qStatistic, molecules) => set({
    coherence,
    qStatistic,
    molecules: molecules || []
  }),

  // ── Fabrication ──────────────────────────────────────────────────────────
  
  setFabrication: (updates) => set((state) => ({
    fabrication: { ...state.fabrication, ...updates }
  })),

  // ── Hardware ─────────────────────────────────────────────────────────────
  
  setHardwareConnected: (connected) => set((state) => ({
    hardware: { ...state.hardware, connected }
  })),
  
  setHardwareInput: (input) => set((state) => ({
    hardware: {
      ...state.hardware,
      lastInput: { ...input, timestamp: Date.now() }
    }
  })),

  // ── Reset ────────────────────────────────────────────────────────────────
  
  reset: () => set(freshState())
}));
