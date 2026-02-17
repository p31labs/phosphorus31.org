/**
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                    QUANTUM MEASUREMENT EFFECT                                  ║
 * ║         Wave function collapse visualization                                    ║
 * ║                                                                                 ║
 * ║  "The act of observation collapses the wave function.                           ║
 * ║   Reality emerges from possibility."                                           ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Ring } from '@react-three/drei';
import * as THREE from 'three';
import { useQuantumStore } from '../../stores/quantum.store';

interface QuantumMeasurementEffectProps {
  position: [number, number, number];
  nodeId: string;
  onComplete?: () => void;
}

export function QuantumMeasurementEffect({
  position,
  nodeId,
  onComplete,
}: QuantumMeasurementEffectProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const node = useQuantumStore((state) => state.nodes.find((n) => n.id === nodeId));

  useEffect(() => {
    if (!node) return;

    // Animation duration: 1 second
    const duration = 1000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);

      setProgress(newProgress);

      if (newProgress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsComplete(true);
        onComplete?.();
      }
    };

    animate();
  }, [node, onComplete]);

  useFrame(() => {
    if (groupRef.current && !isComplete) {
      // Pulsing effect during collapse
      const scale = 1 + Math.sin(progress * Math.PI * 10) * 0.3 * (1 - progress);
      groupRef.current.scale.setScalar(scale);

      // Rotation during collapse
      groupRef.current.rotation.y += 0.05;
    }
  });

  if (!node || isComplete) return null;

  // Color transition: quantum state color → collapsed gray
  const startColor = new THREE.Color().setHSL((node.coherence * 120) / 360, 0.8, 0.5);
  const endColor = new THREE.Color(0x888888);
  const currentColor = startColor.clone().lerp(endColor, progress);

  // Particle count decreases as wave function collapses
  const particleCount = Math.floor(20 * (1 - progress));

  return (
    <group ref={groupRef} position={position}>
      {/* Collapsing wave rings */}
      {Array.from({ length: 5 }).map((_, i) => {
        const ringProgress = Math.max(0, progress - i * 0.2);
        const ringScale = 1 + ringProgress * 2;
        const ringOpacity = (1 - ringProgress) * 0.5;

        return (
          <Ring
            key={i}
            args={[0.5, 0.7, 32]}
            scale={ringScale}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshStandardMaterial
              color={currentColor}
              transparent
              opacity={ringOpacity}
              emissive={currentColor}
              emissiveIntensity={ringOpacity * 0.5}
            />
          </Ring>
        );
      })}

      {/* Collapsing particles */}
      {Array.from({ length: particleCount }).map((_, i) => {
        const angle = (i / particleCount) * Math.PI * 2;
        const radius = 0.5 + progress * 1.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (Math.random() - 0.5) * progress * 2;

        return (
          <Sphere key={i} args={[0.05, 8, 8]} position={[x, y, z]}>
            <meshStandardMaterial
              color={currentColor}
              emissive={currentColor}
              emissiveIntensity={1 - progress}
            />
          </Sphere>
        );
      })}

      {/* Collapsed state indicator */}
      {progress > 0.8 && (
        <Sphere args={[0.2, 16, 16]}>
          <meshStandardMaterial
            color={endColor}
            emissive={endColor}
            emissiveIntensity={0.3}
          />
        </Sphere>
      )}
    </group>
  );
}

export default QuantumMeasurementEffect;
