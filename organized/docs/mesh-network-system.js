// Mesh Network System - The Swarm Integration
import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './game-store';
import * as THREE from 'three';

// The Swarm Visualization (The "Floating Neutral" Transformation)
export const SwarmVisualization = () => {
  const meshRef = useRef();
  const store = useGameStore();
  const { swarm } = store;
  
  // Generate swarm particles
  const particles = useRef([]);
  
  useEffect(() => {
    const count = 1000;
    particles.current = new Array(count).fill(0).map(() => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      ),
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1,
        (Math.random() - 0.5) * 0.1
      ),
      target: new THREE.Vector3(),
      phase: Math.random() // 0 to 1
    }));
  }, []);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const mesh = meshRef.current;
    const positions = mesh.geometry.attributes.position.array;
    
    particles.current.forEach((particle, i) => {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;
      
      // Phase transition logic
      if (swarm.active && swarm.phase === 'TRANSITION') {
        // Move towards geodesic sphere
        const radius = 15;
        const phi = Math.acos(-1 + (2 * i) / particles.current.length);
        const theta = Math.sqrt(particles.current.length * Math.PI) * phi;
        
        const targetX = radius * Math.cos(theta) * Math.sin(phi);
        const targetY = radius * Math.sin(theta) * Math.sin(phi);
        const targetZ = radius * Math.cos(phi);
        
        // Lerp towards target
        particle.position.x += (targetX - particle.position.x) * 0.01;
        particle.position.y += (targetY - particle.position.y) * 0.01;
        particle.position.z += (targetZ - particle.position.z) * 0.01;
      } else if (swarm.phase === 'CHAOS') {
        // Random drift
        particle.position.x += Math.sin(time + i) * 0.01;
        particle.position.y += Math.cos(time + i * 0.5) * 0.01;
        particle.position.z += Math.sin(time * 0.7 + i * 0.3) * 0.01;
      }
      
      // Update geometry
      positions[ix] = particle.position.x;
      positions[iy] = particle.position.y;
      positions[iz] = particle.position.z;
    });
    
    mesh.geometry.attributes.position.needsUpdate = true;
    
    // Visual effects based on swarm phase
    if (swarm.phase === 'CHAOS') {
      mesh.material.color.setHSL(0, 1, 0.5); // Red chaos
      mesh.material.opacity = 0.3;
    } else if (swarm.phase === 'TRANSITION') {
      mesh.material.color.setHSL(0.1, 1, 0.5); // Orange transition
      mesh.material.opacity = 0.6;
    } else {
      mesh.material.color.setHSL(0.3, 1, 0.5); // Blue order
      mesh.material.opacity = 0.2;
    }
  });
  
  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.current.length}
          array={new Float32Array(particles.current.length * 3)}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ef4444"
        transparent={true}
        opacity={0.3}
        sizeAttenuation={true}
      />
    </points>
  );
};

// Player Connection System
export const PlayerConnections = () => {
  const store = useGameStore();
  const connectionsRef = useRef([]);
  
  // Generate connected players
  useEffect(() => {
    const playerCount = store.network.connectedPlayers.length;
    connectionsRef.current = new Array(playerCount).fill(0).map((_, index) => ({
      id: store.network.connectedPlayers[index],
      position: new THREE.Vector3(
        Math.cos(index * 0.5) * 10,
        Math.sin(index * 0.5) * 10,
        Math.sin(index * 0.3) * 5
      ),
      rotation: new THREE.Euler(Math.random(), Math.random(), Math.random()),
      signalStrength: Math.random() * 100
    }));
  }, [store.network.connectedPlayers]);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    connectionsRef.current.forEach((player, index) => {
      // Orbit animation
      player.position.x = Math.cos(time * 0.5 + index) * 10;
      player.position.z = Math.sin(time * 0.5 + index) * 10;
      player.position.y = Math.sin(time * 0.3 + index * 0.5) * 5;
      
      // Rotation
      player.rotation.y += 0.01;
    });
  });
  
  return (
    <group>
      {connectionsRef.current.map((player, index) => (
        <PlayerNode
          key={player.id}
          position={player.position}
          rotation={player.rotation}
          signalStrength={player.signalStrength}
          index={index}
        />
      ))}
    </group>
  );
};

// Individual Player Node Component
const PlayerNode = ({ position, rotation, signalStrength, index }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Pulsing effect based on signal strength
    const pulse = 1 + Math.sin(time * 2 + index) * 0.2;
    meshRef.current.scale.set(pulse, pulse, pulse);
    
    // Color based on signal strength
    const hue = (signalStrength / 100) * 0.3; // Green to Blue
    meshRef.current.material.color.setHSL(hue, 1, 0.5);
    
    // Emissive intensity based on signal
    meshRef.current.material.emissive.setHSL(hue, 1, 0.3);
    meshRef.current.material.emissiveIntensity = signalStrength / 50;
  });
  
  return (
    <mesh ref={meshRef} position={position} rotation={rotation}>
      <icosahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#000000"
        emissiveIntensity={0.5}
        wireframe={true}
      />
    </mesh>
  );
};

// Connection Lines (The Mesh Network)
export const ConnectionLines = () => {
  const store = useGameStore();
  const linesRef = useRef([]);
  
  // Generate connection lines between players
  useEffect(() => {
    const players = store.network.connectedPlayers;
    const lines = [];
    
    // Create lines between all connected players (complete graph)
    for (let i = 0; i < players.length; i++) {
      for (let j = i + 1; j < players.length; j++) {
        lines.push({
          start: new THREE.Vector3(
            Math.cos(i * 0.5) * 10,
            Math.sin(i * 0.5) * 10,
            Math.sin(i * 0.3) * 5
          ),
          end: new THREE.Vector3(
            Math.cos(j * 0.5) * 10,
            Math.sin(j * 0.5) * 10,
            Math.sin(j * 0.3) * 5
          ),
          id: `${i}-${j}`
        });
      }
    }
    
    linesRef.current = lines;
  }, [store.network.connectedPlayers]);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    linesRef.current.forEach((line, index) => {
      // Animate line positions to follow orbiting players
      const i = parseInt(line.id.split('-')[0]);
      const j = parseInt(line.id.split('-')[1]);
      
      line.start.x = Math.cos(time * 0.5 + i) * 10;
      line.start.z = Math.sin(time * 0.5 + i) * 10;
      line.start.y = Math.sin(time * 0.3 + i * 0.5) * 5;
      
      line.end.x = Math.cos(time * 0.5 + j) * 10;
      line.end.z = Math.sin(time * 0.5 + j) * 10;
      line.end.y = Math.sin(time * 0.3 + j * 0.5) * 5;
    });
  });
  
  return (
    <group>
      {linesRef.current.map((line, index) => (
        <ConnectionLine
          key={line.id}
          start={line.start}
          end={line.end}
          index={index}
          totalLines={linesRef.current.length}
        />
      ))}
    </group>
  );
};

// Individual Connection Line Component
const ConnectionLine = ({ start, end, index, totalLines }) => {
  const lineRef = useRef();
  
  useFrame((state) => {
    if (!lineRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Update line geometry
    const positions = lineRef.current.geometry.attributes.position.array;
    positions[0] = start.x;
    positions[1] = start.y;
    positions[2] = start.z;
    positions[3] = end.x;
    positions[4] = end.y;
    positions[5] = end.z;
    lineRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Pulsing effect
    const pulse = 1 + Math.sin(time * 3 + index) * 0.1;
    lineRef.current.material.linewidth = 1 + (pulse * 2);
    
    // Color based on position in network
    const hue = (index / totalLines) * 0.6; // Full spectrum
    lineRef.current.material.color.setHSL(hue, 1, 0.5);
  });
  
  return (
    <line ref={lineRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([start.x, start.y, start.z, end.x, end.y, end.z])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#10b981" linewidth={1} />
    </line>
  );
};

// Network Hub (Central Node)
export const NetworkHub = () => {
  const store = useGameStore();
  const meshRef = useRef();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    const mesh = meshRef.current;
    
    // Pulsing effect based on mesh density
    const pulse = 1 + Math.sin(time * 2) * (store.network.meshDensity / 100);
    mesh.scale.set(pulse, pulse, pulse);
    
    // Rotation
    mesh.rotation.y += 0.005;
    mesh.rotation.z += 0.003;
    
    // Color based on network health
    const hue = (store.network.meshDensity / 100) * 0.3; // Green to Blue
    mesh.material.color.setHSL(hue, 1, 0.5);
    mesh.material.emissive.setHSL(hue, 1, 0.3);
    mesh.material.emissiveIntensity = store.network.meshDensity / 50;
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <dodecahedronGeometry args={[2, 0]} />
      <meshStandardMaterial
        color="#10b981"
        emissive="#000000"
        emissiveIntensity={0.5}
        wireframe={true}
      />
    </mesh>
  );
};

// Signal Strength Visualizer
export const SignalStrengthVisualizer = () => {
  const store = useGameStore();
  const ringsRef = useRef([]);
  
  useEffect(() => {
    const count = 5;
    ringsRef.current = new Array(count).fill(0).map((_, index) => ({
      radius: 5 + (index * 3),
      rotation: new THREE.Euler(0, 0, 0),
      phase: index * 0.5
    }));
  }, []);
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    ringsRef.current.forEach((ring, index) => {
      // Rotate rings
      ring.rotation.y = time * 0.1 + index * 0.2;
      ring.rotation.z = time * 0.05 + index * 0.1;
      
      // Pulse based on signal strength
      const pulse = 1 + Math.sin(time * 2 + ring.phase) * (store.network.signalStrength / 100);
      // Visual update handled in render
    });
  });
  
  return (
    <group>
      {ringsRef.current.map((ring, index) => (
        <SignalRing
          key={index}
          radius={ring.radius}
          rotation={ring.rotation}
          signalStrength={store.network.signalStrength}
          index={index}
        />
      ))}
    </group>
  );
};

// Individual Signal Ring Component
const SignalRing = ({ radius, rotation, signalStrength, index }) => {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime();
    
    // Pulsing effect
    const pulse = 1 + Math.sin(time * 3 + index) * (signalStrength / 100);
    meshRef.current.scale.set(pulse, pulse, pulse);
    
    // Color based on signal strength
    const hue = (signalStrength / 100) * 0.3; // Green to Blue
    meshRef.current.material.color.setHSL(hue, 1, 0.5);
    meshRef.current.material.emissive.setHSL(hue, 1, 0.3);
    meshRef.current.material.emissiveIntensity = signalStrength / 50;
  });
  
  return (
    <mesh ref={meshRef} rotation={rotation}>
      <torusGeometry args={[radius, 0.1, 16, 100]} />
      <meshBasicMaterial
        color="#3b82f6"
        transparent={true}
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Network Status Overlay
export const NetworkStatusOverlay = () => {
  const store = useGameStore();
  const { network, swarm } = store;
  
  return (
    <div className="absolute bottom-8 right-8 z-20">
      <div className="text-xs text-gray-400 mb-1">SWARM STATUS</div>
      <div className="bg-black border border-gray-600 p-3 font-mono text-xs">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="font-bold">SWARM ACTIVE</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gray-500">PHASE:</span>
          <span className={`font-bold ${
            swarm.phase === 'CHAOS' ? 'text-red-500' :
            swarm.phase === 'TRANSITION' ? 'text-yellow-500' : 'text-green-500'
          }`}>
            {swarm.phase}
          </span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-gray-500">DENSITY:</span>
          <span className="font-mono">{Math.round(swarm.density)}%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">TARGET:</span>
          <span className="font-mono">{swarm.targetDensity}%</span>
        </div>
      </div>
    </div>
  );
};