/**
 * Metabolism Display - Shows energy/spoon levels
 * Real-time visualization of The Buffer's energy system
 *
 * Uses the useMetabolism hook for consistent data fetching
 */

import React from 'react';
import { useMetabolism } from '../../hooks/useMetabolism';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import { STRESS_COLORS } from '../../utils/constants';

export const MetabolismDisplay: React.FC = () => {
  const { metabolism, loading, error, energyPercentage, isStressed } = useMetabolism();
  const { fontSize } = useAccessibilityStore();

  if (loading) {
    return (
      <div className="metabolism-display">
        <div className="metabolism-loading">Loading energy...</div>
      </div>
    );
  }

  if (error || !metabolism) {
    return (
      <div className="metabolism-display">
        <div className="metabolism-error">
          {error ? `Error: ${error.message}` : 'Unable to load energy status'}
        </div>
      </div>
    );
  }

  const getStressColor = (): string => {
    return STRESS_COLORS[metabolism.stressLevel] || '#6b7280';
  };

  const stressColor = getStressColor();

  return (
    <div className="metabolism-display">
      <div className="metabolism-header">
        <h3>Energy System</h3>
        <span className={`stress-badge stress-${metabolism.stressLevel}`}>
          {metabolism.stressLevel.toUpperCase()}
        </span>
      </div>

      <div className="energy-meter">
        <div className="energy-bar-container">
          <div
            className="energy-bar"
            style={{
              width: `${energyPercentage}%`,
              backgroundColor: stressColor,
            }}
            role="progressbar"
            aria-valuenow={energyPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Energy level: ${energyPercentage.toFixed(0)}%`}
          />
        </div>
        <div className="energy-text">
          {metabolism.currentSpoons.toFixed(1)} / {metabolism.maxSpoons} spoons
        </div>
        <div className="energy-percentage">{energyPercentage.toFixed(0)}%</div>
      </div>

      <div className="metabolism-details">
        <div className="detail-item">
          <span className="detail-label">Recovery Rate:</span>
          <span className="detail-value">{metabolism.recoveryRate} spoons/10s</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Last Update:</span>
          <span className="detail-value">
            {new Date(metabolism.lastUpdate).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <style>{`
        .metabolism-display {
          padding: 1rem;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .metabolism-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .metabolism-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
        }

        .stress-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .stress-low { background: #10b981; color: white; }
        .stress-medium { background: #f59e0b; color: white; }
        .stress-high { background: #ef4444; color: white; }
        .stress-critical { background: #dc2626; color: white; }

        .energy-meter {
          margin: 1rem 0;
        }

        .energy-bar-container {
          width: 100%;
          height: 24px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .energy-bar {
          height: 100%;
          transition: width 0.3s ease, background-color 0.3s ease;
          border-radius: 12px;
        }

        .energy-text {
          font-size: 1.25rem;
          font-weight: 600;
          text-align: center;
          margin-bottom: 0.25rem;
        }

        .energy-percentage {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          text-align: center;
        }

        .metabolism-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .detail-item {
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

        .metabolism-loading,
        .metabolism-error {
          padding: 1rem;
          text-align: center;
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};
