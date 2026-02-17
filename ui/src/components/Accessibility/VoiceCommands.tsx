/**
 * Voice Commands - Natural language interaction
 * For users who prefer speaking over typing
 */

import React, { useEffect, useState } from 'react';
import { useAccessibilityStore } from '../../stores/accessibility.store';

interface VoiceCommandsProps {
  onCommand: (command: string, transcript: string) => void;
}

export const VoiceCommands: React.FC<VoiceCommandsProps> = ({ onCommand }) => {
  const { voiceCommands } = useAccessibilityStore();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!voiceCommands) return;

    // Check for browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;
    recognitionInstance.lang = 'en-US';

    recognitionInstance.onstart = () => {
      setIsListening(true);
    };

    recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);

      // Process command
      const lowerTranscript = transcript.toLowerCase();

      if (lowerTranscript.includes('send message') || lowerTranscript.includes('send')) {
        onCommand('send', transcript);
      } else if (lowerTranscript.includes('status') || lowerTranscript.includes('check')) {
        onCommand('status', transcript);
      } else if (lowerTranscript.includes('help')) {
        onCommand('help', transcript);
      } else {
        onCommand('message', transcript);
      }
    };

    recognitionInstance.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [voiceCommands, onCommand]);

  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  if (!voiceCommands) {
    return null;
  }

  return (
    <div className="voice-commands">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`voice-button ${isListening ? 'listening' : ''}`}
        aria-label={isListening ? 'Stop listening' : 'Start voice command'}
      >
        {isListening ? '🛑 Stop' : '🎤 Speak'}
      </button>
      {transcript && <div className="transcript">You said: "{transcript}"</div>}
      {isListening && (
        <div className="listening-indicator">
          <span className="pulse-dot" />
          Listening...
        </div>
      )}
    </div>
  );
};
