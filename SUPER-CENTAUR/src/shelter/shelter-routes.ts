/**
 * Shelter API Routes — Scope ↔ Centaur contract
 *
 * Provides the Shelter-compat endpoints that the Scope UI (and ShelterBridge)
 * call for brain state, molecule registration, wallet balances, game-state
 * sync, and mesh status.
 *
 * In-memory stores are intentional for this stage — persistence comes later
 * via DataStore or PGLite.
 */

import { Router, Request, Response } from 'express';

const router = Router();

// ── In-memory stores ──────────────────────────────────────────────────────

const molecules: Map<string, any[]> = new Map();
const wallets: Map<string, { sovereigntyPool: number; performancePool: number; totalEarned: number }> = new Map();
const gameState: Map<string, Record<string, unknown>> = new Map();

let brainState = {
  spoons: 5,
  maxSpoons: 7,
  color: '#39FF14',
  coherence: 0.35,
  lastUpdate: new Date().toISOString(),
};

// ── GET /brain — current brain / spoon state ──────────────────────────────

router.get('/brain', (_req: Request, res: Response) => {
  res.json(brainState);
});

// ── PATCH /brain — update brain state fields ──────────────────────────────

router.patch('/brain', (req: Request, res: Response) => {
  brainState = { ...brainState, ...req.body, lastUpdate: new Date().toISOString() };
  res.json({ success: true, brain: brainState });
});

// ── POST /molecule — register a molecule ──────────────────────────────────

router.post('/molecule', (req: Request, res: Response) => {
  const { fingerprint, molecule } = req.body;
  if (!fingerprint) {
    res.status(400).json({ error: 'fingerprint required' });
    return;
  }
  const list = molecules.get(fingerprint) ?? [];
  list.push({ ...molecule, registeredAt: new Date().toISOString() });
  molecules.set(fingerprint, list);
  res.json({ success: true, message: 'Molecule registered', fingerprint });
});

// ── GET /wallet/:fingerprint — read wallet balances ───────────────────────

router.get('/wallet/:fingerprint', (req: Request, res: Response) => {
  const fp = req.params.fingerprint;
  const w = wallets.get(fp) ?? { sovereigntyPool: 0, performancePool: 0, totalEarned: 0 };
  res.json(w);
});

// ── POST /sync — push game state + wallet from Scope ──────────────────────

router.post('/sync', (req: Request, res: Response) => {
  const { fingerprint, state } = req.body;
  if (!fingerprint) {
    res.status(400).json({ error: 'fingerprint required' });
    return;
  }

  gameState.set(fingerprint, { ...(gameState.get(fingerprint) ?? {}), ...state });

  if (state?.wallet) {
    const love = Number(state.wallet.love) || 0;
    const stars = Number(state.wallet.stars) || 0;
    wallets.set(fingerprint, {
      sovereigntyPool: love,
      performancePool: stars,
      totalEarned: love + stars,
    });
  }

  res.json({ success: true, syncedAt: new Date().toISOString() });
});

// ── GET /state/:fingerprint — full game state ─────────────────────────────

router.get('/state/:fingerprint', (req: Request, res: Response) => {
  const fp = req.params.fingerprint;
  const s = gameState.get(fp) ?? {};
  res.json({ fingerprint: fp, state: s });
});

// ── GET /mesh — mesh status (molecule + wallet counts) ────────────────────

router.get('/mesh', (_req: Request, res: Response) => {
  res.json({
    molecules: molecules.size,
    wallets: wallets.size,
    gameStates: gameState.size,
    count: molecules.size + wallets.size + gameState.size,
    timestamp: new Date().toISOString(),
  });
});

export { router as shelterRoutes };
