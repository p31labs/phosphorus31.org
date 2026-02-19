/**
 * @p31labs/bus core implementation
 *
 * In-memory pub/sub with localStorage persistence and
 * BroadcastChannel cross-tab sync. Zero dependencies.
 *
 * Keys are stored as-is. BUS_KEYS values like 'p31:spoons' ARE
 * the literal localStorage keys. No prefix is added by the bus.
 * The 'prefix' option is only used for filtering which storage
 * events to listen to and which keys to load on init.
 */

import type { Bus, BusEvent, BusListener, BusOptions } from './index';
import { LocalStorageAdapter } from './adapters/localStorage';
import { BroadcastAdapter } from './adapters/broadcast';

export function createBus(options: BusOptions = {}): Bus {
  const {
    prefix = 'p31:',
    channel = 'p31-bus',
    persist = true,
    broadcast = true,
  } = options;

  // In-memory store: key → latest value
  const store = new Map<string, unknown>();

  // Listeners: key → Set of callbacks
  const listeners = new Map<string, Set<BusListener>>();

  // Notify all listeners for a key
  const notify = <T>(key: string, value: T, source: BusEvent['source']): void => {
    const event: BusEvent<T> = { key, value, source, timestamp: Date.now() };
    const callbacks = listeners.get(key);
    if (callbacks) {
      callbacks.forEach((cb) => cb(event as BusEvent));
    }
  };

  // Initialize adapters
  const lsAdapter = persist ? new LocalStorageAdapter(prefix) : null;
  const bcAdapter = broadcast ? new BroadcastAdapter(channel) : null;

  // Load initial values from localStorage
  if (lsAdapter) {
    const saved = lsAdapter.getAll();
    for (const [key, value] of Object.entries(saved)) {
      store.set(key, value);
    }
  }

  // Listen for storage events from other tabs
  if (lsAdapter) {
    lsAdapter.onExternalChange((key: string, newValue: unknown) => {
      if (newValue === null) {
        store.delete(key);
      } else {
        store.set(key, newValue);
      }
      notify(key, newValue, 'local');
    });
  }

  // Listen for BroadcastChannel messages from other tabs
  if (bcAdapter) {
    bcAdapter.onMessage((key: string, value: unknown) => {
      // Dedup: only update if value actually changed
      const current = store.get(key);
      const currentStr = JSON.stringify(current);
      const newStr = JSON.stringify(value);
      if (currentStr !== newStr) {
        store.set(key, value);
        notify(key, value, 'broadcast');
        // Also persist to localStorage
        if (lsAdapter) {
          lsAdapter.set(key, value);
        }
      }
    });
  }

  // The Bus API
  const bus: Bus = {
    emit<T>(key: string, value: T): void {
      store.set(key, value);
      if (lsAdapter) {
        lsAdapter.set(key, value);
      }
      if (bcAdapter) {
        bcAdapter.send(key, value);
      }
      notify(key, value, 'local');
    },

    on<T>(key: string, listener: BusListener<T>): () => void {
      if (!listeners.has(key)) {
        listeners.set(key, new Set());
      }
      const set = listeners.get(key)!;
      set.add(listener as BusListener);
      // Return unsubscribe function
      return () => {
        set.delete(listener as BusListener);
        if (set.size === 0) {
          listeners.delete(key);
        }
      };
    },

    get<T>(key: string): T | null {
      return (store.get(key) as T) ?? null;
    },

    snapshot(): Record<string, unknown> {
      return Object.fromEntries(store.entries());
    },

    destroy(): void {
      listeners.clear();
      store.clear();
      lsAdapter?.destroy();
      bcAdapter?.destroy();
    },
  };

  return bus;
}
