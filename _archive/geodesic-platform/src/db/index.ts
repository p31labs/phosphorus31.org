/**
 * Kysely + PostgreSQL for worlds, structures, users, assets, portals.
 * Optional: run without DB (Colyseus still works with in-memory state).
 */
import { Kysely, PostgresDialect } from 'kysely';
import pg from 'pg';
import type { ColumnType, Generated } from 'kysely';

export interface Database {
  users: {
    id: Generated<string>;
    email: string;
    username: string;
    password_hash: string;
    coherence_balance: number;
    created_at: ColumnType<Date, never, never>;
    last_login: Date | null;
  };
  worlds: {
    id: string;
    owner_id: string;
    name: string;
    description: string | null;
    visibility: string;
    structures: unknown;
    settings: unknown;
    coherence_value: number;
    visitor_count: number;
    created_at: ColumnType<Date, never, never>;
    updated_at: ColumnType<Date, never, Date>;
  };
  structures: {
    id: Generated<string>;
    world_id: string;
    owner_id: string;
    name: string | null;
    vertices: unknown;
    edges: unknown;
    analysis_result: unknown;
    stability: number | null;
    coherence_bonus: number;
    created_at: ColumnType<Date, never, never>;
  };
  assets: {
    id: Generated<string>;
    owner_id: string;
    name: string;
    description: string | null;
    price: number;
    thumbnail_url: string | null;
    structure_data: unknown;
    listed: boolean;
    download_count: number;
    created_at: ColumnType<Date, never, never>;
  };
  transactions: {
    id: Generated<string>;
    from_user: string | null;
    to_user: string | null;
    asset_id: string | null;
    amount: number;
    type: string;
    created_at: ColumnType<Date, never, never>;
  };
  portals: {
    id: Generated<string>;
    source_world_id: string;
    target_world_id: string;
    source_position: unknown;
    target_position: unknown;
    owner_id: string;
    is_active: boolean;
    coherence_cost: number;
    created_at: ColumnType<Date, never, never>;
  };
}

let _db: Kysely<Database> | null = null;

export function getDb(): Kysely<Database> | null {
  if (_db) return _db;
  const host = process.env.DB_HOST;
  const database = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;
  if (!host || !database || !user || !password) return null;
  const pool = new pg.Pool({
    host,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    database,
    user,
    password,
    max: 20,
  });
  _db = new Kysely<Database>({
    dialect: new PostgresDialect({ pool }),
  });
  return _db;
}

export async function closeDb(): Promise<void> {
  if (_db) {
    await _db.destroy();
    _db = null;
  }
}
