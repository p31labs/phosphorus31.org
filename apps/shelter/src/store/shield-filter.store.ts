/**
 * SHIELD FILTER STORE (Node D: Shield Engine)
 * Zustand store for pattern-based message filtering
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {
  ShieldFilterState,
  ShieldFilterActions,
  FilterStrength,
  ProcessedResult,
} from '../types/shield-filter.types';

interface ShieldFilterStore extends ShieldFilterState, ShieldFilterActions {}

// Default threat patterns
const defaultPatterns: Record<string, RegExp[]> = {
  guilt: [
    /you should/i,
    /you must/i,
    /you have to/i,
    /it's your fault/i,
    /you always/i,
    /you never/i,
  ],
  blame: [
    /you did this/i,
    /because of you/i,
    /your fault/i,
    /you caused/i,
  ],
  threat: [
    /or else/i,
    /you'll be sorry/i,
    /I'll/i,
    /threat/i,
    /harm/i,
  ],
  withdrawal: [
    /not talking/i,
    /ignoring/i,
    /silent treatment/i,
  ],
};

function calculateVoltage(raw: string): number {
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

  return Math.max(0, Math.min(voltage, 10));
}

function detectGenre(raw: string): 'physics' | 'poetics' | 'mixed' {
  if (/because|therefore|since|logic|reason/i.test(raw)) {
    return 'physics';
  } else if (/feel|emotion|heart|soul|beautiful/i.test(raw)) {
    return 'poetics';
  }
  return 'mixed';
}

const initialState: ShieldFilterState = {
  enabled: true,
  filterStrength: 'standard',
  patterns: defaultPatterns,
  stats: {
    messagesScanned: 0,
    threatsDetected: 0,
    messagesQueued: 0,
  },
};

export const useShieldFilterStore = create<ShieldFilterStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        toggleShield: () => {
          set(
            (state) => ({ enabled: !state.enabled }),
            false,
            'toggleShield'
          );
        },

        setStrength: (level: FilterStrength) => {
          set({ filterStrength: level }, false, 'setStrength');
        },

        processMessage: (raw: string): ProcessedResult => {
          const { enabled, filterStrength, patterns } = get();

          // Update stats
          set(
            (state) => ({
              stats: {
                ...state.stats,
                messagesScanned: state.stats.messagesScanned + 1,
              },
            }),
            false,
            'processMessage'
          );

          if (!enabled) {
            // Shield disabled - return safe result
            return {
              translated: raw,
              voltage: 0,
              spoonCost: 1,
              genre: 'mixed',
              threatLevel: 'safe',
              threatFlags: [],
            };
          }

          // Calculate voltage
          const voltage = calculateVoltage(raw);

          // Detect genre
          const genre = detectGenre(raw);

          // Check patterns based on filter strength
          const threatFlags: string[] = [];
          let threatLevel: 'safe' | 'caution' | 'threat' = 'safe';

          const patternMultiplier =
            filterStrength === 'maximum' ? 1.0 : filterStrength === 'standard' ? 0.7 : 0.4;

          for (const [category, regexps] of Object.entries(patterns)) {
            for (const pattern of regexps) {
              if (pattern.test(raw)) {
                threatFlags.push(category);
                if (category === 'threat') {
                  threatLevel = 'threat';
                } else if (threatLevel === 'safe') {
                  threatLevel = 'caution';
                }
              }
            }
          }

          // Adjust threat level based on filter strength
          if (filterStrength === 'light' && threatLevel === 'caution') {
            // Light mode: only flag explicit threats
            if (!threatFlags.includes('threat')) {
              threatLevel = 'safe';
            }
          }

          // Calculate spoon cost
          let spoonCost = 1;
          if (voltage > 7) spoonCost = 5;
          else if (voltage > 5) spoonCost = 4;
          else if (voltage > 3) spoonCost = 3;
          else if (voltage > 1) spoonCost = 2;

          spoonCost += Math.min(threatFlags.length, 2);
          spoonCost = Math.min(spoonCost, 5);

          // Generate translation (simplified)
          let translated = raw;
          if (filterStrength !== 'light') {
            translated = raw
              .replace(/!/g, '.')
              .replace(/\?{2,}/g, '?')
              .replace(/you always/gi, 'sometimes')
              .replace(/you never/gi, 'sometimes')
              .replace(/OBVIOUSLY|CLEARLY/gi, '')
              .trim();
          }

          // Update threat stats
          if (threatLevel !== 'safe') {
            set(
              (state) => ({
                stats: {
                  ...state.stats,
                  threatsDetected: state.stats.threatsDetected + 1,
                },
              }),
              false,
              'processMessage'
            );
          }

          // Update queue stats if high spoon cost
          if (spoonCost >= 3) {
            set(
              (state) => ({
                stats: {
                  ...state.stats,
                  messagesQueued: state.stats.messagesQueued + 1,
                },
              }),
              false,
              'processMessage'
            );
          }

          return {
            translated,
            voltage,
            spoonCost,
            genre,
            threatLevel,
            threatFlags,
          };
        },

        addPattern: (category: string, pattern: RegExp) => {
          set(
            (state) => {
              const existing = state.patterns[category] || [];
              return {
                patterns: {
                  ...state.patterns,
                  [category]: [...existing, pattern],
                },
              };
            },
            false,
            'addPattern'
          );
        },

        removePattern: (category: string, patternIndex: number) => {
          set(
            (state) => {
              const existing = state.patterns[category];
              if (!existing || patternIndex < 0 || patternIndex >= existing.length) {
                return state;
              }

              return {
                patterns: {
                  ...state.patterns,
                  [category]: existing.filter((_, i) => i !== patternIndex),
                },
              };
            },
            false,
            'removePattern'
          );
        },

        resetStats: () => {
          set(
            {
              stats: {
                messagesScanned: 0,
                threatsDetected: 0,
                messagesQueued: 0,
              },
            },
            false,
            'resetStats'
          );
        },
      }),
      {
        name: 'cognitive-shield-filter',
        partialize: (state) => ({
          enabled: state.enabled,
          filterStrength: state.filterStrength,
          patterns: state.patterns,
          // Don't persist stats (reset on reload)
        }),
      }
    ),
    { name: 'ShieldFilterStore' }
  )
);

export default useShieldFilterStore;
