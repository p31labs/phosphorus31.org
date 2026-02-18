// src/protocols/love-economy/index.js
// L.O.V.E. Economy - Complete WONKY SPROUT ECOSYSTEM
// Version 5.0.0 - THE WONKY QUANTUM REFACTOR
// 🌱💚 WONKY SPROUT FOR DA KIDS!
// Complete neurodiversity-first metaverse platform with:
// - Proof of Care (PoC) Consensus Algorithm
// - Entropy Shield (Child Cognitive Protection)
// - ZK-Privacy Layer (GDPR Article 17)
// - Sensory Toolkit (Regulation & Stim Management)
// - Universal Translator (Cross-Neurotype Communication)
// - Gadgetbridge Integration (Amazfit Balance, Helios Ring)
// - Real-Time Biometric Streaming
// - IoT Smart Home Orchestration
// - Calendar Forecasting
// - Family Quest Gamification
// - Phenix Navigator Hardware Bridge

const { GadgetbridgeIngestor } = require('./gadgetbridge');
const { SpoonManager } = require('./spoons');
const { IoTManager } = require('./iot/manager');
const { BiometricStreamManager, AmazfitBalanceAdapter, HeliosRingAdapter } = require('./biometric-stream');
const { CalendarManager } = require('./calendar');
const { PhenixNavigatorBridge } = require('./phenix-bridge');
const { FamilyQuestEngine } = require('./family-quest');
const { ProofOfCareEngine, POC_CONFIG } = require('./proof-of-care');
const { EntropyShield, CalmingResponseGenerator, ENTROPY_CONFIG } = require('./entropy-shield');
const { SensoryToolkit } = require('./sensory-toolkit');
const { UniversalTranslator } = require('./universal-translator');

const loveEconomy = {
  id: 'love-economy',
  name: 'L.O.V.E. Economy',
  version: '5.0.0',
  
  async initialize(agent, config = {}) {
    this.agent = agent;
    this.config = config;
    this.status = { 
      healthy: true, 
      message: 'L.O.V.E. Economy active', 
      lastCheck: Date.now(),
      features: []
    };
    
    // ============================================
    // CORE MODULES
    // ============================================
    
    // Gadgetbridge CSV Ingestor (batch import)
    this.ingestor = new GadgetbridgeIngestor();
    
    // Spoon Budget Manager
    this.spoonManager = new SpoonManager(config.spoons);
    
    // IoT Device Manager (Hue, Govee, SmartThings, Home Assistant)
    this.iot = new IoTManager(config.iot || {});
    
    // ============================================
    // ADVANCED MODULES
    // ============================================
    
    // Real-Time Biometric Streaming (Amazfit Balance, Helios Ring)
    if (config.biometricStream?.enabled !== false) {
      this.biometricStream = new BiometricStreamManager(config.biometricStream || {});
      this.amazfitAdapter = new AmazfitBalanceAdapter(this.biometricStream);
      this.heliosAdapter = new HeliosRingAdapter(this.biometricStream);
      this.status.features.push('biometric-streaming');
    }
    
    // Calendar Integration (Google, Outlook, CalDAV)
    if (config.calendar) {
      this.calendar = new CalendarManager(config.calendar);
      this.status.features.push('calendar');
    }
    
    // Phenix Navigator Hardware Bridge
    if (config.phenixNavigator?.enabled !== false) {
      this.phenixBridge = new PhenixNavigatorBridge(config.phenixNavigator || {});
      this.status.features.push('phenix-navigator');
    }
    
    // Family Quest System (Gamification for Kids)
    if (config.familyQuest?.enabled !== false) {
      this.familyQuest = new FamilyQuestEngine(config.familyQuest || {});
      this.status.features.push('family-quest');
    }
    
    // ============================================
    // PROOF OF CARE & CHILD PROTECTION
    // ============================================
    
    // Proof of Care Consensus Engine
    this.proofOfCare = new ProofOfCareEngine();
    this.status.features.push('proof-of-care');
    
    // Entropy Shield (Child Cognitive Protection)
    this.entropyShield = new EntropyShield();
    this.calmingResponses = new CalmingResponseGenerator();
    this.status.features.push('entropy-shield');
    
    // Sensory Toolkit (Regulation & Stim Management)
    this.sensoryToolkit = new SensoryToolkit(config.sensory || {});
    this.status.features.push('sensory-toolkit');
    
    // Universal Translator (Cross-Neurotype Communication)
    this.universalTranslator = new UniversalTranslator(config.translator || {});
    this.status.features.push('universal-translator');
    
    // Active care session tracking
    this.currentCareSession = null;
    
    // ============================================
    // EVENT WIRING
    // ============================================
    
    this.wireSpoonEvents();
    this.wireBiometricEvents();
    this.wireCalendarEvents();
    this.wirePhenixEvents();
    this.wireFamilyQuestEvents();
    this.wireProofOfCareEvents();
    this.wireEntropyShieldEvents();
    this.wireSensoryToolkitEvents();
    this.wireUniversalTranslatorEvents();
    
    // ============================================
    // ASYNC INITIALIZATION
    // ============================================
    
    await this.initializeAsync();
    
    console.log('[LOVE] Economy Engine v5.0.0 Initialized');
    console.log(`[LOVE] Daily Spoon Budget: ${this.spoonManager.budget}`);
    console.log(`[LOVE] Active Features: ${this.status.features.join(', ')}`);
  },

  /**
   * Async initialization for modules that need it
   */
  async initializeAsync() {
    // Initialize IoT connections
    if (this.iot) {
      try {
        const iotStatus = await this.iot.initialize();
        console.log('[LOVE] IoT Status:', iotStatus);
      } catch (error) {
        console.error('[LOVE] IoT init error:', error.message);
      }
    }
    
    // Start biometric streaming
    if (this.biometricStream) {
      try {
        const streamResults = await this.biometricStream.startStreaming();
        console.log('[LOVE] Biometric streams:', streamResults);
      } catch (error) {
        console.error('[LOVE] Biometric stream error:', error.message);
      }
    }
    
    // Connect calendar
    if (this.calendar) {
      try {
        const calResults = await this.calendar.connect();
        console.log('[LOVE] Calendar status:', calResults);
      } catch (error) {
        console.error('[LOVE] Calendar error:', error.message);
      }
    }
    
    // Connect Phenix Navigator
    if (this.phenixBridge) {
      try {
        const phenixResult = await this.phenixBridge.connect();
        console.log('[LOVE] Phenix Navigator:', phenixResult);
      } catch (error) {
        console.error('[LOVE] Phenix Navigator error:', error.message);
      }
    }
    
    // Initialize Sensory Toolkit
    if (this.sensoryToolkit) {
      try {
        console.log('[LOVE] Sensory Toolkit initialized');
      } catch (error) {
        console.error('[LOVE] Sensory Toolkit error:', error.message);
      }
    }
    
    // Initialize Universal Translator
    if (this.universalTranslator) {
      try {
        console.log('[LOVE] Universal Translator initialized');
      } catch (error) {
        console.error('[LOVE] Universal Translator error:', error.message);
      }
    }
  },

  /**
   * Wire spoon manager events
   */
  wireSpoonEvents() {
    this.spoonManager.on('SHIELD_ACTIVATE', async (data) => {
      this.status.shieldActive = true;
      if (this.agent?.emit) {
        this.agent.emit('COGNITIVE_SHIELD_ACTIVATE', data);
      }
      console.log('[LOVE] SHIELD ACTIVATED:', data.message);
      
      // Sync to all systems
      await this.syncAllSystems(data);
    });

    this.spoonManager.on('SHIELD_DEACTIVATE', async (data) => {
      this.status.shieldActive = false;
      if (this.agent?.emit) {
        this.agent.emit('COGNITIVE_SHIELD_DEACTIVATE', data);
      }
      console.log('[LOVE] Shield Deactivated:', data.message);

      // Sync to all systems
      await this.syncAllSystems(data);
    });
    
    this.spoonManager.on('SPOON_CHANGE', async (data) => {
      // Sync spoon changes to connected devices
      await this.syncSpoonState();
    });
  },

  /**
   * Wire biometric streaming events
   */
  wireBiometricEvents() {
    if (!this.biometricStream) return;
    
    // Real-time biometric data
    this.biometricStream.on('data', (data) => {
      // Process through spoon manager
      this.spoonManager.processBiometric(data.raw);
      
      // Update Phenix Navigator display
      if (this.phenixBridge?.connected) {
        // Throttle updates to device
        if (!this._lastPhenixUpdate || Date.now() - this._lastPhenixUpdate > 5000) {
          this.phenixBridge.syncSpoonState({
            currentSpoons: this.spoonManager.currentSpoons,
            maxSpoons: this.spoonManager.budget,
            trend: this.spoonManager.trend,
            shieldActive: this.status.shieldActive
          });
          this._lastPhenixUpdate = Date.now();
        }
      }
    });
    
    // Biometric alerts
    this.biometricStream.on('alert', async (alerts) => {
      console.log('[LOVE] Biometric Alert:', alerts);
      
      // Forward to Phenix Navigator
      if (this.phenixBridge?.connected) {
        for (const alert of alerts) {
          await this.phenixBridge.handleBiometricAlert(alert);
        }
      }
      
      // Emit for external listeners
      if (this.agent?.emit) {
        this.agent.emit('BIOMETRIC_ALERT', alerts);
      }
    });
    
    // Device connections
    this.biometricStream.on('deviceConnected', (device) => {
      console.log(`[LOVE] Wearable connected: ${device.info.name || device.id}`);
    });
  },

  /**
   * Wire calendar events
   */
  wireCalendarEvents() {
    if (!this.calendar) return;
    
    this.calendar.on('synced', (data) => {
      console.log(`[LOVE] Calendar synced: ${data.eventCount} events`);
    });
  },

  /**
   * Wire Phenix Navigator events
   */
  wirePhenixEvents() {
    if (!this.phenixBridge) return;
    
    // Button presses on device
    this.phenixBridge.on('toggleShield', () => {
      if (this.status.shieldActive) {
        this.spoonManager.deactivateShield('manual');
      } else {
        this.spoonManager.activateShield('manual');
      }
    });
    
    this.phenixBridge.on('emergency', () => {
      console.log('[LOVE] Emergency button pressed!');
      this.spoonManager.activateShield('emergency');
      if (this.agent?.emit) {
        this.agent.emit('EMERGENCY_TRIGGERED', { source: 'phenix_navigator' });
      }
    });
    
    this.phenixBridge.on('gestureAction', (data) => {
      console.log(`[LOVE] Gesture: ${data.gesture} -> ${data.action}`);
      
      switch (data.action) {
        case 'increaseSpoons':
          this.spoonManager.adjustSpoons(1);
          break;
        case 'decreaseSpoons':
          this.spoonManager.adjustSpoons(-1);
          break;
        case 'toggleMode':
          // Toggle display mode on device
          break;
      }
    });
    
    this.phenixBridge.on('sensors', (sensors) => {
      // Environmental sensors from Phenix Navigator
      // Can influence spoon calculations (e.g., hot environments drain faster)
    });
  },

  /**
   * Wire Family Quest events
   */
  wireFamilyQuestEvents() {
    if (!this.familyQuest) return;
    
    // Quest completion triggers
    this.familyQuest.on('questCompleted', (data) => {
      console.log(`[LOVE] Quest completed: ${data.quest.name} by ${data.hero.name}`);
      
      // Notify Phenix Navigator
      if (this.phenixBridge?.connected) {
        this.phenixBridge.showAlert('success', `🎉 ${data.hero.name} completed ${data.quest.name}!`);
        this.phenixBridge.haptic('success');
      }
      
      // Trigger smart home celebration for big achievements
      if (data.quest.xpReward >= 100 && this.iot?.homeAssistant) {
        // Flash lights for celebration
        this.iot.callHomeAssistantService('light', 'turn_on', {
          entity_id: 'all',
          flash: 'short'
        }).catch(() => {});
      }
    });
    
    // Level up celebration
    this.familyQuest.on('levelUp', async (data) => {
      console.log(`[LOVE] LEVEL UP! ${data.heroId} is now level ${data.level}`);
      
      if (this.phenixBridge?.connected) {
        await this.phenixBridge.setLED([255, 215, 0], 'rainbow', { duration: 5000 }); // Gold rainbow
        await this.phenixBridge.haptic('success');
        await this.phenixBridge.showAlert('success', `🎊 LEVEL ${data.level}! New title: ${data.newTitle}!`);
      }
    });
    
    // Badge unlocked
    this.familyQuest.on('badgeUnlocked', (data) => {
      console.log(`[LOVE] Badge unlocked: ${data.badge.name}`);
      
      if (this.phenixBridge?.connected) {
        this.phenixBridge.showAlert('info', `🏆 ${data.badge.icon} ${data.badge.name}!`);
      }
    });
    
    // XP gained (for display)
    this.familyQuest.on('xpGained', (data) => {
      // Can update Phenix Navigator XP display here
    });
    
      // Spoon sharing
    this.familyQuest.on('spoonShared', (data) => {
      console.log(`[LOVE] ${data.fromHero.name} shared a spoon with ${data.toHero.name}`);
      
      if (this.phenixBridge?.connected) {
        this.phenixBridge.showAlert('info', `💝 ${data.fromHero.name} shared love!`);
      }
    });
  },

  /**
   * Wire Proof of Care events
   */
  wireProofOfCareEvents() {
    // Connect biometric data to active care session
    if (this.biometricStream) {
      this.biometricStream.on('data', (data) => {
        if (this.currentCareSession) {
          // Record HRV data
          if (data.raw?.ibi) {
            const role = data.deviceId === this.config.childDeviceId ? 'child' : 'guardian';
            this.proofOfCare.recordHRV(this.currentCareSession.guardianId, role, data.raw.ibi);
          }
          // Record RSSI for proximity
          if (data.rssi) {
            this.proofOfCare.recordRSSI(this.currentCareSession.guardianId, data.rssi);
          }
        }
      });
    }
    
    // Quest completion adds to care task verification
    if (this.familyQuest) {
      this.familyQuest.on('questCompleted', (data) => {
        if (this.currentCareSession) {
          this.proofOfCare.recordTask(
            this.currentCareSession.guardianId,
            data.quest.id,
            data.quest.type || 'quest'
          );
        }
      });
    }
    
    // PoC tick validated - tokens minted!
    this.proofOfCare.on('tickValidated', (data) => {
      console.log(`[LOVE] 💚 Care Tick Validated! Tokens: ${data.tick.tokensEarned}`);
      
      if (this.phenixBridge?.connected) {
        this.phenixBridge.showAlert('success', `💚 +${data.tick.tokensEarned} Care Tokens!`);
        this.phenixBridge.haptic('success');
      }
      
      if (this.agent?.emit) {
        this.agent.emit('CARE_VALIDATED', data);
      }
    });
    
    // Slashing event - stake redistributed to child
    this.proofOfCare.on('slashingEvent', (data) => {
      console.log(`[LOVE] ⚠️ SLASHING: ${data.reason} - ${data.slashedAmount} tokens to Sanctuary`);
      
      if (this.phenixBridge?.connected) {
        this.phenixBridge.showAlert('warning', `⚠️ Sanctuary Fund +${data.slashedAmount}`);
      }
      
      if (this.agent?.emit) {
        this.agent.emit('SLASHING_EVENT', data);
      }
    });
  },

  /**
   * Wire Entropy Shield events (child protection)
   */
  wireEntropyShieldEvents() {
    // Message blocked
    this.entropyShield.on('message_blocked', (logEntry) => {
      console.log(`[LOVE] 🛡️ Entropy Shield blocked: ${logEntry.category}`);
      
      // Report to PoC for slashing
      this.proofOfCare.reportToxicity(
        logEntry.guardianId,
        logEntry.childId,
        logEntry.entropy
      );
      
      if (this.agent?.emit) {
        this.agent.emit('TOXIC_BLOCKED', logEntry);
      }
    });
    
    // Critical event - immediate intervention
    this.entropyShield.on('critical_event', async (data) => {
      console.log(`[LOVE] 🚨 CRITICAL: Intervention required!`);
      
      // Trigger calming IoT environment
      if (this.iot) {
        try {
          await this.iot.syncEnvironment(true, 0, 12, { emergency: true });
        } catch (e) {}
      }
      
      // Get calming response
      const calmingMessage = this.calmingResponses.getResponse(data.category);
      const breathingExercise = this.calmingResponses.getBreathingExercise();
      
      if (this.phenixBridge?.connected) {
        await this.phenixBridge.setLED([138, 43, 226], 'breathe', { duration: 10000 }); // Purple calm
        await this.phenixBridge.showAlert('info', calmingMessage);
      }
      
      if (this.agent?.emit) {
        this.agent.emit('CRITICAL_INTERVENTION', {
          ...data,
          calmingMessage,
          breathingExercise
        });
      }
    });
    
    // Shouting detected - auto de-escalate
    this.entropyShield.on('shouting_detected', async (data) => {
      console.log(`[LOVE] 🔊 Shouting detected - de-escalating`);
      
      if (this.iot) {
        try {
          // Dim lights, play calming sounds
          await this.iot.syncEnvironment(true, 3, 12, { deescalate: true });
        } catch (e) {}
      }
    });
  },

  /**
   * Wire Sensory Toolkit events
   */
  wireSensoryToolkitEvents() {
    if (!this.sensoryToolkit) return;

    // Regulation tool used
    this.sensoryToolkit.on('toolUsed', (data) => {
      console.log(`[LOVE] Sensory tool used: ${data.tool.name} (${data.category})`);

      // Adjust spoons based on regulation
      if (data.category === 'calming' && this.spoonManager.currentSpoons < 5) {
        this.spoonManager.adjustSpoons(0.5); // Small recovery bonus
      }

      // Update Phenix Navigator
      if (this.phenixBridge?.connected) {
        this.phenixBridge.showAlert('info', `🧘 ${data.tool.name} activated`);
      }
    });

    // Arousal level changed
    this.sensoryToolkit.on('arousalChanged', (data) => {
      console.log(`[LOVE] Arousal level: ${data.level} (${data.modality})`);

      // Sync to IoT environment
      if (this.iot) {
        const spoonLevel = this.sensoryToolkit.getSpoonLevelForArousal(data.level);
        this.iot.syncEnvironment(false, spoonLevel, 12, { sensory: true });
      }
    });

    // Stim pattern detected
    this.sensoryToolkit.on('stimPattern', (data) => {
      console.log(`[LOVE] Stim pattern: ${data.pattern} (${data.frequency})`);

      // Could trigger calming interventions if stimming indicates distress
      if (data.indicatesDistress) {
        this.entropyShield.processMessage('system', 'child', 'stim_distress_detected');
      }
    });
  },

  /**
   * Wire Universal Translator events
   */
  wireUniversalTranslatorEvents() {
    if (!this.universalTranslator) return;

    // Translation requested
    this.universalTranslator.on('translationRequested', (data) => {
      console.log(`[LOVE] Translation: ${data.fromProfile} → ${data.toProfile}`);

      // Could display translation hints on Phenix Navigator
      if (this.phenixBridge?.connected && data.urgency === 'high') {
        this.phenixBridge.showAlert('info', `💬 Translation hint: ${data.hint}`);
      }
    });

    // Bridge created
    this.universalTranslator.on('bridgeCreated', (data) => {
      console.log(`[LOVE] Communication bridge created: ${data.bridge.person1} ↔ ${data.bridge.person2}`);

      // Store bridge for future use
      this._communicationBridges = this._communicationBridges || new Map();
      this._communicationBridges.set(data.bridge.id, data.bridge);
    });

    // Conflict detected
    this.universalTranslator.on('conflictDetected', (data) => {
      console.log(`[LOVE] Conflict pattern: ${data.pattern}`);

      // Trigger calming environment
      if (this.iot && data.severity === 'high') {
        this.iot.syncEnvironment(true, 2, 12, { conflict: true });
      }

      // Get repair strategy
      const repair = this.universalTranslator.getRepairStrategy(data.pattern);
      if (repair && this.phenixBridge?.connected) {
        this.phenixBridge.showAlert('info', `🛠️ Repair: ${repair.suggestion}`);
      }
    });

    // Spoon-aware communication
    this.universalTranslator.on('spoonAwareMessage', (data) => {
      console.log(`[LOVE] Spoon-aware message: ${data.complexity} complexity`);

      // Simplify if spoons are low
      if (this.spoonManager.currentSpoons < 5 && data.complexity === 'high') {
        data.simplified = this.universalTranslator.simplifyMessage(data.original, this.spoonManager.currentSpoons);
      }
    });
  },

  /**
   * Sync spoon state to all connected systems
   */
  async syncSpoonState() {
    const spoonData = {
      currentSpoons: this.spoonManager.currentSpoons,
      maxSpoons: this.spoonManager.budget,
      trend: this.spoonManager.trend,
      shieldActive: this.status.shieldActive,
      recentBiometrics: this.biometricStream?.getCurrentState() || {}
    };
    
    // Sync to IoT devices
    if (this.iot) {
      await this.iot.syncEnvironment(
        this.status.shieldActive,
        spoonData.currentSpoons,
        spoonData.maxSpoons,
        spoonData.recentBiometrics
      );
    }
    
    // Sync to Phenix Navigator
    if (this.phenixBridge?.connected) {
      await this.phenixBridge.syncSpoonState(spoonData);
    }
  },

  /**
   * Sync all systems after shield state change
   */
  async syncAllSystems(data) {
    await this.syncSpoonState();
    
    // Additional notifications
    if (this.phenixBridge?.connected && data.shieldActive) {
      await this.phenixBridge.haptic('warning');
      await this.phenixBridge.showAlert(
        data.shieldActive ? 'warning' : 'success',
        data.message,
        { duration: 5000 }
      );
    }
  },

  // ============================================
  // PUBLIC API
  // ============================================

  /**
   * Ingests biometric data from a CSV file (batch mode)
   * @param {string} filePath 
   * @param {string} deviceType 'AMAZFIT_BALANCE' | 'HELIOS_RING'
   */
  async ingestBiometrics(filePath, deviceType) {
    try {
      console.log(`[LOVE] Ingesting ${deviceType} data from ${filePath}...`);
      const records = await this.ingestor.ingestCsv(filePath, deviceType);
      
      let processedCount = 0;
      for (const record of records) {
        this.spoonManager.processBiometric(record);
        processedCount++;
      }
      
      // Sync after batch import
      await this.syncSpoonState();
      
      console.log(`[LOVE] Processed ${processedCount} records.`);
      return { success: true, count: processedCount };
    } catch (err) {
      console.error('[LOVE] Ingestion Error:', err);
      return { success: false, error: err.message };
    }
  },

  /**
   * Get spoon forecast based on calendar
   */
  async getSpoonForecast(days = 7) {
    if (!this.calendar) {
      return { error: 'Calendar not configured' };
    }
    
    // Get forecast for each day
    const forecasts = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const events = this.calendar.getEvents(date, date);
      const forecast = this.calendar.forecaster.forecastDay(events, 12, 12);
      forecasts.push({
        date: date.toISOString().split('T')[0],
        ...forecast
      });
    }
    
    return forecasts;
  },

  /**
   * Check if an activity can be afforded given upcoming events
   */
  async canAffordActivity(spoonCost, lookaheadHours = 4) {
    if (!this.calendar) {
      // Just check current spoons
      return {
        canAfford: this.spoonManager.currentSpoons >= spoonCost,
        currentSpoons: this.spoonManager.currentSpoons,
        activityCost: spoonCost
      };
    }
    
    // Get events in the lookahead window
    const now = new Date();
    const future = new Date(now.getTime() + lookaheadHours * 3600000);
    const events = this.calendar.getEvents(now, future);
    
    // Calculate total cost of upcoming events
    const totalUpcomingCost = events.reduce((sum, event) => sum + event.calculatedSpoonCost, 0);
    
    // Check if we can afford both the activity and upcoming events
    const canAfford = this.spoonManager.currentSpoons >= (spoonCost + totalUpcomingCost);
    
    return {
      canAfford,
      currentSpoons: this.spoonManager.currentSpoons,
      activityCost: spoonCost,
      upcomingCost: totalUpcomingCost,
      totalCost: spoonCost + totalUpcomingCost,
      shortfall: canAfford ? 0 : (spoonCost + totalUpcomingCost - this.spoonManager.currentSpoons),
      upcomingEvents: events.length
    };
  },

  /**
   * Get real-time biometric data
   */
  getCurrentBiometrics() {
    if (!this.biometricStream) {
      return { error: 'Biometric streaming not configured' };
    }
    return this.biometricStream.getCurrentState();
  },

  /**
   * Get connected wearable devices
   */
  getConnectedDevices() {
    const devices = [];
    
    if (this.biometricStream) {
      devices.push(...this.biometricStream.getDevices());
    }
    
    if (this.phenixBridge?.connected) {
      devices.push({
        id: 'phenix-navigator',
        name: 'Phenix Navigator',
        type: 'hardware',
        ...this.phenixBridge.getState()
      });
    }
    
    return devices;
  },

  // ============================================
  // FAMILY QUEST API
  // ============================================

  /**
   * Add a family member/hero to the quest system
   */
  addFamilyMember(id, profile) {
    if (!this.familyQuest) {
      return { error: 'Family Quest not enabled' };
    }
    return this.familyQuest.addMember(id, profile);
  },

  /**
   * Start a quest for a hero
   */
  startQuest(heroId, questId) {
    if (!this.familyQuest) {
      return { error: 'Family Quest not enabled' };
    }
    return this.familyQuest.startQuest(heroId, questId);
  },

  /**
   * Complete a task within a quest
   */
  completeTask(heroId, questInstanceId, taskId) {
    if (!this.familyQuest) {
      return { error: 'Family Quest not enabled' };
    }
    return this.familyQuest.completeTask(heroId, questInstanceId, taskId);
  },

  /**
   * Get daily quests for a hero
   */
  getDailyQuests(heroId) {
    if (!this.familyQuest) {
      return { error: 'Family Quest not enabled' };
    }
    return this.familyQuest.generateDailyChallenges(heroId);
  },

  /**
   * Get hero status for display
   */
  getHeroStatus(heroId) {
    if (!this.familyQuest) {
      return { error: 'Family Quest not enabled' };
    }
    return this.familyQuest.getHeroStatus(heroId);
  },

  /**
   * Get family leaderboard
   */
  getLeaderboard() {
    if (!this.familyQuest) {
      return { error: 'Family Quest not enabled' };
    }
    return this.familyQuest.getLeaderboard();
  },

  /**
   * Share spoons between family members
   */
  shareSpoons(fromHeroId, toHeroId, amount = 1) {
    if (!this.familyQuest) {
      return { error: 'Family Quest not enabled' };
    }
    return this.familyQuest.shareSpoon(fromHeroId, toHeroId, amount);
  },

  /**
   * Get family stats
   */
  getFamilyStats() {
    if (!this.familyQuest) {
      return { error: 'Family Quest not enabled' };
    }
    return this.familyQuest.getStats();
  },

  /**
   * Get all available quest templates
   */
  getAvailableQuests() {
    if (!this.familyQuest) {
      return { error: 'Family Quest not enabled' };
    }
    return this.familyQuest.questTemplates;
  },

  // ============================================
  // PROOF OF CARE API
  // ============================================

  /**
   * Start a care session (begins PoC tracking)
   * @param {string} guardianId - Guardian's ID
   * @param {string} childId - Child's ID (Founding Node)
   */
  startCareSession(guardianId, childId) {
    const tickId = this.proofOfCare.startTick(guardianId, childId);
    
    this.currentCareSession = {
      guardianId,
      childId,
      tickId,
      startTime: Date.now()
    };
    
    console.log(`[LOVE] 💚 Care session started: ${tickId}`);
    return { tickId, guardianId, childId, startTime: this.currentCareSession.startTime };
  },

  /**
   * End care session (validates and mints tokens)
   */
  endCareSession() {
    if (!this.currentCareSession) {
      return { error: 'No active care session' };
    }
    
    const result = this.proofOfCare.completeTick(this.currentCareSession.guardianId);
    const sessionInfo = { ...this.currentCareSession };
    this.currentCareSession = null;
    
    if (result && result.isValid) {
      console.log(`[LOVE] 💚 Care session validated! Tokens: ${result.tokensEarned}`);
      return {
        success: true,
        session: sessionInfo,
        careScore: result.careScore,
        tokensEarned: result.tokensEarned,
        T_prox: result.T_prox,
        Q_res: result.Q_res
      };
    }
    
    return {
      success: false,
      session: sessionInfo,
      reason: 'Minimum requirements not met'
    };
  },

  /**
   * Get care session status
   */
  getCareSessionStatus() {
    if (!this.currentCareSession) {
      return { active: false };
    }
    
    return {
      active: true,
      ...this.currentCareSession,
      duration: Date.now() - this.currentCareSession.startTime
    };
  },

  /**
   * Get stake for guardian-child pair
   */
  getCareStake(guardianId, childId) {
    return this.proofOfCare.getStake(guardianId, childId);
  },

  /**
   * Get child's sanctuary fund (slashed tokens from bad behavior)
   */
  getSanctuaryFund(childId) {
    return this.proofOfCare.getSanctuaryFund(childId);
  },

  /**
   * Get child's total tokens (their share + sanctuary)
   */
  getChildTokens(childId) {
    return this.proofOfCare.getChildTokens(childId);
  },

  /**
   * Get PoC engine stats
   */
  getProofOfCareStats() {
    return this.proofOfCare.getStats();
  },

  // ============================================
  // ENTROPY SHIELD API (Child Protection)
  // ============================================

  /**
   * Process incoming message through Entropy Shield
   * @param {string} guardianId - Sender ID
   * @param {string} childId - Recipient (child) ID
   * @param {string} message - Message content
   * @param {string} type - 'text' or 'audio'
   */
  processMessage(guardianId, childId, message, type = 'text') {
    return this.entropyShield.processMessage(guardianId, childId, message, type);
  },

  /**
   * Get blocked messages log for child (Inverse Transparency)
   * Child has RIGHT to see who tried to send them toxic content
   */
  getBlockedMessagesForChild(childId) {
    return this.entropyShield.getBlockedLogForChild(childId);
  },

  /**
   * Get offense count for guardian
   */
  getOffenseCount(guardianId) {
    return this.entropyShield.getOffenseCount(guardianId);
  },

  /**
   * Set Entropy Shield sensitivity (0.5-2.0)
   * Higher = more strict filtering
   */
  setShieldSensitivity(level) {
    return this.entropyShield.setSensitivity(level);
  },

  /**
   * Get calming response for child
   * @param {string} category - Category of blocked content
   */
  getCalmingResponse(category) {
    return this.calmingResponses.getResponse(category);
  },

  /**
   * Get breathing exercise for child
   */
  getBreathingExercise() {
    return this.calmingResponses.getBreathingExercise();
  },

  /**
   * Get Entropy Shield stats
   */
  getEntropyShieldStats() {
    return this.entropyShield.getStats();
  },

  // ============================================
  // SENSORY TOOLKIT API
  // ============================================

  /**
   * Get sensory profile for a person
   */
  getSensoryProfile(personId) {
    if (!this.sensoryToolkit) {
      return { error: 'Sensory Toolkit not enabled' };
    }
    return this.sensoryToolkit.getProfile(personId);
  },

  /**
   * Update sensory preferences
   */
  updateSensoryPreferences(personId, preferences) {
    if (!this.sensoryToolkit) {
      return { error: 'Sensory Toolkit not enabled' };
    }
    return this.sensoryToolkit.updateProfile(personId, preferences);
  },

  /**
   * Get regulation tools for current arousal level
   */
  getRegulationTools(personId, arousalLevel) {
    if (!this.sensoryToolkit) {
      return { error: 'Sensory Toolkit not enabled' };
    }
    return this.sensoryToolkit.getToolsForArousal(personId, arousalLevel);
  },

  /**
   * Use a sensory regulation tool
   */
  useRegulationTool(personId, toolId) {
    if (!this.sensoryToolkit) {
      return { error: 'Sensory Toolkit not enabled' };
    }
    return this.sensoryToolkit.useTool(personId, toolId);
  },

  /**
   * Generate sensory diet for the day
   */
  generateSensoryDiet(personId) {
    if (!this.sensoryToolkit) {
      return { error: 'Sensory Toolkit not enabled' };
    }
    return this.sensoryToolkit.generateSensoryDiet(personId);
  },

  /**
   * Log sensory experience
   */
  logSensoryExperience(personId, experience) {
    if (!this.sensoryToolkit) {
      return { error: 'Sensory Toolkit not enabled' };
    }
    return this.sensoryToolkit.logExperience(personId, experience);
  },

  // ============================================
  // UNIVERSAL TRANSLATOR API
  // ============================================

  /**
   * Create communication profile
   */
  createCommunicationProfile(profileData) {
    if (!this.universalTranslator) {
      return { error: 'Universal Translator not enabled' };
    }
    return this.universalTranslator.createProfile(profileData);
  },

  /**
   * Create communication bridge between two profiles
   */
  createCommunicationBridge(profile1Id, profile2Id) {
    if (!this.universalTranslator) {
      return { error: 'Universal Translator not enabled' };
    }
    return this.universalTranslator.createBridge(profile1Id, profile2Id);
  },

  /**
   * Translate message between neurotypes
   */
  translateMessage(fromProfileId, toProfileId, message, context = {}) {
    if (!this.universalTranslator) {
      return { error: 'Universal Translator not enabled' };
    }
    return this.universalTranslator.translate(fromProfileId, toProfileId, message, context);
  },

  /**
   * Get communication tips for interaction
   */
  getCommunicationTips(fromProfileId, toProfileId) {
    if (!this.universalTranslator) {
      return { error: 'Universal Translator not enabled' };
    }
    return this.universalTranslator.getTips(fromProfileId, toProfileId);
  },

  /**
   * Analyze interaction for conflict patterns
   */
  analyzeInteraction(interactionData) {
    if (!this.universalTranslator) {
      return { error: 'Universal Translator not enabled' };
    }
    return this.universalTranslator.analyzeInteraction(interactionData);
  },

  /**
   * Get repair strategy for conflict
   */
  getRepairStrategy(conflictPattern) {
    if (!this.universalTranslator) {
      return { error: 'Universal Translator not enabled' };
    }
    return this.universalTranslator.getRepairStrategy(conflictPattern);
  },

  /**
   * Simplify message based on spoon level
   */
  simplifyMessage(message, spoonLevel) {
    if (!this.universalTranslator) {
      return { error: 'Universal Translator not enabled' };
    }
    return this.universalTranslator.simplifyForSpoons(message, spoonLevel);
  },

  /**
   * Get GenSync Human OS compatibility
   */
  getGenSyncCompatibility(profileId) {
    if (!this.universalTranslator) {
      return { error: 'Universal Translator not enabled' };
    }
    return this.universalTranslator.getGenSyncMapping(profileId);
  },

  /**
   * Get comprehensive status
   */
  getStatus() {
    const spoonStatus = this.spoonManager?.getStatus() || null;
    const iotStatus = this.iot?.getStatus() || null;
    const biometricStatus = this.biometricStream?.getCurrentState() || null;
    const phenixStatus = this.phenixBridge?.getState() || null;
    const familyStatus = this.familyQuest?.getStats() || null;
    
    return {
      healthy: true,
      ...this.status,
      spoons: spoonStatus,
      iot: iotStatus,
      biometrics: biometricStatus,
      phenixNavigator: phenixStatus,
      familyQuest: familyStatus,
      proofOfCare: this.proofOfCare?.getStats() || null,
      entropyShield: this.entropyShield?.getStats() || null,
      careSession: this.getCareSessionStatus(),
      connectedDevices: this.getConnectedDevices().length,
      lastCheck: Date.now()
    };
  },

  /**
   * Subscribe to events
   */
  on(event, cb) {
    if (this.spoonManager) {
      this.spoonManager.on(event, cb);
    }
    if (this.biometricStream) {
      this.biometricStream.on(event, cb);
    }
    if (this.phenixBridge) {
      this.phenixBridge.on(event, cb);
    }
    return () => {}; // Unsubscribe stub
  },

  /**
   * Graceful shutdown
   */
  async shutdown() {
    console.log('[LOVE] Shutting down...');
    
    if (this.biometricStream) {
      await this.biometricStream.stopStreaming();
    }
    
    if (this.calendar) {
      // Calendar doesn't have stopAutoSync method
      console.log('[LOVE] Calendar shutdown complete');
    }
    
    if (this.phenixBridge) {
      await this.phenixBridge.disconnect();
    }
    
    if (this.iot) {
      await this.iot.shutdown();
    }
    
    console.log('[LOVE] Shutdown complete');
  }
};

// Standalone mode
if (require.main === module) {
  // CLI entrypoint
  require('./cli');
}

module.exports = loveEconomy;