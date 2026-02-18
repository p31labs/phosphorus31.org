// ══════════════════════════════════════════════════════════════════════════════
// HOLOGRAM
// Tetrahedron Protocol visualization around the voxel world.
// Outer wireframe tetrahedron (structural shield), inner icosahedron (cognitive core).
// Rotation follows Fuller's 1/3 invariant pattern.
// ══════════════════════════════════════════════════════════════════════════════

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store.js';

// ── Pre-computed Axis Buffers (module scope) ─────────────────────────────────
const AXIS_X = new Float32Array([0, 0, 0, 6, 0, 0]);
const AXIS_Y = new Float32Array([0, 0, 0, 0, 6, 0]);
const AXIS_Z = new Float32Array([0, 0, 0, 0, 0, 6]);

/**
 * Hologram - Tetrahedron Protocol visualization
 * @param {number} voltage - System voltage (0-100)
 */
export default function Hologram({ voltage }) {
  const tetraRef = useRef();
  const icoRef = useRef();

  const vpiPhase = useStore((s) => s.vpiPhase);
  const coherence = useStore((s) => s.coherence);

  // ── Derive Colors ──────────────────────────────────────────────────────────
  let tetraColor, icoColor;
  
  if (voltage > 80) {
    // High voltage alert
    tetraColor = '#ef4444';
    icoColor = '#ef4444';
  } else if (coherence < 0.3) {
    // Low coherence warning
    tetraColor = '#fbbf24';
    icoColor = '#fbbf24';
  } else if (vpiPhase === 'CURE') {
    // Cured state
    tetraColor = '#4ade80';
    icoColor = '#4ade80';
  } else {
    // Normal operation
    tetraColor = '#fbbf24';
    icoColor = '#22d3ee';
  }

  // ── Animation Loop ─────────────────────────────────────────────────────────
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Tetrahedron rotation - Fuller's 1/3 invariant pattern
    if (tetraRef.current) {
      tetraRef.current.rotation.x = t * 0.33;
      tetraRef.current.rotation.y = t * 0.17;
      tetraRef.current.rotation.z = t * 0.07;

      // Breathing effect based on voltage
      const breathFreq = 1 + (voltage / 100) * 2;
      const breathAmp = 0.02 + (voltage / 100) * 0.03;
      const scale = 1 + Math.sin(t * breathFreq) * breathAmp;
      tetraRef.current.scale.setScalar(scale);
    }

    // Icosahedron counter-rotation
    if (icoRef.current) {
      icoRef.current.rotation.x = -t * 0.21;
      icoRef.current.rotation.y = t * 0.13;
      icoRef.current.rotation.z = -t * 0.09;

      // Scale based on coherence
      const icoScale = 0.8 + coherence * 0.2;
      icoRef.current.scale.setScalar(icoScale);
    }
  });

  // ── Calculate Opacity ──────────────────────────────────────────────────────
  const icoOpacity = 0.08 + coherence * 0.12;

  return (
    <group position={[0, 5, 0]}>
      {/* Outer Tetrahedron - Structural Shield */}
      <mesh ref={tetraRef}>
        <tetrahedronGeometry args={[8, 0]} />
        <meshBasicMaterial
          color={tetraColor}
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>

      {/* Inner Icosahedron - Cognitive Core */}
      <mesh ref={icoRef}>
        <icosahedronGeometry args={[4, 0]} />
        <meshBasicMaterial
          color={icoColor}
          wireframe
          transparent
          opacity={icoOpacity}
        />
      </mesh>

      {/* Axis Markers */}
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={AXIS_X}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#22d3ee" transparent opacity={0.12} />
      </line>
      
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={AXIS_Y}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#fbbf24" transparent opacity={0.12} />
      </line>
      
      <line>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={2}
            array={AXIS_Z}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#a78bfa" transparent opacity={0.12} />
      </line>
    </group>
  );
}
