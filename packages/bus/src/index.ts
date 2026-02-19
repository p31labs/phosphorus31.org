/**
 * @p31labs/bus — Universal State Bus
 *
 * Zero dependencies. Bridges Shelter (Zustand), standalone HTMLs (localStorage),
 * React artifacts (useBus hook), and Node One (Web Serial stub).
 *
 * Usage:
 *   import { createBus, BUS_KEYS } from '@p31labs/bus';
 *   const bus = createBus();
 *   bus.emit(BUS_KEYS.SPOONS, 8);
 *   bus.on(BUS_KEYS.SPOONS, ({ value }) => console.log(value));
 */

export interface BusEvent<T = unknown> {
  key: string;
  value: T;
  source: 'local' | 'broadcast' | 'zustand' | 'serial';
  timestamp: number;
}

export type BusListener<T = unknown> = (event: BusEvent<T>) => void;

export interface Bus {
  emit<T>(key: string, value: T): void;
  on<T>(key: string, listener: BusListener<T>): () => void;
  get<T>(key: string): T | null;
  snapshot(): Record<string, unknown>;
  destroy(): void;
}

export interface BusOptions {
  /** Namespace prefix for localStorage keys. Default: '' (keys already include 'p31:') */
  prefix?: string;
  /** BroadcastChannel name. Default: 'p31-bus' */
  channel?: string;
  /** Enable localStorage persistence. Default: true */
  persist?: boolean;
  /** Enable BroadcastChannel cross-tab sync. Default: true */
  broadcast?: boolean;
}

export { createBus } from './core';
export { BUS_KEYS, type BusKey } from './keys';
