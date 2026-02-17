// ══════════════════════════════════════════════════════════════════════════════
// COHERENCE ORB
// Quantum state visualization using color gradients to represent coherence.
// Pulses differently based on coherence: slow/gentle when coherent, rapid/erratic when not.
// 8 Posner molecule satellites carry individual coherence values.
// ══════════════════════════════════════════════════════════════════════════════

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../../store.js';
import { SATELLITE_POSITIONS } from '../../constants.js';

/**
 * CoherenceOrb - Central quantum state indicator
 */
export default function CoherenceOrb() {
  const coreRef = useRef();
  const glowRef = useRef();
  const satelliteRefs = useRef([]);

  const coherence = useStore((s) => s.coherence);
  const qStatistic = useStore((s) => s.qStatistic);
  const molecules = useStore((s) => s.molecules);

  // ── Animation Loop: ONE animation at a time (core pulse only) ───────────────
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Single dominant animation: core pulse (frequency/amplitude by coherence)
    const pulseFreq = coherence > 0.5 ? 1.2 : 3 + (1 - coherence) * 4;
    const pulseAmp = coherence > 0.5 ? 0.06 : 0.12;

    // ── Core Sphere (only animated element) ───────────────────────────────────
    if (coreRef.current) {
      const scale = 1 + Math.sin(t * pulseFreq) * pulseAmp * (1 - coherence);
      coreRef.current.scale.setScalar(scale);

      const r = 0.2 + (1 - coherence) * 0.8;
      const g = 0.2 + coherence * 0.3;
      const b = 0.8 * coherence;
      coreRef.current.material.color.setRGB(r, g, b);
      coreRef.current.material.emissive.setRGB(r * 0.4, g * 0.4, b * 0.4);
      coreRef.current.material.opacity = qStatistic > 1 ? 0.9 : 0.7;
    }

    // ── Glow Torus: static (no rotation), color only ───────────────────────────
    if (glowRef.current) {
      const r = 0.2 + (1 - coherence) * 0.8;
      const g = 0.2 + coherence * 0.3;
      const b = 0.8 * coherence;
      glowRef.current.material.color.setRGB(r * 0.6, g * 0.6, b * 0.6);
      glowRef.current.material.opacity = 0.12 + coherence * 0.08;
    }

    // ── Satellites: static scale, color only ───────────────────────────────────
    if (molecules.length > 0) {
      for (let i = 0; i < satelliteRefs.current.length; i++) {
        const sat = satelliteRefs.current[i];
        if (!sat) continue;
        const molCoherence = molecules[i] || 0.5;
        const sr = 0.13 + (1 - molCoherence) * 0.85;
        const sg = 0.82 - (1 - molCoherence) * 0.35;
        const sb = 0.93 * molCoherence;
        sat.material.color.setRGB(sr, sg, sb);
        sat.material.opacity = 0.3 + molCoherence * 0.5;
      }
    }
  });

  // Larger centerpiece: scale 2.2, centered at y=2
  return (
    <group position={[0, 2, 0]} scale={2.2}>
      {/* Core Sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial
          transparent
          opacity={0.7}
          metalness={0.6}
          roughness={0.2}
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Equatorial Glow */}
      <mesh ref={glowRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.7, 0.08, 16, 48]} />
        <meshBasicMaterial
          transparent
          opacity={0.2}
        />
      </mesh>

      {/* Posner Molecule Satellites */}
      {SATELLITE_POSITIONS.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => (satelliteRefs.current[i] = el)}
          position={pos}
        >
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
}
