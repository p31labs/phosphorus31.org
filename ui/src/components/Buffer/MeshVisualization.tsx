/**
 * Mesh Network Visualization
 * Shows tetrahedron topology with nodes and connections
 */

import React, { useEffect, useState } from 'react';
import { bufferService } from '../../services/buffer.service';

interface MeshNode {
  id: string;
  status: 'online' | 'offline' | 'syncing';
  signalStrength: number;
  lastSeen: string;
}

export const MeshVisualization: React.FC = () => {
  const [nodes, setNodes] = useState<MeshNode[]>([]);
  const [pingStatus, setPingStatus] = useState<any>(null);

  useEffect(() => {
    const updateMesh = async () => {
      const status = await bufferService.getPingStatus();
      setPingStatus(status);

      if (status?.nodes) {
        const nodeList: MeshNode[] = Object.entries(status.nodes).map(
          ([id, node]: [string, any]) => ({
            id,
            status: Date.now() - new Date(node.timestamp).getTime() < 60000 ? 'online' : 'offline',
            signalStrength: node.signalStrength,
            lastSeen: node.timestamp,
          })
        );
        setNodes(nodeList);
      }
    };

    updateMesh();
    const interval = setInterval(updateMesh, 5000);
    return () => clearInterval(interval);
  }, []);

  // Tetrahedron topology: 4 vertices
  const vertexPositions = [
    { x: 0, y: 0, z: 0 }, // Vertex 1
    { x: 1, y: 0, z: 0 }, // Vertex 2
    { x: 0.5, y: 0.866, z: 0 }, // Vertex 3
    { x: 0.5, y: 0.289, z: 0.816 }, // Vertex 4 (top)
  ];

  const edges = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];

  return (
    <div className="mesh-visualization">
      <h3>Mesh Network - Tetrahedron Topology</h3>

      <div className="mesh-container">
        <svg viewBox="-0.2 -0.2 1.4 1.2" className="mesh-svg">
          {/* Edges (6 edges in tetrahedron) */}
          {edges.map(([from, to], idx) => {
            const fromPos = vertexPositions[from];
            const toPos = vertexPositions[to];
            return (
              <line
                key={idx}
                x1={fromPos.x}
                y1={fromPos.y}
                x2={toPos.x}
                y2={toPos.y}
                stroke="#6366f1"
                strokeWidth="0.02"
                opacity="0.5"
              />
            );
          })}

          {/* Vertices (4 vertices) */}
          {vertexPositions.map((pos, idx) => {
            const node = nodes[idx];
            const isOnline = node?.status === 'online';
            const signalStrength = node?.signalStrength || 0;

            return (
              <g key={idx}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="0.05"
                  fill={isOnline ? '#4ade80' : '#6b7280'}
                  className={isOnline ? 'pulse' : ''}
                />
                <text x={pos.x} y={pos.y - 0.08} fontSize="0.04" fill="#fff" textAnchor="middle">
                  {node?.id || `Node ${idx + 1}`}
                </text>
                {node && (
                  <text x={pos.x} y={pos.y + 0.1} fontSize="0.03" fill="#999" textAnchor="middle">
                    {signalStrength}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mesh-info">
        <div className="info-item">
          <span className="label">Topology:</span>
          <span className="value">Tetrahedron (4 vertices, 6 edges)</span>
        </div>
        <div className="info-item">
          <span className="label">Active Nodes:</span>
          <span className="value">
            {nodes.filter((n) => n.status === 'online').length} / {nodes.length || 4}
          </span>
        </div>
        <div className="info-item">
          <span className="label">Health:</span>
          <span className={`value health-${pingStatus?.health || 'red'}`}>
            {pingStatus?.health?.toUpperCase() || 'UNKNOWN'}
          </span>
        </div>
      </div>

      <style>{`
        .mesh-visualization {
          padding: 1rem;
        }

        .mesh-container {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          padding: 1rem;
          margin: 1rem 0;
        }

        .mesh-svg {
          width: 100%;
          height: 300px;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }

        .pulse {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.1);
          }
        }

        .mesh-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }

        .label {
          color: #999;
          font-size: 0.875rem;
        }

        .value {
          font-weight: bold;
        }

        .value.health-green {
          color: #4ade80;
        }

        .value.health-yellow {
          color: #fbbf24;
        }

        .value.health-red {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};
