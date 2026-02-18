// ══════════════════════════════════════════════════════════════════════════════
// COHERENCE ENGINE
// RAF-driven simulation loop wrapping FisherEscolaEngine.
// Decouples physics from React rendering via throttled state broadcasts.
// ══════════════════════════════════════════════════════════════════════════════

import { FisherEscolaEngine } from './fisherEscola.js';

const BROADCAST_INTERVAL = 60; // ms — ~16fps to React, physics runs at display refresh

/**
 * CoherenceEngine
 * Manages the real-time quantum simulation loop
 */
export class CoherenceEngine {
  /**
   * @param {function} onStateUpdate - Callback for state broadcasts
   */
  constructor(onStateUpdate) {
    this.engine = new FisherEscolaEngine();
    this.onStateUpdate = onStateUpdate || (() => {});
    
    this._rafId = null;
    this._lastTime = 0;
    this._lastBroadcast = 0;
    this._running = false;
    
    // Pending recoherence flag (consumed each tick)
    this._pendingRecoherence = false;
    
    // Bind loop to preserve context
    this._loop = this._loop.bind(this);
  }

  /**
   * Start the simulation loop
   */
  start() {
    if (this._running) return;
    this._running = true;
    this._lastTime = performance.now();
    this._lastBroadcast = this._lastTime;
    this._rafId = requestAnimationFrame(this._loop);
  }

  /**
   * Stop the simulation loop
   */
  stop() {
    this._running = false;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
      this._rafId = null;
    }
  }

  /**
   * Inject voltage from external source (Zustand store)
   * @param {number} v - Voltage (0-100)
   */
  setVoltage(v) {
    this.engine.setVoltage(v);
  }

  /**
   * Queue a recoherence event for next tick
   */
  triggerRecoherence() {
    this._pendingRecoherence = true;
  }

  /**
   * Reset coherence to initial state
   */
  reset() {
    this.engine.reset();
    this._broadcast();
  }

  /**
   * Internal: RAF loop
   */
  _loop(now) {
    if (!this._running) return;

    // Calculate delta, cap at 100ms to prevent huge jumps
    const dt = Math.min((now - this._lastTime) / 1000, 0.1);
    this._lastTime = now;

    // Consume pending recoherence
    const recohere = this._pendingRecoherence;
    this._pendingRecoherence = false;

    // Step physics
    this.engine.step(dt, recohere);

    // Throttled broadcast to React
    if (now - this._lastBroadcast >= BROADCAST_INTERVAL) {
      this._broadcast();
      this._lastBroadcast = now;
    }

    // Continue loop
    this._rafId = requestAnimationFrame(this._loop);
  }

  /**
   * Internal: Push state to callback
   */
  _broadcast() {
    const state = this.engine.getState();
    this.onStateUpdate(state.coherence, state.qStatistic, state.molecules);
  }
}
