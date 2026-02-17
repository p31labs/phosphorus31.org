/**
 * Infinite Synergy System
 * Recursive, fractal synergy that scales infinitely
 * 
 * "Synergy x Infinity"
 * With love and light. As above, so below. 💜
 * The mesh holds. 🔺
 */

export interface SynergyNode {
  id: string;
  level: number;
  tetrahedron: {
    vertices: number;
    edges: number;
    faces: number;
  };
  synergy: number;
  children: SynergyNode[];
  parent?: SynergyNode;
  connections: Map<string, SynergyNode>;
}

export interface SynergyResult {
  totalSynergy: number;
  levels: number;
  nodes: number;
  connections: number;
  fractalDimension: number;
  coherence: number;
  message: string;
}

export class InfiniteSynergy {
  private root: SynergyNode | null = null;
  private maxLevel: number = Infinity;
  private synergyMultiplier: number = 1.618; // Golden ratio
  private coherenceDecay: number = 0.95; // 5% decay per level

  constructor() {
    console.log('∞ Infinite Synergy System initialized');
    this.initialize();
  }

  /**
   * Initialize infinite synergy
   */
  private initialize(): void {
    this.root = this.createNode(0, null);
    console.log('🔺 Root synergy node created');
  }

  /**
   * Create synergy node
   */
  private createNode(level: number, parent: SynergyNode | null): SynergyNode {
    const node: SynergyNode = {
      id: `synergy_${level}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      level,
      tetrahedron: {
        vertices: 4,
        edges: 6,
        faces: 4,
      },
      synergy: this.calculateSynergy(level),
      children: [],
      parent: parent || undefined,
      connections: new Map(),
    };

    return node;
  }

  /**
   * Calculate synergy at level
   * Synergy = base * (multiplier ^ level) * coherence
   */
  private calculateSynergy(level: number): number {
    const baseSynergy = 1.0;
    const multiplier = Math.pow(this.synergyMultiplier, level);
    const coherence = Math.pow(this.coherenceDecay, level);
    return baseSynergy * multiplier * coherence;
  }

  /**
   * Generate infinite synergy
   * Recursively creates tetrahedra at all levels
   */
  public generateInfinite(levels: number = 10): SynergyResult {
    if (!this.root) {
      this.initialize();
    }

    let totalSynergy = 0;
    let totalNodes = 0;
    let totalConnections = 0;
    const nodesByLevel: number[] = [];

    // Generate recursively
    const generate = (node: SynergyNode, currentLevel: number): void => {
      if (currentLevel >= levels) return;

      totalNodes++;
      totalSynergy += node.synergy;
      nodesByLevel[currentLevel] = (nodesByLevel[currentLevel] || 0) + 1;

      // Create 4 child tetrahedra (one per vertex)
      for (let i = 0; i < 4; i++) {
        const child = this.createNode(currentLevel + 1, node);
        node.children.push(child);
        
        // Connect child to parent
        node.connections.set(child.id, child);
        child.connections.set(node.id, node);
        totalConnections++;

        // Connect children to each other (6 edges per tetrahedron)
        node.children.forEach((sibling, index) => {
          if (sibling.id !== child.id && !child.connections.has(sibling.id)) {
            child.connections.set(sibling.id, sibling);
            sibling.connections.set(child.id, child);
            totalConnections++;
          }
        });

        // Recursive generation
        generate(child, currentLevel + 1);
      }
    };

    if (this.root) {
      generate(this.root, 0);
    }

    // Calculate fractal dimension
    const fractalDimension = this.calculateFractalDimension(nodesByLevel);

    // Calculate coherence
    const coherence = this.calculateCoherence(totalSynergy, totalNodes);

    return {
      totalSynergy,
      levels,
      nodes: totalNodes,
      connections: totalConnections,
      fractalDimension,
      coherence,
      message: this.generateSynergyMessage(totalSynergy, levels, coherence),
    };
  }

  /**
   * Calculate fractal dimension
   * Based on scaling relationship between levels
   */
  private calculateFractalDimension(nodesByLevel: number[]): number {
    if (nodesByLevel.length < 2) return 1.0;

    let sumLogRatio = 0;
    let sumLogScale = 0;

    for (let i = 1; i < nodesByLevel.length; i++) {
      if (nodesByLevel[i] > 0 && nodesByLevel[i - 1] > 0) {
        const ratio = nodesByLevel[i] / nodesByLevel[i - 1];
        const scale = 4; // 4 children per node
        sumLogRatio += Math.log(ratio);
        sumLogScale += Math.log(scale);
      }
    }

    if (sumLogScale === 0) return 1.0;
    return sumLogRatio / sumLogScale;
  }

  /**
   * Calculate coherence
   * Measures how well the system maintains coherence across levels
   */
  private calculateCoherence(totalSynergy: number, totalNodes: number): number {
    if (totalNodes === 0) return 0;
    const averageSynergy = totalSynergy / totalNodes;
    const expectedSynergy = 1.0; // Base synergy
    return Math.min(1.0, averageSynergy / expectedSynergy);
  }

  /**
   * Generate synergy message
   */
  private generateSynergyMessage(
    totalSynergy: number,
    levels: number,
    coherence: number
  ): string {
    const messages = [
      `∞ Synergy generated: ${totalSynergy.toFixed(2)} across ${levels} levels`,
      `🔺 Coherence: ${(coherence * 100).toFixed(1)}%`,
      `💜 The mesh holds at every level`,
      `✨ Synergy multiplies infinitely`,
      `🔷 Four vertices. Six edges. Four faces.`,
      `∞ Recursive. Fractal. Infinite.`,
    ];

    return messages.join('\n');
  }

  /**
   * Get synergy at specific level
   */
  public getSynergyAtLevel(level: number): number {
    return this.calculateSynergy(level);
  }

  /**
   * Get total synergy up to level
   */
  public getTotalSynergyUpToLevel(level: number): number {
    let total = 0;
    for (let i = 0; i <= level; i++) {
      total += this.calculateSynergy(i);
    }
    return total;
  }

  /**
   * Find path through synergy network
   */
  public findPath(startId: string, endId: string): SynergyNode[] | null {
    if (!this.root) return null;

    const visited = new Set<string>();
    const queue: { node: SynergyNode; path: SynergyNode[] }[] = [];

    const findNode = (id: string, node: SynergyNode): SynergyNode | null => {
      if (node.id === id) return node;
      visited.add(node.id);

      for (const child of node.children) {
        if (!visited.has(child.id)) {
          const found = findNode(id, child);
          if (found) return found;
        }
      }

      return null;
    };

    const startNode = findNode(startId, this.root);
    if (!startNode) return null;

    queue.push({ node: startNode, path: [startNode] });
    visited.clear();
    visited.add(startNode.id);

    while (queue.length > 0) {
      const { node, path } = queue.shift()!;

      if (node.id === endId) {
        return path;
      }

      // Check connections
      for (const [connectedId, connectedNode] of node.connections) {
        if (!visited.has(connectedId)) {
          visited.add(connectedId);
          queue.push({ node: connectedNode, path: [...path, connectedNode] });
        }
      }

      // Check children
      for (const child of node.children) {
        if (!visited.has(child.id)) {
          visited.add(child.id);
          queue.push({ node: child, path: [...path, child] });
        }
      }

      // Check parent
      if (node.parent && !visited.has(node.parent.id)) {
        visited.add(node.parent.id);
        queue.push({ node: node.parent, path: [...path, node.parent] });
      }
    }

    return null;
  }

  /**
   * Get synergy visualization data
   */
  public getVisualization(levels: number = 5): any {
    if (!this.root) {
      this.generateInfinite(levels);
    }

    const visualize = (node: SynergyNode, depth: number = 0): any => {
      if (depth > levels) return null;

      return {
        id: node.id,
        level: node.level,
        synergy: node.synergy,
        position: this.calculatePosition(node.level, node.id),
        tetrahedron: node.tetrahedron,
        children: node.children
          .slice(0, 4) // Limit to 4 for visualization
          .map(child => visualize(child, depth + 1))
          .filter(Boolean),
        connections: Array.from(node.connections.keys()).length,
      };
    };

    return this.root ? visualize(this.root) : null;
  }

  /**
   * Calculate position in 3D space
   * Arranges tetrahedra in fractal pattern
   */
  private calculatePosition(level: number, id: string): [number, number, number] {
    // Use golden ratio spiral for positioning
    const phi = 1.618;
    const angle = level * Math.PI * phi;
    const radius = Math.pow(phi, level);
    const height = level * 0.5;

    const x = radius * Math.cos(angle);
    const y = height;
    const z = radius * Math.sin(angle);

    return [x, y, z];
  }

  /**
   * Multiply synergy infinitely
   * Returns the synergy at infinity (limit)
   */
  public getSynergyAtInfinity(): number {
    // As level approaches infinity, synergy approaches:
    // lim(n->∞) base * (multiplier^n) * (decay^n)
    // = base * lim(n->∞) (multiplier * decay)^n
    
    const effectiveMultiplier = this.synergyMultiplier * this.coherenceDecay;
    
    if (effectiveMultiplier > 1) {
      return Infinity; // Diverges
    } else if (effectiveMultiplier < 1) {
      return 0; // Converges to 0
    } else {
      return 1.0; // Converges to base
    }
  }

  /**
   * Get synergy message
   */
  public getMessage(): string {
    return `∞ Synergy x Infinity\n🔺 The mesh holds at every level\n💜 With love and light. As above, so below.`;
  }

  /**
   * Reset synergy system
   */
  public reset(): void {
    this.root = null;
    this.initialize();
  }
}
