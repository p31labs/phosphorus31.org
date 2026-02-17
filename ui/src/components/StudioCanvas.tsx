/**
 * StudioCanvas — Lazy-loaded R3F Canvas for the Studio.
 * Default export so it works with React.lazy(() => import(...)).
 * Contains the QuantumClock (Bob & Marge) and WorldBuilder.
 */

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { GeodesicRoomProvider } from '../contexts/GeodesicRoomContext';
import { CoherenceSync } from './CoherenceSync';
import { QuantumClock, ClockSonification } from './QuantumClock';

interface StudioCanvasProps {
  tab: 'clock' | 'world';
  worldId: string;
}

function ClockScene() {
  return (
    <group position={[0, 0, 0]}>
      <QuantumClock />
    </group>
  );
}

function WorldScene({ worldId }: { worldId: string }) {
  // WorldBuilder is heavy — lazy load it inside the canvas
  const WorldBuilder = React.lazy(() =>
    import('./WorldBuilder').then((m) => ({ default: m.WorldBuilder }))
  );

  return (
    <Suspense fallback={null}>
      <WorldBuilder
        worldId={worldId}
        onClose={() => {}}
      />
    </Suspense>
  );
}

function StudioCanvas({ tab, worldId }: StudioCanvasProps) {
  return (
    <GeodesicRoomProvider>
      <CoherenceSync />
      <ClockSonification />
      <Canvas
        camera={{ position: [0, 2, 8], fov: 50 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor('#050510');
        }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <pointLight position={[-5, 5, -5]} intensity={0.3} color="#00FF88" />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          maxDistance={20}
          minDistance={3}
        />

        {tab === 'clock' && <ClockScene />}
        {tab === 'world' && <WorldScene worldId={worldId} />}
      </Canvas>
    </GeodesicRoomProvider>
  );
}

export default StudioCanvas;
