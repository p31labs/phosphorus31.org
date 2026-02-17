/**
 * Synergy Engine
 * Infinite Synergy - The Whole Greater Than The Sum of Parts
 * 
 * "Synergize x infinity"
 * 
 * Based on Buckminster Fuller's Synergetics:
 * - The whole is greater than the sum of its parts
 * - Minimum stable system (Tetrahedron K_4)
 * - Infinite scaling through geometric recursion
 * - Emergent properties from connections
 * 
 * 💜 With love and light. As above, so below. 💜
 * The mesh holds. 🔺
 */

import * as THREE from 'three';

export interface SynergyNode {
  id: string;
  type: 'vertex' | 'edge' | 'face' | 'system' | 'module';
  position: THREE.Vector3;
  connections: string[]; // IDs of connected nodes
  energy: number; // 0-1, synergy energy level
  coherence: number; // 0-1, quantum coherence
  metadata: Record<string, any>;
  createdAt: number;
  updatedAt: number;
}

export interface SynergyConnection {
  id: string;
  from: string;
  to: string;
  strength: number; // 0-1, connection strength
  type: 'structural' | 'quantum' | 'data' | 'energy' | 'love';
  bidirectional: boolean;
  metadata: Record<string, any>;
  createdAt: number;
}

export interface SynergySystem {
  id: string;
  name: string;
  nodes: Map<string, SynergyNode>;
  connections: Map<string, SynergyConnection>;
  level: number; // Recursion level (0 = base, 1+ = nested)
  parentSystem?: string; // ID of parent system
  childSystems: string[]; // IDs of child systems
  synergy: number; // 0-1, overall synergy score
  energy: number; // Total system energy
  coherence: number; // System-wide coherence
  createdAt: number;
  updatedAt: number;
}

export interface SynergyConfig {
  enableInfiniteRecursion: boolean;
  maxRecursionDepth: number; // Infinity = unlimited
  synergyThreshold: number; // Minimum synergy to maintain
  energyDecayRate: number; // Energy decay per update
  coherencePersistence: number; // How long coherence persists
  connectionDecayRate: number; // Connection strength decay
  enableQuantumEntanglement: boolean;
  enableLoveEconomy: boolean;
  enableMeshNetwork: boolean;
}

export class SynergyEngine {
  private config: SynergyConfig;
  private systems: Map<string, SynergySystem> = new Map();
  private rootSystem: SynergySystem | null = null;
  private updateInterval: number | null = null;
  private isRunning: boolean = false;

  // Integration points
  private gameEngine: any = null;
  private vibeCoding: any = null;
  private networkManager: any = null;
  private walletManager: any = null;
  private quantumEngine: any = null;

  constructor(config?: Partial<SynergyConfig>) {
    this.config = {
      enableInfiniteRecursion: config?.enableInfiniteRecursion ?? true,
      maxRecursionDepth: config?.maxRecursionDepth ?? Infinity,
      synergyThreshold: config?.synergyThreshold ?? 0.7,
      energyDecayRate: config?.energyDecayRate ?? 0.001,
      coherencePersistence: config?.coherencePersistence ?? 100000, // 100 seconds
      connectionDecayRate: config?.connectionDecayRate ?? 0.0001,
      enableQuantumEntanglement: config?.enableQuantumEntanglement ?? true,
      enableLoveEconomy: config?.enableLoveEconomy ?? true,
      enableMeshNetwork: config?.enableMeshNetwork ?? true
    };
  }

  /**
   * Initialize Synergy Engine
   */
  public async init(): Promise<void> {
    // Create root system (Tetrahedron K_4)
    this.rootSystem = this.createTetrahedronSystem('root', 'Root Synergy System');
    this.systems.set(this.rootSystem.id, this.rootSystem);

    // Start infinite synergy loop
    this.startSynergyLoop();

    console.log('🔺 Synergy Engine initialized - Infinite synergy activated');
    console.log('💜 With love and light. As above, so below. 💜');
  }

  /**
   * Create base tetrahedron system (K_4)
   * Four vertices, six edges - minimum stable system
   */
  private createTetrahedronSystem(id: string, name: string): SynergySystem {
    const nodes = new Map<string, SynergyNode>();
    const connections = new Map<string, SynergyConnection>();

    // Four vertices
    const vertices = [
      { id: `${id}_v0`, pos: new THREE.Vector3(0, 1, 0), name: 'VERTEX_A' },
      { id: `${id}_v1`, pos: new THREE.Vector3(-0.866, -0.5, 0), name: 'VERTEX_B' },
      { id: `${id}_v2`, pos: new THREE.Vector3(0.866, -0.5, 0), name: 'VERTEX_C' },
      { id: `${id}_v3`, pos: new THREE.Vector3(0, 0, 1.414), name: 'VERTEX_D' }
    ];

    vertices.forEach((v, i) => {
      nodes.set(v.id, {
        id: v.id,
        type: 'vertex',
        position: v.pos,
        connections: [],
        energy: 1.0,
        coherence: 0.95,
        metadata: {
          name: v.name,
          vertexIndex: i,
          isRoot: true
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    });

    // Six edges (all connections between vertices)
    const edges = [
      [0, 1], [0, 2], [0, 3], // From vertex 0
      [1, 2], [1, 3], // From vertex 1
      [2, 3] // From vertex 2
    ];

    edges.forEach(([fromIdx, toIdx], i) => {
      const fromId = vertices[fromIdx].id;
      const toId = vertices[toIdx].id;
      const connId = `${id}_e${i}`;

      const connection: SynergyConnection = {
        id: connId,
        from: fromId,
        to: toId,
        strength: 1.0,
        type: 'structural',
        bidirectional: true,
        metadata: {
          edgeIndex: i,
          isStructural: true
        },
        createdAt: Date.now()
      };

      connections.set(connId, connection);

      // Update node connections
      nodes.get(fromId)!.connections.push(connId);
      nodes.get(toId)!.connections.push(connId);
    });

    // Calculate initial synergy
    const synergy = this.calculateSynergy(nodes, connections);

    return {
      id,
      name,
      nodes,
      connections,
      level: 0,
      childSystems: [],
      synergy,
      energy: this.calculateEnergy(nodes),
      coherence: this.calculateCoherence(nodes),
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  /**
   * Start infinite synergy loop
   */
  private startSynergyLoop(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    const update = () => {
      if (!this.isRunning) return;

      this.updateAllSystems();
      this.propagateSynergy();
      this.recursiveSynergy();
      this.entangleSystems();

      // Schedule next update (infinite loop)
      this.updateInterval = setTimeout(update, 100) as any;
    };

    update();
  }

  /**
   * Update all systems
   */
  private updateAllSystems(): void {
    for (const system of this.systems.values()) {
      this.updateSystem(system);
    }
  }

  /**
   * Update single system
   */
  private updateSystem(system: SynergySystem): void {
    // Update nodes
    for (const node of system.nodes.values()) {
      // Energy decay
      node.energy = Math.max(0, node.energy - this.config.energyDecayRate);
      
      // Coherence persistence (Grandfather Clock)
      if (node.coherence > 0.9) {
        node.coherence = Math.max(0.9, node.coherence - 0.0001);
      }

      node.updatedAt = Date.now();
    }

    // Update connections
    for (const conn of system.connections.values()) {
      // Connection strength decay
      conn.strength = Math.max(0.1, conn.strength - this.config.connectionDecayRate);
    }

    // Recalculate system metrics
    system.synergy = this.calculateSynergy(system.nodes, system.connections);
    system.energy = this.calculateEnergy(system.nodes);
    system.coherence = this.calculateCoherence(system.nodes);
    system.updatedAt = Date.now();
  }

  /**
   * Propagate synergy between systems
   */
  private propagateSynergy(): void {
    for (const system of this.systems.values()) {
      // Propagate to child systems
      for (const childId of system.childSystems) {
        const child = this.systems.get(childId);
        if (child) {
          // Synergy flows from parent to child
          this.transferSynergy(system, child, 0.1);
        }
      }

      // Propagate to parent system
      if (system.parentSystem) {
        const parent = this.systems.get(system.parentSystem);
        if (parent) {
          // Synergy flows from child to parent
          this.transferSynergy(system, parent, 0.05);
        }
      }
    }
  }

  /**
   * Transfer synergy between systems
   */
  private transferSynergy(from: SynergySystem, to: SynergySystem, amount: number): void {
    // Transfer energy
    const energyTransfer = Math.min(amount, from.energy);
    from.energy -= energyTransfer;
    to.energy += energyTransfer;

    // Transfer coherence
    const coherenceTransfer = Math.min(amount * 0.1, from.coherence);
    from.coherence -= coherenceTransfer * 0.1;
    to.coherence = Math.min(1.0, to.coherence + coherenceTransfer);

    // Update synergy scores
    from.synergy = this.calculateSynergy(from.nodes, from.connections);
    to.synergy = this.calculateSynergy(to.nodes, to.connections);
  }

  /**
   * Recursive synergy - create nested systems infinitely
   */
  private recursiveSynergy(): void {
    if (!this.config.enableInfiniteRecursion) return;

    for (const system of this.systems.values()) {
      // If system synergy is high enough, create child system
      if (system.synergy >= this.config.synergyThreshold && 
          system.level < this.config.maxRecursionDepth &&
          system.childSystems.length < 4) { // Max 4 children (tetrahedron)
        
        const childId = `${system.id}_child_${system.childSystems.length}`;
        const child = this.createTetrahedronSystem(childId, `Child of ${system.name}`);
        child.level = system.level + 1;
        child.parentSystem = system.id;

        this.systems.set(childId, child);
        system.childSystems.push(childId);

        // Connect child to parent
        this.connectSystems(system, child);
      }
    }
  }

  /**
   * Connect two systems
   */
  private connectSystems(parent: SynergySystem, child: SynergySystem): void {
    // Find closest nodes between systems
    let minDist = Infinity;
    let parentNode: SynergyNode | null = null;
    let childNode: SynergyNode | null = null;

    for (const pNode of parent.nodes.values()) {
      for (const cNode of child.nodes.values()) {
        const dist = pNode.position.distanceTo(cNode.position);
        if (dist < minDist) {
          minDist = dist;
          parentNode = pNode;
          childNode = cNode;
        }
      }
    }

    if (parentNode && childNode) {
      // Create inter-system connection
      const connId = `inter_${parent.id}_${child.id}`;
      const connection: SynergyConnection = {
        id: connId,
        from: parentNode.id,
        to: childNode.id,
        strength: 0.8,
        type: 'structural',
        bidirectional: true,
        metadata: {
          interSystem: true,
          parentSystem: parent.id,
          childSystem: child.id
        },
        createdAt: Date.now()
      };

      parent.connections.set(connId, connection);
      parentNode.connections.push(connId);
      childNode.connections.push(connId);
    }
  }

  /**
   * Entangle systems (quantum entanglement)
   */
  private entangleSystems(): void {
    if (!this.config.enableQuantumEntanglement) return;

    for (const system1 of this.systems.values()) {
      for (const system2 of this.systems.values()) {
        if (system1.id === system2.id) continue;

        // If both systems have high coherence, entangle them
        if (system1.coherence > 0.9 && system2.coherence > 0.9) {
          this.createEntanglement(system1, system2);
        }
      }
    }
  }

  /**
   * Create quantum entanglement between systems
   */
  private createEntanglement(system1: SynergySystem, system2: SynergySystem): void {
    // Find nodes with highest coherence
    let node1: SynergyNode | null = null;
    let node2: SynergyNode | null = null;
    let maxCoherence1 = 0;
    let maxCoherence2 = 0;

    for (const node of system1.nodes.values()) {
      if (node.coherence > maxCoherence1) {
        maxCoherence1 = node.coherence;
        node1 = node;
      }
    }

    for (const node of system2.nodes.values()) {
      if (node.coherence > maxCoherence2) {
        maxCoherence2 = node.coherence;
        node2 = node;
      }
    }

    if (node1 && node2) {
      // Create quantum connection
      const connId = `quantum_${system1.id}_${system2.id}`;
      
      if (!system1.connections.has(connId)) {
        const connection: SynergyConnection = {
          id: connId,
          from: node1.id,
          to: node2.id,
          strength: 0.95,
          type: 'quantum',
          bidirectional: true,
          metadata: {
            quantum: true,
            entanglement: true,
            system1: system1.id,
            system2: system2.id
          },
          createdAt: Date.now()
        };

        system1.connections.set(connId, connection);
        node1.connections.push(connId);
        node2.connections.push(connId);

        // Entangle coherence
        const avgCoherence = (node1.coherence + node2.coherence) / 2;
        node1.coherence = avgCoherence;
        node2.coherence = avgCoherence;
      }
    }
  }

  /**
   * Calculate synergy score (0-1)
   * Synergy = (connections * strength) / (nodes * max_connections)
   */
  private calculateSynergy(nodes: Map<string, SynergyNode>, connections: Map<string, SynergyConnection>): number {
    if (nodes.size === 0) return 0;

    let totalStrength = 0;
    for (const conn of connections.values()) {
      totalStrength += conn.strength;
    }

    const maxConnections = nodes.size * (nodes.size - 1) / 2; // Complete graph
    const actualConnections = connections.size;
    const connectionRatio = actualConnections / maxConnections;
    const strengthRatio = totalStrength / connections.size;

    return Math.min(1.0, connectionRatio * strengthRatio);
  }

  /**
   * Calculate total system energy
   */
  private calculateEnergy(nodes: Map<string, SynergyNode>): number {
    let totalEnergy = 0;
    for (const node of nodes.values()) {
      totalEnergy += node.energy;
    }
    return totalEnergy;
  }

  /**
   * Calculate system coherence
   */
  private calculateCoherence(nodes: Map<string, SynergyNode>): number {
    if (nodes.size === 0) return 0;

    let totalCoherence = 0;
    for (const node of nodes.values()) {
      totalCoherence += node.coherence;
    }

    return totalCoherence / nodes.size;
  }

  /**
   * Integrate with game engine
   */
  public integrateGameEngine(gameEngine: any): void {
    this.gameEngine = gameEngine;
    console.log('🔺 Synergy Engine integrated with Game Engine');
  }

  /**
   * Integrate with vibe coding
   */
  public integrateVibeCoding(vibeCoding: any): void {
    this.vibeCoding = vibeCoding;
    console.log('🔺 Synergy Engine integrated with Vibe Coding');
  }

  /**
   * Integrate with network manager
   */
  public integrateNetworkManager(networkManager: any): void {
    this.networkManager = networkManager;
    console.log('🔺 Synergy Engine integrated with Network Manager');
  }

  /**
   * Integrate with wallet manager
   */
  public integrateWalletManager(walletManager: any): void {
    this.walletManager = walletManager;
    console.log('🔺 Synergy Engine integrated with Wallet Manager');
  }

  /**
   * Get all systems
   */
  public getSystems(): SynergySystem[] {
    return Array.from(this.systems.values());
  }

  /**
   * Get root system
   */
  public getRootSystem(): SynergySystem | null {
    return this.rootSystem;
  }

  /**
   * Get system by ID
   */
  public getSystem(id: string): SynergySystem | null {
    return this.systems.get(id) || null;
  }

  /**
   * Get total synergy (all systems)
   */
  public getTotalSynergy(): number {
    let total = 0;
    let count = 0;

    for (const system of this.systems.values()) {
      total += system.synergy;
      count++;
    }

    return count > 0 ? total / count : 0;
  }

  /**
   * Get total energy (all systems)
   */
  public getTotalEnergy(): number {
    let total = 0;
    for (const system of this.systems.values()) {
      total += system.energy;
    }
    return total;
  }

  /**
   * Get total coherence (all systems)
   */
  public getTotalCoherence(): number {
    let total = 0;
    let count = 0;

    for (const system of this.systems.values()) {
      total += system.coherence;
      count++;
    }

    return count > 0 ? total / count : 0;
  }

  /**
   * Stop synergy loop
   */
  public stop(): void {
    this.isRunning = false;
    if (this.updateInterval) {
      clearTimeout(this.updateInterval);
      this.updateInterval = null;
    }
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.stop();
    this.systems.clear();
    this.rootSystem = null;
  }
}
