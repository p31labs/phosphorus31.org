/**
 * TETRAHEDRON NAVIGATION - 3D Spatial Interface
 * 
 * Replaces traditional lists/feeds with geometric navigation.
 * Four vertices represent four navigation nodes.
 * Click/tap a vertex to navigate to that section.
 * 
 * Implements G.O.D. Protocol: Geometric navigation, no lists.
 */

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Text } from '@react-three/drei';
import * as THREE from 'three';
import GOD_CONFIG from '../../config/god.config';

interface NavigationNode {
  id: string;
  label: string;
  icon?: string;
  color: string;
  position: THREE.Vector3;
  onClick: () => void;
}

interface TetrahedronNavigationProps {
  nodes: NavigationNode[];
  size?: number;
  onNodeSelect?: (nodeId: string) => void;
}

// Generate tetrahedron vertices
function generateTetrahedronVertices(size: number): THREE.Vector3[] {
  return [
    new THREE.Vector3(1, 1, 1).normalize().multiplyScalar(size),
    new THREE.Vector3(1, -1, -1).normalize().multiplyScalar(size),
    new THREE.Vector3(-1, 1, -1).normalize().multiplyScalar(size),
    new THREE.Vector3(-1, -1, 1).normalize().multiplyScalar(size),
  ];
}

export function TetrahedronNavigation({
  nodes,
  size = 3,
  onNodeSelect,
}: TetrahedronNavigationProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Ensure exactly 4 nodes (tetrahedron constraint)
  const tetraNodes = nodes.slice(0, 4);
  const vertices = generateTetrahedronVertices(size);

  // Map nodes to vertices
  const nodePositions = tetraNodes.map((node, i) => ({
    ...node,
    position: vertices[i] || node.position,
  }));

  useFrame((state) => {
    if (!groupRef.current) return;

    // Gentle rotation
    groupRef.current.rotation.y += 0.005;

    // Breathing pulse at 0.1 Hz (vagal tone)
    const breathingPhase = (state.clock.elapsedTime * 0.1 * Math.PI * 2) % (Math.PI * 2);
    const breath = Math.sin(breathingPhase) * 0.05 + 1.0;
    groupRef.current.scale.setScalar(breath);
  });

  const handleNodeClick = (node: NavigationNode) => {
    node.onClick();
    if (onNodeSelect) {
      onNodeSelect(node.id);
    }
  };

  return (
    <group ref={groupRef}>
      {/* Edges */}
      {vertices.map((v1, i) => {
        return vertices.slice(i + 1).map((v2, j) => (
          <line key={`edge-${i}-${i + j + 1}`}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={2}
                array={new Float32Array([...v1.toArray(), ...v2.toArray()])}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color={GOD_CONFIG.theme.border.default}
              opacity={0.3}
              transparent
            />
          </line>
        ));
      })}

      {/* Nodes */}
      {nodePositions.map((node) => {
        const isHovered = hoveredNode === node.id;
        const nodeSize = isHovered ? 0.3 : 0.2;

        return (
          <group key={node.id} position={node.position.toArray()}>
            {/* Node sphere */}
            <mesh
              onClick={() => handleNodeClick(node)}
              onPointerOver={() => setHoveredNode(node.id)}
              onPointerOut={() => setHoveredNode(null)}
            >
              <sphereGeometry args={[nodeSize, 16, 16]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={isHovered ? 1.0 : 0.5}
              />
            </mesh>

            {/* Label */}
            <Html
              position={[0, nodeSize + 0.5, 0]}
              center
              style={{
                pointerEvents: 'none',
                userSelect: 'none',
              }}
            >
              <div
                style={{
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  color: node.color,
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  border: `1px solid ${node.color}`,
                  whiteSpace: 'nowrap',
                  transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform 0.2s',
                }}
              >
                {node.icon && <span style={{ marginRight: '4px' }}>{node.icon}</span>}
                {node.label}
              </div>
            </Html>
          </group>
        );
      })}

      {/* Center indicator */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color={GOD_CONFIG.theme.text.accent}
          emissive={GOD_CONFIG.theme.text.accent}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
