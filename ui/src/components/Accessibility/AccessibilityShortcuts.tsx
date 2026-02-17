/**
 * Accessibility Shortcuts
 * Keyboard shortcuts for power users
 */

import React, { useEffect } from 'react';
import { useAccessibilityStore } from '../../stores/accessibility.store';

export const AccessibilityShortcuts: React.FC = () => {
  const { applyPreset, toggleSimplifiedUI, setContrast, setFontSize } = useAccessibilityStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Alt + 1 = Child Mode
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        applyPreset('child');
      }

      // Alt + 2 = Senior Mode
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        applyPreset('senior');
      }

      // Alt + 3 = Standard Mode
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        applyPreset('standard');
      }

      // Alt + S = Toggle Simplified UI
      if (e.altKey && e.key === 's') {
        e.preventDefault();
        toggleSimplifiedUI();
      }

      // Alt + C = Toggle High Contrast
      if (e.altKey && e.key === 'c') {
        e.preventDefault();
        const { contrast } = useAccessibilityStore.getState();
        setContrast(contrast === 'high' ? 'normal' : 'high');
      }

      // Alt + + = Increase Font Size
      if (e.altKey && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        const { fontSize } = useAccessibilityStore.getState();
        if (fontSize === 'small') setFontSize('medium');
        else if (fontSize === 'medium') setFontSize('large');
        else if (fontSize === 'large') setFontSize('xlarge');
      }

      // Alt + - = Decrease Font Size
      if (e.altKey && e.key === '-') {
        e.preventDefault();
        const { fontSize } = useAccessibilityStore.getState();
        if (fontSize === 'xlarge') setFontSize('large');
        else if (fontSize === 'large') setFontSize('medium');
        else if (fontSize === 'medium') setFontSize('small');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [applyPreset, toggleSimplifiedUI, setContrast, setFontSize]);

  return null; // This component doesn't render anything
};
