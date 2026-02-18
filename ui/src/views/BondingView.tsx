/**
 * BondingView — Turn-based multiplayer molecule builder game
 * Three modes: LOBBY, GAME, COMPLETE
 */

import React, { useState, useEffect, useRef } from 'react';
import type { BondingGame, Atom, Bond, Player, Ping, GameMode, PingType } from '../types/bonding';
import { ELEMENTS, getElementsForPicker, getElement, calculateFormula, getBondSites, canBond, calculateGameStats, generateGameCode, getElementFrequency } from '../lib/chemistry';
import { getBirthdayQuestStepsSatisfied, BIRTHDAY_STEP_LOVE } from '../lib/birthdayQuestDetection';
import { useLoveMiningStore } from '../stores/loveMining.store';
import { useAccessibilityStore } from '../stores/accessibility.store';
import { prefersReducedMotion } from '../utils/accessibility';
import { isBirthdayQuestActive } from '@p31labs/game-engine';
import { QuestPanel } from '../components/bonding/QuestPanel';

const BRAND = {
  green: '#00FF88',
  cyan: '#00D4FF',
  amber: '#FFB800',
  magenta: '#FF00CC',
  violet: '#7A27FF',
  void: '#050510',
  surface2: '#12122E',
  text: '#E0E0EE',
  muted: '#7878AA',
  dim: '#4A4A7A',
} as const;

const PLAYER_COLORS = [BRAND.green, BRAND.cyan, BRAND.amber, BRAND.magenta, BRAND.violet, '#FF6B9D'] as const;

const PING_TYPES: Array<{ type: PingType; emoji: string; color: string }> = [
  { type: 'NICE', emoji: '💚', color: BRAND.green },
  { type: 'HMMMM', emoji: '🤔', color: BRAND.cyan },
  { type: 'LOL', emoji: '😂', color: BRAND.amber },
  { type: 'WOW', emoji: '🔺', color: BRAND.violet },
];

export function BondingView(): React.ReactElement {
  const [mode, setMode] = useState<GameMode>('LOBBY');
  const [currentGame, setCurrentGame] = useState<BondingGame | null>(null);
  const [games, setGames] = useState<BondingGame[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [canvasTransform, setCanvasTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [showPingMenu, setShowPingMenu] = useState<{ x: number; y: number; atomId: string } | null>(null);
  const [pingsThisTurn, setPingsThisTurn] = useState(0);
  const [showBirthdayCelebration, setShowBirthdayCelebration] = useState(false);
  const [birthdayMode, setBirthdayMode] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('birthday') === '1' || params.get('birthday') === 'true') return true;
    try {
      return localStorage.getItem('p31-bonding-birthday') === '1';
    } catch { return false; }
  });

  const canvasRef = useRef<SVGSVGElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const animationReduced = useAccessibilityStore((s) => s.animationReduced);
  const highContrast = useAccessibilityStore((s) => s.contrast) === 'high';
  const reducedMotion = animationReduced || (typeof window !== 'undefined' && prefersReducedMotion());

  // Initialize audio context
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // Clear birthday celebration toast after 5s
  useEffect(() => {
    if (!showBirthdayCelebration) return;
    const t = setTimeout(() => setShowBirthdayCelebration(false), 5000);
    return () => clearTimeout(t);
  }, [showBirthdayCelebration]);

  // Load games from localStorage
  useEffect(() => {
    loadGames();
    const interval = setInterval(loadGames, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  function loadGames() {
    const loaded: BondingGame[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('bonding:game:')) {
        try {
          const game = JSON.parse(localStorage.getItem(key) || '{}');
          if (game.id) {
            const migrated = migrateOldElementSymbols(game);
            if (migrated) localStorage.setItem(key, JSON.stringify(game));
            loaded.push(game);
          }
        } catch (e) {
          console.error('Failed to load game:', key, e);
        }
      }
    }
    setGames(loaded.sort((a, b) => b.lastActivity - a.lastActivity));
  }

  /** One-time migration: remap old Msh/Str/Pip atoms to WNC/SPK/TNL. Returns true if any were migrated. */
  function migrateOldElementSymbols(game: BondingGame): boolean {
    const OLD_TO_NEW: Record<string, string> = { Msh: 'WNC', Str: 'SPK', Pip: 'TNL' };
    let changed = false;
    for (const atom of game.atoms) {
      const replacement = OLD_TO_NEW[atom.element];
      if (replacement) {
        atom.element = replacement;
        changed = true;
      }
    }
    if (game.birthdayQuestProgress && 'marioDayUnlocked' in (game.birthdayQuestProgress as any)) {
      (game.birthdayQuestProgress as any).mar10DayUnlocked = (game.birthdayQuestProgress as any).marioDayUnlocked;
      delete (game.birthdayQuestProgress as any).marioDayUnlocked;
      changed = true;
    }
    return changed;
  }

  function saveGame(game: BondingGame) {
    localStorage.setItem(`bonding:game:${game.id}`, JSON.stringify(game));
    loadGames();
  }

  /** Sync Birthday Quest progress from current atoms; award LOVE for newly completed steps. Returns updated game and list of newly completed step numbers. */
  function syncGameBirthdayQuest(game: BondingGame): { game: BondingGame; newlyCompleted: number[] } {
    const satisfied = getBirthdayQuestStepsSatisfied(game);
    const progress = game.birthdayQuestProgress ?? { completedSteps: [], loveEarned: 0 };
    const newlyCompleted = satisfied.filter((s) => !progress.completedSteps.includes(s));
    if (newlyCompleted.length === 0) return { game, newlyCompleted: [] };

    const mineBirthdayStep = useLoveMiningStore.getState().mineBirthdayStep;
    const nextProgress = {
      ...progress,
      completedSteps: [...progress.completedSteps],
      loveEarned: progress.loveEarned,
    };
    for (const step of newlyCompleted.sort((a, b) => a - b)) {
      mineBirthdayStep(step as 1 | 2 | 3 | 4);
      nextProgress.completedSteps.push(step);
      nextProgress.loveEarned += BIRTHDAY_STEP_LOVE[step - 1];
      if (step === 4) {
        nextProgress.completedAt = Date.now();
        nextProgress.mar10DayUnlocked = true;
        nextProgress.printUnlocked = true;
      }
    }
    nextProgress.completedSteps.sort((a, b) => a - b);
    return { game: { ...game, birthdayQuestProgress: nextProgress }, newlyCompleted };
  }

  function createGame(name: string, playerName: string, playerColor: string): BondingGame {
    const gameId = crypto.randomUUID();
    const code = generateGameCode();
    const now = Date.now();
    
    const game: BondingGame = {
      id: gameId,
      code,
      name,
      players: [{
        id: crypto.randomUUID(),
        name: playerName,
        color: playerColor,
        atomsPlaced: 0,
        pingsSent: 0,
      }],
      atoms: [],
      bonds: [],
      pings: [],
      currentTurn: '',
      status: 'active',
      createdAt: now,
      lastActivity: now,
      birthdayQuestProgress: { completedSteps: [], loveEarned: 0 },
    };
    
    // Set first player's turn
    if (game.players.length > 0) {
      game.currentTurn = game.players[0].id;
    }
    
    saveGame(game);
    return game;
  }

  function joinGame(code: string, playerName: string, playerColor: string): BondingGame | null {
    const game = games.find(g => g.code.toUpperCase() === code.toUpperCase() && g.status === 'active');
    if (!game) return null;
    
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name: playerName,
      color: playerColor,
      atomsPlaced: 0,
      pingsSent: 0,
    };
    
    game.players.push(newPlayer);
    game.lastActivity = Date.now();
    saveGame(game);
    return game;
  }

  function playSound(frequency: number, duration: number = 0.1) {
    if (!audioContextRef.current) return;
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  }

  function playTurnSound() {
    if (!audioContextRef.current) return;
    const notes = [261.63, 329.63, 392.00]; // C-E-G
    notes.forEach((freq, i) => {
      setTimeout(() => playSound(freq, 0.2), i * 100);
    });
  }

  function playCompletionSound(atoms: Atom[]) {
    if (!audioContextRef.current || atoms.length === 0) return;
    const frequencies = atoms.map(a => {
      const element = ELEMENTS.find(e => e.symbol === a.element);
      return element ? getElementFrequency(element.atomicNumber) : 220;
    });
    
    frequencies.forEach((freq, i) => {
      setTimeout(() => playSound(freq, 0.3), i * 150);
    });
  }

  function handleCreateGame(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('gameName') as string;
    const playerName = formData.get('playerName') as string;
    const playerColor = formData.get('playerColor') as string;
    
    if (!name || !playerName || !playerColor) return;
    
    const game = createGame(name, playerName, playerColor);
    setCurrentGame(game);
    setMode('GAME');
    setShowCreateForm(false);
  }

  function handleJoinGame(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const playerName = formData.get('playerName') as string;
    const playerColor = formData.get('playerColor') as string;
    
    if (!joinCode || !playerName || !playerColor) return;
    
    const game = joinGame(joinCode, playerName, playerColor);
    if (game) {
      setCurrentGame(game);
      setMode('GAME');
      setShowJoinForm(false);
      setJoinCode('');
    } else {
      alert('Game not found! Check the code.');
    }
  }

  function handlePlaceAtom(x: number, y: number) {
    if (!currentGame || !selectedElement) return;
    const element = ELEMENTS.find(e => e.symbol === selectedElement);
    if (!element || element.locked) return;
    
    // Check if it's current player's turn
    const currentPlayer = currentGame.players.find(p => p.id === currentGame.currentTurn);
    if (!currentPlayer) return;
    
    // Transform coordinates from screen to canvas
    const svg = canvasRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const canvasX = (x - rect.left - canvasTransform.x) / canvasTransform.scale;
    const canvasY = (y - rect.top - canvasTransform.y) / canvasTransform.scale;
    
    // Check if placing on bond site or empty space
    let placeX = canvasX;
    let placeY = canvasY;
    
    if (currentGame.atoms.length > 0) {
      // Try to place near an existing atom
      const bondSites = currentGame.atoms.flatMap(atom => 
        getBondSites(atom, currentGame.atoms).map(site => ({ ...site, atomId: atom.id }))
      );
      
      const nearestSite = bondSites.reduce((closest, site) => {
        const dist = Math.sqrt((canvasX - site.x) ** 2 + (canvasY - site.y) ** 2);
        const closestDist = Math.sqrt((canvasX - closest.x) ** 2 + (canvasY - closest.y) ** 2);
        return dist < closestDist ? site : closest;
      }, bondSites[0]);
      
      if (nearestSite && Math.sqrt((canvasX - nearestSite.x) ** 2 + (canvasY - nearestSite.y) ** 2) < 30) {
        placeX = nearestSite.x;
        placeY = nearestSite.y;
      }
    }
    
    const newAtom: Atom = {
      id: crypto.randomUUID(),
      element: selectedElement,
      atomicNumber: element.atomicNumber,
      x: placeX,
      y: placeY,
      playerId: currentPlayer.id,
      placedAt: Date.now(),
    };
    
    // Create bonds to nearby atoms
    const newBonds: Bond[] = [];
    currentGame.atoms.forEach(atom => {
      if (canBond(newAtom, atom)) {
        newBonds.push({
          id: crypto.randomUUID(),
          atom1Id: newAtom.id,
          atom2Id: atom.id,
          order: 1,
        });
      }
    });
    
    const updatedGame: BondingGame = {
      ...currentGame,
      atoms: [...currentGame.atoms, newAtom],
      bonds: [...currentGame.bonds, ...newBonds],
      lastActivity: Date.now(),
    };
    
    // Update player stats
    const playerIndex = updatedGame.players.findIndex(p => p.id === currentPlayer.id);
    if (playerIndex >= 0) {
      updatedGame.players[playerIndex].atomsPlaced++;
    }
    
    // Switch turn
    const currentIndex = updatedGame.players.findIndex(p => p.id === updatedGame.currentTurn);
    updatedGame.currentTurn = updatedGame.players[(currentIndex + 1) % updatedGame.players.length].id;
    
    // Play sound
    playSound(getElementFrequency(element.atomicNumber));
    
    // Reset pings for new turn
    setPingsThisTurn(0);

    // Sync Birthday Quest and award LOVE for any newly completed steps
    const { game: syncedGame, newlyCompleted } = syncGameBirthdayQuest(updatedGame);
    if (newlyCompleted.length > 0) {
      saveGame(syncedGame);
      setCurrentGame(syncedGame);
      if (newlyCompleted.includes(4)) setShowBirthdayCelebration(true);
    } else {
      saveGame(updatedGame);
      setCurrentGame(updatedGame);
    }
    setSelectedElement(null);

    // Play turn notification for next player
    setTimeout(() => playTurnSound(), 200);
  }

  function handleFinishGame() {
    if (!currentGame || currentGame.atoms.length < 4) return;
    
    const updatedGame: BondingGame = {
      ...currentGame,
      status: 'complete',
      completedAt: Date.now(),
    };
    
    playCompletionSound(updatedGame.atoms);
    saveGame(updatedGame);
    setCurrentGame(updatedGame);
    setMode('COMPLETE');
  }

  function handleLongPress(atomId: string, x: number, y: number) {
    if (pingsThisTurn >= 3) return;
    
    const timer = setTimeout(() => {
      setShowPingMenu({ x, y, atomId });
    }, 500);
    setLongPressTimer(timer);
  }

  function handlePing(type: PingType, atomId: string) {
    if (!currentGame || pingsThisTurn >= 3) return;
    
    const currentPlayer = currentGame.players.find(p => p.id === currentGame.currentTurn);
    if (!currentPlayer) return;
    
    const pingEmoji = PING_TYPES.find(p => p.type === type)?.emoji || '💚';
    const targetAtom = currentGame.atoms.find(a => a.id === atomId);
    if (!targetAtom) return;
    
    const targetPlayer = currentGame.players.find(p => p.id === targetAtom.playerId);
    if (!targetPlayer) return;
    
    const ping: Ping = {
      id: crypto.randomUUID(),
      from: currentPlayer.id,
      to: targetPlayer.id,
      type,
      emoji: pingEmoji as any,
      atomId,
      timestamp: Date.now(),
    };
    
    const updatedGame: BondingGame = {
      ...currentGame,
      pings: [...currentGame.pings, ping],
      lastActivity: Date.now(),
    };
    
    const playerIndex = updatedGame.players.findIndex(p => p.id === currentPlayer.id);
    if (playerIndex >= 0) {
      updatedGame.players[playerIndex].pingsSent++;
    }
    
    saveGame(updatedGame);
    setCurrentGame(updatedGame);
    setPingsThisTurn(p => p + 1);
    setShowPingMenu(null);
  }

  function handleCanvasMouseDown(e: React.MouseEvent<SVGSVGElement>) {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setDragStart({ x: e.clientX - canvasTransform.x, y: e.clientY - canvasTransform.y });
  }

  function handleCanvasMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (isDragging) {
      setCanvasTransform({
        ...canvasTransform,
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }

  function handleCanvasMouseUp() {
    setIsDragging(false);
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }

  function handleCanvasWheel(e: React.WheelEvent<SVGSVGElement>) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setCanvasTransform({
      ...canvasTransform,
      scale: Math.max(0.5, Math.min(2, canvasTransform.scale * delta)),
    });
  }

  function handleCanvasClick(e: React.MouseEvent<SVGSVGElement>) {
    if (showPingMenu) {
      setShowPingMenu(null);
      return;
    }
    
    if (!isDragging && selectedElement && mode === 'GAME') {
      handlePlaceAtom(e.clientX, e.clientY);
    }
  }

  // LOBBY MODE
  if (mode === 'LOBBY') {
    const activeGames = games.filter(g => g.status === 'active');
    const completedGames = games.filter(g => g.status === 'complete');
    
    return (
      <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto', color: BRAND.text }}>
        <h1 style={{ 
          fontFamily: 'Space Mono, monospace', 
          fontSize: 9, 
          letterSpacing: 5, 
          color: BRAND.green,
          marginBottom: 32,
        }}>
          BONDING
        </h1>
        
        <div style={{ display: 'flex', gap: 16, marginBottom: 32 }}>
          <button
            type="button"
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '12px 24px',
              background: BRAND.green,
              color: BRAND.void,
              border: 'none',
              borderRadius: 8,
              fontFamily: 'Oxanium, sans-serif',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            CREATE NEW
          </button>
          <button
            type="button"
            onClick={() => setShowJoinForm(true)}
            style={{
              padding: '12px 24px',
              background: BRAND.cyan,
              color: BRAND.void,
              border: 'none',
              borderRadius: 8,
              fontFamily: 'Oxanium, sans-serif',
              cursor: 'pointer',
              fontSize: 14,
            }}
          >
            JOIN
          </button>
        </div>
        
        {showCreateForm && (
          <div style={{
            background: BRAND.surface2,
            padding: 24,
            borderRadius: 12,
            marginBottom: 24,
          }}>
            <h2 style={{ fontSize: 16, marginBottom: 16 }}>Create New Game</h2>
            <form onSubmit={handleCreateGame}>
              <input
                name="gameName"
                placeholder="Game name"
                required
                style={{
                  width: '100%',
                  padding: 12,
                  marginBottom: 12,
                  background: BRAND.void,
                  border: `1px solid ${BRAND.dim}`,
                  borderRadius: 8,
                  color: BRAND.text,
                  fontSize: 14,
                }}
              />
              <input
                name="playerName"
                placeholder="Your name"
                required
                style={{
                  width: '100%',
                  padding: 12,
                  marginBottom: 12,
                  background: BRAND.void,
                  border: `1px solid ${BRAND.dim}`,
                  borderRadius: 8,
                  color: BRAND.text,
                  fontSize: 14,
                }}
              />
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: BRAND.muted, marginBottom: 8, display: 'block' }}>
                  Your color
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {PLAYER_COLORS.map(color => (
                    <label key={color} style={{ cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="playerColor"
                        value={color}
                        required
                        style={{ display: 'none' }}
                      />
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: color,
                        border: `2px solid ${BRAND.void}`,
                      }} />
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: BRAND.green,
                    color: BRAND.void,
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  CREATE
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  style={{
                    padding: '12px 24px',
                    background: BRAND.dim,
                    color: BRAND.text,
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}
        
        {showJoinForm && (
          <div style={{
            background: BRAND.surface2,
            padding: 24,
            borderRadius: 12,
            marginBottom: 24,
          }}>
            <h2 style={{ fontSize: 16, marginBottom: 16 }}>Join Game</h2>
            <form onSubmit={handleJoinGame}>
              <input
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="6-character code"
                maxLength={6}
                required
                style={{
                  width: '100%',
                  padding: 12,
                  marginBottom: 12,
                  background: BRAND.void,
                  border: `1px solid ${BRAND.dim}`,
                  borderRadius: 8,
                  color: BRAND.text,
                  fontSize: 14,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                }}
              />
              <input
                name="playerName"
                placeholder="Your name"
                required
                style={{
                  width: '100%',
                  padding: 12,
                  marginBottom: 12,
                  background: BRAND.void,
                  border: `1px solid ${BRAND.dim}`,
                  borderRadius: 8,
                  color: BRAND.text,
                  fontSize: 14,
                }}
              />
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, color: BRAND.muted, marginBottom: 8, display: 'block' }}>
                  Your color
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {PLAYER_COLORS.map(color => (
                    <label key={color} style={{ cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="playerColor"
                        value={color}
                        required
                        style={{ display: 'none' }}
                      />
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: color,
                        border: `2px solid ${BRAND.void}`,
                      }} />
                    </label>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: BRAND.cyan,
                    color: BRAND.void,
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  JOIN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowJoinForm(false);
                    setJoinCode('');
                  }}
                  style={{
                    padding: '12px 24px',
                    background: BRAND.dim,
                    color: BRAND.text,
                    border: 'none',
                    borderRadius: 8,
                    cursor: 'pointer',
                  }}
                >
                  CANCEL
                </button>
              </div>
            </form>
          </div>
        )}
        
        {activeGames.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 14, color: BRAND.muted, marginBottom: 16 }}>ACTIVE GAMES</h2>
            {activeGames.map(game => {
              const formula = calculateFormula(game.atoms);
              const currentPlayer = game.players.find(p => p.id === game.currentTurn);
              return (
                <div
                  key={game.id}
                  onClick={() => {
                    const { game: syncedGame, newlyCompleted } = syncGameBirthdayQuest(game);
                    setCurrentGame(syncedGame);
                    setMode('GAME');
                    if (newlyCompleted.length > 0) saveGame(syncedGame);
                  }}
                  style={{
                    background: BRAND.surface2,
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 12,
                    cursor: 'pointer',
                    border: `1px solid ${BRAND.dim}`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 16, fontFamily: 'Oxanium, sans-serif', marginBottom: 4 }}>
                        {game.name}
                      </div>
                      <div style={{ fontSize: 12, color: BRAND.muted }}>
                        {formula || 'Empty'} · {game.players.length} players · Turn: {currentPlayer?.name || 'N/A'}
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: BRAND.dim }}>
                      {new Date(game.lastActivity).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {completedGames.length > 0 && (
          <div>
            <h2 style={{ fontSize: 14, color: BRAND.muted, marginBottom: 16 }}>COMPLETED</h2>
            {completedGames.map(game => {
              const formula = calculateFormula(game.atoms);
              return (
                <div
                  key={game.id}
                  onClick={() => {
                    setCurrentGame(game);
                    setMode('COMPLETE');
                  }}
                  style={{
                    background: BRAND.surface2,
                    padding: 16,
                    borderRadius: 8,
                    marginBottom: 12,
                    cursor: 'pointer',
                    border: `1px solid ${BRAND.dim}`,
                    opacity: 0.7,
                  }}
                >
                  <div style={{ fontSize: 16, fontFamily: 'Oxanium, sans-serif', marginBottom: 4 }}>
                    {game.name}
                  </div>
                  <div style={{ fontSize: 12, color: BRAND.muted }}>
                    {formula} · Completed {game.completedAt ? new Date(game.completedAt).toLocaleDateString() : ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // GAME MODE
  if (mode === 'GAME' && currentGame) {
    const stats = calculateGameStats(currentGame.atoms, currentGame.bonds, currentGame.players);
    const currentPlayer = currentGame.players.find(p => p.id === currentGame.currentTurn);
    const selectedElementInfo = selectedElement ? ELEMENTS.find(e => e.symbol === selectedElement) : null;
    const recentPings = currentGame.pings.slice(-3).reverse();
    
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', color: BRAND.text }}>
        {/* Header */}
        <div style={{
          padding: 16,
          background: BRAND.surface2,
          borderBottom: `1px solid ${BRAND.dim}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 16, fontFamily: 'Oxanium, sans-serif', marginBottom: 4 }}>
              {currentGame.name}
            </div>
            <div style={{ fontSize: 12, color: BRAND.muted }}>
              Code: {currentGame.code} · Turn: {currentPlayer?.name || 'N/A'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {currentGame.players.map(player => (
              <div
                key={player.id}
                style={{
                  padding: '8px 12px',
                  background: player.color,
                  color: BRAND.void,
                  borderRadius: 8,
                  fontSize: 12,
                  fontFamily: 'Oxanium, sans-serif',
                }}
              >
                {player.name}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setMode('LOBBY');
              setCurrentGame(null);
            }}
            style={{
              padding: '8px 16px',
              background: BRAND.dim,
              color: BRAND.text,
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            BACK
          </button>
        </div>
        
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Main Canvas */}
          <div style={{ flex: 1, position: 'relative', background: BRAND.void }}>
            <svg
              ref={canvasRef}
              width="100%"
              height="100%"
              style={{ cursor: selectedElement ? 'crosshair' : isDragging ? 'grabbing' : 'grab' }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
              onWheel={handleCanvasWheel}
              onClick={handleCanvasClick}
            >
              <g transform={`translate(${canvasTransform.x}, ${canvasTransform.y}) scale(${canvasTransform.scale})`}>
                {/* Bonds */}
                {currentGame.bonds.map(bond => {
                  const atom1 = currentGame.atoms.find(a => a.id === bond.atom1Id);
                  const atom2 = currentGame.atoms.find(a => a.id === bond.atom2Id);
                  if (!atom1 || !atom2) return null;
                  
                  return (
                    <line
                      key={bond.id}
                      x1={atom1.x}
                      y1={atom1.y}
                      x2={atom2.x}
                      y2={atom2.y}
                      stroke={BRAND.text}
                      strokeWidth={bond.order * 2}
                      opacity={0.5}
                    />
                  );
                })}
                
                {/* Bond sites (when element selected) */}
                {selectedElement && currentGame.atoms.map(atom => {
                  const sites = getBondSites(atom, currentGame.atoms);
                  return sites.map((site, i) => (
                    <circle
                      key={`site-${atom.id}-${i}`}
                      cx={site.x}
                      cy={site.y}
                      r={15}
                      fill="none"
                      stroke={BRAND.green}
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      opacity={0.6}
                      style={{
                        animation: 'pulse 1s ease-in-out infinite',
                      }}
                    />
                  ));
                })}
                
                {/* Atoms */}
                {currentGame.atoms.map(atom => {
                  const player = currentGame.players.find(p => p.id === atom.playerId);
                  const stroke = highContrast ? BRAND.text : BRAND.void;
                  const strokeW = highContrast ? 2 : 2;
                  const handlers = {
                    onMouseDown: (e: React.MouseEvent) => {
                      e.stopPropagation();
                      handleLongPress(atom.id, e.clientX, e.clientY);
                    },
                    onMouseUp: () => {
                      if (longPressTimer) {
                        clearTimeout(longPressTimer);
                        setLongPressTimer(null);
                      }
                    },
                    style: { cursor: 'pointer' } as const,
                  };

                  if (atom.element === 'Msh') {
                    return (
                      <g key={atom.id} transform={`translate(${atom.x}, ${atom.y})`} {...handlers}>
                        <circle r={14} cy={-6} fill="#e52521" stroke={stroke} strokeWidth={strokeW} />
                        <circle r={3} cx={-5} cy={-8} fill="#fff" stroke={stroke} strokeWidth={1} />
                        <circle r={2.5} cx={5} cy={-6} fill="#fff" stroke={stroke} strokeWidth={1} />
                        <circle r={2} cx={0} cy={-4} fill="#fff" stroke={stroke} strokeWidth={1} />
                        <rect x={-6} y={0} width={12} height={14} rx={2} fill="#8B6914" stroke={stroke} strokeWidth={strokeW} />
                        <title>Mushroom (decorative)</title>
                      </g>
                    );
                  }
                  if (atom.element === 'Str') {
                    const starPath = (() => {
                      let d = '';
                      for (let i = 0; i <= 10; i++) {
                        const deg = 270 + i * 36;
                        const r = i % 2 === 0 ? 20 : 8;
                        const x = r * Math.cos((deg * Math.PI) / 180);
                        const y = r * Math.sin((deg * Math.PI) / 180);
                        d += (i === 0 ? 'M' : 'L') + ` ${x},${y}`;
                      }
                      return d + ' Z';
                    })();
                    return (
                      <g key={atom.id} transform={`translate(${atom.x}, ${atom.y})`} {...handlers}>
                        <path
                          d={starPath}
                          fill="#FFD700"
                          stroke={stroke}
                          strokeWidth={strokeW}
                          style={reducedMotion ? undefined : { animation: 'bonding-star-pulse 1.5s ease-in-out infinite' }}
                        />
                        <title>Star (decorative)</title>
                      </g>
                    );
                  }
                  if (atom.element === 'Pip') {
                    return (
                      <g key={atom.id} transform={`translate(${atom.x}, ${atom.y})`} {...handlers}>
                        <rect x={-12} y={-18} width={24} height={36} rx={4} ry={4} fill="#00AA00" stroke={stroke} strokeWidth={strokeW} />
                        <rect x={-10} y={-14} width={20} height={4} rx={1} fill="#006600" />
                        <title>Pipe (decorative)</title>
                      </g>
                    );
                  }

                  return (
                    <g key={atom.id}>
                      <circle
                        cx={atom.x}
                        cy={atom.y}
                        r={20}
                        fill={player?.color || BRAND.text}
                        stroke={stroke}
                        strokeWidth={strokeW}
                        {...handlers}
                      />
                      <text
                        x={atom.x}
                        y={atom.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={BRAND.void}
                        fontSize={12}
                        fontFamily="Oxanium, sans-serif"
                        fontWeight="bold"
                      >
                        {atom.element}
                      </text>
                    </g>
                  );
                })}
                
                {/* Center marker for first atom */}
                {currentGame.atoms.length === 0 && (
                  <circle
                    cx="50%"
                    cy="50%"
                    r={10}
                    fill="none"
                    stroke={BRAND.green}
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    opacity={0.5}
                  />
                )}
              </g>
            </svg>
            
            {/* Birthday Quest completion celebration */}
            {showBirthdayCelebration && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(5,5,16,0.85)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 999,
                  padding: 24,
                }}
                role="alert"
                aria-live="polite"
              >
                <div
                  style={{
                    background: BRAND.surface2,
                    padding: 32,
                    borderRadius: 16,
                    border: `2px solid ${BRAND.amber}`,
                    maxWidth: 320,
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: 48, marginBottom: 16 }}>🌟</div>
                  <h2 style={{ fontSize: 20, fontFamily: 'Oxanium, sans-serif', color: BRAND.amber, marginBottom: 8 }}>
                    Super Mario Molecule complete!
                  </h2>
                  <p style={{ fontSize: 14, color: BRAND.text, marginBottom: 8 }}>
                    Mario Day achievement unlocked!
                  </p>
                  <p style={{ fontSize: 14, color: BRAND.amber, marginBottom: 16 }}>
                    +50 Star Bits
                  </p>
                  <p style={{ fontSize: 12, color: BRAND.muted }}>
                    You can now use Print Now in the sidebar to print your molecule.
                  </p>
                </div>
              </div>
            )}

            {/* Ping menu */}
            {showPingMenu && (
              <div
                style={{
                  position: 'absolute',
                  left: showPingMenu.x,
                  top: showPingMenu.y,
                  background: BRAND.surface2,
                  borderRadius: 12,
                  padding: 8,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                  border: `1px solid ${BRAND.dim}`,
                  zIndex: 1000,
                }}
              >
                {PING_TYPES.map(({ type, emoji, color }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handlePing(type, showPingMenu.atomId)}
                    disabled={pingsThisTurn >= 3}
                    style={{
                      padding: '8px 16px',
                      background: color,
                      color: BRAND.void,
                      border: 'none',
                      borderRadius: 6,
                      cursor: pingsThisTurn >= 3 ? 'not-allowed' : 'pointer',
                      opacity: pingsThisTurn >= 3 ? 0.5 : 1,
                      fontSize: 14,
                      fontFamily: 'Oxanium, sans-serif',
                    }}
                  >
                    {emoji} {type}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div style={{
            width: 300,
            background: BRAND.surface2,
            padding: 16,
            overflowY: 'auto',
            borderLeft: `1px solid ${BRAND.dim}`,
          }}>
            {/* Stats */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, color: BRAND.muted, marginBottom: 12 }}>STATS</h3>
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                <strong>Formula:</strong> {stats.formula || 'Empty'}
              </div>
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                <strong>Mass:</strong> {stats.mass.toFixed(2)} u
              </div>
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                <strong>Stability:</strong> {stats.stability.toFixed(0)}%
              </div>
              <div style={{ fontSize: 12, marginBottom: 4 }}>
                <strong>Atoms:</strong> {stats.atomCount}
              </div>
              <div style={{ fontSize: 12 }}>
                <strong>Bonds:</strong> {stats.bondCount}
              </div>
            </div>

            {/* Birthday Quest */}
            {isBirthdayQuestActive() && (
              <QuestPanel
                progress={currentGame.birthdayQuestProgress}
                allComplete={(currentGame.birthdayQuestProgress?.completedSteps ?? []).includes(4)}
                onPrintNow={() => {
                  // Slicing/print flow: for now open print dialog; can later route to slice view
                  window.print();
                }}
                isMemorial={new Date() > new Date('2026-03-10T23:59:59.999Z')}
              />
            )}
            
            {/* Player stats */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 14, color: BRAND.muted, marginBottom: 12 }}>PLAYERS</h3>
              {currentGame.players.map(player => {
                const playerStats = stats.playerStats[player.id];
                return (
                  <div key={player.id} style={{ marginBottom: 8, fontSize: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: player.color,
                      }} />
                      <span>{player.name}</span>
                    </div>
                    <div style={{ marginLeft: 20, color: BRAND.muted }}>
                      {playerStats?.atoms || 0} atoms · {player.pingsSent} pings
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Ping log */}
            {recentPings.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 14, color: BRAND.muted, marginBottom: 12 }}>PINGS</h3>
                {recentPings.map(ping => {
                  const fromPlayer = currentGame.players.find(p => p.id === ping.from);
                  const toPlayer = currentGame.players.find(p => p.id === ping.to);
                  const atom = currentGame.atoms.find(a => a.id === ping.atomId);
                  return (
                    <div key={ping.id} style={{ fontSize: 11, color: BRAND.muted, marginBottom: 4 }}>
                      {fromPlayer?.name} pinged {toPlayer?.name}'s {atom?.element}: {ping.emoji} {ping.type}
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Periodic Table */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h3 style={{ fontSize: 14, color: BRAND.muted }}>ELEMENTS</h3>
                <button
                  type="button"
                  onClick={() => {
                    const next = !birthdayMode;
                    setBirthdayMode(next);
                    try { localStorage.setItem('p31-bonding-birthday', next ? '1' : '0'); } catch { /* ignore */ }
                  }}
                  style={{
                    padding: '4px 8px',
                    fontSize: 10,
                    background: birthdayMode ? BRAND.amber : BRAND.dim,
                    color: BRAND.void,
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    fontFamily: 'Oxanium, sans-serif',
                  }}
                  title="Toggle birthday quest elements (Wonky Cap, Sparkle Star, Tunnel Tube)"
                  aria-label={birthdayMode ? 'Birthday mode on' : 'Birthday mode off'}
                >
                  {birthdayMode ? '🎂 On' : '🎂'}
                </button>
              </div>
              {['starter', 'common', 'metals', 'special', ...(birthdayMode ? ['birthday' as const] : [])].map(category => {
                const categoryElements = getElementsForPicker(birthdayMode).filter(e => e.category === category);
                if (categoryElements.length === 0) return null;
                return (
                  <div key={category} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, color: BRAND.dim, marginBottom: 8, textTransform: 'uppercase' }}>
                      {category === 'birthday' ? 'Birthday' : category}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {categoryElements.map(element => (
                        <button
                          key={element.symbol}
                          type="button"
                          onClick={() => !element.locked && setSelectedElement(element.symbol)}
                          disabled={element.locked}
                          style={{
                            width: 40,
                            height: 40,
                            background: element.locked ? BRAND.dim : selectedElement === element.symbol ? BRAND.green : BRAND.void,
                            border: `2px solid ${selectedElement === element.symbol ? BRAND.green : BRAND.dim}`,
                            borderRadius: 6,
                            cursor: element.locked ? 'not-allowed' : 'pointer',
                            opacity: element.locked ? 0.5 : 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: element.symbol.length > 2 ? 8 : 10,
                            fontFamily: 'Oxanium, sans-serif',
                            color: BRAND.text,
                            position: 'relative',
                          }}
                        >
                          {element.locked && <span style={{ position: 'absolute', top: -4, right: -4 }}>🔒</span>}
                          {element.symbol}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {selectedElementInfo && (
                <div style={{
                  marginTop: 16,
                  padding: 12,
                  background: BRAND.void,
                  borderRadius: 8,
                  fontSize: 11,
                  color: BRAND.text,
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 4 }}>
                    {selectedElementInfo.name} ({selectedElementInfo.symbol})
                  </div>
                  <div style={{ color: BRAND.muted }}>
                    {selectedElementInfo.funFact}
                  </div>
                </div>
              )}
            </div>
            
            {/* Finish button */}
            {currentGame.atoms.length >= 4 && (
              <button
                type="button"
                onClick={handleFinishGame}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  marginTop: 24,
                  background: BRAND.amber,
                  color: BRAND.void,
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontFamily: 'Oxanium, sans-serif',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                FINISH
              </button>
            )}
          </div>
        </div>
        
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          @keyframes bonding-star-pulse {
            0%, 100% { opacity: 1; filter: drop-shadow(0 0 4px #FFD700); }
            50% { opacity: 0.9; filter: drop-shadow(0 0 12px #FFD700); }
          }
          @media (prefers-reduced-motion: reduce) {
            .bonding-star-pulse, [style*="bonding-star-pulse"] { animation: none !important; }
          }
        `}</style>
      </div>
    );
  }

  // COMPLETE MODE
  if (mode === 'COMPLETE' && currentGame) {
    const stats = calculateGameStats(currentGame.atoms, currentGame.bonds, currentGame.players);
    const knownMolecules: Record<string, number> = {
      'H2O': 100, 'CO2': 95, 'NH3': 90, 'CH4': 95,
      'O2': 85, 'N2': 90, 'H2': 80, 'HCl': 85,
    };
    const isKnownMolecule = knownMolecules[stats.formula] !== undefined;
    const achievements: Array<{ id: string; name: string; description: string }> = [];
    
    if (stats.atomCount >= 4) achievements.push({ id: 'molecule', name: 'Molecule Builder', description: 'Built a molecule with 4+ atoms' });
    if (stats.stability >= 80) achievements.push({ id: 'stable', name: 'Stable Structure', description: 'Achieved 80%+ stability' });
    if (isKnownMolecule) achievements.push({ id: 'known', name: 'Known Molecule', description: `Created ${stats.formula}!` });
    if (currentGame.pings.length > 0) achievements.push({ id: 'social', name: 'Social Bond', description: 'Sent pings to teammates' });
    
    const loveEarned = 10 + (achievements.length * 5) + (isKnownMolecule ? 10 : 0) + (currentGame.pings.length * 2);
    
    return (
      <div style={{ padding: 24, maxWidth: 800, margin: '0 auto', color: BRAND.text }}>
        <h1 style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: 24,
          letterSpacing: 5,
          color: BRAND.green,
          marginBottom: 32,
          textAlign: 'center',
        }}>
          MOLECULE COMPLETE!
        </h1>
        
        {/* Celebration particles */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1000,
        }}>
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: 8,
                height: 8,
                background: [BRAND.green, BRAND.cyan, BRAND.amber, BRAND.magenta, BRAND.violet][Math.floor(Math.random() * 5)],
                borderRadius: '50%',
                animation: `confetti ${2 + Math.random() * 2}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.5}s`,
              }}
            />
          ))}
        </div>
        
        {/* Molecule card */}
        <div style={{
          background: BRAND.surface2,
          padding: 32,
          borderRadius: 16,
          marginBottom: 24,
          border: `2px solid ${BRAND.green}`,
        }}>
          <div style={{ fontSize: 32, fontFamily: 'Oxanium, sans-serif', marginBottom: 16, textAlign: 'center' }}>
            {stats.formula}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
            <div>
              <div style={{ fontSize: 12, color: BRAND.muted, marginBottom: 4 }}>Mass</div>
              <div style={{ fontSize: 20, fontFamily: 'Oxanium, sans-serif' }}>{stats.mass.toFixed(2)} u</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: BRAND.muted, marginBottom: 4 }}>Stability</div>
              <div style={{ fontSize: 20, fontFamily: 'Oxanium, sans-serif', color: BRAND.green }}>
                {stats.stability.toFixed(0)}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: BRAND.muted, marginBottom: 4 }}>Atoms</div>
              <div style={{ fontSize: 20, fontFamily: 'Oxanium, sans-serif' }}>{stats.atomCount}</div>
            </div>
            <div>
              <div style={{ fontSize: 12, color: BRAND.muted, marginBottom: 4 }}>Bonds</div>
              <div style={{ fontSize: 20, fontFamily: 'Oxanium, sans-serif' }}>{stats.bondCount}</div>
            </div>
          </div>
          
          {/* Player contributions */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 14, color: BRAND.muted, marginBottom: 12 }}>PLAYER CONTRIBUTIONS</div>
            {currentGame.players.map(player => {
              const playerStats = stats.playerStats[player.id];
              return (
                <div key={player.id} style={{ marginBottom: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    background: player.color,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontFamily: 'Oxanium, sans-serif' }}>{player.name}</div>
                    <div style={{ fontSize: 12, color: BRAND.muted }}>
                      {playerStats?.atoms || 0} atoms · {player.pingsSent} pings
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Achievements */}
          {achievements.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: BRAND.muted, marginBottom: 12 }}>ACHIEVEMENTS</div>
              {achievements.map(ach => (
                <div key={ach.id} style={{
                  padding: 12,
                  background: BRAND.void,
                  borderRadius: 8,
                  marginBottom: 8,
                  borderLeft: `4px solid ${BRAND.amber}`,
                }}>
                  <div style={{ fontSize: 14, fontFamily: 'Oxanium, sans-serif', marginBottom: 4 }}>
                    {ach.name}
                  </div>
                  <div style={{ fontSize: 12, color: BRAND.muted }}>{ach.description}</div>
                </div>
              ))}
            </div>
          )}
          
          {/* LOVE earned */}
          <div style={{
            padding: 16,
            background: BRAND.void,
            borderRadius: 8,
            textAlign: 'center',
            border: `2px solid ${BRAND.amber}`,
          }}>
            <div style={{ fontSize: 12, color: BRAND.muted, marginBottom: 4 }}>LOVE EARNED</div>
            <div style={{ fontSize: 32, fontFamily: 'Oxanium, sans-serif', color: BRAND.amber }}>
              +{loveEarned}
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setMode('LOBBY');
              setCurrentGame(null);
            }}
            style={{
              padding: '12px 24px',
              background: BRAND.green,
              color: BRAND.void,
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontFamily: 'Oxanium, sans-serif',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            NEW MOLECULE
          </button>
        </div>
        
        <style>{`
          @keyframes confetti {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(-100vh) rotate(720deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }

  return <div style={{ color: BRAND.muted }}>Loading...</div>;
}
