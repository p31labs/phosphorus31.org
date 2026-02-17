import React, { useState, useEffect } from 'react';
import { HeartIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import api from '../lib/api';
import { toast } from './ui/Toast';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input, Select } from './ui/Input';

const LoveEconomy = () => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    description: '',
    type: 'income',
  });

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [balRes, txnRes] = await Promise.all([
        api.get('/api/wallet/balance'),
        api.get('/api/wallet/transactions'),
      ]);
      setWalletBalance(balRes.data.balance);
      setTransactions(txnRes.data || []);
    } catch {
      // Toast auto-fires via API interceptor
    }
  };

  const addTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.description) return;
    try {
      const response = await api.post('/api/wallet/transaction', {
        ...newTransaction,
        amount: parseFloat(newTransaction.amount),
      });
      setTransactions([...transactions, response.data]);
      setNewTransaction({ amount: '', description: '', type: 'income' });
      loadWalletData();
      toast.success('Transaction added successfully');
    } catch {
      // Toast auto-fires
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">L.O.V.E. Economy</h1>
          <p className="text-muted mt-1">Family Financial Sovereignty & Privacy</p>
        </div>
        <div className="w-12 h-12 bg-linear-to-r from-primary to-accent rounded-xl flex items-center justify-center">
          <HeartIcon className="w-7 h-7 text-white" aria-hidden="true" />
        </div>
      </div>

      {/* Wallet Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Total Balance</p>
              <p className="text-2xl font-bold text-main">${walletBalance.toLocaleString()}</p>
            </div>
            <div className="w-14 h-14 bg-linear-to-r from-primary to-accent rounded-xl flex items-center justify-center">
              <CurrencyDollarIcon className="w-7 h-7 text-white" aria-hidden="true" />
            </div>
          </div>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Privacy Level</p>
              <p className="text-2xl font-bold text-main">100%</p>
            </div>
            <span className="text-3xl" aria-hidden="true">🛡️</span>
          </div>
        </Card>

        <Card className="group hover:scale-105 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted">Family Members</p>
              <p className="text-2xl font-bold text-main">{0}</p>
            </div>
            <span className="text-3xl" aria-hidden="true">👥</span>
          </div>
        </Card>
      </div>

      {/* Add Transaction */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Add Transaction</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            id="txn-amount"
            label="Amount"
            type="number"
            value={newTransaction.amount}
            onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
            placeholder="0.00"
          />
          <Input
            id="txn-description"
            label="Description"
            type="text"
            value={newTransaction.description}
            onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
            placeholder="Transaction description"
          />
          <Select
            id="txn-type"
            label="Type"
            value={newTransaction.type}
            onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value })}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
        </div>
        <div className="mt-4">
          <Button onClick={addTransaction} disabled={!newTransaction.amount || !newTransaction.description}>
            Add Transaction
          </Button>
        </div>
      </Card>

      {/* Transaction History */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Transaction History</h3>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted">No transactions yet.</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-surface rounded-lg border border-border">
                <div className="flex items-center space-x-3">
                  <span className="text-lg" aria-hidden="true">
                    {transaction.type === 'income' ? '📈' : '📉'}
                  </span>
                  <div>
                    <p className="text-main font-medium">{transaction.description}</p>
                    <p className="text-sm text-muted">{transaction.date || 'Just now'}</p>
                  </div>
                </div>
                <div className={`font-bold ${transaction.type === 'income' ? 'text-success' : 'text-error'}`}>
                  {transaction.type === 'income' ? '+' : '-'}${transaction.amount?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Financial Insights */}
      <Card>
        <h3 className="font-semibold text-main mb-4">Financial Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface rounded-lg p-4 border border-border">
            <h4 className="font-medium text-main mb-2">Monthly Income</h4>
            <p className="text-2xl font-bold text-success">$2,500</p>
          </div>
          <div className="bg-surface rounded-lg p-4 border border-border">
            <h4 className="font-medium text-main mb-2">Monthly Expenses</h4>
            <p className="text-2xl font-bold text-error">$1,800</p>
          </div>
          <div className="bg-surface rounded-lg p-4 border border-border">
            <h4 className="font-medium text-main mb-2">Savings Rate</h4>
            <p className="text-2xl font-bold text-accent">28%</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoveEconomy;
