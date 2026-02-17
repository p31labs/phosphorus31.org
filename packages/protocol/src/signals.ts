/**
 * @p31/protocol — WebSocket event names and payload types.
 * Shelter /ws: sprout:signal, scope:subscribe, message:new, message:processed, signal:help, signal:status.
 */

export const WS_EVENT_TYPES = [
  'message:new',
  'message:processed',
  'sprout:signal',
  'scope:subscribe',
  'scope:subscribed',
  'signal:help',
  'signal:status',
  'status',
  'subscribed',
  'ping',
  'pong',
] as const;

export type WsEventType = (typeof WS_EVENT_TYPES)[number];

/** Generic WebSocket frame (type + data + optional timestamp). */
export interface WsFrame<T = unknown> {
  type: string;
  data?: T;
  timestamp?: string;
}

export interface MessageNewData {
  id: string;
  source?: string;
  priority?: string;
}

export interface MessageProcessedData {
  id: string;
  priority?: string;
  status?: string;
  source?: string;
}

export interface SproutSignalData {
  signal: string;
  timestamp?: string;
}

export interface ScopeSubscribedData {
  lastSignal: unknown;
  currentVoltage: string;
  queueLength: number;
}
