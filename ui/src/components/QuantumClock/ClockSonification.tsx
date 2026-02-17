/**
 * ClockSonification — melody playback and winding sounds for the Quantum Clock.
 * Listens for play-melody and wind-sound custom events. Bob & Marge's harmony.
 */

import React, { useEffect, useRef, useCallback } from 'react';

const AUDIO_CONTEXT_KEY = '__p31_clock_sonification_audio_context';

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as { [key: string]: unknown };
  if (!w[AUDIO_CONTEXT_KEY]) {
    try {
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      w[AUDIO_CONTEXT_KEY] = new Ctx();
    } catch {
      return null;
    }
  }
  return w[AUDIO_CONTEXT_KEY] as AudioContext;
}

export const ClockSonification: React.FC = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    const initAudio = () => {
      if (audioContextRef.current) return;
      const ctx = getAudioContext();
      if (!ctx) return;
      audioContextRef.current = ctx;
      masterGainRef.current = ctx.createGain();
      masterGainRef.current.connect(ctx.destination);
      masterGainRef.current.gain.value = 0.3;
    };
    window.addEventListener('click', initAudio, { once: true });
    return () => window.removeEventListener('click', initAudio);
  }, []);

  const playMelody = useCallback((notes: number[]) => {
    const ctx = audioContextRef.current;
    const gain = masterGainRef.current;
    if (!ctx || !gain || notes.length === 0) return;
    const now = ctx.currentTime;
    let time = now;
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(gain);
      osc.type = 'sine';
      osc.frequency.value = 440 * Math.pow(2, (note - 69) / 12);
      g.gain.setValueAtTime(0.2, time);
      g.gain.exponentialRampToValueAtTime(0.01, time + 0.5);
      osc.start(time);
      osc.stop(time + 0.5);
      time += 0.15;
    }
  }, []);

  const playWindSound = useCallback((amount: number) => {
    const ctx = audioContextRef.current;
    const gain = masterGainRef.current;
    if (!ctx || !gain) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 200 + amount * 200;
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.08);
  }, []);

  useEffect(() => {
    const handleMelody = (e: Event) => {
      const detail = (e as CustomEvent<number[]>).detail;
      if (Array.isArray(detail)) playMelody(detail);
    };
    const handleWind = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail;
      playWindSound(typeof detail === 'number' ? detail : 0.1);
    };
    window.addEventListener('play-melody', handleMelody);
    window.addEventListener('wind-sound', handleWind);
    return () => {
      window.removeEventListener('play-melody', handleMelody);
      window.removeEventListener('wind-sound', handleWind);
    };
  }, [playMelody, playWindSound]);

  return null;
};
