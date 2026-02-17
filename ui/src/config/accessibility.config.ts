/**
 * Accessibility Configuration - Universal Access
 * Supports users from 6 to 70+ with adaptive interfaces
 */

export type AccessibilityMode = 'child' | 'senior' | 'standard';

export interface AccessibilityConfig {
  mode: AccessibilityMode;
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  contrast: 'normal' | 'high';
  audioFeedback: boolean;
  hapticFeedback: boolean;
  screenReader: boolean;
  simplifiedUI: boolean;
  voiceCommands: boolean;
  animationReduced: boolean;
}

export const AccessibilityPresets: Record<AccessibilityMode, Partial<AccessibilityConfig>> = {
  child: {
    fontSize: 'large',
    contrast: 'high',
    audioFeedback: true,
    hapticFeedback: true,
    simplifiedUI: true,
    voiceCommands: true,
    animationReduced: false, // Kids like animations
  },
  senior: {
    fontSize: 'xlarge',
    contrast: 'high',
    audioFeedback: true,
    hapticFeedback: true,
    simplifiedUI: true,
    voiceCommands: true,
    animationReduced: true, // Reduce motion for comfort
  },
  standard: {
    fontSize: 'medium',
    contrast: 'normal',
    audioFeedback: false,
    hapticFeedback: true,
    simplifiedUI: false,
    voiceCommands: false,
    animationReduced: false,
  },
};

export const defaultAccessibilityConfig: AccessibilityConfig = {
  mode: 'standard',
  fontSize: 'medium',
  contrast: 'normal',
  audioFeedback: false,
  hapticFeedback: true,
  screenReader: false,
  simplifiedUI: false,
  voiceCommands: false,
  animationReduced: false,
};
