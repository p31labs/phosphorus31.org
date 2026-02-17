// Hook to access the singleton Trimtab instance.
// Lives in a separate file so TrimtabContext.jsx can Fast Refresh (components-only export).
import { useContext } from 'react';
import { TrimtabContext } from './TrimtabContext.jsx';

const TRIMTAB_FALLBACK = {
  listen: () => {},
  stopListening: () => {},
  isListening: false,
  speak: () => {},
};

/**
 * Never throws: returns safe no-ops when used outside TrimtabProvider.
 */
export function useTrimtabContext() {
  const ctx = useContext(TrimtabContext);
  return ctx ?? TRIMTAB_FALLBACK;
}
