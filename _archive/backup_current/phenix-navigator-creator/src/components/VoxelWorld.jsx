// ══════════════════════════════════════════════════════════════════════════════
// VOXEL WORLD
// Instanced mesh voxel engine. Single draw call for up to MAX_INSTANCES blocks.
// O(1) block lookup via Map keyed by "x,y,z" strings.
// ══════════════════════════════════════════════════════════════════════════════

import { useRef, useEffect, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useStore } from '../store.js';
import { MAX_INSTANCES, BLOCK_SIZE, COLORS } from '../constants.js';

// ── Module-scope Shared Resources ────────────────────────────────────────────
const tempObject = new THREE.Object3D();
const sharedGeometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
const sharedMaterial = new THREE.MeshStandardMaterial({
  color: COLORS.CYAN,
  emissive: COLORS.NEON_CYAN,
  emissiveIntensity: 0.15,
  metalness: 0.3,
  roughness: 0.4,
  transparent: true,
  opacity: 0.92
});

/**
 * VoxelWorld - Main voxel rendering component
 */
export default function VoxelWorld() {
  const meshRef = useRef();
  const blocks = useStore((s) => s.blocks);
  const mode = useStore((s) => s.mode);

  // ── Sync Instances ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!meshRef.current) return;

    let idx = 0;
    for (const [key] of blocks) {
      if (idx >= MAX_INSTANCES) break;

      const [x, y, z] = key.split(',').map(Number);
      tempObject.position.set(x, y, z);
      tempObject.rotation.set(0, 0, 0);
      tempObject.scale.set(1, 1, 1);
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(idx, tempObject.matrix);
      idx++;
    }

    // Clear remaining instances
    tempObject.scale.set(0, 0, 0);
    tempObject.updateMatrix();
    while (idx < MAX_INSTANCES) {
      meshRef.current.setMatrixAt(idx, tempObject.matrix);
      idx++;
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [blocks]);

  // ── Click Handler (uses getState to avoid stale closures) ──────────────────
  const handleClick = useCallback((e) => {
    if (mode !== 'BUILD') return;
    e.stopPropagation();

    const { addBlock, removeBlock, blocks } = useStore.getState();

    // Alt/Ctrl = remove block
    if (e.altKey || e.ctrlKey) {
      const instanceId = e.instanceId;
      if (instanceId === undefined) return;

      // Find the key for this instance
      let idx = 0;
      for (const [key] of blocks) {
        if (idx === instanceId) {
          removeBlock(key);
          return;
        }
        idx++;
      }
      return;
    }

    // Place new block adjacent to clicked face
    if (!e.face) return;

    const point = e.point;
    const normal = e.face.normal;

    // Calculate position: clicked point + offset along normal, rounded to grid
    const newX = Math.round(point.x + normal.x * 0.5);
    const newY = Math.round(point.y + normal.y * 0.5);
    const newZ = Math.round(point.z + normal.z * 0.5);

    // Clamp Y to avoid underground placement
    const finalY = Math.max(0, newY);

    addBlock(`${newX},${finalY},${newZ}`);
  }, [mode]);

  // ── Ground Plane Click ─────────────────────────────────────────────────────
  const handleGroundClick = useCallback((e) => {
    if (mode !== 'BUILD') return;
    e.stopPropagation();

    const { addBlock } = useStore.getState();

    const point = e.point;
    const x = Math.round(point.x);
    const z = Math.round(point.z);

    addBlock(`${x},0,${z}`);
  }, [mode]);

  return (
    <>
      {/* Instanced Voxel Mesh */}
      <instancedMesh
        ref={meshRef}
        args={[sharedGeometry, sharedMaterial, MAX_INSTANCES]}
        onClick={handleClick}
        frustumCulled={false}
      />

      {/* Invisible Ground Plane for Initial Placement */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.01, 0]}
        onClick={handleGroundClick}
      >
        <planeGeometry args={[60, 60]} />
        <meshBasicMaterial 
          transparent 
          opacity={0} 
          side={THREE.DoubleSide} 
        />
      </mesh>
    </>
  );
}
