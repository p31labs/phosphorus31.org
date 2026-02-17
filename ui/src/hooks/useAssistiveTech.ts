/**
 * useAssistiveTech Hook
 * P31 - The Scope
 * Convenience hook for assistive technology features
 *
 * Provides access to:
 * - Screen reader announcements
 * - Voice control
 * - Switch control
 * - Haptic feedback
 * - Visual aids
 *
 * Part of P31's universal accessibility architecture.
 * 💜 With love and light. As above, so below. 💜
 */

import { useEffect, useState, useCallback } from 'react';
import { useAssistiveTech as useAssistiveTechContext } from '../components/AssistiveTech/AssistiveTechProvider';

export interface UseAssistiveTechReturn {
  // Manager and config
  manager: ReturnType<typeof useAssistiveTechContext>['manager'];
  config: ReturnType<typeof useAssistiveTechContext>['config'];

  // Configuration
  updateConfig: ReturnType<typeof useAssistiveTechContext>['updateConfig'];

  // Screen reader
  announce: ReturnType<typeof useAssistiveTechContext>['announce'];

  // Haptic feedback
  triggerHaptic: ReturnType<typeof useAssistiveTechContext>['triggerHaptic'];

  // Voice control
  startVoiceControl: ReturnType<typeof useAssistiveTechContext>['startVoiceControl'];
  stopVoiceControl: ReturnType<typeof useAssistiveTechContext>['stopVoiceControl'];
  isVoiceControlActive: boolean;

  // Switch control
  registerSwitchItems: ReturnType<typeof useAssistiveTechContext>['registerSwitchItems'];
  startSwitchControl: ReturnType<typeof useAssistiveTechContext>['startSwitchControl'];
  stopSwitchControl: ReturnType<typeof useAssistiveTechContext>['stopSwitchControl'];
  isSwitchControlActive: boolean;

  // Highlight state
  highlightedItem: string | null;
}

export const useAssistiveTech = (): UseAssistiveTechReturn => {
  const context = useAssistiveTechContext();
  const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const [isVoiceControlActive, setIsVoiceControlActive] = useState(false);
  const [isSwitchControlActive, setIsSwitchControlActive] = useState(false);

  // Set up switch control highlight listener
  useEffect(() => {
    const handleHighlight = (e: CustomEvent<{ itemId: string }>) => {
      setHighlightedItem(e.detail.itemId);
    };

    const handleClearHighlight = () => {
      setHighlightedItem(null);
    };

    window.addEventListener('assistive:highlightItem', handleHighlight as EventListener);
    window.addEventListener('assistive:clearHighlight', handleClearHighlight);

    return () => {
      window.removeEventListener('assistive:highlightItem', handleHighlight as EventListener);
      window.removeEventListener('assistive:clearHighlight', handleClearHighlight);
    };
  }, []);

  // Enhanced voice control with state tracking
  const startVoiceControl = useCallback(() => {
    context.startVoiceControl();
    setIsVoiceControlActive(true);
  }, [context]);

  const stopVoiceControl = useCallback(() => {
    context.stopVoiceControl();
    setIsVoiceControlActive(false);
  }, [context]);

  // Enhanced switch control with state tracking
  const startSwitchControl = useCallback(() => {
    context.startSwitchControl();
    setIsSwitchControlActive(true);
  }, [context]);

  const stopSwitchControl = useCallback(() => {
    context.stopSwitchControl();
    setIsSwitchControlActive(false);
  }, [context]);

  return {
    ...context,
    startVoiceControl,
    stopVoiceControl,
    isVoiceControlActive,
    startSwitchControl,
    stopSwitchControl,
    isSwitchControlActive,
    highlightedItem,
  };
};
