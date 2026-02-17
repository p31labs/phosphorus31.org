/**
 * MESSAGES TYPE DEFINITIONS
 * Node B: Them - Message handling with spoon cost tracking
 */

export type MessageMood = 'calm' | 'anxious' | 'overwhelmed' | 'focused' | 'low';

export type MessageGenre = 'physics' | 'poetics' | 'mixed';

export type ThreatLevel = 'safe' | 'caution' | 'threat';

export type MessageSource = 'manual' | 'lora' | 'api';

export interface Message {
  readonly id: string;
  readonly raw: string;
  readonly translated: string | null;
  readonly voltage: number; // 0-10 emotional intensity
  readonly spoonCost: number; // estimated cognitive cost
  readonly genre: MessageGenre;
  readonly threatLevel: ThreatLevel;
  readonly threatFlags: readonly string[];
  readonly from: string;
  readonly timestamp: number;
  readonly read: boolean;
  readonly revealed: boolean; // has user chosen to see raw text?
  readonly source: MessageSource;
}

export interface MessagesState {
  readonly inbox: readonly Message[];
  readonly outbox: readonly Message[];
  readonly queue: readonly Message[]; // held messages (spoon cost too high)
}

export interface MessagesActions {
  addIncoming: (raw: string, source: MessageSource, meta?: Partial<Message>) => void;
  markRead: (id: string) => void;
  revealRaw: (id: string) => void;
  queueMessage: (id: string) => void;
  dequeueMessage: (id: string) => void;
  addOutgoing: (text: string) => void;
  clearOld: (olderThanMs: number) => void;
}
