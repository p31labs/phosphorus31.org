/**
 * Accessibility Store
 * Manages universal access settings for all users
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  AccessibilityConfig,
  AccessibilityMode,
  AccessibilityPresets,
  defaultAccessibilityConfig,
} from '../config/accessibility.config';

interface AccessibilityStore extends AccessibilityConfig {
  setMode: (mode: AccessibilityMode) => void;
  setFontSize: (size: AccessibilityConfig['fontSize']) => void;
  setContrast: (contrast: AccessibilityConfig['contrast']) => void;
  setHighContrast: (enabled: boolean) => void;
  toggleAudioFeedback: () => void;
  toggleHapticFeedback: () => void;
  toggleScreenReader: () => void;
  toggleSimplifiedUI: () => void;
  toggleVoiceCommands: () => void;
  toggleAnimationReduced: () => void;
  applyPreset: (mode: AccessibilityMode) => void;
  reset: () => void;
}

export const useAccessibilityStore = create<AccessibilityStore>()(
  devtools(
    (set, get) => ({
      ...defaultAccessibilityConfig,

      setMode: (mode) => {
        set({ mode });
        get().applyPreset(mode);
      },

      setFontSize: (fontSize) => set({ fontSize }),

      setContrast: (contrast) => set({ contrast }),

      toggleAudioFeedback: () => set((state) => ({ audioFeedback: !state.audioFeedback })),

      toggleHapticFeedback: () => set((state) => ({ hapticFeedback: !state.hapticFeedback })),

      toggleScreenReader: () => set((state) => ({ screenReader: !state.screenReader })),

      toggleSimplifiedUI: () => set((state) => ({ simplifiedUI: !state.simplifiedUI })),

      toggleHighContrast: () =>
        set((state) => ({
          contrast: state.contrast === 'high' ? 'normal' : 'high',
        })),

      setHighContrast: (enabled: boolean) => set({ contrast: enabled ? 'high' : 'normal' }),

      toggleVoiceCommands: () => set((state) => ({ voiceCommands: !state.voiceCommands })),

      toggleAnimationReduced: () => set((state) => ({ animationReduced: !state.animationReduced })),

      applyPreset: (mode) => {
        const preset = AccessibilityPresets[mode];
        set((state) => ({
          ...state,
          ...preset,
          mode,
        }));
      },

      reset: () => set(defaultAccessibilityConfig),
    }),
    { name: 'AccessibilityStore' }
  )
);
