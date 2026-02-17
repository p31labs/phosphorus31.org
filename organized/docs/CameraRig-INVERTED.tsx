import { useRef, useEffect, useState } from 'react';
import { CameraControls } from '@react-three/drei';
import { useNavigationStore } from '@/lib/store/navigationStore';
import { getTetrahedronVertices, TETRAHEDRON_RADIUS } from '@/lib/math/tetrahedron';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export const CameraRig = () => {
  const controls = useRef<CameraControls>(null);
  const view = useNavigationStore((s) => s.view);
  const vertices = getTetrahedronVertices(TETRAHEDRON_RADIUS);
  
  const [isUserInteracting, setIsUserInteracting] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  /**
   * CRITICAL FIX: Camera multiplier INVERTED
   * 
   * To look AT a vertex, camera must move in OPPOSITE direction
   * 
   * Example:
   * - Vertex at (0, 2, 0) [top of tetrahedron]
   * - To see it, camera goes to (0, -5, 0) [below, looking up]
   * 
   * Formula:
   * cameraPos = -direction * distance
   */
  const getZoomPos = (vertexIndex: number): [number, number, number] => {
    const vertex = vertices[vertexIndex];
    const direction = new THREE.Vector3(vertex.x, vertex.y, vertex.z).normalize();
    
    // Distance from origin (negative = opposite side)
    const zoomDistance = -5.0; // INVERTED (negative moves away from vertex)
    
    return [
      direction.x * zoomDistance,
      direction.y * zoomDistance,
      direction.z * zoomDistance,
    ];
  };

  const POSITIONS = {
    ORBIT: [0, 0, 7.0] as [number, number, number],
    STATUS: getZoomPos(0),      // Camera on opposite side of STATUS vertex
    CHILDCARE: getZoomPos(1),   // Camera on opposite side of CHILDCARE vertex
    FOOD: getZoomPos(2),        // Camera on opposite side of FOOD vertex
    HOUSING: getZoomPos(3),     // Camera on opposite side of HOUSING vertex
  };

  // Detect user interaction
  useEffect(() => {
    if (!controls.current) return;
    
    const handleStart = () => {
      setIsUserInteracting(true);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
    
    const handleEnd = () => {
      idleTimerRef.current = setTimeout(() => {
        setIsUserInteracting(false);
      }, 2000);
    };
    
    controls.current.addEventListener('controlstart', handleStart);
    controls.current.addEventListener('controlend', handleEnd);
    
    return () => {
      if (controls.current) {
        controls.current.removeEventListener('controlstart', handleStart);
        controls.current.removeEventListener('controlend', handleEnd);
      }
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, []);

  // Jitterbug Dolly - only when idle and in ORBIT
  useFrame(({ clock }) => {
    if (!controls.current) return;
    if (isUserInteracting) return;
    if (view !== 'ORBIT') return;
    
    const t = clock.getElapsedTime();
    const baseDistance = 7.0;
    const amplitude = 0.3;
    const frequency = 0.5;
    
    const newDistance = baseDistance + Math.sin(t * frequency) * amplitude;
    controls.current.distance = newDistance;
  });

  // State transition - move camera when view changes
  useEffect(() => {
    if (!controls.current) return;

    const targetPos = POSITIONS[view];
    
    console.log(`📷 Moving to ${view}:`, targetPos);
    
    // setLookAt(cameraX, cameraY, cameraZ, targetX, targetY, targetZ, animate)
    controls.current.setLookAt(
      targetPos[0], targetPos[1], targetPos[2],  // Camera position
      0, 0, 0,                                    // Look at center (where tetrahedron is)
      true                                        // Animate
    );
  }, [view]);

  return (
    <CameraControls 
      ref={controls} 
      maxDistance={20}  
      minDistance={2} 
      dollySpeed={0.5}
      enabled={true}
    />
  );
};
