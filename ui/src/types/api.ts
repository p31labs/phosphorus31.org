/**
 * REST/WebSocket API Types
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface WebSocketMessage {
  type: string;
  payload?: any;
  timestamp?: number;
}

export interface DeviceStatus {
  battery: number;
  wifi: {
    connected: boolean;
    ssid?: string;
    signal?: number;
  };
  lora: {
    connected: boolean;
    frequency?: number;
  };
  audio: {
    available: boolean;
    recording: boolean;
  };
}
