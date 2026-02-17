/**
 * Cuckoo chirp — generative melody based on structure stability.
 * High stability = bright major intervals; low = darker minor.
 * Uses Web Audio API for procedural tones.
 */

const AUDIO_CONTEXT_KEY = '__p31_quantum_clock_audio_context';

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { [key: string]: unknown };
  if (!w[AUDIO_CONTEXT_KEY]) {
    try {
      w[AUDIO_CONTEXT_KEY] = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return w[AUDIO_CONTEXT_KEY] as AudioContext;
}

/** Base frequency for chirp (C5) */
const BASE_HZ = 523.25;

/**
 * Play a short chirp melody. Stability 0–1: higher = brighter (major), lower = more minor.
 */
export function playChirp(stability: number = 0.8): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const clamped = Math.max(0, Math.min(1, stability));
  // Intervals: high stability = major third + fifth; low = minor third + fifth
  const thirdRatio = clamped > 0.5 ? 1.26 : 1.2;   // ~major 3rd vs minor 3rd
  const fifthRatio = 1.5;

  const schedule = (frequency: number, start: number, duration: number, gain: number) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.connect(g);
    g.connect(ctx.destination);
    osc.frequency.setValueAtTime(frequency, start);
    osc.type = 'sine';
    g.gain.setValueAtTime(0, start);
    g.gain.linearRampToValueAtTime(gain * 0.15, start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, start + duration);
    osc.start(start);
    osc.stop(start + duration);
  };

  const t0 = ctx.currentTime;
  schedule(BASE_HZ, t0, 0.12, 1);
  schedule(BASE_HZ * thirdRatio, t0 + 0.08, 0.14, 0.8);
  schedule(BASE_HZ * fifthRatio, t0 + 0.18, 0.2, 0.6);
}

/**
 * Play a single "measurement" chime (e.g. when a structure is completed).
 */
export function playMeasurementChime(coherence: number = 0.85): void {
  playChirp(coherence);
}
