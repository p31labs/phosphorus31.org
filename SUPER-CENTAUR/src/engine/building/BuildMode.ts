import * as THREE from 'three';
import { SceneManager } from '../core/SceneManager';
import { GeometricPrimitive, BuildState, BuildModeType } from '../types/game';

export class BuildMode {
  private sceneManager: SceneManager;
  private physicsWorld: any; // Placeholder for PhysicsWorld
  
  // State
  private buildState: BuildState;
  private isBuilding: boolean = false;
  private currentPieceType: string = 'tetrahedron';
  private currentMaterial: string = 'wood';
  private currentScale: number = 1;
  
  // Interaction
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;
  private selectedPiece: string | null = null;
  private dragPlane: THREE.Mesh;
  private isDragging: boolean = false;
  
  // Callbacks
  public onPiecePlaced: ((piece: GeometricPrimitive) => void) | null = null;
  public onPieceRemoved: ((piece: GeometricPrimitive) => void) | null = null;
  public onStructureChanged: (() => void) | null = null;

  constructor(sceneManager: SceneManager, physicsWorld: PhysicsWorld) {
    this.sceneManager = sceneManager;
    this.physicsWorld = physicsWorld;
    
    this.buildState = {
      mode: 'build',
      selectedPiece: null,
      ghostPiece: null,
      snapEnabled: true,
      gridVisible: true,
      undoStack: [],
      redoStack: []
    };
    
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    
    // Create drag plane
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
      visible: false,
      side: THREE.DoubleSide 
    });
    this.dragPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    this.dragPlane.rotation.x = -Math.PI / 2;
    this.sceneManager.getScene().add(this.dragPlane);
    
    this.setupEventListeners();
  }

  /**
   * Initialize build mode
   */
  public init(): void {
    this.sceneManager.toggleGrid(true);
    this.updateGhostPiece();
    console.log('🏗️ BuildMode initialized');
  }

  /**
   * Setup event listeners
   */
  private setupEventListeners(): void {
    // Mouse events
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
    window.addEventListener('click', this.onClick.bind(this));
    
    // Keyboard events
    window.addEventListener('keydown', this.onKeyDown.bind(this));
  }

  /**
   * Handle mouse move
   */
  private onMouseMove(event: MouseEvent): void {
    if (!this.isBuilding) return;
    
    this.updateMouse(event);
    
    if (this.isDragging && this.buildState.ghostPiece) {
      this.dragGhostPiece();
    } else {
      this.updateGhostPiecePosition();
    }
  }

  /**
   * Handle mouse down
   */
  private onMouseDown(event: MouseEvent): void {
    if (!this.isBuilding) return;
    
    if (event.button === 0) { // Left click
      this.isDragging = true;
    }
  }

  /**
   * Handle mouse up
   */
  private onMouseUp(event: MouseEvent): void {
    if (!this.isBuilding) return;
    
    if (event.button === 0) { // Left click
      this.isDragging = false;
      
      // Try to place piece
      if (this.buildState.ghostPiece) {
        this.placePiece();
      }
    }
  }

  /**
   * Handle click
   */
  private onClick(event: MouseEvent): void {
    if (!this.isBuilding) return;
    
    if (event.button === 2) { // Right click
      this.selectPiece();
    }
  }

  /**
   * Handle key down
   */
  private onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case '1':
        this.setPieceType('tetrahedron');
        break;
      case '2':
        this.setPieceType('octahedron');
        break;
      case '3':
        this.setPieceType('icosahedron');
        break;
      case '4':
        this.setPieceType('strut');
        break;
      case '5':
        this.setPieceType('hub');
        break;
      case 'w':
        this.setMaterial('wood');
        break;
      case 'm':
        this.setMaterial('metal');
        break;
      case 'c':
        this.setMaterial('crystal');
        break;
      case 'q':
        this.setMaterial('quantum');
        break;
      case '+':
      case '=':
        this.setScale(this.currentScale + 0.1);
        break;
      case '-':
      case '_':
        this.setScale(Math.max(0.1, this.currentScale - 0.1));
        break;
      case 'Delete':
      case 'Backspace':
        this.removeSelectedPiece();
        break;
      case 'Escape':
        this.deselectPiece();
        break;
    }
  }

  /**
   * Update mouse coordinates
   */
  private updateMouse(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  /**
   * Update ghost piece position
   */
  private updateGhostPiecePosition(): void {
    if (!this.buildState.ghostPiece) return;
    
    this.raycaster.setFromCamera(this.mouse, this.sceneManager.getCamera());
    
    const intersects = this.raycaster.intersectObject(this.dragPlane);
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      
      if (this.buildState.snapEnabled) {
        point.x = Math.round(point.x);
        point.y = Math.round(point.y);
        point.z = Math.round(point.z);
      }
      
      this.buildState.ghostPiece.position = point;
      this.sceneManager.updateGhostPiece(point, new THREE.Euler());
    }
  }

  /**
   * Drag ghost piece
   */
  private dragGhostPiece(): void {
    if (!this.buildState.ghostPiece) return;
    
    this.raycaster.setFromCamera(this.mouse, this.sceneManager.getCamera());
    
    const intersects = this.raycaster.intersectObject(this.dragPlane);
    
    if (intersects.length > 0) {
      const point = intersects[0].point;
      
      if (this.buildState.snapEnabled) {
        point.x = Math.round(point.x);
        point.y = Math.round(point.y);
        point.z = Math.round(point.z);
      }
      
      this.buildState.ghostPiece.position = point;
      this.sceneManager.updateGhostPiece(point, new THREE.Euler());
    }
  }

  /**
   * Place current ghost piece
   */
  private placePiece(): void {
    if (!this.buildState.ghostPiece) return;
    
    const primitive: GeometricPrimitive = {
      id: this.generateId(),
      type: this.buildState.ghostPiece.type as any,
      position: this.buildState.ghostPiece.position,
      rotation: new THREE.Euler(),
      scale: this.currentScale,
      color: this.getColorForMaterial(this.currentMaterial),
      material: this.currentMaterial as any,
      connectedTo: []
    };
    
    // Add to scene
    this.sceneManager.addPrimitive(primitive);
    
    // Add to physics world
    this.physicsWorld.addPrimitive(primitive);
    
    // Call callback
    if (this.onPiecePlaced) {
      this.onPiecePlaced(primitive);
    }
    
    // Update structure changed callback
    if (this.onStructureChanged) {
      this.onStructureChanged();
    }
    
    // Update ghost piece
    this.updateGhostPiece();
  }

  /**
   * Select piece under cursor
   */
  private selectPiece(): void {
    this.raycaster.setFromCamera(this.mouse, this.sceneManager.getCamera());
    
    const intersects = this.raycaster.intersectObjects(this.sceneManager.getStructureGroup().children);
    
    if (intersects.length > 0) {
      const object = intersects[0].object;
      const primitiveId = object.userData.primitiveId;
      
      if (primitiveId) {
        this.selectedPiece = primitiveId;
        this.buildState.selectedPiece = primitiveId;
        
        // Highlight selected piece
        this.highlightPiece(primitiveId, true);
      }
    }
  }

  /**
   * Remove selected piece
   */
  private removeSelectedPiece(): void {
    if (!this.selectedPiece) return;
    
    // Get primitive data
    const primitive = this.getPrimitiveById(this.selectedPiece);
    if (!primitive) return;
    
    // Remove from scene
    this.sceneManager.removePrimitive(this.selectedPiece);
    
    // Remove from physics world
    this.physicsWorld.removePrimitive(this.selectedPiece);
    
    // Call callback
    if (this.onPieceRemoved) {
      this.onPieceRemoved(primitive);
    }
    
    // Update structure changed callback
    if (this.onStructureChanged) {
      this.onStructureChanged();
    }
    
    // Deselect
    this.deselectPiece();
  }

  /**
   * Deselect current piece
   */
  private deselectPiece(): void {
    if (this.selectedPiece) {
      this.highlightPiece(this.selectedPiece, false);
      this.selectedPiece = null;
      this.buildState.selectedPiece = null;
    }
  }

  /**
   * Highlight/unhighlight piece
   */
  private highlightPiece(primitiveId: string, highlight: boolean): void {
    const mesh = this.sceneManager.findMeshByPrimitiveId(primitiveId);
    if (mesh) {
      const material = mesh.material as THREE.MeshStandardMaterial;
      if (highlight) {
        material.emissive.setHex(0x555555);
      } else {
        material.emissive.setHex(0x000000);
      }
    }
  }

  /**
   * Update ghost piece
   */
  public updateGhostPiece(): void {
    const ghostPrimitive: GeometricPrimitive = {
      id: 'ghost',
      type: this.currentPieceType as any,
      position: new THREE.Vector3(0, 0, 0),
      rotation: new THREE.Euler(),
      scale: this.currentScale,
      color: this.getColorForMaterial(this.currentMaterial),
      material: this.currentMaterial as any,
      connectedTo: []
    };
    
    this.buildState.ghostPiece = ghostPrimitive;
    this.sceneManager.setGhostPiece(ghostPrimitive);
  }

  /**
   * Set piece type
   */
  public setPieceType(type: string): void {
    this.currentPieceType = type;
    this.updateGhostPiece();
  }

  /**
   * Set material
   */
  public setMaterial(material: string): void {
    this.currentMaterial = material;
    this.updateGhostPiece();
  }

  /**
   * Set scale
   */
  public setScale(scale: number): void {
    this.currentScale = scale;
    this.updateGhostPiece();
  }

  /**
   * Toggle snap
   */
  public toggleSnap(): void {
    this.buildState.snapEnabled = !this.buildState.snapEnabled;
  }

  /**
   * Toggle grid
   */
  public toggleGrid(): void {
    this.buildState.gridVisible = !this.buildState.gridVisible;
    this.sceneManager.toggleGrid(this.buildState.gridVisible);
  }

  /**
   * Undo last action
   */
  public undo(): void {
    if (this.buildState.undoStack.length > 0) {
      const lastState = this.buildState.undoStack.pop()!;
      this.buildState.redoStack.push(this.getCurrentStructureState());
      
      // Restore structure
      this.sceneManager.loadStructure(lastState);
      this.onStructureChanged?.();
    }
  }

  /**
   * Redo last action
   */
  public redo(): void {
    if (this.buildState.redoStack.length > 0) {
      const nextState = this.buildState.redoStack.pop()!;
      this.buildState.undoStack.push(this.getCurrentStructureState());
      
      // Restore structure
      this.sceneManager.loadStructure(nextState);
      this.onStructureChanged?.();
    }
  }

  /**
   * Start building mode
   */
  public startBuilding(): void {
    this.isBuilding = true;
    this.sceneManager.toggleGrid(true);
    this.updateGhostPiece();
  }

  /**
   * Stop building mode
   */
  public stopBuilding(): void {
    this.isBuilding = false;
    this.sceneManager.setGhostPiece(null);
    this.deselectPiece();
  }

  /**
   * Set active structure
   */
  public setActiveStructure(structure: any): void {
    // This would be implemented when we have the full structure system
  }

  /**
   * Update method called each frame
   */
  public update(deltaTime: number): void {
    // Handle any continuous updates
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    // Remove event listeners
    window.removeEventListener('mousemove', this.onMouseMove.bind(this));
    window.removeEventListener('mousedown', this.onMouseDown.bind(this));
    window.removeEventListener('mouseup', this.onMouseUp.bind(this));
    window.removeEventListener('click', this.onClick.bind(this));
    window.removeEventListener('keydown', this.onKeyDown.bind(this));
    
    // Remove drag plane
    this.sceneManager.getScene().remove(this.dragPlane);
    this.dragPlane.geometry.dispose();
    
    console.log('🧹 BuildMode disposed');
  }

  // Helper methods
  private generateId(): string {
    return 'piece_' + Math.random().toString(36).substr(2, 9);
  }

  private getColorForMaterial(material: string): string {
    switch (material) {
      case 'wood': return '#8B4513';
      case 'metal': return '#C0C0C0';
      case 'crystal': return '#00FFFF';
      case 'quantum': return '#FF00FF';
      default: return '#FFFFFF';
    }
  }

  private getPrimitiveById(id: string): GeometricPrimitive | null {
    // This would be implemented when we have the full structure system
    return null;
  }

  private getCurrentStructureState(): any {
    // This would be implemented when we have the full structure system
    return {};
  }

  // Getters
  public getBuildState(): BuildState {
    return this.buildState;
  }

  public getCurrentPieceType(): string {
    return this.currentPieceType;
  }

  public getCurrentMaterial(): string {
    return this.currentMaterial;
  }

  public getCurrentScale(): number {
    return this.currentScale;
  }

  public isSnapEnabled(): boolean {
    return this.buildState.snapEnabled;
  }

  public isGridVisible(): boolean {
    return this.buildState.gridVisible;
  }
}