/**
 * Posner atom with 4D rotation (xw-plane) and coherence-driven glow
 */

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { PosnerAtom } from '../../../utils/posnerGeometry';

const VERTEX = `
  uniform vec3 uCenter;
  uniform float uPhaseOffset;
  uniform float uW;
  varying float vGlow;

  void main() {
    vec3 pos = position + uCenter;
    float w = uW;

    float cosA = cos(uPhaseOffset);
    float sinA = sin(uPhaseOffset);
    float x_rot = pos.x * cosA - w * sinA;
    vec3 rotatedPos = vec3(x_rot, pos.y, pos.z);

    gl_Position = projectionMatrix * viewMatrix * vec4(rotatedPos, 1.0);

    vGlow = 0.5 + 0.5 * sin(uPhaseOffset * 2.0);
  }
`;

const FRAGMENT = `
  uniform vec3 uColor;
  uniform float uCoherence;
  uniform float uIsSelected;
  uniform float uTime;
  varying float vGlow;

  void main() {
    vec3 base = mix(uColor, vec3(0.2, 0.8, 0.4), uCoherence * 0.6);
    vec3 finalColor = base;
    if (uIsSelected > 0.5) {
      float pulse = 0.5 + 0.5 * sin(uTime * 4.0);
      finalColor = mix(finalColor, vec3(1.0, 1.0, 0.6), pulse * 0.7);
    }
    float alpha = 0.92 + uCoherence * 0.08;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

interface PosnerAtom4DProps {
  atom: PosnerAtom;
  isSelected: boolean;
  coherence: number;
  phaseOffset: number;
  atomPhase?: number;
  onSelect: () => void;
}

export const PosnerAtom4D: React.FC<PosnerAtom4DProps> = ({
  atom,
  isSelected,
  coherence,
  phaseOffset,
  atomPhase = 0,
  onSelect,
}) => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const color =
    atom.element === 'Ca' ? '#ffaa00' : atom.element === 'P' ? '#22c55e' : '#60a5fa';
  const size = atom.element === 'Ca' ? 0.3 : atom.element === 'P' ? 0.22 : 0.14;
  const wValue =
    atom.element === 'Ca' ? 0.0 : atom.element === 'P' ? 0.5 + atomPhase * 0.2 : -0.5;

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.elapsedTime;
      materialRef.current.uniforms.uCoherence.value = coherence;
      materialRef.current.uniforms.uPhaseOffset.value = phaseOffset;
      materialRef.current.uniforms.uIsSelected.value = isSelected ? 1.0 : 0.0;
      materialRef.current.uniforms.uW.value = wValue;
    }
  });

  return (
    <group>
      <mesh
        position={[0, 0, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <sphereGeometry args={[size, 32, 16]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          uniforms={{
            uCenter: { value: new THREE.Vector3(...atom.position) },
            uColor: { value: new THREE.Color(color) },
            uTime: { value: 0 },
            uCoherence: { value: coherence },
            uPhaseOffset: { value: phaseOffset },
            uW: { value: wValue },
            uIsSelected: { value: isSelected ? 1.0 : 0.0 },
          }}
          transparent
          depthWrite={true}
        />
      </mesh>
    </group>
  );
};
