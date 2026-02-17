/**
 * Enhanced Physics World
 * Upgraded physics system with quantum effects and better stability calculations
 */

import * as THREE from 'three';
import { GeometricPrimitive, Structure, PhysicsResult } from '../types/game';

export class EnhancedPhysicsWorld {
  private gravity: THREE.Vector3;
  private timeStep: number;
  private velocityIterations: number;
  private positionIterations: number;
  
  // Quantum coherence tracking
  private quantumCoherence: Map<string, number> = new Map();
  private entanglementMap: Map<string, string[]> = new Map();
  
  // Stability calculation cache
  private stabilityCache: Map<string, number> = new Map();
  private lastStabilityUpdate: number = 0;
  private stabilityUpdateInterval: number = 100; // Update every 100ms

  constructor(config?: {
    gravity?: THREE.Vector3;
    timeStep?: number;
    velocityIterations?: number;
    positionIterations?: number;
  }) {
    this.gravity = config?.gravity || new THREE.Vector3(0, -9.81, 0);
    this.timeStep = config?.timeStep || 1/60;
    this.velocityIterations = config?.velocityIterations || 10;
    this.positionIterations = config?.positionIterations || 10;
  }

  /**
   * Initialize physics world
   */
  public async init(): Promise<void> {
    console.log('🔬 Enhanced Physics World initialized');
  }

  /**
   * Update physics simulation with quantum effects
   */
  public update(deltaTime: number, structure: Structure | null): void {
    if (!structure) return;

    // Update quantum coherence for quantum materials
    this.updateQuantumCoherence(structure);

    // Update stability cache periodically
    const now = performance.now();
    if (now - this.lastStabilityUpdate >= this.stabilityUpdateInterval) {
      this.calculateStability(structure);
      this.lastStabilityUpdate = now;
    }
  }

  /**
   * Update quantum coherence for quantum materials
   */
  private updateQuantumCoherence(structure: Structure): void {
    structure.primitives.forEach((primitive) => {
      if (primitive.material === 'quantum' && primitive.quantumState) {
        const currentCoherence = primitive.quantumState.coherence;
        
        // Quantum coherence decay (exponential)
        const decayRate = 0.001; // Adjust for desired decay rate
        const newCoherence = currentCoherence * (1 - decayRate);
        
        primitive.quantumState.coherence = Math.max(0, newCoherence);
        this.quantumCoherence.set(primitive.id, primitive.quantumState.coherence);

        // Update entanglement effects
        if (primitive.quantumState.entanglement.length > 0) {
          this.updateEntanglement(primitive, structure);
        }
      }
    });
  }

  /**
   * Update entanglement between quantum pieces
   */
  private updateEntanglement(primitive: GeometricPrimitive, structure: Structure): void {
    if (!primitive.quantumState) return;

    const coherence = primitive.quantumState.coherence;
    
    // Entangled pieces share coherence
    primitive.quantumState.entanglement.forEach((entangledId) => {
      const entangled = structure.primitives.find(p => p.id === entangledId);
      if (entangled && entangled.quantumState) {
        // Average coherence between entangled pieces
        const avgCoherence = (coherence + entangled.quantumState.coherence) / 2;
        primitive.quantumState.coherence = avgCoherence;
        entangled.quantumState.coherence = avgCoherence;
      }
    });
  }

  /**
   * Calculate structure stability with enhanced algorithm
   */
  private calculateStability(structure: Structure): number {
    const cacheKey = this.getStructureHash(structure);
    
    // Check cache
    if (this.stabilityCache.has(cacheKey)) {
      return this.stabilityCache.get(cacheKey)!;
    }

    let stability = 0;

    // 1. Maxwell's Rule (E ≥ 3V - 6)
    const maxwellRatio = structure.edges / (3 * structure.vertices - 6);
    const maxwellScore = Math.min(1, maxwellRatio) * 30; // 30% weight

    // 2. Connection quality (how well pieces are connected)
    const connectionScore = this.calculateConnectionQuality(structure) * 25; // 25% weight

    // 3. Material strength distribution
    const materialScore = this.calculateMaterialStrength(structure) * 20; // 20% weight

    // 4. Center of mass position (lower is better)
    const comScore = this.calculateCenterOfMassScore(structure) * 15; // 15% weight

    // 5. Quantum coherence bonus (if quantum materials present)
    const quantumScore = this.calculateQuantumBonus(structure) * 10; // 10% weight

    stability = maxwellScore + connectionScore + materialScore + comScore + quantumScore;

    // Cache result
    this.stabilityCache.set(cacheKey, stability);

    return Math.min(100, Math.max(0, stability));
  }

  /**
   * Calculate connection quality
   */
  private calculateConnectionQuality(structure: Structure): number {
    if (structure.primitives.length === 0) return 0;

    let totalConnections = 0;
    let maxPossibleConnections = 0;

    structure.primitives.forEach((primitive) => {
      const connections = primitive.connectedTo.length;
      totalConnections += connections;
      
      // Max connections based on primitive type
      const maxConnections = this.getMaxConnections(primitive.type);
      maxPossibleConnections += maxConnections;
    });

    return maxPossibleConnections > 0 
      ? totalConnections / maxPossibleConnections 
      : 0;
  }

  /**
   * Get max connections for primitive type
   */
  private getMaxConnections(type: string): number {
    switch (type) {
      case 'tetrahedron': return 4;
      case 'octahedron': return 6;
      case 'icosahedron': return 12;
      case 'hub': return 8;
      case 'strut': return 2;
      default: return 4;
    }
  }

  /**
   * Calculate material strength distribution
   */
  private calculateMaterialStrength(structure: Structure): number {
    if (structure.primitives.length === 0) return 0;

    const materialStrengths: Record<string, number> = {
      wood: 50,
      metal: 200,
      crystal: 100,
      quantum: 150
    };

    let totalStrength = 0;
    structure.primitives.forEach((primitive) => {
      totalStrength += materialStrengths[primitive.material] || 50;
    });

    const avgStrength = totalStrength / structure.primitives.length;
    return Math.min(1, avgStrength / 200); // Normalize to 0-1
  }

  /**
   * Calculate center of mass score (lower center = better)
   */
  private calculateCenterOfMassScore(structure: Structure): number {
    if (structure.primitives.length === 0) return 0;

    let totalMass = 0;
    const centerOfMass = new THREE.Vector3(0, 0, 0);

    structure.primitives.forEach((primitive) => {
      const mass = this.getPrimitiveMass(primitive);
      centerOfMass.add(primitive.position.clone().multiplyScalar(mass));
      totalMass += mass;
    });

    if (totalMass === 0) return 0;

    centerOfMass.divideScalar(totalMass);

    // Lower center of mass = better stability
    // Score based on how low the center is (negative Y is down)
    const heightScore = Math.max(0, 1 + centerOfMass.y / 10); // Normalize
    return Math.min(1, heightScore);
  }

  /**
   * Calculate quantum coherence bonus
   */
  private calculateQuantumBonus(structure: Structure): number {
    const quantumPieces = structure.primitives.filter(
      p => p.material === 'quantum' && p.quantumState
    );

    if (quantumPieces.length === 0) return 0;

    let totalCoherence = 0;
    quantumPieces.forEach((piece) => {
      totalCoherence += piece.quantumState?.coherence || 0;
    });

    const avgCoherence = totalCoherence / quantumPieces.length;
    return avgCoherence;
  }

  /**
   * Get primitive mass based on material
   */
  private getPrimitiveMass(primitive: GeometricPrimitive): number {
    const densities: Record<string, number> = {
      wood: 500,
      metal: 7800,
      crystal: 2650,
      quantum: 1000
    };

    const density = densities[primitive.material] || 500;
    const volume = this.getPrimitiveVolume(primitive);
    return density * volume;
  }

  /**
   * Get primitive volume
   */
  private getPrimitiveVolume(primitive: GeometricPrimitive): number {
    // Simplified volume calculation
    const baseVolumes: Record<string, number> = {
      tetrahedron: Math.sqrt(2) / 12,
      octahedron: Math.sqrt(2) / 3,
      icosahedron: (5 * (3 + Math.sqrt(5))) / 12,
      hub: 0.1,
      strut: 0.05
    };

    const baseVolume = baseVolumes[primitive.type] || 0.1;
    return baseVolume * Math.pow(primitive.scale, 3);
  }

  /**
   * Get structure hash for caching
   */
  private getStructureHash(structure: Structure): string {
    return `${structure.id}_${structure.primitives.length}_${structure.edges}_${structure.vertices}`;
  }

  /**
   * Apply test forces to structure
   */
  public applyTestForces(structure: Structure): PhysicsResult {
    const stability = this.calculateStability(structure);
    const centerOfMass = this.calculateCenterOfMass(structure);
    
    // Simulate forces
    const deformation = stability < 50 ? 0.3 : stability < 70 ? 0.1 : 0.05;
    
    // Find weak points
    const failurePoints: string[] = [];
    structure.primitives.forEach((primitive) => {
      const pieceStability = this.calculatePieceStability(primitive, structure);
      if (pieceStability < 0.5) {
        failurePoints.push(primitive.id);
      }
    });

    return {
      isStable: stability >= 70,
      deformation,
      failurePoints,
      centerOfMass,
      stressDistribution: structure.primitives.map(p => 
        this.calculatePieceStability(p, structure)
      )
    };
  }

  /**
   * Calculate center of mass
   */
  private calculateCenterOfMass(structure: Structure): THREE.Vector3 {
    if (structure.primitives.length === 0) {
      return new THREE.Vector3(0, 0, 0);
    }

    let totalMass = 0;
    const centerOfMass = new THREE.Vector3(0, 0, 0);

    structure.primitives.forEach((primitive) => {
      const mass = this.getPrimitiveMass(primitive);
      centerOfMass.add(primitive.position.clone().multiplyScalar(mass));
      totalMass += mass;
    });

    return centerOfMass.divideScalar(totalMass);
  }

  /**
   * Calculate stability for individual piece
   */
  private calculatePieceStability(
    primitive: GeometricPrimitive,
    structure: Structure
  ): number {
    const connections = primitive.connectedTo.length;
    const maxConnections = this.getMaxConnections(primitive.type);
    const connectionRatio = connections / maxConnections;

    const materialStrengths: Record<string, number> = {
      wood: 0.5,
      metal: 1.0,
      crystal: 0.7,
      quantum: 0.8
    };

    const materialStrength = materialStrengths[primitive.material] || 0.5;

    // Quantum coherence bonus
    let quantumBonus = 0;
    if (primitive.material === 'quantum' && primitive.quantumState) {
      quantumBonus = primitive.quantumState.coherence * 0.2;
    }

    return Math.min(1, connectionRatio * materialStrength + quantumBonus);
  }

  /**
   * Get structure stability
   */
  public getStructureStability(structure: Structure): number {
    return this.calculateStability(structure);
  }

  /**
   * Reset quantum coherence
   */
  public resetQuantumCoherence(structure: Structure): void {
    structure.primitives.forEach((primitive) => {
      if (primitive.material === 'quantum' && primitive.quantumState) {
        primitive.quantumState.coherence = 1.0;
        this.quantumCoherence.set(primitive.id, 1.0);
      }
    });
  }

  /**
   * Get quantum coherence for piece
   */
  public getQuantumCoherence(pieceId: string): number {
    return this.quantumCoherence.get(pieceId) || 0;
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.quantumCoherence.clear();
    this.entanglementMap.clear();
    this.stabilityCache.clear();
  }
}
