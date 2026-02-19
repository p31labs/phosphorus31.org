/**
 * Quantum Lab
 * Quantum mechanics playground for The Science Center
 * 
 * Provides quantum simulation, coherence visualization, and entanglement experiments
 * 
 * @license
 * Copyright 2026 P31 Labs
 * Licensed under the AGPLv3 License
 */

import { Logger } from '../utils/logger';

export interface QuantumState {
  amplitude: number;
  phase: number;
  coherence: number;
  entanglement: number;
}

export interface QuantumExperiment {
  id: string;
  type: 'coherence' | 'entanglement' | 'decoherence' | 'superposition';
  state: QuantumState;
  timestamp: Date;
  parameters: Record<string, any>;
}

export class QuantumLab {
  private logger: Logger;
  private experiments: Map<string, QuantumExperiment> = new Map();
  private coherenceDecayRate: number = 0.001; // Default decay rate

  constructor() {
    this.logger = new Logger('QuantumLab');
    this.logger.info('Quantum Lab initialized');
  }

  /**
   * Simulate quantum coherence decay
   */
  simulateCoherenceDecay(initialCoherence: number, time: number): number {
    // Exponential decay: C(t) = C(0) * e^(-t/T)
    const T = 1 / this.coherenceDecayRate;
    return initialCoherence * Math.exp(-time / T);
  }

  /**
   * Calculate entanglement between two quantum states
   */
  calculateEntanglement(state1: QuantumState, state2: QuantumState): number {
    // Simplified entanglement measure based on phase correlation
    const phaseDiff = Math.abs(state1.phase - state2.phase);
    const correlation = Math.cos(phaseDiff);
    return Math.abs(correlation) * Math.min(state1.coherence, state2.coherence);
  }

  /**
   * Simulate quantum superposition
   */
  createSuperposition(amplitude1: number, amplitude2: number): QuantumState {
    // Normalize amplitudes
    const norm = Math.sqrt(amplitude1 ** 2 + amplitude2 ** 2);
    return {
      amplitude: norm,
      phase: Math.atan2(amplitude2, amplitude1),
      coherence: 1.0,
      entanglement: 0,
    };
  }

  /**
   * Simulate decoherence (measurement collapse)
   */
  simulateDecoherence(state: QuantumState, measurementStrength: number): QuantumState {
    // Decoherence reduces coherence based on measurement strength
    const newCoherence = state.coherence * (1 - measurementStrength);
    return {
      ...state,
      coherence: Math.max(0, newCoherence),
    };
  }

  /**
   * Run a quantum experiment
   */
  runExperiment(type: QuantumExperiment['type'], parameters: Record<string, any>): QuantumExperiment {
    const id = `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    let state: QuantumState;
    
    switch (type) {
      case 'coherence':
        state = {
          amplitude: parameters.amplitude || 1.0,
          phase: parameters.phase || 0,
          coherence: parameters.initialCoherence || 1.0,
          entanglement: 0,
        };
        // Simulate decay over time
        if (parameters.time) {
          state.coherence = this.simulateCoherenceDecay(state.coherence, parameters.time);
        }
        break;
        
      case 'entanglement':
        const state1: QuantumState = {
          amplitude: parameters.amplitude1 || 1.0,
          phase: parameters.phase1 || 0,
          coherence: parameters.coherence1 || 1.0,
          entanglement: 0,
        };
        const state2: QuantumState = {
          amplitude: parameters.amplitude2 || 1.0,
          phase: parameters.phase2 || 0,
          coherence: parameters.coherence2 || 1.0,
          entanglement: 0,
        };
        const entanglement = this.calculateEntanglement(state1, state2);
        state = {
          amplitude: (state1.amplitude + state2.amplitude) / 2,
          phase: (state1.phase + state2.phase) / 2,
          coherence: (state1.coherence + state2.coherence) / 2,
          entanglement,
        };
        break;
        
      case 'superposition':
        state = this.createSuperposition(
          parameters.amplitude1 || 1.0,
          parameters.amplitude2 || 1.0
        );
        break;
        
      case 'decoherence':
        const initialState: QuantumState = {
          amplitude: parameters.amplitude || 1.0,
          phase: parameters.phase || 0,
          coherence: parameters.initialCoherence || 1.0,
          entanglement: 0,
        };
        state = this.simulateDecoherence(initialState, parameters.measurementStrength || 0.5);
        break;
        
      default:
        state = {
          amplitude: 1.0,
          phase: 0,
          coherence: 1.0,
          entanglement: 0,
        };
    }
    
    const experiment: QuantumExperiment = {
      id,
      type,
      state,
      timestamp: new Date(),
      parameters,
    };
    
    this.experiments.set(id, experiment);
    this.logger.debug(`Experiment ${id} completed: ${type}`, { state });
    
    return experiment;
  }

  /**
   * Get experiment by ID
   */
  getExperiment(id: string): QuantumExperiment | undefined {
    return this.experiments.get(id);
  }

  /**
   * List all experiments
   */
  listExperiments(): QuantumExperiment[] {
    return Array.from(this.experiments.values());
  }

  /**
   * Clear experiments
   */
  clearExperiments(): void {
    this.experiments.clear();
    this.logger.info('All experiments cleared');
  }

  /**
   * Set coherence decay rate
   */
  setCoherenceDecayRate(rate: number): void {
    this.coherenceDecayRate = Math.max(0, Math.min(1, rate));
    this.logger.info(`Coherence decay rate set to ${this.coherenceDecayRate}`);
  }

  /**
   * Get current coherence decay rate
   */
  getCoherenceDecayRate(): number {
    return this.coherenceDecayRate;
  }
}
