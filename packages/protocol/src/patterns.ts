/**
 * @p31/protocol — threat pattern names and weights.
 * Used by Buffer/Shelter voltage engine. Weights only; no regex (engine stays in app).
 */

export const THREAT_PATTERNS = [
  'URGENCY',
  'COERCION',
  'SHAME',
  'FALSE_AUTHORITY',
  'THREATS',
  'EMOTIONAL_LEVER',
] as const;

export type ThreatPattern = (typeof THREAT_PATTERNS)[number];

/** Pattern weights (0–10 voltage contribution ≈ confidence × weight). */
export const PATTERN_WEIGHTS: Record<ThreatPattern, number> = {
  URGENCY: 1.5,
  COERCION: 2.0,
  SHAME: 2.0,
  FALSE_AUTHORITY: 1.8,
  THREATS: 2.5,
  EMOTIONAL_LEVER: 1.5,
};
