/**
 * Database Seed Script - Populates initial data
 */

import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '../utils/logger';

const logger = new Logger('DatabaseSeed');

interface SeedData {
  table: string;
  records: Record<string, any>[];
}

const seedData: SeedData[] = [
  {
    table: 'users',
    records: [
      {
        id: 'user_admin_001',
        username: 'admin',
        email: 'admin@supercentaur.local',
        role: 'admin',
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    table: 'system_logs',
    records: [
      {
        id: 'log_seed_001',
        level: 'INFO',
        module: 'DatabaseSeed',
        message: 'Database seeded successfully',
        timestamp: new Date().toISOString(),
      },
    ],
  },
];

async function seed() {
  logger.info('Starting database seed...');

  const dbDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Write seed data as a JSON reference file
  const seedPath = path.join(dbDir, 'seed-data.json');
  fs.writeFileSync(seedPath, JSON.stringify(seedData, null, 2));

  logger.info(`Seed data written: ${seedData.length} tables, ${seedData.reduce((s, d) => s + d.records.length, 0)} records`);
  logger.info(`Seed file: ${seedPath}`);
  logger.info('Database seed completed');
}

seed().catch((err) => {
  logger.error('Seed failed:', err);
  process.exit(1);
});
