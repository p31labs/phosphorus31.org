/**
 * Haptic Sympathy — make the phone physically pulse.
 * Sensory regulation tool. Proves haptic competence without Node One hardware.
 * All patterns gated behind user preference toggle.
 */

export const haptics = {
  // Heartbeat — resting pulse (60 BPM equivalent)
  heartbeat: () => navigator.vibrate?.([120, 880]),

  // Breath cycle — matches breathing pacer
  inhale: () => navigator.vibrate?.([50, 50, 50, 50, 50, 50, 50, 50]),
  exhale: () => navigator.vibrate?.([30, 70, 30, 70, 30, 70, 30, 70]),

  // Interaction feedback
  tap: () => navigator.vibrate?.([10]),
  success: () => navigator.vibrate?.([50, 30, 50]),
  warning: () => navigator.vibrate?.([100, 50, 100, 50, 100]),

  // Sprout signals
  ok: () => navigator.vibrate?.([30]),
  help: () => navigator.vibrate?.([100, 50, 100, 50, 100]),
  love: () => navigator.vibrate?.([50, 30, 80, 30, 50]),
  think: () => navigator.vibrate?.([40, 60, 40]),

  // Anchor — special pattern (warm pulse)
  anchor: () => navigator.vibrate?.([80, 40, 80, 40, 120]),

  // Molecule formation — celebration
  formation: () => navigator.vibrate?.([50, 30, 50, 30, 50, 30, 100, 50, 200]),

  // Check if available
  available: () => typeof navigator !== 'undefined' && 'vibrate' in navigator,
} as const;

const HAPTICS_KEY = 'p31:haptics';

/** Check if haptics are enabled (default: true on mobile, false on desktop) */
export function hapticsEnabled(): boolean {
  try {
    const stored = localStorage.getItem(HAPTICS_KEY);
    if (stored !== null) return stored === 'true';
    // Default: enabled on touch devices
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  } catch {
    return false;
  }
}

/** Toggle haptics preference */
export function setHapticsEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(HAPTICS_KEY, String(enabled));
  } catch {
    // Storage unavailable
  }
}

/** Gated haptic — only fires if user has haptics enabled */
export function haptic(pattern: keyof typeof haptics): void {
  if (pattern === 'available') return;
  if (!hapticsEnabled()) return;
  if (!haptics.available()) return;
  haptics[pattern]();
}
