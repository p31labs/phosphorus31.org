import React, { useState, useEffect } from 'react';
import { UserGroupIcon, ShieldCheckIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import api from '../lib/api';
import { toast } from './ui/Toast';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';
import StatusBadge from './ui/StatusBadge';

const FamilySupport = () => {
  const [familyData, setFamilyData] = useState({
    members: [],
    custodyCases: [],
    supportRequests: [],
    emergencyProtocols: 0,
  });
  const [newRequest, setNewRequest] = useState({ type: 'emotional', priority: 'medium', description: '' });

  useEffect(() => {
    loadFamilyData();
  }, []);

  const loadFamilyData = async () => {
    try {
      const response = await api.get('/api/family/status');
      setFamilyData(response.data);
    } catch {
      // Toast auto-fires
    }
  };

  const submitSupportRequest = async () => {
    if (!newRequest.description) return;
    try {
      await api.post('/api/family/support', newRequest);
      setNewRequest({ type: 'emotional', priority: 'medium', description: '' });
      loadFamilyData();
      toast.success('Support request submitted');
    } catch {
      // Toast auto-fires
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Family Support</h1>
          <p className="text-muted mt-1">Family Fortress - Protection & Advocacy</p>
        </div>
        <div className="w-12 h-12 bg-linear-to-r from-primary to-accent rounded-xl flex items-center justify-center">
          <UserGroupIcon className="w-7 h-7 text-white" aria-hidden="true" />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Family Members</p>
              <p className="text-2xl font-bold text-main">{familyData.members.length}</p>
            </div>
            <span className="text-3xl" aria-hidden="true">👥</span>
          </div>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Active Cases</p>
              <p className="text-2xl font-bold text-main">{familyData.custodyCases.length}</p>
            </div>
            <span className="text-3xl" aria-hidden="true">⚖️</span>
          </div>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Support Requests</p>
              <p className="text-2xl font-bold text-main">{familyData.supportRequests.length}</p>
            </div>
            <span className="text-3xl" aria-hidden="true">🤝</span>
          </div>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Emergency Protocols</p>
              <p className="text-2xl font-bold text-main">{familyData.emergencyProtocols}</p>
            </div>
            <span className="text-3xl" aria-hidden="true">🚨</span>
          </div>
        </Card>
      </div>

      {/* Custody Cases */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Active Custody Cases</h3>
        {familyData.custodyCases.length === 0 ? (
          <p className="text-sm text-muted">No active cases.</p>
        ) : (
          <div className="space-y-3">
            {familyData.custodyCases.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl" aria-hidden="true">⚖️</span>
                  <div>
                    <h4 className="font-medium text-main">{c.caseNumber}</h4>
                    <p className="text-sm text-muted">{c.court}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted">Next Hearing</p>
                  <p className="text-sm font-medium text-main">
                    {new Date(c.nextHearing).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Submit Support Request */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Request Support</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Select
            id="support-type"
            label="Support Type"
            value={newRequest.type}
            onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
          >
            <option value="emotional">Emotional</option>
            <option value="legal">Legal</option>
            <option value="financial">Financial</option>
            <option value="practical">Practical</option>
            <option value="emergency">Emergency</option>
          </Select>
          <Select
            id="support-priority"
            label="Priority"
            value={newRequest.priority}
            onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value })}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </Select>
          <Input
            id="support-description"
            label="Description"
            type="text"
            value={newRequest.description}
            onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
            placeholder="Describe the support needed"
          />
        </div>
        <div className="mt-4">
          <Button onClick={submitSupportRequest} disabled={!newRequest.description}>
            Submit Request
          </Button>
        </div>
      </Card>

      {/* Emergency Protocols */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Emergency Protocols</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'domestic-violence', label: 'Domestic Violence', icon: '🚨', severity: 'critical' },
            { id: 'medical-emergency', label: 'Medical Emergency', icon: '🏥', severity: 'critical' },
            { id: 'custody-violation', label: 'Custody Violation', icon: '⚖️', severity: 'warning' },
          ].map((protocol) => (
            <div key={protocol.id} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
              <div className="flex items-center space-x-3">
                <span className="text-2xl" aria-hidden="true">{protocol.icon}</span>
                <div>
                  <h4 className="font-medium text-main">{protocol.label}</h4>
                  <StatusBadge status={protocol.severity === 'critical' ? 'error' : 'warning'} label={protocol.severity} />
                </div>
              </div>
              <Button
                variant={protocol.severity === 'critical' ? 'accent' : 'secondary'}
                className="text-sm"
              >
                Activate
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default FamilySupport;
