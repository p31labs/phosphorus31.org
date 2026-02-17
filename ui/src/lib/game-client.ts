/**
 * P31 Game Client — React-side wrapper for @p31/game-integration
 * Genesis: initGameClient + ShelterBridge.registerMolecule. Mesh: pull metabolism, wallet, directory.
 * When Shelter is down, calls no-op; molecule exists locally.
 */

import {
  initGameClient,
  ShelterBridge,
  getGameMode,
  GENESIS_TRANSACTIONS,
  GENESIS_LOVE_TOTAL,
  type P31Molecule,
  type GameClient,
  type GameBehavior,
  type MetabolismState,
} from '@p31/game-integration';

const SHELTER_URL = import.meta.env.VITE_SHELTER_URL || '';
const SHELTER_KEY = import.meta.env.VITE_SHELTER_KEY || '';

let bridge: ShelterBridge | null = null;
let client: GameClient | null = null;

export function getShelterBridge(): ShelterBridge | null {
  if (!SHELTER_URL) return null;
  if (!bridge) {
    bridge = new ShelterBridge(SHELTER_URL, SHELTER_KEY);
  }
  return bridge;
}

/** Build P31Molecule from stored shape (e.g. from window.storage) for genesis/sync. */
export function storedToP31Molecule(stored: {
  fingerprint: string;
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
  created: string;
  covenantSig: string;
  covenantAt: string;
  dome: { name: string; color: string; intent: string };
  coherence: number;
  metabolism?: { spoons: number; maxSpoons: number; color: string; lastSync: string };
}): P31Molecule {
  const now = stored.created || new Date().toISOString();
  const met = stored.metabolism ?? { spoons: 12, maxSpoons: 12, color: 'GREEN' as const, lastSync: now };
  return {
    ...stored,
    player: {
      familyMemberId: stored.fingerprint,
      displayName: stored.dome.name,
      tier: 'seedling',
      xp: 0,
      totalLoveEarned: GENESIS_LOVE_TOTAL,
      completedChallenges: ['genesis_resonance'],
      badges: ['first_resonance'],
      buildStreak: 0,
      structures: ['dome_' + stored.fingerprint],
      coherence: stored.coherence,
    },
    wallet: {
      sovereigntyPool: 25.0,
      performancePool: 25.0,
      totalEarned: GENESIS_LOVE_TOTAL,
      transactions: GENESIS_TRANSACTIONS.map((tx) => ({
        type: tx.type,
        love: tx.love,
        desc: tx.desc,
        timestamp: now,
        memberId: stored.fingerprint,
      })),
    },
    dome: {
      ...stored.dome,
      structureId: 'dome_' + stored.fingerprint,
    },
    metabolism: {
      spoons: met.spoons,
      maxSpoons: met.maxSpoons,
      color: (met.color === 'YELLOW' ? 'YELLOW' : met.color === 'RED' ? 'RED' : 'GREEN') as 'GREEN' | 'YELLOW' | 'RED',
      lastSync: met.lastSync || now,
    },
  };
}

/**
 * Called once after molecule formation ceremony completes.
 * Three calls: initGameClient → registerMolecule → return client.
 */
export async function genesis(molecule: P31Molecule): Promise<GameClient> {
  client = initGameClient(molecule);

  const b = getShelterBridge();
  if (b) {
    try {
      await b.registerMolecule(molecule);
    } catch (e) {
      console.warn('Shelter registration deferred:', e);
    }
  }

  return client;
}

/**
 * Pull latest metabolism from Shelter (what GAS Brain pushed).
 */
export async function pullMetabolism(): Promise<GameBehavior | null> {
  const b = getShelterBridge();
  if (!b) return null;
  try {
    const brainState = await b.getBrainState();
    if (brainState) {
      const metabolism: MetabolismState = {
        currentSpoons: brainState.spoons,
        maxSpoons: brainState.maxSpoons,
        color: brainState.color as 'GREEN' | 'YELLOW' | 'RED',
        recoveryRate: 0.1,
        lastSync: new Date().toISOString(),
      };
      return getGameMode(metabolism);
    }
  } catch (e) {
    console.warn('Metabolism pull failed:', e);
  }
  return null;
}

/**
 * Pull mesh directory from Shelter.
 */
export async function pullMeshDirectory(): Promise<Array<{ fingerprint: string; dome_name: string; dome_color: string; dome_intent: string; coherence: number; created_at: string }>> {
  const b = getShelterBridge();
  if (!b) return [];
  try {
    return await b.getMeshDirectory();
  } catch (e) {
    return [];
  }
}

/**
 * Pull LOVE wallet balance from Shelter.
 */
export async function pullWallet(fingerprint: string): Promise<{ sovereigntyPool: number; performancePool: number; totalEarned: number; transactionCount: number } | null> {
  const b = getShelterBridge();
  if (!b) return null;
  try {
    return await b.getWalletBalance(fingerprint);
  } catch (e) {
    return null;
  }
}

/**
 * Sync game state back to Shelter (after building, challenges, etc.)
 */
export async function syncState(state: Partial<GameClient>): Promise<void> {
  const b = getShelterBridge();
  if (!b) return;
  try {
    await b.syncGameState(state);
  } catch (e) {
    console.warn('Game sync deferred:', e);
  }
}

export function getClient(): GameClient | null {
  return client;
}
