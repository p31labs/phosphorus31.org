/**
 * Tools for Life Panel
 * Main UI panel for accessing all tools
 */

import React, { useState } from 'react';
import { useToolsForLife } from './ToolsForLifeProvider';
import { SimpleButton } from '../Accessibility/SimpleButton';

export const ToolsForLifePanel: React.FC = () => {
  const { getMakerTools, getLifeTools, getChangeTools, executeTool, getToolStats, searchTools } =
    useToolsForLife();

  const [activeTab, setActiveTab] = useState<'maker' | 'life' | 'change'>('maker');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(getToolStats());

  const makerTools = getMakerTools();
  const lifeTools = getLifeTools();
  const changeTools = getChangeTools();

  const handleToolClick = async (toolId: string) => {
    try {
      await executeTool(toolId);
      setStats(getToolStats()); // Refresh stats
    } catch (error) {
      console.error('Error executing tool:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const getFilteredTools = () => {
    if (searchQuery) {
      return searchTools(searchQuery);
    }

    switch (activeTab) {
      case 'maker':
        return makerTools;
      case 'life':
        return lifeTools;
      case 'change':
        return changeTools;
      default:
        return [];
    }
  };

  const filteredTools = getFilteredTools();

  return (
    <div className="tools-for-life-panel">
      <div className="panel-header">
        <h1>🔧 Tools for Life</h1>
        <p className="subtitle">Makers make change. Ready to build together. 💜</p>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          className="search-input"
          aria-label="Search tools"
        />
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'maker' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('maker');
            setSearchQuery('');
          }}
          aria-label="Maker Tools"
        >
          🔨 Maker ({makerTools.length})
        </button>
        <button
          className={`tab ${activeTab === 'life' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('life');
            setSearchQuery('');
          }}
          aria-label="Life Tools"
        >
          💜 Life ({lifeTools.length})
        </button>
        <button
          className={`tab ${activeTab === 'change' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('change');
            setSearchQuery('');
          }}
          aria-label="Change Tools"
        >
          🌟 Change ({changeTools.length})
        </button>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Total Uses:</span>
          <span className="stat-value">{stats.totalUsage}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Maker:</span>
          <span className="stat-value">{stats.makerUsage}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Life:</span>
          <span className="stat-value">{stats.lifeUsage}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Change:</span>
          <span className="stat-value">{stats.changeUsage}</span>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="tools-grid">
        {filteredTools.length === 0 ? (
          <div className="no-results">
            <p>No tools found matching "{searchQuery}"</p>
          </div>
        ) : (
          filteredTools.map((tool) => (
            <div
              key={tool.id}
              className="tool-card"
              onClick={() => handleToolClick(tool.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleToolClick(tool.id);
                }
              }}
              aria-label={`${tool.name}: ${tool.description}`}
            >
              <div className="tool-icon">{tool.icon}</div>
              <div className="tool-content">
                <h3 className="tool-name">{tool.name}</h3>
                <p className="tool-description">{tool.description}</p>
                <span className="tool-category">{tool.category}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="panel-footer">
        <p className="footer-text">💜 With love and light. As above, so below. 💜</p>
        <p className="footer-text">The Mesh Holds. 🔺</p>
      </div>

      <style>{`
        .tools-for-life-panel {
          padding: 2rem;
          background: rgba(0, 0, 0, 0.9);
          border-radius: 16px;
          color: white;
          max-width: 1200px;
          margin: 0 auto;
          min-height: 600px;
        }

        .panel-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .panel-header h1 {
          font-size: 3rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #FF69B4, #87CEEB, #90EE90);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .subtitle {
          font-size: 1.25rem;
          color: rgba(255, 255, 255, 0.8);
          font-style: italic;
        }

        .search-bar {
          margin-bottom: 1.5rem;
        }

        .search-input {
          width: 100%;
          padding: 1rem;
          border-radius: 8px;
          border: 2px solid rgba(255, 105, 180, 0.3);
          background: rgba(0, 0, 0, 0.5);
          color: white;
          font-size: 1.125rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #FF69B4;
          box-shadow: 0 0 20px rgba(255, 105, 180, 0.5);
        }

        .tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          border-bottom: 2px solid rgba(255, 105, 180, 0.3);
        }

        .tab {
          padding: 1rem 2rem;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          border-bottom: 3px solid transparent;
          transition: all 0.3s;
        }

        .tab:hover {
          color: white;
        }

        .tab.active {
          color: #FF69B4;
          border-bottom-color: #FF69B4;
        }

        .stats-bar {
          display: flex;
          gap: 2rem;
          padding: 1rem;
          background: rgba(255, 105, 180, 0.1);
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-label {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #FF69B4;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .tool-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 105, 180, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .tool-card:hover {
          background: rgba(255, 105, 180, 0.1);
          border-color: #FF69B4;
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(255, 105, 180, 0.3);
        }

        .tool-card:focus {
          outline: 3px solid #FF69B4;
          outline-offset: 2px;
        }

        .tool-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .tool-content {
          flex: 1;
        }

        .tool-name {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: #FF69B4;
        }

        .tool-description {
          font-size: 1rem;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 0.75rem;
        }

        .tool-category {
          display: inline-block;
          padding: 0.25rem 0.75rem;
          background: rgba(255, 105, 180, 0.2);
          border-radius: 12px;
          font-size: 0.875rem;
          color: #FF69B4;
          text-transform: capitalize;
        }

        .no-results {
          text-align: center;
          padding: 4rem;
          color: rgba(255, 255, 255, 0.5);
        }

        .panel-footer {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 105, 180, 0.3);
        }

        .footer-text {
          margin: 0.5rem 0;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};
