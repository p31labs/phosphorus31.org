/**
 * Phase transition — freeze/thaw for bonding physics.
 * Lock physics bodies into rigid geometry (freeze); release for editing (thaw).
 * Full implementation can be adopted from Claude's game-core when merged.
 */

export type PhaseState = "fluid" | "frozen";

let currentPhase: PhaseState = "fluid";

/**
 * Freeze — lock current state into a single rigid geometry (phase transition).
 */
export function freeze(): void {
  currentPhase = "frozen";
}

/**
 * Thaw — release back to fluid/editable state.
 */
export function thaw(): void {
  currentPhase = "fluid";
}

/**
 * Current phase state.
 */
export function getPhase(): PhaseState {
  return currentPhase;
}

/**
 * Reset phase to fluid (e.g. for tests or new session).
 */
export function resetPhase(): void {
  currentPhase = "fluid";
}
