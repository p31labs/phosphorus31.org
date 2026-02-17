/**
 * Synergy Engine
 * Infinite compounding synergy across all P31 components
 * 
 * "Synergize x Infinity"
 * 
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import { Logger } from '../utils/logger';

export interface SynergyNode {
  id: string;
  component: string;
  baseSynergy: number;
  compoundedSynergy: number;
  connections: string[];
  multiplier: number;
  lastUpdate: number;
}

export interface SynergyConnection {
  from: string;
  to: string;
  strength: number;
  type: 'direct' | 'indirect' | 'quantum' | 'metabolic' | 'cognitive';
}

export interface SynergyState {
  totalSynergy: number;
  nodes: Map<string, SynergyNode>;
  connections: SynergyConnection[];
  compoundingRate: number;
  infinity: boolean;
}

export class SynergyEngine {
  private logger: Logger;
  private state: SynergyState;
  private updateInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.logger = new Logger('SynergyEngine');
    this.state = {
      totalSynergy: 0,
      nodes: new Map(),
      connections: [],
      compoundingRate: 1.0,
      infinity: true, // Always compounding
    };
    this.startInfiniteCompounding();
  }

  /**
   * Register a component for synergy calculation
   */
  public registerComponent(
    id: string,
    component: string,
    baseSynergy: number = 1.0,
    connections: string[] = []
  ): SynergyNode {
    const node: SynergyNode = {
      id,
      component,
      baseSynergy,
      compoundedSynergy: baseSynergy,
      connections,
      multiplier: 1.0,
      lastUpdate: Date.now(),
    };

    this.state.nodes.set(id, node);
    this.logger.info(`Component ${component} (${id}) registered with base synergy ${baseSynergy}`);

    // Auto-connect to existing nodes
    this.autoConnect(node);

    return node;
  }

  /**
   * Create synergy connection
   */
  public createConnection(
    from: string,
    to: string,
    strength: number = 1.0,
    type: SynergyConnection['type'] = 'direct'
  ): SynergyConnection {
    const connection: SynergyConnection = {
      from,
      to,
      strength,
      type,
    };

    this.state.connections.push(connection);

    // Update node connections
    const fromNode = this.state.nodes.get(from);
    const toNode = this.state.nodes.get(to);

    if (fromNode && !fromNode.connections.includes(to)) {
      fromNode.connections.push(to);
    }
    if (toNode && !toNode.connections.includes(from)) {
      toNode.connections.push(from);
    }

    this.logger.info(`Synergy connection created: ${from} → ${to} (${type}, strength: ${strength})`);

    return connection;
  }

  /**
   * Calculate compounded synergy for a node
   */
  public calculateSynergy(nodeId: string): number {
    const node = this.state.nodes.get(nodeId);
    if (!node) return 0;

    // Base synergy
    let synergy = node.baseSynergy;

    // Direct connections multiply
    for (const connectionId of node.connections) {
      const connection = this.state.connections.find(
        c => (c.from === nodeId && c.to === connectionId) || (c.to === nodeId && c.from === connectionId)
      );
      if (connection) {
        const connectedNode = this.state.nodes.get(connectionId);
        if (connectedNode) {
          // Synergy compounds through connections
          synergy *= (1 + connection.strength * connectedNode.compoundedSynergy * 0.1);
        }
      }
    }

    // Apply multiplier
    synergy *= node.multiplier;

    // Apply compounding rate
    synergy *= this.state.compoundingRate;

    // Infinity: always growing
    if (this.state.infinity) {
      const timeSinceUpdate = (Date.now() - node.lastUpdate) / 1000; // seconds
      synergy *= (1 + timeSinceUpdate * 0.001); // Continuous growth
    }

    return synergy;
  }

  /**
   * Update all synergies (compounding)
   */
  public updateSynergies(): void {
    let totalSynergy = 0;

    for (const [id, node] of this.state.nodes.entries()) {
      const newSynergy = this.calculateSynergy(id);
      node.compoundedSynergy = newSynergy;
      node.lastUpdate = Date.now();
      totalSynergy += newSynergy;
    }

    this.state.totalSynergy = totalSynergy;

    // Compounding rate increases with more connections
    const connectionCount = this.state.connections.length;
    this.state.compoundingRate = 1.0 + (connectionCount * 0.01);

    this.logger.debug(`Total synergy: ${totalSynergy.toFixed(2)}, Compounding rate: ${this.state.compoundingRate.toFixed(3)}`);
  }

  /**
   * Start infinite compounding loop
   */
  private startInfiniteCompounding(): void {
    // Update every 100ms for continuous compounding
    this.updateInterval = setInterval(() => {
      this.updateSynergies();
    }, 100);

    this.logger.info('Infinite synergy compounding started');
  }

  /**
   * Auto-connect new node to existing nodes
   */
  private autoConnect(newNode: SynergyNode): void {
    for (const [id, existingNode] of this.state.nodes.entries()) {
      if (id !== newNode.id) {
        // Determine connection type based on components
        let type: SynergyConnection['type'] = 'direct';
        let strength = 1.0;

        // Quantum connections
        if (newNode.component.includes('quantum') || existingNode.component.includes('quantum')) {
          type = 'quantum';
          strength = 1.5;
        }

        // Metabolic connections
        if (newNode.component.includes('metabolism') || existingNode.component.includes('metabolism')) {
          type = 'metabolic';
          strength = 1.2;
        }

        // Cognitive connections
        if (newNode.component.includes('cognitive') || existingNode.component.includes('cognitive')) {
          type = 'cognitive';
          strength = 1.3;
        }

        // Create connection
        this.createConnection(newNode.id, id, strength, type);
      }
    }
  }

  /**
   * Get synergy state
   */
  public getState(): SynergyState {
    return {
      ...this.state,
      nodes: new Map(this.state.nodes), // Clone for safety
    };
  }

  /**
   * Get total synergy
   */
  public getTotalSynergy(): number {
    return this.state.totalSynergy;
  }

  /**
   * Get node synergy
   */
  public getNodeSynergy(nodeId: string): number {
    const node = this.state.nodes.get(nodeId);
    return node ? node.compoundedSynergy : 0;
  }

  /**
   * Boost synergy (temporary multiplier)
   */
  public boostSynergy(nodeId: string, multiplier: number, duration: number = 5000): void {
    const node = this.state.nodes.get(nodeId);
    if (!node) return;

    const originalMultiplier = node.multiplier;
    node.multiplier *= multiplier;

    setTimeout(() => {
      if (node) {
        node.multiplier = originalMultiplier;
      }
    }, duration);

    this.logger.info(`Synergy boost applied to ${nodeId}: ${multiplier}x for ${duration}ms`);
  }

  /**
   * Get synergy network visualization data
   */
  public getNetworkData(): {
    nodes: Array<{ id: string; label: string; synergy: number }>;
    edges: Array<{ from: string; to: string; strength: number; type: string }>;
  } {
    const nodes = Array.from(this.state.nodes.values()).map(node => ({
      id: node.id,
      label: node.component,
      synergy: node.compoundedSynergy,
    }));

    const edges = this.state.connections.map(conn => ({
      from: conn.from,
      to: conn.to,
      strength: conn.strength,
      type: conn.type,
    }));

    return { nodes, edges };
  }

  /**
   * Reset synergy (keep structure, reset values)
   */
  public reset(): void {
    for (const node of this.state.nodes.values()) {
      node.compoundedSynergy = node.baseSynergy;
      node.multiplier = 1.0;
    }
    this.state.totalSynergy = 0;
    this.state.compoundingRate = 1.0;
    this.logger.info('Synergy reset');
  }

  /**
   * Dispose and cleanup
   */
  public dispose(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.logger.info('Synergy engine disposed');
  }
}
