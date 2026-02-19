/**
 * P31 Game Integration — Shelter API bridge for React/frontend
 *
 * Talks to the P31 Tandem Shelter-compat API at /api/shelter/*.
 * All methods are null-safe: on network failure they return null (or empty)
 * so the UI never crashes when P31 Tandem is down.
 */

import type { P31Molecule, BrainState, GameClient } from './types/molecule';

export class ShelterBridge {
  private url: string;
  private apiKey: string;
  private ws: WebSocket | null = null;

  constructor(shelterUrl: string, apiKey: string = '') {
    this.url = shelterUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  static fromEnv(): ShelterBridge | null {
    const url =
      typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SHELTER_URL
        ? (import.meta as any).env.VITE_SHELTER_URL
        : '';
    if (!url) return null;
    const key = typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_SHELTER_KEY
      ? (import.meta as any).env.VITE_SHELTER_KEY
      : '';
    return new ShelterBridge(url, key);
  }

  private headers(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) h['X-P31-Key'] = this.apiKey;
    return h;
  }

  /** Register a molecule (genesis or build) */
  async registerMolecule(
    fingerprint: string,
    molecule: Partial<P31Molecule> | Record<string, unknown>
  ): Promise<{ success: boolean; message?: string } | null> {
    try {
      const res = await fetch(`${this.url}/api/shelter/molecule`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({ fingerprint, molecule }),
      });
      if (res.ok) return await res.json();
    } catch {
      /* offline */
    }
    return null;
  }

  /** Legacy signature — accepts a full P31Molecule and extracts fingerprint */
  async registerMoleculeLegacy(molecule: P31Molecule): Promise<{ success: boolean; message?: string } | null> {
    return this.registerMolecule(molecule.fingerprint, molecule);
  }

  /** Pull brain state (spoons, coherence) */
  async getBrainState(): Promise<BrainState | null> {
    try {
      const res = await fetch(`${this.url}/api/shelter/brain`, {
        headers: this.headers(),
      });
      if (res.ok) return await res.json();
    } catch {
      /* offline */
    }
    return null;
  }

  /** Patch brain state fields */
  async updateBrainState(
    updates: Partial<BrainState>
  ): Promise<{ success: boolean; brain?: BrainState } | null> {
    try {
      const res = await fetch(`${this.url}/api/shelter/brain`, {
        method: 'PATCH',
        headers: this.headers(),
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch {
      /* offline */
    }
    return null;
  }

  /** LOVE wallet balance for a fingerprint */
  async getWalletBalance(
    fingerprint: string
  ): Promise<{ sovereigntyPool: number; performancePool: number; totalEarned: number } | null> {
    try {
      const res = await fetch(
        `${this.url}/api/shelter/wallet/${encodeURIComponent(fingerprint)}`,
        { headers: this.headers() }
      );
      if (res.ok) return await res.json();
    } catch {
      /* offline */
    }
    return null;
  }

  /** Push game + wallet state to Centaur */
  async syncState(
    fingerprint: string,
    state: Record<string, unknown>
  ): Promise<{ success: boolean; syncedAt?: string } | null> {
    try {
      const res = await fetch(`${this.url}/api/shelter/sync`, {
        method: 'POST',
        headers: this.headers(),
        body: JSON.stringify({ fingerprint, state }),
      });
      if (res.ok) return await res.json();
    } catch {
      /* offline */
    }
    return null;
  }

  /** Legacy syncGameState — accepts partial GameClient */
  async syncGameState(state: Partial<GameClient>): Promise<{ success: boolean } | null> {
    const fp = (state as any)?.fingerprint || 'unknown';
    return this.syncState(fp, state as Record<string, unknown>);
  }

  /** Read full game state from Centaur */
  async getState(
    fingerprint: string
  ): Promise<{ fingerprint: string; state: Record<string, unknown> } | null> {
    try {
      const res = await fetch(
        `${this.url}/api/shelter/state/${encodeURIComponent(fingerprint)}`,
        { headers: this.headers() }
      );
      if (res.ok) return await res.json();
    } catch {
      /* offline */
    }
    return null;
  }

  /** Mesh status (molecule + wallet counts) */
  async getMesh(): Promise<Record<string, unknown> | null> {
    try {
      const res = await fetch(`${this.url}/api/shelter/mesh`, {
        headers: this.headers(),
      });
      if (res.ok) return await res.json();
    } catch {
      /* offline */
    }
    return null;
  }

  /** Legacy mesh directory — now returns mesh summary */
  async getMeshDirectory(): Promise<any[]> {
    const mesh = await this.getMesh();
    return mesh ? [mesh] : [];
  }

  /** WebSocket for real-time (Sprout signals, mesh updates). Reconnects on close. */
  connectRealtime(fingerprint: string, onMessage: (msg: unknown) => void): void {
    const wsUrl = this.url.replace(/^http/, 'ws');
    this.ws = new WebSocket(`${wsUrl}/ws?fp=${encodeURIComponent(fingerprint)}`);
    this.ws.onmessage = (event) => {
      try {
        onMessage(JSON.parse(event.data as string));
      } catch {
        onMessage(event.data);
      }
    };
    this.ws.onclose = () => {
      this.ws = null;
      setTimeout(() => this.connectRealtime(fingerprint, onMessage), 5000);
    };
  }

  disconnectRealtime(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
