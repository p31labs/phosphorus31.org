/**
 * Mesh adapter — Sprout → Whale Channel (future NODE ONE / NodeZero).
 *
 * When a kid taps "I need a break" or "I need help" in P31 Sprout, we can
 * emit a signal so that when NODE ONE (ESP32-S3) or a mesh client is
 * connected, it can broadcast over the Whale Channel. No kid data; signal type only.
 *
 * Default implementation is no-op. In dev, a simulator adapter is wired so
 * signals are logged and broadcast via custom event for mesh log UI.
 * Replace with a real client when NODE ONE firmware is ready.
 */

export type SproutSignalType = 'break' | 'help';

/** Payload for p31:mesh:signal — no identity, no kid data. */
export interface MeshSignalEventDetail {
  signal: SproutSignalType;
  timestamp: number;
}

export const MESH_SIGNAL_EVENT = 'p31:mesh:signal';

/** Connection status for Sprout UI (amber dot when reconnecting). No error text. */
export const MESH_CONNECTION_EVENT = 'p31:mesh:connection';
export interface MeshConnectionDetail {
  connected: boolean;
  reconnecting: boolean;
}

function dispatchConnectionStatus(connected: boolean, reconnecting: boolean): void {
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent<MeshConnectionDetail>(MESH_CONNECTION_EVENT, {
          detail: { connected, reconnecting },
        })
      );
    }
  } catch {
    // ignore
  }
}

export interface MeshAdapter {
  /** Emit a Sprout signal (break or help). No identity; no payload. */
  emitSproutSignal(signal: SproutSignalType): void;
}

const noopAdapter: MeshAdapter = {
  emitSproutSignal(_signal: SproutSignalType) {
    // No-op until Whale Channel / NODE ONE is wired
  },
};

/**
 * Whale Channel simulator — for development and demos when NODE ONE hardware
 * is not connected. Logs to console and dispatches p31:mesh:signal so the
 * mesh log (e.g. MATA cockpit) can show "signal sent". Replace with real
 * client via setMeshAdapter(realClient) when firmware/WebSocket/serial is ready.
 */
export function createWhaleChannelSimulatorAdapter(): MeshAdapter {
  return {
    emitSproutSignal(signal: SproutSignalType) {
      const timestamp = Date.now();
      if (import.meta.env.DEV) {
        console.log('[Whale Channel simulator]', signal, new Date(timestamp).toISOString());
      }
      try {
        window.dispatchEvent(
          new CustomEvent<MeshSignalEventDetail>(MESH_SIGNAL_EVENT, {
            detail: { signal, timestamp },
          })
        );
      } catch {
        // Not in browser or dispatch not supported
      }
    },
  };
}

/** Payload sent over WebSocket to Buffer / mesh bridge. No identity, no kid data. */
export const MESH_WS_MESSAGE_TYPE = 'sprout_signal';

export interface MeshWsSproutPayload {
  type: typeof MESH_WS_MESSAGE_TYPE;
  signal: SproutSignalType;
  timestamp: number;
}

/**
 * Create a MeshAdapter that sends Sprout signals over WebSocket to the Buffer
 * (or any mesh bridge). When NODE ONE hardware is on board, the bridge can relay
 * to the device. Same contract: no identity, no kid data.
 * Still dispatches p31:mesh:signal so the in-app mesh log stays in sync.
 */
export function createNodeOneWebSocketAdapter(wsUrl: string): MeshAdapter {
  let ws: WebSocket | null = null;

  if (typeof window !== 'undefined') {
    try {
      const socket = new WebSocket(wsUrl);
      socket.onopen = () => {
        ws = socket;
        dispatchConnectionStatus(true, false);
        if (import.meta.env.DEV) console.log('[Mesh WS] Connected to', wsUrl);
      };
      socket.onclose = () => {
        ws = null;
        dispatchConnectionStatus(false, true);
      };
      socket.onerror = () => {
        // Connection failed or dropped; next emit will no-op send, event still fires
      };
    } catch {
      // Invalid URL or no WebSocket support
    }
  }

  return {
    emitSproutSignal(signal: SproutSignalType) {
      const timestamp = Date.now();
      const payload: MeshWsSproutPayload = { type: MESH_WS_MESSAGE_TYPE, signal, timestamp };

      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(
            new CustomEvent<MeshSignalEventDetail>(MESH_SIGNAL_EVENT, {
              detail: { signal, timestamp },
            })
          );
        }
      } catch {
        // ignore
      }

      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(payload));
      } else if (import.meta.env.DEV && typeof console !== 'undefined') {
        console.log('[Mesh WS] Signal (not connected):', signal);
      }
    },
  };
}

let adapter: MeshAdapter = noopAdapter;

/**
 * Get the current mesh adapter (for tests or replacement).
 */
export function getMeshAdapter(): MeshAdapter {
  return adapter;
}

/**
 * Set a custom mesh adapter (e.g. when NODE ONE or simulator is connected).
 */
export function setMeshAdapter(next: MeshAdapter): void {
  adapter = next;
}

/**
 * Emit a Sprout signal to the mesh. Call from Sprout UI or store.
 */
export function emitSproutSignal(signal: SproutSignalType): void {
  adapter.emitSproutSignal(signal);
}
