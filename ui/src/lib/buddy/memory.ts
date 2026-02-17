/**
 * P31 Buddy memory — IndexedDB-backed store for codename, preferences, achievements.
 * Local-first; sync can be added later. All display uses codename only.
 */

import type { BuddyMemory, BuddyAgeGroup, RecentAchievement, FavoriteStructure } from '../../types/buddy';
import { createDefaultMemory } from '../../types/buddy';

const DB_NAME = 'p31_buddy';
const STORE_NAME = 'memory';
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'userId' });
      }
    };
  });
}

export async function getBuddyMemory(userId: string): Promise<BuddyMemory | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get(userId);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve((req.result as BuddyMemory) ?? null);
    tx.oncomplete = () => db.close();
  });
}

export async function setBuddyMemory(memory: BuddyMemory): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const toSave = { ...memory, lastSeen: Date.now() };
    const req = store.put(toSave);
    req.onerror = () => reject(req.error);
    req.onsuccess = () => resolve();
    tx.oncomplete = () => db.close();
  });
}

export async function ensureBuddyMemory(
  userId: string,
  codename: string,
  ageGroup: BuddyAgeGroup = 'child'
): Promise<BuddyMemory> {
  const existing = await getBuddyMemory(userId);
  if (existing) {
    const updated = { ...existing, codename, lastSeen: Date.now() };
    await setBuddyMemory(updated);
    return updated;
  }
  const memory = createDefaultMemory(userId, codename, ageGroup);
  await setBuddyMemory(memory);
  return memory;
}

export async function updateCodename(userId: string, codename: string): Promise<BuddyMemory> {
  const memory = await getBuddyMemory(userId);
  if (!memory) {
    const newMemory = createDefaultMemory(userId, codename, 'child');
    await setBuddyMemory(newMemory);
    return newMemory;
  }
  const updated = { ...memory, codename, lastSeen: Date.now() };
  await setBuddyMemory(updated);
  return updated;
}

export async function addAchievement(userId: string, description: string): Promise<BuddyMemory | null> {
  const memory = await getBuddyMemory(userId);
  if (!memory) return null;
  const achievement: RecentAchievement = { timestamp: Date.now(), description };
  const recentAchievements = [achievement, ...memory.recentAchievements].slice(0, 20);
  const updated = { ...memory, recentAchievements, lastSeen: Date.now() };
  await setBuddyMemory(updated);
  return updated;
}

export async function addFavoriteStructure(
  userId: string,
  structure: FavoriteStructure
): Promise<BuddyMemory | null> {
  const memory = await getBuddyMemory(userId);
  if (!memory) return null;
  const exists = memory.favoriteStructures.some((s) => s.id === structure.id);
  const favoriteStructures = exists
    ? memory.favoriteStructures
    : [structure, ...memory.favoriteStructures].slice(0, 10);
  const updated = { ...memory, favoriteStructures, lastSeen: Date.now() };
  await setBuddyMemory(updated);
  return updated;
}

export async function updateLastSeen(userId: string): Promise<void> {
  const memory = await getBuddyMemory(userId);
  if (memory) await setBuddyMemory({ ...memory, lastSeen: Date.now() });
}

export async function updateAccessibility(
  userId: string,
  patch: Partial<BuddyMemory['accessibility']>
): Promise<BuddyMemory | null> {
  const memory = await getBuddyMemory(userId);
  if (!memory) return null;
  const updated = {
    ...memory,
    accessibility: { ...memory.accessibility, ...patch },
    lastSeen: Date.now(),
  };
  await setBuddyMemory(updated);
  return updated;
}
