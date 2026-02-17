/**
 * IOT MANAGER - Unified Smart Home Orchestration System
 * L.O.V.E. Economy v4.0.0 - WONKY QUANTUM REFACTOR
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱🏠
 * 
 * Central hub for all IoT device management:
 * - Unified device registry across all providers
 * - Scene management with spoon-aware automations
 * - Shield mode orchestration
 * - Device health monitoring and failover
 * - Event-driven architecture for cross-module integration
 * - Cognitive state-aware environmental control
 */

const EventEmitter = require('events');

// ============================================================================
// CONFIGURATION
// ============================================================================

const IOT_MANAGER_CONFIG = {
  // Provider priority (first available wins)
  PROVIDER_PRIORITY: ['homeassistant', 'hue', 'govee', 'smartthings', 'ifttt'],
  
  // Device categories
  DEVICE_CATEGORIES: {
    LIGHTS: 'lights',
    CLIMATE: 'climate',
    MEDIA: 'media',
    SWITCHES: 'switches',
    SENSORS: 'sensors',
    SPEAKERS: 'speakers',
    BLINDS: 'blinds'
  },
  
  // Spoon level thresholds for automation
  SPOON_THRESHOLDS: {
    CRITICAL: 2,      // Emergency mode
    LOW: 5,           // Shield mode
    MODERATE: 8,      // Reduced stimulation
    GOOD: 10,         // Normal operation
    OPTIMAL: 12       // Full capability
  },
  
  // Scene definitions for cognitive states
  COGNITIVE_SCENES: {
    SHIELD: {
      name: 'Shield Mode',
      description: 'Low stimulation protective environment',
      lights: { brightness: 20, colorTemp: 500, color: [255, 150, 100] },
      climate: { tempOffset: 2 },
      media: { maxVolume: 0.3 },
      blinds: 'closed'
    },
    RECOVERY: {
      name: 'Recovery Mode',
      description: 'Gentle environment for spoon restoration',
      lights: { brightness: 40, colorTemp: 400, color: [200, 220, 255] },
      climate: { tempOffset: 1 },
      media: { maxVolume: 0.4 },
      blinds: 'partial'
    },
    FOCUS: {
      name: 'Focus Mode',
      description: 'Optimal environment for concentration',
      lights: { brightness: 70, colorTemp: 350, color: [255, 255, 240] },
      climate: { tempOffset: 0 },
      media: { maxVolume: 0.2 },
      blinds: 'open'
    },
    NORMAL: {
      name: 'Normal Mode',
      description: 'Standard daily operation',
      lights: { brightness: 80, colorTemp: 320, color: [255, 255, 255] },
      climate: { tempOffset: 0 },
      media: { maxVolume: 0.7 },
      blinds: 'open'
    },
    ENERGIZE: {
      name: 'Energize Mode',
      description: 'Stimulating environment for alertness',
      lights: { brightness: 100, colorTemp: 250, color: [255, 255, 255] },
      climate: { tempOffset: -1 },
      media: { maxVolume: 0.8 },
      blinds: 'open'
    },
    CALM: {
      name: 'Calm Down',
      description: 'Emergency calming environment',
      lights: { brightness: 10, colorTemp: 500, color: [255, 100, 50] },
      climate: { tempOffset: 2 },
      media: { maxVolume: 0 },
      blinds: 'closed'
    },
    SLEEP: {
      name: 'Sleep Mode',
      description: 'Optimal sleep environment',
      lights: { brightness: 0, colorTemp: 500, color: [0, 0, 0] },
      climate: { tempOffset: -2 },
      media: { maxVolume: 0 },
      blinds: 'closed'
    }
  },
  
  // Color mappings for spoon levels
  SPOON_COLORS: {
    CRITICAL: { r: 255, g: 0, b: 0 },       // Red
    LOW: { r: 255, g: 100, b: 0 },          // Orange
    MODERATE: { r: 255, g: 200, b: 0 },     // Yellow
    GOOD: { r: 100, g: 255, b: 100 },       // Light green
    OPTIMAL: { r: 0, g: 255, b: 100 }       // Green
  },
  
  // Health check intervals
  HEALTH_CHECK_INTERVAL_MS: 60000,     // 1 minute
  RECONNECT_INTERVAL_MS: 30000,        // 30 seconds
  MAX_RECONNECT_ATTEMPTS: 5,
  
  // Rate limiting
  MIN_COMMAND_INTERVAL_MS: 100,        // Minimum time between commands
  BATCH_DELAY_MS: 50,                  // Delay between batch commands
  
  // Logging
  LOG_LEVEL: 'info',                   // debug | info | warn | error
  MAX_LOG_ENTRIES: 1000
};

// ============================================================================
// DEVICE REGISTRY CLASS
// ============================================================================

/**
 * Unified device registry across all providers
 */
class DeviceRegistry {
  constructor() {
    this.devices = new Map();
    this.byCategory = new Map();
    this.byProvider = new Map();
    this.byRoom = new Map();
  }
  
  /**
   * Register a device
   */
  register(device) {
    const id = device.id || `${device.provider}_${device.deviceId}`;
    
    const entry = {
      id,
      deviceId: device.deviceId,
      provider: device.provider,
      category: device.category,
      name: device.name || id,
      room: device.room || 'unknown',
      capabilities: device.capabilities || [],
      state: device.state || {},
      lastSeen: Date.now(),
      healthy: true,
      metadata: device.metadata || {}
    };
    
    this.devices.set(id, entry);
    
    // Index by category
    if (!this.byCategory.has(entry.category)) {
      this.byCategory.set(entry.category, new Set());
    }
    this.byCategory.get(entry.category).add(id);
    
    // Index by provider
    if (!this.byProvider.has(entry.provider)) {
      this.byProvider.set(entry.provider, new Set());
    }
    this.byProvider.get(entry.provider).add(id);
    
    // Index by room
    if (!this.byRoom.has(entry.room)) {
      this.byRoom.set(entry.room, new Set());
    }
    this.byRoom.get(entry.room).add(id);
    
    return entry;
  }
  
  /**
   * Update device state
   */
  updateState(id, state) {
    const device = this.devices.get(id);
    if (device) {
      device.state = { ...device.state, ...state };
      device.lastSeen = Date.now();
      return device;
    }
    return null;
  }
  
  /**
   * Mark device as unhealthy
   */
  markUnhealthy(id, reason) {
    const device = this.devices.get(id);
    if (device) {
      device.healthy = false;
      device.unhealthyReason = reason;
      device.unhealthySince = Date.now();
    }
  }
  
  /**
   * Get devices by category
   */
  getByCategory(category) {
    const ids = this.byCategory.get(category) || new Set();
    return Array.from(ids).map(id => this.devices.get(id)).filter(Boolean);
  }
  
  /**
   * Get devices by provider
   */
  getByProvider(provider) {
    const ids = this.byProvider.get(provider) || new Set();
    return Array.from(ids).map(id => this.devices.get(id)).filter(Boolean);
  }
  
  /**
   * Get devices by room
   */
  getByRoom(room) {
    const ids = this.byRoom.get(room) || new Set();
    return Array.from(ids).map(id => this.devices.get(id)).filter(Boolean);
  }
  
  /**
   * Get all devices
   */
  getAll() {
    return Array.from(this.devices.values());
  }
  
  /**
   * Get healthy devices only
   */
  getHealthy() {
    return this.getAll().filter(d => d.healthy);
  }
  
  /**
   * Get device by ID
   */
  get(id) {
    return this.devices.get(id);
  }
  
  /**
   * Remove device
   */
  remove(id) {
    const device = this.devices.get(id);
    if (device) {
      this.byCategory.get(device.category)?.delete(id);
      this.byProvider.get(device.provider)?.delete(id);
      this.byRoom.get(device.room)?.delete(id);
      this.devices.delete(id);
    }
  }
  
  /**
   * Get statistics
   */
  getStats() {
    const all = this.getAll();
    const healthy = all.filter(d => d.healthy);
    
    const byCategory = {};
    for (const [cat, ids] of this.byCategory) {
      byCategory[cat] = ids.size;
    }
    
    const byProvider = {};
    for (const [prov, ids] of this.byProvider) {
      byProvider[prov] = ids.size;
    }
    
    return {
      total: all.length,
      healthy: healthy.length,
      unhealthy: all.length - healthy.length,
      byCategory,
      byProvider,
      rooms: this.byRoom.size
    };
  }
}

// ============================================================================
// SCENE MANAGER CLASS
// ============================================================================

/**
 * Manages scenes and automations
 */
class SceneManager {
  constructor(iotManager) {
    this.iotManager = iotManager;
    this.customScenes = new Map();
    this.activeScene = null;
    this.sceneHistory = [];
  }
  
  /**
   * Register a custom scene
   */
  registerScene(sceneId, config) {
    this.customScenes.set(sceneId, {
      id: sceneId,
      ...config,
      createdAt: Date.now()
    });
  }
  
  /**
   * Get all available scenes
   */
  getAvailableScenes() {
    const builtin = Object.entries(IOT_MANAGER_CONFIG.COGNITIVE_SCENES).map(([id, config]) => ({
      id,
      ...config,
      type: 'builtin'
    }));
    
    const custom = Array.from(this.customScenes.values()).map(s => ({
      ...s,
      type: 'custom'
    }));
    
    return [...builtin, ...custom];
  }
  
  /**
   * Activate a scene
   */
  async activateScene(sceneId, options = {}) {
    const scene = IOT_MANAGER_CONFIG.COGNITIVE_SCENES[sceneId] || this.customScenes.get(sceneId);
    
    if (!scene) {
      return { success: false, error: 'Scene not found' };
    }
    
    const previousScene = this.activeScene;
    this.activeScene = sceneId;
    
    const results = {
      scene: sceneId,
      actions: [],
      errors: []
    };
    
    // Apply light settings
    if (scene.lights) {
      try {
        await this.iotManager.setAllLights(scene.lights, options.rooms);
        results.actions.push('lights');
      } catch (error) {
        results.errors.push({ component: 'lights', error: error.message });
      }
    }
    
    // Apply climate settings
    if (scene.climate) {
      try {
        await this.iotManager.adjustClimate(scene.climate);
        results.actions.push('climate');
      } catch (error) {
        results.errors.push({ component: 'climate', error: error.message });
      }
    }
    
    // Apply media settings
    if (scene.media) {
      try {
        await this.iotManager.setMediaVolume(scene.media.maxVolume);
        results.actions.push('media');
      } catch (error) {
        results.errors.push({ component: 'media', error: error.message });
      }
    }
    
    // Apply blinds settings
    if (scene.blinds) {
      try {
        await this.iotManager.setBlinds(scene.blinds);
        results.actions.push('blinds');
      } catch (error) {
        results.errors.push({ component: 'blinds', error: error.message });
      }
    }
    
    // Record history
    this.sceneHistory.push({
      sceneId,
      previousScene,
      activatedAt: Date.now(),
      success: results.errors.length === 0
    });
    
    // Keep history bounded
    if (this.sceneHistory.length > 100) {
      this.sceneHistory = this.sceneHistory.slice(-50);
    }
    
    this.iotManager.emit('scene_activated', {
      sceneId,
      previousScene,
      results
    });
    
    return { success: true, results };
  }
  
  /**
   * Get current active scene
   */
  getActiveScene() {
    return this.activeScene;
  }
}

// ============================================================================
// MAIN IOT MANAGER CLASS
// ============================================================================

/**
 * Central IoT orchestration hub
 */
class IoTManager extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...IOT_MANAGER_CONFIG, ...config };
    
    // Device registry
    this.registry = new DeviceRegistry();
    
    // Scene manager
    this.sceneManager = new SceneManager(this);
    
    // Provider instances
    this.providers = {
      hue: null,
      govee: null,
      ifttt: null,
      smartthings: null,
      homeAssistant: null
    };
    
    // State
    this.initialized = false;
    this.shieldActive = false;
    this.currentSpoons = 12;
    this.maxSpoons = 12;
    
    // Command queue for rate limiting
    this.commandQueue = [];
    this.processingQueue = false;
    
    // Health monitoring
    this.healthCheckInterval = null;
    this.reconnectAttempts = {};
    
    // Logging
    this.logs = [];
    
    // Stats
    this.stats = {
      commandsSent: 0,
      commandsFailed: 0,
      scenesActivated: 0,
      healthChecks: 0,
      reconnections: 0
    };
    
    this._log('info', 'IoTManager created');
  }
  
  // ============================================
  // INITIALIZATION
  // ============================================
  
  /**
   * Initialize all IoT providers and connections
   */
  async initialize(providerConfigs = {}) {
    this._log('info', 'Initializing IoT Manager...');
    
    const results = {
      hue: false,
      govee: false,
      ifttt: false,
      smartthings: false,
      homeAssistant: false
    };
    
    // Initialize Hue
    if (providerConfigs.hue) {
      try {
        const HueController = require('./hue');
        this.providers.hue = new HueController(providerConfigs.hue);
        if (this.providers.hue.enabled) {
          await this._discoverHueDevices();
          results.hue = true;
          this._log('info', 'Hue initialized');
        }
      } catch (error) {
        this._log('error', `Hue init failed: ${error.message}`);
      }
    }
    
    // Initialize Govee
    if (providerConfigs.govee) {
      try {
        const GoveeController = require('./govee');
        this.providers.govee = new GoveeController(providerConfigs.govee);
        if (this.providers.govee.enabled) {
          await this._discoverGoveeDevices();
          results.govee = true;
          this._log('info', 'Govee initialized');
        }
      } catch (error) {
        this._log('error', `Govee init failed: ${error.message}`);
      }
    }
    
    // Initialize IFTTT
    if (providerConfigs.ifttt) {
      try {
        const IFTTTController = require('./ifttt');
        this.providers.ifttt = new IFTTTController(providerConfigs.ifttt);
        results.ifttt = this.providers.ifttt.enabled;
        if (results.ifttt) {
          this._log('info', 'IFTTT initialized');
        }
      } catch (error) {
        this._log('error', `IFTTT init failed: ${error.message}`);
      }
    }
    
    // Initialize SmartThings
    if (providerConfigs.smartthings) {
      try {
        const SmartThingsController = require('./smartthings');
        this.providers.smartthings = new SmartThingsController(providerConfigs.smartthings);
        if (this.providers.smartthings.enabled) {
          await this._discoverSmartThingsDevices();
          results.smartthings = true;
          this._log('info', 'SmartThings initialized');
        }
      } catch (error) {
        this._log('error', `SmartThings init failed: ${error.message}`);
      }
    }
    
    // Initialize Home Assistant
    if (providerConfigs.homeAssistant?.enabled) {
      try {
        const { HomeAssistantAdapter } = require('./homeassistant');
        this.providers.homeAssistant = new HomeAssistantAdapter(providerConfigs.homeAssistant);
        await this.providers.homeAssistant.connect();
        await this._importHomeAssistantDevices();
        results.homeAssistant = true;
        this._log('info', 'Home Assistant initialized');
        
        // Listen for state changes
        this.providers.homeAssistant.on('stateChanged', (data) => {
          this._handleProviderStateChange('homeAssistant', data);
        });
      } catch (error) {
        this._log('error', `Home Assistant init failed: ${error.message}`);
      }
    }
    
    // Start health monitoring
    this._startHealthMonitoring();
    
    this.initialized = true;
    this.emit('initialized', { results, deviceCount: this.registry.getAll().length });
    
    this._log('info', `Initialization complete. ${this.registry.getAll().length} devices registered.`);
    
    return results;
  }
  
  // ============================================
  // DEVICE DISCOVERY
  // ============================================
  
  async _discoverHueDevices() {
    // In production, would query Hue bridge for lights
    // For now, register placeholder
    this._log('debug', 'Discovering Hue devices...');
  }
  
  async _discoverGoveeDevices() {
    // In production, would query Govee API for devices
    this._log('debug', 'Discovering Govee devices...');
  }
  
  async _discoverSmartThingsDevices() {
    // In production, would query SmartThings API
    this._log('debug', 'Discovering SmartThings devices...');
  }
  
  async _importHomeAssistantDevices() {
    if (!this.providers.homeAssistant) return;
    
    const entities = Array.from(this.providers.homeAssistant.entities.values());
    
    for (const entity of entities) {
      const category = this._mapDomainToCategory(entity.domain);
      if (category) {
        this.registry.register({
          deviceId: entity.entityId,
          provider: 'homeAssistant',
          category,
          name: entity.attributes?.friendly_name || entity.entityId,
          room: entity.attributes?.area_id || 'unknown',
          capabilities: this._getCapabilitiesForDomain(entity.domain),
          state: { value: entity.state, ...entity.attributes }
        });
      }
    }
    
    this._log('info', `Imported ${entities.length} Home Assistant entities`);
  }
  
  _mapDomainToCategory(domain) {
    const mapping = {
      'light': IOT_MANAGER_CONFIG.DEVICE_CATEGORIES.LIGHTS,
      'climate': IOT_MANAGER_CONFIG.DEVICE_CATEGORIES.CLIMATE,
      'media_player': IOT_MANAGER_CONFIG.DEVICE_CATEGORIES.MEDIA,
      'switch': IOT_MANAGER_CONFIG.DEVICE_CATEGORIES.SWITCHES,
      'sensor': IOT_MANAGER_CONFIG.DEVICE_CATEGORIES.SENSORS,
      'cover': IOT_MANAGER_CONFIG.DEVICE_CATEGORIES.BLINDS
    };
    return mapping[domain] || null;
  }
  
  _getCapabilitiesForDomain(domain) {
    const capabilities = {
      'light': ['on_off', 'brightness', 'color', 'color_temp'],
      'climate': ['temperature', 'hvac_mode', 'fan_mode'],
      'media_player': ['play', 'pause', 'volume', 'mute'],
      'switch': ['on_off'],
      'cover': ['open', 'close', 'position']
    };
    return capabilities[domain] || [];
  }
  
  // ============================================
  // ENVIRONMENT SYNC (Main Entry Point)
  // ============================================
  
  /**
   * Sync environment based on spoon state and biometrics
   */
  async syncEnvironment(spoonData, biometrics = {}) {
    const { currentSpoons, maxSpoons, shieldActive } = spoonData;
    
    this.currentSpoons = currentSpoons;
    this.maxSpoons = maxSpoons;
    this.shieldActive = shieldActive;
    
    // Determine cognitive scene based on state
    let targetScene;
    const spoonPercent = (currentSpoons / maxSpoons) * 100;
    
    if (shieldActive || spoonPercent < 20) {
      targetScene = 'SHIELD';
    } else if (spoonPercent < 40) {
      targetScene = 'RECOVERY';
    } else if (spoonPercent < 60) {
      targetScene = 'FOCUS';
    } else if (spoonPercent < 80) {
      targetScene = 'NORMAL';
    } else {
      targetScene = 'ENERGIZE';
    }
    
    // Check biometrics for override
    if (biometrics.stress && biometrics.stress > 80) {
      targetScene = 'CALM';
    }
    
    // Activate scene
    const result = await this.sceneManager.activateScene(targetScene);
    
    // Send notifications via IFTTT if shield activated
    if (shieldActive && this.providers.ifttt?.enabled) {
      await this.providers.ifttt.sendShieldNotification(true, currentSpoons);
    }
    
    this.emit('environment_synced', {
      scene: targetScene,
      spoonPercent,
      shieldActive,
      result
    });
    
    return result;
  }
  
  // ============================================
  // DEVICE CONTROL
  // ============================================
  
  /**
   * Set all lights to specified settings
   */
  async setAllLights(settings, rooms = null) {
    const lights = rooms 
      ? rooms.flatMap(r => this.registry.getByRoom(r))
             .filter(d => d.category === IOT_MANAGER_CONFIG.DEVICE_CATEGORIES.LIGHTS)
      : this.registry.getByCategory(IOT_MANAGER_CONFIG.DEVICE_CATEGORIES.LIGHTS);
    
    const actions = [];
    
    for (const light of lights) {
      if (!light.healthy) continue;
      
      const action = this._createLightCommand(light, settings);
      if (action) {
        actions.push(this._executeCommand(action));
      }
    }
    
    await Promise.all(actions);
    return { lightsUpdated: actions.length };
  }
  
  _createLightCommand(light, settings) {
    switch (light.provider) {
      case 'homeAssistant':
        return {
          provider: 'homeAssistant',
          service: 'light.turn_on',
          data: {
            entity_id: light.deviceId,
            brightness_pct: settings.brightness,
            color_temp: settings.colorTemp,
            transition: 2
          }
        };
      case 'hue':
        return {
          provider: 'hue',
          action: 'setState',
          deviceId: light.deviceId,
          state: {
            on: settings.brightness > 0,
            bri: Math.round(settings.brightness * 2.54),
            ct: settings.colorTemp
          }
        };
      case 'govee':
        return {
          provider: 'govee',
          action: 'setColor',
          deviceId: light.deviceId,
          color: settings.color
        };
      default:
        return null;
    }
  }
  
  /**
   * Adjust climate settings
   */
  async adjustClimate(settings) {
    const climateDevices = this.registry.getByCategory(IOT_MANAGER_CONFIG.DEVICE_CATEGORIES.CLIMATE);
    
    for (const device of climateDevices) {
      if (!device.healthy) continue;
      
      const currentTemp = device.state?.temperature || 70;
      const targetTemp = currentTemp + (settings.tempOffset || 0);
      
      await this._executeCommand({
        provider: device.provider,
        service: 'climate.set_temperature',
        data: {
          entity_id: device.deviceId,
          temperature: targetTemp
        }
      });
    }
  }
  
  /**
   * Set media volume
   */
  async setMediaVolume(maxVolume) {
    const mediaDevices = this.registry.getByCategory(IOT_MANAGER_CONFIG.DEVICE_CATEGORIES.MEDIA);
    
    for (const device of mediaDevices) {
      if (!device.healthy) continue;
      
      const currentVolume = device.state?.volume_level || 0.5;
      const targetVolume = Math.min(currentVolume, maxVolume);
      
      await this._executeCommand({
        provider: device.provider,
        service: 'media_player.volume_set',
        data: {
          entity_id: device.deviceId,
          volume_level: targetVolume
        }
      });
    }
  }
  
  /**
   * Set blinds position
   */
  async setBlinds(position) {
    const blindsDevices = this.registry.getByCategory(IOT_MANAGER_CONFIG.DEVICE_CATEGORIES.BLINDS);
    
    const positionMap = {
      'open': 100,
      'partial': 50,
      'closed': 0
    };
    
    const targetPosition = positionMap[position] ?? position;
    
    for (const device of blindsDevices) {
      if (!device.healthy) continue;
      
      await this._executeCommand({
        provider: device.provider,
        service: 'cover.set_cover_position',
        data: {
          entity_id: device.deviceId,
          position: targetPosition
        }
      });
    }
  }
  
  // ============================================
  // COMMAND EXECUTION
  // ============================================
  
  async _executeCommand(command) {
    this.stats.commandsSent++;
    
    try {
      switch (command.provider) {
        case 'homeAssistant':
          if (this.providers.homeAssistant) {
            const [domain, service] = command.service.split('.');
            await this.providers.homeAssistant.callHAService(domain, service, command.data);
          }
          break;
          
        case 'hue':
          if (this.providers.hue) {
            await this.providers.hue[command.action](command.deviceId, command.state);
          }
          break;
          
        case 'govee':
          if (this.providers.govee) {
            await this.providers.govee.setColor(command.deviceId, command.color);
          }
          break;
          
        case 'smartthings':
          if (this.providers.smartthings) {
            await this.providers.smartthings.executeCommand(command);
          }
          break;
          
        case 'ifttt':
          if (this.providers.ifttt) {
            await this.providers.ifttt.trigger(command.event, ...command.values);
          }
          break;
      }
      
      return { success: true, command };
    } catch (error) {
      this.stats.commandsFailed++;
      this._log('error', `Command failed: ${error.message}`, command);
      return { success: false, error: error.message, command };
    }
  }
  
  // ============================================
  // HEALTH MONITORING
  // ============================================
  
  _startHealthMonitoring() {
    this.healthCheckInterval = setInterval(() => {
      this._performHealthCheck();
    }, this.config.HEALTH_CHECK_INTERVAL_MS);
    
    this._log('info', 'Health monitoring started');
  }
  
  async _performHealthCheck() {
    this.stats.healthChecks++;
    
    const unhealthy = [];
    
    // Check Home Assistant connection
    if (this.providers.homeAssistant) {
      try {
        const status = this.providers.homeAssistant.getStatusForDashboard();
        if (!status.connected) {
          unhealthy.push('homeAssistant');
          this._attemptReconnect('homeAssistant');
        }
      } catch (error) {
        unhealthy.push('homeAssistant');
      }
    }
    
    // Emit health status
    if (unhealthy.length > 0) {
      this.emit('health_issue', { unhealthyProviders: unhealthy });
    }
  }
  
  async _attemptReconnect(provider) {
    const attempts = this.reconnectAttempts[provider] || 0;
    
    if (attempts >= this.config.MAX_RECONNECT_ATTEMPTS) {
      this._log('error', `Max reconnect attempts reached for ${provider}`);
      return;
    }
    
    this.reconnectAttempts[provider] = attempts + 1;
    this.stats.reconnections++;
    
    try {
      if (provider === 'homeAssistant' && this.providers.homeAssistant) {
        await this.providers.homeAssistant.connect();
        this.reconnectAttempts[provider] = 0;
        this._log('info', `Reconnected to ${provider}`);
      }
    } catch (error) {
      this._log('error', `Reconnect failed for ${provider}: ${error.message}`);
    }
  }
  
  _handleProviderStateChange(provider, data) {
    // Update registry
    const deviceId = data.entityId;
    const device = this.registry.get(`${provider}_${deviceId}`) || 
                   this.registry.get(deviceId);
    
    if (device) {
      this.registry.updateState(device.id, { value: data.newState, ...data.attributes });
    }
    
    this.emit('device_state_changed', { provider, ...data });
  }
  
  // ============================================
  // LOGGING
  // ============================================
  
  _log(level, message, data = null) {
    const levels = ['debug', 'info', 'warn', 'error'];
    const configLevel = levels.indexOf(this.config.LOG_LEVEL);
    const msgLevel = levels.indexOf(level);
    
    if (msgLevel >= configLevel) {
      const entry = {
        timestamp: Date.now(),
        level,
        message,
        data
      };
      
      this.logs.push(entry);
      
      // Keep logs bounded
      if (this.logs.length > this.config.MAX_LOG_ENTRIES) {
        this.logs = this.logs.slice(-Math.floor(this.config.MAX_LOG_ENTRIES / 2));
      }
      
      // Console output
      const prefix = `[IoTManager]`;
      switch (level) {
        case 'error':
          console.error(prefix, message, data || '');
          break;
        case 'warn':
          console.warn(prefix, message, data || '');
          break;
        default:
          console.log(prefix, message, data || '');
      }
    }
  }
  
  // ============================================
  // STATUS & STATS
  // ============================================
  
  /**
   * Get provider status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      shieldActive: this.shieldActive,
      currentScene: this.sceneManager.getActiveScene(),
      providers: {
        hue: this.providers.hue?.enabled || false,
        govee: this.providers.govee?.enabled || false,
        ifttt: this.providers.ifttt?.enabled || false,
        smartthings: this.providers.smartthings?.enabled || false,
        homeAssistant: this.providers.homeAssistant?.getStatusForDashboard() || { connected: false }
      },
      devices: this.registry.getStats()
    };
  }
  
  /**
   * Get comprehensive statistics
   */
  getStats() {
    return {
      ...this.stats,
      initialized: this.initialized,
      uptime: this.initialized ? Date.now() - this._startTime : 0,
      devices: this.registry.getStats(),
      scenes: {
        active: this.sceneManager.getActiveScene(),
        available: this.sceneManager.getAvailableScenes().length,
        history: this.sceneManager.sceneHistory.length
      },
      providers: {
        active: Object.entries(this.providers)
          .filter(([_, p]) => p?.enabled || p?.getStatusForDashboard?.()?.connected)
          .map(([name]) => name)
      },
      logs: {
        total: this.logs.length,
        errors: this.logs.filter(l => l.level === 'error').length
      }
    };
  }
  
  /**
   * Get recent logs
   */
  getLogs(limit = 50, level = null) {
    let logs = this.logs;
    if (level) {
      logs = logs.filter(l => l.level === level);
    }
    return logs.slice(-limit);
  }
  
  /**
   * Get all devices
   */
  getDevices() {
    return this.registry.getAll();
  }
  
  /**
   * Get Home Assistant entities for dashboard
   */
  getHomeAssistantEntities() {
    if (!this.providers.homeAssistant) return [];
    return Array.from(this.providers.homeAssistant.entities.values());
  }
  
  /**
   * Direct Home Assistant service call
   */
  async callHomeAssistantService(domain, service, data) {
    if (!this.providers.homeAssistant) {
      throw new Error('Home Assistant not configured');
    }
    return this.providers.homeAssistant.callHAService(domain, service, data);
  }
  
  // ============================================
  // CLEANUP
  // ============================================
  
  /**
   * Shutdown and cleanup
   */
  async shutdown() {
    this._log('info', 'Shutting down IoT Manager...');
    
    // Stop health monitoring
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    
    // Disconnect Home Assistant
    if (this.providers.homeAssistant) {
      await this.providers.homeAssistant.disconnect();
    }
    
    this.initialized = false;
    this.emit('shutdown');
    
    this._log('info', 'IoT Manager shutdown complete');
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  IOT_MANAGER_CONFIG,
  DeviceRegistry,
  SceneManager,
  IoTManager
};

// Default export for backwards compatibility
module.exports.default = IoTManager;