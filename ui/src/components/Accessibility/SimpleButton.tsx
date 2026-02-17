/**
 * Simple Button - Universal Access
 * Large, clear, haptic-enabled button for all ages
 */

import React from 'react';
import { useAccessibilityStore } from '../../stores/accessibility.store';

interface SimpleButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  icon?: React.ReactNode;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const SimpleButton: React.FC<SimpleButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  size,
  icon,
  disabled = false,
  fullWidth = false,
}) => {
  const { fontSize, hapticFeedback, audioFeedback, simplifiedUI } = useAccessibilityStore();

  // Auto-size based on accessibility mode
  const buttonSize =
    size || (fontSize === 'xlarge' ? 'xlarge' : fontSize === 'large' ? 'large' : 'medium');

  const handleClick = () => {
    if (disabled) return;

    // Haptic feedback
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(50); // Short pulse
    }

    // Audio feedback
    if (audioFeedback) {
      const audio = new Audio(
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIGWi77+efTQ8MUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606euoVRQKRp/g8r5sIQUqgc7y2Yk2CBlou+/nn00PDFCn4/C2YxwGOJHX8sx5LAUkd8fw3ZBAC'
      );
      audio.play().catch(() => {}); // Ignore errors
    }

    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={`simple-button button-${variant} button-${buttonSize} ${fullWidth ? 'full-width' : ''} ${simplifiedUI ? 'simplified' : ''}`}
      aria-label={label}
    >
      {icon && <span className="button-icon">{icon}</span>}
      <span className="button-label">{label}</span>
    </button>
  );
};
