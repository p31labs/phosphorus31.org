/**
 * Metabolism - Energy/Spoon Management System
 * 
 * Tracks energy levels and manages message processing based on available spoons
 * Uses GOD_CONFIG for configuration
 */

import { Logger } from './utils/logger.js';

// Import GOD_CONFIG - using inline for now, should match god.config.ts
const GOD_CONFIG = {
  Metabolism: {
    maxSpoons: 12,
    spoonRecoveryRate: 0.1,
    stressThreshold: 8,
    recoveryThreshold: 4,
  },
};

export interface MetabolismState {
  currentSpoons: number;
  maxSpoons: number;
  stressLevel: 'low' | 'medium' | 'high' | 'critical';
  recoveryRate: number;
  lastUpdate: string;
}

export interface EnergyCost {
  low: number;
  normal: number;
  high: number;
  urgent: number;
}

export class Metabolism {
  private logger: Logger;
  private currentSpoons: number;
  private readonly maxSpoons: number;
  private readonly recoveryRate: number;
  private readonly stressThreshold: number;
  private readonly recoveryThreshold: number;
  private recoveryInterval: NodeJS.Timeout | null = null;
  private readonly energyCosts: EnergyCost = {
    low: 0.5,
    normal: 1.0,
    high: 1.5,
    urgent: 2.0,
  };

  constructor() {
    this.logger = new Logger('Metabolism');
    this.maxSpoons = GOD_CONFIG.Metabolism.maxSpoons;
    this.currentSpoons = this.maxSpoons; // Start at full energy
    this.recoveryRate = GOD_CONFIG.Metabolism.spoonRecoveryRate;
    this.stressThreshold = GOD_CONFIG.Metabolism.stressThreshold;
    this.recoveryThreshold = GOD_CONFIG.Metabolism.recoveryThreshold;
  }

  /**
   * Start the metabolism system with automatic recovery
   */
  start(): void {
    this.logger.info('Starting Metabolism system');
    
    // Recover spoons every 10 seconds
    this.recoveryInterval = setInterval(() => {
      this.recover();
    }, 10000);
  }

  /**
   * Stop the metabolism system
   */
  stop(): void {
    if (this.recoveryInterval) {
      clearInterval(this.recoveryInterval);
      this.recoveryInterval = null;
    }
    this.logger.info('Metabolism system stopped');
  }

  /**
   * Check if we have enough energy to process a message
   */
  canProcess(priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'): boolean {
    const cost = this.energyCosts[priority];
    return this.currentSpoons >= cost;
  }

  /**
   * Consume energy for processing a message
   */
  consume(priority: 'low' | 'normal' | 'high' | 'urgent' = 'normal'): boolean {
    const cost = this.energyCosts[priority];
    
    if (this.currentSpoons < cost) {
      this.logger.warn(`Insufficient energy: need ${cost}, have ${this.currentSpoons}`);
      return false;
    }

    this.currentSpoons = Math.max(0, this.currentSpoons - cost);
    this.logger.debug(`Consumed ${cost} spoons (${this.currentSpoons}/${this.maxSpoons} remaining)`);
    
    // Check if we've hit stress threshold
    if (this.currentSpoons <= this.stressThreshold) {
      this.logger.warn(`Energy low: ${this.currentSpoons} spoons remaining`);
    }

    return true;
  }

  /**
   * Recover energy over time
   */
  private recover(): void {
    if (this.currentSpoons >= this.maxSpoons) {
      return; // Already at max
    }

    const recovered = Math.min(
      this.recoveryRate,
      this.maxSpoons - this.currentSpoons
    );
    
    this.currentSpoons = Math.min(
      this.maxSpoons,
      this.currentSpoons + recovered
    );

    if (recovered > 0) {
      this.logger.debug(`Recovered ${recovered.toFixed(2)} spoons (${this.currentSpoons.toFixed(2)}/${this.maxSpoons})`);
    }
  }

  /**
   * Get current metabolism state
   */
  getState(): MetabolismState {
    return {
      currentSpoons: Math.round(this.currentSpoons * 10) / 10,
      maxSpoons: this.maxSpoons,
      stressLevel: this.getStressLevel(),
      recoveryRate: this.recoveryRate,
      lastUpdate: new Date().toISOString(),
    };
  }

  /**
   * Get current stress level
   */
  getStressLevel(): 'low' | 'medium' | 'high' | 'critical' {
    if (this.currentSpoons >= this.stressThreshold) {
      return 'low';
    } else if (this.currentSpoons >= this.recoveryThreshold) {
      return 'medium';
    } else if (this.currentSpoons > 0) {
      return 'high';
    } else {
      return 'critical';
    }
  }

  /**
   * Check if system is in stress state
   */
  isStressed(): boolean {
    return this.currentSpoons <= this.stressThreshold;
  }

  /**
   * Check if system is in recovery state
   */
  isRecovering(): boolean {
    return this.currentSpoons <= this.recoveryThreshold;
  }

  /**
   * Get energy percentage
   */
  getEnergyPercentage(): number {
    return (this.currentSpoons / this.maxSpoons) * 100;
  }

  /**
   * Force set energy (for testing or recovery)
   */
  setEnergy(spoons: number): void {
    this.currentSpoons = Math.max(0, Math.min(this.maxSpoons, spoons));
    this.logger.info(`Energy set to ${this.currentSpoons}/${this.maxSpoons}`);
  }
}
