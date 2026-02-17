/**
 * Dynamic Challenge Engine
 * Generates challenges dynamically based on player progress and structure analysis
 */

import { Challenge, Structure, PlayerProgress, Objective } from '../types/game';

export interface DynamicChallengeConfig {
  minDifficulty: number;
  maxDifficulty: number;
  preferredTypes: string[];
  coopBonus: boolean;
  timeLimit?: number;
}

export class DynamicChallengeEngine {
  private challengeTemplates: Map<string, ChallengeTemplate> = new Map();
  private generatedChallenges: Map<string, Challenge> = new Map();

  constructor() {
    this.initializeTemplates();
  }

  /**
   * Initialize challenge templates
   */
  private initializeTemplates(): void {
    // Build challenges
    this.challengeTemplates.set('build_tetrahedron', {
      type: 'build',
      baseObjectives: [
        { type: 'build', target: 4, unit: 'pieces', description: 'Build a tetrahedron' }
      ],
      difficultyMultiplier: 1.0
    });

    this.challengeTemplates.set('stability_test', {
      type: 'stability',
      baseObjectives: [
        { type: 'stability', target: 70, unit: 'score', description: 'Achieve stability score of 70+' }
      ],
      difficultyMultiplier: 1.2
    });

    this.challengeTemplates.set('efficiency_challenge', {
      type: 'efficiency',
      baseObjectives: [
        { type: 'efficiency', target: 0.8, unit: 'ratio', description: 'Maximize efficiency ratio' }
      ],
      difficultyMultiplier: 1.5
    });

    this.challengeTemplates.set('creative_build', {
      type: 'creative',
      baseObjectives: [
        { type: 'creative', target: 10, unit: 'pieces', description: 'Create a unique structure' }
      ],
      difficultyMultiplier: 1.3
    });
  }

  /**
   * Generate dynamic challenge based on player progress
   */
  public generateChallenge(
    playerProgress: PlayerProgress,
    currentStructure: Structure | null,
    config?: DynamicChallengeConfig
  ): Challenge {
    const tier = playerProgress.tier;
    const completedCount = playerProgress.completedChallenges.length;
    
    // Determine difficulty
    const difficulty = this.calculateDifficulty(tier, completedCount, config);

    // Select challenge type
    const challengeType = this.selectChallengeType(playerProgress, currentStructure, config);

    // Generate challenge
    const challenge = this.createChallenge(challengeType, difficulty, tier, config);

    // Store generated challenge
    this.generatedChallenges.set(challenge.id, challenge);

    return challenge;
  }

  /**
   * Calculate challenge difficulty
   */
  private calculateDifficulty(
    tier: string,
    completedCount: number,
    config?: DynamicChallengeConfig
  ): number {
    const tierMultipliers: Record<string, number> = {
      seedling: 0.5,
      sprout: 0.7,
      sapling: 1.0,
      oak: 1.3,
      sequoia: 1.6
    };

    const baseDifficulty = tierMultipliers[tier] || 1.0;
    const progressBonus = Math.min(completedCount * 0.05, 0.5); // Max 50% bonus
    const difficulty = baseDifficulty + progressBonus;

    // Apply config constraints
    if (config) {
      return Math.max(
        config.minDifficulty,
        Math.min(config.maxDifficulty, difficulty)
      );
    }

    return difficulty;
  }

  /**
   * Select challenge type based on context
   */
  private selectChallengeType(
    progress: PlayerProgress,
    structure: Structure | null,
    config?: DynamicChallengeConfig
  ): string {
    // If config specifies preferred types, use those
    if (config?.preferredTypes && config.preferredTypes.length > 0) {
      return config.preferredTypes[Math.floor(Math.random() * config.preferredTypes.length)];
    }

    // Analyze current structure to suggest challenge
    if (structure) {
      if (structure.primitives.length === 0) {
        return 'build_tetrahedron';
      }
      if (structure.stabilityScore < 50) {
        return 'stability_test';
      }
      if (structure.edges / structure.vertices < 1.5) {
        return 'efficiency_challenge';
      }
    }

    // Default based on tier
    const tierChallenges: Record<string, string[]> = {
      seedling: ['build_tetrahedron'],
      sprout: ['build_tetrahedron', 'stability_test'],
      sapling: ['stability_test', 'efficiency_challenge'],
      oak: ['efficiency_challenge', 'creative_build'],
      sequoia: ['creative_build', 'efficiency_challenge']
    };

    const available = tierChallenges[progress.tier] || ['build_tetrahedron'];
    return available[Math.floor(Math.random() * available.length)];
  }

  /**
   * Create challenge from template
   */
  private createChallenge(
    type: string,
    difficulty: number,
    tier: string,
    config?: DynamicChallengeConfig
  ): Challenge {
    const template = this.challengeTemplates.get(type);
    if (!template) {
      throw new Error(`Unknown challenge type: ${type}`);
    }

    // Scale objectives based on difficulty
    const objectives: Objective[] = template.baseObjectives.map(obj => ({
      ...obj,
      target: Math.floor(obj.target * difficulty * template.difficultyMultiplier)
    }));

    // Generate title and description
    const { title, description } = this.generateChallengeText(type, difficulty, tier);

    // Calculate reward
    const rewardLove = Math.floor(10 * difficulty * (config?.coopBonus ? 1.5 : 1.0));

    const challenge: Challenge = {
      id: this.generateChallengeId(),
      tier: tier as any,
      title,
      description,
      objectives,
      rewardLove,
      coopRequired: config?.coopBonus || false,
      coopBonus: config?.coopBonus ? rewardLove * 0.5 : 0,
      prerequisites: [],
      fullerPrinciple: this.getFullerPrinciple(type),
      realWorldExample: this.getRealWorldExample(type),
      timeLimit: config?.timeLimit
    };

    return challenge;
  }

  /**
   * Generate challenge text
   */
  private generateChallengeText(type: string, difficulty: number, tier: string): { title: string; description: string } {
    const titles: Record<string, string[]> = {
      build_tetrahedron: [
        'Build Your First Tetrahedron',
        'Tetrahedron Master',
        'Perfect Tetrahedron'
      ],
      stability_test: [
        'Stable Foundation',
        'Stand Strong',
        'Unshakeable Structure'
      ],
      efficiency_challenge: [
        'Efficient Design',
        'Maximum Efficiency',
        'Optimal Structure'
      ],
      creative_build: [
        'Creative Construction',
        'Unique Design',
        'Artistic Structure'
      ]
    };

    const descriptions: Record<string, string[]> = {
      build_tetrahedron: [
        'Build a tetrahedron using 4 pieces. The tetrahedron is the simplest stable structure!',
        'Create a perfect tetrahedron. Remember: 4 vertices, 6 edges, 4 faces.',
        'Master the tetrahedron - the building block of all structures.'
      ],
      stability_test: [
        'Build a structure that can withstand forces. Test its stability!',
        'Create a stable structure with a high stability score.',
        'Build something strong that won\'t collapse under pressure.'
      ],
      efficiency_challenge: [
        'Build an efficient structure using minimal pieces for maximum strength.',
        'Create a structure that maximizes the efficiency ratio.',
        'Build smart - use fewer pieces to achieve the same strength.'
      ],
      creative_build: [
        'Create a unique and creative structure. Express yourself!',
        'Build something beautiful and original.',
        'Design a structure that stands out from the rest.'
      ]
    };

    const typeTitles = titles[type] || ['New Challenge'];
    const typeDescriptions = descriptions[type] || ['Complete this challenge!'];

    const titleIndex = Math.floor(Math.random() * typeTitles.length);
    const descIndex = Math.floor(Math.random() * typeDescriptions.length);

    return {
      title: typeTitles[titleIndex],
      description: typeDescriptions[descIndex]
    };
  }

  /**
   * Get Fuller principle for challenge type
   */
  private getFullerPrinciple(type: string): string {
    const principles: Record<string, string> = {
      build_tetrahedron: 'The tetrahedron is the minimum stable system - 4 vertices, 6 edges, 4 faces.',
      stability_test: 'Stability comes from proper distribution of forces and connections.',
      efficiency_challenge: 'Efficiency is doing more with less - optimal use of resources.',
      creative_build: 'Creativity emerges from understanding the rules, then breaking them thoughtfully.'
    };
    return principles[type] || 'Synergetics: The whole is greater than the sum of its parts.';
  }

  /**
   * Get real-world example
   */
  private getRealWorldExample(type: string): string {
    const examples: Record<string, string> = {
      build_tetrahedron: 'Tetrahedra are found in crystal structures and molecular geometry!',
      stability_test: 'This is how engineers design bridges and buildings!',
      efficiency_challenge: 'Architects use efficiency principles to design sustainable buildings.',
      creative_build: 'Great architects combine stability with creative expression.'
    };
    return examples[type] || 'These principles apply to real-world structures!';
  }

  /**
   * Generate unique challenge ID
   */
  private generateChallengeId(): string {
    return 'dynamic_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Get generated challenge
   */
  public getChallenge(challengeId: string): Challenge | undefined {
    return this.generatedChallenges.get(challengeId);
  }

  /**
   * Clear generated challenges
   */
  public clearGeneratedChallenges(): void {
    this.generatedChallenges.clear();
  }
}

interface ChallengeTemplate {
  type: string;
  baseObjectives: Objective[];
  difficultyMultiplier: number;
}
