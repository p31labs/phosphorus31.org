/**
 * Run SQL migrations from migrations/*.sql against configured Postgres.
 */
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import pg from 'pg';
import { getDb } from './index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function main() {
  const db = getDb();
  if (!db) {
    console.error('DB not configured. Set DB_HOST, DB_NAME, DB_USER, DB_PASSWORD');
    process.exit(1);
  }
  const migrationsDir = join(__dirname, '..', '..', 'migrations');
  const files = readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
  const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432', 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  try {
    for (const file of files) {
      const sql = readFileSync(join(migrationsDir, file), 'utf-8');
      await pool.query(sql);
      console.log(`Ran ${file}`);
    }
    console.log('Migrations complete.');
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
