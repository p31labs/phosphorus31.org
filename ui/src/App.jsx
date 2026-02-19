import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import PerformanceMonitor from './components/3d/PerformanceMonitor';
import SceneInspector from './components/3d/SceneInspector';
import ActionDeck from './components/phenix-navigator/ActionDeck';
import CoherenceOrb from './components/phenix-navigator/CoherenceOrb';
import VoxelWorld from './components/phenix-navigator/VoxelWorld';
import HUD from './components/phenix-navigator/HUD';
import VPIOverlay from './components/phenix-navigator/VPIOverlay';
import GlitchOverlay from './components/phenix-navigator/GlitchOverlay';
import Hologram from './components/phenix-navigator/Hologram';
import CreationPipeline from './components/phenix-navigator/CreationPipeline';
import { useStore } from './store';
import { historyService } from '@/services/history.service';
import { CatchersMitt } from '@/lib/catchers-mitt';
import { analyzeMessage } from '@/engine/geodesic-engine';
import { TrimtabProvider } from './TrimtabContext';
import './App.css';

function App() {
  const [isPerformanceMode, setIsPerformanceMode] = useState(false);
  const [isSceneInspectorVisible, setIsSceneInspectorVisible] = useState(false);
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(process.env.NODE_ENV === 'development');

  // Initialize services
  useEffect(() => {
    // Initialize CatchersMitt for message batching
    const mitt = new CatchersMitt({ bufferDuration: 60000 });
    
    // Set up message processing
    mitt.on('batchProcessed', async (data) => {
      console.log('Processing batch:', data);
      
      // Analyze messages with geodesic engine
      for (const message of data.messages) {
        try {
          const analysis = await analyzeMessage(message.content);
          console.log('Message analysis:', analysis);
          
          // Store in history
          historyService.addEntry('analysis', analysis, {
            messageId: message.id,
            timestamp: message.timestamp
          });
        } catch (error) {
          console.error('Failed to analyze message:', error);
        }
      }
    });

    // Clean up on unmount
    return () => {
      mitt.destroy();
    };
  }, []);

  // Handle export from ActionDeck
  const handleExport = async () => {
    console.log('Exporting world for materialization...');
    
    // Get current world state
    const blocks = useStore.getState().blocks;
    const coherence = useStore.getState().coherence;
    
    // Store export event in history
    historyService.addEntry('export', {
      blockCount: blocks.size,
      coherence,
      timestamp: Date.now()
    });

    // Trigger materialization process
    useStore.getState().setFabricationStatus('preparing', 0);
    
    // Simulate export process
    setTimeout(() => {
      useStore.getState().setFabricationStatus('slicing', 50);
    }, 1000);
    
    setTimeout(() => {
      useStore.getState().setFabricationStatus('exporting', 100);
    }, 2000);
    
    setTimeout(() => {
      useStore.getState().setFabricationStatus('complete', 100);
    }, 3000);
  };

  return (
    <TrimtabProvider>
    <div className="app">
      {/* 3D Canvas with P31 Spectrum (P31) */}
      <Canvas
        camera={{ position: [0, 4, 14], fov: 50 }}
        style={{ width: '100vw', height: '100vh' }}
      >
        {/* P31 Scope Components */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} />
        
        {/* Quantum State Visualization */}
        <CoherenceOrb />
        
        {/* 3D Voxel World */}
        <VoxelWorld />
        
        {/* Holographic Projections */}
        <Hologram />
        
        {/* Performance Monitoring */}
        {isPerformanceMode && <PerformanceMonitor />}
        
        {/* Scene Inspector */}
        {isSceneInspectorVisible && <SceneInspector />}
      </Canvas>

      {/* UI Overlays */}
      <div className="ui-layer">
        {/* Heads-up Display */}
        <HUD />
        
        {/* Voxel Processing Interface */}
        <VPIOverlay />
        
        {/* Glitch Effects */}
        <GlitchOverlay />
        
        {/* Action Deck (Bottom Control Panel) */}
        <ActionDeck onExport={handleExport} />
        
        {/* Creation Pipeline */}
        <CreationPipeline />
      </div>

      {/* Development Tools Overlay */}
      {isDevelopmentMode && (
        <div className="dev-tools">
          <div className="dev-header">
            <h3>Development Tools</h3>
            <button 
              onClick={() => setIsPerformanceMode(!isPerformanceMode)}
              className={isPerformanceMode ? 'active' : ''}
            >
              Performance Monitor
            </button>
            <button 
              onClick={() => setIsSceneInspectorVisible(!isSceneInspectorVisible)}
              className={isSceneInspectorVisible ? 'active' : ''}
            >
              Scene Inspector
            </button>
          </div>
          
          <div className="dev-stats">
            <div className="stat-item">
              <span>Performance Mode:</span>
              <span>{isPerformanceMode ? 'ON' : 'OFF'}</span>
            </div>
            <div className="stat-item">
              <span>Scene Inspector:</span>
              <span>{isSceneInspectorVisible ? 'VISIBLE' : 'HIDDEN'}</span>
            </div>
            <div className="stat-item">
              <span>Development Mode:</span>
              <span>ACTIVE</span>
            </div>
          </div>
        </div>
      )}
    </div>
    </TrimtabProvider>
  );
}

export default App;