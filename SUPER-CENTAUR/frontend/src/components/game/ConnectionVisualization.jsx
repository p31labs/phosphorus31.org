import React from 'react';
import { Line } from '@react-three/drei';
import { Vector3 } from 'three';

const ConnectionVisualization = ({ primitives, showConnections }) => {
  if (!showConnections) return null;

  const connectionLines = [];

  primitives.forEach(primitive => {
    if (primitive.connectedTo.length > 0) {
      const startPos = new Vector3(
        primitive.position.x,
        primitive.position.y,
        primitive.position.z
      );

      primitive.connectedTo.forEach((connectedId) => {
        const connectedPrimitive = primitives.find(p => p.id === connectedId);
        if (connectedPrimitive) {
          const endPos = new Vector3(
            connectedPrimitive.position.x,
            connectedPrimitive.position.y,
            connectedPrimitive.position.z
          );

          connectionLines.push(
            <Line
              key={`${primitive.id}-${connectedId}`}
              points={[startPos, endPos]}
              color="#00ffff"
              lineWidth={2}
              transparent
              opacity={0.6}
            />
          );
        }
      });
    }
  });

  return <>{connectionLines}</>;
};

export default ConnectionVisualization;
