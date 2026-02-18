// ══════════════════════════════════════════════════════════════════════════════
// FISHER-ESCOLÀ ENGINE
// Quantum coherence simulation based on Matthew Fisher's phosphorus hypothesis
// and the Escolà formalization of coherence statistics.
//
// This simulates 8 Posner molecules (Ca9(PO4)6) with exponential T2 decay,
// voltage-driven decoherence, and recoherence events triggered by user action.
// ══════════════════════════════════════════════════════════════════════════════

import { QUANTUM } from '../constants.js';

const { NUM_POSNER_MOLECULES, BASE_T2, MIN_COHERENCE, RECOHERENCE_BOOST, VOLTAGE_DECOHERENCE } = QUANTUM;

/**
 * Individual Posner molecule state
 */
class PosnerMolecule {
  constructor(index) {
    this.index = index;
    this.coherence = 0.5 + Math.random() * 0.3; // Start with moderate coherence
    this.phase = Math.random() * Math.PI * 2;   // Random initial phase
  }

  /**
   * Apply exponential T2 decay modified by voltage
   * @param {number} dt - Delta time in seconds
   * @param {number} voltage - System voltage (0-100)
   * @param {number} baseT2 - Base decoherence time
   */
  decay(dt, voltage, baseT2) {
    // Higher voltage = faster decoherence
    const effectiveT2 = baseT2 / (1 + (voltage / 100) * VOLTAGE_DECOHERENCE);
    const decayFactor = Math.exp(-dt / effectiveT2);
    this.coherence *= decayFactor;
    
    // Floor coherence at minimum
    if (this.coherence < MIN_COHERENCE) {
      this.coherence = MIN_COHERENCE;
    }
    
    // Phase drifts with decoherence
    this.phase += (1 - this.coherence) * dt * 0.5;
  }

  /**
   * Boost coherence (triggered by user action)
   * @param {number} boost - Amount to boost
   */
  recohere(boost) {
    this.coherence = Math.min(1.0, this.coherence + boost);
  }

  /**
   * Reset to initial state
   */
  reset() {
    this.coherence = 0.5 + Math.random() * 0.3;
    this.phase = Math.random() * Math.PI * 2;
  }
}

/**
 * Fisher-Escolà Engine
 * Manages ensemble of Posner molecules and computes Q statistic
 */
export class FisherEscolaEngine {
  constructor() {
    this.molecules = Array.from(
      { length: NUM_POSNER_MOLECULES },
      (_, i) => new PosnerMolecule(i)
    );
    this.voltage = 50; // Default mid-range
    this.baseT2 = BASE_T2;
  }

  /**
   * Set external voltage parameter
   * @param {number} v - Voltage (0-100)
   */
  setVoltage(v) {
    this.voltage = Math.max(0, Math.min(100, v));
  }

  /**
   * Advance simulation by dt seconds
   * @param {number} dt - Delta time in seconds
   * @param {boolean} recoherenceEvent - Whether to trigger recoherence
   */
  step(dt, recoherenceEvent = false) {
    for (const mol of this.molecules) {
      mol.decay(dt, this.voltage, this.baseT2);
      
      if (recoherenceEvent) {
        mol.recohere(RECOHERENCE_BOOST);
      }
    }
  }

  /**
   * Compute ensemble coherence (mean)
   * @returns {number} Average coherence across all molecules
   */
  getCoherence() {
    const sum = this.molecules.reduce((acc, mol) => acc + mol.coherence, 0);
    return sum / this.molecules.length;
  }

  /**
   * Compute Fisher-Escolà Q statistic
   * Q = 4 * sum(coherence²) / N
   * 
   * When Q > 1.0, the system is in the "quantum regime"
   * This happens when average coherence exceeds ~0.5
   * 
   * @returns {number} Q statistic
   */
  getQStatistic() {
    const sumSquared = this.molecules.reduce(
      (acc, mol) => acc + mol.coherence * mol.coherence,
      0
    );
    return (4 * sumSquared) / this.molecules.length;
  }

  /**
   * Get per-molecule coherence values for visualization
   * @returns {number[]} Array of coherence values
   */
  getMoleculeCoherences() {
    return this.molecules.map(mol => mol.coherence);
  }

  /**
   * Reset all molecules to initial state
   */
  reset() {
    for (const mol of this.molecules) {
      mol.reset();
    }
  }

  /**
   * Get full state snapshot
   * @returns {object} Current engine state
   */
  getState() {
    return {
      coherence: this.getCoherence(),
      qStatistic: this.getQStatistic(),
      molecules: this.getMoleculeCoherences(),
      voltage: this.voltage
    };
  }
}
