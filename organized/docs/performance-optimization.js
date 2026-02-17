// Performance Optimization & Polish - The Final Layer
import React, { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGameStore } from './game-store';
import * as THREE from 'three';

// Performance Monitor Component
export const PerformanceMonitor = () => {
  const store = useGameStore();
  const [fps, setFps] = useState(60);
  const [memory, setMemory] = useState(0);
  const [drawCalls, setDrawCalls] = useState(0);
  
  const lastTime = useRef(performance.now());
  const frameCount = useRef(0);
  
  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    
    // Update FPS every second
    if (now - lastTime.current >= 1000) {
      setFps(frameCount.current);
      frameCount.current = 0;
      lastTime.current = now;
      
      // Memory monitoring (if available)
      if (performance.memory) {
        setMemory(Math.round(performance.memory.usedJSHeapSize / 1048576)); // MB
      }
    }
  });
  
  // Draw call monitoring
  useEffect(() => {
    const checkDrawCalls = () => {
      // This is a rough estimate based on InstancedMesh count
      const instances = store.voxelWorld.blocks.size;
      setDrawCalls(Math.ceil(instances / 1000) + 1); // Approximate
    };
    
    const interval = setInterval(checkDrawCalls, 1000);
    return () => clearInterval(interval);
  }, [store.voxelWorld.blocks.size]);

  if (!store.ui.showStats) return null;

  return (
    <div className="absolute top-20 right-8 z-40 bg-black border border-gray-600 p-3 font-mono text-xs">
      <div className="text-green-400 font-bold mb-2">PERFORMANCE</div>
      <div className="space-y-1">
        <div>FPS: {fps}</div>
        <div>Memory: {memory}MB</div>
        <div>Draw Calls: {drawCalls}</div>
        <div>Blocks: {store.voxelWorld.blocks.size}</div>
        <div>Network: {store.network.connectedPlayers.length}</div>
      </div>
      <div className={`mt-2 text-xs ${fps < 30 ? 'text-red-500' : fps < 45 ? 'text-yellow-500' : 'text-green-500'}`}>
        {fps < 30 ? 'LOW' : fps < 45 ? 'MEDIUM' : 'HIGH'} PERFORMANCE
      </div>
    </div>
  );
};

// Error Boundary Component
export class GameErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('Game Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 bg-black z-50 flex items-center justify-center">
          <div className="text-center text-white p-8 border border-red-500">
            <h2 className="text-2xl font-bold text-red-500 mb-4">SYSTEM ERROR</h2>
            <p className="mb-4">The Geodesic Engine encountered an error.</p>
            <div className="text-xs text-gray-400 mb-4">
              Error: {this.state.error?.message}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-black font-bold hover:bg-red-400"
            >
              RESTART SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Auto-Save System
export const AutoSaveSystem = () => {
  const store = useGameStore();
  
  useEffect(() => {
    const saveInterval = setInterval(() => {
      try {
        const saveData = {
          timestamp: Date.now(),
          gameState: store.gameState,
          voxelWorld: {
            blocks: Array.from(store.voxelWorld.blocks.entries()),
            selectedBlock: store.voxelWorld.selectedBlock
          },
          shield: store.shield,
          network: store.network,
          swarm: store.swarm
        };
        
        localStorage.setItem('geodesic-engine-save', JSON.stringify(saveData));
      } catch (error) {
        console.warn('Auto-save failed:', error);
      }
    }, 30000); // Save every 30 seconds

    return () => clearInterval(saveInterval);
  }, [store]);

  return null;
};

// Save/Load System Component
export const SaveLoadSystem = () => {
  const store = useGameStore();
  
  const handleSave = () => {
    try {
      const saveData = {
        timestamp: Date.now(),
        gameState: store.gameState,
        voxelWorld: {
          blocks: Array.from(store.voxelWorld.blocks.entries()),
          selectedBlock: store.voxelWorld.selectedBlock
        },
        shield: store.shield,
        network: store.network,
        swarm: store.swarm
      };
      
      localStorage.setItem('geodesic-engine-save', JSON.stringify(saveData));
      alert('Game saved successfully!');
    } catch (error) {
      alert('Save failed: ' + error.message);
    }
  };

  const handleLoad = () => {
    try {
      const savedData = localStorage.getItem('geodesic-engine-save');
      if (savedData) {
        const data = JSON.parse(savedData);
        
        // Restore voxel world
        const blocks = new Map(data.voxelWorld.blocks);
        store.voxelWorld.blocks = blocks;
        store.voxelWorld.selectedBlock = data.voxelWorld.selectedBlock;
        
        // Restore other state
        store.gameState = data.gameState;
        store.shield = data.shield;
        store.network = data.network;
        store.swarm = data.swarm;
        
        alert('Game loaded successfully!');
      } else {
        alert('No saved game found.');
      }
    } catch (error) {
      alert('Load failed: ' + error.message);
    }
  };

  return (
    <div className="absolute bottom-8 right-8 z-40 flex gap-2">
      <button
        onClick={handleSave}
        className="px-3 py-1 border border-gray-600 text-xs hover:border-white transition-colors"
      >
        SAVE
      </button>
      <button
        onClick={handleLoad}
        className="px-3 py-1 border border-gray-600 text-xs hover:border-white transition-colors"
      >
        LOAD
      </button>
    </div>
  );
};

// Quality Settings Component
export const QualitySettings = () => {
  const store = useGameStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const setQuality = (quality) => {
    store.setQualitySettings(quality);
    setIsMenuOpen(false);
  };

  if (!store.ui.showStats) return null;

  return (
    <div className="absolute top-40 right-8 z-40">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="px-3 py-1 border border-gray-600 text-xs hover:border-white transition-colors"
      >
        QUALITY: {store.graphics.quality.toUpperCase()}
      </button>
      
      {isMenuOpen && (
        <div className="absolute top-8 right-0 bg-black border border-gray-600 p-2 font-mono text-xs">
          <div className="text-gray-400 mb-2">Graphics Quality</div>
          <div className="space-y-1">
            <button onClick={() => setQuality('low')} className="block w-full text-left px-2 py-1 hover:bg-gray-800">
              Low (60+ FPS)
            </button>
            <button onClick={() => setQuality('medium')} className="block w-full text-left px-2 py-1 hover:bg-gray-800">
              Medium (30+ FPS)
            </button>
            <button onClick={() => setQuality('high')} className="block w-full text-left px-2 py-1 hover:bg-gray-800">
              High (20+ FPS)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Particle System Optimizer
export const ParticleOptimizer = () => {
  const store = useGameStore();
  const { scene } = useThree();
  
  useFrame(() => {
    // Limit particle count based on performance
    const maxParticles = store.graphics.quality === 'high' ? 2000 : 
                        store.graphics.quality === 'medium' ? 1000 : 500;
    
    // Clean up old particles if needed
    scene.traverse((object) => {
      if (object.isPoints && object.geometry.attributes.position.count > maxParticles) {
        // Reduce particle count by removing oldest particles
        const positions = object.geometry.attributes.position.array;
        const newCount = Math.min(positions.length / 3, maxParticles);
        
        const newArray = new Float32Array(newCount * 3);
        newArray.set(positions.slice(0, newCount * 3));
        
        object.geometry.setAttribute('position', new THREE.BufferAttribute(newArray, 3));
        object.geometry.setDrawRange(0, newCount);
      }
    });
  });

  return null;
};

// Memory Management System
export const MemoryManager = () => {
  const store = useGameStore();
  
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      // Clean up unused resources
      if (performance.memory && performance.memory.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB
        // Force garbage collection hint
        if (window.gc) {
          try {
            window.gc();
          } catch (e) {
            // GC not available
          }
        }
        
        // Clean up old voxel data
        if (store.voxelWorld.blocks.size > 10000) {
          const blocksArray = Array.from(store.voxelWorld.blocks.entries());
          const newBlocks = new Map(blocksArray.slice(-5000)); // Keep last 5000
          store.voxelWorld.blocks = newBlocks;
        }
      }
    }, 60000); // Check every minute

    return () => clearInterval(cleanupInterval);
  }, [store]);

  return null;
};

// Input Optimizer
export const InputOptimizer = () => {
  const store = useGameStore();
  const [lastInputTime, setLastInputTime] = useState(Date.now());
  
  useEffect(() => {
    const handleInput = () => {
      setLastInputTime(Date.now());
    };

    window.addEventListener('mousemove', handleInput);
    window.addEventListener('mousedown', handleInput);
    window.addEventListener('keydown', handleInput);

    return () => {
      window.removeEventListener('mousemove', handleInput);
      window.removeEventListener('mousedown', handleInput);
      window.removeEventListener('keydown', handleInput);
    };
  }, []);

  useFrame(() => {
    // Reduce update frequency when idle
    const idleTime = Date.now() - lastInputTime;
    if (idleTime > 5000) { // 5 seconds idle
      store.setPerformanceMode('idle');
    } else {
      store.setPerformanceMode('active');
    }
  });

  return null;
};

// Final Polish Components
export const GamePolish = () => {
  return (
    <>
      <PerformanceMonitor />
      <QualitySettings />
      <SaveLoadSystem />
      <ParticleOptimizer />
      <MemoryManager />
      <InputOptimizer />
      <AutoSaveSystem />
    </>
  );
};

// Loading Screen Component
export const LoadingScreen = ({ progress = 0 }) => {
  return (
    <div className="absolute inset-0 bg-black z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl font-bold text-white mb-4">INITIALIZING</div>
        <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="mt-2 text-sm text-gray-400">{Math.round(progress)}% COMPLETE</div>
      </div>
    </div>
  );
};

// Achievement System
export const AchievementSystem = () => {
  const store = useGameStore();
  const [achievements, setAchievements] = useState([]);
  
  useEffect(() => {
    const checkAchievements = () => {
      const newAchievements = [];
      
      // Building achievements
      if (store.voxelWorld.blocks.size > 100) {
        newAchievements.push({ id: 'builder', name: 'Master Builder', desc: 'Place 100 blocks' });
      }
      
      // Network achievements
      if (store.network.connectedPlayers.length > 5) {
        newAchievements.push({ id: 'social', name: 'Social Butterfly', desc: 'Connect with 5 players' });
      }
      
      // Cognitive achievements
      if (store.shield.coherence > 0.8) {
        newAchievements.push({ id: 'zen', name: 'Zen Master', desc: 'Achieve 80% coherence' });
      }
      
      // Swarm achievements
      if (store.swarm.density > 80) {
        newAchievements.push({ id: 'swarm', name: 'Swarm Leader', desc: 'Reach 80% swarm density' });
      }
      
      setAchievements(newAchievements);
    };
    
    const interval = setInterval(checkAchievements, 5000);
    return () => clearInterval(interval);
  }, [store]);

  return (
    <div className="absolute top-20 right-40 z-40">
      {achievements.map((achievement) => (
        <div key={achievement.id} className="bg-black border border-yellow-500/50 p-2 font-mono text-xs mb-2">
          <div className="text-yellow-400 font-bold">{achievement.name}</div>
          <div className="text-gray-400">{achievement.desc}</div>
        </div>
      ))}
    </div>
  );
};