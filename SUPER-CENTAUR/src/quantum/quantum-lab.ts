/**
 * Quantum Lab
 * 
 * Core visualization platform for quantum mechanics experiments.
 * Integrates QMI8658 IMU data with Sample Entropy algorithm
 * to provide real-time quantum coherence visualization.
 * 
 * Features:
 * - Real-time coherence measurement from IMU data
 * - Quantum state visualization
 * - Coherence history tracking
 * - Multiple molecule comparison
 * - Quantum simulation capabilities
 */

import { QMI8658Interface, QMI8658Data } from './qmi8658-interface';
import { CoherenceMonitor, IMUDataPoint } from './sample-entropy';

export interface QuantumState {
  coherence: number; // 0-1
  entanglement: number; // 0-1
  phase: number; // 0-2π
  lifetime: number; // ms
  timestamp: number;
}

export interface QuantumLabConfig {
  imuSampleRate: number;
  coherenceWindowSize: number;
  updateInterval: number; // ms
  enableSimulation: boolean;
}

export interface QuantumLabStatus {
  active: boolean;
  imuConnected: boolean;
  coherenceMonitorActive: boolean;
  currentCoherence: number | null;
  averageCoherence: number | null;
  dataPoints: number;
  uptime: number; // ms
}

/**
 * Quantum Lab - Core visualization platform
 */
export class QuantumLab {
  private imu: QMI8658Interface;
  private coherenceMonitor: CoherenceMonitor;
  private config: QuantumLabConfig;
  private status: QuantumLabStatus;
  private stateHistory: QuantumState[] = [];
  private updateInterval?: NodeJS.Timeout;
  private startTime: number = 0;
  private stateCallbacks: ((state: QuantumState) => void)[] = [];
  private coherenceCallbacks: ((coherence: number) => void)[] = [];

  constructor(config?: Partial<QuantumLabConfig>) {
    this.config = {
      imuSampleRate: 100,
      coherenceWindowSize: 100,
      updateInterval: 100, // 10 Hz update rate
      enableSimulation: true,
      ...config,
    };

    this.imu = new QMI8658Interface({
      sampleRate: this.config.imuSampleRate,
    });

    this.coherenceMonitor = new CoherenceMonitor(this.config.coherenceWindowSize);

    this.status = {
      active: false,
      imuConnected: false,
      coherenceMonitorActive: false,
      currentCoherence: null,
      averageCoherence: null,
      dataPoints: 0,
      uptime: 0,
    };
  }

  /**
   * Initialize and start the Quantum Lab
   */
  async start(): Promise<boolean> {
    try {
      // Initialize IMU
      const imuInitialized = await this.imu.initialize();
      if (!imuInitialized) {
        console.error('[QuantumLab] Failed to initialize IMU');
        return false;
      }

      this.status.imuConnected = true;
      this.startTime = Date.now();

      // Start IMU reading
      this.imu.startReading((data: QMI8658Data) => {
        if (data.valid) {
          this.handleIMUData(data);
        }
      });

      // Start coherence monitoring
      this.status.coherenceMonitorActive = true;

      // Start update loop
      this.startUpdateLoop();

      this.status.active = true;
      console.log('[QuantumLab] Started successfully');
      return true;
    } catch (error) {
      console.error('[QuantumLab] Start failed:', error);
      return false;
    }
  }

  /**
   * Stop the Quantum Lab
   */
  stop(): void {
    this.status.active = false;
    this.imu.stopReading();
    this.imu.disconnect();

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = undefined;
    }

    this.coherenceMonitor.clear();
    this.status.coherenceMonitorActive = false;
    this.status.imuConnected = false;

    console.log('[QuantumLab] Stopped');
  }

  /**
   * Handle incoming IMU data
   */
  private handleIMUData(data: QMI8658Data): void {
    const imuPoint: IMUDataPoint = {
      timestamp: data.timestamp,
      accel: data.accel,
      gyro: data.gyro,
    };

    this.coherenceMonitor.addDataPoint(imuPoint);
    this.status.dataPoints++;
  }

  /**
   * Start update loop for coherence calculation and callbacks
   */
  private startUpdateLoop(): void {
    this.updateInterval = setInterval(() => {
      this.update();
    }, this.config.updateInterval);
  }

  /**
   * Update quantum state and notify callbacks
   */
  private update(): void {
    // Get current coherence
    const coherenceResult = this.coherenceMonitor.getCurrentCoherence();
    
    if (coherenceResult) {
      this.status.currentCoherence = coherenceResult.coherence;
      this.status.averageCoherence = this.coherenceMonitor.getAverageCoherence(60000);
      this.status.uptime = Date.now() - this.startTime;

      // Create quantum state
      const quantumState: QuantumState = {
        coherence: coherenceResult.coherence,
        entanglement: this.calculateEntanglement(coherenceResult.coherence),
        phase: this.calculatePhase(coherenceResult.coherence),
        lifetime: this.calculateLifetime(coherenceResult.coherence),
        timestamp: Date.now(),
      };

      // Store in history
      this.stateHistory.push(quantumState);
      if (this.stateHistory.length > 1000) {
        this.stateHistory.shift();
      }

      // Notify callbacks
      this.notifyStateCallbacks(quantumState);
      this.notifyCoherenceCallbacks(coherenceResult.coherence);
    }
  }

  /**
   * Calculate entanglement from coherence
   * Higher coherence = higher potential for entanglement
   */
  private calculateEntanglement(coherence: number): number {
    // Entanglement is related to coherence but not identical
    // Simplified model: entanglement = coherence^2
    return Math.pow(coherence, 2);
  }

  /**
   * Calculate quantum phase from coherence
   */
  private calculatePhase(coherence: number): number {
    // Phase oscillates with coherence
    // Higher coherence = more stable phase
    const basePhase = (Date.now() / 1000) * 0.1; // Slow oscillation
    const coherenceModulation = coherence * Math.PI;
    return (basePhase + coherenceModulation) % (2 * Math.PI);
  }

  /**
   * Calculate coherence lifetime
   * Higher coherence = longer lifetime
   */
  private calculateLifetime(coherence: number): number {
    // Lifetime in milliseconds
    // Base lifetime: 1000ms, scales with coherence
    return 1000 * (0.5 + coherence * 0.5);
  }

  /**
   * Register callback for quantum state updates
   */
  onStateUpdate(callback: (state: QuantumState) => void): void {
    this.stateCallbacks.push(callback);
  }

  /**
   * Register callback for coherence updates
   */
  onCoherenceUpdate(callback: (coherence: number) => void): void {
    this.coherenceCallbacks.push(callback);
  }

  /**
   * Notify state callbacks
   */
  private notifyStateCallbacks(state: QuantumState): void {
    this.stateCallbacks.forEach(callback => {
      try {
        callback(state);
      } catch (error) {
        console.error('[QuantumLab] State callback error:', error);
      }
    });
  }

  /**
   * Notify coherence callbacks
   */
  private notifyCoherenceCallbacks(coherence: number): void {
    this.coherenceCallbacks.forEach(callback => {
      try {
        callback(coherence);
      } catch (error) {
        console.error('[QuantumLab] Coherence callback error:', error);
      }
    });
  }

  /**
   * Get current status
   */
  getStatus(): QuantumLabStatus {
    return { ...this.status };
  }

  /**
   * Get quantum state history
   */
  getStateHistory(timeWindowMs?: number): QuantumState[] {
    if (timeWindowMs) {
      const cutoff = Date.now() - timeWindowMs;
      return this.stateHistory.filter(s => s.timestamp >= cutoff);
    }
    return [...this.stateHistory];
  }

  /**
   * Get current quantum state
   */
  getCurrentState(): QuantumState | null {
    if (this.stateHistory.length === 0) return null;
    return this.stateHistory[this.stateHistory.length - 1];
  }

  /**
   * Get coherence monitor
   */
  getCoherenceMonitor(): CoherenceMonitor {
    return this.coherenceMonitor;
  }

  /**
   * Get IMU interface
   */
  getIMU(): QMI8658Interface {
    return this.imu;
  }
}
