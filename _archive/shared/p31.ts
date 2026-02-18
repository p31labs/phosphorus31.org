// shared/p31.ts
// THE P31 STANDARD UTILITY
// Cross-platform communication for Scope + Buffer + Centaur + Sync + Node One
// Usage: import { p31 } from '@p31/shared';

import { P31 } from '../god.config';

export const p31 = {
  // ============================================
  // SYNC: Connection to Google Apps Script (SIMPLEX v6)
  // ============================================
  sync: {
    /**
     * Send event to Google Apps Script
     * @param event - Event name (e.g., 'voltage_high', 'spoon_checkin')
     * @param payload - Event data (will be JSON stringified)
     */
    async pulse(event: string, payload: unknown) {
      const isProd =
        (typeof import.meta !== 'undefined' && import.meta.env?.PROD) ||
        (typeof process !== 'undefined' && process.env.NODE_ENV === 'production');
      const timestamp = new Date().toISOString();

      // Log to console with emoji tags
      console.log(`[p31.sync] 📡 ${event}`, payload);

      // In Prod, fire and forget to GAS
      if (isProd && P31.syncUrl && !P31.syncUrl.includes('INSERT')) {
        try {
          fetch(P31.syncUrl, {
            method: 'POST',
            mode: 'no-cors', // Essential for GAS
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              target: 'sync',
              event,
              payload,
              timestamp,
              nodeId: 'n0',
            }),
          }).catch((e) => console.error('[p31.sync] ❌ Transmission failed', e));
        } catch (e) {
          console.error('[p31.sync] ❌ Fetch error', e);
        }
      } else {
        console.log(
          `[p31.sync] 🔧 DEV MODE - Event logged only (not sent to GAS)`
        );
      }
    },
  },

  // ============================================
  // HARDWARE: Node One Interface (Stub for MVP)
  // ============================================
  N1: {
    /**
     * Send haptic command to Node One device
     * @param pattern - Haptic pattern name
     */
    haptic(pattern: 'pulse' | 'wave' | 'alert' | 'success' | 'error') {
      console.log(`[p31.N1] 🔊 HAPTIC COMMAND: ${pattern}`);
      // TODO: Implement WebSerial or BLE connection to ESP32-S3
      // For MVP demo, this is a visual/console stub
    },

    /**
     * Send LoRa mesh message
     * @param message - Message to broadcast via LoRa
     */
    loraBroadcast(message: string) {
      console.log(`[p31.N1] 📻 LoRa Broadcast: ${message}`);
      // TODO: Implement LoRa mesh protocol
    },
  },

  // ============================================
  // BACKEND: Centaur API Connection
  // ============================================
  centaur: {
    async api(endpoint: string, method: 'GET' | 'POST' = 'GET', data?: unknown) {
      const baseUrl = `http://localhost:${P31.ports.c}`;
      try {
        const response = await fetch(`${baseUrl}${endpoint}`, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: data ? JSON.stringify(data) : undefined,
        });
        return await response.json();
      } catch (e) {
        console.error(`[p31.centaur] ❌ API call failed: ${endpoint}`, e);
        throw e;
      }
    },
  },

  // ============================================
  // LOGGING: Unified across all nodes
  // ============================================
  log(node: keyof typeof P31.nodes, msg: string, data?: unknown) {
    const emoji: Record<keyof typeof P31.nodes, string> = {
      n0: '👤',
      b: '🛡️',
      c: '🧠',
      s: '📊',
      sync: '☁️',
      N1: '⚡',
    };

    console.log(`${emoji[node]} [p31.${node}] ${msg}`, data ?? '');
  },

  // ============================================
  // COLOR UTILITIES
  // ============================================
  color(token: keyof typeof P31.tokens): string {
    return P31.tokens[token];
  },

  // ============================================
  // CONFIG ACCESS
  // ============================================
  config: P31,
};

// Export P31 config for convenience
export { P31 };
