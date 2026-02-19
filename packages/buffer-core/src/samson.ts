import { SAMSON } from "./constants";
import type { SamsonState, PTerm, DriftTerm, BurnoutTerm } from "./types";

/**
 * P31 Governor PID Controller — governs system behavior toward the Home Frequency.
 *
 * dH/dt = -k(H - 0.35)
 *
 * P-term: Entropy detection → adjust AI temperature
 * I-term: Drift detection → inject lateral prompts or surface warnings
 * D-term: Burnout prediction → throttle load
 *
 * Pure state machine — no React, no side effects. Call update() with new data.
 */
export class SamsonV2Controller {
  private _processedCount = 0;
  private _deferredCount = 0;
  private _history: number[] = [];
  private _spoonPercentage = 100;

  /** Harmonic ratio H = processed / (processed + deferred). Defaults to target. */
  get H(): number {
    const total = this._processedCount + this._deferredCount;
    if (total === 0) return SAMSON.TARGET_H;
    return this._processedCount / total;
  }

  /** Error from target: H - π/9 */
  get error(): number {
    return this.H - SAMSON.TARGET_H;
  }

  /** P-term: immediate deviation from attractor */
  get pTerm(): PTerm {
    if (Math.abs(this.error) < SAMSON.EPSILON) return "stable";
    if (this.error > 0) return "over-actualized";
    return "under-actualized";
  }

  /** I-term: accumulated drift from voltage history */
  get drift(): DriftTerm {
    if (this._history.length < 3) return "nominal";
    const recent = this._history.slice(-5);
    const avg = recent.reduce((a, b) => a + b, 0) / recent.length;
    if (avg > 6) return "escalating";

    const isLooping = recent.every((v, i, a) =>
      i === 0 || Math.abs(v - (a[i - 1] ?? 0)) < 0.5,
    );
    if (isLooping) return "looping";

    return "nominal";
  }

  /** D-term: burnout velocity from spoon depletion */
  get burnout(): BurnoutTerm {
    if (this._spoonPercentage < 15) return "critical";
    if (this._spoonPercentage < 30) return "warning";
    return "ok";
  }

  /** Recommended AI temperature based on PID state */
  get aiTemp(): number {
    let t = SAMSON.TEMP_DEFAULT;

    if (this.pTerm === "over-actualized") t += 0.15;
    if (this.pTerm === "under-actualized") t -= 0.15;
    if (this.drift === "looping") t += 0.2;
    if (this.drift === "escalating") t -= 0.1;
    if (this.burnout === "critical") t -= 0.2;

    return +Math.max(SAMSON.TEMP_MIN, Math.min(SAMSON.TEMP_MAX, t)).toFixed(2);
  }

  /** Z-Score leakage gate — statistical distance from attractor */
  get zScore(): number {
    if (this._history.length < 2) return 0;
    const mean = this._history.reduce((a, b) => a + b, 0) / this._history.length;
    const variance = this._history.reduce((a, b) => a + (b - mean) ** 2, 0) / this._history.length;
    const std = Math.sqrt(variance) || 1;
    return +((this.H - SAMSON.TARGET_H) / (std / Math.sqrt(this._history.length))).toFixed(2);
  }

  /** Full state snapshot */
  get state(): SamsonState {
    return {
      H: this.H,
      error: this.error,
      pTerm: this.pTerm,
      drift: this.drift,
      burnout: this.burnout,
      aiTemp: this.aiTemp,
      zScore: this.zScore,
    };
  }

  /** Record a processed message */
  recordProcessed(): void {
    this._processedCount++;
  }

  /** Record a deferred message */
  recordDeferred(): void {
    this._deferredCount++;
  }

  /** Add a voltage score to history */
  addScore(voltage: number): void {
    this._history.push(voltage);
    if (this._history.length > SAMSON.HISTORY_SIZE) {
      this._history = this._history.slice(-SAMSON.HISTORY_SIZE);
    }
  }

  /** Update spoon percentage for burnout calculation */
  updateSpoons(current: number, max: number): void {
    this._spoonPercentage = max > 0 ? (current / max) * 100 : 0;
  }

  /** Load state from serialized data */
  load(data: {
    processedCount?: number;
    deferredCount?: number;
    history?: number[];
    spoonPercentage?: number;
  }): void {
    this._processedCount = data.processedCount ?? 0;
    this._deferredCount = data.deferredCount ?? 0;
    this._history = data.history ?? [];
    this._spoonPercentage = data.spoonPercentage ?? 100;
  }

  /** Serialize state for persistence */
  serialize(): {
    processedCount: number;
    deferredCount: number;
    history: number[];
    spoonPercentage: number;
  } {
    return {
      processedCount: this._processedCount,
      deferredCount: this._deferredCount,
      history: [...this._history],
      spoonPercentage: this._spoonPercentage,
    };
  }
}
