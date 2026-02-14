/**
 * Snap System - Magnetic Alignment and Visual Feedback
 * Implements magnetic snapping with haptic feedback and visual indicators
 */

import * as THREE from 'three';
import { GeometricPrimitive, ConnectionPoint } from '../types/game';
import ConnectionManager from './ConnectionManager';

export interface SnapFeedback {
  isSnapping: boolean;
  targetPoint?: ConnectionPoint;
  sourcePoint?: ConnectionPoint;
  distance: number;
  alignmentScore: number; // 0-1, how well aligned the pieces are
}

export interface MagneticField {
  strength: number;
  range: number;
  falloff: number; // exponential falloff rate
}

export class SnapSystem {
  private connectionManager: ConnectionManager;
  private magneticFields: Map<string, MagneticField> = new Map();
  private visualFeedback: Map<string, THREE.Mesh> = new Map();
  private hapticFeedback: Map<string, boolean> = new Map();

  constructor(connectionManager: ConnectionManager) {
    this.connectionManager = connectionManager;
    this.initializeMagneticFields();
  }

  /**
   * Initialize magnetic field properties for each material type
   */
  private initializeMagneticFields(): void {
    this.magneticFields.set('wood', { strength: 0.5, range: 2.0, falloff: 2.0 });
    this.magneticFields.set('metal', { strength: 1.0, range: 3.0, falloff: 1.5 });
    this.magneticFields.set('crystal', { strength: 0.8, range: 2.5, falloff: 1.8 });
    this.magneticFields.set('quantum', { strength: 2.0, range: 4.0, falloff: 1.2 });
  }

  /**
   * Calculate magnetic force and alignment for a moving piece
   */
  calculateSnapForce(
    movingPiece: GeometricPrimitive,
    allPieces: GeometricPrimitive[],
    ghostPiece: GeometricPrimitive
  ): SnapFeedback {
    const feedback: SnapFeedback = {
      isSnapping: false,
      distance: Infinity,
      alignmentScore: 0
    };

    // Find the best connection target
    const bestMatch = this.connectionManager.findConnectionTarget(
      ghostPiece,
      allPieces.filter(p => p.id !== movingPiece.id),
      3.0
    );

    if (!bestMatch) {
      return feedback;
    }

    const { target, sourcePoint, targetPoint, distance } = bestMatch;
    
    // Calculate magnetic force
    const magneticField = this.magneticFields.get(movingPiece.material) || this.magneticFields.get('wood')!;
    const force = this.calculateMagneticForce(distance, magneticField);

    // Calculate alignment score (0-1)
    const alignmentScore = this.calculateAlignmentScore(sourcePoint, targetPoint);

    // Determine if we should snap
    const shouldSnap = this.shouldSnap(distance, alignmentScore, force);

    feedback.isSnapping = shouldSnap;
    feedback.targetPoint = targetPoint;
    feedback.sourcePoint = sourcePoint;
    feedback.distance = distance;
    feedback.alignmentScore = alignmentScore;

    // Apply magnetic force to ghost piece if not snapping yet
    if (!shouldSnap && force > 0.1) {
      this.applyMagneticForce(ghostPiece, sourcePoint, targetPoint, force);
    }

    return feedback;
  }

  /**
   * Calculate magnetic force using inverse square law with exponential falloff
   */
  private calculateMagneticForce(distance: number, field: MagneticField): number {
    if (distance > field.range) return 0;
    
    // Inverse square law with exponential falloff
    const baseForce = field.strength / (distance * distance);
    const falloffForce = baseForce * Math.exp(-distance * field.falloff);
    
    return Math.max(0, Math.min(1, falloffForce));
  }

  /**
   * Calculate how well two connection points are aligned
   */
  private calculateAlignmentScore(sourcePoint: ConnectionPoint, targetPoint: ConnectionPoint): number {
    // Check if normals are aligned (opposite directions for connection)
    const normalAlignment = sourcePoint.normal.dot(targetPoint.normal as THREE.Vector3);
    
    // Check if points are facing each other
    const direction = new THREE.Vector3().subVectors(targetPoint.position, sourcePoint.position).normalize();
    const sourceFacing = sourcePoint.normal.dot(direction);
    const targetFacing = targetPoint.normal.dot(direction.negate() as THREE.Vector3);

    // Combine alignment factors
    const alignment = (Math.abs(normalAlignment) + Math.abs(sourceFacing) + Math.abs(targetFacing)) / 3;
    
    return Math.max(0, Math.min(1, alignment));
  }

  /**
   * Determine if pieces should snap together
   */
  private shouldSnap(distance: number, alignmentScore: number, force: number): boolean {
    // Snap if close enough and well aligned
    const distanceThreshold = 0.5;
    const alignmentThreshold = 0.7;
    const forceThreshold = 0.3;

    return distance < distanceThreshold && alignmentScore > alignmentThreshold && force > forceThreshold;
  }

  /**
   * Apply magnetic force to move the ghost piece
   */
  private applyMagneticForce(
    ghostPiece: GeometricPrimitive,
    sourcePoint: ConnectionPoint,
    targetPoint: ConnectionPoint,
    force: number
  ): void {
    // Calculate direction from source to target
    const direction = new THREE.Vector3().subVectors(targetPoint.position, sourcePoint.position).normalize();
    
    // Apply force to move the piece
    const moveDistance = direction.multiplyScalar(force * 0.1);
    
    ghostPiece.position.x += moveDistance.x;
    ghostPiece.position.y += moveDistance.y;
    ghostPiece.position.z += moveDistance.z;

    // Apply rotational alignment if pieces are close
    if (this.calculateDistance(sourcePoint.position, targetPoint.position) < 1.0) {
      this.alignRotation(ghostPiece, sourcePoint, targetPoint);
    }
  }

  /**
   * Align rotation to face the target connection point
   */
  private alignRotation(
    ghostPiece: GeometricPrimitive,
    sourcePoint: ConnectionPoint,
    targetPoint: ConnectionPoint
  ): void {
    const sourceMatrix = this.getTransformationMatrix(ghostPiece);
    const targetMatrix = this.getTransformationMatrix(this.findPieceById(targetPoint.connectedTo || '', []));
    
    // Calculate rotation needed to align normals
    const sourceNormal = new THREE.Vector3().copy(sourcePoint.normal).applyMatrix4(sourceMatrix).normalize();
    const targetNormal = new THREE.Vector3().copy(targetPoint.normal).applyMatrix4(targetMatrix).normalize();
    
    const quaternion = new THREE.Quaternion().setFromUnitVectors(sourceNormal, targetNormal.negate());
    
    // Apply rotation to ghost piece
    const currentRotation = new THREE.Euler().setFromVector3(ghostPiece.rotation);
    
    const newRotation = new THREE.Euler().setFromQuaternion(quaternion.multiply(new THREE.Quaternion().setFromEuler(currentRotation)));
    
    ghostPiece.rotation.x = newRotation.x;
    ghostPiece.rotation.y = newRotation.y;
    ghostPiece.rotation.z = newRotation.z;
  }

  /**
   * Create visual feedback for connection points
   */
  createConnectionVisuals(
    piece: GeometricPrimitive,
    feedback: SnapFeedback,
    scene: THREE.Scene
  ): void {
    const points = this.connectionManager.generateConnectionPoints(piece);
    
    points.forEach(point => {
      const key = `${piece.id}_${point.id}`;
      
      if (feedback.isSnapping && feedback.sourcePoint?.id === point.id) {
        // Highlight the active connection point
        this.createConnectionIndicator(point, scene, 'active');
      } else if (feedback.distance < 2.0) {
        // Show potential connection points
        this.createConnectionIndicator(point, scene, 'potential');
      } else {
        // Hide or dim connection points
        this.removeConnectionIndicator(key, scene);
      }
    });
  }

  /**
   * Create a visual indicator for a connection point
   */
  private createConnectionIndicator(point: ConnectionPoint, scene: THREE.Scene, type: 'active' | 'potential'): void {
    const geometry = new THREE.RingGeometry(0.1, 0.15, 32);
    const material = new THREE.MeshBasicMaterial({
      color: type === 'active' ? 0x00ffff : 0xffff00,
      transparent: true,
      opacity: type === 'active' ? 1.0 : 0.5,
      side: THREE.DoubleSide
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    
    // Position the indicator at the connection point
    mesh.position.copy(point.position);
    
    // Orient the ring to face the connection normal
    const normal = new THREE.Vector3().copy(point.normal).normalize();
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
    
    scene.add(mesh);
  }

  /**
   * Remove a connection indicator
   */
  private removeConnectionIndicator(key: string, scene: THREE.Scene): void {
    const mesh = this.visualFeedback.get(key);
    if (mesh) {
      scene.remove(mesh);
      this.visualFeedback.delete(key);
    }
  }

  /**
   * Trigger haptic feedback for connection events
   */
  triggerHapticFeedback(piece: GeometricPrimitive, feedback: SnapFeedback): void {
    const key = `${piece.id}_haptic`;
    
    if (feedback.isSnapping && !this.hapticFeedback.get(key)) {
      // Connection snap - strong vibration
      this.triggerVibration(1.0, 100);
      this.hapticFeedback.set(key, true);
    } else if (!feedback.isSnapping && this.hapticFeedback.get(key)) {
      // Connection released - weak vibration
      this.triggerVibration(0.3, 50);
      this.hapticFeedback.set(key, false);
    }
  }

  /**
   * Trigger device vibration (placeholder for actual haptic implementation)
   */
  private triggerVibration(strength: number, duration: number): void {
    // This would integrate with the actual haptic system
    // For now, we'll log the intended haptic event
    console.log(`Haptic feedback: strength=${strength}, duration=${duration}ms`);
  }

  /**
   * Calculate distance between two Vector3 points
   */
  private calculateDistance(pos1: THREE.Vector3, pos2: THREE.Vector3): number {
    return Math.sqrt(
      Math.pow(pos2.x - pos1.x, 2) +
      Math.pow(pos2.y - pos1.y, 2) +
      Math.pow(pos2.z - pos1.z, 2)
    );
  }

  /**
   * Get transformation matrix for a piece
   */
  private getTransformationMatrix(piece: GeometricPrimitive): THREE.Matrix4 {
    const matrix = new THREE.Matrix4();
    matrix.compose(
      new THREE.Vector3(piece.position.x, piece.position.y, piece.position.z),
      new THREE.Quaternion().setFromEuler(new THREE.Euler(piece.rotation.x, piece.rotation.y, piece.rotation.z)),
      new THREE.Vector3(1, 1, 1)
    );
    return matrix;
  }

  /**
   * Find a piece by ID (placeholder - should integrate with actual game state)
   */
  private findPieceById(id: string, pieces: GeometricPrimitive[]): GeometricPrimitive | null {
    return pieces.find(p => p.id === id) || null;
  }

  /**
   * Clean up visual feedback
   */
  cleanupVisuals(scene: THREE.Scene): void {
    this.visualFeedback.forEach((mesh, key) => {
      scene.remove(mesh);
    });
    this.visualFeedback.clear();
  }

  /**
   * Update the snap system for a frame
   */
  update(
    movingPiece: GeometricPrimitive,
    allPieces: GeometricPrimitive[],
    ghostPiece: GeometricPrimitive,
    scene: THREE.Scene
  ): SnapFeedback {
    const feedback = this.calculateSnapForce(movingPiece, allPieces, ghostPiece);
    
    this.createConnectionVisuals(movingPiece, feedback, scene);
    this.triggerHapticFeedback(movingPiece, feedback);
    
    return feedback;
  }
}

export default SnapSystem;