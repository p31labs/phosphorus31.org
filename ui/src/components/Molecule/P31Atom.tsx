/**
 * P31 Atom - Special rendering for the biological qubit
 * Enhanced quantum visualization
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3, Color } from 'three';
import { Atom } from '../../types/molecule';
import { getElementProperties } from '../../utils/moleculeBuilder';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import { QuantumCoherenceRing } from './QuantumCoherenceRing';

interface P31AtomProps {
  atom: Atom;
  selected?: boolean;
  showQuantum?: boolean;
  onClick?: (atom: Atom) => void;
}

export const P31Atom: React.FC<P31AtomProps> = ({
  atom,
  selected = false,
  showQuantum = true,
  onClick,
}) => {
  const meshRef = useRef<Mesh>(null);
  const glowRef = useRef<Mesh>(null);
  const { animationReduced } = useAccessibilityStore();
  const props = getElementProperties(atom.element);
  const position = new Vector3(atom.position.x, atom.position.y, atom.position.z);
  const coherence = atom.coherence || 1.0;

  // Quantum pulsing animation
  useFrame((state) => {
    if (!animationReduced && meshRef.current && showQuantum) {
      // Pulsing scale
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.2 + 1;
      meshRef.current.scale.setScalar(props.radius * pulse * coherence);

      // Rotating glow
      if (glowRef.current) {
        glowRef.current.rotation.y += 0.02;
        glowRef.current.rotation.x += 0.01;
      }
    }
  });

  const handleClick = () => {
    if (onClick) {
      onClick(atom);
    }
  };

  const baseColor = new Color(props.color);
  const quantumColor = new Color('#00FFFF');

  return (
    <group position={position}>
      {/* Main atom sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <sphereGeometry args={[props.radius, 64, 64]} />
        <meshStandardMaterial
          color={selected ? quantumColor : baseColor}
          emissive={selected ? quantumColor : showQuantum ? baseColor : new Color(0, 0, 0)}
          emissiveIntensity={selected ? 1.0 : showQuantum ? coherence * 0.8 : 0}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Quantum glow sphere */}
      {showQuantum && coherence > 0 && (
        <mesh ref={glowRef}>
          <sphereGeometry args={[props.radius * 1.8, 32, 32]} />
          <meshStandardMaterial
            color={quantumColor}
            transparent
            opacity={coherence * 0.15}
            emissive={quantumColor}
            emissiveIntensity={coherence * 0.4}
          />
        </mesh>
      )}

      {/* Quantum coherence rings */}
      {showQuantum && coherence > 0 && (
        <>
          <QuantumCoherenceRing
            radius={props.radius}
            coherence={coherence}
            phase={0}
            color="#00FFFF"
          />
          <QuantumCoherenceRing
            radius={props.radius * 1.3}
            coherence={coherence * 0.7}
            phase={Math.PI / 2}
            color="#FF00FF"
          />
        </>
      )}

      {/* Selection highlight */}
      {selected && (
        <mesh>
          <sphereGeometry args={[props.radius * 1.1, 32, 32]} />
          <meshStandardMaterial
            color="#FFFF00"
            transparent
            opacity={0.3}
            emissive="#FFFF00"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}
    </group>
  );
};
