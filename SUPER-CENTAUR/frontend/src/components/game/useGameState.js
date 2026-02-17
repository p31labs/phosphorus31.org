import { useState, useCallback, useRef } from 'react';
import { findConnectionTargets, calculateSnapPosition, createConnection } from './ConnectionSystem';

const PIECE_TYPES = ['tetrahedron', 'octahedron', 'icosahedron', 'strut', 'hub'];
const MATERIALS = ['wood', 'metal', 'crystal', 'quantum'];
const MATERIAL_COLORS = { wood: '#8B4513', metal: '#C0C0C0', crystal: '#00FFFF', quantum: '#FF00FF' };

const GEOMETRY_VERTICES = { tetrahedron: 4, octahedron: 6, icosahedron: 12, strut: 2, hub: 1 };
const GEOMETRY_EDGES = { tetrahedron: 6, octahedron: 12, icosahedron: 30, strut: 1, hub: 0 };

export default function useGameState() {
  const [primitives, setPrimitives] = useState([]);
  const [selectedType, setSelectedType] = useState('tetrahedron');
  const [selectedMaterial, setSelectedMaterial] = useState('wood');
  const [scale, setScale] = useState(1);
  const [gridVisible, setGridVisible] = useState(true);
  const [snapEnabled, setSnapEnabled] = useState(true);
  const [magneticSnapEnabled, setMagneticSnapEnabled] = useState(true); // NEW: Magnetic snapping to existing pieces
  const [mode, setMode] = useState('build'); // build | test | view
  const undoRef = useRef([]);
  const redoRef = useRef([]);

  const snap = (val) => (snapEnabled ? Math.round(val) : val);

  const placePiece = useCallback((position, forcePosition = null) => {
    // If magnetic snapping is enabled and there are existing pieces, try to snap
    let finalPosition = position;
    let connections = {};
    
    if (magneticSnapEnabled && primitives.length > 0) {
      // Create a temporary piece to test connections
      const tempPiece = {
        id: 'temp',
        type: selectedType,
        position: { x: position[0], y: position[1], z: position[2] },
        rotation: { x: 0, y: 0, z: 0 },
        scale,
        color: MATERIAL_COLORS[selectedMaterial],
        material: selectedMaterial,
        connectedTo: [],
      };
      
      // Find connection targets
      const targets = findConnectionTargets(tempPiece, primitives, 2.0);
      
      if (targets.length > 0) {
        // Snap to the closest target
        const closestTarget = targets[0];
        const snapPos = calculateSnapPosition(tempPiece, closestTarget.piece, closestTarget.connection);
        
        if (snapPos) {
          finalPosition = [snapPos.x, snapPos.y, snapPos.z];
          connections = createConnection('temp', closestTarget.piece.id, {});
        }
      }
    }
    
    // Apply regular grid snapping if enabled
    if (snapEnabled) {
      finalPosition = finalPosition.map(snap);
    }
    
    const newPiece = {
      id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      type: selectedType,
      position: { x: finalPosition[0], y: finalPosition[1], z: finalPosition[2] },
      rotation: { x: 0, y: 0, z: 0 },
      scale,
      color: MATERIAL_COLORS[selectedMaterial],
      material: selectedMaterial,
      connectedTo: connections['temp'] || [],
    };
    
    // Update connections for the target piece
    if (newPiece.connectedTo.length > 0) {
      setPrimitives((prev) => {
        const updated = prev.map(p => {
          if (newPiece.connectedTo.includes(p.id)) {
            return {
              ...p,
              connectedTo: [...p.connectedTo, newPiece.id]
            };
          }
          return p;
        });
        return [...updated, newPiece];
      });
    } else {
      undoRef.current.push([...primitives]);
      redoRef.current = [];
      setPrimitives((prev) => [...prev, newPiece]);
    }
    
    return newPiece;
  }, [selectedType, selectedMaterial, scale, snapEnabled, magneticSnapEnabled, primitives]);

  const removePiece = useCallback((id) => {
    undoRef.current.push([...primitives]);
    redoRef.current = [];
    setPrimitives((prev) => prev.filter((p) => p.id !== id));
  }, [primitives]);

  const undo = useCallback(() => {
    if (undoRef.current.length === 0) return;
    redoRef.current.push([...primitives]);
    setPrimitives(undoRef.current.pop());
  }, [primitives]);

  const redo = useCallback(() => {
    if (redoRef.current.length === 0) return;
    undoRef.current.push([...primitives]);
    setPrimitives(redoRef.current.pop());
  }, [primitives]);

  // Compute totals for Maxwell validation
  const vertices = primitives.reduce((sum, p) => sum + (GEOMETRY_VERTICES[p.type] || 0), 0);
  const edges = primitives.reduce((sum, p) => sum + (GEOMETRY_EDGES[p.type] || 0), 0);
  const denominator = Math.max(1, 3 * vertices - 6);
  const maxwellRatio = edges / denominator;
  const isRigid = maxwellRatio >= 1.0;
  const stabilityScore = Math.min(100, Math.round(maxwellRatio * 100));

  return {
    primitives,
    setPrimitives,
    selectedType,
    setSelectedType,
    selectedMaterial,
    setSelectedMaterial,
    scale,
    setScale,
    gridVisible,
    setGridVisible,
    snapEnabled,
    setSnapEnabled,
    mode,
    setMode,
    placePiece,
    removePiece,
    undo,
    redo,
    canUndo: undoRef.current.length > 0,
    canRedo: redoRef.current.length > 0,
    vertices,
    edges,
    maxwellRatio,
    isRigid,
    stabilityScore,
    PIECE_TYPES,
    MATERIALS,
    MATERIAL_COLORS,
    magneticSnapEnabled,
    setMagneticSnapEnabled,
  };
}
