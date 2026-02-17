// Cognitive Shield System - The Geodesic Engine's Core
import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from './game-store';
import * as THREE from 'three';

// The Cognitive Shield Visualization
export const CognitiveShield = () => {
  const meshRef = useRef();
  const store = useGameStore();
  const { shield, swarm } = store;
  
  // Update shield visualization based on cognitive state
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const mesh = meshRef.current;
    
    // Color coding based on voltage (stress level)
    if (shield.voltage > 80) {
      // High stress - Red/Orange
      mesh.material.color.setHSL(0.02, 1, 0.5);
      mesh.material.emissive.setHSL(0.02, 1, 0.3);
      mesh.material.emissiveIntensity = 2;
    } else if (shield.voltage > 50) {
      // Medium stress - Yellow
      mesh.material.color.setHSL(0.14, 1, 0.5);
      mesh.material.emissive.setHSL(0.14, 1, 0.2);
      mesh.material.emissiveIntensity = 1;
    } else {
      // Low stress - Blue/Green
      mesh.material.color.setHSL(0.3, 1, 0.5);
      mesh.material.emissive.setHSL(0.3, 1, 0.1);
      mesh.material.emissiveIntensity = 0.5;
    }
    
    // Pulsing effect based on coherence
    const time = state.clock.getElapsedTime();
    const pulse = Math.sin(time * 2) * 0.1 + 1;
    mesh.scale.set(pulse, pulse, pulse);
    
    // Transparency based on integrity
    mesh.material.opacity = shield.integrity / 100;
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry args={[5, 0]} />
      <meshStandardMaterial
        color="#3b82f6"
        wireframe={true}
        transparent={true}
        opacity={0.8}
        emissive="#000000"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
};

// Entropy Wave System (The "Floating Neutral" Threat)
export const EntropyWave = () => {
  const meshRef = useRef();
  const store = useGameStore();
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const mesh = meshRef.current;
    const time = state.clock.getElapsedTime();
    
    // Wave movement
    mesh.position.y = Math.sin(time) * 2;
    mesh.position.x = Math.cos(time * 0.5) * 3;
    
    // Intensity based on swarm phase
    if (store.swarm.phase === 'CHAOS') {
      mesh.material.opacity = 0.3;
      mesh.material.color.setHSL(0, 1, 0.5);
    } else if (store.swarm.phase === 'TRANSITION') {
      mesh.material.opacity = 0.6;
      mesh.material.color.setHSL(0.1, 1, 0.5);
    } else {
      mesh.material.opacity = 0.1;
      mesh.material.color.setHSL(0.3, 1, 0.5);
    }
  });
  
  return (
    <mesh ref={meshRef} visible={store.gameState === 'DEFENDING'}>
      <torusGeometry args={[8, 0.5, 16, 100]} />
      <meshBasicMaterial
        color="#ef4444"
        transparent={true}
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Posner Cluster Visualization (Biological Qubits)
export const PosnerClusters = () => {
  const store = useGameStore();
  const clustersRef = useRef([]);
  
  // Generate Posner clusters based on collected resources
  useEffect(() => {
    const count = Math.floor(store.shield.posnerClusters / 10);
    clustersRef.current = new Array(count).fill(0).map(() => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      ],
      rotation: [Math.random(), Math.random(), Math.random()],
      speed: Math.random() * 0.01 + 0.005
    }));
  }, [store.shield.posnerClusters]);
  
  useFrame((state) => {
    clustersRef.current.forEach((cluster, index) => {
      // Orbit around player
      const time = state.clock.getElapsedTime();
      const radius = 3 + (index * 0.5);
      
      cluster.position[0] = Math.cos(time * cluster.speed + index) * radius;
      cluster.position[2] = Math.sin(time * cluster.speed + index) * radius;
      cluster.rotation[1] += 0.01;
    });
  });
  
  return (
    <group>
      {clustersRef.current.map((cluster, index) => (
        <mesh
          key={index}
          position={cluster.position}
          rotation={cluster.rotation}
        >
          <icosahedronGeometry args={[0.2, 0]} />
          <meshBasicMaterial
            color="#eab308"
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

// Voltage Meter UI Component
export const VoltageMeter = () => {
  const store = useGameStore();
  const { shield } = store;
  
  const getVoltageColor = (voltage) => {
    if (voltage > 80) return '#ef4444'; // Red
    if (voltage > 50) return '#eab308'; // Yellow
    return '#10b981'; // Green
  };
  
  const getVoltageText = (voltage) => {
    if (voltage > 80) return 'CRITICAL';
    if (voltage > 50) return 'WARNING';
    return 'CALM';
  };
  
  return (
    <div className="absolute top-8 left-8 z-20">
      <div className="text-xs text-gray-400 mb-1">SYSTEM STATUS</div>
      <div className="bg-black border border-gray-600 p-3 font-mono">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getVoltageColor(shield.voltage) }}></div>
          <span className="text-sm">{getVoltageText(shield.voltage)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">VOLTAGE:</span>
          <div className="w-24 bg-gray-800 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all"
              style={{ 
                width: `${shield.voltage}%`,
                backgroundColor: getVoltageColor(shield.voltage)
              }}
            ></div>
          </div>
          <span className="text-xs w-12">{Math.round(shield.voltage)}%</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">COHERENCE:</span>
          <div className="w-24 bg-gray-800 rounded-full h-2">
            <div 
              className="h-2 bg-blue-500 rounded-full transition-all"
              style={{ width: `${shield.coherence * 100}%` }}
            ></div>
          </div>
          <span className="text-xs w-12">{Math.round(shield.coherence * 100)}%</span>
        </div>
      </div>
    </div>
  );
};

// Educational Tooltip System
export const EducationalTooltips = () => {
  const store = useGameStore();
  const [currentTip, setCurrentTip] = React.useState(0);
  
  const tips = [
    {
      title: "Wye vs Delta Topology",
      content: "The Wye (Star) topology has a central hub. If the hub fails, everything collapses. The Delta (Mesh) topology connects everything to everything else. If one node fails, the system continues.",
      icon: "⚡"
    },
    {
      title: "Floating Neutral",
      content: "When the central ground connection is lost, voltage becomes unstable. This is the 'Floating Neutral' - the chaos you're defending against.",
      icon: "⚠️"
    },
    {
      title: "Posner Molecules",
      content: "These are biological qubits in your brain. They store quantum information and help maintain cognitive coherence.",
      icon: "🔸"
    },
    {
      title: "Tetrahedron Protocol",
      content: "The minimum stable structure is a tetrahedron (4 nodes). Triangles can fall over, but tetrahedrons are rigid.",
      icon: "🔷"
    },
    {
      title: "Impedance Matching",
      content: "Your cognitive shield matches the 'impedance' of external stress, preventing damage from high-voltage inputs.",
      icon: "🔧"
    }
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);
  
  const tip = tips[currentTip];
  
  return (
    <div className="absolute bottom-8 left-8 z-20">
      <div className="bg-black border border-gray-600 p-3 font-mono text-xs max-w-sm">
        <div className="flex items-center gap-2 mb-2 text-yellow-400">
          <span className="text-lg">{tip.icon}</span>
          <span className="font-bold">{tip.title}</span>
        </div>
        <div className="text-gray-300 leading-relaxed">
          {tip.content}
        </div>
        <div className="text-gray-500 text-right mt-2">
          Tip {currentTip + 1} of {tips.length}
        </div>
      </div>
    </div>
  );
};

// Stress Relief Mini-Game
export const StressReliefGame = () => {
  const store = useGameStore();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [targetPosition, setTargetPosition] = React.useState([0, 0, 0]);
  const [score, setScore] = React.useState(0);
  
  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setTargetPosition([
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    ]);
  };
  
  const hitTarget = () => {
    if (!isPlaying) return;
    
    setScore(score + 1);
    store.updateShieldFromBuilding('posner'); // Reward with Posner cluster
    
    // New target
    setTargetPosition([
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20
    ]);
    
    if (score >= 5) {
      setIsPlaying(false);
      store.updateShieldFromEntropy(-0.5); // Reduce stress
    }
  };
  
  if (!isPlaying && store.shield.voltage > 70) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center">
        <div className="bg-black border border-red-500 p-6">
          <h3 className="text-red-500 font-bold mb-2">STRESS LEVEL CRITICAL</h3>
          <p className="text-gray-300 mb-4">Play stress relief game</p>
          <button
            onClick={startGame}
            className="px-4 py-2 bg-red-500 text-black font-bold hover:bg-red-400"
          >
            START GAME
          </button>
        </div>
      </div>
    );
  }
  
  if (isPlaying) {
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 text-center">
        <div className="bg-black border border-green-500 p-6">
          <h3 className="text-green-500 font-bold mb-2">STRESS RELIEF</h3>
          <p className="text-gray-300 mb-2">Score: {score}/5</p>
          <p className="text-gray-400 text-sm mb-4">Click the green target</p>
          <button
            onClick={() => setIsPlaying(false)}
            className="px-4 py-2 bg-gray-600 text-white font-bold hover:bg-gray-500"
          >
            STOP
          </button>
        </div>
      </div>
    );
  }
  
  return null;
};

// Network Stability Indicator
export const NetworkStability = () => {
  const store = useGameStore();
  const { network } = store;
  
  const getStabilityColor = (density) => {
    if (density > 80) return '#10b981'; // Green
    if (density > 50) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };
  
  const getStabilityText = (density) => {
    if (density > 80) return 'STABLE';
    if (density > 50) return 'WEAK';
    return 'CRITICAL';
  };
  
  return (
    <div className="absolute top-8 right-8 z-20">
      <div className="text-xs text-gray-400 mb-1">NETWORK STATUS</div>
      <div className="bg-black border border-gray-600 p-3 font-mono">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStabilityColor(network.meshDensity) }}></div>
          <span className="text-sm">{getStabilityText(network.meshDensity)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">MESH DENSITY:</span>
          <div className="w-24 bg-gray-800 rounded-full h-2">
            <div 
              className="h-2 rounded-full transition-all"
              style={{ 
                width: `${network.meshDensity}%`,
                backgroundColor: getStabilityColor(network.meshDensity)
              }}
            ></div>
          </div>
          <span className="text-xs w-12">{Math.round(network.meshDensity)}%</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">CONNECTIONS:</span>
          <span className="text-xs">{network.connectedPlayers.length}</span>
        </div>
      </div>
    </div>
  );
};