/**
 * P31 Sprout — signal routes. POST /signal, GET /signals, GET /signals/:fingerprint
 */

import { Router, Request, Response } from 'express';
import type { GameStore } from '../game-store.js';

const VALID_TYPES = ['ok', 'help', 'love', 'think'] as const;

export function createSproutRouter(
  gameStore: GameStore,
  broadcast: (payload: { type: string; data: unknown }) => void
): Router {
  const router = Router();

  router.post('/signal', async (req: Request, res: Response) => {
    try {
      const { type, fingerprint, timestamp } = req.body;
      const t = typeof type === 'string' && VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])
        ? (type as (typeof VALID_TYPES)[number])
        : 'ok';
      const fp = typeof fingerprint === 'string' ? fingerprint : '';
      if (!fp) {
        return res.status(400).json({ error: 'fingerprint required' });
      }
      const ts = typeof timestamp === 'string' ? timestamp : new Date().toISOString();
      await gameStore.insertSignal({ type: t, fingerprint: fp, timestamp: ts });
      broadcast({ type: 'sprout:signal', data: { type: t, fingerprint: fp, timestamp: ts } });
      return res.json({ status: 'received', ts });
    } catch (err) {
      return res.status(500).json({ error: 'Failed to store signal' });
    }
  });

  router.get('/signals', async (_req: Request, res: Response) => {
    try {
      const limit = Math.min(parseInt(_req.query.limit as string) || 50, 100);
      const list = await gameStore.getSignals(limit);
      return res.json(list);
    } catch {
      return res.json([]);
    }
  });

  router.get('/signals/:fingerprint', async (req: Request, res: Response) => {
    try {
      const fp = req.params.fingerprint ?? '';
      const list = await gameStore.getSignalsByFingerprint(fp);
      return res.json(list);
    } catch {
      return res.json([]);
    }
  });

  return router;
}
