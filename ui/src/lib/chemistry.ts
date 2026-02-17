/**
 * Chemistry utilities for Bonding game
 * Element data, formula calculation, stability scoring
 */

import type { Atom, Bond, ElementInfo, GameStats } from '../types/bonding';

export const ELEMENTS: ElementInfo[] = [
  // Starter elements (row 1)
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, category: 'starter', locked: false, funFact: 'Most abundant element in the universe!', frequency: 220 },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, category: 'starter', locked: false, funFact: 'Lighter than air and makes your voice squeaky!', frequency: 233 },
  { symbol: 'Li', name: 'Lithium', atomicNumber: 3, category: 'starter', locked: false, funFact: 'Powers your phone battery!', frequency: 247 },
  { symbol: 'Be', name: 'Beryllium', atomicNumber: 4, category: 'starter', locked: false, funFact: 'Used in X-ray windows!', frequency: 262 },
  
  // Common elements (row 2)
  { symbol: 'C', name: 'Carbon', atomicNumber: 6, category: 'common', locked: false, funFact: 'The building block of life!', frequency: 294 },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, category: 'common', locked: false, funFact: 'Makes up 78% of our atmosphere!', frequency: 311 },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, category: 'common', locked: false, funFact: 'We breathe it every second!', frequency: 330 },
  { symbol: 'F', name: 'Fluorine', atomicNumber: 9, category: 'common', locked: false, funFact: 'Most reactive element!', frequency: 349 },
  { symbol: 'Ne', name: 'Neon', atomicNumber: 10, category: 'common', locked: false, funFact: 'Makes bright signs glow!', frequency: 370 },
  
  // Metals (row 3)
  { symbol: 'Na', name: 'Sodium', atomicNumber: 11, category: 'metals', locked: true, funFact: 'Explodes in water!', frequency: 392 },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, category: 'metals', locked: true, funFact: 'Burns with bright white light!', frequency: 415 },
  { symbol: 'Al', name: 'Aluminum', atomicNumber: 13, category: 'metals', locked: true, funFact: 'Lightweight and strong!', frequency: 440 },
  { symbol: 'Fe', name: 'Iron', atomicNumber: 26, category: 'metals', locked: true, funFact: 'Makes your blood red!', frequency: 523 },
  { symbol: 'Cu', name: 'Copper', atomicNumber: 29, category: 'metals', locked: true, funFact: 'Great conductor of electricity!', frequency: 554 },
  
  // Special elements (row 4)
  { symbol: 'P', name: 'Phosphorus', atomicNumber: 15, category: 'special', locked: false, funFact: 'P31 - The biological qubit!', frequency: 370 },
  { symbol: 'S', name: 'Sulfur', atomicNumber: 16, category: 'special', locked: false, funFact: 'Smells like rotten eggs!', frequency: 392 },
  { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, category: 'special', locked: false, funFact: 'Keeps pools clean!', frequency: 415 },
  { symbol: 'Ca', name: 'Calcium', atomicNumber: 20, category: 'special', locked: false, funFact: 'Makes your bones strong!', frequency: 440 },
];

export function getElement(symbol: string): ElementInfo | undefined {
  return ELEMENTS.find(e => e.symbol === symbol);
}

export function getElementByNumber(atomicNumber: number): ElementInfo | undefined {
  return ELEMENTS.find(e => e.atomicNumber === atomicNumber);
}

/**
 * Calculate molecular formula from atoms
 */
export function calculateFormula(atoms: Atom[]): string {
  const counts: Record<string, number> = {};
  atoms.forEach(atom => {
    counts[atom.element] = (counts[atom.element] || 0) + 1;
  });
  
  const sorted = Object.entries(counts).sort(([a], [b]) => {
    const elemA = getElement(a);
    const elemB = getElement(b);
    if (!elemA || !elemB) return 0;
    return elemA.atomicNumber - elemB.atomicNumber;
  });
  
  return sorted.map(([symbol, count]) => 
    count > 1 ? `${symbol}${count}` : symbol
  ).join('');
}

/**
 * Calculate molecular mass (simplified - uses atomic masses)
 */
const ATOMIC_MASSES: Record<string, number> = {
  'H': 1.008, 'He': 4.003, 'Li': 6.941, 'Be': 9.012,
  'C': 12.011, 'N': 14.007, 'O': 15.999, 'F': 18.998, 'Ne': 20.180,
  'Na': 22.990, 'Mg': 24.305, 'Al': 26.982, 'Fe': 55.845, 'Cu': 63.546,
  'P': 30.974, 'S': 32.065, 'Cl': 35.453, 'Ca': 40.078,
};

export function calculateMass(atoms: Atom[]): number {
  return atoms.reduce((sum, atom) => {
    const mass = ATOMIC_MASSES[atom.element] || 0;
    return sum + mass;
  }, 0);
}

/**
 * Calculate stability score (0-100%)
 * Based on: octet rule, bond angles, known molecules
 */
export function calculateStability(atoms: Atom[], bonds: Bond[]): number {
  if (atoms.length === 0) return 0;
  if (atoms.length === 1) return 50; // Single atom, neutral stability
  
  const formula = calculateFormula(atoms);
  const knownMolecules: Record<string, number> = {
    'H2O': 100, 'CO2': 95, 'NH3': 90, 'CH4': 95,
    'O2': 85, 'N2': 90, 'H2': 80, 'HCl': 85,
    'CaCO3': 90, 'H2SO4': 85, 'NaCl': 95,
  };
  
  // Check if it's a known stable molecule
  if (knownMolecules[formula]) {
    return knownMolecules[formula];
  }
  
  // Basic octet rule check
  const bondCounts: Record<string, number> = {};
  bonds.forEach(bond => {
    bondCounts[bond.atom1Id] = (bondCounts[bond.atom1Id] || 0) + bond.order;
    bondCounts[bond.atom2Id] = (bondCounts[bond.atom2Id] || 0) + bond.order;
  });
  
  let stability = 60; // Base stability
  atoms.forEach(atom => {
    const bonds = bondCounts[atom.id] || 0;
    const element = getElement(atom.element);
    if (!element) return;
    
    // Hydrogen wants 1 bond, others want 2-4
    const desiredBonds = element.atomicNumber === 1 ? 1 : Math.min(4, Math.max(2, element.atomicNumber / 5));
    const diff = Math.abs(bonds - desiredBonds);
    stability -= diff * 5; // Penalty for wrong bond count
  });
  
  return Math.max(0, Math.min(100, stability));
}

/**
 * Get bond sites for an atom (positions where new atoms can bond)
 */
export function getBondSites(atom: Atom, allAtoms: Atom[]): Array<{ x: number; y: number; angle: number }> {
  const sites: Array<{ x: number; y: number; angle: number }> = [];
  const maxBonds = 4;
  const bondDistance = 80; // pixels
  
  // Find existing bonds
  const existingBonds = allAtoms.filter(a => {
    const dx = a.x - atom.x;
    const dy = a.y - atom.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return dist < bondDistance * 1.5 && a.id !== atom.id;
  });
  
  const existingAngles = existingBonds.map(a => {
    const dx = a.x - atom.x;
    const dy = a.y - atom.y;
    return Math.atan2(dy, dx);
  });
  
  // Generate bond sites at regular angles
  const angleStep = (Math.PI * 2) / maxBonds;
  for (let i = 0; i < maxBonds; i++) {
    const angle = i * angleStep;
    
    // Skip if too close to existing bond
    const tooClose = existingAngles.some(a => Math.abs(angle - a) < angleStep * 0.5);
    if (tooClose && existingBonds.length > 0) continue;
    
    sites.push({
      x: atom.x + Math.cos(angle) * bondDistance,
      y: atom.y + Math.sin(angle) * bondDistance,
      angle,
    });
  }
  
  return sites;
}

/**
 * Check if two atoms can form a bond
 */
export function canBond(atom1: Atom, atom2: Atom): boolean {
  const dx = atom2.x - atom1.x;
  const dy = atom2.y - atom1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < 100; // Within bonding distance
}

/**
 * Calculate game stats
 */
export function calculateGameStats(atoms: Atom[], bonds: Bond[], players: Array<{ id: string }>): GameStats {
  const formula = calculateFormula(atoms);
  const mass = calculateMass(atoms);
  const stability = calculateStability(atoms, bonds);
  
  const playerStats: Record<string, { atoms: number; pings: number }> = {};
  players.forEach(player => {
    playerStats[player.id] = {
      atoms: atoms.filter(a => a.playerId === player.id).length,
      pings: 0, // Will be filled from game state
    };
  });
  
  return {
    formula,
    mass,
    stability,
    atomCount: atoms.length,
    bondCount: bonds.length,
    playerStats,
  };
}

/**
 * Generate 6-character game code
 */
export function generateGameCode(): string {
  return crypto.randomUUID().slice(0, 6).toUpperCase();
}

/**
 * Get element frequency for sound (Hz)
 * Based on atomic number: 220 * 2^((n-1)/12)
 */
export function getElementFrequency(atomicNumber: number): number {
  return 220 * Math.pow(2, (atomicNumber - 1) / 12);
}
