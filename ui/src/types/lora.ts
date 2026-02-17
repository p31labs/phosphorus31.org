/**
 * LoRa/Mesh Network Types
 */

export interface LoRaMessage {
  id: string;
  payload: Uint8Array;
  rssi: number;
  snr: number;
  timestamp: number;
  sender: string;
}

export interface MeshNode {
  id: string;
  name: string;
  lastSeen: number;
  rssi: number;
  status: 'online' | 'offline' | 'unknown';
}

export interface MeshStatus {
  connected: boolean;
  nodes: MeshNode[];
  lastMessage: LoRaMessage | null;
}
