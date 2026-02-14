/**
 * Save Manager - Persistence for player progress and structures
 * Uses DataStore when running server-side, localStorage stub when client-side.
 */

import { PlayerProgress, Structure, ChallengeResult } from '../types/game';

export class SaveManager {
  private storage: Map<string, any> = new Map();

  async init(): Promise<void> {
    // Load from persistent store if available
  }

  async loadPlayerProgress(): Promise<PlayerProgress | null> {
    return this.storage.get('playerProgress') || null;
  }

  async savePlayerProgress(progress: PlayerProgress): Promise<void> {
    this.storage.set('playerProgress', progress);
  }

  async loadStructure(id: string): Promise<Structure | null> {
    const structures: Structure[] = this.storage.get('structures') || [];
    return structures.find(s => s.id === id) || null;
  }

  saveStructure(structure: Structure): void {
    const structures: Structure[] = this.storage.get('structures') || [];
    const index = structures.findIndex(s => s.id === structure.id);
    if (index >= 0) {
      structures[index] = structure;
    } else {
      structures.push(structure);
    }
    this.storage.set('structures', structures);
  }

  saveChallengeCompletion(challengeId: string, result: ChallengeResult): void {
    const completions: Record<string, ChallengeResult> = this.storage.get('completions') || {};
    completions[challengeId] = result;
    this.storage.set('completions', completions);
  }

  dispose(): void {
    this.storage.clear();
  }
}

export default SaveManager;
