/**
 * Test setup — use in-memory SQLite for game store so tests don't touch disk.
 */
process.env.DATABASE_URL = 'sqlite::memory:';
