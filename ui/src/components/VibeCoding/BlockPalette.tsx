/**
 * Block Palette — Kid-friendly block sources for drag-and-drop
 * Large, colorful, touch-friendly. Used in Kid Blocks mode.
 */

import React from 'react';
import {
  KID_BLOCK_KINDS,
  KID_BLOCK_LABELS,
  createBlock,
  type KidBlockKind,
  type KidBlock,
} from '../../lib/vibeCodingBlocks';
import './KidBlocks.css';

const DATA_KIND = 'kid-block-kind';

export interface BlockPaletteProps {
  onAddBlock?: (block: KidBlock) => void;
  disabled?: boolean;
}

export const BlockPalette: React.FC<BlockPaletteProps> = ({ onAddBlock, disabled }) => {
  const handleDragStart = (e: React.DragEvent, kind: KidBlockKind) => {
    e.dataTransfer.setData(DATA_KIND, kind);
    e.dataTransfer.effectAllowed = 'copy';
    try {
      e.dataTransfer.setData('application/json', JSON.stringify(createBlock(kind)));
    } catch {
      // ignore
    }
  };

  const handleClick = (kind: KidBlockKind) => {
    if (disabled || !onAddBlock) return;
    onAddBlock(createBlock(kind));
  };

  return (
    <div className="kid-blocks-palette" role="toolbar" aria-label="Kid Blocks palette">
      <h3 className="kid-blocks-palette-title">Blocks</h3>
      <div className="kid-blocks-palette-grid">
        {KID_BLOCK_KINDS.map((kind) => {
          const { label, emoji } = KID_BLOCK_LABELS[kind];
          return (
            <button
              key={kind}
              type="button"
              className={`kid-block-palette-item kid-block-palette-item--${kind.replace('_', '-')}`}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, kind)}
              onClick={() => handleClick(kind)}
              disabled={disabled}
              aria-label={`Add ${label}`}
              title={`Drag here or click to add: ${label}`}
            >
              <span className="kid-block-emoji" aria-hidden>{emoji}</span>
              <span className="kid-block-label">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BlockPalette;
