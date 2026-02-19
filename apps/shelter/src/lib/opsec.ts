/**
 * OPSEC filter on AI output — redact any leak of children's or operator's real names.
 * Codename-only: Bash, Willow, Will. Never Sebastian, William, surnames, etc.
 */

const REDACT_PATTERNS: Array<{ pattern: RegExp; replacement: string }> = [
  { pattern: /\bSebastian\b/gi, replacement: "Bash" },
  { pattern: /\bWilliam\b/gi, replacement: "Will" },
  { pattern: /\bWill\s+Johnson\b/gi, replacement: "Will" },
  { pattern: /\bJohnson\b/gi, replacement: "[name]" },
];

/**
 * Redact real names from AI-generated text. Safe to call on any string.
 */
export function filterOPSEC(text: string): string {
  if (!text || typeof text !== "string") return text;
  let out = text;
  for (const { pattern, replacement } of REDACT_PATTERNS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}
