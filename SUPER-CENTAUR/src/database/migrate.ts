import { Database } from 'sqlite3';
import { promisify } from 'util';
import * as path from 'path';

const dbPath = path.join(__dirname, '../../data/super-centaur.db');
const db = new Database(dbPath);

const runAsync = promisify(db.run.bind(db));
const allAsync = promisify(db.all.bind(db));

interface MigrationTable {
  name: string;
}

interface IndexInfo {
  name: string;
}

interface ColumnInfo {
  name: string;
}

interface Migration {
  id: number;
  migration_name: string;
  executed_at: string;
}

async function runMigrations() {
  try {
    console.log('🔄 Running SUPER CENTAUR database migrations...');

    // Check if migrations table exists
    const migrationsTable = await allAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='migrations'
    `) as MigrationTable[];

    if (migrationsTable.length === 0) {
      await runAsync(`
        CREATE TABLE migrations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          migration_name TEXT NOT NULL UNIQUE,
          executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('✅ Migrations table created');
    }

    // Migration 1: Add indexes for better performance
    const index1Exists = await allAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='index' AND name='idx_users_email'
    `) as IndexInfo[];
    
    if (index1Exists.length === 0) {
      await runAsync('CREATE INDEX idx_users_email ON users(email)');
      await runAsync('CREATE INDEX idx_users_username ON users(username)');
      await runAsync('CREATE INDEX idx_legal_cases_user_id ON legal_cases(user_id)');
      await runAsync('CREATE INDEX idx_medical_records_user_id ON medical_records(user_id)');
      await runAsync('CREATE INDEX idx_family_support_user_id ON family_support(user_id)');
      await runAsync('CREATE INDEX idx_blockchain_transactions_user_id ON blockchain_transactions(user_id)');
      await runAsync('CREATE INDEX idx_system_logs_timestamp ON system_logs(created_at)');
      await runAsync('CREATE INDEX idx_monitoring_data_timestamp ON monitoring_data(timestamp)');
      
      await runAsync(`
        INSERT INTO migrations (migration_name) 
        VALUES ('add_performance_indexes')
      `);
      console.log('✅ Performance indexes migration completed');
    }

    // Migration 2: Add additional fields if needed
    const hasAdditionalFields = await allAsync(`
      PRAGMA table_info(users)
    `) as ColumnInfo[];
    
    const hasPasswordReset = hasAdditionalFields.some((col: ColumnInfo) => col.name === 'password_reset_token');
    if (!hasPasswordReset) {
      await runAsync(`
        ALTER TABLE users ADD COLUMN password_reset_token TEXT
      `);
      await runAsync(`
        ALTER TABLE users ADD COLUMN password_reset_expires DATETIME
      `);
      await runAsync(`
        ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT 0
      `);
      
      await runAsync(`
        INSERT INTO migrations (migration_name) 
        VALUES ('add_user_security_fields')
      `);
      console.log('✅ User security fields migration completed');
    }

    // Migration 3: Add session management
    const sessionsTable = await allAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='sessions'
    `) as MigrationTable[];

    if (sessionsTable.length === 0) {
      await runAsync(`
        CREATE TABLE sessions (
          id TEXT PRIMARY KEY,
          user_id INTEGER,
          expires_at DATETIME NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);
      
      await runAsync(`
        INSERT INTO migrations (migration_name) 
        VALUES ('add_sessions_table')
      `);
      console.log('✅ Sessions table migration completed');
    }

    // Migration 4: Add codename and real_name (P31 Buddy / privacy)
    const hasCodename = (await allAsync(`PRAGMA table_info(users)`) as ColumnInfo[]).some(
      (c: ColumnInfo) => c.name === 'codename'
    );
    if (!hasCodename) {
      await runAsync(`ALTER TABLE users ADD COLUMN codename TEXT`);
      await runAsync(`ALTER TABLE users ADD COLUMN real_name TEXT`);
      await runAsync(`
        CREATE UNIQUE INDEX idx_users_codename ON users(codename) WHERE codename IS NOT NULL
      `);
      await runAsync(`
        INSERT INTO migrations (migration_name)
        VALUES ('add_user_codename_real_name')
      `);
      console.log('✅ User codename/real_name migration completed');
    }

    // Migration 5: Add audit trail
    const auditTable = await allAsync(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name='audit_log'
    `) as MigrationTable[];

    if (auditTable.length === 0) {
      await runAsync(`
        CREATE TABLE audit_log (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          action TEXT NOT NULL,
          entity_type TEXT,
          entity_id INTEGER,
          old_values TEXT,
          new_values TEXT,
          ip_address TEXT,
          user_agent TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users (id)
        )
      `);
      
      await runAsync(`
        INSERT INTO migrations (migration_name) 
        VALUES ('add_audit_log_table')
      `);
      console.log('✅ Audit log table migration completed');
    }

    // Show migration status
    const migrations = await allAsync('SELECT * FROM migrations ORDER BY executed_at') as Migration[];
    console.log('📊 Migration status:');
    migrations.forEach((migration: Migration) => {
      console.log(`  ✅ ${migration.migration_name} - ${migration.executed_at}`);
    });

    console.log('🎉 All migrations completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

// Run migrations if called directly
if (require.main === module) {
  runMigrations();
}

export { runMigrations };