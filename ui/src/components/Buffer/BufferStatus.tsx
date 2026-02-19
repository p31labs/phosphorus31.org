/**
 * Buffer Status Component
 * Shows P31 Buffer queue status and health
 */

import React, { useEffect, useState } from 'react';
import { bufferService, QueueStatus, PingStatus } from '../../services/buffer.service';

export const BufferStatus: React.FC = () => {
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [pingStatus, setPingStatus] = useState<PingStatus | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const updateStatus = async () => {
      const connected = await bufferService.healthCheck();
      setIsConnected(connected);

      if (connected) {
        const [queue, ping] = await Promise.all([
          bufferService.getQueueStatus(),
          bufferService.getPingStatus(),
        ]);
        setQueueStatus(queue);
        setPingStatus(ping);
      }
    };

    updateStatus();
    const interval = setInterval(updateStatus, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (!isConnected) {
    return (
      <div className="buffer-status disconnected">
        <div className="status-indicator red" />
        <span>P31 Buffer: Disconnected</span>
      </div>
    );
  }

  const healthColor =
    pingStatus?.health === 'green' ? 'green' : pingStatus?.health === 'yellow' ? 'yellow' : 'red';

  return (
    <div className="buffer-status">
      <div className="status-header">
        <div className={`status-indicator ${healthColor}`} />
        <span>P31 Buffer: {isConnected ? 'Connected' : 'Disconnected'}</span>
      </div>

      {queueStatus && (
        <div className="queue-info">
          <div className="queue-metric">
            <span className="label">Queue Length:</span>
            <span className="value">{queueStatus.queueLength}</span>
          </div>
          <div className="queue-metric">
            <span className="label">Pending:</span>
            <span className="value">{queueStatus.pending}</span>
          </div>
          <div className="queue-metric">
            <span className="label">Processing:</span>
            <span className="value">{queueStatus.processing}</span>
          </div>
        </div>
      )}

      {pingStatus && (
        <div className="ping-info">
          <div className="ping-metric">
            <span className="label">Health:</span>
            <span className={`value health-${pingStatus.health}`}>
              {pingStatus.health.toUpperCase()}
            </span>
          </div>
          {pingStatus.lastHeartbeat && (
            <div className="ping-metric">
              <span className="label">Last Heartbeat:</span>
              <span className="value">
                {new Date(pingStatus.lastHeartbeat).toLocaleTimeString()}
              </span>
            </div>
          )}
          <div className="ping-metric">
            <span className="label">Active Nodes:</span>
            <span className="value">{Object.keys(pingStatus.nodes).length}</span>
          </div>
        </div>
      )}
    </div>
  );
};
