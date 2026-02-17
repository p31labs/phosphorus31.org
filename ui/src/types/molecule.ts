/**
 * P31 Molecule Types
 * Types for molecular structures, especially Posner molecules
 */

import * as THREE from 'three';

export interface Atom {
  id: string;
  element: string;
  atomicNumber: number;
  position: THREE.Vector3;
  charge: number;
  spin?: number; // For P31 (phosphorus-31)
  coherence?: number; // Quantum coherence (0-1)
  entangledWith?: string[]; // IDs of entangled atoms
}

export interface Bond {
  id: string;
  atom1Id: string;
  atom2Id: string;
  order: 1 | 2 | 3; // Single, double, triple
  length: number;
  angle?: number;
}

export interface PosnerMolecule {
  id: string;
  name: string;
  formula: string; // Ca9(PO4)6
  atoms: Atom[];
  bonds: Bond[];
  quantumState: {
    coherence: number; // Overall coherence (0-1)
    entanglement: string[]; // Entangled molecule IDs
    phase: number; // Quantum phase
    lifetime: number; // Coherence lifetime (ms)
  };
  geometry: {
    type: 'tetrahedral' | 'octahedral' | 'icosahedral';
    vertices: THREE.Vector3[];
    edges: Bond[];
  };
}

export interface MoleculeBuilderState {
  selectedAtom: Atom | null;
  selectedBond: Bond | null;
  mode: 'build' | 'edit' | 'view' | 'quantum';
  showQuantumProperties: boolean;
  showBonds: boolean;
  showLabels: boolean;
  molecules: PosnerMolecule[];
  activeMolecule: PosnerMolecule | null;
}

export interface QuantumCoherence {
  atomId: string;
  coherence: number;
  phase: number;
  entangledAtoms: string[];
  decoherenceRate: number;
}

// Element properties for visualization
export interface ElementProperties {
  atomicNumber: number;
  symbol: string;
  name: string;
  color: string;
  radius: number;
  mass: number;
  electronegativity: number;
}

export const ELEMENT_PROPERTIES: Record<string, ElementProperties> = {
  P: {
    atomicNumber: 15,
    symbol: 'P',
    name: 'Phosphorus',
    color: '#FF8000', // Orange
    radius: 1.0,
    mass: 30.97,
    electronegativity: 2.19,
  },
  P31: {
    atomicNumber: 15,
    symbol: 'P-31',
    name: 'Phosphorus-31',
    color: '#FF4000', // Bright orange-red
    radius: 1.0,
    mass: 30.97,
    electronegativity: 2.19,
  },
  Ca: {
    atomicNumber: 20,
    symbol: 'Ca',
    name: 'Calcium',
    color: '#3DFF00', // Green
    radius: 1.0,
    mass: 40.08,
    electronegativity: 1.0,
  },
  O: {
    atomicNumber: 8,
    symbol: 'O',
    name: 'Oxygen',
    color: '#FF0D0D', // Red
    radius: 0.6,
    mass: 16.0,
    electronegativity: 3.44,
  },
  H: {
    atomicNumber: 1,
    symbol: 'H',
    name: 'Hydrogen',
    color: '#FFFFFF', // White
    radius: 0.3,
    mass: 1.01,
    electronegativity: 2.2,
  },
};

// Posner molecule structure (Ca9(PO4)6)
export const POSNER_MOLECULE_TEMPLATE: Omit<PosnerMolecule, 'id' | 'quantumState'> = {
  name: 'Posner Molecule',
  formula: 'Ca9(PO4)6',
  atoms: [], // Will be generated
  bonds: [], // Will be generated
  geometry: {
    type: 'icosahedral',
    vertices: [],
    edges: [],
  },
};
