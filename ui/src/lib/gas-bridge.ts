/**
 * GAS Bridge — Connects the P31 frontend to the SIMPLEX v6 Google Apps Script backend.
 *
 * Pattern: Try GAS first (if VITE_SHELTER_URL set) → cache to localStorage on success →
 * fall back to localStorage on failure → return source indicator.
 *
 * No OAuth needed — GAS web apps handle auth internally.
 * All data is also cached locally so the app works offline.
 */

/* ── Types ── */

export interface BridgeResponse<T> {
  ok: boolean;
  data: T | null;
  error: string | null;
  source: 'gas' | 'local' | 'offline';
  timestamp: number;
}

export interface SpoonData {
  date: string;
  current: number;
  starting: number;
  ending: number;
  max: number;
}

export interface MedEntry {
  name: string;
  taken: boolean;
  takenAt: string | null;
}

export interface MedLogEntry {
  date: string;
  meds: MedEntry[];
}

export interface FrictionEntry {
  id: string;
  timestamp: string;
  categories: string[];
  note: string;
  spoonCost: number;
  severity: 'managed' | 'marked' | 'shutdown';
  spoonsBefore: number;
  spoonsAfter: number;
}

export interface SleepEntry {
  date: string;
  hours: number;
}

export interface SystemStatus {
  version: string;
  lastSync: string;
  sheetsConnected: boolean;
  dailyBriefing: boolean;
}

export interface DateRange {
  start: string;
  end: string;
}

/* ── Configuration ── */

const GAS_URL = (() => {
  // 1. Check localStorage (ConnectionsView saves the GAS URL here)
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('p31:gas-url');
    if (stored) return stored;
  }
  // 2. Fall back to dedicated env var (not VITE_SHELTER_URL — that's the Buffer)
  if (typeof import.meta !== 'undefined') {
    return (import.meta as Record<string, Record<string, string>>).env?.VITE_GAS_URL ?? '';
  }
  // 3. No URL available — app works offline
  return '';
})();

const CACHE_PREFIX = 'p31:gas:cache:';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/* ── Internal Helpers ── */

function cacheKey(action: string, params?: string): string {
  return `${CACHE_PREFIX}${action}${params ? ':' + params : ''}`;
}

function readCache<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const cached = JSON.parse(raw) as { data: T; ts: number };
    if (Date.now() - cached.ts > CACHE_TTL_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

function writeCache<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // localStorage full or unavailable — graceful degradation
  }
}

function ok<T>(data: T, source: BridgeResponse<T>['source']): BridgeResponse<T> {
  return { ok: true, data, error: null, source, timestamp: Date.now() };
}

function fail<T>(error: string, source: BridgeResponse<T>['source']): BridgeResponse<T> {
  return { ok: false, data: null, error, source, timestamp: Date.now() };
}

async function gasGet<T>(action: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(GAS_URL);
  url.searchParams.set('action', action);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    method: 'GET',
    redirect: 'follow', // GAS web apps redirect
  });

  if (!res.ok) throw new Error(`GAS returned ${res.status}`);
  return (await res.json()) as T;
}

async function gasPost<T>(action: string, data: unknown): Promise<T> {
  const res = await fetch(GAS_URL, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain' }, // GAS requires text/plain for CORS
    body: JSON.stringify({ action, data }),
  });

  if (!res.ok) throw new Error(`GAS returned ${res.status}`);
  return (await res.json()) as T;
}

/* ── Public API ── */

/**
 * Check if the GAS bridge is configured (URL is set).
 */
export function isConfigured(): boolean {
  return GAS_URL.length > 0;
}

/**
 * Get today's spoon data.
 */
export async function getSpoons(date?: string): Promise<BridgeResponse<SpoonData>> {
  const d = date ?? new Date().toISOString().slice(0, 10);
  const key = cacheKey('getSpoons', d);

  if (!GAS_URL) {
    // Try local storage directly
    const localKey = `p31:spoons:${d}`;
    try {
      const raw = localStorage.getItem(localKey);
      if (raw) return ok(JSON.parse(raw) as SpoonData, 'offline');
    } catch { /* fall through */ }
    return ok({ date: d, current: 12, starting: 12, ending: 12, max: 12 }, 'offline');
  }

  try {
    const data = await gasGet<SpoonData>('getSpoons', { date: d });
    writeCache(key, data);
    // Also write to standard localStorage key for Exhibit A
    localStorage.setItem(`p31:spoons:${d}`, JSON.stringify(data));
    return ok(data, 'gas');
  } catch (err) {
    // Fallback: cache, then localStorage, then default
    const cached = readCache<SpoonData>(key);
    if (cached) return ok(cached, 'local');

    try {
      const raw = localStorage.getItem(`p31:spoons:${d}`);
      if (raw) return ok(JSON.parse(raw) as SpoonData, 'local');
    } catch { /* fall through */ }

    return fail(String(err), 'local');
  }
}

/**
 * Get medication log for a date range.
 */
export async function getMedLog(dateRange?: DateRange): Promise<BridgeResponse<MedLogEntry[]>> {
  const key = cacheKey('getMedLog', dateRange ? `${dateRange.start}_${dateRange.end}` : 'all');

  if (!GAS_URL) {
    return ok([], 'offline');
  }

  try {
    const params: Record<string, string> = {};
    if (dateRange) {
      params.start = dateRange.start;
      params.end = dateRange.end;
    }
    const data = await gasGet<MedLogEntry[]>('getMedLog', params);
    writeCache(key, data);
    return ok(data, 'gas');
  } catch (err) {
    const cached = readCache<MedLogEntry[]>(key);
    if (cached) return ok(cached, 'local');
    return fail(String(err), 'local');
  }
}

/**
 * Get friction log entries.
 */
export async function getFrictionLog(dateRange?: DateRange): Promise<BridgeResponse<FrictionEntry[]>> {
  const key = cacheKey('getFrictionLog', dateRange ? `${dateRange.start}_${dateRange.end}` : 'all');

  if (!GAS_URL) {
    return ok([], 'offline');
  }

  try {
    const params: Record<string, string> = {};
    if (dateRange) {
      params.start = dateRange.start;
      params.end = dateRange.end;
    }
    const data = await gasGet<FrictionEntry[]>('getFrictionLog', params);
    writeCache(key, data);
    return ok(data, 'gas');
  } catch (err) {
    const cached = readCache<FrictionEntry[]>(key);
    if (cached) return ok(cached, 'local');
    return fail(String(err), 'local');
  }
}

/**
 * Get sleep log entries.
 */
export async function getSleepLog(dateRange?: DateRange): Promise<BridgeResponse<SleepEntry[]>> {
  const key = cacheKey('getSleepLog', dateRange ? `${dateRange.start}_${dateRange.end}` : 'all');

  if (!GAS_URL) {
    return ok([], 'offline');
  }

  try {
    const params: Record<string, string> = {};
    if (dateRange) {
      params.start = dateRange.start;
      params.end = dateRange.end;
    }
    const data = await gasGet<SleepEntry[]>('getSleepLog', params);
    writeCache(key, data);
    return ok(data, 'gas');
  } catch (err) {
    const cached = readCache<SleepEntry[]>(key);
    if (cached) return ok(cached, 'local');
    return fail(String(err), 'local');
  }
}

/**
 * Get system status from GAS backend.
 */
export async function getSystemStatus(): Promise<BridgeResponse<SystemStatus>> {
  if (!GAS_URL) {
    return ok({
      version: 'offline',
      lastSync: 'never',
      sheetsConnected: false,
      dailyBriefing: false,
    }, 'offline');
  }

  try {
    const data = await gasGet<SystemStatus>('getSystemStatus');
    return ok(data, 'gas');
  } catch (err) {
    return fail(String(err), 'local');
  }
}

/**
 * Log a friction event to GAS backend.
 */
export async function logFriction(entry: FrictionEntry): Promise<BridgeResponse<void>> {
  // Always save locally first
  try {
    const storage = typeof window !== 'undefined' ? window.storage : undefined;
    if (storage) {
      await storage.set(`p31:friction:${entry.id}`, JSON.stringify(entry));
    }
  } catch { /* local save failed — continue */ }

  if (!GAS_URL) {
    return ok(undefined as unknown as void, 'offline');
  }

  try {
    await gasPost<void>('logFriction', entry);
    return ok(undefined as unknown as void, 'gas');
  } catch (err) {
    return fail(String(err), 'local');
  }
}

/**
 * Log medication compliance to GAS backend.
 */
export async function logMed(entry: MedLogEntry): Promise<BridgeResponse<void>> {
  if (!GAS_URL) {
    return ok(undefined as unknown as void, 'offline');
  }

  try {
    await gasPost<void>('logMed', entry);
    return ok(undefined as unknown as void, 'gas');
  } catch (err) {
    return fail(String(err), 'local');
  }
}

/**
 * Log spoon data to GAS backend.
 */
export async function logSpoons(entry: SpoonData): Promise<BridgeResponse<void>> {
  // Always save locally
  try {
    localStorage.setItem(`p31:spoons:${entry.date}`, JSON.stringify(entry));
  } catch { /* continue */ }

  if (!GAS_URL) {
    return ok(undefined as unknown as void, 'offline');
  }

  try {
    await gasPost<void>('logSpoons', entry);
    return ok(undefined as unknown as void, 'gas');
  } catch (err) {
    return fail(String(err), 'local');
  }
}

/**
 * Create the full bridge object (convenience for components that need all methods).
 */
export function createGASBridge() {
  return {
    isConfigured,
    getSpoons,
    getMedLog,
    getFrictionLog,
    getSleepLog,
    getSystemStatus,
    logFriction,
    logMed,
    logSpoons,
  };
}
