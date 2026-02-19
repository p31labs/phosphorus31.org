/**
 * 14-pattern heuristic scoring outgoing messages for people-pleasing (fawn response).
 * Sovereignty score = 10 minus fawn score. Review gate at score > 4.
 */

export const FAWN_REVIEW_THRESHOLD = 4;

export interface FawnResult {
  /** Fawn score 0–10 (higher = more people-pleasing) */
  score: number;
  /** Sovereignty score 0–10 (10 - score) */
  sovereignty: number;
  /** Pattern keys that fired */
  triggers: string[];
}

type Pattern = { key: string; test: RegExp | ((text: string) => boolean) };

const PATTERNS: Pattern[] = [
  { key: "unnecessary_apology", test: /\b(sorry|apologize|apologies)\s+(for|that|if)\b/i },
  { key: "permission_seeking", test: /\b(is it ok|is that ok|would it be ok|can i\s+please|may i)\b/i },
  { key: "self_diminishing", test: /\b(just\s+my\s+opinion|i\s+might\s+be\s+wrong|probably\s+stupid)\b/i },
  { key: "hedging", test: /\b(kind of|sort of|maybe|perhaps|i\s+guess)\b/i },
  { key: "over_qualifying", test: /\b(i\s+don'?t\s+mean\s+to\s+but|not\s+to\s+be\s+\w+\s+but)\b/i },
  { key: "minimizing_self", test: /\b(only\s+me|just\s+little\s+old\s+me|no\s+one\s+important)\b/i },
  { key: "excessive_thanks", test: /\b(thanks\s+so\s+much\s+for\s+everything|thank\s+you\s+so\s+much\s+for)\b/i },
  { key: "deference", test: /\b(as\s+you\s+know|you\s+probably\s+know\s+best|whatever\s+you\s+think)\b/i },
  { key: "softening_demand", test: /\b(i\s+was\s+just\s+wondering|if\s+you\s+don'?t\s+mind)\b/i },
  { key: "filler_apology", test: /\b(sorry\s+to\s+bother|sorry\s+in\s+advance)\b/i },
  { key: "undermining", test: /\b(not\s+sure\s+if\s+this\s+matters|might\s+not\s+be\s+relevant)\b/i },
  { key: "excessive_justification", test: /\b(i\s+only\s+say\s+because|the\s+reason\s+i\s+ask)\b/i },
  { key: "downplaying", test: /\b(no\s+big\s+deal|it'?s\s+fine|whatever\s+works)\b/i },
  { key: "seeking_reassurance", test: /\b(does\s+that\s+make\s+sense|hope\s+that'?s\s+ok)\b/i },
];

function runPattern(text: string, p: Pattern): boolean {
  if (typeof p.test === "function") return p.test(text);
  return p.test.test(text);
}

/**
 * Score outgoing message for fawn (people-pleasing) patterns.
 * Sovereignty = 10 - score. Triggers review when score > FAWN_REVIEW_THRESHOLD.
 */
export function scoreFawn(text: string): FawnResult {
  const trimmed = text.trim();
  const triggers: string[] = [];
  for (const p of PATTERNS) {
    if (runPattern(trimmed, p)) triggers.push(p.key);
  }
  const score = Math.min(10, triggers.length * 2);
  const sovereignty = 10 - score;
  return { score, sovereignty, triggers };
}

/** True when sovereignty check / review gate should be shown (fawn score > 4). */
export function shouldShowFawnReview(result: FawnResult): boolean {
  return result.score > FAWN_REVIEW_THRESHOLD;
}
