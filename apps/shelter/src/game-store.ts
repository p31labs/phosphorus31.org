/**
 * Game Store — P31 Game Integration (Quantum Hello World → Engine)
 * Molecules, LOVE transactions, player progress, structures, brain state.
 * Separate SQLite DB (default ./game.db). Use GAME_DATABASE_URL or DATABASE_URL to override.
 */

import sqlite3 from 'sqlite3';
import { Logger } from './utils/logger.js';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS molecules (
  fingerprint TEXT PRIMARY KEY,
  public_key TEXT NOT NULL,
  dome_name TEXT NOT NULL,
  dome_color TEXT DEFAULT '#00FF88',
  dome_intent TEXT,
  coherence REAL DEFAULT 0.85,
  covenant_sig TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS love_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  fingerprint TEXT NOT NULL,
  type TEXT NOT NULL,
  amount REAL NOT NULL,
  description TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (fingerprint) REFERENCES molecules(fingerprint)
);
CREATE INDEX IF NOT EXISTS idx_love_fingerprint ON love_transactions(fingerprint);

CREATE TABLE IF NOT EXISTS player_progress (
  fingerprint TEXT PRIMARY KEY,
  tier TEXT DEFAULT 'seedling',
  xp INTEGER DEFAULT 0,
  total_love REAL DEFAULT 0,
  build_streak INTEGER DEFAULT 0,
  completed_challenges TEXT DEFAULT '[]',
  badges TEXT DEFAULT '[]',
  updated_at TEXT,
  FOREIGN KEY (fingerprint) REFERENCES molecules(fingerprint)
);

CREATE TABLE IF NOT EXISTS structures (
  id TEXT PRIMARY KEY,
  fingerprint TEXT NOT NULL,
  name TEXT NOT NULL,
  primitives TEXT NOT NULL,
  vertices INTEGER DEFAULT 4,
  edges INTEGER DEFAULT 6,
  is_rigid INTEGER DEFAULT 1,
  stability_score INTEGER DEFAULT 100,
  created_at TEXT NOT NULL,
  updated_at TEXT,
  FOREIGN KEY (fingerprint) REFERENCES molecules(fingerprint)
);

CREATE TABLE IF NOT EXISTS brain_state (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  spoons INTEGER DEFAULT 12,
  max_spoons INTEGER DEFAULT 12,
  color TEXT DEFAULT 'GREEN',
  meds_status TEXT,
  buffer_blocked INTEGER DEFAULT 0,
  love_total REAL DEFAULT 0,
  accommodation_count INTEGER DEFAULT 0,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS signals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  payload TEXT DEFAULT '{}',
  timestamp TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
`;

const GENESIS_TRANSACTIONS = [
  { type: 'MILESTONE_REACHED', love: 25.0, desc: 'First Resonance — spoke with the phosphorus' },
  { type: 'TETRAHEDRON_BOND', love: 15.0, desc: 'Delta Covenant signed — values verified' },
  { type: 'ARTIFACT_CREATED', love: 10.0, desc: 'Dome formed — first structure in the mesh' },
];

export interface MoleculeRow {
  fingerprint: string;
  public_key: string;
  dome_name: string;
  dome_color: string;
  dome_intent: string | null;
  coherence: number;
  covenant_sig: string | null;
  created_at: string;
}

export class GameStore {
  private db: sqlite3.Database | null = null;
  private logger: Logger;
  private readonly dbPath: string;

  constructor() {
    this.logger = new Logger('GameStore');
    const dbUrl = process.env.GAME_DATABASE_URL || process.env.DATABASE_URL || 'sqlite:./game.db';
    this.dbPath = dbUrl.startsWith('sqlite:') ? dbUrl.replace('sqlite:', '') : './game.db';
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          this.logger.error('GameStore failed to open database:', err);
          reject(err);
          return;
        }
        this.logger.info(`GameStore opened: ${this.dbPath}`);
        this.runSchema()
          .then(resolve)
          .catch(reject);
      });
    });
  }

  private async runSchema(): Promise<void> {
    if (!this.db) return;
    await new Promise<void>((resolve, reject) => {
      this.db!.exec(SCHEMA, (err) => (err ? reject(err) : resolve()));
    });
  }

  isReady(): boolean {
    return this.db !== null;
  }

  async registerMolecule(params: {
    fingerprint: string;
    publicKey: unknown;
    domeName: string;
    domeColor: string;
    domeIntent: string;
    coherence: number;
    covenantSig: string;
    covenantAt: string;
  }): Promise<void> {
    if (!this.db) throw new Error('GameStore not initialized');
    const now = new Date().toISOString();
    await new Promise<void>((resolve, reject) => {
      this.db!.run(
        `INSERT OR REPLACE INTO molecules (fingerprint, public_key, dome_name, dome_color, dome_intent, coherence, covenant_sig, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          params.fingerprint,
          JSON.stringify(params.publicKey),
          params.domeName,
          params.domeColor,
          params.domeIntent || '',
          params.coherence,
          params.covenantSig,
          params.covenantAt || now,
        ],
        (err) => (err ? reject(err) : resolve())
      );
    });
    for (const tx of GENESIS_TRANSACTIONS) {
      await new Promise<void>((resolve, reject) => {
        this.db!.run(
          `INSERT INTO love_transactions (fingerprint, type, amount, description, created_at) VALUES (?, ?, ?, ?, ?)`,
          [params.fingerprint, tx.type, tx.love, tx.desc, now],
          (err) => (err ? reject(err) : resolve())
        );
      });
    }
  }

  async getMeshDirectory(): Promise<MoleculeRow[]> {
    if (!this.db) return [];
    return new Promise((resolve, reject) => {
      this.db!.all(
        'SELECT fingerprint, public_key, dome_name, dome_color, dome_intent, coherence, covenant_sig, created_at FROM molecules ORDER BY created_at ASC',
        [],
        (err, rows) => (err ? reject(err) : resolve((rows as MoleculeRow[]) || []))
      );
    });
  }

  async getWalletBalance(fingerprint: string): Promise<{ sovereigntyPool: number; performancePool: number; totalEarned: number; transactionCount: number }> {
    if (!this.db) return { sovereigntyPool: 0, performancePool: 0, totalEarned: 0, transactionCount: 0 };
    const rows = await new Promise<Array<{ amount: number }>>((resolve, reject) => {
      this.db!.all('SELECT amount FROM love_transactions WHERE fingerprint = ?', [fingerprint], (err, r) =>
        err ? reject(err) : resolve((r as Array<{ amount: number }>) || [])
      );
    });
    const total = rows.reduce((sum, r) => sum + r.amount, 0);
    return {
      sovereigntyPool: total / 2,
      performancePool: total / 2,
      totalEarned: total,
      transactionCount: rows.length,
    };
  }

  async syncPlayerProgress(params: {
    familyMemberId: string;
    tier: string;
    xp: number;
    totalLove: number;
    buildStreak: number;
    completedChallenges: string[];
    badges: string[];
  }): Promise<void> {
    if (!this.db) return;
    const now = new Date().toISOString();
    await new Promise<void>((resolve, reject) => {
      this.db!.run(
        `INSERT OR REPLACE INTO player_progress (fingerprint, tier, xp, total_love, build_streak, completed_challenges, badges, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          params.familyMemberId,
          params.tier,
          params.xp,
          params.totalLove,
          params.buildStreak,
          JSON.stringify(params.completedChallenges),
          JSON.stringify(params.badges),
          now,
        ],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async getBrainState(): Promise<{ spoons: number; maxSpoons: number; color: string } | null> {
    if (!this.db) return null;
    const row = await new Promise<{ spoons: number; max_spoons: number; color: string } | undefined>((resolve, reject) => {
      this.db!.get('SELECT spoons, max_spoons, color FROM brain_state ORDER BY updated_at DESC LIMIT 1', (err, r) =>
        err ? reject(err) : resolve(r as { spoons: number; max_spoons: number; color: string } | undefined)
      );
    });
    if (!row) return null;
    return { spoons: row.spoons, maxSpoons: row.max_spoons, color: row.color };
  }

  async setBrainState(params: { spoons: number; maxSpoons: number; color: string }): Promise<void> {
    if (!this.db) return;
    const now = new Date().toISOString();
    await new Promise<void>((resolve, reject) => {
      this.db!.run(
        `INSERT INTO brain_state (spoons, max_spoons, color, updated_at) VALUES (?, ?, ?, ?)`,
        [params.spoons, params.maxSpoons, params.color, now],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async insertSignal(params: {
    type: string;
    fingerprint: string;
    timestamp?: string;
    payload?: string;
  }): Promise<void> {
    if (!this.db) return;
    const now = new Date().toISOString();
    await new Promise<void>((resolve, reject) => {
      this.db!.run(
        `INSERT INTO signals (type, fingerprint, payload, timestamp, created_at) VALUES (?, ?, ?, ?, ?)`,
        [
          params.type,
          params.fingerprint,
          params.payload ?? '{}',
          params.timestamp ?? now,
          now,
        ],
        (err) => (err ? reject(err) : resolve())
      );
    });
  }

  async getSignals(limit = 50): Promise<Array<{ type: string; fingerprint: string; timestamp: string }>> {
    if (!this.db) return [];
    return new Promise((resolve, reject) => {
      this.db!.all(
        'SELECT type, fingerprint, timestamp FROM signals ORDER BY created_at DESC LIMIT ?',
        [limit],
        (err, rows) => (err ? reject(err) : resolve((rows as Array<{ type: string; fingerprint: string; timestamp: string }>) ?? []))
      );
    });
  }

  async getSignalsByFingerprint(fingerprint: string): Promise<Array<{ type: string; timestamp: string }>> {
    if (!this.db) return [];
    return new Promise((resolve, reject) => {
      this.db!.all(
        'SELECT type, timestamp FROM signals WHERE fingerprint = ? ORDER BY created_at DESC',
        [fingerprint],
        (err, rows) => (err ? reject(err) : resolve((rows as Array<{ type: string; timestamp: string }>) ?? []))
      );
    });
  }

  async close(): Promise<void> {
    if (this.db) {
      return new Promise((resolve, reject) => {
        this.db!.close((err) => (err ? reject(err) : resolve(undefined)));
      });
    }
  }
}
