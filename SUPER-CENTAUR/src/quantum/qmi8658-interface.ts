/**
 * QMI8658 IMU Interface
 * 
 * Interface for communicating with QMI8658 6-axis IMU sensor
 * via I2C on Node One (ESP32-S3).
 * 
 * Hardware: QMI8658 at I2C address 0x6B
 * Protocol: I2C communication
 * 
 * This interface can work with:
 * 1. Direct hardware connection (when Node One is connected)
 * 2. Simulated data (for development/testing)
 * 3. WebSocket connection to Node One firmware
 */

export interface QMI8658Config {
  address: number; // I2C address (default: 0x6B)
  sampleRate: number; // Hz (default: 100)
  accelRange: '2g' | '4g' | '8g' | '16g'; // Acceleration range
  gyroRange: '250dps' | '500dps' | '1000dps' | '2000dps'; // Gyroscope range
}

export interface QMI8658Data {
  timestamp: number;
  accel: {
    x: number; // m/s²
    y: number; // m/s²
    z: number; // m/s²
  };
  gyro: {
    x: number; // rad/s
    y: number; // rad/s
    z: number; // rad/s
  };
  temperature?: number; // °C
  valid: boolean;
}

export interface QMI8658Status {
  connected: boolean;
  initialized: boolean;
  sampleRate: number;
  lastReading: number | null;
  errorCount: number;
  mode: 'hardware' | 'simulated' | 'websocket';
}

/**
 * QMI8658 IMU Interface
 * 
 * Provides unified interface for IMU data regardless of source
 */
export class QMI8658Interface {
  private config: QMI8658Config;
  private status: QMI8658Status;
  private dataCallback?: (data: QMI8658Data) => void;
  private pollingInterval?: NodeJS.Timeout;
  private websocket?: WebSocket;

  constructor(config?: Partial<QMI8658Config>) {
    this.config = {
      address: 0x6B,
      sampleRate: 100,
      accelRange: '8g',
      gyroRange: '1000dps',
      ...config,
    };

    this.status = {
      connected: false,
      initialized: false,
      sampleRate: this.config.sampleRate,
      lastReading: null,
      errorCount: 0,
      mode: 'simulated', // Default to simulated for development
    };
  }

  /**
   * Initialize the IMU
   */
  async initialize(): Promise<boolean> {
    try {
      // Try hardware connection first
      if (await this.tryHardwareConnection()) {
        this.status.mode = 'hardware';
        this.status.connected = true;
        this.status.initialized = true;
        return true;
      }

      // Try WebSocket connection to Node One
      if (await this.tryWebSocketConnection()) {
        this.status.mode = 'websocket';
        this.status.connected = true;
        this.status.initialized = true;
        return true;
      }

      // Fall back to simulated mode
      this.status.mode = 'simulated';
      this.status.connected = true;
      this.status.initialized = true;
      console.log('[QMI8658] Using simulated mode (no hardware detected)');
      return true;
    } catch (error) {
      console.error('[QMI8658] Initialization failed:', error);
      return false;
    }
  }

  /**
   * Try hardware connection (WebUSB/Serial)
   */
  private async tryHardwareConnection(): Promise<boolean> {
    // Check if WebUSB is available
    if (typeof navigator !== 'undefined' && 'usb' in navigator) {
      try {
        // Attempt to connect to ESP32-S3 device
        // This would require WebUSB device selection
        // For now, return false (hardware connection not yet implemented)
        return false;
      } catch (error) {
        return false;
      }
    }
    return false;
  }

  /**
   * Try WebSocket connection to Node One firmware
   */
  private async tryWebSocketConnection(): Promise<boolean> {
    try {
      // Try to connect to Node One WebSocket endpoint
      // Default: ws://localhost:8080/imu (or from config)
      const wsUrl = process.env.NODE_ONE_WS_URL || 'ws://localhost:8080/imu';
      
      return new Promise((resolve) => {
        const ws = new WebSocket(wsUrl);
        
        ws.onopen = () => {
          this.websocket = ws;
          this.status.connected = true;
          resolve(true);
        };

        ws.onerror = () => {
          resolve(false);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'imu') {
              this.handleIMUData(data);
            }
          } catch (error) {
            console.error('[QMI8658] WebSocket data parse error:', error);
          }
        };

        // Timeout after 2 seconds
        setTimeout(() => resolve(false), 2000);
      });
    } catch (error) {
      return false;
    }
  }

  /**
   * Start reading IMU data
   */
  startReading(callback: (data: QMI8658Data) => void): void {
    this.dataCallback = callback;

    if (this.status.mode === 'simulated') {
      this.startSimulatedReading();
    } else if (this.status.mode === 'websocket') {
      // WebSocket handles reading automatically
      // Just ensure callback is set
    } else if (this.status.mode === 'hardware') {
      this.startHardwareReading();
    }
  }

  /**
   * Stop reading IMU data
   */
  stopReading(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = undefined;
    }

    if (this.websocket) {
      this.websocket.close();
      this.websocket = undefined;
    }

    this.dataCallback = undefined;
  }

  /**
   * Start simulated reading (for development)
   */
  private startSimulatedReading(): void {
    const interval = 1000 / this.config.sampleRate;

    this.pollingInterval = setInterval(() => {
      const data = this.generateSimulatedData();
      if (this.dataCallback) {
        this.dataCallback(data);
      }
    }, interval);
  }

  /**
   * Start hardware reading
   */
  private startHardwareReading(): void {
    // Hardware reading would be implemented here
    // For now, fall back to simulated
    this.startSimulatedReading();
  }

  /**
   * Generate simulated IMU data
   * Simulates realistic IMU readings with some coherence
   */
  private generateSimulatedData(): QMI8658Data {
    const now = Date.now();
    
    // Simulate coherent motion (sine wave with some noise)
    const t = now / 1000;
    const coherence = 0.7; // Simulated coherence level
    
    // Base motion (coherent component)
    const baseFreq = 0.5; // Hz
    const baseAmp = 2.0; // m/s²
    
    // Coherent acceleration
    const accelX = baseAmp * Math.sin(2 * Math.PI * baseFreq * t) * coherence;
    const accelY = baseAmp * Math.cos(2 * Math.PI * baseFreq * t) * coherence;
    const accelZ = 9.81 + baseAmp * 0.1 * Math.sin(2 * Math.PI * baseFreq * t * 0.5) * coherence;
    
    // Noise (incoherent component)
    const noise = (1 - coherence) * 0.5;
    const accelXNoise = (Math.random() - 0.5) * noise;
    const accelYNoise = (Math.random() - 0.5) * noise;
    const accelZNoise = (Math.random() - 0.5) * noise;
    
    // Coherent gyroscope (derivative of acceleration)
    const gyroX = -baseAmp * 2 * Math.PI * baseFreq * Math.cos(2 * Math.PI * baseFreq * t) * coherence * 0.01;
    const gyroY = baseAmp * 2 * Math.PI * baseFreq * Math.sin(2 * Math.PI * baseFreq * t) * coherence * 0.01;
    const gyroZ = (Math.random() - 0.5) * 0.1 * (1 - coherence);
    
    return {
      timestamp: now,
      accel: {
        x: accelX + accelXNoise,
        y: accelY + accelYNoise,
        z: accelZ + accelZNoise,
      },
      gyro: {
        x: gyroX + (Math.random() - 0.5) * noise * 0.1,
        y: gyroY + (Math.random() - 0.5) * noise * 0.1,
        z: gyroZ,
      },
      temperature: 25 + (Math.random() - 0.5) * 2,
      valid: true,
    };
  }

  /**
   * Handle IMU data from WebSocket
   */
  private handleIMUData(data: any): void {
    const imuData: QMI8658Data = {
      timestamp: data.timestamp || Date.now(),
      accel: {
        x: data.accel?.x || 0,
        y: data.accel?.y || 0,
        z: data.accel?.z || 0,
      },
      gyro: {
        x: data.gyro?.x || 0,
        y: data.gyro?.y || 0,
        z: data.gyro?.z || 0,
      },
      temperature: data.temperature,
      valid: true,
    };

    if (this.dataCallback) {
      this.dataCallback(imuData);
    }
  }

  /**
   * Get current status
   */
  getStatus(): QMI8658Status {
    return { ...this.status };
  }

  /**
   * Get configuration
   */
  getConfig(): QMI8658Config {
    return { ...this.config };
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<QMI8658Config>): void {
    this.config = { ...this.config, ...config };
    this.status.sampleRate = this.config.sampleRate;
    
    // Restart reading if active
    if (this.dataCallback) {
      this.stopReading();
      this.startReading(this.dataCallback);
    }
  }

  /**
   * Disconnect and cleanup
   */
  disconnect(): void {
    this.stopReading();
    this.status.connected = false;
    this.status.initialized = false;
  }
}
