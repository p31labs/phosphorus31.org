/**
 * P31 persistent storage — window.storage API.
 * Component code uses only this API; implementation may use any backend.
 * Keys: p31:molecule, p31:dome:{fingerprint}, p31:dir:{fingerprint} (shared).
 */

function getStorage(): Storage {
  if (typeof window === 'undefined') {
    throw new Error('p31-storage: window not available');
  }
  return window.localStorage;
}

export interface P31StorageAPI {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  delete(key: string): Promise<void>;
  /** Alias for delete (used by IdentityView and other callers). */
  remove(key: string): Promise<void>;
  list(prefix: string, shared?: boolean): Promise<string[]>;
}

export function createP31Storage(): P31StorageAPI {
  const storage = getStorage();
  return {
    async get(key: string): Promise<string | null> {
      try {
        return storage.getItem(key);
      } catch {
        return null;
      }
    },
    async set(key: string, value: string): Promise<void> {
      try {
        storage.setItem(key, value);
      } catch {
        // quota or disabled
      }
    },
    async delete(key: string): Promise<void> {
      try {
        storage.removeItem(key);
      } catch {
        // ignore
      }
    },
    async remove(key: string): Promise<void> {
      return this.delete(key);
    },
    async list(prefix: string, _shared?: boolean): Promise<string[]> {
      try {
        const keys: string[] = [];
        for (let i = 0; i < storage.length; i++) {
          const k = storage.key(i);
          if (k && k.startsWith(prefix)) keys.push(k);
        }
        return keys;
      } catch {
        return [];
      }
    },
  };
}

/** Install window.storage for P31 (call once at app bootstrap). */
export function installP31Storage(): void {
  if (typeof window !== 'undefined' && !(window as unknown as { storage?: P31StorageAPI }).storage) {
    (window as unknown as { storage: P31StorageAPI }).storage = createP31Storage();
  }
}

declare global {
  interface Window {
    storage?: P31StorageAPI;
  }
}
