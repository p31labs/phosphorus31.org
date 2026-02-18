/**
 * OMEGA PROTOCOL - MODULE E: QUANTUM-BIOLOGICAL DECISION KERNEL (QBDK)
 * =====================================================================
 * Non-classical decision making inspired by quantum cognition
 * 
 * Implements:
 * - Qubit state representation on Bloch sphere
 * - Interference-based cognitive dissonance modeling
 * - Fisher-Escolà Q Distribution for fat-tailed randomness
 * - Entangled squad coordination
 * 
 * "Artificial Intuition" - navigate fog of war via superposition, not brute force
 */

import { EventEmitter } from 'eventemitter3';

// ─────────────────────────────────────────────────────────────────────────────
// QUANTUM TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface Complex {
  real: number;
  imag: number;
}

export interface QubitState {
  alpha: Complex;  // Amplitude for |0⟩
  beta: Complex;   // Amplitude for |1⟩
}

export interface BlochCoordinates {
  theta: number;   // Polar angle (0 to π)
  phi: number;     // Azimuthal angle (0 to 2π)
}

export interface QuantumBelief {
  id: string;
  description: string;
  state: QubitState;
  confidence: number;       // Classical confidence overlay
  lastMeasured?: number;    // Timestamp of last "collapse"
}

export interface DecisionOption {
  id: string;
  description: string;
  utility: number;          // Expected utility
  quantumWeight: Complex;   // Quantum amplitude
}

export interface DecisionOutcome {
  selectedOption: string;
  probability: number;
  interferenceEffect: number;  // -1 to 1 (cancellation to amplification)
  collapsed: boolean;
}

export interface EntangledPair {
  belief1Id: string;
  belief2Id: string;
  correlation: number;  // -1 (anti-correlated) to 1 (correlated)
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPLEX NUMBER OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────

export class ComplexMath {
  static create(real: number, imag: number = 0): Complex {
    return { real, imag };
  }

  static fromPolar(r: number, theta: number): Complex {
    return {
      real: r * Math.cos(theta),
      imag: r * Math.sin(theta)
    };
  }

  static add(a: Complex, b: Complex): Complex {
    return {
      real: a.real + b.real,
      imag: a.imag + b.imag
    };
  }

  static multiply(a: Complex, b: Complex): Complex {
    return {
      real: a.real * b.real - a.imag * b.imag,
      imag: a.real * b.imag + a.imag * b.real
    };
  }

  static scale(c: Complex, scalar: number): Complex {
    return {
      real: c.real * scalar,
      imag: c.imag * scalar
    };
  }

  static conjugate(c: Complex): Complex {
    return { real: c.real, imag: -c.imag };
  }

  static magnitude(c: Complex): number {
    return Math.sqrt(c.real * c.real + c.imag * c.imag);
  }

  static magnitudeSquared(c: Complex): number {
    return c.real * c.real + c.imag * c.imag;
  }

  static normalize(c: Complex): Complex {
    const mag = this.magnitude(c);
    return mag === 0 ? c : this.scale(c, 1 / mag);
  }

  static phase(c: Complex): number {
    return Math.atan2(c.imag, c.real);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// QUBIT OPERATIONS
// ─────────────────────────────────────────────────────────────────────────────

export class QubitOps {
  /**
   * Create qubit in |0⟩ state
   */
  static zero(): QubitState {
    return {
      alpha: ComplexMath.create(1, 0),
      beta: ComplexMath.create(0, 0)
    };
  }

  /**
   * Create qubit in |1⟩ state
   */
  static one(): QubitState {
    return {
      alpha: ComplexMath.create(0, 0),
      beta: ComplexMath.create(1, 0)
    };
  }

  /**
   * Create qubit in superposition |+⟩ = (|0⟩ + |1⟩)/√2
   */
  static plus(): QubitState {
    const sqrt2inv = 1 / Math.sqrt(2);
    return {
      alpha: ComplexMath.create(sqrt2inv, 0),
      beta: ComplexMath.create(sqrt2inv, 0)
    };
  }

  /**
   * Create qubit from Bloch sphere coordinates
   */
  static fromBloch(theta: number, phi: number): QubitState {
    return {
      alpha: ComplexMath.create(Math.cos(theta / 2), 0),
      beta: ComplexMath.fromPolar(Math.sin(theta / 2), phi)
    };
  }

  /**
   * Convert qubit to Bloch coordinates
   */
  static toBloch(state: QubitState): BlochCoordinates {
    const prob0 = ComplexMath.magnitudeSquared(state.alpha);
    const theta = 2 * Math.acos(Math.sqrt(Math.max(0, Math.min(1, prob0))));
    const phi = ComplexMath.phase(state.beta) - ComplexMath.phase(state.alpha);
    
    return { theta, phi: phi < 0 ? phi + 2 * Math.PI : phi };
  }

  /**
   * Get probability of measuring |0⟩
   */
  static probability0(state: QubitState): number {
    return ComplexMath.magnitudeSquared(state.alpha);
  }

  /**
   * Get probability of measuring |1⟩
   */
  static probability1(state: QubitState): number {
    return ComplexMath.magnitudeSquared(state.beta);
  }

  /**
   * Apply Hadamard gate (creates superposition)
   */
  static hadamard(state: QubitState): QubitState {
    const sqrt2inv = 1 / Math.sqrt(2);
    return {
      alpha: ComplexMath.scale(
        ComplexMath.add(state.alpha, state.beta),
        sqrt2inv
      ),
      beta: ComplexMath.scale(
        ComplexMath.add(state.alpha, ComplexMath.scale(state.beta, -1)),
        sqrt2inv
      )
    };
  }

  /**
   * Apply phase rotation
   */
  static phaseRotate(state: QubitState, angle: number): QubitState {
    return {
      alpha: state.alpha,
      beta: ComplexMath.multiply(state.beta, ComplexMath.fromPolar(1, angle))
    };
  }

  /**
   * Measure the qubit (collapse)
   */
  static measure(state: QubitState): { outcome: 0 | 1; newState: QubitState } {
    const prob0 = this.probability0(state);
    const outcome = Math.random() < prob0 ? 0 : 1;
    
    // Collapse to measured state
    const newState = outcome === 0 ? this.zero() : this.one();
    
    return { outcome, newState };
  }

  /**
   * Normalize qubit state
   */
  static normalize(state: QubitState): QubitState {
    const norm = Math.sqrt(
      ComplexMath.magnitudeSquared(state.alpha) + 
      ComplexMath.magnitudeSquared(state.beta)
    );
    
    if (norm === 0) return this.zero();
    
    return {
      alpha: ComplexMath.scale(state.alpha, 1 / norm),
      beta: ComplexMath.scale(state.beta, 1 / norm)
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FISHER-ESCOLÀ Q DISTRIBUTION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fisher-Escolà Q Distribution
 * Creates "fat tails" and "black swan" readiness
 * Models quantum coherence in neural systems
 */
export class FisherEscolaDistribution {
  private q: number;  // Non-extensivity parameter

  constructor(q: number = 1.5) {
    // q = 1 recovers Gaussian
    // q > 1 creates fat tails
    // q < 1 creates compact support
    this.q = q;
  }

  /**
   * Sample from the Q-Gaussian distribution
   */
  sample(): number {
    if (this.q === 1) {
      // Standard Gaussian
      return this.boxMuller();
    }

    // Q-Gaussian sampling via transformation
    const u = Math.random();
    const sign = Math.random() < 0.5 ? -1 : 1;
    
    if (this.q < 1) {
      // Compact support
      const maxVal = 1 / Math.sqrt(1 - this.q);
      return sign * maxVal * Math.pow(u, 1 / (3 - this.q));
    } else {
      // Fat tails (Tsallis distribution)
      const beta = 1 / (this.q - 1);
      return sign * Math.pow(Math.pow(u, -1/beta) - 1, 0.5);
    }
  }

  private boxMuller(): number {
    const u1 = Math.random();
    const u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  }

  /**
   * Sample with bounds (for decision thresholds)
   */
  sampleBounded(min: number, max: number): number {
    const raw = this.sample();
    // Map to bounded range via sigmoid-like transform
    const sigmoid = 1 / (1 + Math.exp(-raw));
    return min + sigmoid * (max - min);
  }

  /**
   * Get probability density at point x
   */
  pdf(x: number): number {
    if (this.q === 1) {
      return Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
    }

    const expQ = (val: number, q: number) => {
      if (q === 1) return Math.exp(val);
      const base = 1 + (1 - q) * val;
      if (base <= 0) return 0;
      return Math.pow(base, 1 / (1 - q));
    };

    const normalization = this.getNormalization();
    return normalization * expQ(-x * x / 2, this.q);
  }

  private getNormalization(): number {
    // Approximation of normalization constant
    if (this.q < 1) {
      return Math.sqrt((1 - this.q) / Math.PI) * 
             this.gamma((1 / (1 - this.q)) + 0.5) / 
             this.gamma(1 / (1 - this.q));
    } else if (this.q < 3) {
      return Math.sqrt((this.q - 1) / Math.PI) *
             this.gamma(1 / (this.q - 1)) /
             this.gamma((1 / (this.q - 1)) - 0.5);
    }
    return 1;
  }

  private gamma(z: number): number {
    // Lanczos approximation
    if (z < 0.5) {
      return Math.PI / (Math.sin(Math.PI * z) * this.gamma(1 - z));
    }
    z -= 1;
    const g = 7;
    const c = [
      0.99999999999980993, 676.5203681218851, -1259.1392167224028,
      771.32342877765313, -176.61502916214059, 12.507343278686905,
      -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    let x = c[0];
    for (let i = 1; i < g + 2; i++) {
      x += c[i] / (z + i);
    }
    const t = z + g + 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// QUANTUM DECISION KERNEL
// ─────────────────────────────────────────────────────────────────────────────

export class QuantumDecisionKernel extends EventEmitter {
  private beliefs: Map<string, QuantumBelief> = new Map();
  private entanglements: Map<string, EntangledPair> = new Map();
  private fisherEscola: FisherEscolaDistribution;
  private decisionHistory: DecisionOutcome[] = [];

  constructor(qParameter: number = 1.5) {
    super();
    this.fisherEscola = new FisherEscolaDistribution(qParameter);
  }

  /**
   * Add a belief in superposition
   * Contradictory beliefs can coexist until measurement
   */
  addBelief(id: string, description: string, confidence: number = 0.5): QuantumBelief {
    // Initialize in superposition based on confidence
    // confidence = 0.5 → equal superposition
    // confidence > 0.5 → biased toward |1⟩ (belief true)
    // confidence < 0.5 → biased toward |0⟩ (belief false)
    
    const theta = 2 * Math.acos(Math.sqrt(1 - confidence));
    const state = QubitOps.fromBloch(theta, 0);

    const belief: QuantumBelief = {
      id,
      description,
      state,
      confidence
    };

    this.beliefs.set(id, belief);
    this.emit('belief:added', belief);
    return belief;
  }

  /**
   * Update belief with new evidence (rotation on Bloch sphere)
   */
  updateBelief(beliefId: string, evidenceStrength: number, supportsBelief: boolean): void {
    const belief = this.beliefs.get(beliefId);
    if (!belief) return;

    // Rotate on Bloch sphere
    // Positive evidence rotates toward |1⟩, negative toward |0⟩
    const rotationAngle = evidenceStrength * (supportsBelief ? 1 : -1) * Math.PI / 4;
    
    // Apply rotation around Y axis
    const bloch = QubitOps.toBloch(belief.state);
    bloch.theta = Math.max(0, Math.min(Math.PI, bloch.theta + rotationAngle));
    
    belief.state = QubitOps.fromBloch(bloch.theta, bloch.phi);
    belief.confidence = 1 - QubitOps.probability0(belief.state);

    this.emit('belief:updated', belief);
  }

  /**
   * Create quantum entanglement between beliefs
   * When one is measured, the other collapses accordingly
   */
  entangle(belief1Id: string, belief2Id: string, correlation: number): void {
    if (!this.beliefs.has(belief1Id) || !this.beliefs.has(belief2Id)) {
      throw new Error('Both beliefs must exist to entangle');
    }

    const pairId = `${belief1Id}:${belief2Id}`;
    this.entanglements.set(pairId, {
      belief1Id,
      belief2Id,
      correlation: Math.max(-1, Math.min(1, correlation))
    });

    this.emit('beliefs:entangled', { belief1Id, belief2Id, correlation });
  }

  /**
   * Measure a belief (collapse from superposition)
   */
  measureBelief(beliefId: string): boolean {
    const belief = this.beliefs.get(beliefId);
    if (!belief) throw new Error(`Belief not found: ${beliefId}`);

    const { outcome, newState } = QubitOps.measure(belief.state);
    belief.state = newState;
    belief.confidence = outcome === 1 ? 1 : 0;
    belief.lastMeasured = Date.now();

    // Collapse entangled beliefs
    this.collapseEntangled(beliefId, outcome === 1);

    this.emit('belief:measured', { beliefId, outcome: outcome === 1 });
    return outcome === 1;
  }

  private collapseEntangled(beliefId: string, result: boolean): void {
    for (const [pairId, pair] of this.entanglements) {
      let partnerId: string | null = null;
      let isFirst = false;

      if (pair.belief1Id === beliefId) {
        partnerId = pair.belief2Id;
        isFirst = true;
      } else if (pair.belief2Id === beliefId) {
        partnerId = pair.belief1Id;
        isFirst = false;
      }

      if (partnerId) {
        const partner = this.beliefs.get(partnerId);
        if (partner && !partner.lastMeasured) {
          // Determine partner state based on correlation
          const partnerResult = pair.correlation > 0 ? result : !result;
          
          // Add quantum noise based on correlation strength
          const noise = this.fisherEscola.sample() * (1 - Math.abs(pair.correlation));
          const finalResult = Math.random() < noise ? !partnerResult : partnerResult;

          partner.state = finalResult ? QubitOps.one() : QubitOps.zero();
          partner.confidence = finalResult ? 1 : 0;
          partner.lastMeasured = Date.now();

          this.emit('belief:entangled-collapse', { beliefId: partnerId, outcome: finalResult });
        }
      }
    }
  }

  /**
   * Make a decision using quantum interference
   * Options can constructively or destructively interfere
   */
  decide(options: DecisionOption[]): DecisionOutcome {
    // Calculate quantum amplitudes
    let totalAmplitude = ComplexMath.create(0, 0);
    const amplitudes: Complex[] = [];

    for (const option of options) {
      // Combine classical utility with quantum weight
      const utilityPhase = option.utility * Math.PI / 2; // Utility affects phase
      const amplitude = ComplexMath.multiply(
        option.quantumWeight,
        ComplexMath.fromPolar(1, utilityPhase)
      );
      amplitudes.push(amplitude);
      totalAmplitude = ComplexMath.add(totalAmplitude, amplitude);
    }

    // Calculate interference effect
    const classicalSum = options.reduce((sum, opt) => 
      sum + ComplexMath.magnitudeSquared(opt.quantumWeight), 0
    );
    const quantumSum = ComplexMath.magnitudeSquared(totalAmplitude);
    const interferenceEffect = (quantumSum - classicalSum) / Math.max(classicalSum, 0.001);

    // Calculate probabilities with Q-distribution noise
    const probabilities = amplitudes.map(amp => {
      const baseProb = ComplexMath.magnitudeSquared(amp) / Math.max(quantumSum, 0.001);
      const noise = this.fisherEscola.sample() * 0.1;
      return Math.max(0, baseProb + noise);
    });

    // Normalize probabilities
    const probSum = probabilities.reduce((a, b) => a + b, 0);
    const normalizedProbs = probabilities.map(p => p / probSum);

    // Sample outcome
    let random = Math.random();
    let selectedIndex = 0;
    for (let i = 0; i < normalizedProbs.length; i++) {
      random -= normalizedProbs[i];
      if (random <= 0) {
        selectedIndex = i;
        break;
      }
    }

    const outcome: DecisionOutcome = {
      selectedOption: options[selectedIndex].id,
      probability: normalizedProbs[selectedIndex],
      interferenceEffect,
      collapsed: true
    };

    this.decisionHistory.push(outcome);
    this.emit('decision:made', outcome);

    return outcome;
  }

  /**
   * Create decision options in superposition
   */
  createOptions(descriptions: string[]): DecisionOption[] {
    return descriptions.map((desc, i) => {
      const phase = (2 * Math.PI * i) / descriptions.length;
      return {
        id: `option-${i}`,
        description: desc,
        utility: 0.5, // Neutral utility
        quantumWeight: ComplexMath.fromPolar(1 / Math.sqrt(descriptions.length), phase)
      };
    });
  }

  /**
   * Set utility for an option (affects interference pattern)
   */
  setOptionUtility(options: DecisionOption[], optionId: string, utility: number): void {
    const option = options.find(o => o.id === optionId);
    if (option) {
      option.utility = Math.max(-1, Math.min(1, utility));
    }
  }

  /**
   * Get coherence between two beliefs (quantum correlation)
   */
  getCoherence(belief1Id: string, belief2Id: string): number {
    const b1 = this.beliefs.get(belief1Id);
    const b2 = this.beliefs.get(belief2Id);
    if (!b1 || !b2) return 0;

    // Inner product of states
    const innerProduct = ComplexMath.add(
      ComplexMath.multiply(ComplexMath.conjugate(b1.state.alpha), b2.state.alpha),
      ComplexMath.multiply(ComplexMath.conjugate(b1.state.beta), b2.state.beta)
    );

    return ComplexMath.magnitudeSquared(innerProduct);
  }

  /**
   * Sample from Fisher-Escolà distribution (for external use)
   */
  sampleQuantumNoise(): number {
    return this.fisherEscola.sample();
  }

  getBeliefs(): QuantumBelief[] {
    return Array.from(this.beliefs.values());
  }

  getBelief(id: string): QuantumBelief | undefined {
    return this.beliefs.get(id);
  }

  getDecisionHistory(): DecisionOutcome[] {
    return [...this.decisionHistory];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SQUAD ENTANGLEMENT (Multi-Agent Coordination)
// ─────────────────────────────────────────────────────────────────────────────

export interface SquadMember {
  id: string;
  kernel: QuantumDecisionKernel;
  role: 'lead' | 'support' | 'scout' | 'reserve';
}

/**
 * Coordinates multiple agents via quantum entanglement simulation
 * When one agent observes a threat, the entire squad "collapses" to defensive posture
 */
export class SquadEntanglement extends EventEmitter {
  private members: Map<string, SquadMember> = new Map();
  private sharedBeliefId: string = 'squad:threat-detected';

  addMember(id: string, kernel: QuantumDecisionKernel, role: SquadMember['role']): void {
    this.members.set(id, { id, kernel, role });
    
    // Add shared belief to member's kernel
    kernel.addBelief(this.sharedBeliefId, 'Threat detected by squad', 0.1);
    
    // Entangle with all other members
    for (const [otherId, other] of this.members) {
      if (otherId !== id) {
        kernel.entangle(this.sharedBeliefId, this.sharedBeliefId, 0.95);
      }
    }

    this.emit('member:added', { id, role });
  }

  /**
   * One member detects a threat - entire squad responds
   */
  detectThreat(detectorId: string, threatLevel: number): void {
    const detector = this.members.get(detectorId);
    if (!detector) return;

    // Update detector's belief strongly
    detector.kernel.updateBelief(this.sharedBeliefId, threatLevel, true);
    
    // Measure (collapse)
    const detected = detector.kernel.measureBelief(this.sharedBeliefId);

    if (detected) {
      // Propagate to squad via entanglement
      for (const [id, member] of this.members) {
        if (id !== detectorId) {
          // Strong evidence from entangled partner
          member.kernel.updateBelief(this.sharedBeliefId, threatLevel * 0.9, true);
        }
      }

      this.emit('squad:threat-response', {
        detectorId,
        threatLevel,
        squadSize: this.members.size
      });
    }
  }

  /**
   * Get squad's collective threat assessment
   */
  getCollectiveAssessment(): number {
    let total = 0;
    for (const member of this.members.values()) {
      const belief = member.kernel.getBelief(this.sharedBeliefId);
      if (belief) {
        total += belief.confidence;
      }
    }
    return total / Math.max(1, this.members.size);
  }

  getMemberCount(): number {
    return this.members.size;
  }
}

export default QuantumDecisionKernel;
