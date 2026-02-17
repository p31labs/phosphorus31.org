/**
 * Kids Mode - Special features for Bash and Willow
 * 
 * "Built with love and light. As above, so below."
 * 
 * Node One (Bash, age 9) - Sapling tier, engineering focus
 * Node Two (Willow, age 6) - Sprout tier, creative focus
 */

export interface KidProfile {
  id: string;
  displayName: string;              // Not real name - privacy first
  age: number;
  tier: AgeTier;
  interests: string[];
  favoriteColors: string[];
  achievements: string[];
  playTime: number;                 // Minutes (local only)
  structuresBuilt: number;
  challengesCompleted: number;
}

export interface KidSafeSettings {
  contentFilter: 'strict' | 'moderate' | 'open'; // Always 'strict' for kids
  timeLimit: number | null;          // Optional daily time limit (minutes)
  breakReminders: boolean;           // Remind to take breaks
  parentApproval: boolean;           // Require parent approval for certain actions
  sharingEnabled: boolean;            // Can share structures (local only)
  cloudSyncEnabled: boolean;         // Parent-controlled
}

export interface KidChallenge {
  id: string;
  name: string;
  description: string;
  tier: AgeTier;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;             // Minutes
  learningObjectives: string[];
  rewards: {
    loveTokens: number;
    badges: string[];
    unlockables: string[];
  };
  safetyLevel: 'safe' | 'supervised'; // Always safe for kids
}

export interface KidStructure {
  id: string;
  name: string;
  createdBy: string;                // Kid ID
  createdAt: number;
  pieces: number;
  stability: number;
  maxwellValid: boolean;
  favorite: boolean;
  shared: boolean;                   // Shared with family only
  screenshot?: string;                // Base64 encoded (local only)
}

export type AgeTier = 'seedling' | 'sprout' | 'sapling' | 'oak' | 'sequoia';

export class KidsMode {
  private profiles: Map<string, KidProfile> = new Map();
  private safeSettings: Map<string, KidSafeSettings> = new Map();
  private challenges: KidChallenge[] = [];
  private structures: KidStructure[] = [];

  /**
   * Initialize Kids Mode with default safe settings
   */
  init(): void {
    this.loadDefaultChallenges();
    this.loadSafeSettings();
    console.log('👶 Kids Mode initialized - Safe, fun, educational');
  }

  /**
   * Create a kid profile (privacy-first, no real names)
   */
  createKidProfile(displayName: string, age: number, interests: string[]): KidProfile {
    const tier = this.getTierForAge(age);
    const profile: KidProfile = {
      id: crypto.randomUUID(),
      displayName,
      age,
      tier,
      interests,
      favoriteColors: this.getDefaultColorsForTier(tier),
      achievements: [],
      playTime: 0,
      structuresBuilt: 0,
      challengesCompleted: 0,
    };

    this.profiles.set(profile.id, profile);
    this.saveProfile(profile);

    // Initialize safe settings
    this.safeSettings.set(profile.id, this.getDefaultSafeSettings());

    console.log(`✨ Created profile for ${displayName} (${tier} tier)`);
    return profile;
  }

  /**
   * Get age tier for a given age
   * Matches CHALLENGE_TIERS: seedling (4-6), sprout (6-8), sapling (8-10), oak (10-13), sequoia (13+)
   */
  private getTierForAge(age: number): AgeTier {
    if (age >= 4 && age <= 6) return 'seedling';
    if (age > 6 && age <= 8) return 'sprout';
    if (age > 8 && age <= 10) return 'sapling';
    if (age > 10 && age <= 13) return 'oak';
    return 'sequoia';
  }

  /**
   * Get default colors for tier (kid-friendly, high contrast)
   */
  private getDefaultColorsForTier(tier: AgeTier): string[] {
    const colorMap: Record<AgeTier, string[]> = {
      seedling: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3'],
      sprout: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF8B94'],
      sapling: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF8B94', '#A8E6CF'],
      oak: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF8B94', '#A8E6CF', '#FFD93D'],
      sequoia: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', '#FF8B94', '#A8E6CF', '#FFD93D', '#6BCB77'],
    };
    return colorMap[tier] || colorMap.sprout;
  }

  /**
   * Get default safe settings (always strict for kids)
   */
  private getDefaultSafeSettings(): KidSafeSettings {
    return {
      contentFilter: 'strict',
      timeLimit: 60,                 // 1 hour default
      breakReminders: true,
      parentApproval: true,           // Always require parent approval
      sharingEnabled: true,           // Can share with family
      cloudSyncEnabled: false,       // Parent must enable
    };
  }

  /**
   * Load default challenges for kids
   */
  private loadDefaultChallenges(): void {
    // Seedling tier challenges (ages 4-6, including 5-year-olds)
    this.challenges.push({
      id: 'seedling-001',
      name: 'My First Shape',
      description: 'Place your first piece and see what happens!',
      tier: 'seedling',
      difficulty: 'easy',
      estimatedTime: 3,
      learningObjectives: ['Learn to place pieces', 'See cause and effect', 'Have fun building'],
      rewards: {
        loveTokens: 5,
        badges: ['first-piece'],
        unlockables: ['color-palette-bright'],
      },
      safetyLevel: 'safe',
    });

    this.challenges.push({
      id: 'seedling-002',
      name: 'Color Fun',
      description: 'Build with your favorite colors!',
      tier: 'seedling',
      difficulty: 'easy',
      estimatedTime: 5,
      learningObjectives: ['Learn about colors', 'Practice placing pieces', 'Create something colorful'],
      rewards: {
        loveTokens: 10,
        badges: ['color-artist'],
        unlockables: ['rainbow-palette'],
      },
      safetyLevel: 'safe',
    });

    // Sprout tier challenges (ages 6-8, including Willow age 6)
    this.challenges.push({
      id: 'sprout-001',
      name: 'My First Tetrahedron',
      description: 'Build a simple tetrahedron using 4 pieces',
      tier: 'sprout',
      difficulty: 'easy',
      estimatedTime: 5,
      learningObjectives: ['Learn what a tetrahedron is', 'Practice placing pieces', 'See basic structure'],
      rewards: {
        loveTokens: 10,
        badges: ['first-build'],
        unlockables: ['color-palette-rainbow'],
      },
      safetyLevel: 'safe',
    });

    this.challenges.push({
      id: 'sprout-002',
      name: 'Rainbow Bridge',
      description: 'Build a colorful bridge that stands on its own',
      tier: 'sprout',
      difficulty: 'easy',
      estimatedTime: 10,
      learningObjectives: ['Learn about stability', 'Practice with colors', 'Build something beautiful'],
      rewards: {
        loveTokens: 20,
        badges: ['bridge-builder'],
        unlockables: ['special-material-crystal'],
      },
      safetyLevel: 'safe',
    });

    // Sapling tier challenges (Bash, age 9)
    this.challenges.push({
      id: 'sapling-001',
      name: 'The Stable Tower',
      description: 'Build a tower that can hold weight without falling',
      tier: 'sapling',
      difficulty: 'medium',
      estimatedTime: 15,
      learningObjectives: ['Learn Maxwell\'s Rule', 'Understand stability', 'Test with physics'],
      rewards: {
        loveTokens: 30,
        badges: ['engineer'],
        unlockables: ['advanced-materials'],
      },
      safetyLevel: 'safe',
    });

    this.challenges.push({
      id: 'sapling-002',
      name: 'Family Tetrahedron',
      description: 'Build a structure with exactly 4 connection points (like our family!)',
      tier: 'sapling',
      difficulty: 'medium',
      estimatedTime: 20,
      learningObjectives: ['Learn tetrahedron topology', 'Understand family structure', 'Practice co-op building'],
      rewards: {
        loveTokens: 40,
        badges: ['family-builder'],
        unlockables: ['co-op-mode'],
      },
      safetyLevel: 'safe',
    });

    // Family co-op challenges
    this.challenges.push({
      id: 'family-001',
      name: 'Build Together',
      description: 'Work with your family to build something amazing!',
      tier: 'sapling',
      difficulty: 'medium',
      estimatedTime: 30,
      learningObjectives: ['Learn to work together', 'Practice collaboration', 'Build family bonds'],
      rewards: {
        loveTokens: 50,
        badges: ['family-team'],
        unlockables: ['family-trophy'],
      },
      safetyLevel: 'safe',
    });
  }

  /**
   * Get challenges for a kid's tier
   */
  getChallengesForKid(kidId: string): KidChallenge[] {
    const profile = this.profiles.get(kidId);
    if (!profile) return [];

    return this.challenges.filter(c => {
      // Include challenges for their tier and below
      const tierOrder: AgeTier[] = ['seedling', 'sprout', 'sapling', 'oak', 'sequoia'];
      const kidTierIndex = tierOrder.indexOf(profile.tier);
      const challengeTierIndex = tierOrder.indexOf(c.tier);
      return challengeTierIndex <= kidTierIndex;
    });
  }

  /**
   * Complete a challenge (with parent approval if needed)
   */
  completeChallenge(kidId: string, challengeId: string, parentApproved: boolean = false): boolean {
    const profile = this.profiles.get(kidId);
    const settings = this.safeSettings.get(kidId);
    const challenge = this.challenges.find(c => c.id === challengeId);

    if (!profile || !settings || !challenge) {
      return false;
    }

    // Check parent approval if required
    if (settings.parentApproval && !parentApproved) {
      console.log(`⏳ Waiting for parent approval for ${profile.displayName}`);
      return false;
    }

    // Award rewards
    profile.achievements.push(...challenge.rewards.badges);
    profile.challengesCompleted++;
    profile.playTime += challenge.estimatedTime;

    // Save progress
    this.saveProfile(profile);

    console.log(`🎉 ${profile.displayName} completed: ${challenge.name}`);
    return true;
  }

  /**
   * Save a structure (kid-friendly)
   */
  saveStructure(kidId: string, structure: Omit<KidStructure, 'id' | 'createdBy' | 'createdAt'>): KidStructure {
    const profile = this.profiles.get(kidId);
    if (!profile) {
      throw new Error('Kid profile not found');
    }

    const kidStructure: KidStructure = {
      ...structure,
      id: crypto.randomUUID(),
      createdBy: kidId,
      createdAt: Date.now(),
    };

    this.structures.push(kidStructure);
    profile.structuresBuilt++;
    this.saveProfile(profile);
    this.persistStructure(kidStructure);

    console.log(`💾 ${profile.displayName} saved: ${structure.name}`);
    return kidStructure;
  }

  /**
   * Get kid's structures (their own only, or family-shared)
   */
  getStructuresForKid(kidId: string, includeShared: boolean = true): KidStructure[] {
    return this.structures.filter(s => {
      if (s.createdBy === kidId) return true;
      if (includeShared && s.shared) return true;
      return false;
    });
  }

  /**
   * Check time limit
   */
  checkTimeLimit(kidId: string): { canPlay: boolean; timeRemaining: number } {
    const profile = this.profiles.get(kidId);
    const settings = this.safeSettings.get(kidId);

    if (!profile || !settings || !settings.timeLimit) {
      return { canPlay: true, timeRemaining: Infinity };
    }

    // Check daily play time (simplified - would track per day in real implementation)
    const timeRemaining = Math.max(0, settings.timeLimit - profile.playTime);
    return {
      canPlay: timeRemaining > 0,
      timeRemaining,
    };
  }

  /**
   * Get break reminder (if needed)
   */
  shouldTakeBreak(kidId: string): boolean {
    const profile = this.profiles.get(kidId);
    const settings = this.safeSettings.get(kidId);

    if (!profile || !settings || !settings.breakReminders) {
      return false;
    }

    // Remind to take break after 20 minutes of continuous play
    const lastBreak = this.getLastBreakTime(kidId);
    const timeSinceBreak = Date.now() - lastBreak;
    return timeSinceBreak > 20 * 60 * 1000; // 20 minutes
  }

  /**
   * Record break time
   */
  recordBreak(kidId: string): void {
    localStorage.setItem(`p31_kid_break_${kidId}`, Date.now().toString());
  }

  /**
   * Get last break time
   */
  private getLastBreakTime(kidId: string): number {
    const stored = localStorage.getItem(`p31_kid_break_${kidId}`);
    return stored ? parseInt(stored, 10) : 0;
  }

  /**
   * Get kid profile
   */
  getProfile(kidId: string): KidProfile | null {
    return this.profiles.get(kidId) || null;
  }

  /**
   * Get safe settings
   */
  getSafeSettings(kidId: string): KidSafeSettings | null {
    return this.safeSettings.get(kidId) || null;
  }

  /**
   * Update safe settings (parent-only)
   */
  updateSafeSettings(kidId: string, settings: Partial<KidSafeSettings>): void {
    const current = this.safeSettings.get(kidId);
    if (!current) return;

    const updated = { ...current, ...settings };
    // Always enforce strict content filter for kids
    updated.contentFilter = 'strict';
    this.safeSettings.set(kidId, updated);
    this.saveSafeSettings(kidId, updated);
  }

  // Save/load methods (local storage only)
  private saveProfile(profile: KidProfile): void {
    localStorage.setItem(`p31_kid_profile_${profile.id}`, JSON.stringify(profile));
  }

  private persistStructure(structure: KidStructure): void {
    const structures = this.getStructuresForKid(structure.createdBy, false);
    structures.push(structure);
    localStorage.setItem(`p31_kid_structures_${structure.createdBy}`, JSON.stringify(structures));
  }

  private saveSafeSettings(kidId: string, settings: KidSafeSettings): void {
    localStorage.setItem(`p31_kid_safe_${kidId}`, JSON.stringify(settings));
  }

  private loadSafeSettings(): void {
    // Load from localStorage in real implementation
  }
}
