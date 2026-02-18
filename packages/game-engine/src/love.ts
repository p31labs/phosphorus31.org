import type { LOVEState, MiningResult, XPAction } from "./types";
import { MINING_RATES } from "./constants";

const HEARTBEAT_MULTIPLIER: Record<string, number> = {
  green: 2.5,
  yellow: 1.0,
  orange: 0.5,
  red: 0.25,
};

/**
 * L.O.V.E. = Ledger of Ontological Volume and Entropy
 *
 * Tokens are mined by performing actions. Yield depends on:
 * 1. Base rate for the action type
 * 2. Heartbeat multiplier (GREEN=2.5x, YELLOW=1x, RED=0.5x)
 * 3. Quality factor
 */
export function mine(
  action: XPAction,
  heartbeat: "green" | "yellow" | "orange" | "red",
  quality: number = 1.0,
  timestamp: string
): MiningResult {
  const baseRate = MINING_RATES[action] ?? 10;
  const multiplier = HEARTBEAT_MULTIPLIER[heartbeat] ?? 1.0;
  const rawYield = baseRate * multiplier * quality;
  const yield_ = Math.floor(rawYield * 100) / 100;

  const proofInput = `${action}:${timestamp}:${yield_}`;
  const proof = simpleHash(proofInput);

  return {
    yield: yield_,
    multiplier,
    /** Local deduplication id only; not for cryptographic verification or server-side validation. */
    proof,
    reason: `${action} @ ${heartbeat} (${multiplier}x) = ${yield_} LOVE`,
  };
}

/**
 * Apply mining result to state.
 */
export function applyMining(state: LOVEState, result: MiningResult): LOVEState {
  return {
    balance: state.balance + result.yield,
    totalMined: state.totalMined + result.yield,
    miningRate: result.multiplier,
    lastMined: new Date().toISOString(),
  };
}

/**
 * Create initial LOVE state.
 */
export function createLOVEState(): LOVEState {
  return { balance: 0, totalMined: 0, miningRate: 1.0, lastMined: "" };
}

/**
 * Non-cryptographic hash for local deduplication only.
 * Do not use for verification or security; trivial to forge collisions.
 */
function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash)
    .toString(16)
    .padStart(8, "0");
}
