import * as THREE from 'three';
import { PhysicsWorld } from '../physics/PhysicsWorld';
import { EnhancedPhysicsWorld } from '../physics/EnhancedPhysicsWorld';
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
import { EnhancedAccessibilityManager } from '../accessibility/EnhancedAccessibilityManager';
import { QuantumCoherenceVisualizer } from '../visual/QuantumCoherenceVisualizer';
import { TetrahedronTopologyVisualizer } from '../visual/TetrahedronTopologyVisualizer';
import { DynamicChallengeEngine } from '../challenges/DynamicChallengeEngine';
import { CloudSyncManager } from './CloudSyncManager';
import { SpatialAudioManager } from './SpatialAudioManager';
import { WalletManager, FamilyWallet } from '../../wallet';
import { WalletIntegration } from './WalletIntegration';
import { VestingManager, VestingPhase } from './VestingManager';
import { ProofOfCareManager } from './ProofOfCareManager';
import { NetworkManager } from './NetworkManager';
import { CoopManager } from '../multiplayer/CoopManager';
import { SafetyManager } from '../safety/SafetyManager';
import { AssistiveTechnologyManager } from '../assistive/AssistiveTechnologyManager';
import { KidsMode } from '../kids/KidsMode';
import { EducationalStoryMode } from '../kids/EducationalStoryMode';
import { SeniorMode } from '../accessibility/SeniorMode';
import { FamilyCoOpMode } from '../family/FamilyCoOpMode';
import { FamilyCodingMode } from '../family/FamilyCodingMode';
import { PrivacyManager } from '../privacy/PrivacyManager';
import { ToolsForLifeManager } from '../tools/ToolsForLifeManager';
import { VibeCodingManager } from '../maker/VibeCodingManager';
import { SlicingEngine } from '../maker/SlicingEngine';
import { PrinterIntegration } from '../maker/PrinterIntegration';
import { FamilyVibeCodingManager } from '../family/FamilyVibeCodingManager';
import { CosmicTransitionManager } from '../cosmic/CosmicTransitionManager';
import { CriticalPathManager } from '../critical/CriticalPathManager';
import { P31LanguageParser } from '../language/P31LanguageParser';
import { P31LanguageExecutor } from '../language/P31LanguageExecutor';
import { InfiniteSynergy } from '../synergy/InfiniteSynergy';
import { P31LanguageBridge } from '../../../language/P31LanguageBridge';

export class GameEngine {
  private sceneManager: SceneManager;
  private physicsWorld: PhysicsWorld;
  private enhancedPhysics: EnhancedPhysicsWorld;
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
  private enhancedAccessibilityManager: EnhancedAccessibilityManager;
  private tetrahedronTopologyVisualizer: TetrahedronTopologyVisualizer;
  private dynamicChallengeEngine: DynamicChallengeEngine;
  // Optional features
  private kidsMode: KidsMode;
  private seniorMode: SeniorMode;
  private storyMode: EducationalStoryMode;
  private familyCoOp: FamilyCoOpMode;
  private familyCoding: FamilyCodingMode;
  private privacyManager: PrivacyManager;
  private p31Parser: P31LanguageParser;
  private p31Executor: P31LanguageExecutor;
  private infiniteSynergy: InfiniteSynergy;
  private networkManager: NetworkManager;
  private cloudSyncManager: CloudSyncManager;
  private spatialAudioManager: SpatialAudioManager;
  private walletManager: WalletManager;
  private walletIntegration: WalletIntegration;
  private coopManager: CoopManager;
  private vibeCoding: VibeCodingManager;
  private slicingEngine: SlicingEngine;
  private printerIntegration: PrinterIntegration;
  private familyVibeCoding: FamilyVibeCodingManager;
  private safetyManager: SafetyManager;
  private cosmicTransitionManager: CosmicTransitionManager;
  private criticalPathManager: CriticalPathManager;
  
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
    this.enhancedPhysics = new EnhancedPhysicsWorld();
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
    this.enhancedAccessibilityManager = new EnhancedAccessibilityManager();
    // TetrahedronTopologyVisualizer will be initialized after sceneManager is ready
    this.tetrahedronTopologyVisualizer = new TetrahedronTopologyVisualizer(this.sceneManager.getScene());
    this.dynamicChallengeEngine = new DynamicChallengeEngine();
    this.coopManager = new CoopManager();
    this.networkManager = new NetworkManager();
    this.cloudSyncManager = new CloudSyncManager();
    this.spatialAudioManager = new SpatialAudioManager();
    this.walletManager = new WalletManager();
    this.proofOfCareManager = new ProofOfCareManager();
    this.walletIntegration = new WalletIntegration(this.walletManager, this.proofOfCareManager);
    this.vestingManager = new VestingManager();
    this.vestingManager.initializeFoundingNodes();
    this.safetyManager = new SafetyManager();
    this.vibeCoding = new VibeCodingManager();
    this.slicingEngine = new SlicingEngine();
    this.printerIntegration = new PrinterIntegration();
    this.familyVibeCoding = new FamilyVibeCodingManager();
    this.cosmicTransitionManager = new CosmicTransitionManager();
    this.criticalPathManager = new CriticalPathManager();
    
    // Initialize family and kids features
    this.kidsMode = new KidsMode();
    this.seniorMode = new SeniorMode();
    this.storyMode = new EducationalStoryMode();
    this.familyCoOp = new FamilyCoOpMode();
    this.familyCoding = new FamilyCodingMode();
    this.privacyManager = new PrivacyManager();
    this.p31Parser = new P31LanguageParser();
    this.p31Executor = new P31LanguageExecutor(this.familyCoOp, this.familyCoding, this);
    this.infiniteSynergy = new InfiniteSynergy();
    
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
      await this.initWithRecovery('SafetyManager', () => this.safetyManager.init());
      await this.initWithRecovery('NetworkManager', () => this.networkManager.init());
      await this.initWithRecovery('CloudSyncManager', () => this.cloudSyncManager.init());
      await this.initWithRecovery('SpatialAudioManager', () => this.spatialAudioManager.init());
      await this.initWithRecovery('VibeCoding', () => this.vibeCoding.init());
      await this.initWithRecovery('SlicingEngine', () => this.slicingEngine.init());
      await this.initWithRecovery('PrinterIntegration', () => this.printerIntegration.init());
      await this.initWithRecovery('KidsMode', async () => { this.kidsMode.init(); });
      await this.initWithRecovery('StoryMode', async () => { this.storyMode.init(); });
      await this.initWithRecovery('FamilyCoOpMode', async () => { this.familyCoOp.init(); });
      await this.initWithRecovery('FamilyCodingMode', async () => { this.familyCoding.init(); });
      await this.initWithRecovery('PrivacyManager', async () => { this.privacyManager.init(); });
      await this.initWithRecovery('FamilyVibeCoding', async () => { this.familyVibeCoding.init(); });
      await this.initWithRecovery('CosmicTransitionManager', async () => { this.cosmicTransitionManager.init(); });
      await this.initWithRecovery('CriticalPathManager', async () => { this.criticalPathManager.init(); });
      // WalletManager doesn't need async init
      
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
   * Start the game loop with safety checks
   */
  public async start(userAge?: number): Promise<void> {
    if (this.isRunning) return;
    
    // Start safety session
    const sessionStarted = await this.safetyManager.startSession(userAge);
    if (!sessionStarted) {
      throw new Error('Safety session could not be started');
    }
    
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
    
    // End safety session
    this.safetyManager.endSession();
    
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
    
    // Update safety checks
    this.safetyManager.update(deltaTime);
    
    const updateTime = performance.now() - updateStart;

    // Track render time
    const renderStart = performance.now();
    this.sceneManager.render();
    const renderTime = performance.now() - renderStart;

    // Update spatial audio
    this.spatialAudioManager.update();

    // Update network manager
    this.networkManager.cleanupDisconnectedPeers();

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
      
      // Sync to cloud
      if (this.currentStructure) {
        this.cloudSyncManager.syncStructure(this.currentStructure);
      }
      
      // Broadcast to network
      if (this.currentStructure) {
        this.networkManager.broadcastStructureUpdate(this.currentStructure);
      }
      
      // Reward spoons for building
      this.metabolismIntegration.rewardSpoons('build');
      
      // Reward LOVE tokens for building (BLOCK_PLACED = 1.0 LOVE)
      this.rewardLoveForAction('BLOCK_PLACED', { pieceId: piece.id });
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
   * Create new structure with safety checks
   */
  public createNewStructure(name: string): void {
    // Filter structure name for safety
    const filteredName = this.safetyManager.filterStructureName(name);
    
    // Check if content is safe
    if (!this.safetyManager.isContentSafe(filteredName)) {
      throw new Error('Structure name contains unsafe content');
    }
    
    this.currentStructure = {
      id: this.generateId(),
      name: filteredName,
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
      
      // Reward LOVE tokens to player wallet (MILESTONE_REACHED = 25.0 LOVE for major challenges)
      const isMajorMilestone = result.rewardLove >= 25;
      if (isMajorMilestone) {
        this.rewardLoveForAction('MILESTONE_REACHED', { challengeId: challenge.id, challengeTitle: challenge.title });
      } else {
        // Regular challenge completion uses challenge reward amount
        this.walletIntegration.rewardLove(
          this.playerProgress!.familyMemberId,
          result.rewardLove,
          `Challenge: ${challenge.title}`,
          'challenge'
        );
      }
      
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
   * Get network manager
   */
  public getNetworkManager(): NetworkManager {
    return this.networkManager;
  }

  /**
   * Get cloud sync manager
   */
  public getCloudSyncManager(): CloudSyncManager {
    return this.cloudSyncManager;
  }

  /**
   * Get safety manager
   */
  public getSafetyManager(): SafetyManager {
    return this.safetyManager;
  }

  /**
   * Get spatial audio manager
   */
  public getSpatialAudioManager(): SpatialAudioManager {
    return this.spatialAudioManager;
  }

  /**
   * Get wallet manager
   */
  public getWalletManager(): WalletManager {
    return this.walletManager;
  }

  /**
   * Get wallet integration
   */
  public getWalletIntegration(): WalletIntegration {
    return this.walletIntegration;
  }

  /**
   * Reward LOVE tokens to player (convenience method)
   */
  public rewardLoveTokens(memberId: string, amount: number, description: string, source: 'challenge' | 'build' | 'achievement' | 'daily' | 'bonus' = 'bonus'): boolean {
    return this.walletIntegration.rewardLove(memberId, amount, description, source);
  }

  /**
   * Get player wallet balance (convenience method)
   */
  public getPlayerWalletBalance(memberId: string): number {
    return this.walletIntegration.getBalance(memberId);
  }

  /**
   * Get player wallet (convenience method)
   */
  public getPlayerWallet(memberId: string): FamilyWallet | null {
    return this.walletManager.getMemberWallet(memberId);
  }

  /**
   * Transfer LOVE tokens between players (convenience method)
   */
  public transferLoveTokens(fromMemberId: string, toMemberId: string, amount: number, description: string): boolean {
    return this.walletIntegration.transfer(fromMemberId, toMemberId, amount, description);
  }

  /**
   * Get vibe coding manager
   */
  public getVibeCodingManager(): VibeCodingManager {
    return this.vibeCoding;
  }

  /**
   * Get slicing engine
   */
  public getSlicingEngine(): SlicingEngine {
    return this.slicingEngine;
  }

  /**
   * Get printer integration
   */
  public getPrinterIntegration(): PrinterIntegration {
    return this.printerIntegration;
  }

  /**
   * Vibe Code → Build → Slice → Print workflow
   * Complete pipeline from in-game coding to physical print
   * 
   * 💜 With love and light. As above, so below. 💜
   */
  public async vibeCodeToPrint(
    code: string,
    language: 'javascript' | 'typescript' | 'python' | 'glsl' | 'hlsl' = 'javascript',
    sliceConfig?: Partial<import('../maker/SlicingEngine').SliceConfig>,
    printerId?: string
  ): Promise<{
    projectId: string;
    structureId: string;
    slicedModelId: string;
    printJobId: string;
    gcode: string;
  }> {
    // Step 1: Create vibe coding project and execute
    const project = this.vibeCoding.createProject('Vibe Print', language);
    this.vibeCoding.updateProject(project.id, code);
    const execution = await this.vibeCoding.executeCode(project.id);

    if (execution.error) {
      throw new Error(`Code execution failed: ${execution.error}`);
    }

    // Step 2: Get current structure (code execution should generate/modify structure)
    const structure = this.currentStructure;
    if (!structure) {
      throw new Error('No structure available. Build something first or code should generate structure.');
    }

    // Step 3: Export structure geometry
    const geometry = await this.exportStructureToGeometry(structure);
    
    // Step 4: Slice the geometry
    const slicedModel = await this.slicingEngine.sliceModel(geometry, sliceConfig);
    
    // Step 5: Generate G-code
    const gcode = this.slicingEngine.exportToGCode(slicedModel);
    
    // Step 6: Push to printer
    const printJob = await this.printerIntegration.printGCode(gcode, printerId);

    console.log(`💜 Vibe Code → Print complete!`);
    console.log(`   Project: ${project.id}`);
    console.log(`   Structure: ${structure.id || 'current'}`);
    console.log(`   Sliced: ${slicedModel.id}`);
    console.log(`   Print Job: ${printJob.id}`);
    console.log(`   Estimated Time: ${slicedModel.estimatedTime.toFixed(1)} min`);
    console.log(`   Estimated Material: ${slicedModel.estimatedMaterial.toFixed(1)}g`);

    return {
      projectId: project.id,
      structureId: structure.id || 'current',
      slicedModelId: slicedModel.id,
      printJobId: printJob.id,
      gcode
    };
  }

  /**
   * Export current structure to Three.js geometry
   */
  private async exportStructureToGeometry(structure: any): Promise<import('three').BufferGeometry> {
    // Get all blocks/pieces from structure
    const blocks = structure.blocks || structure.pieces || [];
    
    // Create merged geometry from all blocks
    const geometries: import('three').BufferGeometry[] = [];
    
    for (const block of blocks) {
      // Create geometry for each block
      let geometry: import('three').BufferGeometry;
      
      if (block.type === 'box' || block.type === 'cube') {
        geometry = new THREE.BoxGeometry(
          block.size?.x || 1,
          block.size?.y || 1,
          block.size?.z || 1
        );
      } else if (block.type === 'sphere') {
        geometry = new THREE.SphereGeometry(block.radius || 0.5);
      } else if (block.type === 'cylinder') {
        geometry = new THREE.CylinderGeometry(
          block.radius || 0.5,
          block.radius || 0.5,
          block.height || 1
        );
      } else if (block.type === 'tetrahedron') {
        geometry = new THREE.TetrahedronGeometry(block.radius || 0.5);
      } else {
        // Default to box
        geometry = new THREE.BoxGeometry(1, 1, 1);
      }

      // Apply position
      if (block.position) {
        geometry.translate(block.position.x || 0, block.position.y || 0, block.position.z || 0);
      }

      // Apply rotation
      if (block.rotation) {
        const rotation = new THREE.Euler(
          block.rotation.x || 0,
          block.rotation.y || 0,
          block.rotation.z || 0
        );
        geometry.rotateX(rotation.x);
        geometry.rotateY(rotation.y);
        geometry.rotateZ(rotation.z);
      }

      geometries.push(geometry);
    }

    // Merge all geometries into one
    if (geometries.length === 0) {
      // Return empty geometry if no blocks
      return new THREE.BufferGeometry();
    }

    // Use BufferGeometryUtils if available, otherwise merge manually
    let mergedGeometry: import('three').BufferGeometry;
    
    try {
      // Try to use BufferGeometryUtils for proper merging
      const BufferGeometryUtils = await import('three/examples/jsm/utils/BufferGeometryUtils.js');
      mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(geometries) || new THREE.BufferGeometry();
    } catch {
      // Fallback: use first geometry if merge fails
      // In production, implement manual merge
      mergedGeometry = geometries[0] || new THREE.BufferGeometry();
      console.warn('⚠️ BufferGeometryUtils not available, using first primitive only');
    }

    return mergedGeometry;
  }

  /**
   * Quick print: Slice current structure and print
   * Direct workflow: Build → Slice → Print
   */
  public async quickPrint(
    sliceConfig?: Partial<import('../maker/SlicingEngine').SliceConfig>,
    printerId?: string
  ): Promise<{
    slicedModelId: string;
    printJobId: string;
    gcode: string;
  }> {
    const structure = this.currentStructure;
    if (!structure) {
      throw new Error('No structure to print. Build something first.');
    }

    const geometry = await this.exportStructureToGeometry(structure);
    const slicedModel = await this.slicingEngine.sliceModel(geometry, sliceConfig);
    const gcode = this.slicingEngine.exportToGCode(slicedModel);
    const printJob = await this.printerIntegration.printGCode(gcode, printerId);

    console.log(`🖨️ Quick print started: ${printJob.id}`);

    return {
      slicedModelId: slicedModel.id,
      printJobId: printJob.id,
      gcode
    };
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
    this.coopManager.dispose();
    this.safetyManager.dispose();
    this.performanceMonitor.reset();
    this.errorRecovery.clearErrorHistory();
    this.networkManager.dispose();
    this.cloudSyncManager.dispose();
    this.spatialAudioManager.dispose();
    this.familyVibeCoding.dispose();
    this.cosmicTransitionManager.dispose();
    this.criticalPathManager.dispose();
    
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

  /**
   * Get Family Co-Op Mode instance
   */
  public getFamilyCoOp(): FamilyCoOpMode {
    return this.familyCoOp;
  }

  /**
   * Get Kids Mode instance
   */
  public getKidsMode(): KidsMode {
    return this.kidsMode;
  }

  /**
   * Get Senior Mode instance
   */
  public getSeniorMode(): SeniorMode {
    return this.seniorMode;
  }

  /**
   * Get Story Mode instance
   */
  public getStoryMode(): EducationalStoryMode {
    return this.storyMode;
  }

  /**
   * Get Privacy Manager instance
   */
  public getPrivacyManager(): PrivacyManager {
    return this.privacyManager;
  }

  /**
   * Get P31 language bridge (synergized system + runtime)
   * "Synergize x infinity"
   */
  public getP31LanguageBridge(): P31LanguageBridge {
    return new P31LanguageBridge(this.p31Executor);
  }

  /**
   * Execute P31 code with full synergy
   * Auto-detects system vs runtime, loads system context, executes runtime
   * "Synergize x infinity"
   */
  public async executeP31Code(
    code: string,
    systemCode?: string,
    mode: 'system' | 'runtime' | 'auto' = 'auto'
  ): Promise<any> {
    const bridge = this.getP31LanguageBridge();
    
    if (systemCode) {
      // Load system first, then execute runtime
      return await bridge.synergize(systemCode, code);
    } else {
      // Auto-detect and execute
      return await bridge.execute(code, mode);
    }
  }

  /**
   * Get Infinite Synergy System
   */
  public getInfiniteSynergy(): InfiniteSynergy {
    return this.infiniteSynergy;
  }

  /**
   * Generate infinite synergy
   */
  public generateInfiniteSynergy(levels: number = 10): any {
    return this.infiniteSynergy.generateInfinite(levels);
  }

  /**
   * Visualize tetrahedron topology
   * Shows/hides topology visualization for current structure
   */
  public visualizeTopology(visible: boolean): void {
    if (visible) {
      if (this.currentStructure) {
        this.tetrahedronTopologyVisualizer.visualizeTopology(this.currentStructure);
      }
    } else {
      this.tetrahedronTopologyVisualizer.clear();
    }
  }

  /**
   * Get enhanced accessibility manager
   * Provides advanced accessibility features beyond basic manager
   */
  public getEnhancedAccessibility(): EnhancedAccessibilityManager {
    return this.enhancedAccessibilityManager;
  }

  /**
   * Generate dynamic challenge based on current state
   * Creates context-aware challenges that adapt to player progress
   */
  public generateDynamicChallenge(config?: {
    minDifficulty?: number;
    maxDifficulty?: number;
    preferredTypes?: string[];
    coopBonus?: boolean;
    timeLimit?: number;
  }): any {
    const playerTier = this.playerProgress?.tier || 'seedling';
    const completedCount = this.playerProgress?.completedChallenges.length || 0;
    
    return this.dynamicChallengeEngine.generateChallenge({
      tier: playerTier,
      completedChallenges: completedCount,
      currentStructure: this.currentStructure,
      ...config
    });
  }

  /**
   * Enhanced LOVE economy integration
   * Rewards LOVE tokens for various game actions according to economy spec
   * All 10 transaction types supported
   */
  private rewardLoveForAction(
    action: 'BLOCK_PLACED' | 'COHERENCE_GIFT' | 'ARTIFACT_CREATED' | 'CARE_RECEIVED' | 'CARE_GIVEN' | 'TETRAHEDRON_BOND' | 'VOLTAGE_CALMED' | 'MILESTONE_REACHED' | 'PING' | 'DONATION',
    metadata?: Record<string, any>
  ): void {
    if (!this.playerProgress) return;

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
      DONATION: 0  // Crypto value only, no LOVE
    };

    const amount = LOVE_REWARDS[action] || 0;
    
    // DONATION type: record but don't award LOVE (crypto value only)
    if (action === 'DONATION') {
      // Record donation but don't mint LOVE tokens
      // This would be handled by external donation system
      this.logger.info(`Donation recorded for ${this.playerProgress.familyMemberId}: ${metadata?.cryptoValue || 0} (no LOVE awarded)`);
      return;
    }
    
    if (amount > 0) {
      this.walletIntegration.rewardLove(
        this.playerProgress.familyMemberId,
        amount,
        `Game action: ${action}`,
        'game'
      );
    }
  }

  /**
   * Record PING transaction (verified contact)
   * @param targetMemberId The member who was pinged
   */
  public recordPing(targetMemberId?: string): void {
    if (!this.playerProgress) return;
    
    // PING rewards 1.0 LOVE for verified contact
    this.rewardLoveForAction('PING', { targetMemberId });
  }

  /**
   * Record DONATION transaction (external crypto donation)
   * @param cryptoValue The crypto value donated (no LOVE awarded)
   * @param currency The cryptocurrency (e.g., 'ETH', 'USDC')
   */
  public recordDonation(cryptoValue: number, currency: string = 'ETH'): void {
    if (!this.playerProgress) return;
    
    // DONATION records crypto value but awards 0 LOVE
    this.rewardLoveForAction('DONATION', { cryptoValue, currency });
  }

  /**
   * Get current structure
   * Returns the currently active structure being built
   */
  public getCurrentStructure(): any {
    return this.currentStructure;
  }

  /**
   * Get Cosmic Transition Manager
   * Returns the cosmic transition manager for planetary/astrological features
   */
  public getCosmicTransition(): CosmicTransitionManager {
    return this.cosmicTransitionManager;
  }

  /**
   * Get Critical Path Manager
   * Returns the critical path manager for task dependency analysis
   */
  public getCriticalPathManager(): CriticalPathManager {
    return this.criticalPathManager;
  }

  /**
   * Get Family Vibe Coding Manager
   * Returns the family vibe coding manager for collaborative coding sessions
   */
  public getFamilyVibeCoding(): FamilyVibeCodingManager {
    return this.familyVibeCoding;
  }

  /**
   * Get vesting manager
   * Returns the vesting manager for age-based access control
   */
  public getVestingManager(): VestingManager {
    return this.vestingManager;
  }

  /**
   * Get vesting status for a member
   */
  public getVestingStatus(memberId: string) {
    return this.vestingManager.getVestingStatus(memberId);
  }

  /**
   * Check if member can perform action (with vesting phase checks)
   */
  public canPerformAction(
    memberId: string,
    action: 'earn' | 'spend' | 'transfer' | 'deploy' | 'create_challenge',
    guardianApproved: boolean = false
  ): boolean {
    return this.vestingManager.canPerformAction(memberId, action, guardianApproved);
  }

  /**
   * Get Proof of Care manager
   */
  public getProofOfCareManager(): ProofOfCareManager {
    return this.proofOfCareManager;
  }

  /**
   * Record care interaction (for Proof of Care)
   */
  public recordCareInteraction(data: {
    memberId: string;
    interactionTime: Date;
    hrvSync: number;
    interactionDuration: number;
    engagementDepth: number;
    tasksVerified: number;
  }) {
    return this.proofOfCareManager.recordInteraction({
      ...data,
      interactionId: `interaction_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    });
  }

  /**
   * Verify care task (called by child's device)
   */
  public verifyCareTask(memberId: string, taskId: string, taskDescription: string): boolean {
    return this.proofOfCareManager.verifyTask(memberId, taskId, taskDescription);
  }
}