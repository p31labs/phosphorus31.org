// useTrimtab hook — voice guidance for Action Deck and other consumers
// Exposes listen / stopListening / speak so all buttons work

import { useState, useCallback, useRef } from 'react';

export function useTrimtab() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  const start = useCallback(() => {
    setIsListening(true);
    const SpeechRecognitionCtor =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (SpeechRecognitionCtor) {
      try {
        const recognition = new SpeechRecognitionCtor();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.onresult = (e) => {
          const last = e.results.length - 1;
          setTranscript(e.results[last][0].transcript);
        };
        recognition.onend = () => {
          recognitionRef.current = null;
          setIsListening(false);
        };
        recognition.start();
        recognitionRef.current = recognition;
      } catch (_) {
        setIsListening(false);
      }
    }
  }, []);

  const stop = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  const listen = useCallback(() => {
    if (isListening) stop();
    else start();
  }, [isListening, start, stop]);

  const stopListening = useCallback(() => {
    stop();
  }, [stop]);

  const speak = useCallback((text, _priority = 'NORMAL') => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    const u = new SpeechSynthesisUtterance(String(text));
    window.speechSynthesis.speak(u);
  }, []);

  return {
    isListening,
    transcript,
    start,
    stop,
    listen,
    stopListening,
    speak,
  };
}
