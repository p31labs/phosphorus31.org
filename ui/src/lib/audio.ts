/**
 * Web Audio utilities for UI feedback.
 * Callers must respect accessibility (e.g. only play when audioFeedback is enabled).
 */

/**
 * P31 completion fanfare: three-note ascending arpeggio rooted in
 * the P31 nuclear frequency (172.35 Hz fundamental, octave, fifth).
 *
 * Each note layers a primary sine with a quiet, slightly-detuned
 * triangle oscillator (+3 Hz) to add harmonic warmth without
 * sounding synthetic. The result is celebratory but gentle.
 */
export function playCompletionFanfare(): void {
  if (typeof window === 'undefined' || !window.AudioContext) return;
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;

    const notes = [172.35, 344.7, 516.75];
    const noteDuration = 0.14;
    const noteGap = 0.07;
    const totalDuration = notes.length * (noteDuration + noteGap) + 0.2;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.24, now);
    masterGain.gain.exponentialRampToValueAtTime(0.01, now + totalDuration);
    masterGain.connect(ctx.destination);

    notes.forEach((freq, i) => {
      const start = now + i * (noteDuration + noteGap);

      // Primary tone (sine — pure fundamental)
      const primary = ctx.createOscillator();
      primary.type = 'sine';
      primary.frequency.setValueAtTime(freq, start);
      primary.connect(masterGain);
      primary.start(start);
      primary.stop(start + noteDuration);

      // Warmth layer (triangle, detuned +3 Hz, quieter)
      const warmGain = ctx.createGain();
      warmGain.gain.setValueAtTime(0.08, start);
      warmGain.gain.exponentialRampToValueAtTime(0.005, start + noteDuration);
      warmGain.connect(masterGain);

      const warm = ctx.createOscillator();
      warm.type = 'triangle';
      warm.frequency.setValueAtTime(freq + 3, start);
      warm.connect(warmGain);
      warm.start(start);
      warm.stop(start + noteDuration);
    });
  } catch {
    // Ignore if AudioContext fails (e.g. autoplay policy)
  }
}
