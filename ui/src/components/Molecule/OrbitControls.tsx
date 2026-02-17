/**
 * Enhanced Orbit Controls
 * Better camera controls with smooth transitions
 */

import React, { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import { useAccessibilityStore } from '../../stores/accessibility.store';

interface EnhancedOrbitControlsProps {
  autoRotate?: boolean;
  autoRotateSpeed?: number;
}

export const EnhancedOrbitControls: React.FC<EnhancedOrbitControlsProps> = ({
  autoRotate = true,
  autoRotateSpeed = 0.5,
}) => {
  const controlsRef = useRef<any>(null);
  const { animationReduced } = useAccessibilityStore();

  useFrame(() => {
    if (controlsRef.current && !animationReduced) {
      // Smooth damping
      controlsRef.current.update();
    }
  });

  return (
    <DreiOrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.05}
      minDistance={8}
      maxDistance={50}
      autoRotate={!animationReduced && autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
    />
  );
};
