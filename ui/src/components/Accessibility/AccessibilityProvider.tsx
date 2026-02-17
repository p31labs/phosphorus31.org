/**
 * Accessibility Provider
 * Applies accessibility settings globally
 */

import React, { useEffect } from 'react';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import { AccessibilityShortcuts } from './AccessibilityShortcuts';
import { AccessibilityAnnouncer } from './AccessibilityAnnouncer';

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { fontSize, contrast, audioFeedback, screenReader, simplifiedUI, animationReduced } =
    useAccessibilityStore();

  useEffect(() => {
    // Apply font size
    const root = document.documentElement;
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '20px',
      xlarge: '24px',
    };
    root.style.fontSize = fontSizeMap[fontSize];

    // Apply contrast
    if (contrast === 'high') {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (animationReduced) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }

    // Apply screen reader support
    if (screenReader) {
      root.setAttribute('aria-live', 'polite');
      root.setAttribute('role', 'application');
    }
  }, [fontSize, contrast, screenReader, animationReduced]);

  return (
    <>
      <AccessibilityShortcuts />
      <AccessibilityAnnouncer />
      {children}
    </>
  );
};
