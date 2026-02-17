// ══════════════════════════════════════════════════════════════════════════════
// TRIMTAB CONTEXT
// Singleton provider for voice guidance.
// Prevents double SpeechRecognition instantiation.
// ══════════════════════════════════════════════════════════════════════════════

import { createContext } from 'react';
import { useTrimtab } from './hooks/useTrimtab.js';

/** Exported so useTrimtabContext.js can consume it; keeps this file components-only for Fast Refresh */
export const TrimtabContext = createContext(null);

/**
 * Provider wraps the app to share a single Trimtab instance
 */
export function TrimtabProvider({ children }) {
  const trimtab = useTrimtab();

  return (
    <TrimtabContext.Provider value={trimtab}>
      {children}
    </TrimtabContext.Provider>
  );
}
