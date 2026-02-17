/**
 * IFTTT CONTROLLER - Webhook Automation Integration
 * L.O.V.E. Economy v4.0.0 - WONKY QUANTUM REFACTOR
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱⚡
 * 
 * Full IFTTT Maker Webhooks implementation:
 * - Event triggering with up to 3 values
 * - Shield mode notifications
 * - Spoon level alerts
 * - Care session notifications
 * - Family emergency broadcasts
 * - Automation chaining
 */

const EventEmitter = require('events');

// ============================================================================
// CONFIGURATION
// ============================================================================

const IFTTT_CONFIG = {
  // API Settings
  WEBHOOK_BASE_URL: 'https://maker.ifttt.com/trigger',
  
  // Rate limiting
  MIN_INTERVAL_MS: 1000,       // 1 request/second
  
  // Predefined events
  EVENTS: {
    // Shield events
    SHIELD_ACTIVATED: 'cognitive_shield_activated',
    SHIELD_DEACTIVATED: 'cognitive_shield_deactivated',
    SHIELD_UPDATE: 'cognitive_shield_update',
    
    // Spoon events
    SPOON_LOW: 'spoon_level_low',
    SPOON_CRITICAL: 'spoon_level_critical',
    SPOON_RESTORED: 'spoon_level_restored',
    
    // Care events
    CARE_SESSION_START: 'care_session_started',
    CARE_SESSION_END: 'care_session_ended',
    CARE_TOKEN_MINTED: 'care_token_minted',
    
    // Family events
    FAMILY_ALERT: 'family_alert',
    FAMILY_EMERGENCY: 'family_emergency',
    
    // Biometric events
    STRESS_HIGH: 'stress_level_high',
    HRV_LOW: 'hrv_low_alert',
    
    // Generic
    CUSTOM_EVENT: 'custom_event'
  },
  
  // Spoon thresholds
  SPOON_THRESHOLDS: {
    LOW: 4,
    CRITICAL: 2
  }
};

// ============================================================================
// MAIN IFTTT CONTROLLER CLASS
// ============================================================================

/**
 * IFTTT Controller
 * Webhook-based automation with L.O.V.E. Economy integration
 */
class IFTTTController extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...IFTTT_CONFIG, ...config };
    
    // API key
    this.key = config.key || process.env.IFTTT_KEY;
    this.enabled = !!this.key;
    
    // Rate limiting
    this.lastRequest = 0;
    
    // Event queue for batching
    this.eventQueue = [];
    this.processingQueue = false;
    
    // Stats
    this.stats = {
      eventsSent: 0,
      eventsFailed: 0,
      lastEvent: null,
      lastActivity: null
    };
    
    // Event history (last 100)
    this.eventHistory = [];
    
    if (this.enabled) {
      console.log('[IFTTTController] Initialized');
    }
  }
  
  // ============================================
  // CORE TRIGGER METHOD
  // ============================================
  
  /**
   * Trigger an IFTTT event with up to 3 values
   */
  async trigger(eventName, value1 = '', value2 = '', value3 = '') {
    if (!this.enabled) {
      return { success: false, error: 'IFTTT not configured' };
    }
    
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    if (timeSinceLastRequest < this.config.MIN_INTERVAL_MS) {
      await this._sleep(this.config.MIN_INTERVAL_MS - timeSinceLastRequest);
    }
    this.lastRequest = Date.now();
    
    const url = `${this.config.WEBHOOK_BASE_URL}/${eventName}/with/key/${this.key}`;
    
    const body = {
      value1: String(value1),
      value2: String(value2),
      value3: String(value3)
    };
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      this.stats.eventsSent++;
      this.stats.lastEvent = eventName;
      this.stats.lastActivity = Date.now();
      
      // Record history
      this._recordEvent(eventName, body, true);
      
      this.emit('event_triggered', { eventName, values: body });
      
      console.log(`[IFTTTController] Triggered: ${eventName}`);
      return { success: true };
    } catch (error) {
      this.stats.eventsFailed++;
      this._recordEvent(eventName, body, false, error.message);
      
      console.error(`[IFTTTController] Failed: ${eventName}`, error.message);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Queue an event (for batching)
   */
  queueEvent(eventName, value1 = '', value2 = '', value3 = '') {
    this.eventQueue.push({ eventName, value1, value2, value3 });
    this._processQueue();
  }
  
  async _processQueue() {
    if (this.processingQueue || this.eventQueue.length === 0) return;
    
    this.processingQueue = true;
    
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      await this.trigger(event.eventName, event.value1, event.value2, event.value3);
    }
    
    this.processingQueue = false;
  }
  
  // ============================================
  // SHIELD MODE NOTIFICATIONS
  // ============================================
  
  /**
   * Send shield notification
   */
  async sendShieldNotification(isActive, spoons, reason = '') {
    if (!this.enabled) return;
    
    const eventName = isActive
      ? this.config.EVENTS.SHIELD_ACTIVATED
      : this.config.EVENTS.SHIELD_DEACTIVATED;
    
    return this.trigger(
      eventName,
      isActive ? 'ACTIVATED' : 'DEACTIVATED',
      typeof spoons === 'number' ? spoons.toFixed(2) : String(spoons),
      reason || new Date().toLocaleTimeString()
    );
  }
  
  /**
   * Send shield update (for periodic status)
   */
  async sendShieldUpdate(status, spoons, duration = '') {
    if (!this.enabled) return;
    
    return this.trigger(
      this.config.EVENTS.SHIELD_UPDATE,
      status,
      typeof spoons === 'number' ? spoons.toFixed(2) : String(spoons),
      duration
    );
  }
  
  // ============================================
  // SPOON LEVEL NOTIFICATIONS
  // ============================================
  
  /**
   * Send spoon level alert
   */
  async sendSpoonAlert(currentSpoons, maxSpoons = 12, userId = '') {
    if (!this.enabled) return;
    
    const percentage = (currentSpoons / maxSpoons) * 100;
    let eventName;
    
    if (currentSpoons <= this.config.SPOON_THRESHOLDS.CRITICAL) {
      eventName = this.config.EVENTS.SPOON_CRITICAL;
    } else if (currentSpoons <= this.config.SPOON_THRESHOLDS.LOW) {
      eventName = this.config.EVENTS.SPOON_LOW;
    } else {
      eventName = this.config.EVENTS.SPOON_RESTORED;
    }
    
    return this.trigger(
      eventName,
      currentSpoons.toFixed(1),
      `${percentage.toFixed(0)}%`,
      userId || new Date().toLocaleTimeString()
    );
  }
  
  /**
   * Send low spoon warning
   */
  async sendLowSpoonWarning(spoons, userName = '') {
    return this.trigger(
      this.config.EVENTS.SPOON_LOW,
      spoons.toFixed(1),
      userName,
      new Date().toLocaleTimeString()
    );
  }
  
  /**
   * Send critical spoon alert
   */
  async sendCriticalSpoonAlert(spoons, userName = '') {
    return this.trigger(
      this.config.EVENTS.SPOON_CRITICAL,
      spoons.toFixed(1),
      userName,
      'EMERGENCY - Immediate support needed'
    );
  }
  
  // ============================================
  // CARE SESSION NOTIFICATIONS
  // ============================================
  
  /**
   * Send care session start notification
   */
  async sendCareSessionStart(sessionId, caregiverId = '', childId = '') {
    return this.trigger(
      this.config.EVENTS.CARE_SESSION_START,
      sessionId,
      caregiverId,
      childId
    );
  }
  
  /**
   * Send care session end notification
   */
  async sendCareSessionEnd(sessionId, duration = '', score = '') {
    return this.trigger(
      this.config.EVENTS.CARE_SESSION_END,
      sessionId,
      duration,
      score
    );
  }
  
  /**
   * Send care token minted notification
   */
  async sendCareTokenMinted(amount, recipientId = '', sessionId = '') {
    return this.trigger(
      this.config.EVENTS.CARE_TOKEN_MINTED,
      typeof amount === 'number' ? amount.toFixed(4) : String(amount),
      recipientId,
      sessionId
    );
  }
  
  // ============================================
  // FAMILY NOTIFICATIONS
  // ============================================
  
  /**
   * Send family alert
   */
  async sendFamilyAlert(alertType, message = '', userId = '') {
    return this.trigger(
      this.config.EVENTS.FAMILY_ALERT,
      alertType,
      message,
      userId
    );
  }
  
  /**
   * Send family emergency
   */
  async sendFamilyEmergency(emergencyType, location = '', contact = '') {
    return this.trigger(
      this.config.EVENTS.FAMILY_EMERGENCY,
      emergencyType,
      location,
      contact
    );
  }
  
  // ============================================
  // BIOMETRIC NOTIFICATIONS
  // ============================================
  
  /**
   * Send high stress alert
   */
  async sendStressAlert(stressLevel, userId = '', recommendation = '') {
    return this.trigger(
      this.config.EVENTS.STRESS_HIGH,
      typeof stressLevel === 'number' ? stressLevel.toFixed(0) : String(stressLevel),
      userId,
      recommendation
    );
  }
  
  /**
   * Send low HRV alert
   */
  async sendHRVAlert(hrvValue, userId = '', trend = '') {
    return this.trigger(
      this.config.EVENTS.HRV_LOW,
      typeof hrvValue === 'number' ? hrvValue.toFixed(1) : String(hrvValue),
      userId,
      trend
    );
  }
  
  // ============================================
  // CUSTOM EVENTS
  // ============================================
  
  /**
   * Send custom event
   */
  async sendCustomEvent(eventName, value1 = '', value2 = '', value3 = '') {
    return this.trigger(eventName, value1, value2, value3);
  }
  
  // ============================================
  // UTILITY METHODS
  // ============================================
  
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  _recordEvent(eventName, values, success, error = null) {
    const record = {
      timestamp: Date.now(),
      eventName,
      values,
      success,
      error
    };
    
    this.eventHistory.push(record);
    
    // Keep history bounded
    if (this.eventHistory.length > 100) {
      this.eventHistory = this.eventHistory.slice(-50);
    }
  }
  
  /**
   * Get event history
   */
  getEventHistory(limit = 20) {
    return this.eventHistory.slice(-limit);
  }
  
  /**
   * Get available event types
   */
  getAvailableEvents() {
    return { ...this.config.EVENTS };
  }
  
  // ============================================
  // STATUS & STATS
  // ============================================
  
  /**
   * Get controller status
   */
  getStatus() {
    return {
      enabled: this.enabled,
      configured: !!this.key,
      lastEvent: this.stats.lastEvent,
      lastActivity: this.stats.lastActivity
    };
  }
  
  /**
   * Get comprehensive statistics
   */
  getStats() {
    return {
      ...this.stats,
      enabled: this.enabled,
      queueLength: this.eventQueue.length,
      historyLength: this.eventHistory.length,
      recentEvents: this.eventHistory.slice(-5).map(e => ({
        event: e.eventName,
        success: e.success,
        time: new Date(e.timestamp).toLocaleTimeString()
      })),
      availableEvents: Object.keys(this.config.EVENTS).length
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  IFTTT_CONFIG,
  IFTTTController
};

// Default export for backwards compatibility
module.exports.default = IFTTTController;