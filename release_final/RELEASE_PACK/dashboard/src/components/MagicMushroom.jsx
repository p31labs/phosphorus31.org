import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MagicMushroom = ({ position, onClick }) => {
  const meshRef = useRef();
  const [collected, setCollected] = useState(false);

  // Basic mushroom geometry
  const capGeometry = new THREE.SphereGeometry(0.7, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
  const stemGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 32);

  useFrame(() => {
    if (meshRef.current && !collected) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.002) * 0.1;
    }
  });

  const handleClick = () => {
    if (!collected) {
      setCollected(true);
      if (onClick) {
        onClick(); // Trigger parent's onClick handler
      }
    }
  };

  if (collected) return null; // Don't render if collected

  return (
    <group ref={meshRef} position={position} onClick={handleClick} dispose={null}>
      {/* Mushroom Cap (Red/Green with spots) */}
      <mesh position={[0, position[1] + 0.5, 0]}>
        <primitive object={capGeometry} />
        <meshStandardMaterial color="#FF4500" /> {/* Red cap */}
      </mesh>
      <mesh position={[0, position[1] + 0.5, 0]} rotation={[0,0,Math.PI]} scale={[0.8,0.8,0.8]}>
        <primitive object={capGeometry} />
        <meshStandardMaterial color="#32CD32" transparent opacity={0.5} /> {/* Green overlay */}
      </mesh>
      {/* White spots */}
      <mesh position={[0.3, position[1] + 0.7, 0.3]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-0.4, position[1] + 0.6, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0, position[1] + 0.7, -0.4]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Mushroom Stem */}
      <mesh position={[0, position[1] - 0.5, 0]}>
        <primitive object={stemGeometry} />
        <meshStandardMaterial color="#FFFFE0" /> {/* Cream stem */}
      </mesh>
    </group>
  );
};

export default MagicMushroom;
