/**
 * GeodesicPortalRing — portal visual: ring, inner glow, particles, destination label.
 * Production: targetWorldId, onEnter, isActive; P31 green #2ecc71.
 */
import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const P31_GREEN = '#2ecc71';

interface GeodesicPortalRingProps {
  position: [number, number, number];
  targetWorldId?: string;
  isActive?: boolean;
  onEnter?: () => void;
  scale?: number;
}

export const GeodesicPortalRing: React.FC<GeodesicPortalRingProps> = ({
  position,
  targetWorldId = '',
  isActive = true,
  onEnter,
  scale = 1,
}) => {
  const ringRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const timeRef = useRef(0);
  const particleCount = 100;
  const [positions, setPositions] = React.useState<Float32Array | null>(null);

  useEffect(() => {
    if (!isActive) return;
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const r = 2.5 + Math.random() * 0.5;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = Math.sin(angle) * r;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
    }
    setPositions(pos);
  }, [isActive]);

  useFrame((_state, delta) => {
    timeRef.current += delta;
    if (ringRef.current) {
      ringRef.current.rotation.y += 0.005;
      ringRef.current.rotation.x += 0.002;
      const s = 1 + Math.sin(timeRef.current * 3) * 0.05;
      ringRef.current.scale.setScalar(s * scale);
    }
    if (particlesRef.current && positions) {
      const arr = particlesRef.current.geometry.attributes.position
        .array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        const x = arr[ix]!;
        const y = arr[ix + 1]!;
        const d = Math.sqrt(x * x + y * y);
        if (d < 0.5) {
          const angle = Math.random() * Math.PI * 2;
          arr[ix] = Math.cos(angle) * 2.5;
          arr[ix + 1] = Math.sin(angle) * 2.5;
        } else {
          arr[ix] *= 0.99;
          arr[ix + 1] *= 0.99;
        }
      }
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  if (!isActive) return null;

  return (
    <group position={position}>
      <mesh ref={ringRef} onClick={onEnter}>
        <torusGeometry args={[2 * scale, 0.1 * scale, 16, 64]} />
        <meshStandardMaterial
          color={P31_GREEN}
          emissive={P31_GREEN}
          emissiveIntensity={0.8}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh>
        <cylinderGeometry args={[1.8 * scale, 1.8 * scale, 0.1 * scale, 32]} />
        <meshBasicMaterial
          color={P31_GREEN}
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {positions && (
        <points ref={particlesRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={particleCount}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color={P31_GREEN}
            size={0.1 * scale}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            transparent
            opacity={0.8}
          />
        </points>
      )}
      {targetWorldId && (
        <Html position={[0, 2.5 * scale, 0]} center>
          <div
            style={{
              background: 'rgba(0,0,0,0.7)',
              color: P31_GREEN,
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              border: `1px solid ${P31_GREEN}`,
              whiteSpace: 'nowrap',
            }}
          >
            🌌 {targetWorldId.slice(0, 8)}...
          </div>
        </Html>
      )}
    </group>
  );
};
