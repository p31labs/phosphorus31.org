/**
 * LoRa Bridge
 * LoRa send/receive via device API
 */

import type { LoRaMessage } from '../types/lora';

export interface LoRaConfig {
  frequency?: number;
  bandwidth?: number;
  spreadingFactor?: number;
}

export class LoRaBridge {
  private _config: LoRaConfig;

  constructor(config: LoRaConfig = {}) {
    this._config = {
      frequency: 915000000, // 915 MHz
      bandwidth: 125000,
      spreadingFactor: 7,
      ...config,
    };
  }

  async send(data: Uint8Array): Promise<boolean> {
    // TODO: Implement actual LoRa send via device API
    console.log('LoRa send:', data);
    return true;
  }

  async receive(): Promise<LoRaMessage | null> {
    // TODO: Implement actual LoRa receive via device API
    return null;
  }

  async isConnected(): Promise<boolean> {
    // TODO: Check actual LoRa connection status
    return false;
  }
}
