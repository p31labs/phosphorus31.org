/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * QUANTUM COHERENCE STORE
 * Unified quantum state management for UI/UX quantum upgrade
 *
 * Manages: coherence levels, entanglement states, quantum field strength,
 * decoherence rates, and quantum-aware UI adaptations
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface QuantumState {
  coherence: number; // 0-1, overall system coherence
  phase: number; // 0-2π, quantum phase
  purity: number; // 0-1, state purity
  entanglement: number; // 0-1, entanglement strength
  decoherenceRate: number; // Rate of coherence loss per second
  lastUpdate: number;
}

export interface EntangledNode {
  id: string;
  label: string;
  coherence: number;
  phase: number;
  correlation: number; // Correlation with other nodes
  lastSync: number;
}

export interface QuantumField {
  strength: number; // 0-1, overall field strength
  frequency: number; // Hz, resonance frequency (0.1 Hz for HRV sync)
  amplitude: number; // Field amplitude
  nodes: Map<string, EntangledNode>;
}

export interface QuantumCoherenceStore {
  // Core quantum state
  quantumState: QuantumState;
  quantumField: QuantumField;

  // Entangled nodes (tetrahedron topology)
  entangledNodes: Map<string, EntangledNode>;

  // Coherence history for visualization
  coherenceHistory: Array<{ timestamp: number; coherence: number; phase: number }>;

  // UI adaptation state
  uiAdaptation: {
    glowIntensity: number; // 0-1, visual glow based on coherence
    animationSpeed: number; // Multiplier for animations
    colorShift: number; // 0-1, color temperature shift
    particleDensity: number; // 0-1, particle system density
  };

  // Actions
  updateCoherence: (coherence: number, reason?: string) => void;
  updatePhase: (phase: number) => void;
  updatePurity: (purity: number) => void;
  addEntangledNode: (node: EntangledNode) => void;
  removeEntangledNode: (nodeId: string) => void;
  syncNodeCoherence: (nodeId: string, coherence: number, phase: number) => void;
  calculateFieldStrength: () => number;
  updateUIAdaptation: (adaptation: Partial<QuantumCoherenceStore['uiAdaptation']>) => void;
  resetQuantumState: () => void;
  /** When true, coherence is driven by demo timeline (MATA); hook skips spoons sync */
  demoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════════

const initialQuantumState: QuantumState = {
  coherence: 0.85, // Start with high coherence
  phase: 0,
  purity: 0.9,
  entanglement: 0.7,
  decoherenceRate: 0.0001, // Very slow decoherence
  lastUpdate: Date.now(),
};

const initialQuantumField: QuantumField = {
  strength: 0.7,
  frequency: 0.1, // 0.1 Hz for HRV coherence
  amplitude: 1.0,
  nodes: new Map(),
};

const initialUIAdaptation = {
  glowIntensity: 0.5,
  animationSpeed: 1.0,
  colorShift: 0.0,
  particleDensity: 0.5,
};

// ═══════════════════════════════════════════════════════════════════════════════
// STORE
// ═══════════════════════════════════════════════════════════════════════════════

export const useQuantumStore = create<QuantumCoherenceStore>()(
  devtools(
    persist(
      (set, get) => ({
        quantumState: initialQuantumState,
        quantumField: initialQuantumField,
        entangledNodes: new Map(),
        coherenceHistory: [],
        uiAdaptation: initialUIAdaptation,
        demoMode: false,
        setDemoMode: (enabled: boolean) => set({ demoMode: enabled }),

        /**
         * Update quantum coherence
         */
        updateCoherence: (coherence: number, reason?: string) => {
          const clampedCoherence = Math.max(0, Math.min(1, coherence));
          const now = Date.now();
          const state = get();

          // Update quantum state
          const newState: QuantumState = {
            ...state.quantumState,
            coherence: clampedCoherence,
            lastUpdate: now,
          };

          // Add to history (keep last 1000 entries)
          const newHistory = [
            ...state.coherenceHistory.slice(-999),
            { timestamp: now, coherence: clampedCoherence, phase: state.quantumState.phase },
          ];

          // Calculate UI adaptations based on coherence
          const uiAdaptation = {
            glowIntensity: 0.3 + clampedCoherence * 0.7,
            animationSpeed: 0.5 + clampedCoherence * 1.5,
            colorShift: (1 - clampedCoherence) * 0.3, // More blue at low coherence
            particleDensity: clampedCoherence * 0.8,
          };

          set({
            quantumState: newState,
            coherenceHistory: newHistory,
            uiAdaptation,
          });

          if (reason) {
            console.log(`🔮 Coherence updated to ${clampedCoherence.toFixed(3)}: ${reason}`);
          }
        },

        /**
         * Update quantum phase
         */
        updatePhase: (phase: number) => {
          const normalizedPhase = ((phase % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
          set((state) => ({
            quantumState: {
              ...state.quantumState,
              phase: normalizedPhase,
              lastUpdate: Date.now(),
            },
          }));
        },

        /**
         * Update state purity
         */
        updatePurity: (purity: number) => {
          const clampedPurity = Math.max(0, Math.min(1, purity));
          set((state) => ({
            quantumState: {
              ...state.quantumState,
              purity: clampedPurity,
              lastUpdate: Date.now(),
            },
          }));
        },

        /**
         * Add an entangled node
         */
        addEntangledNode: (node: EntangledNode) => {
          set((state) => {
            const newNodes = new Map(state.entangledNodes);
            newNodes.set(node.id, node);
            return { entangledNodes: newNodes };
          });
        },

        /**
         * Remove an entangled node
         */
        removeEntangledNode: (nodeId: string) => {
          set((state) => {
            const newNodes = new Map(state.entangledNodes);
            newNodes.delete(nodeId);
            return { entangledNodes: newNodes };
          });
        },

        /**
         * Sync node coherence (for entanglement)
         */
        syncNodeCoherence: (nodeId: string, coherence: number, phase: number) => {
          set((state) => {
            const node = state.entangledNodes.get(nodeId);
            if (node) {
              const newNodes = new Map(state.entangledNodes);
              newNodes.set(nodeId, {
                ...node,
                coherence,
                phase,
                lastSync: Date.now(),
              });
              return { entangledNodes: newNodes };
            }
            return state;
          });
        },

        /**
         * Calculate quantum field strength from all nodes
         */
        calculateFieldStrength: () => {
          const state = get();
          if (state.entangledNodes.size === 0) {
            return state.quantumField.strength;
          }

          // Average coherence of all nodes, weighted by correlation
          let totalCoherence = 0;
          let totalWeight = 0;

          state.entangledNodes.forEach((node) => {
            const weight = node.correlation;
            totalCoherence += node.coherence * weight;
            totalWeight += weight;
          });

          const fieldStrength = totalWeight > 0 ? totalCoherence / totalWeight : 0.5;

          set((state) => ({
            quantumField: {
              ...state.quantumField,
              strength: fieldStrength,
            },
          }));

          return fieldStrength;
        },

        /**
         * Update UI adaptation parameters
         */
        updateUIAdaptation: (adaptation: Partial<QuantumCoherenceStore['uiAdaptation']>) => {
          set((state) => ({
            uiAdaptation: {
              ...state.uiAdaptation,
              ...adaptation,
            },
          }));
        },

        /**
         * Reset quantum state to initial values
         */
        resetQuantumState: () => {
          set({
            quantumState: initialQuantumState,
            quantumField: initialQuantumField,
            entangledNodes: new Map(),
            coherenceHistory: [],
            uiAdaptation: initialUIAdaptation,
          });
        },
      }),
      {
        name: 'quantum-store',
        partialize: (state) => ({
          quantumState: {
            coherence: state.quantumState.coherence,
            phase: state.quantumState.phase,
            purity: state.quantumState.purity,
            entanglement: state.quantumState.entanglement,
          },
          uiAdaptation: state.uiAdaptation,
        }),
      }
    ),
    { name: 'QuantumCoherenceStore' }
  )
);

// ═══════════════════════════════════════════════════════════════════════════════
// SELECTOR HOOKS
// ═══════════════════════════════════════════════════════════════════════════════

/** Get current coherence level */
export const useCoherence = () => useQuantumStore((state) => state.quantumState.coherence);

/** Get quantum phase */
export const useQuantumPhase = () => useQuantumStore((state) => state.quantumState.phase);

/** Get quantum purity */
export const useQuantumPurity = () => useQuantumStore((state) => state.quantumState.purity);

/** Get field strength */
export const useFieldStrength = () => useQuantumStore((state) => state.quantumField.strength);

/** Get UI adaptation parameters */
export const useUIAdaptation = () => useQuantumStore((state) => state.uiAdaptation);

/** Get all entangled nodes */
export const useEntangledNodes = () => useQuantumStore((state) => state.entangledNodes);

/** Get coherence history */
export const useCoherenceHistory = () => useQuantumStore((state) => state.coherenceHistory);
