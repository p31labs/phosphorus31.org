/**
 * P31 Voice — browser-native speech synthesis and recognition.
 * No cloud, no API keys. The phosphorus speaks through the browser itself.
 */

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

  const ranked = [
    "Microsoft Zira",
    "Microsoft Mark",
    "Samantha",
    "Karen",
    "Daniel",
    "Google UK English Female",
    "Google US English",
  ];

  for (const name of ranked) {
    const match = voices.find((v) => v.name.includes(name));
    if (match) { preferredVoice = match; return match; }
  }

  const english = voices.find((v) => v.lang.startsWith("en"));
  if (english) { preferredVoice = english; return english; }

  preferredVoice = voices[0] ?? null;
  return preferredVoice;
}

if (typeof speechSynthesis !== "undefined") {
  speechSynthesis.onvoiceschanged = () => {
    voicesLoaded = false;
    preferredVoice = null;
    loadVoices();
  };
}

export interface SpeakOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
}

export function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof speechSynthesis === "undefined") { resolve(); return; }
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickVoice();
    if (voice) utterance.voice = voice;

    utterance.rate = opts.rate ?? 0.92;
    utterance.pitch = opts.pitch ?? 1.05;
    utterance.volume = opts.volume ?? 0.85;
    utterance.lang = "en-US";

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      if (e.error === "canceled" || e.error === "interrupted") resolve();
      else reject(e);
    };

    speechSynthesis.speak(utterance);
  });
}

export function stopSpeaking(): void {
  if (typeof speechSynthesis !== "undefined") speechSynthesis.cancel();
}

export function isSpeaking(): boolean {
  return typeof speechSynthesis !== "undefined" && speechSynthesis.speaking;
}

let recognition: SpeechRecognition | null = null;

export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== "undefined" &&
    ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);
}

export interface ListenCallbacks {
  onInterim?: (text: string) => void;
  onFinal?: (result: { transcript: string; confidence: number }) => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export function startListening(callbacks: ListenCallbacks): boolean {
  if (!isSpeechRecognitionSupported()) return false;

  if (recognition) {
    try { recognition.abort(); } catch { /* already stopped */ }
  }

  const Ctor =
    (window as unknown as Record<string, new () => SpeechRecognition>).SpeechRecognition ??
    (window as unknown as Record<string, new () => SpeechRecognition>).webkitSpeechRecognition;

  recognition = new Ctor();
  recognition.lang = "en-US";
  recognition.interimResults = true;
  (recognition as SpeechRecognition & { maxAlternatives: number }).maxAlternatives = 1;
  recognition.continuous = true;

  let finalTranscript = "";

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result?.[0]) {
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
          callbacks.onFinal?.({ transcript: finalTranscript.trim(), confidence: result[0].confidence });
        } else {
          interim += result[0].transcript;
        }
      }
    }
    if (interim) callbacks.onInterim?.(finalTranscript + interim);
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    if (event.error === "no-speech" || event.error === "aborted") return;
    callbacks.onError?.(event.error);
  };

  recognition.onend = () => {
    const wasActive = recognition !== null;
    recognition = null;
    if (wasActive) {
      if (finalTranscript.trim()) {
        callbacks.onFinal?.({ transcript: finalTranscript.trim(), confidence: 1 });
      }
      callbacks.onEnd?.();
    }
  };

  try { recognition.start(); return true; }
  catch { recognition = null; return false; }
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
