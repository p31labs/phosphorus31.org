/**
 * Ping Status - Connection health visualization
 * Shows object permanence and heartbeat status
 */

import React from 'react';
import { usePing } from '../../hooks/usePing';

export const PingStatus: React.FC = () => {
  const { ping, loading, health, healthColor, healthLabel, isConnected, nodeCount } = usePing();

  if (loading) {
    return <div className="ping-loading">Checking connection...</div>;
  }

  return (
    <div className="ping-status">
      <div className="ping-header">
        <h3>Connection Status</h3>
        <div className="health-indicator" style={{ backgroundColor: healthColor }}>
          {healthLabel}
        </div>
      </div>

      <div className="ping-details">
        <div className="detail-row">
          <span className="detail-label">Status:</span>
          <span className="detail-value" style={{ color: healthColor }}>
            {ping?.active ? 'Active' : 'Inactive'}
          </span>
        </div>

        <div className="detail-row">
          <span className="detail-label">Nodes:</span>
          <span className="detail-value">{nodeCount}</span>
        </div>

        {ping?.lastHeartbeat && (
          <div className="detail-row">
            <span className="detail-label">Last Heartbeat:</span>
            <span className="detail-value">
              {new Date(ping.lastHeartbeat).toLocaleTimeString()}
            </span>
          </div>
        )}

        {nodeCount > 0 && ping?.nodes && (
          <div className="nodes-list">
            <div className="nodes-header">Connected Nodes:</div>
            {Object.entries(ping.nodes).map(([nodeId, node]) => (
              <div key={nodeId} className="node-item">
                <span className="node-id">{node.nodeId}</span>
                <span className="node-signal">Signal: {node.signalStrength}%</span>
                <span className="node-time">{new Date(node.timestamp).toLocaleTimeString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .ping-status {
          padding: 1rem;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .ping-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .ping-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .health-indicator {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          color: white;
        }

        .ping-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.875rem;
        }

        .detail-label {
          color: rgba(255, 255, 255, 0.6);
        }

        .detail-value {
          font-weight: 500;
        }

        .nodes-list {
          margin-top: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nodes-header {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .node-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
          margin-bottom: 0.25rem;
          font-size: 0.75rem;
        }

        .node-id {
          font-weight: 600;
        }

        .node-signal {
          color: rgba(255, 255, 255, 0.6);
        }

        .node-time {
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.7rem;
        }

        .ping-loading {
          padding: 1rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};
