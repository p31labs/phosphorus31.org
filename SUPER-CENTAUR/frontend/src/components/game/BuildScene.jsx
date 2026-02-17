import React, { useRef, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import GeoPrimitive from './GeoPrimitive';
import ConnectionVisualization from './ConnectionVisualization';

const CLICK_THRESHOLD = 6;
const _buildPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const _intersect = new THREE.Vector3();

const BuildPlate = ({ onPlace, snapFn }) => {
  const downPos = useRef(null);

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
        if (Math.sqrt(dx * dx + dy * dy) < CLICK_THRESHOLD) {
          e.stopPropagation();
          const p = e.point;
          onPlace([snapFn(p.x), 0.5, snapFn(p.z)]);
        }
      }}
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#1a1a2e" transparent opacity={0.15} />
    </mesh>
  );
};

const GhostCursor = ({ type, scale, color, snapFn }) => {
  const groupRef = useRef();
  const ringRef = useRef();
  const { raycaster, pointer, camera } = useThree();

  useFrame((state) => {
    if (!groupRef.current) return;
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(_buildPlane, _intersect)) {
      const x = snapFn(_intersect.x);
      const z = snapFn(_intersect.z);
      const bob = Math.sin(state.clock.elapsedTime * 3) * 0.08;
      groupRef.current.position.set(x, 0.5 + bob, z);
    }
    if (ringRef.current) {
      ringRef.current.material.opacity = 0.25 + Math.sin(state.clock.elapsedTime * 4) * 0.1;
    }
  });

  const ghost = {
    id: 'ghost', type, scale, color,
    position: { x: 0, y: 0, z: 0 },
  };

  return (
    <group ref={groupRef}>
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.48, 0]}>
        <ringGeometry args={[0.3, 0.42, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>
      <GeoPrimitive piece={ghost} isGhost />
    </group>
  );
};

const BuildScene = ({ gameState }) => {
  const {
    primitives, placePiece, removePiece, gridVisible, snapEnabled,
    mode, selectedType, selectedMaterial, scale, MATERIAL_COLORS,
  } = gameState;
  const controlsRef = useRef();

  const snapFn = useCallback((v) => (snapEnabled ? Math.round(v) : v), [snapEnabled]);

  const handlePlace = useCallback((pos) => {
    if (mode !== 'build') return;
    placePiece(pos);
  }, [mode, placePiece]);

  const handleCreated = useCallback((state) => {
    const canvas = state.gl.domElement;
    canvas.addEventListener('webglcontextlost', (e) => e.preventDefault());
    canvas.addEventListener('webglcontextrestored', () => state.invalidate());
  }, []);

  return (
    <Canvas
      camera={{ position: [8, 6, 8], fov: 50 }}
      style={{ background: '#0a0a1a' }}
      gl={{ antialias: true, powerPreference: 'default', failIfMajorPerformanceCaveat: false }}
      onCreated={handleCreated}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 15, 10]} intensity={0.8} />
      <pointLight position={[-5, 8, -5]} intensity={0.3} color="#7c3aed" />
      <hemisphereLight args={['#2a1a4a', '#0a0a1a', 0.4]} />

      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.08}
        maxPolarAngle={Math.PI / 2.1}
        rotateSpeed={0.5}
      />

      {gridVisible && (
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellColor="#333366"
          sectionSize={5}
          sectionColor="#4444aa"
          fadeDistance={25}
          position={[0, 0, 0]}
        />
      )}

      <BuildPlate onPlace={handlePlace} snapFn={snapFn} />

      {primitives.map((p) => (
        <GeoPrimitive
          key={p.id}
          piece={p}
          onRemove={removePiece}
          buildMode={mode === 'build'}
          allPrimitives={primitives}
        />
      ))}

      <ConnectionVisualization primitives={primitives} showConnections={true} />

      {mode === 'build' && (
        <GhostCursor
          type={selectedType}
          scale={scale}
          color={MATERIAL_COLORS[selectedMaterial]}
          snapFn={snapFn}
        />
      )}

      <fog attach="fog" args={['#0a0a1a', 15, 35]} />
    </Canvas>
  );
};

export default BuildScene;
