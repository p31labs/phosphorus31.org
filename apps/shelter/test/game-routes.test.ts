/**
 * RP31-01: Game routes integration test.
 * Verifies: molecule/register, brain/state, sync, mesh/directory, wallet balance, health.
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import express from 'express';
import { GameStore } from '../src/game-store';
import { createGameRouter } from '../src/routes/game';

const TEST_FINGERPRINT = 'test-fp-' + Date.now();
const BASE = 'http://localhost';

describe('Game routes', () => {
  let app: express.Express;
  let server: ReturnType<express.Express['listen']>;
  let baseUrl: string;

  beforeAll(async () => {
    process.env.DATABASE_URL = 'sqlite::memory:';
    const gameStore = new GameStore();
    await gameStore.initialize();

    app = express();
    app.use(express.json());
    app.use('/api/game', createGameRouter(gameStore));

    await new Promise<void>((resolve) => {
      server = app.listen(0, () => resolve());
    });
    const port = (server.address() as { port: number }).port;
    baseUrl = `${BASE}:${port}`;
  });

  afterAll(() => {
    server.close();
  });

  it('POST /api/game/molecule/register → 200 and genesis LOVE', async () => {
    const res = await fetch(`${baseUrl}/api/game/molecule/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fingerprint: TEST_FINGERPRINT,
        publicKey: { kty: 'EC', crv: 'P-256' },
        domeName: 'Test Dome',
        domeColor: '#00FF88',
        domeIntent: 'Test intent',
        coherence: 0.9,
        covenantSig: 'sig',
        covenantAt: new Date().toISOString(),
      }),
    });
    expect(res.status).toBe(200);
    const data = (await res.json()) as { status: string; genesisLove: number };
    expect(data.status).toBe('registered');
    expect(data.genesisLove).toBe(50);
  });

  it('GET /api/game/mesh/directory → includes test molecule', async () => {
    const res = await fetch(`${baseUrl}/api/game/mesh/directory`);
    expect(res.status).toBe(200);
    const list = (await res.json()) as Array<{ fingerprint: string; dome_name: string }>;
    const found = list.find((m) => m.fingerprint === TEST_FINGERPRINT);
    expect(found).toBeDefined();
    expect(found?.dome_name).toBe('Test Dome');
  });

  it('GET /api/game/wallet/:fingerprint/balance → totalEarned 50, 25/25 pools', async () => {
    const res = await fetch(`${baseUrl}/api/game/wallet/${TEST_FINGERPRINT}/balance`);
    expect(res.status).toBe(200);
    const bal = (await res.json()) as {
      sovereigntyPool: number;
      performancePool: number;
      totalEarned: number;
      transactionCount: number;
    };
    expect(bal.totalEarned).toBe(50);
    expect(bal.sovereigntyPool).toBe(25);
    expect(bal.performancePool).toBe(25);
    expect(bal.transactionCount).toBe(3);
  });

  it('POST /api/game/brain/state → 200', async () => {
    const res = await fetch(`${baseUrl}/api/game/brain/state`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spoons: 8, maxSpoons: 12, color: 'YELLOW' }),
    });
    expect(res.status).toBe(200);
    const data = (await res.json()) as { status: string };
    expect(data.status).toBe('ok');
  });

  it('GET /api/game/brain/state → returns posted values', async () => {
    const res = await fetch(`${baseUrl}/api/game/brain/state`);
    expect(res.status).toBe(200);
    const state = (await res.json()) as { spoons: number; maxSpoons: number; color: string };
    expect(state.spoons).toBe(8);
    expect(state.maxSpoons).toBe(12);
    expect(state.color).toBe('YELLOW');
  });

  it('POST /api/game/sync with player → 200', async () => {
    const res = await fetch(`${baseUrl}/api/game/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        player: {
          familyMemberId: TEST_FINGERPRINT,
          tier: 'seedling',
          xp: 10,
          totalLoveEarned: 50,
          buildStreak: 1,
          completedChallenges: ['genesis'],
          badges: ['first_resonance'],
        },
      }),
    });
    expect(res.status).toBe(200);
    const data = (await res.json()) as { status: string };
    expect(data.status).toBe('synced');
  });

  it('GET /health not mounted in minimal app — game store is ready', async () => {
    const gameStore = new GameStore();
    await gameStore.initialize();
    expect(gameStore.isReady()).toBe(true);
    await gameStore.close();
  });
});
