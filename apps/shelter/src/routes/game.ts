/**
 * P31 Game Integration — Shelter API routes
 * Molecule registration, brain state, game sync, mesh directory, wallet balance.
 */

import { Router, Request, Response } from 'express';
import type { GameStore } from '../game-store.js';

/** Optional: require X-P31-Key if P31_API_KEY env is set */
function optionalP31Key(req: Request, res: Response, next: () => void): void {
  const apiKey = process.env.P31_API_KEY;
  if (!apiKey) {
    next();
    return;
  }
  const key = req.get('X-P31-Key');
  if (key !== apiKey) {
    res.status(401).json({ error: 'Invalid or missing X-P31-Key' });
    return;
  }
  next();
}

export function createGameRouter(gameStore: GameStore): Router {
  const router = Router();
  router.use(optionalP31Key);

  // POST /api/game/molecule/register — register molecule after formation
  router.post('/molecule/register', async (req: Request, res: Response) => {
    try {
      const {
        fingerprint,
        publicKey,
        domeName,
        domeColor,
        domeIntent,
        coherence,
        covenantSig,
        covenantAt,
      } = req.body;
      if (!fingerprint || !publicKey || !domeName) {
        return res.status(400).json({ error: 'fingerprint, publicKey, domeName required' });
      }
      await gameStore.registerMolecule({
        fingerprint,
        publicKey,
        domeName,
        domeColor: domeColor || '#00FF88',
        domeIntent: domeIntent || '',
        coherence: Number(coherence) || 0.85,
        covenantSig: covenantSig || '',
        covenantAt: covenantAt || new Date().toISOString(),
      });
      return res.json({ status: 'registered', genesisLove: 50.0 });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to register molecule' });
    }
  });

  // GET /api/game/brain/state — spoons (game/Scope pulls for getGameMode)
  router.get('/brain/state', async (_req: Request, res: Response) => {
    try {
      const state = await gameStore.getBrainState();
      if (!state) {
        return res.json({ spoons: 12, maxSpoons: 12, color: 'GREEN' });
      }
      return res.json(state);
    } catch {
      return res.json({ spoons: 12, maxSpoons: 12, color: 'GREEN' });
    }
  });

  // POST /api/game/brain/state — GAS Brain pushes spoons (UrlFetchApp.fetch); game breathes with body
  router.post('/brain/state', async (req: Request, res: Response) => {
    try {
      const { spoons, maxSpoons, color } = req.body;
      const n = (v: unknown): number => {
        const x = Number(v);
        return typeof v !== 'undefined' && v !== null && !Number.isNaN(x) ? x : 12;
      };
      await gameStore.setBrainState({
        spoons: n(spoons),
        maxSpoons: n(maxSpoons),
        color: ['GREEN', 'YELLOW', 'RED'].includes(color) ? color : 'GREEN',
      });
      return res.json({ status: 'ok' });
    } catch {
      return res.status(500).json({ error: 'Failed to set brain state' });
    }
  });

  // POST /api/game/sync — push game state updates
  router.post('/sync', async (req: Request, res: Response) => {
    try {
      const { player } = req.body;
      if (player?.familyMemberId) {
        await gameStore.syncPlayerProgress({
          familyMemberId: player.familyMemberId,
          tier: player.tier || 'seedling',
          xp: player.xp ?? 0,
          totalLove: player.totalLoveEarned ?? 0,
          buildStreak: player.buildStreak ?? 0,
          completedChallenges: Array.isArray(player.completedChallenges) ? player.completedChallenges : [],
          badges: Array.isArray(player.badges) ? player.badges : [],
        });
      }
      return res.json({ status: 'synced' });
    } catch {
      return res.status(500).json({ error: 'Failed to sync' });
    }
  });

  // GET /api/game/mesh/directory — all molecules (domes)
  router.get('/mesh/directory', async (_req: Request, res: Response) => {
    try {
      const rows = await gameStore.getMeshDirectory();
      const list = rows.map((r) => ({
        fingerprint: r.fingerprint,
        dome_name: r.dome_name,
        dome_color: r.dome_color,
        dome_intent: r.dome_intent,
        coherence: r.coherence,
        created_at: r.created_at,
      }));
      return res.json(list);
    } catch {
      return res.json([]);
    }
  });

  // GET /api/game/wallet/:fingerprint/balance — LOVE balance
  router.get('/wallet/:fingerprint/balance', async (req: Request, res: Response) => {
    try {
      const fingerprint = req.params.fingerprint ?? '';
      const balance = await gameStore.getWalletBalance(fingerprint);
      return res.json(balance);
    } catch {
      return res.json({
        sovereigntyPool: 0,
        performancePool: 0,
        totalEarned: 0,
        transactionCount: 0,
      });
    }
  });

  return router;
}
