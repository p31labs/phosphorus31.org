/**
 * @p31/protocol — metabolism / spoon state (shared with game and Scope).
 * Three-state color aligns with Shelter brain state and GAS Brain.
 * Subset of NoiseLevel: GREEN | YELLOW | RED only.
 */

/** Spoon state color. GREEN = full, YELLOW = simplified, RED = rest. */
export type MetabolismColor = 'GREEN' | 'YELLOW' | 'RED';

/** Minimal brain state shape (Shelter GET/POST /api/game/brain/state). */
export interface BrainStateShape {
  spoons: number;
  maxSpoons: number;
  color: MetabolismColor;
}
