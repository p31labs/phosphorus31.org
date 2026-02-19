/**
 * localStorage adapter for @p31labs/bus
 *
 * Persists bus state to localStorage and listens for cross-tab
 * storage events. Keys are stored as-is (they already include
 * the 'p31:' prefix from BUS_KEYS).
 */

export class LocalStorageAdapter {
  private prefix: string;
  private storageHandler: ((e: StorageEvent) => void) | null = null;
  private onChangeCallback?: (key: string, value: unknown) => void;

  constructor(prefix: string = '') {
    this.prefix = prefix;

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.storageHandler = this.handleStorageEvent.bind(this);
      window.addEventListener('storage', this.storageHandler);
    }
  }

  private handleStorageEvent(e: StorageEvent): void {
    // Only process keys that start with our prefix (or all keys if prefix is '')
    if (!e.key) return;
    if (this.prefix && !e.key.startsWith(this.prefix)) return;

    let newValue: unknown = null;
    if (e.newValue !== null) {
      try {
        newValue = JSON.parse(e.newValue);
      } catch {
        newValue = e.newValue;
      }
    }

    // Pass the FULL key (including prefix) to the callback
    this.onChangeCallback?.(e.key, newValue);
  }

  onExternalChange(callback: (key: string, value: unknown) => void): void {
    this.onChangeCallback = callback;
  }

  set(key: string, value: unknown): void {
    if (typeof localStorage === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // localStorage full or unavailable — fail silently
    }
  }

  get(key: string): unknown {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }

  /** Load all keys matching prefix from localStorage */
  getAll(): Record<string, unknown> {
    if (typeof localStorage === 'undefined') return {};
    const result: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const fullKey = localStorage.key(i);
      if (!fullKey) continue;
      if (this.prefix && !fullKey.startsWith(this.prefix)) continue;
      result[fullKey] = this.get(fullKey);
    }
    return result;
  }

  destroy(): void {
    if (typeof window !== 'undefined' && this.storageHandler) {
      window.removeEventListener('storage', this.storageHandler);
      this.storageHandler = null;
    }
  }
}
