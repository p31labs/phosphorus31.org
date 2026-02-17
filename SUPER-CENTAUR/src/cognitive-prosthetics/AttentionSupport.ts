/**
 * Attention Support
 * Cognitive prosthetic for attention and focus support
 * 
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import { Logger } from '../utils/logger';

export interface AttentionState {
  focusLevel: number; // 0-100
  distractionLevel: number; // 0-100
  taskComplexity: number; // 0-100
  environmentalNoise: number; // 0-100
  timestamp: number;
}

export interface FocusSession {
  id: string;
  startTime: number;
  endTime: number | null;
  duration: number;
  focusScore: number;
  distractions: number;
  breaks: number;
}

export class AttentionSupport {
  private logger: Logger;
  private currentSession: FocusSession | null = null;
  private sessionHistory: FocusSession[] = [];
  private pomodoroTimer: NodeJS.Timeout | null = null;
  private pomodoroDuration: number = 25 * 60 * 1000; // 25 minutes
  private breakDuration: number = 5 * 60 * 1000; // 5 minutes
  private isOnBreak: boolean = false;

  constructor() {
    this.logger = new Logger('AttentionSupport');
  }

  /**
   * Start focus session
   */
  public startSession(): FocusSession {
    const session: FocusSession = {
      id: `session_${Date.now()}`,
      startTime: Date.now(),
      endTime: null,
      duration: 0,
      focusScore: 0,
      distractions: 0,
      breaks: 0,
    };

    this.currentSession = session;
    this.logger.info('Focus session started');
    return session;
  }

  /**
   * End focus session
   */
  public endSession(): FocusSession | null {
    if (!this.currentSession) return null;

    this.currentSession.endTime = Date.now();
    this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
    
    this.sessionHistory.push(this.currentSession);
    const session = this.currentSession;
    this.currentSession = null;

    this.logger.info(`Focus session ended. Duration: ${Math.round(session.duration / 1000 / 60)} minutes`);
    return session;
  }

  /**
   * Start Pomodoro timer
   */
  public startPomodoro(onComplete?: () => void): void {
    if (this.pomodoroTimer) {
      this.stopPomodoro();
    }

    this.isOnBreak = false;
    this.logger.info('Pomodoro timer started (25 minutes)');

    this.pomodoroTimer = setTimeout(() => {
      this.logger.info('Pomodoro complete! Time for a break.');
      this.isOnBreak = true;
      
      if (onComplete) {
        onComplete();
      }

      // Auto-start break timer
      this.startBreak(() => {
        this.logger.info('Break complete! Ready to focus again.');
      });
    }, this.pomodoroDuration);
  }

  /**
   * Start break timer
   */
  public startBreak(onComplete?: () => void): void {
    if (this.pomodoroTimer) {
      this.stopPomodoro();
    }

    this.isOnBreak = true;
    this.logger.info('Break timer started (5 minutes)');

    this.pomodoroTimer = setTimeout(() => {
      this.isOnBreak = false;
      this.pomodoroTimer = null;
      
      if (onComplete) {
        onComplete();
      }
    }, this.breakDuration);
  }

  /**
   * Stop Pomodoro timer
   */
  public stopPomodoro(): void {
    if (this.pomodoroTimer) {
      clearTimeout(this.pomodoroTimer);
      this.pomodoroTimer = null;
      this.isOnBreak = false;
      this.logger.info('Pomodoro timer stopped');
    }
  }

  /**
   * Record distraction
   */
  public recordDistraction(): void {
    if (this.currentSession) {
      this.currentSession.distractions++;
      this.logger.debug('Distraction recorded');
    }
  }

  /**
   * Record break
   */
  public recordBreak(): void {
    if (this.currentSession) {
      this.currentSession.breaks++;
      this.logger.debug('Break recorded');
    }
  }

  /**
   * Update focus score
   */
  public updateFocusScore(score: number): void {
    if (this.currentSession) {
      this.currentSession.focusScore = score;
    }
  }

  /**
   * Get current session
   */
  public getCurrentSession(): FocusSession | null {
    return this.currentSession;
  }

  /**
   * Get session history
   */
  public getSessionHistory(limit: number = 10): FocusSession[] {
    return this.sessionHistory.slice(-limit);
  }

  /**
   * Get average focus score
   */
  public getAverageFocusScore(): number {
    if (this.sessionHistory.length === 0) return 0;

    const total = this.sessionHistory.reduce((sum, session) => sum + session.focusScore, 0);
    return Math.round(total / this.sessionHistory.length);
  }

  /**
   * Check if on break
   */
  public isOnBreakTime(): boolean {
    return this.isOnBreak;
  }

  /**
   * Get time remaining in current timer
   */
  public getTimeRemaining(): number {
    // This would need to track start time to calculate remaining
    // For now, return 0
    return 0;
  }

  /**
   * Dispose and cleanup
   */
  public dispose(): void {
    this.stopPomodoro();
    this.endSession();
    this.sessionHistory = [];
    this.logger.info('Attention Support disposed');
  }
}
