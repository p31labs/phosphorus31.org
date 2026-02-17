/**
 * Listens for continuous voice input and emits voice-command events
 * so the SwarmOrchestrator can drive swarm goals (repair, sierpinski, explore, stop, start).
 * Renders nothing; enable when accessibility.voiceCommands is on.
 */

import React, { useEffect } from 'react';

interface SwarmVoiceListenerProps {
  enabled: boolean;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: typeof SpeechRecognition;
    SpeechRecognition?: typeof SpeechRecognition;
  }
}

export const SwarmVoiceListener: React.FC<SwarmVoiceListenerProps> = ({ enabled }) => {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    const SpeechRecognition =
      window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const last = event.results.length - 1;
      const transcript = event.results[last]?.[0]?.transcript;
      if (transcript && event.results[last].isFinal) {
        window.dispatchEvent(new CustomEvent('voice-command', { detail: transcript }));
      }
    };

    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore if already stopped
      }
    };
  }, [enabled]);

  return null;
};
