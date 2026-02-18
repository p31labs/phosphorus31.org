/**
 * Molecule Builder Utilities
 * Helper functions for building and manipulating molecules
 */

import * as THREE from 'three';
import {
  Atom,
  Bond,
  PosnerMolecule,
  ElementProperties,
  ELEMENT_PROPERTIES,
} from '../types/molecule';

/**
 * Generate a Posner molecule (Ca9(PO4)6)
 * 9 Calcium atoms, 6 Phosphate groups (each with 1 P and 4 O)
 */
export function generatePosnerMolecule(id: string = 'posner_1'): PosnerMolecule {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  let atomIdCounter = 0;
  let bondIdCounter = 0;

  // Generate 9 Calcium atoms in icosahedral arrangement
  const caPositions = generateIcosahedralPositions(9, 2.0);
  caPositions.forEach((pos) => {
    atoms.push({
      id: `ca_${atomIdCounter++}`,
      element: 'Ca',
      atomicNumber: 20,
      position: pos,
      charge: 2,
    });
  });

  // Generate 6 Phosphate groups (PO4)
  const po4Positions = generateIcosahedralPositions(6, 1.5);
  po4Positions.forEach((centerPos) => {
    // Phosphorus atom at center
    const pId = `p_${atomIdCounter++}`;
    atoms.push({
      id: pId,
      element: 'P31', // P31 - the biological qubit!
      atomicNumber: 15,
      position: centerPos.clone(),
      charge: 5,
      spin: 1 / 2, // Nuclear spin for P31
      coherence: 1.0, // Full coherence initially
    });

    // 4 Oxygen atoms around each P
    const oPositions = generateTetrahedralPositions(centerPos, 1.0);
    oPositions.forEach((oPos) => {
      const oId = `o_${atomIdCounter++}`;
      atoms.push({
        id: oId,
        element: 'O',
        atomicNumber: 8,
        position: oPos,
        charge: -2,
      });

      // Bond P to O
      bonds.push({
        id: `bond_${bondIdCounter++}`,
        atom1Id: pId,
        atom2Id: oId,
        order: 1,
        length: centerPos.distanceTo(oPos),
      });
    });
  });

  return {
    id,
    name: 'Posner Molecule',
    formula: 'Ca9(PO4)6',
    atoms,
    bonds,
    quantumState: {
      coherence: 1.0,
      entanglement: [],
      phase: 0,
      lifetime: 100000, // 100 seconds in milliseconds
    },
    geometry: {
      type: 'icosahedral',
      vertices: caPositions,
      edges: bonds,
    },
  };
}

/**
 * Super Star Molecule — MAR10 / birthday quest special.
 * Same structure as Posner; use BIRTHDAY_QUEST_COLORS when rendering.
 * @see docs/MAR10_MOLECULE_QUEST.md
 */
export function generateSuperStarMolecule(id: string = 'super_star_mar10'): PosnerMolecule {
  const mol = generatePosnerMolecule(id);
  return {
    ...mol,
    name: 'Super Star Molecule',
    formula: 'Ca₉(PO₄)₆ · ✨',
    quantumState: {
      ...mol.quantumState,
      coherence: 1.0,
      lifetime: 120000, // Slightly longer "birthday glow"
    },
  };
}

/**
 * Generate positions in icosahedral arrangement
 */
function generateIcosahedralPositions(count: number, radius: number): THREE.Vector3[] {
  const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio

  // Icosahedron vertices
  const vertices = [
    new THREE.Vector3(0, 1, phi),
    new THREE.Vector3(0, 1, -phi),
    new THREE.Vector3(0, -1, phi),
    new THREE.Vector3(0, -1, -phi),
    new THREE.Vector3(1, phi, 0),
    new THREE.Vector3(1, -phi, 0),
    new THREE.Vector3(-1, phi, 0),
    new THREE.Vector3(-1, -phi, 0),
    new THREE.Vector3(phi, 0, 1),
    new THREE.Vector3(phi, 0, -1),
    new THREE.Vector3(-phi, 0, 1),
    new THREE.Vector3(-phi, 0, -1),
  ];

  // Normalize and scale
  vertices.forEach((v) => {
    v.normalize();
    v.multiplyScalar(radius);
  });

  // Return first 'count' positions
  return vertices.slice(0, count);
}

/**
 * Generate tetrahedral positions around a center
 */
function generateTetrahedralPositions(center: THREE.Vector3, distance: number): THREE.Vector3[] {
  const positions: THREE.Vector3[] = [];
  const angles = [
    [0, 0],
    [109.47, 0], // Tetrahedral angle
    [109.47, 120],
    [109.47, 240],
  ];

  angles.forEach(([theta, phi]) => {
    const radTheta = (theta * Math.PI) / 180;
    const radPhi = (phi * Math.PI) / 180;

    const x = distance * Math.sin(radTheta) * Math.cos(radPhi);
    const y = distance * Math.sin(radTheta) * Math.sin(radPhi);
    const z = distance * Math.cos(radTheta);

    positions.push(center.clone().add(new THREE.Vector3(x, y, z)));
  });

  return positions;
}

/**
 * Calculate quantum coherence decay
 */
export function calculateCoherenceDecay(
  initialCoherence: number,
  decoherenceRate: number,
  time: number
): number {
  return initialCoherence * Math.exp(-time / decoherenceRate);
}

/**
 * Check if two atoms can form a bond
 */
export function canFormBond(atom1: Atom, atom2: Atom): boolean {
  // Simple valence check
  const valences: Record<string, number> = {
    H: 1,
    O: 2,
    P: 3,
    P31: 3,
    Ca: 2,
  };

  const valence1 = valences[atom1.element] || 0;
  const valence2 = valences[atom2.element] || 0;

  return valence1 > 0 && valence2 > 0;
}

/**
 * Get element properties
 */
export function getElementProperties(element: string): ElementProperties {
  return (
    ELEMENT_PROPERTIES[element] || {
      atomicNumber: 0,
      symbol: element,
      name: element,
      color: '#CCCCCC',
      radius: 0.5,
      mass: 0,
      electronegativity: 0,
    }
  );
}

/**
 * Calculate bond length based on atom types
 */
export function calculateBondLength(atom1: Atom, atom2: Atom): number {
  const props1 = getElementProperties(atom1.element);
  const props2 = getElementProperties(atom2.element);

  // Simple covalent radius sum
  return (props1.radius + props2.radius) * 1.5;
}
