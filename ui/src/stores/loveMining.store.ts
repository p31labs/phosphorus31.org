/**
 * L.O.V.E. mining store for the Scope
 * Build molecules, mine L.O.V.E. Persists to localStorage.
 * After each mine action, fire-and-forget syncs wallet to Centaur via ShelterBridge.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createLOVEState,
  mine,
  applyMining,
  type LOVEState,
} from "@p31labs/game-engine";
import { getShelterBridge } from "../lib/game-client";

type Heartbeat = "green" | "yellow" | "orange" | "red";

/** Fixed Star Bits (LOVE) per Birthday Quest step. */
const BIRTHDAY_STEP_LOVE = [10, 15, 15, 50] as const;

function getFingerprint(): string {
  try {
    const raw = localStorage.getItem("p31:molecule");
    if (raw) {
      const mol = JSON.parse(raw);
      if (mol.fingerprint) return mol.fingerprint;
    }
  } catch { /* ignore */ }
  return "local";
}

function syncWalletToCentaur(newLove: LOVEState): void {
  const bridge = getShelterBridge();
  if (!bridge) return;
  const fp = getFingerprint();
  bridge.syncState(fp, { wallet: { love: newLove.balance, stars: newLove.totalMined } }).catch(
    (e) => console.warn("[loveMining] sync deferred:", e)
  );
}

interface LoveMiningState {
  love: LOVEState;
  lastMinedAmount: number;
  mineMoleculeBuilt: (heartbeat?: Heartbeat, quality?: number) => number;
  /** Award fixed LOVE for a completed Birthday Quest step (1-4). */
  mineBirthdayStep: (step: 1 | 2 | 3 | 4) => number;
  reset: () => void;
}

export const useLoveMiningStore = create<LoveMiningState>()(
  persist(
    (set) => ({
      love: createLOVEState(),
      lastMinedAmount: 0,

      mineMoleculeBuilt: (heartbeat: Heartbeat = "green", quality = 1) => {
        const timestamp = new Date().toISOString();
        const result = mine("molecule_built", heartbeat, quality, timestamp);
        let newLove: LOVEState | undefined;
        set((state) => {
          newLove = applyMining(state.love, result);
          return { love: newLove, lastMinedAmount: result.yield };
        });
        if (newLove) syncWalletToCentaur(newLove);
        return result.yield;
      },

      mineBirthdayStep: (step: 1 | 2 | 3 | 4) => {
        const amount = BIRTHDAY_STEP_LOVE[step - 1];
        const result = {
          yield: amount,
          multiplier: 1,
          proof: "",
          reason: `birthday_quest_step_${step} = ${amount} Star Bits`,
        };
        let newLove: LOVEState | undefined;
        set((state) => {
          newLove = applyMining(state.love, result);
          return { love: newLove, lastMinedAmount: amount };
        });
        if (newLove) syncWalletToCentaur(newLove);
        return amount;
      },

      reset: () =>
        set({ love: createLOVEState(), lastMinedAmount: 0 }),
    }),
    { name: "p31-love-mining", version: 1 }
  )
);
