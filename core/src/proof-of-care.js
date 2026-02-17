/**
 * PROOF OF CARE (PoC) CONSENSUS ALGORITHM
 * The Cryptographic Heart of the L.O.V.E. Economy
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱💚
 * 
 * Core formula: Care_Score = Σ(T_prox × Q_res) + Tasks_verified
 * 
 * Variables:
 * - T_prox: Time-Weighted Proximity (BLE RSSI → distance)
 * - Q_res: Quality Resonance (HRV coherence @ 0.1Hz)
 * - Tasks_verified: Completed care activities
 */

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const POC_CONFIG = {
  // Proximity thresholds (RSSI in dBm)
  RSSI: {
    INTIMATE: -50,      // < 0.5m - Hugging, reading together
    CLOSE: -60,         // < 1m - Side by side
    NURTURING: -70,     // < 3m - Same room, engaged
    PRESENT: -80,       // < 5m - Within earshot
    DISTANT: -90        // > 5m - Different rooms
  },
  
  // Care tick windows
  TICK_WINDOWS: {
    MICRO: 5 * 60 * 1000,      // 5 min - Quick check-in
    SHORT: 15 * 60 * 1000,     // 15 min - Story time
    STANDARD: 60 * 60 * 1000,  // 1 hour - Quality time
    EXTENDED: 4 * 60 * 60 * 1000 // 4 hours - Deep bonding
  },
  
  // HRV Coherence thresholds (ratio of LF power to total)
  COHERENCE: {
    GREEN: 0.5,    // High coherence - calm, connected
    YELLOW: 0.3,   // Moderate coherence - neutral
    RED: 0.15      // Low coherence - stressed, dysregulated
  },
  
  // Token minting rates (base tokens per care tick)
  MINT_RATES: {
    MICRO_TICK: 1,
    SHORT_TICK: 5,
    STANDARD_TICK: 25,
    EXTENDED_TICK: 100,
    BONUS_COHERENCE: 2.0,  // Multiplier for green coherence
    BONUS_SYNC: 1.5        // Multiplier for parent-child sync
  },
  
  // Slashing conditions
  SLASHING: {
    ABANDONMENT_THRESHOLD: 24 * 60 * 60 * 1000, // 24 hours no presence
    TOXICITY_THRESHOLD: 0.7,  // Entropy score triggering slash
    SLASH_PERCENTAGE: 0.05,   // 5% stake slashed per violation
    SEVERE_SLASH: 0.25        // 25% for severe abuse detection
  },
  
  // Path Loss Model for RSSI → Distance
  // RSSI = -10n * log10(d) + A
  PATH_LOSS: {
    N: 2.0,  // Path loss exponent (2.0 for free space)
    A: -40   // RSSI at 1 meter reference
  }
};

// ============================================================================
// CARE TICK CLASS
// ============================================================================

class CareTick {
  constructor(guardianId, childId, timestamp = Date.now()) {
    this.id = `tick_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.guardianId = guardianId;
    this.childId = childId;
    this.timestamp = timestamp;
    this.duration = 0;
    this.rssiSamples = [];
    this.hrvSamples = { guardian: [], child: [] };
    this.tasks = [];
    
    // Computed values
    this.T_prox = 0;
    this.Q_res = 0;
    this.careScore = 0;
    this.tokensEarned = 0;
    this.isValid = false;
    
    // ZK-Proof placeholders
    this.proximityProof = null;
    this.coherenceProof = null;
  }
  
  /**
   * Add RSSI sample (from BLE beacon)
   */
  addRSSISample(rssi, timestamp = Date.now()) {
    // Filter outliers (signal boosting prevention)
    if (rssi < -100 || rssi > -20) return;
    
    this.rssiSamples.push({
      value: rssi,
      timestamp,
      distance: this._rssiToDistance(rssi)
    });
  }
  
  /**
   * Add HRV sample (Inter-Beat Intervals)
   */
  addHRVSample(role, ibi, timestamp = Date.now()) {
    if (role !== 'guardian' && role !== 'child') return;
    
    this.hrvSamples[role].push({
      ibi,
      timestamp
    });
  }
  
  /**
   * Add verified task
   */
  addTask(taskId, taskType, metadata = {}) {
    this.tasks.push({
      taskId,
      taskType,
      timestamp: Date.now(),
      ...metadata
    });
  }
  
  /**
   * Convert RSSI to distance using Log-Distance Path Loss Model
   * d = 10^((A - RSSI) / (10 * n))
   */
  _rssiToDistance(rssi) {
    const { N, A } = POC_CONFIG.PATH_LOSS;
    return Math.pow(10, (A - rssi) / (10 * N));
  }
  
  /**
   * Calculate Time-Weighted Proximity (T_prox)
   * Returns 0-1 score based on average proximity over time
   */
  calculateT_prox() {
    if (this.rssiSamples.length === 0) return 0;
    
    // Calculate robust mean (trimmed mean to prevent gaming)
    const sorted = [...this.rssiSamples].sort((a, b) => a.value - b.value);
    const trimAmount = Math.floor(sorted.length * 0.1);
    const trimmed = sorted.slice(trimAmount, sorted.length - trimAmount);
    
    if (trimmed.length === 0) {
      this.T_prox = 0;
      return 0;
    }
    
    const avgRssi = trimmed.reduce((sum, s) => sum + s.value, 0) / trimmed.length;
    
    // Map RSSI to proximity score (0-1)
    const { INTIMATE, CLOSE, NURTURING, PRESENT, DISTANT } = POC_CONFIG.RSSI;
    
    let score = 0;
    if (avgRssi >= INTIMATE) score = 1.0;
    else if (avgRssi >= CLOSE) score = 0.85;
    else if (avgRssi >= NURTURING) score = 0.7;
    else if (avgRssi >= PRESENT) score = 0.5;
    else if (avgRssi >= DISTANT) score = 0.25;
    else score = 0.1;
    
    // Apply time weighting (longer durations = more weight)
    if (this.rssiSamples.length > 1) {
      const firstSample = this.rssiSamples[0].timestamp;
      const lastSample = this.rssiSamples[this.rssiSamples.length - 1].timestamp;
      this.duration = lastSample - firstSample;
      
      // Bonus for sustained presence
      const { MICRO, SHORT, STANDARD, EXTENDED } = POC_CONFIG.TICK_WINDOWS;
      if (this.duration >= EXTENDED) score *= 1.25;
      else if (this.duration >= STANDARD) score *= 1.15;
      else if (this.duration >= SHORT) score *= 1.05;
    }
    
    this.T_prox = Math.min(1, score);
    return this.T_prox;
  }
  
  /**
   * Calculate Quality Resonance (Q_res)
   * Based on HRV coherence and parent-child synchronization
   */
  calculateQ_res() {
    const guardianCoherence = this._calculateCoherence(this.hrvSamples.guardian);
    const childCoherence = this._calculateCoherence(this.hrvSamples.child);
    
    if (guardianCoherence === null || childCoherence === null) {
      this.Q_res = 0.5; // Default to neutral if no HRV data
      return this.Q_res;
    }
    
    // Base Q_res on average coherence
    const avgCoherence = (guardianCoherence + childCoherence) / 2;
    
    // Check for synchronization (coherent at same time)
    const syncBonus = this._calculateSync();
    
    // Map to 0-1 scale with sync bonus
    const { GREEN, YELLOW } = POC_CONFIG.COHERENCE;
    let score = 0;
    
    if (avgCoherence >= GREEN) score = 1.0;
    else if (avgCoherence >= YELLOW) score = 0.6;
    else score = 0.3;
    
    // Apply sync bonus
    score *= (1 + syncBonus * 0.5);
    
    this.Q_res = Math.min(1, score);
    return this.Q_res;
  }
  
  /**
   * Calculate HRV coherence (LF power / Total power)
   * Targets 0.1Hz (Mayer wave frequency)
   */
  _calculateCoherence(samples) {
    if (samples.length < 30) return null; // Need enough data
    
    const ibis = samples.map(s => s.ibi);
    
    // Simple coherence approximation using RMSSD and variance
    // (Full FFT implementation would go in ZK circuit)
    const mean = ibis.reduce((a, b) => a + b, 0) / ibis.length;
    const variance = ibis.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / ibis.length;
    
    // Calculate RMSSD (root mean square of successive differences)
    let sumSquaredDiff = 0;
    for (let i = 1; i < ibis.length; i++) {
      sumSquaredDiff += Math.pow(ibis[i] - ibis[i - 1], 2);
    }
    const rmssd = Math.sqrt(sumSquaredDiff / (ibis.length - 1));
    
    // Coherence approximation: lower RMSSD/variance ratio = higher coherence
    // (More regular, sine-wave-like pattern)
    const coherenceRatio = variance > 0 ? rmssd / Math.sqrt(variance) : 0;
    const normalizedCoherence = Math.max(0, 1 - coherenceRatio);
    
    return normalizedCoherence;
  }
  
  /**
   * Calculate parent-child HRV synchronization
   */
  _calculateSync() {
    if (this.hrvSamples.guardian.length < 10 || this.hrvSamples.child.length < 10) {
      return 0;
    }
    
    // Find overlapping time windows
    const guardianTimes = this.hrvSamples.guardian.map(s => s.timestamp);
    const childTimes = this.hrvSamples.child.map(s => s.timestamp);
    
    const minTime = Math.max(Math.min(...guardianTimes), Math.min(...childTimes));
    const maxTime = Math.min(Math.max(...guardianTimes), Math.max(...childTimes));
    
    if (maxTime - minTime < 60000) return 0; // Need at least 1 minute overlap
    
    // Simple correlation of IBI values in overlapping window
    const guardianInWindow = this.hrvSamples.guardian
      .filter(s => s.timestamp >= minTime && s.timestamp <= maxTime);
    const childInWindow = this.hrvSamples.child
      .filter(s => s.timestamp >= minTime && s.timestamp <= maxTime);
    
    if (guardianInWindow.length < 5 || childInWindow.length < 5) return 0;
    
    // Resample to match lengths (simple approach)
    const len = Math.min(guardianInWindow.length, childInWindow.length);
    const g = guardianInWindow.slice(0, len).map(s => s.ibi);
    const c = childInWindow.slice(0, len).map(s => s.ibi);
    
    // Pearson correlation
    const meanG = g.reduce((a, b) => a + b, 0) / len;
    const meanC = c.reduce((a, b) => a + b, 0) / len;
    
    let numerator = 0;
    let denomG = 0;
    let denomC = 0;
    
    for (let i = 0; i < len; i++) {
      const dg = g[i] - meanG;
      const dc = c[i] - meanC;
      numerator += dg * dc;
      denomG += dg * dg;
      denomC += dc * dc;
    }
    
    const denom = Math.sqrt(denomG * denomC);
    const correlation = denom > 0 ? numerator / denom : 0;
    
    // Positive correlation = in sync
    return Math.max(0, correlation);
  }
  
  /**
   * Calculate total Care Score
   */
  calculateCareScore() {
    this.calculateT_prox();
    this.calculateQ_res();
    
    // Core formula: Care_Score = T_prox × Q_res + Tasks_verified
    const baseScore = this.T_prox * this.Q_res;
    const taskBonus = this.tasks.length * 0.1;
    
    this.careScore = Math.min(2, baseScore + taskBonus);
    return this.careScore;
  }
  
  /**
   * Calculate tokens earned from this tick
   */
  calculateTokens() {
    this.calculateCareScore();
    
    // Base tokens from duration
    const { MICRO, SHORT, STANDARD, EXTENDED } = POC_CONFIG.TICK_WINDOWS;
    const { MICRO_TICK, SHORT_TICK, STANDARD_TICK, EXTENDED_TICK, BONUS_COHERENCE, BONUS_SYNC } = POC_CONFIG.MINT_RATES;
    
    let baseTokens = MICRO_TICK;
    if (this.duration >= EXTENDED) baseTokens = EXTENDED_TICK;
    else if (this.duration >= STANDARD) baseTokens = STANDARD_TICK;
    else if (this.duration >= SHORT) baseTokens = SHORT_TICK;
    
    // Apply care score multiplier
    let tokens = baseTokens * this.careScore;
    
    // Coherence bonus
    if (this.Q_res >= 0.8) {
      tokens *= BONUS_COHERENCE;
    }
    
    // Sync bonus
    const sync = this._calculateSync();
    if (sync > 0.5) {
      tokens *= BONUS_SYNC;
    }
    
    this.tokensEarned = Math.floor(tokens);
    return this.tokensEarned;
  }
  
  /**
   * Validate this care tick
   */
  validate() {
    // Minimum requirements
    const hasProximity = this.rssiSamples.length >= 10;
    const hasMinDuration = this.duration >= POC_CONFIG.TICK_WINDOWS.MICRO;
    const hasCareScore = this.careScore > 0;
    
    this.isValid = hasProximity && hasMinDuration && hasCareScore;
    return this.isValid;
  }
  
  /**
   * Export for ZK proof generation (privacy-preserving)
   */
  exportForZKProof() {
    return {
      tickId: this.id,
      timestamp: this.timestamp,
      duration: this.duration,
      rssiCount: this.rssiSamples.length,
      avgRssi: this.rssiSamples.length > 0 
        ? this.rssiSamples.reduce((s, r) => s + r.value, 0) / this.rssiSamples.length 
        : null,
      hrvSampleCounts: {
        guardian: this.hrvSamples.guardian.length,
        child: this.hrvSamples.child.length
      },
      T_prox: this.T_prox,
      Q_res: this.Q_res,
      careScore: this.careScore,
      tokensEarned: this.tokensEarned,
      taskCount: this.tasks.length,
      isValid: this.isValid
    };
  }
  
  /**
   * Serialize for storage/transmission
   */
  toJSON() {
    return {
      id: this.id,
      guardianId: this.guardianId,
      childId: this.childId,
      timestamp: this.timestamp,
      duration: this.duration,
      T_prox: this.T_prox,
      Q_res: this.Q_res,
      careScore: this.careScore,
      tokensEarned: this.tokensEarned,
      taskCount: this.tasks.length,
      isValid: this.isValid,
      // NO RAW DATA - privacy preserving
      proximityProofHash: this.proximityProof ? hashData(this.proximityProof) : null,
      coherenceProofHash: this.coherenceProof ? hashData(this.coherenceProof) : null
    };
  }
}

// ============================================================================
// CARE STAKE CLASS
// ============================================================================

class CareStake {
  constructor(guardianId, childId, initialStake = 0) {
    this.guardianId = guardianId;
    this.childId = childId;
    this.stake = initialStake;
    this.sanctuaryFund = 0;  // Child's protected fund
    this.dynamicEquity = 0.5; // 50-50 start
    this.totalTokensEarned = 0;
    this.totalSlashed = 0;
    this.violations = [];
    this.lastCareTime = Date.now();
  }
  
  /**
   * Record care tokens from validated tick
   */
  recordCare(careTick) {
    if (!careTick.isValid) return false;
    
    this.totalTokensEarned += careTick.tokensEarned;
    this.lastCareTime = careTick.timestamp;
    
    // Update dynamic equity based on accumulated care
    this._updateDynamicEquity();
    
    return true;
  }
  
  /**
   * Slash stake for violations
   */
  slash(reason, severity = 'standard') {
    const { SLASH_PERCENTAGE, SEVERE_SLASH } = POC_CONFIG.SLASHING;
    
    const slashRate = severity === 'severe' ? SEVERE_SLASH : SLASH_PERCENTAGE;
    const slashAmount = Math.floor(this.stake * slashRate);
    
    this.stake -= slashAmount;
    this.sanctuaryFund += slashAmount; // Redistributed to child
    this.totalSlashed += slashAmount;
    
    this.violations.push({
      timestamp: Date.now(),
      reason,
      severity,
      amount: slashAmount
    });
    
    // Decrease guardian's dynamic equity
    this.dynamicEquity = Math.max(0, this.dynamicEquity - (severity === 'severe' ? 0.15 : 0.05));
    
    return slashAmount;
  }
  
  /**
   * Check for abandonment and auto-slash
   */
  checkAbandonment() {
    const timeSinceLastCare = Date.now() - this.lastCareTime;
    
    if (timeSinceLastCare > POC_CONFIG.SLASHING.ABANDONMENT_THRESHOLD) {
      const daysAbandoned = Math.floor(timeSinceLastCare / (24 * 60 * 60 * 1000));
      this.slash(`Abandonment: ${daysAbandoned} days without care`, 'standard');
      return true;
    }
    
    return false;
  }
  
  /**
   * Update dynamic equity based on care performance
   */
  _updateDynamicEquity() {
    // Equity increases with consistent care
    // "The more love and care shown by guardians, the more equal the profit split"
    const baseEquity = 0.5;
    const careBonus = Math.min(0.4, this.totalTokensEarned / 10000);
    const violationPenalty = this.violations.length * 0.05;
    
    this.dynamicEquity = Math.max(0, Math.min(1, baseEquity + careBonus - violationPenalty));
  }
  
  /**
   * Get child's share of any value
   */
  getChildShare(totalValue) {
    // Child gets inverse of guardian equity
    const childEquity = 1 - this.dynamicEquity;
    return Math.floor(totalValue * childEquity);
  }
  
  /**
   * Get guardian's share
   */
  getGuardianShare(totalValue) {
    return Math.floor(totalValue * this.dynamicEquity);
  }
  
  toJSON() {
    return {
      guardianId: this.guardianId,
      childId: this.childId,
      stake: this.stake,
      sanctuaryFund: this.sanctuaryFund,
      dynamicEquity: this.dynamicEquity,
      totalTokensEarned: this.totalTokensEarned,
      totalSlashed: this.totalSlashed,
      violationCount: this.violations.length,
      lastCareTime: this.lastCareTime
    };
  }
}

// ============================================================================
// PROOF OF CARE ENGINE
// ============================================================================

class ProofOfCareEngine {
  constructor() {
    this.activeTicks = new Map();  // guardianId -> CareTick
    this.stakes = new Map();        // `${guardianId}_${childId}` -> CareStake
    this.validatedTicks = [];
    this.totalTokensMinted = 0;
    this.listeners = new Map();
    
    // ZK integration (stubs for now)
    this.zkProver = null;
    this.zkVerifier = null;
  }
  
  /**
   * Start a new care tick
   */
  startTick(guardianId, childId) {
    const tick = new CareTick(guardianId, childId);
    this.activeTicks.set(guardianId, tick);
    
    this._emit('tickStarted', { tick: tick.exportForZKProof() });
    return tick.id;
  }
  
  /**
   * Record RSSI sample to active tick
   */
  recordRSSI(guardianId, rssi) {
    const tick = this.activeTicks.get(guardianId);
    if (!tick) return false;
    
    tick.addRSSISample(rssi);
    return true;
  }
  
  /**
   * Record HRV sample to active tick
   */
  recordHRV(guardianId, role, ibi) {
    const tick = this.activeTicks.get(guardianId);
    if (!tick) return false;
    
    tick.addHRVSample(role, ibi);
    return true;
  }
  
  /**
   * Add task to active tick
   */
  recordTask(guardianId, taskId, taskType) {
    const tick = this.activeTicks.get(guardianId);
    if (!tick) return false;
    
    tick.addTask(taskId, taskType);
    return true;
  }
  
  /**
   * Complete and validate a care tick
   */
  completeTick(guardianId) {
    const tick = this.activeTicks.get(guardianId);
    if (!tick) return null;
    
    // Calculate scores
    tick.calculateCareScore();
    tick.calculateTokens();
    tick.validate();
    
    // Generate ZK proofs (placeholder)
    tick.proximityProof = this._generateProximityProof(tick);
    tick.coherenceProof = this._generateCoherenceProof(tick);
    
    // Remove from active
    this.activeTicks.delete(guardianId);
    
    if (tick.isValid) {
      // Add to validated
      this.validatedTicks.push(tick);
      
      // Update stake
      const stakeKey = `${tick.guardianId}_${tick.childId}`;
      let stake = this.stakes.get(stakeKey);
      if (!stake) {
        stake = new CareStake(tick.guardianId, tick.childId);
        this.stakes.set(stakeKey, stake);
      }
      stake.recordCare(tick);
      
      // Mint tokens
      this.totalTokensMinted += tick.tokensEarned;
      
      this._emit('tickValidated', {
        tick: tick.exportForZKProof(),
        stake: stake.toJSON()
      });
    } else {
      this._emit('tickInvalid', {
        tick: tick.exportForZKProof(),
        reason: 'Minimum requirements not met'
      });
    }
    
    return tick.isValid ? tick : null;
  }
  
  /**
   * Report toxicity event for slashing
   */
  reportToxicity(guardianId, childId, entropyScore, evidence = null) {
    const stakeKey = `${guardianId}_${childId}`;
    const stake = this.stakes.get(stakeKey);
    
    if (!stake) return false;
    
    const { TOXICITY_THRESHOLD } = POC_CONFIG.SLASHING;
    
    if (entropyScore >= TOXICITY_THRESHOLD) {
      const severity = entropyScore > 0.9 ? 'severe' : 'standard';
      const slashed = stake.slash(`Toxicity detected: entropy ${entropyScore.toFixed(2)}`, severity);
      
      this._emit('slashingEvent', {
        guardianId,
        childId,
        reason: 'toxicity',
        entropyScore,
        slashedAmount: slashed,
        severity
      });
      
      return slashed;
    }
    
    return 0;
  }
  
  /**
   * Get stake for guardian-child pair
   */
  getStake(guardianId, childId) {
    const stakeKey = `${guardianId}_${childId}`;
    return this.stakes.get(stakeKey)?.toJSON() || null;
  }
  
  /**
   * Get child's sanctuary fund
   */
  getSanctuaryFund(childId) {
    let total = 0;
    for (const [key, stake] of this.stakes) {
      if (key.endsWith(`_${childId}`)) {
        total += stake.sanctuaryFund;
      }
    }
    return total;
  }
  
  /**
   * Get total tokens earned by child (from all guardians)
   */
  getChildTokens(childId) {
    let total = 0;
    for (const [key, stake] of this.stakes) {
      if (key.endsWith(`_${childId}`)) {
        // Child gets their share based on dynamic equity
        total += stake.getChildShare(stake.totalTokensEarned);
        total += stake.sanctuaryFund;
      }
    }
    return total;
  }
  
  /**
   * Run abandonment checks on all stakes
   */
  checkAllAbandonment() {
    const slashEvents = [];
    for (const [key, stake] of this.stakes) {
      if (stake.checkAbandonment()) {
        slashEvents.push({
          stakeKey: key,
          stake: stake.toJSON()
        });
      }
    }
    return slashEvents;
  }
  
  /**
   * Generate proximity proof (ZK placeholder)
   */
  _generateProximityProof(tick) {
    // In production: Generate Bulletproof/Range Proof
    // Proves RSSI in valid range without revealing actual value
    return {
      type: 'proximity-range-proof',
      statement: `RSSI in range [-${POC_CONFIG.RSSI.PRESENT}, ${POC_CONFIG.RSSI.INTIMATE}]`,
      verified: tick.T_prox > 0,
      timestamp: Date.now()
    };
  }
  
  /**
   * Generate coherence proof (ZK placeholder)
   */
  _generateCoherenceProof(tick) {
    // In production: ZK-FFT circuit proves coherence without revealing HRV
    return {
      type: 'coherence-zk-fft',
      statement: `HRV coherence >= ${POC_CONFIG.COHERENCE.YELLOW}`,
      verified: tick.Q_res > 0,
      timestamp: Date.now()
    };
  }
  
  // Event system
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
    return () => {
      const cbs = this.listeners.get(event);
      const idx = cbs.indexOf(callback);
      if (idx > -1) cbs.splice(idx, 1);
    };
  }
  
  _emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => {
      try {
        cb(data);
      } catch (e) {
        console.error(`[PoC] Event error:`, e);
      }
    });
  }
  
  /**
   * Get engine stats
   */
  getStats() {
    return {
      activeTicks: this.activeTicks.size,
      validatedTicks: this.validatedTicks.length,
      totalStakes: this.stakes.size,
      totalTokensMinted: this.totalTokensMinted
    };
  }
  
  toJSON() {
    return {
      stats: this.getStats(),
      stakes: Array.from(this.stakes.values()).map(s => s.toJSON())
    };
  }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Simple hash function for proof hashes
 */
function hashData(data) {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `0x${Math.abs(hash).toString(16).padStart(16, '0')}`;
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  POC_CONFIG,
  CareTick,
  CareStake,
  ProofOfCareEngine,
  hashData
};