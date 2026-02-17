import React from 'react';
import { useStore } from '../../store';

/**
 * CreationPipeline - Visual representation of the creation workflow
 * Shows the flow from idea to materialization
 */
export default function CreationPipeline() {
  const coherence = useStore((s) => s.coherence);
  const qStatistic = useStore((s) => s.qStatistic);
  const mode = useStore((s) => s.mode);
  const fabrication = useStore((s) => s.fabrication);

  const getPipelineStatus = () => {
    if (mode === 'BUILD') return 'IDEATION';
    if (mode === 'SLICE') return 'PROCESSING';
    if (mode === 'EXPORT') return 'MATERIALIZATION';
    return 'IDLE';
  };

  const getPipelineColor = () => {
    if (coherence > 0.8) return '#00ffff'; // Quantum Blue
    if (coherence > 0.6) return '#00ff88'; // Growth Green
    if (coherence > 0.4) return '#ffff00'; // Energy Yellow
    return '#ff0000'; // Error Red
  };

  return (
    <div className="creation-pipeline">
      <div className="pipeline-header">
        <span className="pipeline-title">CREATION PIPELINE</span>
        <span className="pipeline-status">{getPipelineStatus()}</span>
      </div>
      
      <div className="pipeline-flow">
        {/* Stage 1: Ideation */}
        <div className="pipeline-stage">
          <div className="stage-icon">💭</div>
          <div className="stage-label">IDEATION</div>
          <div className="stage-indicator" style={{ 
            background: mode === 'BUILD' ? getPipelineColor() : '#333333' 
          }} />
        </div>

        {/* Connector */}
        <div className="pipeline-connector" style={{ 
          background: getPipelineColor() 
        }} />

        {/* Stage 2: Processing */}
        <div className="pipeline-stage">
          <div className="stage-icon">⚙️</div>
          <div className="stage-label">PROCESSING</div>
          <div className="stage-indicator" style={{ 
            background: mode === 'SLICE' ? getPipelineColor() : '#333333' 
          }} />
        </div>

        {/* Connector */}
        <div className="pipeline-connector" style={{ 
          background: getPipelineColor() 
        }} />

        {/* Stage 3: Materialization */}
        <div className="pipeline-stage">
          <div className="stage-icon">🌍</div>
          <div className="stage-label">MATERIALIZE</div>
          <div className="stage-indicator" style={{ 
            background: mode === 'EXPORT' ? getPipelineColor() : '#333333' 
          }} />
        </div>
      </div>

      {/* Quantum Flow Visualization */}
      <div className="quantum-flow">
        <div className="flow-bar">
          <div 
            className="flow-fill"
            style={{ 
              width: `${coherence * 100}%`,
              background: getPipelineColor()
            }}
          />
        </div>
        <div className="flow-labels">
          <span>QUANTUM FLOW</span>
          <span>{(coherence * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Fabrication Progress */}
      {fabrication.status !== 'idle' && (
        <div className="fabrication-progress">
          <div className="progress-header">
            <span>FABRICATION PROGRESS</span>
            <span>{fabrication.progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ 
                width: `${fabrication.progress}%`,
                background: getPipelineColor()
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}