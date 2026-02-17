/**
 * Posner molecule geometry for 4D Quantum Playground
 * Ca₉(PO₄)₆ — S₆ symmetry, 9 calcium, 6 phosphate groups (each P + 4 O)
 * Based on Swift et al. 2018; coordinates approximate.
 */

export interface PosnerAtom {
  element: 'Ca' | 'P' | 'O';
  position: [number, number, number];
  index: number;
}

export interface PosnerBond {
  from: number;
  to: number;
  order?: number;
}

export function generatePosnerMolecule(): { atoms: PosnerAtom[]; bonds: PosnerBond[] } {
  const atoms: PosnerAtom[] = [];
  const bonds: PosnerBond[] = [];
  let idx = 0;

  // Calcium positions (9) – vertices of a trigonal antiprism
  const caPositions: [number, number, number][] = [
    [1.432, 0.827, 0.0],
    [-1.432, 0.827, 0.0],
    [0.0, -1.432, 0.827],
    [0.0, 1.432, -0.827],
    [0.827, 0.0, 1.432],
    [-0.827, 0.0, -1.432],
    [0.827, 0.0, -1.432],
    [-0.827, 0.0, 1.432],
    [0.0, -1.432, -0.827],
  ];
  caPositions.forEach((pos) => {
    atoms.push({ element: 'Ca', position: pos, index: idx++ });
  });

  // Phosphate groups (6) – each P with 4 O in tetrahedral arrangement
  const pPositions: [number, number, number][] = [
    [1.275, 0.736, 1.275],
    [-1.275, -0.736, -1.275],
    [0.736, 1.275, -1.275],
    [-0.736, -1.275, 1.275],
    [1.275, -0.736, -0.736],
    [-1.275, 0.736, 0.736],
  ];
  pPositions.forEach((pPos) => {
    const pIdx = atoms.length;
    atoms.push({ element: 'P', position: pPos, index: idx++ });
    const tetraDirs: [number, number, number][] = [
      [0.577, 0.577, 0.577],
      [0.577, -0.577, -0.577],
      [-0.577, 0.577, -0.577],
      [-0.577, -0.577, 0.577],
    ];
    tetraDirs.forEach((dir) => {
      const oPos: [number, number, number] = [
        pPos[0] + dir[0] * 0.5,
        pPos[1] + dir[1] * 0.5,
        pPos[2] + dir[2] * 0.5,
      ];
      const oIdx = atoms.length;
      atoms.push({ element: 'O', position: oPos, index: idx++ });
      bonds.push({ from: pIdx, to: oIdx, order: 1 });
    });
  });

  return { atoms, bonds };
}
