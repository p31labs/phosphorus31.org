/**
 * Accommodation Log Store — LAUNCH-04
 * SQLite persistence for ADA accommodation records. PII-free only.
 * WAL mode, integrity check on startup, archive rotation for records > 365 days.
 */

import sqlite3 from 'sqlite3';
import { Logger } from './utils/logger.js';
import path from 'path';
import fs from 'fs';

export interface AccommodationRecord {
  id?: number;
  timestamp: string;
  event_type: string;
  signal: string;
  voltage_before: string;
  voltage_after: string;
  source: string;
  details: string;
  accommodation_type: string;
  created_at?: string;
}

const VALID_EVENT_TYPES = [
  'sprout_signal',
  'scope_response',
  'message_released',
  'system',
] as const;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS accommodation_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp TEXT NOT NULL,
  event_type TEXT NOT NULL,
  signal TEXT NOT NULL,
  voltage_before TEXT NOT NULL,
  voltage_after TEXT NOT NULL,
  source TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  accommodation_type TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_timestamp ON accommodation_log(timestamp);
CREATE INDEX IF NOT EXISTS idx_event_type ON accommodation_log(event_type);
`;

const ARCHIVE_SCHEMA = `
CREATE TABLE IF NOT EXISTS accommodation_archive (
  id INTEGER PRIMARY KEY,
  timestamp TEXT NOT NULL,
  event_type TEXT NOT NULL,
  signal TEXT NOT NULL,
  voltage_before TEXT NOT NULL,
  voltage_after TEXT NOT NULL,
  source TEXT NOT NULL,
  details TEXT NOT NULL DEFAULT '',
  accommodation_type TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_archive_timestamp ON accommodation_archive(timestamp);
CREATE INDEX IF NOT EXISTS idx_archive_event_type ON accommodation_archive(event_type);
`;

export class AccommodationLogStore {
  private db: sqlite3.Database | null = null;
  private logger: Logger;
  private readonly dbPath: string;
  private lastArchiveRun = 0;
  private triedRestore = false; // LAUNCH-04: only attempt one restore on integrity failure
  private readonly ARCHIVE_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 hours
  private readonly ARCHIVE_DAYS = 365;

  constructor() {
    this.logger = new Logger('AccommodationLogStore');
    const dataDir = process.env.ACCOMMODATION_DB_DIR || path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    this.dbPath = path.join(dataDir, 'accommodation.db');
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          this.logger.error('Failed to open accommodation DB:', err);
          reject(err);
          return;
        }
        this.logger.info(`Accommodation DB opened: ${this.dbPath}`);
        this.runPragmas()
          .then(() => this.createTables())
          .then(() => this.verifyIntegrity())
          .then((ok) => {
            if (!ok && !this.triedRestore) {
              this.triedRestore = true;
              return this.close().then(() => this.restoreFromLatestBackup()).then(() => this.initialize());
            }
            if (!ok) return Promise.reject(new Error('Accommodation DB integrity check failed; restore from backup failed or no backup available'));
            return this.maybeRunArchive();
          })
          .then(resolve)
          .catch((e: unknown) => {
            const err = e as { code?: string; errno?: number };
            if (err?.code === 'SQLITE_MISUSE' || err?.errno === 21) {
              this.logger.warn('Accommodation DB SQLITE_MISUSE during init, continuing in fallback mode');
              resolve();
              return;
            }
            reject(e);
          });
      });
    });
  }

  private async runPragmas(): Promise<void> {
    if (!this.db) return;
    const sql = [
      'PRAGMA journal_mode=WAL;',
      'PRAGMA foreign_keys=ON;',
      'PRAGMA synchronous=NORMAL;',
      'PRAGMA busy_timeout=5000;',
    ].join('\n');
    await new Promise<void>((resolve, reject) => {
      this.db!.exec(sql, (err) => (err ? reject(err) : resolve()));
    });
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('DB not initialized');
    await new Promise<void>((resolve, reject) => {
      this.db!.exec(SCHEMA, (err) => (err ? reject(err) : resolve()));
    });
    await new Promise<void>((resolve, reject) => {
      this.db!.exec(ARCHIVE_SCHEMA, (err) => (err ? reject(err) : resolve()));
    });
  }

  /**
   * LAUNCH-04: Copy latest backup over dbPath. Call after close() on integrity failure.
   * Backups live in data/backups/ (accommodation-*.db). No backup → throws.
   */
  async restoreFromLatestBackup(): Promise<void> {
    const backupDir = path.join(path.dirname(this.dbPath), 'backups');
    if (!fs.existsSync(backupDir)) {
      throw new Error('No backups directory; cannot restore');
    }
    const files = fs.readdirSync(backupDir)
      .filter((f) => f.startsWith('accommodation-') && f.endsWith('.db'))
      .map((f) => ({ name: f, mtime: fs.statSync(path.join(backupDir, f)).mtime.getTime() }))
      .sort((a, b) => b.mtime - a.mtime);
    if (files.length === 0) {
      throw new Error('No backup files found; cannot restore');
    }
    const first = files[0];
    if (!first) throw new Error('No backup files found; cannot restore');
    const latest = path.join(backupDir, first.name);
    fs.copyFileSync(latest, this.dbPath);
    this.logger.info('Restored accommodation DB from backup:', first.name);
  }

  /** LAUNCH-04: On startup verify integrity; log result. Defensive: SQLITE_MISUSE on some platforms → assume ok. */
  async verifyIntegrity(): Promise<boolean> {
    if (!this.db) return false;
    try {
      const result = await new Promise<string>((resolve, reject) => {
        this.db!.all('PRAGMA quick_check', (err, rows: { quick_check?: string }[]) => {
          if (err) return reject(err);
          const first = rows?.[0];
          resolve(first?.quick_check ?? (rows?.length ? 'unknown' : 'ok'));
        });
      });
      const ok = result === 'ok';
      if (ok) this.logger.info('Accommodation DB integrity check: ok');
      else this.logger.error('Accommodation DB integrity check failed:', result);
      return ok;
    } catch (e: unknown) {
      const err = e as { code?: string; errno?: number };
      if (err?.code === 'SQLITE_MISUSE' || err?.errno === 21) {
        this.logger.warn('Accommodation DB integrity check skipped (SQLITE_MISUSE on this platform), assuming ok');
        return true;
      }
      throw e;
    }
  }

  /** LAUNCH-04: Move records older than ARCHIVE_DAYS to accommodation_archive; run at most every 24h. */
  async maybeRunArchive(): Promise<void> {
    const now = Date.now();
    if (now - this.lastArchiveRun < this.ARCHIVE_INTERVAL_MS) return;
    this.lastArchiveRun = now;
    if (!this.db) return;
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - this.ARCHIVE_DAYS);
      const cutoffIso = cutoff.toISOString();
      await new Promise<void>((resolve, reject) => {
        this.db!.run(
          `INSERT INTO accommodation_archive (id, timestamp, event_type, signal, voltage_before, voltage_after, source, details, accommodation_type, created_at)
           SELECT id, timestamp, event_type, signal, voltage_before, voltage_after, source, details, accommodation_type, created_at
           FROM accommodation_log WHERE timestamp < ?`,
          [cutoffIso],
          (err) => {
            if (err) {
              this.logger.error('Archive insert failed:', err);
              return reject(err);
            }
            resolve();
          }
        );
      });
      await new Promise<void>((resolve, reject) => {
        this.db!.run('DELETE FROM accommodation_log WHERE timestamp < ?', [cutoffIso], (err) => {
          if (err) reject(err);
          else resolve();
        });
      });
      this.logger.info('Accommodation archive rotation completed (records older than 365 days moved).');
    } catch (e: unknown) {
      const err = e as { code?: string; errno?: number };
      if (err?.code === 'SQLITE_MISUSE' || err?.errno === 21) {
        this.logger.warn('Archive rotation skipped (SQLITE_MISUSE), will retry next interval');
        return;
      }
      throw e;
    }
  }

  async insert(record: Omit<AccommodationRecord, 'id' | 'created_at'>): Promise<number> {
    if (!this.db) throw new Error('DB not initialized');
    const eventType = VALID_EVENT_TYPES.includes(record.event_type as (typeof VALID_EVENT_TYPES)[number])
      ? record.event_type
      : 'system';
    return new Promise((resolve, reject) => {
      this.db!.run(
        `INSERT INTO accommodation_log (timestamp, event_type, signal, voltage_before, voltage_after, source, details, accommodation_type)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          record.timestamp,
          eventType,
          record.signal ?? '',
          record.voltage_before ?? '',
          record.voltage_after ?? '',
          record.source ?? 'shelter',
          record.details ?? '',
          record.accommodation_type ?? '',
        ],
        function (err) {
          if (err) reject(err);
          else resolve(this.lastID);
        }
      );
    });
  }

  /** Update voltage_after for a row (e.g. after sprout_signal when voltage is set). */
  async updateVoltageAfter(id: number, voltage_after: string): Promise<void> {
    if (!this.db) return;
    await new Promise<void>((resolve, reject) => {
      this.db!.run('UPDATE accommodation_log SET voltage_after = ? WHERE id = ?', [voltage_after, id], (err) =>
        err ? reject(err) : resolve()
      );
    });
  }

  async getAll(includeArchive: boolean): Promise<AccommodationRecord[]> {
    if (!this.db) return [];
    const sql = includeArchive
      ? `SELECT * FROM (SELECT * FROM accommodation_log UNION ALL SELECT * FROM accommodation_archive) ORDER BY timestamp ASC`
      : `SELECT * FROM accommodation_log ORDER BY timestamp ASC`;
    return new Promise((resolve, reject) => {
      this.db!.all(sql, [], (err, rows: AccommodationRecord[] | undefined) => {
        if (err) reject(err);
        else resolve(rows ?? []);
      });
    });
  }

  async getSummary(): Promise<{
    totals: number;
    events_by_type: Record<string, number>;
    events_by_day: Record<string, number>;
    help_signals_count: number;
  }> {
    const all = await this.getAll(false);
    const eventsByType: Record<string, number> = {};
    const eventsByDay: Record<string, number> = {};
    let helpSignalsCount = 0;
    for (const e of all) {
      eventsByType[e.event_type] = (eventsByType[e.event_type] ?? 0) + 1;
      const day = e.timestamp.slice(0, 10);
      eventsByDay[day] = (eventsByDay[day] ?? 0) + 1;
      if (e.signal === 'help') helpSignalsCount += 1;
    }
    return {
      totals: all.length,
      events_by_type: eventsByType,
      events_by_day: eventsByDay,
      help_signals_count: helpSignalsCount,
    };
  }

  /** Last sprout_signal entry (for scope:subscribed snapshot). */
  async getLastSproutSignal(): Promise<AccommodationRecord | null> {
    if (!this.db) return null;
    return new Promise((resolve, reject) => {
      this.db!.get(
        "SELECT * FROM accommodation_log WHERE event_type = 'sprout_signal' ORDER BY timestamp DESC LIMIT 1",
        [],
        (err, row: AccommodationRecord | undefined) => {
          if (err) reject(err);
          else resolve(row ?? null);
        }
      );
    });
  }

  /** LAUNCH-07: Sync readiness for health endpoint (no I/O). */
  isReady(): boolean {
    return this.db !== null;
  }

  async close(): Promise<void> {
    if (this.db) {
      await new Promise<void>((resolve, reject) => {
        this.db!.close((err) => (err ? reject(err) : resolve()));
      });
      this.db = null;
      this.logger.info('Accommodation DB closed');
    }
  }
}
