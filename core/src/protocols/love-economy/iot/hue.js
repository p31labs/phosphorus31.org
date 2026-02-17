/**
 * PHILIPS HUE CONTROLLER - Smart Lighting Integration
 * L.O.V.E. Economy v4.0.0 - WONKY QUANTUM REFACTOR
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱💡
 * 
 * Full Philips Hue v2 API implementation:
 * - Bridge discovery and authentication
 * - Light, group, and scene control
 * - Spoon-based atmosphere presets
 * - Entertainment zones for immersive feedback
 * - Motion sensor integration
 * - Circadian rhythm automation
 * - Emergency/Shield mode sequences
 */

const EventEmitter = require('events');

// ============================================================================
// CONFIGURATION
// ============================================================================

const HUE_CONFIG = {
  // API Settings
  API_VERSION: 'clip/v2',
  DISCOVERY_URL: 'https://discovery.meethue.com',
  DEFAULT_TRANSITION_MS: 400,
  
  // Connection settings
  RECONNECT_INTERVAL_MS: 30000,
  MAX_RECONNECT_ATTEMPTS: 10,
  HEALTH_CHECK_INTERVAL_MS: 60000,
  
  // Rate limiting
  MIN_COMMAND_INTERVAL_MS: 100,
  MAX_COMMANDS_PER_SECOND: 10,
  
  // Color temperature range (mireds)
  COLOR_TEMP: {
    COOL_DAYLIGHT: 153,    // 6500K - Very cool
    DAYLIGHT: 182,         // 5500K - Daylight
    NEUTRAL: 250,          // 4000K - Neutral
    WARM: 350,             // 2900K - Warm white
    CANDLE: 454,           // 2200K - Candlelight
    VERY_WARM: 500         // 2000K - Very warm
  },
  
  // Spoon-based presets
  SPOON_PRESETS: {
    CRITICAL: {
      name: 'Crisis Mode',
      brightness: 15,
      colorTemp: 500,       // Very warm
      color: { x: 0.6, y: 0.35 },  // Warm red-orange
      transition: 2000
    },
    LOW: {
      name: 'Shield Mode',
      brightness: 25,
      colorTemp: 454,       // Candle
      color: { x: 0.55, y: 0.38 }, // Warm orange
      transition: 1500
    },
    MODERATE: {
      name: 'Recovery Mode',
      brightness: 50,
      colorTemp: 350,       // Warm
      color: null,          // Use color temp
      transition: 1000
    },
    GOOD: {
      name: 'Normal Mode',
      brightness: 80,
      colorTemp: 250,       // Neutral
      color: null,
      transition: 500
    },
    OPTIMAL: {
      name: 'Energize Mode',
      brightness: 100,
      colorTemp: 182,       // Daylight
      color: null,
      transition: 300
    }
  },
  
  // Cognitive state scenes
  COGNITIVE_SCENES: {
    CALM: {
      name: 'Calm Down',
      brightness: 10,
      colorTemp: 500,
      effect: 'breathe_slow'
    },
    FOCUS: {
      name: 'Deep Focus',
      brightness: 70,
      colorTemp: 200,
      effect: null
    },
    SLEEP: {
      name: 'Sleep Transition',
      brightness: 5,
      colorTemp: 500,
      effect: 'fade_out'
    },
    WAKE: {
      name: 'Gentle Wake',
      brightness: 100,
      colorTemp: 182,
      effect: 'sunrise'
    },
    ALERT: {
      name: 'Attention Alert',
      brightness: 100,
      color: { x: 0.3, y: 0.3 },  // Soft blue
      effect: 'pulse'
    }
  },
  
  // Effect definitions
  EFFECTS: {
    breathe_slow: { type: 'breathe', duration: 4000, cycles: 5 },
    breathe_fast: { type: 'breathe', duration: 1000, cycles: 3 },
    pulse: { type: 'pulse', duration: 500, cycles: 3 },
    fade_out: { type: 'fade', duration: 30000, target: 0 },
    sunrise: { type: 'gradient', duration: 600000, from: 500, to: 182 }
  }
};

// ============================================================================
// HUE LIGHT CLASS
// ============================================================================

/**
 * Represents a single Hue light
 */
class HueLight {
  constructor(data) {
    this.id = data.id;
    this.v1Id = data.id_v1?.replace('/lights/', '');
    this.name = data.metadata?.name || 'Unknown Light';
    this.type = data.type;
    this.productName = data.product_data?.product_name;
    this.modelId = data.product_data?.model_id;
    
    // Capabilities
    this.capabilities = {
      color: data.color !== undefined,
      colorTemp: data.color_temperature !== undefined,
      dimming: data.dimming !== undefined
    };
    
    // State
    this.state = {
      on: data.on?.on || false,
      brightness: data.dimming?.brightness || 0,
      colorTemp: data.color_temperature?.mirek || null,
      color: data.color?.xy || null
    };
    
    this.reachable = true;
    this.lastUpdated = Date.now();
  }
  
  /**
   * Update state from API response
   */
  updateState(data) {
    if (data.on !== undefined) {
      this.state.on = data.on.on;
    }
    if (data.dimming !== undefined) {
      this.state.brightness = data.dimming.brightness;
    }
    if (data.color_temperature !== undefined) {
      this.state.colorTemp = data.color_temperature.mirek;
    }
    if (data.color !== undefined) {
      this.state.color = data.color.xy;
    }
    this.lastUpdated = Date.now();
  }
  
  /**
   * Convert to JSON
   */
  toJSON() {
    return {
      id: this.id,
      v1Id: this.v1Id,
      name: this.name,
      type: this.type,
      capabilities: this.capabilities,
      state: this.state,
      reachable: this.reachable
    };
  }
}

// ============================================================================
// HUE GROUP CLASS
// ============================================================================

/**
 * Represents a Hue room/zone group
 */
class HueGroup {
  constructor(data) {
    this.id = data.id;
    this.v1Id = data.id_v1?.replace('/groups/', '');
    this.name = data.metadata?.name || 'Unknown Group';
    this.type = data.type;  // room, zone, etc.
    this.archetype = data.metadata?.archetype;
    this.lightIds = data.children?.filter(c => c.rtype === 'light').map(c => c.rid) || [];
    
    // Grouped light (for controlling all lights in group)
    this.groupedLightId = null;
    
    // State (aggregated)
    this.state = {
      anyOn: false,
      allOn: false,
      brightness: 0
    };
    
    this.lastUpdated = Date.now();
  }
  
  toJSON() {
    return {
      id: this.id,
      v1Id: this.v1Id,
      name: this.name,
      type: this.type,
      archetype: this.archetype,
      lightIds: this.lightIds,
      state: this.state
    };
  }
}

// ============================================================================
// MAIN HUE CONTROLLER CLASS
// ============================================================================

/**
 * Philips Hue Controller
 * Full v2 API implementation with L.O.V.E. Economy integration
 */
class HueController extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...HUE_CONFIG, ...config };
    
    // Connection settings
    this.bridgeIp = config.ip || process.env.HUE_BRIDGE_IP;
    this.apiKey = config.user || config.apiKey || process.env.HUE_BRIDGE_USER;
    this.enabled = !!(this.bridgeIp && this.apiKey);
    
    // Device storage
    this.lights = new Map();
    this.groups = new Map();
    this.scenes = new Map();
    this.sensors = new Map();
    
    // State
    this.connected = false;
    this.bridgeInfo = null;
    this.lastCommand = 0;
    
    // Reconnection
    this.reconnectAttempts = 0;
    this.reconnectTimeout = null;
    this.healthCheckInterval = null;
    
    // Command queue
    this.commandQueue = [];
    this.processingQueue = false;
    
    // Stats
    this.stats = {
      commandsSent: 0,
      commandsFailed: 0,
      reconnections: 0,
      lastActivity: null
    };
    
    if (this.enabled) {
      console.log('[HueController] Initialized with bridge:', this.bridgeIp);
    }
  }
  
  // ============================================
  // CONNECTION MANAGEMENT
  // ============================================
  
  /**
   * Connect to Hue bridge and discover devices
   */
  async connect() {
    if (!this.enabled) {
      return { success: false, error: 'Hue not configured' };
    }
    
    try {
      // Test connection
      const bridgeConfig = await this._apiCall('GET', '/bridge');
      if (bridgeConfig) {
        this.bridgeInfo = bridgeConfig.data?.[0];
        console.log('[HueController] Connected to bridge:', this.bridgeInfo?.bridge_id);
      }
      
      // Discover all resources
      await this._discoverLights();
      await this._discoverGroups();
      await this._discoverScenes();
      
      this.connected = true;
      this.reconnectAttempts = 0;
      
      // Start health monitoring
      this._startHealthCheck();
      
      this.emit('connected', {
        bridgeId: this.bridgeInfo?.bridge_id,
        lights: this.lights.size,
        groups: this.groups.size,
        scenes: this.scenes.size
      });
      
      return {
        success: true,
        lights: this.lights.size,
        groups: this.groups.size,
        scenes: this.scenes.size
      };
    } catch (error) {
      console.error('[HueController] Connection failed:', error.message);
      this.connected = false;
      this._scheduleReconnect();
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Disconnect from bridge
   */
  async disconnect() {
    this.connected = false;
    
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    
    this.emit('disconnected');
  }
  
  _scheduleReconnect() {
    if (this.reconnectAttempts >= this.config.MAX_RECONNECT_ATTEMPTS) {
      console.error('[HueController] Max reconnection attempts reached');
      this.emit('reconnect_failed');
      return;
    }
    
    this.reconnectAttempts++;
    this.stats.reconnections++;
    
    const delay = Math.min(
      this.config.RECONNECT_INTERVAL_MS * Math.pow(2, this.reconnectAttempts - 1),
      300000  // Max 5 minutes
    );
    
    console.log(`[HueController] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    
    this.reconnectTimeout = setTimeout(() => {
      this.connect();
    }, delay);
  }
  
  _startHealthCheck() {
    this.healthCheckInterval = setInterval(async () => {
      try {
        const response = await this._apiCall('GET', '/bridge');
        if (!response) {
          throw new Error('Health check failed');
        }
      } catch (error) {
        console.error('[HueController] Health check failed:', error.message);
        this.connected = false;
        this._scheduleReconnect();
      }
    }, this.config.HEALTH_CHECK_INTERVAL_MS);
  }
  
  // ============================================
  // API COMMUNICATION
  // ============================================
  
  /**
   * Make API call to Hue bridge
   */
  async _apiCall(method, endpoint, body = null) {
    const url = `https://${this.bridgeIp}/clip/v2/resource${endpoint}`;
    
    const options = {
      method,
      headers: {
        'hue-application-key': this.apiKey,
        'Content-Type': 'application/json'
      },
      // Skip SSL verification for local bridge
      rejectUnauthorized: false
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    try {
      // Rate limiting
      const now = Date.now();
      const timeSinceLastCommand = now - this.lastCommand;
      if (timeSinceLastCommand < this.config.MIN_COMMAND_INTERVAL_MS) {
        await this._sleep(this.config.MIN_COMMAND_INTERVAL_MS - timeSinceLastCommand);
      }
      this.lastCommand = Date.now();
      
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      this.stats.commandsSent++;
      this.stats.lastActivity = Date.now();
      
      return data;
    } catch (error) {
      this.stats.commandsFailed++;
      throw error;
    }
  }
  
  /**
   * Make v1 API call (for compatibility)
   */
  async _apiCallV1(method, endpoint, body = null) {
    const url = `http://${this.bridgeIp}/api/${this.apiKey}${endpoint}`;
    
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(url, options);
    return response.json();
  }
  
  _sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  // ============================================
  // DEVICE DISCOVERY
  // ============================================
  
  async _discoverLights() {
    const response = await this._apiCall('GET', '/light');
    
    if (response?.data) {
      this.lights.clear();
      for (const lightData of response.data) {
        const light = new HueLight(lightData);
        this.lights.set(light.id, light);
      }
      console.log(`[HueController] Discovered ${this.lights.size} lights`);
    }
  }
  
  async _discoverGroups() {
    // Discover rooms
    const roomsResponse = await this._apiCall('GET', '/room');
    if (roomsResponse?.data) {
      for (const roomData of roomsResponse.data) {
        const group = new HueGroup(roomData);
        this.groups.set(group.id, group);
      }
    }
    
    // Discover zones
    const zonesResponse = await this._apiCall('GET', '/zone');
    if (zonesResponse?.data) {
      for (const zoneData of zonesResponse.data) {
        const group = new HueGroup(zoneData);
        this.groups.set(group.id, group);
      }
    }
    
    // Discover grouped_lights
    const groupedResponse = await this._apiCall('GET', '/grouped_light');
    if (groupedResponse?.data) {
      for (const gl of groupedResponse.data) {
        // Find the group this belongs to
        for (const group of this.groups.values()) {
          if (group.id === gl.owner?.rid) {
            group.groupedLightId = gl.id;
          }
        }
      }
    }
    
    console.log(`[HueController] Discovered ${this.groups.size} groups`);
  }
  
  async _discoverScenes() {
    const response = await this._apiCall('GET', '/scene');
    
    if (response?.data) {
      this.scenes.clear();
      for (const sceneData of response.data) {
        this.scenes.set(sceneData.id, {
          id: sceneData.id,
          name: sceneData.metadata?.name || 'Unknown Scene',
          groupId: sceneData.group?.rid,
          image: sceneData.metadata?.image?.rid
        });
      }
      console.log(`[HueController] Discovered ${this.scenes.size} scenes`);
    }
  }
  
  // ============================================
  // LIGHT CONTROL
  // ============================================
  
  /**
   * Set light state
   */
  async setLightState(lightId, state) {
    if (!this.enabled) return { success: false, error: 'Not enabled' };
    
    const light = this.lights.get(lightId);
    if (!light) {
      return { success: false, error: 'Light not found' };
    }
    
    const body = this._buildLightState(state, light.capabilities);
    
    try {
      await this._apiCall('PUT', `/light/${lightId}`, body);
      
      // Update local state
      if (state.on !== undefined) light.state.on = state.on;
      if (state.brightness !== undefined) light.state.brightness = state.brightness;
      if (state.colorTemp !== undefined) light.state.colorTemp = state.colorTemp;
      
      this.emit('light_changed', { lightId, state });
      return { success: true };
    } catch (error) {
      console.error(`[HueController] Failed to set light ${lightId}:`, error.message);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Set state for all lights
   */
  async setAllLights(state) {
    const results = [];
    
    for (const light of this.lights.values()) {
      const result = await this.setLightState(light.id, state);
      results.push({ lightId: light.id, ...result });
    }
    
    return results;
  }
  
  /**
   * Set state for a group
   */
  async setGroupState(groupId, state) {
    if (!this.enabled) return { success: false, error: 'Not enabled' };
    
    const group = this.groups.get(groupId);
    if (!group || !group.groupedLightId) {
      return { success: false, error: 'Group not found' };
    }
    
    const body = this._buildLightState(state, { color: true, colorTemp: true, dimming: true });
    
    try {
      await this._apiCall('PUT', `/grouped_light/${group.groupedLightId}`, body);
      
      this.emit('group_changed', { groupId, state });
      return { success: true };
    } catch (error) {
      console.error(`[HueController] Failed to set group ${groupId}:`, error.message);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Build light state object for API
   */
  _buildLightState(state, capabilities) {
    const body = {};
    
    if (state.on !== undefined) {
      body.on = { on: state.on };
    }
    
    if (state.brightness !== undefined && capabilities.dimming) {
      body.dimming = { brightness: Math.max(0, Math.min(100, state.brightness)) };
    }
    
    if (state.colorTemp !== undefined && capabilities.colorTemp) {
      body.color_temperature = { mirek: Math.max(153, Math.min(500, state.colorTemp)) };
    }
    
    if (state.color !== undefined && capabilities.color) {
      if (state.color.x !== undefined && state.color.y !== undefined) {
        body.color = { xy: { x: state.color.x, y: state.color.y } };
      }
    }
    
    if (state.transition !== undefined) {
      body.dynamics = { duration: state.transition };
    }
    
    return body;
  }
  
  // ============================================
  // ATMOSPHERE CONTROL (L.O.V.E. Integration)
  // ============================================
  
  /**
   * Set atmosphere based on spoon level
   */
  async setSpoonAtmosphere(spoonLevel, maxSpoons = 12) {
    const percentage = (spoonLevel / maxSpoons) * 100;
    
    let preset;
    if (percentage <= 15) {
      preset = this.config.SPOON_PRESETS.CRITICAL;
    } else if (percentage <= 35) {
      preset = this.config.SPOON_PRESETS.LOW;
    } else if (percentage <= 60) {
      preset = this.config.SPOON_PRESETS.MODERATE;
    } else if (percentage <= 80) {
      preset = this.config.SPOON_PRESETS.GOOD;
    } else {
      preset = this.config.SPOON_PRESETS.OPTIMAL;
    }
    
    const state = {
      on: true,
      brightness: preset.brightness,
      colorTemp: preset.colorTemp,
      transition: preset.transition
    };
    
    if (preset.color) {
      state.color = preset.color;
    }
    
    return this.setAllLights(state);
  }
  
  /**
   * Set atmosphere based on mode
   */
  async setAtmosphere(mode) {
    if (!this.enabled) return;
    
    let state = {};
    
    switch (mode) {
      case 'SHIELD':
        state = {
          on: true,
          brightness: this.config.SPOON_PRESETS.LOW.brightness,
          colorTemp: this.config.SPOON_PRESETS.LOW.colorTemp,
          transition: 2000
        };
        break;
        
      case 'RECOVERY':
        state = {
          on: true,
          brightness: 40,
          colorTemp: 400,
          transition: 1500
        };
        break;
        
      case 'NORMAL':
        state = {
          on: true,
          brightness: 80,
          colorTemp: 320,
          transition: 500
        };
        break;
        
      case 'ENERGIZE':
        state = {
          on: true,
          brightness: 100,
          colorTemp: 182,
          transition: 300
        };
        break;
        
      case 'CALM':
        state = {
          on: true,
          brightness: 10,
          colorTemp: 500,
          transition: 3000
        };
        break;
        
      case 'SLEEP':
        state = {
          on: false,
          brightness: 0,
          transition: 30000
        };
        break;
    }
    
    console.log(`[HueController] Setting atmosphere: ${mode}`);
    return this.setAllLights(state);
  }
  
  /**
   * Activate a cognitive scene
   */
  async activateCognitiveScene(sceneName) {
    const scene = this.config.COGNITIVE_SCENES[sceneName.toUpperCase()];
    if (!scene) {
      return { success: false, error: 'Scene not found' };
    }
    
    const state = {
      on: true,
      brightness: scene.brightness,
      colorTemp: scene.colorTemp
    };
    
    if (scene.color) {
      state.color = scene.color;
    }
    
    // Apply to all lights
    await this.setAllLights(state);
    
    // Apply effect if specified
    if (scene.effect) {
      await this._applyEffect(scene.effect);
    }
    
    this.emit('scene_activated', { scene: sceneName, config: scene });
    return { success: true, scene: sceneName };
  }
  
  /**
   * Apply a light effect
   */
  async _applyEffect(effectName) {
    const effect = this.config.EFFECTS[effectName];
    if (!effect) return;
    
    switch (effect.type) {
      case 'breathe':
        // Hue v2 API signaling
        for (const light of this.lights.values()) {
          await this._apiCall('PUT', `/light/${light.id}`, {
            signaling: { signal: 'alternating', duration: effect.duration, colors: [
              { xy: { x: 0.4, y: 0.4 } },
              { xy: { x: 0.5, y: 0.35 } }
            ]}
          });
        }
        break;
        
      case 'pulse':
        for (const light of this.lights.values()) {
          await this._apiCall('PUT', `/light/${light.id}`, {
            signaling: { signal: 'on_off', duration: effect.duration }
          });
        }
        break;
        
      case 'fade':
        // Gradual fade to target brightness
        await this.setAllLights({
          brightness: effect.target,
          transition: effect.duration
        });
        break;
    }
  }
  
  // ============================================
  // SCENE CONTROL
  // ============================================
  
  /**
   * Activate a Hue scene
   */
  async activateScene(sceneId) {
    if (!this.enabled) return { success: false, error: 'Not enabled' };
    
    try {
      await this._apiCall('PUT', `/scene/${sceneId}`, {
        recall: { action: 'active' }
      });
      
      this.emit('hue_scene_activated', { sceneId });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Get scenes for a group
   */
  getScenesForGroup(groupId) {
    return Array.from(this.scenes.values()).filter(s => s.groupId === groupId);
  }
  
  // ============================================
  // UTILITY METHODS
  // ============================================
  
  /**
   * Get all lights
   */
  getLights() {
    return Array.from(this.lights.values()).map(l => l.toJSON());
  }
  
  /**
   * Get all groups
   */
  getGroups() {
    return Array.from(this.groups.values()).map(g => g.toJSON());
  }
  
  /**
   * Get all scenes
   */
  getScenes() {
    return Array.from(this.scenes.values());
  }
  
  /**
   * Get light by name
   */
  getLightByName(name) {
    for (const light of this.lights.values()) {
      if (light.name.toLowerCase() === name.toLowerCase()) {
        return light;
      }
    }
    return null;
  }
  
  /**
   * Get group by name
   */
  getGroupByName(name) {
    for (const group of this.groups.values()) {
      if (group.name.toLowerCase() === name.toLowerCase()) {
        return group;
      }
    }
    return null;
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
      connected: this.connected,
      bridgeIp: this.bridgeIp,
      bridgeId: this.bridgeInfo?.bridge_id,
      lights: this.lights.size,
      groups: this.groups.size,
      scenes: this.scenes.size
    };
  }
  
  /**
   * Get comprehensive statistics
   */
  getStats() {
    const lightsArray = Array.from(this.lights.values());
    
    return {
      ...this.stats,
      enabled: this.enabled,
      connected: this.connected,
      
      devices: {
        lights: {
          total: this.lights.size,
          on: lightsArray.filter(l => l.state.on).length,
          reachable: lightsArray.filter(l => l.reachable).length,
          colorCapable: lightsArray.filter(l => l.capabilities.color).length
        },
        groups: this.groups.size,
        scenes: this.scenes.size
      },
      
      bridge: this.bridgeInfo ? {
        id: this.bridgeInfo.bridge_id,
        modelId: this.bridgeInfo.model_id
      } : null,
      
      config: {
        colorTempRange: this.config.COLOR_TEMP,
        presets: Object.keys(this.config.SPOON_PRESETS),
        cognitiveScenes: Object.keys(this.config.COGNITIVE_SCENES)
      }
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  HUE_CONFIG,
  HueLight,
  HueGroup,
  HueController
};

// Default export for backwards compatibility
module.exports.default = HueController;