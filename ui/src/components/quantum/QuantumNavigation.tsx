/**
 * @license
 * Copyright 2026 P31 Labs
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 */

/**
 * ╔═══════════════════════════════════════════════════════════════════════════════╗
 * ║                    QUANTUM NAVIGATION SYSTEM                                  ║
 * ║         Spatial UI Navigation Based on Tetrahedron Topology                   ║
 * ║                                                                                 ║
 * ║  "Navigate through quantum states, not lists."                                ║
 * ╚═══════════════════════════════════════════════════════════════════════════════╝
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useQuantumStore, type NodeId } from '../../stores/quantum.store';
import { QuantumEntanglementVisualization } from './QuantumEntanglementVisualization';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

export interface NavigationTarget {
  id: string;
  nodeId: NodeId;
  label: string;
  position: [number, number, number];
  component?: React.ComponentType;
  icon?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION TARGETS
// ═══════════════════════════════════════════════════════════════════════════════

const NAVIGATION_TARGETS: NavigationTarget[] = [
  { id: 'self', nodeId: 'A', label: 'Self', position: [0, 1.5, 0], icon: '🧭' },
  { id: 'other', nodeId: 'B', label: 'Other', position: [1.414, -0.5, 0], icon: '👤' },
  { id: 'context', nodeId: 'C', label: 'Context', position: [-0.707, -0.5, 1.225], icon: '🌍' },
  { id: 'engine', nodeId: 'D', label: 'Engine', position: [-0.707, -0.5, -1.225], icon: '⚙️' },
];

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION MARKER
// ═══════════════════════════════════════════════════════════════════════════════

interface NavigationMarkerProps {
  target: NavigationTarget;
  isActive: boolean;
  onClick: () => void;
}

function NavigationMarker({ target, isActive, onClick }: NavigationMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime;
    }
    if (ringRef.current && isActive) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2;
      ringRef.current.scale.setScalar(scale);
    }
  });
  
  const nodeState = useQuantumStore((state) => state.nodeStates[target.nodeId]);
  
  return (
    <group position={target.position}>
      {/* Clickable sphere */}
      <mesh ref={meshRef} onClick={onClick} onPointerOver={() => {}} onPointerOut={() => {}}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshStandardMaterial
          color={isActive ? '#00ff88' : '#7c3aed'}
          emissive={isActive ? '#00ff88' : '#7c3aed'}
          emissiveIntensity={nodeState.coherence * 0.5}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Active ring */}
      {isActive && (
        <mesh ref={ringRef}>
          <torusGeometry args={[0.35, 0.02, 16, 32]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.8} />
        </mesh>
      )}
      
      {/* Label */}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {target.label}
      </Text>
      
      {/* Icon */}
      {target.icon && (
        <Text
          position={[0, -0.1, 0]}
          fontSize={0.3}
          anchorX="center"
          anchorY="middle"
        >
          {target.icon}
        </Text>
      )}
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CAMERA CONTROLLER
// ═══════════════════════════════════════════════════════════════════════════════

interface CameraControllerProps {
  target: NavigationTarget | null;
}

function CameraController({ target }: CameraControllerProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  
  useFrame(() => {
    if (cameraRef.current && target) {
      // Smooth camera transition to target
      const targetPos = new THREE.Vector3(...target.position);
      targetPos.multiplyScalar(2.5); // Move camera away from target
      
      cameraRef.current.position.lerp(targetPos, 0.05);
      cameraRef.current.lookAt(new THREE.Vector3(...target.position));
    }
  });
  
  return <PerspectiveCamera ref={cameraRef} makeDefault position={[3, 3, 3]} fov={50} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface QuantumNavigationProps {
  onNavigate?: (target: NavigationTarget) => void;
  initialTarget?: string;
}

export function QuantumNavigation({ onNavigate, initialTarget }: QuantumNavigationProps) {
  const [activeTarget, setActiveTarget] = useState<string | null>(initialTarget || null);
  const [selectedTarget, setSelectedTarget] = useState<NavigationTarget | null>(null);
  
  const handleNodeClick = useCallback(
    (nodeId: NodeId) => {
      const target = NAVIGATION_TARGETS.find((t) => t.nodeId === nodeId);
      if (target) {
        setActiveTarget(target.id);
        setSelectedTarget(target);
        onNavigate?.(target);
        
        // Trigger haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate(50);
        }
      }
    },
    [onNavigate]
  );
  
  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '1') handleNodeClick('A');
      if (e.key === '2') handleNodeClick('B');
      if (e.key === '3') handleNodeClick('C');
      if (e.key === '4') handleNodeClick('D');
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleNodeClick]);
  
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas>
        <CameraController target={selectedTarget} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.5} color="#7c3aed" />
        
        {/* Quantum entanglement visualization */}
        <QuantumEntanglementVisualization interactive onNodeClick={handleNodeClick} />
        
        {/* Navigation markers */}
        {NAVIGATION_TARGETS.map((target) => (
          <NavigationMarker
            key={target.id}
            target={target}
            isActive={activeTarget === target.id}
            onClick={() => handleNodeClick(target.nodeId)}
          />
        ))}
        
        {/* Grid helper */}
        <gridHelper args={[10, 10, '#333333', '#222222']} />
        
        {/* Controls */}
        <OrbitControls
          enableZoom
          enablePan
          minDistance={2}
          maxDistance={10}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>
      
      {/* Navigation overlay */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 10,
          padding: '10px 20px',
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 10,
          backdropFilter: 'blur(10px)',
        }}
      >
        {NAVIGATION_TARGETS.map((target) => (
          <button
            key={target.id}
            onClick={() => handleNodeClick(target.nodeId)}
            style={{
              padding: '8px 16px',
              background: activeTarget === target.id ? '#00ff88' : 'transparent',
              border: `2px solid ${activeTarget === target.id ? '#00ff88' : '#7c3aed'}`,
              borderRadius: 8,
              color: '#ffffff',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: activeTarget === target.id ? 'bold' : 'normal',
            }}
          >
            {target.icon} {target.label}
          </button>
        ))}
      </div>
      
      {/* Keyboard hints */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          padding: '10px',
          background: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 8,
          color: '#ffffff',
          fontSize: 12,
          fontFamily: 'monospace',
        }}
      >
        <div>Press 1-4 to navigate</div>
        <div>Click nodes to select</div>
      </div>
    </div>
  );
}

export default QuantumNavigation;
