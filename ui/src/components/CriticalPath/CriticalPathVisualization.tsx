/**
 * Critical Path Visualization
 * Visual representation of critical paths, dependencies, and bottlenecks
 */

import React, { useState, useEffect } from 'react';
import { useGameEngineContext } from '../Game/GameEngineProvider';
import { SimpleButton } from '../Accessibility/SimpleButton';

export const CriticalPathVisualization: React.FC = () => {
  const { gameEngine } = useGameEngineContext();
  const [paths, setPaths] = useState<any[]>([]);
  const [executionOrder, setExecutionOrder] = useState<string[]>([]);
  const [bottlenecks, setBottlenecks] = useState<string[]>([]);
  const [pathNodes, setPathNodes] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

  useEffect(() => {
    if (!gameEngine) return;

    const criticalPath = gameEngine.getCriticalPathManager();

    const updateData = () => {
      setPaths(criticalPath.getCriticalPaths());
      setExecutionOrder(criticalPath.getExecutionOrder());
      setBottlenecks(criticalPath.getBottlenecks());
      setPathNodes(criticalPath.getPathNodes());
      setStats(criticalPath.getStats());
    };

    updateData();
    const interval = setInterval(updateData, 1000);

    return () => clearInterval(interval);
  }, [gameEngine]);

  if (!stats) {
    return <div className="critical-path-loading">Loading critical path data...</div>;
  }

  const selectedPathData = paths.find((p) => p.id === selectedPath) || paths[0];

  return (
    <div className="critical-path-visualization">
      <div className="path-header">
        <h1>🔺 Critical Path</h1>
        <p className="subtitle">With love and light. As above, so below. 💜</p>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.totalTasks}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.criticalTasks}</div>
          <div className="stat-label">Critical Tasks</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.criticalPaths}</div>
          <div className="stat-label">Critical Paths</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.projectDuration}ms</div>
          <div className="stat-label">Project Duration</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.bottlenecks}</div>
          <div className="stat-label">Bottlenecks</div>
        </div>
      </div>

      {/* Critical Paths */}
      <div className="paths-section">
        <h3>🔺 Critical Paths ({paths.length})</h3>
        <div className="paths-list">
          {paths.map((path) => (
            <div
              key={path.id}
              className={`path-card ${selectedPath === path.id ? 'selected' : ''}`}
              onClick={() => setSelectedPath(path.id)}
            >
              <div className="path-header-card">
                <span className="path-id">{path.id}</span>
                <span className="path-duration">{path.totalDuration}ms</span>
              </div>
              <div className="path-tasks">
                {path.tasks.map((taskId: string, i: number) => {
                  const task = gameEngine?.getCriticalPathManager().getTask(taskId);
                  const node = pathNodes.find((n) => n.taskId === taskId);
                  return (
                    <div key={taskId} className="path-task">
                      <span className="task-name">{task?.name || taskId}</span>
                      <span className="task-duration">{task?.duration}ms</span>
                      {node?.isCritical && <span className="critical-badge">CRITICAL</span>}
                      {i < path.tasks.length - 1 && <span className="arrow">→</span>}
                    </div>
                  );
                })}
              </div>
              {path.bottlenecks.length > 0 && (
                <div className="path-bottlenecks">
                  <span className="bottleneck-label">Bottlenecks:</span>
                  {path.bottlenecks.map((bottleneckId: string) => {
                    const task = gameEngine?.getCriticalPathManager().getTask(bottleneckId);
                    return (
                      <span key={bottleneckId} className="bottleneck-tag">
                        {task?.name || bottleneckId}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Execution Order */}
      <div className="execution-section">
        <h3>⚡ Execution Order</h3>
        <div className="execution-timeline">
          {executionOrder.map((taskId, index) => {
            const task = gameEngine?.getCriticalPathManager().getTask(taskId);
            const node = pathNodes.find((n) => n.taskId === taskId);
            const isBottleneck = bottlenecks.includes(taskId);

            return (
              <div
                key={taskId}
                className={`execution-step ${node?.isCritical ? 'critical' : ''} ${isBottleneck ? 'bottleneck' : ''}`}
              >
                <div className="step-number">{index + 1}</div>
                <div className="step-content">
                  <div className="step-name">{task?.name || taskId}</div>
                  <div className="step-details">
                    <span>Duration: {task?.duration}ms</span>
                    {node && (
                      <>
                        <span>Slack: {node.slack}ms</span>
                        <span>System: {task?.system}</span>
                      </>
                    )}
                  </div>
                </div>
                {node?.isCritical && <div className="critical-indicator">🔺</div>}
                {isBottleneck && <div className="bottleneck-indicator">⚠️</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottlenecks */}
      {bottlenecks.length > 0 && (
        <div className="bottlenecks-section">
          <h3>⚠️ Bottlenecks ({bottlenecks.length})</h3>
          <div className="bottlenecks-list">
            {bottlenecks.map((bottleneckId) => {
              const task = gameEngine?.getCriticalPathManager().getTask(bottleneckId);
              const node = pathNodes.find((n) => n.taskId === bottleneckId);
              return (
                <div key={bottleneckId} className="bottleneck-card">
                  <div className="bottleneck-name">{task?.name || bottleneckId}</div>
                  <div className="bottleneck-details">
                    <span>Duration: {task?.duration}ms</span>
                    <span>Priority: {(task?.priority * 100).toFixed(0)}%</span>
                    <span>System: {task?.system}</span>
                    {node && <span>Slack: {node.slack}ms</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        .critical-path-visualization {
          padding: 2rem;
          background: rgba(0, 0, 0, 0.95);
          border-radius: 16px;
          color: white;
          max-width: 1400px;
          margin: 0 auto;
          max-height: 90vh;
          overflow-y: auto;
        }

        .path-header {
          text-align: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid rgba(255, 105, 180, 0.3);
        }

        .path-header h1 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #FF69B4, #87CEEB);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.8);
          font-style: italic;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 105, 180, 0.2);
          border-radius: 8px;
          text-align: center;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #87CEEB;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .paths-section,
        .execution-section,
        .bottlenecks-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 1px solid rgba(255, 105, 180, 0.2);
        }

        .paths-section h3,
        .execution-section h3,
        .bottlenecks-section h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: #87CEEB;
        }

        .paths-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .path-card {
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 105, 180, 0.2);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .path-card:hover {
          background: rgba(255, 105, 180, 0.1);
          border-color: #FF69B4;
        }

        .path-card.selected {
          background: rgba(255, 105, 180, 0.2);
          border-color: #FF69B4;
          box-shadow: 0 0 20px rgba(255, 105, 180, 0.5);
        }

        .path-header-card {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .path-id {
          font-weight: 700;
          color: #FF69B4;
        }

        .path-duration {
          color: #87CEEB;
          font-weight: 600;
        }

        .path-tasks {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
        }

        .path-task {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 4px;
        }

        .task-name {
          font-weight: 600;
        }

        .task-duration {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .critical-badge {
          background: #FF4444;
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .arrow {
          color: #87CEEB;
          font-weight: 700;
        }

        .path-bottlenecks {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .bottleneck-label {
          color: rgba(255, 255, 255, 0.7);
        }

        .bottleneck-tag {
          background: rgba(255, 193, 7, 0.2);
          color: #FFC107;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.875rem;
        }

        .execution-timeline {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .execution-step {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 105, 180, 0.2);
          border-radius: 8px;
          position: relative;
        }

        .execution-step.critical {
          border-color: #FF4444;
          background: rgba(255, 68, 68, 0.1);
        }

        .execution-step.bottleneck {
          border-color: #FFC107;
          background: rgba(255, 193, 7, 0.1);
        }

        .step-number {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 105, 180, 0.2);
          border-radius: 50%;
          font-weight: 700;
          color: #FF69B4;
        }

        .step-content {
          flex: 1;
        }

        .step-name {
          font-weight: 700;
          margin-bottom: 0.25rem;
        }

        .step-details {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
        }

        .critical-indicator,
        .bottleneck-indicator {
          font-size: 1.5rem;
        }

        .bottlenecks-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .bottleneck-card {
          padding: 1rem;
          background: rgba(255, 193, 7, 0.1);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 8px;
        }

        .bottleneck-name {
          font-weight: 700;
          color: #FFC107;
          margin-bottom: 0.5rem;
        }

        .bottleneck-details {
          display: flex;
          gap: 1rem;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .critical-path-loading {
          padding: 2rem;
          text-align: center;
          color: white;
        }
      `}</style>
    </div>
  );
};
