/**
 * ENTROPY SHIELD - Cognitive Protection for Children
 * The Toxicity Firewall of the L.O.V.E. Economy
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱🛡️
 * 
 * Protects children from high-entropy (toxic) communication by:
 * 1. Analyzing incoming messages for emotional entropy
 * 2. Sanitizing/blocking harmful content before it reaches the child
 * 3. Logging toxic attempts for Slashing evidence (Inverse Transparency)
 * 4. Providing calming alternatives and context
 */

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const ENTROPY_CONFIG = {
  // Entropy thresholds (0-1 scale)
  THRESHOLDS: {
    SAFE: 0.3,        // Green zone - calm, coherent communication
    CAUTION: 0.5,     // Yellow zone - elevated but manageable
    ELEVATED: 0.7,    // Orange zone - requires filtering
    TOXIC: 0.85,      // Red zone - blocked, logged for slashing
    CRITICAL: 0.95    // Crisis zone - immediate intervention
  },
  
  // Content categories
  CATEGORIES: {
    ANGER: 'anger',
    FEAR: 'fear',
    MANIPULATION: 'manipulation',
    GASLIGHTING: 'gaslighting',
    SHOUTING: 'shouting',
    THREAT: 'threat',
    SHAME: 'shame',
    GUILT_TRIP: 'guilt_trip',
    PASSIVE_AGGRESSIVE: 'passive_aggressive',
    EMOTIONAL_FLOODING: 'emotional_flooding'
  },
  
  // Weighted severity multipliers
  SEVERITY_WEIGHTS: {
    anger: 1.0,
    fear: 1.2,
    manipulation: 1.5,
    gaslighting: 1.8,
    shouting: 1.1,
    threat: 2.0,
    shame: 1.4,
    guilt_trip: 1.3,
    passive_aggressive: 0.9,
    emotional_flooding: 1.2
  },
  
  // Pattern detection for text analysis
  PATTERNS: {
    SHOUTING: /[A-Z]{5,}|!{2,}/g,
    PROFANITY: /\b(damn|hell|crap|stupid|idiot|hate)\b/gi,
    THREATS: /\b(or else|if you don't|you better|gonna|wait till)\b/gi,
    SHAME: /\b(ashamed|embarrass|disappointment|failure|useless|worthless)\b/gi,
    GUILT: /\b(after all I've done|you never|you always|because of you|your fault)\b/gi,
    MANIPULATION: /\b(if you loved me|real family|everyone thinks|no one will)\b/gi,
    GASLIGHTING: /\b(that never happened|you're imagining|you're crazy|you're too sensitive|overreacting)\b/gi,
    PASSIVE_AGGRESSIVE: /\b(fine|whatever|I guess|if that's what you want|must be nice)\b/gi
  },
  
  // Sanitization templates
  SANITIZED_MESSAGES: {
    anger: "🧘 {sender} seems frustrated right now. They might need a moment to calm down.",
    fear: "💛 {sender} is feeling worried. Everyone needs support sometimes.",
    manipulation: "🔒 {sender} sent a message that needs review first.",
    gaslighting: "🛡️ Your feelings are valid. {sender} may see things differently.",
    shouting: "🔇 {sender} is using a loud voice. Let's give them space to cool down.",
    threat: "⚠️ {sender} needs to take a break. You're safe.",
    shame: "💚 You are enough exactly as you are. {sender} is struggling right now.",
    guilt_trip: "🌱 You're not responsible for others' feelings. {sender} is having a hard time.",
    passive_aggressive: "🤔 {sender}'s message seems unclear. Adults sometimes struggle to communicate.",
    emotional_flooding: "🌊 {sender} has a lot of big feelings right now. Let's wait for calm."
  },
  
  // Cool-down periods (ms)
  COOLDOWN: {
    AFTER_TOXIC: 30 * 60 * 1000,     // 30 min after toxic event
    AFTER_ELEVATED: 10 * 60 * 1000,  // 10 min after elevated
    REPEATED_OFFENSE: 60 * 60 * 1000 // 1 hour for repeat offenders
  }
};

// ============================================================================
// AUDIO ENTROPY ANALYZER
// ============================================================================

/**
 * Analyzes audio characteristics for emotional entropy
 */
class AudioEntropyAnalyzer {
  constructor() {
    this.sampleRate = 16000;
    this.frameSize = 512;
    this.energyHistory = [];
    this.maxHistoryLength = 100;
  }
  
  /**
   * Analyze audio buffer for entropy indicators
   */
  analyzeBuffer(audioBuffer) {
    // Calculate RMS energy
    const energy = this._calculateRMS(audioBuffer);
    
    // Track energy history for variance
    this.energyHistory.push(energy);
    if (this.energyHistory.length > this.maxHistoryLength) {
      this.energyHistory.shift();
    }
    
    // Calculate audio features
    const features = {
      energy,
      energyVariance: this._calculateVariance(this.energyHistory),
      zeroCrossings: this._calculateZeroCrossings(audioBuffer),
      spectralCentroid: this._estimateSpectralCentroid(audioBuffer)
    };
    
    // Estimate entropy from features
    return this._estimateEntropy(features);
  }
  
  /**
   * Calculate RMS energy
   */
  _calculateRMS(buffer) {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    return Math.sqrt(sum / buffer.length);
  }
  
  /**
   * Calculate variance
   */
  _calculateVariance(values) {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  }
  
  /**
   * Calculate zero crossing rate (indicator of noise/shouting)
   */
  _calculateZeroCrossings(buffer) {
    let crossings = 0;
    for (let i = 1; i < buffer.length; i++) {
      if ((buffer[i] >= 0) !== (buffer[i - 1] >= 0)) {
        crossings++;
      }
    }
    return crossings / buffer.length;
  }
  
  /**
   * Estimate spectral centroid (brightness indicator)
   */
  _estimateSpectralCentroid(buffer) {
    // Simple approximation using zero crossings
    const zcr = this._calculateZeroCrossings(buffer);
    return zcr * this.sampleRate / 2;
  }
  
  /**
   * Estimate emotional entropy from audio features
   */
  _estimateEntropy(features) {
    // High energy + high variance + high ZCR = high entropy (shouting)
    const energyScore = Math.min(1, features.energy * 5);
    const varianceScore = Math.min(1, Math.sqrt(features.energyVariance) * 10);
    const zcrScore = Math.min(1, features.zeroCrossings * 2);
    
    // Weighted combination
    const entropy = (energyScore * 0.4 + varianceScore * 0.35 + zcrScore * 0.25);
    
    return {
      entropy: Math.min(1, entropy),
      features,
      isLoud: features.energy > 0.3,
      isErratic: features.energyVariance > 0.05,
      isShouting: energyScore > 0.6 && zcrScore > 0.4
    };
  }
  
  /**
   * Reset analyzer state
   */
  reset() {
    this.energyHistory = [];
  }
}

// ============================================================================
// TEXT ENTROPY ANALYZER
// ============================================================================

/**
 * Analyzes text for emotional entropy and toxicity patterns
 */
class TextEntropyAnalyzer {
  constructor() {
    this.patterns = ENTROPY_CONFIG.PATTERNS;
    this.weights = ENTROPY_CONFIG.SEVERITY_WEIGHTS;
  }
  
  /**
   * Analyze text for toxicity patterns
   */
  analyze(text) {
    const results = {
      text,
      length: text.length,
      categories: [],
      matches: {},
      entropy: 0,
      primaryCategory: null
    };
    
    // Check each pattern
    for (const [category, pattern] of Object.entries(this.patterns)) {
      const matches = text.match(pattern) || [];
      if (matches.length > 0) {
        const categoryKey = category.toLowerCase();
        results.matches[categoryKey] = matches;
        results.categories.push(categoryKey);
      }
    }
    
    // Calculate entropy score
    results.entropy = this._calculateTextEntropy(results);
    
    // Find primary (most severe) category
    if (results.categories.length > 0) {
      results.primaryCategory = this._getPrimaryCategory(results.categories);
    }
    
    return results;
  }
  
  /**
   * Calculate text entropy score
   */
  _calculateTextEntropy(results) {
    if (results.categories.length === 0) return 0;
    
    let totalScore = 0;
    let matchCount = 0;
    
    for (const [category, matches] of Object.entries(results.matches)) {
      const weight = this.weights[category] || 1.0;
      totalScore += matches.length * weight;
      matchCount += matches.length;
    }
    
    // Normalize by text length (longer text = more opportunity for matches)
    const lengthFactor = Math.min(1, results.length / 100);
    const densityScore = matchCount / Math.max(1, results.length / 50);
    
    // Combine factors
    const baseEntropy = Math.min(1, (totalScore / 10) * (1 + densityScore));
    
    return baseEntropy;
  }
  
  /**
   * Get primary (most severe) category
   */
  _getPrimaryCategory(categories) {
    let maxWeight = 0;
    let primary = categories[0];
    
    for (const cat of categories) {
      const weight = this.weights[cat] || 1.0;
      if (weight > maxWeight) {
        maxWeight = weight;
        primary = cat;
      }
    }
    
    return primary;
  }
}

// ============================================================================
// ENTROPY SHIELD CLASS
// ============================================================================

/**
 * Main Entropy Shield - Cognitive Protection System
 */
class EntropyShield {
  constructor() {
    this.audioAnalyzer = new AudioEntropyAnalyzer();
    this.textAnalyzer = new TextEntropyAnalyzer();
    this.config = ENTROPY_CONFIG;
    
    // State
    this.shieldActive = true;
    this.sensitivityLevel = 1.0; // 0.5 = lenient, 1.0 = normal, 1.5 = strict
    this.blockedLog = [];        // Inverse Transparency log
    this.offenderHistory = new Map(); // guardianId -> offense count
    this.cooldowns = new Map();  // guardianId -> cooldown end time
    
    // Listeners
    this.listeners = new Map();
  }
  
  /**
   * Process incoming message from guardian to child
   */
  processMessage(guardianId, childId, message, type = 'text') {
    if (!this.shieldActive) {
      return { allowed: true, message, entropy: 0 };
    }
    
    // Check cooldown
    if (this._isOnCooldown(guardianId)) {
      return this._createBlockedResponse(guardianId, childId, message, 'cooldown', 1.0);
    }
    
    // Analyze based on type
    let analysis;
    if (type === 'audio') {
      analysis = this.audioAnalyzer.analyzeBuffer(message);
    } else {
      analysis = this.textAnalyzer.analyze(message);
    }
    
    // Apply sensitivity
    const adjustedEntropy = analysis.entropy * this.sensitivityLevel;
    
    // Determine action
    const { SAFE, CAUTION, ELEVATED, TOXIC, CRITICAL } = this.config.THRESHOLDS;
    
    if (adjustedEntropy < SAFE) {
      // Safe - pass through
      return { 
        allowed: true, 
        message, 
        entropy: adjustedEntropy,
        zone: 'green'
      };
    } else if (adjustedEntropy < CAUTION) {
      // Caution - pass with flag
      this._emit('caution', { guardianId, childId, entropy: adjustedEntropy });
      return { 
        allowed: true, 
        message, 
        entropy: adjustedEntropy,
        zone: 'yellow',
        flag: 'monitored'
      };
    } else if (adjustedEntropy < ELEVATED) {
      // Elevated - add context
      const sanitized = this._sanitizeMessage(analysis, guardianId);
      return {
        allowed: true,
        message: sanitized,
        originalMessage: message,
        entropy: adjustedEntropy,
        zone: 'orange',
        modified: true
      };
    } else if (adjustedEntropy < TOXIC) {
      // Toxic - block and sanitize
      return this._createBlockedResponse(guardianId, childId, message, analysis.primaryCategory, adjustedEntropy);
    } else {
      // Critical - block, log, trigger intervention
      return this._createBlockedResponse(guardianId, childId, message, analysis.primaryCategory, adjustedEntropy, true);
    }
  }
  
  /**
   * Process audio stream in real-time
   */
  processAudioStream(guardianId, childId, audioChunk) {
    const analysis = this.audioAnalyzer.analyzeBuffer(audioChunk);
    const adjustedEntropy = analysis.entropy * this.sensitivityLevel;
    
    if (analysis.isShouting) {
      this._emit('shouting_detected', { guardianId, childId, analysis });
      
      // Auto-mute if shouting persists
      if (adjustedEntropy > this.config.THRESHOLDS.ELEVATED) {
        return {
          action: 'mute',
          reason: 'shouting',
          entropy: adjustedEntropy,
          sanitizedAudio: null // Could provide calming audio instead
        };
      }
    }
    
    return {
      action: 'pass',
      entropy: adjustedEntropy,
      analysis
    };
  }
  
  /**
   * Create blocked response with sanitized message
   */
  _createBlockedResponse(guardianId, childId, originalMessage, category, entropy, isCritical = false) {
    // Log for Inverse Transparency (child can see this)
    const logEntry = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      guardianId,
      childId,
      category,
      entropy,
      isCritical,
      // Hash of original for verification, NOT the content itself
      contentHash: this._hashContent(originalMessage)
    };
    
    this.blockedLog.push(logEntry);
    
    // Update offender history
    const offenseCount = (this.offenderHistory.get(guardianId) || 0) + 1;
    this.offenderHistory.set(guardianId, offenseCount);
    
    // Set cooldown
    const cooldownDuration = isCritical 
      ? this.config.COOLDOWN.AFTER_TOXIC 
      : this.config.COOLDOWN.AFTER_ELEVATED;
    
    // Repeat offenders get longer cooldowns
    const multiplier = Math.min(3, 1 + (offenseCount / 5));
    this.cooldowns.set(guardianId, Date.now() + (cooldownDuration * multiplier));
    
    // Generate sanitized message
    const template = this.config.SANITIZED_MESSAGES[category] || 
                     this.config.SANITIZED_MESSAGES.emotional_flooding;
    const sanitizedMessage = template.replace('{sender}', 'Parent');
    
    // Emit events
    this._emit('message_blocked', logEntry);
    
    if (isCritical) {
      this._emit('critical_event', {
        ...logEntry,
        requiresIntervention: true
      });
    }
    
    return {
      allowed: false,
      message: sanitizedMessage,
      originalBlocked: true,
      category,
      entropy,
      zone: isCritical ? 'critical' : 'red',
      cooldownUntil: this.cooldowns.get(guardianId),
      logId: logEntry.id
    };
  }
  
  /**
   * Sanitize message by adding context
   */
  _sanitizeMessage(analysis, guardianId) {
    const category = analysis.primaryCategory || 'emotional_flooding';
    const template = this.config.SANITIZED_MESSAGES[category];
    
    // Prepend context, keep original but flagged
    return `${template.replace('{sender}', 'Parent')}\n\n[Original message available with guardian approval]`;
  }
  
  /**
   * Check if guardian is on cooldown
   */
  _isOnCooldown(guardianId) {
    const cooldownEnd = this.cooldowns.get(guardianId);
    if (!cooldownEnd) return false;
    
    if (Date.now() >= cooldownEnd) {
      this.cooldowns.delete(guardianId);
      return false;
    }
    
    return true;
  }
  
  /**
   * Hash content for logging (privacy preserving)
   */
  _hashContent(content) {
    const str = typeof content === 'string' ? content : JSON.stringify(content);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `0x${Math.abs(hash).toString(16).padStart(16, '0')}`;
  }
  
  // =========================================================================
  // INVERSE TRANSPARENCY API
  // =========================================================================
  
  /**
   * Get blocked log for child (Inverse Transparency)
   * Child has RIGHT to see who tried to send them toxic content
   */
  getBlockedLogForChild(childId) {
    return this.blockedLog
      .filter(entry => entry.childId === childId)
      .map(entry => ({
        id: entry.id,
        timestamp: entry.timestamp,
        guardianId: entry.guardianId,
        category: entry.category,
        severity: entry.isCritical ? 'critical' : 'blocked',
        // NO content - just metadata
      }));
  }
  
  /**
   * Get offense count for guardian (for Slashing calculations)
   */
  getOffenseCount(guardianId) {
    return this.offenderHistory.get(guardianId) || 0;
  }
  
  /**
   * Get all blocked events (for PoC slashing integration)
   */
  getSlashingEvidence(guardianId, childId) {
    return this.blockedLog
      .filter(entry => entry.guardianId === guardianId && entry.childId === childId)
      .map(entry => ({
        timestamp: entry.timestamp,
        entropy: entry.entropy,
        category: entry.category,
        isCritical: entry.isCritical,
        contentHash: entry.contentHash
      }));
  }
  
  // =========================================================================
  // CONFIGURATION API
  // =========================================================================
  
  /**
   * Set sensitivity level
   * Higher = more strict filtering
   */
  setSensitivity(level) {
    this.sensitivityLevel = Math.max(0.5, Math.min(2.0, level));
    return this.sensitivityLevel;
  }
  
  /**
   * Enable/disable shield
   */
  setActive(active) {
    this.shieldActive = active;
    this._emit('shield_status', { active });
    return this.shieldActive;
  }
  
  /**
   * Clear cooldown (admin/therapist function)
   */
  clearCooldown(guardianId) {
    this.cooldowns.delete(guardianId);
    return true;
  }
  
  /**
   * Reset offense history (used after reconciliation)
   */
  resetOffenseHistory(guardianId) {
    this.offenderHistory.delete(guardianId);
    return true;
  }
  
  // =========================================================================
  // EVENT SYSTEM
  // =========================================================================
  
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
        console.error(`[EntropyShield] Event error:`, e);
      }
    });
  }
  
  // =========================================================================
  // STATS & STATUS
  // =========================================================================
  
  getStats() {
    return {
      shieldActive: this.shieldActive,
      sensitivityLevel: this.sensitivityLevel,
      totalBlocked: this.blockedLog.length,
      criticalEvents: this.blockedLog.filter(e => e.isCritical).length,
      activesCooldowns: this.cooldowns.size,
      offendersTracked: this.offenderHistory.size
    };
  }
  
  toJSON() {
    return {
      stats: this.getStats(),
      config: {
        thresholds: this.config.THRESHOLDS,
        sensitivityLevel: this.sensitivityLevel
      }
    };
  }
}

// ============================================================================
// CALMING RESPONSE GENERATOR
// ============================================================================

/**
 * Generates calming responses for children after blocked content
 */
class CalmingResponseGenerator {
  constructor() {
    this.responses = {
      general: [
        "💚 You're doing great. Adults sometimes have big feelings too.",
        "🌱 Remember: you're not responsible for grown-up emotions.",
        "🧘 Would you like to try some calm breathing together?",
        "🎨 This might be a good time for a creative break."
      ],
      afterAnger: [
        "🌊 When people feel angry, it's not about you.",
        "🔒 You're safe. Sometimes adults need time to calm down.",
        "💪 You handled that well by staying calm."
      ],
      afterShame: [
        "⭐ You are valuable exactly as you are.",
        "💜 No one gets to decide your worth except you.",
        "🌟 Mistakes help us grow. You're always learning."
      ],
      afterGuilt: [
        "🦋 Other people's happiness isn't your job.",
        "💛 You're allowed to have your own feelings.",
        "🌈 It's okay to set boundaries."
      ]
    };
  }
  
  /**
   * Get calming response based on blocked content category
   */
  getResponse(category) {
    let pool = this.responses.general;
    
    if (category === 'anger' || category === 'shouting' || category === 'threat') {
      pool = [...this.responses.afterAnger, ...this.responses.general];
    } else if (category === 'shame') {
      pool = [...this.responses.afterShame, ...this.responses.general];
    } else if (category === 'guilt_trip' || category === 'manipulation') {
      pool = [...this.responses.afterGuilt, ...this.responses.general];
    }
    
    // Random selection
    return pool[Math.floor(Math.random() * pool.length)];
  }
  
  /**
   * Get breathing exercise prompt
   */
  getBreathingExercise() {
    return {
      type: 'breathing',
      name: '4-7-8 Calm Breath',
      steps: [
        { action: 'inhale', duration: 4, prompt: 'Breathe in slowly...' },
        { action: 'hold', duration: 7, prompt: 'Hold gently...' },
        { action: 'exhale', duration: 8, prompt: 'Let it all out...' }
      ],
      cycles: 3
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  ENTROPY_CONFIG,
  AudioEntropyAnalyzer,
  TextEntropyAnalyzer,
  EntropyShield,
  CalmingResponseGenerator
};