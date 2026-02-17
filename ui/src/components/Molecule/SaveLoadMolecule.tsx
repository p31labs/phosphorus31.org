/**
 * Save/Load Molecule
 * Save and load molecule structures
 */

import React, { useState } from 'react';
import { PosnerMolecule } from '../../types/molecule';
import { SimpleButton } from '../Accessibility/SimpleButton';

interface SaveLoadMoleculeProps {
  molecule: PosnerMolecule | null;
  onLoad: (molecule: PosnerMolecule) => void;
}

export const SaveLoadMolecule: React.FC<SaveLoadMoleculeProps> = ({ molecule, onLoad }) => {
  const [savedMolecules, setSavedMolecules] = useState<PosnerMolecule[]>([]);

  const saveMolecule = () => {
    if (!molecule) return;

    const saved = [...savedMolecules, molecule];
    setSavedMolecules(saved);
    localStorage.setItem('p31_saved_molecules', JSON.stringify(saved));

    // Announce success
    if ((window as any).accessibilityAnnounce) {
      (window as any).accessibilityAnnounce('Molecule saved successfully', 'polite');
    }
  };

  const loadMolecule = (molecule: PosnerMolecule) => {
    onLoad(molecule);

    // Announce load
    if ((window as any).accessibilityAnnounce) {
      (window as any).accessibilityAnnounce(`Loaded ${molecule.name}`, 'polite');
    }
  };

  const deleteMolecule = (id: string) => {
    const filtered = savedMolecules.filter((m) => m.id !== id);
    setSavedMolecules(filtered);
    localStorage.setItem('p31_saved_molecules', JSON.stringify(filtered));
  };

  React.useEffect(() => {
    // Load saved molecules from localStorage
    const saved = localStorage.getItem('p31_saved_molecules');
    if (saved) {
      try {
        setSavedMolecules(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved molecules:', e);
      }
    }
  }, []);

  return (
    <div className="save-load-molecule">
      <div className="save-section">
        <SimpleButton
          label="💾 Save Molecule"
          onClick={saveMolecule}
          variant="primary"
          size="small"
          disabled={!molecule}
        />
      </div>

      {savedMolecules.length > 0 && (
        <div className="saved-molecules">
          <h4>Saved Molecules</h4>
          <div className="molecule-list">
            {savedMolecules.map((mol) => (
              <div key={mol.id} className="molecule-item">
                <div className="molecule-info">
                  <div className="molecule-name">{mol.name}</div>
                  <div className="molecule-formula">{mol.formula}</div>
                </div>
                <div className="molecule-actions">
                  <button onClick={() => loadMolecule(mol)} className="action-button load">
                    Load
                  </button>
                  <button onClick={() => deleteMolecule(mol.id)} className="action-button delete">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        .save-load-molecule {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .saved-molecules h4 {
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .molecule-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .molecule-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .molecule-name {
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .molecule-formula {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.6);
          font-family: monospace;
        }

        .molecule-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-button {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 600;
          transition: all 0.2s;
        }

        .action-button.load {
          background: #00FFFF;
          color: #000;
        }

        .action-button.load:hover {
          background: #00CCCC;
        }

        .action-button.delete {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
          border: 1px solid #ef4444;
        }

        .action-button.delete:hover {
          background: rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  );
};
