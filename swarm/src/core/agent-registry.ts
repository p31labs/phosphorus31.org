/**
 * Agent Registry
 * 
 * Manages registration, discovery, and lifecycle of all swarm agents.
 */

import { EventEmitter } from 'events';
import { Logger } from '../utils/logger';
import { AgentConfig, AgentRegistry as IAgentRegistry } from '../types/agent-types';

export class AgentRegistry extends EventEmitter implements IAgentRegistry {
  private agents: Map<string, any> = new Map();
  private agentConfigs: Map<string, AgentConfig> = new Map();
  private logger: Logger;

  constructor(logger: Logger) {
    super();
    this.logger = logger;
  }

  /**
   * Register an agent
   */
  public register(name: string, agent: any): void {
    if (this.agents.has(name)) {
      this.logger.warn(`Agent ${name} already registered, replacing...`);
    }

    this.agents.set(name, agent);
    this.logger.info(`📋 Registered agent: ${name}`);
    
    this.emit('agent-registered', { name, agent });
  }

  /**
   * Get an agent by name
   */
  public getAgent(name: string): any {
    const agent = this.agents.get(name);
    if (!agent) {
      this.logger.warn(`Agent ${name} not found`);
      return null;
    }
    return agent;
  }

  /**
   * Get all agents
   */
  public getAllAgents(): Map<string, any> {
    return new Map(this.agents);
  }

  /**
   * Get agent count
   */
  public size(): number {
    return this.agents.size;
  }

  /**
   * Unregister an agent
   */
  public unregister(name: string): void {
    if (this.agents.has(name)) {
      this.agents.delete(name);
      this.agentConfigs.delete(name);
      this.logger.info(`🗑️  Unregistered agent: ${name}`);
      this.emit('agent-unregistered', { name });
    }
  }

  /**
   * Clear all agents
   */
  public clear(): void {
    const agentNames = Array.from(this.agents.keys());
    this.agents.clear();
    this.agentConfigs.clear();
    this.logger.info(`🗑️  Cleared ${agentNames.length} agents`);
    this.emit('agents-cleared', { agentNames });
  }

  /**
   * Check if agent exists
   */
  public has(name: string): boolean {
    return this.agents.has(name);
  }

  /**
   * Get agent configuration
   */
  public getAgentConfig(name: string): AgentConfig | undefined {
    return this.agentConfigs.get(name);
  }

  /**
   * Set agent configuration
   */
  public setAgentConfig(name: string, config: AgentConfig): void {
    this.agentConfigs.set(name, config);
    this.emit('agent-config-updated', { name, config });
  }

  /**
   * Get all agent configurations
   */
  public getAllConfigs(): Map<string, AgentConfig> {
    return new Map(this.agentConfigs);
  }

  /**
   * Get agent status summary
   */
  public getAgentStatus(): Record<string, any> {
    const status: Record<string, any> = {};
    
    this.agents.forEach((agent, name) => {
      if (agent.getStatus) {
        status[name] = agent.getStatus();
      } else {
        status[name] = { name, status: 'unknown' };
      }
    });

    return status;
  }

  /**
   * Get healthy agents
   */
  public getHealthyAgents(): string[] {
    const healthyAgents: string[] = [];
    
    this.agents.forEach((agent, name) => {
      if (agent.getStatus) {
        const status = agent.getStatus();
        if (status.status === 'running' || status.status === 'ready') {
          healthyAgents.push(name);
        }
      }
    });

    return healthyAgents;
  }

  /**
   * Get running agents
   */
  public getRunningAgents(): string[] {
    const runningAgents: string[] = [];
    
    this.agents.forEach((agent, name) => {
      if (agent.getStatus) {
        const status = agent.getStatus();
        if (status.status === 'running') {
          runningAgents.push(name);
        }
      }
    });

    return runningAgents;
  }

  /**
   * Get agent dependencies
   */
  public getAgentDependencies(name: string): string[] {
    const config = this.agentConfigs.get(name);
    return config?.dependencies || [];
  }

  /**
   * Check if agent can start (dependencies satisfied)
   */
  public canStartAgent(name: string): boolean {
    const dependencies = this.getAgentDependencies(name);
    
    for (const dep of dependencies) {
      if (!this.agents.has(dep)) {
        this.logger.warn(`Agent ${name} cannot start: dependency ${dep} not registered`);
        return false;
      }

      const depAgent = this.agents.get(dep);
      if (depAgent.getStatus) {
        const status = depAgent.getStatus();
        if (status.status !== 'running' && status.status !== 'ready') {
          this.logger.warn(`Agent ${name} cannot start: dependency ${dep} not ready (${status.status})`);
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Get agent startup order based on dependencies
   */
  public getStartupOrder(): string[] {
    const visited = new Set<string>();
    const tempVisited = new Set<string>();
    const order: string[] = [];

    const visit = (name: string): void => {
      if (tempVisited.has(name)) {
        throw new Error(`Circular dependency detected for agent: ${name}`);
      }

      if (!visited.has(name)) {
        tempVisited.add(name);
        
        const dependencies = this.getAgentDependencies(name);
        for (const dep of dependencies) {
          visit(dep);
        }

        tempVisited.delete(name);
        visited.add(name);
        order.push(name);
      }
    };

    try {
      this.agents.forEach((_, name) => {
        if (!visited.has(name)) {
          visit(name);
        }
      });

      return order;
    } catch (error) {
      this.logger.error('Error calculating startup order:', error);
      return [];
    }
  }

  /**
   * Get agent shutdown order (reverse of startup)
   */
  public getShutdownOrder(): string[] {
    return this.getStartupOrder().reverse();
  }

  /**
   * Start all agents in dependency order
   */
  public async startAllAgents(): Promise<void> {
    const order = this.getStartupOrder();
    this.logger.info(`🚀 Starting ${order.length} agents in order: ${order.join(' -> ')}`);

    for (const name of order) {
      try {
        const agent = this.agents.get(name);
        if (agent.start) {
          await agent.start();
          this.logger.success(`✅ Started agent: ${name}`);
        }
      } catch (error) {
        this.logger.error(`❌ Failed to start agent ${name}:`, error);
        throw error;
      }
    }
  }

  /**
   * Stop all agents in reverse dependency order
   */
  public async stopAllAgents(): Promise<void> {
    const order = this.getShutdownOrder();
    this.logger.info(`🛑 Stopping ${order.length} agents in order: ${order.join(' -> ')}`);

    for (const name of order) {
      try {
        const agent = this.agents.get(name);
        if (agent.stop) {
          await agent.stop();
          this.logger.info(`🌙 Stopped agent: ${name}`);
        }
      } catch (error) {
        this.logger.error(`❌ Failed to stop agent ${name}:`, error);
      }
    }
  }

  /**
   * Emergency stop all agents
   */
  public async emergencyStopAll(): Promise<void> {
    this.logger.warn('🚨 EMERGENCY STOP: Stopping all agents immediately...');

    const agents = Array.from(this.agents.values());
    const stopPromises = agents.map(async (agent) => {
      try {
        if (agent.emergencyStop) {
          await agent.emergencyStop();
        } else if (agent.stop) {
          await agent.stop();
        }
      } catch (error) {
        this.logger.error('Error during emergency stop:', error);
      }
    });

    await Promise.allSettled(stopPromises);
    this.logger.info('🔒 All agents stopped');
  }

  /**
   * Restart an agent
   */
  public async restartAgent(name: string): Promise<void> {
    const agent = this.agents.get(name);
    if (!agent) {
      throw new Error(`Agent ${name} not found`);
    }

    this.logger.info(`🔄 Restarting agent: ${name}`);

    try {
      if (agent.stop) {
        await agent.stop();
      }
      if (agent.start) {
        await agent.start();
      }
      this.logger.success(`✅ Restarted agent: ${name}`);
    } catch (error) {
      this.logger.error(`❌ Failed to restart agent ${name}:`, error);
      throw error;
    }
  }

  /**
   * Get agent statistics
   */
  public getAgentStats(): Record<string, any> {
    const stats: Record<string, any> = {
      total: this.size(),
      healthy: this.getHealthyAgents().length,
      running: this.getRunningAgents().length,
      byStatus: {},
      byType: {}
    };

    this.agents.forEach((agent, name) => {
      if (agent.getStatus) {
        const status = agent.getStatus();
        stats.byStatus[status.status] = (stats.byStatus[status.status] || 0) + 1;
      }

      if (agent.type) {
        stats.byType[agent.type] = (stats.byType[agent.type] || 0) + 1;
      }
    });

    return stats;
  }

  /**
   * Validate agent configuration
   */
  public validateAgentConfig(config: AgentConfig): boolean {
    const requiredFields = ['name', 'enabled', 'priority', 'timeout', 'retryAttempts'];
    
    for (const field of requiredFields) {
      if (config[field as keyof AgentConfig] === undefined) {
        this.logger.error(`Invalid agent config: missing required field ${field}`);
        return false;
      }
    }

    // Validate dependencies exist
    for (const dep of config.dependencies) {
      if (!this.agents.has(dep)) {
        this.logger.warn(`Agent ${config.name} has dependency on non-existent agent: ${dep}`);
      }
    }

    return true;
  }

  /**
   * Get agent performance metrics
   */
  public getAgentMetrics(): Record<string, any> {
    const metrics: Record<string, any> = {};

    this.agents.forEach((agent, name) => {
      if (agent.getStatus) {
        const status = agent.getStatus();
        metrics[name] = {
          status: status.status,
          performance: status.performance,
          metrics: status.metrics
        };
      }
    });

    return metrics;
  }
}