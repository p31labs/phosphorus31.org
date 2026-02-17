/**
 * QuantumClock — Quantum Grandfather–Cuckoo Clock
 * Heart of the world: classical pendulum rhythm + quantum measurement (cuckoo on measurement).
 * Bloch sphere face, swinging pendulum, cuckoo pops when lastMeasurementAt changes.
 */

import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface QuantumClockProps {
  position?: [number, number, number];
  /** When this changes, the cuckoo pops out (e.g. Date.now() on block place / compile). */
  lastMeasurementAt?: number;
  scale?: number;
}

export function QuantumClock({
  position = [0, 5, 0],
  lastMeasurementAt = 0,
  scale = 1,
}: QuantumClockProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pendulumRef = useRef<THREE.Group>(null);
  const cuckooRef = useRef<THREE.Mesh>(null);
  const [cuckooOpen, setCuckooOpen] = useState(false);
  const cuckooTargetZ = useRef(0);
  const prevMeasurement = useRef(lastMeasurementAt);

  // Trigger cuckoo when measurement happens
  useEffect(() => {
    if (lastMeasurementAt > 0 && lastMeasurementAt !== prevMeasurement.current) {
      prevMeasurement.current = lastMeasurementAt;
      setCuckooOpen(true);
      cuckooTargetZ.current = 0.4 * scale;
      const t = setTimeout(() => {
        setCuckooOpen(false);
        cuckooTargetZ.current = 0;
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [lastMeasurementAt, scale]);

  useFrame((_, delta) => {
    if (pendulumRef.current) {
      pendulumRef.current.rotation.z = Math.sin(performance.now() * 0.002) * 0.35;
    }
    if (cuckooRef.current) {
      const target = cuckooOpen ? 0.4 * scale : 0;
      cuckooRef.current.position.z += (target - cuckooRef.current.position.z) * Math.min(1, delta * 6);
    }
  });

  const s = scale;
  return (
    <group ref={groupRef as any} position={position}>
      {/* Case */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2 * s, 1.8 * s, 0.35 * s]} />
        <meshStandardMaterial
          color="#1a1a2e"
          metalness={0.3}
          roughness={0.7}
          emissive="#0d0d1a"
        />
      </mesh>

      {/* Bloch sphere face — quantum "dial" */}
      <mesh position={[0, 0.35 * s, 0.18 * s]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.35 * s, 32, 24]} />
        <meshStandardMaterial
          color="#2ecc71"
          emissive="#1a5c34"
          emissiveIntensity={0.4}
          metalness={0.2}
          roughness={0.6}
        />
      </mesh>

      {/* Pendulum */}
      <group ref={pendulumRef as any} position={[0, -0.6 * s, 0.2 * s]} rotation={[0, 0, 0]}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.02 * s, 0.02 * s, 0.5 * s, 8]} />
          <meshStandardMaterial color="#4a4a6a" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.28 * s, 0]}>
          <sphereGeometry args={[0.06 * s, 12, 8]} />
          <meshStandardMaterial color="#2ecc71" emissive="#1a5c34" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Cuckoo door + bird */}
      <group position={[0.35 * s, 0.5 * s, 0.18 * s]}>
        <mesh>
          <boxGeometry args={[0.15 * s, 0.2 * s, 0.02 * s]} />
          <meshStandardMaterial color="#2d2d44" />
        </mesh>
        <mesh ref={cuckooRef as any} position={[0, 0, 0]}>
          <boxGeometry args={[0.1 * s, 0.12 * s, 0.08 * s]} />
          <meshStandardMaterial
            color="#2ecc71"
            emissive="#1a5c34"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
    </group>
  );
}

export default QuantumClock;
