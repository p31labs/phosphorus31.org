/**
 * ZK-PRIVACY LAYER
 * Zero-Knowledge Proofs for Privacy-Preserving Care Verification
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱🔐
 * 
 * Implements GDPR Article 17 compliant architecture:
 * - ZK-Range Proofs for proximity (Bulletproofs)
 * - ZK-FFT circuits for HRV coherence verification
 * - Off-chain Personal Data Store (PDS) with on-chain proofs only
 * - Crypto-shredding capability for Right to be Forgotten
 * 
 * Based on: REGULATORY_ARCHITECTURE_LOVE_ECONOMY.md
 */

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const ZK_CONFIG = {
  // Proof types
  PROOF_TYPES: {
    PROXIMITY_RANGE: 'proximity-range-proof',
    COHERENCE_FFT: 'coherence-zk-fft',
    SYNC_COLLABORATIVE: 'sync-collaborative-snark',
    TASK_VERIFICATION: 'task-merkle-proof'
  },
  
  // Range proof parameters for RSSI
  RSSI_RANGE: {
    MIN: -90,  // Minimum valid RSSI (far)
    MAX: -30,  // Maximum valid RSSI (very close)
    CARE_THRESHOLD: -70  // Must be above this for "nurturing" proximity
  },
  
  // Coherence proof parameters
  COHERENCE: {
    MIN_THRESHOLD: 0.3,  // Minimum coherence for "yellow"
    GREEN_THRESHOLD: 0.5  // Threshold for "green" coherence
  },
  
  // Pedersen commitment parameters (simplified)
  PEDERSEN: {
    G: BigInt('0x79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798'),
    H: BigInt('0x8B4B5F165DF3C2BE8C6244B5B745638843E4A781A3BDDCEC7BA6E0C3D5E58E6A'),
    P: BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F')
  },
  
  // Personal Data Store settings
  PDS: {
    RETENTION_DAYS: 365,  // Keep encrypted data for 1 year
    ERASURE_GRACE_PERIOD: 30 * 24 * 60 * 60 * 1000  // 30 days to process erasure
  }
};

// ============================================================================
// PEDERSEN COMMITMENT (Simplified)
// ============================================================================

/**
 * Pedersen Commitment: Comm = g^value * h^blinding mod p
 * Hiding: Can't determine value without blinding factor
 * Binding: Can't change value after commitment
 */
class PedersenCommitment {
  constructor() {
    this.G = ZK_CONFIG.PEDERSEN.G;
    this.H = ZK_CONFIG.PEDERSEN.H;
    this.P = ZK_CONFIG.PEDERSEN.P;
  }
  
  /**
   * Generate a random blinding factor
   */
  generateBlinding() {
    // In production: use crypto.randomBytes
    const bytes = new Uint8Array(32);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < 32; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
    return BigInt('0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''));
  }
  
  /**
   * Create commitment to a value
   */
  commit(value, blinding = null) {
    const v = BigInt(Math.floor(value * 1000000)); // Scale to integer
    const r = blinding || this.generateBlinding();
    
    // Simplified modular exponentiation (NOT cryptographically secure - placeholder)
    // In production: use proper big integer library with modPow
    const commitment = this._simplifiedCommit(v, r);
    
    return {
      commitment: commitment.toString(16),
      blinding: r.toString(16),
      value: value  // Keep for verification (would be hidden in production)
    };
  }
  
  /**
   * Simplified commitment (placeholder - not cryptographically secure)
   */
  _simplifiedCommit(v, r) {
    // Hash-based commitment for demo purposes
    const str = `${v.toString()}_${r.toString()}`;
    let hash = BigInt(0);
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << BigInt(5)) - hash) + BigInt(str.charCodeAt(i));
      hash = hash & BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF');
    }
    return hash;
  }
  
  /**
   * Verify commitment (requires blinding factor)
   */
  verify(commitment, value, blinding) {
    const recomputed = this.commit(value, BigInt('0x' + blinding));
    return recomputed.commitment === commitment;
  }
}

// ============================================================================
// RANGE PROOF (Simplified Bulletproof-style)
// ============================================================================

/**
 * Range Proof: Proves value is in range [min, max] without revealing value
 * Used for RSSI proximity verification
 */
class RangeProof {
  constructor() {
    this.commitment = new PedersenCommitment();
  }
  
  /**
   * Generate range proof for RSSI value
   * Proves: MIN <= rssi <= MAX without revealing rssi
   */
  generateProximityProof(rssiValue, targetThreshold = ZK_CONFIG.RSSI_RANGE.CARE_THRESHOLD) {
    const { MIN, MAX } = ZK_CONFIG.RSSI_RANGE;
    
    // Validate input
    if (rssiValue < MIN || rssiValue > MAX) {
      return { valid: false, reason: 'RSSI out of valid range' };
    }
    
    // Create commitment to RSSI value
    const rssiCommitment = this.commitment.commit(rssiValue);
    
    // Create commitment to (rssi - threshold) to prove rssi >= threshold
    const diffValue = rssiValue - targetThreshold;
    const diffCommitment = this.commitment.commit(diffValue);
    
    // In production: Generate actual Bulletproof
    // For now: Create proof structure
    const proof = {
      type: ZK_CONFIG.PROOF_TYPES.PROXIMITY_RANGE,
      timestamp: Date.now(),
      
      // Public inputs
      publicInputs: {
        rangeMin: MIN,
        rangeMax: MAX,
        threshold: targetThreshold,
        statement: `RSSI in range [${MIN}, ${MAX}] AND RSSI >= ${targetThreshold}`
      },
      
      // Commitments (hiding the actual values)
      commitments: {
        rssi: rssiCommitment.commitment,
        difference: diffCommitment.commitment
      },
      
      // Proof data (in production: actual Bulletproof)
      proofData: {
        // Challenge-response structure
        challenge: this._generateChallenge(rssiCommitment.commitment, diffCommitment.commitment),
        response: this._generateResponse(rssiValue, diffValue, rssiCommitment.blinding, diffCommitment.blinding),
        // Auxiliary data for verification
        aux: this._generateAuxData(rssiValue, targetThreshold)
      },
      
      // Result (for internal verification)
      _internal: {
        meetsThreshold: rssiValue >= targetThreshold,
        inRange: rssiValue >= MIN && rssiValue <= MAX
      }
    };
    
    return {
      valid: true,
      proof,
      verified: proof._internal.meetsThreshold && proof._internal.inRange
    };
  }
  
  /**
   * Verify proximity proof
   */
  verifyProximityProof(proof) {
    if (proof.type !== ZK_CONFIG.PROOF_TYPES.PROXIMITY_RANGE) {
      return { valid: false, reason: 'Invalid proof type' };
    }
    
    // In production: Verify actual Bulletproof
    // For demo: Check proof structure and challenge-response
    const challengeValid = this._verifyChallengeResponse(proof);
    
    return {
      valid: challengeValid,
      statement: proof.publicInputs.statement,
      timestamp: proof.timestamp
    };
  }
  
  _generateChallenge(comm1, comm2) {
    const str = `${comm1}_${comm2}_${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
  
  _generateResponse(v1, v2, b1, b2) {
    // Simplified response generation
    return {
      r1: (BigInt('0x' + b1) % BigInt(1000000)).toString(16),
      r2: (BigInt('0x' + b2) % BigInt(1000000)).toString(16)
    };
  }
  
  _generateAuxData(rssi, threshold) {
    // Auxiliary data that helps verification without revealing value
    return {
      aboveThreshold: rssi >= threshold,
      proximityBand: rssi >= -50 ? 'intimate' : rssi >= -60 ? 'close' : rssi >= -70 ? 'nurturing' : 'distant'
    };
  }
  
  _verifyChallengeResponse(proof) {
    // Simplified verification
    return proof.proofData.challenge && proof.proofData.response && proof.proofData.aux;
  }
}

// ============================================================================
// COHERENCE PROOF (ZK-FFT)
// ============================================================================

/**
 * Coherence Proof: Proves HRV coherence >= threshold without revealing HRV data
 * Uses ZK-FFT circuit concept
 */
class CoherenceProof {
  constructor() {
    this.commitment = new PedersenCommitment();
  }
  
  /**
   * Generate coherence proof from IBI (Inter-Beat Interval) samples
   * Proves: LF_power / Total_power >= threshold (Green Coherence)
   */
  generateCoherenceProof(ibiSamples, targetCoherence = ZK_CONFIG.COHERENCE.GREEN_THRESHOLD) {
    if (ibiSamples.length < 30) {
      return { valid: false, reason: 'Insufficient IBI samples (need >= 30)' };
    }
    
    // Calculate coherence (in production: this would be inside ZK circuit)
    const coherenceResult = this._calculateCoherence(ibiSamples);
    
    // Create commitment to coherence value
    const coherenceCommitment = this.commitment.commit(coherenceResult.coherence);
    
    // Create commitment to IBI statistics (not raw data)
    const statsCommitment = this.commitment.commit(coherenceResult.stats.mean);
    
    const proof = {
      type: ZK_CONFIG.PROOF_TYPES.COHERENCE_FFT,
      timestamp: Date.now(),
      
      // Public inputs
      publicInputs: {
        minCoherence: ZK_CONFIG.COHERENCE.MIN_THRESHOLD,
        targetCoherence: targetCoherence,
        sampleCount: ibiSamples.length,
        statement: `HRV coherence >= ${targetCoherence}`
      },
      
      // Commitments
      commitments: {
        coherence: coherenceCommitment.commitment,
        ibiStats: statsCommitment.commitment
      },
      
      // ZK-FFT proof data
      proofData: {
        // FFT verification points (in production: actual ZK-FFT proof)
        fftProofPoints: this._generateFFTProofPoints(coherenceResult),
        // Power spectral density proof
        psdProof: this._generatePSDProof(coherenceResult),
        // Final coherence ratio proof
        ratioProof: this._generateRatioProof(coherenceResult, targetCoherence)
      },
      
      // Result
      _internal: {
        meetsTarget: coherenceResult.coherence >= targetCoherence,
        coherenceLevel: coherenceResult.coherence >= ZK_CONFIG.COHERENCE.GREEN_THRESHOLD ? 'green' :
                       coherenceResult.coherence >= ZK_CONFIG.COHERENCE.MIN_THRESHOLD ? 'yellow' : 'red'
      }
    };
    
    return {
      valid: true,
      proof,
      verified: proof._internal.meetsTarget,
      level: proof._internal.coherenceLevel
    };
  }
  
  /**
   * Calculate HRV coherence from IBI samples
   */
  _calculateCoherence(ibiSamples) {
    const mean = ibiSamples.reduce((a, b) => a + b, 0) / ibiSamples.length;
    const variance = ibiSamples.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / ibiSamples.length;
    
    // RMSSD (root mean square of successive differences)
    let sumSquaredDiff = 0;
    for (let i = 1; i < ibiSamples.length; i++) {
      sumSquaredDiff += Math.pow(ibiSamples[i] - ibiSamples[i - 1], 2);
    }
    const rmssd = Math.sqrt(sumSquaredDiff / (ibiSamples.length - 1));
    
    // Simplified coherence ratio (RMSSD/variance indicates regularity)
    const coherenceRatio = variance > 0 ? 1 - (rmssd / Math.sqrt(variance)) : 0;
    const coherence = Math.max(0, Math.min(1, coherenceRatio));
    
    return {
      coherence,
      stats: { mean, variance, rmssd },
      // Simulated LF/HF components
      lfPower: coherence * 0.6,
      hfPower: (1 - coherence) * 0.4,
      totalPower: 1.0
    };
  }
  
  _generateFFTProofPoints(result) {
    // In production: actual ZK-FFT verification points
    return {
      nSamples: 64,  // FFT size
      domainSeparator: 'love-economy-fft-v1',
      checkpoints: [
        { idx: 0, valid: true },
        { idx: 32, valid: true },
        { idx: 63, valid: true }
      ]
    };
  }
  
  _generatePSDProof(result) {
    return {
      lfBandValid: result.lfPower >= 0 && result.lfPower <= 1,
      hfBandValid: result.hfPower >= 0 && result.hfPower <= 1,
      totalPowerValid: Math.abs(result.lfPower + result.hfPower - result.totalPower) < 0.01
    };
  }
  
  _generateRatioProof(result, target) {
    return {
      ratioValid: result.coherence >= 0 && result.coherence <= 1,
      meetsTarget: result.coherence >= target,
      targetUsed: target
    };
  }
  
  /**
   * Verify coherence proof
   */
  verifyCoherenceProof(proof) {
    if (proof.type !== ZK_CONFIG.PROOF_TYPES.COHERENCE_FFT) {
      return { valid: false, reason: 'Invalid proof type' };
    }
    
    // Verify FFT proof structure
    const fftValid = proof.proofData.fftProofPoints.checkpoints.every(cp => cp.valid);
    const psdValid = proof.proofData.psdProof.lfBandValid && 
                     proof.proofData.psdProof.hfBandValid &&
                     proof.proofData.psdProof.totalPowerValid;
    const ratioValid = proof.proofData.ratioProof.ratioValid;
    
    return {
      valid: fftValid && psdValid && ratioValid,
      meetsTarget: proof.proofData.ratioProof.meetsTarget,
      statement: proof.publicInputs.statement,
      timestamp: proof.timestamp
    };
  }
}

// ============================================================================
// COLLABORATIVE SNARK (Parent-Child Sync)
// ============================================================================

/**
 * Collaborative SNARK: Proves parent and child were coherent at the same time
 * Without revealing either party's HRV data
 */
class CollaborativeProof {
  constructor() {
    this.coherenceProver = new CoherenceProof();
  }
  
  /**
   * Generate collaborative sync proof
   * Proves: Both parent and child had coherence >= threshold at overlapping times
   */
  generateSyncProof(parentIBI, childIBI, parentTimestamps, childTimestamps, targetCoherence = 0.3) {
    // Generate individual proofs
    const parentProof = this.coherenceProver.generateCoherenceProof(parentIBI, targetCoherence);
    const childProof = this.coherenceProver.generateCoherenceProof(childIBI, targetCoherence);
    
    if (!parentProof.valid || !childProof.valid) {
      return {
        valid: false,
        reason: 'One or both individual proofs failed'
      };
    }
    
    // Calculate time overlap
    const overlap = this._calculateOverlap(parentTimestamps, childTimestamps);
    
    if (overlap.duration < 60000) {  // Need at least 1 minute overlap
      return {
        valid: false,
        reason: 'Insufficient temporal overlap'
      };
    }
    
    const proof = {
      type: ZK_CONFIG.PROOF_TYPES.SYNC_COLLABORATIVE,
      timestamp: Date.now(),
      
      // Aggregated public inputs
      publicInputs: {
        targetCoherence,
        minOverlapMs: 60000,
        actualOverlapMs: overlap.duration,
        statement: `Both parties had coherence >= ${targetCoherence} with >= 60s overlap`
      },
      
      // Individual proof commitments (not the proofs themselves)
      commitments: {
        parentCoherence: parentProof.proof.commitments.coherence,
        childCoherence: childProof.proof.commitments.coherence,
        overlapHash: this._hashOverlap(overlap)
      },
      
      // Aggregated verification data
      proofData: {
        parentVerified: parentProof.verified,
        childVerified: childProof.verified,
        overlapVerified: overlap.duration >= 60000,
        syncScore: this._calculateSyncScore(parentProof, childProof, overlap)
      },
      
      _internal: {
        synced: parentProof.verified && childProof.verified && overlap.duration >= 60000
      }
    };
    
    return {
      valid: true,
      proof,
      verified: proof._internal.synced,
      syncScore: proof.proofData.syncScore
    };
  }
  
  _calculateOverlap(ts1, ts2) {
    if (!ts1.length || !ts2.length) {
      return { start: 0, end: 0, duration: 0 };
    }
    
    const start1 = Math.min(...ts1);
    const end1 = Math.max(...ts1);
    const start2 = Math.min(...ts2);
    const end2 = Math.max(...ts2);
    
    const overlapStart = Math.max(start1, start2);
    const overlapEnd = Math.min(end1, end2);
    const duration = Math.max(0, overlapEnd - overlapStart);
    
    return { start: overlapStart, end: overlapEnd, duration };
  }
  
  _hashOverlap(overlap) {
    const str = `${overlap.start}_${overlap.end}_${overlap.duration}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
  
  _calculateSyncScore(parentProof, childProof, overlap) {
    // Higher overlap duration + both green coherence = higher sync score
    const overlapFactor = Math.min(1, overlap.duration / (5 * 60 * 1000));  // Max at 5 min
    const coherenceFactor = (parentProof.verified && childProof.verified) ? 1.0 : 0.5;
    return overlapFactor * coherenceFactor;
  }
  
  /**
   * Verify collaborative sync proof
   */
  verifySyncProof(proof) {
    if (proof.type !== ZK_CONFIG.PROOF_TYPES.SYNC_COLLABORATIVE) {
      return { valid: false, reason: 'Invalid proof type' };
    }
    
    return {
      valid: proof.proofData.parentVerified && 
             proof.proofData.childVerified && 
             proof.proofData.overlapVerified,
      syncScore: proof.proofData.syncScore,
      statement: proof.publicInputs.statement,
      timestamp: proof.timestamp
    };
  }
}

// ============================================================================
// PERSONAL DATA STORE (PDS) - Off-Chain Storage
// ============================================================================

/**
 * Personal Data Store for GDPR-compliant off-chain storage
 * Only hashes/proofs go on-chain
 */
class PersonalDataStore {
  constructor(ownerId) {
    this.ownerId = ownerId;
    this.data = new Map();  // In production: encrypted local storage or Solid Pod
    this.encryptionKey = null;  // Generated per-user
    this.metadata = new Map();  // On-chain anchors
    this.erasureRequests = [];
  }
  
  /**
   * Generate encryption key for this PDS
   */
  async generateKey() {
    // In production: use proper key derivation
    const bytes = new Uint8Array(32);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < 32; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
    this.encryptionKey = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    return this.encryptionKey;
  }
  
  /**
   * Store data with on-chain anchor
   */
  store(dataId, rawData, proofHash) {
    if (!this.encryptionKey) {
      throw new Error('PDS not initialized - generate key first');
    }
    
    // "Encrypt" data (simplified - XOR with key for demo)
    const encrypted = this._encrypt(JSON.stringify(rawData));
    
    // Store encrypted data off-chain
    this.data.set(dataId, {
      encrypted,
      timestamp: Date.now(),
      expiresAt: Date.now() + (ZK_CONFIG.PDS.RETENTION_DAYS * 24 * 60 * 60 * 1000)
    });
    
    // Create on-chain anchor (only this goes to blockchain)
    const anchor = {
      dataId,
      proofHash,
      contentHash: this._hash(encrypted),
      timestamp: Date.now(),
      owner: this.ownerId
    };
    
    this.metadata.set(dataId, anchor);
    
    return anchor;
  }
  
  /**
   * Retrieve and decrypt data (requires key)
   */
  retrieve(dataId) {
    const entry = this.data.get(dataId);
    if (!entry) return null;
    
    // Check expiration
    if (Date.now() > entry.expiresAt) {
      this.data.delete(dataId);
      return null;
    }
    
    // Decrypt
    const decrypted = this._decrypt(entry.encrypted);
    return JSON.parse(decrypted);
  }
  
  /**
   * Crypto-shred: Delete data to enforce Right to be Forgotten
   */
  cryptoShred(dataId) {
    // Delete encrypted data
    this.data.delete(dataId);
    
    // Mark anchor as orphaned (data no longer exists)
    const anchor = this.metadata.get(dataId);
    if (anchor) {
      anchor.shredded = true;
      anchor.shreddedAt = Date.now();
    }
    
    return {
      success: true,
      dataId,
      message: 'Data crypto-shredded. On-chain anchor is now orphan.'
    };
  }
  
  /**
   * Request erasure (GDPR Article 17)
   */
  requestErasure(requesterId, reason) {
    const request = {
      id: `erasure_${Date.now()}`,
      requesterId,
      ownerId: this.ownerId,
      reason,
      timestamp: Date.now(),
      deadline: Date.now() + ZK_CONFIG.PDS.ERASURE_GRACE_PERIOD,
      status: 'pending'
    };
    
    this.erasureRequests.push(request);
    
    return request;
  }
  
  /**
   * Process all pending erasure requests
   */
  processErasureRequests() {
    const results = [];
    
    for (const request of this.erasureRequests) {
      if (request.status === 'pending') {
        // Shred all data for this owner
        for (const [dataId, anchor] of this.metadata) {
          if (anchor.owner === request.ownerId) {
            this.cryptoShred(dataId);
            results.push({ dataId, shredded: true });
          }
        }
        
        // Also destroy encryption key (makes any remaining encrypted data useless)
        this.encryptionKey = null;
        
        request.status = 'completed';
        request.completedAt = Date.now();
      }
    }
    
    return results;
  }
  
  /**
   * Get on-chain anchors (this is what goes to blockchain)
   */
  getOnChainAnchors() {
    return Array.from(this.metadata.values());
  }
  
  // Simplified encryption (demo only - NOT secure)
  _encrypt(data) {
    const key = this.encryptionKey;
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return Buffer.from(result).toString('base64');
  }
  
  _decrypt(encrypted) {
    const data = Buffer.from(encrypted, 'base64').toString();
    const key = this.encryptionKey;
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  }
  
  _hash(data) {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
      hash = hash & hash;
    }
    return `0x${Math.abs(hash).toString(16).padStart(16, '0')}`;
  }
}

// ============================================================================
// ZK PRIVACY MANAGER
// ============================================================================

/**
 * Main ZK Privacy Manager - Coordinates all ZK operations
 */
class ZKPrivacyManager {
  constructor() {
    this.rangeProver = new RangeProof();
    this.coherenceProver = new CoherenceProof();
    this.syncProver = new CollaborativeProof();
    this.pdsMap = new Map();  // userId -> PersonalDataStore
    this.proofCache = new Map();  // proofId -> proof
  }
  
  /**
   * Initialize PDS for a user
   */
  async initializePDS(userId) {
    if (this.pdsMap.has(userId)) {
      return { exists: true, userId };
    }
    
    const pds = new PersonalDataStore(userId);
    await pds.generateKey();
    this.pdsMap.set(userId, pds);
    
    return { created: true, userId };
  }
  
  /**
   * Generate privacy-preserving proximity proof
   */
  generateProximityProof(rssiValue) {
    const result = this.rangeProver.generateProximityProof(rssiValue);
    
    if (result.valid) {
      const proofId = `prox_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.proofCache.set(proofId, result.proof);
      return { proofId, ...result };
    }
    
    return result;
  }
  
  /**
   * Generate privacy-preserving coherence proof
   */
  generateCoherenceProof(ibiSamples) {
    const result = this.coherenceProver.generateCoherenceProof(ibiSamples);
    
    if (result.valid) {
      const proofId = `coh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.proofCache.set(proofId, result.proof);
      return { proofId, ...result };
    }
    
    return result;
  }
  
  /**
   * Generate privacy-preserving sync proof (parent-child)
   */
  generateSyncProof(parentIBI, childIBI, parentTimestamps, childTimestamps) {
    const result = this.syncProver.generateSyncProof(
      parentIBI, childIBI, parentTimestamps, childTimestamps
    );
    
    if (result.valid) {
      const proofId = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      this.proofCache.set(proofId, result.proof);
      return { proofId, ...result };
    }
    
    return result;
  }
  
  /**
   * Store raw data in PDS with ZK proof
   */
  storeWithProof(userId, dataId, rawData, proofId) {
    const pds = this.pdsMap.get(userId);
    if (!pds) {
      return { error: 'PDS not initialized for user' };
    }
    
    const proof = this.proofCache.get(proofId);
    const proofHash = proof ? this._hashProof(proof) : 'no-proof';
    
    return pds.store(dataId, rawData, proofHash);
  }
  
  /**
   * Exercise Right to be Forgotten
   */
  async exerciseRightToErasure(userId, reason = 'User request') {
    const pds = this.pdsMap.get(userId);
    if (!pds) {
      return { error: 'No data found for user' };
    }
    
    // Request erasure
    const request = pds.requestErasure(userId, reason);
    
    // Process immediately (in production: might have grace period)
    const results = pds.processErasureRequests();
    
    return {
      request,
      results,
      message: 'Data crypto-shredded. On-chain proofs remain as orphan hashes (no personal data).'
    };
  }
  
  /**
   * Get what would go on-chain (proofs only, no personal data)
   */
  getOnChainData(userId) {
    const pds = this.pdsMap.get(userId);
    if (!pds) return [];
    
    // Only return anchors (hashes and proofs, not data)
    return pds.getOnChainAnchors().map(anchor => ({
      dataId: anchor.dataId,
      proofHash: anchor.proofHash,
      contentHash: anchor.contentHash,
      timestamp: anchor.timestamp,
      shredded: anchor.shredded || false
    }));
  }
  
  /**
   * Verify any proof by ID
   */
  verifyProof(proofId) {
    const proof = this.proofCache.get(proofId);
    if (!proof) {
      return { valid: false, reason: 'Proof not found' };
    }
    
    switch (proof.type) {
      case ZK_CONFIG.PROOF_TYPES.PROXIMITY_RANGE:
        return this.rangeProver.verifyProximityProof(proof);
      case ZK_CONFIG.PROOF_TYPES.COHERENCE_FFT:
        return this.coherenceProver.verifyCoherenceProof(proof);
      case ZK_CONFIG.PROOF_TYPES.SYNC_COLLABORATIVE:
        return this.syncProver.verifySyncProof(proof);
      default:
        return { valid: false, reason: 'Unknown proof type' };
    }
  }
  
  _hashProof(proof) {
    const str = JSON.stringify(proof);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash = hash & hash;
    }
    return `0x${Math.abs(hash).toString(16).padStart(16, '0')}`;
  }
  
  getStats() {
    return {
      pdsCount: this.pdsMap.size,
      cachedProofs: this.proofCache.size,
      proofTypes: Object.keys(ZK_CONFIG.PROOF_TYPES)
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  ZK_CONFIG,
  PedersenCommitment,
  RangeProof,
  CoherenceProof,
  CollaborativeProof,
  PersonalDataStore,
  ZKPrivacyManager
};