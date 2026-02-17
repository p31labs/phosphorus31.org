/**
 * Game Engine 3D Component
 * Integrates GameEngine with React Three Fiber
 *
 * Syncs game engine scene with Three.js scene for rendering
 */

import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useGameEngine } from '../../hooks/useGameEngine';

export const GameEngine3D: React.FC = () => {
  const { scene, camera, gl } = useThree();
  const { engine, isInitialized, isRunning, error } = useGameEngine();
  const sceneManagerRef = useRef<any>(null);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!engine || !isInitialized || error) {
      return;
    }

    try {
      // Get scene manager from engine
      const sceneManager = engine.getSceneManager?.();
      if (!sceneManager) {
        console.warn('[GameEngine3D] SceneManager not available');
        return;
      }

      sceneManagerRef.current = sceneManager;

      // Sync Three.js scene with game engine scene
      // This assumes SceneManager has methods to sync
      const syncScene = () => {
        if (sceneManagerRef.current && scene) {
          try {
            // Update Three.js scene from game engine
            // Implementation depends on SceneManager API
            // Example: sceneManagerRef.current.syncToScene(scene);
          } catch (err) {
            console.error('[GameEngine3D] Error syncing scene:', err);
          }
        }
      };

      // Sync at ~60fps (16ms intervals)
      syncIntervalRef.current = setInterval(syncScene, 16);

      return () => {
        if (syncIntervalRef.current) {
          clearInterval(syncIntervalRef.current);
          syncIntervalRef.current = null;
        }
      };
    } catch (err) {
      console.error('[GameEngine3D] Error setting up scene sync:', err);
    }
  }, [engine, isInitialized, error, scene]);

  useFrame((state, delta) => {
    if (!engine || !isRunning || error) return;

    try {
      // Update game engine with delta time
      // The engine's loop handles this internally, but we can sync here
      if (sceneManagerRef.current) {
        // Sync camera, lighting, etc.
        // Example: sceneManagerRef.current.updateCamera(camera);
      }
    } catch (err) {
      console.error('[GameEngine3D] Error in frame update:', err);
    }
  });

  // Don't render anything if there's an error
  if (error) {
    return null;
  }

  // This component doesn't render directly - it syncs the game engine with Three.js
  return null;
};
