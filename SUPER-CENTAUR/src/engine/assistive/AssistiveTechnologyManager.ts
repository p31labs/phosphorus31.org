/**
 * Assistive Technology Manager
 * Comprehensive assistive technology support for universal access
 * 
 * Supports:
 * - Screen readers (NVDA, JAWS, VoiceOver, TalkBack)
 * - Voice control (Dragon, Voice Access, Voice Control)
 * - Switch control
 * - Eye tracking
 * - Haptic feedback
 * - Visual aids
 * - Cognitive support
 */

export interface AssistiveTechConfig {
  enabled: boolean;
  screenReader: {
    enabled: boolean;
    provider: 'auto' | 'nvda' | 'jaws' | 'voiceover' | 'talkback' | 'none';
    verbosity: 'minimal' | 'normal' | 'verbose';
  };
  voiceControl: {
    enabled: boolean;
    provider: 'auto' | 'web-speech' | 'dragon' | 'voice-access' | 'none';
    language: string;
    continuous: boolean;
  };
  switchControl: {
    enabled: boolean;
    switches: number; // 1-4 switches
    scanSpeed: number; // milliseconds
    scanMode: 'linear' | 'row-column' | 'group';
  };
  eyeTracking: {
    enabled: boolean;
    provider: 'auto' | 'tobii' | 'eyetribe' | 'none';
    dwellTime: number; // milliseconds
    calibration: boolean;
  };
  haptic: {
    enabled: boolean;
    intensity: number; // 0-1
    patterns: {
      success: string;
      error: string;
      warning: string;
      info: string;
    };
  };
  visualAids: {
    enabled: boolean;
    highContrast: boolean;
    magnification: number; // 1.0-5.0
    colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
    focusIndicator: boolean;
    cursorSize: 'normal' | 'large' | 'extra-large';
  };
  cognitive: {
    enabled: boolean;
    simplifiedUI: boolean;
    stepByStep: boolean;
    reminders: boolean;
    timeLimits: boolean;
  };
}

export interface ScreenReaderAnnouncement {
  message: string;
  priority: 'polite' | 'assertive' | 'off';
  role?: 'status' | 'alert' | 'log' | 'timer';
}

export interface VoiceCommand {
  command: string;
  action: () => void | Promise<void>;
  description: string;
  keywords: string[];
}

export interface SwitchControlState {
  currentIndex: number;
  items: Array<{ id: string; label: string; action: () => void }>;
  scanning: boolean;
  paused: boolean;
}

export class AssistiveTechnologyManager {
  private config: AssistiveTechConfig;
  private screenReaderElement: HTMLElement | null = null;
  private voiceRecognition: SpeechRecognition | null = null;
  private voiceCommands: Map<string, VoiceCommand> = new Map();
  private switchControlState: SwitchControlState | null = null;
  private switchControlInterval: NodeJS.Timeout | null = null;
  private eyeTrackingActive: boolean = false;
  private hapticPatterns: Map<string, number[]> = new Map();
  private announcementQueue: ScreenReaderAnnouncement[] = [];

  constructor(config?: Partial<AssistiveTechConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      screenReader: {
        enabled: config?.screenReader?.enabled ?? true,
        provider: config?.screenReader?.provider ?? 'auto',
        verbosity: config?.screenReader?.verbosity ?? 'normal'
      },
      voiceControl: {
        enabled: config?.voiceControl?.enabled ?? true,
        provider: config?.voiceControl?.provider ?? 'auto',
        language: config?.voiceControl?.language ?? 'en-US',
        continuous: config?.voiceControl?.continuous ?? false
      },
      switchControl: {
        enabled: config?.switchControl?.enabled ?? false,
        switches: config?.switchControl?.switches ?? 1,
        scanSpeed: config?.switchControl?.scanSpeed ?? 1000,
        scanMode: config?.switchControl?.scanMode ?? 'linear'
      },
      eyeTracking: {
        enabled: config?.eyeTracking?.enabled ?? false,
        provider: config?.eyeTracking?.provider ?? 'auto',
        dwellTime: config?.eyeTracking?.dwellTime ?? 1000,
        calibration: config?.eyeTracking?.calibration ?? false
      },
      haptic: {
        enabled: config?.haptic?.enabled ?? true,
        intensity: config?.haptic?.intensity ?? 0.5,
        patterns: {
          success: config?.haptic?.patterns?.success ?? 'short',
          error: config?.haptic?.patterns?.error ?? 'long',
          warning: config?.haptic?.patterns?.warning ?? 'medium',
          info: config?.haptic?.patterns?.info ?? 'short'
        }
      },
      visualAids: {
        enabled: config?.visualAids?.enabled ?? true,
        highContrast: config?.visualAids?.highContrast ?? false,
        magnification: config?.visualAids?.magnification ?? 1.0,
        colorBlindMode: config?.visualAids?.colorBlindMode ?? 'none',
        focusIndicator: config?.visualAids?.focusIndicator ?? true,
        cursorSize: config?.visualAids?.cursorSize ?? 'normal'
      },
      cognitive: {
        enabled: config?.cognitive?.enabled ?? true,
        simplifiedUI: config?.cognitive?.simplifiedUI ?? false,
        stepByStep: config?.cognitive?.stepByStep ?? false,
        reminders: config?.cognitive?.reminders ?? false,
        timeLimits: config?.cognitive?.timeLimits ?? false
      }
    };

    this.initializeHapticPatterns();
  }

  /**
   * Initialize assistive technology manager
   */
  public async init(): Promise<void> {
    if (!this.config.enabled) {
      console.log('♿ Assistive Technology Manager disabled');
      return;
    }

    // Initialize screen reader support
    if (this.config.screenReader.enabled) {
      this.initializeScreenReader();
    }

    // Initialize voice control
    if (this.config.voiceControl.enabled) {
      await this.initializeVoiceControl();
    }

    // Initialize switch control
    if (this.config.switchControl.enabled) {
      this.initializeSwitchControl();
    }

    // Initialize eye tracking
    if (this.config.eyeTracking.enabled) {
      await this.initializeEyeTracking();
    }

    // Apply visual aids
    if (this.config.visualAids.enabled) {
      this.applyVisualAids();
    }

    // Apply cognitive support
    if (this.config.cognitive.enabled) {
      this.applyCognitiveSupport();
    }

    console.log('♿ Assistive Technology Manager initialized');
  }

  /**
   * Initialize screen reader support
   */
  private initializeScreenReader(): void {
    // Create live region for announcements
    if (typeof document !== 'undefined') {
      this.screenReaderElement = document.createElement('div');
      this.screenReaderElement.setAttribute('role', 'status');
      this.screenReaderElement.setAttribute('aria-live', 'polite');
      this.screenReaderElement.setAttribute('aria-atomic', 'true');
      this.screenReaderElement.className = 'sr-only';
      this.screenReaderElement.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(this.screenReaderElement);
    }

    // Detect screen reader
    const provider = this.detectScreenReader();
    if (provider !== 'none') {
      console.log(`♿ Screen reader detected: ${provider}`);
    }
  }

  /**
   * Detect screen reader
   */
  private detectScreenReader(): string {
    if (typeof window === 'undefined') return 'none';

    // Check for NVDA (Windows)
    if ((window as any).nvda) return 'nvda';

    // Check for JAWS (Windows)
    if ((window as any).jaws) return 'jaws';

    // Check for VoiceOver (macOS/iOS)
    if (navigator.userAgent.includes('Mac') && (window as any).webkitSpeechRecognition) {
      // VoiceOver is typically present on macOS
      return 'voiceover';
    }

    // Check for TalkBack (Android)
    if (navigator.userAgent.includes('Android')) {
      // TalkBack is typically present on Android
      return 'talkback';
    }

    return 'auto';
  }

  /**
   * Announce to screen reader
   */
  public announce(message: string, priority: 'polite' | 'assertive' | 'off' = 'polite', role?: 'status' | 'alert' | 'log' | 'timer'): void {
    if (!this.config.screenReader.enabled || !this.screenReaderElement) return;

    const announcement: ScreenReaderAnnouncement = {
      message,
      priority,
      role
    };

    this.announcementQueue.push(announcement);
    this.processAnnouncementQueue();
  }

  /**
   * Process announcement queue
   */
  private processAnnouncementQueue(): void {
    if (this.announcementQueue.length === 0 || !this.screenReaderElement) return;

    const announcement = this.announcementQueue.shift();
    if (!announcement) return;

    // Update live region
    this.screenReaderElement.setAttribute('aria-live', announcement.priority);
    if (announcement.role) {
      this.screenReaderElement.setAttribute('role', announcement.role);
    }
    this.screenReaderElement.textContent = announcement.message;

    // Clear after announcement
    setTimeout(() => {
      if (this.screenReaderElement) {
        this.screenReaderElement.textContent = '';
      }
    }, 1000);

    // Process next announcement
    if (this.announcementQueue.length > 0) {
      setTimeout(() => this.processAnnouncementQueue(), 1500);
    }
  }

  /**
   * Initialize voice control
   */
  private async initializeVoiceControl(): Promise<void> {
    if (typeof window === 'undefined') return;

    // Check for Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('♿ Web Speech API not available');
      return;
    }

    this.voiceRecognition = new SpeechRecognition();
    this.voiceRecognition.continuous = this.config.voiceControl.continuous;
    this.voiceRecognition.lang = this.config.voiceControl.language;
    this.voiceRecognition.interimResults = false;

    this.voiceRecognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase().trim();
      this.handleVoiceCommand(transcript);
    };

    this.voiceRecognition.onerror = (event: any) => {
      console.warn('♿ Voice recognition error:', event.error);
    };

    // Register default commands
    this.registerDefaultVoiceCommands();
  }

  /**
   * Register default voice commands
   */
  private registerDefaultVoiceCommands(): void {
    this.registerVoiceCommand({
      command: 'start',
      action: () => {
        this.announce('Starting game');
        window.dispatchEvent(new CustomEvent('assistive:startGame'));
      },
      description: 'Start the game',
      keywords: ['start', 'begin', 'play', 'go']
    });

    this.registerVoiceCommand({
      command: 'stop',
      action: () => {
        this.announce('Stopping game');
        window.dispatchEvent(new CustomEvent('assistive:stopGame'));
      },
      description: 'Stop the game',
      keywords: ['stop', 'end', 'quit', 'exit']
    });

    this.registerVoiceCommand({
      command: 'pause',
      action: () => {
        this.announce('Pausing game');
        window.dispatchEvent(new CustomEvent('assistive:pauseGame'));
      },
      description: 'Pause the game',
      keywords: ['pause', 'wait', 'hold']
    });

    this.registerVoiceCommand({
      command: 'resume',
      action: () => {
        this.announce('Resuming game');
        window.dispatchEvent(new CustomEvent('assistive:resumeGame'));
      },
      description: 'Resume the game',
      keywords: ['resume', 'continue', 'unpause']
    });

    this.registerVoiceCommand({
      command: 'help',
      action: () => {
        this.announce('Help menu');
        window.dispatchEvent(new CustomEvent('assistive:showHelp'));
      },
      description: 'Show help',
      keywords: ['help', 'assistance', 'guide']
    });
  }

  /**
   * Register voice command
   */
  public registerVoiceCommand(command: VoiceCommand): void {
    this.voiceCommands.set(command.command, command);
  }

  /**
   * Handle voice command
   */
  private handleVoiceCommand(transcript: string): void {
    // Find matching command
    for (const [key, command] of this.voiceCommands.entries()) {
      if (command.keywords.some(keyword => transcript.includes(keyword))) {
        this.announce(`Executing: ${command.description}`);
        command.action();
        return;
      }
    }

    // No match found
    this.announce('Command not recognized. Say "help" for available commands.');
  }

  /**
   * Start voice recognition
   */
  public startVoiceRecognition(): void {
    if (!this.voiceRecognition || !this.config.voiceControl.enabled) return;

    try {
      this.voiceRecognition.start();
      this.announce('Voice control activated', 'assertive');
    } catch (error) {
      console.warn('Failed to start voice recognition:', error);
    }
  }

  /**
   * Stop voice recognition
   */
  public stopVoiceRecognition(): void {
    if (!this.voiceRecognition) return;

    try {
      this.voiceRecognition.stop();
      this.announce('Voice control deactivated', 'polite');
    } catch (error) {
      console.warn('Failed to stop voice recognition:', error);
    }
  }

  /**
   * Initialize switch control
   */
  private initializeSwitchControl(): void {
    // Switch control requires UI integration
    // This sets up the state management
    this.switchControlState = {
      currentIndex: 0,
      items: [],
      scanning: false,
      paused: false
    };

    // Listen for switch events (from hardware or keyboard)
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (event) => {
        // Space or Enter = select
        if (event.key === ' ' || event.key === 'Enter') {
          this.handleSwitchSelect();
        }
        // Arrow keys = navigate
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
          this.handleSwitchNext();
        }
        if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
          this.handleSwitchPrevious();
        }
      });
    }
  }

  /**
   * Register items for switch control
   */
  public registerSwitchControlItems(items: Array<{ id: string; label: string; action: () => void }>): void {
    if (!this.switchControlState) return;

    this.switchControlState.items = items;
    this.switchControlState.currentIndex = 0;
  }

  /**
   * Start switch control scanning
   */
  public startSwitchControlScanning(): void {
    if (!this.switchControlState || this.switchControlState.items.length === 0) return;

    this.switchControlState.scanning = true;
    this.switchControlState.paused = false;
    this.switchControlState.currentIndex = 0;

    this.scanNextItem();
  }

  /**
   * Stop switch control scanning
   */
  public stopSwitchControlScanning(): void {
    if (!this.switchControlState) return;

    this.switchControlState.scanning = false;
    if (this.switchControlInterval) {
      clearInterval(this.switchControlInterval);
      this.switchControlInterval = null;
    }
  }

  /**
   * Scan next item
   */
  private scanNextItem(): void {
    if (!this.switchControlState || !this.switchControlState.scanning) return;

    const item = this.switchControlState.items[this.switchControlState.currentIndex];
    if (item) {
      // Highlight item
      this.highlightSwitchControlItem(item.id);
      this.announce(item.label, 'polite');

      // Move to next item after scan speed
      this.switchControlInterval = setTimeout(() => {
        this.switchControlState!.currentIndex = 
          (this.switchControlState!.currentIndex + 1) % this.switchControlState!.items.length;
        this.scanNextItem();
      }, this.config.switchControl.scanSpeed);
    }
  }

  /**
   * Handle switch select
   */
  private handleSwitchSelect(): void {
    if (!this.switchControlState || !this.switchControlState.scanning) return;

    const item = this.switchControlState.items[this.switchControlState.currentIndex];
    if (item) {
      this.stopSwitchControlScanning();
      this.announce(`Selected: ${item.label}`, 'assertive');
      item.action();
    }
  }

  /**
   * Handle switch next
   */
  private handleSwitchNext(): void {
    if (!this.switchControlState) return;

    if (this.switchControlState.scanning) {
      this.stopSwitchControlScanning();
    }

    this.switchControlState.currentIndex = 
      (this.switchControlState.currentIndex + 1) % this.switchControlState.items.length;
    
    const item = this.switchControlState.items[this.switchControlState.currentIndex];
    if (item) {
      this.highlightSwitchControlItem(item.id);
      this.announce(item.label, 'polite');
    }
  }

  /**
   * Handle switch previous
   */
  private handleSwitchPrevious(): void {
    if (!this.switchControlState) return;

    if (this.switchControlState.scanning) {
      this.stopSwitchControlScanning();
    }

    this.switchControlState.currentIndex = 
      (this.switchControlState.currentIndex - 1 + this.switchControlState.items.length) % 
      this.switchControlState.items.length;
    
    const item = this.switchControlState.items[this.switchControlState.currentIndex];
    if (item) {
      this.highlightSwitchControlItem(item.id);
      this.announce(item.label, 'polite');
    }
  }

  /**
   * Highlight switch control item
   */
  private highlightSwitchControlItem(itemId: string): void {
    // Emit event for UI to highlight
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('assistive:highlightItem', {
        detail: { itemId }
      }));
    }
  }

  /**
   * Initialize eye tracking
   */
  private async initializeEyeTracking(): Promise<void> {
    // Eye tracking requires hardware integration
    // This is a placeholder for future implementation
    console.log('♿ Eye tracking initialized (placeholder)');
  }

  /**
   * Initialize haptic patterns
   */
  private initializeHapticPatterns(): void {
    // Haptic patterns (vibration sequences)
    this.hapticPatterns.set('short', [50]); // 50ms vibration
    this.hapticPatterns.set('medium', [100]); // 100ms vibration
    this.hapticPatterns.set('long', [200]); // 200ms vibration
    this.hapticPatterns.set('double', [50, 50, 50]); // Double tap
    this.hapticPatterns.set('triple', [50, 50, 50, 50, 50]); // Triple tap
    this.hapticPatterns.set('success', [100, 50, 100]); // Success pattern
    this.hapticPatterns.set('error', [200, 100, 200]); // Error pattern
  }

  /**
   * Trigger haptic feedback
   */
  public triggerHaptic(pattern: 'success' | 'error' | 'warning' | 'info' | string): void {
    if (!this.config.haptic.enabled) return;

    const patternName = typeof pattern === 'string' && 
      ['success', 'error', 'warning', 'info'].includes(pattern)
      ? this.config.haptic.patterns[pattern as keyof typeof this.config.haptic.patterns]
      : pattern;

    const vibrationPattern = this.hapticPatterns.get(patternName) || [100];

    // Use Vibration API if available
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(vibrationPattern);
    }

    // Emit event for custom haptic devices
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('assistive:haptic', {
        detail: { pattern: patternName, vibration: vibrationPattern }
      }));
    }
  }

  /**
   * Apply visual aids
   */
  private applyVisualAids(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // High contrast
    if (this.config.visualAids.highContrast) {
      root.classList.add('high-contrast');
    }

    // Magnification
    root.style.setProperty('--magnification', this.config.visualAids.magnification.toString());

    // Color blind mode
    if (this.config.visualAids.colorBlindMode !== 'none') {
      root.classList.add(`color-blind-${this.config.visualAids.colorBlindMode}`);
    }

    // Focus indicator
    if (this.config.visualAids.focusIndicator) {
      root.classList.add('focus-indicator');
    }

    // Cursor size
    root.style.setProperty('--cursor-size', this.getCursorSize());
  }

  /**
   * Get cursor size CSS value
   */
  private getCursorSize(): string {
    const sizes = {
      normal: '16px',
      large: '24px',
      'extra-large': '32px'
    };
    return sizes[this.config.visualAids.cursorSize] || sizes.normal;
  }

  /**
   * Apply cognitive support
   */
  private applyCognitiveSupport(): void {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Simplified UI
    if (this.config.cognitive.simplifiedUI) {
      root.classList.add('simplified-ui');
    }

    // Step by step
    if (this.config.cognitive.stepByStep) {
      root.classList.add('step-by-step');
    }

    // Reminders
    if (this.config.cognitive.reminders) {
      // Set up reminder system
      this.setupReminders();
    }
  }

  /**
   * Setup reminders
   */
  private setupReminders(): void {
    // Reminder system for cognitive support
    // Can remind users of actions, breaks, etc.
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<AssistiveTechConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Reapply settings
    if (this.config.visualAids.enabled) {
      this.applyVisualAids();
    }
    if (this.config.cognitive.enabled) {
      this.applyCognitiveSupport();
    }
  }

  /**
   * Get configuration
   */
  public getConfig(): AssistiveTechConfig {
    return { ...this.config };
  }

  /**
   * Get available voice commands
   */
  public getVoiceCommands(): VoiceCommand[] {
    return Array.from(this.voiceCommands.values());
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.stopVoiceRecognition();
    this.stopSwitchControlScanning();

    if (this.screenReaderElement && this.screenReaderElement.parentNode) {
      this.screenReaderElement.parentNode.removeChild(this.screenReaderElement);
      this.screenReaderElement = null;
    }

    this.voiceCommands.clear();
    this.hapticPatterns.clear();
    this.announcementQueue = [];
  }
}
