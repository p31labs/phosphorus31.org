/**
 * Advanced Physics Validation
 * Real-world structural engineering validation for family structures
 * 
 * "Maxwell's Rule. Rigidity. Stability. Real physics."
 */

export interface StructureAnalysis {
  vertices: number;
  edges: number;
  faces: number;
  maxwellValid: boolean;
  maxwellScore: number;              // 0-100, how well it meets Maxwell's Rule
  stability: number;                 // 0-100, overall stability
  loadCapacity: number;               // Maximum load (kg)
  stressPoints: StressPoint[];
  weakPoints: WeakPoint[];
  recommendations: string[];
}

export interface StressPoint {
  pieceId: string;
  position: [number, number, number];
  stressLevel: number;                // 0-100
  direction: [number, number, number];
  color: string;                      // Visual indicator color
}

export interface WeakPoint {
  pieceId: string;
  position: [number, number, number];
  weaknessType: 'connection' | 'material' | 'geometry' | 'load';
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendation: string;
}

export interface MaterialProperties {
  name: string;
  density: number;                    // kg/m³
  strength: number;                   // MPa
  elasticity: number;                 // GPa
  friction: number;                   // Coefficient
  color: string;
}

export class AdvancedPhysicsValidation {
  private materials: Map<string, MaterialProperties> = new Map();

  constructor() {
    this.loadMaterialProperties();
  }

  /**
   * Load material properties
   */
  private loadMaterialProperties(): void {
    this.materials.set('wood', {
      name: 'Wood',
      density: 500,
      strength: 50,
      elasticity: 10,
      friction: 0.6,
      color: '#8B4513',
    });

    this.materials.set('metal', {
      name: 'Metal',
      density: 7800,
      strength: 200,
      elasticity: 200,
      friction: 0.4,
      color: '#C0C0C0',
    });

    this.materials.set('crystal', {
      name: 'Crystal',
      density: 2650,
      strength: 100,
      elasticity: 70,
      friction: 0.3,
      color: '#00FFFF',
    });

    this.materials.set('quantum', {
      name: 'Quantum',
      density: 1000,
      strength: 150,
      elasticity: 150,
      friction: 0.1,
      color: '#FF00FF',
    });
  }

  /**
   * Analyze structure with advanced physics
   */
  analyzeStructure(structure: any): StructureAnalysis {
    const vertices = structure.pieces.length;
    const edges = structure.connections.length;
    const faces = this.calculateFaces(structure);

    // Maxwell's Rule: E ≥ 3V - 6 for rigidity
    const minEdges = 3 * vertices - 6;
    const maxwellValid = edges >= minEdges;
    const maxwellScore = Math.min(100, (edges / minEdges) * 100);

    // Calculate stability
    const stability = this.calculateStability(structure, vertices, edges);

    // Calculate load capacity
    const loadCapacity = this.calculateLoadCapacity(structure);

    // Find stress points
    const stressPoints = this.findStressPoints(structure);

    // Find weak points
    const weakPoints = this.findWeakPoints(structure, stressPoints);

    // Generate recommendations
    const recommendations = this.generateRecommendations(
      structure,
      maxwellValid,
      stability,
      weakPoints
    );

    return {
      vertices,
      edges,
      faces,
      maxwellValid,
      maxwellScore,
      stability,
      loadCapacity,
      stressPoints,
      weakPoints,
      recommendations,
    };
  }

  /**
   * Calculate number of faces (simplified)
   */
  private calculateFaces(structure: any): number {
    // For a tetrahedron: 4 faces
    // For more complex structures, use Euler's formula: F = E - V + 2
    // Simplified: assume tetrahedron-based structures
    if (structure.pieces.length === 4) {
      return 4; // Tetrahedron
    }
    
    // Use Euler's formula for polyhedra
    const V = structure.pieces.length;
    const E = structure.connections.length;
    return Math.max(4, E - V + 2);
  }

  /**
   * Calculate stability score (0-100)
   */
  private calculateStability(structure: any, vertices: number, edges: number): number {
    let stability = 0;

    // Base stability from Maxwell's Rule compliance
    const minEdges = 3 * vertices - 6;
    if (edges >= minEdges) {
      stability += 40; // Base stability if Maxwell's Rule met
    } else {
      stability += (edges / minEdges) * 40; // Partial credit
    }

    // Stability from material strength
    const avgStrength = this.calculateAverageStrength(structure);
    stability += (avgStrength / 200) * 30; // Up to 30 points from materials

    // Stability from connection quality
    const connectionQuality = this.calculateConnectionQuality(structure);
    stability += connectionQuality * 20; // Up to 20 points from connections

    // Stability from geometry (base area, height, etc.)
    const geometryStability = this.calculateGeometryStability(structure);
    stability += geometryStability * 10; // Up to 10 points from geometry

    return Math.min(100, Math.max(0, stability));
  }

  /**
   * Calculate average material strength
   */
  private calculateAverageStrength(structure: any): number {
    if (structure.pieces.length === 0) return 0;

    let totalStrength = 0;
    structure.pieces.forEach((piece: any) => {
      const material = this.materials.get(piece.material);
      if (material) {
        totalStrength += material.strength;
      }
    });

    return totalStrength / structure.pieces.length;
  }

  /**
   * Calculate connection quality (0-1)
   */
  private calculateConnectionQuality(structure: any): number {
    if (structure.connections.length === 0) return 0;

    // Check if all pieces are connected
    const connectedPieces = new Set<string>();
    structure.connections.forEach((conn: any) => {
      connectedPieces.add(conn.piece1Id);
      connectedPieces.add(conn.piece2Id);
    });

    const connectionRatio = connectedPieces.size / structure.pieces.length;
    
    // Check for redundant connections (good for stability)
    const minConnections = structure.pieces.length - 1; // Minimum for connectivity
    const redundancy = Math.min(1, (structure.connections.length - minConnections) / minConnections);

    return (connectionRatio * 0.7) + (redundancy * 0.3);
  }

  /**
   * Calculate geometry stability (0-1)
   */
  private calculateGeometryStability(structure: any): number {
    if (structure.pieces.length === 0) return 0;

    // Calculate center of mass
    const centerOfMass = this.calculateCenterOfMass(structure);

    // Calculate base area (pieces near ground)
    const baseArea = this.calculateBaseArea(structure);

    // Calculate height
    const height = this.calculateHeight(structure);

    // Stability improves with:
    // - Lower center of mass
    // - Larger base area
    // - Lower height-to-base ratio

    const heightRatio = height > 0 ? baseArea / height : 0;
    const centerHeight = centerOfMass[1]; // Y coordinate

    // Normalize to 0-1
    const stability = Math.min(1, (heightRatio * 0.5) + ((1 - centerHeight / height) * 0.5));
    return stability;
  }

  /**
   * Calculate center of mass
   */
  private calculateCenterOfMass(structure: any): [number, number, number] {
    if (structure.pieces.length === 0) return [0, 0, 0];

    let totalX = 0, totalY = 0, totalZ = 0;
    let totalMass = 0;

    structure.pieces.forEach((piece: any) => {
      const material = this.materials.get(piece.material);
      const mass = material ? material.density * 0.001 : 1; // Simplified mass

      totalX += piece.position[0] * mass;
      totalY += piece.position[1] * mass;
      totalZ += piece.position[2] * mass;
      totalMass += mass;
    });

    return [
      totalX / totalMass,
      totalY / totalMass,
      totalZ / totalMass,
    ];
  }

  /**
   * Calculate base area (simplified)
   */
  private calculateBaseArea(structure: any): number {
    // Find pieces near ground (Y < threshold)
    const groundThreshold = 0.5;
    const groundPieces = structure.pieces.filter((p: any) => p.position[1] < groundThreshold);

    if (groundPieces.length === 0) return 0;

    // Calculate bounding box of ground pieces
    let minX = Infinity, maxX = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;

    groundPieces.forEach((piece: any) => {
      minX = Math.min(minX, piece.position[0]);
      maxX = Math.max(maxX, piece.position[0]);
      minZ = Math.min(minZ, piece.position[2]);
      maxZ = Math.max(maxZ, piece.position[2]);
    });

    return (maxX - minX) * (maxZ - minZ);
  }

  /**
   * Calculate height
   */
  private calculateHeight(structure: any): number {
    if (structure.pieces.length === 0) return 0;

    let minY = Infinity, maxY = -Infinity;
    structure.pieces.forEach((piece: any) => {
      minY = Math.min(minY, piece.position[1]);
      maxY = Math.max(maxY, piece.position[1]);
    });

    return maxY - minY;
  }

  /**
   * Calculate load capacity (kg)
   */
  private calculateLoadCapacity(structure: any): number {
    const analysis = this.analyzeStructure(structure);
    
    // Base capacity from material strength
    const avgStrength = this.calculateAverageStrength(structure);
    const baseCapacity = (avgStrength / 200) * 100; // Up to 100kg for max strength

    // Reduce capacity based on weak points
    const weakPointPenalty = analysis.weakPoints.length * 5;
    
    // Increase capacity based on stability
    const stabilityBonus = (analysis.stability / 100) * 50;

    return Math.max(0, baseCapacity - weakPointPenalty + stabilityBonus);
  }

  /**
   * Find stress points in structure
   */
  private findStressPoints(structure: any): StressPoint[] {
    const stressPoints: StressPoint[] = [];

    // Analyze each piece
    structure.pieces.forEach((piece: any) => {
      // Count connections to this piece
      const connections = structure.connections.filter((c: any) =>
        c.piece1Id === piece.id || c.piece2Id === piece.id
      ).length;

      // More connections = more stress
      const stressLevel = Math.min(100, connections * 20);

      if (stressLevel > 30) {
        stressPoints.push({
          pieceId: piece.id,
          position: piece.position,
          stressLevel,
          direction: [0, -1, 0], // Downward (gravity)
          color: this.getStressColor(stressLevel),
        });
      }
    });

    return stressPoints;
  }

  /**
   * Find weak points in structure
   */
  private findWeakPoints(structure: any, stressPoints: StressPoint[]): WeakPoint[] {
    const weakPoints: WeakPoint[] = [];

    // Find pieces with high stress but low material strength
    stressPoints.forEach(stress => {
      const piece = structure.pieces.find((p: any) => p.id === stress.pieceId);
      if (!piece) return;

      const material = this.materials.get(piece.material);
      if (!material) return;

      // If stress exceeds material strength threshold
      if (stress.stressLevel > (material.strength / 2)) {
        weakPoints.push({
          pieceId: piece.id,
          position: piece.position,
          weaknessType: 'material',
          severity: stress.stressLevel > 80 ? 'critical' : stress.stressLevel > 60 ? 'high' : 'medium',
          recommendation: `Consider using stronger material (${material.name} may be too weak)`,
        });
      }
    });

    // Find pieces with few connections
    structure.pieces.forEach((piece: any) => {
      const connections = structure.connections.filter((c: any) =>
        c.piece1Id === piece.id || c.piece2Id === piece.id
      ).length;

      if (connections < 2) {
        weakPoints.push({
          pieceId: piece.id,
          position: piece.position,
          weaknessType: 'connection',
          severity: connections === 0 ? 'critical' : 'high',
          recommendation: `Add more connections to this piece (currently ${connections})`,
        });
      }
    });

    return weakPoints;
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(
    structure: any,
    maxwellValid: boolean,
    stability: number,
    weakPoints: WeakPoint[]
  ): string[] {
    const recommendations: string[] = [];

    if (!maxwellValid) {
      recommendations.push('Add more connections to meet Maxwell\'s Rule (E ≥ 3V - 6)');
    }

    if (stability < 50) {
      recommendations.push('Structure is unstable. Add more connections or strengthen the base.');
    }

    if (stability < 70) {
      recommendations.push('Structure could be more stable. Consider adding diagonal supports.');
    }

    weakPoints.forEach(weak => {
      if (weak.severity === 'critical') {
        recommendations.push(`⚠️ CRITICAL: ${weak.recommendation}`);
      } else if (weak.severity === 'high') {
        recommendations.push(`🔴 HIGH: ${weak.recommendation}`);
      }
    });

    if (recommendations.length === 0) {
      recommendations.push('✅ Structure looks good! All requirements met.');
    }

    return recommendations;
  }

  /**
   * Get stress color for visualization
   */
  private getStressColor(stressLevel: number): string {
    if (stressLevel < 50) return '#00FF00'; // Green
    if (stressLevel < 70) return '#FFFF00'; // Yellow
    if (stressLevel < 90) return '#FF7F00'; // Orange
    return '#FF0000'; // Red
  }

  /**
   * Test structure with physics simulation
   */
  async testStructure(structure: any, load: number = 0): Promise<{
    passed: boolean;
    analysis: StructureAnalysis;
    failurePoint?: WeakPoint;
  }> {
    const analysis = this.analyzeStructure(structure);

    // Check if structure can handle the load
    const canHandleLoad = load <= analysis.loadCapacity;

    // Check for critical weak points
    const criticalWeakPoints = analysis.weakPoints.filter(w => w.severity === 'critical');

    const passed = canHandleLoad && criticalWeakPoints.length === 0 && analysis.stability >= 50;

    return {
      passed,
      analysis,
      failurePoint: criticalWeakPoints.length > 0 ? criticalWeakPoints[0] : undefined,
    };
  }
}
