/**
 * QUANTUM POST-PROCESSING - Shader Effects Layer
 * 
 * Implements the aesthetic protocol:
 * - Bloom: Bioluminescent glow on active elements
 * - Chromatic Aberration: Phase noise visualization at screen edges
 * - Grain/Noise: Fractal noise overlay at 3% opacity - analog texture
 * - Breathing Pulse: 0.1 Hz oscillation on idle elements (vagal tone)
 */

import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { useMetabolism } from '../../hooks/useMetabolism';

interface QuantumPostProcessingProps {
  intensity?: number; // Overall effect intensity (0.0 to 1.0)
  autoIntensity?: boolean; // Auto-adjust from spoon level
}

export function QuantumPostProcessing({
  intensity: manualIntensity,
  autoIntensity = true,
}: QuantumPostProcessingProps) {
  const { metabolism } = useMetabolism();

  // Calculate intensity from spoon level
  const intensity = autoIntensity
    ? metabolism
      ? Math.max(0.3, Math.min(1.0, metabolism.currentSpoons / metabolism.maxSpoons))
      : 0.5
    : manualIntensity ?? 0.5;

  // Breathing pulse at 0.1 Hz (vagal tone) - 10 second cycle
  const breathingPhase = (Date.now() % 10000) / 10000;
  const breathingIntensity = Math.sin(breathingPhase * Math.PI * 2) * 0.1 + 0.9;

  return (
    <EffectComposer>
      {/* Bloom - Bioluminescent glow */}
      <Bloom
        intensity={intensity * 0.5 * breathingIntensity}
        kernelSize={3}
        luminanceThreshold={0.1}
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.ADD}
      />

      {/* Chromatic Aberration - Phase noise at edges */}
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={[0.002 * intensity, 0.002 * intensity]}
      />

      {/* Noise/Grain - Analog texture overlay */}
      <Noise
        blendFunction={BlendFunction.OVERLAY}
        opacity={0.03 * intensity} // 3% opacity as per spec
      />
    </EffectComposer>
  );
}
