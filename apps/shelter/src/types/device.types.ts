/**
 * DEVICE TYPE DEFINITIONS
 * Hardware Bridge - Device state and connectivity
 */

export type AudioState = 'idle' | 'recording' | 'playing';

export interface DeviceState {
  readonly connected: boolean;
  readonly battery: {
    readonly percent: number;
    readonly charging: boolean;
  };
  readonly wifi: {
    readonly clients: number;
    readonly rssi: number;
  };
  readonly lora: {
    readonly active: boolean;
    readonly rssi: number;
    readonly lastRx: number;
  };
  readonly audio: {
    readonly state: AudioState;
    readonly level: number; // 0-100
  };
  readonly uptime: number; // milliseconds
}

export interface DeviceActions {
  updateFromWebSocket: (data: unknown) => void;
  setConnected: (connected: boolean) => void;
  setBattery: (percent: number, charging: boolean) => void;
  setWifi: (clients: number, rssi: number) => void;
  setLoRa: (active: boolean, rssi: number, lastRx: number) => void;
  setAudio: (state: AudioState, level: number) => void;
  setUptime: (uptime: number) => void;
}
