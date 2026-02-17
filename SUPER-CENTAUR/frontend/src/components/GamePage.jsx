import React, { useState, useEffect, useCallback, Component } from 'react';
import { CubeTransparentIcon } from '@heroicons/react/24/outline';
import api from '../lib/api';
import BuildScene from './game/BuildScene';
import BuildToolbar from './game/BuildToolbar';
import GameHUD from './game/GameHUD';
import ChallengePanel from './game/ChallengePanel';
import useGameState from './game/useGameState';
import Toaster from './ui/Toaster';


const MEMBER_ID = 'sj';

class CanvasErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/90 text-center p-8">
          <CubeTransparentIcon className="w-16 h-16 text-muted mb-4" />
          <h3 className="text-xl font-semibold mb-2">3D Engine Paused</h3>
          <p className="text-muted mb-4">WebGL context was lost. This can happen with GPU resource limits.</p>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg"
            onClick={() => this.setState({ hasError: false })}
          >
            Reload Scene
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const GamePage = () => {
  const gameState = useGameState();
  const [progress, setProgress] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([
          api.get(`/api/game/progress/${MEMBER_ID}`),
          api.get('/api/game/challenges'),
        ]);
        setProgress(pRes.data);
        setChallenges(cRes.data);
        if (cRes.data.length > 0) setCurrentChallenge(cRes.data[0]);
      } catch {
        // Toast auto-fires
      }
    };
    loadData();
  }, []);

  // Toast management
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const key = e.key.toLowerCase();
      const types = gameState.PIECE_TYPES;
      const mats = gameState.MATERIALS;

      if (key >= '1' && key <= '5') {
        const idx = parseInt(key) - 1;
        if (types[idx]) gameState.setSelectedType(types[idx]);
      } else if (key === 'w') gameState.setSelectedMaterial('wood');
      else if (key === 'm') gameState.setSelectedMaterial('metal');
      else if (key === 'c') gameState.setSelectedMaterial('crystal');
      else if (key === 'q') gameState.setSelectedMaterial('quantum');
      else if (key === 'g') gameState.setGridVisible(!gameState.gridVisible);
      else if (key === 'v') gameState.setSnapEnabled(!gameState.snapEnabled);
      else if (key === 'z' && !e.shiftKey) gameState.undo();
      else if (key === 'y' || (key === 'z' && e.shiftKey)) gameState.redo();
      else if (key === '=' || key === '+') gameState.setScale(Math.min(3, gameState.scale + 0.25));
      else if (key === '-') gameState.setScale(Math.max(0.5, gameState.scale - 0.25));
      else if (key === 't') handleTest();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [gameState]);

  const handleSave = useCallback(async () => {
    try {
      await api.post('/api/game/structures', {
        name: `Build ${new Date().toLocaleTimeString()}`,
        createdBy: MEMBER_ID,
        primitives: gameState.primitives,
        vertices: gameState.vertices,
        edges: gameState.edges,
        isRigid: gameState.isRigid,
        stabilityScore: gameState.stabilityScore,
      });
      addToast('Structure saved!', 'success');
    } catch {
      addToast('Failed to save structure', 'error');
    }
  }, [gameState.primitives, gameState.vertices, gameState.edges, gameState.isRigid, gameState.stabilityScore, addToast]);

  const handleTest = useCallback(async () => {
    try {
      const res = await api.post('/api/game/validate', {
        primitives: gameState.primitives,
        vertices: gameState.vertices,
        edges: gameState.edges,
      });
      const v = res.data;
      if (v.isValid && v.warnings.length === 0) {
        addToast(`Stable! Maxwell: ${v.maxwellRatio}, Score: ${v.stabilityScore}%`, 'success');
      } else if (v.isValid) {
        addToast(v.warnings[0], 'warning');
      } else {
        addToast(v.errors[0] || 'Validation failed', 'error');
      }
    } catch {
      addToast('Failed to validate structure', 'error');
    }
  }, [gameState.primitives, gameState.vertices, gameState.edges, addToast]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Constructor&apos;s Challenge</h1>
          <p className="text-muted mt-1">Build, test, learn &mdash; Buckminster Fuller&apos;s way</p>
        </div>
        <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
          <CubeTransparentIcon className="w-7 h-7 text-white" aria-hidden="true" />
        </div>
      </div>

      {/* 3D Canvas Area */}
      <div className="relative w-full rounded-xl overflow-hidden border border-border" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        <CanvasErrorBoundary>
          <BuildScene gameState={gameState} />

        </CanvasErrorBoundary>
        <GameHUD progress={progress} gameState={gameState} />
        <ChallengePanel
          challenges={challenges}
          currentChallenge={currentChallenge}
          onSelect={setCurrentChallenge}
        />
        <BuildToolbar gameState={gameState} onSave={handleSave} onTest={handleTest} />

        {/* Help hint */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-xs text-muted/50">
          Click plate to place &middot; Shift+click piece to remove &middot; 1-5 pieces &middot; WMCQ materials &middot; Z undo &middot; T test
        </div>
      </div>

      {/* Toaster for notifications */}
      <Toaster toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
};

export default GamePage;
