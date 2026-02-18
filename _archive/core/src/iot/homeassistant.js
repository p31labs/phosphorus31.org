/**
 * Home Assistant Integration for Love Economy
 * Connects to Home Assistant's REST and WebSocket APIs
 * Provides unified control over all HA-managed devices
 */

const EventEmitter = require('events');

class HomeAssistantAdapter extends EventEmitter {
  constructor(config = {}) {
    super();
    this.baseUrl = config.url || process.env.HASS_URL || 'http://homeassistant.local:8123';
    this.token = config.token || process.env.HASS_TOKEN;
    this.wsConnection = null;
    this.entities = new Map();
    this.stateSubscriptions = new Set();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.messageId = 1;
    this.pendingRequests = new Map();
  }

  /**
   * Initialize connection to Home Assistant
   */
  async connect() {
    if (!this.token) {
      throw new Error('Home Assistant long-lived access token required');
    }

    // Test REST API connection first
    const testResult = await this.callService('', 'GET');
    if (testResult.message) {
      console.log(`[HomeAssistant] Connected: ${testResult.message}`);
    }

    // Load all entities
    await this.loadEntities();

    // Establish WebSocket for real-time updates
    await this.connectWebSocket();

    return { success: true, entityCount: this.entities.size };
  }

  /**
   * REST API call helper
   */
  async callService(endpoint, method = 'GET', body = null) {
    const url = `${this.baseUrl}/api${endpoint}`;
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
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      this.emit('error', { source: 'rest', error: error.message });
      throw error;
    }
  }

  /**
   * Load all entities from Home Assistant
   */
  async loadEntities() {
    const states = await this.callService('/states');
    this.entities.clear();

    for (const state of states) {
      this.entities.set(state.entity_id, {
        entityId: state.entity_id,
        state: state.state,
        attributes: state.attributes,
        lastChanged: state.last_changed,
        lastUpdated: state.last_updated,
        domain: state.entity_id.split('.')[0]
      });
    }

    return this.entities;
  }

  /**
   * WebSocket connection for real-time updates
   */
  async connectWebSocket() {
    return new Promise((resolve, reject) => {
      const wsUrl = this.baseUrl.replace('http', 'ws') + '/api/websocket';
      
      try {
        // Use native WebSocket or ws library
        const WebSocket = globalThis.WebSocket || require('ws');
        this.wsConnection = new WebSocket(wsUrl);

        this.wsConnection.onopen = () => {
          console.log('[HomeAssistant] WebSocket connected');
        };

        this.wsConnection.onmessage = (event) => {
          this.handleWebSocketMessage(JSON.parse(event.data), resolve);
        };

        this.wsConnection.onerror = (error) => {
          console.error('[HomeAssistant] WebSocket error:', error);
          reject(error);
        };

        this.wsConnection.onclose = () => {
          console.log('[HomeAssistant] WebSocket closed');
          this.handleReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Handle incoming WebSocket messages
   */
  handleWebSocketMessage(message, resolveConnect) {
    switch (message.type) {
      case 'auth_required':
        // Send authentication
        this.wsConnection.send(JSON.stringify({
          type: 'auth',
          access_token: this.token
        }));
        break;

      case 'auth_ok':
        console.log('[HomeAssistant] WebSocket authenticated');
        this.reconnectAttempts = 0;
        this.subscribeToStateChanges();
        if (resolveConnect) resolveConnect();
        break;

      case 'auth_invalid':
        console.error('[HomeAssistant] Invalid authentication');
        this.emit('error', { source: 'auth', error: 'Invalid token' });
        break;

      case 'event':
        if (message.event?.event_type === 'state_changed') {
          this.handleStateChange(message.event.data);
        }
        break;

      case 'result':
        // Handle response to our requests
        const pending = this.pendingRequests.get(message.id);
        if (pending) {
          if (message.success) {
            pending.resolve(message.result);
          } else {
            pending.reject(new Error(message.error?.message || 'Unknown error'));
          }
          this.pendingRequests.delete(message.id);
        }
        break;
    }
  }

  /**
   * Subscribe to all state changes
   */
  subscribeToStateChanges() {
    const subscribeMsg = {
      id: this.messageId++,
      type: 'subscribe_events',
      event_type: 'state_changed'
    };
    this.wsConnection.send(JSON.stringify(subscribeMsg));
  }

  /**
   * Handle state change events
   */
  handleStateChange(data) {
    const { entity_id, new_state, old_state } = data;
    
    if (new_state) {
      // Update local cache
      this.entities.set(entity_id, {
        entityId: entity_id,
        state: new_state.state,
        attributes: new_state.attributes,
        lastChanged: new_state.last_changed,
        lastUpdated: new_state.last_updated,
        domain: entity_id.split('.')[0]
      });

      // Emit event for listeners
      this.emit('stateChanged', {
        entityId: entity_id,
        oldState: old_state?.state,
        newState: new_state.state,
        attributes: new_state.attributes
      });
    }
  }

  /**
   * Handle reconnection logic
   */
  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
      console.log(`[HomeAssistant] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
      setTimeout(() => this.connectWebSocket(), delay);
    } else {
      this.emit('error', { source: 'websocket', error: 'Max reconnection attempts reached' });
    }
  }

  /**
   * Send WebSocket command and wait for response
   */
  async sendCommand(command) {
    return new Promise((resolve, reject) => {
      const id = this.messageId++;
      this.pendingRequests.set(id, { resolve, reject });
      
      this.wsConnection.send(JSON.stringify({
        id,
        ...command
      }));

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  // ============================================
  // SPOON-BASED AUTOMATION METHODS
  // ============================================

  /**
   * Apply spoon-based ambient settings to all compatible devices
   */
  async applySpoonState(spoonData) {
    const { currentSpoons, maxSpoons, trend, recentBiometrics } = spoonData;
    const percentage = (currentSpoons / maxSpoons) * 100;

    const actions = [];

    // Determine state level
    let stateLevel;
    if (percentage <= 20) stateLevel = 'crisis';
    else if (percentage <= 40) stateLevel = 'low';
    else if (percentage <= 60) stateLevel = 'moderate';
    else if (percentage <= 80) stateLevel = 'good';
    else stateLevel = 'optimal';

    // Apply to lights
    actions.push(this.applyLightSettings(stateLevel, recentBiometrics));

    // Apply to climate
    actions.push(this.applyClimateSettings(stateLevel));

    // Apply to media players
    actions.push(this.applyMediaSettings(stateLevel));

    // Apply to scenes if available
    actions.push(this.triggerSpoonScene(stateLevel));

    await Promise.all(actions);

    return { stateLevel, actionsTriggered: actions.length };
  }

  /**
   * Apply light settings based on spoon state
   */
  async applyLightSettings(stateLevel, biometrics = {}) {
    const lights = this.getEntitiesByDomain('light');
    
    const lightProfiles = {
      crisis: { brightness: 30, color_temp: 500, rgb_color: [255, 100, 100] },
      low: { brightness: 50, color_temp: 450, rgb_color: [255, 180, 150] },
      moderate: { brightness: 70, color_temp: 370, rgb_color: [255, 220, 180] },
      good: { brightness: 85, color_temp: 320, rgb_color: [255, 255, 220] },
      optimal: { brightness: 100, color_temp: 280, rgb_color: [255, 255, 255] }
    };

    const profile = lightProfiles[stateLevel];
    const actions = [];

    for (const light of lights) {
      // Check if light supports color
      const supportsColor = light.attributes.supported_color_modes?.includes('rgb');
      const supportsColorTemp = light.attributes.supported_color_modes?.includes('color_temp');

      const serviceData = {
        entity_id: light.entityId,
        brightness_pct: profile.brightness,
        transition: 3 // Smooth 3-second transition
      };

      if (supportsColor && stateLevel === 'crisis') {
        serviceData.rgb_color = profile.rgb_color;
      } else if (supportsColorTemp) {
        serviceData.color_temp = profile.color_temp;
      }

      actions.push(
        this.callService('/services/light/turn_on', 'POST', serviceData)
      );
    }

    await Promise.all(actions);
    return { domain: 'light', count: actions.length };
  }

  /**
   * Apply climate settings based on spoon state
   */
  async applyClimateSettings(stateLevel) {
    const climateEntities = this.getEntitiesByDomain('climate');
    
    // Optimal temperatures for different states (in °F)
    const tempProfiles = {
      crisis: { heat: 72, cool: 72 },     // Neutral, no stress
      low: { heat: 71, cool: 73 },
      moderate: { heat: 70, cool: 74 },
      good: { heat: 69, cool: 75 },
      optimal: { heat: 68, cool: 76 }      // Energy efficient
    };

    const profile = tempProfiles[stateLevel];
    const actions = [];

    for (const climate of climateEntities) {
      const currentMode = climate.attributes.hvac_mode;
      let targetTemp;

      if (currentMode === 'heat') {
        targetTemp = profile.heat;
      } else if (currentMode === 'cool') {
        targetTemp = profile.cool;
      } else {
        targetTemp = (profile.heat + profile.cool) / 2;
      }

      actions.push(
        this.callService('/services/climate/set_temperature', 'POST', {
          entity_id: climate.entityId,
          temperature: targetTemp
        })
      );
    }

    await Promise.all(actions);
    return { domain: 'climate', count: actions.length };
  }

  /**
   * Apply media settings based on spoon state
   */
  async applyMediaSettings(stateLevel) {
    const mediaPlayers = this.getEntitiesByDomain('media_player');
    
    const volumeProfiles = {
      crisis: 0.2,
      low: 0.3,
      moderate: 0.5,
      good: 0.7,
      optimal: 0.8
    };

    const actions = [];

    for (const player of mediaPlayers) {
      if (player.state === 'playing') {
        actions.push(
          this.callService('/services/media_player/volume_set', 'POST', {
            entity_id: player.entityId,
            volume_level: volumeProfiles[stateLevel]
          })
        );
      }
    }

    await Promise.all(actions);
    return { domain: 'media_player', count: actions.length };
  }

  /**
   * Trigger a scene based on spoon state
   */
  async triggerSpoonScene(stateLevel) {
    const scenes = this.getEntitiesByDomain('scene');
    
    // Look for scenes matching our state names
    const sceneMap = {
      crisis: ['scene.crisis_mode', 'scene.calm_down', 'scene.emergency'],
      low: ['scene.low_energy', 'scene.rest_mode', 'scene.gentle'],
      moderate: ['scene.normal', 'scene.default', 'scene.everyday'],
      good: ['scene.energized', 'scene.productive', 'scene.focus'],
      optimal: ['scene.optimal', 'scene.peak', 'scene.full_power']
    };

    const targetScenes = sceneMap[stateLevel];
    
    for (const sceneName of targetScenes) {
      const scene = scenes.find(s => s.entityId === sceneName);
      if (scene) {
        await this.callService('/services/scene/turn_on', 'POST', {
          entity_id: scene.entityId
        });
        return { domain: 'scene', activated: scene.entityId };
      }
    }

    return { domain: 'scene', activated: null };
  }

  // ============================================
  // HELPER METHODS
  // ============================================

  /**
   * Get entities by domain (light, switch, climate, etc.)
   */
  getEntitiesByDomain(domain) {
    return Array.from(this.entities.values())
      .filter(entity => entity.domain === domain);
  }

  /**
   * Get entity by ID
   */
  getEntity(entityId) {
    return this.entities.get(entityId);
  }

  /**
   * Get all available domains
   */
  getDomains() {
    const domains = new Set();
    for (const entity of this.entities.values()) {
      domains.add(entity.domain);
    }
    return Array.from(domains);
  }

  /**
   * Call a Home Assistant service directly
   */
  async callHAService(domain, service, data = {}) {
    return this.callService(`/services/${domain}/${service}`, 'POST', data);
  }

  /**
   * Get device states for Love Economy dashboard
   */
  getStatusForDashboard() {
    return {
      connected: this.wsConnection?.readyState === 1,
      entityCount: this.entities.size,
      domains: this.getDomains(),
      lights: this.getEntitiesByDomain('light').length,
      switches: this.getEntitiesByDomain('switch').length,
      climate: this.getEntitiesByDomain('climate').length,
      sensors: this.getEntitiesByDomain('sensor').length,
      mediaPlayers: this.getEntitiesByDomain('media_player').length
    };
  }

  /**
   * Clean up connections
   */
  async disconnect() {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
    this.entities.clear();
    this.pendingRequests.clear();
  }
}

module.exports = { HomeAssistantAdapter };