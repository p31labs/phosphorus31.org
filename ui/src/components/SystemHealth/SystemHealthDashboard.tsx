/**
 * System Health Dashboard
 * Complete overview of all P31 components
 */

import React from 'react';
import { MetabolismDisplay } from '../Metabolism/MetabolismDisplay';
import { PingStatus } from '../Ping/PingStatus';
import { usePing } from '../../hooks/usePing';
import { useMetabolism } from '../../hooks/useMetabolism';
import { centaurService } from '../../services/centaur.service';
import { bufferService } from '../../services/buffer.service';

export const SystemHealthDashboard: React.FC = () => {
  const { health: pingHealth, isConnected: pingConnected } = usePing();
  const { energyPercentage, isStressed } = useMetabolism();
  const [centaurHealth, setCentaurHealth] = React.useState<boolean>(false);
  const [bufferHealth, setBufferHealth] = React.useState<boolean>(false);

  React.useEffect(() => {
    const checkHealth = async () => {
      const centaur = await centaurService.checkHealth();
      setCentaurHealth(centaur);

      try {
        const bufferStatus = await bufferService.getQueueStatus();
        setBufferHealth(bufferStatus.connected);
      } catch {
        setBufferHealth(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getOverallHealth = () => {
    if (pingHealth === 'red' || !centaurHealth || !bufferHealth || isStressed) {
      return 'critical';
    }
    if (pingHealth === 'yellow' || energyPercentage < 50) {
      return 'warning';
    }
    return 'healthy';
  };

  const overallHealth = getOverallHealth();
  const healthColor = {
    healthy: '#10b981',
    warning: '#f59e0b',
    critical: '#ef4444',
  }[overallHealth];

  return (
    <div className="system-health-dashboard">
      <div className="dashboard-header">
        <h2>System Health</h2>
        <div className="overall-status" style={{ backgroundColor: healthColor }}>
          {overallHealth.toUpperCase()}
        </div>
      </div>

      <div className="health-grid">
        <div className="health-card">
          <h4>The Buffer</h4>
          <div className="status-indicator">
            <span
              className="status-dot"
              style={{ backgroundColor: bufferHealth ? '#10b981' : '#ef4444' }}
            />
            <span>{bufferHealth ? 'Connected' : 'Disconnected'}</span>
          </div>
          <MetabolismDisplay />
        </div>

        <div className="health-card">
          <h4>The Centaur</h4>
          <div className="status-indicator">
            <span
              className="status-dot"
              style={{ backgroundColor: centaurHealth ? '#10b981' : '#ef4444' }}
            />
            <span>{centaurHealth ? 'Connected' : 'Disconnected'}</span>
          </div>
          <div className="component-info">
            <div>Backend AI Protocol</div>
            <div>Status: {centaurHealth ? 'Operational' : 'Offline'}</div>
          </div>
        </div>

        <div className="health-card">
          <h4>Ping System</h4>
          <PingStatus />
        </div>
      </div>

      <style>{`
        .system-health-dashboard {
          padding: 2rem;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .dashboard-header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .overall-status {
          padding: 0.5rem 1rem;
          border-radius: 16px;
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
        }

        .health-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .health-card {
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .health-card h4 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .component-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};
