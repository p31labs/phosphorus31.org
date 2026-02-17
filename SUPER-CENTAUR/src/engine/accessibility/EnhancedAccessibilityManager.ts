/**
 * Enhanced Accessibility Manager
 * Additional accessibility features for the game engine
 */

// Note: Accessibility store is in UI layer, this is engine-only

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge';
  contrast: 'normal' | 'high';
  simplifiedUI: boolean;
  animationReduced: boolean;
  screenReader: boolean;
  voiceCommands: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  motionSensitivity: 'none' | 'low' | 'medium' | 'high';
  audioFeedback: boolean;
  hapticFeedback: boolean;
}

export class EnhancedAccessibilityManager {
  private settings: AccessibilitySettings;
  private audioContext: AudioContext | null = null;

  constructor() {
    // Default settings
    this.settings = {
      fontSize: 'medium',
      contrast: 'normal',
      simplifiedUI: false,
      animationReduced: false,
      screenReader: false,
      voiceCommands: false,
      colorBlindMode: 'none',
      motionSensitivity: 'none',
      audioFeedback: true,
      hapticFeedback: false
    };

    this.loadSettings();
  }

  /**
   * Initialize accessibility manager
   */
  public async init(): Promise<void> {
    // Initialize audio context for audio feedback
    if (this.settings.audioFeedback) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Audio context not available:', error);
      }
    }

    // Apply settings
    this.applySettings();

    console.log('♿ Enhanced Accessibility Manager initialized');
  }

  /**
   * Load settings from store or localStorage
   */
  private loadSettings(): void {
    try {
      // Try to get from accessibility store (if in React context)
      if (typeof window !== 'undefined' && (window as any).accessibilityStore) {
        const store = (window as any).accessibilityStore;
        this.settings = {
          fontSize: store.fontSize || 'medium',
          contrast: store.contrast || 'normal',
          simplifiedUI: store.simplifiedUI || false,
          animationReduced: store.animationReduced || false,
          screenReader: store.screenReader || false,
          voiceCommands: store.voiceCommands || false,
          colorBlindMode: 'none',
          motionSensitivity: store.animationReduced ? 'high' : 'none',
          audioFeedback: true,
          hapticFeedback: false
        };
      } else {
        // Load from localStorage
        const saved = localStorage.getItem('game_accessibility_settings');
        if (saved) {
          this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    }
  }

  /**
   * Save settings
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('game_accessibility_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  }

  /**
   * Apply accessibility settings
   */
  public applySettings(): void {
    // Apply to document
    if (typeof document !== 'undefined') {
      const root = document.documentElement;

      // Font size
      const fontSizeMap = {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem',
        xlarge: '1.5rem',
        xxlarge: '1.875rem' // 24px minimum for seniors (70+)
      };
      root.style.setProperty('--game-font-size', fontSizeMap[this.settings.fontSize]);

      // High contrast
      if (this.settings.contrast === 'high') {
        root.classList.add('high-contrast');
      } else {
        root.classList.remove('high-contrast');
      }

      // Reduced motion
      if (this.settings.animationReduced || this.settings.motionSensitivity !== 'none') {
        root.classList.add('reduced-motion');
      } else {
        root.classList.remove('reduced-motion');
      }

      // Color blind mode
      if (this.settings.colorBlindMode !== 'none') {
        root.classList.add(`color-blind-${this.settings.colorBlindMode}`);
      } else {
        root.classList.remove('color-blind-protanopia');
        root.classList.remove('color-blind-deuteranopia');
        root.classList.remove('color-blind-tritanopia');
      }
    }
  }

  /**
   * Update settings
   */
  public updateSettings(updates: Partial<AccessibilitySettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
    this.applySettings();

    // Reinitialize audio if needed
    if (updates.audioFeedback && !this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Audio context not available:', error);
      }
    }
  }

  /**
   * Get current settings
   */
  public getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  /**
   * Play audio feedback
   */
  public playAudioFeedback(type: 'success' | 'error' | 'info' | 'warning'): void {
    if (!this.settings.audioFeedback || !this.audioContext) {
      return;
    }

    const frequencies: Record<string, number> = {
      success: 523.25, // C5
      error: 220.00,   // A3
      info: 440.00,     // A4
      warning: 329.63  // E4
    };

    const frequency = frequencies[type] || 440;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.3);
  }

  /**
   * Announce to screen reader
   */
  public announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.settings.screenReader) {
      return;
    }

    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Check if motion should be reduced
   */
  public shouldReduceMotion(): boolean {
    return this.settings.animationReduced || this.settings.motionSensitivity !== 'none';
  }

  /**
   * Get animation speed multiplier
   */
  public getAnimationSpeed(): number {
    if (this.settings.motionSensitivity === 'high') {
      return 0.3; // Very slow
    } else if (this.settings.motionSensitivity === 'medium') {
      return 0.6; // Slow
    } else if (this.settings.motionSensitivity === 'low') {
      return 0.8; // Slightly slow
    }
    return 1.0; // Normal
  }

  /**
   * Check if simplified UI should be used
   */
  public shouldUseSimplifiedUI(): boolean {
    return this.settings.simplifiedUI;
  }

  /**
   * Get color for color blind mode
   */
  public getColor(originalColor: string): string {
    if (this.settings.colorBlindMode === 'none') {
      return originalColor;
    }

    // Color blind color mappings
    const colorMaps: Record<string, Record<string, string>> = {
      protanopia: {
        '#FF0000': '#8B4513', // Red -> Brown
        '#00FF00': '#4169E1', // Green -> Blue
      },
      deuteranopia: {
        '#FF0000': '#FF8C00', // Red -> Orange
        '#00FF00': '#4169E1', // Green -> Blue
      },
      tritanopia: {
        '#0000FF': '#FF1493', // Blue -> Pink
        '#FFFF00': '#FF8C00', // Yellow -> Orange
      }
    };

    const map = colorMaps[this.settings.colorBlindMode];
    return map?.[originalColor] || originalColor;
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}
