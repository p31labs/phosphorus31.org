import { SPOONS_MAX, SPOON_COSTS, HEARTBEATS } from "./constants";
import type { HeartbeatTier, SpoonState, HeartbeatConfig } from "./types";

/**
 * SpoonTracker — manages cognitive energy budget.
 *
 * Spoon Theory quantifies finite cognitive energy. Every action costs spoons.
 * When spoons drop below 25%, the system enters DEEP LOCK to protect the user.
 */
export class SpoonTracker {
  private _current: number;
  private _max: number;

  constructor(initial?: number, max?: number) {
    this._max = max ?? SPOONS_MAX;
    this._current = Math.min(initial ?? this._max, this._max);
  }

  /** Current spoon count */
  get current(): number {
    return this._current;
  }

  /** Maximum spoon capacity */
  get max(): number {
    return this._max;
  }

  /** Current percentage (0-100) */
  get percentage(): number {
    return (this._current / this._max) * 100;
  }

  /** Current heartbeat tier */
  get tier(): HeartbeatTier {
    const pct = this.percentage;
    if (pct >= HEARTBEATS.GREEN.minPercent) return "GREEN";
    if (pct >= HEARTBEATS.YELLOW.minPercent) return "YELLOW";
    if (pct >= HEARTBEATS.ORANGE.minPercent) return "ORANGE";
    return "RED";
  }

  /** Whether input should be locked (<25% spoons) */
  get locked(): boolean {
    return this.percentage < 25;
  }

  /** Get heartbeat configuration for current tier */
  get heartbeat(): HeartbeatConfig {
    return HEARTBEATS[this.tier];
  }

  /** Full state snapshot */
  get state(): SpoonState {
    return {
      current: this._current,
      max: this._max,
      tier: this.tier,
      locked: this.locked,
    };
  }

  /** Spend spoons on an action. Returns actual amount spent. */
  spend(cost: number): number {
    const actual = Math.min(cost, this._current);
    this._current = +Math.max(0, this._current - cost).toFixed(1);
    return actual;
  }

  /** Spend spoons for a named action */
  spendAction(action: keyof typeof SPOON_COSTS): number {
    return this.spend(SPOON_COSTS[action]);
  }

  /** Restore spoons (from rest, breathing, etc.) */
  restore(amount: number): void {
    this._current = +Math.min(this._max, this._current + amount).toFixed(1);
  }

  /** Set spoons to an exact value */
  set(value: number): void {
    this._current = +Math.max(0, Math.min(this._max, value)).toFixed(1);
  }

  /** Get the spoon cost for reading a message at a given voltage */
  static readCost(voltage: number): number {
    if (voltage <= 3) return SPOON_COSTS.readLow;
    if (voltage <= 6) return SPOON_COSTS.readMed;
    return SPOON_COSTS.readHigh;
  }
}
