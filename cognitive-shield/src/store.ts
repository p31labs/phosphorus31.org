/**
 * Buffer Store - SQLite local-first message storage
 */

import sqlite3 from 'sqlite3';
import { Logger } from './utils/logger';
import { QueuedMessage } from './queue';

export class BufferStore {
  private db: sqlite3.Database | null = null;
  private logger: Logger;
  private readonly dbPath: string;

  constructor() {
    this.logger = new Logger('BufferStore');
    const dbUrl = process.env.DATABASE_URL || 'sqlite:./buffer.db';
    
    // Extract path from sqlite: URL
    if (dbUrl.startsWith('sqlite:')) {
      this.dbPath = dbUrl.replace('sqlite:', '');
    } else {
      this.dbPath = './buffer.db';
    }
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          this.logger.error('Failed to open database:', err);
          reject(err);
          return;
        }
        
        this.logger.info(`Database opened: ${this.dbPath}`);
        this.createTables().then(resolve).catch(reject);
      });
    });
  }

  private async createTables(): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    await new Promise<void>((resolve, reject) => {
      this.db!.run(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        message TEXT NOT NULL,
        priority TEXT NOT NULL,
        metadata TEXT,
        timestamp TEXT NOT NULL,
        status TEXT NOT NULL,
        processed_at TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise<void>((resolve, reject) => {
      this.db!.run(`
      CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp)
    `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    await new Promise<void>((resolve, reject) => {
      this.db!.run(`
      CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status)
    `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    this.logger.info('Database tables created');
  }

  async saveMessage(message: QueuedMessage): Promise<void> {
    if (!this.db) {
      throw new Error('Database not initialized');
    }

    await new Promise<void>((resolve, reject) => {
      this.db!.run(
        `INSERT OR REPLACE INTO messages (id, message, priority, metadata, timestamp, status, processed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          message.id,
          message.message,
          message.priority,
          JSON.stringify(message.metadata),
          message.timestamp,
          message.status,
          new Date().toISOString(),
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    this.logger.debug(`Saved message ${message.id}`);
  }

  async getMessageStatus(messageId: string): Promise<QueuedMessage | null> {
    if (!this.db) {
      return null;
    }

    try {
      const row = await new Promise<any>((resolve, reject) => {
        this.db!.get('SELECT * FROM messages WHERE id = ?', [messageId], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });

      if (!row) {
        return null;
      }

      return this.mapRowToMessage(row);
    } catch (error) {
      this.logger.error('Error getting message status:', error);
      return null;
    }
  }

  private mapRowToMessage(row: any): QueuedMessage {
    return {
      id: row.id,
      message: row.message,
      priority: row.priority as QueuedMessage['priority'],
      metadata: JSON.parse(row.metadata || '{}'),
      timestamp: row.timestamp,
      status: row.status as QueuedMessage['status'],
    };
  }

  async getMessages(limit: number = 50, offset: number = 0, status?: string): Promise<QueuedMessage[]> {
    if (!this.db) {
      return [];
    }

    try {
      let query = 'SELECT * FROM messages';
      const params: any[] = [];

      if (status) {
        query += ' WHERE status = ?';
        params.push(status);
      }

      query += ' ORDER BY timestamp DESC LIMIT ? OFFSET ?';
      params.push(limit, offset);

      const rows = await new Promise<any[]>((resolve, reject) => {
        this.db!.all(query, params, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

      return rows.map((row) => this.mapRowToMessage(row));
    } catch (error) {
      this.logger.error('Error getting messages:', error);
      return [];
    }
  }

  async getMessageCount(status?: string): Promise<number> {
    if (!this.db) {
      return 0;
    }

    try {
      let query = 'SELECT COUNT(*) as count FROM messages';
      const params: any[] = [];

      if (status) {
        query += ' WHERE status = ?';
        params.push(status);
      }

      const row = await new Promise<any>((resolve, reject) => {
        this.db!.get(query, params, (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
      return row?.count || 0;
    } catch (error) {
      this.logger.error('Error getting message count:', error);
      return 0;
    }
  }

  isReady(): boolean {
    return this.db !== null;
  }

  async close(): Promise<void> {
    if (this.db) {
      return new Promise((resolve, reject) => {
        this.db!.close((err) => {
          if (err) {
            this.logger.error('Error closing database:', err);
            reject(err);
          } else {
            this.logger.info('Database closed');
            resolve();
          }
        });
      });
    }
  }
}
