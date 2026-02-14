/**
 * Connection Manager - Advanced Snap-to-Attach System
 * Implements Fuller's tensegrity principles with quantum-enhanced connection points
 */

import * as THREE from 'three';
import { GeometricPrimitive, ConnectionPoint, Vector3 } from '../types/game';
import { GEOMETRY_CONSTANTS, MATERIAL_PROPERTIES } from '../types/game';

// Extend Vector3 with distanceTo method for compatibility
interface ExtendedVector3 extends THREE.Vector3 {
  distanceTo: (v: THREE.Vector3) => number;
}

export class ConnectionManager {
  private connectionCache = new Map<string, ConnectionPoint[]>();
  private quantumEntanglement = new Map<string, string[]>();

  /**
   * Generate connection points for a primitive based on its type and scale
   */
  generateConnectionPoints(primitive: GeometricPrimitive): ConnectionPoint[] {
    const cacheKey = `${primitive.type}_${primitive.scale}`;
    
    if (this.connectionCache.has(cacheKey)) {
      return this.connectionCache.get(cacheKey)!;
    }

    const points: ConnectionPoint[] = [];
    const scale = primitive.scale;
    
    switch (primitive.type) {
      case 'tetrahedron':
        points.push(...this.generateTetrahedronPoints(scale, primitive.id));
        break;
      case 'octahedron':
        points.push(...this.generateOctahedronPoints(scale, primitive.id));
        break;
      case 'icosahedron':
        points.push(...this.generateIcosahedronPoints(scale, primitive.id));
        break;
      case 'strut':
        points.push(...this.generateStrutPoints(scale, primitive.id));
        break;
      case 'hub':
        points.push(...this.generateHubPoints(scale, primitive.id));
        break;
    }

    this.connectionCache.set(cacheKey, points);
    return points;
  }

  /**
   * Find the best connection target for a primitive
   */
  findConnectionTarget(
    source: GeometricPrimitive, 
    targets: GeometricPrimitive[], 
    maxDistance: number = 2.0
  ): { target: GeometricPrimitive; sourcePoint: ConnectionPoint; targetPoint: ConnectionPoint; distance: number } | null {
    
    let bestMatch: any = null;
    let minDistance = maxDistance;

    for (const target of targets) {
      if (target.id === source.id) continue;
      
      const sourcePoints = this.getTransformedConnectionPoints(source);
      const targetPoints = this.getTransformedConnectionPoints(target);

      for (const sourcePoint of sourcePoints) {
        if (sourcePoint.isOccupied) continue;

        for (const targetPoint of targetPoints) {
          if (targetPoint.isOccupied) continue;

          const distance = sourcePoint.position.distanceTo(targetPoint.position as THREE.Vector3);
          
          if (distance < minDistance) {
            minDistance = distance;
            bestMatch = {
              target,
              sourcePoint,
              targetPoint,
              distance
            };
          }
        }
      }
    }

    return bestMatch;
  }

  /**
   * Calculate the optimal snap position for a primitive
   */
  calculateSnapPosition(
    source: GeometricPrimitive,
    target: GeometricPrimitive,
    sourcePoint: ConnectionPoint,
    targetPoint: ConnectionPoint
  ): Vector3 | null {
    
    // Calculate the midpoint between connection points
    const midPoint = new THREE.Vector3().addVectors(
      sourcePoint.position,
      targetPoint.position
    ).multiplyScalar(0.5);

    // Calculate the offset from the source piece center to its connection point
    const sourceMatrix = this.getTransformationMatrix(source);
    const sourceLocalPoint = this.getLocalConnectionPoint(source, sourcePoint);
    const sourceOffset = new THREE.Vector3().copy(sourceLocalPoint).applyMatrix4(sourceMatrix);
    sourceOffset.sub(new THREE.Vector3(source.position.x, source.position.y, source.position.z));

    // Calculate final position
    const finalPosition = new THREE.Vector3().copy(midPoint).sub(sourceOffset);

    return {
      x: finalPosition.x,
      y: finalPosition.y,
      z: finalPosition.z
    };
  }

  /**
   * Create a connection between two primitives
   */
  createConnection(
    source: GeometricPrimitive,
    target: GeometricPrimitive,
    sourcePoint: ConnectionPoint,
    targetPoint: ConnectionPoint
  ): { source: GeometricPrimitive; target: GeometricPrimitive } {
    
    // Mark connection points as occupied
    sourcePoint.isOccupied = true;
    sourcePoint.connectedTo = target.id;
    
    targetPoint.isOccupied = true;
    targetPoint.connectedTo = source.id;

    // Add to connectedTo arrays
    if (!source.connectedTo.includes(target.id)) {
      source.connectedTo.push(target.id);
    }
    
    if (!target.connectedTo.includes(source.id)) {
      target.connectedTo.push(source.id);
    }

    // Apply quantum entanglement if both pieces support it
    if (source.material === 'quantum' || target.material === 'quantum') {
      this.entanglePrimitives(source.id, target.id);
    }

    return { source, target };
  }

  /**
   * Check if a connection is valid based on material compatibility
   */
  isValidConnection(source: GeometricPrimitive, target: GeometricPrimitive): boolean {
    // Struts can connect to anything
    if (source.type === 'strut' || target.type === 'strut') return true;
    
    // Hubs can connect to anything
    if (source.type === 'hub' || target.type === 'hub') return true;
    
    // Polyhedra can connect to each other
    const polyhedra = ['tetrahedron', 'octahedron', 'icosahedron'];
    return polyhedra.includes(source.type) && polyhedra.includes(target.type);
  }

  /**
   * Get transformed connection points in world space
   */
  private getTransformedConnectionPoints(primitive: GeometricPrimitive): ConnectionPoint[] {
    const matrix = this.getTransformationMatrix(primitive);
    const points = this.generateConnectionPoints(primitive);
    
    return points.map(point => {
      const worldPos = new THREE.Vector3().copy(point.position).applyMatrix4(matrix);
      const worldNormal = new THREE.Vector3().copy(point.normal).applyMatrix4(matrix).normalize();
      
      return {
        ...point,
        position: worldPos,
        normal: worldNormal
      };
    });
  }

  /**
   * Get local connection point relative to primitive center
   */
  private getLocalConnectionPoint(primitive: GeometricPrimitive, worldPoint: ConnectionPoint): THREE.Vector3 {
    const matrix = this.getTransformationMatrix(primitive);
    const inverseMatrix = new THREE.Matrix4().getInverse(matrix);
    
    return new THREE.Vector3().copy(worldPoint.position).applyMatrix4(inverseMatrix);
  }

  /**
   * Get transformation matrix for a primitive
   */
  private getTransformationMatrix(primitive: GeometricPrimitive): THREE.Matrix4 {
    const matrix = new THREE.Matrix4();
    matrix.compose(
      new THREE.Vector3(primitive.position.x, primitive.position.y, primitive.position.z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(primitive.rotation.x, primitive.rotation.y, primitive.rotation.z)),
      new THREE.Vector3(1, 1, 1)
    );
    return matrix;
  }

  /**
   * Generate tetrahedron connection points
   */
  private generateTetrahedronPoints(scale: number, primitiveId: string): ConnectionPoint[] {
    const r = scale * 0.6;
    const h = Math.sqrt(2/3) * r;
    const a = Math.sqrt(3) * r / 2;
    
    return [
      {
        id: `${primitiveId}_v1`,
        type: 'vertex',
        position: new THREE.Vector3(0, h, 0),
        normal: new THREE.Vector3(0, 1, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v2`,
        type: 'vertex',
        position: new THREE.Vector3(0, -h/3, 2*a/3),
        normal: new THREE.Vector3(0, -1, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v3`,
        type: 'vertex',
        position: new THREE.Vector3(-a, -h/3, -a/3),
        normal: new THREE.Vector3(-1, 0, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v4`,
        type: 'vertex',
        position: new THREE.Vector3(a, -h/3, -a/3),
        normal: new THREE.Vector3(1, 0, 0),
        isOccupied: false
      }
    ];
  }

  /**
   * Generate octahedron connection points
   */
  private generateOctahedronPoints(scale: number, primitiveId: string): ConnectionPoint[] {
    const s = scale * 0.5;
    
    return [
      {
        id: `${primitiveId}_v1`,
        type: 'vertex',
        position: new THREE.Vector3(0, s, 0),
        normal: new THREE.Vector3(0, 1, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v2`,
        type: 'vertex',
        position: new THREE.Vector3(0, -s, 0),
        normal: new THREE.Vector3(0, -1, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v3`,
        type: 'vertex',
        position: new THREE.Vector3(s, 0, 0),
        normal: new THREE.Vector3(1, 0, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v4`,
        type: 'vertex',
        position: new THREE.Vector3(-s, 0, 0),
        normal: new THREE.Vector3(-1, 0, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v5`,
        type: 'vertex',
        position: new THREE.Vector3(0, 0, s),
        normal: new THREE.Vector3(0, 0, 1),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v6`,
        type: 'vertex',
        position: new THREE.Vector3(0, 0, -s),
        normal: new THREE.Vector3(0, 0, -1),
        isOccupied: false
      }
    ];
  }

  /**
   * Generate icosahedron connection points using golden ratio
   */
  private generateIcosahedronPoints(scale: number, primitiveId: string): ConnectionPoint[] {
    const phi = (1 + Math.sqrt(5)) / 2;
    const r = scale * 0.5;
    const a = r / Math.sqrt(3);
    const b = a / phi;
    const c = a * phi;
    
    return [
      {
        id: `${primitiveId}_v1`,
        type: 'vertex',
        position: new THREE.Vector3(0, c, b),
        normal: new THREE.Vector3(0, 1, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v2`,
        type: 'vertex',
        position: new THREE.Vector3(0, c, -b),
        normal: new THREE.Vector3(0, 1, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v3`,
        type: 'vertex',
        position: new THREE.Vector3(0, -c, b),
        normal: new THREE.Vector3(0, -1, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v4`,
        type: 'vertex',
        position: new THREE.Vector3(0, -c, -b),
        normal: new THREE.Vector3(0, -1, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v5`,
        type: 'vertex',
        position: new THREE.Vector3(b, 0, c),
        normal: new THREE.Vector3(0, 0, 1),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v6`,
        type: 'vertex',
        position: new THREE.Vector3(-b, 0, c),
        normal: new THREE.Vector3(0, 0, 1),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v7`,
        type: 'vertex',
        position: new THREE.Vector3(b, 0, -c),
        normal: new THREE.Vector3(0, 0, -1),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v8`,
        type: 'vertex',
        position: new THREE.Vector3(-b, 0, -c),
        normal: new THREE.Vector3(0, 0, -1),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v9`,
        type: 'vertex',
        position: new THREE.Vector3(c, b, 0),
        normal: new THREE.Vector3(1, 0, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v10`,
        type: 'vertex',
        position: new THREE.Vector3(c, -b, 0),
        normal: new THREE.Vector3(1, 0, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v11`,
        type: 'vertex',
        position: new THREE.Vector3(-c, b, 0),
        normal: new THREE.Vector3(-1, 0, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v12`,
        type: 'vertex',
        position: new THREE.Vector3(-c, -b, 0),
        normal: new THREE.Vector3(-1, 0, 0),
        isOccupied: false
      }
    ];
  }

  /**
   * Generate strut connection points
   */
  private generateStrutPoints(scale: number, primitiveId: string): ConnectionPoint[] {
    const length = scale * 1.2;
    
    return [
      {
        id: `${primitiveId}_v1`,
        type: 'vertex',
        position: new THREE.Vector3(0, length/2, 0),
        normal: new THREE.Vector3(0, 1, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_v2`,
        type: 'vertex',
        position: new THREE.Vector3(0, -length/2, 0),
        normal: new THREE.Vector3(0, -1, 0),
        isOccupied: false
      },
      {
        id: `${primitiveId}_c1`,
        type: 'center',
        position: new THREE.Vector3(0, 0, 0),
        normal: new THREE.Vector3(0, 1, 0),
        isOccupied: false
      }
    ];
  }

  /**
   * Generate hub connection points
   */
  private generateHubPoints(scale: number, primitiveId: string): ConnectionPoint[] {
    return [
      {
        id: `${primitiveId}_c1`,
        type: 'center',
        position: new THREE.Vector3(0, 0, 0),
        normal: new THREE.Vector3(0, 1, 0),
        isOccupied: false
      }
    ];
  }

  /**
   * Create quantum entanglement between primitives
   */
  private entanglePrimitives(id1: string, id2: string): void {
    if (!this.quantumEntanglement.has(id1)) {
      this.quantumEntanglement.set(id1, []);
    }
    if (!this.quantumEntanglement.has(id2)) {
      this.quantumEntanglement.set(id2, []);
    }
    
    const entanglement1 = this.quantumEntanglement.get(id1)!;
    const entanglement2 = this.quantumEntanglement.get(id2)!;
    
    if (!entanglement1.includes(id2)) {
      entanglement1.push(id2);
    }
    if (!entanglement2.includes(id1)) {
      entanglement2.push(id1);
    }
  }

  /**
   * Get quantum entanglement network for a primitive
   */
  getEntanglementNetwork(primitiveId: string): string[] {
    return this.quantumEntanglement.get(primitiveId) || [];
  }

  /**
   * Clear all connection caches
   */
  clearCache(): void {
    this.connectionCache.clear();
    this.quantumEntanglement.clear();
  }
}

export default ConnectionManager;