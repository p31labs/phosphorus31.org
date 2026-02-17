import React from 'react';

const pieceLabels = { tetrahedron: '△ Tetra', octahedron: '◇ Octa', icosahedron: '⬡ Icosa', strut: '| Strut', hub: '● Hub' };
const materialLabels = { wood: 'W', metal: 'M', crystal: 'C', quantum: 'Q' };

const BuildToolbar = ({ gameState, onSave, onTest }) => {
  const {
    selectedType, setSelectedType, selectedMaterial, setSelectedMaterial,
    scale, setScale, gridVisible, setGridVisible, snapEnabled, setSnapEnabled,
    magneticSnapEnabled, setMagneticSnapEnabled,
    undo, redo, canUndo, canRedo, mode, setMode,
    PIECE_TYPES, MATERIALS, MATERIAL_COLORS,
  } = gameState;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-card/90 backdrop-blur-lg rounded-xl border border-border px-4 py-3 shadow-lg">
      {/* Piece Types */}
      <div className="flex space-x-1">
        {PIECE_TYPES.map((t, i) => (
          <button
            key={t}
            onClick={() => setSelectedType(t)}
            className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${selectedType === t ? 'bg-primary text-white' : 'bg-surface text-muted hover:text-main'}`}
            title={`${t} (${i + 1})`}
          >
            {pieceLabels[t]}
          </button>
        ))}
      </div>

      <div className="w-px h-8 bg-border" />

      {/* Materials */}
      <div className="flex space-x-1">
        {MATERIALS.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMaterial(m)}
            className={`w-7 h-7 rounded-md text-xs font-bold border-2 transition-colors ${selectedMaterial === m ? 'border-white' : 'border-transparent'}`}
            style={{ backgroundColor: MATERIAL_COLORS[m] }}
            title={m}
          >
            {materialLabels[m]}
          </button>
        ))}
      </div>

      <div className="w-px h-8 bg-border" />

      {/* Scale */}
      <div className="flex items-center space-x-1">
        <button onClick={() => setScale(Math.max(0.5, scale - 0.25))} className="px-2 py-1 text-sm bg-surface text-muted rounded hover:text-main">-</button>
        <span className="text-xs text-muted w-8 text-center">{scale}x</span>
        <button onClick={() => setScale(Math.min(3, scale + 0.25))} className="px-2 py-1 text-sm bg-surface text-muted rounded hover:text-main">+</button>
      </div>

      <div className="w-px h-8 bg-border" />

      {/* Toggles */}
      <button onClick={() => setGridVisible(!gridVisible)} className={`px-2 py-1.5 text-xs rounded-md ${gridVisible ? 'bg-primary/20 text-primary' : 'bg-surface text-muted'}`} title="Grid (G)">Grid</button>
      <button onClick={() => setSnapEnabled(!snapEnabled)} className={`px-2 py-1.5 text-xs rounded-md ${snapEnabled ? 'bg-primary/20 text-primary' : 'bg-surface text-muted'}`} title="Grid Snap (V)">Grid</button>
      <button onClick={() => setMagneticSnapEnabled(!magneticSnapEnabled)} className={`px-2 py-1.5 text-xs rounded-md ${magneticSnapEnabled ? 'bg-primary/20 text-primary' : 'bg-surface text-muted'}`} title="Magnetic Snap (B)">Mag</button>

      <div className="w-px h-8 bg-border" />

      {/* Undo/Redo */}
      <button onClick={undo} disabled={!canUndo} className="px-2 py-1.5 text-xs bg-surface text-muted rounded-md disabled:opacity-30" title="Undo (Z)">↩</button>
      <button onClick={redo} disabled={!canRedo} className="px-2 py-1.5 text-xs bg-surface text-muted rounded-md disabled:opacity-30" title="Redo (Y)">↪</button>

      <div className="w-px h-8 bg-border" />

      {/* Actions */}
      <button onClick={onTest} className="px-3 py-1.5 text-xs font-medium bg-amber-500/20 text-amber-400 rounded-md hover:bg-amber-500/30" title="Test (T)">Test</button>
      <button onClick={onSave} className="px-3 py-1.5 text-xs font-medium bg-green-500/20 text-green-400 rounded-md hover:bg-green-500/30">Save</button>
    </div>
  );
};

export default BuildToolbar;
