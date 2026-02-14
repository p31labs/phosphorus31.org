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
      
      // Reward spoons for building
      this.metabolismIntegration.rewardSpoons('build');
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
      
      // Reward spoons for challenge completion
      this.metabolismIntegration.rewardSpoons('challenge');
      
      // Update tier if needed
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