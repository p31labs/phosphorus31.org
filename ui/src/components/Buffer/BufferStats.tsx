/**
 * Buffer Statistics Component
 * Shows message statistics and processing metrics
 */

import React, { useEffect, useState } from 'react';

interface Stats {
  total: number;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
}

export const BufferStats: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/messages/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return <div className="buffer-stats loading">Loading statistics...</div>;
  }

  const completionRate =
    stats.total > 0 ? ((stats.completed / stats.total) * 100).toFixed(1) : '0.0';

  return (
    <div className="buffer-stats">
      <h3>Statistics</h3>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Messages</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pending</div>
          <div className="stat-value pending">{stats.pending}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Processing</div>
          <div className="stat-value processing">{stats.processing}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completed</div>
          <div className="stat-value completed">{stats.completed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Failed</div>
          <div className="stat-value failed">{stats.failed}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Completion Rate</div>
          <div className="stat-value">{completionRate}%</div>
        </div>
      </div>

      <style>{`
        .buffer-stats {
          padding: 1rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .stat-card {
          background: rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #999;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .stat-value.pending {
          color: #fbbf24;
        }

        .stat-value.processing {
          color: #3b82f6;
        }

        .stat-value.completed {
          color: #4ade80;
        }

        .stat-value.failed {
          color: #ef4444;
        }
      `}</style>
    </div>
  );
};
