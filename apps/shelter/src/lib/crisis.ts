/**
 * Three-level crisis detection via regex. No AI involved — runs BEFORE any API call.
 * Level 3 (explicit) and Level 2 (hopelessness) short-circuit to 988 resources.
 * Level 0 passes through. The 60-second buffer does NOT apply to crisis. Non-negotiable.
 */

export type CrisisLevel = 0 | 1 | 2 | 3;

/** Level 3: Explicit self-harm or suicide intent */
const L3_PATTERNS = [
  /\b(kill|ending|end\s+my)\s+(myself|my\s+life)\b/i,
  /\b(suicide|suicidal)\b/i,
  /\b(take\s+my\s+life)\b/i,
  /\b(going\s+to\s+die|want\s+to\s+die)\s+(tonight|now)\b/i,
  /\b(cut\s+my\s+wrist|hang\s+myself|overdose)\b/i,
  /\b(no\s+reason\s+to\s+live)\b/i,
];

/** Level 2: Hopelessness, ideation, or strong distress without explicit plan */
const L2_PATTERNS = [
  /\b(can'?t\s+go\s+on|can\'t\s+do\s+this\s+anymore)\b/i,
  /\b(nobody\s+cares|no\s+one\s+cares)\b/i,
  /\b(better\s+off\s+without\s+me)\b/i,
  /\b(hopeless|no\s+point\s+in)\b/i,
  /\b(988|lifeline)\b/i,
  /\b(don'?t\s+want\s+to\s+be\s+here)\b/i,
  /\b(thoughts\s+of\s+(ending|hurting))\b/i,
  /\b(self[- ]harm|self\s*harm)\b/i,
];

/** Level 1: Work/stress context that could be confused (e.g. "kill this project") — pass but flag for softer response */
const L1_SAFE_WORK = [
  /\b(kill\s+(this|the)\s+(project|meeting|task|idea))\b/i,
  /\b(die\s+(of|from)\s+(boredom|embarrassment))\b/i,
  /\b(so\s+tired\s+I\s+could\s+die)\b/i,
];

function matchesAny(text: string, patterns: RegExp[]): boolean {
  return patterns.some((p) => p.test(text));
}

/**
 * Returns crisis level: 3 = explicit, 2 = hopelessness/ideation, 1 = work/safe context, 0 = none.
 * Level 2 or 3 must short-circuit to 988 — no API call.
 */
export function getCrisisLevel(text: string): CrisisLevel {
  const t = text.trim();
  if (!t.length) return 0;
  if (matchesAny(t, L3_PATTERNS)) return 3;
  if (matchesAny(t, L2_PATTERNS)) return 2;
  if (matchesAny(t, L1_SAFE_WORK)) return 1;
  return 0;
}

/** Message shown when Level 2 or 3 detected. No AI. No delay. */
export const CRISIS_988_MESSAGE = `I'm not able to help with this in a way that's safe. Please reach out right now:

988 — Suicide & Crisis Lifeline (US)
Call or text 988, or chat 988lifeline.org

You matter. The mesh holds. Reach out.`;
