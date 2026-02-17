/**
 * SPOON BUDGET MANAGER - Comprehensive Energy Currency System
 * L.O.V.E. Economy v4.0.0
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱🥄
 * 
 * Based on Christine Miserandino's "Spoon Theory" for chronic illness
 * Extended with:
 * - Predictive modeling for spoon depletion
 * - Activity cost estimation with learning
 * - Multi-factor biometric integration
 * - Emergency shield activation
 * - Family spoon pooling
 * - PoC integration for care token earning
 */

const EventEmitter = require('events');

// ============================================================================
// CONFIGURATION
// ============================================================================

const SPOON_CONFIG = {
  // Default daily budget
  DEFAULT_BUDGET: 12,
  MIN_BUDGET: 4,
  MAX_BUDGET: 24,
  
  // Shield activation thresholds
  SHIELD_ACTIVATE_THRESHOLD: 3,    // Activate shield below this
  SHIELD_DEACTIVATE_THRESHOLD: 6,  // Deactivate above this
  CRITICAL_THRESHOLD: 1,           // Emergency level
  
  // Activity costs (baseline)
  ACTIVITY_COSTS: {
    // Basic activities
    wake_up: 0.5,
    shower: 1.5,
    get_dressed: 0.5,
    prepare_meal: 1,
    eat_meal: 0.5,
    clean_dishes: 0.5,
    
    // Work/School
    work_hour: 1,
    meeting: 1.5,
    presentation: 2.5,
    school_hour: 1,
    homework: 1,
    exam: 3,
    
    // Social
    conversation_short: 0.5,
    conversation_long: 1.5,
    social_event_small: 2,
    social_event_large: 4,
    phone_call: 0.5,
    video_call: 1,
    
    // Physical
    walk_short: 0.5,
    walk_long: 1.5,
    exercise_light: 1,
    exercise_moderate: 2,
    exercise_intense: 3,
    
    // Errands
    shopping: 2,
    appointment_medical: 3,
    appointment_other: 1.5,
    driving: 0.5,
    
    // Mental/Emotional
    decision_small: 0.25,
    decision_major: 1.5,
    conflict: 2,
    emotional_conversation: 2,
    
    // Recovery
    rest_short: -0.5,
    rest_long: -1,
    nap: -1.5,
    sleep_night: -8,       // Full recovery
    meditation: -0.5,
    sensory_break: -0.5
  },
  
  // Modifiers based on conditions
  MODIFIERS: {
    // Time of day
    morning_person: { morning: 0.8, evening: 1.2 },
    night_owl: { morning: 1.3, evening: 0.8 },
    
    // Health status
    well_rested: 0.8,
    tired: 1.3,
    sick: 1.8,
    pain_mild: 1.2,
    pain_moderate: 1.5,
    pain_severe: 2.0,
    
    // Environmental
    comfortable: 0.9,
    too_hot: 1.3,
    too_cold: 1.2,
    noisy: 1.4,
    crowded: 1.5,
    
    // Mental state
    calm: 0.9,
    anxious: 1.4,
    depressed: 1.5,
    happy: 0.85,
    
    // Support
    alone: 1.0,
    with_support: 0.7,
    with_children: 1.3
  },
  
  // Biometric thresholds for automatic adjustments
  BIOMETRIC_TRIGGERS: {
    hr_elevated: { threshold: 100, modifier: 1.2 },
    hr_very_elevated: { threshold: 120, modifier: 1.5 },
    stress_high: { threshold: 75, modifier: 1.4 },
    hrv_low: { threshold: 30, modifier: 1.3 },
    spo2_low: { threshold: 94, modifier: 1.5 },
    sleep_poor: { threshold: 50, modifier: 1.3 }
  }
};

// ============================================================================
// SPOON TRANSACTION
// ============================================================================

/**
 * Record of a spoon expenditure or recovery
 */
class SpoonTransaction {
  constructor(data = {}) {
    this.id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = data.timestamp || Date.now();
    this.type = data.type || 'unknown';  // Activity type
    this.cost = data.cost || 0;          // Base cost (negative = recovery)
    this.modifiedCost = data.modifiedCost || data.cost || 0;  // After modifiers
    this.modifiers = data.modifiers || [];  // Applied modifiers
    this.balanceBefore = data.balanceBefore || 0;
    this.balanceAfter = data.balanceAfter || 0;
    this.source = data.source || 'manual';  // manual, biometric, calendar, ai
    this.notes = data.notes || '';
    this.metadata = data.metadata || {};
  }
  
  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      type: this.type,
      cost: this.cost,
      modifiedCost: this.modifiedCost,
      modifiers: this.modifiers,
      balanceBefore: this.balanceBefore,
      balanceAfter: this.balanceAfter,
      source: this.source
    };
  }
}

// ============================================================================
// SPOON FORECAST
// ============================================================================

/**
 * Prediction model for spoon budget
 */
class SpoonForecast {
  constructor() {
    this.history = [];           // Historical data for learning
    this.activityLearning = {};  // Personalized cost adjustments
    this.patterns = {};          // Time-of-day patterns
  }
  
  /**
   * Learn from a transaction
   */
  learn(transaction) {
    this.history.push({
      timestamp: transaction.timestamp,
      type: transaction.type,
      actualCost: transaction.modifiedCost,
      hour: new Date(transaction.timestamp).getHours(),
      dayOfWeek: new Date(transaction.timestamp).getDay()
    });
    
    // Update activity learning
    if (!this.activityLearning[transaction.type]) {
      this.activityLearning[transaction.type] = {
        count: 0,
        totalCost: 0,
        avgCost: 0,
        variance: 0
      };
    }
    
    const learning = this.activityLearning[transaction.type];
    learning.count++;
    learning.totalCost += transaction.modifiedCost;
    learning.avgCost = learning.totalCost / learning.count;
    
    // Keep history bounded
    if (this.history.length > 1000) {
      this.history = this.history.slice(-500);
    }
  }
  
  /**
   * Predict cost for an activity
   */
  predictCost(activityType, hour = new Date().getHours()) {
    const baseCost = SPOON_CONFIG.ACTIVITY_COSTS[activityType] || 1;
    
    // Use learned cost if available
    const learned = this.activityLearning[activityType];
    if (learned && learned.count >= 3) {
      // Weight learned vs base (more data = more weight to learned)
      const learnedWeight = Math.min(0.8, learned.count / 10);
      return (learned.avgCost * learnedWeight) + (baseCost * (1 - learnedWeight));
    }
    
    return baseCost;
  }
  
  /**
   * Forecast remaining spoons at end of day
   */
  forecastEndOfDay(currentSpoons, plannedActivities) {
    let projected = currentSpoons;
    const breakdown = [];
    
    for (const activity of plannedActivities) {
      const cost = this.predictCost(activity.type, activity.hour);
      projected -= cost;
      breakdown.push({
        activity: activity.type,
        time: activity.hour,
        predictedCost: cost,
        projectedBalance: projected
      });
    }
    
    return {
      currentSpoons,
      projectedEndOfDay: projected,
      willBeInDeficit: projected < 0,
      breakdown,
      recommendation: this._getRecommendation(projected)
    };
  }
  
  _getRecommendation(projected) {
    if (projected >= 4) {
      return { level: 'good', message: 'Sustainable plan' };
    } else if (projected >= 1) {
      return { level: 'caution', message: 'Consider reducing activities' };
    } else if (projected >= 0) {
      return { level: 'warning', message: 'May need to cancel some activities' };
    } else {
      return { level: 'danger', message: 'Overcommitted! Remove activities to prevent crash' };
    }
  }
  
  /**
   * Get personalized activity costs
   */
  getPersonalizedCosts() {
    const costs = {};
    
    for (const [activity, baseCost] of Object.entries(SPOON_CONFIG.ACTIVITY_COSTS)) {
      costs[activity] = {
        base: baseCost,
        personalized: this.predictCost(activity),
        dataPoints: this.activityLearning[activity]?.count || 0
      };
    }
    
    return costs;
  }
}

// ============================================================================
// SPOON POOL (Family Sharing)
// ============================================================================

/**
 * Family spoon pool for sharing energy tokens
 */
class SpoonPool {
  constructor() {
    this.members = new Map();    // memberId -> { spoons, maxSpoons, name }
    this.sharedPool = 0;         // Community pool
    this.transferHistory = [];
  }
  
  /**
   * Add member to pool
   */
  addMember(memberId, name, maxSpoons = SPOON_CONFIG.DEFAULT_BUDGET) {
    this.members.set(memberId, {
      name,
      spoons: maxSpoons,
      maxSpoons,
      joined: Date.now()
    });
    return this.getMember(memberId);
  }
  
  /**
   * Get member status
   */
  getMember(memberId) {
    return this.members.get(memberId) || null;
  }
  
  /**
   * Transfer spoons between members
   */
  transfer(fromId, toId, amount) {
    const from = this.members.get(fromId);
    const to = this.members.get(toId);
    
    if (!from || !to) {
      return { success: false, error: 'Member not found' };
    }
    
    if (from.spoons < amount) {
      return { success: false, error: 'Insufficient spoons' };
    }
    
    // Cap at recipient's max
    const actualAmount = Math.min(amount, to.maxSpoons - to.spoons);
    
    from.spoons -= actualAmount;
    to.spoons += actualAmount;
    
    const transfer = {
      id: `transfer_${Date.now()}`,
      from: fromId,
      to: toId,
      amount: actualAmount,
      timestamp: Date.now()
    };
    
    this.transferHistory.push(transfer);
    
    return {
      success: true,
      transfer,
      fromBalance: from.spoons,
      toBalance: to.spoons
    };
  }
  
  /**
   * Contribute to shared pool
   */
  contribute(memberId, amount) {
    const member = this.members.get(memberId);
    if (!member || member.spoons < amount) {
      return { success: false, error: 'Insufficient spoons' };
    }
    
    member.spoons -= amount;
    this.sharedPool += amount;
    
    return {
      success: true,
      contributed: amount,
      sharedPool: this.sharedPool,
      memberBalance: member.spoons
    };
  }
  
  /**
   * Withdraw from shared pool
   */
  withdraw(memberId, amount) {
    const member = this.members.get(memberId);
    if (!member) {
      return { success: false, error: 'Member not found' };
    }
    
    const actualAmount = Math.min(amount, this.sharedPool, member.maxSpoons - member.spoons);
    
    member.spoons += actualAmount;
    this.sharedPool -= actualAmount;
    
    return {
      success: true,
      withdrawn: actualAmount,
      sharedPool: this.sharedPool,
      memberBalance: member.spoons
    };
  }
  
  /**
   * Get pool statistics
   */
  getStats() {
    const membersArray = Array.from(this.members.entries()).map(([id, data]) => ({
      id,
      ...data
    }));
    
    const totalSpoons = membersArray.reduce((sum, m) => sum + m.spoons, 0);
    const totalCapacity = membersArray.reduce((sum, m) => sum + m.maxSpoons, 0);
    
    return {
      memberCount: this.members.size,
      members: membersArray,
      sharedPool: this.sharedPool,
      totalSpoons,
      totalCapacity,
      utilizationPercent: (totalSpoons / totalCapacity) * 100,
      recentTransfers: this.transferHistory.slice(-10)
    };
  }
}

// ============================================================================
// SPOON MANAGER
// ============================================================================

/**
 * Main Spoon Budget Manager
 */
class SpoonManager extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = { ...SPOON_CONFIG, ...config };
    this.budget = config.budget || SPOON_CONFIG.DEFAULT_BUDGET;
    this.currentSpoons = this.budget;
    this.shieldActive = false;
    this.shieldReason = null;
    
    // State tracking
    this.trend = 'stable';        // rising, falling, stable
    this.lastUpdate = Date.now();
    this.activeModifiers = [];    // Currently active modifiers
    
    // Sub-systems
    this.forecast = new SpoonForecast();
    this.pool = new SpoonPool();
    
    // Transaction log
    this.transactions = [];
    this.todaysTransactions = [];
    
    // Biometric state
    this.biometricState = {
      hr: null,
      hrv: null,
      stress: null,
      spo2: null,
      sleepScore: null,
      lastUpdate: null
    };
    
    // Stats
    this.stats = {
      totalSpent: 0,
      totalRecovered: 0,
      shieldActivations: 0,
      crashEvents: 0,        // Times hit 0
      daysTracked: 1
    };
    
    // Daily reset
    this._scheduleDailyReset();
  }
  
  // ============================================
  // SPOON OPERATIONS
  // ============================================
  
  /**
   * Spend spoons on an activity
   */
  spend(activityType, options = {}) {
    const baseCost = this.config.ACTIVITY_COSTS[activityType] || options.cost || 1;
    let modifiedCost = baseCost;
    const appliedModifiers = [];
    
    // Apply active modifiers
    for (const modifier of this.activeModifiers) {
      const modValue = this.config.MODIFIERS[modifier];
      if (typeof modValue === 'number') {
        modifiedCost *= modValue;
        appliedModifiers.push({ name: modifier, value: modValue });
      }
    }
    
    // Apply biometric modifiers
    const bioModifiers = this._getBiometricModifiers();
    for (const mod of bioModifiers) {
      modifiedCost *= mod.value;
      appliedModifiers.push(mod);
    }
    
    // Apply custom modifier
    if (options.modifier) {
      modifiedCost *= options.modifier;
      appliedModifiers.push({ name: 'custom', value: options.modifier });
    }
    
    // Round to 2 decimal places
    modifiedCost = Math.round(modifiedCost * 100) / 100;
    
    // Create transaction
    const transaction = new SpoonTransaction({
      type: activityType,
      cost: baseCost,
      modifiedCost,
      modifiers: appliedModifiers,
      balanceBefore: this.currentSpoons,
      balanceAfter: this.currentSpoons - modifiedCost,
      source: options.source || 'manual',
      notes: options.notes
    });
    
    // Apply cost
    this.currentSpoons = Math.max(0, this.currentSpoons - modifiedCost);
    transaction.balanceAfter = this.currentSpoons;
    
    // Record transaction
    this.transactions.push(transaction);
    this.todaysTransactions.push(transaction);
    this.stats.totalSpent += modifiedCost;
    this.forecast.learn(transaction);
    
    // Update trend
    this._updateTrend();
    
    // Emit events
    this.emit('SPOON_SPENT', {
      transaction,
      currentSpoons: this.currentSpoons,
      budget: this.budget
    });
    
    this.emit('SPOON_CHANGE', {
      spoons: this.currentSpoons,
      change: -modifiedCost,
      type: 'spent'
    });
    
    // Check shield thresholds
    this._checkShieldThreshold();
    
    // Check crash
    if (this.currentSpoons === 0) {
      this.stats.crashEvents++;
      this.emit('SPOON_CRASH', { transaction });
    }
    
    return transaction;
  }
  
  /**
   * Recover spoons (rest, sleep, etc.)
   */
  recover(recoveryType, options = {}) {
    const baseCost = this.config.ACTIVITY_COSTS[recoveryType] || options.amount || -1;
    // Costs are stored as negative for recovery
    const recovery = Math.abs(baseCost);
    
    const transaction = new SpoonTransaction({
      type: recoveryType,
      cost: baseCost,
      modifiedCost: -recovery,
      balanceBefore: this.currentSpoons,
      balanceAfter: Math.min(this.budget, this.currentSpoons + recovery),
      source: options.source || 'manual',
      notes: options.notes
    });
    
    // Apply recovery (cap at budget)
    this.currentSpoons = Math.min(this.budget, this.currentSpoons + recovery);
    transaction.balanceAfter = this.currentSpoons;
    
    // Record
    this.transactions.push(transaction);
    this.todaysTransactions.push(transaction);
    this.stats.totalRecovered += recovery;
    
    // Update trend
    this._updateTrend();
    
    // Emit events
    this.emit('SPOON_RECOVERED', {
      transaction,
      currentSpoons: this.currentSpoons,
      budget: this.budget
    });
    
    this.emit('SPOON_CHANGE', {
      spoons: this.currentSpoons,
      change: recovery,
      type: 'recovered'
    });
    
    // Check shield threshold (might deactivate)
    this._checkShieldThreshold();
    
    return transaction;
  }
  
  /**
   * Adjust spoons directly
   */
  adjustSpoons(amount) {
    const before = this.currentSpoons;
    this.currentSpoons = Math.max(0, Math.min(this.budget, this.currentSpoons + amount));
    
    this.emit('SPOON_CHANGE', {
      spoons: this.currentSpoons,
      change: this.currentSpoons - before,
      type: 'adjustment'
    });
    
    this._checkShieldThreshold();
    return this.currentSpoons;
  }
  
  /**
   * Set spoons to specific value
   */
  setSpoons(value) {
    const before = this.currentSpoons;
    this.currentSpoons = Math.max(0, Math.min(this.budget, value));
    
    this.emit('SPOON_CHANGE', {
      spoons: this.currentSpoons,
      change: this.currentSpoons - before,
      type: 'set'
    });
    
    this._checkShieldThreshold();
    return this.currentSpoons;
  }
  
  // ============================================
  // BIOMETRIC INTEGRATION
  // ============================================
  
  /**
   * Process biometric data to adjust spoon costs
   */
  processBiometric(record) {
    // Update biometric state
    switch (record.type) {
      case 'heart_rate':
        this.biometricState.hr = record.value;
        break;
      case 'hrv':
        this.biometricState.hrv = record.value;
        break;
      case 'stress':
        this.biometricState.stress = record.value;
        break;
      case 'spo2':
        this.biometricState.spo2 = record.value;
        break;
      case 'sleep_score':
        this.biometricState.sleepScore = record.value;
        break;
    }
    
    this.biometricState.lastUpdate = Date.now();
    
    // Auto-spend for high exertion
    if (record.type === 'heart_rate' && record.value > 130) {
      // High HR auto-costs small amount per sample
      this.spend('biometric_exertion', {
        cost: 0.05,
        source: 'biometric',
        notes: `HR: ${record.value}`
      });
    }
    
    // Check for shield triggers
    const triggers = this.config.BIOMETRIC_TRIGGERS;
    
    if (record.type === 'stress' && record.value >= triggers.stress_high.threshold) {
      if (!this.shieldActive) {
        this.activateShield('biometric_stress');
      }
    }
    
    if (record.type === 'spo2' && record.value < triggers.spo2_low.threshold) {
      if (!this.shieldActive) {
        this.activateShield('biometric_spo2');
      }
    }
    
    return this.biometricState;
  }
  
  /**
   * Get biometric modifiers for current state
   */
  _getBiometricModifiers() {
    const modifiers = [];
    const triggers = this.config.BIOMETRIC_TRIGGERS;
    const bio = this.biometricState;
    
    // Check each biometric trigger
    if (bio.hr && bio.hr >= triggers.hr_very_elevated.threshold) {
      modifiers.push({ name: 'hr_very_elevated', value: triggers.hr_very_elevated.modifier });
    } else if (bio.hr && bio.hr >= triggers.hr_elevated.threshold) {
      modifiers.push({ name: 'hr_elevated', value: triggers.hr_elevated.modifier });
    }
    
    if (bio.stress && bio.stress >= triggers.stress_high.threshold) {
      modifiers.push({ name: 'stress_high', value: triggers.stress_high.modifier });
    }
    
    if (bio.hrv && bio.hrv <= triggers.hrv_low.threshold) {
      modifiers.push({ name: 'hrv_low', value: triggers.hrv_low.modifier });
    }
    
    if (bio.spo2 && bio.spo2 < triggers.spo2_low.threshold) {
      modifiers.push({ name: 'spo2_low', value: triggers.spo2_low.modifier });
    }
    
    if (bio.sleepScore && bio.sleepScore < triggers.sleep_poor.threshold) {
      modifiers.push({ name: 'sleep_poor', value: triggers.sleep_poor.modifier });
    }
    
    return modifiers;
  }
  
  // ============================================
  // SHIELD MANAGEMENT
  // ============================================
  
  /**
   * Activate cognitive shield
   */
  activateShield(reason = 'manual') {
    if (this.shieldActive) return;
    
    this.shieldActive = true;
    this.shieldReason = reason;
    this.stats.shieldActivations++;
    
    const data = {
      reason,
      currentSpoons: this.currentSpoons,
      budget: this.budget,
      timestamp: Date.now(),
      message: this._getShieldMessage(reason)
    };
    
    this.emit('SHIELD_ACTIVATE', data);
    return data;
  }
  
  /**
   * Deactivate cognitive shield
   */
  deactivateShield(reason = 'manual') {
    if (!this.shieldActive) return;
    
    this.shieldActive = false;
    const previousReason = this.shieldReason;
    this.shieldReason = null;
    
    const data = {
      reason,
      previousReason,
      currentSpoons: this.currentSpoons,
      budget: this.budget,
      timestamp: Date.now(),
      message: 'Shield deactivated'
    };
    
    this.emit('SHIELD_DEACTIVATE', data);
    return data;
  }
  
  /**
   * Check if shield should activate/deactivate
   */
  _checkShieldThreshold() {
    if (!this.shieldActive && this.currentSpoons <= this.config.SHIELD_ACTIVATE_THRESHOLD) {
      this.activateShield('low_spoons');
    } else if (this.shieldActive && this.currentSpoons >= this.config.SHIELD_DEACTIVATE_THRESHOLD) {
      this.deactivateShield('recovered');
    }
  }
  
  _getShieldMessage(reason) {
    const messages = {
      low_spoons: 'Energy reserves critically low. Entering protection mode.',
      biometric_stress: 'High stress detected. Time to pause and breathe.',
      biometric_spo2: 'Blood oxygen low. Please rest.',
      manual: 'Shield activated by user.',
      emergency: 'Emergency shield activated.',
      default: 'Cognitive shield active.'
    };
    return messages[reason] || messages.default;
  }
  
  // ============================================
  // MODIFIERS
  // ============================================
  
  /**
   * Add active modifier
   */
  addModifier(modifier) {
    if (!this.activeModifiers.includes(modifier)) {
      this.activeModifiers.push(modifier);
      this.emit('MODIFIER_ADDED', { modifier });
    }
    return this.activeModifiers;
  }
  
  /**
   * Remove active modifier
   */
  removeModifier(modifier) {
    const idx = this.activeModifiers.indexOf(modifier);
    if (idx >= 0) {
      this.activeModifiers.splice(idx, 1);
      this.emit('MODIFIER_REMOVED', { modifier });
    }
    return this.activeModifiers;
  }
  
  /**
   * Set all modifiers
   */
  setModifiers(modifiers) {
    this.activeModifiers = [...modifiers];
    return this.activeModifiers;
  }
  
  // ============================================
  // FORECASTING
  // ============================================
  
  /**
   * Get forecast for remaining day
   */
  getForecast(plannedActivities = []) {
    return this.forecast.forecastEndOfDay(this.currentSpoons, plannedActivities);
  }
  
  /**
   * Predict cost for activity
   */
  predictCost(activityType) {
    return this.forecast.predictCost(activityType);
  }
  
  /**
   * Get personalized activity costs
   */
  getPersonalizedCosts() {
    return this.forecast.getPersonalizedCosts();
  }
  
  // ============================================
  // FAMILY POOL
  // ============================================
  
  /**
   * Add member to family pool
   */
  addFamilyMember(memberId, name, maxSpoons) {
    return this.pool.addMember(memberId, name, maxSpoons);
  }
  
  /**
   * Transfer spoons between family members
   */
  transferSpoons(fromId, toId, amount) {
    return this.pool.transfer(fromId, toId, amount);
  }
  
  /**
   * Get family pool stats
   */
  getFamilyStats() {
    return this.pool.getStats();
  }
  
  // ============================================
  // TREND ANALYSIS
  // ============================================
  
  _updateTrend() {
    if (this.todaysTransactions.length < 2) {
      this.trend = 'stable';
      return;
    }
    
    const recent = this.todaysTransactions.slice(-5);
    const netChange = recent.reduce((sum, tx) => sum + tx.modifiedCost, 0);
    
    if (netChange < -1) {
      this.trend = 'rising';
    } else if (netChange > 1) {
      this.trend = 'falling';
    } else {
      this.trend = 'stable';
    }
  }
  
  // ============================================
  // DAILY RESET
  // ============================================
  
  _scheduleDailyReset() {
    // Calculate time until midnight
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const msUntilMidnight = midnight.getTime() - now.getTime();
    
    setTimeout(() => {
      this._dailyReset();
      // Schedule next reset
      setInterval(() => this._dailyReset(), 24 * 60 * 60 * 1000);
    }, msUntilMidnight);
  }
  
  _dailyReset() {
    const yesterday = {
      date: new Date().toISOString().split('T')[0],
      spentTotal: this.todaysTransactions
        .filter(tx => tx.modifiedCost > 0)
        .reduce((sum, tx) => sum + tx.modifiedCost, 0),
      recoveredTotal: this.todaysTransactions
        .filter(tx => tx.modifiedCost < 0)
        .reduce((sum, tx) => sum + Math.abs(tx.modifiedCost), 0),
      transactions: this.todaysTransactions.length,
      endingSpoons: this.currentSpoons,
      shieldActivations: this.stats.shieldActivations
    };
    
    // Reset for new day
    this.currentSpoons = this.budget;
    this.todaysTransactions = [];
    this.stats.daysTracked++;
    
    this.emit('DAILY_RESET', {
      yesterday,
      newBudget: this.budget,
      newSpoons: this.currentSpoons
    });
  }
  
  // ============================================
  // STATUS & REPORTING
  // ============================================
  
  /**
   * Get comprehensive status
   */
  getStatus() {
    return {
      currentSpoons: this.currentSpoons,
      budget: this.budget,
      percentRemaining: (this.currentSpoons / this.budget) * 100,
      shieldActive: this.shieldActive,
      shieldReason: this.shieldReason,
      trend: this.trend,
      activeModifiers: this.activeModifiers,
      biometricState: this.biometricState,
      todayStats: {
        transactions: this.todaysTransactions.length,
        spent: this.todaysTransactions
          .filter(tx => tx.modifiedCost > 0)
          .reduce((sum, tx) => sum + tx.modifiedCost, 0),
        recovered: this.todaysTransactions
          .filter(tx => tx.modifiedCost < 0)
          .reduce((sum, tx) => sum + Math.abs(tx.modifiedCost), 0)
      },
      lifetimeStats: this.stats,
      familyPool: this.pool.getStats()
    };
  }
  
  /**
   * Get recent transactions
   */
  getRecentTransactions(count = 10) {
    return this.transactions.slice(-count);
  }
  
  /**
   * Get today's transactions
   */
  getTodaysTransactions() {
    return [...this.todaysTransactions];
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  SPOON_CONFIG,
  SpoonTransaction,
  SpoonForecast,
  SpoonPool,
  SpoonManager
};

// For backwards compatibility
module.exports.default = SpoonManager;