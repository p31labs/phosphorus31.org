// ══════════════════════════════════════════════════════════════════════════════
// COHERENCE ORB
// Quantum state visualization using color gradients to represent coherence.
// Pulses differently based on coherence: slow/gentle when coherent, rapid/erratic when not.
// 8 Posner molecule satellites carry individual coherence values.
// ══════════════════════════════════════════════════════════════════════════════

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store.js';
import { SATELLITE_POSITIONS } from '../constants.js';

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

  // ── Animation Loop ─────────────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Pulse frequency: faster when decoherent
    const pulseFreq = coherence > 0.5 ? 1.5 : 4 + (1 - coherence) * 6;
    const pulseAmp = coherence > 0.5 ? 0.05 : 0.15;

    // ── Core Sphere ──────────────────────────────────────────────────────────
    if (coreRef.current) {
      // Scale animation
      const scale = 1 + Math.sin(t * pulseFreq) * pulseAmp * (1 - coherence);
      coreRef.current.scale.setScalar(scale);

      // Color: blue (coherent) → red (decoherent)
      const r = 0.2 + (1 - coherence) * 0.8;
      const g = 0.2 + coherence * 0.3;
      const b = 0.8 * coherence;
      coreRef.current.material.color.setRGB(r, g, b);
      coreRef.current.material.emissive.setRGB(r * 0.4, g * 0.4, b * 0.4);

      // Opacity increases in quantum regime (Q > 1)
      coreRef.current.material.opacity = qStatistic > 1 ? 0.9 : 0.7;
    }

    // ── Glow Torus ───────────────────────────────────────────────────────────
    if (glowRef.current) {
      glowRef.current.rotation.z = t * 0.5;
      
      const glowScale = 1.2 + coherence * 0.3;
      glowRef.current.scale.setScalar(glowScale);

      // Match core color with lower intensity
      const r = 0.2 + (1 - coherence) * 0.8;
      const g = 0.2 + coherence * 0.3;
      const b = 0.8 * coherence;
      glowRef.current.material.color.setRGB(r * 0.6, g * 0.6, b * 0.6);
      glowRef.current.material.opacity = 0.15 + coherence * 0.1;
    }

    // ── Satellites ───────────────────────────────────────────────────────────
    if (molecules.length > 0) {
      for (let i = 0; i < satelliteRefs.current.length; i++) {
        const sat = satelliteRefs.current[i];
        if (!sat) continue;

        const molCoherence = molecules[i] || 0.5;
        
        // Color: cyan (coherent) → amber (decoherent)
        const sr = 0.13 + (1 - molCoherence) * 0.85;
        const sg = 0.82 - (1 - molCoherence) * 0.35;
        const sb = 0.93 * molCoherence;
        sat.material.color.setRGB(sr, sg, sb);
        sat.material.opacity = 0.3 + molCoherence * 0.5;

        // Subtle individual pulse
        const satScale = 0.12 + Math.sin(t * (3 + i * 0.5)) * 0.02;
        sat.scale.setScalar(satScale);
      }
    }
  });

  return (
    <group position={[0, 3, 0]}>
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
