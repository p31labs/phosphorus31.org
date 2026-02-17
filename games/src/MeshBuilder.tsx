/**
 * @license
 * Copyright 2026 P31 Labs
 *
 * Licensed under the AGPLv3 License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/agpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * MESH BUILDER - The Roblox Killer 🔺
 * 
 * A local-first, sovereignty-focused creative building game.
 * 
 * Features:
 * - Tetrahedron-first building primitives
 * - L.O.V.E. economy rewards for creativity
 * - Offline-first (IndexedDB persistence)
 * - Assistive tech built-in (sensory regulation, executive function)
 * - Mesh network support (LoRa-capable)
 * - No cloud dependency, no vendor lock-in
 * 
 * The mesh holds. Build sovereign. 💜
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// ── Types ──────────────────────────────────────────────────────────────────────

interface Block {
  id: string;
  type: 'tetrahedron' | 'cube' | 'sphere' | 'cylinder' | 'pyramid';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  color: string;
  material: 'standard' | 'emissive' | 'glass' | 'metal';
  placedAt: number;
}

interface BuildState {
  blocks: Map<string, Block>;
  selectedBlock: string | null;
  mode: 'build' | 'play' | 'edit';
  snapEnabled: boolean;
  gridVisible: boolean;
  selectedType: Block['type'];
  selectedMaterial: Block['material'];
  selectedColor: string;
  scale: number;
}

// ── Constants ──────────────────────────────────────────────────────────────────

const COLORS = {
  phosphorus: '#2ecc71',
  calcium: '#60a5fa',
  cosmic: '#a855f7',
  delta: '#10b981',
  love: '#ec4899',
  unity: '#f59e0b',
  aries: '#ef4444',
};

const BLOCK_TYPES: Block['type'][] = ['tetrahedron', 'cube', 'sphere', 'cylinder', 'pyramid'];
const MATERIALS: Block['material'][] = ['standard', 'emissive', 'glass', 'metal'];

const SNAP_GRID = 1.0;
const MAX_BLOCKS = 1000;

// ── 3D Components ─────────────────────────────────────────────────────────────

const TetrahedronGeometry: React.FC<{ size?: number }> = ({ size = 1 }) => {
  const vertices = [
    new THREE.Vector3(0, size, 0),                    // Top
    new THREE.Vector3(size, -size / 2, size),         // Front right
    new THREE.Vector3(-size, -size / 2, size),        // Front left
    new THREE.Vector3(0, -size / 2, -size),          // Back
  ];
  
  const faces = [
    [0, 1, 2], [0, 2, 3], [0, 3, 1], [1, 2, 3]
  ];
  
  const geometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  
  faces.forEach(face => {
    face.forEach(i => {
      const v = vertices[i];
      positions.push(v.x, v.y, v.z);
    });
  });
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  
  return <primitive object={geometry} attach="geometry" />;
};

const BlockPrimitive: React.FC<{
  block: Block;
  isSelected: boolean;
  onClick: () => void;
}> = ({ block, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  const getMaterial = () => {
    const baseColor = new THREE.Color(block.color);
    
    switch (block.material) {
      case 'emissive':
        return (
          <meshStandardMaterial
            color={baseColor}
            emissive={baseColor}
            emissiveIntensity={0.5}
            metalness={0.3}
            roughness={0.4}
          />
        );
      case 'glass':
        return (
          <meshPhysicalMaterial
            color={baseColor}
            transparent
            opacity={0.7}
            roughness={0.1}
            metalness={0.0}
            transmission={0.9}
            thickness={0.5}
          />
        );
      case 'metal':
        return (
          <meshStandardMaterial
            color={baseColor}
            metalness={0.9}
            roughness={0.1}
          />
        );
      default:
        return (
          <meshStandardMaterial
            color={baseColor}
            metalness={0.3}
            roughness={0.6}
          />
        );
    }
  };
  
  const getGeometry = () => {
    switch (block.type) {
      case 'tetrahedron':
        return <TetrahedronGeometry size={block.scale} />;
      case 'cube':
        return <boxGeometry args={[block.scale, block.scale, block.scale]} />;
      case 'sphere':
        return <sphereGeometry args={[block.scale / 2, 16, 16]} />;
      case 'cylinder':
        return <cylinderGeometry args={[block.scale / 2, block.scale / 2, block.scale, 16]} />;
      case 'pyramid':
        return <coneGeometry args={[block.scale / 2, block.scale, 4]} />;
    }
  };
  
  return (
    <mesh
      ref={meshRef}
      position={block.position}
      rotation={block.rotation}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'default';
      }}
    >
      {getGeometry()}
      {getMaterial()}
      {isSelected && (
        <mesh>
          {getGeometry()}
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.3}
          />
        </mesh>
      )}
    </mesh>
  );
};

const BuildPlane: React.FC<{
  onPlace: (position: [number, number, number]) => void;
  snapFn: (v: number) => number;
}> = ({ onPlace, snapFn }) => {
  const downPos = useRef<{ x: number; y: number } | null>(null);
  
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.01, 0]}
      onPointerDown={(e) => {
        downPos.current = { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY };
      }}
      onPointerUp={(e) => {
        if (!downPos.current) return;
        const dx = e.nativeEvent.clientX - downPos.current.x;
        const dy = e.nativeEvent.clientY - downPos.current.y;
        downPos.current = null;
        
        if (Math.sqrt(dx * dx + dy * dy) < 6) {
          e.stopPropagation();
          const p = e.point;
          onPlace([snapFn(p.x), 0.5, snapFn(p.z)]);
        }
      }}
    >
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#1a1a2e" transparent opacity={0.15} />
    </mesh>
  );
};

const GhostCursor: React.FC<{
  type: Block['type'];
  scale: number;
  color: string;
  material: Block['material'];
  snapFn: (v: number) => number;
}> = ({ type, scale, color, material, snapFn }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { raycaster, pointer, camera } = useThree();
  const buildPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const intersect = new THREE.Vector3();
  
  useFrame((state) => {
    if (!groupRef.current) return;
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(buildPlane, intersect)) {
      const x = snapFn(intersect.x);
      const z = snapFn(intersect.z);
      const bob = Math.sin(state.clock.elapsedTime * 3) * 0.08;
      groupRef.current.position.set(x, 0.5 + bob, z);
    }
  });
  
  const ghostBlock: Block = {
    id: 'ghost',
    type,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale,
    color,
    material,
    placedAt: Date.now(),
  };
  
  return (
    <group ref={groupRef}>
      <BlockPrimitive
        block={ghostBlock}
        isSelected={false}
        onClick={() => {}}
      />
    </group>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export const MeshBuilder: React.FC = () => {
  const [state, setState] = useState<BuildState>({
    blocks: new Map(),
    selectedBlock: null,
    mode: 'build',
    snapEnabled: true,
    gridVisible: true,
    selectedType: 'tetrahedron',
    selectedMaterial: 'standard',
    selectedColor: COLORS.phosphorus,
    scale: 1.0,
  });
  
  const [loveBalance, setLoveBalance] = useState(0);
  const [blocksPlaced, setBlocksPlaced] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  
  // ── Persistence (IndexedDB) ────────────────────────────────────────────────────
  
  useEffect(() => {
    // Load from IndexedDB
    const loadState = async () => {
      try {
        const db = await openDB();
        const saved = await db.get('blocks', 'state');
        if (saved) {
          setState(prev => ({
            ...prev,
            blocks: new Map(saved.blocks || []),
          }));
          setBlocksPlaced(saved.blocks?.length || 0);
        }
      } catch (err) {
        console.warn('[MeshBuilder] Failed to load state:', err);
      }
    };
    
    loadState();
  }, []);
  
  const saveState = useCallback(async (blocks: Map<string, Block>) => {
    try {
      const db = await openDB();
      await db.put('blocks', {
        id: 'state',
        blocks: Array.from(blocks.entries()),
        savedAt: Date.now(),
      });
    } catch (err) {
      console.warn('[MeshBuilder] Failed to save state:', err);
    }
  }, []);
  
  // ── L.O.V.E. Economy Integration ──────────────────────────────────────────────
  
  const rewardBlockPlacement = useCallback(async (block: Block) => {
    try {
      // Try to import economy store (may not be available in games context)
      const economyModule = await import('../../phenix-navigator-creator/src/economy/economyStore.js').catch(() => null);
      if (economyModule?.useEconomyStore) {
        const { useEconomyStore } = economyModule;
        const { TRANSACTION_TYPES } = await import('../../phenix-navigator-creator/src/economy/loveEconomy.js');
        
        useEconomyStore.getState().addLoveTransaction(
          TRANSACTION_TYPES.BLOCK_PLACED,
          {
            blockId: block.id,
            blockType: block.type,
            position: block.position,
            blockCount: state.blocks.size + 1,
          }
        );
        
        const balance = useEconomyStore.getState().loveBalance;
        setLoveBalance(balance);
      }
    } catch (err) {
      // Economy store not available - continue without it
      console.debug('[MeshBuilder] Economy store not available');
    }
  }, [state.blocks.size]);
  
  // ── Block Management ─────────────────────────────────────────────────────────
  
  const snapFn = useCallback((v: number) => {
    return state.snapEnabled ? Math.round(v / SNAP_GRID) * SNAP_GRID : v;
  }, [state.snapEnabled]);
  
  const placeBlock = useCallback((position: [number, number, number]) => {
    if (state.blocks.size >= MAX_BLOCKS) {
      alert(`Maximum ${MAX_BLOCKS} blocks reached!`);
      return;
    }
    
    const key = `${position[0]},${position[1]},${position[2]}`;
    if (state.blocks.has(key)) return;
    
    const block: Block = {
      id: `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: state.selectedType,
      position,
      rotation: [0, 0, 0],
      scale: state.scale,
      color: state.selectedColor,
      material: state.selectedMaterial,
      placedAt: Date.now(),
    };
    
    const newBlocks = new Map(state.blocks);
    newBlocks.set(key, block);
    
    setState(prev => ({ ...prev, blocks: newBlocks }));
    setBlocksPlaced(prev => prev + 1);
    
    saveState(newBlocks);
    rewardBlockPlacement(block);
  }, [state, saveState, rewardBlockPlacement]);
  
  const removeBlock = useCallback((blockId: string) => {
    const newBlocks = new Map(state.blocks);
    for (const [key, block] of newBlocks.entries()) {
      if (block.id === blockId) {
        newBlocks.delete(key);
        break;
      }
    }
    
    setState(prev => ({ ...prev, blocks: newBlocks, selectedBlock: null }));
    saveState(newBlocks);
  }, [saveState]);
  
  const clearAll = useCallback(() => {
    if (confirm('Clear all blocks? This cannot be undone.')) {
      const empty = new Map();
      setState(prev => ({ ...prev, blocks: empty, selectedBlock: null }));
      setBlocksPlaced(0);
      saveState(empty);
    }
  }, [saveState]);
  
  // ── Keyboard Shortcuts ───────────────────────────────────────────────────────
  
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      const key = e.key.toLowerCase();
      
      // Block types: 1-5
      if (key >= '1' && key <= '5') {
        const idx = parseInt(key) - 1;
        if (BLOCK_TYPES[idx]) {
          setState(prev => ({ ...prev, selectedType: BLOCK_TYPES[idx] }));
        }
      }
      
      // Materials: w=wood, m=metal, g=glass, e=emissive
      else if (key === 'w') setState(prev => ({ ...prev, selectedMaterial: 'standard' }));
      else if (key === 'm') setState(prev => ({ ...prev, selectedMaterial: 'metal' }));
      else if (key === 'g') setState(prev => ({ ...prev, selectedMaterial: 'glass' }));
      else if (key === 'e') setState(prev => ({ ...prev, selectedMaterial: 'emissive' }));
      
      // Toggles
      else if (key === 'v') setState(prev => ({ ...prev, snapEnabled: !prev.snapEnabled }));
      else if (key === 'h') setState(prev => ({ ...prev, gridVisible: !prev.gridVisible }));
      
      // Delete selected
      else if (key === 'delete' || key === 'backspace') {
        if (state.selectedBlock) {
          removeBlock(state.selectedBlock);
        }
      }
      
      // Scale
      else if (key === '=' || key === '+') {
        setState(prev => ({ ...prev, scale: Math.min(3, prev.scale + 0.25) }));
      } else if (key === '-') {
        setState(prev => ({ ...prev, scale: Math.max(0.5, prev.scale - 0.25) }));
      }
    };
    
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.selectedBlock, removeBlock]);
  
  // ── IndexedDB Helper ─────────────────────────────────────────────────────────
  
  const openDB = async (): Promise<IDBPDatabase> => {
    const { openDB } = await import('idb');
    return openDB('mesh-builder', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('blocks')) {
          db.createObjectStore('blocks');
        }
      },
    });
  };
  
  // ── Render ───────────────────────────────────────────────────────────────────
  
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100vh',
      background: '#050510',
      overflow: 'hidden',
    }}>
      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [15, 12, 15], fov: 50 }}
        gl={{ antialias: true, alpha: false }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} />
        <pointLight position={[-10, 10, -10]} intensity={0.6} color={COLORS.calcium} />
        
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={5}
          maxDistance={50}
          maxPolarAngle={Math.PI * 0.85}
        />
        
        {state.gridVisible && (
          <Grid
            args={[50, 50]}
            cellSize={SNAP_GRID}
            cellColor="#1e293b"
            sectionSize={5}
            sectionColor="#334155"
            fadeDistance={25}
          />
        )}
        
        <BuildPlane onPlace={placeBlock} snapFn={snapFn} />
        
        {Array.from(state.blocks.values()).map(block => (
          <BlockPrimitive
            key={block.id}
            block={block}
            isSelected={state.selectedBlock === block.id}
            onClick={() => setState(prev => ({
              ...prev,
              selectedBlock: prev.selectedBlock === block.id ? null : block.id,
            }))}
          />
        ))}
        
        {state.mode === 'build' && (
          <GhostCursor
            type={state.selectedType}
            scale={state.scale}
            color={state.selectedColor}
            material={state.selectedMaterial}
            snapFn={snapFn}
          />
        )}
        
        <fog attach="fog" args={['#050510', 15, 35]} />
      </Canvas>
      
      {/* UI Overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 10,
      }}>
        {/* Top Bar */}
        <div style={{
          position: 'absolute',
          top: 16,
          left: 16,
          right: 16,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pointerEvents: 'auto',
        }}>
          <div style={{
            background: 'rgba(5, 5, 16, 0.9)',
            backdropFilter: 'blur(8px)',
            padding: '12px 20px',
            borderRadius: '12px',
            border: `1px solid ${COLORS.phosphorus}40`,
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '4px' }}>
                Blocks: {state.blocks.size} / {MAX_BLOCKS}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 600, color: COLORS.phosphorus }}>
                🔺 Mesh Builder
              </div>
            </div>
            
            {loveBalance > 0 && (
              <div style={{
                padding: '8px 16px',
                background: 'rgba(236, 72, 153, 0.2)',
                borderRadius: '8px',
                border: `1px solid ${COLORS.love}40`,
              }}>
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>LOVE</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: COLORS.love }}>
                  {loveBalance.toFixed(1)}
                </div>
              </div>
            )}
          </div>
          
          <div style={{
            display: 'flex',
            gap: '8px',
            pointerEvents: 'auto',
          }}>
            <button
              onClick={() => setShowHelp(!showHelp)}
              style={{
                padding: '10px 16px',
                background: 'rgba(5, 5, 16, 0.9)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${COLORS.calcium}40`,
                borderRadius: '8px',
                color: COLORS.calcium,
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              {showHelp ? '✕' : '?'}
            </button>
          </div>
        </div>
        
        {/* Toolbar */}
        <div style={{
          position: 'absolute',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '8px',
          pointerEvents: 'auto',
          background: 'rgba(5, 5, 16, 0.9)',
          backdropFilter: 'blur(8px)',
          padding: '12px',
          borderRadius: '12px',
          border: `1px solid ${COLORS.phosphorus}40`,
        }}>
          {/* Block Types */}
          {BLOCK_TYPES.map((type, idx) => (
            <button
              key={type}
              onClick={() => setState(prev => ({ ...prev, selectedType: type }))}
              style={{
                padding: '10px 16px',
                background: state.selectedType === type ? COLORS.phosphorus : 'rgba(46, 204, 113, 0.1)',
                border: `1px solid ${state.selectedType === type ? COLORS.phosphorus : 'rgba(46, 204, 113, 0.3)'}`,
                borderRadius: '8px',
                color: state.selectedType === type ? '#050510' : COLORS.phosphorus,
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: state.selectedType === type ? 600 : 400,
              }}
              title={`${idx + 1} - ${type}`}
            >
              {type === 'tetrahedron' ? '🔺' : type === 'cube' ? '⬜' : type === 'sphere' ? '⚪' : type === 'cylinder' ? '⭕' : '🔺'}
            </button>
          ))}
          
          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '0 8px' }} />
          
          {/* Materials */}
          {MATERIALS.map(mat => (
            <button
              key={mat}
              onClick={() => setState(prev => ({ ...prev, selectedMaterial: mat }))}
              style={{
                padding: '10px 16px',
                background: state.selectedMaterial === mat ? COLORS.calcium : 'rgba(96, 165, 250, 0.1)',
                border: `1px solid ${state.selectedMaterial === mat ? COLORS.calcium : 'rgba(96, 165, 250, 0.3)'}`,
                borderRadius: '8px',
                color: state.selectedMaterial === mat ? '#050510' : COLORS.calcium,
                cursor: 'pointer',
                fontSize: '12px',
                textTransform: 'capitalize',
              }}
            >
              {mat}
            </button>
          ))}
          
          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '0 8px' }} />
          
          {/* Color Picker */}
          {Object.entries(COLORS).map(([name, color]) => (
            <button
              key={name}
              onClick={() => setState(prev => ({ ...prev, selectedColor: color }))}
              style={{
                width: '36px',
                height: '36px',
                background: color,
                border: `2px solid ${state.selectedColor === color ? '#fff' : 'transparent'}`,
                borderRadius: '8px',
                cursor: 'pointer',
              }}
              title={name}
            />
          ))}
          
          <div style={{ width: '1px', background: 'rgba(255, 255, 255, 0.1)', margin: '0 8px' }} />
          
          {/* Controls */}
          <button
            onClick={() => setState(prev => ({ ...prev, snapEnabled: !prev.snapEnabled }))}
            style={{
              padding: '10px 16px',
              background: state.snapEnabled ? COLORS.delta : 'rgba(16, 185, 129, 0.1)',
              border: `1px solid ${state.snapEnabled ? COLORS.delta : 'rgba(16, 185, 129, 0.3)'}`,
              borderRadius: '8px',
              color: state.snapEnabled ? '#050510' : COLORS.delta,
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="V - Toggle Snap"
          >
            Snap: {state.snapEnabled ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={() => setState(prev => ({ ...prev, gridVisible: !prev.gridVisible }))}
            style={{
              padding: '10px 16px',
              background: state.gridVisible ? COLORS.cosmic : 'rgba(168, 85, 247, 0.1)',
              border: `1px solid ${state.gridVisible ? COLORS.cosmic : 'rgba(168, 85, 247, 0.3)'}`,
              borderRadius: '8px',
              color: state.gridVisible ? '#050510' : COLORS.cosmic,
              cursor: 'pointer',
              fontSize: '12px',
            }}
            title="H - Toggle Grid"
          >
            Grid: {state.gridVisible ? 'ON' : 'OFF'}
          </button>
          
          <button
            onClick={clearAll}
            style={{
              padding: '10px 16px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: `1px solid ${COLORS.aries}40`,
              borderRadius: '8px',
              color: COLORS.aries,
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Clear All
          </button>
        </div>
        
        {/* Help Panel */}
        {showHelp && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(5, 5, 16, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '24px',
            borderRadius: '16px',
            border: `2px solid ${COLORS.phosphorus}`,
            maxWidth: '500px',
            pointerEvents: 'auto',
            zIndex: 100,
          }}>
            <h3 style={{ color: COLORS.phosphorus, marginTop: 0, marginBottom: '16px' }}>
              🔺 Mesh Builder Controls
            </h3>
            <div style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.6' }}>
              <p><strong>Click</strong> on the build plane to place blocks</p>
              <p><strong>1-5</strong> - Select block type (Tetrahedron, Cube, Sphere, Cylinder, Pyramid)</p>
              <p><strong>W/M/G/E</strong> - Select material (Standard, Metal, Glass, Emissive)</p>
              <p><strong>V</strong> - Toggle snap to grid</p>
              <p><strong>H</strong> - Toggle grid visibility</p>
              <p><strong>+/-</strong> - Adjust block scale</p>
              <p><strong>Delete/Backspace</strong> - Remove selected block</p>
              <p style={{ marginTop: '16px', color: COLORS.love }}>
                💜 Every block placed earns L.O.V.E. tokens!
              </p>
              <p style={{ color: COLORS.delta, marginTop: '8px' }}>
                🔺 Build sovereign. The mesh holds.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
