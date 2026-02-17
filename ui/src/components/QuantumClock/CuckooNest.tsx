/**
 * CuckooNest — door and cuckoo that emerge on measurement. Marge's joyful surprise.
 * Wings inscribed "MARGE"; sometimes a gentle heart particle memory appears.
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { playMeasurementChime } from './cuckooChirp';

interface CuckooNestProps {
  onMeasurement?: () => void;
  /** Called when cuckoo emerges (e.g. for Marge appears) */
  onCuckooTrigger?: () => void;
  /** Coherence when measurement occurred (for chirp melody) */
  lastStability?: number;
  /** Increment to trigger a chirp (e.g. structure completion count) */
  triggerChirpCount?: number;
}

const MEMORY_CHANCE = 0.2;
const HEART_COLOR = 0xff69b4;

export const CuckooNest: React.FC<CuckooNestProps> = ({
  onMeasurement,
  onCuckooTrigger,
  lastStability = 0.85,
  triggerChirpCount = 0,
}) => {
  const doorRef = useRef<THREE.Group>(null);
  const cuckooRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Group>(null);
  const [animating, setAnimating] = useState(false);
  const [showMemory, setShowMemory] = useState(false);
  const animTimeRef = useRef(0);
  const lastTriggerRef = useRef(0);
  const memoryShownThisCycleRef = useRef(false);

  const playChirp = useCallback(() => {
    playMeasurementChime(lastStability);
    onMeasurement?.();
    onCuckooTrigger?.();
    setAnimating(true);
    memoryShownThisCycleRef.current = false;
    animTimeRef.current = 0;
  }, [lastStability, onMeasurement, onCuckooTrigger]);

  useEffect(() => {
    if (triggerChirpCount > lastTriggerRef.current) {
      lastTriggerRef.current = triggerChirpCount;
      playChirp();
    }
  }, [triggerChirpCount, playChirp]);

  useFrame((_, delta) => {
    if (!animating) return;
    animTimeRef.current += delta;
    const t = animTimeRef.current;
    const doorOpen = Math.min(1, t * 4);
    const cuckooOut = t > 0.2 ? Math.min(1, (t - 0.2) * 5) : 0;
    const close = t > 2 ? Math.min(1, (t - 2) * 3) : 0;

    if (doorRef.current) {
      doorRef.current.rotation.y = -doorOpen * 0.6 + close * 0.6;
    }
    if (cuckooRef.current) {
      cuckooRef.current.position.z = cuckooOut * 0.12 - close * 0.12;
    }
    if (cuckooOut >= 0.99 && !memoryShownThisCycleRef.current) {
      memoryShownThisCycleRef.current = true;
      if (Math.random() < MEMORY_CHANCE) setShowMemory(true);
    }
    if (showMemory && particlesRef.current) {
      particlesRef.current.position.y += delta * 0.4;
      particlesRef.current.rotation.z += delta * 0.5;
    }
    if (t > 2.5) {
      setAnimating(false);
      if (t > 3.2) setShowMemory(false);
    }
  });

  return (
    <group position={[0, 0.72, 0.2]}>
      {/* Door frame */}
      <mesh position={[0, 0, 0.01]}>
        <boxGeometry args={[0.2, 0.18, 0.02]} />
        <meshStandardMaterial color="#3d2e24" roughness={0.8} />
      </mesh>
      <group ref={doorRef} position={[-0.055, 0, 0.02]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.09, 0.16, 0.015]} />
          <meshStandardMaterial color="#5c4a3a" roughness={0.8} />
        </mesh>
      </group>
      {/* Cuckoo — MARGE inscribed on wings */}
      <group ref={cuckooRef} position={[0, 0, 0]}>
        <mesh position={[0, 0, 0.02]}>
          <sphereGeometry args={[0.03, 12, 12]} />
          <meshStandardMaterial color="#c4a574" roughness={0.7} />
        </mesh>
        {/* Beak */}
        <mesh position={[0.02, 0.01, 0.03]} rotation={[0, 0, -0.3]}>
          <boxGeometry args={[0.04, 0.01, 0.02]} />
          <meshStandardMaterial color="#8b7355" roughness={0.7} />
        </mesh>
        {/* Wing with MARGE inscribed */}
        <group position={[-0.025, 0.005, 0.025]} rotation={[0, 0, 0.2]}>
          <mesh>
            <boxGeometry args={[0.025, 0.008, 0.015]} />
            <meshStandardMaterial color="#8b7355" roughness={0.7} />
          </mesh>
          <Text
            position={[0, 0, 0.016]}
            fontSize={0.012}
            color="#3d2e24"
            anchorX="center"
            anchorY="middle"
            maxWidth={0.04}
          >
            MARGE
          </Text>
        </group>
      </group>
      {/* Memory particles (heart) — gentle whisper when Marge appears */}
      {showMemory && (
        <group ref={particlesRef} position={[0, 0, 0.15]}>
          {Array.from({ length: 12 }, (_, i) => (
            <mesh
              key={i}
              position={[
                Math.sin((i / 12) * Math.PI * 2) * 0.08,
                Math.cos((i / 12) * Math.PI * 2) * 0.08,
                0,
              ]}
            >
              <sphereGeometry args={[0.012, 6, 6]} />
              <meshBasicMaterial color={HEART_COLOR} transparent opacity={0.9} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
