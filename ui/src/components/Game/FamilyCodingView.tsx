/**
 * Family Coding View
 * Visual coding interface for families
 * Code together, generate 3D models, slice, and print
 */

import { useState } from 'react';
import { useGameEngineContext } from './GameEngineProvider';
import { Code, Play, Printer, Settings, Layers } from 'lucide-react';
import { compileP31 } from '../../lib/p31-compiler';

export interface FamilyCodingViewProps {
  /** When provided, "Use in World" sends current structure vertices/edges to World Builder */
  onUpdate?: (vertices: number[], edges: number[]) => void;
}

export const FamilyCodingView: React.FC<FamilyCodingViewProps> = ({ onUpdate }) => {
  const { engine } = useGameEngineContext();
  const [blocks, setBlocks] = useState<any[]>([]);
  const [generatedModel, setGeneratedModel] = useState<any>(null);
  const [slicedModel, setSlicedModel] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSlicing, setIsSlicing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [showSlicingConfig, setShowSlicingConfig] = useState(false);
  const [vibeMode, setVibeMode] = useState(false);

  // Get family coding mode from engine
  const familyCoding = engine?.getFamilyCodingMode?.();

  // Toggle Vibe Mode (Saturn → Aries) — reserved for future UI control
  const _toggleVibeMode = () => {
    if (familyCoding) {
      if (vibeMode) {
        familyCoding.disableVibeMode();
      } else {
        familyCoding.enableVibeMode();
      }
      setVibeMode(!vibeMode);
    }
  };
  void _toggleVibeMode;

  // Block types for visual coding (structure blocks: tetrahedron, sierpinski)
  const blockTypes = [
    { type: 'tetrahedron', label: 'Tetrahedron', color: '#2ecc71', icon: '🔺' },
    { type: 'sierpinski', label: 'Sierpinski', color: '#2ecc71', icon: '🔺' },
    { type: 'move', label: 'Move', color: '#4ECDC4', icon: '→' },
    { type: 'rotate', label: 'Rotate', color: '#FF6B6B', icon: '↻' },
    { type: 'scale', label: 'Scale', color: '#FFE66D', icon: '⇄' },
    { type: 'color', label: 'Color', color: '#95E1D3', icon: '🎨' },
    { type: 'repeat', label: 'Repeat', color: '#A8E6CF', icon: '🔁' },
    { type: 'condition', label: 'If', color: '#FFD93D', icon: '❓' },
  ];

  const handleAddBlock = (type: string) => {
    const parameters: Record<string, unknown> =
      type === 'sierpinski' ? { depth: 3 } : {};
    const newBlock = {
      id: crypto.randomUUID(),
      type,
      parameters,
      position: { x: Math.random() * 400, y: Math.random() * 300 },
    };
    setBlocks([...blocks, newBlock]);
  };

  const setBlockDepth = (blockId: string, depth: number) => {
    setBlocks((prev) =>
      prev.map((b) =>
        b.id === blockId
          ? { ...b, parameters: { ...b.parameters, depth: Math.max(0, Math.min(7, depth)) } }
          : b
      )
    );
  };

  const handleGenerate = async () => {
    if (!familyCoding) return;

    setIsGenerating(true);
    try {
      const model = await familyCoding.generateModel();
      setGeneratedModel(model);
      console.log('✅ Model generated:', model);
    } catch (error) {
      console.error('Error generating model:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSlice = async () => {
    if (!familyCoding || !generatedModel) return;

    setIsSlicing(true);
    try {
      const sliced = await familyCoding.sliceModel();
      setSlicedModel(sliced);
      console.log('✅ Model sliced:', sliced);
    } catch (error) {
      console.error('Error slicing model:', error);
    } finally {
      setIsSlicing(false);
    }
  };

  const handlePrint = async () => {
    if (!familyCoding || !slicedModel) return;

    setIsPrinting(true);
    try {
      await familyCoding.sendToPrinter();
      console.log('✅ Sent to printer');
    } catch (error) {
      console.error('Error sending to printer:', error);
    } finally {
      setIsPrinting(false);
    }
  };

  const handleUseInWorld = () => {
    if (!onUpdate) return;
    const sierpinskiBlock = blocks.find((b) => b.type === 'sierpinski');
    const tetrahedronBlock = blocks.find((b) => b.type === 'tetrahedron');
    const code =
      sierpinskiBlock != null
        ? `sierpinski ${(sierpinskiBlock.parameters?.depth as number) ?? 3}`
        : tetrahedronBlock != null
          ? 'structure tetrahedron'
          : 'structure tetrahedron';
    const compiled = compileP31(code);
    onUpdate(compiled.vertices, compiled.edges);
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white p-6 rounded-lg shadow-xl border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Code className="h-8 w-8 text-blue-400" />
          <div>
            <h2 className="text-2xl font-bold">Family Coding Mode</h2>
            <p className="text-gray-400 text-sm">Code together. Build together. Print together.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSlicingConfig(!showSlicingConfig)}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Slicing</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Block Palette */}
        <div className="bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Code Blocks</h3>
          <div className="space-y-2">
            {blockTypes.map((block) => (
              <button
                key={block.type}
                onClick={() => handleAddBlock(block.type)}
                className="w-full p-3 rounded-lg text-left hover:bg-gray-700 transition-colors flex items-center space-x-2"
                style={{ borderLeft: `4px solid ${block.color}` }}
              >
                <span className="text-xl">{block.icon}</span>
                <span>{block.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Code Canvas */}
        <div className="bg-gray-800 p-4 rounded-lg relative min-h-[400px]">
          <h3 className="text-lg font-semibold mb-4">Code Canvas</h3>
          <div className="relative w-full h-full">
            {blocks.length === 0 ? (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Code className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Add blocks to start coding</p>
                </div>
              </div>
            ) : (
              blocks.map((block) => (
                <div
                  key={block.id}
                  className="absolute p-3 bg-gray-700 rounded-lg cursor-move min-w-[140px]"
                  style={{
                    left: block.position.x,
                    top: block.position.y,
                    borderLeft: `4px solid ${blockTypes.find((b) => b.type === block.type)?.color || '#666'}`,
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <span>{blockTypes.find((b) => b.type === block.type)?.icon}</span>
                    <span>{blockTypes.find((b) => b.type === block.type)?.label}</span>
                  </div>
                  {block.type === 'sierpinski' && (
                    <div className="mt-2 flex items-center gap-2">
                      <label htmlFor={`depth-${block.id}`} className="text-xs text-gray-400">
                        depth:
                      </label>
                      <input
                        id={`depth-${block.id}`}
                        type="number"
                        min={0}
                        max={7}
                        value={(block.parameters?.depth as number) ?? 3}
                        onChange={(e) =>
                          setBlockDepth(block.id, parseInt(e.target.value, 10) || 0)
                        }
                        className="w-14 px-1 py-0.5 bg-gray-600 rounded text-sm text-white"
                        aria-label="Sierpinski recursion depth"
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Actions & Preview */}
        <div className="space-y-4">
          {/* Actions */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={handleGenerate}
                disabled={blocks.length === 0 || isGenerating}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Play className="h-4 w-4" />
                <span>{isGenerating ? 'Generating...' : 'Generate Model'}</span>
              </button>

              <button
                onClick={handleSlice}
                disabled={!generatedModel || isSlicing}
                className="w-full px-4 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Layers className="h-4 w-4" />
                <span>{isSlicing ? 'Slicing...' : 'Slice Model'}</span>
              </button>

              <button
                onClick={handlePrint}
                disabled={!slicedModel || isPrinting}
                className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg flex items-center justify-center space-x-2 transition-colors"
              >
                <Printer className="h-4 w-4" />
                <span>{isPrinting ? 'Printing...' : 'Send to Printer'}</span>
              </button>

              {onUpdate && (
                <button
                  onClick={handleUseInWorld}
                  className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <span>🌍</span>
                  <span>Use in World Builder</span>
                </button>
              )}
            </div>
          </div>

          {/* Status */}
          <div className="bg-gray-800 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Blocks:</span>
                <span className="text-white">{blocks.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Model:</span>
                <span className={generatedModel ? 'text-green-400' : 'text-gray-500'}>
                  {generatedModel ? '✅ Generated' : '⏳ Not generated'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sliced:</span>
                <span className={slicedModel ? 'text-green-400' : 'text-gray-500'}>
                  {slicedModel ? '✅ Sliced' : '⏳ Not sliced'}
                </span>
              </div>
              {slicedModel && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Print Time:</span>
                    <span className="text-white">
                      {slicedModel.estimatedTime?.toFixed(1) || 'N/A'} min
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Material:</span>
                    <span className="text-white">
                      {slicedModel.materialUsed?.toFixed(1) || 'N/A'} g
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slicing Config Panel */}
      {showSlicingConfig && (
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Slicing Configuration</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="layer-height" className="block text-sm text-gray-400 mb-1">
                Layer Height (mm)
              </label>
              <input
                id="layer-height"
                type="number"
                step="0.1"
                defaultValue="0.2"
                className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                aria-label="Layer height in millimeters"
              />
            </div>
            <div>
              <label htmlFor="infill" className="block text-sm text-gray-400 mb-1">
                Infill (%)
              </label>
              <input
                id="infill"
                type="number"
                step="5"
                defaultValue="20"
                className="w-full px-3 py-2 bg-gray-700 rounded-lg"
                aria-label="Infill percentage"
              />
            </div>
            <div>
              <label htmlFor="print-speed" className="block text-sm text-gray-400 mb-1">
                Print Speed (mm/s)
              </label>
              <input
                id="print-speed"
                type="number"
                step="10"
                defaultValue="50"
                className="w-full px-3 py-2 bg-gray-700 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Temperature (°C)</label>
              <input
                type="number"
                step="5"
                defaultValue="200"
                className="w-full px-3 py-2 bg-gray-700 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
