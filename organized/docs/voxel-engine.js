// Voxel Engine - High Performance InstancedMesh System
import React, { useRef, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './game-store';

// Voxel Block Component
export const VoxelWorld = ({ mode = 'BUILDING' }) => {
  const meshRef = useRef();
  const blocksRef = useRef(new Map());
  const store = useGameStore();
  
  // Get current blocks from store
  const blocks = store.blocks;
  const selectedBlockType = store.selectedBlockType;
  
  // Update InstancedMesh when blocks change
  useEffect(() => {
    if (!meshRef.current) return;
    
    const mesh = meshRef.current;
    mesh.count = blocks.size;
    
    let i = 0;
    const tempObject = new THREE.Object3D();
    
    blocks.forEach((blockData, key) => {
      const { position, color, type } = blockData;
      
      // Set position
      tempObject.position.set(position[0], position[1], position[2]);
      tempObject.updateMatrix();
      mesh.setMatrixAt(i, tempObject.matrix);
      
      // Set color based on block type
      const colorObj = new THREE.Color(color);
      mesh.setColorAt(i, colorObj);
      
      i++;
    });
    
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [blocks]);
  
  // Raycasting and Interaction
  const handleBlockClick = (event) => {
    if (mode !== 'BUILDING') return;
    
    const { point, face } = event;
    
    // Calculate voxel position based on face normal
    const pos = new THREE.Vector3().copy(point).add(face.normal.multiplyScalar(0.5)).floor();
    const position = [Math.round(pos.x), Math.round(pos.y), Math.round(pos.z)];
    
    if (event.altKey) {
      // Remove block
      store.removeBlock(position);
    } else {
      // Add block
      store.addBlock(position, selectedBlockType);
    }
  };
  
  // Visual feedback for selected block type
  const selectedColor = useMemo(() => {
    return new THREE.Color(store.blockTypes[selectedBlockType].color);
  }, [selectedBlockType]);
  
  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, 10000]} // Max 10k blocks
      onClick={handleBlockClick}
      onPointerOver={(e) => {
        // Highlight effect on hover
        e.object.material.emissive = new THREE.Color(0xffffff);
        e.object.material.emissiveIntensity = 0.5;
      }}
      onPointerOut={(e) => {
        // Reset highlight
        e.object.material.emissiveIntensity = 0;
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color="#10b981"
        roughness={0.4}
        metalness={0.1}
        emissive="#000000"
        emissiveIntensity={0}
      />
    </instancedMesh>
  );
};

// Floating Block Preview (Ghost Block)
export const FloatingBlockPreview = () => {
  const store = useGameStore();
  const [hoveredPosition, setHoveredPosition] = React.useState(null);
  const [isHovering, setIsHovering] = React.useState(false);
  
  // Raycasting to show where block will be placed
  const handlePointerMove = (event) => {
    const { point, face } = event;
    if (!face) {
      setIsHovering(false);
      return;
    }
    
    // Calculate placement position
    const pos = new THREE.Vector3().copy(point).add(face.normal.multiplyScalar(0.5)).floor();
    const position = [Math.round(pos.x), Math.round(pos.y), Math.round(pos.z)];
    
    setHoveredPosition(position);
    setIsHovering(true);
  };
  
  const handlePointerOut = () => {
    setIsHovering(false);
  };
  
  if (!isHovering || !hoveredPosition) return null;
  
  const color = store.blockTypes[store.selectedBlockType].color;
  
  return (
    <mesh
      position={hoveredPosition}
      onPointerMove={handlePointerMove}
      onPointerOut={handlePointerOut}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.3}
        wireframe={true}
      />
    </mesh>
  );
};

// Geodesic Dome Generator
export const GeodesicDome = ({ radius = 10, frequency = 2 }) => {
  const meshRef = useRef();
  const store = useGameStore();
  
  // Generate geodesic vertices
  const vertices = useMemo(() => {
    const vertices = [];
    const geometry = new THREE.IcosahedronGeometry(radius, frequency);
    
    geometry.attributes.position.array.forEach((val, i) => {
      if (i % 3 === 0) {
        vertices.push([
          geometry.attributes.position.array[i],
          geometry.attributes.position.array[i + 1],
          geometry.attributes.position.array[i + 2]
        ]);
      }
    });
    
    return vertices;
  }, [radius, frequency]);
  
  // Update dome based on shield integrity
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const shield = store.shield;
    const opacity = shield.integrity / 100;
    
    meshRef.current.material.opacity = opacity;
    meshRef.current.material.color.setHSL(0.3, 1, 0.5 + (shield.coherence - 0.5));
  });
  
  return (
    <mesh ref={meshRef} visible={store.ui.showStats}>
      <sphereGeometry args={[radius, 32, 32]} />
      <meshBasicMaterial
        color="#3b82f6"
        transparent
        opacity={0.3}
        wireframe={true}
      />
    </mesh>
  );
};

// Physics System for "Heavy Work" (Cognitive Regulation)
export const PhysicsBlocks = () => {
  const store = useGameStore();
  
  // Apply physics to blocks for realistic interaction
  useFrame(() => {
    // This would integrate with @react-three/cannon for physics
    // For now, we'll simulate weight through visual feedback
  });
  
  return null; // Physics handled by separate system
};

// Block Types UI Component
export const BlockSelector = () => {
  const store = useGameStore();
  const { blockTypes, selectedBlockType, setSelectedBlockType } = store;
  
  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
      {Object.entries(blockTypes).map(([key, block]) => (
        <button
          key={key}
          onClick={() => setSelectedBlockType(key)}
          className={`px-4 py-2 rounded border-2 font-mono text-xs transition-all ${
            selectedBlockType === key
              ? 'border-white bg-white text-black'
              : 'border-gray-600 hover:border-white'
          }`}
          style={{
            backgroundColor: selectedBlockType === key ? block.color : 'transparent',
            color: selectedBlockType === key ? 'white' : block.color
          }}
        >
          {block.name}
        </button>
      ))}
    </div>
  );
};

// Resource Display (Posner Clusters)
export const ResourceDisplay = () => {
  const store = useGameStore();
  const { shield } = store;
  
  return (
    <div className="absolute top-24 right-8 z-20 text-right">
      <div className="text-xs text-gray-400 mb-1">RESOURCES</div>
      <div className="flex items-center gap-2 text-yellow-400">
        <span className="text-2xl">🔸</span>
        <span className="font-mono">{shield.posnerClusters}</span>
        <span className="text-xs text-gray-500">Posner Clusters</span>
      </div>
    </div>
  );
};