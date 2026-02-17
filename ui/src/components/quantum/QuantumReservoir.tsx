/**
 * QUANTUM RESERVOIR - Posner Molecule State Visualization
 * 
 * Visualizes quantum coherence through Ca₉(PO₄)₆ cluster states:
 * 
 * State A: Quantum Fluid (High Spoons)
 * - Ca₉(PO₄)₆ clusters < 50nm, stabilized by ⁶Li environment
 * - Flowing Electric Teal particles, smooth laminar motion
 * - Indicates: High coherence, high executive function capacity
 * 
 * State B: Mineral Collapse (Low Spoons)
 * - Clusters > 500nm, decoherence via ⁷Li, bone-like aggregation
 * - Clumping Industrial Orange masses, jagged sluggish motion
 * - Indicates: Brain fog, burnout, metabolic crisis
 * 
 * Ontological Volume: Vₒ = (C × N² / σᵢ) × Φ
 * Where C = Coherence, N² = Network Power, σᵢ = Impedance, Φ = Golden Ratio
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMetabolism } from '../../hooks/useMetabolism';

interface QuantumReservoirProps {
  particleCount?: number;
  coherence?: number; // 0.0 to 1.0 - manual coherence override
  autoCoherence?: boolean; // Auto-calculate from spoon level
}

const PHI = (1 + Math.sqrt(5)) / 2; // Golden Ratio

export function QuantumReservoir({
  particleCount = 2000,
  coherence: manualCoherence,
  autoCoherence = true,
}: QuantumReservoirProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const { metabolism } = useMetabolism();

  // Calculate coherence from spoon level
  const coherence = useMemo(() => {
    if (!autoCoherence && manualCoherence !== undefined) {
      return Math.max(0, Math.min(1, manualCoherence));
    }

    if (!metabolism) return 0.5;

    // Map spoon level to coherence (0.0 = decoherent, 1.0 = fully coherent)
    const spoonRatio = metabolism.currentSpoons / metabolism.maxSpoons;
    return Math.max(0, Math.min(1, spoonRatio));
  }, [autoCoherence, manualCoherence, metabolism]);

  // Determine state: quantum fluid (coherent) vs mineral collapse (decoherent)
  const isQuantumFluid = coherence > 0.5;
  const clusterSize = isQuantumFluid ? 0.5 : 5.0; // < 50nm vs > 500nm (scaled)

  // Initialize particles
  const { positions, velocities, colors } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const vel = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);

    const seededRandom = (seed: number) => {
      const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
      return x - Math.floor(x);
    };

    for (let i = 0; i < particleCount; i++) {
      // Spherical distribution with golden angle
      const theta = (Math.PI * 2 * i) / PHI;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / particleCount);
      const r = 3 + seededRandom(i * PHI) * 2;

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Initial velocities (laminar for fluid, random for collapse)
      if (isQuantumFluid) {
        vel[i * 3] = (seededRandom(i * 1.1) - 0.5) * 0.02;
        vel[i * 3 + 1] = (seededRandom(i * 2.2) - 0.5) * 0.02;
        vel[i * 3 + 2] = (seededRandom(i * 3.3) - 0.5) * 0.02;
      } else {
        vel[i * 3] = (seededRandom(i * 1.1) - 0.5) * 0.005;
        vel[i * 3 + 1] = (seededRandom(i * 2.2) - 0.5) * 0.005;
        vel[i * 3 + 2] = (seededRandom(i * 3.3) - 0.5) * 0.005;
      }

      // Colors: Electric Teal for fluid, Industrial Orange for collapse
      if (isQuantumFluid) {
        col[i * 3] = 0.0; // R
        col[i * 3 + 1] = 0.9; // G
        col[i * 3 + 2] = 1.0; // B (Electric Teal)
      } else {
        col[i * 3] = 0.65; // R
        col[i * 3 + 1] = 0.33; // G
        col[i * 3 + 2] = 0.22; // B (Industrial Orange #A65538)
      }
    }

    return { positions: pos, velocities: vel, colors: col };
  }, [particleCount, isQuantumFluid]);

  // Store velocities in ref to persist across frames
  const velocitiesRef = useRef<Float32Array>(velocities);

  // Initialize velocities ref
  if (velocitiesRef.current.length !== velocities.length) {
    velocitiesRef.current = velocities;
  }

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      if (isQuantumFluid) {
        // Quantum Fluid: Smooth laminar motion with coherence
        // Particles flow smoothly, interconnected
        const flowSpeed = 0.02 * coherence;
        positions[i3] += Math.sin(time + i * 0.1) * flowSpeed;
        positions[i3 + 1] += Math.cos(time + i * 0.1) * flowSpeed;
        positions[i3 + 2] += Math.sin(time * 0.5 + i * 0.05) * flowSpeed * 0.5;

        // Keep particles in bounds
        const dist = Math.sqrt(
          positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2
        );
        if (dist > 10) {
          const scale = 10 / dist;
          positions[i3] *= scale;
          positions[i3 + 1] *= scale;
          positions[i3 + 2] *= scale;
        }
      } else {
        // Mineral Collapse: Clumping, jagged, sluggish motion
        // Particles aggregate into larger clusters
        const collapseSpeed = 0.005 * (1 - coherence);
        positions[i3] += (Math.random() - 0.5) * collapseSpeed;
        positions[i3 + 1] += (Math.random() - 0.5) * collapseSpeed;
        positions[i3 + 2] += (Math.random() - 0.5) * collapseSpeed;

        // Attraction to center (aggregation)
        const dist = Math.sqrt(
          positions[i3] ** 2 + positions[i3 + 1] ** 2 + positions[i3 + 2] ** 2
        );
        if (dist > 0.1) {
          const attraction = 0.001 * (1 - coherence);
          positions[i3] -= (positions[i3] / dist) * attraction;
          positions[i3 + 1] -= (positions[i3 + 1] / dist) * attraction;
          positions[i3 + 2] -= (positions[i3 + 2] / dist) * attraction;
        }
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={isQuantumFluid ? 0.05 : clusterSize * 0.1}
        vertexColors
        transparent
        opacity={isQuantumFluid ? 0.8 : 0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
