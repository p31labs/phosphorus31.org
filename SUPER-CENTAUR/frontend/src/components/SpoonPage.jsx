import React, { useState, useEffect } from 'react';
import { BoltIcon } from '@heroicons/react/24/outline';
import api from '../lib/api';
import { toast } from './ui/Toast';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';

const MEMBER_ID = 'sj'; // Default member

// ── SVG Spoon Meter ────────────────────────────────────────────
const SpoonMeter = ({ remaining, total }) => {
  const pct = Math.max(0, Math.min(1, remaining / total));
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const color = remaining > 8 ? '#22c55e' : remaining > 4 ? '#f59e0b' : '#ef4444';

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="currentColor" className="text-border" strokeWidth="10" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.3s ease' }}
        />
        <text x="70" y="66" textAnchor="middle" className="fill-main" fontSize="28" fontWeight="bold">{remaining}</text>
        <text x="70" y="86" textAnchor="middle" className="fill-muted" fontSize="12">of {total}</text>
      </svg>
      <p className="text-sm text-muted mt-2">Spoons Remaining</p>
    </div>
  );
};

// ── Timeline ────────────────────────────────────────────────────
const SpoonTimeline = ({ entries }) => {
  if (entries.length === 0) return <p className="text-sm text-muted">No activities logged today.</p>;

  return (
    <div className="space-y-3">
      {entries.map((e, i) => (
        <div key={e.id || i} className="flex items-start space-x-3">
          <div className="w-2 h-2 mt-2 rounded-full shrink-0" style={{ backgroundColor: e.cost >= 4 ? '#ef4444' : e.cost >= 2 ? '#f59e0b' : '#22c55e' }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-main truncate">{e.activity}</p>
              <span className="text-sm font-bold text-accent shrink-0 ml-2">-{e.cost}</span>
            </div>
            <p className="text-xs text-muted">{e.category} &middot; {new Date(e.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Activity Logger ─────────────────────────────────────────────
const ActivityLogger = ({ activities, onLog }) => {
  const [selected, setSelected] = useState('');
  const [custom, setCustom] = useState('');
  const [cost, setCost] = useState(1);

  const handlePreset = () => {
    const act = activities.find(a => a.activity === selected);
    if (act) onLog(act.activity, act.cost, act.category);
  };

  const handleCustom = () => {
    if (!custom.trim()) return;
    onLog(custom.trim(), cost, 'custom');
    setCustom('');
    setCost(1);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-main mb-2">Quick Log (preset)</p>
        <div className="flex space-x-2">
          <Select id="preset-activity" label="" value={selected} onChange={e => setSelected(e.target.value)}>
            <option value="">Select activity...</option>
            {activities.map(a => (
              <option key={a.activity} value={a.activity}>{a.activity} (-{a.cost})</option>
            ))}
          </Select>
          <Button onClick={handlePreset} disabled={!selected} className="shrink-0">Log</Button>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-main mb-2">Custom Activity</p>
        <div className="flex space-x-2">
          <Input id="custom-activity" label="" type="text" value={custom} onChange={e => setCustom(e.target.value)} placeholder="Activity name" />
          <Input id="custom-cost" label="" type="number" value={cost} onChange={e => setCost(Math.max(0, Number(e.target.value)))} className="w-20" />
          <Button onClick={handleCustom} disabled={!custom.trim()} className="shrink-0">Log</Button>
        </div>
      </div>
    </div>
  );
};

// ── Recovery Actions ────────────────────────────────────────────
const RecoveryActions = ({ suggestions }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-3">
      {suggestions.map((s, i) => (
        <div key={i} className="flex items-start space-x-3 p-3 bg-surface rounded-lg border border-border">
          <span className="text-lg shrink-0">
            {s.category === 'rest' ? '😴' : s.category === 'movement' ? '🏃' : s.category === 'mindfulness' ? '🧘' : s.category === 'nature' ? '🌿' : s.category === 'comfort' ? '🛁' : s.category === 'joy' ? '🎨' : s.category === 'connection' ? '💕' : s.category === 'nourishment' ? '🥤' : '✨'}
          </span>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-main">{s.activity}</p>
              <span className="text-sm font-bold text-green-500">+{s.recovery}</span>
            </div>
            <p className="text-xs text-muted mt-1">{s.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Main Page ───────────────────────────────────────────────────
const SpoonPage = () => {
  const [todayData, setTodayData] = useState({ budget: { totalBudget: 12, remaining: 12 }, entries: [] });
  const [activities, setActivities] = useState([]);
  const [recovery, setRecovery] = useState([]);

  const loadData = async () => {
    try {
      const [todayRes, actRes, recRes] = await Promise.all([
        api.get(`/api/spoons/today/${MEMBER_ID}`),
        api.get('/api/spoons/activities'),
        api.get(`/api/spoons/recovery/${MEMBER_ID}`),
      ]);
      setTodayData(todayRes.data);
      setActivities(actRes.data);
      setRecovery(recRes.data);
    } catch {
      // Toast auto-fires
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleLog = async (activity, cost, category) => {
    try {
      await api.post('/api/spoons/log', { memberId: MEMBER_ID, activity, cost, category });
      toast.success(`Logged: ${activity} (-${cost} spoons)`);
      loadData();
    } catch {
      // Toast auto-fires
    }
  };

  const { budget, entries } = todayData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Spoon Budget</h1>
          <p className="text-muted mt-1">Energy management &mdash; track, plan, recover</p>
        </div>
        <div className="w-12 h-12 bg-linear-to-r from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
          <BoltIcon className="w-7 h-7 text-white" aria-hidden="true" />
        </div>
      </div>

      {/* Top row: Meter + Today */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center justify-center py-8">
          <SpoonMeter remaining={budget.remaining} total={budget.totalBudget} />
        </Card>

        <Card className="md:col-span-2">
          <h3 className="font-semibold text-main mb-4">Today&apos;s Activity Timeline</h3>
          <SpoonTimeline entries={entries} />
        </Card>
      </div>

      {/* Log Activity */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Log Activity</h3>
        <ActivityLogger activities={activities} onLog={handleLog} />
      </Card>

      {/* Recovery Suggestions */}
      {budget.remaining <= 8 && (
        <Card>
          <h3 className="font-semibold text-main mb-4">
            {budget.remaining <= 2 ? '🚨 Critical — Rest Required' : budget.remaining <= 5 ? '⚠️ Low Energy — Recovery Recommended' : '💡 Recovery Suggestions'}
          </h3>
          <RecoveryActions suggestions={recovery} />
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-muted">Budget</p>
          <p className="text-2xl font-bold text-main">{budget.totalBudget}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Used</p>
          <p className="text-2xl font-bold text-accent">{budget.totalBudget - budget.remaining}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Remaining</p>
          <p className="text-2xl font-bold" style={{ color: budget.remaining > 8 ? '#22c55e' : budget.remaining > 4 ? '#f59e0b' : '#ef4444' }}>{budget.remaining}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Activities</p>
          <p className="text-2xl font-bold text-main">{entries.length}</p>
        </Card>
      </div>
    </div>
  );
};

export default SpoonPage;
