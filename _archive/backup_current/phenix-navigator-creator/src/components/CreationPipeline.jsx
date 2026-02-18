// ══════════════════════════════════════════════════════════════════════════════
// CREATION PIPELINE
// R3F Canvas orchestrator. Contains voxel world, hologram, coherence orb,
// and all UI overlays.
// ══════════════════════════════════════════════════════════════════════════════

import { useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useStore } from '../store.js';

import VoxelWorld from './VoxelWorld.jsx';
import Hologram from './Hologram.jsx';
import CoherenceOrb from './CoherenceOrb.jsx';
import HUD from './HUD.jsx';
import ActionDeck from './ActionDeck.jsx';
import VPIOverlay from './VPIOverlay.jsx';
import GlitchOverlay from './GlitchOverlay.jsx';

/**
 * CreationPipeline - Main 3D scene orchestrator
 * @param {function} onExport - Callback when MATERIALIZE is triggered
 */
export default function CreationPipeline({ onExport }) {
  const canvasRef = useRef(null);
  const voltage = useStore((s) => s.voltage);

  // ── Export Handler ─────────────────────────────────────────────────────────
  const handleExport = useCallback(() => {
    if (!canvasRef.current) {
      console.error('[CreationPipeline] No canvas ref');
      return;
    }

    // Access the R3F scene via the canvas's internal state
    const gl = canvasRef.current;
    const scene = gl.__r3f?.scene;

    if (!scene) {
      console.error('[CreationPipeline] Could not access scene');
      return;
    }

    onExport(scene);
  }, [onExport]);

  return (
    <>
      {/* ── 3D Canvas ─────────────────────────────────────────────────────── */}
      <Canvas
        ref={canvasRef}
        camera={{ position: [15, 12, 15], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: false,
          powerPreference: 'high-performance'
        }}
        style={{ 
          position: 'absolute', 
          inset: 0,
          background: '#020617'
        }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 20, 10]} 
          intensity={1.2}
          castShadow={false}
        />
        <pointLight 
          position={[-10, 10, -10]} 
          intensity={0.6} 
          color="#22d3ee"
        />

        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
          maxPolarAngle={Math.PI * 0.85}
        />

        {/* Ground Grid */}
        <gridHelper 
          args={[60, 60, '#1e293b', '#0f172a']} 
          position={[0, -0.01, 0]}
        />

        {/* Core Components */}
        <VoxelWorld />
        <Hologram voltage={voltage} />
        <CoherenceOrb />
      </Canvas>

      {/* ── UI Overlays ───────────────────────────────────────────────────── */}
      <GlitchOverlay voltage={voltage} />
      <VPIOverlay />
      <HUD />
      <ActionDeck onExport={handleExport} />
    </>
  );
}
