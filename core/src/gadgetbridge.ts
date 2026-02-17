/**
 * GADGETBRIDGE INTEGRATION - Advanced Wearable Data Pipeline
 * L.O.V.E. Economy v4.0.0
 * 
 * WONKY SPROUT FOR DA KIDS! 🌱⌚
 * 
 * Supports:
 * - Amazfit Balance (Zepp OS) - Full biometric suite
 * - Helios Ring - HRV, Sleep, Recovery focus
 * - Generic Gadgetbridge devices
 * 
 * Features:
 * - CSV batch import
 * - Real-time BLE streaming (via Gadgetbridge Intent API)
 * - IBI (Inter-Beat Interval) extraction for HRV analysis
 * - RSSI proximity tracking for Proof of Care
 * - Spoon cost estimation from biometrics
 */

// Conditional imports for Node.js environment
let fs, readline;
if (typeof require !== 'undefined') {
  fs = require('fs');
  readline = require('readline');
}

import { EventEmitter } from 'events';

// ============================================================================
// CONFIGURATION
// ============================================================================

const GADGETBRIDGE_CONFIG = {
  // Supported device types
  DEVICES: {
    AMAZFIT_BALANCE: 'amazfit_balance',
    HELIOS_RING: 'helios_ring',
    GENERIC: 'generic'
  },
  
  // Biometric data types
  DATA_TYPES: {
    HEART_RATE: 'heart_rate',
    HRV: 'hrv',
    IBI: 'ibi',              // Inter-Beat Intervals (raw for HRV)
    SPO2: 'spo2',
    STEPS: 'steps',
    CALORIES: 'calories',
    DISTANCE: 'distance',
    SLEEP: 'sleep',
    SLEEP_STAGE: 'sleep_stage',
    SLEEP_SCORE: 'sleep_score',
    STRESS: 'stress',
    BODY_BATTERY: 'body_battery',
    SKIN_TEMP: 'skin_temp',
    RESPIRATION: 'respiration',
    PAI: 'pai',              // Personal Activity Intelligence
    READINESS: 'readiness',
    ACTIVITY_TYPE: 'activity_type',
    RAW: 'raw'
  },
  
  // Sleep stages
  SLEEP_STAGES: {
    AWAKE: 0,
    LIGHT: 1,
    DEEP: 2,
    REM: 3
  },
  
  // Activity types
  ACTIVITY_TYPES: {
    UNKNOWN: 0,
    WALKING: 1,
    RUNNING: 2,
    CYCLING: 3,
    SWIMMING: 4,
    STRENGTH: 5,
    YOGA: 6,
    MEDITATION: 7
  },
  
  // Spoon cost mappings
  SPOON_COSTS: {
    // HR zones
    HR_RESTING: 0,          // No cost
    HR_LIGHT: 0.5,          // Light activity
    HR_MODERATE: 1,         // Moderate
    HR_VIGOROUS: 2,         // High intensity
    HR_MAX: 3,              // Maximum effort
    
    // Sleep quality impact
    SLEEP_EXCELLENT: -3,    // Restore spoons
    SLEEP_GOOD: -2,
    SLEEP_FAIR: -1,
    SLEEP_POOR: 1,          // Poor sleep costs spoons
    
    // Stress levels
    STRESS_LOW: 0,
    STRESS_MEDIUM: 0.5,
    STRESS_HIGH: 1.5,
    STRESS_CRITICAL: 2.5
  },
  
  // HR zone thresholds (percentage of max HR)
  HR_ZONES: {
    RESTING: 0.5,
    LIGHT: 0.6,
    MODERATE: 0.7,
    VIGOROUS: 0.85,
    MAX: 0.95
  },
  
  // Amazfit Balance specific
  AMAZFIT: {
    // Zepp OS data points
    SUPPORTED_METRICS: [
      'heart_rate', 'hrv', 'spo2', 'stress', 'pai',
      'steps', 'calories', 'distance', 'sleep', 'body_battery'
    ],
    // Sampling rates
    HR_INTERVAL_MS: 1000,      // 1 second HR sampling
    HRV_INTERVAL_MS: 300000,   // 5 minute HRV
    STRESS_INTERVAL_MS: 300000
  },
  
  // Helios Ring specific
  HELIOS: {
    SUPPORTED_METRICS: [
      'heart_rate', 'hrv', 'ibi', 'spo2', 'skin_temp',
      'sleep', 'sleep_score', 'readiness', 'respiration'
    ],
    // Ring-specific advantages
    IBI_PRECISION_MS: 1,      // 1ms IBI precision
    SKIN_TEMP_PRECISION: 0.1  // 0.1°C precision
  }
};

// ============================================================================
// NORMALIZED BIOMETRIC RECORD
// ============================================================================

/**
 * Standard format for all biometric data
 */
class BiometricRecord {
  constructor(data = {}) {
    this.id = `bio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.timestamp = data.timestamp || Date.now();
    this.device = data.device || GADGETBRIDGE_CONFIG.DEVICES.GENERIC;
    this.deviceName = data.deviceName || 'Unknown Device';
    this.type = data.type || GADGETBRIDGE_CONFIG.DATA_TYPES.RAW;
    this.value = data.value !== undefined ? data.value : null;
    this.unit = data.unit || '';
    this.quality = data.quality || 1.0;  // Data quality (0-1)
    this.raw = data.raw || {};
    
    // Optional extended data
    this.metadata = data.metadata || {};
    this.rssi = data.rssi || null;  // For proximity tracking
    this.ibi = data.ibi || null;    // For HRV calculation
  }
  
  /**
   * Estimate spoon cost from this biometric
   */
  estimateSpoonCost(userProfile = {}) {
    const maxHR = userProfile.maxHR || 180;
    const restingHR = userProfile.restingHR || 60;
    const costs = GADGETBRIDGE_CONFIG.SPOON_COSTS;
    const zones = GADGETBRIDGE_CONFIG.HR_ZONES;
    
    switch (this.type) {
      case 'heart_rate':
        const hrPercent = (this.value - restingHR) / (maxHR - restingHR);
        if (hrPercent < zones.RESTING) return costs.HR_RESTING;
        if (hrPercent < zones.LIGHT) return costs.HR_LIGHT;
        if (hrPercent < zones.MODERATE) return costs.HR_MODERATE;
        if (hrPercent < zones.VIGOROUS) return costs.HR_VIGOROUS;
        return costs.HR_MAX;
        
      case 'stress':
        if (this.value < 25) return costs.STRESS_LOW;
        if (this.value < 50) return costs.STRESS_MEDIUM;
        if (this.value < 75) return costs.STRESS_HIGH;
        return costs.STRESS_CRITICAL;
        
      case 'sleep_score':
        if (this.value >= 85) return costs.SLEEP_EXCELLENT;
        if (this.value >= 70) return costs.SLEEP_GOOD;
        if (this.value >= 50) return costs.SLEEP_FAIR;
        return costs.SLEEP_POOR;
        
      default:
        return 0;
    }
  }
  
  toJSON() {
    return {
      id: this.id,
      timestamp: this.timestamp,
      device: this.device,
      deviceName: this.deviceName,
      type: this.type,
      value: this.value,
      unit: this.unit,
      quality: this.quality,
      rssi: this.rssi,
      metadata: this.metadata
    };
  }
}

// ============================================================================
// AMAZFIT BALANCE ADAPTER
// ============================================================================

/**
 * Full adapter for Amazfit Balance (Zepp OS)
 */
class AmazfitBalanceAdapter {
  constructor() {
    this.deviceType = GADGETBRIDGE_CONFIG.DEVICES.AMAZFIT_BALANCE;
    this.deviceName = 'Amazfit Balance';
    this.config = GADGETBRIDGE_CONFIG.AMAZFIT;
    
    // Column mappings for Gadgetbridge CSV
    this.columnMappings = {
      // Standard Gadgetbridge columns
      'TIMESTAMP': 'timestamp',
      'HEART_RATE': 'heart_rate',
      'STEPS': 'steps',
      'RAW_INTENSITY': 'raw_intensity',
      'RAW_KIND': 'activity_type',
      
      // Zepp OS specific
      'SPO2': 'spo2',
      'STRESS': 'stress',
      'PAI': 'pai',
      'BODY_BATTERY': 'body_battery',
      'CALORIES': 'calories',
      'DISTANCE': 'distance',
      'HRV_SDNN': 'hrv',
      'HRV_RMSSD': 'hrv_rmssd',
      'SLEEP_STAGE': 'sleep_stage',
      'RESPIRATION_RATE': 'respiration'
    };
  }
  
  /**
   * Adapt a CSV row to BiometricRecords
   */
  adaptRow(row) {
    const records = [];
    
    // Parse timestamp
    let timestamp = Date.now();
    if (row.TIMESTAMP) {
      timestamp = row.TIMESTAMP.length > 11 
        ? parseInt(row.TIMESTAMP) 
        : parseInt(row.TIMESTAMP) * 1000;
    }
    
    // Heart Rate
    if (this._isValid(row.HEART_RATE)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'heart_rate',
        value: parseInt(row.HEART_RATE),
        unit: 'bpm',
        quality: row.HEART_RATE > 30 && row.HEART_RATE < 220 ? 1.0 : 0.5,
        raw: row
      }));
    }
    
    // Steps
    if (this._isValid(row.STEPS)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'steps',
        value: parseInt(row.STEPS),
        unit: 'steps',
        raw: row
      }));
    }
    
    // SpO2
    if (this._isValid(row.SPO2)) {
      const spo2 = parseInt(row.SPO2);
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'spo2',
        value: spo2,
        unit: '%',
        quality: spo2 >= 90 && spo2 <= 100 ? 1.0 : 0.3,
        raw: row
      }));
    }
    
    // Stress
    if (this._isValid(row.STRESS)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'stress',
        value: parseInt(row.STRESS),
        unit: 'level',
        metadata: { stressLevel: this._getStressLevel(parseInt(row.STRESS)) },
        raw: row
      }));
    }
    
    // PAI (Personal Activity Intelligence)
    if (this._isValid(row.PAI)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'pai',
        value: parseFloat(row.PAI),
        unit: 'points',
        raw: row
      }));
    }
    
    // Body Battery
    if (this._isValid(row.BODY_BATTERY)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'body_battery',
        value: parseInt(row.BODY_BATTERY),
        unit: '%',
        metadata: { energyLevel: this._getEnergyLevel(parseInt(row.BODY_BATTERY)) },
        raw: row
      }));
    }
    
    // HRV (SDNN)
    if (this._isValid(row.HRV_SDNN)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'hrv',
        value: parseInt(row.HRV_SDNN),
        unit: 'ms',
        metadata: { 
          metric: 'sdnn',
          rmssd: this._isValid(row.HRV_RMSSD) ? parseInt(row.HRV_RMSSD) : null
        },
        raw: row
      }));
    }
    
    // Sleep Stage
    if (this._isValid(row.SLEEP_STAGE)) {
      const stage = parseInt(row.SLEEP_STAGE);
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'sleep_stage',
        value: stage,
        unit: 'stage',
        metadata: { stageName: this._getSleepStageName(stage) },
        raw: row
      }));
    }
    
    // Calories
    if (this._isValid(row.CALORIES)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'calories',
        value: parseInt(row.CALORIES),
        unit: 'kcal',
        raw: row
      }));
    }
    
    // Distance
    if (this._isValid(row.DISTANCE)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'distance',
        value: parseFloat(row.DISTANCE),
        unit: 'm',
        raw: row
      }));
    }
    
    // Respiration Rate
    if (this._isValid(row.RESPIRATION_RATE)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'respiration',
        value: parseInt(row.RESPIRATION_RATE),
        unit: 'brpm',
        raw: row
      }));
    }
    
    return records;
  }
  
  _isValid(value) {
    return value !== null && value !== undefined && value !== '' && !isNaN(value);
  }
  
  _getStressLevel(value) {
    if (value < 25) return 'relaxed';
    if (value < 50) return 'normal';
    if (value < 75) return 'medium';
    return 'high';
  }
  
  _getEnergyLevel(value) {
    if (value >= 75) return 'high';
    if (value >= 50) return 'moderate';
    if (value >= 25) return 'low';
    return 'depleted';
  }
  
  _getSleepStageName(stage) {
    switch (stage) {
      case 0: return 'awake';
      case 1: return 'light';
      case 2: return 'deep';
      case 3: return 'rem';
      default: return 'unknown';
    }
  }
}

// ============================================================================
// HELIOS RING ADAPTER
// ============================================================================

/**
 * Full adapter for Helios Ring (focus on HRV/IBI precision)
 */
class HeliosRingAdapter {
  constructor() {
    this.deviceType = GADGETBRIDGE_CONFIG.DEVICES.HELIOS_RING;
    this.deviceName = 'Helios Ring';
    this.config = GADGETBRIDGE_CONFIG.HELIOS;
    
    // Column mappings
    this.columnMappings = {
      'TIMESTAMP': 'timestamp',
      'DATE': 'date',
      'HR': 'heart_rate',
      'HEART_RATE': 'heart_rate',
      'HRV': 'hrv',
      'HRV_SDNN': 'hrv',
      'HRV_RMSSD': 'hrv_rmssd',
      'IBI': 'ibi',           // Inter-Beat Intervals (comma-separated)
      'SPO2': 'spo2',
      'SKIN_TEMP': 'skin_temp',
      'TEMPERATURE': 'skin_temp',
      'SLEEP_SCORE': 'sleep_score',
      'SLEEP_STAGE': 'sleep_stage',
      'READINESS': 'readiness',
      'RECOVERY': 'readiness',
      'RESPIRATION': 'respiration',
      'MOVEMENT': 'movement'
    };
  }
  
  /**
   * Adapt a CSV row to BiometricRecords
   */
  adaptRow(row) {
    const records = [];
    
    // Parse timestamp
    let timestamp = Date.now();
    if (row.TIMESTAMP) {
      timestamp = row.TIMESTAMP.length > 11 
        ? parseInt(row.TIMESTAMP) 
        : parseInt(row.TIMESTAMP) * 1000;
    } else if (row.DATE) {
      timestamp = new Date(row.DATE).getTime();
    }
    
    // Heart Rate
    const hr = row.HR || row.HEART_RATE;
    if (this._isValid(hr)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'heart_rate',
        value: parseInt(hr),
        unit: 'bpm',
        raw: row
      }));
    }
    
    // HRV (SDNN)
    const hrv = row.HRV || row.HRV_SDNN;
    if (this._isValid(hrv)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'hrv',
        value: parseInt(hrv),
        unit: 'ms',
        metadata: {
          metric: 'sdnn',
          rmssd: this._isValid(row.HRV_RMSSD) ? parseInt(row.HRV_RMSSD) : null
        },
        raw: row
      }));
    }
    
    // IBI (Inter-Beat Intervals) - CRITICAL for PoC Q_res
    if (row.IBI && row.IBI.length > 0) {
      const ibiValues = this._parseIBI(row.IBI);
      if (ibiValues.length > 0) {
        records.push(new BiometricRecord({
          timestamp,
          device: this.deviceType,
          deviceName: this.deviceName,
          type: 'ibi',
          value: ibiValues.length,  // Number of intervals
          unit: 'count',
          ibi: ibiValues,          // Raw IBI array for HRV calculation
          metadata: {
            mean: ibiValues.reduce((a, b) => a + b, 0) / ibiValues.length,
            min: Math.min(...ibiValues),
            max: Math.max(...ibiValues)
          },
          raw: row
        }));
      }
    }
    
    // SpO2
    if (this._isValid(row.SPO2)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'spo2',
        value: parseInt(row.SPO2),
        unit: '%',
        raw: row
      }));
    }
    
    // Skin Temperature
    const skinTemp = row.SKIN_TEMP || row.TEMPERATURE;
    if (this._isValid(skinTemp)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'skin_temp',
        value: parseFloat(skinTemp),
        unit: '°C',
        metadata: { precision: 0.1 },
        raw: row
      }));
    }
    
    // Sleep Score
    if (this._isValid(row.SLEEP_SCORE)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'sleep_score',
        value: parseInt(row.SLEEP_SCORE),
        unit: 'score',
        metadata: { quality: this._getSleepQuality(parseInt(row.SLEEP_SCORE)) },
        raw: row
      }));
    }
    
    // Readiness / Recovery Score
    const readiness = row.READINESS || row.RECOVERY;
    if (this._isValid(readiness)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'readiness',
        value: parseInt(readiness),
        unit: 'score',
        metadata: { readinessLevel: this._getReadinessLevel(parseInt(readiness)) },
        raw: row
      }));
    }
    
    // Respiration Rate
    if (this._isValid(row.RESPIRATION)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'respiration',
        value: parseFloat(row.RESPIRATION),
        unit: 'brpm',
        raw: row
      }));
    }
    
    // Movement (for sleep tracking)
    if (this._isValid(row.MOVEMENT)) {
      records.push(new BiometricRecord({
        timestamp,
        device: this.deviceType,
        deviceName: this.deviceName,
        type: 'movement',
        value: parseInt(row.MOVEMENT),
        unit: 'count',
        raw: row
      }));
    }
    
    return records;
  }
  
  /**
   * Parse IBI string (comma or space separated)
   */
  _parseIBI(ibiString) {
    if (typeof ibiString !== 'string') return [];
    
    // Try comma separation first, then space
    let values = ibiString.includes(',') 
      ? ibiString.split(',') 
      : ibiString.split(' ');
    
    return values
      .map(v => parseFloat(v.trim()))
      .filter(v => !isNaN(v) && v > 200 && v < 2000);  // Valid IBI range
  }
  
  _isValid(value) {
    return value !== null && value !== undefined && value !== '' && !isNaN(value);
  }
  
  _getSleepQuality(score) {
    if (score >= 85) return 'excellent';
    if (score >= 70) return 'good';
    if (score >= 50) return 'fair';
    return 'poor';
  }
  
  _getReadinessLevel(score) {
    if (score >= 85) return 'optimal';
    if (score >= 70) return 'good';
    if (score >= 50) return 'moderate';
    return 'low';
  }
}

// ============================================================================
// GADGETBRIDGE INGESTOR
// ============================================================================

/**
 * Main Gadgetbridge CSV ingestor with streaming support
 */
class GadgetbridgeIngestor extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = { ...GADGETBRIDGE_CONFIG, ...config };
    
    // Initialize adapters
    this.adapters = {
      [GADGETBRIDGE_CONFIG.DEVICES.AMAZFIT_BALANCE]: new AmazfitBalanceAdapter(),
      [GADGETBRIDGE_CONFIG.DEVICES.HELIOS_RING]: new HeliosRingAdapter()
    };
    
    // Ingestion stats
    this.stats = {
      filesProcessed: 0,
      recordsProcessed: 0,
      errors: 0,
      lastIngestion: null
    };
  }
  
  /**
   * Ingest CSV file from Gadgetbridge export
   */
  async ingestCsv(filePath, deviceType = 'generic') {
    const records = [];
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }
    
    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
    
    let headers = null;
    let lineNumber = 0;
    
    const adapter = this.adapters[deviceType];
    
    for await (const line of rl) {
      lineNumber++;
      
      // Skip empty lines
      if (!line.trim()) continue;
      
      // First line is headers
      if (!headers) {
        headers = line.split(',').map(h => h.trim().toUpperCase());
        continue;
      }
      
      try {
        // Parse row
        const values = this._parseCsvLine(line);
        const row = {};
        headers.forEach((h, i) => {
          row[h] = values[i] ? values[i].trim() : null;
        });
        
        // Adapt row to BiometricRecords
        let adapted;
        if (adapter) {
          adapted = adapter.adaptRow(row);
        } else {
          adapted = this._adaptGeneric(row);
        }
        
        if (Array.isArray(adapted)) {
          records.push(...adapted);
        } else if (adapted) {
          records.push(adapted);
        }
        
      } catch (error) {
        this.stats.errors++;
        this.emit('error', { line: lineNumber, error: error.message });
      }
    }
    
    // Update stats
    this.stats.filesProcessed++;
    this.stats.recordsProcessed += records.length;
    this.stats.lastIngestion = Date.now();
    
    this.emit('ingested', { 
      file: filePath, 
      deviceType, 
      recordCount: records.length 
    });
    
    return records;
  }
  
  /**
   * Parse CSV line handling quoted fields
   */
  _parseCsvLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current);
    return result;
  }
  
  /**
   * Generic adapter fallback
   */
  _adaptGeneric(row) {
    const records = [];
    let timestamp = Date.now();
    
    if (row.TIMESTAMP) {
      timestamp = row.TIMESTAMP.length > 11 
        ? parseInt(row.TIMESTAMP) 
        : parseInt(row.TIMESTAMP) * 1000;
    }
    
    // Try to extract any known metrics
    const metricMappings = {
      'HEART_RATE': 'heart_rate',
      'HR': 'heart_rate',
      'STEPS': 'steps',
      'SPO2': 'spo2',
      'HRV': 'hrv',
      'STRESS': 'stress',
      'SLEEP_SCORE': 'sleep_score'
    };
    
    for (const [col, type] of Object.entries(metricMappings)) {
      if (row[col] && !isNaN(row[col])) {
        records.push(new BiometricRecord({
          timestamp,
          device: GADGETBRIDGE_CONFIG.DEVICES.GENERIC,
          deviceName: 'Generic Device',
          type,
          value: parseFloat(row[col]),
          raw: row
        }));
      }
    }
    
    return records;
  }
  
  /**
   * Get adapter for device type
   */
  getAdapter(deviceType) {
    return this.adapters[deviceType] || null;
  }
  
  /**
   * Get ingestion stats
   */
  getStats() {
    return { ...this.stats };
  }
}

// ============================================================================
// REAL-TIME STREAMING HANDLER
// ============================================================================

/**
 * Handles real-time biometric streaming from Gadgetbridge Intent API
 */
class GadgetbridgeStreamHandler extends EventEmitter {
  constructor(config = {}) {
    super();
    this.config = config;
    this.adapters = {
      [GADGETBRIDGE_CONFIG.DEVICES.AMAZFIT_BALANCE]: new AmazfitBalanceAdapter(),
      [GADGETBRIDGE_CONFIG.DEVICES.HELIOS_RING]: new HeliosRingAdapter()
    };
    
    this.isStreaming = false;
    this.connectedDevices = new Map();
    this.buffer = [];  // Buffer for batching
    this.bufferFlushInterval = config.flushInterval || 5000;
    this.flushTimer = null;
  }
  
  /**
   * Start streaming handler
   */
  start() {
    this.isStreaming = true;
    this.flushTimer = setInterval(() => this._flushBuffer(), this.bufferFlushInterval);
    this.emit('started');
    return this;
  }
  
  /**
   * Stop streaming handler
   */
  stop() {
    this.isStreaming = false;
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    this._flushBuffer();  // Final flush
    this.emit('stopped');
    return this;
  }
  
  /**
   * Handle incoming Gadgetbridge Intent data
   * Format varies by data type:
   * - REALTIME_SAMPLES: { device, heartRate, steps, timestamp }
   * - ACTIVITY_SAMPLE: { device, timestamp, kind, intensity, heartRate, steps }
   */
  handleIntent(intentData) {
    if (!this.isStreaming) return;
    
    const deviceId = intentData.device || intentData.deviceAddress;
    const deviceType = this._detectDeviceType(intentData);
    const adapter = this.adapters[deviceType];
    
    // Track connected devices
    if (deviceId && !this.connectedDevices.has(deviceId)) {
      this.connectedDevices.set(deviceId, {
        type: deviceType,
        firstSeen: Date.now(),
        lastSeen: Date.now()
      });
      this.emit('deviceConnected', { deviceId, deviceType });
    }
    
    // Convert intent to row format and adapt
    const row = this._intentToRow(intentData);
    let records;
    
    if (adapter) {
      records = adapter.adaptRow(row);
    } else {
      records = [new BiometricRecord({
        timestamp: Date.now(),
        device: GADGETBRIDGE_CONFIG.DEVICES.GENERIC,
        deviceName: 'Unknown',
        type: 'raw',
        value: null,
        raw: intentData
      })];
    }
    
    // Add RSSI if present (for proximity tracking)
    if (intentData.rssi) {
      records.forEach(r => r.rssi = intentData.rssi);
    }
    
    // Buffer records
    this.buffer.push(...records);
    
    // Emit individual records for real-time processing
    records.forEach(record => {
      this.emit('data', record);
    });
    
    // Update device last seen
    if (deviceId && this.connectedDevices.has(deviceId)) {
      this.connectedDevices.get(deviceId).lastSeen = Date.now();
    }
  }
  
  /**
   * Detect device type from intent data
   */
  _detectDeviceType(data) {
    const name = (data.deviceName || data.device || '').toLowerCase();
    
    if (name.includes('amazfit') || name.includes('balance') || name.includes('zepp')) {
      return GADGETBRIDGE_CONFIG.DEVICES.AMAZFIT_BALANCE;
    }
    if (name.includes('helios') || name.includes('ring')) {
      return GADGETBRIDGE_CONFIG.DEVICES.HELIOS_RING;
    }
    
    return GADGETBRIDGE_CONFIG.DEVICES.GENERIC;
  }
  
  /**
   * Convert Gadgetbridge intent to CSV row format
   */
  _intentToRow(intent) {
    return {
      TIMESTAMP: intent.timestamp ? String(intent.timestamp) : String(Date.now()),
      HEART_RATE: intent.heartRate || intent.heart_rate || intent.hr,
      STEPS: intent.steps,
      SPO2: intent.spo2,
      STRESS: intent.stress,
      HRV: intent.hrv || intent.hrv_sdnn,
      HRV_RMSSD: intent.hrv_rmssd,
      IBI: intent.ibi,
      SKIN_TEMP: intent.skinTemp || intent.temperature,
      SLEEP_SCORE: intent.sleepScore || intent.sleep_score,
      READINESS: intent.readiness || intent.recovery,
      CALORIES: intent.calories,
      DISTANCE: intent.distance,
      RESPIRATION: intent.respiration || intent.respirationRate,
      RAW_KIND: intent.kind,
      RAW_INTENSITY: intent.intensity,
      MOVEMENT: intent.movement
    };
  }
  
  /**
   * Flush buffer and emit batched data
   */
  _flushBuffer() {
    if (this.buffer.length === 0) return;
    
    const batch = [...this.buffer];
    this.buffer = [];
    
    this.emit('batch', batch);
  }
  
  /**
   * Get connected devices
   */
  getConnectedDevices() {
    return Array.from(this.connectedDevices.entries()).map(([id, info]) => ({
      deviceId: id,
      ...info
    }));
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export {
  GADGETBRIDGE_CONFIG,
  BiometricRecord,
  AmazfitBalanceAdapter,
  HeliosRingAdapter,
  GadgetbridgeIngestor,
  GadgetbridgeStreamHandler
};