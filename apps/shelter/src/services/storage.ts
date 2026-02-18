import Dexie, { type EntityTable } from "dexie";
import type { QueueItem, SessionRecord } from "@/types";

interface Preference {
  key: string;
  value: string;
}

const db = new Dexie("p31-buffer") as Dexie & {
  sessions: EntityTable<SessionRecord, "id">;
  queue: EntityTable<QueueItem, "id">;
  preferences: EntityTable<Preference, "key">;
};

db.version(1).stores({
  sessions: "++id, timestamp",
  queue: "++id, voltage, gate, timestamp",
  preferences: "key",
});

export { db };

export async function loadPreference<T>(key: string, fallback: T): Promise<T> {
  try {
    const record = await db.preferences.get(key);
    return record ? (JSON.parse(record.value) as T) : fallback;
  } catch {
    return fallback;
  }
}

export async function savePreference(key: string, value: unknown): Promise<void> {
  try {
    await db.preferences.put({ key, value: JSON.stringify(value) });
  } catch { /* offline-safe */ }
}
