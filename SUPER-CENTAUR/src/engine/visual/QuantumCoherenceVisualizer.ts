/**
 * Quantum Coherence Visualizer
 * Visual effects for quantum coherence visualization
 */

import * as THREE from 'three';
import { GeometricPrimitive } from '../types/game';

export class QuantumCoherenceVisualizer {
  private scene: THREE.Scene;
  private coherenceMeshes: Map<string, THREE.Mesh> = new Map();
  private particleSystems: Map<string, THREE.Points> = new Map();
  private ringMeshes: Map<string, THREE.Mesh[]> = new Map();
  private glowMeshes: Map<string, THREE.Mesh> = new Map();

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  /**
   * Initialize visualizer
   */
  public init(): void {
    console.log('✨ Quantum Coherence Visualizer initialized');
  }

  /**
   * Update quantum coherence visuals for a piece
   */
  public updatePieceVisuals(
    piece: GeometricPrimitive,
    coherence: number,
    position: THREE.Vector3
  ): void {
    if (piece.material !== 'quantum' || !piece.quantumState) {
      this.removePieceVisuals(piece.id);
      return;
    }

    // Create or update coherence ring
    this.updateCoherenceRing(piece.id, coherence, position);

    // Create or update quantum particles
    this.updateQuantumParticles(piece.id, coherence, position);

    // Create or update glow effect
    this.updateGlowEffect(piece.id, coherence, position);

    // Update entanglement visualization
    if (piece.quantumState.entanglement.length > 0) {
      this.updateEntanglementVisuals(piece, coherence);
    }
  }

  /**
   * Update coherence ring (rotating ring around piece)
   */
  private updateCoherenceRing(
    pieceId: string,
    coherence: number,
    position: THREE.Vector3
  ): void {
    // Remove existing rings
    const existingRings = this.ringMeshes.get(pieceId) || [];
    existingRings.forEach(ring => this.scene.remove(ring));
    this.ringMeshes.delete(pieceId);

    if (coherence < 0.1) return; // Don't show if too low

    const rings: THREE.Mesh[] = [];

    // Outer ring (cyan)
    const outerRing = this.createRing(
      position,
      coherence * 0.8 + 0.5, // Scale based on coherence
      0x00FFFF, // Cyan
      coherence
    );
    rings.push(outerRing);
    this.scene.add(outerRing);

    // Inner ring (magenta) - only if coherence is high
    if (coherence > 0.5) {
      const innerRing = this.createRing(
        position,
        coherence * 0.5 + 0.3,
        0xFF00FF, // Magenta
        coherence * 0.8
      );
      rings.push(innerRing);
      this.scene.add(innerRing);
    }

    this.ringMeshes.set(pieceId, rings);
  }

  /**
   * Create a rotating ring
   */
  private createRing(
    position: THREE.Vector3,
    radius: number,
    color: number,
    opacity: number
  ): THREE.Mesh {
    const geometry = new THREE.RingGeometry(radius * 0.9, radius, 64);
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: opacity * 0.6,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });

    const ring = new THREE.Mesh(geometry, material);
    ring.position.copy(position);
    ring.rotation.x = Math.PI / 2; // Horizontal ring

    // Animate rotation
    const animate = () => {
      ring.rotation.z += 0.01;
      requestAnimationFrame(animate);
    };
    animate();

    return ring;
  }

  /**
   * Update quantum particles around piece
   */
  private updateQuantumParticles(
    pieceId: string,
    coherence: number,
    position: THREE.Vector3
  ): void {
    // Remove existing particles
    const existing = this.particleSystems.get(pieceId);
    if (existing) {
      this.scene.remove(existing);
      this.particleSystems.delete(pieceId);
    }

    if (coherence < 0.2) return;

    const particleCount = Math.floor(coherence * 30); // 0-30 particles
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.5 + Math.random() * 0.5;
      const height = (Math.random() - 0.5) * 1;

      positions[i * 3] = position.x + Math.cos(angle) * radius;
      positions[i * 3 + 1] = position.y + height;
      positions[i * 3 + 2] = position.z + Math.sin(angle) * radius;

      // Color based on coherence (cyan to magenta gradient)
      const colorMix = Math.random();
      colors[i * 3] = colorMix < 0.5 ? 0 : 1; // R
      colors[i * 3 + 1] = 1; // G
      colors[i * 3 + 2] = colorMix < 0.5 ? 1 : 1; // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: coherence,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    this.scene.add(particles);
    this.particleSystems.set(pieceId, particles);

    // Animate particles
    this.animateParticles(particles, position, coherence);
  }

  /**
   * Animate quantum particles
   */
  private animateParticles(
    particles: THREE.Points,
    center: THREE.Vector3,
    coherence: number
  ): void {
    const positions = particles.geometry.attributes.position.array as Float32Array;
    const time = performance.now() * 0.001;

    for (let i = 0; i < positions.length; i += 3) {
      const index = i / 3;
      const angle = (index / (positions.length / 3)) * Math.PI * 2;
      const radius = 0.5 + Math.sin(time + index) * 0.2;
      const height = Math.sin(time * 2 + index) * 0.5;

      positions[i] = center.x + Math.cos(angle + time) * radius;
      positions[i + 1] = center.y + height;
      positions[i + 2] = center.z + Math.sin(angle + time) * radius;
    }

    particles.geometry.attributes.position.needsUpdate = true;

    requestAnimationFrame(() => this.animateParticles(particles, center, coherence));
  }

  /**
   * Update glow effect
   */
  private updateGlowEffect(
    pieceId: string,
    coherence: number,
    position: THREE.Vector3
  ): void {
    // Remove existing glow
    const existing = this.glowMeshes.get(pieceId);
    if (existing) {
      this.scene.remove(existing);
      this.glowMeshes.delete(pieceId);
    }

    if (coherence < 0.3) return;

    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshBasicMaterial({
      color: 0x00FFFF,
      transparent: true,
      opacity: coherence * 0.3,
      blending: THREE.AdditiveBlending
    });

    const glow = new THREE.Mesh(geometry, material);
    glow.position.copy(position);
    this.scene.add(glow);
    this.glowMeshes.set(pieceId, glow);

    // Pulse animation
    this.animateGlow(glow, coherence);
  }

  /**
   * Animate glow pulsing
   */
  private animateGlow(glow: THREE.Mesh, coherence: number): void {
    const time = performance.now() * 0.001;
    const pulse = 1 + Math.sin(time * 2) * 0.2;
    glow.scale.setScalar(pulse);
    
    const material = glow.material as THREE.MeshBasicMaterial;
    material.opacity = coherence * 0.3 * (0.7 + Math.sin(time * 3) * 0.3);

    requestAnimationFrame(() => this.animateGlow(glow, coherence));
  }

  /**
   * Update entanglement visualization (lines between entangled pieces)
   */
  private updateEntanglementVisuals(
    piece: GeometricPrimitive,
    coherence: number
  ): void {
    if (!piece.quantumState || piece.quantumState.entanglement.length === 0) return;

    // This would require access to other pieces' positions
    // For now, we'll handle this in the main update loop
  }

  /**
   * Draw entanglement line between two pieces
   */
  public drawEntanglementLine(
    pieceId1: string,
    position1: THREE.Vector3,
    pieceId2: string,
    position2: THREE.Vector3,
    coherence: number
  ): void {
    const lineId = `${pieceId1}_${pieceId2}`;

    // Remove existing line
    const existing = this.scene.getObjectByName(lineId);
    if (existing) {
      this.scene.remove(existing);
    }

    if (coherence < 0.2) return;

    const geometry = new THREE.BufferGeometry().setFromPoints([position1, position2]);
    const material = new THREE.LineBasicMaterial({
      color: 0xFF00FF,
      transparent: true,
      opacity: coherence * 0.5,
      blending: THREE.AdditiveBlending
    });

    const line = new THREE.Line(geometry, material);
    line.name = lineId;
    this.scene.add(line);
  }

  /**
   * Remove visuals for a piece
   */
  public removePieceVisuals(pieceId: string): void {
    // Remove rings
    const rings = this.ringMeshes.get(pieceId) || [];
    rings.forEach(ring => this.scene.remove(ring));
    this.ringMeshes.delete(pieceId);

    // Remove particles
    const particles = this.particleSystems.get(pieceId);
    if (particles) {
      this.scene.remove(particles);
      this.particleSystems.delete(pieceId);
    }

    // Remove glow
    const glow = this.glowMeshes.get(pieceId);
    if (glow) {
      this.scene.remove(glow);
      this.glowMeshes.delete(pieceId);
    }
  }

  /**
   * Update all visuals (called from game loop)
   */
  public update(deltaTime: number, pieces: GeometricPrimitive[]): void {
    pieces.forEach((piece) => {
      if (piece.material === 'quantum' && piece.quantumState) {
        const coherence = piece.quantumState.coherence;
        this.updatePieceVisuals(piece, coherence, piece.position);
      }
    });
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    // Remove all visuals
    this.ringMeshes.forEach(rings => rings.forEach(ring => this.scene.remove(ring)));
    this.particleSystems.forEach(particles => this.scene.remove(particles));
    this.glowMeshes.forEach(glow => this.scene.remove(glow));

    this.ringMeshes.clear();
    this.particleSystems.clear();
    this.glowMeshes.clear();
  }
}
