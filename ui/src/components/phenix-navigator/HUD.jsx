import React from 'react';
import { useStore } from '../../store';

/**
 * HUD - Heads-up display showing quantum state and system status
 */
export default function HUD() {
  const coherence = useStore((s) => s.coherence);
  const qStatistic = useStore((s) => s.qStatistic);
  const mode = useStore((s) => s.mode);
  const blockCount = useStore((s) => s.blocks.size);
  const fabrication = useStore((s) => s.fabrication);

  const getCoherenceColor = (value) => {
    if (value > 0.8) return '#00ffff'; // Cyan
    if (value > 0.6) return '#00ff88'; // Green
    if (value > 0.4) return '#ffff00'; // Yellow
    if (value > 0.2) return '#ff8800'; // Orange
    return '#ff0000'; // Red
  };

  const getQColor = (value) => {
    return value > 1 ? '#00ffff' : '#888888';
  };

  return (
    <div className="hud">
      <div className="hud-panel">
        <div className="hud-row">
          <span className="hud-label">COHERENCE</span>
          <span 
            className="hud-value"
            style={{ color: getCoherenceColor(coherence) }}
          >
            {(coherence * 100).toFixed(1)}%
          </span>
        </div>
        
        <div className="hud-row">
          <span className="hud-label">Q-STATISTIC</span>
          <span 
            className="hud-value"
            style={{ color: getQColor(qStatistic) }}
          >
            {qStatistic.toFixed(2)}
          </span>
        </div>
        
        <div className="hud-row">
          <span className="hud-label">MODE</span>
          <span className="hud-value" style={{ color: '#00ffff' }}>
            {mode}
          </span>
        </div>
        
        <div className="hud-row">
          <span className="hud-label">BLOCKS</span>
          <span className="hud-value" style={{ color: '#00ff88' }}>
            {blockCount}
          </span>
        </div>
      </div>

      {/* Fabrication Status */}
      {fabrication.status !== 'idle' && (
        <div className="fabrication-status">
          <div className="status-header">
            <span className="status-label">FABRICATION</span>
            <span className="status-value">{fabrication.status.toUpperCase()}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${fabrication.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}