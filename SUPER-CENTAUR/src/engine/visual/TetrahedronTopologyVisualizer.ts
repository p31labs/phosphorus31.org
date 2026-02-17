/**
 * Tetrahedron Topology Visualizer
 * Visualizes the tetrahedron topology of structures
 */

import * as THREE from 'three';
import { Structure, GeometricPrimitive } from '../types/game';

export class TetrahedronTopologyVisualizer {
  private scene: THREE.Scene;
  private topologyLines: THREE.Line[] = [];
  private vertexMarkers: THREE.Mesh[] = [];
  private edgeMarkers: THREE.Line[] = [];
  private faceMarkers: THREE.Mesh[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  /**
   * Initialize visualizer
   */
  public init(): void {
    console.log('🔺 Tetrahedron Topology Visualizer initialized');
  }

  /**
   * Visualize tetrahedron topology for a structure
   */
  public visualizeTopology(structure: Structure): void {
    this.clearVisualization();

    // Find tetrahedron groups (4 vertices forming a tetrahedron)
    const tetrahedra = this.findTetrahedra(structure);

    // Visualize each tetrahedron
    tetrahedra.forEach((tetra, index) => {
      this.visualizeTetrahedron(tetra, index);
    });

    // Visualize connections between tetrahedra
    this.visualizeConnections(tetrahedra);
  }

  /**
   * Find tetrahedron groups in structure
   */
  private findTetrahedra(structure: Structure): THREE.Vector3[][] {
    const tetrahedra: THREE.Vector3[][] = [];
    const primitives = structure.primitives;

    // Group primitives by proximity (simplified - in reality would use graph analysis)
    const groups: GeometricPrimitive[][] = [];
    const processed = new Set<string>();

    primitives.forEach((primitive) => {
      if (processed.has(primitive.id)) return;

      const group = [primitive];
      processed.add(primitive.id);

      // Find connected primitives
      this.findConnectedGroup(primitive, primitives, group, processed);

      // If group has 4 vertices, it's a tetrahedron
      if (group.length === 4) {
        tetrahedra.push(group.map(p => p.position.clone()));
      }
    });

    return tetrahedra;
  }

  /**
   * Find connected group of primitives
   */
  private findConnectedGroup(
    start: GeometricPrimitive,
    all: GeometricPrimitive[],
    group: GeometricPrimitive[],
    processed: Set<string>
  ): void {
    start.connectedTo.forEach((connectedId) => {
      const connected = all.find(p => p.id === connectedId);
      if (connected && !processed.has(connected.id) && group.length < 4) {
        group.push(connected);
        processed.add(connected.id);
        this.findConnectedGroup(connected, all, group, processed);
      }
    });
  }

  /**
   * Visualize a single tetrahedron
   */
  private visualizeTetrahedron(vertices: THREE.Vector3[], index: number): void {
    if (vertices.length !== 4) return;

    const color = this.getTetrahedronColor(index);

    // Draw edges (6 edges in a tetrahedron)
    const edges = [
      [0, 1], [0, 2], [0, 3],
      [1, 2], [1, 3], [2, 3]
    ];

    edges.forEach(([i, j]) => {
      const geometry = new THREE.BufferGeometry().setFromPoints([
        vertices[i],
        vertices[j]
      ]);
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.6,
        linewidth: 2
      });
      const line = new THREE.Line(geometry, material);
      this.scene.add(line);
      this.edgeMarkers.push(line);
    });

    // Mark vertices
    vertices.forEach((vertex) => {
      const geometry = new THREE.SphereGeometry(0.1, 16, 16);
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.8
      });
      const marker = new THREE.Mesh(geometry, material);
      marker.position.copy(vertex);
      this.scene.add(marker);
      this.vertexMarkers.push(marker);
    });

    // Draw faces (4 faces in a tetrahedron)
    const faces = [
      [0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3]
    ];

    faces.forEach((indices) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(
        indices.map(i => vertices[i])
      );
      const material = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.1,
        side: THREE.DoubleSide
      });
      const face = new THREE.Mesh(geometry, material);
      this.scene.add(face);
      this.faceMarkers.push(face);
    });
  }

  /**
   * Visualize connections between tetrahedra
   */
  private visualizeConnections(tetrahedra: THREE.Vector3[][]): void {
    // Find centers of each tetrahedron
    const centers = tetrahedra.map(vertices => {
      const center = new THREE.Vector3();
      vertices.forEach(v => center.add(v));
      center.divideScalar(vertices.length);
      return center;
    });

    // Draw connections between adjacent tetrahedra
    for (let i = 0; i < centers.length; i++) {
      for (let j = i + 1; j < centers.length; j++) {
        const distance = centers[i].distanceTo(centers[j]);
        if (distance < 2) { // Adjacent if close enough
          const geometry = new THREE.BufferGeometry().setFromPoints([
            centers[i],
            centers[j]
          ]);
          const material = new THREE.LineDashedMaterial({
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.3,
            dashSize: 0.1,
            gapSize: 0.1
          });
          const line = new THREE.Line(geometry, material);
          line.computeLineDistances();
          this.scene.add(line);
          this.topologyLines.push(line);
        }
      }
    }
  }

  /**
   * Get color for tetrahedron (cycle through colors)
   */
  private getTetrahedronColor(index: number): number {
    const colors = [
      0xFF69B4, // Pink
      0x87CEEB, // Sky Blue
      0x98FB98, // Pale Green
      0xFFD700, // Gold
      0xFF6347, // Tomato
      0x9370DB  // Medium Purple
    ];
    return colors[index % colors.length];
  }

  /**
   * Clear all visualization
   */
  public clearVisualization(): void {
    this.topologyLines.forEach(line => this.scene.remove(line));
    this.vertexMarkers.forEach(marker => this.scene.remove(marker));
    this.edgeMarkers.forEach(edge => this.scene.remove(edge));
    this.faceMarkers.forEach(face => this.scene.remove(face));

    this.topologyLines = [];
    this.vertexMarkers = [];
    this.edgeMarkers = [];
    this.faceMarkers = [];
  }

  /**
   * Toggle topology visualization
   */
  public toggle(visible: boolean): void {
    this.topologyLines.forEach(line => line.visible = visible);
    this.vertexMarkers.forEach(marker => marker.visible = visible);
    this.edgeMarkers.forEach(edge => edge.visible = visible);
    this.faceMarkers.forEach(face => face.visible = visible);
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    this.clearVisualization();
  }
}
