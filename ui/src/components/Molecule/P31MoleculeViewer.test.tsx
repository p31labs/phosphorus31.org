/**
 * P31MoleculeViewer Smoke Test — Verifies the component doesn't crash in test environment.
 * Skipped in default npm test: React 18/19 monorepo conflict (see ui/vitest.config.ts exclude).
 * Re-enable after unifying React or isolating test env.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { P31MoleculeViewer } from './P31MoleculeViewer';

describe('P31MoleculeViewer', () => {
  it('should import without errors', () => {
    expect(P31MoleculeViewer).toBeDefined();
  });

  it('should render without crashing', () => {
    const { container } = render(<P31MoleculeViewer />);
    expect(container).toBeTruthy();
  });

  it('should render Canvas mock in test environment', () => {
    render(<P31MoleculeViewer />);
    // Canvas is mocked to render a div with testid="r3f-canvas"
    expect(screen.getByTestId('r3f-canvas')).toBeInTheDocument();
  });
});
