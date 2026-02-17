/**
 * Landing gate — show Quantum Hello World when no molecule in storage.
 * Otherwise show the full Scope app. Phosphorus31.org front door.
 */

import React, { useState, useEffect } from 'react';
import { QuantumHelloWorld } from './QuantumHelloWorld/QuantumHelloWorld';
import { PosnerViz } from './QuantumHelloWorld/PosnerViz';

const STORAGE_KEY = 'p31:molecule';

export function LandingGate({ children }: { children: React.ReactNode }) {
  const [hasMolecule, setHasMolecule] = useState<boolean | null>(null);

  useEffect(() => {
    const storage = typeof window !== 'undefined' ? window.storage : undefined;
    if (!storage) {
      setHasMolecule(false);
      return;
    }
    storage.get(STORAGE_KEY).then((raw) => {
      setHasMolecule(raw !== null && raw !== '');
    });
  }, []);

  if (hasMolecule === null) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#050510',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-live="polite"
        aria-label="Loading"
      >
        <PosnerViz coherence={0.15} />
      </div>
    );
  }

  if (!hasMolecule) {
    return <QuantumHelloWorld />;
  }

  return <>{children}</>;
}
