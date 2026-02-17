import React, { useState, useEffect } from 'react';
import { WalletIcon } from '@heroicons/react/24/outline';
import api from '../lib/api';
import { toast } from './ui/Toast';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';
import StatusBadge from './ui/StatusBadge';

const TABS = ['Balances', 'Transactions', 'Transfer', 'Mining', 'Governance'];

const WalletPage = () => {
  const [tab, setTab] = useState('Balances');
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transfer, setTransfer] = useState({ from: '', to: '', amount: '', description: '' });

  const loadData = async () => {
    try {
      const [wRes, tRes] = await Promise.all([
        api.get('/api/wallet/family'),
        api.get('/api/wallet/transactions'),
      ]);
      setWallets(wRes.data);
      setTransactions(tRes.data);
    } catch {
      // Toast auto-fires
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleTransfer = async () => {
    if (!transfer.from || !transfer.to || !transfer.amount) return;
    try {
      await api.post('/api/wallet/transfer', {
        fromWalletId: transfer.from,
        toWalletId: transfer.to,
        amount: Number(transfer.amount),
        description: transfer.description || 'Family transfer',
      });
      toast.success(`Transferred ${transfer.amount} LOVE`);
      setTransfer({ from: '', to: '', amount: '', description: '' });
      loadData();
    } catch {
      // Toast auto-fires
    }
  };

  const totalLove = wallets.reduce((sum, w) => sum + (w.balance || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Family Wallet</h1>
          <p className="text-muted mt-1">Love Vault &mdash; Family L.O.V.E. Economy</p>
        </div>
        <div className="w-12 h-12 bg-linear-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <WalletIcon className="w-7 h-7 text-white" aria-hidden="true" />
        </div>
      </div>

      {/* Total Banner */}
      <Card className="bg-linear-to-r from-purple-500/10 to-pink-500/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted">Total Family Treasury</p>
            <p className="text-4xl font-bold gradient-text">{totalLove.toLocaleString()} LOVE</p>
          </div>
          <span className="text-4xl" aria-hidden="true">💜</span>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex space-x-1 bg-surface rounded-lg p-1 border border-border">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${tab === t ? 'bg-card text-main shadow-sm' : 'text-muted hover:text-main'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {tab === 'Balances' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {wallets.map(w => (
            <Card key={w.id} className="group hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                    {w.memberName?.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-semibold text-main">{w.memberName}</p>
                    <p className="text-xs text-muted">{w.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-main">{(w.balance || 0).toLocaleString()}</p>
                  <p className="text-xs text-muted">{w.currency || 'LOVE'}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'Transactions' && (
        <Card>
          <h3 className="font-semibold text-main mb-4">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <p className="text-sm text-muted">No transactions yet.</p>
          ) : (
            <div className="space-y-3">
              {transactions.map((t, i) => (
                <div key={t.id || i} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                  <div>
                    <p className="text-sm font-medium text-main">{t.description || 'Transfer'}</p>
                    <p className="text-xs text-muted">{t.fromWalletId} → {t.toWalletId}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-accent">{t.amount} LOVE</p>
                    <p className="text-xs text-muted">{t.timestamp ? new Date(t.timestamp).toLocaleDateString() : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {tab === 'Transfer' && (
        <Card>
          <h3 className="font-semibold text-main mb-4">Transfer LOVE</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select id="transfer-from" label="From" value={transfer.from} onChange={e => setTransfer({ ...transfer, from: e.target.value })}>
              <option value="">Select wallet...</option>
              {wallets.map(w => (
                <option key={w.id} value={w.id}>{w.memberName} ({w.balance} LOVE)</option>
              ))}
            </Select>
            <Select id="transfer-to" label="To" value={transfer.to} onChange={e => setTransfer({ ...transfer, to: e.target.value })}>
              <option value="">Select wallet...</option>
              {wallets.filter(w => w.id !== transfer.from).map(w => (
                <option key={w.id} value={w.id}>{w.memberName} ({w.balance} LOVE)</option>
              ))}
            </Select>
            <Input id="transfer-amount" label="Amount" type="number" value={transfer.amount} onChange={e => setTransfer({ ...transfer, amount: e.target.value })} placeholder="0" />
            <Input id="transfer-desc" label="Description" type="text" value={transfer.description} onChange={e => setTransfer({ ...transfer, description: e.target.value })} placeholder="What is this for?" />
          </div>
          <div className="mt-4">
            <Button onClick={handleTransfer} disabled={!transfer.from || !transfer.to || !transfer.amount}>
              Send LOVE
            </Button>
          </div>
        </Card>
      )}

      {tab === 'Mining' && (
        <Card className="text-center py-12">
          <span className="text-5xl mb-4 block" aria-hidden="true">⛏️</span>
          <h3 className="text-xl font-semibold text-main mb-2">Proof of Care Mining</h3>
          <p className="text-muted">Coming in Phase 2</p>
          <p className="text-sm text-muted mt-2">Earn LOVE tokens through verified acts of care, compassion, and family contribution.</p>
        </Card>
      )}

      {tab === 'Governance' && (
        <Card className="text-center py-12">
          <span className="text-5xl mb-4 block" aria-hidden="true">🏛️</span>
          <h3 className="text-xl font-semibold text-main mb-2">Family Governance</h3>
          <p className="text-muted">Coming in Phase 2</p>
          <p className="text-sm text-muted mt-2">Democratic decision-making with LOVE-weighted voting for family matters.</p>
        </Card>
      )}
    </div>
  );
};

export default WalletPage;
