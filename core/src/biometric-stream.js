/**
 * BIOMETRIC STREAM MANAGER - Real-Time Wearable Data Pipeline
 * L.O.V.E. Economy v4.0.0
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱💓
 * 
 * Features:
 * - BLE GATT characteristic subscriptions
 * - Real-time HRV calculation from IBI
 * - Multi-device synchronization
 * - Coherence detection for PoC integration
 * - Alert generation for anomalies
 * - RSSI proximity tracking
 */

const EventEmitter = require('events');

// ============================================================================
// CONFIGURATION
// ============================================================================

const BIOMETRIC_CONFIG = {
  // Supported devices
  DEVICES: {
    AMAZFIT_BALANCE: {
      name: 'Amazfit Balance',
      type: 'watch',
      capabilities: ['hr', 'hrv', 'spo2', 'stress', 'steps', 'sleep', 'pai'],
      bleServiceUUIDs: {
        heartRate: '0x180D',
        battery: '0x180F',
        deviceInfo: '0x180A'
      },
      bleCharacteristics: {
        heartRateMeasurement: '0x2A37',
        bodySensorLocation: '0x2A38',
        batteryLevel: '0x2A19'
      }
    },
    HELIOS_RING: {
      name: 'Helios Ring',
      type: 'ring',
      capabilities: ['hr', 'hrv', 'ibi', 'spo2', 'skin_temp', 'sleep', 'readiness'],
      bleServiceUUIDs: {
        heartRate: '0x180D',
        healthThermometer: '0x1809',
        custom: 'e93c3a84-2c00-4e6d-b8f8-c90a0e26c8f4'
      },
      bleCharacteristics: {
        heartRateMeasurement: '0x2A37',
        temperatureMeasurement: '0x2A1C',
        ibiData: 'e93c3a84-2c00-4e6d-b8f8-c90a0e26c8f5'
      }
    }
  },
  
  // Sampling configuration
  SAMPLING: {
    HR_INTERVAL_MS: 1000,
    HRV_WINDOW_SIZE: 120,      // 2 minutes of IBI data
    HRV_UPDATE_INTERVAL_MS: 30000,  // Calculate HRV every 30 seconds
    RSSI_INTERVAL_MS: 5000,
    COHERENCE_WINDOW_MS: 60000  // 1 minute for coherence calculation
  },
  
  // Alert thresholds
  ALERTS: {
    hr_high: { threshold: 150, message: 'Heart rate elevated' },
    hr_low: { threshold: 45, message: 'Heart rate low' },
    hr_very_high: { threshold: 180, message: 'Heart rate critically high!' },
    spo2_low: { threshold: 94, message: 'Blood oxygen low' },
    spo2_critical: { threshold: 90, message: 'Blood oxygen critical!' },
    stress_high: { threshold: 80, message: 'High stress detected' },
    hrv_low: { threshold: 20, message: 'Low HRV - possible stress' },
    temp_fever: { threshold: 38.0, message: 'Elevated temperature' }
  },
  
  // HRV metrics configuration
  HRV: {
    // Coherence frequency band (0.04-0.15 Hz, peak at ~0.1 Hz)
    LF_LOW: 0.04,
    LF_HIGH: 0.15,
    HF_LOW: 0.15,
    HF_HIGH: 0.4,
    COHERENCE_PEAK_HZ: 0.1,
    COHERENCE_TOLERANCE: 0.02
  }
};

// ============================================================================
// HRV CALCULATOR
// ============================================================================

/**
 * Real-time HRV calculation from IBI (Inter-Beat Intervals)
 */
class HRVCalculator {
  constructor(windowSize = BIOMETRIC_CONFIG.SAMPLING.HRV_WINDOW_SIZE) {
    this.windowSize = windowSize;
    this.ibiBuffer = [];
    this.timestamps = [];
    this.lastCalculation = null;
  }
  
  /**
   * Add IBI sample
   */
  addSample(ibiMs, timestamp = Date.now()) {
    // Validate IBI (300ms to 2000ms is reasonable range)
    if (ibiMs < 300 || ibiMs > 2000) return false;
    
    this.ibiBuffer.push(ibiMs);
    this.timestamps.push(timestamp);
    
    // Trim to window size
    if (this.ibiBuffer.length > this.windowSize) {
      this.ibiBuffer.shift();
      this.timestamps.shift();
    }
    
    return true;
  }
  
  /**
   * Add multiple IBI samples
   */
  addSamples(ibiArray, startTimestamp = Date.now()) {
    let ts = startTimestamp;
    for (const ibi of ibiArray) {
      this.addSample(ibi, ts);
      ts += ibi;
    }
  }
  
  /**
   * Calculate comprehensive HRV metrics
   */
  calculate() {
    if (this.ibiBuffer.length < 30) {
      return { valid: false, reason: 'Insufficient data (need 30+ samples)' };
    }
    
    const ibi = this.ibiBuffer;
    const n = ibi.length;
    
    // Time-domain metrics
    const mean = ibi.reduce((a, b) => a + b, 0) / n;
    const hr = 60000 / mean;  // Heart rate from mean IBI
    
    // SDNN - Standard deviation of NN intervals
    const variance = ibi.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / n;
    const sdnn = Math.sqrt(variance);
    
    // RMSSD - Root mean square of successive differences
    let sumSquaredDiff = 0;
    for (let i = 1; i < n; i++) {
      sumSquaredDiff += Math.pow(ibi[i] - ibi[i - 1], 2);
    }
    const rmssd = Math.sqrt(sumSquaredDiff / (n - 1));
    
    // pNN50 - Percentage of successive differences > 50ms
    let nn50Count = 0;
    for (let i = 1; i < n; i++) {
      if (Math.abs(ibi[i] - ibi[i - 1]) > 50) nn50Count++;
    }
    const pnn50 = (nn50Count / (n - 1)) * 100;
    
    // Simplified coherence calculation
    // Real implementation would use FFT for frequency-domain analysis
    const coherence = this._calculateCoherence(ibi);
    
    // Stress estimate (inverse of HRV - simplified)
    const stressIndex = Math.max(0, Math.min(100, 100 - (rmssd * 2)));
    
    this.lastCalculation = {
      valid: true,
      timestamp: Date.now(),
      sampleCount: n,
      timeSpan: this.timestamps[n - 1] - this.timestamps[0],
      
      // Time-domain
      meanIBI: mean,
      heartRate: hr,
      sdnn: sdnn,
      rmssd: rmssd,
      pnn50: pnn50,
      
      // Derived
      coherence: coherence,
      coherenceLevel: this._getCoherenceLevel(coherence),
      stressIndex: stressIndex,
      
      // Quality indicators
      qualityScore: this._calculateQuality(ibi)
    };
    
    return this.lastCalculation;
  }
  
  /**
   * Calculate coherence (simplified without full FFT)
   * High coherence = regular, sinusoidal HRV pattern
   */
  _calculateCoherence(ibi) {
    if (ibi.length < 30) return 0;
    
    // Detrend the signal
    const mean = ibi.reduce((a, b) => a + b, 0) / ibi.length;
    const detrended = ibi.map(v => v - mean);
    
    // Calculate autocorrelation at expected coherence period (~10 seconds = 10 beats)
    const lag = Math.min(10, Math.floor(ibi.length / 4));
    let autocorr = 0;
    let norm1 = 0;
    let norm2 = 0;
    
    for (let i = 0; i < ibi.length - lag; i++) {
      autocorr += detrended[i] * detrended[i + lag];
      norm1 += detrended[i] * detrended[i];
      norm2 += detrended[i + lag] * detrended[i + lag];
    }
    
    const correlation = autocorr / Math.sqrt(norm1 * norm2);
    
    // High positive correlation at coherence lag indicates coherent pattern
    // Transform to 0-1 range
    return Math.max(0, Math.min(1, (correlation + 1) / 2));
  }
  
  _getCoherenceLevel(coherence) {
    if (coherence >= 0.65) return 'high';
    if (coherence >= 0.45) return 'medium';
    if (coherence >= 0.25) return 'low';
    return 'very_low';
  }
  
  _calculateQuality(ibi) {
    // Check for outliers and gaps
    let outliers = 0;
    const median = [...ibi].sort((a, b) => a - b)[Math.floor(ibi.length / 2)];
    
    for (const v of ibi) {
      if (Math.abs(v - median) > median * 0.5) outliers++;
    }
    
    const outlierRatio = outliers / ibi.length;
    return Math.max(0, 1 - outlierRatio * 2);
  }
  
  /**
   * Get buffer state
   */
  getState() {
    return {
      sampleCount: this.ibiBuffer.length,
      windowSize: this.windowSize,
      fillPercent: (this.ibiBuffer.length / this.windowSize) * 100,
      lastCalculation: this.lastCalculation
    };
  }
  
  /**
   * Clear buffer
   */
  clear() {
    this.ibiBuffer = [];
    this.timestamps = [];
    this.lastCalculation = null;
  }
}

// ============================================================================
// DEVICE ADAPTER BASE
// ============================================================================

/**
 * Base class for device adapters
 */
class DeviceAdapter extends EventEmitter {
  constructor(deviceId, config) {
    super();
    this.deviceId = deviceId;
    this.config = config;
    this.connected = false;
    this.lastData = null;
    this.rssi = null;
    this.battery = null;
    this.hrvCalculator = new HRVCalculator();
    
    // Stats
    this.stats = {
      samplesReceived: 0,
      errors: 0,
      connectionTime: null,
      disconnections: 0
    };
  }
  
  /**
   * Connect to device (override in subclass)
   */
  async connect() {
    throw new Error('connect() must be implemented by subclass');
  }
  
  /**
   * Disconnect from device
   */
  async disconnect() {
    this.connected = false;
    this.emit('disconnected', { deviceId: this.deviceId });
  }
  
  /**
   * Process incoming data (override in subclass)
   */
  processData(data) {
    throw new Error('processData() must be implemented by subclass');
  }
  
  /**
   * Check for alerts based on data
   */
  checkAlerts(data) {
    const alerts = [];
    const thresholds = BIOMETRIC_CONFIG.ALERTS;
    
    if (data.type === 'heart_rate') {
      if (data.value >= thresholds.hr_very_high.threshold) {
        alerts.push({ type: 'hr_very_high', ...thresholds.hr_very_high, value: data.value, severity: 'critical' });
      } else if (data.value >= thresholds.hr_high.threshold) {
        alerts.push({ type: 'hr_high', ...thresholds.hr_high, value: data.value, severity: 'warning' });
      } else if (data.value <= thresholds.hr_low.threshold) {
        alerts.push({ type: 'hr_low', ...thresholds.hr_low, value: data.value, severity: 'warning' });
      }
    }
    
    if (data.type === 'spo2') {
      if (data.value <= thresholds.spo2_critical.threshold) {
        alerts.push({ type: 'spo2_critical', ...thresholds.spo2_critical, value: data.value, severity: 'critical' });
      } else if (data.value <= thresholds.spo2_low.threshold) {
        alerts.push({ type: 'spo2_low', ...thresholds.spo2_low, value: data.value, severity: 'warning' });
      }
    }
    
    if (data.type === 'stress' && data.value >= thresholds.stress_high.threshold) {
      alerts.push({ type: 'stress_high', ...thresholds.stress_high, value: data.value, severity: 'warning' });
    }
    
    if (data.type === 'skin_temp' && data.value >= thresholds.temp_fever.threshold) {
      alerts.push({ type: 'temp_fever', ...thresholds.temp_fever, value: data.value, severity: 'warning' });
    }
    
    if (alerts.length > 0) {
      this.emit('alert', alerts);
    }
    
    return alerts;
  }
  
  getInfo() {
    return {
      deviceId: this.deviceId,
      name: this.config.name,
      type: this.config.type,
      capabilities: this.config.capabilities,
      connected: this.connected,
      battery: this.battery,
      rssi: this.rssi,
      stats: this.stats,
      hrvState: this.hrvCalculator.getState()
    };
  }
}

// ============================================================================
// AMAZFIT BALANCE ADAPTER
// ============================================================================

/**
 * Real-time adapter for Amazfit Balance
 */
class AmazfitBalanceAdapter extends DeviceAdapter {
  constructor(streamManager, deviceId = 'amazfit_balance') {
    super(deviceId, BIOMETRIC_CONFIG.DEVICES.AMAZFIT_BALANCE);
    this.streamManager = streamManager;
  }
  
  async connect() {
    // In production: Use Web Bluetooth or noble for actual BLE connection
    // For now: Simulate connection for Gadgetbridge Intent API
    console.log(`[BiometricStream] Connecting to Amazfit Balance...`);
    
    this.connected = true;
    this.stats.connectionTime = Date.now();
    
    this.emit('connected', { deviceId: this.deviceId, info: this.getInfo() });
    return { success: true, deviceId: this.deviceId };
  }
  
  /**
   * Process incoming Gadgetbridge data
   */
  processData(data) {
    this.stats.samplesReceived++;
    this.lastData = { ...data, timestamp: Date.now() };
    
    const normalized = {
      deviceId: this.deviceId,
      deviceName: this.config.name,
      timestamp: data.timestamp || Date.now(),
      type: data.type,
      value: data.value,
      unit: this._getUnit(data.type),
      raw: data,
      rssi: data.rssi || this.rssi
    };
    
    // Feed IBI to HRV calculator if available
    if (data.type === 'ibi' && data.ibi) {
      this.hrvCalculator.addSamples(data.ibi);
    }
    
    // Check for alerts
    this.checkAlerts(normalized);
    
    // Emit normalized data
    this.emit('data', normalized);
    
    return normalized;
  }
  
  _getUnit(type) {
    const units = {
      heart_rate: 'bpm',
      hrv: 'ms',
      spo2: '%',
      stress: 'level',
      steps: 'steps',
      calories: 'kcal',
      distance: 'm',
      pai: 'points',
      body_battery: '%'
    };
    return units[type] || '';
  }
}

// ============================================================================
// HELIOS RING ADAPTER
// ============================================================================

/**
 * Real-time adapter for Helios Ring
 */
class HeliosRingAdapter extends DeviceAdapter {
  constructor(streamManager, deviceId = 'helios_ring') {
    super(deviceId, BIOMETRIC_CONFIG.DEVICES.HELIOS_RING);
    this.streamManager = streamManager;
  }
  
  async connect() {
    console.log(`[BiometricStream] Connecting to Helios Ring...`);
    
    this.connected = true;
    this.stats.connectionTime = Date.now();
    
    this.emit('connected', { deviceId: this.deviceId, info: this.getInfo() });
    return { success: true, deviceId: this.deviceId };
  }
  
  /**
   * Process incoming data
   */
  processData(data) {
    this.stats.samplesReceived++;
    this.lastData = { ...data, timestamp: Date.now() };
    
    const normalized = {
      deviceId: this.deviceId,
      deviceName: this.config.name,
      timestamp: data.timestamp || Date.now(),
      type: data.type,
      value: data.value,
      unit: this._getUnit(data.type),
      raw: data,
      rssi: data.rssi || this.rssi
    };
    
    // Helios Ring has high-precision IBI
    if (data.type === 'ibi' && data.ibi) {
      this.hrvCalculator.addSamples(data.ibi);
      
      // Auto-calculate HRV when we have enough data
      if (this.hrvCalculator.ibiBuffer.length >= 60) {
        const hrv = this.hrvCalculator.calculate();
        if (hrv.valid) {
          this.emit('hrv', hrv);
        }
      }
    }
    
    // Check for alerts
    this.checkAlerts(normalized);
    
    // Emit normalized data
    this.emit('data', normalized);
    
    return normalized;
  }
  
  _getUnit(type) {
    const units = {
      heart_rate: 'bpm',
      hrv: 'ms',
      ibi: 'ms',
      spo2: '%',
      skin_temp: '°C',
      sleep_score: 'score',
      readiness: 'score',
      respiration: 'brpm'
    };
    return units[type] || '';
  }
}

// ============================================================================
// BIOMETRIC STREAM MANAGER
// ============================================================================

/**
 * Main manager for all biometric streams
 */
class BiometricStreamManager extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...BIOMETRIC_CONFIG, ...config };
    this.devices = new Map();
    this.isStreaming = false;
    
    // Unified state
    this.currentState = {
      heartRate: null,
      hrv: null,
      spo2: null,
      stress: null,
      skinTemp: null,
      steps: null,
      sleepScore: null,
      readiness: null,
      coherence: null,
      lastUpdate: null
    };
    
    // HRV update timer
    this.hrvTimer = null;
    
    // Alert buffer (prevent spam)
    this.recentAlerts = [];
    this.alertCooldown = 60000;  // 1 minute between same alerts
    
    // Stats
    this.stats = {
      totalSamples: 0,
      totalAlerts: 0,
      sessionStart: null,
      devicesConnected: 0
    };
  }
  
  /**
   * Add and connect a device adapter
   */
  async addDevice(adapter) {
    this.devices.set(adapter.deviceId, adapter);
    
    // Wire events
    adapter.on('data', (data) => this._handleDeviceData(data));
    adapter.on('alert', (alerts) => this._handleAlerts(alerts));
    adapter.on('hrv', (hrv) => this._handleHRV(hrv));
    adapter.on('connected', () => {
      this.stats.devicesConnected++;
      this.emit('deviceConnected', adapter.getInfo());
    });
    adapter.on('disconnected', () => {
      this.stats.devicesConnected--;
      this.emit('deviceDisconnected', { deviceId: adapter.deviceId });
    });
    
    return adapter;
  }
  
  /**
   * Start streaming from all devices
   */
  async startStreaming() {
    this.isStreaming = true;
    this.stats.sessionStart = Date.now();
    
    const results = [];
    
    for (const [id, adapter] of this.devices) {
      try {
        const result = await adapter.connect();
        results.push({ deviceId: id, ...result });
      } catch (error) {
        results.push({ deviceId: id, success: false, error: error.message });
      }
    }
    
    // Start periodic HRV updates
    this.hrvTimer = setInterval(() => this._periodicHRVUpdate(), 
      this.config.SAMPLING.HRV_UPDATE_INTERVAL_MS);
    
    this.emit('streamingStarted', { devices: results });
    return results;
  }
  
  /**
   * Stop streaming
   */
  async stopStreaming() {
    this.isStreaming = false;
    
    if (this.hrvTimer) {
      clearInterval(this.hrvTimer);
      this.hrvTimer = null;
    }
    
    for (const adapter of this.devices.values()) {
      await adapter.disconnect();
    }
    
    this.emit('streamingStopped', { stats: this.stats });
  }
  
  /**
   * Feed data from external source (e.g., Gadgetbridge Intent)
   */
  feedData(deviceId, data) {
    const adapter = this.devices.get(deviceId);
    if (adapter) {
      return adapter.processData(data);
    }
    return null;
  }
  
  /**
   * Handle incoming device data
   */
  _handleDeviceData(data) {
    this.stats.totalSamples++;
    
    // Update unified state
    switch (data.type) {
      case 'heart_rate':
        this.currentState.heartRate = data.value;
        break;
      case 'hrv':
        this.currentState.hrv = data.value;
        break;
      case 'spo2':
        this.currentState.spo2 = data.value;
        break;
      case 'stress':
        this.currentState.stress = data.value;
        break;
      case 'skin_temp':
        this.currentState.skinTemp = data.value;
        break;
      case 'steps':
        this.currentState.steps = data.value;
        break;
      case 'sleep_score':
        this.currentState.sleepScore = data.value;
        break;
      case 'readiness':
        this.currentState.readiness = data.value;
        break;
    }
    
    this.currentState.lastUpdate = Date.now();
    
    // Forward to listeners
    this.emit('data', data);
  }
  
  /**
   * Handle HRV calculations
   */
  _handleHRV(hrv) {
    if (hrv.valid) {
      this.currentState.hrv = hrv.rmssd;
      this.currentState.coherence = hrv.coherence;
      this.emit('hrv', hrv);
    }
  }
  
  /**
   * Periodic HRV update from all devices
   */
  _periodicHRVUpdate() {
    for (const adapter of this.devices.values()) {
      const hrv = adapter.hrvCalculator.calculate();
      if (hrv.valid) {
        this._handleHRV(hrv);
      }
    }
  }
  
  /**
   * Handle alerts with cooldown
   */
  _handleAlerts(alerts) {
    const now = Date.now();
    const newAlerts = [];
    
    for (const alert of alerts) {
      // Check cooldown
      const recent = this.recentAlerts.find(a => 
        a.type === alert.type && (now - a.timestamp) < this.alertCooldown
      );
      
      if (!recent) {
        newAlerts.push({ ...alert, timestamp: now });
        this.recentAlerts.push({ type: alert.type, timestamp: now });
      }
    }
    
    // Clean old alerts
    this.recentAlerts = this.recentAlerts.filter(a => 
      (now - a.timestamp) < this.alertCooldown
    );
    
    if (newAlerts.length > 0) {
      this.stats.totalAlerts += newAlerts.length;
      this.emit('alert', newAlerts);
    }
  }
  
  /**
   * Get current unified state
   */
  getCurrentState() {
    return {
      ...this.currentState,
      isStreaming: this.isStreaming,
      connectedDevices: this.stats.devicesConnected
    };
  }
  
  /**
   * Get all connected devices
   */
  getDevices() {
    return Array.from(this.devices.values()).map(d => d.getInfo());
  }
  
  /**
   * Get specific device
   */
  getDevice(deviceId) {
    const adapter = this.devices.get(deviceId);
    return adapter ? adapter.getInfo() : null;
  }
  
  /**
   * Get HRV for device
   */
  getHRV(deviceId) {
    const adapter = this.devices.get(deviceId);
    if (!adapter) return null;
    return adapter.hrvCalculator.calculate();
  }
  
  /**
   * Get coherence for PoC
   */
  getCoherence(deviceId) {
    const hrv = this.getHRV(deviceId);
    if (!hrv || !hrv.valid) return null;
    return {
      coherence: hrv.coherence,
      level: hrv.coherenceLevel,
      rmssd: hrv.rmssd,
      timestamp: hrv.timestamp
    };
  }
  
  /**
   * Get stats
   */
  getStats() {
    return {
      ...this.stats,
      currentState: this.getCurrentState(),
      devices: this.getDevices()
    };
  }
}

// ============================================================================
// COHERENCE TRACKER (for PoC Integration)
// ============================================================================

/**
 * Tracks coherence between multiple devices for Proof of Care
 */
class CoherenceTracker {
  constructor() {
    this.deviceCoherence = new Map();  // deviceId -> coherence data
    this.syncWindow = [];               // Time windows where devices were coherent
  }
  
  /**
   * Update coherence for a device
   */
  updateCoherence(deviceId, coherenceData) {
    this.deviceCoherence.set(deviceId, {
      ...coherenceData,
      timestamp: Date.now()
    });
  }
  
  /**
   * Check if two devices are mutually coherent
   */
  areMutuallyCoherent(device1, device2, threshold = 0.3) {
    const c1 = this.deviceCoherence.get(device1);
    const c2 = this.deviceCoherence.get(device2);
    
    if (!c1 || !c2) return false;
    
    // Both must be above threshold
    if (c1.coherence < threshold || c2.coherence < threshold) return false;
    
    // Data must be recent (within 2 minutes)
    const now = Date.now();
    if (now - c1.timestamp > 120000 || now - c2.timestamp > 120000) return false;
    
    return true;
  }
  
  /**
   * Get sync score for PoC
   */
  getSyncScore(device1, device2) {
    const c1 = this.deviceCoherence.get(device1);
    const c2 = this.deviceCoherence.get(device2);
    
    if (!c1 || !c2) return 0;
    
    // Geometric mean of coherences
    return Math.sqrt(c1.coherence * c2.coherence);
  }
  
  /**
   * Record a sync window
   */
  recordSyncWindow(device1, device2, duration) {
    this.syncWindow.push({
      devices: [device1, device2],
      duration,
      timestamp: Date.now()
    });
    
    // Keep last 100 windows
    if (this.syncWindow.length > 100) {
      this.syncWindow.shift();
    }
  }
  
  /**
   * Get total sync time for device pair
   */
  getTotalSyncTime(device1, device2) {
    return this.syncWindow
      .filter(w => w.devices.includes(device1) && w.devices.includes(device2))
      .reduce((sum, w) => sum + w.duration, 0);
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  BIOMETRIC_CONFIG,
  HRVCalculator,
  DeviceAdapter,
  AmazfitBalanceAdapter,
  HeliosRingAdapter,
  BiometricStreamManager,
  CoherenceTracker
};