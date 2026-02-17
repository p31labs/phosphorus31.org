import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

// Spring overshoot easing — pieces "pop" into existence
function easeOutBack(t) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// Connection visualizer component
const ConnectionVisualizer = ({ piece, allPrimitives }) => {
  const connections = piece.connectedTo || [];
  const groupRef = useRef();
  
  useFrame((state) => {
    if (!groupRef.current) return;
    // Pulse effect for connections
    const time = state.clock.elapsedTime;
    const pulse = 1 + Math.sin(time * 6) * 0.1;
    groupRef.current.scale.setScalar(pulse);
  });

  if (connections.length === 0) return null;

  return (
    <group ref={groupRef}>
      {connections.map((connectedId) => {
        const target = allPrimitives.find(p => p.id === connectedId);
        if (!target) return null;

        const startPos = [piece.position.x, piece.position.y, piece.position.z];
        const endPos = [target.position.x, target.position.y, target.position.z];
        
        // Calculate cylinder geometry for connection line
        const dx = endPos[0] - startPos[0];
        const dy = endPos[1] - startPos[1];
        const dz = endPos[2] - startPos[2];
        const length = Math.sqrt(dx*dx + dy*dy + dz*dz);
        
        if (length < 0.1) return null; // Too close, skip

        const midX = (startPos[0] + endPos[0]) / 2;
        const midY = (startPos[1] + endPos[1]) / 2;
        const midZ = (startPos[2] + endPos[2]) / 2;

        // Calculate rotation to align cylinder between points
        const angleY = Math.atan2(dz, dx);
        const angleX = Math.atan2(-dy, Math.sqrt(dx*dx + dz*dz));

        return (
          <mesh
            key={connectedId}
            position={[midX, midY, midZ]}
            rotation={[angleX, angleY, 0]}
          >
            <cylinderGeometry args={[0.02, 0.02, length, 8]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
          </mesh>
        );
      })}
    </group>
  );
};

const GeoPrimitive = ({ piece, isGhost, onRemove, buildMode, allPrimitives }) => {
  const meshRef = useRef();
  const enterRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  const { type, position, scale: s, color } = piece;

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (isGhost) {
      // Ghost: smooth rotation
      mesh.rotation.y += delta * 1.5;
    } else if (enterRef.current < 1) {
      // Entrance: spring from 0 to full scale
      enterRef.current = Math.min(1, enterRef.current + delta * 4.5);
      const t = easeOutBack(enterRef.current);
      mesh.scale.setScalar(s * t);
    } else if (hovered) {
      // Hover: gentle breathing pulse
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 6) * 0.04;
      mesh.scale.setScalar(s * pulse);
    } else {
      // Resting: ensure correct scale (after hover ends)
      mesh.scale.setScalar(s);
    }
  });

  const geometry = useMemo(() => {
    switch (type) {
      case 'octahedron': return <octahedronGeometry args={[s * 0.5, 0]} />;
      case 'icosahedron': return <icosahedronGeometry args={[s * 0.5, 0]} />;
      case 'strut': return <cylinderGeometry args={[s * 0.05, s * 0.05, s * 1.2, 8]} />;
      case 'hub': return <sphereGeometry args={[s * 0.12, 12, 12]} />;
      default: return <tetrahedronGeometry args={[s * 0.6, 0]} />;
    }
  }, [type, s]);

  return (
    <group>
      <mesh
        ref={(mesh) => {
          meshRef.current = mesh;
          // Ghost pieces are invisible to raycaster — clicks pass through to build plate
          if (mesh && isGhost) mesh.raycast = () => {};
        }}
        position={[position.x, position.y, position.z]}
        scale={isGhost ? s : 0.01}
        onClick={(e) => {
          if (buildMode && e.shiftKey && onRemove) {
            e.stopPropagation();
            onRemove(piece.id);
          }
        }}
        onPointerOver={(e) => {
          if (!isGhost && buildMode) {
            e.stopPropagation();
            setHovered(true);
          }
        }}
        onPointerOut={() => {
          if (!isGhost) setHovered(false);
        }}
      >
      {geometry}
      <meshStandardMaterial
        color={color}
        transparent={isGhost || hovered}
        opacity={isGhost ? 0.35 : 1}
        wireframe={isGhost}
        emissive={hovered && !isGhost ? color : '#000000'}
        emissiveIntensity={hovered && !isGhost ? 0.4 : 0}
        roughness={0.4}
        metalness={0.3}
      />
      </mesh>
      
      {/* Connection visualizer */}
      {!isGhost && <ConnectionVisualizer piece={piece} allPrimitives={allPrimitives || []} />}
    </group>
  );
};

export default GeoPrimitive;
