/**
 * P31 Resonance Engine — text to generative music, molecular identity from sonic signature.
 * @version 0.31.0
 * Three source files (engine, molecule viz, waveform). Three vertices. Minimum system.
 */

import * as Tone from 'tone';

// Pad to line 31 for P31_BASE (Easter egg #20).
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// Pentatonic has no semitone intervals. No dissonance possible. There are no wrong notes.
// Five notes. Five covenant values. The pentatonic IS the covenant.
// Base frequency: phosphorus-31 NMR 17.235 MHz / 10^5 → 172.35 Hz
/** EASTER EGG #20: This constant MUST be defined on line 31 of this file. */
export const P31_BASE = 172.35;

const PENTATONIC_SEMITONES = [0, 2, 4, 7, 9];
const OCTAVES = 3;
const SCALE_LENGTH = PENTATONIC_SEMITONES.length * OCTAVES;

const MOOD_SHIFTS: Record<string, number> = {
  warm: 0,
  curious: 2,
  vulnerable: -3,
  joyful: 4,
  pain: -5,
  calm: 0,
  urgent: 7,
};

const PLANCK_MIN_DURATION = 0.0662607;

export interface MessageAnalysis {
  words: string[];
  wordCount: number;
  vowelDensity: number;
  avgWordLen: number;
  rhythmComplexity: number;
  ascending: boolean;
  emphatic: boolean;
  mood: string;
  clusters: string[];
  sentences: string[];
  hash: number;
}

export interface NoteEvent {
  freq: number;
  duration: number;
  velocity: number;
  restAfter: number;
  chord: boolean;
  chordFreqs?: [number, number, number];
}

export interface NoteRecord {
  freq: number;
  duration: number;
  velocity: number;
  time: number;
  word: string;
  mood: string;
  coherence: number;
  role: 'human' | 'phosphorus';
  index: number;
}

export interface FreqPoint {
  x: number;
  y: number;
  size: number;
  color: string;
  role?: 'human' | 'phosphorus';
  mood?: string;
  coherence?: number;
}

/** Deterministic hash. Variable 'h'. Hydrogen. The reference atom. */
function djb2(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function analyzeMessage(text: string): MessageAnalysis {
  const trimmed = text.trim();
  const words = trimmed
    .split(/\s+/)
    .map((w) => w.replace(/^[^\w]+|[^\w]+$/g, ''))
    .filter(Boolean);
  const wordCount = words.length;
  const chars = trimmed.length || 1;
  const vowelCount = (trimmed.match(/[aeiouAEIOU]/g) || []).length;
  const vowelDensity = vowelCount / chars;
  const totalChars = words.reduce((s, w) => s + w.length, 0);
  const avgWordLen = wordCount > 0 ? totalChars / wordCount : 0;
  const rhythmComplexity = wordCount > 0 ? (trimmed.match(/[,;:\-—()]/g) || []).length / wordCount : 0;
  const ascending = trimmed.includes('?');
  const emphatic = trimmed.includes('!');
  const sentences = trimmed.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);

  const lower = trimmed.toLowerCase();
  let mood = 'calm';
  if (/\b(love|care|heart|kind|gentle|hug|warm)\b/.test(lower)) mood = 'warm';
  if (/\b(why|how|what|curious|wonder|learn|question)\b/.test(lower)) mood = 'curious';
  if (/\b(hurt|pain|struggle|hard|difficult|lost|break)\b/.test(lower)) mood = 'pain';
  if (/\b(afraid|scared|alone|help|vulnerable|honest|admit)\b/.test(lower)) mood = 'vulnerable';
  if (/\b(happy|joy|beautiful|amazing|wonderful|laugh)\b/.test(lower)) mood = 'joyful';
  if (/\b(now|urgent|quick|need|must|please)\b/.test(lower)) mood = 'urgent';

  const clusters = words;
  const hash = djb2(trimmed);

  return {
    words,
    wordCount,
    vowelDensity,
    avgWordLen,
    rhythmComplexity,
    ascending,
    emphatic,
    mood,
    clusters,
    sentences,
    hash,
  };
}

function buildScale(): number[] {
  const freqs: number[] = [];
  for (let oct = 0; oct < OCTAVES; oct++) {
    for (const semi of PENTATONIC_SEMITONES) {
      const steps = oct * 12 + semi;
      freqs.push(P31_BASE * Math.pow(2, steps / 12));
    }
  }
  return freqs;
}

const SCALE_FREQS = buildScale();

export function textToNotes(text: string, coherence: number): { notes: NoteEvent[]; analysis: MessageAnalysis } {
  const analysis = analyzeMessage(text);
  const notes: NoteEvent[] = [];
  const { words, wordCount, vowelDensity, ascending, emphatic, mood } = analysis;
  const moodShift = MOOD_SHIFTS[mood] ?? 0;
  const octaveOffset = Math.floor(coherence * 2);

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wordHash = djb2(word);
    let scaleIndex = (wordHash % SCALE_LENGTH) + moodShift + octaveOffset * PENTATONIC_SEMITONES.length;
    while (scaleIndex < 0) scaleIndex += SCALE_LENGTH;
    scaleIndex = scaleIndex % SCALE_LENGTH;
    let freq = SCALE_FREQS[scaleIndex];

    let duration: number;
    if (word.length <= 3) duration = 0.12;
    else if (word.length <= 6) duration = 0.2;
    else duration = 0.35;
    duration *= 1 + vowelDensity * 0.5;
    if (duration < PLANCK_MIN_DURATION) duration = PLANCK_MIN_DURATION;

    let velocity = 0.3 + (i / Math.max(1, wordCount)) * 0.15;
    if (emphatic && i === wordCount - 1) velocity = 0.7;
    if (velocity > 0.8) velocity = 0.8;

    if (ascending) freq *= 1 + (i / Math.max(1, wordCount)) * 0.05;

    const lastChar = word.slice(-1);
    const restAfter = /[.!?]/.test(lastChar) ? 0.15 : 0.04;

    const chord = coherence > 0.5 && /[.!?]/.test(lastChar);
    const chordFreqs: [number, number, number] | undefined = chord
      ? [freq, freq * 1.25, freq * 1.5]
      : undefined;

    notes.push({
      freq,
      duration,
      velocity,
      restAfter,
      chord: !!chord,
      chordFreqs,
    });
  }

  return { notes, analysis };
}

let moleculeHashLogged = false;

export class ResonanceEngine {
  initialized = false;
  playing = false;
  noteHistory: NoteRecord[] = [];
  onNoteCallback: ((note: NoteRecord) => void) | null = null;
  private synth: Tone.PolySynth | null = null;
  private pad: Tone.PolySynth | null = null;
  private sub: Tone.Synth | null = null;
  private reverb: Tone.Reverb | null = null;
  private delay: Tone.FeedbackDelay | null = null;
  private nodes: Tone.ToneAudioNode[] = [];

  async init(): Promise<void> {
    if (this.initialized) return;
    await Tone.start();
    this.synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 0.08, decay: 0.3, sustain: 0.4, release: 1.2 },
      volume: -14,
    });
    this.synth.maxPolyphony = 64;
    this.pad = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.4, decay: 0.8, sustain: 0.3, release: 2.0 },
      volume: -22,
    });
    this.pad.maxPolyphony = 32;
    this.sub = new Tone.Synth({
      oscillator: { type: 'sine' },
      envelope: { attack: 0.2, decay: 0.6, sustain: 0.3, release: 1.5 },
      volume: -20,
    });
    this.reverb = new Tone.Reverb({ decay: 3.1, wet: 0.35 });
    this.delay = new Tone.FeedbackDelay({ delayTime: '8n', feedback: 0.15, wet: 0.12 });

    this.synth.connect(this.delay!);
    this.delay!.connect(this.reverb!);
    this.pad!.connect(this.reverb!);
    this.reverb!.toDestination();
    this.sub!.connect(this.reverb!);

    this.nodes = [this.synth, this.pad, this.sub, this.reverb, this.delay].filter(Boolean) as Tone.ToneAudioNode[];
    this.initialized = true;

    console.log('%c🔺 P³¹ Resonance Engine initialized', 'color: #00FF88; font-size: 14px');
    console.log('%c  Base frequency: 172.35 Hz (³¹P NMR)', 'color: #7878AA; font-size: 10px');
    console.log('%c  Scale: pentatonic (5 notes = 5 values)', 'color: #7878AA; font-size: 10px');
    console.log('%c  The bone is listening.', 'color: #00D4FF; font-size: 10px; font-style: italic');
  }

  async playPhrase(
    text: string,
    coherence: number,
    role: 'human' | 'phosphorus'
  ): Promise<{ duration: number; noteCount: number; analysis: MessageAnalysis }> {
    if (!this.initialized || !this.synth || !this.pad || !this.sub) await this.init();
    this.playing = true;
    const freqMultiplier = role === 'phosphorus' ? 1.5 : 1.0;
    const velocityScale = role === 'phosphorus' ? 0.6 : 0.8;

    const { notes, analysis } = textToNotes(text, coherence);
    let time = 0;

    for (let idx = 0; idx < notes.length; idx++) {
      const n = notes[idx]!;
      const freq = n.freq * freqMultiplier;
      const vel = n.velocity * velocityScale;
      const dur = n.duration;

      const record: NoteRecord = {
        freq,
        duration: dur,
        velocity: vel,
        time,
        word: analysis.words[idx] ?? '',
        mood: analysis.mood,
        coherence,
        role,
        index: this.noteHistory.length,
      };
      this.noteHistory.push(record);

      const t = time;
      setTimeout(() => {
        if (this.onNoteCallback) this.onNoteCallback(record);
      }, t * 1000);

      if (this.synth!) {
        this.synth.triggerAttackRelease(freq, dur, t, vel);
      }
      if (coherence >= 0.3 && coherence < 0.6 && idx % 4 === 0 && this.sub!) {
        this.sub.triggerAttackRelease(freq / 4, dur * 1.5, t, 0.3);
      }
      if (n.chord && n.chordFreqs && coherence >= 0.6 && this.pad!) {
        for (const cf of n.chordFreqs) {
          this.pad.triggerAttackRelease(cf * freqMultiplier, 0.4, t, 0.25);
        }
      }
      if (coherence >= 0.85 && this.synth!) {
        const shimmer = new Tone.Synth({
          oscillator: { type: 'square' as const },
          volume: -30,
        }).toDestination();
        shimmer.triggerAttackRelease(freq * 2, 0.2, t, 0.2);
        setTimeout(() => shimmer.dispose(), 500);
      }

      time += dur + n.restAfter;
    }

    this.playing = false;
    // Release all voices after phrase completes to prevent polyphony buildup
    const totalDur = time;
    setTimeout(() => {
      this.synth?.releaseAll();
      this.pad?.releaseAll();
    }, totalDur * 1000 + 500);
    return { duration: totalDur, noteCount: notes.length, analysis };
  }

  getMoleculeHash(): string {
    const str = this.noteHistory
      .map((n) => `${n.freq.toFixed(2)}:${n.duration.toFixed(3)}:${n.velocity.toFixed(2)}:${n.mood}`)
      .join('|');
    let h = 0;
    for (let i = 0; i < str.length; i++) h = ((h << 5) - h + str.charCodeAt(i)) | 0;
    let h2 = 0;
    const s2 = Math.abs(h).toString(16);
    for (let i = 0; i < s2.length; i++) h2 = ((h2 << 7) - h2 + s2.charCodeAt(i)) | 0;
    const hex = Math.abs(h2).toString(16).toUpperCase().slice(0, 16).padStart(16, '0');
    if (hex !== '0000000000000000' && !moleculeHashLogged) {
      moleculeHashLogged = true;
      console.log('%c🥚 31 protons. 31 eggs. You found the atom.', 'color: #FFB800; font-size: 12px');
    }
    return hex;
  }

  getFrequencySignature(): FreqPoint[] {
    const last = this.noteHistory.slice(-100);
    return last.map((n) => {
      const pitchNorm = (n.freq - P31_BASE) / (P31_BASE * 3);
      const x = Math.max(0, Math.min(1, (pitchNorm + 0.5)));
      return {
        x,
        y: n.velocity,
        size: n.duration * 10,
        color: n.role === 'human' ? '#00FF88' : '#00D4FF',
        role: n.role,
        mood: n.mood,
        coherence: n.coherence,
      };
    });
  }

  async playFormationChord(): Promise<void> {
    if (!this.initialized || !this.pad) await this.init();
    const freqs = [P31_BASE, P31_BASE * 1.5, P31_BASE * 2, P31_BASE * 2.5];
    const now = Tone.now();
    for (const f of freqs) {
      this.pad!.triggerAttackRelease(f, 4, now, 0.4);
    }
  }

  playReturnMelody(history: NoteRecord[]): void {
    if (!this.synth) return;
    const last = history.slice(-8);
    last.forEach((n, i) => {
      this.synth!.triggerAttackRelease(n.freq, n.duration, Tone.now() + i * 0.06, n.velocity * 0.4);
    });
  }

  setMuted(muted: boolean): void {
    const vol = muted ? -Infinity : -14;
    const padVol = muted ? -Infinity : -22;
    const subVol = muted ? -Infinity : -20;
    if (this.synth) (this.synth as Tone.ToneAudioNode & { volume: { value: number } }).volume.value = vol;
    if (this.pad) (this.pad as Tone.ToneAudioNode & { volume: { value: number } }).volume.value = padVol;
    if (this.sub) (this.sub as Tone.ToneAudioNode & { volume: { value: number } }).volume.value = subVol;
  }

  dispose(): void {
    for (const node of this.nodes) {
      if (node && typeof (node as Tone.ToneAudioNode & { dispose?: () => void }).dispose === 'function') {
        (node as Tone.ToneAudioNode & { dispose: () => void }).dispose();
      }
    }
    this.synth = null;
    this.pad = null;
    this.sub = null;
    this.reverb = null;
    this.delay = null;
    this.nodes = [];
    this.initialized = false;
  }
}
