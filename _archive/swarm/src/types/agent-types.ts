/**
 * Agent Type Definitions
 * 
 * Defines the core types and interfaces for the swarm agent system.
 */

export interface AgentTask {
  id: string;
  type: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'running' | 'completed' | 'failed';
  agentName: string;
  options?: any;
  startTime?: Date;
  endTime?: Date;
  result?: any;
  error?: Error;
}

export interface AgentStatus {
  name: string;
  status: 'initialized' | 'ready' | 'running' | 'stopped' | 'error' | 'emergency-stopped';
  lastUpdate: string;
  performance: {
    cpu: number;
    memory: number;
    uptime: number;
  };
  metrics: {
    filesMonitored?: number;
    changesDetected?: number;
    errors?: number;
    analysesPerformed?: number;
    filesAnalyzed?: number;
    issuesFound?: number;
    tasksCompleted?: number;
    tasksFailed?: number;
  };
}

export interface SwarmHealth {
  timestamp: string;
  isRunning: boolean;
  healthyAgents: number;
  totalAgents: number;
  activeTasks: number;
  resourceUsage: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
  agentStatuses: Record<string, AgentStatus>;
}

export interface AgentConfig {
  name: string;
  enabled: boolean;
  priority: number;
  maxConcurrentTasks: number;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  dependencies: string[];
  resourceLimits: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

export interface AgentRegistry {
  register(name: string, agent: any): void;
  getAgent(name: string): any;
  getAllAgents(): Map<string, any>;
  size(): number;
  unregister(name: string): void;
  clear(): void;
}

export interface AgentEvent {
  type: 'status-update' | 'task-completed' | 'task-failed' | 'error' | 'resource-alert';
  timestamp: string;
  agentName: string;
  data: any;
}

export interface AgentMetrics {
  agentName: string;
  timestamp: string;
  performance: {
    cpu: number;
    memory: number;
    uptime: number;
  };
  tasks: {
    completed: number;
    failed: number;
    pending: number;
  };
  errors: Error[];
  resourceUsage: {
    cpu: number;
    memory: number;
    disk: number;
  };
}

export interface AgentResult {
  success: boolean;
  data?: any;
  error?: Error;
  metadata: {
    agentName: string;
    executionTime: number;
    timestamp: string;
  };
}

export interface AgentScheduler {
  scheduleTask(task: AgentTask): Promise<void>;
  cancelTask(taskId: string): Promise<void>;
  getPendingTasks(): AgentTask[];
  getCompletedTasks(): AgentTask[];
  getFailedTasks(): AgentTask[];
  getTaskStatus(taskId: string): AgentTask | null;
}

export interface AgentCommunication {
  send(message: AgentMessage): Promise<void>;
  receive(): Promise<AgentMessage>;
  broadcast(message: AgentMessage): Promise<void>;
  subscribe(topic: string, callback: (message: AgentMessage) => void): void;
  unsubscribe(topic: string, callback: (message: AgentMessage) => void): void;
}

export interface AgentMessage {
  id: string;
  type: string;
  from: string;
  to: string;
  timestamp: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  data: any;
  metadata: {
    topic: string;
    correlationId: string;
    replyTo?: string;
  };
}

export interface AgentResource {
  type: 'cpu' | 'memory' | 'disk' | 'network';
  usage: number;
  limit: number;
  available: number;
  reserved: number;
}

export interface AgentScaling {
  currentScale: number;
  minScale: number;
  maxScale: number;
  targetUtilization: number;
  scaleUpThreshold: number;
  scaleDownThreshold: number;
  cooldownPeriod: number;
}

export interface AgentHealthCheck {
  agentName: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  lastCheck: string;
  checks: HealthCheckResult[];
  overallHealth: number;
}

export interface HealthCheckResult {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  message: string;
  timestamp: string;
  duration: number;
}

export interface AgentPerformance {
  agentName: string;
  executionTime: number;
  memoryUsage: number;
  cpuUsage: number;
  throughput: number;
  latency: number;
  errorRate: number;
  successRate: number;
}

export interface AgentDependency {
  name: string;
  version: string;
  type: 'required' | 'optional' | 'peer';
  status: 'installed' | 'missing' | 'outdated';
  compatibility: string;
}

export interface AgentConfiguration {
  agentName: string;
  settings: Record<string, any>;
  environment: Record<string, string>;
  secrets: Record<string, string>;
  overrides: Record<string, any>;
}

export interface AgentLifecycle {
  onInitialize(): Promise<void>;
  onStart(): Promise<void>;
  onStop(): Promise<void>;
  onEmergencyStop(): Promise<void>;
  onTaskStart(task: AgentTask): Promise<void>;
  onTaskComplete(task: AgentTask): Promise<void>;
  onTaskError(task: AgentTask, error: Error): Promise<void>;
  onStatusUpdate(status: AgentStatus): Promise<void>;
}

export interface AgentFactory {
  createAgent(config: AgentConfig): any;
  destroyAgent(agentName: string): Promise<void>;
  getAgentTemplate(type: string): AgentConfig;
  validateAgentConfig(config: AgentConfig): boolean;
}

export interface AgentPool {
  acquire(agentType: string): Promise<any>;
  release(agent: any): Promise<void>;
  destroy(agent: any): Promise<void>;
  getAvailableAgents(): number;
  getBusyAgents(): number;
  getPoolSize(): number;
  resize(newSize: number): Promise<void>;
}

export interface AgentQueue {
  enqueue(task: AgentTask): Promise<void>;
  dequeue(): Promise<AgentTask | null>;
  peek(): Promise<AgentTask | null>;
  remove(taskId: string): Promise<boolean>;
  clear(): Promise<void>;
  size(): number;
  isEmpty(): boolean;
}

export interface AgentWorkflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
  dependencies: string[];
  parallel: boolean;
  timeout: number;
  retries: number;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
}

export interface WorkflowStep {
  id: string;
  agentName: string;
  taskType: string;
  options: any;
  dependencies: string[];
  timeout: number;
  retries: number;
  onSuccess?: string;
  onFailure?: string;
}

export interface AgentOrchestration {
  workflow: AgentWorkflow;
  executionPlan: ExecutionPlan;
  resourceAllocation: ResourceAllocation;
  monitoring: OrchestrationMonitoring;
  status: 'pending' | 'running' | 'completed' | 'failed';
}

export interface ExecutionPlan {
  steps: ExecutionStep[];
  dependencies: Map<string, string[]>;
  parallelGroups: string[][];
  executionOrder: string[];
}

export interface ExecutionStep {
  stepId: string;
  agentName: string;
  task: AgentTask;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  result?: AgentResult;
}

export interface ResourceAllocation {
  agentAllocations: Map<string, AgentResource[]>;
  sharedResources: AgentResource[];
  allocationStrategy: 'round-robin' | 'priority' | 'load-balanced';
  deallocationStrategy: 'immediate' | 'graceful' | 'lazy';
}

export interface OrchestrationMonitoring {
  stepMetrics: Map<string, AgentPerformance>;
  resourceMetrics: Map<string, AgentResource>;
  errorMetrics: Map<string, Error[]>;
  throughputMetrics: Map<string, number>;
  latencyMetrics: Map<string, number>;
}