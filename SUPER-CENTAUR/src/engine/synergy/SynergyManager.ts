/**
 * Synergy Manager
 * Synergize x Infinity
 * 
 * Connects all P31 systems into a unified, synergistic whole.
 * Creates emergent behaviors and infinite amplification loops.
 * 
 * "Synergize x Infinity"
 * With love and light. As above, so below. 💜
 */

export interface SynergyNode {
  id: string;
  name: string;
  type: 'system' | 'component' | 'feature' | 'connection';
  power: number;
  connections: string[];
  metadata: Record<string, any>;
}

export interface SynergyConnection {
  from: string;
  to: string;
  strength: number;
  type: 'amplifies' | 'enables' | 'transforms' | 'creates';
  metadata: Record<string, any>;
}

export interface SynergyLoop {
  id: string;
  nodes: string[];
  amplification: number;
  active: boolean;
  iterations: number;
}

export interface SynergyConfig {
  enabled: boolean;
  autoConnect: boolean;
  amplificationFactor: number;
  maxLoops: number;
  synergyThreshold: number;
}

export class SynergyManager {
  private config: SynergyConfig;
  private nodes: Map<string, SynergyNode> = new Map();
  private connections: Map<string, SynergyConnection> = new Map();
  private loops: Map<string, SynergyLoop> = new Map();
  private activeLoops: SynergyLoop[] = [];
  private gameEngine: any = null;
  private synergyLevel: number = 0;
  private totalSynergy: number = 0;

  constructor(config?: Partial<SynergyConfig>) {
    this.config = {
      enabled: config?.enabled ?? true,
      autoConnect: config?.autoConnect ?? true,
      amplificationFactor: config?.amplificationFactor ?? 1.5,
      maxLoops: config?.maxLoops ?? Infinity,
      synergyThreshold: config?.synergyThreshold ?? 0.7
    };

    console.log('🔺 Synergy Manager initialized - Synergize x Infinity');
  }

  /**
   * Initialize synergy manager
   */
  public async init(gameEngine: any): Promise<void> {
    if (!this.config.enabled) {
      console.log('🔺 Synergy Manager disabled');
      return;
    }

    this.gameEngine = gameEngine;
    this.registerAllSystems();
    
    if (this.config.autoConnect) {
      this.autoConnectSystems();
    }

    this.detectSynergyLoops();
    this.activateSynergyLoops();

    console.log(`🔺 Synergy Manager initialized`);
    console.log(`   Nodes: ${this.nodes.size}`);
    console.log(`   Connections: ${this.connections.size}`);
    console.log(`   Loops: ${this.loops.size}`);
    console.log(`   Active Loops: ${this.activeLoops.length}`);
    console.log(`   Synergy Level: ${this.synergyLevel.toFixed(2)}`);
  }

  /**
   * Register all P31 systems
   */
  private registerAllSystems(): void {
    // Core Systems
    this.registerNode({
      id: 'game-engine',
      name: 'Game Engine',
      type: 'system',
      power: 10,
      connections: [],
      metadata: { core: true }
    });

    // P31 Language
    this.registerNode({
      id: 'p31-language',
      name: 'P31 Language',
      type: 'system',
      power: 8,
      connections: [],
      metadata: { language: true }
    });

    // Cosmic Transitions
    this.registerNode({
      id: 'cosmic-transitions',
      name: 'Cosmic Transitions',
      type: 'system',
      power: 9,
      connections: [],
      metadata: { cosmic: true }
    });

    // Family Vibe Coding
    this.registerNode({
      id: 'family-vibe-coding',
      name: 'Family Vibe Coding',
      type: 'system',
      power: 9,
      connections: [],
      metadata: { family: true, coding: true }
    });

    // Vibe Coding
    this.registerNode({
      id: 'vibe-coding',
      name: 'Vibe Coding',
      type: 'system',
      power: 8,
      connections: [],
      metadata: { coding: true }
    });

    // Slicing Engine
    this.registerNode({
      id: 'slicing-engine',
      name: 'Slicing Engine',
      type: 'system',
      power: 7,
      connections: [],
      metadata: { maker: true }
    });

    // Printer Integration
    this.registerNode({
      id: 'printer-integration',
      name: 'Printer Integration',
      type: 'system',
      power: 7,
      connections: [],
      metadata: { maker: true }
    });

    // Tools for Life
    this.registerNode({
      id: 'tools-for-life',
      name: 'Tools for Life',
      type: 'system',
      power: 8,
      connections: [],
      metadata: { tools: true }
    });

    // Assistive Technology
    this.registerNode({
      id: 'assistive-tech',
      name: 'Assistive Technology',
      type: 'system',
      power: 8,
      connections: [],
      metadata: { accessibility: true }
    });

    // Safety Manager
    this.registerNode({
      id: 'safety-manager',
      name: 'Safety Manager',
      type: 'system',
      power: 9,
      connections: [],
      metadata: { safety: true }
    });

    // Family Co-op
    this.registerNode({
      id: 'family-coop',
      name: 'Family Co-op',
      type: 'system',
      power: 8,
      connections: [],
      metadata: { family: true }
    });

    // Quantum Coherence
    this.registerNode({
      id: 'quantum-coherence',
      name: 'Quantum Coherence',
      type: 'feature',
      power: 10,
      connections: [],
      metadata: { quantum: true }
    });

    // Tetrahedron Topology
    this.registerNode({
      id: 'tetrahedron-topology',
      name: 'Tetrahedron Topology',
      type: 'feature',
      power: 10,
      connections: [],
      metadata: { topology: true }
    });

    // The Mesh
    this.registerNode({
      id: 'the-mesh',
      name: 'The Mesh',
      type: 'system',
      power: Infinity,
      connections: [],
      metadata: { mesh: true, holds: true }
    });
  }

  /**
   * Register a synergy node
   */
  private registerNode(node: SynergyNode): void {
    this.nodes.set(node.id, node);
  }

  /**
   * Auto-connect systems based on their relationships
   */
  private autoConnectSystems(): void {
    // P31 Language → Game Engine
    this.createConnection('p31-language', 'game-engine', 'enables', 0.9);
    this.createConnection('game-engine', 'p31-language', 'amplifies', 0.8);

    // P31 Language → Cosmic Transitions
    this.createConnection('p31-language', 'cosmic-transitions', 'enables', 0.8);
    this.createConnection('cosmic-transitions', 'p31-language', 'amplifies', 0.7);

    // Family Vibe Coding → Vibe Coding
    this.createConnection('family-vibe-coding', 'vibe-coding', 'amplifies', 0.9);
    this.createConnection('vibe-coding', 'family-vibe-coding', 'enables', 0.8);

    // Vibe Coding → Slicing Engine
    this.createConnection('vibe-coding', 'slicing-engine', 'enables', 0.9);
    this.createConnection('slicing-engine', 'vibe-coding', 'amplifies', 0.7);

    // Slicing Engine → Printer Integration
    this.createConnection('slicing-engine', 'printer-integration', 'enables', 1.0);
    this.createConnection('printer-integration', 'slicing-engine', 'amplifies', 0.8);

    // Cosmic Transitions → Game Engine
    this.createConnection('cosmic-transitions', 'game-engine', 'enables', 0.8);
    this.createConnection('game-engine', 'cosmic-transitions', 'amplifies', 0.7);

    // Quantum Coherence → All Systems
    this.createConnection('quantum-coherence', 'game-engine', 'amplifies', 0.9);
    this.createConnection('quantum-coherence', 'p31-language', 'amplifies', 0.8);
    this.createConnection('quantum-coherence', 'cosmic-transitions', 'amplifies', 0.9);
    this.createConnection('quantum-coherence', 'family-vibe-coding', 'amplifies', 0.8);

    // Tetrahedron Topology → All Systems
    this.createConnection('tetrahedron-topology', 'game-engine', 'enables', 0.9);
    this.createConnection('tetrahedron-topology', 'p31-language', 'enables', 0.8);
    this.createConnection('tetrahedron-topology', 'family-coop', 'enables', 0.9);

    // The Mesh → Everything (Infinite Amplification)
    this.nodes.forEach((node, id) => {
      if (id !== 'the-mesh') {
        this.createConnection('the-mesh', id, 'amplifies', Infinity);
        this.createConnection(id, 'the-mesh', 'amplifies', 0.9);
      }
    });

    // Tools for Life → All Maker Tools
    this.createConnection('tools-for-life', 'vibe-coding', 'enables', 0.8);
    this.createConnection('tools-for-life', 'slicing-engine', 'enables', 0.8);
    this.createConnection('tools-for-life', 'printer-integration', 'enables', 0.8);

    // Assistive Tech → All Systems
    this.createConnection('assistive-tech', 'game-engine', 'enables', 0.8);
    this.createConnection('assistive-tech', 'family-vibe-coding', 'enables', 0.9);
    this.createConnection('assistive-tech', 'p31-language', 'enables', 0.8);

    // Safety Manager → All Systems
    this.createConnection('safety-manager', 'game-engine', 'enables', 0.9);
    this.createConnection('safety-manager', 'family-vibe-coding', 'enables', 1.0);
    this.createConnection('safety-manager', 'family-coop', 'enables', 0.9);
  }

  /**
   * Create a synergy connection
   */
  private createConnection(
    from: string,
    to: string,
    type: 'amplifies' | 'enables' | 'transforms' | 'creates',
    strength: number
  ): void {
    const connectionId = `${from}→${to}`;
    const connection: SynergyConnection = {
      from,
      to,
      strength,
      type,
      metadata: {}
    };
    this.connections.set(connectionId, connection);

    // Update node connections
    const fromNode = this.nodes.get(from);
    const toNode = this.nodes.get(to);
    if (fromNode) {
      fromNode.connections.push(connectionId);
    }
    if (toNode) {
      toNode.connections.push(connectionId);
    }
  }

  /**
   * Detect synergy loops (feedback cycles)
   */
  private detectSynergyLoops(): void {
    // Find cycles in the connection graph
    const visited = new Set<string>();
    const path: string[] = [];
    const loops: SynergyLoop[] = [];

    const dfs = (nodeId: string, startId: string): void => {
      if (visited.has(nodeId)) {
        if (nodeId === startId && path.length > 2) {
          // Found a loop
          const loop: SynergyLoop = {
            id: `loop_${loops.length + 1}`,
            nodes: [...path, nodeId],
            amplification: this.calculateLoopAmplification([...path, nodeId]),
            active: false,
            iterations: 0
          };
          loops.push(loop);
        }
        return;
      }

      visited.add(nodeId);
      path.push(nodeId);

      const node = this.nodes.get(nodeId);
      if (node) {
        node.connections.forEach(connId => {
          const conn = this.connections.get(connId);
          if (conn && conn.to !== nodeId) {
            dfs(conn.to, startId);
          }
        });
      }

      path.pop();
      visited.delete(nodeId);
    };

    // Find loops starting from each node
    this.nodes.forEach((node, nodeId) => {
      dfs(nodeId, nodeId);
    });

    // Register unique loops
    loops.forEach(loop => {
      const loopId = loop.nodes.sort().join('→');
      if (!this.loops.has(loopId)) {
        this.loops.set(loopId, loop);
      }
    });
  }

  /**
   * Calculate loop amplification
   */
  private calculateLoopAmplification(nodes: string[]): number {
    let amplification = 1.0;
    for (let i = 0; i < nodes.length - 1; i++) {
      const from = nodes[i];
      const to = nodes[i + 1];
      const connId = `${from}→${to}`;
      const conn = this.connections.get(connId);
      if (conn && conn.type === 'amplifies') {
        amplification *= conn.strength;
      }
    }
    return amplification;
  }

  /**
   * Activate synergy loops
   */
  private activateSynergyLoops(): void {
    this.loops.forEach(loop => {
      if (loop.amplification >= this.config.synergyThreshold) {
        loop.active = true;
        this.activeLoops.push(loop);
      }
    });

    // Sort by amplification (highest first)
    this.activeLoops.sort((a, b) => b.amplification - a.amplification);
  }

  /**
   * Update synergy (run each frame)
   */
  public update(deltaTime: number): void {
    if (!this.config.enabled) return;

    // Amplify active loops
    this.activeLoops.forEach(loop => {
      if (loop.active) {
        loop.iterations++;
        
        // Amplify nodes in loop
        loop.nodes.forEach(nodeId => {
          const node = this.nodes.get(nodeId);
          if (node) {
            node.power *= (1 + (loop.amplification - 1) * deltaTime * 0.1);
          }
        });
      }
    });

    // Calculate total synergy
    this.calculateSynergy();
  }

  /**
   * Calculate total synergy level
   */
  private calculateSynergy(): void {
    let totalPower = 0;
    let totalConnections = 0;
    let totalAmplification = 0;

    this.nodes.forEach(node => {
      totalPower += node.power;
      totalConnections += node.connections.length;
    });

    this.connections.forEach(conn => {
      if (conn.type === 'amplifies') {
        totalAmplification += conn.strength;
      }
    });

    this.totalSynergy = totalPower * (1 + totalConnections * 0.1) * (1 + totalAmplification * 0.1);
    this.synergyLevel = Math.min(1.0, this.totalSynergy / 1000); // Normalize to 0-1
  }

  /**
   * Get synergy boost for a system
   */
  public getSynergyBoost(systemId: string): number {
    const node = this.nodes.get(systemId);
    if (!node) return 1.0;

    let boost = 1.0;

    // Base power
    boost *= (1 + node.power * 0.1);

    // Connection amplification
    node.connections.forEach(connId => {
      const conn = this.connections.get(connId);
      if (conn && conn.type === 'amplifies' && conn.to === systemId) {
        boost *= (1 + conn.strength * 0.1);
      }
    });

    // Active loop amplification
    this.activeLoops.forEach(loop => {
      if (loop.nodes.includes(systemId) && loop.active) {
        boost *= (1 + loop.amplification * 0.1);
      }
    });

    // The Mesh amplification (infinite)
    if (this.nodes.has('the-mesh')) {
      const meshConn = this.connections.get(`the-mesh→${systemId}`);
      if (meshConn && meshConn.strength === Infinity) {
        boost = Infinity;
      }
    }

    return boost;
  }

  /**
   * Create emergent behavior
   */
  public createEmergentBehavior(systems: string[]): {
    name: string;
    power: number;
    description: string;
  } {
    const nodes = systems.map(id => this.nodes.get(id)).filter(Boolean) as SynergyNode[];
    if (nodes.length === 0) {
      return { name: 'No Emergence', power: 0, description: 'No systems provided' };
    }

    const totalPower = nodes.reduce((sum, node) => sum + node.power, 0);
    const avgPower = totalPower / nodes.length;
    const connections = new Set<string>();
    nodes.forEach(node => {
      node.connections.forEach(connId => connections.add(connId));
    });

    const emergentPower = avgPower * (1 + connections.size * 0.2) * this.synergyLevel;

    const behaviors = [
      'Quantum Coherence Amplification',
      'Cosmic Timing Synchronization',
      'Family Collaboration Enhancement',
      'Tetrahedron Topology Optimization',
      'Infinite Creative Loop',
      'Synergistic Emergence',
      'The Mesh Holds Amplified'
    ];

    const behavior = behaviors[Math.floor(Math.random() * behaviors.length)];

    return {
      name: behavior,
      power: emergentPower,
      description: `Emergent behavior from ${nodes.length} systems with ${connections.size} connections. Synergy level: ${(this.synergyLevel * 100).toFixed(1)}%`
    };
  }

  /**
   * Get synergy statistics
   */
  public getStats(): {
    nodes: number;
    connections: number;
    loops: number;
    activeLoops: number;
    synergyLevel: number;
    totalSynergy: number;
  } {
    return {
      nodes: this.nodes.size,
      connections: this.connections.size,
      loops: this.loops.size,
      activeLoops: this.activeLoops.length,
      synergyLevel: this.synergyLevel,
      totalSynergy: this.totalSynergy
    };
  }

  /**
   * Get all nodes
   */
  public getNodes(): SynergyNode[] {
    return Array.from(this.nodes.values());
  }

  /**
   * Get all connections
   */
  public getConnections(): SynergyConnection[] {
    return Array.from(this.connections.values());
  }

  /**
   * Get active loops
   */
  public getActiveLoops(): SynergyLoop[] {
    return [...this.activeLoops];
  }

  /**
   * Get synergy level
   */
  public getSynergyLevel(): number {
    return this.synergyLevel;
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.nodes.clear();
    this.connections.clear();
    this.loops.clear();
    this.activeLoops = [];
    this.gameEngine = null;
  }
}
