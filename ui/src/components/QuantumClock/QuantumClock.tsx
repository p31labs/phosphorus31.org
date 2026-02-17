/**
 * QuantumClock.tsx
 * The beating heart of every P31 world – a tribute to Bob and Marge.
 * The pendulum swings with Bob's steadfast rhythm; the cuckoo bursts forth with Marge's playful spirit.
 * Winding the crank charges the clock with love-energy, slowly boosting coherence.
 * Every hour, the clock chimes a melody drawn from the harmonic stability of nearby structures.
 * When a beautiful structure is built, Marge peeks out and sometimes leaves a heart particle trail.
 *
 * "With love and light. As above, so below."
 */

import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { useCoherenceStore } from '../../stores/coherence.store';
import { useGeodesicRoom } from '../../contexts/GeodesicRoomContext';
import { GameEngineContext } from '../Game/GameEngineProvider';
import { ChimeGenerator } from './ChimeGenerator';
import { playMelody, playWindSound, playHeartWhisper } from './ClockSonificationAudio';

// ----------------------------------------------------------------------
// Cabinet – the sturdy vessel, like Bob's embrace
const Cabinet: React.FC = () => {
  const edgesGeom = useMemo(
    () => new THREE.EdgesGeometry(new THREE.CylinderGeometry(1.2, 1.2, 3.5, 6)),
    []
  );
  return (
    <group>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 3.5, 6]} />
        <meshStandardMaterial color="#4a2c1a" roughness={0.8} metalness={0.1} />
      </mesh>
      <lineSegments geometry={edgesGeom}>
        <lineBasicMaterial color="#2ecc71" />
      </lineSegments>
    </group>
  );
};

// ----------------------------------------------------------------------
// Pendulum – Bob's steady rhythm
const Pendulum: React.FC<{ coherence: number; windingEnergy: number }> = ({
  coherence,
  windingEnergy,
}) => {
  const pivotRef = useRef<THREE.Group>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const maxAngle = 0.3 + (coherence + windingEnergy * 0.5) * 0.4;
    const angle = Math.sin(timeRef.current * 2) * maxAngle;
    if (pivotRef.current) {
      pivotRef.current.rotation.z = angle;
      pivotRef.current.rotation.x = (1 - coherence) * 0.1 * Math.sin(timeRef.current * 10);
    }
  });

  return (
    <group ref={pivotRef} position={[0, 1.5, 0]}>
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 2.4, 8]} />
        <meshStandardMaterial color="#2ecc71" emissive="#2ecc71" emissiveIntensity={0.3} />
      </mesh>
      <group position={[0, -2.4, 0]}>
        <mesh>
          <sphereGeometry args={[0.2, 16, 16]} />
          <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={0.5} />
        </mesh>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, (i * Math.PI) / 3, 0]}>
            <torusGeometry args={[0.4, 0.02, 8, 32]} />
            <meshStandardMaterial color="#2ecc71" emissive="#2ecc71" emissiveIntensity={0.2} />
          </mesh>
        ))}
        <Text position={[0.3, 0.2, 0.3]} fontSize={0.1} color="#ffffff" anchorX="center" anchorY="middle">
          BOB
        </Text>
      </group>
    </group>
  );
};

// ----------------------------------------------------------------------
// Cuckoo Nest – Marge's joyful surprise
const CuckooNest: React.FC<{ onTrigger: () => void }> = ({ onTrigger }) => {
  const doorRef = useRef<THREE.Mesh>(null);
  const birdRef = useRef<THREE.Group>(null);
  const [active, setActive] = useState(false);

  const emerge = useCallback(() => {
    if (active || !doorRef.current || !birdRef.current) return;
    setActive(true);
    onTrigger();

    gsap.to(doorRef.current.rotation, { y: Math.PI / 2, duration: 0.3, ease: 'power2.inOut' });

    gsap.to(birdRef.current.position, {
      y: 0.5,
      duration: 0.5,
      delay: 0.2,
      ease: 'back.out',
      onComplete: () => {
        if (Math.random() < 0.2) {
          playHeartWhisper();
          const heartGroup = new THREE.Group();
          for (let i = 0; i < 10; i++) {
            const heart = new THREE.Mesh(
              new THREE.SphereGeometry(0.03, 4),
              new THREE.MeshBasicMaterial({ color: 0xff69b4 })
            );
            heart.position.set(Math.sin(i) * 0.2, Math.cos(i) * 0.2, 0);
            heartGroup.add(heart);
          }
          birdRef.current?.add(heartGroup);
          gsap.to(heartGroup.position, {
            y: 1,
            duration: 1,
            ease: 'power2.out',
            onComplete: () => heartGroup.removeFromParent(),
          });
        }
        gsap.to(birdRef.current!.position, {
          y: 0,
          duration: 0.5,
          delay: 1,
          ease: 'power2.in',
          onComplete: () => {
            gsap.to(doorRef.current!.rotation, {
              y: 0,
              duration: 0.3,
              ease: 'power2.inOut',
              onComplete: () => setActive(false),
            });
          },
        });
      },
    });
  }, [active, onTrigger]);

  useEffect(() => {
    const handler = () => emerge();
    window.addEventListener('quantum-measurement', handler);
    return () => window.removeEventListener('quantum-measurement', handler);
  }, [emerge]);

  return (
    <group position={[0, 1.2, 1.0]}>
      <mesh ref={doorRef} position={[0, 0, 0.1]}>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#8B5A2B" />
      </mesh>
      <group ref={birdRef} position={[0, 0, 0.2]}>
        <mesh>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#2ecc71" emissive="#2ecc71" emissiveIntensity={0.3} />
        </mesh>
        <group position={[0.15, 0.05, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 0.02, 0.3]} />
            <meshStandardMaterial color="#2ecc71" />
          </mesh>
          <Text position={[0, 0.05, 0.15]} fontSize={0.03} color="#ffffff" anchorX="center" anchorY="middle">
            MARGE
          </Text>
        </group>
        <group position={[-0.15, 0.05, 0]}>
          <mesh>
            <boxGeometry args={[0.1, 0.02, 0.3]} />
            <meshStandardMaterial color="#2ecc71" />
          </mesh>
          <Text position={[0, 0.05, 0.15]} fontSize={0.03} color="#ffffff" anchorX="center" anchorY="middle">
            MARGE
          </Text>
        </group>
        <mesh position={[0, 0, 0.2]}>
          <coneGeometry args={[0.05, 0.1, 6]} />
          <meshStandardMaterial color="#FFA500" />
        </mesh>
      </group>
    </group>
  );
};

// ----------------------------------------------------------------------
// Winding Mechanism – the crank that charges the clock with love
const WindingMechanism: React.FC<{
  onWind: (amount: number) => void;
  windingEnergy: number;
}> = ({ onWind, windingEnergy }) => {
  const crankRef = useRef<THREE.Group>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [angle, setAngle] = useState(0);

  useFrame(() => {
    if (crankRef.current) {
      if (!isDragging) setAngle((a) => a * 0.95);
      crankRef.current.rotation.z = angle;
    }
  });

  const handlePointerDown = (e: PointerLike) => {
    e.stopPropagation();
    setIsDragging(true);
  };
  const handlePointerUp = () => setIsDragging(false);
  const handlePointerMove = (e: PointerLike) => {
    if (!isDragging) return;
    const delta = e.movementX * 0.01;
    setAngle((a) => a + delta);
    onWind(Math.abs(delta) * 0.1);
    playWindSound(Math.abs(delta) * 0.1);
  };

  return (
    <group
      ref={crankRef}
      position={[1.2, 0.5, 0.8]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerUp}
    >
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 0.4, 8]} />
        <meshStandardMaterial color="#bbaa88" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.2, 0, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color="#ccbb99" metalness={0.7} />
      </mesh>
      <pointLight color="#2ecc71" intensity={windingEnergy * 2} distance={2} />
      <Html distanceFactor={10}>
        <div
          style={{
            color: '#2ecc71',
            fontSize: 12,
            background: 'rgba(0,0,0,0.6)',
            padding: '2px 5px',
            borderRadius: 4,
          }}
        >
          {windingEnergy > 0 ? `⚡${Math.round(windingEnergy * 100)}%` : 'Wind me'}
        </div>
      </Html>
    </group>
  );
};

type PointerLike = { stopPropagation: () => void; movementX: number };

// ----------------------------------------------------------------------
// Main QuantumClock Component
export interface QuantumClockProps {
  position?: [number, number, number];
  /** For multiplayer sync; defaults to 'default' when omitted */
  worldId?: string;
}

export const QuantumClock: React.FC<QuantumClockProps> = ({
  position = [0, 0, 0],
  worldId = 'default',
}) => {
  const globalCoherence = useCoherenceStore((s) => s.globalCoherence);
  const playerCoherence = useCoherenceStore((s) => s.playerCoherence);
  const nudgeCoherence = useCoherenceStore((s) => s.nudgeCoherence);
  const { send, room } = useGeodesicRoom();
  const gameContext = useContext(GameEngineContext);
  const engine = gameContext?.engine ?? null;

  const [windingEnergy, setWindingEnergy] = useState(0);
  const [worldHour, setWorldHour] = useState(0);
  const [lastChimeHour, setLastChimeHour] = useState(-1);
  const positionVec = useMemo(() => new THREE.Vector3(...position), [position[0], position[1], position[2]]);

  useEffect(() => {
    const interval = setInterval(() => setWorldHour((h) => (h + 1) % 12), 5000);
    return () => clearInterval(interval);
  }, []);

  useFrame((_, delta) => setWindingEnergy((e) => Math.max(0, e - delta * 0.01)));

  useEffect(() => {
    if (windingEnergy > 0) nudgeCoherence(windingEnergy * 0.001);
  }, [windingEnergy, nudgeCoherence]);

  const handleWind = useCallback(
    (amount: number) => {
      setWindingEnergy((e) => Math.min(1, e + amount));
      send('clockWind', { worldId, amount, player: room?.sessionId });
    },
    [worldId, send, room?.sessionId]
  );

  const triggerChime = useCallback(
    (type: 'hour' | 'structure', data?: { stability?: number }) => {
      const structures = room?.state?.structures
        ? Array.from((room.state.structures as Map<string, StructureWithVertices>).values())
        : [];
      const nearby = structures.filter((s) => {
        if (!s.vertices || s.vertices.length < 3) return false;
        const center = new THREE.Vector3();
        for (let i = 0; i < s.vertices.length; i += 3) {
          center.add(new THREE.Vector3(s.vertices[i], s.vertices[i + 1], s.vertices[i + 2]));
        }
        center.divideScalar(s.vertices.length / 3);
        return center.distanceTo(positionVec) < 20;
      });
      const withStability = nearby.map((s) => ({
        ...s,
        stability: (s as { stability?: number }).stability ?? 0.5,
      }));
      const melody = ChimeGenerator.generateMelody(withStability, type);
      playMelody(melody);
      send('clockChime', { worldId, type, melody });

      if (type === 'structure') {
        window.dispatchEvent(new CustomEvent('quantum-measurement', { detail: data }));
      }
    },
    [room, worldId, positionVec, send]
  );

  useEffect(() => {
    if (worldHour === 0 && lastChimeHour !== 0) {
      triggerChime('hour');
      setLastChimeHour(0);
    } else if (worldHour !== 0) {
      setLastChimeHour(worldHour);
    }
  }, [worldHour, lastChimeHour, triggerChime]);

  useEffect(() => {
    const handleStructure = (data: unknown) => {
      const d = data as { stability?: number };
      if ((d?.stability ?? 0) > 0.8) triggerChime('structure', d);
    };
    engine?.on?.('structureComplete', handleStructure);
    return () => engine?.off?.('structureComplete', handleStructure);
  }, [engine, triggerChime]);

  return (
    <group position={position}>
      <Cabinet />
      <mesh>
        <sphereGeometry args={[1, 32, 16]} />
        <meshPhongMaterial
          color="#2ecc71"
          emissive="#2ecc71"
          emissiveIntensity={0.2}
          transparent
          opacity={0.3}
        />
      </mesh>
      <Pendulum coherence={globalCoherence} windingEnergy={windingEnergy} />
      <group position={[-0.8, 0, 0]}>
        <mesh position={[-0.5, -1 + windingEnergy, 0]}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#888" />
        </mesh>
        <mesh position={[0, -1 + globalCoherence, 0]}>
          <icosahedronGeometry args={[0.25]} />
          <meshStandardMaterial color="#2ecc71" emissive="#2ecc71" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.5, -1 + playerCoherence, 0]}>
          <torusKnotGeometry args={[0.15, 0.05, 64, 8]} />
          <meshStandardMaterial color="#aa88ff" emissive="#aa88ff" emissiveIntensity={0.3} />
        </mesh>
      </group>
      <CuckooNest onTrigger={() => {}} />
      <WindingMechanism onWind={handleWind} windingEnergy={windingEnergy} />
    </group>
  );
};

interface StructureWithVertices {
  vertices?: number[];
  stability?: number;
  [key: string]: unknown;
}
