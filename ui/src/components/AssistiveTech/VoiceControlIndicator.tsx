/**
 * Voice Control Indicator
 * Visual indicator when voice control is active
 */

import React, { useEffect, useState } from 'react';
import { useAssistiveTech } from './AssistiveTechProvider';

export const VoiceControlIndicator: React.FC = () => {
  const { manager } = useAssistiveTech();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState<string>('');

  useEffect(() => {
    if (!manager) return;

    const handleListening = () => setIsListening(true);
    const handleStopped = () => setIsListening(false);
    const handleTranscript = (e: CustomEvent) => setTranscript(e.detail.transcript);

    window.addEventListener('assistive:voiceListening', handleListening as EventListener);
    window.addEventListener('assistive:voiceStopped', handleStopped as EventListener);
    window.addEventListener('assistive:voiceTranscript', handleTranscript as EventListener);

    return () => {
      window.removeEventListener('assistive:voiceListening', handleListening as EventListener);
      window.removeEventListener('assistive:voiceStopped', handleStopped as EventListener);
      window.removeEventListener('assistive:voiceTranscript', handleTranscript as EventListener);
    };
  }, [manager]);

  if (!isListening) return null;

  return (
    <div className="voice-control-indicator">
      <div className="microphone-icon">🎤</div>
      <div className="listening-text">Listening...</div>
      {transcript && <div className="transcript">"{transcript}"</div>}
      <div className="pulse-ring"></div>
      <style>{`
        .voice-control-indicator {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          background: rgba(0, 0, 0, 0.9);
          border: 3px solid #FF69B4;
          border-radius: 16px;
          padding: 1.5rem;
          z-index: 10000;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          min-width: 200px;
          box-shadow: 0 8px 32px rgba(255, 105, 180, 0.5);
        }

        .microphone-icon {
          font-size: 3rem;
          animation: pulse 1.5s ease-in-out infinite;
        }

        .listening-text {
          font-size: 1.25rem;
          font-weight: 700;
          color: #FF69B4;
        }

        .transcript {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.9);
          font-style: italic;
          text-align: center;
        }

        .pulse-ring {
          position: absolute;
          inset: -10px;
          border: 2px solid #FF69B4;
          border-radius: 20px;
          animation: pulse-ring 2s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes pulse-ring {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};
