/**
 * Child Safety Manager
 * Comprehensive safety features for children using the game engine
 */

export interface ChildSafetyConfig {
  enabled: boolean;
  maxPlayTime: number; // minutes
  breakInterval: number; // minutes
  breakDuration: number; // minutes
  contentFiltering: boolean;
  safeMode: boolean;
  requireParentalApproval: boolean;
  ageRestrictions: {
    minAge: number;
    maxAge?: number;
  };
}

export interface PlaySession {
  startTime: number;
  totalPlayTime: number; // minutes
  lastBreakTime: number;
  breakCount: number;
}

export class ChildSafetyManager {
  private config: ChildSafetyConfig;
  private currentSession: PlaySession | null = null;
  private playTimeWarningShown: boolean = false;
  private breakWarningShown: boolean = false;
  private breakTimer: NodeJS.Timeout | null = null;
  private playTimeTimer: NodeJS.Timeout | null = null;

  constructor(config?: Partial<ChildSafetyConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      maxPlayTime: config?.maxPlayTime ?? 60, // 1 hour default
      breakInterval: config?.breakInterval ?? 30, // 30 minutes
      breakDuration: config?.breakDuration ?? 5, // 5 minutes
      contentFiltering: config?.contentFiltering ?? true,
      safeMode: config?.safeMode ?? true,
      requireParentalApproval: config?.requireParentalApproval ?? false,
      ageRestrictions: config?.ageRestrictions || { minAge: 4 }
    };
  }

  /**
   * Initialize child safety manager
   */
  public async init(): Promise<void> {
    if (!this.config.enabled) {
      console.log('🛡️ Child Safety Manager disabled');
      return;
    }

    console.log('🛡️ Child Safety Manager initialized');
    this.loadSavedSession();
  }

  /**
   * Start a play session
   */
  public startSession(userAge?: number): boolean {
    if (!this.config.enabled) return true;

    // Check age restrictions
    if (userAge && userAge < this.config.ageRestrictions.minAge) {
      console.warn(`🛡️ User age ${userAge} below minimum ${this.config.ageRestrictions.minAge}`);
      return false;
    }

    if (userAge && this.config.ageRestrictions.maxAge && userAge > this.config.ageRestrictions.maxAge) {
      console.warn(`🛡️ User age ${userAge} above maximum ${this.config.ageRestrictions.maxAge}`);
      return false;
    }

    this.currentSession = {
      startTime: Date.now(),
      totalPlayTime: 0,
      lastBreakTime: Date.now(),
      breakCount: 0
    };

    this.saveSession();
    this.startTimers();

    console.log('🛡️ Play session started');
    return true;
  }

  /**
   * End current session
   */
  public endSession(): void {
    if (!this.currentSession) return;

    this.stopTimers();
    this.saveSession();
    this.currentSession = null;

    console.log('🛡️ Play session ended');
  }

  /**
   * Update session (called from game loop)
   */
  public update(deltaTime: number): void {
    if (!this.config.enabled || !this.currentSession) return;

    const now = Date.now();
    const sessionDuration = (now - this.currentSession.startTime) / 60000; // minutes
    const timeSinceBreak = (now - this.currentSession.lastBreakTime) / 60000; // minutes

    // Check for break needed
    if (timeSinceBreak >= this.config.breakInterval && !this.breakWarningShown) {
      this.requestBreak();
      this.breakWarningShown = true;
    }

    // Check for max play time
    if (sessionDuration >= this.config.maxPlayTime && !this.playTimeWarningShown) {
      this.requestSessionEnd();
      this.playTimeWarningShown = true;
    }

    // Update total play time
    this.currentSession.totalPlayTime = sessionDuration;
  }

  /**
   * Request break
   */
  private requestBreak(): void {
    console.log('🛡️ Break time requested');
    
    // Emit event for UI to show break notification
    this.emitBreakNotification();

    // Auto-pause after warning period
    setTimeout(() => {
      this.forceBreak();
    }, 60000); // 1 minute warning
  }

  /**
   * Force break
   */
  private forceBreak(): void {
    console.log('🛡️ Forcing break');
    
    // Emit event to pause game
    this.emitForceBreak();

    // Start break timer
    this.breakTimer = setTimeout(() => {
      this.endBreak();
    }, this.config.breakDuration * 60000);
  }

  /**
   * End break
   */
  private endBreak(): void {
    if (this.breakTimer) {
      clearTimeout(this.breakTimer);
      this.breakTimer = null;
    }

    if (this.currentSession) {
      this.currentSession.lastBreakTime = Date.now();
      this.currentSession.breakCount++;
      this.breakWarningShown = false;
    }

    console.log('🛡️ Break ended');
    this.emitBreakEnded();
  }

  /**
   * Request session end
   */
  private requestSessionEnd(): void {
    console.log('🛡️ Max play time reached');
    this.emitSessionEndWarning();
  }

  /**
   * Force session end
   */
  public forceSessionEnd(): void {
    console.log('🛡️ Forcing session end');
    this.endSession();
    this.emitSessionEnded();
  }

  /**
   * Check if content is safe
   */
  public isContentSafe(content: string): boolean {
    if (!this.config.contentFiltering) return true;

    // Blocked words/phrases (simplified - in production, use comprehensive list)
    const blockedPatterns = [
      /violence/i,
      /weapon/i,
      /kill/i,
      /death/i,
      /hate/i,
      /curse/i
    ];

    return !blockedPatterns.some(pattern => pattern.test(content));
  }

  /**
   * Filter structure name
   */
  public filterStructureName(name: string): string {
    if (!this.config.contentFiltering) return name;

    // Remove or replace unsafe content
    let filtered = name;
    
    // Simple filtering (in production, use more sophisticated system)
    const unsafeWords = ['violence', 'weapon', 'kill', 'death', 'hate'];
    unsafeWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      filtered = filtered.replace(regex, '***');
    });

    return filtered;
  }

  /**
   * Check if action requires parental approval
   */
  public requiresParentalApproval(action: string): boolean {
    if (!this.config.requireParentalApproval) return false;

    const restrictedActions = [
      'delete_structure',
      'share_structure',
      'export_data',
      'change_settings',
      'disable_safety'
    ];

    return restrictedActions.includes(action);
  }

  /**
   * Get remaining play time
   */
  public getRemainingPlayTime(): number {
    if (!this.currentSession) return this.config.maxPlayTime;

    const elapsed = (Date.now() - this.currentSession.startTime) / 60000;
    return Math.max(0, this.config.maxPlayTime - elapsed);
  }

  /**
   * Get time until next break
   */
  public getTimeUntilBreak(): number {
    if (!this.currentSession) return this.config.breakInterval;

    const elapsed = (Date.now() - this.currentSession.lastBreakTime) / 60000;
    return Math.max(0, this.config.breakInterval - elapsed);
  }

  /**
   * Get session statistics
   */
  public getSessionStats(): PlaySession | null {
    return this.currentSession ? { ...this.currentSession } : null;
  }

  /**
   * Start timers
   */
  private startTimers(): void {
    // Check every minute
    this.playTimeTimer = setInterval(() => {
      if (this.currentSession) {
        this.update(0);
      }
    }, 60000);
  }

  /**
   * Stop timers
   */
  private stopTimers(): void {
    if (this.playTimeTimer) {
      clearInterval(this.playTimeTimer);
      this.playTimeTimer = null;
    }

    if (this.breakTimer) {
      clearTimeout(this.breakTimer);
      this.breakTimer = null;
    }
  }

  /**
   * Save session to localStorage
   */
  private saveSession(): void {
    try {
      if (this.currentSession) {
        localStorage.setItem('child_safety_session', JSON.stringify(this.currentSession));
      } else {
        localStorage.removeItem('child_safety_session');
      }
    } catch (error) {
      console.warn('Failed to save session:', error);
    }
  }

  /**
   * Load saved session
   */
  private loadSavedSession(): void {
    try {
      const saved = localStorage.getItem('child_safety_session');
      if (saved) {
        this.currentSession = JSON.parse(saved);
        // Check if session is still valid (not older than 24 hours)
        const age = (Date.now() - this.currentSession!.startTime) / 3600000;
        if (age > 24) {
          this.currentSession = null;
          localStorage.removeItem('child_safety_session');
        }
      }
    } catch (error) {
      console.warn('Failed to load session:', error);
    }
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<ChildSafetyConfig>): void {
    this.config = { ...this.config, ...config };
    this.saveConfig();
  }

  /**
   * Get configuration
   */
  public getConfig(): ChildSafetyConfig {
    return { ...this.config };
  }

  /**
   * Save configuration
   */
  private saveConfig(): void {
    try {
      localStorage.setItem('child_safety_config', JSON.stringify(this.config));
    } catch (error) {
      console.warn('Failed to save config:', error);
    }
  }

  /**
   * Event emitters (to be connected to UI)
   */
  private emitBreakNotification(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('childSafety:breakRequested', {
        detail: { duration: this.config.breakDuration }
      }));
    }
  }

  private emitForceBreak(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('childSafety:breakForced', {
        detail: { duration: this.config.breakDuration }
      }));
    }
  }

  private emitBreakEnded(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('childSafety:breakEnded'));
    }
  }

  private emitSessionEndWarning(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('childSafety:sessionEndWarning'));
    }
  }

  private emitSessionEnded(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('childSafety:sessionEnded'));
    }
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.stopTimers();
    this.endSession();
  }
}
