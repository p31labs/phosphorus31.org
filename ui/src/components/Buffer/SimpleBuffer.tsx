/**
 * Simple Buffer - Universal Access Interface
 * Simplified Buffer interface for 6-year-olds and 70-year-olds
 */

import React, { useState, useEffect } from 'react';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import { useSproutHelpStore } from '../../stores/sproutHelp.store';
import { SimpleButton } from '../Accessibility/SimpleButton';
import { SimpleMessageInput } from '../Accessibility/SimpleMessageInput';
import { VoiceCommands } from '../Accessibility/VoiceCommands';
import { bufferService } from '../../services/buffer.service';
import { P31_STATUS } from '../../config/p31-icons';

export const SimpleBuffer: React.FC = () => {
  const { simplifiedUI, fontSize, audioFeedback, voiceCommands } = useAccessibilityStore();
  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);

  const sproutHelpRequested = useSproutHelpStore((s) => s.requested);
  const sproutHelpDraft = useSproutHelpStore((s) => s.draftPrompt);
  const clearSproutHelp = useSproutHelpStore((s) => s.clearHelp);

  const sendDraftForHelp = () => {
    if (sproutHelpDraft.trim()) {
      handleSubmit(sproutHelpDraft);
      clearSproutHelp();
    }
  };

  useEffect(() => {
    const checkStatus = async () => {
      const isAvailable = await bufferService.healthCheck();
      setStatus(isAvailable ? 'connected' : 'disconnected');
    };

    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (message: string) => {
    try {
      const result = await bufferService.submitMessage({
        message,
        priority: 'normal',
        metadata: { source: 'simple-ui' },
      });

      setLastMessage(result.messageId);
      setMessageCount((prev) => prev + 1);

      // Screen reader announcement
      if ((window as any).accessibilityAnnounce) {
        (window as any).accessibilityAnnounce(
          `Message sent successfully. Total messages: ${messageCount + 1}`,
          'polite'
        );
      }

      // Audio confirmation
      if (audioFeedback) {
        const audio = new Audio(
          'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77+efTQ8MUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUqgc7y2Yk2CBlou+/nn00PDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC'
        );
        audio.play().catch(() => {});
      }

      setTimeout(() => setLastMessage(null), 3000);
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Could not send message. Please try again.');
    }
  };

  const containerSize =
    fontSize === 'xlarge' ? 'xlarge' : fontSize === 'large' ? 'large' : 'medium';

  return (
    <div className={`simple-buffer container-${containerSize}`}>
      <div className="simple-header">
        <h1>The Buffer</h1>
        <div className={`status-indicator ${status}`}>
          <span className="status-dot" />
          <span>{status === 'connected' ? 'Connected' : 'Not Connected'}</span>
        </div>
      </div>

      <div className="simple-content">
        {sproutHelpRequested && (
          <div
            className="sprout-help-banner"
            role="alert"
            style={{
              marginBottom: '1rem',
              padding: '0.75rem 1rem',
              background: 'rgba(46, 204, 113, 0.1)',
              border: '1px solid rgba(46, 204, 113, 0.3)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '0.5rem',
            }}
          >
            <span style={{ color: '#2ecc71', fontWeight: 600 }}>Someone needs help.</span>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={sendDraftForHelp}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#2ecc71',
                  color: '#050510',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
                aria-label="Send calm message for me"
              >
                Send calm message for me
              </button>
              <button
                type="button"
                onClick={clearSproutHelp}
                style={{
                  padding: '0.5rem 1rem',
                  background: 'transparent',
                  color: '#2ecc71',
                  border: '1px solid rgba(46, 204, 113, 0.5)',
                  borderRadius: '6px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  minHeight: '44px',
                }}
                aria-label="Dismiss, I'll handle it"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        <div className="message-section">
          <h2>Send a Message</h2>
          {voiceCommands && (
            <div className="voice-section">
              <VoiceCommands
                onCommand={(command, transcript) => {
                  if (command === 'send' || command === 'message') {
                    handleSubmit(transcript);
                  }
                }}
              />
            </div>
          )}
          <SimpleMessageInput
            onSubmit={handleSubmit}
            placeholder="What would you like to say?"
            submitLabel="Send Message"
          />
        </div>

        {lastMessage && (
          <div className="success-message" style={{ color: P31_STATUS.checkColor }}>{P31_STATUS.check} Message sent! ({messageCount} total)</div>
        )}

        <div className="info-section">
          <h2>How It Works</h2>
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">💬</div>
              <div className="info-text">Type your message and press Send</div>
            </div>
            <div className="info-card">
              <div className="info-icon">⏱️</div>
              <div className="info-text">Messages are processed safely</div>
            </div>
            <div className="info-card">
              <div className="info-icon">✅</div>
              <div className="info-text">You'll hear a sound when it's sent</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .simple-buffer {
          padding: 2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .container-xlarge {
          font-size: 1.5rem;
        }

        .container-large {
          font-size: 1.25rem;
        }

        .simple-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        .status-indicator.connected .status-dot {
          background: #4ade80;
        }

        .status-indicator.disconnected .status-dot {
          background: #ef4444;
          animation: none;
        }

        .message-section {
          margin-bottom: 2rem;
        }

        .success-message {
          padding: 1rem;
          background: rgba(74, 222, 128, 0.2);
          border: 2px solid #4ade80;
          border-radius: 8px;
          margin-bottom: 2rem;
          font-size: 1.125rem;
          text-align: center;
        }

        .info-section h2 {
          margin-bottom: 1rem;
        }

        .info-cards {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .info-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
        }

        .info-icon {
          font-size: 2rem;
        }

        .info-text {
          font-size: 1.125rem;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
};
