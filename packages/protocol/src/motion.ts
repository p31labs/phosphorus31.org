/**
 * P31 Motion System — single source of truth for all animation.
 * Motion communicates state; decorative motion respects prefers-reduced-motion.
 * Use these values everywhere. No arbitrary durations or easings.
 */

export const motion = {
  // Durations (use with CSS var(--p31-motion-*) or directly in JS)
  instant: '0ms', // state changes when prefers-reduced-motion
  fast: '120ms', // micro-interactions: button press, toggle
  normal: '200ms', // standard transitions: hover, focus, panel open
  slow: '400ms', // emphasis: triage mode, voltage change, page transition
  breathe: '3000ms', // ambient: molecule pulse, idle glow, heartbeat

  // Easings
  ease: 'cubic-bezier(0.4, 0, 0.2, 1)', // standard
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)', // entering
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)', // exiting
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // bouncy (buttons, badges)

  // Named animations (documentation — implement via CSS/JS using durations + easings above)
  pulse: 'scale(1) → scale(0.97) → scale(1)',
  glowPulse: 'opacity 0.6 → 1.0 → 0.6 over breathe duration',
  slideIn: 'translateY(8px) + opacity(0) → translateY(0) + opacity(1)',
  fadeIn: 'opacity(0) → opacity(1) over normal',
} as const;

export type MotionDuration = keyof Pick<
  typeof motion,
  'instant' | 'fast' | 'normal' | 'slow' | 'breathe'
>;
export type MotionEasing = keyof Pick<
  typeof motion,
  'ease' | 'easeIn' | 'easeOut' | 'spring'
>;

/** Transition string for functional UI: e.g. "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)" */
export function transition(
  property: string,
  duration: MotionDuration = 'normal',
  easing: MotionEasing = 'ease'
): string {
  return `${property} ${motion[duration]} ${motion[easing]}`;
}
