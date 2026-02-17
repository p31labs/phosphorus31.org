/**
 * Progressive Disclosure Component
 * Reveal raw text with consent gate for Node D (Shield)
 */

import { useState } from 'react';
import { useProcessedMessage } from '../../stores/shield.store';
import { useShieldStore } from '../../stores/shield.store';

export function ProgressiveDisclosure() {
  const message = useProcessedMessage();
  const markRawViewed = useShieldStore((state) => state.markRawViewed);
  const [showRaw, setShowRaw] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);

  if (!message) {
    return null;
  }

  const handleConsent = () => {
    setConsentGiven(true);
    setShowRaw(true);
    markRawViewed();
  };

  return (
    <div style={{ padding: 16, backgroundColor: '#1f2937', borderRadius: 8 }}>
      {message.safeSummary && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ color: '#9ca3af', fontSize: 11, marginBottom: 8 }}>SAFE SUMMARY</div>
          <div style={{ color: '#d1d5db', fontSize: 14, lineHeight: 1.6 }}>
            {message.safeSummary}
          </div>
        </div>
      )}

      {!consentGiven && (
        <div
          style={{
            padding: 16,
            backgroundColor: '#7f1d1d',
            borderRadius: 8,
            border: '1px solid #ef4444',
          }}
        >
          <div style={{ color: '#fff', fontSize: 13, marginBottom: 12 }}>
            ⚠️ High Voltage Message Detected
          </div>
          <div style={{ color: '#fca5a5', fontSize: 12, marginBottom: 12 }}>
            This message has a voltage of {message.voltage.score.toFixed(1)}/10. Viewing the raw
            content may be emotionally triggering.
          </div>
          <button
            onClick={handleConsent}
            style={{
              padding: '8px 16px',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            I Understand - Show Raw Content
          </button>
        </div>
      )}

      {showRaw && (
        <div style={{ marginTop: 16 }}>
          <div style={{ color: '#9ca3af', fontSize: 11, marginBottom: 8 }}>RAW CONTENT</div>
          <div
            style={{
              padding: 12,
              backgroundColor: '#111827',
              borderRadius: 6,
              color: '#d1d5db',
              fontSize: 13,
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
            }}
          >
            {message.raw.content}
          </div>
        </div>
      )}
    </div>
  );
}
