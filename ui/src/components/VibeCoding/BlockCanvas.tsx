/**
 * Block Canvas — Drop zone and ordered sequence of kid blocks
 * Drag blocks from palette or click to add. Run builds the molecule from generated code.
 */

import React, { useState, useCallback } from 'react';
import {
  KidBlock,
  KidBlockKind,
  KID_BLOCK_LABELS,
  createBlock,
  blocksToCode,
} from '../../lib/vibeCodingBlocks';
import './KidBlocks.css';

const DATA_KIND = 'kid-block-kind';
const DATA_BLOCK = 'application/json';

export interface BlockCanvasProps {
  blocks: KidBlock[];
  onBlocksChange: (blocks: KidBlock[]) => void;
  onRun?: () => void;
  isRunning?: boolean;
  showGeneratedCode?: boolean;
  onShowCodeChange?: (show: boolean) => void;
  disabled?: boolean;
}

function parseDroppedBlock(dataKind: string, dataJson: string): KidBlock | null {
  const kind = dataKind as KidBlockKind;
  if (!kind) return null;
  try {
    const parsed = JSON.parse(dataJson) as KidBlock;
    if (parsed.id && parsed.kind) return parsed;
    return createBlock(kind);
  } catch {
    return createBlock(kind);
  }
}

export const BlockCanvas: React.FC<BlockCanvasProps> = ({
  blocks,
  onBlocksChange,
  onRun,
  isRunning = false,
  showGeneratedCode = false,
  onShowCodeChange,
  disabled,
}) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      setDragOver(true);
    },
    []
  );

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const kind = e.dataTransfer.getData(DATA_KIND) as KidBlockKind;
      const json = e.dataTransfer.getData(DATA_BLOCK);
      const block = parseDroppedBlock(kind, json);
      if (block) onBlocksChange([...blocks, block]);
    },
    [blocks, disabled, onBlocksChange]
  );

  const removeBlock = useCallback(
    (id: string) => {
      if (disabled) return;
      const remove = (list: KidBlock[]): KidBlock[] =>
        list
          .filter((b) => b.id !== id)
          .map((b) =>
            b.kind === 'repeat' && b.inner
              ? { ...b, inner: remove(b.inner) }
              : b
          );
      onBlocksChange(remove(blocks));
    },
    [blocks, disabled, onBlocksChange]
  );

  const updateRepeatTimes = useCallback(
    (blockId: string, times: number) => {
      if (disabled) return;
      const next = Math.max(1, Math.min(20, times));
      onBlocksChange(
        blocks.map((b) =>
          b.id === blockId
            ? { ...b, params: { ...b.params, times: next } }
            : b
        )
      );
    },
    [blocks, disabled, onBlocksChange]
  );

  const addInnerBlock = useCallback(
    (repeatBlockId: string, block: KidBlock) => {
      if (disabled) return;
      onBlocksChange(
        blocks.map((b) =>
          b.id === repeatBlockId && b.kind === 'repeat'
            ? { ...b, inner: [...(b.inner ?? []), block] }
            : b
        )
      );
    },
    [blocks, disabled, onBlocksChange]
  );

  const removeInnerBlock = useCallback(
    (repeatBlockId: string, innerId: string) => {
      if (disabled) return;
      onBlocksChange(
        blocks.map((b) =>
          b.id === repeatBlockId && b.kind === 'repeat'
            ? { ...b, inner: (b.inner ?? []).filter((x) => x.id !== innerId) }
            : b
        )
      );
    },
    [blocks, disabled, onBlocksChange]
  );

  const generatedCode = blocksToCode(blocks);

  return (
    <div className="kid-blocks-canvas-wrap">
      <div
        className={`kid-blocks-canvas ${dragOver ? 'kid-blocks-canvas-dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="region"
        aria-label="Block sequence canvas"
      >
        <div className="kid-blocks-canvas-inner">
          {blocks.length === 0 ? (
            <div className="kid-blocks-canvas-empty" aria-hidden>
              <span className="kid-blocks-canvas-empty-emoji">🧩</span>
              <p>Drag blocks here or click blocks in the palette</p>
            </div>
          ) : (
            <ul className="kid-blocks-sequence" role="list">
              {blocks.map((block) => (
                <BlockItem
                  key={block.id}
                  block={block}
                  onRemove={() => removeBlock(block.id)}
                  onUpdateRepeatTimes={(times) => updateRepeatTimes(block.id, times)}
                  onAddInner={(b) => addInnerBlock(block.id, b)}
                  onRemoveInner={(id) => removeInnerBlock(block.id, id)}
                  disabled={disabled}
                />
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="kid-blocks-actions">
        {onShowCodeChange && (
          <label className="kid-blocks-toggle-code">
            <input
              type="checkbox"
              checked={showGeneratedCode}
              onChange={(e) => onShowCodeChange(e.target.checked)}
              aria-label="Show generated code"
            />
            <span>Show code</span>
          </label>
        )}
        {onRun && (
          <button
            type="button"
            className="kid-blocks-run"
            onClick={onRun}
            disabled={blocks.length === 0 || isRunning || disabled}
            aria-label="Run blocks and build molecule"
          >
            {isRunning ? '⏳ Running...' : '▶️ Run'}
          </button>
        )}
      </div>

      {showGeneratedCode && generatedCode && (
        <pre className="kid-blocks-generated-code" aria-label="Generated JavaScript">
          {generatedCode}
        </pre>
      )}
    </div>
  );
};

interface BlockItemProps {
  block: KidBlock;
  onRemove: () => void;
  onUpdateRepeatTimes?: (times: number) => void;
  onAddInner?: (block: KidBlock) => void;
  onRemoveInner?: (id: string) => void;
  disabled?: boolean;
}

function BlockItem({
  block,
  onRemove,
  onUpdateRepeatTimes,
  onAddInner,
  onRemoveInner,
  disabled,
}: BlockItemProps) {
  const { label, emoji } = KID_BLOCK_LABELS[block.kind];
  const times = block.kind === 'repeat' ? Number(block.params?.times ?? 3) : 0;

  return (
    <li className={`kid-block-item kid-block-item--${block.kind.replace('_', '-')}`}>
      <div className="kid-block-item-main">
        <span className="kid-block-emoji" aria-hidden>{emoji}</span>
        <span className="kid-block-label">{label}</span>
        {block.kind === 'repeat' && onUpdateRepeatTimes && (
          <span className="kid-block-repeat-controls">
            <label>
              <span className="visually-hidden">Repeat times</span>
              <input
                type="number"
                min={1}
                max={20}
                value={times}
                onChange={(e) => onUpdateRepeatTimes(parseInt(e.target.value, 10) || 1)}
                className="kid-block-repeat-input"
                disabled={disabled}
              />
            </label>
            <span> times</span>
          </span>
        )}
        {!disabled && (
          <button
            type="button"
            className="kid-block-remove"
            onClick={onRemove}
            aria-label={`Remove ${label}`}
          >
            ×
          </button>
        )}
      </div>
      {block.kind === 'repeat' && (
        <RepeatInner
          repeatBlockId={block.id}
          inner={block.inner ?? []}
          onAddInner={onAddInner}
          onRemoveInner={onRemoveInner}
          disabled={disabled}
        />
      )}
    </li>
  );
}

/** Inner list + drop zone for repeat blocks */
function RepeatInner({
  repeatBlockId,
  inner,
  onAddInner,
  onRemoveInner,
  disabled,
}: {
  repeatBlockId: string;
  inner: KidBlock[];
  onAddInner?: (block: KidBlock) => void;
  onRemoveInner?: (id: string) => void;
  disabled?: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);
      if (disabled || !onAddInner) return;
      const kind = e.dataTransfer.getData(DATA_KIND) as KidBlockKind;
      const json = e.dataTransfer.getData(DATA_BLOCK);
      const block = parseDroppedBlock(kind, json);
      if (block) onAddInner(block);
    },
    [disabled, onAddInner]
  );
  return (
    <div
      className="kid-block-repeat-inner"
      onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
    >
      {inner.length === 0 ? (
        <div className={`kid-block-repeat-empty ${dragOver ? 'kid-blocks-canvas-dragover' : ''}`}>
          Drag blocks here to repeat
        </div>
      ) : (
        <ul className="kid-blocks-sequence kid-block-inner-list" role="list">
          {inner.map((innerBlock) => (
            <li key={innerBlock.id} className="kid-block-inner-item">
              <span className="kid-block-emoji">{KID_BLOCK_LABELS[innerBlock.kind].emoji}</span>
              <span>{KID_BLOCK_LABELS[innerBlock.kind].label}</span>
              {onRemoveInner && !disabled && (
                <button
                  type="button"
                  className="kid-block-remove"
                  onClick={() => onRemoveInner(innerBlock.id)}
                  aria-label={`Remove ${KID_BLOCK_LABELS[innerBlock.kind].label}`}
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BlockCanvas;
