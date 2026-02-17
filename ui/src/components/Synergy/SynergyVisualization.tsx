/**
 * Synergy Visualization
 * Infinite compounding synergy across all P31 components
 *
 * Built with love and light. As above, so below. 💜
 * The Mesh Holds. 🔺
 */

import React, { useState, useEffect } from 'react';
import './SynergyVisualization.css';

interface SynergyNode {
  id: string;
  component: string;
  baseSynergy: number;
  compoundedSynergy: number;
  multiplier: number;
  connections: string[];
}

interface SynergyState {
  totalSynergy: number;
  compoundingRate: number;
  nodeCount: number;
  connectionCount: number;
  infinity: boolean;
}

export const SynergyVisualization: React.FC = () => {
  const [state, setState] = useState<SynergyState | null>(null);
  const [nodes, setNodes] = useState<SynergyNode[]>([]);
  const [network, setNetwork] = useState<any>(null);

  useEffect(() => {
    // Fetch synergy state
    const fetchSynergy = async () => {
      try {
        const response = await fetch('/api/synergy');
        const data = await response.json();
        if (data.success) {
          setState(data);
        }
      } catch (error) {
        console.error('Error fetching synergy:', error);
      }
    };

    // Fetch nodes
    const fetchNodes = async () => {
      try {
        const response = await fetch('/api/synergy/nodes');
        const data = await response.json();
        if (data.success) {
          setNodes(data.nodes);
        }
      } catch (error) {
        console.error('Error fetching nodes:', error);
      }
    };

    // Fetch network
    const fetchNetwork = async () => {
      try {
        const response = await fetch('/api/synergy/network');
        const data = await response.json();
        if (data.success) {
          setNetwork(data.network);
        }
      } catch (error) {
        console.error('Error fetching network:', error);
      }
    };

    fetchSynergy();
    fetchNodes();
    fetchNetwork();

    // Update every second (synergy compounds continuously)
    const interval = setInterval(() => {
      fetchSynergy();
      fetchNodes();
      fetchNetwork();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const boostSynergy = async (nodeId: string) => {
    try {
      await fetch(`/api/synergy/boost/${nodeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ multiplier: 2.0, duration: 5000 }),
      });
    } catch (error) {
      console.error('Error boosting synergy:', error);
    }
  };

  if (!state) {
    return <div className="synergy-loading">Loading synergy...</div>;
  }

  return (
    <div className="synergy-visualization">
      <div className="synergy-header">
        <h2>∞ Synergy x Infinity</h2>
        <div className="synergy-stats">
          <div className="stat">
            <div className="stat-label">Total Synergy</div>
            <div className="stat-value">{state.totalSynergy.toFixed(2)}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Compounding Rate</div>
            <div className="stat-value">{state.compoundingRate.toFixed(3)}x</div>
          </div>
          <div className="stat">
            <div className="stat-label">Nodes</div>
            <div className="stat-value">{state.nodeCount}</div>
          </div>
          <div className="stat">
            <div className="stat-label">Connections</div>
            <div className="stat-value">{state.connectionCount}</div>
          </div>
        </div>
      </div>

      <div className="synergy-body">
        <div className="nodes-grid">
          {nodes.map((node) => (
            <div
              key={node.id}
              className="synergy-node"
              style={
                {
                  '--synergy': node.compoundedSynergy,
                  '--multiplier': node.multiplier,
                } as React.CSSProperties
              }
            >
              <div className="node-header">
                <div className="node-name">{node.component}</div>
                <button
                  onClick={() => boostSynergy(node.id)}
                  className="boost-button"
                  title="Boost synergy 2x for 5s"
                >
                  ⚡
                </button>
              </div>
              <div className="node-synergy">
                <div className="synergy-bar">
                  <div
                    className="synergy-fill"
                    style={{ width: `${Math.min(100, (node.compoundedSynergy / 10) * 100)}%` }}
                  />
                </div>
                <div className="synergy-value">{node.compoundedSynergy.toFixed(2)}</div>
              </div>
              <div className="node-details">
                <div>Base: {node.baseSynergy.toFixed(2)}</div>
                <div>Multiplier: {node.multiplier.toFixed(2)}x</div>
                <div>Connections: {node.connections.length}</div>
              </div>
            </div>
          ))}
        </div>

        {network && (
          <div className="network-visualization">
            <h3>Synergy Network</h3>
            <div className="network-graph">
              {network.nodes.map((node: any) => (
                <div key={node.id} className="network-node" title={node.label}>
                  {node.label.substring(0, 2)}
                </div>
              ))}
            </div>
            <div className="network-connections">
              {network.edges.map((edge: any, index: number) => (
                <div key={index} className={`connection ${edge.type}`}>
                  {edge.from} → {edge.to} ({edge.strength.toFixed(2)})
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="synergy-footer">
        <div className="infinity-indicator">
          {state.infinity && (
            <>
              <span className="infinity-symbol">∞</span>
              <span>Infinite Compounding Active</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
