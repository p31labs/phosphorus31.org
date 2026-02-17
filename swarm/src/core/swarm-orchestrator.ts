/**
 * Swarm Orchestrator - Core System Manager
 * 
 * Manages the entire swarm of specialized agents, coordinates their activities,
 * handles resource allocation, and ensures optimal performance across all operations.
 */

import { EventEmitter } from 'events';
import { Logger } from '../utils/logger';
import { SwarmConfig } from '../config/swarm-config';
import { SwarmMetrics } from '../monitoring/swarm-metrics';
import { FileSystemMonitor } from '../agents/file-system-monitor';
import { ProjectAnalyzer } from '../agents/project-analyzer';
import { FileOrganizer } from '../agents/file-organizer';
import { DependencyUpdater } from '../agents/dependency-updater';
import { CodeRepairer } from '../agents/code-repairer';
import { ResearchAgent } from '../agents/research-agent';
import { PerformanceOptimizer } from '../agents/performance-optimizer';
import { SecurityScanner } from '../agents/security-scanner';
import { DocumentationGenerator } from '../agents/documentation-generator';
import { ResourceMonitor } from '../monitoring/resource-monitor';
import { AgentRegistry } from './agent-registry';
import { AgentTask, AgentStatus, SwarmHealth } from '../types/agent-types';

export class SwarmOrchestrator extends EventEmitter {
  private config: SwarmConfig;
  private logger: Logger;
  private metrics: SwarmMetrics;
  private agentRegistry: AgentRegistry;
  
  // Core agents
  private fileSystemMonitor: FileSystemMonitor;
  private projectAnalyzer: ProjectAnalyzer;
  private fileOrganizer: FileOrganizer;
  private dependencyUpdater: DependencyUpdater;
  private codeRepairer: CodeRepairer;
  private researchAgent: ResearchAgent;
  private performanceOptimizer: PerformanceOptimizer;
  private securityScanner: SecurityScanner;
  private documentationGenerator: DocumentationGenerator;
  
  // Monitoring
  private resourceMonitor: ResourceMonitor;
  
  // State management
  private isInitialized: boolean = false;
  private isRunning: boolean = false;
  private activeTasks: Map<string, AgentTask> = new Map();
  private agentStatus: Map<string, AgentStatus> = new Map();

  constructor(config: SwarmConfig, logger: Logger, metrics: SwarmMetrics) {
    super();
    this.config = config;
    this.logger = logger;
    this.metrics = metrics;
    this.agentRegistry = new AgentRegistry();
  }

  /**
   * Initialize the swarm orchestrator and all agents
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      this.logger.warn('Swarm orchestrator already initialized');
      return;
    }

    this.logger.info('🏗️  Initializing Swarm Orchestrator...');

    try {
      // Initialize monitoring
      this.resourceMonitor = new ResourceMonitor(this.config, this.logger);
      await this.resourceMonitor.initialize();

      // Initialize all agents
      await this.initializeAgents();
      
      // Register all agents
      this.registerAgents();
      
      // Set up event handlers
      this.setupEventHandlers();
      
      this.isInitialized = true;
      this.logger.success('✅ Swarm Orchestrator initialized successfully');
      
    } catch (error) {
      this.logger.error('❌ Failed to initialize swarm orchestrator:', error);
      throw error;
    }
  }

  /**
   * Initialize all specialized agents
   */
  private async initializeAgents(): Promise<void> {
    const projectPath = this.config.get('project.path', process.cwd());
    
    this.fileSystemMonitor = new FileSystemMonitor(this.config, this.logger, projectPath);
    this.projectAnalyzer = new ProjectAnalyzer(this.config, this.logger, projectPath);
    this.fileOrganizer = new FileOrganizer(this.config, this.logger, projectPath);
    this.dependencyUpdater = new DependencyUpdater(this.config, this.logger, projectPath);
    this.codeRepairer = new CodeRepairer(this.config, this.logger, projectPath);
    this.researchAgent = new ResearchAgent(this.config, this.logger, projectPath);
    this.performanceOptimizer = new PerformanceOptimizer(this.config, this.logger, projectPath);
    this.securityScanner = new SecurityScanner(this.config, this.logger, projectPath);
    this.documentationGenerator = new DocumentationGenerator(this.config, this.logger, projectPath);

    // Initialize each agent
    const agents = [
      this.fileSystemMonitor,
      this.projectAnalyzer,
      this.fileOrganizer,
      this.dependencyUpdater,
      this.codeRepairer,
      this.researchAgent,
      this.performanceOptimizer,
      this.securityScanner,
      this.documentationGenerator
    ];

    for (const agent of agents) {
      await agent.initialize();
    }
  }

  /**
   * Register all agents with the registry
   */
  private registerAgents(): void {
    this.agentRegistry.register('file-system-monitor', this.fileSystemMonitor);
    this.agentRegistry.register('project-analyzer', this.projectAnalyzer);
    this.agentRegistry.register('file-organizer', this.fileOrganizer);
    this.agentRegistry.register('dependency-updater', this.dependencyUpdater);
    this.agentRegistry.register('code-repairer', this.codeRepairer);
    this.agentRegistry.register('research-agent', this.researchAgent);
    this.agentRegistry.register('performance-optimizer', this.performanceOptimizer);
    this.agentRegistry.register('security-scanner', this.securityScanner);
    this.agentRegistry.register('documentation-generator', this.documentationGenerator);

    this.logger.info(`📋 Registered ${this.agentRegistry.size()} agents`);
  }

  /**
   * Set up event handlers for agent communication
   */
  private setupEventHandlers(): void {
    // Handle agent status updates
    this.agentRegistry.getAllAgents().forEach((agent, name) => {
      agent.on('status-update', (status: AgentStatus) => {
        this.updateAgentStatus(name, status);
        this.emit('agent-status-update', { agentName: name, status });
      });

      agent.on('task-completed', (task: AgentTask) => {
        this.removeActiveTask(task.id);
        this.emit('task-completed', task);
      });

      agent.on('error', (error: Error) => {
        this.logger.error(`Agent ${name} error:`, error);
        this.emit('agent-error', { agentName: name, error });
      });
    });

    // Handle resource monitoring events
    this.resourceMonitor.on('resource-alert', (alert) => {
      this.logger.warn('Resource alert:', alert);
      this.emit('resource-alert', alert);
    });
  }

  /**
   * Start all agents in swarm mode
   */
  public async startAllAgents(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Swarm orchestrator not initialized');
    }

    this.isRunning = true;
    this.logger.info('🚀 Starting all swarm agents...');

    try {
      // Start resource monitoring
      await this.resourceMonitor.start();

      // Start all agents
      const agents = this.agentRegistry.getAllAgents();
      const startPromises: Promise<void>[] = [];

      agents.forEach((agent, name) => {
        startPromises.push(agent.start());
      });

      await Promise.all(startPromises);
      
      this.logger.success('✅ All swarm agents started successfully');
      
    } catch (error) {
      this.logger.error('❌ Failed to start swarm agents:', error);
      throw error;
    }
  }

  /**
   * Start only light agents for daemon mode
   */
  public async startLightAgents(): Promise<void> {
    if (!this.isInitialized) {
      throw new Error('Swarm orchestrator not initialized');
    }

    this.isRunning = true;
    this.logger.info('🌙 Starting light swarm agents for daemon mode...');

    try {
      // Start resource monitoring
      await this.resourceMonitor.start();

      // Start only essential agents for daemon mode
      const lightAgents = [
        this.fileSystemMonitor,
        this.projectAnalyzer,
        this.securityScanner
      ];

      const startPromises = lightAgents.map(agent => agent.start());
      await Promise.all(startPromises);
      
      this.logger.success('✅ Light swarm agents started successfully');
      
    } catch (error) {
      this.logger.error('❌ Failed to start light swarm agents:', error);
      throw error;
    }
  }

  /**
   * Set up file system monitoring
   */
  public setupFileSystemMonitoring(): void {
    if (this.fileSystemMonitor) {
      this.fileSystemMonitor.startMonitoring();
      this.logger.info('📁 File system monitoring enabled');
    }
  }

  /**
   * Get a specific agent
   */
  public getAgent(agentName: string): any {
    return this.agentRegistry.getAgent(agentName);
  }

  /**
   * Get status of all agents
   */
  public getAgentStatus(): Record<string, AgentStatus> {
    const status: Record<string, AgentStatus> = {};
    this.agentStatus.forEach((agentStatus, agentName) => {
      status[agentName] = agentStatus;
    });
    return status;
  }

  /**
   * Execute a specific agent
   */
  public async executeAgent(agentName: string, options?: any): Promise<any> {
    const agent = this.getAgent(agentName);
    if (!agent) {
      throw new Error(`Agent ${agentName} not found`);
    }

    this.logger.info(`🎯 Executing agent: ${agentName}`);
    const result = await agent.execute(options);
    this.logger.info(`✅ Agent ${agentName} completed`);
    
    return result;
  }

  /**
   * Schedule a task for an agent
   */
  public async scheduleTask(agentName: string, task: AgentTask): Promise<void> {
    const agent = this.getAgent(agentName);
    if (!agent) {
      throw new Error(`Agent ${agentName} not found`);
    }

    this.activeTasks.set(task.id, task);
    await agent.scheduleTask(task);
  }

  /**
   * Update agent status
   */
  private updateAgentStatus(agentName: string, status: AgentStatus): void {
    this.agentStatus.set(agentName, status);
    this.metrics.recordAgentStatus(agentName, status);
  }

  /**
   * Remove completed task
   */
  private removeActiveTask(taskId: string): void {
    this.activeTasks.delete(taskId);
  }

  /**
   * Get active tasks
   */
  public getActiveTasks(): AgentTask[] {
    return Array.from(this.activeTasks.values());
  }

  /**
   * Emergency stop all agents
   */
  public async emergencyStop(): Promise<void> {
    this.logger.warn('🚨 EMERGENCY STOP: Stopping all agents...');

    try {
      // Stop resource monitoring
      if (this.resourceMonitor) {
        await this.resourceMonitor.stop();
      }

      // Stop all agents
      const agents = this.agentRegistry.getAllAgents();
      const stopPromises: Promise<void>[] = [];

      agents.forEach((agent) => {
        stopPromises.push(agent.emergencyStop());
      });

      await Promise.all(stopPromises);
      
      this.isRunning = false;
      this.logger.info('🔒 All agents stopped');
      
    } catch (error) {
      this.logger.error('💥 Emergency stop failed:', error);
      throw error;
    }
  }

  /**
   * Stop all agents gracefully
   */
  public async stopAllAgents(): Promise<void> {
    if (!this.isRunning) {
      this.logger.warn('Swarm orchestrator is not running');
      return;
    }

    this.logger.info('🛑 Stopping all swarm agents...');

    try {
      // Stop resource monitoring
      if (this.resourceMonitor) {
        await this.resourceMonitor.stop();
      }

      // Stop all agents
      const agents = this.agentRegistry.getAllAgents();
      const stopPromises: Promise<void>[] = [];

      agents.forEach((agent) => {
        stopPromises.push(agent.stop());
      });

      await Promise.all(stopPromises);
      
      this.isRunning = false;
      this.logger.success('🌙 All swarm agents stopped successfully');
      
    } catch (error) {
      this.logger.error('💥 Failed to stop swarm agents:', error);
      throw error;
    }
  }

  /**
   * Get swarm health status
   */
  public getSwarmHealth(): SwarmHealth {
    const agentStatuses = this.getAgentStatus();
    const activeTasks = this.getActiveTasks();
    
    const healthyAgents = Object.values(agentStatuses)
      .filter(status => status.status === 'healthy').length;
    const totalAgents = Object.keys(agentStatuses).length;
    
    return {
      timestamp: new Date().toISOString(),
      isRunning: this.isRunning,
      healthyAgents: healthyAgents,
      totalAgents: totalAgents,
      activeTasks: activeTasks.length,
      resourceUsage: this.resourceMonitor ? this.resourceMonitor.getCurrentUsage() : {},
      agentStatuses
    };
  }

  /**
   * Scale agents based on load
   */
  public async scaleAgents(scaleFactor: number): Promise<void> {
    this.logger.info(`📈 Scaling agents by factor: ${scaleFactor}`);

    const agents = this.agentRegistry.getAllAgents();
    
    for (const [name, agent] of agents) {
      if (agent.scale) {
        await agent.scale(scaleFactor);
      }
    }
  }

  /**
   * Get performance metrics
   */
  public getPerformanceMetrics(): any {
    return {
      activeTasks: this.getActiveTasks().length,
      agentStatus: this.getAgentStatus(),
      resourceUsage: this.resourceMonitor ? this.resourceMonitor.getCurrentUsage() : {},
      metrics: this.metrics.getCurrentMetrics()
    };
  }
}