// THE GEODESIC ENGINE - A Complete Standalone Game
// "Roblox Killer Trojan Horse" - Cognitive Shield & Voxel Builder
import React, { useState, useEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Float, Text, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Radio, Activity, Terminal, Lock, Cpu, Globe, Zap, Building, Users, Brain, Atom } from 'lucide-react';

// Import Game Systems
import { useGameStore } from './game-store';
import { VoxelWorld, FloatingBlockPreview, GeodesicDome, BlockSelector, ResourceDisplay } from './voxel-engine';
import { 
  CognitiveShield, 
  EntropyWave, 
  PosnerClusters, 
  VoltageMeter, 
  EducationalTooltips, 
  StressReliefGame, 
  NetworkStability 
} from './cognitive-shield-system';
import { 
  SwarmVisualization, 
  PlayerConnections, 
  ConnectionLines, 
  NetworkHub, 
  SignalStrengthVisualizer, 
  NetworkStatusOverlay 
} from './mesh-network-system';

// Game State Constants
const GAME_STATES = {
  MENU: 'MENU',
  BUILDING: 'BUILDING',
  DEFENDING: 'DEFENDING',
  CONNECTING: 'CONNECTING',
  TUTORIAL: 'TUTORIAL'
};

const COLORS = {
  primary: '#10b981', // Emerald-500
  secondary: '#eab308', // Gold-500
  danger: '#ef4444', // Red-500
  bg: '#000000',
  wireframe: '#3b82f6'
};

// Main Game HUD Component
const GameHUD = () => {
  const store = useGameStore();
  const { gameState, shield, network, swarm, ui } = store;

  return (
    <div className="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between font-mono text-xs md:text-sm text-green-500 select-none">
      {/* Top Status Bar */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xl font-bold tracking-widest text-white">
            <Shield className="w-6 h-6 text-emerald-500" />
            GEODESIC ENGINE
          </div>
          <div className="flex items-center gap-2 opacity-70 text-sm">
            <span className={`px-2 py-1 rounded ${gameState === 'BUILDING' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
              {gameState}
            </span>
            <span>•</span>
            <span>Topology: {swarm.phase}</span>
            <span>•</span>
            <span>Density: {Math.round(swarm.density)}%</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <div className="flex items-center gap-2">
            <span className={`font-bold ${shield.voltage > 70 ? 'text-red-500' : shield.voltage > 40 ? 'text-yellow-500' : 'text-green-500'}`}>
              STRESS: {Math.round(shield.voltage)}%
            </span>
            <Activity className={`w-4 h-4 ${shield.voltage > 70 ? 'text-red-500 animate-pulse' : 'text-green-500'}`} />
          </div>
          <div className="text-xs opacity-70">Integrity: {Math.round(shield.integrity)}%</div>
          <div className="text-xs opacity-70">Coherence: {Math.round(shield.coherence * 100)}%</div>
        </div>
      </div>

      {/* Center Game Information */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10">
        {gameState === 'BUILDING' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/80 border border-emerald-500/50 p-4 rounded-lg"
          >
            <div className="text-emerald-400 font-bold mb-2">BUILDING MODE ACTIVE</div>
            <div className="text-sm text-gray-300">
              Click to place blocks • Alt+Click to remove • Build your geodesic structure
            </div>
          </motion.div>
        )}
        
        {gameState === 'DEFENDING' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-black/80 border border-red-500/50 p-4 rounded-lg"
          >
            <div className="text-red-400 font-bold mb-2">ENTROPY WAVES DETECTED</div>
            <div className="text-sm text-gray-300">
              Build shield blocks to defend against chaos • Maintain coherence
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Information Bar */}
      <div className="flex justify-between items-end">
        <div className="max-w-md">
           <h3 className="text-white font-bold mb-1 flex items-center gap-2">
             <Terminal className="w-4 h-4" /> SYSTEM LOG
           </h3>
           <div className="h-20 overflow-hidden mask-gradient-b text-emerald-500/80 leading-tight text-xs">
              <p>{">"} Initializing Geodesic Engine...</p>
              <p>{">"} Wye Topology detected. Stabilizing...</p>
              {swarm.active && <p className="text-emerald-400">{">"} SWARM PHASE: {swarm.phase}</p>}
              {shield.posnerClusters > 0 && <p className="text-yellow-400">{">"} POSNER CLUSTERS: {shield.posnerClusters}</p>}
              {network.connectedPlayers.length > 0 && <p className="text-blue-400">{">"} NETWORK: {network.connectedPlayers.length} connections</p>}
              {shield.voltage > 80 && <p className="text-red-500">{">"} WARNING: High stress detected</p>}
           </div>
        </div>

        <div className="flex flex-col items-end gap-2">
           {/* Network Status */}
           <div className="flex gap-2 text-xs">
              <div className={`px-2 py-1 rounded border ${network.meshDensity > 50 ? 'border-blue-500 bg-blue-500/10 text-blue-400' : 'border-gray-500 bg-gray-500/10 text-gray-400'}`}>
                Mesh: {Math.round(network.meshDensity)}%
              </div>
              <div className={`px-2 py-1 rounded border ${network.signalStrength > 50 ? 'border-green-500 bg-green-500/10 text-green-400' : 'border-gray-500 bg-gray-500/10 text-gray-400'}`}>
                Signal: {Math.round(network.signalStrength)}%
              </div>
           </div>

           {/* Game Controls */}
           <div className="flex gap-2">
              <button
                onClick={() => store.toggleTutorial()}
                className="px-3 py-1 border border-gray-600 text-xs hover:border-white transition-colors"
              >
                {ui.showTutorial ? 'Hide Tips' : 'Show Tips'}
              </button>
              <button
                onClick={() => store.toggleStats()}
                className="px-3 py-1 border border-gray-600 text-xs hover:border-white transition-colors"
              >
                {ui.showStats ? 'Hide Stats' : 'Show Stats'}
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// Game Menu Component
const GameMenu = ({ onStartGame }) => {
  return (
    <div className="absolute inset-0 bg-black z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-8"
      >
        {/* Title */}
        <div>
          <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400">
            THE GEODESIC ENGINE
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-mono tracking-[0.5em] uppercase">
            BUILD • DEFEND • CONNECT
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-black/50 border border-emerald-500/30 p-6 rounded-lg">
            <Building className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
            <h3 className="text-emerald-400 font-bold mb-2">VOXEL BUILDING</h3>
            <p className="text-sm text-gray-300">Build geodesic structures with InstancedMesh performance</p>
          </div>
          
          <div className="bg-black/50 border border-blue-500/30 p-6 rounded-lg">
            <Brain className="w-12 h-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-blue-400 font-bold mb-2">COGNITIVE SHIELD</h3>
            <p className="text-sm text-gray-300">Manage stress and maintain mental coherence</p>
          </div>
          
          <div className="bg-black/50 border border-purple-500/30 p-6 rounded-lg">
            <Globe className="w-12 h-12 mx-auto mb-4 text-purple-500" />
            <h3 className="text-purple-400 font-bold mb-2">MESH NETWORK</h3>
            <p className="text-sm text-gray-300">Connect with other players in a distributed network</p>
          </div>
        </div>

        {/* Start Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartGame}
          className="group relative px-12 py-6 bg-emerald-500 text-black font-bold text-2xl tracking-[0.3em] rounded-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          START BUILDING
        </motion.button>

        {/* Educational Tagline */}
        <div className="text-gray-500 text-sm font-mono">
          "A Roblox Killer Trojan Horse - Entertainment that builds cognitive resilience"
        </div>
      </motion.div>
    </div>
  );
};

// Game Tutorial Component
const GameTutorial = () => {
  const store = useGameStore();
  
  if (!store.ui.showTutorial) return null;

  return (
    <div className="absolute top-20 left-8 z-30">
      <div className="bg-black border border-yellow-500/50 p-4 font-mono text-xs max-w-sm">
        <div className="text-yellow-400 font-bold mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" /> TUTORIAL ACTIVE
        </div>
        <div className="text-gray-300 space-y-2 text-sm">
          <div><span className="text-green-400">•</span> Left Click: Place block</div>
          <div><span className="text-red-400">•</span> Alt + Click: Remove block</div>
          <div><span className="text-blue-400">•</span> Scroll: Change block type</div>
          <div><span className="text-purple-400">•</span> Build tetrahedrons for stability</div>
          <div><span className="text-yellow-400">•</span> Manage stress with Posner clusters</div>
          <div><span className="text-cyan-400">•</span> Connect with other players</div>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          Tip: The cognitive shield protects your mental state
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const store = useGameStore();
  const { gameState, isInitialized, ui } = store;

  // Initialize game on mount
  useEffect(() => {
    if (!isInitialized) {
      store.initializeGame();
    }
  }, [isInitialized, store]);

  const handleStartGame = () => {
    store.initializeGame();
  };

  return (
    <div className="w-full h-screen bg-black text-white overflow-hidden relative font-sans">
      {/* 3D Game World */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 15, 25], fov: 45 }}>
          <color attach="background" args={['#050505']} />
          
          {/* Environment */}
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.3} />
          <pointLight position={[20, 20, 20]} intensity={0.5} color="#eab308" />
          <pointLight position={[-20, -20, -20]} intensity={0.3} color="#3b82f6" />
          
          {/* Game Systems */}
          {gameState === 'BUILDING' && (
            <>
              <VoxelWorld mode="BUILDING" />
              <FloatingBlockPreview />
              <GeodesicDome radius={15} frequency={2} />
              <CognitiveShield />
              <PosnerClusters />
              <EntropyWave />
            </>
          )}
          
          {/* Network Visualization */}
          <SwarmVisualization />
          <PlayerConnections />
          <ConnectionLines />
          <NetworkHub />
          <SignalStrengthVisualizer />
          
          {/* Camera Controls */}
          <OrbitControls 
             enableZoom={true}
             enablePan={true}
             autoRotate={gameState === 'MENU'}
             autoRotateSpeed={0.5}
             maxPolarAngle={Math.PI / 1.5}
             minPolarAngle={Math.PI / 4}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <GameHUD />
      <GameTutorial />
      
      {/* Block Selection UI */}
      <BlockSelector />
      <ResourceDisplay />
      <VoltageMeter />
      <NetworkStability />
      <EducationalTooltips />
      <StressReliefGame />
      <NetworkStatusOverlay />

      {/* Game Menu */}
      {!isInitialized && <GameMenu onStartGame={handleStartGame} />}

      {/* Game State Overlays */}
      <AnimatePresence>
        {gameState === 'MENU' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-b from-transparent to-black pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};
