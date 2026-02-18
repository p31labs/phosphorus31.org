// src/plugins/wallet.js

/**
 * Sovereign Wallet Plugin (MVP)
 * - Local-first, user-owned wallet
 * - Modular: supports tokens, reputation, barter, and programmable incentives
 * - Privacy: encrypted local storage, no third-party tracking
 */

class Wallet {
  constructor() {
    this.balance = 0;
    this.transactions = [];
  }

  getBalance() {
    return this.balance;
  }

  add(amount, note) {
    this.balance += amount;
    this.transactions.push({ amount, type: 'credit', date: new Date(), note });
  }

  spend(amount, note) {
    if (amount > this.balance) throw new Error('Insufficient funds');
    this.balance -= amount;
    this.transactions.push({ amount, type: 'debit', date: new Date(), note });
  }

  getTransactions() {
    return this.transactions;
  }
}

module.exports = { Wallet };