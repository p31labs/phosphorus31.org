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

import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Glitch } from '@react-three/postprocessing';
import { useStore } from '../store/store';
import { useTrimtab } from '../hooks/useTrimtab';
import { materializeObject } from '../fabricator';

// --- VOXEL WORLD COMPONENT (Instanced for Performance) ---
const VoxelWorld = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const { scene } = useThree();

  const blocks = useStore((state) => state.blocks);
  const addBlock = useStore((state) => state.addBlock);
  const removeBlock = useStore((state) => state.removeBlock);
  const mode = useStore((state) => state.mode);
  const { speakWisdom } = useTrimtab();

  // Effect to sync Zustand state to InstancedMesh matrix
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    // Reset instance count
    mesh.count = blocks.size;

    let i = 0;
    const tempObject = new THREE.Object3D();

    blocks.forEach((type, key) => {
      const [x, y, z] = key.split(',').map(Number);
      tempObject.position.set(x, y, z);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i++, tempObject.matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  }, [blocks]);

  // Raycasting Handler for adding/removing blocks
  const handleClick = (e: THREE.Intersection) => {
    e.stopPropagation();
    if (mode !== 'BUILD') return;

    // Calculate voxel position based on face normal
    const pos = e.point.clone().add(e.face!.normal.multiplyScalar(0.5)).floor();
    const posKey = `${pos.x},${pos.y},${pos.z}`;

    if (e.altKey) { // Alt+Click to remove
      removeBlock(posKey);
    } else {
      addBlock(posKey);
      // Provide positive reinforcement on creation
      if (Math.random() > 0.85) { // Speak wisdom occasionally
        speakWisdom();
      }
    }
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, 10000]} // Geometry, Material, Max Count
      name="voxelWorld" // Name the object so the fabricator can find it
      onClick={(e) => handleClick(e as unknown as THREE.Intersection)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#22d3ee" />
    </instancedMesh>
  );
};

// A transparent ground plane for the user's first click
const Ground = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
    <planeGeometry args={[100, 100]} />
    <meshStandardMaterial transparent opacity={0} />
  </mesh>
);

// --- HOLOGRAPHIC OVERLAY (The Cognitive Shield) ---
const Hologram = () => {
  const ref = useRef<THREE.Mesh>(null!);
  const voltage = useStore((state) => state.voltage);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Rotate based on "Invariant Parameter I" (1/3 ratio logic)
    ref.current.rotation.x = t * 0.33;
    ref.current.rotation.y = t * 0.1;

    // "Breathe" based on voltage
    const scale = 1 + Math.sin(t * 2) * (voltage / 2000);
    ref.current.scale.set(scale, scale, scale);
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[2.5, 1]} />
      <meshBasicMaterial
        color={voltage > 80 ? '#ef4444' : '#fbbf24'} // Red if High Voltage, else Amber
        wireframe
        transparent
        opacity={0.15}
      />
    </mesh>
  );
};

// --- POST-PROCESSING & BIO-FEEDBACK VISUALS ---
const Effects = () => {
  const voltage = useStore((state) => state.voltage);
  const isHighVoltage = voltage > 90;

  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} intensity={0.5} />
      <Glitch
        delay={new THREE.Vector2(1.5, 3.5)}
        duration={new THREE.Vector2(0.2, 0.5)}
        strength={new THREE.Vector2(0.05, 0.1)}
        active={isHighVoltage} // Only glitch when voltage is critical
      />
    </EffectComposer>
  );
};

export const CreationPipeline = () => {
  const voltage = useStore((state) => state.voltage);
  const setMode = useStore((state) => state.setMode);
  const { speak } = useTrimtab();
  const { scene } = useThree(); // We need access to the scene for the exporter

  const voltageColor =
    voltage > 80 ? 'text-red-500 animate-pulse' : 'text-cyan-400';

  const handleMaterialize = useCallback(async () => {
    speak("Initiating fabrication sequence. Stand by.");
    setMode('SLICE');

    try {
      speak("Accessing Foundry. Processing geometry.");
      const gcode = await materializeObject(scene);

      // Create a blob from the G-code string and trigger a download
      const blob = new Blob([gcode], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'phenix_artifact.gcode';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      speak("Fabrication file generated. You have altered the physical universe.");
    } catch (error) {
      console.error("Fabrication Error:", error);
      speak("Error in foundry. Check reactor containment.");
    }
  }, [speak, setMode, scene]);

  return (
    <div className="w-full h-screen bg-slate-950 relative font-mono">
      {/* UI OVERLAY (Glassmorphism) */}
      <div className="absolute top-0 left-0 w-full z-10 p-6 flex justify-between pointer-events-none">
        <div className="glass-panel p-4 rounded-xl pointer-events-auto border border-cyan-500/30 backdrop-blur-md bg-slate-900/50">
          <h1 className="text-3xl font-bold text-amber-400 tracking-widest">
            PHENIX CREATOR
          </h1>
          <div className="text-xs text-cyan-400 tracking-[0.3em] mt-1">
            OPERATOR: ONLINE
          </div>
        </div>

        {/* TELEMETRY */}
        <div className="glass-panel p-4 rounded-xl text-right border border-red-500/30 backdrop-blur-md bg-slate-900/50">
          <div className={`text-4xl font-mono font-bold ${voltageColor}`}>
            {voltage}mV
          </div>
          <div className="text-[10px] text-slate-400 uppercase">
            SYSTEM ENTROPY
          </div>
        </div>
      </div>

      {/* 3D ENGINE */}
      {/* We must wrap the Canvas content to use the useThree hook */}
      <Canvas shadows camera={{ position: [5, 5, 5], fov: 50 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#22d3ee" />
        <gridHelper args={[100, 100, '#1e293b', '#0f172a']} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} />
        <Ground />
        <VoxelWorld />
        <Hologram />
        <OrbitControls makeDefault />
        <Effects />
      </Canvas>

      {/* ACTION DECK (Gamified Interaction) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 w-96">
        <button
          onClick={handleMaterialize}
          className="w-full py-4 bg-cyan-950/90 border border-cyan-500 text-cyan-400 font-bold tracking-[0.3em] hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all"
          style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0 100%)' }}
        >
          &gt;&gt;&gt; MATERIALIZE OBJECT &lt;&lt;&lt;
        </button>
      </div>
    </div>
  );
};