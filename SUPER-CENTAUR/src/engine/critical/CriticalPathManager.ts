/**
 * Critical Path Manager
 * Identifies critical paths, dependencies, and bottlenecks
 * 
 * "Critical Path"
 * With love and light. As above, so below. 💜
 */

export interface Task {
  id: string;
  name: string;
  duration: number; // milliseconds
  dependencies: string[]; // task IDs that must complete first
  system: string; // which system this task belongs to
  priority: number; // 0-1, higher = more critical
  metadata: Record<string, any>;
}

export interface PathNode {
  taskId: string;
  earliestStart: number;
  latestStart: number;
  earliestFinish: number;
  latestFinish: number;
  slack: number; // latestStart - earliestStart
  isCritical: boolean;
}

export interface CriticalPath {
  id: string;
  tasks: string[]; // task IDs in order
  totalDuration: number;
  slack: number;
  bottlenecks: string[];
}

export interface DependencyGraph {
  nodes: Map<string, Task>;
  edges: Map<string, string[]>; // taskId -> dependent task IDs
  reverseEdges: Map<string, string[]>; // taskId -> dependency task IDs
}

export interface CriticalPathConfig {
  enabled: boolean;
  autoOptimize: boolean;
  trackBottlenecks: boolean;
  maxPathLength: number;
}

export class CriticalPathManager {
  private config: CriticalPathConfig;
  private tasks: Map<string, Task> = new Map();
  private dependencyGraph: DependencyGraph;
  private criticalPaths: Map<string, CriticalPath> = new Map();
  private pathNodes: Map<string, PathNode> = new Map();
  private executionOrder: string[] = [];
  private bottlenecks: string[] = [];

  constructor(config?: Partial<CriticalPathConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      autoOptimize: config?.autoOptimize ?? true,
      trackBottlenecks: config?.trackBottlenecks ?? true,
      maxPathLength: config?.maxPathLength ?? 100
    };

    this.dependencyGraph = {
      nodes: new Map(),
      edges: new Map(),
      reverseEdges: new Map()
    };

    console.log('🔺 Critical Path Manager initialized');
  }

  /**
   * Initialize critical path manager
   */
  public async init(): Promise<void> {
    if (!this.config.enabled) {
      console.log('🔺 Critical Path Manager disabled');
      return;
    }

    this.registerSystemTasks();
    this.buildDependencyGraph();
    this.calculateCriticalPaths();
    this.optimizeExecutionOrder();

    console.log(`🔺 Critical Path Manager initialized`);
    console.log(`   Tasks: ${this.tasks.size}`);
    console.log(`   Critical Paths: ${this.criticalPaths.size}`);
    console.log(`   Execution Order: ${this.executionOrder.length} tasks`);
  }

  /**
   * Register tasks for all P31 systems
   */
  private registerSystemTasks(): void {
    // Game Engine initialization
    this.registerTask({
      id: 'game-engine-init',
      name: 'Game Engine Initialization',
      duration: 100,
      dependencies: [],
      system: 'game-engine',
      priority: 1.0,
      metadata: {}
    });

    // P31 Language Parser
    this.registerTask({
      id: 'p31-parser-init',
      name: 'P31 Parser Initialization',
      duration: 50,
      dependencies: [],
      system: 'p31-language',
      priority: 0.9,
      metadata: {}
    });

    // P31 Language Executor
    this.registerTask({
      id: 'p31-executor-init',
      name: 'P31 Executor Initialization',
      duration: 50,
      dependencies: ['p31-parser-init'],
      system: 'p31-language',
      priority: 0.9,
      metadata: {}
    });

    // P31 Language Bridge
    this.registerTask({
      id: 'p31-bridge-init',
      name: 'P31 Language Bridge',
      duration: 30,
      dependencies: ['p31-executor-init', 'game-engine-init'],
      system: 'p31-language',
      priority: 0.95,
      metadata: {}
    });

    // Cosmic Transitions
    this.registerTask({
      id: 'cosmic-init',
      name: 'Cosmic Transitions Initialization',
      duration: 80,
      dependencies: [],
      system: 'cosmic-transitions',
      priority: 0.8,
      metadata: {}
    });

    // Family Vibe Coding
    this.registerTask({
      id: 'family-vibe-init',
      name: 'Family Vibe Coding Initialization',
      duration: 70,
      dependencies: ['game-engine-init'],
      system: 'family-vibe-coding',
      priority: 0.85,
      metadata: {}
    });

    // Vibe Coding
    this.registerTask({
      id: 'vibe-coding-init',
      name: 'Vibe Coding Initialization',
      duration: 60,
      dependencies: [],
      system: 'vibe-coding',
      priority: 0.8,
      metadata: {}
    });

    // Slicing Engine
    this.registerTask({
      id: 'slicing-init',
      name: 'Slicing Engine Initialization',
      duration: 90,
      dependencies: [],
      system: 'slicing-engine',
      priority: 0.7,
      metadata: {}
    });

    // Printer Integration
    this.registerTask({
      id: 'printer-init',
      name: 'Printer Integration Initialization',
      duration: 100,
      dependencies: ['slicing-init'],
      system: 'printer-integration',
      priority: 0.7,
      metadata: {}
    });

    // Infinite Synergy
    this.registerTask({
      id: 'infinite-synergy-init',
      name: 'Infinite Synergy Initialization',
      duration: 120,
      dependencies: ['game-engine-init', 'p31-bridge-init'],
      system: 'infinite-synergy',
      priority: 1.0,
      metadata: {}
    });

    // Synergy connections (can run in parallel after init)
    this.registerTask({
      id: 'synergy-connect',
      name: 'Synergy Connections',
      duration: 50,
      dependencies: ['infinite-synergy-init'],
      system: 'infinite-synergy',
      priority: 0.9,
      metadata: {}
    });

    // Code execution path
    this.registerTask({
      id: 'code-parse',
      name: 'Parse P31 Code',
      duration: 20,
      dependencies: ['p31-parser-init'],
      system: 'p31-language',
      priority: 0.8,
      metadata: {}
    });

    this.registerTask({
      id: 'code-execute',
      name: 'Execute P31 Code',
      duration: 30,
      dependencies: ['code-parse', 'p31-executor-init'],
      system: 'p31-language',
      priority: 0.9,
      metadata: {}
    });

    // Build path
    this.registerTask({
      id: 'build-structure',
      name: 'Build Structure',
      duration: 40,
      dependencies: ['code-execute', 'game-engine-init'],
      system: 'game-engine',
      priority: 0.8,
      metadata: {}
    });

    // Slice path
    this.registerTask({
      id: 'slice-model',
      name: 'Slice 3D Model',
      duration: 100,
      dependencies: ['build-structure', 'slicing-init'],
      system: 'slicing-engine',
      priority: 0.7,
      metadata: {}
    });

    // Print path
    this.registerTask({
      id: 'print-model',
      name: 'Print Model',
      duration: 200,
      dependencies: ['slice-model', 'printer-init'],
      system: 'printer-integration',
      priority: 0.6,
      metadata: {}
    });
  }

  /**
   * Register a task
   */
  private registerTask(task: Task): void {
    this.tasks.set(task.id, task);
    this.dependencyGraph.nodes.set(task.id, task);
  }

  /**
   * Build dependency graph
   */
  private buildDependencyGraph(): void {
    this.tasks.forEach((task, taskId) => {
      // Forward edges (dependencies -> this task)
      task.dependencies.forEach(depId => {
        if (!this.dependencyGraph.edges.has(depId)) {
          this.dependencyGraph.edges.set(depId, []);
        }
        this.dependencyGraph.edges.get(depId)!.push(taskId);
      });

      // Reverse edges (this task -> dependencies)
      if (!this.dependencyGraph.reverseEdges.has(taskId)) {
        this.dependencyGraph.reverseEdges.set(taskId, []);
      }
      this.dependencyGraph.reverseEdges.set(taskId, task.dependencies);
    });
  }

  /**
   * Calculate critical paths using forward and backward pass
   */
  private calculateCriticalPaths(): void {
    // Forward pass: calculate earliest start/finish
    const forwardPass = this.forwardPass();
    
    // Backward pass: calculate latest start/finish
    const backwardPass = this.backwardPass(forwardPass);

    // Calculate slack and identify critical tasks
    this.pathNodes.clear();
    forwardPass.forEach((forward, taskId) => {
      const backward = backwardPass.get(taskId)!;
      const slack = backward.latestStart - forward.earliestStart;
      const isCritical = slack === 0;

      this.pathNodes.set(taskId, {
        taskId,
        earliestStart: forward.earliestStart,
        latestStart: backward.latestStart,
        earliestFinish: forward.earliestFinish,
        latestFinish: backward.latestFinish,
        slack,
        isCritical
      });
    });

    // Find critical paths
    this.findCriticalPaths();
  }

  /**
   * Forward pass: calculate earliest start/finish times
   */
  private forwardPass(): Map<string, { earliestStart: number; earliestFinish: number }> {
    const result = new Map<string, { earliestStart: number; earliestFinish: number }>();
    const visited = new Set<string>();

    const dfs = (taskId: string): void => {
      if (visited.has(taskId)) return;
      visited.add(taskId);

      const task = this.tasks.get(taskId)!;
      let earliestStart = 0;

      // Earliest start is max of all dependency finish times
      task.dependencies.forEach(depId => {
        if (!visited.has(depId)) {
          dfs(depId);
        }
        const depResult = result.get(depId)!;
        earliestStart = Math.max(earliestStart, depResult.earliestFinish);
      });

      const earliestFinish = earliestStart + task.duration;
      result.set(taskId, { earliestStart, earliestFinish });
    };

    // Process all tasks
    this.tasks.forEach((_, taskId) => {
      if (!visited.has(taskId)) {
        dfs(taskId);
      }
    });

    return result;
  }

  /**
   * Backward pass: calculate latest start/finish times
   */
  private backwardPass(
    forwardPass: Map<string, { earliestStart: number; earliestFinish: number }>
  ): Map<string, { latestStart: number; latestFinish: number }> {
    const result = new Map<string, { latestStart: number; latestFinish: number }>();
    
    // Find project completion time (max earliest finish)
    let projectFinish = 0;
    forwardPass.forEach((forward) => {
      projectFinish = Math.max(projectFinish, forward.earliestFinish);
    });

    // Process tasks in reverse topological order
    const processed = new Set<string>();
    const processTask = (taskId: string): void => {
      if (processed.has(taskId)) return;

      const task = this.tasks.get(taskId)!;
      let latestFinish = projectFinish;

      // Latest finish is min of all dependent task start times
      const dependents = this.dependencyGraph.edges.get(taskId) || [];
      dependents.forEach(depId => {
        if (!processed.has(depId)) {
          processTask(depId);
        }
        const depResult = result.get(depId)!;
        latestFinish = Math.min(latestFinish, depResult.latestStart);
      });

      const latestStart = latestFinish - task.duration;
      result.set(taskId, { latestStart, latestFinish });
      processed.add(taskId);
    };

    // Process all tasks
    this.tasks.forEach((_, taskId) => {
      if (!processed.has(taskId)) {
        processTask(taskId);
      }
    });

    return result;
  }

  /**
   * Find critical paths (sequences of critical tasks)
   */
  private findCriticalPaths(): void {
    this.criticalPaths.clear();
    const criticalTasks = Array.from(this.pathNodes.values())
      .filter(node => node.isCritical)
      .map(node => node.taskId);

    // Find paths through critical tasks
    const paths: string[][] = [];
    const visited = new Set<string>();

    const findPath = (taskId: string, currentPath: string[]): void => {
      if (visited.has(taskId)) return;
      visited.add(taskId);

      const task = this.tasks.get(taskId)!;
      const newPath = [...currentPath, taskId];

      // Check if this is a terminal task (no critical dependents)
      const dependents = this.dependencyGraph.edges.get(taskId) || [];
      const criticalDependents = dependents.filter(id => 
        this.pathNodes.get(id)?.isCritical
      );

      if (criticalDependents.length === 0) {
        // End of path
        paths.push(newPath);
      } else {
        // Continue path
        criticalDependents.forEach(depId => {
          findPath(depId, newPath);
        });
      }
    };

    // Start from tasks with no critical dependencies
    criticalTasks.forEach(taskId => {
      const task = this.tasks.get(taskId)!;
      const criticalDeps = task.dependencies.filter(id =>
        this.pathNodes.get(id)?.isCritical
      );

      if (criticalDeps.length === 0) {
        visited.clear();
        findPath(taskId, []);
      }
    });

    // Register critical paths
    paths.forEach((path, index) => {
      const totalDuration = path.reduce((sum, taskId) => {
        return sum + (this.tasks.get(taskId)?.duration || 0);
      }, 0);

      const bottlenecks = this.identifyBottlenecks(path);

      const criticalPath: CriticalPath = {
        id: `path_${index + 1}`,
        tasks: path,
        totalDuration,
        slack: 0,
        bottlenecks
      };

      this.criticalPaths.set(criticalPath.id, criticalPath);
    });
  }

  /**
   * Identify bottlenecks in a path
   */
  private identifyBottlenecks(path: string[]): string[] {
    const bottlenecks: string[] = [];
    
    path.forEach(taskId => {
      const task = this.tasks.get(taskId);
      if (!task) return;

      // High duration relative to path
      const pathAvg = path.reduce((sum, id) => 
        sum + (this.tasks.get(id)?.duration || 0), 0
      ) / path.length;

      if (task.duration > pathAvg * 1.5) {
        bottlenecks.push(taskId);
      }

      // Many dependencies
      if (task.dependencies.length > 3) {
        bottlenecks.push(taskId);
      }

      // High priority
      if (task.priority > 0.9) {
        bottlenecks.push(taskId);
      }
    });

    return [...new Set(bottlenecks)];
  }

  /**
   * Optimize execution order (topological sort)
   */
  private optimizeExecutionOrder(): void {
    const order: string[] = [];
    const visited = new Set<string>();
    const visiting = new Set<string>();

    const visit = (taskId: string): void => {
      if (visited.has(taskId)) return;
      if (visiting.has(taskId)) {
        console.warn(`Circular dependency detected involving ${taskId}`);
        return;
      }

      visiting.add(taskId);
      const task = this.tasks.get(taskId);
      if (task) {
        task.dependencies.forEach(depId => visit(depId));
      }
      visiting.delete(taskId);
      visited.add(taskId);
      order.push(taskId);
    };

    this.tasks.forEach((_, taskId) => {
      if (!visited.has(taskId)) {
        visit(taskId);
      }
    });

    this.executionOrder = order;

    // Update bottlenecks
    if (this.config.trackBottlenecks) {
      this.bottlenecks = this.identifyBottlenecks(
        Array.from(this.pathNodes.values())
          .filter(node => node.isCritical)
          .map(node => node.taskId)
      );
    }
  }

  /**
   * Get critical paths
   */
  public getCriticalPaths(): CriticalPath[] {
    return Array.from(this.criticalPaths.values());
  }

  /**
   * Get execution order
   */
  public getExecutionOrder(): string[] {
    return [...this.executionOrder];
  }

  /**
   * Get bottlenecks
   */
  public getBottlenecks(): string[] {
    return [...this.bottlenecks];
  }

  /**
   * Get path nodes (with timing information)
   */
  public getPathNodes(): PathNode[] {
    return Array.from(this.pathNodes.values());
  }

  /**
   * Get task
   */
  public getTask(taskId: string): Task | null {
    return this.tasks.get(taskId) || null;
  }

  /**
   * Get all tasks
   */
  public getTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Get dependency graph
   */
  public getDependencyGraph(): DependencyGraph {
    return this.dependencyGraph;
  }

  /**
   * Calculate total project duration
   */
  public getProjectDuration(): number {
    let maxFinish = 0;
    this.pathNodes.forEach(node => {
      maxFinish = Math.max(maxFinish, node.earliestFinish);
    });
    return maxFinish;
  }

  /**
   * Get critical path statistics
   */
  public getStats(): {
    totalTasks: number;
    criticalTasks: number;
    criticalPaths: number;
    projectDuration: number;
    bottlenecks: number;
  } {
    return {
      totalTasks: this.tasks.size,
      criticalTasks: Array.from(this.pathNodes.values())
        .filter(node => node.isCritical).length,
      criticalPaths: this.criticalPaths.size,
      projectDuration: this.getProjectDuration(),
      bottlenecks: this.bottlenecks.length
    };
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.tasks.clear();
    this.criticalPaths.clear();
    this.pathNodes.clear();
    this.executionOrder = [];
    this.bottlenecks = [];
    this.dependencyGraph = {
      nodes: new Map(),
      edges: new Map(),
      reverseEdges: new Map()
    };
  }
}
