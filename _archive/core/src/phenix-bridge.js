/**
 * PHENIX NAVIGATOR BRIDGE - ESP32 Hardware Communication
 * L.O.V.E. Economy v4.0.0
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱🔥
 * 
 * Features:
 * - BLE/Serial communication with ESP32-S3
 * - LED color/pattern control (WS2812B)
 * - Haptic feedback (vibration motor)
 * - Display synchronization (touch LCD)
 * - Button/gesture event handling
 * - Quantum sensor interface
 * - Environmental sensors (temp, humidity)
 * - Emergency button support
 */

const EventEmitter = require('events');

// ============================================================================
// CONFIGURATION
// ============================================================================

const PHENIX_CONFIG = {
  // Connection settings
  CONNECTION: {
    BLE_SERVICE_UUID: 'e93c4a84-3c00-5e6d-c8f8-d90a0e36d8f5',
    BLE_CHAR_TX: 'e93c4a84-3c00-5e6d-c8f8-d90a0e36d8f6',
    BLE_CHAR_RX: 'e93c4a84-3c00-5e6d-c8f8-d90a0e36d8f7',
    SERIAL_BAUD: 115200,
    RECONNECT_INTERVAL_MS: 5000,
    HEARTBEAT_INTERVAL_MS: 10000,
    CONNECTION_TIMEOUT_MS: 30000
  },
  
  // LED patterns
  LED_PATTERNS: {
    SOLID: 'solid',
    BREATHE: 'breathe',
    PULSE: 'pulse',
    RAINBOW: 'rainbow',
    ALERT: 'alert',
    SUCCESS: 'success',
    WARNING: 'warning',
    EMERGENCY: 'emergency',
    SPOON_METER: 'spoon_meter',
    COHERENCE: 'coherence'
  },
  
  // LED colors (RGB)
  LED_COLORS: {
    OFF: [0, 0, 0],
    WHITE: [255, 255, 255],
    RED: [255, 0, 0],
    GREEN: [0, 255, 0],
    BLUE: [0, 0, 255],
    YELLOW: [255, 255, 0],
    PURPLE: [138, 43, 226],
    ORANGE: [255, 165, 0],
    PINK: [255, 105, 180],
    CYAN: [0, 255, 255],
    GOLD: [255, 215, 0],
    // Spoon levels
    SPOON_FULL: [0, 255, 100],     // Green
    SPOON_MID: [255, 200, 0],      // Yellow
    SPOON_LOW: [255, 100, 0],      // Orange
    SPOON_CRITICAL: [255, 0, 0],   // Red
    // Coherence levels
    COHERENCE_HIGH: [0, 255, 100],
    COHERENCE_MED: [100, 200, 255],
    COHERENCE_LOW: [255, 100, 100]
  },
  
  // Haptic patterns
  HAPTIC_PATTERNS: {
    TAP: { duration: 50, intensity: 200 },
    DOUBLE_TAP: { sequence: [[50, 200], [50, 0], [50, 200]] },
    LONG: { duration: 200, intensity: 255 },
    ALERT: { sequence: [[100, 255], [50, 0], [100, 255], [50, 0], [100, 255]] },
    SUCCESS: { sequence: [[50, 200], [100, 0], [150, 255]] },
    WARNING: { sequence: [[200, 200], [100, 0], [200, 200]] },
    HEARTBEAT: { sequence: [[50, 255], [50, 0], [100, 200]] },
    EMERGENCY: { sequence: [[100, 255], [50, 0]] }  // Repeating
  },
  
  // Gesture mappings
  GESTURES: {
    TAP: 'tap',
    DOUBLE_TAP: 'double_tap',
    LONG_PRESS: 'long_press',
    SWIPE_UP: 'swipe_up',
    SWIPE_DOWN: 'swipe_down',
    SWIPE_LEFT: 'swipe_left',
    SWIPE_RIGHT: 'swipe_right',
    ROTATE_CW: 'rotate_cw',
    ROTATE_CCW: 'rotate_ccw'
  },
  
  // Button IDs
  BUTTONS: {
    MAIN: 0,
    SHIELD: 1,
    EMERGENCY: 2
  },
  
  // Display modes
  DISPLAY_MODES: {
    SPOON_METER: 'spoon_meter',
    BIOMETRICS: 'biometrics',
    COHERENCE: 'coherence',
    QUEST: 'quest',
    NAVIGATION: 'navigation',
    MINIMAL: 'minimal',
    OFF: 'off'
  },
  
  // Command types (to device)
  COMMANDS: {
    LED_SET: 0x01,
    LED_PATTERN: 0x02,
    HAPTIC: 0x03,
    DISPLAY_MODE: 0x04,
    DISPLAY_DATA: 0x05,
    SYNC_STATE: 0x06,
    REQUEST_SENSORS: 0x07,
    CALIBRATE: 0x08,
    OTA_UPDATE: 0x09,
    SHUTDOWN: 0x0A,
    ALERT: 0x0B
  },
  
  // Event types (from device)
  EVENTS: {
    BUTTON_PRESS: 0x10,
    BUTTON_RELEASE: 0x11,
    GESTURE: 0x12,
    SENSOR_DATA: 0x13,
    BATTERY: 0x14,
    CONNECTION: 0x15,
    ERROR: 0x16,
    QUANTUM_DATA: 0x17
  }
};

// ============================================================================
// MESSAGE PROTOCOL
// ============================================================================

/**
 * Protocol message format for ESP32 communication
 */
class PhenixMessage {
  constructor(type, payload = {}) {
    this.type = type;
    this.payload = payload;
    this.timestamp = Date.now();
    this.id = Math.random().toString(36).substr(2, 9);
  }
  
  /**
   * Encode message to buffer for transmission
   */
  encode() {
    const json = JSON.stringify({
      t: this.type,
      p: this.payload,
      ts: this.timestamp,
      id: this.id
    });
    
    // Add length header and checksum
    const data = Buffer.from(json, 'utf8');
    const header = Buffer.alloc(4);
    header.writeUInt16LE(data.length, 0);
    header.writeUInt16LE(this._checksum(data), 2);
    
    return Buffer.concat([header, data]);
  }
  
  /**
   * Decode message from buffer
   */
  static decode(buffer) {
    try {
      const length = buffer.readUInt16LE(0);
      const checksum = buffer.readUInt16LE(2);
      const data = buffer.slice(4, 4 + length);
      
      // Verify checksum
      const computed = PhenixMessage.prototype._checksum(data);
      if (computed !== checksum) {
        throw new Error('Checksum mismatch');
      }
      
      const json = JSON.parse(data.toString('utf8'));
      const msg = new PhenixMessage(json.t, json.p);
      msg.timestamp = json.ts;
      msg.id = json.id;
      return msg;
    } catch (e) {
      return null;
    }
  }
  
  _checksum(data) {
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum = (sum + data[i]) & 0xFFFF;
    }
    return sum;
  }
}

// ============================================================================
// LED CONTROLLER
// ============================================================================

/**
 * Controls LED strip on Phenix Navigator
 */
class LEDController {
  constructor(bridge) {
    this.bridge = bridge;
    this.currentColor = PHENIX_CONFIG.LED_COLORS.OFF;
    this.currentPattern = PHENIX_CONFIG.LED_PATTERNS.SOLID;
    this.brightness = 255;
    this.isOn = false;
  }
  
  /**
   * Set solid color
   */
  async setColor(rgb, brightness = null) {
    this.currentColor = rgb;
    if (brightness !== null) this.brightness = brightness;
    this.isOn = rgb[0] > 0 || rgb[1] > 0 || rgb[2] > 0;
    
    return this.bridge.sendCommand(PHENIX_CONFIG.COMMANDS.LED_SET, {
      r: rgb[0],
      g: rgb[1],
      b: rgb[2],
      brightness: this.brightness
    });
  }
  
  /**
   * Set LED pattern
   */
  async setPattern(pattern, options = {}) {
    this.currentPattern = pattern;
    
    return this.bridge.sendCommand(PHENIX_CONFIG.COMMANDS.LED_PATTERN, {
      pattern,
      color: options.color || this.currentColor,
      speed: options.speed || 1000,
      duration: options.duration || 0,  // 0 = indefinite
      brightness: options.brightness || this.brightness
    });
  }
  
  /**
   * Show spoon level on LED
   */
  async showSpoonLevel(currentSpoons, maxSpoons) {
    const percent = currentSpoons / maxSpoons;
    let color;
    
    if (percent >= 0.6) {
      color = PHENIX_CONFIG.LED_COLORS.SPOON_FULL;
    } else if (percent >= 0.35) {
      color = PHENIX_CONFIG.LED_COLORS.SPOON_MID;
    } else if (percent >= 0.15) {
      color = PHENIX_CONFIG.LED_COLORS.SPOON_LOW;
    } else {
      color = PHENIX_CONFIG.LED_COLORS.SPOON_CRITICAL;
    }
    
    // Use breathe pattern for low spoons
    const pattern = percent < 0.25 
      ? PHENIX_CONFIG.LED_PATTERNS.BREATHE 
      : PHENIX_CONFIG.LED_PATTERNS.SOLID;
    
    return this.setPattern(pattern, { color, speed: 2000 });
  }
  
  /**
   * Show coherence level
   */
  async showCoherence(level) {
    const colors = {
      high: PHENIX_CONFIG.LED_COLORS.COHERENCE_HIGH,
      medium: PHENIX_CONFIG.LED_COLORS.COHERENCE_MED,
      low: PHENIX_CONFIG.LED_COLORS.COHERENCE_LOW
    };
    
    const color = colors[level] || colors.low;
    return this.setPattern(PHENIX_CONFIG.LED_PATTERNS.COHERENCE, { color });
  }
  
  /**
   * Flash alert
   */
  async flashAlert(type = 'warning', duration = 3000) {
    const colors = {
      success: PHENIX_CONFIG.LED_COLORS.GREEN,
      warning: PHENIX_CONFIG.LED_COLORS.ORANGE,
      error: PHENIX_CONFIG.LED_COLORS.RED,
      info: PHENIX_CONFIG.LED_COLORS.BLUE
    };
    
    return this.setPattern(PHENIX_CONFIG.LED_PATTERNS.ALERT, {
      color: colors[type] || colors.warning,
      duration
    });
  }
  
  /**
   * Turn off
   */
  async off() {
    this.isOn = false;
    return this.setColor(PHENIX_CONFIG.LED_COLORS.OFF);
  }
  
  getState() {
    return {
      isOn: this.isOn,
      color: this.currentColor,
      pattern: this.currentPattern,
      brightness: this.brightness
    };
  }
}

// ============================================================================
// HAPTIC CONTROLLER
// ============================================================================

/**
 * Controls haptic feedback motor
 */
class HapticController {
  constructor(bridge) {
    this.bridge = bridge;
    this.isActive = false;
  }
  
  /**
   * Simple vibration
   */
  async vibrate(duration = 100, intensity = 255) {
    this.isActive = true;
    const result = await this.bridge.sendCommand(PHENIX_CONFIG.COMMANDS.HAPTIC, {
      type: 'single',
      duration,
      intensity
    });
    
    // Auto-deactivate
    setTimeout(() => { this.isActive = false; }, duration);
    return result;
  }
  
  /**
   * Pattern vibration
   */
  async pattern(patternName) {
    const pattern = PHENIX_CONFIG.HAPTIC_PATTERNS[patternName.toUpperCase()];
    if (!pattern) {
      return { error: 'Unknown pattern' };
    }
    
    this.isActive = true;
    const result = await this.bridge.sendCommand(PHENIX_CONFIG.COMMANDS.HAPTIC, {
      type: 'pattern',
      pattern: patternName,
      data: pattern
    });
    
    return result;
  }
  
  /**
   * Custom sequence
   */
  async sequence(steps) {
    // steps: [[duration, intensity], ...]
    this.isActive = true;
    return this.bridge.sendCommand(PHENIX_CONFIG.COMMANDS.HAPTIC, {
      type: 'sequence',
      sequence: steps
    });
  }
  
  /**
   * Heartbeat pattern (continuous until stopped)
   */
  async startHeartbeat(bpm = 60) {
    const intervalMs = 60000 / bpm;
    return this.bridge.sendCommand(PHENIX_CONFIG.COMMANDS.HAPTIC, {
      type: 'heartbeat',
      interval: intervalMs
    });
  }
  
  /**
   * Stop haptic
   */
  async stop() {
    this.isActive = false;
    return this.bridge.sendCommand(PHENIX_CONFIG.COMMANDS.HAPTIC, {
      type: 'stop'
    });
  }
}

// ============================================================================
// DISPLAY CONTROLLER
// ============================================================================

/**
 * Controls the touch LCD display
 */
class DisplayController {
  constructor(bridge) {
    this.bridge = bridge;
    this.currentMode = PHENIX_CONFIG.DISPLAY_MODES.SPOON_METER;
    this.brightness = 255;
    this.timeout = 30000;  // Auto-dim timeout
  }
  
  /**
   * Set display mode
   */
  async setMode(mode) {
    this.currentMode = mode;
    return this.bridge.sendCommand(PHENIX_CONFIG.COMMANDS.DISPLAY_MODE, {
      mode
    });
  }
  
  /**
   * Update display data
   */
  async updateData(data) {
    return this.bridge.sendCommand(PHENIX_CONFIG.COMMANDS.DISPLAY_DATA, data);
  }
  
  /**
   * Show spoon meter
   */
  async showSpoonMeter(currentSpoons, maxSpoons, trend, shieldActive) {
    await this.setMode(PHENIX_CONFIG.DISPLAY_MODES.SPOON_METER);
    return this.updateData({
      current: currentSpoons,
      max: maxSpoons,
      percent: (currentSpoons / maxSpoons) * 100,
      trend,
      shield: shieldActive
    });
  }
  
  /**
   * Show biometrics
   */
  async showBiometrics(data) {
    await this.setMode(PHENIX_CONFIG.DISPLAY_MODES.BIOMETRICS);
    return this.updateData({
      hr: data.heartRate,
      hrv: data.hrv,
      spo2: data.spo2,
      stress: data.stress,
      steps: data.steps
    });
  }
  
  /**
   * Show coherence visualization
   */
  async showCoherence(coherence, level) {
    await this.setMode(PHENIX_CONFIG.DISPLAY_MODES.COHERENCE);
    return this.updateData({
      coherence,
      level
    });
  }
  
  /**
   * Show alert popup
   */
  async showAlert(type, message, options = {}) {
    return this.bridge.sendCommand(PHENIX_CONFIG.COMMANDS.ALERT, {
      type,  // success, warning, error, info
      message,
      duration: options.duration || 3000,
      icon: options.icon
    });
  }
  
  /**
   * Set brightness
   */
  async setBrightness(level) {
    this.brightness = Math.max(0, Math.min(255, level));
    return this.updateData({ brightness: this.brightness });
  }
  
  /**
   * Turn off display
   */
  async off() {
    return this.setMode(PHENIX_CONFIG.DISPLAY_MODES.OFF);
  }
  
  getState() {
    return {
      mode: this.currentMode,
      brightness: this.brightness,
      timeout: this.timeout
    };
  }
}

// ============================================================================
// PHENIX NAVIGATOR BRIDGE
// ============================================================================

/**
 * Main bridge for Phenix Navigator hardware communication
 */
class PhenixNavigatorBridge extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...PHENIX_CONFIG, ...config };
    this.connected = false;
    this.connectionType = null;  // 'ble' or 'serial'
    this.deviceInfo = null;
    
    // Controllers
    this.led = new LEDController(this);
    this.haptic = new HapticController(this);
    this.display = new DisplayController(this);
    
    // State
    this.battery = null;
    this.sensors = {};
    this.lastHeartbeat = null;
    
    // Message queue
    this.pendingCommands = new Map();
    this.commandTimeout = 5000;
    
    // Receive buffer
    this.receiveBuffer = Buffer.alloc(0);
    
    // Stats
    this.stats = {
      messagesSent: 0,
      messagesReceived: 0,
      errors: 0,
      reconnections: 0
    };
  }
  
  /**
   * Connect to Phenix Navigator
   */
  async connect(type = 'ble') {
    console.log(`[PhenixBridge] Connecting via ${type}...`);
    
    // In production: Actual BLE/Serial connection
    // For now: Simulate connection
    this.connectionType = type;
    this.connected = true;
    this.lastHeartbeat = Date.now();
    
    // Start heartbeat
    this._startHeartbeat();
    
    this.emit('connected', { type: this.connectionType });
    return { success: true, type: this.connectionType };
  }
  
  /**
   * Disconnect
   */
  async disconnect() {
    this.connected = false;
    this.connectionType = null;
    
    if (this._heartbeatTimer) {
      clearInterval(this._heartbeatTimer);
      this._heartbeatTimer = null;
    }
    
    this.emit('disconnected');
    return { success: true };
  }
  
  /**
   * Send command to device
   */
  async sendCommand(commandType, payload = {}) {
    if (!this.connected) {
      return { error: 'Not connected' };
    }
    
    const message = new PhenixMessage(commandType, payload);
    this.stats.messagesSent++;
    
    // In production: Actually send via BLE/Serial
    // For now: Simulate response
    console.log(`[PhenixBridge] TX: ${commandType}`, payload);
    
    return new Promise((resolve) => {
      this.pendingCommands.set(message.id, {
        resolve,
        timeout: setTimeout(() => {
          this.pendingCommands.delete(message.id);
          resolve({ error: 'Timeout' });
        }, this.commandTimeout)
      });
      
      // Simulate immediate response
      setTimeout(() => {
        this._handleResponse(message.id, { success: true, command: commandType });
      }, 50);
    });
  }
  
  /**
   * Handle incoming data
   */
  _handleIncoming(data) {
    // Append to buffer
    this.receiveBuffer = Buffer.concat([this.receiveBuffer, data]);
    
    // Try to parse messages
    while (this.receiveBuffer.length >= 4) {
      const length = this.receiveBuffer.readUInt16LE(0);
      if (this.receiveBuffer.length >= 4 + length) {
        const message = PhenixMessage.decode(this.receiveBuffer.slice(0, 4 + length));
        this.receiveBuffer = this.receiveBuffer.slice(4 + length);
        
        if (message) {
          this._processMessage(message);
        }
      } else {
        break;  // Wait for more data
      }
    }
  }
  
  /**
   * Process incoming message
   */
  _processMessage(message) {
    this.stats.messagesReceived++;
    
    switch (message.type) {
      case PHENIX_CONFIG.EVENTS.BUTTON_PRESS:
        this._handleButton(message.payload, true);
        break;
      case PHENIX_CONFIG.EVENTS.BUTTON_RELEASE:
        this._handleButton(message.payload, false);
        break;
      case PHENIX_CONFIG.EVENTS.GESTURE:
        this._handleGesture(message.payload);
        break;
      case PHENIX_CONFIG.EVENTS.SENSOR_DATA:
        this._handleSensors(message.payload);
        break;
      case PHENIX_CONFIG.EVENTS.BATTERY:
        this._handleBattery(message.payload);
        break;
      case PHENIX_CONFIG.EVENTS.QUANTUM_DATA:
        this._handleQuantum(message.payload);
        break;
      case PHENIX_CONFIG.EVENTS.ERROR:
        this._handleError(message.payload);
        break;
      default:
        // Check if it's a response to a pending command
        this._handleResponse(message.id, message.payload);
    }
  }
  
  /**
   * Handle command response
   */
  _handleResponse(messageId, payload) {
    const pending = this.pendingCommands.get(messageId);
    if (pending) {
      clearTimeout(pending.timeout);
      pending.resolve(payload);
      this.pendingCommands.delete(messageId);
    }
  }
  
  /**
   * Handle button events
   */
  _handleButton(payload, pressed) {
    const event = pressed ? 'buttonPress' : 'buttonRelease';
    this.emit(event, { button: payload.button, timestamp: Date.now() });
    
    // Special handling for emergency button
    if (payload.button === PHENIX_CONFIG.BUTTONS.EMERGENCY && pressed) {
      this.emit('emergency', { timestamp: Date.now() });
    }
    
    // Shield toggle button
    if (payload.button === PHENIX_CONFIG.BUTTONS.SHIELD && pressed) {
      this.emit('toggleShield', { timestamp: Date.now() });
    }
  }
  
  /**
   * Handle gesture events
   */
  _handleGesture(payload) {
    const gesture = payload.gesture;
    
    // Map gestures to actions
    const actions = {
      [PHENIX_CONFIG.GESTURES.SWIPE_UP]: 'increaseSpoons',
      [PHENIX_CONFIG.GESTURES.SWIPE_DOWN]: 'decreaseSpoons',
      [PHENIX_CONFIG.GESTURES.DOUBLE_TAP]: 'toggleMode',
      [PHENIX_CONFIG.GESTURES.LONG_PRESS]: 'showMenu',
      [PHENIX_CONFIG.GESTURES.ROTATE_CW]: 'nextScreen',
      [PHENIX_CONFIG.GESTURES.ROTATE_CCW]: 'prevScreen'
    };
    
    const action = actions[gesture];
    if (action) {
      this.emit('gestureAction', { gesture, action, timestamp: Date.now() });
    }
    
    this.emit('gesture', { gesture, timestamp: Date.now() });
  }
  
  /**
   * Handle sensor data
   */
  _handleSensors(payload) {
    this.sensors = {
      ...this.sensors,
      temperature: payload.temp,
      humidity: payload.humidity,
      pressure: payload.pressure,
      light: payload.light,
      timestamp: Date.now()
    };
    
    this.emit('sensors', this.sensors);
  }
  
  /**
   * Handle battery update
   */
  _handleBattery(payload) {
    this.battery = {
      level: payload.level,
      charging: payload.charging,
      voltage: payload.voltage,
      timestamp: Date.now()
    };
    
    this.emit('battery', this.battery);
    
    // Low battery alert
    if (payload.level < 20 && !payload.charging) {
      this.emit('lowBattery', this.battery);
    }
  }
  
  /**
   * Handle quantum sensor data (if equipped)
   */
  _handleQuantum(payload) {
    this.emit('quantum', {
      entropy: payload.entropy,
      randomBits: payload.bits,
      timestamp: Date.now()
    });
  }
  
  /**
   * Handle error from device
   */
  _handleError(payload) {
    this.stats.errors++;
    console.error('[PhenixBridge] Device error:', payload);
    this.emit('error', payload);
  }
  
  /**
   * Heartbeat to keep connection alive
   */
  _startHeartbeat() {
    this._heartbeatTimer = setInterval(async () => {
      if (!this.connected) return;
      
      try {
        const result = await this.sendCommand(PHENIX_CONFIG.COMMANDS.REQUEST_SENSORS, {});
        if (result.success) {
          this.lastHeartbeat = Date.now();
        }
      } catch (e) {
        // Connection may be lost
        if (Date.now() - this.lastHeartbeat > this.config.CONNECTION.CONNECTION_TIMEOUT_MS) {
          this.connected = false;
          this.emit('connectionLost');
          this._attemptReconnect();
        }
      }
    }, this.config.CONNECTION.HEARTBEAT_INTERVAL_MS);
  }
  
  /**
   * Attempt reconnection
   */
  async _attemptReconnect() {
    console.log('[PhenixBridge] Attempting reconnection...');
    this.stats.reconnections++;
    
    try {
      await this.connect(this.connectionType);
      console.log('[PhenixBridge] Reconnected');
      this.emit('reconnected');
    } catch (e) {
      setTimeout(() => this._attemptReconnect(), 
        this.config.CONNECTION.RECONNECT_INTERVAL_MS);
    }
  }
  
  // ============================================
  // HIGH-LEVEL API
  // ============================================
  
  /**
   * Set LED color (convenience method)
   */
  async setLED(rgb, pattern = 'solid', options = {}) {
    if (pattern === 'solid') {
      return this.led.setColor(rgb);
    }
    return this.led.setPattern(pattern, { color: rgb, ...options });
  }
  
  /**
   * Trigger haptic (convenience method)
   */
  async haptic(pattern = 'tap') {
    return this.haptic.pattern(pattern);
  }
  
  /**
   * Show alert (convenience method)
   */
  async showAlert(type, message, options = {}) {
    // Show on display
    await this.display.showAlert(type, message, options);
    
    // LED flash
    await this.led.flashAlert(type, options.duration || 3000);
    
    // Haptic feedback
    const hapticMap = {
      success: 'success',
      warning: 'warning',
      error: 'alert',
      info: 'tap'
    };
    await this.haptic.pattern(hapticMap[type] || 'tap');
    
    return { success: true };
  }
  
  /**
   * Sync full spoon state
   */
  async syncSpoonState(state) {
    // Update display
    await this.display.showSpoonMeter(
      state.currentSpoons,
      state.maxSpoons,
      state.trend,
      state.shieldActive
    );
    
    // Update LED
    await this.led.showSpoonLevel(state.currentSpoons, state.maxSpoons);
    
    return { success: true };
  }
  
  /**
   * Handle biometric alert
   */
  async handleBiometricAlert(alert) {
    const messages = {
      hr_very_high: '⚠️ Heart rate critical!',
      hr_high: '💓 Heart rate elevated',
      hr_low: '💓 Heart rate low',
      spo2_critical: '🫁 Blood oxygen critical!',
      spo2_low: '🫁 Blood oxygen low',
      stress_high: '😰 High stress detected'
    };
    
    const message = messages[alert.type] || `Alert: ${alert.type}`;
    const type = alert.severity === 'critical' ? 'error' : 'warning';
    
    return this.showAlert(type, message, { duration: 5000 });
  }
  
  /**
   * Get comprehensive state
   */
  getState() {
    return {
      connected: this.connected,
      connectionType: this.connectionType,
      battery: this.battery,
      sensors: this.sensors,
      led: this.led.getState(),
      display: this.display.getState(),
      lastHeartbeat: this.lastHeartbeat,
      stats: this.stats
    };
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  PHENIX_CONFIG,
  PhenixMessage,
  LEDController,
  HapticController,
  DisplayController,
  PhenixNavigatorBridge
};