/**
 * P31 Scope — OctahedralNav: 3D orbital navigation (Posner P-atom positions).
 * Six nodes at stretched-octahedron vertices; swipe rotates 60° (S₆); quiet mode = 2D list.
 */

import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useNavigationStore } from '@/store/useNavigationStore';
import { useSensoryStore, useGlowIntensity, useAnimationEnabled } from '@/store/useSensoryStore';
import { GlowBadge } from '@/components/scope/GlowBadge';
import type { PosnerNodeId } from '@/store/useNavigationStore';

/** Six P-atom positions (stretched octahedron), scaled for nav radius. */
const OCTAHEDRAL_POSITIONS: [number, number, number][] = [
  [1.275, 0.736, 1.275],   // +Z — Neural Core
  [-1.275, -0.736, -1.275], // -Z — Settings
  [0.736, 1.275, -1.275],   // Comm (front-right)
  [-0.736, -1.275, 1.275],  // Archives (back-left)
  [1.275, -0.736, -0.736],  // Project A (front-left)
  [-1.275, 0.736, 0.736],   // Project B (back-right)
];

const NODE_IDS: PosnerNodeId[] = [
  'neural-core',
  'settings',
  'communication',
  'archives',
  'project-a',
  'project-b',
];

const NODE_LABELS: Record<NonNullable<PosnerNodeId>, string> = {
  'neural-core': 'Neural Core',
  settings: 'Settings',
  communication: 'Comm',
  archives: 'Archives',
  'project-a': 'Project A',
  'project-b': 'Project B',
};

const RADIUS = 2.2;

interface NavNode3DProps {
  position: [number, number, number];
  nodeId: PosnerNodeId;
  label: string;
  isActive: boolean;
  glowIntensity: number;
  onClick: () => void;
}

function NavNode3D({ position, nodeId, label, isActive, glowIntensity, onClick }: NavNode3DProps) {
  const vec = useMemo(
    () => new THREE.Vector3(position[0], position[1], position[2]).normalize().multiplyScalar(RADIUS),
    [position]
  );

  return (
    <Html position={vec} center className="pointer-events-none" style={{ pointerEvents: 'auto' }}>
      <GlowBadge
        label={label}
        active={isActive}
        glowIntensity={glowIntensity}
        onClick={onClick}
        aria-label={`Go to ${label}`}
      />
    </Html>
  );
}

function OctahedronGroup({
  activeNode,
  navigateTo,
  glowIntensity,
}: {
  activeNode: PosnerNodeId;
  navigateTo: (id: PosnerNodeId) => void;
  glowIntensity: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [dragStart, setDragStart] = useState<{ x: number; theta: number } | null>(null);
  const targetRotation = useRef(0);
  const currentRotation = useRef(0);
  const animationEnabled = useAnimationEnabled();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (animationEnabled && dragStart === null) {
      currentRotation.current += delta * 0.15;
      groupRef.current.rotation.y = currentRotation.current;
    } else if (groupRef.current.rotation.y !== undefined) {
      const target = targetRotation.current;
      const current = groupRef.current.rotation.y;
      groupRef.current.rotation.y = current + (target - current) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {OCTAHEDRAL_POSITIONS.map((pos, i) => {
        const nodeId = NODE_IDS[i];
        if (!nodeId) return null;
        const label = NODE_LABELS[nodeId];
        return (
          <NavNode3D
            key={nodeId}
            position={pos}
            nodeId={nodeId}
            label={label}
            isActive={activeNode === nodeId}
            glowIntensity={glowIntensity}
            onClick={() => navigateTo(nodeId)}
          />
        );
      })}
    </group>
  );
}

export interface OctahedralNavProps {
  className?: string;
  /** Force 2D fallback (e.g. mobile or quiet mode). */
  force2D?: boolean;
}

export function OctahedralNav({ className = '', force2D = false }: OctahedralNavProps) {
  const mode = useSensoryStore((s) => s.mode);
  const activeNode = useNavigationStore((s) => s.activeNode);
  const navigateTo = useNavigationStore((s) => s.navigateTo);
  const glowIntensity = useGlowIntensity();
  const animationEnabled = useAnimationEnabled();

  const use2D = force2D || mode === 'quiet' || !animationEnabled;

  if (use2D) {
    return (
      <nav
        className={`scope-octahedral-nav-2d flex flex-col gap-2 rounded-lg border border-white/10 bg-black/40 p-3 ${className}`}
        aria-label="Dashboard sections"
      >
        {NODE_IDS.map((nodeId) => {
          const label = NODE_LABELS[nodeId];
          return (
            <GlowBadge
              key={nodeId}
              label={label}
              active={activeNode === nodeId}
              glowIntensity={glowIntensity}
              onClick={() => navigateTo(nodeId)}
              aria-label={`Go to ${label}`}
            />
          );
        })}
      </nav>
    );
  }

  return (
    <div className={`scope-octahedral-nav relative h-[280px] w-[280px] ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <OctahedronGroup
            activeNode={activeNode}
            navigateTo={navigateTo}
            glowIntensity={glowIntensity}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
