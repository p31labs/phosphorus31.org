/**
 * Super Star Quest — step completion detection for Bonding game.
 * Uses atoms + players to determine which steps (1–4) are satisfied.
 * Step 1: Place golden P31 (P) together (2+ players, at least one P).
 * Step 2: Build Wonky Cap cluster (3+ WNC).
 * Step 3: Place a Tunnel Tube (1+ TNL).
 * Step 4: Super Star Molecule (at least one P, WNC, TNL, SPK).
 */

import type { BondingGame } from '../types/bonding';

export function getBirthdayQuestStepsSatisfied(game: BondingGame): number[] {
  const satisfied: number[] = [];
  const { atoms, players } = game;

  // Step 1: Golden atom (P31) placed together — collaborative (2+ players, at least one P)
  if (players.length >= 2 && atoms.some((a) => a.element === 'P')) {
    satisfied.push(1);
  }

  // Step 2: Wonky Cap cluster — 3 Wonky Cap atoms
  if (atoms.filter((a) => a.element === 'WNC').length >= 3) {
    satisfied.push(2);
  }

  // Step 3: Tunnel Tube — at least one
  if (atoms.some((a) => a.element === 'TNL')) {
    satisfied.push(3);
  }

  // Step 4: Super Star Molecule — P + Wonky Cap (WNC) + Tunnel Tube (TNL) + Sparkle Star (SPK)
  const hasP = atoms.some((a) => a.element === 'P');
  const hasWNC = atoms.some((a) => a.element === 'WNC');
  const hasTNL = atoms.some((a) => a.element === 'TNL');
  const hasSPK = atoms.some((a) => a.element === 'SPK');
  if (hasP && hasWNC && hasTNL && hasSPK) {
    satisfied.push(4);
  }

  return satisfied.sort((a, b) => a - b);
}

/** LOVE rewards per step (Star Bits). */
export const BIRTHDAY_STEP_LOVE = [10, 15, 15, 50] as const;
