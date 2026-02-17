/**
 * P31 Game Integration — Initialize GameClient from a formed molecule
 * Called after Quantum Hello World completes (conversation → covenant → formation → dome).
 */

import type { P31Molecule, GameClient, WalletState, MetabolismState, MeshPlayer } from './types/molecule';
import { GENESIS_CHALLENGE, SEED_CHALLENGES, GENESIS_TRANSACTIONS, GENESIS_LOVE_TOTAL } from './genesis';
import { domeToStructure } from './mappers';

/**
 * Build initial GameClient from a newly formed molecule.
 * Call after dome creation; mesh players loaded separately from Shelter/storage.
 */
export function initGameClient(molecule: P31Molecule, meshPlayers: MeshPlayer[] = []): GameClient {
  const player = {
    familyMemberId: molecule.fingerprint,
    completedChallenges: ['genesis_resonance'],
    currentChallenge: undefined,
    totalLoveEarned: GENESIS_LOVE_TOTAL,
    badges: ['first_resonance'],
    buildStreak: 0,
    structures: ['dome_' + molecule.fingerprint],
    tier: 'seedling' as const,
    xp: 0,
  };

  const wallet: WalletState = {
    sovereigntyPool: 25.0,
    performancePool: 25.0,
    totalEarned: GENESIS_LOVE_TOTAL,
    transactions: GENESIS_TRANSACTIONS.map((tx) => ({
      type: tx.type,
      love: tx.love,
      desc: tx.desc,
      timestamp: new Date().toISOString(),
      memberId: molecule.fingerprint,
    })),
  };

  const metabolism: MetabolismState = {
    currentSpoons: molecule.metabolism.spoons,
    maxSpoons: molecule.metabolism.maxSpoons,
    color: molecule.metabolism.color,
    recoveryRate: 0.1,
    lastSync: molecule.metabolism.lastSync || null,
  };

  const domeStructure = domeToStructure(molecule);
  const challenges = [GENESIS_CHALLENGE, ...SEED_CHALLENGES];

  return {
    player,
    wallet,
    metabolism,
    structures: [domeStructure],
    challenges,
    activeChallenge: null,
    meshPlayers,
  };
}
