import * as THREE from 'three';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import { SceneManager } from './SceneManager';
import { InputManager } from './InputManager';
import { AudioManager } from './AudioManager';
import { SaveManager } from './SaveManager';
import { BuildMode } from '../building/BuildMode';
import { StructureValidator } from '../building/StructureValidator';
import { ChallengeEngine } from '../challenges/ChallengeEngine';
import { PlayerProgress } from '../types/game';
import { PerformanceMonitor, PerformanceMetrics } from './PerformanceMonitor';
import { MetabolismIntegration } from './MetabolismIntegration';
import { ErrorRecovery } from './ErrorRecovery';
import { AccessibilityManager } from './AccessibilityManager';
import { WalletManager } from '../../wallet';
import { WalletIntegration } from './WalletIntegration';
import { VestingManager } from './VestingManager';
import { ProofOfCareManager, type InteractionData, type CareMetrics } from './ProofOfCareManager';

/** L.O.V.E. reward amounts by action type (P31 spec) */
const LOVE_REWARDS: Record<string, number> = {
  BLOCK_PLACED: 1.0,
  COHERENCE_GIFT: 5.0,
  ARTIFACT_CREATED: 10.0,
  CARE_RECEIVED: 3.0,
  CARE_GIVEN: 2.0,
  TETRAHEDRON_BOND: 15.0,
  VOLTAGE_CALMED: 2.0,
  MILESTONE_REACHED: 25.0,
  PING: 1.0,
  DONATION: 0,
};

/** Source for wallet reward events */
type LoveRewardSource = 'challenge' | 'build' | 'achievement' | 'daily' | 'bonus';

export class GameEngine {
  private sceneManager: SceneManager;
  private physicsWorld: PhysicsWorld;
  private inputManager: InputManager;
  private audioManager: AudioManager;
  private saveManager: SaveManager;
  private buildMode: BuildMode;
  private structureValidator: StructureValidator;
  private challengeEngine: ChallengeEngine;
  private performanceMonitor: PerformanceMonitor;
  private metabolismIntegration: MetabolismIntegration;
  private errorRecovery: ErrorRecovery;
  private accessibilityManager: AccessibilityManager;
  private walletManager: WalletManager;
  private vestingManager: VestingManager;
  private proofOfCareManager: ProofOfCareManager;
  private walletIntegration: WalletIntegration;

  private isRunning: boolean = false;
  private lastTime: number = 0;
  private animationFrameId: number | null = null;

  // Game state
  private currentStructure: any = null;
  private playerProgress: PlayerProgress | null = null;
  private isPaused: boolean = false;

  // Performance tracking
  private frameTimeHistory: number[] = [];
  private autoSaveInterval: number = 30000; // 30 seconds
  private lastAutoSave: number = 0;

  constructor() {
    this.sceneManager = new SceneManager();
    this.physicsWorld = new PhysicsWorld();
    this.inputManager = new InputManager();
    this.audioManager = new AudioManager();
    this.saveManager = new SaveManager();
    this.buildMode = new BuildMode(this.sceneManager, this.physicsWorld);
    this.structureValidator = new StructureValidator();
    this.challengeEngine = new ChallengeEngine();
    this.performanceMonitor = new PerformanceMonitor();
    this.metabolismIntegration = new MetabolismIntegration();
    this.errorRecovery = new ErrorRecovery();
    this.accessibilityManager = new AccessibilityManager();
    this.walletManager = new WalletManager();
    this.proofOfCareManager = new ProofOfCareManager();
    this.vestingManager = new VestingManager();
    this.walletIntegration = new WalletIntegration(this.walletManager, this.proofOfCareManager);

    // Apply accessibility settings
    this.accessibilityManager.applySettings();

    this.setupEventListeners();
  }

  /**
   * Initialize the game engine with error recovery
   */
  public async init(): Promise<void> {
    try {
      // Initialize core systems with error handling
      await this.initWithRecovery('SceneManager', () => this.sceneManager.init());
      await this.initWithRecovery('PhysicsWorld', () => this.physicsWorld.init());
      await this.initWithRecovery('AudioManager', () => this.audioManager.init());
      await this.initWithRecovery('InputManager', () => this.inputManager.init());
      await this.initWithRecovery('SaveManager', () => this.saveManager.init());
      
      // Load player progress
      this.playerProgress = await this.saveManager.loadPlayerProgress();
      if (!this.playerProgress) {
        this.playerProgress = this.createDefaultPlayerProgress();
        await this.saveManager.savePlayerProgress(this.playerProgress);
      }

      // Ensure L.O.V.E. wallet exists for current player
      this.ensurePlayerWallet();

      // Set up build mode callbacks
      this.setupBuildModeCallbacks();
      
      console.log('🎮 Game Engine initialized successfully');
    } catch (error) {
      const recovered = this.errorRecovery.handleError({
        component: 'GameEngine',
        action: 'init',
        timestamp: Date.now(),
        error: error as Error
      });
      
      if (!recovered) {
        console.error('❌ Failed to initialize Game Engine and recovery failed:', error);
        throw error;
      }
    }
  }

  /**
   * Initialize component with error recovery
   */
  private async initWithRecovery(component: string, initFn: () => Promise<void>): Promise<void> {
    try {
      await initFn();
    } catch (error) {
      const recovered = this.errorRecovery.handleError({
        component,
        action: 'init',
        timestamp: Date.now(),
        error: error as Error
      });
      
      if (!recovered) {
        throw error;
      }
    }
  }

  /**
   * Start the game loop
   */
  public start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.audioManager.playAmbientSound();
    this.loop();
    
    console.log('🚀 Game Engine started');
  }

  /**
   * Stop the game loop
   */
  public stop(): void {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    this.audioManager.stopAmbientSound();
    console.log('🛑 Game Engine stopped');
  }

  /**
   * Pause the game
   */
  public pause(): void {
    this.isPaused = true;
    this.audioManager.pauseAmbientSound();
    console.log('⏸️ Game paused');
  }

  /**
   * Resume the game
   */
  public resume(): void {
    this.isPaused = false;
    this.audioManager.resumeAmbientSound();
    console.log('▶️ Game resumed');
  }

  /**
   * Main game loop with performance monitoring
   */
  private loop(): void {
    if (!this.isRunning || this.isPaused) {
      this.animationFrameId = requestAnimationFrame(() => this.loop());
      return;
    }

    const frameStartTime = performance.now();
    const currentTime = frameStartTime;
    const deltaTime = currentTime - this.lastTime;
    this.lastTime = currentTime;

    // Track update time
    const updateStart = performance.now();
    this.inputManager.update();
    this.physicsWorld.update(deltaTime);
    this.sceneManager.update(deltaTime);
    this.buildMode.update(deltaTime);
    this.challengeEngine.update(deltaTime);
    const updateTime = performance.now() - updateStart;

    // Track render time
    const renderStart = performance.now();
    this.sceneManager.render();
    const renderTime = performance.now() - renderStart;

    // Track physics time (approximate)
    const physicsTime = deltaTime * 0.1; // Estimate

    // Update performance monitor
    this.performanceMonitor.update(deltaTime, {
      physicsTime,
      renderTime,
      updateTime
    });

    // Auto-save periodically
    if (currentTime - this.lastAutoSave >= this.autoSaveInterval) {
      this.saveCurrentStructure();
      this.lastAutoSave = currentTime;
    }

    // Check performance and adjust if needed
    if (!this.performanceMonitor.isHealthy()) {
      this.handlePerformanceDegradation();
    }

    // Continue loop
    const frameTime = performance.now() - frameStartTime;
    this.frameTimeHistory.push(frameTime);
    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory.shift();
    }

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  /**
   * Handle performance degradation
   */
  private handlePerformanceDegradation(): void {
    const warnings = this.performanceMonitor.getWarnings();
    if (warnings.length > 0) {
      console.warn('⚠️ Performance warnings:', warnings);
      
      // Auto-adjust quality settings if needed
      const metrics = this.performanceMonitor.getMetrics();
      if (metrics.fps < 30) {
        // Reduce quality
        this.sceneManager.setQuality('low');
      }
    }
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Window resize handling
    window.addEventListener('resize', () => {
      this.sceneManager.onWindowResize();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'Escape':
          this.togglePause();
          break;
        case 'z':
          this.buildMode.undo();
          break;
        case 'y':
          this.buildMode.redo();
          break;
        case 'g':
          this.buildMode.toggleGrid();
          break;
        case 'v':
          this.buildMode.toggleSnap();
          break;
        case 't':
          this.testStructure();
          break;
      }
    });
  }

  /**
   * Setup build mode callbacks
   */
  private setupBuildModeCallbacks(): void {
    // Piece placement callback
    this.buildMode.onPiecePlaced = (piece) => {
      this.audioManager.playSound('place_piece');
      this.validateStructure();
      this.saveCurrentStructure();
      this.metabolismIntegration.rewardSpoons('build');
      this.applyRewardLoveForAction('BLOCK_PLACED', { piece });
    };

    // Piece removed callback
    this.buildMode.onPieceRemoved = (piece) => {
      this.audioManager.playSound('remove_piece');
      this.validateStructure();
      this.saveCurrentStructure();
    };

    // Structure changed callback
    this.buildMode.onStructureChanged = () => {
      this.validateStructure();
      this.saveCurrentStructure();
    };
  }

  /**
   * Toggle pause state
   */
  private togglePause(): void {
    if (this.isPaused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  /**
   * Validate current structure
   */
  private validateStructure(): void {
    if (!this.currentStructure) return;

    const validation = this.structureValidator.validate(this.currentStructure);
    
    if (validation.isValid) {
      this.audioManager.playSound('structure_valid');
    } else {
      this.audioManager.playSound('structure_invalid');
    }

    // Update UI with validation results
    this.sceneManager.updateStructureVisuals(validation);
  }

  /**
   * Test current structure with physics
   */
  public testStructure(): void {
    if (!this.currentStructure) return;

    this.audioManager.playSound('test_start');
    this.physicsWorld.applyTestForces(this.currentStructure);
    
    // Check stability after test
    setTimeout(() => {
      const stability = this.physicsWorld.getStructureStability(this.currentStructure);
      this.audioManager.playSound(stability > 0.8 ? 'test_success' : 'test_failure');
    }, 2000);
  }

  /**
   * Save current structure
   */
  private saveCurrentStructure(): void {
    if (!this.currentStructure) return;

    this.saveManager.saveStructure(this.currentStructure);
  }

  /**
   * Load a structure
   */
  public async loadStructure(structureId: string): Promise<void> {
    const structure = await this.saveManager.loadStructure(structureId);
    if (structure) {
      this.currentStructure = structure;
      this.sceneManager.loadStructure(structure);
      this.validateStructure();
    }
  }

  /**
   * Create new structure
   */
  public createNewStructure(name: string): void {
    this.currentStructure = {
      id: this.generateId(),
      name,
      createdBy: this.playerProgress?.familyMemberId || 'unknown',
      createdAt: Date.now(),
      primitives: [],
      vertices: 0,
      edges: 0,
      isRigid: false,
      stabilityScore: 0,
      maxLoadBeforeFailure: 0
    };
    
    this.sceneManager.clearStructure();
    this.buildMode.setActiveStructure(this.currentStructure);
  }

  /**
   * Complete current challenge
   */
  public completeChallenge(): void {
    if (!this.currentStructure) return;

    const challenge = this.challengeEngine.getCurrentChallenge();
    if (!challenge) return;

    const result = this.challengeEngine.completeChallenge(this.currentStructure);
    
    if (result.success) {
      this.audioManager.playSound('challenge_complete');
      this.playerProgress!.totalLoveEarned += result.rewardLove;
      this.playerProgress!.completedChallenges.push(challenge.id);
      this.metabolismIntegration.rewardSpoons('challenge');
      this.applyRewardLoveForAction('MILESTONE_REACHED', { challengeId: challenge.id, rewardLove: result.rewardLove });
      this.updatePlayerTier();
      this.saveManager.savePlayerProgress(this.playerProgress!);
      this.saveManager.saveChallengeCompletion(challenge.id, result);
    }
  }

  /**
   * Update player tier based on progress
   */
  private updatePlayerTier(): void {
    const completedCount = this.playerProgress!.completedChallenges.length;
    
    if (completedCount >= 50) {
      this.playerProgress!.tier = 'sequoia';
    } else if (completedCount >= 25) {
      this.playerProgress!.tier = 'oak';
    } else if (completedCount >= 10) {
      this.playerProgress!.tier = 'sapling';
    } else if (completedCount >= 5) {
      this.playerProgress!.tier = 'sprout';
    } else {
      this.playerProgress!.tier = 'seedling';
    }
  }

  /**
   * Get current game state
   */
  public getGameState(): any {
    return {
      isRunning: this.isRunning,
      isPaused: this.isPaused,
      currentStructure: this.currentStructure,
      playerProgress: this.playerProgress,
      currentChallenge: this.challengeEngine.getCurrentChallenge(),
      buildMode: this.buildMode.getBuildState(),
      performance: this.performanceMonitor.getMetrics(),
      metabolism: this.metabolismIntegration.getState()
    };
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics(): PerformanceMetrics {
    return this.performanceMonitor.getMetrics();
  }

  /**
   * Get metabolism state
   */
  public getMetabolismState() {
    return this.metabolismIntegration.getState();
  }

  /**
   * Update metabolism state from The Buffer
   */
  public updateMetabolismState(state: any): void {
    this.metabolismIntegration.updateState(state);
  }

  /**
   * Check if player can continue playing based on energy
   */
  public canContinuePlaying(): boolean {
    return this.metabolismIntegration.canPlay();
  }

  /**
   * Get recommended game activity based on energy
   */
  public getRecommendedActivity(): 'low' | 'medium' | 'high' {
    return this.metabolismIntegration.getRecommendedActivity();
  }

  /**
   * Get accessibility manager
   */
  public getAccessibilityManager(): AccessibilityManager {
    return this.accessibilityManager;
  }

  /**
   * Get error recovery system
   */
  public getErrorRecovery(): ErrorRecovery {
    return this.errorRecovery;
  }

  /**
   * Ensure a L.O.V.E. wallet and vesting registration exist for the current player (for rewards)
   */
  private ensurePlayerWallet(): void {
    if (!this.playerProgress) return;
    const memberId = this.playerProgress.familyMemberId;
    try {
      if (!this.walletManager.getMemberWallet(memberId)) {
        const store = DataStore.getInstance();
        store.insert('wallets', {
          id: `wallet_${memberId}`,
          memberId,
          memberName: 'Player',
          role: 'Player',
          balance: 0,
          currency: 'LOVE',
          pools: { sovereigntyPool: 0, performancePool: 0 },
        });
      }
      if (!this.vestingManager.getVestingStatus(memberId)) {
        this.vestingManager.registerMember({
          memberId,
          memberName: 'Player',
          birthdate: new Date(Date.now() - 18 * 365.25 * 24 * 60 * 60 * 1000),
        });
      }
    } catch {
      // DataStore may be unavailable (e.g. browser); rewards will no-op
    }
  }

  /** Reward L.O.V.E. for a game action. Respects vesting. */
  public rewardLoveForAction(type: string, _metadata?: object): boolean {
    if (!this.playerProgress) return false;
    const memberId = this.playerProgress.familyMemberId;
    if (!this.vestingManager.canPerformAction(memberId, 'earn', true)) return false;
    const amount = LOVE_REWARDS[type] ?? 0;
    if (amount <= 0) return false;
    const source: LoveRewardSource = type === 'MILESTONE_REACHED' ? 'challenge' : type === 'BLOCK_PLACED' ? 'build' : 'bonus';
    return this.walletIntegration.rewardLove(memberId, amount, type, source);
  }

  /** Record a PING (verified contact) — 1.0 L.O.V.E. */
  public recordPing(_targetMemberId?: string): boolean {
    if (!this.playerProgress) return false;
    const memberId = this.playerProgress.familyMemberId;
    if (!this.vestingManager.canPerformAction(memberId, 'earn', true)) return false;
    return this.walletIntegration.rewardLove(memberId, LOVE_REWARDS.PING, 'PING', 'bonus');
  }

  /** Record an external donation (crypto). No L.O.V.E.; log only. */
  public recordDonation(cryptoValue: number, currency: string): void {
    try {
      const store = DataStore.getInstance();
      store.insert('wallet_transactions', {
        fromWalletId: 'external',
        toWalletId: 'system',
        amount: cryptoValue,
        description: `Donation ${currency}`,
        type: 'donation',
        timestamp: new Date().toISOString(),
      });
    } catch {
      // no-op if store unavailable
    }
  }

  /** Record a care interaction; delegates to ProofOfCareManager. */
  public recordCareInteraction(data: InteractionData) {
    return this.proofOfCareManager.recordInteraction(data);
  }

  /** Verify a care task (e.g. from child's device). */
  public verifyCareTask(memberId: string, taskId: string, description: string): boolean {
    return this.proofOfCareManager.verifyTask(memberId, taskId, description);
  }

  /** Check if a member can perform an action (vesting + guardian approval). */
  public canPerformAction(
    memberId: string,
    action: 'earn' | 'spend' | 'transfer' | 'deploy' | 'create_challenge',
    guardianApproved: boolean = false
  ): boolean {
    return this.vestingManager.canPerformAction(memberId, action, guardianApproved);
  }

  public getWalletIntegration(): WalletIntegration {
    return this.walletIntegration;
  }

  public getVestingManager(): VestingManager {
    return this.vestingManager;
  }

  public getProofOfCareManager(): ProofOfCareManager {
    return this.proofOfCareManager;
  }

  public getWalletManager(): WalletManager {
    return this.walletManager;
  }

  /**
   * Cleanup and dispose resources
   */
  public dispose(): void {
    this.stop();
    
    this.buildMode.dispose();
    this.sceneManager.dispose();
    this.physicsWorld.dispose();
    this.inputManager.dispose();
    this.audioManager.dispose();
    this.saveManager.dispose();
    this.challengeEngine.dispose();
    this.performanceMonitor.reset();
    this.errorRecovery.clearErrorHistory();
    
    console.log('🧹 Game Engine disposed');
  }

  /**
   * Create default player progress
   */
  private createDefaultPlayerProgress(): PlayerProgress {
    return {
      familyMemberId: 'player_001',
      completedChallenges: [],
      currentChallenge: undefined,
      totalLoveEarned: 0,
      badges: [],
      buildStreak: 0,
      structures: [],
      tier: 'seedling',
      xp: 0
    };
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return 'struct_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * Ensure L.O.V.E. wallet exists for current player (no-op if already exists).
   */
  private ensurePlayerWallet(): void {
    if (!this.playerProgress?.familyMemberId) return;
    this.walletManager.ensureMemberWallet(
      this.playerProgress.familyMemberId,
      'Player',
      'player'
    );
  }

  /**
   * Reward LOVE for a game action; maps type to amount and credits wallet (50/50 pools).
   */
  private applyRewardLoveForAction(type: string, _metadata?: object): void {
    const amount = LOVE_REWARDS[type] ?? 0;
    if (amount <= 0) return;
    const memberId = this.playerProgress?.familyMemberId;
    if (!memberId) return;
    const source: LoveRewardSource = type === 'MILESTONE_REACHED' ? 'achievement' : 'build';
    this.walletIntegration.rewardLove(memberId, amount, type, source);
  }

  // --- L.O.V.E. API (documented in GAME_ENGINE_OPUS_BRIEF) ---

  public getWalletManager(): WalletManager {
    return this.walletManager;
  }

  public getWalletIntegration(): WalletIntegration {
    return this.walletIntegration;
  }

  public getVestingManager(): VestingManager {
    return this.vestingManager;
  }

  public getProofOfCareManager(): ProofOfCareManager {
    return this.proofOfCareManager;
  }

  /**
   * Reward LOVE for an action type (public API for demos/scripts).
   */
  public rewardLoveForAction(type: string, metadata?: object): void {
    this.applyRewardLoveForAction(type, metadata);
  }

  /** PING: 1.0 LOVE (verified contact). */
  public recordPing(targetMemberId?: string): void {
    const memberId = targetMemberId ?? this.playerProgress?.familyMemberId;
    if (!memberId) return;
    this.walletIntegration.rewardLove(memberId, LOVE_REWARDS.PING, 'PING', 'bonus');
  }

  /** Record care interaction; delegates to ProofOfCareManager. */
  public recordCareInteraction(data: InteractionData): CareMetrics | null {
    return this.proofOfCareManager.recordInteraction(data);
  }

  /** DONATION: log only, no LOVE. */
  public recordDonation(cryptoValue: number, currency: string): void {
    // Log-only per spec; could write to audit or donations collection
    console.log(`[GameEngine] Donation recorded: ${cryptoValue} ${currency}`);
  }

  /** Verify a care task for a member. */
  public verifyCareTask(memberId: string, taskId: string, description: string): boolean {
    return this.proofOfCareManager.verifyTask(memberId, taskId, description);
  }

  /** Whether member can perform action (vesting + guardian approval). */
  public canPerformAction(memberId: string, action: string, guardianApproved: boolean): boolean {
    return this.vestingManager.canPerformAction(memberId, action, guardianApproved);
  }

  // Getters for external access
  public getSceneManager(): SceneManager {
    return this.sceneManager;
  }

  public getBuildMode(): BuildMode {
    return this.buildMode;
  }

  public getChallengeEngine(): ChallengeEngine {
    return this.challengeEngine;
  }

  public getPlayerProgress(): PlayerProgress | null {
    return this.playerProgress;
  }
}