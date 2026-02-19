/**
 * P31 Quantum Brain — Coherence computation from game state.
 *
 * The brain's "coherence" is a Fisher-Escolà Q-factor: a Beta-distributed
 * metric where 1 = flow and 0 = drift. Computed from five signals:
 *
 *   1. Streak health — how many streaks are alive
 *   2. Energy level — spoons / maxSpoons
 *   3. Scoring momentum — recent message throughput
 *   4. Quest engagement — quest completion rate
 *   5. L.O.V.E. flow — recent mining activity
 *
 * The coherence score feeds back into the game-engine as a quality multiplier,
 * creating a virtuous loop: consistency → higher coherence → better XP yields.
 */

import type { PlayerState } from "@p31labs/game-engine";
import { isStreakAlive, toUTCDateString } from "@p31labs/game-engine";
import type { HeartbeatTier } from "@p31labs/buffer-core";

export interface BrainState {
  coherence: number;
  phase: "drift" | "listening" | "settling" | "flow";
  signals: {
    streakHealth: number;
    energyLevel: number;
    scoringMomentum: number;
    questEngagement: number;
    loveFlow: number;
  };
  stability: number;
  drift: number;
}

const HOME_FREQUENCY = 0.35;

const PHASE_THRESHOLDS = {
  drift: 0.15,
  listening: 0.35,
  settling: 0.6,
} as const;

/**
 * Compute the Quantum Brain state from player data and spoon levels.
 * Pure function — no side effects.
 */
export function computeBrainState(
  player: PlayerState,
  spoons: number,
  maxSpoons: number,
  tier: HeartbeatTier,
): BrainState {
  const today = toUTCDateString(new Date().toISOString());

  // Signal 1: Streak health (0-1) — how many of the 5 streaks are alive
  const streakKeys = Object.keys(player.streaks) as (keyof typeof player.streaks)[];
  const aliveCount = streakKeys.filter((k) => isStreakAlive(player.streaks[k], today)).length;
  const streakHealth = streakKeys.length > 0 ? aliveCount / streakKeys.length : 0;

  // Signal 2: Energy level (0-1) — current spoons / max
  const energyLevel = maxSpoons > 0 ? Math.min(1, spoons / maxSpoons) : 0;

  // Signal 3: Scoring momentum (0-1) — messages scored, capped at 10 for full signal
  const scoringMomentum = Math.min(1, player.messagesScored / 10);

  // Signal 4: Quest engagement (0-1) — quests completed, capped at 5 for full signal
  const questEngagement = Math.min(1, player.questsCompleted / 5);

  // Signal 5: L.O.V.E. flow (0-1) — recent mining activity, capped at 100
  const loveFlow = Math.min(1, player.love.totalMined / 100);

  // Weighted coherence (Fisher-Escolà Q-factor analog)
  const weights = {
    streakHealth: 0.30,
    energyLevel: 0.25,
    scoringMomentum: 0.20,
    questEngagement: 0.15,
    loveFlow: 0.10,
  };

  const rawCoherence =
    streakHealth * weights.streakHealth +
    energyLevel * weights.energyLevel +
    scoringMomentum * weights.scoringMomentum +
    questEngagement * weights.questEngagement +
    loveFlow * weights.loveFlow;

  // Tier damping — RED state reduces coherence
  const tierMultiplier = tier === "RED" ? 0.5 : tier === "ORANGE" ? 0.75 : tier === "YELLOW" ? 0.9 : 1.0;
  const coherence = Math.max(0.05, Math.min(0.95, rawCoherence * tierMultiplier));

  // Phase classification
  let phase: BrainState["phase"];
  if (coherence < PHASE_THRESHOLDS.drift) phase = "drift";
  else if (coherence < PHASE_THRESHOLDS.listening) phase = "listening";
  else if (coherence < PHASE_THRESHOLDS.settling) phase = "settling";
  else phase = "flow";

  // Stability = how close to home frequency
  const drift = Math.abs(coherence - HOME_FREQUENCY);
  const stability = 1 - Math.min(1, drift / HOME_FREQUENCY);

  return {
    coherence,
    phase,
    signals: { streakHealth, energyLevel, scoringMomentum, questEngagement, loveFlow },
    stability,
    drift,
  };
}

/**
 * Map coherence to a color for visualization.
 */
export function coherenceColor(c: number): string {
  if (c >= 0.6) return "#39FF14";
  if (c >= 0.35) return "#06B6D4";
  if (c >= 0.15) return "#F59E0B";
  return "#EF4444";
}

/**
 * Map phase to a human-readable label.
 */
export function phaseLabel(phase: BrainState["phase"]): string {
  switch (phase) {
    case "flow": return "Flow State";
    case "settling": return "Settling In";
    case "listening": return "Listening Phase";
    case "drift": return "Drifting";
  }
}
