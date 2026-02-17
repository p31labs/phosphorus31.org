/**
 * Ambient Engine — continuous atmospheric music for the Posner home.
 * Drone at P31_BASE (172.35 Hz), random pentatonic notes, route-to-note mapping.
 * Lightweight wrapper around Tone.js. No conversation dependency.
 */

import * as Tone from 'tone';
import { P31_BASE } from './resonance-engine';

const PENTATONIC_SEMITONES = [0, 2, 4, 7, 9];

function pentatonicFreq(degree: number, octave: number): number {
  const semi = PENTATONIC_SEMITONES[degree % PENTATONIC_SEMITONES.length]!;
  return P31_BASE * Math.pow(2, (octave * 12 + semi) / 12);
}

// Map each route to a pentatonic scale degree + octave
const ROUTE_NOTES: Record<string, { degree: number; octave: number }> = {
  scope: { degree: 0, octave: 0 },
  fold: { degree: 2, octave: 0 },
  wallet: { degree: 4, octave: 0 },
  challenges: { degree: 3, octave: 1 },
  sprout: { degree: 4, octave: 1 },
  identity: { degree: 0, octave: 1 },
  mesh: { degree: 2, octave: 1 },
  resonance: { degree: 0, octave: 2 },
  dome: { degree: 3, octave: 1 },
  apps: { degree: 1, octave: 1 },
  bonding: { degree: 4, octave: 0 },
  studio: { degree: 3, octave: 0 },
  greenhouse: { degree: 1, octave: 1 },
};

export class AmbientEngine {
  private initialized = false;
  private ambientSynth: Tone.PolySynth | null = null;
  private droneSynth: Tone.Synth | null = null;
  private reverb: Tone.Reverb | null = null;
  private muted = false;
  private ambientInterval: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;

  async init(): Promise<void> {
    if (this.initialized || this.disposed) return;
    await Tone.start();

    this.reverb = new Tone.Reverb({ decay: 8, wet: 0.6 });
    await this.reverb.generate();

    this.ambientSynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: 'sine' },
      envelope: { attack: 2, decay: 1, sustain: 0.3, release: 4 },
      volume: -28,
    });
    this.ambientSynth.connect(this.reverb);
    this.reverb.toDestination();

    this.droneSynth = new Tone.Synth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 5, decay: 0, sustain: 1, release: 5 },
      volume: -32,
    });
    this.droneSynth.connect(this.reverb);

    // Start the drone
    this.droneSynth.triggerAttack(P31_BASE);

    // Start ambient note cycle
    this.scheduleAmbient();

    this.initialized = true;
  }

  private scheduleAmbient() {
    if (this.disposed) return;
    const delay = 3000 + Math.random() * 5000;
    this.ambientInterval = setTimeout(() => {
      if (this.disposed || !this.ambientSynth || this.muted) {
        this.scheduleAmbient();
        return;
      }
      const degree = Math.floor(Math.random() * 5);
      const octave = Math.floor(Math.random() * 3);
      const freq = pentatonicFreq(degree, octave);
      const dur = 2 + Math.random() * 4;
      const vel = 0.08 + Math.random() * 0.07;

      this.ambientSynth.triggerAttackRelease(freq, dur, undefined, vel);

      // 20% chance: play a chord (note + fifth)
      if (Math.random() < 0.2) {
        this.ambientSynth.triggerAttackRelease(freq * 1.5, dur, undefined, vel * 0.7);
      }

      this.scheduleAmbient();
    }, delay);
  }

  playRouteNote(route: string): void {
    if (!this.initialized || !this.ambientSynth || this.muted) return;
    const mapping = ROUTE_NOTES[route];
    if (!mapping) return;
    const freq = pentatonicFreq(mapping.degree, mapping.octave);
    this.ambientSynth.triggerAttackRelease(freq, 1.5, undefined, 0.2);
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.ambientSynth) {
      (this.ambientSynth as unknown as { volume: { value: number } }).volume.value = muted ? -Infinity : -28;
    }
    if (this.droneSynth) {
      (this.droneSynth as unknown as { volume: { value: number } }).volume.value = muted ? -Infinity : -32;
    }
  }

  dispose(): void {
    this.disposed = true;
    if (this.ambientInterval) clearTimeout(this.ambientInterval);
    this.droneSynth?.triggerRelease();
    this.ambientSynth?.releaseAll();
    setTimeout(() => {
      this.ambientSynth?.dispose();
      this.droneSynth?.dispose();
      this.reverb?.dispose();
    }, 5100);
    this.initialized = false;
  }
}
