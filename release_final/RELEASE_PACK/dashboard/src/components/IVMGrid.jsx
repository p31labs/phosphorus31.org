import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';
import MagicMushroom from './MagicMushroom';
import QuantumBurstEffect from './QuantumBurstEffect'; // Import the new effect
import { useAudioFeedback } from '../useAudioFeedback';

// Extend Three.js with the LineGeometry and LineMaterial
extend({ LineMaterial: THREE.LineBasicMaterial, LineGeometry: THREE.BufferGeometry });

const Tetrahedron = ({ position, color, rotation, size = 1 }) => {
  const meshRef = useRef();

  useFrame(() => {
    // Optional: Add some subtle animation
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.001;
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <mesh position={position} rotation={rotation} ref={meshRef}>
      <tetrahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color={color} flatShading />
    </mesh>
  );
};

const IVMGrid = ({ coherence, ivmState, setIvmState, addLog, audioEnabled, playPowerUpTone }) => {
  const [magicMushrooms, setMagicMushrooms] = useState([
    { id: 'm1', position: [3, 0.5, -2], collected: false },
    { id: 'm2', position: [-4, 1, 1], collected: false },
    { id: 'm3', position: [0, -2, 3], collected: false },
  ]);
  const [activeBursts, setActiveBursts] = useState([]); // State to manage active quantum burst effects


  const handleMushroomCollect = useCallback((id, position) => {
    setMagicMushrooms((prev) =>
      prev.map((m) => (m.id === id ? { ...m, collected: true } : m))
    );
    addLog(`Insight Node ${id} collected!`);
    // TODO: Future - Trigger fetching a specific insight/summary from GENNESIS based on this node
    // Example: appsScriptApi(accessToken).getInsight(id).then(insight => addLog(insight.summary));
    if (audioEnabled) {
      playPowerUpTone();
    }
    // Trigger a quantum burst effect at the mushroom's position
    const burstId = Date.now();
    setActiveBursts((prev) => [...prev, { id: burstId, position }]);
    // Schedule removal of the burst effect after its duration
    setTimeout(() => {
      setActiveBursts((prev) => prev.filter((burst) => burst.id !== burstId));
    }, 800); // Match QuantumBurstEffect's default duration
  }, [addLog, audioEnabled, playPowerUpTone]);

  return (
    <>

      {ivmState.map(t => (
        <Tetrahedron key={t.id} {...t} />
      ))}

      {magicMushrooms.map((mushroom) => (
        !mushroom.collected && (
          <MagicMushroom
            key={mushroom.id}
            position={mushroom.position}
            onClick={() => handleMushroomCollect(mushroom.id, mushroom.position)}
          />
        )
      ))}

      {/* Render active quantum burst effects */}
      {activeBursts.map((burst) => (
        <QuantumBurstEffect key={burst.id} position={burst.position} />
      ))}

      {/* Basic light sources */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      {/* OrbitControls for user camera interaction */}
      <OrbitControls />
    </>
  );
};

export default IVMGrid;
