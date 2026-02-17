/**
 * Alerts Panel Component
 * Shows monitoring alerts from The Buffer
 */

import React, { useEffect, useState } from 'react';

interface Alert {
  id: string;
  type: 'warning' | 'error' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
}

export const AlertsPanel: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/monitoring/alerts');
        if (response.ok) {
          const data = await response.json();
          setAlerts(data);
        }
      } catch (error) {
        console.error('Error loading alerts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
    const interval = setInterval(loadAlerts, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const resolveAlert = async (alertId: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/monitoring/alerts/${alertId}/resolve`,
        {
          method: 'POST',
        }
      );
      if (response.ok) {
        setAlerts(alerts.filter((a) => a.id !== alertId));
      }
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  if (loading) {
    return <div className="alerts-panel loading">Loading alerts...</div>;
  }

  const activeAlerts = alerts.filter((a) => !a.resolved);

  if (activeAlerts.length === 0) {
    return (
      <div className="alerts-panel">
        <div className="no-alerts">
          <span className="status-indicator green" />
          <span>No active alerts - All systems operational</span>
        </div>
      </div>
    );
  }

  return (
    <div className="alerts-panel">
      <div className="alerts-header">
        <h3>Alerts</h3>
        <span className="alert-count">{activeAlerts.length}</span>
      </div>

      <div className="alerts-list">
        {activeAlerts.map((alert) => (
          <div key={alert.id} className={`alert-item alert-${alert.type}`}>
            <div className="alert-content">
              <div className="alert-header">
                <span className={`alert-type ${alert.type}`}>{alert.type.toUpperCase()}</span>
                <span className="alert-time">{new Date(alert.timestamp).toLocaleTimeString()}</span>
              </div>
              <div className="alert-message">{alert.message}</div>
            </div>
            <button onClick={() => resolveAlert(alert.id)} className="resolve-button">
              Resolve
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .alerts-panel {
          padding: 1rem;
        }

        .no-alerts {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(74, 222, 128, 0.1);
          border: 1px solid #4ade80;
          border-radius: 4px;
          color: #4ade80;
        }

        .status-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-indicator.green {
          background: #4ade80;
          animation: pulse 2s infinite;
        }

        .alerts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .alert-count {
          padding: 0.25rem 0.75rem;
          background: #ef4444;
          color: #fff;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: bold;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .alert-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          border-left: 3px solid;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.2);
        }

        .alert-item.alert-critical {
          border-left-color: #ef4444;
        }

        .alert-item.alert-error {
          border-left-color: #f59e0b;
        }

        .alert-item.alert-warning {
          border-left-color: #fbbf24;
        }

        .alert-content {
          flex: 1;
        }

        .alert-header {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-bottom: 0.25rem;
        }

        .alert-type {
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
        }

        .alert-type.critical {
          background: #ef4444;
          color: #fff;
        }

        .alert-type.error {
          background: #f59e0b;
          color: #000;
        }

        .alert-type.warning {
          background: #fbbf24;
          color: #000;
        }

        .alert-time {
          font-size: 0.75rem;
          color: #999;
        }

        .alert-message {
          font-size: 0.875rem;
        }

        .resolve-button {
          padding: 0.5rem 1rem;
          background: rgba(99, 102, 241, 0.2);
          border: 1px solid #6366f1;
          border-radius: 4px;
          color: #fff;
          cursor: pointer;
          font-size: 0.875rem;
        }

        .resolve-button:hover {
          background: rgba(99, 102, 241, 0.3);
        }
      `}</style>
    </div>
  );
};
