/**
 * Ping Visualization Component
 * Visual representation of object permanence and heartbeat status
 */

import React, { useEffect, useState } from 'react';
import { bufferService, PingStatus } from '../../services/buffer.service';

export const PingVisualization: React.FC = () => {
  const [pingStatus, setPingStatus] = useState<PingStatus | null>(null);

  useEffect(() => {
    const updatePing = async () => {
      const status = await bufferService.getPingStatus();
      setPingStatus(status);
    };

    updatePing();
    const interval = setInterval(updatePing, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  if (!pingStatus) {
    return (
      <div className="ping-visualization loading">
        <div className="ping-pulse" />
        <span>Loading Ping status...</span>
      </div>
    );
  }

  const nodeCount = Object.keys(pingStatus.nodes).length;
  const healthColor =
    pingStatus.health === 'green'
      ? '#4ade80'
      : pingStatus.health === 'yellow'
        ? '#fbbf24'
        : '#ef4444';

  return (
    <div className="ping-visualization">
      <div className="ping-header">
        <h3>Ping - Object Permanence</h3>
        <div className={`health-badge health-${pingStatus.health}`}>
          {pingStatus.health.toUpperCase()}
        </div>
      </div>

      <div className="ping-nodes">
        {nodeCount === 0 ? (
          <div className="no-nodes">
            <div className="ping-pulse inactive" />
            <span>No active nodes</span>
          </div>
        ) : (
          Object.entries(pingStatus.nodes).map(([nodeId, node]) => {
            const age = Date.now() - new Date(node.timestamp).getTime();
            const isStale = age > 60000; // 60 seconds

            return (
              <div key={nodeId} className={`ping-node ${isStale ? 'stale' : 'active'}`}>
                <div
                  className="node-pulse"
                  style={{ '--health-color': healthColor } as React.CSSProperties}
                />
                <div className="node-info">
                  <div className="node-id">{nodeId}</div>
                  <div className="node-signal">Signal: {node.signalStrength}%</div>
                  <div className="node-age">
                    {age < 1000 ? 'Just now' : `${Math.floor(age / 1000)}s ago`}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {pingStatus.lastHeartbeat && (
        <div className="ping-footer">
          <span>Last heartbeat: {new Date(pingStatus.lastHeartbeat).toLocaleTimeString()}</span>
        </div>
      )}

      <style>{`
        .ping-visualization {
          padding: 1rem;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
        }

        .ping-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .health-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .health-badge.health-green {
          background: #4ade80;
          color: #000;
        }

        .health-badge.health-yellow {
          background: #fbbf24;
          color: #000;
        }

        .health-badge.health-red {
          background: #ef4444;
          color: #fff;
        }

        .ping-nodes {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ping-node {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }

        .ping-node.stale {
          opacity: 0.5;
        }

        .node-pulse {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--health-color);
          animation: pulse 2s infinite;
        }

        .ping-node.stale .node-pulse {
          animation: none;
          background: #666;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        .node-info {
          flex: 1;
        }

        .node-id {
          font-weight: bold;
          font-size: 0.875rem;
        }

        .node-signal, .node-age {
          font-size: 0.75rem;
          color: #999;
        }

        .ping-footer {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          font-size: 0.75rem;
          color: #999;
        }

        .no-nodes {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 2rem;
          color: #999;
        }

        .ping-pulse {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #666;
          animation: pulse 2s infinite;
        }

        .ping-pulse.inactive {
          animation: none;
        }
      `}</style>
    </div>
  );
};
