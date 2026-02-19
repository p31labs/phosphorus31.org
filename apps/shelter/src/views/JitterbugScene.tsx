// @ts-nocheck
import { useRef, useMemo } from "react";
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { JitterbugNode } from "@/lib/jitterbug-graph";

/** Tetrahedron vertex positions (radius ~1, centroid at origin). */
const TET_VERTICES: [number, number, number][] = [
  [0.577, 0.577, 0.577],
  [0.577, -0.577, -0.577],
  [-0.577, 0.577, -0.577],
  [-0.577, -0.577, 0.577],
];

const PHOSPHOR = new THREE.Color("#39FF14");

function VEShape({ transitionProgress }: { transitionProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;
    const t = state.clock.elapsedTime;
    const breathe = 1 + 0.06 * Math.sin(t * 0.8);
    const contract = 1 - 0.35 * transitionProgress;
    meshRef.current.scale.setScalar(breathe * contract);
    materialRef.current.opacity = 0.7 * (1 - transitionProgress);
  });
  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.9, 0]} />
      <meshBasicMaterial
        ref={materialRef}
        color={PHOSPHOR}
        wireframe
        transparent
        opacity={0.7}
      />
    </mesh>
  );
}

function TetrahedronNodes({
  nodes,
  transitionProgress,
  onNodeSelect,
}: {
  nodes: JitterbugNode[];
  transitionProgress: number;
  onNodeSelect: (node: JitterbugNode) => void;
}) {
  const positions = useMemo(
    () => TET_VERTICES.map((v) => new THREE.Vector3(...v)),
    []
  );
  const edgesGeo = useMemo(() => {
    const tet = new THREE.TetrahedronGeometry(1, 0);
    return new THREE.EdgesGeometry(tet);
  }, []);
  const visible = transitionProgress > 0.15;
  const scale = Math.min(1, (transitionProgress - 0.15) / 0.35);
  const opacity = Math.min(1, transitionProgress * 2);
  return (
    <group scale={[scale, scale, scale]} visible={visible}>
      <lineSegments geometry={edgesGeo}>
        <lineBasicMaterial color={PHOSPHOR} transparent opacity={0.5 * opacity} />
      </lineSegments>
      {nodes.slice(0, 4).map((node, i) => {
        const pos = positions[i];
        if (!pos) return null;
        return (
          <mesh
            key={node.id}
            position={pos.clone().multiplyScalar(1.15)}
            onClick={() => onNodeSelect(node)}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              document.body.style.cursor = "default";
            }}
          >
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshBasicMaterial color={PHOSPHOR} transparent opacity={0.9 * opacity} />
          </mesh>
        );
      })}
    </group>
  );
}

function SceneContent({
  expanded,
  transitionProgress,
  nodes,
  onNodeSelect,
}: {
  expanded: boolean;
  transitionProgress: number;
  nodes: JitterbugNode[];
  onNodeSelect: (node: JitterbugNode) => void;
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 2, 2]} intensity={0.6} />
      {(!expanded || transitionProgress < 1) && (
        <VEShape transitionProgress={transitionProgress} />
      )}
      {expanded && (
        <TetrahedronNodes
          nodes={nodes}
          transitionProgress={transitionProgress}
          onNodeSelect={onNodeSelect}
        />
      )}
    </>
  );
}

export default function JitterbugScene({
  expanded,
  transitionProgress,
  nodes,
  onNodeSelect,
}: {
  expanded: boolean;
  transitionProgress: number;
  nodes: JitterbugNode[];
  onNodeSelect: (node: JitterbugNode) => void;
}) {
  return (
    <div className="absolute inset-0 w-full h-full bg-void">
      <Canvas
        camera={{ position: [0, 0, 2.8], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <SceneContent
          expanded={expanded}
          transitionProgress={transitionProgress}
          nodes={nodes}
          onNodeSelect={onNodeSelect}
        />
      </Canvas>
    </div>
  );
}
