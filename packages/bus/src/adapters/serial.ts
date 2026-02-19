/**
 * Web Serial adapter stub for @p31labs/bus
 *
 * Future: bridges USB serial from ESP32 Node One to the bus.
 * Emits: HEARTBEAT, PHASE
 * Listens: SPOONS, MODE (to control haptic feedback intensity)
 *
 * Not implemented. Interface only.
 */

export interface SerialAdapter {
  connect(port: SerialPort): Promise<void>;
  disconnect(): void;
  send(data: Uint8Array): void;
  onReceive(callback: (data: Uint8Array) => void): void;
}

// Placeholder — implement when Node One hardware ships
