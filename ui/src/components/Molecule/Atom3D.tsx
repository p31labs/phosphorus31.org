/**
 * Atom 3D Component
 * Renders a single atom in 3D space
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Mesh, Vector3 } from 'three';
import { Atom } from '../../types/molecule';
import { getElementProperties as getProps } from '../../utils/moleculeBuilder';
import { useAccessibilityStore } from '../../stores/accessibility.store';

interface Atom3DProps {
  atom: Atom;
  selected?: boolean;
  showLabel?: boolean;
  showQuantum?: boolean;
  onClick?: (atom: Atom) => void;
}

export const Atom3D: React.FC<Atom3DProps> = ({
  atom,
  selected = false,
  showLabel = false,
  showQuantum = false,
  onClick,
}) => {
  const meshRef = useRef<Mesh>(null);
  const { animationReduced } = useAccessibilityStore();
  const props = getProps(atom.element);
  const position = new Vector3(atom.position.x, atom.position.y, atom.position.z);

  // Quantum coherence visualization (pulsing for P31)
  useFrame((state) => {
    if (meshRef.current && showQuantum && atom.element === 'P31' && atom.coherence) {
      if (!animationReduced) {
        const pulse = Math.sin(state.clock.elapsedTime * 2) * 0.15 + 1;
        meshRef.current.scale.setScalar(props.radius * pulse);
      }
      // Emissive intensity based on coherence
      if (meshRef.current.material) {
        (meshRef.current.material as any).emissiveIntensity = atom.coherence * 0.8;
      }
    }
  });

  const handleClick = () => {
    if (onClick) {
      onClick(atom);
    }
  };

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        if (onClick) {
          // Could emit hover event here
        }
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      <sphereGeometry args={[props.radius, 32, 32]} />
      <meshStandardMaterial
        color={props.color}
        emissive={
          selected ? props.color : atom.element === 'P31' && showQuantum ? props.color : '#000000'
        }
        emissiveIntensity={
          selected
            ? 0.8
            : atom.element === 'P31' && showQuantum && atom.coherence
              ? atom.coherence * 0.6
              : 0
        }
        metalness={atom.element === 'P31' ? 0.8 : 0.3}
        roughness={atom.element === 'P31' ? 0.2 : 0.7}
      />
      {showLabel && (
        <Html position={[0, props.radius + 0.5, 0]} center>
          <div
            style={{
              background: 'rgba(0, 0, 0, 0.8)',
              padding: '0.25rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: '#ffffff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              whiteSpace: 'nowrap',
            }}
          >
            {atom.element}
          </div>
        </Html>
      )}
      {showQuantum && atom.coherence !== undefined && atom.coherence > 0 && (
        <>
          {/* Coherence ring */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[props.radius * 1.2, props.radius * 1.3, 32]} />
            <meshStandardMaterial
              color="#00FFFF"
              transparent
              opacity={atom.coherence * 0.8}
              emissive="#00FFFF"
              emissiveIntensity={atom.coherence * 0.6}
              side={2} // DoubleSide
            />
          </mesh>
          {/* Additional quantum glow for P31 */}
          {atom.element === 'P31' && (
            <mesh>
              <sphereGeometry args={[props.radius * 1.5, 32, 32]} />
              <meshStandardMaterial
                color="#00FFFF"
                transparent
                opacity={atom.coherence * 0.2}
                emissive="#00FFFF"
                emissiveIntensity={atom.coherence * 0.3}
              />
            </mesh>
          )}
        </>
      )}
    </mesh>
  );
};
