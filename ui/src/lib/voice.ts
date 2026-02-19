/**
 * P31 Voice — browser-native speech synthesis and recognition.
 * No cloud, no API keys. The phosphorus speaks through the browser itself.
 */

// ---------------------------------------------------------------------------
// Speech Synthesis (Text-to-Speech)
// ---------------------------------------------------------------------------

let preferredVoice: SpeechSynthesisVoice | null = null;
let voicesLoaded = false;

function loadVoices(): SpeechSynthesisVoice[] {
  const voices = speechSynthesis.getVoices();
  if (voices.length > 0) voicesLoaded = true;
  return voices;
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (preferredVoice) return preferredVoice;
  const voices = loadVoices();
  if (voices.length === 0) return null;

  // Prefer calm, natural-sounding English voices
  const ranked = [
    'Microsoft Zira',      // Windows — calm female
    'Microsoft Mark',      // Windows — calm male
    'Samantha',            // macOS — natural
    'Karen',               // macOS — Australian English
    'Daniel',              // macOS — British English
    'Google UK English Female',
    'Google US English',
  ];

  for (const name of ranked) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) {
      preferredVoice = match;
      return match;
    }
  }

  // Fallback: first English voice
  const english = voices.find((v) => v.lang.startsWith('en'));
  if (english) {
    preferredVoice = english;
    return english;
  }

  preferredVoice = voices[0] ?? null;
  return preferredVoice;
}

// Voices load asynchronously in some browsers
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = false;
    preferredVoice = null;
    loadVoices();
  };
}

export interface SpeakOptions {
  rate?: number;    // 0.1 – 10, default 0.92
  pitch?: number;   // 0 – 2, default 1.05
  volume?: number;  // 0 – 1, default 0.85
}

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof speechSynthesis === 'undefined') {
      resolve();
      return;
    }

    // Cancel any in-progress speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;

    utterance.rate = opts.rate ?? 0.92;
    utterance.pitch = opts.pitch ?? 1.05;
    utterance.volume = opts.volume ?? 0.85;
    utterance.lang = 'en-US';

    utterance.onend = () => {
      currentUtterance = null;
      resolve();
    };
    utterance.onerror = (e) => {
      currentUtterance = null;
      if (e.error === 'canceled' || e.error === 'interrupted') {
        resolve();
      } else {
        reject(e);
      }
    };

    currentUtterance = utterance;
    speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.cancel();
  }
  currentUtterance = null;
}

export function isSpeaking(): boolean {
  return typeof speechSynthesis !== 'undefined' && speechSynthesis.speaking;
}

// ---------------------------------------------------------------------------
// Speech Recognition (Speech-to-Text)
// ---------------------------------------------------------------------------

let recognition: SpeechRecognition | null = null;

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
}

export interface ListenResult {
  transcript: string;
  confidence: number;
}

export interface ListenCallbacks {
  onInterim?: (text: string) => void;
  onFinal?: (result: ListenResult) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

/**
 * Start continuous listening. Stays active until stopListening() is called.
 * Calls onInterim with partial transcripts and onFinal with finished sentences.
 * Returns true if started successfully.
 */
export function startListening(callbacks: ListenCallbacks): boolean {
  if (!isSpeechRecognitionSupported()) return false;

  if (recognition) {
    try { recognition.abort(); } catch { /* already stopped */ }
  }

  const SpeechRecognition =
    (window as unknown as Record<string, new () => SpeechRecognition>).SpeechRecognition ??
    (window as unknown as Record<string, new () => SpeechRecognition>).webkitSpeechRecognition;

  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = true;
  (recognition as SpeechRecognition & { maxAlternatives: number }).maxAlternatives = 1;
  recognition.continuous = true;

  let finalTranscript = '';

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result?.[0]) {
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          callbacks.onFinal?.({
            transcript: finalTranscript.trim(),
            confidence: result[0].confidence,
          });
        } else {
          interim += result[0].transcript;
        }
      }
    }
    if (interim) {
      callbacks.onInterim?.(finalTranscript + interim);
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    if (event.error === 'no-speech') {
      // Keep listening — user just hasn't spoken yet
      return;
    }
    if (event.error === 'aborted') {
      // Intentional stop
      return;
    }
    callbacks.onError?.(event.error);
  };

  recognition.onend = () => {
    const wasActive = recognition !== null;
    recognition = null;
    if (wasActive) {
      // If we still have a final transcript, send it
      if (finalTranscript.trim()) {
        callbacks.onFinal?.({
          transcript: finalTranscript.trim(),
          confidence: 1,
        });
      }
      callbacks.onEnd?.();
    }
  };

  try {
    recognition.start();
    return true;
  } catch {
    recognition = null;
    return false;
  }
}

export function stopListening(): void {
  if (recognition) {
    try { recognition.stop(); } catch { /* already stopped */ }
    recognition = null;
  }
}

export function isListening(): boolean {
  return recognition !== null;
}
