/**
 * Haptic Feedback
 * Provides haptic/vibration feedback for user interactions
 */

/**
 * Trigger a haptic pulse
 * @param intensity - 'light' | 'medium' | 'strong'
 */
export function triggerHapticPulse(intensity: 'light' | 'medium' | 'strong' = 'medium'): void {
  // Check if Vibration API is available
  if ('vibrate' in navigator) {
    const patterns: Record<string, number | number[]> = {
      light: 10,
      medium: 50,
      strong: [50, 30, 50], // Pattern: vibrate, pause, vibrate
    };

    navigator.vibrate(patterns[intensity]);
  }

  // Fallback: Could trigger audio cue or visual feedback
  console.log(`[Haptic] ${intensity} pulse triggered`);
}

/**
 * Trigger vagus nerve stimulation signal
 * @param duration - Duration in seconds
 */
export async function triggerVagusSignal(duration: number): Promise<void> {
  // This would integrate with hardware (NODE ONE) for actual vagus stimulation
  // For now, use haptic feedback as a proxy
  triggerHapticPulse('light');

  // Could also trigger breathing guidance or other somatic interventions
  console.log(`[Vagus Signal] Triggered for ${duration}s`);

  return Promise.resolve();
}
