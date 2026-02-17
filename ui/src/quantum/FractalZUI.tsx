/**
 * P31 Scope — Fractal ZUI: Zoomable User Interface engine.
 * Three levels: Constellation → Workspace → Data. Each node can unfold into inner Posner.
 */

import React, { useRef, useState, useCallback, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export type ZoomLevel = 'constellation' | 'workspace' | 'data';

export interface FractalNode {
  id: string;
  label: string;
  type: string;
  children?: FractalNode[];
}

interface FractalZUIProps {
  data: FractalNode[];
  onNodeSelect?: (node: FractalNode, level: ZoomLevel) => void;
  className?: string;
}

/** Posner P positions (octahedral), scaled — tuples to avoid per-frame Vector3 alloc in render. */
const P_POSITIONS: [number, number, number][] = [
  [1.275, 0.736, 1.275],
  [-1.275, -0.736, -1.275],
  [0.736, 1.275, -1.275],
  [-0.736, -1.275, 1.275],
  [1.275, -0.736, -0.736],
  [-1.275, 0.736, 0.736],
].map((p) => [p[0] * 0.35, p[1] * 0.35, p[2] * 0.35] as [number, number, number]);

const CAMERA_Z = {
  constellation: 12,
  workspace: 4,
  data: 1.8,
};

function spring(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

function SceneWorkspace({
  nodes,
  focusId,
  onSelect,
  onBack,
}: {
  nodes: FractalNode[];
  focusId: string | null;
  onSelect: (node: FractalNode) => void;
  onBack: () => void;
}) {
  const displayNodes = nodes.slice(0, 6);

  return (
    <group>
      {/* Center (Ca) — current focus */}
      <mesh position={[0, 0, 0]} onClick={(e) => e.stopPropagation()}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.8} />
      </mesh>
      {displayNodes.map((node, i) => {
        const pos = P_POSITIONS[i] ?? [0, 0, 0];
        const isFocus = focusId === node.id;
        return (
          <group key={node.id} position={pos}>
            <mesh
              onClick={(e) => {
                e.stopPropagation();
                onSelect(node);
              }}
            >
              <sphereGeometry args={[isFocus ? 0.18 : 0.14, 16, 16]} />
              <meshBasicMaterial
                color={isFocus ? '#2ecc71' : '#2ecc7180'}
                transparent
                opacity={0.9}
              />
            </mesh>
            <Html center position={[0, 0.25, 0]} style={{ pointerEvents: 'none' }}>
              <span className="text-xs text-green-400/90 whitespace-nowrap">{node.label}</span>
            </Html>
          </group>
        );
      })}
      {/* Back always visible: navigation must work even when animations are off (reduced-motion / quiet). */}
      <Html position={[-1.5, 1.2, 0]}>
        <button
          type="button"
          onClick={onBack}
          className="rounded border border-white/30 bg-black/60 px-2 py-1 text-xs text-gray-300 hover:bg-white/10"
        >
          ← Back
        </button>
      </Html>
    </group>
  );
}

function SceneConstellation({
  molecules,
  onSelectMolecule,
}: {
  molecules: FractalNode[];
  onSelectMolecule: (node: FractalNode) => void;
}) {
  return (
    <group>
      {molecules.slice(0, 6).map((mol, i) => {
        const angle = (i / molecules.length) * Math.PI * 2;
        const x = Math.cos(angle) * 3;
        const z = Math.sin(angle) * 3;
        return (
          <group key={mol.id} position={[x, 0, z]}>
            <mesh onClick={() => onSelectMolecule(mol)}>
              <sphereGeometry args={[0.25, 12, 12]} />
              <meshBasicMaterial color="#2ecc71" transparent opacity={0.7} />
            </mesh>
            <Html center position={[0, 0.4, 0]} style={{ pointerEvents: 'none' }}>
              <span className="text-xs text-green-400/90">{mol.label}</span>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function SceneData({
  items,
  onBack,
}: {
  items: FractalNode[];
  onBack: () => void;
}) {
  const displayItems = items.slice(0, 6);
  return (
    <group>
      {displayItems.map((item, i) => {
        const pos = P_POSITIONS[i] ?? [0, 0, 0];
        return (
          <group key={item.id} position={pos}>
            <mesh>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshBasicMaterial color="#eab308" transparent opacity={0.9} />
            </mesh>
            <Html center position={[0, 0.2, 0]} style={{ pointerEvents: 'none' }}>
              <span className="text-[10px] text-yellow-400/90">{item.label}</span>
            </Html>
          </group>
        );
      })}
      <Html position={[-1.2, 1, 0]}>
        <button
          type="button"
          onClick={onBack}
          className="rounded border border-white/30 bg-black/60 px-2 py-1 text-xs text-gray-300 hover:bg-white/10"
        >
          ← Back
        </button>
      </Html>
    </group>
  );
}

function CameraDolly({ targetZ }: { targetZ: number }) {
  const { camera } = useThree();
  const currentZ = useRef((camera as THREE.PerspectiveCamera).position.z);

  useFrame(() => {
    currentZ.current = spring(currentZ.current, targetZ, 0.07);
    (camera as THREE.PerspectiveCamera).position.z = currentZ.current;
  });

  return null;
}

export function FractalZUI({ data, onNodeSelect, className = '' }: FractalZUIProps) {
  const [level, setLevel] = useState<ZoomLevel>('workspace');
  const [stack, setStack] = useState<FractalNode[]>([{ id: 'root', label: 'Root', type: 'root', children: data }]);
  const [focusNode, setFocusNode] = useState<FractalNode | null>(null);

  const current = stack[stack.length - 1];
  const children = current?.children ?? [];
  const breadcrumbs = stack.map((n) => ({ id: n.id, label: n.label }));

  const targetZ = useMemo(() => {
    if (level === 'constellation') return CAMERA_Z.constellation;
    if (level === 'data') return CAMERA_Z.data;
    return CAMERA_Z.workspace;
  }, [level]);

  const handleZoomIn = useCallback(
    (node: FractalNode) => {
      if (node.children && node.children.length > 0) {
        setStack((s) => [...s, node]);
        setLevel('data');
        setFocusNode(node);
        onNodeSelect?.(node, 'data');
      } else {
        setFocusNode(node);
        setLevel('workspace');
        onNodeSelect?.(node, 'workspace');
      }
    },
    [onNodeSelect]
  );

  const handleZoomOut = useCallback(() => {
    if (level === 'data' && stack.length > 1) {
      setStack((s) => {
        const next = s.slice(0, -1);
        const parent = next[next.length - 1] ?? null;
        setFocusNode(parent);
        return next;
      });
      setLevel('workspace');
    } else if (level === 'workspace') {
      setLevel('constellation');
      setFocusNode(null);
      setStack([{ id: 'root', label: 'Root', type: 'root', children: data }]);
    }
  }, [level, stack.length, data]);

  const handleSelectConstellation = useCallback((node: FractalNode) => {
    setStack([{ id: 'root', label: 'Root', type: 'root', children: data }, node]);
    setFocusNode(node);
    setLevel('workspace');
  }, [data]);

  return (
    <div className={`fractal-zui relative h-full w-full ${className}`}>
      {/* Breadcrumbs */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded bg-black/50 px-2 py-1">
        {breadcrumbs.map((b, i) => (
          <span key={b.id} className="text-[10px] text-gray-400">
            {i > 0 && ' › '}
            {b.label}
          </span>
        ))}
      </div>

      <Canvas
        camera={{ position: [0, 0, CAMERA_Z.workspace], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
        onPointerMissed={handleZoomOut}
        style={{ background: 'transparent' }}
      >
        <color attach="background" args={['#050510']} />
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={0.8} />
        <CameraDolly targetZ={targetZ} />

        <Suspense fallback={null}>
          {level === 'constellation' && (
            <SceneConstellation molecules={data} onSelectMolecule={handleSelectConstellation} />
          )}
          {level === 'workspace' && (
            <SceneWorkspace
              nodes={children}
              focusId={focusNode?.id ?? null}
              onSelect={handleZoomIn}
              onBack={() => setLevel('constellation')}
            />
          )}
          {level === 'data' && focusNode && (
            <SceneData
              items={focusNode.children ?? []}
              onBack={() => {
                setStack((s) => {
                  const next = s.slice(0, -1);
                  setFocusNode(next[next.length - 1] ?? null);
                  return next;
                });
                setLevel('workspace');
              }}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
