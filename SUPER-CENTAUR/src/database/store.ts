/**
 * Persistent JSON-based data store for SUPER CENTAUR
 * Provides reliable cross-platform persistence without native dependencies.
 * Each collection is stored as a separate JSON file in data/store/.
 */

import * as fs from 'fs';
import * as path from 'path';

export interface StoreRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export class DataStore {
  private static instance: DataStore;
  private storeDir: string;
  private cache: Map<string, StoreRecord[]> = new Map();
  private dirty: Set<string> = new Set();
  private flushTimer: NodeJS.Timeout | null = null;

  private constructor() {
    this.storeDir = path.join(process.cwd(), 'data', 'store');
    if (!fs.existsSync(this.storeDir)) {
      fs.mkdirSync(this.storeDir, { recursive: true });
    }
    // Auto-flush every 2 seconds if there are pending writes
    this.flushTimer = setInterval(() => this.flushDirty(), 2000);
  }

  static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  private filePath(collection: string): string {
    return path.join(this.storeDir, `${collection}.json`);
  }

  private load(collection: string): StoreRecord[] {
    if (this.cache.has(collection)) return this.cache.get(collection)!;
    const fp = this.filePath(collection);
    let data: StoreRecord[] = [];
    if (fs.existsSync(fp)) {
      try {
        data = JSON.parse(fs.readFileSync(fp, 'utf8'));
      } catch {
        data = [];
      }
    }
    this.cache.set(collection, data);
    return data;
  }

  private save(collection: string): void {
    this.dirty.add(collection);
  }

  private flushDirty(): void {
    for (const collection of this.dirty) {
      const data = this.cache.get(collection);
      if (data) {
        try {
          fs.writeFileSync(this.filePath(collection), JSON.stringify(data, null, 2));
        } catch (e) {
          console.error(`[DataStore] Failed to flush ${collection}:`, e);
        }
      }
    }
    this.dirty.clear();
  }

  /** Flush all pending writes immediately */
  flush(): void {
    this.flushDirty();
  }

  /** Insert a record. Returns the record with generated id + timestamps. */
  insert<T extends Record<string, any>>(collection: string, data: T): T & StoreRecord {
    const records = this.load(collection);
    const record: any = {
      ...data,
      id: data.id || `${collection.slice(0, 3)}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    records.push(record);
    this.save(collection);
    return record;
  }

  /** Get all records in a collection, optionally filtered. */
  list<T extends StoreRecord>(collection: string, filter?: Partial<T>): T[] {
    const records = this.load(collection) as T[];
    if (!filter) return [...records];
    return records.filter(r => {
      for (const [key, val] of Object.entries(filter)) {
        if (r[key] !== val) return false;
      }
      return true;
    });
  }

  /** Get a single record by id. */
  get<T extends StoreRecord>(collection: string, id: string): T | null {
    const records = this.load(collection) as T[];
    return records.find(r => r.id === id) || null;
  }

  /** Update a record by id. Returns the updated record or null. */
  update<T extends StoreRecord>(collection: string, id: string, updates: Partial<T>): T | null {
    const records = this.load(collection);
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return null;
    records[index] = { ...records[index], ...updates, updatedAt: new Date().toISOString() };
    this.save(collection);
    return records[index] as T;
  }

  /** Delete a record by id. Returns true if deleted. */
  delete(collection: string, id: string): boolean {
    const records = this.load(collection);
    const index = records.findIndex(r => r.id === id);
    if (index === -1) return false;
    records.splice(index, 1);
    this.save(collection);
    return true;
  }

  /** Count records in a collection, optionally filtered. */
  count(collection: string, filter?: Record<string, any>): number {
    return this.list(collection, filter).length;
  }

  /** Get the most recent N records. */
  recent<T extends StoreRecord>(collection: string, limit = 10): T[] {
    const records = this.load(collection) as T[];
    return records.slice(-limit).reverse();
  }

  /** Clean up. */
  destroy(): void {
    if (this.flushTimer) clearInterval(this.flushTimer);
    this.flushDirty();
  }
}

export default DataStore;
