/**
 * Visual Effects Manager for Game Engine
 * Enhanced visual effects and particle systems
 */

import * as THREE from 'three';

export class VisualEffects {
  private particleSystem: THREE.Points | null = null;
  private particleGeometry: THREE.BufferGeometry | null = null;
  private particleMaterial: THREE.PointsMaterial | null = null;
  private particleCount: number = 1000;
  private scene: THREE.Scene;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
  }

  /**
   * Create particle system for structure validation
   */
  public createValidationParticles(position: THREE.Vector3, isValid: boolean): void {
    if (this.particleSystem) {
      this.scene.remove(this.particleSystem);
      this.particleGeometry?.dispose();
      this.particleMaterial?.dispose();
    }

    const particles = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const color = isValid ? new THREE.Color(0x00ff00) : new THREE.Color(0xff0000);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      
      // Position particles around the validation point
      particles[i3] = position.x + (Math.random() - 0.5) * 2;
      particles[i3 + 1] = position.y + (Math.random() - 0.5) * 2;
      particles[i3 + 2] = position.z + (Math.random() - 0.5) * 2;

      // Color
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }

    this.particleGeometry = new THREE.BufferGeometry();
    this.particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
    this.particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    this.particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });

    this.particleSystem = new THREE.Points(this.particleGeometry, this.particleMaterial);
    this.scene.add(this.particleSystem);

    // Animate particles
    this.animateParticles();
  }

  /**
   * Animate particles
   */
  private animateParticles(): void {
    if (!this.particleSystem || !this.particleGeometry) return;

    const positions = this.particleGeometry.attributes.position.array as Float32Array;
    const time = Date.now() * 0.001;

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      positions[i3 + 1] += Math.sin(time + i) * 0.01;
    }

    this.particleGeometry.attributes.position.needsUpdate = true;
  }

  /**
   * Create connection line between pieces
   */
  public createConnectionLine(
    start: THREE.Vector3,
    end: THREE.Vector3,
    color: number = 0x00ff00
  ): THREE.Line {
    const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    const material = new THREE.LineBasicMaterial({ color, linewidth: 2 });
    return new THREE.Line(geometry, material);
  }

  /**
   * Create highlight effect for selected piece
   */
  public createHighlight(mesh: THREE.Mesh): THREE.Mesh {
    const highlightGeometry = mesh.geometry.clone();
    const highlightMaterial = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.3
    });
    
    const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
    highlight.scale.multiplyScalar(1.1);
    highlight.position.copy(mesh.position);
    highlight.rotation.copy(mesh.rotation);
    
    return highlight;
  }

  /**
   * Create success effect
   */
  public createSuccessEffect(position: THREE.Vector3): void {
    // Create expanding ring effect
    const ringGeometry = new THREE.RingGeometry(0.5, 1, 32);
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.copy(position);
    ring.rotation.x = -Math.PI / 2;
    this.scene.add(ring);

    // Animate and remove
    let scale = 1;
    const animate = () => {
      scale += 0.1;
      ring.scale.setScalar(scale);
      ringMaterial.opacity -= 0.02;
      
      if (ringMaterial.opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        this.scene.remove(ring);
        ringGeometry.dispose();
        ringMaterial.dispose();
      }
    };
    animate();
  }

  /**
   * Dispose resources
   */
  public dispose(): void {
    if (this.particleSystem) {
      this.scene.remove(this.particleSystem);
      this.particleGeometry?.dispose();
      this.particleMaterial?.dispose();
      this.particleSystem = null;
    }
  }
}
