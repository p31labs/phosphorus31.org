#!/usr/bin/env node
/**
 * LAUNCH-04: Backup accommodation SQLite DB. Cross-platform (Node).
 * Copies apps/shelter/data/accommodation.db to apps/shelter/data/backups/
 * with timestamped filename. Keeps last 30 backups.
 * Run from repo root: node scripts/backup-accommodation-db.mjs
 * Or: npm run backup
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

const DB_PATH = process.env.ACCOMMODATION_DB_PATH || path.join(repoRoot, 'apps', 'shelter', 'data', 'accommodation.db');
const BACKUP_DIR = path.join(path.dirname(DB_PATH), 'backups');
const KEEP_LAST = 30;

function main() {
  if (!fs.existsSync(DB_PATH)) {
    console.warn('No accommodation DB at', DB_PATH, '- skip backup');
    process.exit(0);
  }
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const name = `accommodation-${ts}.db`;
  const dest = path.join(BACKUP_DIR, name);
  fs.copyFileSync(DB_PATH, dest);
  console.log('Backup written:', dest);

  const files = fs.readdirSync(BACKUP_DIR)
    .filter((f) => f.startsWith('accommodation-') && f.endsWith('.db'))
    .map((f) => ({ name: f, mtime: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime() }))
    .sort((a, b) => b.mtime - a.mtime);

  if (files.length > KEEP_LAST) {
    for (const f of files.slice(KEEP_LAST)) {
      fs.unlinkSync(path.join(BACKUP_DIR, f.name));
      console.log('Pruned:', f.name);
    }
  }
}

main();
