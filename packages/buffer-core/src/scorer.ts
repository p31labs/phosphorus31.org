import { WEIGHTS, GATES } from "./constants";
import {
  U_HIGH, U_MED, U_LOW,
  E_HIGH, E_MED, E_LOW,
  C_HIGH, C_MED, C_LOW,
  detectPassiveAggressive,
} from "./patterns";
import type { GateName, VoltageScore } from "./types";

type ExtraScorer = (text: string, score: number) => number;

/**
 * Scores text along a single axis using high/med/low keyword pattern matching.
 * Base score starts at 5 (neutral). High patterns push toward 10, low toward 1.
 */
export function scoreAxis(
  text: string,
  high: readonly RegExp[],
  med: readonly RegExp[],
  low: readonly RegExp[],
  extra?: ExtraScorer,
): number {
  let s = 5;
  let h = 0;
  let m = 0;
  let l = 0;

  for (const r of high) { if (r.test(text)) h++; }
  for (const r of med) { if (r.test(text)) m++; }
  for (const r of low) { if (r.test(text)) l++; }

  if (h > 0) s = Math.min(10, 7 + h);
  else if (m > 0) s = Math.min(7, 4 + m);
  else if (l > 0) s = Math.max(1, 3 - l);

  if (extra) s = extra(text, s);

  return Math.max(1, Math.min(10, s));
}

/** Extra cognitive scoring: word count and question count increase load */
function cognitiveExtra(text: string, s: number): number {
  const words = text.split(/\s+/).length;
  if (words > 300) s += 2;
  else if (words > 150) s += 1;

  const questions = (text.match(/\?/g) ?? []).length;
  if (questions > 3) s += 2;
  else if (questions > 1) s += 1;

  return s;
}

/** Extra emotional scoring: ALL CAPS words indicate shouting */
function emotionalExtra(text: string, s: number): number {
  const capsWords = (text.match(/\b[A-Z]{4,}\b/g) ?? []).length;
  if (capsWords > 2) s += 2;
  return s;
}

/** Determine gate from composite voltage */
function resolveGate(voltage: number): GateName {
  if (voltage >= 8) return "CRITICAL";
  if (voltage >= 6) return "RED";
  if (voltage >= 3) return "YELLOW";
  return "GREEN";
}

/**
 * Score a message across all three axes and compute composite voltage.
 *
 * voltage = (urgency × 0.4) + (emotional × 0.3) + (cognitive × 0.3)
 */
export function computeVoltage(text: string): VoltageScore {
  const urgency = scoreAxis(text, U_HIGH, U_MED, U_LOW);
  const emotional = scoreAxis(text, E_HIGH, E_MED, E_LOW, emotionalExtra);
  const cognitive = scoreAxis(text, C_HIGH, C_MED, C_LOW, cognitiveExtra);

  const raw = urgency * WEIGHTS.urgency + emotional * WEIGHTS.emotional + cognitive * WEIGHTS.cognitive;
  const voltage = +raw.toFixed(1);
  const gate = resolveGate(voltage);
  const passiveAggressive = detectPassiveAggressive(text);

  return { urgency, emotional, cognitive, voltage, gate, passiveAggressive };
}

/** Get the gate configuration for a voltage score */
export function getGateConfig(gate: GateName): typeof GATES[GateName] {
  return GATES[gate];
}
