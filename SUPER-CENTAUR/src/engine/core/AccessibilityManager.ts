/**
 * Accessibility Manager for Game Engine
 * Provides accessibility features for neurodivergent users
 */

export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  soundEffects: boolean;
  hapticFeedback: boolean;
  screenReader: boolean;
  simplifiedUI: boolean;
}

export class AccessibilityManager {
  private settings: AccessibilitySettings;
  private listeners: Map<string, (settings: AccessibilitySettings) => void> = new Map();

  constructor(initialSettings?: AccessibilitySettings) {
    this.settings = initialSettings || {
      highContrast: false,
      reducedMotion: false,
      colorBlindMode: 'none',
      fontSize: 'medium',
      soundEffects: true,
      hapticFeedback: true,
      screenReader: false,
      simplifiedUI: false
    };

    // Load from localStorage if available
    this.loadSettings();
  }

  /**
   * Update accessibility settings
   */
  public updateSettings(updates: Partial<AccessibilitySettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
    this.notifyListeners();
  }

  /**
   * Get current settings
   */
  public getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  /**
   * Apply accessibility settings to DOM
   */
  public applySettings(): void {
    const root = document.documentElement;
    
    // High contrast
    if (this.settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (this.settings.reducedMotion) {
      root.classList.add('reduced-motion');
      root.style.setProperty('--animation-duration', '0s');
    } else {
      root.classList.remove('reduced-motion');
      root.style.removeProperty('--animation-duration');
    }

    // Color blind mode
    root.setAttribute('data-color-blind', this.settings.colorBlindMode);

    // Font size
    root.setAttribute('data-font-size', this.settings.fontSize);

    // Simplified UI
    if (this.settings.simplifiedUI) {
      root.classList.add('simplified-ui');
    } else {
      root.classList.remove('simplified-ui');
    }
  }

  /**
   * Register listener for settings changes
   */
  public onSettingsChange(id: string, callback: (settings: AccessibilitySettings) => void): void {
    this.listeners.set(id, callback);
  }

  /**
   * Remove listener
   */
  public removeListener(id: string): void {
    this.listeners.delete(id);
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.settings));
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    try {
      localStorage.setItem('game_accessibility_settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to save accessibility settings:', error);
    }
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    try {
      const saved = localStorage.getItem('game_accessibility_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.warn('Failed to load accessibility settings:', error);
    }
  }

  /**
   * Check if reduced motion is enabled
   */
  public isReducedMotion(): boolean {
    return this.settings.reducedMotion || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Check if high contrast is enabled
   */
  public isHighContrast(): boolean {
    return this.settings.highContrast || window.matchMedia('(prefers-contrast: high)').matches;
  }
}
