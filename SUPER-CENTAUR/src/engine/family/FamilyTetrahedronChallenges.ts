/**
 * Family Tetrahedron Challenges
 * Special challenges designed for the family tetrahedron
 * 
 * "Four vertices. Six edges. Four faces. The minimum stable system."
 * 
 * Will + Co-parent + Bash + Willow = Family Tetrahedron
 */

export interface FamilyTetrahedronChallenge {
  id: string;
  name: string;
  description: string;
  story: string;                     // Narrative for the family
  objective: string;
  requiredPlayers: 4;                 // Always 4 for tetrahedron
  estimatedTime: number;              // Minutes
  difficulty: 'family-easy' | 'family-medium' | 'family-hard';
  learningObjectives: string[];
  structureRequirements: TetrahedronStructureRequirements;
  rewards: FamilyRewards;
  specialRules: string[];
}

export interface TetrahedronStructureRequirements {
  minVertices: 4;                    // Must have 4 connection points
  minEdges: 6;                       // Must have 6 connections
  minFaces: 4;                       // Must have 4 faces
  maxwellValid: boolean;              // Must follow Maxwell's Rule
  minStability: number;              // 0-100 stability score
  requiredShapes: string[];          // Required geometric shapes
  materialDiversity?: number;         // Optional: use different materials
}

export interface FamilyRewards {
  loveTokens: number;                // Shared LOVE tokens
  familyBadges: string[];            // Family achievements
  individualBadges: Record<string, string[]>; // Per-person badges
  unlockables: string[];              // Unlock new features
  familyPoints: number;               // Family progress points
}

export interface FamilyMemberRole {
  playerId: string;
  role: 'foundation' | 'structure' | 'connection' | 'completion';
  responsibilities: string[];
  specialPowers?: string[];          // Special abilities in co-op
}

/**
 * Family Tetrahedron Challenge Definitions
 */
export class FamilyTetrahedronChallenges {
  private challenges: Map<string, FamilyTetrahedronChallenge> = new Map();

  constructor() {
    this.loadFamilyChallenges();
  }

  /**
   * Load all family tetrahedron challenges
   */
  private loadFamilyChallenges(): void {
    // Challenge 1: The Family Foundation
    this.challenges.set('family-foundation', {
      id: 'family-foundation',
      name: 'The Family Foundation',
      description: 'Build a structure with exactly 4 connection points, one for each family member',
      story: `"Every family needs a strong foundation," you say to your family.

Bash looks up. "Like a tetrahedron?"

"Exactly!" you smile. "A tetrahedron has four points. Our family has four people. Each of us is a point, and we're all connected."

Willow claps. "I want to be the rainbow point!"

"Perfect!" you say. "Each of us will build one connection point. Then we'll connect them all together. That's how families work - we're all connected!"

Your challenge: Build a structure where each family member creates one of the four connection points, and all four points connect to form a stable tetrahedron.`,
      objective: 'Create a structure with exactly 4 vertices (one per family member) and 6 edges connecting them',
      requiredPlayers: 4,
      estimatedTime: 20,
      difficulty: 'family-easy',
      learningObjectives: [
        'Understand tetrahedron topology',
        'Learn that families are like tetrahedrons (4 vertices, 6 connections)',
        'Practice collaborative building',
        'See how individual contributions create a whole',
      ],
      structureRequirements: {
        minVertices: 4,
        minEdges: 6,
        minFaces: 4,
        maxwellValid: true,
        minStability: 50,
        requiredShapes: ['tetrahedron'],
        materialDiversity: 2, // Use at least 2 different materials
      },
      rewards: {
        loveTokens: 50,
        familyBadges: ['family-foundation'],
        individualBadges: {
          'foundation': ['foundation-builder'],
          'structure': ['structure-builder'],
          'connection': ['connection-builder'],
          'completion': ['completion-builder'],
        },
        unlockables: ['family-trophy-bronze'],
        familyPoints: 100,
      },
      specialRules: [
        'Each player must place at least one piece',
        'Each player must create one vertex',
        'All vertices must connect to form a tetrahedron',
        'Structure must be stable (50+ stability score)',
      ],
    });

    // Challenge 2: The Stable Family
    this.challenges.set('family-stable', {
      id: 'family-stable',
      name: 'The Stable Family',
      description: 'Build a structure that can hold weight - like a family that supports each other',
      story: `"Families support each other," you explain. "Just like this structure needs to support weight."

Bash thinks. "So if one part is weak, the whole thing falls?"

"Exactly!" you say. "That's why we all need to work together. If one person is struggling, we all help. That's what makes a family strong."

Willow nods. "Like when I'm sad, you help me?"

"Yes, sweetheart. And when Bash needs help, we help him. And when I need help, you help me. We're all connected, and we all support each other."

Your challenge: Build a structure that can hold weight. Test it with physics. If it falls, figure out which part needs support, and help each other fix it.`,
      objective: 'Build a structure with 70+ stability that can hold weight without collapsing',
      requiredPlayers: 4,
      estimatedTime: 30,
      difficulty: 'family-medium',
      learningObjectives: [
        'Learn about structural stability',
        'Understand Maxwell\'s Rule (E ≥ 3V - 6)',
        'Practice problem-solving together',
        'Learn that families support each other',
      ],
      structureRequirements: {
        minVertices: 4,
        minEdges: 6,
        minFaces: 4,
        maxwellValid: true,
        minStability: 70,
        requiredShapes: ['tetrahedron', 'octahedron'],
        materialDiversity: 3,
      },
      rewards: {
        loveTokens: 75,
        familyBadges: ['stable-family'],
        individualBadges: {
          'foundation': ['strong-foundation'],
          'structure': ['stable-structure'],
          'connection': ['supportive-connections'],
          'completion': ['completion-master'],
        },
        unlockables: ['family-trophy-silver', 'advanced-materials'],
        familyPoints: 150,
      },
      specialRules: [
        'Structure must pass physics test (hold weight)',
        'If structure fails, family must work together to fix it',
        'Each player must contribute to stability',
        'Structure must follow Maxwell\'s Rule',
      ],
    });

    // Challenge 3: The Family Bridge
    this.challenges.set('family-bridge', {
      id: 'family-bridge',
      name: 'The Family Bridge',
      description: 'Build a bridge that connects two points - like family connects us all',
      story: `"Bridges connect things," you say. "They help people get from one place to another."

"Like when we visit each other?" Bash asks.

"Exactly!" you smile. "Even when we're apart, we're still connected. That's what families do - they connect us, no matter where we are."

Willow looks thoughtful. "So the bridge is like our family?"

"Yes! The bridge connects two points. Our family connects all four of us. Even when we're in different places, we're still connected by love."

Your challenge: Build a bridge that connects two points. Make it strong. Make it beautiful. Make it together.`,
      objective: 'Build a bridge connecting two points, with 60+ stability and at least 4 different colors',
      requiredPlayers: 4,
      estimatedTime: 25,
      difficulty: 'family-medium',
      learningObjectives: [
        'Learn about bridges and connections',
        'Understand that families connect us even when apart',
        'Practice creative building',
        'Learn about structural engineering',
      ],
      structureRequirements: {
        minVertices: 4,
        minEdges: 6,
        minFaces: 4,
        maxwellValid: true,
        minStability: 60,
        requiredShapes: ['tetrahedron', 'strut'],
        materialDiversity: 4, // Use all 4 materials
      },
      rewards: {
        loveTokens: 60,
        familyBadges: ['family-bridge'],
        individualBadges: {
          'foundation': ['bridge-anchor'],
          'structure': ['bridge-builder'],
          'connection': ['connection-master'],
          'completion': ['rainbow-bridge'],
        },
        unlockables: ['rainbow-materials', 'bridge-blueprint'],
        familyPoints: 120,
      },
      specialRules: [
        'Bridge must connect two distinct points',
        'Must use at least 4 different colors',
        'Each family member must contribute',
        'Bridge must be stable (60+ stability)',
      ],
    });

    // Challenge 4: The Family Tower
    this.challenges.set('family-tower', {
      id: 'family-tower',
      name: 'The Family Tower',
      description: 'Build the tallest stable tower - reach for the sky together',
      story: `"Towers reach high," you say. "They show us what's possible when we work together."

"Can we build the tallest tower ever?" Bash asks excitedly.

"We can try!" you laugh. "But remember - it's not about being the tallest. It's about building it together. Every piece matters. Every person matters."

Willow jumps. "I want to build the top!"

"You can!" you say. "But you'll need help from everyone else. The top can't stand without the bottom. Just like in our family - we all support each other."

Your challenge: Build the tallest stable tower you can. Work together. Support each other. Reach for the sky!`,
      objective: 'Build the tallest stable tower (80+ stability) with at least 20 pieces',
      requiredPlayers: 4,
      estimatedTime: 40,
      difficulty: 'family-hard',
      learningObjectives: [
        'Learn about height and stability',
        'Understand that tall structures need strong foundations',
        'Practice patience and collaboration',
        'Learn that we all support each other',
      ],
      structureRequirements: {
        minVertices: 4,
        minEdges: 6,
        minFaces: 4,
        maxwellValid: true,
        minStability: 80,
        requiredShapes: ['tetrahedron', 'octahedron', 'strut', 'hub'],
        materialDiversity: 3,
      },
      rewards: {
        loveTokens: 100,
        familyBadges: ['family-tower', 'sky-reachers'],
        individualBadges: {
          'foundation': ['tower-foundation'],
          'structure': ['tower-builder'],
          'connection': ['tower-supporter'],
          'completion': ['sky-toucher'],
        },
        unlockables: ['family-trophy-gold', 'tower-blueprint', 'special-materials'],
        familyPoints: 200,
      },
      specialRules: [
        'Tower must be at least 20 pieces tall',
        'Must maintain 80+ stability throughout',
        'Each family member must contribute equally',
        'Tower must pass physics test',
      ],
    });

    // Challenge 5: The Family Dome
    this.challenges.set('family-dome', {
      id: 'family-dome',
      name: 'The Family Dome',
      description: 'Build a geodesic dome - the protective structure that holds us all',
      story: `"Domes protect," you explain. "They're strong, they're beautiful, and they hold everything inside safe."

"Like our family?" Willow asks.

"Exactly like our family," you say. "Our family is like a dome. It protects us. It holds us. It keeps us safe from the outside world."

Bash nods. "The dome holds."

"Yes," you smile. "The dome holds. And our family holds. We protect each other. We support each other. We're a geodesic dome of love."

Your challenge: Build a geodesic dome together. Make it strong. Make it beautiful. Make it protective.`,
      objective: 'Build a geodesic dome structure with 90+ stability using tetrahedron and octahedron pieces',
      requiredPlayers: 4,
      estimatedTime: 45,
      difficulty: 'family-hard',
      learningObjectives: [
        'Learn about geodesic domes',
        'Understand protective structures',
        'Learn that families protect us',
        'Practice complex collaborative building',
      ],
      structureRequirements: {
        minVertices: 8,               // More complex for dome
        minEdges: 18,                 // More connections
        minFaces: 10,                 // More faces
        maxwellValid: true,
        minStability: 90,
        requiredShapes: ['tetrahedron', 'octahedron', 'strut'],
        materialDiversity: 4,
      },
      rewards: {
        loveTokens: 150,
        familyBadges: ['family-dome', 'dome-builders', 'protectors'],
        individualBadges: {
          'foundation': ['dome-foundation'],
          'structure': ['dome-architect'],
          'connection': ['dome-connector'],
          'completion': ['dome-master'],
        },
        unlockables: ['family-trophy-platinum', 'dome-blueprint', 'quantum-materials'],
        familyPoints: 300,
      },
      specialRules: [
        'Dome must be geodesic (curved, dome-shaped)',
        'Must use tetrahedron and octahedron pieces',
        'Must achieve 90+ stability',
        'Each family member must contribute significantly',
        'Dome must pass all physics tests',
      ],
    });
  }

  /**
   * Get all family challenges
   */
  getAllChallenges(): FamilyTetrahedronChallenge[] {
    return Array.from(this.challenges.values());
  }

  /**
   * Get challenge by ID
   */
  getChallenge(id: string): FamilyTetrahedronChallenge | null {
    return this.challenges.get(id) || null;
  }

  /**
   * Get challenges by difficulty
   */
  getChallengesByDifficulty(difficulty: 'family-easy' | 'family-medium' | 'family-hard'): FamilyTetrahedronChallenge[] {
    return Array.from(this.challenges.values()).filter(c => c.difficulty === difficulty);
  }

  /**
   * Get recommended first challenge
   */
  getFirstChallenge(): FamilyTetrahedronChallenge {
    return this.challenges.get('family-foundation')!;
  }

  /**
   * Get next challenge after completing one
   */
  getNextChallenge(completedId: string): FamilyTetrahedronChallenge | null {
    const order = [
      'family-foundation',
      'family-bridge',
      'family-stable',
      'family-tower',
      'family-dome',
    ];

    const currentIndex = order.indexOf(completedId);
    if (currentIndex === -1 || currentIndex === order.length - 1) {
      return null; // No next challenge
    }

    return this.challenges.get(order[currentIndex + 1]) || null;
  }

  /**
   * Assign roles to family members
   */
  assignRoles(playerIds: string[]): Map<string, FamilyMemberRole> {
    if (playerIds.length !== 4) {
      throw new Error('Family tetrahedron requires exactly 4 players');
    }

    const roles = new Map<string, FamilyMemberRole>();

    // Foundation role - builds the base
    roles.set(playerIds[0], {
      playerId: playerIds[0],
      role: 'foundation',
      responsibilities: [
        'Build the foundation/base of the structure',
        'Ensure stability from the ground up',
        'Place the first pieces',
      ],
      specialPowers: ['Can place foundation pieces faster', 'Gets stability bonus'],
    });

    // Structure role - builds the main structure
    roles.set(playerIds[1], {
      playerId: playerIds[1],
      role: 'structure',
      responsibilities: [
        'Build the main structure',
        'Connect pieces together',
        'Ensure structural integrity',
      ],
      specialPowers: ['Can see connection points', 'Gets connection bonus'],
    });

    // Connection role - connects everything
    roles.set(playerIds[2], {
      playerId: playerIds[2],
      role: 'connection',
      responsibilities: [
        'Connect different parts of the structure',
        'Ensure all vertices are connected',
        'Create the tetrahedron topology',
      ],
      specialPowers: ['Can see all connection opportunities', 'Gets topology bonus'],
    });

    // Completion role - finishes and tests
    roles.set(playerIds[3], {
      playerId: playerIds[3],
      role: 'completion',
      responsibilities: [
        'Finish the structure',
        'Test stability',
        'Add final touches',
      ],
      specialPowers: ['Can test structure anytime', 'Gets completion bonus'],
    });

    return roles;
  }
}
