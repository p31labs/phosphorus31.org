/**
 * QUANTUM UPGRADE - Main Integration Component
 * 
 * Combines all quantum UI/UX enhancements:
 * - Jitterbug Transformation (cognitive load visualization)
 * - Quantum Reservoir (Posner molecule states)
 * - Post-processing effects (Bloom, Chromatic Aberration, Grain)
 * - 3D Tetrahedron Navigation (spatial interface)
 * 
 * This is the complete quantum upgrade package.
 */

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { JitterbugTransformation } from './JitterbugTransformation';
import { QuantumReservoir } from './QuantumReservoir';
import { QuantumPostProcessing } from './QuantumPostProcessing';
import { TetrahedronNavigation } from './TetrahedronNavigation';
import { useMetabolism } from '../../hooks/useMetabolism';

interface QuantumUpgradeProps {
  showJitterbug?: boolean;
  showReservoir?: boolean;
  showNavigation?: boolean;
  navigationNodes?: Array<{
    id: string;
    label: string;
    icon?: string;
    color: string;
    onClick: () => void;
  }>;
  onTetrahedronLock?: () => void;
}

export function QuantumUpgrade({
  showJitterbug = true,
  showReservoir = true,
  showNavigation = false,
  navigationNodes = [],
  onTetrahedronLock,
}: QuantumUpgradeProps) {
  const { metabolism } = useMetabolism();

  const handleTetrahedronLock = () => {
    // Trigger haptic feedback (would integrate with Node One DRV2605L)
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]); // "Thick Click" pattern
    }
    if (onTetrahedronLock) {
      onTetrahedronLock();
    }
  };

  return (
    <Canvas
      camera={{ position: [0, 5, 10], fov: 50 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
    >
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
      <pointLight position={[-10, -10, -5]} intensity={0.3} />

      {/* Environment */}
      <Environment preset="sunset" />

      {/* Main quantum visualizations */}
      {showJitterbug && (
        <JitterbugTransformation
          autoPhase={true}
          onTetrahedronLock={handleTetrahedronLock}
        />
      )}

      {showReservoir && <QuantumReservoir particleCount={2000} autoCoherence={true} />}

      {/* 3D Navigation */}
      {showNavigation && navigationNodes.length > 0 && (
        <TetrahedronNavigation
          nodes={navigationNodes}
          size={3}
          onNodeSelect={(nodeId) => {
            const node = navigationNodes.find((n) => n.id === nodeId);
            if (node) node.onClick();
          }}
        />
      )}

      {/* Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2 - 0.1}
      />

      {/* Post-processing effects */}
      <QuantumPostProcessing autoIntensity={true} />
    </Canvas>
  );
}
