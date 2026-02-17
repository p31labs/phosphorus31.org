// ui/src/providers/GenesisProvider.tsx
import React, { ReactNode } from 'react';
import { useGenesisStore } from '../stores/genesis';

interface GenesisProviderProps {
  children: ReactNode;
}

export const GenesisProvider = ({ children }: GenesisProviderProps) => {
  // Initialize global state, effects, etc.
  // Example: useGenesisStore().initialize();

  return <React.StrictMode>{children}</React.StrictMode>;
};
