/**
 * SHIELD FILTER TYPE DEFINITIONS
 * Node D: Shield Engine - Pattern-based filtering
 */

export type FilterStrength = 'light' | 'standard' | 'maximum';

export interface ProcessedResult {
  readonly translated: string;
  readonly voltage: number;
  readonly spoonCost: number;
  readonly genre: 'physics' | 'poetics' | 'mixed';
  readonly threatLevel: 'safe' | 'caution' | 'threat';
  readonly threatFlags: readonly string[];
}

export interface ShieldFilterState {
  readonly enabled: boolean;
  readonly filterStrength: FilterStrength;
  readonly patterns: Readonly<Record<string, readonly RegExp[]>>;
  readonly stats: {
    readonly messagesScanned: number;
    readonly threatsDetected: number;
    readonly messagesQueued: number;
  };
}

export interface ShieldFilterActions {
  toggleShield: () => void;
  setStrength: (level: FilterStrength) => void;
  processMessage: (raw: string) => ProcessedResult;
  addPattern: (category: string, pattern: RegExp) => void;
  removePattern: (category: string, patternIndex: number) => void;
  resetStats: () => void;
}
