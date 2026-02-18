import { create } from "zustand";
import { SpoonTracker, type HeartbeatTier } from "@p31labs/buffer-core";

interface SpoonState {
  tracker: SpoonTracker;
  current: number;
  max: number;
  tier: HeartbeatTier;
  locked: boolean;

  calibrate: (spoons: number) => void;
  spend: (cost: number) => void;
  recover: (amount: number) => void;
  sync: () => void;
}

export const useSpoonStore = create<SpoonState>((set, get) => {
  const tracker = new SpoonTracker(8, 12);

  return {
    tracker,
    current: tracker.current,
    max: tracker.max,
    tier: tracker.tier,
    locked: tracker.locked,

    calibrate: (spoons: number) => {
      const { tracker } = get();
      tracker.set(spoons);
      set({ current: tracker.current, tier: tracker.tier, locked: tracker.locked });
    },

    spend: (cost: number) => {
      const { tracker } = get();
      tracker.spend(cost);
      set({ current: tracker.current, tier: tracker.tier, locked: tracker.locked });
    },

    recover: (amount: number) => {
      const { tracker } = get();
      tracker.restore(amount);
      set({ current: tracker.current, tier: tracker.tier, locked: tracker.locked });
    },

    sync: () => {
      const { tracker } = get();
      set({ current: tracker.current, tier: tracker.tier, locked: tracker.locked });
    },
  };
});
