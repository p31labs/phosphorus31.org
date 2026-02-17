/**
 * Simple Message Input - Universal Access
 * Large, clear text input for all ages
 */

import React, { useState } from 'react';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import { SimpleButton } from './SimpleButton';

interface SimpleMessageInputProps {
  onSubmit: (message: string) => void;
  placeholder?: string;
  submitLabel?: string;
  maxLength?: number;
}

export const SimpleMessageInput: React.FC<SimpleMessageInputProps> = ({
  onSubmit,
  placeholder = 'Type your message here...',
  submitLabel = 'Send',
  maxLength = 1000,
}) => {
  const [message, setMessage] = useState('');
  const { fontSize, audioFeedback, hapticFeedback } = useAccessibilityStore();

  const handleSubmit = () => {
    if (!message.trim()) return;

    // Haptic feedback
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate([50, 30, 50]); // Success pattern
    }

    // Audio feedback
    if (audioFeedback) {
      const audio = new Audio(
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77+efTQ8MUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUqgc7y2Yk2CBlou+/nn00PDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC'
      );
      audio.play().catch(() => {});
    }

    onSubmit(message.trim());
    setMessage('');
  };

  const inputSize = fontSize === 'xlarge' ? 'xlarge' : fontSize === 'large' ? 'large' : 'medium';

  return (
    <div className="simple-message-input">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`message-textarea input-${inputSize}`}
        rows={fontSize === 'xlarge' ? 4 : fontSize === 'large' ? 3 : 2}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            handleSubmit();
          }
        }}
      />
      <div className="input-footer">
        <span className="char-count">
          {message.length} / {maxLength}
        </span>
        <SimpleButton
          label={submitLabel}
          onClick={handleSubmit}
          variant="primary"
          disabled={!message.trim()}
        />
      </div>
    </div>
  );
};
