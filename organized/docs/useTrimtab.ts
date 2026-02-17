/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useState, useCallback, useEffect } from 'react';

const TRIMTAB_QUOTES = [
  "You can never learn less; you can only learn more.",
  "Don't fight forces, use them.",
  "Integrity is the essence of everything successful.",
  "The best way to predict the future is to design it."
];

export const useTrimtab = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const synthInstance = window.speechSynthesis;
      setSynth(synthInstance);

      const loadVoices = () => {
        setVoices(synthInstance.getVoices());
      };

      // Voices are loaded asynchronously.
      loadVoices();
      synthInstance.onvoiceschanged = loadVoices;
    }
  }, []);

  // Placeholder speak function. Logs to console for now.
  const speak = useCallback((text: string) => {
    if (!synth) {
      console.warn('[TRIMTAB]: Speech synthesis not available.');
      return;
    }

    // Prevent voice overlap for neuro-inclusive clarity.
    if (synth.speaking) {
      synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Voice Selection Strategy: "Grounding" Tone
    const preferredVoice = voices.find(v => v.name.includes('Google US English')) || voices.find(v => v.lang.startsWith('en-')) || voices[0];

    if (preferredVoice) utterance.voice = preferredVoice;

    // Fuller Persona Settings: Slower, slightly lower pitch
    utterance.pitch = 0.9;
    utterance.rate = 0.95;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);

    synth.speak(utterance);
  }, [synth, voices]);

  // Placeholder listen function.
  const listen = useCallback(() => {
    console.log('[TRIMTAB]: Listening...');
    setIsListening(true);
    // Stop listening after a moment for this placeholder
    setTimeout(() => setIsListening(false), 2000);
  }, []);

  const speakWisdom = useCallback(() => {
    const quote = TRIMTAB_QUOTES[Math.floor(Math.random() * TRIMTAB_QUOTES.length)];
    speak(quote);
  }, [speak]);

  return { speak, listen, speakWisdom, isSpeaking, isListening };
};