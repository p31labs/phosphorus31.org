/**
 * Curved glowing line between two entangled phosphorus atoms
 */

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EntanglementLine4DProps {
  from: [number, number, number];
  to: [number, number, number];
  coherence: number;
}

export const EntanglementLine4D: React.FC<EntanglementLine4DProps> = ({
  from,
  to,
  coherence,
}) => {
  const lineRef = useRef<THREE.Line>(null);
  const points = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    mid.y += 0.8;
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(20);
  }, [from, to]);

  const positions = useMemo(() => {
    const arr = new Float32Array(points.length * 3);
    points.forEach((p, i) => {
      arr[i * 3] = p.x;
      arr[i * 3 + 1] = p.y;
      arr[i * 3 + 2] = p.z;
    });
    return arr;
  }, [points]);

  useFrame(({ clock }) => {
    if (lineRef.current?.material && lineRef.current.material instanceof THREE.LineBasicMaterial) {
      const t = 0.3 + coherence * 0.4 + Math.sin(clock.elapsedTime * 2) * 0.15;
      lineRef.current.material.color.setHSL(0.35 + coherence * 0.2, 1, t);
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#22c55e" transparent opacity={0.85} />
    </line>
  );
}
