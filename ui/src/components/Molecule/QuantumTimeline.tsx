/**
 * Quantum Timeline
 * Shows coherence decay over time
 */

import React, { useState, useEffect } from 'react';
import { calculateCoherenceDecay } from '../../utils/moleculeBuilder';

interface QuantumTimelineProps {
  initialCoherence: number;
  decoherenceRate: number;
  onCoherenceUpdate?: (coherence: number) => void;
}

export const QuantumTimeline: React.FC<QuantumTimelineProps> = ({
  initialCoherence,
  decoherenceRate,
  onCoherenceUpdate,
}) => {
  const [currentCoherence, setCurrentCoherence] = useState(initialCoherence);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        const newTime = prev + 0.1; // 100ms increments
        const newCoherence = calculateCoherenceDecay(initialCoherence, decoherenceRate, newTime);
        setCurrentCoherence(newCoherence);
        if (onCoherenceUpdate) {
          onCoherenceUpdate(newCoherence);
        }
        return newTime;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [initialCoherence, decoherenceRate, onCoherenceUpdate]);

  const lifetime = decoherenceRate / 1000; // Convert to seconds

  return (
    <div className="quantum-timeline">
      <div className="timeline-header">
        <span>Coherence Decay</span>
        <span className="time-value">{time.toFixed(1)}s</span>
      </div>
      <div className="timeline-bar">
        <div
          className="timeline-progress"
          style={{
            width: `${(currentCoherence / initialCoherence) * 100}%`,
            backgroundColor: currentCoherence > 0.5 ? '#00FFFF' : '#FFAA00',
          }}
        />
      </div>
      <div className="timeline-info">
        <span>Lifetime: {lifetime.toFixed(0)}s</span>
        <span>Current: {(currentCoherence * 100).toFixed(1)}%</span>
      </div>
      <style>{`
        .quantum-timeline {
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          border: 1px solid rgba(0, 255, 255, 0.3);
        }

        .timeline-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
        }

        .time-value {
          color: #00FFFF;
          font-weight: 600;
        }

        .timeline-bar {
          width: 100%;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }

        .timeline-progress {
          height: 100%;
          transition: width 0.1s linear;
          box-shadow: 0 0 10px currentColor;
        }

        .timeline-info {
          display: flex;
          justify-content: space-between;
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
        }
      `}</style>
    </div>
  );
};
