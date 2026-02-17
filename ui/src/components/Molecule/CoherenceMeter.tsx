/**
 * Coherence Meter
 * Beautiful circular progress meter for quantum coherence
 */

import React from 'react';

interface CoherenceMeterProps {
  coherence: number; // 0-1
  size?: number;
  showLabel?: boolean;
}

export const CoherenceMeter: React.FC<CoherenceMeterProps> = ({
  coherence,
  size = 120,
  showLabel = true,
}) => {
  const percentage = (coherence * 100).toFixed(1);
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - coherence * circumference;

  const getColor = () => {
    if (coherence > 0.7) return '#00FFFF'; // Cyan
    if (coherence > 0.4) return '#00FF88'; // Green-cyan
    if (coherence > 0.2) return '#FFAA00'; // Orange
    return '#FF0000'; // Red
  };

  return (
    <div className="coherence-meter" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="coherence-svg">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{
            filter: `drop-shadow(0 0 8px ${getColor()})`,
            transition: 'stroke-dashoffset 0.3s ease',
          }}
        />
      </svg>
      {showLabel && (
        <div className="coherence-label">
          <div className="coherence-value" style={{ color: getColor() }}>
            {percentage}%
          </div>
          <div className="coherence-text">Coherence</div>
        </div>
      )}
      <style>{`
        .coherence-meter {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .coherence-svg {
          transform: rotate(-90deg);
        }

        .coherence-label {
          position: absolute;
          text-align: center;
        }

        .coherence-value {
          font-size: 1.5rem;
          font-weight: 700;
          text-shadow: 0 0 10px currentColor;
        }

        .coherence-text {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.6);
          margin-top: 0.25rem;
        }
      `}</style>
    </div>
  );
};
