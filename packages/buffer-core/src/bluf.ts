import type { BLUFResult } from "./types";

const ACTION_PATTERN = /\b(need|please|can you|could you|should|must|send|submit|review|update|confirm|decide|approve|call|schedule|respond)\b/i;

/**
 * Extract BLUF (Bottom Line Up Front) from a message.
 *
 * Identifies action items and questions, then produces a 1-2 sentence summary
 * prioritizing actionable content over informational content.
 */
export function extractBLUF(text: string): BLUFResult {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  const actions = sentences.filter((s) => ACTION_PATTERN.test(s));
  const questions = sentences.filter((s) => /\?/.test(s));

  const prioritized = actions.length > 0
    ? actions
    : questions.length > 0
      ? questions
      : sentences;

  const summary = prioritized
    .slice(0, 2)
    .map((s) => s.trim())
    .join(" ");

  return {
    summary,
    actions: actions.map((s) => s.trim()),
    questionCount: questions.length,
    sentenceCount: sentences.length,
  };
}
