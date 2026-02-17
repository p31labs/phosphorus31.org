/**
 * Voltage Icosahedron — The "Buffer" in 3D
 *
 * Reacts to voltage: low = slow, green, gentle; high = fast, red, jitter.
 * For MATA demo: scrubbing the timeline drives voltage and this geometry.
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { P31 } from '@p31/config';
import { useAnimationEnabled } from '@/store/useSensoryStore';

const LOW_VOLTAGE = 4;
const HIGH_VOLTAGE = 7;

interface VoltageIcosahedronProps {
  voltage: number;
  spoons?: number;
}

function hexToThreeColor(hex: string): THREE.Color {
  return new THREE.Color(hex);
}

export function VoltageIcosahedron({ voltage, spoons = 10 }: VoltageIcosahedronProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const animationEnabled = useAnimationEnabled();

  useFrame((state, delta) => {
    if (!meshRef.current || !materialRef.current) return;

    const isHigh = voltage > HIGH_VOLTAGE;
    const isLow = voltage < LOW_VOLTAGE;

    if (animationEnabled) {
      // Rotation speed: faster at high voltage (decorative — off when reduced-motion)
      const rotSpeed = delta * (voltage * 0.2);
      meshRef.current.rotation.x += rotSpeed;
      meshRef.current.rotation.y += rotSpeed * 0.7;

      // Pulse scale: gentle when low, pronounced when high (decorative)
      const pulse = Math.sin(state.clock.elapsedTime * (isHigh ? voltage * 0.5 : 1)) * 0.1;
      const baseScale = 1 + (isHigh ? pulse * 2 : pulse);
      meshRef.current.scale.setScalar(baseScale);

      // Jitter at high voltage (sensory overload) — decorative
      if (isHigh) {
        const jitter = 0.02 * (voltage - HIGH_VOLTAGE);
        meshRef.current.position.x = (Math.random() - 0.5) * jitter;
        meshRef.current.position.y = (Math.random() - 0.5) * jitter;
        meshRef.current.position.z = (Math.random() - 0.5) * jitter;
      } else {
        meshRef.current.position.set(0, 0, 0);
      }
    } else {
      meshRef.current.scale.setScalar(1);
      meshRef.current.position.set(0, 0, 0);
    }

    // Color: green (low) -> amber -> crimson (high) — functional state
    let color: THREE.Color;
    if (isLow) {
      color = hexToThreeColor(P31.tokens.phosphorus);
    } else if (isHigh) {
      color = hexToThreeColor(P31.tokens.crimson);
    } else {
      color = hexToThreeColor(P31.tokens.amber);
    }
    materialRef.current.color.copy(color);
    materialRef.current.emissive.copy(color);
    materialRef.current.emissiveIntensity = isHigh ? 0.6 : 0.3;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.5, 1]} />
      <meshStandardMaterial
        ref={materialRef}
        color={P31.tokens.phosphorus}
        emissive={P31.tokens.phosphorus}
        emissiveIntensity={0.3}
        metalness={0.2}
        roughness={0.6}
      />
    </mesh>
  );
}

export default VoltageIcosahedron;
