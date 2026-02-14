/**
 * Snap System Integration Tests
 * Tests the magnetic snapping system with connection points
 */

import * as THREE from 'three';
import { GeometricPrimitive, ConnectionPoint } from '../types/game';
import ConnectionManager from './ConnectionManager';
import SnapSystem from './SnapSystem';

describe('SnapSystem', () => {
  let connectionManager: ConnectionManager;
  let snapSystem: SnapSystem;
  let scene: THREE.Scene;

  beforeEach(() => {
    connectionManager = new ConnectionManager();
    snapSystem = new SnapSystem(connectionManager);
    scene = new THREE.Scene();
  });

  describe('Connection Point Generation', () => {
    it('should generate connection points for tetrahedron', () => {
      const piece: GeometricPrimitive = {
        id: 'test-tetra',
        type: 'tetrahedron',
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const points = connectionManager.generateConnectionPoints(piece);
      
      expect(points.length).toBeGreaterThan(0);
      expect(points[0]).toHaveProperty('id');
      expect(points[0]).toHaveProperty('type');
      expect(points[0]).toHaveProperty('position');
      expect(points[0]).toHaveProperty('normal');
    });

    it('should generate different connection points for different piece types', () => {
      const tetra: GeometricPrimitive = {
        id: 'tetra',
        type: 'tetrahedron',
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const octa: GeometricPrimitive = {
        id: 'octa',
        type: 'octahedron',
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const tetraPoints = connectionManager.generateConnectionPoints(tetra);
      const octaPoints = connectionManager.generateConnectionPoints(octa);

      expect(tetraPoints.length).not.toBe(octaPoints.length);
    });
  });

  describe('Magnetic Force Calculation', () => {
    it('should calculate magnetic force based on distance', () => {
      const movingPiece: GeometricPrimitive = {
        id: 'moving',
        type: 'tetrahedron',
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const targetPiece: GeometricPrimitive = {
        id: 'target',
        type: 'tetrahedron',
        position: new THREE.Vector3(1, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const ghostPiece: GeometricPrimitive = {
        id: 'ghost',
        type: 'tetrahedron',
        position: new THREE.Vector3(0.5, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const allPieces = [targetPiece];
      const feedback = snapSystem.calculateSnapForce(movingPiece, allPieces, ghostPiece);

      expect(feedback.distance).toBeGreaterThan(0);
      expect(feedback.alignmentScore).toBeGreaterThanOrEqual(0);
      expect(feedback.alignmentScore).toBeLessThanOrEqual(1);
    });

    it('should return zero force when distance exceeds range', () => {
      const movingPiece: GeometricPrimitive = {
        id: 'moving',
        type: 'tetrahedron',
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const targetPiece: GeometricPrimitive = {
        id: 'target',
        type: 'tetrahedron',
        position: new THREE.Vector3(10, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const ghostPiece: GeometricPrimitive = {
        id: 'ghost',
        type: 'tetrahedron',
        position: new THREE.Vector3(5, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const allPieces = [targetPiece];
      const feedback = snapSystem.calculateSnapForce(movingPiece, allPieces, ghostPiece);

      expect(feedback.distance).toBeGreaterThan(5);
      expect(feedback.alignmentScore).toBe(0);
    });
  });

  describe('Snap Detection', () => {
    it('should detect when pieces should snap together', () => {
      const movingPiece: GeometricPrimitive = {
        id: 'moving',
        type: 'tetrahedron',
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const targetPiece: GeometricPrimitive = {
        id: 'target',
        type: 'tetrahedron',
        position: new THREE.Vector3(0.1, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const ghostPiece: GeometricPrimitive = {
        id: 'ghost',
        type: 'tetrahedron',
        position: new THREE.Vector3(0.05, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const allPieces = [targetPiece];
      const feedback = snapSystem.calculateSnapForce(movingPiece, allPieces, ghostPiece);

      // At very close distance, should be snapping
      expect(feedback.isSnapping).toBe(true);
    });

    it('should not snap when pieces are misaligned', () => {
      const movingPiece: GeometricPrimitive = {
        id: 'moving',
        type: 'tetrahedron',
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const targetPiece: GeometricPrimitive = {
        id: 'target',
        type: 'tetrahedron',
        position: new THREE.Vector3(0.1, 0, 0),
        rotation: new THREE.Vector3(Math.PI / 2, 0, 0), // 90 degree rotation
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const ghostPiece: GeometricPrimitive = {
        id: 'ghost',
        type: 'tetrahedron',
        position: new THREE.Vector3(0.05, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const allPieces = [targetPiece];
      const feedback = snapSystem.calculateSnapForce(movingPiece, allPieces, ghostPiece);

      // Misaligned pieces should not snap
      expect(feedback.isSnapping).toBe(false);
    });
  });

  describe('Visual Feedback', () => {
    it('should create connection indicators for active snapping', () => {
      const piece: GeometricPrimitive = {
        id: 'test-piece',
        type: 'tetrahedron',
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const feedback = {
        isSnapping: true,
        targetPoint: undefined,
        sourcePoint: undefined,
        distance: 0.1,
        alignmentScore: 0.9
      };

      snapSystem.createConnectionVisuals(piece, feedback, scene);

      // Should have created visual indicators in the scene
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should remove connection indicators when not snapping', () => {
      const piece: GeometricPrimitive = {
        id: 'test-piece',
        type: 'tetrahedron',
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const feedback = {
        isSnapping: false,
        targetPoint: undefined,
        sourcePoint: undefined,
        distance: 5.0,
        alignmentScore: 0.1
      };

      snapSystem.createConnectionVisuals(piece, feedback, scene);

      // Should not have created visual indicators
      expect(scene.children.length).toBe(0);
    });
  });

  describe('Haptic Feedback', () => {
    it('should trigger haptic feedback on snap', () => {
      const piece: GeometricPrimitive = {
        id: 'test-piece',
        type: 'tetrahedron',
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const feedback = {
        isSnapping: true,
        targetPoint: undefined,
        sourcePoint: undefined,
        distance: 0.1,
        alignmentScore: 0.9
      };

      // Mock console.log to capture haptic feedback
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      snapSystem.triggerHapticFeedback(piece, feedback);

      expect(consoleSpy).toHaveBeenCalledWith('Haptic feedback: strength=1, duration=100ms');

      consoleSpy.mockRestore();
    });

    it('should trigger haptic feedback on snap release', () => {
      const piece: GeometricPrimitive = {
        id: 'test-piece',
        type: 'tetrahedron',
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const feedback = {
        isSnapping: false,
        targetPoint: undefined,
        sourcePoint: undefined,
        distance: 1.0,
        alignmentScore: 0.1
      };

      // Mock console.log to capture haptic feedback
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      snapSystem.triggerHapticFeedback(piece, feedback);

      expect(consoleSpy).toHaveBeenCalledWith('Haptic feedback: strength=0.3, duration=50ms');

      consoleSpy.mockRestore();
    });
  });

  describe('Magnetic Field Properties', () => {
    it('should have different magnetic properties for different materials', () => {
      const woodField = snapSystem['magneticFields'].get('wood');
      const metalField = snapSystem['magneticFields'].get('metal');
      const quantumField = snapSystem['magneticFields'].get('quantum');

      expect(woodField).toBeDefined();
      expect(metalField).toBeDefined();
      expect(quantumField).toBeDefined();

      expect(woodField!.strength).toBe(0.5);
      expect(metalField!.strength).toBe(1.0);
      expect(quantumField!.strength).toBe(2.0);

      expect(woodField!.range).toBe(2.0);
      expect(metalField!.range).toBe(3.0);
      expect(quantumField!.range).toBe(4.0);
    });
  });

  describe('Integration with ConnectionManager', () => {
    it('should work with ConnectionManager for connection validation', () => {
      const piece1: GeometricPrimitive = {
        id: 'piece1',
        type: 'tetrahedron',
        position: new THREE.Vector3(0, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const piece2: GeometricPrimitive = {
        id: 'piece2',
        type: 'tetrahedron',
        position: new THREE.Vector3(0.1, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const ghostPiece: GeometricPrimitive = {
        id: 'ghost',
        type: 'tetrahedron',
        position: new THREE.Vector3(0.05, 0, 0),
        rotation: new THREE.Vector3(0, 0, 0),
        scale: 1,
        color: '#8B4513',
        material: 'wood',
        connectedTo: [],
        connectionPoints: []
      };

      const allPieces = [piece1, piece2];
      const feedback = snapSystem.calculateSnapForce(piece1, allPieces, ghostPiece);

      // Should find a connection target
      expect(feedback.targetPoint).toBeDefined();
      expect(feedback.sourcePoint).toBeDefined();
    });
  });
});