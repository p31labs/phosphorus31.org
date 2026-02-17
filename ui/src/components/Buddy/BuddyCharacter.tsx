/**
 * P31 Buddy — floating tetrahedron companion with eyes and mood-based color.
 * Respects reduced motion. Used in World Builder; speaks to the player by codename.
 */

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BuddyMood } from '../../types/buddy';
import { BUDDY_MOOD_COLORS } from '../../types/buddy';
import { useAccessibilityStore } from '../../stores/accessibility.store';

interface BuddyCharacterProps {
  /** Display codename of the player (for aria / screen readers) */
  playerCodename: string;
  mood?: BuddyMood;
  /** World position: in front of camera / near player */
  position?: [number, number, number];
  scale?: number;
}

const EYE_OFFSET_LEFT = new THREE.Vector3(-0.22, 0.35, 0.28);
const EYE_OFFSET_RIGHT = new THREE.Vector3(0.22, 0.35, 0.28);
const EYE_RADIUS = 0.08;

function TetrahedronWithEyes({
  color,
  reducedMotion,
}: {
  color: string;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  const geom = useMemo(() => {
    return new THREE.TetrahedronGeometry(0.6, 0);
  }, []);

  useFrame((state) => {
    if (reducedMotion || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(t * 0.5) * 0.08;
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group ref={groupRef as any}>
      <mesh ref={meshRef as any} geometry={geom as any} castShadow receiveShadow>
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.7} />
      </mesh>
      <mesh position={EYE_OFFSET_LEFT.toArray()}>
        <sphereGeometry args={[EYE_RADIUS, 12, 10]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
      <mesh position={EYE_OFFSET_RIGHT.toArray()}>
        <sphereGeometry args={[EYE_RADIUS, 12, 10]} />
        <meshStandardMaterial color="#0f172a" />
      </mesh>
    </group>
  );
}

export function BuddyCharacter({
  playerCodename: _playerCodename,
  mood = 'happy',
  position = [0, 3, 8],
  scale = 1,
}: BuddyCharacterProps) {
  const animationReduced = useAccessibilityStore((s) => s.animationReduced);
  const color = BUDDY_MOOD_COLORS[mood];

  return (
    <group position={position} scale={scale}>
      <TetrahedronWithEyes color={color} reducedMotion={animationReduced} />
    </group>
  );
}

export default BuddyCharacter;
