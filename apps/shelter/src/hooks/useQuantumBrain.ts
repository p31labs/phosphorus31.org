import { useMemo } from "react";
import { useShelterStore } from "@/stores/shelter-store";
import { useSpoonStore } from "@/stores/spoon-store";
import { computeBrainState, type BrainState } from "@/lib/quantum-brain";

/**
 * Reactive Quantum Brain state. Recomputes when player, spoons, or tier change.
 */
export function useQuantumBrain(): BrainState {
  const { player } = useShelterStore();
  const { current, max, tier } = useSpoonStore();

  return useMemo(
    () => computeBrainState(player, current, max, tier),
    [player, current, max, tier],
  );
}
