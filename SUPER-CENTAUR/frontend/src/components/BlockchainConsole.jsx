import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { toast } from './ui/Toast';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';
import StatusBadge from './ui/StatusBadge';
import ProgressBar from './ui/ProgressBar';

const BlockchainConsole = () => {
  const [agents, setAgents] = useState([]);
  const [smartContracts, setSmartContracts] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [newAgent, setNewAgent] = useState({
    name: '',
    type: 'autonomous',
    description: '',
  });

  useEffect(() => {
    loadBlockchainData();
  }, []);

  const loadBlockchainData = async () => {
    try {
      const response = await api.get('/api/blockchain/status');
      setAgents(response.data.agents || []);
      setSmartContracts(response.data.contracts || []);
      setWalletBalance(response.data.walletBalance || 0);
    } catch {
      // Toast auto-fires via API interceptor
    }
  };

  const createAgent = async () => {
    if (!newAgent.name || !newAgent.description) return;
    try {
      const response = await api.post('/api/agents/create', {
        agentType: newAgent.type,
        configuration: { name: newAgent.name, description: newAgent.description },
      });
      setAgents([...agents, response.data]);
      setNewAgent({ name: '', type: 'autonomous', description: '' });
      toast.success('Agent created successfully');
    } catch {
      // Toast auto-fires
    }
  };

  const manageAgent = async (agentId, action) => {
    try {
      await api.post(`/api/blockchain/agent/${agentId}/${action}`);
      loadBlockchainData();
      toast.success(`Agent ${action} successful`);
    } catch {
      // Toast auto-fires
    }
  };

  const AGENT_ICONS = { autonomous: '🧠', financial: '💰', legal: '⚖️' };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Blockchain Management Console</h1>
          <p className="text-muted mt-1">Autonomous Agents & Smart Contract Control</p>
        </div>
        <div className="w-12 h-12 bg-linear-to-r from-accent to-primary rounded-xl flex items-center justify-center">
          <span className="text-white text-xl" aria-hidden="true">📊</span>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Wallet Balance</p>
              <p className="text-2xl font-bold text-main">${walletBalance.toLocaleString()}</p>
            </div>
            <span className="text-3xl" aria-hidden="true">💰</span>
          </div>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Active Agents</p>
              <p className="text-2xl font-bold text-main">{agents.filter((a) => a.status === 'active').length}</p>
            </div>
            <span className="text-3xl" aria-hidden="true">🧠</span>
          </div>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Smart Contracts</p>
              <p className="text-2xl font-bold text-main">{smartContracts.length}</p>
            </div>
            <span className="text-3xl" aria-hidden="true">📋</span>
          </div>
        </Card>
      </div>

      {/* Create Agent */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Create New Agent</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="agent-name"
            label="Agent Name"
            type="text"
            value={newAgent.name}
            onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
            placeholder="Agent name"
          />
          <Select
            id="agent-type"
            label="Agent Type"
            value={newAgent.type}
            onChange={(e) => setNewAgent({ ...newAgent, type: e.target.value })}
          >
            <option value="autonomous">Autonomous</option>
            <option value="financial">Financial</option>
            <option value="legal">Legal</option>
          </Select>
          <Input
            id="agent-description"
            label="Description"
            type="text"
            value={newAgent.description}
            onChange={(e) => setNewAgent({ ...newAgent, description: e.target.value })}
            placeholder="Agent description"
          />
        </div>
        <div className="mt-4">
          <Button onClick={createAgent} disabled={!newAgent.name || !newAgent.description}>
            Create Agent
          </Button>
        </div>
      </Card>

      {/* Agent Management */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Autonomous Agents</h3>
        {agents.length === 0 ? (
          <p className="text-sm text-muted">No agents deployed yet.</p>
        ) : (
          <div className="space-y-3">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                <div className="flex items-center space-x-4">
                  <span className="text-lg" aria-hidden="true">{AGENT_ICONS[agent.type] || '🤖'}</span>
                  <div>
                    <h4 className="font-medium text-main">{agent.name}</h4>
                    <p className="text-sm text-muted capitalize">{agent.type} agent</p>
                  </div>
                  <StatusBadge status={agent.status} />
                </div>
                <div className="flex space-x-2">
                  <Button variant="secondary" onClick={() => manageAgent(agent.id, 'start')}>
                    Start
                  </Button>
                  <Button variant="accent" onClick={() => manageAgent(agent.id, 'pause')}>
                    Pause
                  </Button>
                  <Button variant="secondary" onClick={() => manageAgent(agent.id, 'stop')}>
                    Stop
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Smart Contracts */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Smart Contracts</h3>
        {smartContracts.length === 0 ? (
          <p className="text-sm text-muted">No smart contracts deployed yet.</p>
        ) : (
          <div className="space-y-3">
            {smartContracts.map((contract, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                <div className="flex items-center space-x-4">
                  <span className="text-lg" aria-hidden="true">📋</span>
                  <div>
                    <h4 className="font-medium text-main">{contract.name}</h4>
                    <p className="text-sm text-muted">{contract.type}</p>
                  </div>
                  <StatusBadge status="active" />
                </div>
                <div className="flex space-x-2">
                  <Button>View Contract</Button>
                  <Button variant="secondary">Execute</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default BlockchainConsole;
