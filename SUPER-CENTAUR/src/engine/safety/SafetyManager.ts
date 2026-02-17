/**
 * Safety Manager
 * Centralized safety management combining all safety features
 */

import { ChildSafetyManager, ChildSafetyConfig } from './ChildSafetyManager';
import { PhysicalSafetyManager, PhysicalSafetyConfig } from './PhysicalSafetyManager';
import { PrivacySafetyManager, PrivacyConfig } from './PrivacySafetyManager';

export interface SafetyConfig {
  childSafety: Partial<ChildSafetyConfig>;
  physicalSafety: Partial<PhysicalSafetyConfig>;
  privacy: Partial<PrivacyConfig>;
}

export class SafetyManager {
  private childSafety: ChildSafetyManager;
  private physicalSafety: PhysicalSafetyManager;
  private privacySafety: PrivacySafetyManager;

  constructor(config?: Partial<SafetyConfig>) {
    this.childSafety = new ChildSafetyManager(config?.childSafety);
    this.physicalSafety = new PhysicalSafetyManager(config?.physicalSafety);
    this.privacySafety = new PrivacySafetyManager(config?.privacy);
  }

  /**
   * Initialize all safety managers
   */
  public async init(): Promise<void> {
    await Promise.all([
      this.childSafety.init(),
      this.physicalSafety.init(),
      this.privacySafety.init()
    ]);

    console.log('🛡️ Safety Manager initialized');
  }

  /**
   * Start play session with safety checks
   */
  public async startSession(userAge?: number): Promise<boolean> {
    // Request privacy consent if needed
    const hasConsent = await this.privacySafety.requestConsent();
    if (!hasConsent) {
      console.warn('🛡️ Privacy consent required');
      return false;
    }

    // Start child safety session
    return this.childSafety.startSession(userAge);
  }

  /**
   * End play session
   */
  public endSession(): void {
    this.childSafety.endSession();
  }

  /**
   * Update safety checks (called from game loop)
   */
  public update(deltaTime: number): void {
    this.childSafety.update(deltaTime);
  }

  /**
   * Check camera movement for physical safety
   */
  public checkCameraMovement(
    velocity: { x: number; y: number; z: number },
    rotationVelocity: { x: number; y: number; z: number }
  ): { safe: boolean; warnings: string[] } {
    return this.physicalSafety.checkCameraMovement(velocity, rotationVelocity);
  }

  /**
   * Check visual effects for seizure triggers
   */
  public checkVisualEffects(
    flashRate: number,
    contrast: number,
    colorChanges: number
  ): { safe: boolean; warnings: string[] } {
    return this.physicalSafety.checkVisualEffects(flashRate, contrast, colorChanges);
  }

  /**
   * Check if content is safe
   */
  public isContentSafe(content: string): boolean {
    return this.childSafety.isContentSafe(content);
  }

  /**
   * Filter structure name
   */
  public filterStructureName(name: string): string {
    return this.childSafety.filterStructureName(name);
  }

  /**
   * Check if action requires parental approval
   */
  public requiresParentalApproval(action: string): boolean {
    return this.childSafety.requiresParentalApproval(action);
  }

  /**
   * Get child safety manager
   */
  public getChildSafety(): ChildSafetyManager {
    return this.childSafety;
  }

  /**
   * Get physical safety manager
   */
  public getPhysicalSafety(): PhysicalSafetyManager {
    return this.physicalSafety;
  }

  /**
   * Get privacy safety manager
   */
  public getPrivacySafety(): PrivacySafetyManager {
    return this.privacySafety;
  }

  /**
   * Dispose all safety managers
   */
  public dispose(): void {
    this.childSafety.dispose();
    this.physicalSafety.dispose();
    this.privacySafety.dispose();
  }
}
