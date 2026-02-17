/**
 * Family Co-Op Mode
 * Tetrahedron topology for family collaboration
 * 
 * "Four vertices. Six edges. Four faces. The minimum stable system."
 */

export interface FamilyMember {
  id: string;
  name: string;                    // Display name only, not real name
  role: 'parent' | 'child' | 'adult';
  ageTier: AgeTier;
  color: string;                    // Visual identifier
  position: [number, number, number]; // 3D position in co-op space
}

import { FamilyTetrahedronChallenges, FamilyTetrahedronChallenge, FamilyMemberRole } from './FamilyTetrahedronChallenges';
import { RealTimeCollaboration } from './RealTimeCollaboration';
import { AdvancedPhysicsValidation } from './AdvancedPhysicsValidation';
import { FamilyBondingSystem } from './FamilyBondingSystem';

export interface CoOpGameState {
  challenge: FamilyTetrahedronChallenge;
  players: FamilyMember[];
  roles: Map<string, FamilyMemberRole>;
  structure: SharedStructure;
  progress: CoOpProgress;
  startedAt: number;
  completedAt?: number;
  storyProgress: number;            // 0-100, tracks story narrative progress
}

export interface SharedStructure {
  pieces: CoOpPiece[];
  connections: Connection[];
  stability: number;
  maxwellValid: boolean;
}

export interface CoOpPiece {
  id: string;
  type: string;
  position: [number, number, number];
  rotation: [number, number, number];
  material: string;
  placedBy: string;                // Player ID
  placedAt: number;
}

export interface Connection {
  piece1Id: string;
  piece2Id: string;
  connectionPoint: number;
}

export interface CoOpProgress {
  piecesPlaced: number;
  stabilityAchieved: number;
  timeElapsed: number;
  playerContributions: Record<string, number>; // Player ID -> pieces placed
}

export type AgeTier = 'seedling' | 'sprout' | 'sapling' | 'oak' | 'sequoia' | 'adult' | 'senior';

export class FamilyCoOpMode {
  private currentGame: CoOpGameState | null = null;
  private players: FamilyMember[] = [];
  private challenges: FamilyTetrahedronChallenges;
  private completedChallenges: Set<string> = new Set();
  private collaboration: RealTimeCollaboration;
  private physicsValidation: AdvancedPhysicsValidation;
  private bondingSystem: FamilyBondingSystem;

  constructor() {
    this.challenges = new FamilyTetrahedronChallenges();
    this.collaboration = new RealTimeCollaboration();
    this.physicsValidation = new AdvancedPhysicsValidation();
    this.bondingSystem = new FamilyBondingSystem();
  }

  /**
   * Initialize family co-op mode
   */
  init(): void {
    // Load completed challenges from localStorage
    this.loadCompletedChallenges();
    
    // Initialize subsystems
    this.collaboration.init();
    this.bondingSystem.init();
    
    console.log('👨‍👩‍👧‍👦 Family Co-Op Mode initialized');
    console.log(`📋 Available challenges: ${this.challenges.getAllChallenges().length}`);
    console.log('🔄 Real-time collaboration enabled');
    console.log('🔬 Advanced physics validation enabled');
    console.log('💜 Family bonding system enabled');
  }

  /**
   * Create a family tetrahedron (4 players)
   */
  createFamilyTetrahedron(members: FamilyMember[]): void {
    if (members.length !== 4) {
      throw new Error('Family tetrahedron requires exactly 4 members');
    }

    this.players = members;

    // Assign positions in tetrahedron formation
    const positions: [number, number, number][] = [
      [0, 2, 0],           // Top vertex
      [-1, -1, 1],         // Bottom front left
      [1, -1, 1],          // Bottom front right
      [0, -1, -1],        // Bottom back
    ];

    members.forEach((member, index) => {
      member.position = positions[index];
    });

    console.log('🔺 Family tetrahedron created:', members.map(m => m.name).join(', '));
  }

  /**
   * Start a co-op challenge
   */
  startCoOpChallenge(challengeId: string): CoOpGameState {
    if (this.players.length !== 4) {
      throw new Error('Co-op challenges require 4 players (family tetrahedron)');
    }

    const challenge = this.challenges.getChallenge(challengeId);
    if (!challenge) {
      throw new Error(`Challenge not found: ${challengeId}`);
    }

    if (challenge.requiredPlayers !== 4) {
      throw new Error('Challenge must require 4 players for tetrahedron topology');
    }

    // Assign roles to family members
    const playerIds = this.players.map(p => p.id);
    const roles = this.challenges.assignRoles(playerIds);

    // Register all players in collaboration system
    playerIds.forEach(id => this.collaboration.registerPlayer(id));

    this.currentGame = {
      challenge,
      players: [...this.players],
      roles,
      structure: {
        pieces: [],
        connections: [],
        stability: 0,
        maxwellValid: false,
      },
      progress: {
        piecesPlaced: 0,
        stabilityAchieved: 0,
        timeElapsed: 0,
        playerContributions: {},
      },
      startedAt: Date.now(),
      storyProgress: 0,
    };

    // Initialize player contributions
    this.players.forEach(player => {
      this.currentGame!.progress.playerContributions[player.id] = 0;
    });

    console.log('🎮 Co-op challenge started:', challenge.name);
    console.log('📖 Story:', challenge.story);
    console.log('👥 Roles assigned:', Array.from(roles.values()).map(r => r.role).join(', '));
    return this.currentGame;
  }

  /**
   * Place a piece in co-op mode (with real-time collaboration)
   */
  placePiece(piece: CoOpPiece, playerId: string): void {
    if (!this.currentGame) {
      throw new Error('No active co-op game');
    }

    // Verify player is part of the game
    const player = this.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error('Player not part of co-op game');
    }

    // Record in collaboration system
    this.collaboration.recordPiecePlacement(playerId, piece);

    // Check for conflicts
    const conflict = this.collaboration.detectConflict({
      playerId,
      action: 'place',
      pieceId: piece.id,
      position: piece.position,
      timestamp: Date.now(),
    });

    if (conflict) {
      console.warn(`⚠️ Conflict detected: ${conflict.id}`);
      // Auto-resolve: merge (keep both if possible)
      this.collaboration.resolveConflict(conflict.id, 'merge');
    }

    // Add piece to structure
    this.currentGame.structure.pieces.push(piece);
    this.currentGame.progress.piecesPlaced++;
    this.currentGame.progress.playerContributions[playerId]++;

    // Update structure validation with advanced physics
    this.updateStructureValidation();

    // Update bonding system
    this.bondingSystem.recordCommunication(
      this.currentGame.challenge.id,
      playerId,
      'chat'
    );

    console.log(`🧱 ${player.name} placed ${piece.type}`);
  }

  /**
   * Update structure validation (Maxwell's rule, stability, advanced physics)
   */
  private updateStructureValidation(): void {
    if (!this.currentGame) return;

    const structure = this.currentGame.structure;
    
    // Use advanced physics validation
    const analysis = this.physicsValidation.analyzeStructure(structure);
    
    // Update structure properties
    structure.maxwellValid = analysis.maxwellValid;
    structure.stability = analysis.stability;
    
    // Store analysis for UI display
    (structure as any).analysis = analysis;
    
    this.currentGame.progress.stabilityAchieved = structure.stability;
    
    // Log recommendations if structure has issues
    if (analysis.recommendations.length > 0 && analysis.recommendations[0].includes('⚠️')) {
      console.warn('🔴 Structure issues:', analysis.recommendations);
    }
  }

  /**
   * Check if challenge is complete
   */
  checkChallengeComplete(): boolean {
    if (!this.currentGame) return false;

    const { challenge, structure } = this.currentGame;
    const req = challenge.structureRequirements;

    // Check all requirements
    const stabilityMet = structure.stability >= req.minStability;
    const verticesMet = structure.pieces.length >= req.minVertices;
    const edgesMet = structure.connections.length >= req.minEdges;
    const maxwellMet = req.maxwellValid ? structure.maxwellValid : true;

    // Check required shapes
    const shapeCounts: Record<string, number> = {};
    structure.pieces.forEach(piece => {
      shapeCounts[piece.type] = (shapeCounts[piece.type] || 0) + 1;
    });
    const shapesMet = req.requiredShapes.every(shape => 
      shapeCounts[shape] && shapeCounts[shape] > 0
    );

    // Check material diversity if required
    const materialCounts: Record<string, number> = {};
    structure.pieces.forEach(piece => {
      materialCounts[piece.material] = (materialCounts[piece.material] || 0) + 1;
    });
    const materialsMet = req.materialDiversity 
      ? Object.keys(materialCounts).length >= req.materialDiversity
      : true;

    // Check special rules
    const specialRulesMet = this.checkSpecialRules(challenge.specialRules);

    return stabilityMet && verticesMet && edgesMet && maxwellMet && shapesMet && materialsMet && specialRulesMet;
  }

  /**
   * Check special rules for the challenge
   */
  private checkSpecialRules(rules: string[]): boolean {
    if (!this.currentGame) return false;

    // Check each rule (simplified - would need full implementation)
    for (const rule of rules) {
      if (rule.includes('each player must place')) {
        const minPiecesPerPlayer = 1;
        const allPlayersContributed = this.players.every(player => {
          const contributions = this.currentGame!.progress.playerContributions[player.id] || 0;
          return contributions >= minPiecesPerPlayer;
        });
        if (!allPlayersContributed) return false;
      }
      // Add more rule checks as needed
    }

    return true;
  }

  /**
   * Complete the co-op challenge
   */
  completeChallenge(): CoOpGameState {
    if (!this.currentGame) {
      throw new Error('No active co-op game');
    }

    if (!this.checkChallengeComplete()) {
      throw new Error('Challenge requirements not met');
    }

    this.currentGame.completedAt = Date.now();
    this.currentGame.progress.timeElapsed = 
      (this.currentGame.completedAt - this.currentGame.startedAt) / 1000 / 60; // minutes
    this.currentGame.storyProgress = 100;

    // Mark challenge as completed
    this.completedChallenges.add(this.currentGame.challenge.id);
    this.saveCompletedChallenges();

    // Record in bonding system
    const familyId = `family_${this.players.map(p => p.id).sort().join('_')}`;
    this.bondingSystem.recordChallengeComplete(familyId, this.currentGame.challenge.id);
    this.bondingSystem.recordCollaborationTime(
      familyId,
      this.currentGame.progress.timeElapsed
    );

    // Get bonding insights
    const bonding = this.bondingSystem.getBondingInsights(familyId);
    console.log('💜 Family bonding score:', bonding.score, `(${bonding.level})`);

    console.log('🎉 Co-op challenge completed!');
    console.log('📖 Story completed:', this.currentGame.challenge.story);
    console.log('🏆 Rewards:', this.currentGame.challenge.rewards);
    console.log('👥 Family badges:', this.currentGame.challenge.rewards.familyBadges);
    console.log('💜 LOVE tokens:', this.currentGame.challenge.rewards.loveTokens);
    console.log('⭐ Family points:', this.currentGame.challenge.rewards.familyPoints);

    return this.currentGame;
  }

  /**
   * Get available challenges
   */
  getAvailableChallenges(): FamilyTetrahedronChallenge[] {
    return this.challenges.getAllChallenges();
  }

  /**
   * Get recommended next challenge
   */
  getRecommendedChallenge(): FamilyTetrahedronChallenge | null {
    if (this.completedChallenges.size === 0) {
      return this.challenges.getFirstChallenge();
    }

    // Find the last completed challenge and get the next one
    const allChallenges = this.challenges.getAllChallenges();
    const completedIds = Array.from(this.completedChallenges);
    
    // Get the most recently completed challenge
    const lastCompleted = completedIds[completedIds.length - 1];
    return this.challenges.getNextChallenge(lastCompleted);
  }

  /**
   * Get challenge progress
   */
  getChallengeProgress(): { completed: number; total: number; percentage: number } {
    const total = this.challenges.getAllChallenges().length;
    const completed = this.completedChallenges.size;
    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100),
    };
  }

  /**
   * Get family roles for current game
   */
  getFamilyRoles(): Map<string, FamilyMemberRole> | null {
    if (!this.currentGame) return null;
    return this.currentGame.roles;
  }

  /**
   * Get real-time collaboration state
   */
  getCollaborationState() {
    return this.collaboration.getCollaborationState();
  }

  /**
   * Get structure analysis (advanced physics)
   */
  getStructureAnalysis() {
    if (!this.currentGame) return null;
    return this.physicsValidation.analyzeStructure(this.currentGame.structure);
  }

  /**
   * Test structure with physics
   */
  async testStructureWithPhysics(load: number = 0) {
    if (!this.currentGame) return null;
    return await this.physicsValidation.testStructure(this.currentGame.structure, load);
  }

  /**
   * Get family bonding insights
   */
  getFamilyBonding() {
    if (!this.currentGame) return null;
    const familyId = `family_${this.players.map(p => p.id).sort().join('_')}`;
    return this.bondingSystem.getBondingInsights(familyId);
  }

  /**
   * Get recent celebrations
   */
  getRecentCelebrations(limit: number = 10) {
    const familyId = `family_${this.players.map(p => p.id).sort().join('_')}`;
    return this.bondingSystem.getRecentCelebrations(familyId, limit);
  }

  /**
   * Subscribe to collaboration events
   */
  subscribeToCollaboration(eventType: string, callback: (event: any) => void) {
    return this.collaboration.subscribe(eventType, callback);
  }

  /**
   * Update story progress (as family reads story together)
   */
  updateStoryProgress(progress: number): void {
    if (this.currentGame) {
      this.currentGame.storyProgress = Math.max(0, Math.min(100, progress));
    }
  }

  // Save/load methods
  private loadCompletedChallenges(): void {
    const stored = localStorage.getItem('p31_family_completed_challenges');
    if (stored) {
      try {
        const completed = JSON.parse(stored) as string[];
        this.completedChallenges = new Set(completed);
      } catch (e) {
        console.warn('[FamilyCoOp] Failed to load completed challenges');
      }
    }
  }

  private saveCompletedChallenges(): void {
    localStorage.setItem(
      'p31_family_completed_challenges',
      JSON.stringify(Array.from(this.completedChallenges))
    );
  }

  /**
   * Get current game state
   */
  getCurrentGame(): CoOpGameState | null {
    return this.currentGame ? { ...this.currentGame } : null;
  }

  /**
   * Get player contributions
   */
  getPlayerContributions(): Record<string, number> {
    if (!this.currentGame) return {};
    return { ...this.currentGame.progress.playerContributions };
  }

  /**
   * Reset co-op mode
   */
  reset(): void {
    this.currentGame = null;
    console.log('🔄 Co-op mode reset');
  }
}
