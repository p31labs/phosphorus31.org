import * as THREE from 'three';
import * as RAPIER from '@dimforge/rapier3d';
import { GeometricPrimitive, Structure, PhysicsResult } from '../types/game';
import { MATERIAL_PROPERTIES } from '../types/game';

export class PhysicsWorld {
  private world: RAPIER.World;
  private rigidBodies: Map<string, RAPIER.RigidBody> = new Map();
  private colliders: Map<string, RAPIER.Collider> = new Map();
  private isInitialized: boolean = false;

  /**
   * Initialize physics world
   */
  public async init(): Promise<void> {
    if (this.isInitialized) return;
    
    // Initialize Rapier3D
    await RAPIER.init();
    
    // Create physics world with gravity
    const gravity = new RAPIER.Vector3(0.0, -9.81, 0.0);
    this.world = new RAPIER.World(gravity);
    
    this.isInitialized = true;
    console.log('🚀 PhysicsWorld: Rapier3D initialized successfully');
  }

  /**
   * Update physics simulation
   */
  public update(deltaTime: number): void {
    if (!this.isInitialized) return;
    
    // Step the physics simulation
    this.world.step();
    
    // Update Three.js objects with physics positions
    this.rigidBodies.forEach((rigidBody, primitiveId) => {
      const mesh = this.findMeshByPrimitiveId(primitiveId);
      if (mesh) {
        const position = rigidBody.translation();
        const rotation = rigidBody.rotation();
        
        mesh.position.set(position.x, position.y, position.z);
        mesh.quaternion.set(rotation.x, rotation.y, rotation.z, rotation.w);
      }
    });
  }

  /**
   * Add primitive to physics world
   */
  public addPrimitive(primitive: GeometricPrimitive): void {
    if (!this.isInitialized) return;
    
    // Create rigid body
    const rigidBodyDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(primitive.position.x, primitive.position.y, primitive.position.z)
      .setRotation(new RAPIER.Quaternion(
        primitive.rotation.x, 
        primitive.rotation.y, 
        primitive.rotation.z, 
        1
      ));
    
    const rigidBody = this.world.createRigidBody(rigidBodyDesc);
    this.rigidBodies.set(primitive.id, rigidBody);

    // Create collider based on primitive type
    const collider = this.createColliderForPrimitive(primitive);
    this.world.createCollider(collider, rigidBody);
    this.colliders.set(primitive.id, collider);
    
    console.log(`🏗️ PhysicsWorld: Added ${primitive.type} to physics simulation`);
  }

  /**
   * Remove primitive from physics world
   */
  public removePrimitive(primitiveId: string): void {
    if (!this.isInitialized) return;
    
    const rigidBody = this.rigidBodies.get(primitiveId);
    const collider = this.colliders.get(primitiveId);
    
    if (rigidBody) {
      this.world.removeRigidBody(rigidBody);
      this.rigidBodies.delete(primitiveId);
    }
    
    if (collider) {
      this.world.removeCollider(collider, true);
      this.colliders.delete(primitiveId);
    }
    
    console.log(`🗑️ PhysicsWorld: Removed primitive ${primitiveId} from physics simulation`);
  }

  /**
   * Apply test forces to structure
   */
  public applyTestForces(structure: Structure): PhysicsResult {
    if (!this.isInitialized) {
      return {
        isStable: false,
        deformation: 0,
        failurePoints: [],
        centerOfMass: { x: 0, y: 0, z: 0 },
        stressDistribution: []
      };
    }
    
    const failurePoints: string[] = [];
    let maxDeformation = 0;
    let totalStress = 0;
    const stressDistribution: number[] = [];
    
    // Apply test forces to each piece
    structure.primitives.forEach(primitive => {
      const rigidBody = this.rigidBodies.get(primitive.id);
      if (rigidBody) {
        // Apply downward force (gravity test)
        const force = new RAPIER.Vector3(0, -100, 0);
        rigidBody.applyForce(force, true);
        
        // Apply lateral force (wind test)
        const lateralForce = new RAPIER.Vector3(50, 0, 0);
        rigidBody.applyForce(lateralForce, true);
        
        // Calculate stress based on forces and material properties
        const materialProps = MATERIAL_PROPERTIES[primitive.material];
        const stress = this.calculateStress(rigidBody, materialProps);
        stressDistribution.push(stress);
        totalStress += stress;
        
        // Check for failure
        if (stress > materialProps.strength) {
          failurePoints.push(primitive.id);
        }
        
        // Calculate deformation
        const deformation = this.calculateDeformation(rigidBody);
        maxDeformation = Math.max(maxDeformation, deformation);
      }
    });
    
    const averageStress = totalStress / structure.primitives.length;
    const isStable = failurePoints.length === 0 && maxDeformation < 0.1;
    
    return {
      isStable,
      deformation: maxDeformation,
      failurePoints,
      centerOfMass: this.calculateCenterOfMass(structure),
      stressDistribution
    };
  }

  /**
   * Get structure stability
   */
  public getStructureStability(structure: Structure): number {
    const result = this.applyTestForces(structure);
    
    // Calculate stability score (0-100)
    const baseScore = result.isStable ? 100 : 0;
    const deformationPenalty = result.deformation * 50;
    const failurePenalty = result.failurePoints.length * 20;
    
    let stabilityScore = baseScore - deformationPenalty - failurePenalty;
    stabilityScore = Math.max(0, Math.min(100, stabilityScore));
    
    return stabilityScore;
  }

  /**
   * Create collider for primitive based on type
   */
  private createColliderForPrimitive(primitive: GeometricPrimitive): RAPIER.ColliderDesc {
    const materialProps = MATERIAL_PROPERTIES[primitive.material];
    
    // Create collider based on primitive type
    let colliderDesc: RAPIER.ColliderDesc;
    
    switch (primitive.type) {
      case 'tetrahedron':
        // Approximate tetrahedron with a sphere
        colliderDesc = RAPIER.ColliderDesc.ball(primitive.scale * 0.5);
        break;
      case 'octahedron':
        // Approximate octahedron with a sphere
        colliderDesc = RAPIER.ColliderDesc.ball(primitive.scale * 0.6);
        break;
      case 'icosahedron':
        // Approximate icosahedron with a sphere
        colliderDesc = RAPIER.ColliderDesc.ball(primitive.scale * 0.7);
        break;
      case 'strut':
        // Cylinder for struts
        colliderDesc = RAPIER.ColliderDesc.cylinder(
          primitive.scale * 0.5, 
          primitive.scale * 0.1
        );
        break;
      case 'hub':
        // Small sphere for hubs
        colliderDesc = RAPIER.ColliderDesc.ball(primitive.scale * 0.2);
        break;
      default:
        // Default to box
        colliderDesc = RAPIER.ColliderDesc.cuboid(
          primitive.scale * 0.5, 
          primitive.scale * 0.5, 
          primitive.scale * 0.5
        );
    }
    
    // Set material properties
    colliderDesc.setDensity(materialProps.density);
    colliderDesc.setFriction(materialProps.friction);
    colliderDesc.setRestitution(materialProps.restitution);
    
    return colliderDesc;
  }

  /**
   * Calculate stress on a rigid body
   */
  private calculateStress(rigidBody: RAPIER.RigidBody, materialProps: any): number {
    const velocity = rigidBody.linvel();
    const angularVelocity = rigidBody.angvel();
    
    // Simple stress calculation based on velocity and angular velocity
    const linearEnergy = 0.5 * rigidBody.mass() * (velocity.x**2 + velocity.y**2 + velocity.z**2);
    const angularEnergy = 0.5 * rigidBody.mass() * (angularVelocity.x**2 + angularVelocity.y**2 + angularVelocity.z**2);
    
    return (linearEnergy + angularEnergy) / materialProps.strength;
  }

  /**
   * Calculate deformation based on rigid body state
   */
  private calculateDeformation(rigidBody: RAPIER.RigidBody): number {
    const velocity = rigidBody.linvel();
    const speed = Math.sqrt(velocity.x**2 + velocity.y**2 + velocity.z**2);
    
    // Simple deformation calculation
    return Math.min(speed / 10, 1.0);
  }

  /**
   * Calculate center of mass for structure
   */
  private calculateCenterOfMass(structure: Structure): { x: number, y: number, z: number } {
    let totalMass = 0;
    let centerX = 0;
    let centerY = 0;
    let centerZ = 0;
    
    structure.primitives.forEach(primitive => {
      const materialProps = MATERIAL_PROPERTIES[primitive.material];
      const mass = materialProps.density * primitive.scale;
      
      totalMass += mass;
      centerX += primitive.position.x * mass;
      centerY += primitive.position.y * mass;
      centerZ += primitive.position.z * mass;
    });
    
    if (totalMass === 0) return { x: 0, y: 0, z: 0 };
    
    return {
      x: centerX / totalMass,
      y: centerY / totalMass,
      z: centerZ / totalMass
    };
  }

  /**
   * Find mesh by primitive ID (placeholder - would need Three.js integration)
   */
  private findMeshByPrimitiveId(primitiveId: string): THREE.Mesh | null {
    // This would need to be implemented with proper Three.js integration
    // For now, return null
    return null;
  }

  /**
   * Dispose physics world
   */
  public dispose(): void {
    if (!this.isInitialized) return;
    
    // Clean up all rigid bodies and colliders
    this.rigidBodies.forEach((rigidBody, primitiveId) => {
      this.world.removeRigidBody(rigidBody);
    });
    
    this.colliders.forEach((collider, primitiveId) => {
      this.world.removeCollider(collider, true);
    });
    
    this.rigidBodies.clear();
    this.colliders.clear();
    
    console.log('🧹 PhysicsWorld disposed');
  }
}