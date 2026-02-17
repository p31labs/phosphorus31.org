/**
 * ClockSonificationAudio.ts
 * The audible soul of the clock – winding creaks, cuckoo chirps, and heart whispers.
 * Uses Web Audio API with love.
 */

let audioContext: AudioContext | null = null;
let masterGain: GainNode | null = null;

const getContext = (): AudioContext | null => {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    audioContext = new AudioContext();
    masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.value = 0.3;
  }
  return audioContext;
};

export const playMelody = (notes: number[]): void => {
  const ctx = getContext();
  if (!ctx || !masterGain) return;
  const now = ctx.currentTime;
  let time = now;
  notes.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(masterGain);
    osc.frequency.value = 440 * Math.pow(2, (note - 69) / 12);
    gain.gain.setValueAtTime(0.15, time);
    gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
    osc.start(time);
    osc.stop(time + 0.4);
    time += 0.2; // staccato
  });
};

export const playWindSound = (amount: number): void => {
  const ctx = getContext();
  if (!ctx || !masterGain) return;
  const now = ctx.currentTime;
  const bufferSize = 4096;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;
  noise.connect(filter);
  filter.connect(masterGain);
  noise.start(now);
  noise.stop(now + 0.1);

  const osc = ctx.createOscillator();
  osc.frequency.value = 200 + amount * 200;
  osc.connect(masterGain);
  osc.start(now);
  osc.stop(now + 0.1);
};

export const playHeartWhisper = (): void => {
  const ctx = getContext();
  if (!ctx || !masterGain) return;
  const now = ctx.currentTime;
  const bufferSize = 8192;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 600;
  noise.connect(filter);
  const gain = ctx.createGain();
  filter.connect(gain);
  gain.connect(masterGain);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 1);
  noise.start(now);
  noise.stop(now + 1);
};
