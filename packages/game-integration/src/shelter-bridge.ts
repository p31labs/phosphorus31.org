/**
 * P31 Game Integration — Shelter API bridge for React/frontend
 * Register molecule, pull brain state, sync game state, real-time WebSocket.
 */

import type { P31Molecule, BrainState, GameClient } from './types/molecule';

export class ShelterBridge {
  private url: string;
  private apiKey: string;
  private ws: WebSocket | null = null;

  constructor(shelterUrl: string, apiKey: string) {
    this.url = shelterUrl.replace(/\/$/, '');
    this.apiKey = apiKey;
  }

  /** Push molecule identity to Shelter on formation */
  async registerMolecule(molecule: P31Molecule): Promise<{ status: string; genesisLove: number }> {
    const res = await fetch(`${this.url}/api/game/molecule/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-P31-Key': this.apiKey,
        'X-P31-Fingerprint': molecule.fingerprint,
      },
      body: JSON.stringify({
        fingerprint: molecule.fingerprint,
        publicKey: molecule.publicKey,
        domeName: molecule.dome.name,
        domeColor: molecule.dome.color,
        domeIntent: molecule.dome.intent,
        coherence: molecule.player.coherence,
        covenantSig: molecule.covenantSig,
        covenantAt: molecule.covenantAt,
      }),
    });
    if (!res.ok) throw new Error(`registerMolecule: ${res.status}`);
    return res.json();
  }

  /** Pull brain state (spoons, meds, buffer events) from GAS → Shelter */
  async getBrainState(): Promise<BrainState | null> {
    try {
      const res = await fetch(`${this.url}/api/game/brain/state`, {
        headers: { 'X-P31-Key': this.apiKey },
      });
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    return null;
  }

  /** Push game state updates to Shelter */
  async syncGameState(state: Partial<GameClient>): Promise<{ status: string }> {
    const res = await fetch(`${this.url}/api/game/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-P31-Key': this.apiKey,
      },
      body: JSON.stringify(state),
    });
    if (!res.ok) throw new Error(`syncGameState: ${res.status}`);
    return res.json();
  }

  /** Mesh directory — all molecules (domes) */
  async getMeshDirectory(): Promise<Array<{ fingerprint: string; dome_name: string; dome_color: string; dome_intent: string; coherence: number; created_at: string }>> {
    const res = await fetch(`${this.url}/api/game/mesh/directory`, {
      headers: { 'X-P31-Key': this.apiKey },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  }

  /** LOVE wallet balance for a fingerprint */
  async getWalletBalance(fingerprint: string): Promise<{ sovereigntyPool: number; performancePool: number; totalEarned: number; transactionCount: number } | null> {
    try {
      const res = await fetch(`${this.url}/api/game/wallet/${encodeURIComponent(fingerprint)}/balance`, {
        headers: { 'X-P31-Key': this.apiKey },
      });
      if (res.ok) return await res.json();
    } catch {
      // ignore
    }
    return null;
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
