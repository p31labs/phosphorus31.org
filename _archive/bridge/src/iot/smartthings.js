/**
 * SMARTTHINGS CONTROLLER - Samsung SmartThings Integration
 * L.O.V.E. Economy v4.0.0 - WONKY QUANTUM REFACTOR
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱📱
 * 
 * Full SmartThings Cloud API implementation:
 * - Device discovery and control
 * - Scene execution
 * - Automation rules
 * - Spoon-based routines
 * - Shield mode integration
 * - Multi-location support
 */

const EventEmitter = require('events');

// ============================================================================
// CONFIGURATION
// ============================================================================

const SMARTTHINGS_CONFIG = {
  // API Settings
  API_BASE_URL: 'https://api.smartthings.com/v1',
  
  // Rate limiting
  RATE_LIMIT_MS: 250,          // 4 requests/second
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  
  // Health monitoring
  HEALTH_CHECK_INTERVAL_MS: 60000,
  
  // Capability mappings
  CAPABILITIES: {
    switch: ['on', 'off'],
    switchLevel: ['setLevel'],
    colorControl: ['setColor', 'setHue', 'setSaturation'],
    colorTemperature: ['setColorTemperature'],
    thermostat: ['setHeatingSetpoint', 'setCoolingSetpoint'],
    mediaPlayback: ['play', 'pause', 'stop'],
    audioVolume: ['setVolume', 'mute', 'unmute']
  },
  
  // Spoon-based scene mappings
  SPOON_SCENES: {
    CRITICAL: 'shield_emergency',
    LOW: 'shield_active',
    MODERATE: 'recovery_mode',
    GOOD: 'normal_mode',
    OPTIMAL: 'energize_mode'
  },
  
  // Cognitive state device settings
  COGNITIVE_SETTINGS: {
    SHIELD: { level: 20, colorTemp: 2700 },
    RECOVERY: { level: 40, colorTemp: 3000 },
    FOCUS: { level: 70, colorTemp: 4000 },
    NORMAL: { level: 80, colorTemp: 3500 },
    ENERGIZE: { level: 100, colorTemp: 5000 },
    CALM: { level: 10, colorTemp: 2200 },
    SLEEP: { level: 0, colorTemp: 2000 }
  }
};

// ============================================================================
// SMARTTHINGS DEVICE CLASS
// ============================================================================

/**
 * Represents a SmartThings device
 */
class SmartThingsDevice {
  constructor(data) {
    this.deviceId = data.deviceId;
    this.name = data.name || data.label || 'Unknown Device';
    this.label = data.label;
    this.locationId = data.locationId;
    this.roomId = data.roomId;
    
    // Device type info
    this.deviceTypeName = data.deviceTypeName;
    this.deviceManufacturerCode = data.deviceManufacturerCode;
    
    // Capabilities
    this.capabilities = data.components?.[0]?.capabilities?.map(c => c.id) || [];
    this.components = data.components || [];
    
    // State
    this.state = {};
    
    this.lastUpdated = Date.now();
    this.reachable = true;
  }
  
  /**
   * Check if device has capability
   */
  hasCapability(capability) {
    return this.capabilities.includes(capability);
  }
  
  /**
   * Update device state
   */
  updateState(componentId, capabilityId, attribute, value) {
    if (!this.state[componentId]) {
      this.state[componentId] = {};
    }
    if (!this.state[componentId][capabilityId]) {
      this.state[componentId][capabilityId] = {};
    }
    this.state[componentId][capabilityId][attribute] = value;
    this.lastUpdated = Date.now();
  }
  
  /**
   * Get primary component state
   */
  getState(capabilityId, attribute) {
    return this.state?.main?.[capabilityId]?.[attribute];
  }
  
  toJSON() {
    return {
      deviceId: this.deviceId,
      name: this.name,
      label: this.label,
      locationId: this.locationId,
      roomId: this.roomId,
      capabilities: this.capabilities,
      state: this.state,
      reachable: this.reachable
    };
  }
}

// ============================================================================
// MAIN SMARTTHINGS CONTROLLER CLASS
// ============================================================================

/**
 * SmartThings Controller
 * Full Cloud API with L.O.V.E. Economy integration
 */
class SmartThingsController extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...SMARTTHINGS_CONFIG, ...config };
    
    // API token
    this.token = config.token || process.env.SMARTTHINGS_TOKEN;
    this.enabled = !!this.token;
    
    // Storage
    this.devices = new Map();
    this.locations = new Map();
    this.rooms = new Map();
    this.scenes = new Map();
    
    // Rate limiting
    this.lastRequest = 0;
    
    // Health monitoring
    this.healthCheckInterval = null;
    
    // Stats
    this.stats = {
      commandsSent: 0,
      commandsFailed: 0,
      scenesExecuted: 0,
      lastActivity: null
    };
    
    if (this.enabled) {
      console.log('[SmartThingsController] Initialized');
    }
  }
  
  // ============================================
  // INITIALIZATION
  // ============================================
  
  /**
   * Initialize - discover locations, rooms, and devices
   */
  async initialize() {
    if (!this.enabled) {
      return { success: false, error: 'Token not configured' };
    }
    
    try {
      // Discover locations
      await this._discoverLocations();
      
      // Discover rooms for each location
      for (const location of this.locations.values()) {
        await this._discoverRooms(location.locationId);
      }
      
      // Discover devices
      await this._discoverDevices();
      
      // Discover scenes
      await this._discoverScenes();
      
      // Start health monitoring
      this._startHealthCheck();
      
      this.emit('initialized', {
        locations: this.locations.size,
        rooms: this.rooms.size,
        devices: this.devices.size,
        scenes: this.scenes.size
      });
      
      return {
        success: true,
        locations: this.locations.size,
        devices: this.devices.size,
        scenes: this.scenes.size
      };
    } catch (error) {
      console.error('[SmartThingsController] Initialization failed:', error.message);
      return { success: false, error: error.message };
    }
  }
  
  // ============================================
  // API COMMUNICATION
  // ============================================
  
  /**
   * Make API request
   */
  async _apiRequest(method, endpoint, body = null) {
    // Rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    if (timeSinceLastRequest < this.config.RATE_LIMIT_MS) {
      await this._sleep(this.config.RATE_LIMIT_MS - timeSinceLastRequest);
    }
    this.lastRequest = Date.now();
    
    const url = `${this.config.API_BASE_URL}${endpoint}`;
    const options = {
      method,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }
      
      this.stats.commandsSent++;
      this.stats.lastActivity = Date.now();
      
      return response.json();
    } catch (error) {
      this.stats.commandsFailed++;
      throw error;
    }
  }
  
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // ============================================
  // DISCOVERY
  // ============================================
  
  /**
   * Discover locations
   */
  async _discoverLocations() {
    const response = await this._apiRequest('GET', '/locations');
    
    if (response?.items) {
      this.locations.clear();
      for (const loc of response.items) {
        this.locations.set(loc.locationId, {
          locationId: loc.locationId,
          name: loc.name,
          countryCode: loc.countryCode,
          timeZoneId: loc.timeZoneId
        });
      }
      console.log(`[SmartThingsController] Discovered ${this.locations.size} locations`);
    }
  }
  
  /**
   * Discover rooms for a location
   */
  async _discoverRooms(locationId) {
    const response = await this._apiRequest('GET', `/locations/${locationId}/rooms`);
    
    if (response?.items) {
      for (const room of response.items) {
        this.rooms.set(room.roomId, {
          roomId: room.roomId,
          locationId: room.locationId,
          name: room.name
        });
      }
    }
  }
  
  /**
   * Discover all devices
   */
  async _discoverDevices() {
    const response = await this._apiRequest('GET', '/devices');
    
    if (response?.items) {
      this.devices.clear();
      for (const deviceData of response.items) {
        const device = new SmartThingsDevice(deviceData);
        this.devices.set(device.deviceId, device);
      }
      console.log(`[SmartThingsController] Discovered ${this.devices.size} devices`);
    }
  }
  
  /**
   * Discover scenes
   */
  async _discoverScenes() {
    for (const location of this.locations.values()) {
      const response = await this._apiRequest('GET', `/scenes?locationId=${location.locationId}`);
      
      if (response?.items) {
        for (const scene of response.items) {
          this.scenes.set(scene.sceneId, {
            sceneId: scene.sceneId,
            sceneName: scene.sceneName,
            locationId: scene.locationId
          });
        }
      }
    }
    console.log(`[SmartThingsController] Discovered ${this.scenes.size} scenes`);
  }
  
  // ============================================
  // DEVICE CONTROL
  // ============================================
  
  /**
   * Send command to device
   */
  async sendCommand(deviceId, capability, command, args = []) {
    const device = this.devices.get(deviceId);
    if (!device) {
      return { success: false, error: 'Device not found' };
    }
    
    const body = {
      commands: [{
        component: 'main',
        capability,
        command,
        arguments: args
      }]
    };
    
    try {
      await this._apiRequest('POST', `/devices/${deviceId}/commands`, body);
      this.emit('command_sent', { deviceId, capability, command, args });
      return { success: true };
    } catch (error) {
      console.error(`[SmartThingsController] Command failed:`, error.message);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Set device state
   */
  async setDeviceState(deviceId, capability, command, args = []) {
    return this.sendCommand(deviceId, capability, command, args);
  }
  
  /**
   * Turn device on/off
   */
  async setSwitch(deviceId, on) {
    return this.sendCommand(deviceId, 'switch', on ? 'on' : 'off');
  }
  
  /**
   * Set device level (brightness)
   */
  async setLevel(deviceId, level) {
    return this.sendCommand(deviceId, 'switchLevel', 'setLevel', [level]);
  }
  
  /**
   * Set color temperature
   */
  async setColorTemperature(deviceId, kelvin) {
    return this.sendCommand(deviceId, 'colorTemperature', 'setColorTemperature', [kelvin]);
  }
  
  /**
   * Set color (HSV)
   */
  async setColor(deviceId, hue, saturation) {
    return this.sendCommand(deviceId, 'colorControl', 'setColor', [{ hue, saturation }]);
  }
  
  /**
   * Get device status
   */
  async getDeviceStatus(deviceId) {
    const device = this.devices.get(deviceId);
    if (!device) {
      return { success: false, error: 'Device not found' };
    }
    
    try {
      const response = await this._apiRequest('GET', `/devices/${deviceId}/status`);
      
      if (response?.components) {
        for (const [componentId, capabilities] of Object.entries(response.components)) {
          for (const [capabilityId, attributes] of Object.entries(capabilities)) {
            for (const [attribute, data] of Object.entries(attributes)) {
              device.updateState(componentId, capabilityId, attribute, data.value);
            }
          }
        }
      }
      
      return { success: true, state: device.state };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // ============================================
  // SCENE CONTROL
  // ============================================
  
  /**
   * Execute a scene
   */
  async executeScene(sceneId) {
    try {
      await this._apiRequest('POST', `/scenes/${sceneId}/execute`);
      this.stats.scenesExecuted++;
      this.emit('scene_executed', { sceneId });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Find scene by name
   */
  findSceneByName(name) {
    for (const scene of this.scenes.values()) {
      if (scene.sceneName.toLowerCase() === name.toLowerCase()) {
        return scene;
      }
    }
    return null;
  }
  
  // ============================================
  // L.O.V.E. ECONOMY INTEGRATION
  // ============================================
  
  /**
   * Set shield mode
   */
  async setShieldMode(isActive) {
    if (!this.enabled) return;
    
    console.log(`[SmartThingsController] Shield mode: ${isActive ? 'ON' : 'OFF'}`);
    
    // Try to execute shield scene
    const sceneName = isActive
      ? this.config.SPOON_SCENES.LOW
      : this.config.SPOON_SCENES.NORMAL;
    
    const scene = this.findSceneByName(sceneName);
    if (scene) {
      return this.executeScene(scene.sceneId);
    }
    
    // Fallback: control all lights
    const settings = isActive
      ? this.config.COGNITIVE_SETTINGS.SHIELD
      : this.config.COGNITIVE_SETTINGS.NORMAL;
    
    return this.setAllLights(settings);
  }
  
  /**
   * Set atmosphere based on spoon level
   */
  async setSpoonAtmosphere(spoonLevel, maxSpoons = 12) {
    const percentage = (spoonLevel / maxSpoons) * 100;
    
    let sceneName;
    let settings;
    
    if (percentage <= 15) {
      sceneName = this.config.SPOON_SCENES.CRITICAL;
      settings = this.config.COGNITIVE_SETTINGS.SHIELD;
    } else if (percentage <= 35) {
      sceneName = this.config.SPOON_SCENES.LOW;
      settings = this.config.COGNITIVE_SETTINGS.RECOVERY;
    } else if (percentage <= 60) {
      sceneName = this.config.SPOON_SCENES.MODERATE;
      settings = this.config.COGNITIVE_SETTINGS.FOCUS;
    } else if (percentage <= 80) {
      sceneName = this.config.SPOON_SCENES.GOOD;
      settings = this.config.COGNITIVE_SETTINGS.NORMAL;
    } else {
      sceneName = this.config.SPOON_SCENES.OPTIMAL;
      settings = this.config.COGNITIVE_SETTINGS.ENERGIZE;
    }
    
    // Try scene first
    const scene = this.findSceneByName(sceneName);
    if (scene) {
      return this.executeScene(scene.sceneId);
    }
    
    // Fallback to direct control
    return this.setAllLights(settings);
  }
  
  /**
   * Set cognitive scene
   */
  async setCognitiveScene(sceneName) {
    const settings = this.config.COGNITIVE_SETTINGS[sceneName.toUpperCase()];
    if (!settings) {
      return { success: false, error: 'Scene not found' };
    }
    
    return this.setAllLights(settings);
  }
  
  /**
   * Set all lights to specified settings
   */
  async setAllLights(settings) {
    const results = [];
    
    for (const device of this.devices.values()) {
      if (device.hasCapability('switchLevel')) {
        const levelResult = await this.setLevel(device.deviceId, settings.level);
        results.push({ deviceId: device.deviceId, type: 'level', ...levelResult });
      }
      
      if (device.hasCapability('colorTemperature') && settings.colorTemp) {
        const ctResult = await this.setColorTemperature(device.deviceId, settings.colorTemp);
        results.push({ deviceId: device.deviceId, type: 'colorTemp', ...ctResult });
      }
    }
    
    return { success: true, results };
  }
  
  // ============================================
  // UTILITY METHODS
  // ============================================
  
  _startHealthCheck() {
    this.healthCheckInterval = setInterval(async () => {
      // Refresh device states
      for (const device of this.devices.values()) {
        await this.getDeviceStatus(device.deviceId);
      }
    }, this.config.HEALTH_CHECK_INTERVAL_MS);
  }
  
  /**
   * Get all devices
   */
  getDevices() {
    return Array.from(this.devices.values()).map(d => d.toJSON());
  }
  
  /**
   * Get devices by capability
   */
  getDevicesByCapability(capability) {
    return Array.from(this.devices.values())
      .filter(d => d.hasCapability(capability))
      .map(d => d.toJSON());
  }
  
  /**
   * Get devices by room
   */
  getDevicesByRoom(roomId) {
    return Array.from(this.devices.values())
      .filter(d => d.roomId === roomId)
      .map(d => d.toJSON());
  }
  
  /**
   * Get all scenes
   */
  getScenes() {
    return Array.from(this.scenes.values());
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
      locations: this.locations.size,
      rooms: this.rooms.size,
      devices: this.devices.size,
      scenes: this.scenes.size
    };
  }
  
  /**
   * Get comprehensive statistics
   */
  getStats() {
    const devicesArray = Array.from(this.devices.values());
    
    return {
      ...this.stats,
      enabled: this.enabled,
      
      infrastructure: {
        locations: this.locations.size,
        rooms: this.rooms.size,
        scenes: this.scenes.size
      },
      
      devices: {
        total: this.devices.size,
        switches: devicesArray.filter(d => d.hasCapability('switch')).length,
        dimmers: devicesArray.filter(d => d.hasCapability('switchLevel')).length,
        colorLights: devicesArray.filter(d => d.hasCapability('colorControl')).length,
        thermostats: devicesArray.filter(d => d.hasCapability('thermostat')).length,
        mediaPlayers: devicesArray.filter(d => d.hasCapability('mediaPlayback')).length
      },
      
      config: {
        spoonScenes: Object.keys(this.config.SPOON_SCENES),
        cognitiveSettings: Object.keys(this.config.COGNITIVE_SETTINGS)
      }
    };
  }
  
  /**
   * Cleanup
   */
  async shutdown() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    this.emit('shutdown');
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  SMARTTHINGS_CONFIG,
  SmartThingsDevice,
  SmartThingsController
};

// Default export for backwards compatibility
module.exports.default = SmartThingsController;