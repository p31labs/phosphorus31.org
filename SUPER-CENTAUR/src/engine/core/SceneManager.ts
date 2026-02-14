import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { GeometricPrimitive, Structure, ValidationResult } from '../types/game';
import { VisualEffects } from './VisualEffects';

export class SceneManager {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private composer: EffectComposer;
  
  // Scene objects
  private buildPlate!: THREE.Mesh;
  private gridHelper!: THREE.GridHelper;
  private structureGroup!: THREE.Group;
  private ghostPiece: THREE.Mesh | null = null;
  private visualEffects: VisualEffects;
  
  // Lighting
  private ambientLight!: THREE.AmbientLight;
  private directionalLight!: THREE.DirectionalLight;
  private pointLights: THREE.PointLight[] = [];
  
  // State
  private isInitialized: boolean = false;
  private width: number = window.innerWidth;
  private height: number = window.innerHeight;
  private quality: 'low' | 'medium' | 'high' = 'high';

  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x1a1a1a);
    
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 1000);
    this.camera.position.set(10, 10, 10);
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 50;
    this.controls.minDistance = 2;
    
    this.visualEffects = new VisualEffects(this.scene);
    this.setupScene();
  }

  /**
   * Initialize the scene manager
   */
  public async init(): Promise<void> {
    if (this.isInitialized) return;
    
    document.body.appendChild(this.renderer.domElement);
    this.setupPostProcessing();
    this.isInitialized = true;
    
    console.log('🎨 SceneManager initialized');
  }

  /**
   * Setup the base scene
   */
  private setupScene(): void {
    // Build plate
    const plateGeometry = new THREE.CircleGeometry(20, 64);
    const plateMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x333333, 
      roughness: 0.8, 
      metalness: 0.2 
    });
    this.buildPlate = new THREE.Mesh(plateGeometry, plateMaterial);
    this.buildPlate.rotation.x = -Math.PI / 2;
    this.buildPlate.receiveShadow = true;
    this.scene.add(this.buildPlate);

    // Grid helper
    this.gridHelper = new THREE.GridHelper(40, 40, 0x444444, 0x222222);
    this.gridHelper.position.y = 0.01;
    this.scene.add(this.gridHelper);

    // Structure group
    this.structureGroup = new THREE.Group();
    this.scene.add(this.structureGroup);

    // Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(this.ambientLight);

    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(10, 20, 10);
    this.directionalLight.castShadow = true;
    this.directionalLight.shadow.mapSize.width = 2048;
    this.directionalLight.shadow.mapSize.height = 2048;
    this.directionalLight.shadow.camera.near = 0.5;
    this.directionalLight.shadow.camera.far = 50;
    this.directionalLight.shadow.camera.left = -20;
    this.directionalLight.shadow.camera.right = 20;
    this.directionalLight.shadow.camera.top = 20;
    this.directionalLight.shadow.camera.bottom = -20;
    this.scene.add(this.directionalLight);

    // Point lights for ambient fill
    const colors = [0xff4444, 0x44ff44, 0x4444ff];
    for (let i = 0; i < 3; i++) {
      const light = new THREE.PointLight(colors[i], 0.5, 20);
      light.position.set(Math.cos(i) * 15, 5, Math.sin(i) * 15);
      this.pointLights.push(light);
      this.scene.add(light);
    }
  }

  /**
   * Setup post-processing effects
   */
  private setupPostProcessing(): void {
    this.composer = new EffectComposer(this.renderer);
    
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(this.width, this.height),
      1.5,    // strength
      0.4,    // radius
      0.85    // threshold
    );
    bloomPass.threshold = 0.1;
    bloomPass.strength = 1.2;
    bloomPass.radius = 0.5;
    this.composer.addPass(bloomPass);
  }

  /**
   * Create a geometric primitive mesh
   */
  public createPrimitiveMesh(primitive: GeometricPrimitive): THREE.Mesh {
    let geometry: THREE.BufferGeometry;
    
    switch (primitive.type) {
      case 'tetrahedron':
        geometry = new THREE.TetrahedronGeometry(primitive.scale);
        break;
      case 'octahedron':
        geometry = new THREE.OctahedronGeometry(primitive.scale);
        break;
      case 'icosahedron':
        geometry = new THREE.IcosahedronGeometry(primitive.scale);
        break;
      case 'strut':
        geometry = new THREE.CylinderGeometry(primitive.scale * 0.1, primitive.scale * 0.1, primitive.scale, 8);
        break;
      case 'hub':
        geometry = new THREE.SphereGeometry(primitive.scale * 0.2, 16, 16);
        break;
      default:
        geometry = new THREE.BoxGeometry(primitive.scale, primitive.scale, primitive.scale);
    }

    const material = this.getMaterialForPrimitive(primitive);
    const mesh = new THREE.Mesh(geometry, material);
    
    mesh.position.set(primitive.position.x, primitive.position.y, primitive.position.z);
    mesh.rotation.set(primitive.rotation.x, primitive.rotation.y, primitive.rotation.z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = { primitiveId: primitive.id };
    
    return mesh;
  }

  /**
   * Get material for primitive based on type and material
   */
  private getMaterialForPrimitive(primitive: GeometricPrimitive): THREE.Material {
    const baseColor = this.getColorForMaterial(primitive.material);
    
    switch (primitive.material) {
      case 'wood':
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.8,
          metalness: 0.1
        });
      case 'metal':
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.3,
          metalness: 0.9
        });
      case 'crystal':
        return new THREE.MeshPhysicalMaterial({
          color: baseColor,
          roughness: 0.1,
          metalness: 0.0,
          transmission: 0.9,
          thickness: 1.0
        });
      case 'quantum':
        return new THREE.MeshStandardMaterial({
          color: baseColor,
          roughness: 0.2,
          metalness: 0.8,
          emissive: new THREE.Color(baseColor).multiplyScalar(0.5)
        });
      default:
        return new THREE.MeshStandardMaterial({ color: baseColor });
    }
  }

  /**
   * Get color for material type
   */
  private getColorForMaterial(material: string): number {
    switch (material) {
      case 'wood': return 0x8B4513;
      case 'metal': return 0xC0C0C0;
      case 'crystal': return 0x00FFFF;
      case 'quantum': return 0xFF00FF;
      default: return 0xffffff;
    }
  }

  /**
   * Add primitive to scene
   */
  public addPrimitive(primitive: GeometricPrimitive): void {
    const mesh = this.createPrimitiveMesh(primitive);
    this.structureGroup.add(mesh);
  }

  /**
   * Remove primitive from scene
   */
  public removePrimitive(primitiveId: string): void {
    const mesh = this.findMeshByPrimitiveId(primitiveId);
    if (mesh) {
      this.structureGroup.remove(mesh);
      mesh.geometry.dispose();
      (mesh.material as THREE.Material).dispose();
    }
  }

  /**
   * Update primitive in scene
   */
  public updatePrimitive(primitive: GeometricPrimitive): void {
    const mesh = this.findMeshByPrimitiveId(primitive.id);
    if (mesh) {
      mesh.position.set(primitive.position.x, primitive.position.y, primitive.position.z);
      mesh.rotation.set(primitive.rotation.x, primitive.rotation.y, primitive.rotation.z);
      mesh.scale.setScalar(primitive.scale);
      
      // Update material if needed
      const newMaterial = this.getMaterialForPrimitive(primitive);
      if (mesh.material !== newMaterial) {
        (mesh.material as THREE.Material).dispose();
        mesh.material = newMaterial;
      }
    }
  }

  /**
   * Find mesh by primitive ID
   */
  public findMeshByPrimitiveId(primitiveId: string): THREE.Mesh | null {
    let foundMesh: THREE.Mesh | null = null;
    
    this.structureGroup.traverse((object) => {
      if (object instanceof THREE.Mesh && object.userData.primitiveId === primitiveId) {
        foundMesh = object;
      }
    });
    
    return foundMesh;
  }

  /**
   * Set ghost piece for preview
   */
  public setGhostPiece(primitive: GeometricPrimitive | null): void {
    if (this.ghostPiece) {
      this.structureGroup.remove(this.ghostPiece);
      this.ghostPiece.geometry.dispose();
      this.ghostPiece.material.dispose();
      this.ghostPiece = null;
    }

    if (primitive) {
      const mesh = this.createPrimitiveMesh(primitive);
      mesh.material = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.5,
        wireframe: true
      });
      this.ghostPiece = mesh;
      this.structureGroup.add(mesh);
    }
  }

  /**
   * Update ghost piece position
   */
  public updateGhostPiece(position: THREE.Vector3, rotation: THREE.Euler): void {
    if (this.ghostPiece) {
      this.ghostPiece.position.copy(position);
      this.ghostPiece.rotation.copy(rotation);
    }
  }

  /**
   * Load entire structure
   */
  public loadStructure(structure: Structure): void {
    this.clearStructure();
    
    structure.primitives.forEach(primitive => {
      this.addPrimitive(primitive);
    });
  }

  /**
   * Clear current structure
   */
  public clearStructure(): void {
    while (this.structureGroup.children.length > 0) {
      const child = this.structureGroup.children[0];
      this.structureGroup.remove(child);
      
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
    }
  }

  /**
   * Update structure visuals based on validation
   */
  public updateStructureVisuals(validation: ValidationResult): void {
    // Get structure center for particle effect
    const box = new THREE.Box3().setFromObject(this.structureGroup);
    const center = box.getCenter(new THREE.Vector3());
    
    // Create validation particles
    this.visualEffects.createValidationParticles(center, validation.isValid);
    
    // Update material colors
    this.structureGroup.children.forEach((child, index) => {
      if (child instanceof THREE.Mesh) {
        const material = child.material as THREE.MeshStandardMaterial;
        
        if (validation.isValid) {
          // Green tint for valid structure
          material.emissive.setHex(0x004400);
          material.emissiveIntensity = 0.3;
        } else {
          // Red tint for invalid structure
          material.emissive.setHex(0x440000);
          material.emissiveIntensity = 0.2;
        }
      }
    });
  }

  /**
   * Toggle grid visibility
   */
  public toggleGrid(visible: boolean): void {
    this.gridHelper.visible = visible;
  }

  /**
   * Update camera position for better viewing
   */
  public focusOnStructure(): void {
    const box = new THREE.Box3().setFromObject(this.structureGroup);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    
    const distance = maxDim * 3;
    const direction = new THREE.Vector3(1, 1, 1).normalize();
    
    this.camera.position.copy(center).add(direction.multiplyScalar(distance));
    this.controls.target.copy(center);
    this.controls.update();
  }

  /**
   * Handle window resize
   */
  public onWindowResize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    
    this.renderer.setSize(this.width, this.height);
    this.composer.setSize(this.width, this.height);
  }

  /**
   * Update method called each frame
   */
  public update(deltaTime: number): void {
    this.controls.update();
    
    // Animate point lights
    this.pointLights.forEach((light, index) => {
      const time = Date.now() * 0.001;
      light.position.x = Math.cos(time + index) * 15;
      light.position.z = Math.sin(time + index) * 15;
    });
  }

  /**
   * Render the scene
   */
  public render(): void {
    this.composer.render();
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    // Dispose geometry and materials
    this.structureGroup.children.forEach(child => {
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        (child.material as THREE.Material).dispose();
      }
    });
    
    this.buildPlate.geometry.dispose();
    (this.buildPlate.material as THREE.Material).dispose();
    this.gridHelper.dispose();
    
    this.renderer.dispose();
    this.composer.dispose();
    this.visualEffects.dispose();
    
    // Remove from DOM
    if (this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
    }
    
    console.log('🧹 SceneManager disposed');
  }

  // Getters for external access
  public getScene(): THREE.Scene {
    return this.scene;
  }

  public getCamera(): THREE.PerspectiveCamera {
    return this.camera;
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  public getControls(): OrbitControls {
    return this.controls;
  }

  public getStructureGroup(): THREE.Group {
    return this.structureGroup;
  }

  /**
   * Set rendering quality level
   */
  public setQuality(quality: 'low' | 'medium' | 'high'): void {
    this.quality = quality;
    
    switch (quality) {
      case 'low':
        this.renderer.setPixelRatio(1);
        this.renderer.shadowMap.enabled = false;
        this.directionalLight.shadow.mapSize.width = 512;
        this.directionalLight.shadow.mapSize.height = 512;
        if (this.composer) {
          const bloomPass = this.composer.passes.find(p => p instanceof UnrealBloomPass) as UnrealBloomPass;
          if (bloomPass) {
            bloomPass.strength = 0.5;
            bloomPass.radius = 0.3;
          }
        }
        break;
      case 'medium':
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.shadowMap.enabled = true;
        this.directionalLight.shadow.mapSize.width = 1024;
        this.directionalLight.shadow.mapSize.height = 1024;
        if (this.composer) {
          const bloomPass = this.composer.passes.find(p => p instanceof UnrealBloomPass) as UnrealBloomPass;
          if (bloomPass) {
            bloomPass.strength = 1.0;
            bloomPass.radius = 0.4;
          }
        }
        break;
      case 'high':
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.directionalLight.shadow.mapSize.width = 2048;
        this.directionalLight.shadow.mapSize.height = 2048;
        if (this.composer) {
          const bloomPass = this.composer.passes.find(p => p instanceof UnrealBloomPass) as UnrealBloomPass;
          if (bloomPass) {
            bloomPass.strength = 1.5;
            bloomPass.radius = 0.5;
          }
        }
        break;
    }
    
    console.log(`🎨 Quality set to: ${quality}`);
  }

  /**
   * Get current quality level
   */
  public getQuality(): 'low' | 'medium' | 'high' {
    return this.quality;
  }
}