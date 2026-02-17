/**
 * useMoleculeBuilder Hook
 * React hook for managing molecule builder state
 */

import { useState, useCallback, useMemo } from 'react';
import { PosnerMolecule, Atom, Bond } from '../types/molecule';
import { generatePosnerMolecule } from '../utils/moleculeBuilder';

interface UseMoleculeBuilderReturn {
  molecule: PosnerMolecule | null;
  selectedAtom: Atom | null;
  selectedBond: Bond | null;
  setMolecule: (molecule: PosnerMolecule | null) => void;
  setSelectedAtom: (atom: Atom | null) => void;
  setSelectedBond: (bond: Bond | null) => void;
  createNewMolecule: () => void;
  addAtom: (atom: Atom) => void;
  removeAtom: (atomId: string) => void;
  addBond: (bond: Bond) => void;
  removeBond: (bondId: string) => void;
  updateQuantumCoherence: (atomId: string, coherence: number) => void;
}

export function useMoleculeBuilder(initialMolecule?: PosnerMolecule): UseMoleculeBuilderReturn {
  const [molecule, setMolecule] = useState<PosnerMolecule | null>(initialMolecule || null);
  const [selectedAtom, setSelectedAtom] = useState<Atom | null>(null);
  const [selectedBond, setSelectedBond] = useState<Bond | null>(null);

  const createNewMolecule = useCallback(() => {
    const newMolecule = generatePosnerMolecule(`posner_${Date.now()}`);
    setMolecule(newMolecule);
    setSelectedAtom(null);
    setSelectedBond(null);
  }, []);

  const addAtom = useCallback(
    (atom: Atom) => {
      if (!molecule) return;
      setMolecule({
        ...molecule,
        atoms: [...molecule.atoms, atom],
      });
    },
    [molecule]
  );

  const removeAtom = useCallback(
    (atomId: string) => {
      if (!molecule) return;
      setMolecule({
        ...molecule,
        atoms: molecule.atoms.filter((a) => a.id !== atomId),
        bonds: molecule.bonds.filter((b) => b.atom1Id !== atomId && b.atom2Id !== atomId),
      });
      if (selectedAtom?.id === atomId) {
        setSelectedAtom(null);
      }
    },
    [molecule, selectedAtom]
  );

  const addBond = useCallback(
    (bond: Bond) => {
      if (!molecule) return;
      setMolecule({
        ...molecule,
        bonds: [...molecule.bonds, bond],
      });
    },
    [molecule]
  );

  const removeBond = useCallback(
    (bondId: string) => {
      if (!molecule) return;
      setMolecule({
        ...molecule,
        bonds: molecule.bonds.filter((b) => b.id !== bondId),
      });
      if (selectedBond?.id === bondId) {
        setSelectedBond(null);
      }
    },
    [molecule, selectedBond]
  );

  const updateQuantumCoherence = useCallback(
    (atomId: string, coherence: number) => {
      if (!molecule) return;
      setMolecule({
        ...molecule,
        atoms: molecule.atoms.map((atom) =>
          atom.id === atomId ? { ...atom, coherence: Math.max(0, Math.min(1, coherence)) } : atom
        ),
        quantumState: {
          ...molecule.quantumState,
          coherence:
            molecule.atoms.reduce((sum, atom) => {
              const atomCoherence = atom.id === atomId ? coherence : atom.coherence || 0;
              return sum + atomCoherence;
            }, 0) / molecule.atoms.length,
        },
      });
    },
    [molecule]
  );

  return {
    molecule,
    selectedAtom,
    selectedBond,
    setMolecule,
    setSelectedAtom,
    setSelectedBond,
    createNewMolecule,
    addAtom,
    removeAtom,
    addBond,
    removeBond,
    updateQuantumCoherence,
  };
}
