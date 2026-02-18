// ══════════════════════════════════════════════════════════════════════════════
// USE TRIMTAB HOOK
// Voice synthesis and recognition with Fuller persona.
// Priority queue system: HIGH interrupts, NORMAL queues.
// ══════════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore } from '../store.js';
import { TRIMTAB_QUOTES, VOICE_COMMANDS } from '../constants.js';

/**
 * Hook for voice guidance and control
 */
export function useTrimtab() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);

  // Refs for stable access in callbacks
  const synthRef = useRef(null);
  const recognitionRef = useRef(null);
  const voiceRef = useRef(null);
  const isListeningRef = useRef(false);
  const processCommandRef = useRef(null);

  // Store actions
  const setMode = useStore((s) => s.setMode);
  const clearBlocks = useStore((s) => s.clearBlocks);

  // ── Speech Synthesis Setup ─────────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const synth = window.speechSynthesis;
    if (!synth) return;
    
    synthRef.current = synth;

    // Select voice (prefer Google US English or male voices)
    const selectVoice = () => {
      const voices = synth.getVoices();
      if (voices.length === 0) return;

      // Priority: Google US English > any English male > first English
      const googleUS = voices.find(v => 
        v.name.includes('Google US English') && v.lang.startsWith('en')
      );
      const englishMale = voices.find(v =>
        v.lang.startsWith('en') && v.name.toLowerCase().includes('male')
      );
      const anyEnglish = voices.find(v => v.lang.startsWith('en'));

      voiceRef.current = googleUS || englishMale || anyEnglish || voices[0];
    };

    selectVoice();
    synth.addEventListener('voiceschanged', selectVoice);

    return () => {
      synth.removeEventListener('voiceschanged', selectVoice);
      synth.cancel();
    };
  }, []);

  // ── Speech Recognition Setup ───────────────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition not supported in this browser.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = 'en-US';

    rec.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
      setError(null);
    };

    rec.onend = () => {
      isListeningRef.current = false;
      setIsListening(false);
    };

    rec.onerror = (event) => {
      const errorMsg = event.error === 'no-speech'
        ? 'No speech detected. Please try again.'
        : `Speech recognition error: ${event.error}`;
      setError(errorMsg);
    };

    rec.onresult = (event) => {
      const text = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setTranscript(text);
      
      // Process command via ref (always current)
      if (processCommandRef.current) {
        processCommandRef.current(text);
      }
    };

    recognitionRef.current = rec;

    return () => {
      rec.abort();
    };
  }, []);

  // ── Command Processor ──────────────────────────────────────────────────────
  const processCommand = useCallback((text) => {
    const lower = text.toLowerCase().trim();
    
    // STATUS commands
    if (VOICE_COMMANDS.STATUS.some(t => lower.includes(t))) {
      const { coherence, voltage, vpiPhase } = useStore.getState();
      const status = `System coherence at ${Math.round(coherence * 100)} percent. ` +
        `Voltage level ${Math.round(voltage)}. ` +
        `Currently in ${vpiPhase} phase.`;
      speak(status, 'HIGH');
      return;
    }
    
    // HELP commands - Fuller wisdom
    if (VOICE_COMMANDS.HELP.some(t => lower.includes(t))) {
      const quote = TRIMTAB_QUOTES[Math.floor(Math.random() * TRIMTAB_QUOTES.length)];
      speak(quote, 'HIGH');
      return;
    }
    
    // BUILD commands
    if (VOICE_COMMANDS.BUILD.some(t => lower.includes(t))) {
      setMode('BUILD');
      speak("Construction mode engaged. The universe awaits your design.", 'HIGH');
      return;
    }
    
    // VIEW commands
    if (VOICE_COMMANDS.VIEW.some(t => lower.includes(t))) {
      setMode('VIEW');
      speak("Observation mode. Witness what you have created.", 'HIGH');
      return;
    }
    
    // MATERIALIZE commands
    if (VOICE_COMMANDS.MATERIALIZE.some(t => lower.includes(t))) {
      setMode('SLICE');
      speak("Initiating fabrication sequence. Stand by for slice.", 'HIGH');
      return;
    }
    
    // RESET commands
    if (VOICE_COMMANDS.RESET.some(t => lower.includes(t))) {
      clearBlocks();
      speak("World cleared. The void awaits your intention.", 'HIGH');
      return;
    }
    
    // Unrecognized - acknowledge
    speak("I heard you. Continue building.", 'NORMAL');
  }, [setMode, clearBlocks]);

  // Keep processCommandRef in sync
  useEffect(() => {
    processCommandRef.current = processCommand;
  }, [processCommand]);

  // ── Speak Function ─────────────────────────────────────────────────────────
  const speak = useCallback((text, priority = 'NORMAL') => {
    const synth = synthRef.current;
    if (!synth || !voiceRef.current || !text.trim()) return;

    if (priority === 'HIGH') {
      // Interrupt current speech
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voiceRef.current;
    utterance.pitch = 0.9;    // Slightly lower for gravitas
    utterance.rate = 0.92;    // Deliberate pacing
    utterance.volume = 0.85;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      setIsSpeaking(false);
      setError(`Speech error: ${e.error}`);
    };

    synth.speak(utterance);
  }, []);

  // ── Listen Controls ────────────────────────────────────────────────────────
  const listen = useCallback(() => {
    if (!recognitionRef.current) return;
    if (isListeningRef.current) return;

    try {
      recognitionRef.current.start();
    } catch (e) {
      setError(`Could not start listening: ${e.message}`);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    if (!isListeningRef.current) return;

    try {
      recognitionRef.current.stop();
    } catch (e) {
      // Ignore stop errors
    }
  }, []);

  // ── Public API ─────────────────────────────────────────────────────────────
  return {
    speak,
    listen,
    stopListening,
    isSpeaking,
    isListening,
    transcript,
    error
  };
}
