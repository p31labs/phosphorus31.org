/**
 * Senior Mode Manager
 * Handles senior-specific features and profiles for users 65+
 */

export interface SeniorProfile {
  id: string;
  displayName: string;
  age: number;
  tier: 'senior';
  priorities: string[];
  createdAt: number;
  lastActive: number;
}

export interface SeniorSettings {
  fontSize: 'xxlarge';
  contrast: 'high';
  simplifiedUI: true;
  animationReduced: true;
  motionSensitivity: 'high';
  audioFeedback: true;
  hapticFeedback: true;
  voiceCommands: true;
  screenReader: true;
  largeTargets: true; // 48px+ touch targets
  clearLabels: true; // Explicit text labels
  noGestures: true; // Avoid complex gestures
}

export class SeniorMode {
  private profiles: Map<string, SeniorProfile> = new Map();
  private defaultSettings: SeniorSettings;

  constructor() {
    this.defaultSettings = {
      fontSize: 'xxlarge',
      contrast: 'high',
      simplifiedUI: true,
      animationReduced: true,
      motionSensitivity: 'high',
      audioFeedback: true,
      hapticFeedback: true,
      voiceCommands: true,
      screenReader: true,
      largeTargets: true,
      clearLabels: true,
      noGestures: true
    };
  }

  /**
   * Check if age qualifies for senior mode
   */
  public isSeniorAge(age: number): boolean {
    return age >= 65;
  }

  /**
   * Get tier for age
   */
  public getTierForAge(age: number): 'senior' | null {
    return this.isSeniorAge(age) ? 'senior' : null;
  }

  /**
   * Create a senior profile
   */
  public createSeniorProfile(
    displayName: string,
    age: number,
    priorities: string[] = []
  ): SeniorProfile {
    if (!this.isSeniorAge(age)) {
      throw new Error(`Age ${age} does not qualify for senior mode (requires 65+)`);
    }

    const profile: SeniorProfile = {
      id: `senior_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      displayName,
      age,
      tier: 'senior',
      priorities: priorities.length > 0 ? priorities : ['communication', 'medication', 'safety'],
      createdAt: Date.now(),
      lastActive: Date.now()
    };

    this.profiles.set(profile.id, profile);
    return profile;
  }

  /**
   * Get senior profile by ID
   */
  public getProfile(id: string): SeniorProfile | null {
    return this.profiles.get(id) || null;
  }

  /**
   * Get default senior settings
   */
  public getDefaultSettings(): SeniorSettings {
    return { ...this.defaultSettings };
  }

  /**
   * Get recommended settings for age
   */
  public getRecommendedSettings(age: number): Partial<SeniorSettings> {
    if (!this.isSeniorAge(age)) {
      return {};
    }

    // More aggressive settings for older seniors
    if (age >= 80) {
      return {
        fontSize: 'xxlarge',
        contrast: 'high',
        simplifiedUI: true,
        animationReduced: true,
        motionSensitivity: 'high',
        audioFeedback: true,
        hapticFeedback: true,
        voiceCommands: true,
        screenReader: true,
        largeTargets: true,
        clearLabels: true,
        noGestures: true
      };
    }

    return this.getDefaultSettings();
  }

  /**
   * Update profile last active time
   */
  public updateLastActive(profileId: string): void {
    const profile = this.profiles.get(profileId);
    if (profile) {
      profile.lastActive = Date.now();
    }
  }

  /**
   * Get all senior profiles
   */
  public getAllProfiles(): SeniorProfile[] {
    return Array.from(this.profiles.values());
  }

  /**
   * Delete a senior profile
   */
  public deleteProfile(id: string): boolean {
    return this.profiles.delete(id);
  }
}
