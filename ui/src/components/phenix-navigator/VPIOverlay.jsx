import React from 'react';
import { useStore } from '../../store';

/**
 * VPIOverlay - Voxel Processing Interface overlay
 * Displays processing status and quantum state information
 */
export default function VPIOverlay() {
  const coherence = useStore((s) => s.coherence);
  const qStatistic = useStore((s) => s.qStatistic);
  const mode = useStore((s) => s.mode);
  const molecules = useStore((s) => s.molecules);

  const getProcessingStatus = () => {
    if (mode === 'BUILD') return 'BUILDING QUANTUM STATE';
    if (mode === 'SLICE') return 'SLICING FOR FABRICATION';
    if (mode === 'EXPORT') return 'EXPORTING TO QUANTUM LAYER';
    return 'IDLE';
  };

  const getQuantumState = () => {
    if (qStatistic > 1.5) return 'QUANTUM DOMINANT';
    if (qStatistic > 1.0) return 'QUANTUM ACTIVE';
    if (qStatistic > 0.5) return 'CLASSICAL';
    return 'DECOHERED';
  };

  return (
    <div className="vpi-overlay">
      <div className="vpi-header">
        <span className="vpi-title">VPI</span>
        <span className="vpi-status">{getProcessingStatus()}</span>
      </div>
      
      <div className="vpi-metrics">
        <div className="metric-row">
          <span className="metric-label">QUANTUM STATE</span>
          <span className="metric-value" style={{ color: qStatistic > 1 ? '#00ffff' : '#888888' }}>
            {getQuantumState()}
          </span>
        </div>
        
        <div className="metric-row">
          <span className="metric-label">COHERENCE</span>
          <span className="metric-value" style={{ color: '#00ff88' }}>
            {(coherence * 100).toFixed(1)}%
          </span>
        </div>
        
        <div className="metric-row">
          <span className="metric-label">MOLECULES</span>
          <span className="metric-value" style={{ color: '#ffff00' }}>
            {molecules.length}
          </span>
        </div>
      </div>

      {/* Quantum Waveform Visualization */}
      <div className="waveform-container">
        <div className="waveform">
          <div 
            className="wave"
            style={{ 
              width: `${coherence * 100}%`,
              background: `linear-gradient(90deg, #00ffff, ${coherence > 0.5 ? '#00ff88' : '#ff0000'})`
            }}
          />
        </div>
      </div>
    </div>
  );
}