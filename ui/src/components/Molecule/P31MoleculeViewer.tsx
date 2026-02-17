/**
 * P31 Molecule Viewer
 * Enhanced viewer for P31 (Phosphorus-31) molecules with tetrahedron visualization
 *
 * Built with love and light. As above, so below. 💜
 *
 * @license
 * Copyright 2026 Wonky Sprout DUNA
 * Licensed under the AGPLv3 License
 */

import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Text, Html } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { Mesh, Vector3 } from 'three';
import './P31MoleculeViewer.css';

interface TetrahedronVertex {
  id: string;
  name: string;
  position: [number, number, number];
  color: string;
}

// P31 Tetrahedron Structure
const P31_TETRAHEDRON: TetrahedronVertex[] = [
  { id: 'operator', name: 'Operator', position: [0, 1.633, 0], color: '#FF6B6B' },
  { id: 'synthetic', name: 'Synthetic Body', position: [-1.414, -0.816, 0], color: '#4ECDC4' },
  { id: 'node1', name: 'Node One', position: [1.414, -0.816, 0], color: '#45B7D1' },
  { id: 'node2', name: 'Node Two', position: [0, -0.816, 2], color: '#FFA07A' },
];

// Edges of the tetrahedron
const EDGES = [
  [0, 1],
  [0, 2],
  [0, 3], // From operator
  [1, 2],
  [1, 3],
  [2, 3], // Base triangle
];

// P31 Atom (Phosphorus-31) at center
const P31_CENTER: Vector3 = new Vector3(0, 0, 0);

function TetrahedronVertex3D({
  vertex,
  index,
  selected,
  onSelect,
}: {
  vertex: TetrahedronVertex;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const position = new Vector3(...vertex.position);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle rotation
      meshRef.current.rotation.y += 0.001;
      // Pulse effect
      const pulse = Math.sin(state.clock.elapsedTime * 2 + index) * 0.1 + 1;
      meshRef.current.scale.setScalar(selected ? pulse * 1.3 : pulse);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        onClick={onSelect}
      >
        <sphereGeometry args={[selected ? 0.4 : 0.3, 32, 32]} />
        <meshStandardMaterial
          color={vertex.color}
          emissive={vertex.color}
          emissiveIntensity={selected ? 1.0 : hovered ? 0.8 : 0.3}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {selected && (
        <mesh position={[0, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 32]} />
          <meshStandardMaterial
            color={vertex.color}
            transparent
            opacity={0.5}
            emissive={vertex.color}
            emissiveIntensity={0.3}
          />
        </mesh>
      )}
      <Text
        position={[0, 0.6, 0]}
        fontSize={0.2}
        color={vertex.color}
        anchorX="center"
        anchorY="middle"
        fontWeight={selected ? 'bold' : 'normal'}
      >
        {vertex.name}
      </Text>
    </group>
  );
}

function Edge3D({
  start,
  end,
  color,
  index,
  selected,
  onSelect,
}: {
  start: Vector3;
  end: Vector3;
  color: string;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const midpoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);
  const length = start.distanceTo(end);
  const direction = new Vector3().subVectors(end, start).normalize();
  const up = new Vector3(0, 1, 0);
  const axis = new Vector3().crossVectors(up, direction);
  const angle = Math.acos(Math.max(-1, Math.min(1, up.dot(direction))));

  return (
    <group>
      <mesh
        position={midpoint}
        rotation={[angle, 0, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
        onClick={onSelect}
      >
        <cylinderGeometry args={[selected ? 0.08 : 0.05, selected ? 0.08 : 0.05, length, 8]} />
        <meshStandardMaterial
          color={selected ? '#FFFF00' : color}
          emissive={selected ? '#FFFF00' : color}
          emissiveIntensity={selected ? 0.6 : 0.2}
          metalness={0.5}
          roughness={0.3}
        />
      </mesh>
      {selected && (
        <Text
          position={[midpoint.x, midpoint.y + 0.3, midpoint.z]}
          fontSize={0.15}
          color="#FFFF00"
          anchorX="center"
          anchorY="middle"
        >
          Edge {index + 1}
        </Text>
      )}
    </group>
  );
}

function Face3D({ vertices, faceIndex }: { vertices: Vector3[]; faceIndex: number }) {
  const positions = vertices.map((v) => [v.x, v.y, v.z]).flat();

  return (
    <mesh>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={3}
          array={new Float32Array(positions)}
          itemSize={3}
        />
      </bufferGeometry>
      <meshStandardMaterial
        color="#667eea"
        transparent
        opacity={0.1}
        side={2} // DoubleSide
      />
    </mesh>
  );
}

function P31Atom3D() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Quantum coherence visualization - pulsing
      const pulse = Math.sin(state.clock.elapsedTime * 3) * 0.15 + 1;
      meshRef.current.scale.setScalar(pulse);
      meshRef.current.rotation.y += 0.02;
    }
  });

  return (
    <group position={P31_CENTER}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial
          color="#FF4000"
          emissive="#FF4000"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Quantum coherence ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.6, 32]} />
        <meshStandardMaterial
          color="#00FFFF"
          transparent
          opacity={0.6}
          emissive="#00FFFF"
          emissiveIntensity={0.4}
        />
      </mesh>
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.25}
        color="#FF4000"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        P31
      </Text>
    </group>
  );
}

interface StructuralMetrics {
  edgeLengths: number[];
  faceAreas: number[];
  volume: number;
  surfaceArea: number;
  angles: number[];
}

function calculateStructuralMetrics(): StructuralMetrics {
  const vertices = P31_TETRAHEDRON.map((v) => new Vector3(...v.position));

  // Calculate edge lengths
  const edgeLengths = EDGES.map(([i, j]) => vertices[i].distanceTo(vertices[j]));

  // Calculate face areas (triangles)
  const faceAreas: number[] = [];
  const faces = [
    [0, 1, 2],
    [0, 1, 3],
    [0, 2, 3],
    [1, 2, 3],
  ];

  faces.forEach(([i, j, k]) => {
    const v1 = vertices[i];
    const v2 = vertices[j];
    const v3 = vertices[k];
    const a = v1.distanceTo(v2);
    const b = v2.distanceTo(v3);
    const c = v3.distanceTo(v1);
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    faceAreas.push(area);
  });

  // Calculate volume (tetrahedron volume formula)
  const v0 = vertices[0];
  const v1 = vertices[1];
  const v2 = vertices[2];
  const v3 = vertices[3];
  const volume = Math.abs(
    v1
      .clone()
      .sub(v0)
      .dot(v2.clone().sub(v0).cross(v3.clone().sub(v0))) / 6
  );

  // Calculate surface area
  const surfaceArea = faceAreas.reduce((sum, area) => sum + area, 0);

  // Calculate angles at each vertex
  const angles: number[] = [];
  vertices.forEach((vertex, idx) => {
    const connected = EDGES.filter(([i, j]) => i === idx || j === idx).map(([i, j]) =>
      i === idx ? vertices[j] : vertices[i]
    );

    if (connected.length >= 2) {
      const v1 = connected[0].clone().sub(vertex);
      const v2 = connected[1].clone().sub(vertex);
      const angle =
        Math.acos(Math.max(-1, Math.min(1, v1.normalize().dot(v2.normalize())))) * (180 / Math.PI);
      angles.push(angle);
    }
  });

  return { edgeLengths, faceAreas, volume, surfaceArea, angles };
}

export function P31MoleculeViewer() {
  const [selectedVertex, setSelectedVertex] = useState<TetrahedronVertex | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(true);
  const [showMetrics, setShowMetrics] = useState(true);
  const [viewMode, setViewMode] = useState<'full' | 'edges' | 'faces' | 'vertices'>('full');
  const [metrics] = useState<StructuralMetrics>(calculateStructuralMetrics());

  return (
    <div className="p31-molecule-viewer">
      <div className="viewer-header">
        <h1>🔺 P31 Molecule 💜</h1>
        <p className="subtitle">Tetrahedron Structure - The Mesh Holds</p>
        <button className="info-toggle" onClick={() => setShowInfo(!showInfo)}>
          {showInfo ? 'Hide Info' : 'Show Info'}
        </button>
      </div>

      <div className="viewer-controls">
        <div className="control-group">
          <label>View Mode:</label>
          <select value={viewMode} onChange={(e) => setViewMode(e.target.value as any)}>
            <option value="full">Full Structure</option>
            <option value="vertices">Vertices Only</option>
            <option value="edges">Edges Only</option>
            <option value="faces">Faces Only</option>
          </select>
        </div>
        <button className="control-button" onClick={() => setShowInfo(!showInfo)}>
          {showInfo ? 'Hide Info' : 'Show Info'}
        </button>
        <button className="control-button" onClick={() => setShowMetrics(!showMetrics)}>
          {showMetrics ? 'Hide Metrics' : 'Show Metrics'}
        </button>
      </div>

      {showInfo && (
        <div className="molecule-info-panel">
          <div className="info-section">
            <h3>P31 Structure</h3>
            <p>
              <strong>Formula:</strong> P31 (Phosphorus-31)
            </p>
            <p>
              <strong>Topology:</strong> Tetrahedron (K₄)
            </p>
            <p>
              <strong>Vertices:</strong> 4 (Operator, Synthetic Body, Node One, Node Two)
            </p>
            <p>
              <strong>Edges:</strong> 6 (All vertices connected)
            </p>
            <p>
              <strong>Faces:</strong> 4 (Triangular faces)
            </p>
          </div>
          <div className="info-section">
            <h3>Quantum Properties</h3>
            <p>
              <strong>Spin:</strong> 1/2 (Nuclear spin)
            </p>
            <p>
              <strong>Coherence:</strong> High (visualized as pulsing)
            </p>
            <p>
              <strong>Role:</strong> Biological qubit in Posner molecules
            </p>
          </div>
          <div className="info-section">
            <h3>P31 Ecosystem</h3>
            <p>Each vertex represents a core component:</p>
            <ul>
              <li>
                <strong>Operator:</strong> Human operator
              </li>
              <li>
                <strong>Synthetic Body:</strong> AI/Protocol system
              </li>
              <li>
                <strong>Node One:</strong> Hardware device (ESP32-S3)
              </li>
              <li>
                <strong>Node Two:</strong> Additional node
              </li>
            </ul>
          </div>
        </div>
      )}

      {showMetrics && (
        <div className="metrics-panel">
          <div className="metrics-section">
            <h3>Structural Metrics</h3>
            <div className="metric-grid">
              <div className="metric-item">
                <span className="metric-label">Volume:</span>
                <span className="metric-value">{metrics.volume.toFixed(3)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Surface Area:</span>
                <span className="metric-value">{metrics.surfaceArea.toFixed(3)}</span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Avg Edge Length:</span>
                <span className="metric-value">
                  {(
                    metrics.edgeLengths.reduce((a, b) => a + b, 0) / metrics.edgeLengths.length
                  ).toFixed(3)}
                </span>
              </div>
              <div className="metric-item">
                <span className="metric-label">Avg Face Area:</span>
                <span className="metric-value">
                  {(
                    metrics.faceAreas.reduce((a, b) => a + b, 0) / metrics.faceAreas.length
                  ).toFixed(3)}
                </span>
              </div>
            </div>
          </div>
          {selectedVertex && (
            <div className="selected-info">
              <h4>Selected: {selectedVertex.name}</h4>
              <p>Position: ({selectedVertex.position.join(', ')})</p>
              <p>Color: {selectedVertex.color}</p>
            </div>
          )}
          {selectedEdge !== null && (
            <div className="selected-info">
              <h4>Selected Edge: {selectedEdge + 1}</h4>
              <p>Length: {metrics.edgeLengths[selectedEdge].toFixed(3)}</p>
              <p>
                Connects: {P31_TETRAHEDRON[EDGES[selectedEdge][0]].name} ↔{' '}
                {P31_TETRAHEDRON[EDGES[selectedEdge][1]].name}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="viewer-canvas">
        <Canvas camera={{ position: [5, 5, 5], fov: 50 }} shadows dpr={[1, 2]}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
          <pointLight position={[-10, -10, -5]} intensity={0.3} />

          <Environment preset="sunset" />

          <OrbitControls enableDamping dampingFactor={0.05} minDistance={3} maxDistance={20} />

          {/* Render faces */}
          {(viewMode === 'full' || viewMode === 'faces') && (
            <>
              {[
                [0, 1, 2],
                [0, 1, 3],
                [0, 2, 3],
                [1, 2, 3],
              ].map((face, idx) => (
                <Face3D
                  key={idx}
                  vertices={face.map((i) => new Vector3(...P31_TETRAHEDRON[i].position))}
                  faceIndex={idx}
                />
              ))}
            </>
          )}

          {/* Render edges */}
          {(viewMode === 'full' || viewMode === 'edges') && (
            <>
              {EDGES.map(([i, j], idx) => (
                <Edge3D
                  key={idx}
                  start={new Vector3(...P31_TETRAHEDRON[i].position)}
                  end={new Vector3(...P31_TETRAHEDRON[j].position)}
                  color="#667eea"
                  index={idx}
                  selected={selectedEdge === idx}
                  onSelect={() => setSelectedEdge(selectedEdge === idx ? null : idx)}
                />
              ))}
            </>
          )}

          {/* Render vertices */}
          {(viewMode === 'full' || viewMode === 'vertices') && (
            <>
              {P31_TETRAHEDRON.map((vertex, index) => (
                <TetrahedronVertex3D
                  key={vertex.id}
                  vertex={vertex}
                  index={index}
                  selected={selectedVertex?.id === vertex.id}
                  onSelect={() => {
                    setSelectedVertex(selectedVertex?.id === vertex.id ? null : vertex);
                    setSelectedEdge(null);
                  }}
                />
              ))}
            </>
          )}

          {/* P31 Atom at center */}
          <P31Atom3D />
        </Canvas>
      </div>

      <div className="viewer-footer">
        <p>💜 With love and light. As above, so below. 💜</p>
        <p>The Mesh Holds. 🔺</p>
      </div>
    </div>
  );
}

export default P31MoleculeViewer;
