/**
 * MESSAGES STORE (Node B: Them)
 * Zustand store for message handling with spoon cost tracking
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  MessagesState,
  MessagesActions,
  Message,
  MessageSource,
  MessageGenre,
  ThreatLevel,
} from '../types/messages.types';

interface MessagesStore extends MessagesState, MessagesActions {}

const generateId = (): string => crypto.randomUUID();

// Helper to calculate message metadata
function calculateMessageMetadata(raw: string): {
  voltage: number;
  spoonCost: number;
  genre: MessageGenre;
  threatLevel: ThreatLevel;
  threatFlags: string[];
} {
  // Calculate voltage (0-10 emotional intensity)
  let voltage = 0;
  const upperCaseRatio = (raw.match(/[A-Z]/g)?.length || 0) / Math.max(raw.length, 1);
  const exclamationCount = (raw.match(/!/g) || []).length;
  const questionCount = (raw.match(/\?/g) || []).length;
  const capsLockPattern = /[A-Z]{5,}/.test(raw);

  voltage += upperCaseRatio * 3;
  voltage += Math.min(exclamationCount * 0.5, 2);
  voltage += Math.min(questionCount * 0.3, 1.5);
  if (capsLockPattern) voltage += 2;
  if (/urgent|asap|immediately|now|hurry/i.test(raw)) voltage += 1.5;
  if (/angry|furious|disappointed|upset/i.test(raw)) voltage += 2;
  if (/love|care|support|thank/i.test(raw)) voltage -= 1;

  voltage = Math.max(0, Math.min(voltage, 10));

  // Detect genre
  let genre: MessageGenre = 'mixed';
  if (/because|therefore|since|logic|reason/i.test(raw)) {
    genre = 'physics';
  } else if (/feel|emotion|heart|soul|beautiful/i.test(raw)) {
    genre = 'poetics';
  }

  // Detect threat level and flags
  const threatFlags: string[] = [];
  let threatLevel: ThreatLevel = 'safe';

  if (/threat|harm|danger|unsafe/i.test(raw)) {
    threatFlags.push('explicit_threat');
    threatLevel = 'threat';
  } else if (/guilt|should|must|obligation|expect/i.test(raw)) {
    threatFlags.push('guilt_trip');
    threatLevel = 'caution';
  } else if (/blame|fault|your fault|you always|you never/i.test(raw)) {
    threatFlags.push('blame');
    threatLevel = 'caution';
  } else if (/ignore|silent treatment|not talking/i.test(raw)) {
    threatFlags.push('withdrawal');
    threatLevel = 'caution';
  }

  if (voltage > 7) {
    threatLevel = threatLevel === 'safe' ? 'caution' : threatLevel;
  }

  // Calculate spoon cost (1-5)
  let spoonCost = 1;
  if (voltage > 7) spoonCost = 5;
  else if (voltage > 5) spoonCost = 4;
  else if (voltage > 3) spoonCost = 3;
  else if (voltage > 1) spoonCost = 2;

  spoonCost += threatFlags.length;
  spoonCost = Math.min(spoonCost, 5);

  return { voltage, spoonCost, genre, threatLevel, threatFlags };
}

const initialState: MessagesState = {
  inbox: [],
  outbox: [],
  queue: [],
};

export const useMessagesStore = create<MessagesStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        addIncoming: (raw: string, source: MessageSource, meta?: Partial<Message>) => {
          const metadata = calculateMessageMetadata(raw);
          const now = Date.now();

          const message: Message = {
            id: meta?.id || generateId(),
            raw,
            translated: meta?.translated || null,
            voltage: meta?.voltage ?? metadata.voltage,
            spoonCost: meta?.spoonCost ?? metadata.spoonCost,
            genre: meta?.genre ?? metadata.genre,
            threatLevel: meta?.threatLevel ?? metadata.threatLevel,
            threatFlags: meta?.threatFlags ?? metadata.threatFlags,
            from: meta?.from || 'unknown',
            timestamp: meta?.timestamp || now,
            read: meta?.read ?? false,
            revealed: meta?.revealed ?? false,
            source,
          };

          set(
            (state) => ({
              inbox: [message, ...state.inbox].slice(0, 100), // Keep last 100
            }),
            false,
            'addIncoming'
          );
        },

        markRead: (id: string) => {
          set(
            (state) => ({
              inbox: state.inbox.map((msg) =>
                msg.id === id ? { ...msg, read: true } : msg
              ),
            }),
            false,
            'markRead'
          );
        },

        revealRaw: (id: string) => {
          set(
            (state) => ({
              inbox: state.inbox.map((msg) =>
                msg.id === id ? { ...msg, revealed: true } : msg
              ),
            }),
            false,
            'revealRaw'
          );
        },

        queueMessage: (id: string) => {
          set(
            (state) => {
              const message = state.inbox.find((msg) => msg.id === id);
              if (!message) return state;

              return {
                inbox: state.inbox.filter((msg) => msg.id !== id),
                queue: [message, ...state.queue],
              };
            },
            false,
            'queueMessage'
          );
        },

        dequeueMessage: (id: string) => {
          set(
            (state) => {
              const message = state.queue.find((msg) => msg.id === id);
              if (!message) return state;

              return {
                inbox: [message, ...state.inbox].slice(0, 100),
                queue: state.queue.filter((msg) => msg.id !== id),
              };
            },
            false,
            'dequeueMessage'
          );
        },

        addOutgoing: (text: string) => {
          const message: Message = {
            id: generateId(),
            raw: text,
            translated: null,
            voltage: 0,
            spoonCost: 0,
            genre: 'mixed',
            threatLevel: 'safe',
            threatFlags: [],
            from: 'me',
            timestamp: Date.now(),
            read: true,
            revealed: true,
            source: 'manual',
          };

          set(
            (state) => ({
              outbox: [message, ...state.outbox].slice(0, 100),
            }),
            false,
            'addOutgoing'
          );
        },

        clearOld: (olderThanMs: number) => {
          const cutoff = Date.now() - olderThanMs;

          set(
            (state) => ({
              inbox: state.inbox.filter((msg) => msg.timestamp >= cutoff),
              outbox: state.outbox.filter((msg) => msg.timestamp >= cutoff),
              queue: state.queue.filter((msg) => msg.timestamp >= cutoff),
            }),
            false,
            'clearOld'
          );
        },
      }),
      {
        name: 'cognitive-shield-messages',
        partialize: (state) => ({
          inbox: state.inbox.slice(0, 100), // Cap at 100 messages
          outbox: state.outbox.slice(0, 100),
          queue: state.queue,
        }),
      }
    ),
    { name: 'MessagesStore' }
  )
);

export default useMessagesStore;
