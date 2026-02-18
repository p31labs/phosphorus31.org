// ══════════════════════════════════════════════════════════════════════════════
// TRIMTAB CONTEXT
// Singleton provider for voice guidance.
// Prevents double SpeechRecognition instantiation.
// ══════════════════════════════════════════════════════════════════════════════

import { createContext, useContext } from 'react';
import { useTrimtab } from './hooks/useTrimtab.js';

const TrimtabContext = createContext(null);

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

/**
 * Hook to access the singleton Trimtab instance
 */
export function useTrimtabContext() {
  const ctx = useContext(TrimtabContext);
  if (!ctx) {
    throw new Error('useTrimtabContext must be used within TrimtabProvider');
  }
  return ctx;
}
