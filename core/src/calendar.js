/**
 * CALENDAR INTEGRATION - Spoon-Aware Scheduling
 * L.O.V.E. Economy v4.0.0 - WONKY QUANTUM REFACTOR
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱📅
 * 
 * Features:
 * - Multi-provider OAuth (Google, Outlook, Apple, CalDAV)
 * - Spoon cost estimation per event
 * - Energy forecasting for day/week
 * - Automatic shield-time blocking
 * - PoC care session scheduling
 * - Sensory load analysis
 * - Transition time buffers
 * - Family sync with conflict resolution
 */

const EventEmitter = require('events');

// ============================================================================
// CONFIGURATION
// ============================================================================

const CALENDAR_CONFIG = {
  // Supported providers
  PROVIDERS: {
    GOOGLE: 'google',
    OUTLOOK: 'outlook',
    APPLE: 'apple',
    CALDAV: 'caldav',
    LOCAL: 'local'
  },
  
  // Event categories with default spoon costs
  CATEGORIES: {
    work: { spoonCost: 1.0, sensoryLoad: 'medium', color: '#4285F4' },
    meeting: { spoonCost: 1.5, sensoryLoad: 'high', color: '#EA4335' },
    social: { spoonCost: 2.0, sensoryLoad: 'high', color: '#FBBC05' },
    medical: { spoonCost: 3.0, sensoryLoad: 'high', color: '#34A853' },
    exercise: { spoonCost: 1.5, sensoryLoad: 'low', color: '#FF6D01' },
    rest: { spoonCost: -1.0, sensoryLoad: 'low', color: '#46BDC6' },
    family: { spoonCost: 1.0, sensoryLoad: 'medium', color: '#7B1FA2' },
    care_session: { spoonCost: 0.5, sensoryLoad: 'low', color: '#E91E63' },
    transition: { spoonCost: 0.25, sensoryLoad: 'low', color: '#9E9E9E' },
    shield_time: { spoonCost: -0.5, sensoryLoad: 'none', color: '#607D8B' },
    sensory_break: { spoonCost: -0.5, sensoryLoad: 'none', color: '#00BCD4' }
  },
  
  // Event modifiers
  MODIFIERS: {
    location_home: 0.8,
    location_familiar: 0.9,
    location_new: 1.3,
    alone: 1.0,
    with_support: 0.7,
    crowded: 1.5,
    morning: 1.0,   // Override per user chronotype
    afternoon: 1.0,
    evening: 1.0,
    video_call: 1.2,
    in_person: 1.0
  },
  
  // Sensory load levels
  SENSORY_LEVELS: {
    none: 0,
    low: 1,
    medium: 2,
    high: 3,
    extreme: 4
  },
  
  // Scheduling rules
  RULES: {
    MIN_TRANSITION_MINUTES: 15,
    MAX_HIGH_SENSORY_HOURS: 4,
    SHIELD_TIME_AFTER_HIGH_SENSORY: 30,  // minutes
    MAX_SPOONS_PER_DAY_PERCENT: 80,
    BUFFER_BETWEEN_MEETINGS: 10,  // minutes
    CARE_SESSION_DURATION: 60     // minutes
  }
};

// ============================================================================
// CALENDAR EVENT
// ============================================================================

/**
 * Spoon-aware calendar event
 */
class CalendarEvent {
  constructor(data = {}) {
    this.id = data.id || `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.externalId = data.externalId || null;  // Provider's event ID
    this.provider = data.provider || CALENDAR_CONFIG.PROVIDERS.LOCAL;
    
    // Basic info
    this.title = data.title || 'Untitled Event';
    this.description = data.description || '';
    this.location = data.location || '';
    this.category = data.category || 'work';
    
    // Time
    this.startTime = data.startTime ? new Date(data.startTime) : new Date();
    this.endTime = data.endTime ? new Date(data.endTime) : new Date(Date.now() + 3600000);
    this.allDay = data.allDay || false;
    this.recurring = data.recurring || null;  // RRULE string
    
    // Spoon estimation
    this.baseSpoonCost = data.baseSpoonCost || this._getDefaultSpoonCost();
    this.modifiers = data.modifiers || [];
    this.calculatedSpoonCost = data.calculatedSpoonCost || this.baseSpoonCost;
    
    // Sensory
    this.sensoryLoad = data.sensoryLoad || this._getDefaultSensoryLoad();
    this.sensoryNotes = data.sensoryNotes || [];
    
    // Participants
    this.participants = data.participants || [];
    this.isCareSession = data.isCareSession || false;
    this.carePartner = data.carePartner || null;
    
    // Status
    this.status = data.status || 'confirmed';  // confirmed, tentative, cancelled
    this.attended = data.attended || null;     // null, true, false
    this.actualSpoonCost = data.actualSpoonCost || null;
    
    // Metadata
    this.created = data.created || Date.now();
    this.updated = data.updated || Date.now();
    this.syncedAt = data.syncedAt || null;
  }
  
  _getDefaultSpoonCost() {
    const cat = CALENDAR_CONFIG.CATEGORIES[this.category];
    return cat ? cat.spoonCost : 1.0;
  }
  
  _getDefaultSensoryLoad() {
    const cat = CALENDAR_CONFIG.CATEGORIES[this.category];
    return cat ? cat.sensoryLoad : 'medium';
  }
  
  /**
   * Calculate spoon cost with modifiers
   */
  calculateSpoonCost(userModifiers = {}) {
    let cost = this.baseSpoonCost;
    
    // Duration modifier (events > 2 hours cost more per hour)
    const hours = (this.endTime - this.startTime) / 3600000;
    if (hours > 2) {
      cost *= 1 + ((hours - 2) * 0.1);
    }
    
    // Apply event modifiers
    for (const mod of this.modifiers) {
      const modValue = CALENDAR_CONFIG.MODIFIERS[mod];
      if (modValue) cost *= modValue;
    }
    
    // Apply user's chronotype
    const hour = this.startTime.getHours();
    if (userModifiers.chronotype === 'morning_person' && hour >= 17) {
      cost *= 1.2;
    } else if (userModifiers.chronotype === 'night_owl' && hour < 10) {
      cost *= 1.3;
    }
    
    this.calculatedSpoonCost = Math.round(cost * 100) / 100;
    return this.calculatedSpoonCost;
  }
  
  /**
   * Get duration in minutes
   */
  getDurationMinutes() {
    return (this.endTime - this.startTime) / 60000;
  }
  
  /**
   * Check if event overlaps with another
   */
  overlaps(other) {
    return this.startTime < other.endTime && this.endTime > other.startTime;
  }
  
  /**
   * Mark as attended and record actual spoon cost
   */
  recordAttendance(attended, actualCost = null) {
    this.attended = attended;
    this.actualSpoonCost = actualCost !== null ? actualCost : this.calculatedSpoonCost;
    this.updated = Date.now();
    return this;
  }
  
  toJSON() {
    return {
      id: this.id,
      externalId: this.externalId,
      provider: this.provider,
      title: this.title,
      description: this.description,
      location: this.location,
      category: this.category,
      startTime: this.startTime.toISOString(),
      endTime: this.endTime.toISOString(),
      allDay: this.allDay,
      baseSpoonCost: this.baseSpoonCost,
      calculatedSpoonCost: this.calculatedSpoonCost,
      sensoryLoad: this.sensoryLoad,
      participants: this.participants,
      isCareSession: this.isCareSession,
      status: this.status
    };
  }
}

// ============================================================================
// SPOON FORECASTER
// ============================================================================

/**
 * Forecasts spoon usage from calendar
 */
class SpoonForecaster {
  constructor() {
    this.learningData = new Map();  // eventType -> actual costs
  }
  
  /**
   * Forecast day's spoon usage
   */
  forecastDay(events, currentSpoons, maxSpoons) {
    const sorted = [...events].sort((a, b) => a.startTime - b.startTime);
    let projected = currentSpoons;
    const timeline = [];
    const warnings = [];
    
    // Track sensory load
    let sensoryHours = { none: 0, low: 0, medium: 0, high: 0, extreme: 0 };
    
    for (const event of sorted) {
      const cost = event.calculatedSpoonCost;
      const before = projected;
      projected -= cost;
      
      // Track sensory
      const hours = event.getDurationMinutes() / 60;
      sensoryHours[event.sensoryLoad] = (sensoryHours[event.sensoryLoad] || 0) + hours;
      
      timeline.push({
        event: event.toJSON(),
        spoonCost: cost,
        projectedBefore: before,
        projectedAfter: projected,
        sensoryLoad: event.sensoryLoad
      });
      
      // Generate warnings
      if (projected < 0) {
        warnings.push({
          type: 'deficit',
          event: event.title,
          message: `Will be in deficit after "${event.title}"`,
          severity: 'critical'
        });
      } else if (projected < 3) {
        warnings.push({
          type: 'low',
          event: event.title,
          message: `Low spoons after "${event.title}"`,
          severity: 'warning'
        });
      }
    }
    
    // Check sensory overload
    const highSensoryTotal = sensoryHours.high + sensoryHours.extreme;
    if (highSensoryTotal > CALENDAR_CONFIG.RULES.MAX_HIGH_SENSORY_HOURS) {
      warnings.push({
        type: 'sensory_overload',
        message: `${highSensoryTotal.toFixed(1)}h of high sensory load (max ${CALENDAR_CONFIG.RULES.MAX_HIGH_SENSORY_HOURS}h)`,
        severity: 'warning'
      });
    }
    
    return {
      startSpoons: currentSpoons,
      endSpoons: projected,
      totalCost: currentSpoons - projected,
      utilizationPercent: ((currentSpoons - projected) / maxSpoons) * 100,
      timeline,
      sensoryHours,
      warnings,
      recommendation: this._getRecommendation(projected, maxSpoons, warnings)
    };
  }
  
  /**
   * Forecast week
   */
  forecastWeek(eventsByDay, spoonsPerDay) {
    const days = [];
    let weekTotal = 0;
    const weekWarnings = [];
    
    for (const [date, events] of Object.entries(eventsByDay)) {
      const dayForecast = this.forecastDay(events, spoonsPerDay, spoonsPerDay);
      days.push({ date, ...dayForecast });
      weekTotal += dayForecast.totalCost;
      
      if (dayForecast.warnings.length > 0) {
        weekWarnings.push({ date, warnings: dayForecast.warnings });
      }
    }
    
    return {
      days,
      weekTotal,
      avgDailyCost: weekTotal / days.length,
      warnings: weekWarnings,
      summary: this._getWeekSummary(days)
    };
  }
  
  /**
   * Learn from actual costs
   */
  learn(eventType, predictedCost, actualCost) {
    if (!this.learningData.has(eventType)) {
      this.learningData.set(eventType, []);
    }
    
    this.learningData.get(eventType).push({
      predicted: predictedCost,
      actual: actualCost,
      ratio: actualCost / predictedCost
    });
    
    // Keep last 50 samples
    const data = this.learningData.get(eventType);
    if (data.length > 50) {
      this.learningData.set(eventType, data.slice(-50));
    }
  }
  
  /**
   * Get learned adjustment for event type
   */
  getLearnedAdjustment(eventType) {
    const data = this.learningData.get(eventType);
    if (!data || data.length < 5) return 1.0;
    
    // Average ratio from learning data
    const avgRatio = data.reduce((sum, d) => sum + d.ratio, 0) / data.length;
    return avgRatio;
  }
  
  _getRecommendation(projected, maxSpoons, warnings) {
    const critical = warnings.filter(w => w.severity === 'critical').length;
    
    if (critical > 0) {
      return {
        level: 'danger',
        action: 'Cancel or reschedule some events',
        message: 'Day is overcommitted - will crash'
      };
    }
    
    if (projected < 2) {
      return {
        level: 'warning',
        action: 'Consider adding rest breaks',
        message: 'Heavy day - schedule recovery time'
      };
    }
    
    if (projected >= maxSpoons * 0.3) {
      return {
        level: 'good',
        action: 'None needed',
        message: 'Sustainable schedule'
      };
    }
    
    return {
      level: 'caution',
      action: 'Monitor energy levels',
      message: 'Moderate load - stay aware'
    };
  }
  
  _getWeekSummary(days) {
    const heavyDays = days.filter(d => d.totalCost > 8).length;
    const lightDays = days.filter(d => d.totalCost < 4).length;
    
    return {
      heavyDays,
      lightDays,
      balance: lightDays >= heavyDays ? 'balanced' : 'heavy',
      message: heavyDays > 3 
        ? 'Heavy week ahead - consider rescheduling'
        : 'Week looks manageable'
    };
  }
}

// ============================================================================
// CALENDAR MANAGER
// ============================================================================

/**
 * Main calendar manager
 */
class CalendarManager extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...CALENDAR_CONFIG, ...config };
    this.events = new Map();
    this.forecaster = new SpoonForecaster();
    
    // Provider connections
    this.providers = new Map();
    this.syncTimers = new Map();
    
    // User preferences
    this.userPrefs = {
      chronotype: 'neutral',
      defaultTransitionMinutes: 15,
      autoScheduleShieldTime: true,
      maxSpoonsPerDayPercent: 80
    };
    
    // Stats
    this.stats = {
      eventsCreated: 0,
      eventsSynced: 0,
      forecasts: 0,
      lastSync: null
    };
  }
  
  /**
   * Add calendar provider
   */
  async addProvider(type, credentials) {
    // In production: Actual OAuth flow
    // For now: Simulate connection
    const provider = {
      type,
      connected: true,
      lastSync: null,
      credentials
    };
    
    this.providers.set(type, provider);
    this.emit('providerAdded', { type });
    
    return { success: true, provider: type };
  }
  
  /**
   * Sync with provider
   */
  async syncProvider(type) {
    const provider = this.providers.get(type);
    if (!provider || !provider.connected) {
      return { error: 'Provider not connected' };
    }
    
    // In production: Fetch events from API
    // Simulate sync for now
    provider.lastSync = Date.now();
    this.stats.lastSync = Date.now();
    
    this.emit('synced', { provider: type, timestamp: Date.now() });
    return { success: true, eventsUpdated: 0 };
  }
  
  /**
   * Create local event
   */
  createEvent(data) {
    const event = new CalendarEvent(data);
    event.calculateSpoonCost(this.userPrefs);
    
    this.events.set(event.id, event);
    this.stats.eventsCreated++;
    
    this.emit('eventCreated', event.toJSON());
    return event;
  }
  
  /**
   * Update event
   */
  updateEvent(eventId, updates) {
    const event = this.events.get(eventId);
    if (!event) return null;
    
    Object.assign(event, updates, { updated: Date.now() });
    event.calculateSpoonCost(this.userPrefs);
    
    this.emit('eventUpdated', event.toJSON());
    return event;
  }
  
  /**
   * Delete event
   */
  deleteEvent(eventId) {
    const event = this.events.get(eventId);
    if (!event) return false;
    
    this.events.delete(eventId);
    this.emit('eventDeleted', { id: eventId });
    return true;
  }
  
  /**
   * Get events for date range
   */
  getEvents(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return Array.from(this.events.values())
      .filter(e => e.startTime >= start && e.startTime <= end)
      .sort((a, b) => a.startTime - b.startTime);
  }
  
  /**
   * Get today's events
   */
  getTodaysEvents() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return this.getEvents(today, tomorrow);
  }
  
  /**
   * Get spoon forecast for today
   */
  getForecastToday(currentSpoons, maxSpoons) {
    const events = this.getTodaysEvents();
    this.stats.forecasts++;
    return this.forecaster.forecastDay(events, currentSpoons, maxSpoons);
  }
  
  /**
   * Schedule shield time
   */
  scheduleShieldTime(duration = 60, after = null) {
    const startTime = after 
      ? new Date(after.endTime.getTime() + CALENDAR_CONFIG.RULES.MIN_TRANSITION_MINUTES * 60000)
      : new Date();
    
    const event = this.createEvent({
      title: '🛡️ Shield Time',
      category: 'shield_time',
      startTime,
      endTime: new Date(startTime.getTime() + duration * 60000),
      description: 'Protected recovery time',
      sensoryLoad: 'none'
    });
    
    return event;
  }
  
  /**
   * Schedule care session (for PoC)
   */
  scheduleCareSession(carePartner, startTime, duration = 60) {
    const event = this.createEvent({
      title: `💚 Care Session with ${carePartner.name}`,
      category: 'care_session',
      startTime: new Date(startTime),
      endTime: new Date(new Date(startTime).getTime() + duration * 60000),
      isCareSession: true,
      carePartner: carePartner.id,
      participants: [carePartner],
      sensoryLoad: 'low',
      description: 'Proof of Care session - earn $CARE tokens!'
    });
    
    return event;
  }
  
  /**
   * Auto-insert transition buffers
   */
  insertTransitionBuffers(events) {
    const sorted = [...events].sort((a, b) => a.startTime - b.startTime);
    const buffers = [];
    
    for (let i = 1; i < sorted.length; i++) {
      const prev = sorted[i - 1];
      const curr = sorted[i];
      const gap = (curr.startTime - prev.endTime) / 60000;
      
      if (gap < CALENDAR_CONFIG.RULES.MIN_TRANSITION_MINUTES && gap > 0) {
        // Need a buffer
        buffers.push(this.createEvent({
          title: '🚶 Transition',
          category: 'transition',
          startTime: prev.endTime,
          endTime: curr.startTime,
          sensoryLoad: 'low'
        }));
      }
    }
    
    return buffers;
  }
  
  /**
   * Check for scheduling conflicts
   */
  checkConflicts(events = null) {
    const toCheck = events || Array.from(this.events.values());
    const conflicts = [];
    
    for (let i = 0; i < toCheck.length; i++) {
      for (let j = i + 1; j < toCheck.length; j++) {
        if (toCheck[i].overlaps(toCheck[j])) {
          conflicts.push({
            event1: toCheck[i].toJSON(),
            event2: toCheck[j].toJSON()
          });
        }
      }
    }
    
    return conflicts;
  }
  
  /**
   * Get optimal times for new event
   */
  findOptimalTimes(duration, date, spoonCost, maxResults = 5) {
    const dayStart = new Date(date);
    dayStart.setHours(8, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(20, 0, 0, 0);
    
    const events = this.getEvents(dayStart, dayEnd);
    const slots = [];
    
    // Find gaps
    let current = dayStart;
    for (const event of events) {
      if (event.startTime - current >= duration * 60000) {
        slots.push({
          startTime: new Date(current),
          endTime: new Date(event.startTime),
          duration: (event.startTime - current) / 60000
        });
      }
      current = new Date(Math.max(current, event.endTime));
    }
    
    // Check end of day
    if (dayEnd - current >= duration * 60000) {
      slots.push({
        startTime: new Date(current),
        endTime: dayEnd,
        duration: (dayEnd - current) / 60000
      });
    }
    
    return slots.slice(0, maxResults);
  }
  
  /**
   * Set user preferences
   */
  setPreferences(prefs) {
    Object.assign(this.userPrefs, prefs);
    
    // Recalculate all event costs
    for (const event of this.events.values()) {
      event.calculateSpoonCost(this.userPrefs);
    }
    
    this.emit('preferencesUpdated', this.userPrefs);
    return this.userPrefs;
  }
  
  /**
   * Get stats
   */
  getStats() {
    const allEvents = Array.from(this.events.values());
    return {
      ...this.stats,
      totalEvents: allEvents.length,
      upcomingEvents: allEvents.filter(e => e.startTime > new Date()).length,
      providers: Array.from(this.providers.entries()).map(([type, p]) => ({
        type,
        connected: p.connected,
        lastSync: p.lastSync
      }))
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  CALENDAR_CONFIG,
  CalendarEvent,
  SpoonForecaster,
  CalendarManager
};