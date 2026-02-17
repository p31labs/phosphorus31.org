import React, { useState, useEffect, useCallback } from 'react';
import { p31 } from '@p31/shared';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
import { useGenesisStore } from './stores/genesis';
import PerformanceMonitor from './components/3d/PerformanceMonitor';
import SceneInspector from './components/3d/SceneInspector';
import { QuantumCanvas } from './components/ui/QuantumCanvas';
import { QuantumVisualization3D } from './components/3d/QuantumVisualization3D';
import { IVMLattice } from './components/3d/IVMLattice';
import { QuantumControlPanel } from './components/Quantum/QuantumControlPanel';
import { QuantumNavigation } from './components/quantum/QuantumNavigation';
import OmegaProtocol from './components/world/OmegaProtocol';
import { BufferDashboard } from './components/Buffer/BufferDashboard';
import { SimpleBuffer } from './components/Buffer/SimpleBuffer';
import { AccessibilityPanel } from './components/Accessibility/AccessibilityPanel';
import { AccessibilityProvider } from './components/Accessibility/AccessibilityProvider';
import { AssistiveTechProvider } from './components/AssistiveTech/AssistiveTechProvider';
// import { VoiceControlIndicator } from './components/AssistiveTech/VoiceControlIndicator';
// import { SwitchControlHighlight } from './components/AssistiveTech/SwitchControlHighlight';
import { ToolsForLifeProvider } from './components/ToolsForLife/ToolsForLifeProvider';
// import { ToolsForLifePanel } from './components/ToolsForLife/ToolsForLifePanel';
// import { FamilyVibeCodingPanel } from './components/FamilyVibeCoding/FamilyVibeCodingPanel';
// import { CosmicPanel } from './components/Cosmic/CosmicPanel';
// import { CosmicVisualization } from './components/Cosmic/CosmicVisualization';
import { P31LanguageEditor } from './components/P31Language/P31LanguageEditor';
// import { SynergyVisualization } from './components/Synergy/SynergyVisualization';
import { InfiniteSynergyView } from './components/Synergy/InfiniteSynergyView';
import { GameEngine3D } from './components/Game/GameEngine3D';
import { GameControls } from './components/Game/GameControls';
import { GameEngineProvider } from './components/Game/GameEngineProvider';
import { QuantumGameBridge } from './components/Game/QuantumGameBridge';
import { FamilyCoOpView } from './components/Game/FamilyCoOpView';
import { FamilyCodingView } from './components/Game/FamilyCodingView';
// import { MoleculeBuilder } from './components/Molecule/MoleculeBuilder';
import { MoleculeBuilderHero } from './components/Molecule/MoleculeBuilderHero';
import { WillowsWorld } from './components/WillowsWorld/WillowsWorld';
import { P31MoleculeViewer } from './components/Molecule/P31MoleculeViewer';
import { ScienceCenter } from './components/ScienceCenter/ScienceCenter';
import { FamilyHub } from './components/FamilyHub/FamilyHub';
import { BackyardShenanigans } from './components/BackyardShenanigans/BackyardShenanigans';
import { VibeCoder } from './components/VibeCoder/VibeCoder';
// import { VibeCodingPanel } from './components/VibeCoding/VibeCodingPanel';
import { ArtArea } from './components/ArtArea/ArtArea';
// import { MathArea } from './components/MathArea/MathArea';
import JitterbugVisualizer from './components/JitterbugVisualizer';
import { DemoDashboard } from './components/DemoDashboard/DemoDashboard';
import { P31SproutPanel } from './components/Sprout/P31SproutPanel';
import { ScopeDashboard } from './organisms';
import { ScopeErrorBoundary, SproutErrorBoundary } from './components/ErrorBoundary';
import { MATAQuantumDashboard } from './components/demo/MATAQuantumDashboard';
import { WorldBuilder } from './components/WorldBuilder/WorldBuilder';
import { QuantumMVPView } from './components/MVP';
import { Marketplace } from './components/Marketplace/Marketplace';
import { CoherenceSync } from './components/CoherenceSync';
import { QuantumClock, ClockSonification } from './components/QuantumClock';
import { GeodesicRoomProvider } from './contexts/GeodesicRoomContext';
import { BuddyUserProvider } from './contexts/BuddyUserContext';
import { Toolbar } from './components/Toolbar/Toolbar';
import { P31_PRODUCT_ICONS } from './config/p31-icons';
import { useAccessibilityStore } from './stores/accessibility.store';
import { useBufferHeartbeat } from './hooks/useBufferHeartbeat';
import './styles/accessibility.css';
import './styles/button-animations.css';
import './styles/app-enhancements.css';

function App() {
  console.log('P31 loaded:', p31.config.identity.name);
  const { theme } = useGenesisStore();
  const [showBuffer, setShowBuffer] = useState(false);
  const [showSimple, setShowSimple] = useState(false);
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [showGame, setShowGame] = useState(true);
  const [showFamilyCoOp, setShowFamilyCoOp] = useState(false);
  const [showMoleculeBuilder, setShowMoleculeBuilder] = useState(false);
  const [showWillowsWorld, setShowWillowsWorld] = useState(false);
  const [showP31Molecule, setShowP31Molecule] = useState(false);
  const [showScienceCenter, setShowScienceCenter] = useState(false);
  const [showFamilyHub, setShowFamilyHub] = useState(false);
  const [showFamilyCoding, setShowFamilyCoding] = useState(false);
  const [showP31Language, setShowP31Language] = useState(false);
  const [showInfiniteSynergy, setShowInfiniteSynergy] = useState(false);
  const [showBackyard, setShowBackyard] = useState(false);
  const [showArtArea, setShowArtArea] = useState(false);
  const [showMathArea, setShowMathArea] = useState(false);
  const [showVibeCoder, setShowVibeCoder] = useState(false);
  // const [showSynergy, setShowSynergy] = useState(false);
  // const [showCriticalPath, setShowCriticalPath] = useState(false);
  const [showToolsForLife, setShowToolsForLife] = useState(false);
  const [showJitterbug, setShowJitterbug] = useState(false);
  const [showQuantum, setShowQuantum] = useState(false);
  const [showQuantumNav, setShowQuantumNav] = useState(false);
  const [showDemoDashboard, setShowDemoDashboard] = useState(false);
  const [showScopeDashboard, setShowScopeDashboard] = useState(false);
  const [showSproutPanel, setShowSproutPanel] = useState(false);
  const [showMATADemo, setShowMATADemo] = useState(false);
  const [showWorldBuilder, setShowWorldBuilder] = useState(false);
  const [showQuantumMVP, setShowQuantumMVP] = useState(false);
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [currentWorldId, setCurrentWorldId] = useState<string | null>(null);
  // const [highlightedItem, setHighlightedItem] = useState<string | null>(null);
  const { simplifiedUI } = useAccessibilityStore();

  // Start heartbeat for object permanence
  useBufferHeartbeat('scope', 100);

  // Keyboard navigation: Escape closes any open modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showMoleculeBuilder) setShowMoleculeBuilder(false);
        else if (showWillowsWorld) setShowWillowsWorld(false);
        else if (showP31Molecule) setShowP31Molecule(false);
        else if (showScienceCenter) setShowScienceCenter(false);
        else if (showFamilyHub) setShowFamilyHub(false);
        else if (showBackyard) setShowBackyard(false);
        else if (showArtArea) setShowArtArea(false);
        else if (showVibeCoder) setShowVibeCoder(false);
        else if (showP31Language) setShowP31Language(false);
        else if (showAccessibility) setShowAccessibility(false);
        else if (showBuffer) setShowBuffer(false);
        else if (showSimple) setShowSimple(false);
        else if (showGame) setShowGame(false);
        else if (showToolsForLife) setShowToolsForLife(false);
        else if (showJitterbug) setShowJitterbug(false);
        else if (showQuantum) setShowQuantum(false);
        else if (showQuantumNav) setShowQuantumNav(false);
        else if (showDemoDashboard) setShowDemoDashboard(false);
        else if (showScopeDashboard) setShowScopeDashboard(false);
        else if (showSproutPanel) setShowSproutPanel(false);
        else if (showMATADemo) setShowMATADemo(false);
        else if (showWorldBuilder) setShowWorldBuilder(false);
        else if (showQuantumMVP) setShowQuantumMVP(false);
        else if (showMarketplace) setShowMarketplace(false);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [
    showMoleculeBuilder,
    showWillowsWorld,
    showP31Molecule,
    showScienceCenter,
    showFamilyHub,
    showBackyard,
    showArtArea,
    showVibeCoder,
    showP31Language,
    showAccessibility,
    showBuffer,
    showSimple,
    showGame,
    showToolsForLife,
    showJitterbug,
    showQuantum,
    showQuantumNav,
    showDemoDashboard,
    showScopeDashboard,
    showSproutPanel,
    showMATADemo,
    showWorldBuilder,
    showQuantumMVP,
    showMarketplace,
  ]);

  // Keyboard handler for buttons (Enter/Space)
  const handleButtonKeyDown = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);

  return (
    <AccessibilityProvider>
      <BuddyUserProvider>
      <AssistiveTechProvider>
        <ToolsForLifeProvider>
          <GameEngineProvider>
            <GeodesicRoomProvider>
              <CoherenceSync />
              <ClockSonification />
              {showMATADemo && <MATAQuantumDashboard onClose={() => setShowMATADemo(false)} />}
              {showScopeDashboard && (
                <div className="absolute inset-0 z-[100] bg-[#050510]">
                  <button
                    type="button"
                    onClick={() => setShowScopeDashboard(false)}
                    onKeyDown={(e) => handleButtonKeyDown(e, () => setShowScopeDashboard(false))}
                    className="absolute top-4 left-4 z-[101] bg-[#2ecc71] hover:opacity-90 text-[#050510] px-4 py-2 rounded-lg font-bold shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#2ecc71] min-h-[44px]"
                    aria-label="Close Scope Dashboard"
                  >
                    ✕ Back to Scope
                  </button>
                  <ScopeErrorBoundary>
                    <ScopeDashboard />
                  </ScopeErrorBoundary>
                </div>
              )}
              {showQuantumMVP && <QuantumMVPView onClose={() => setShowQuantumMVP(false)} />}
              {showWorldBuilder && currentWorldId && (
                <WorldBuilder worldId={currentWorldId} onClose={() => setShowWorldBuilder(false)} />
              )}
              {showMarketplace && <Marketplace onClose={() => setShowMarketplace(false)} />}
            {!showMATADemo && !showScopeDashboard && !showWorldBuilder && !showQuantumMVP && (
            <div className="h-screen w-screen overflow-hidden">
              {/* Skip to main content link for screen readers */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:font-bold focus:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
                aria-label="Skip to main content"
              >
                Skip to content
              </a>

              {/* ARIA live region for status announcements */}
              <div
                id="aria-live-status"
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
              />
              {/* 3D Canvas */}
              {
                <Canvas
                  className="absolute inset-0"
                  camera={{ position: [0, 5, 10], fov: 50 }}
                  shadows
                  dpr={[1, 2]}
                >
                  {/* Performance optimization */}
                  <fog attach="fog" args={[theme === 'dark' ? '#000000' : '#ffffff', 10, 50]} />

                  {/* Lighting */}
                  <ambientLight intensity={0.4} />
                  <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
                  <pointLight position={[-10, -10, -5]} intensity={0.3} />

                  {/* Environment */}
                  <Environment preset="sunset" />

                  {/* Grid and helpers */}
                  <Grid
                    infiniteGrid
                    fadeDistance={50}
                    fadeStrength={2}
                    cellSize={1}
                    sectionSize={5}
                    sectionThickness={1}
                    sectionColor="#808080"
                    cellThickness={0.5}
                    cellColor="#404040"
                  />

                  {/* 3D Components */}
                  <OrbitControls
                    enableDamping
                    dampingFactor={0.05}
                    maxPolarAngle={Math.PI / 2 - 0.1}
                  />

                  {/* Performance monitoring overlay */}
                  <PerformanceMonitor />

                  {/* Scene debugging tools */}
                  <SceneInspector />

                  {/* Main 3D content — unified quantum + game layer always mounted */}
                  <group>
                    <IVMLattice radius={10} spacing={1.2} />
                    <OmegaProtocol />
                    <QuantumVisualization3D />
                    <GameEngine3D />
                    <QuantumClock position={[5, 0, 5]} />
                  </group>
                </Canvas>
              }

              {/* 2D UI Overlay */}
              <div className="relative z-10" id="main-content" role="main">
                <div className="app-header-enhanced p-4 text-white">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex-shrink-0">
                      <h1 className="app-title text-2xl lg:text-3xl">The Scope - P31</h1>
                      <p className="app-subtitle">
                        Phosphorus-31. The biological qubit. The atom in the bone.
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setShowMoleculeBuilder(!showMoleculeBuilder)}
                        className="px-4 py-2 rounded-lg font-medium min-h-[44px] flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg focus:outline-none focus:ring-4 focus:ring-cyan-300"
                        aria-label="P31 Molecule Builder - 4D Posner playground"
                        title="Open P31 Molecule Builder (3D / 4D Posner)"
                      >
                        <span>{showMoleculeBuilder ? '✨' : '🧬'}</span>
                        <span className="hidden sm:inline">
                          {showMoleculeBuilder ? 'P31 Active' : 'P31 Builder'}
                        </span>
                      </button>
                      <QuantumGameBridge />
                    </div>
                    <div className="flex-1 w-full lg:w-auto">
                      <Toolbar
                        buttons={[
                          {
                            id: 'moleculeBuilder',
                            label: showMoleculeBuilder ? '✨ P31 Active' : '🧬 P31 Builder',
                            icon: '🧬',
                            onClick: () => setShowMoleculeBuilder(!showMoleculeBuilder),
                            isActive: showMoleculeBuilder,
                            variant: 'primary',
                            group: 'core',
                            ariaLabel: 'P31 Molecule Builder - Centerpiece',
                          },
                          {
                            id: 'accessibility',
                            label: '♿ Settings',
                            icon: '♿',
                            onClick: () => setShowAccessibility(!showAccessibility),
                            isActive: showAccessibility,
                            variant: 'secondary',
                            group: 'core',
                            ariaLabel: 'Accessibility Settings',
                          },
                          {
                            id: 'simple',
                            label: showSimple ? 'Advanced' : 'Simple',
                            icon: showSimple ? '⚙️' : '✨',
                            onClick: () => setShowSimple(!showSimple),
                            isActive: showSimple,
                            variant: 'secondary',
                            group: 'core',
                            ariaLabel: 'Simple Mode',
                          },
                          {
                            id: 'buffer',
                            label: showBuffer ? 'Hide Buffer' : 'Show Buffer',
                            icon: P31_PRODUCT_ICONS.shelter,
                            onClick: () => setShowBuffer(!showBuffer),
                            isActive: showBuffer,
                            variant: 'secondary',
                            group: 'core',
                            ariaLabel: 'Buffer Dashboard',
                          },
                          {
                            id: 'demoDashboard',
                            label: showDemoDashboard ? '📊 Hide Demo' : '📊 Demo',
                            icon: '📊',
                            onClick: () => setShowDemoDashboard(!showDemoDashboard),
                            isActive: showDemoDashboard,
                            variant: 'primary',
                            group: 'core',
                            ariaLabel: 'MATA Demo Dashboard - Voltage, Spoons, LoRa, Haptics',
                          },
                          {
                            id: 'scopeDashboard',
                            label: showScopeDashboard ? '◎ Hide Scope' : '◎ Full Scope',
                            icon: P31_PRODUCT_ICONS.scope,
                            onClick: () => setShowScopeDashboard(!showScopeDashboard),
                            isActive: showScopeDashboard,
                            variant: 'primary',
                            group: 'core',
                            ariaLabel: 'P31 Scope Dashboard - Octahedral nav, Neural Core, spectrum',
                          },
                          {
                            id: 'mataDemo',
                            label: showMATADemo ? '🎬 Hide Cockpit' : '🎬 MATA Demo',
                            icon: '🎬',
                            onClick: () => setShowMATADemo(!showMATADemo),
                            isActive: showMATADemo,
                            variant: 'primary',
                            group: 'core',
                            ariaLabel: 'MATA Demo Cockpit - Timeline, Buffer icosahedron, mesh log',
                          },
                          {
                            id: 'worldBuilder',
                            label: showWorldBuilder ? '🌍 Building' : '🌍 World Builder',
                            icon: '🌍',
                            onClick: () => {
                              if (!showWorldBuilder) setCurrentWorldId('world-' + Date.now());
                              setShowWorldBuilder(!showWorldBuilder);
                            },
                            isActive: showWorldBuilder,
                            variant: 'primary',
                            group: 'core',
                            ariaLabel: 'Quantum Geodesic World Builder - IVM, code, visual',
                          },
                          {
                            id: 'quantumMVP',
                            label: showQuantumMVP ? '🔺 MVP Active' : '🔺 Quantum MVP',
                            icon: '🔺',
                            onClick: () => setShowQuantumMVP(!showQuantumMVP),
                            isActive: showQuantumMVP,
                            variant: 'primary',
                            group: 'core',
                            ariaLabel: 'Quantum MVP - IVM, tetrahedra, coherence, clock',
                          },
                          {
                            id: 'marketplace',
                            label: '🏪 Marketplace',
                            icon: '🏪',
                            onClick: () => setShowMarketplace(!showMarketplace),
                            isActive: showMarketplace,
                            variant: 'secondary',
                            group: 'core',
                            ariaLabel: 'Marketplace - Coherence Tokens, assets',
                          },
                          {
                            id: 'willowsWorld',
                            label: showWillowsWorld ? '🌟 Willow Active' : "🌟 Willow's World",
                            icon: '🌟',
                            onClick: () => setShowWillowsWorld(!showWillowsWorld),
                            isActive: showWillowsWorld,
                            variant: 'accent',
                            group: 'family',
                            ariaLabel: "Willow's World",
                          },
                          {
                            id: 'backyard',
                            label: "🌳 Bash's Backyard",
                            icon: '🌳',
                            onClick: () => setShowBackyard(!showBackyard),
                            isActive: showBackyard,
                            variant: 'accent',
                            group: 'family',
                            ariaLabel: "Bash's Backyard Shenanigans",
                          },
                          {
                            id: 'sprout',
                            label: showSproutPanel ? '❋ Hide Sprout' : '❋ P31 Sprout',
                            icon: P31_PRODUCT_ICONS.sprout,
                            onClick: () => setShowSproutPanel(!showSproutPanel),
                            isActive: showSproutPanel,
                            variant: 'accent',
                            group: 'family',
                            ariaLabel: 'P31 Sprout - For the family. Feelings, wins, I need help.',
                          },
                          {
                            id: 'familyHub',
                            label: '👨‍👩‍👧‍👦 Family Hub',
                            icon: '👨‍👩‍👧‍👦',
                            onClick: () => setShowFamilyHub(!showFamilyHub),
                            isActive: showFamilyHub,
                            variant: 'accent',
                            group: 'family',
                            ariaLabel: 'Family Hub',
                          },
                          {
                            id: 'scienceCenter',
                            label: '🔬 Science Center',
                            icon: '🔬',
                            onClick: () => setShowScienceCenter(!showScienceCenter),
                            isActive: showScienceCenter,
                            variant: 'accent',
                            group: 'creative',
                            ariaLabel: 'Science Center',
                          },
                          {
                            id: 'artArea',
                            label: '🎨 Art Area',
                            icon: '🎨',
                            onClick: () => setShowArtArea(!showArtArea),
                            isActive: showArtArea,
                            variant: 'accent',
                            group: 'creative',
                            ariaLabel: 'Art Area',
                          },
                          {
                            id: 'mathArea',
                            label: '🔢 Math Area',
                            icon: '🔢',
                            onClick: () => setShowMathArea(!showMathArea),
                            isActive: showMathArea,
                            variant: 'accent',
                            group: 'creative',
                            ariaLabel: 'Math Area',
                          },
                          {
                            id: 'vibeCoder',
                            label: showVibeCoder ? '💻 Coding Active' : '💻 VibeCoder',
                            icon: '💻',
                            onClick: () => setShowVibeCoder(!showVibeCoder),
                            isActive: showVibeCoder,
                            variant: 'primary',
                            group: 'creative',
                            ariaLabel: 'VibeCoder',
                          },
                          {
                            id: 'jitterbug',
                            label: showJitterbug ? '🌌 Jitterbug Active' : '🌌 Jitterbug',
                            icon: '🌌',
                            onClick: () => setShowJitterbug(!showJitterbug),
                            isActive: showJitterbug,
                            variant: 'accent',
                            group: 'creative',
                            ariaLabel: 'Jitterbug Entropy Visualizer',
                          },
                          {
                            id: 'p31Language',
                            label: showP31Language ? '📝 Hide P31' : '📝 P31 Language',
                            icon: '📝',
                            onClick: () => setShowP31Language(!showP31Language),
                            isActive: showP31Language,
                            variant: 'accent',
                            group: 'creative',
                            ariaLabel: 'P31 Language Editor',
                          },
                          {
                            id: 'p31Molecule',
                            label: showP31Molecule ? 'Hide P31' : '🔺 P31 Molecule',
                            icon: '🔺',
                            onClick: () => setShowP31Molecule(!showP31Molecule),
                            isActive: showP31Molecule,
                            variant: 'accent',
                            group: 'tools',
                            ariaLabel: 'P31 Molecule Viewer',
                          },
                          {
                            id: 'game',
                            label: showGame ? 'Hide Game' : 'Show Game',
                            icon: '🎮',
                            onClick: () => setShowGame(!showGame),
                            isActive: showGame,
                            variant: 'secondary',
                            group: 'tools',
                            ariaLabel: 'Game Engine',
                          },
                          {
                            id: 'quantum',
                            label: showQuantum ? '⚛️ Quantum Active' : '⚛️ Quantum',
                            icon: '⚛️',
                            onClick: () => setShowQuantum(!showQuantum),
                            isActive: showQuantum,
                            variant: 'primary',
                            group: 'tools',
                            ariaLabel: 'Quantum Control Panel',
                          },
                          {
                            id: 'quantumNav',
                            label: showQuantumNav ? '🔺 Nav Active' : '🔺 Quantum Nav',
                            icon: '🔺',
                            onClick: () => setShowQuantumNav(!showQuantumNav),
                            isActive: showQuantumNav,
                            variant: 'accent',
                            group: 'tools',
                            ariaLabel: 'Quantum Navigation - Tetrahedron Spatial UI',
                          },
                          {
                            id: 'toolsForLife',
                            label: '🔧 Tools for Life',
                            icon: '🔧',
                            onClick: () => setShowToolsForLife(!showToolsForLife),
                            isActive: showToolsForLife,
                            variant: 'accent',
                            group: 'tools',
                            ariaLabel: 'Tools for Life',
                          },
                        ]}
                        onButtonClick={(id) => {
                          const buttonMap: Record<string, () => void> = {
                            moleculeBuilder: () => setShowMoleculeBuilder(!showMoleculeBuilder),
                            accessibility: () => setShowAccessibility(!showAccessibility),
                            simple: () => setShowSimple(!showSimple),
                            buffer: () => setShowBuffer(!showBuffer),
                            demoDashboard: () => setShowDemoDashboard(!showDemoDashboard),
                            scopeDashboard: () => setShowScopeDashboard(!showScopeDashboard),
                            mataDemo: () => setShowMATADemo(!showMATADemo),
                            worldBuilder: () => {
                              if (!showWorldBuilder) setCurrentWorldId('world-' + Date.now());
                              setShowWorldBuilder(!showWorldBuilder);
                            },
                            marketplace: () => setShowMarketplace(!showMarketplace),
                            willowsWorld: () => setShowWillowsWorld(!showWillowsWorld),
                            backyard: () => setShowBackyard(!showBackyard),
                            sprout: () => setShowSproutPanel(!showSproutPanel),
                            familyHub: () => setShowFamilyHub(!showFamilyHub),
                            scienceCenter: () => setShowScienceCenter(!showScienceCenter),
                            artArea: () => setShowArtArea(!showArtArea),
                            mathArea: () => setShowMathArea(!showMathArea),
                            vibeCoder: () => setShowVibeCoder(!showVibeCoder),
                            jitterbug: () => setShowJitterbug(!showJitterbug),
                            p31Language: () => setShowP31Language(!showP31Language),
                            p31Molecule: () => setShowP31Molecule(!showP31Molecule),
                            game: () => setShowGame(!showGame),
                            quantum: () => setShowQuantum(!showQuantum),
                            quantumNav: () => setShowQuantumNav(!showQuantumNav),
                            toolsForLife: () => setShowToolsForLife(!showToolsForLife),
                          };
                          buttonMap[id]?.();
                        }}
                        simplifiedUI={simplifiedUI}
                      />
                    </div>
                  </div>
                </div>

                {/* Simple Buffer Mode - Full Screen for Easy Access */}
                {showSimple && (
                  <div
                    className="absolute inset-0 bg-black bg-opacity-95 z-30 flex items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="simple-mode-title"
                  >
                    <h2 id="simple-mode-title" className="sr-only">
                      Simple Mode
                    </h2>
                    <button
                      onClick={() => setShowSimple(false)}
                      onKeyDown={(e) => handleButtonKeyDown(e, () => setShowSimple(false))}
                      className="absolute top-4 right-4 text-white hover:text-gray-400 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-white rounded"
                      aria-label="Close Simple Mode"
                    >
                      ✕
                    </button>
                    <SimpleBuffer />
                  </div>
                )}

                {/* Accessibility Panel */}
                {showAccessibility && (
                  <div
                    className="absolute top-20 right-4 w-96 max-h-[80vh] overflow-y-auto bg-black bg-opacity-90 border border-blue-500 rounded-lg p-4 z-20"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="accessibility-panel-title"
                  >
                    <h2 id="accessibility-panel-title" className="sr-only">
                      Accessibility Settings
                    </h2>
                    <button
                      onClick={() => setShowAccessibility(false)}
                      onKeyDown={(e) => handleButtonKeyDown(e, () => setShowAccessibility(false))}
                      className="absolute top-2 right-2 text-white hover:text-blue-400 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-blue-300 rounded"
                      aria-label="Close Accessibility Settings"
                    >
                      ✕
                    </button>
                    <AccessibilityPanel />
                  </div>
                )}

                {/* Buffer Dashboard Overlay */}
                {showBuffer && !showSimple && (
                  <div
                    className="absolute top-20 right-4 w-96 max-h-[80vh] overflow-y-auto bg-black bg-opacity-90 border border-purple-500 rounded-lg p-4 z-20"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="buffer-dashboard-title"
                  >
                    <h2 id="buffer-dashboard-title" className="sr-only">
                      Buffer Dashboard
                    </h2>
                    <button
                      onClick={() => setShowBuffer(false)}
                      onKeyDown={(e) => handleButtonKeyDown(e, () => setShowBuffer(false))}
                      className="absolute top-2 right-2 text-white hover:text-purple-400 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-purple-300 rounded"
                      aria-label="Close Buffer Dashboard"
                    >
                      ✕
                    </button>
                    <BufferDashboard />
                  </div>
                )}

                {/* Quantum Control Panel Overlay */}
                {showQuantum && !showSimple && (
                  <div className="absolute top-20 left-4 w-96 max-h-[80vh] overflow-y-auto bg-black bg-opacity-90 border border-purple-500 rounded-lg p-4 z-20">
                    <button
                      onClick={() => setShowQuantum(false)}
                      onKeyDown={(e) => handleButtonKeyDown(e, () => setShowQuantum(false))}
                      className="absolute top-2 right-2 text-white hover:text-purple-400 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-4 focus:ring-purple-300 rounded"
                      aria-label="Close Quantum Control Panel"
                    >
                      ✕
                    </button>
                    <QuantumControlPanel />
                  </div>
                )}

                {/* Quantum Navigation - Full Screen Spatial UI */}
                {showQuantumNav && !showSimple && (
                  <div className="absolute inset-0 z-40 bg-black">
                    <button
                      onClick={() => setShowQuantumNav(false)}
                      className="absolute top-4 right-4 z-50 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg font-bold shadow-lg transition-all"
                      aria-label="Close Quantum Navigation"
                    >
                      ✕ Close Quantum Nav
                    </button>
                    <QuantumNavigation
                      onNavigate={(target) => {
                        console.log('Navigated to:', target);
                        // You can add navigation logic here
                      }}
                    />
                  </div>
                )}

                {/* Game Controls Overlay */}
                {showGame && !showSimple && (
                  <div className="absolute top-20 left-4 w-80 max-h-[80vh] overflow-y-auto bg-black bg-opacity-90 border border-orange-500 rounded-lg p-4 z-20">
                    <button
                      onClick={() => setShowGame(false)}
                      className="absolute top-2 right-2 text-white hover:text-orange-400"
                      aria-label="Close Game Controls"
                    >
                      ✕
                    </button>
                    <GameControls />
                  </div>
                )}

                {/* Family Co-Op Mode Overlay */}
                {showFamilyCoOp && !showSimple && (
                  <div className="absolute top-20 right-4 w-[600px] max-h-[80vh] overflow-y-auto bg-black bg-opacity-95 border-2 border-pink-500 rounded-lg p-6 z-20">
                    <button
                      onClick={() => setShowFamilyCoOp(false)}
                      className="absolute top-2 right-2 text-white hover:text-pink-400 text-2xl"
                      aria-label="Close Family Co-Op"
                    >
                      ✕
                    </button>
                    <FamilyCoOpView />
                  </div>
                )}

                {/* Family Coding Mode Overlay */}
                {showFamilyCoding && !showSimple && (
                  <div className="absolute top-20 left-4 w-[90vw] max-w-[1400px] max-h-[85vh] overflow-y-auto bg-black bg-opacity-95 border-2 border-cyan-500 rounded-lg p-6 z-20">
                    <button
                      onClick={() => setShowFamilyCoding(false)}
                      className="absolute top-2 right-2 text-white hover:text-cyan-400 text-2xl"
                      aria-label="Close Family Coding"
                    >
                      ✕
                    </button>
                    <FamilyCodingView />
                  </div>
                )}

                {/* P31 Language Editor Overlay */}
                {showP31Language && !showSimple && (
                  <div className="absolute top-20 left-4 w-[90vw] max-w-[1600px] max-h-[85vh] overflow-y-auto bg-black bg-opacity-95 border-2 border-purple-500 rounded-lg p-6 z-20">
                    <button
                      onClick={() => setShowP31Language(false)}
                      className="absolute top-2 right-2 text-white hover:text-purple-400 text-2xl"
                      aria-label="Close P31 Language Editor"
                    >
                      ✕
                    </button>
                    <P31LanguageEditor />
                  </div>
                )}

                {/* Infinite Synergy Overlay */}
                {showInfiniteSynergy && !showSimple && (
                  <div className="absolute top-20 left-4 w-[90vw] max-w-[1600px] max-h-[85vh] overflow-y-auto bg-black bg-opacity-95 border-2 border-purple-500 rounded-lg p-6 z-20">
                    <button
                      onClick={() => setShowInfiniteSynergy(false)}
                      className="absolute top-2 right-2 text-white hover:text-purple-400 text-2xl"
                      aria-label="Close Infinite Synergy"
                    >
                      ✕
                    </button>
                    <InfiniteSynergyView />
                  </div>
                )}

                {/* Molecule Builder Hero - Full Screen Centerpiece */}
                {showMoleculeBuilder && !showSimple && (
                  <div className="absolute inset-0 z-30">
                    <button
                      onClick={() => setShowMoleculeBuilder(false)}
                      className="absolute top-4 right-4 text-white hover:text-gray-400 text-2xl z-40 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm"
                      aria-label="Close Molecule Builder"
                    >
                      ✕
                    </button>
                    <MoleculeBuilderHero />
                  </div>
                )}

                {/* Willow's World - Full Screen */}
                {showWillowsWorld && !showSimple && (
                  <div className="absolute inset-0 z-30">
                    <button
                      onClick={() => setShowWillowsWorld(false)}
                      className="absolute top-4 right-4 text-white hover:text-gray-400 text-2xl z-40 bg-black bg-opacity-50 rounded-full w-12 h-12 flex items-center justify-center backdrop-blur-sm"
                      aria-label="Close Willow's World"
                    >
                      ✕
                    </button>
                    <WillowsWorld />
                  </div>
                )}

                {/* P31 Molecule Viewer - Full Screen */}
                {showP31Molecule && (
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 z-40">
                    <button
                      onClick={() => setShowP31Molecule(false)}
                      className="absolute top-4 right-4 z-50 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg font-bold shadow-lg transition-all"
                      aria-label="Close P31 Molecule Viewer"
                    >
                      ✕ Close P31 Molecule
                    </button>
                    <P31MoleculeViewer />
                  </div>
                )}

                {/* Science Center - Full Screen */}
                {showScienceCenter && (
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 z-40">
                    <button
                      onClick={() => setShowScienceCenter(false)}
                      className="absolute top-4 right-4 z-50 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg font-bold shadow-lg transition-all"
                      aria-label="Close Science Center"
                    >
                      ✕ Close Science Center
                    </button>
                    <ScienceCenter />
                  </div>
                )}

                {/* Family Hub - Full Screen */}
                {showFamilyHub && (
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 z-40">
                    <button
                      onClick={() => setShowFamilyHub(false)}
                      className="absolute top-4 right-4 z-50 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg font-bold shadow-lg transition-all"
                      aria-label="Close Family Hub"
                    >
                      ✕ Close Family Hub
                    </button>
                    <FamilyHub />
                  </div>
                )}

                {/* Bash's Backyard Shenanigans - Full Screen */}
                {showBackyard && (
                  <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-green-300 to-yellow-300 z-40">
                    <button
                      onClick={() => setShowBackyard(false)}
                      className="absolute top-4 right-4 z-50 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg font-bold shadow-lg transition-all"
                      aria-label="Close Backyard"
                    >
                      ✕ Close Backyard
                    </button>
                    <BackyardShenanigans />
                  </div>
                )}

                {/* Art Area - Full Screen */}
                {showArtArea && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 z-40">
                    <button
                      onClick={() => setShowArtArea(false)}
                      className="absolute top-4 right-4 z-50 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg font-bold shadow-lg transition-all"
                      aria-label="Close Art Area"
                    >
                      ✕ Close Art Area
                    </button>
                    <ArtArea />
                  </div>
                )}

                {/* VibeCoder - Full Screen */}
                {showVibeCoder && (
                  <div className="fullscreen-container">
                    <button
                      onClick={() => setShowVibeCoder(false)}
                      className="absolute top-4 right-4 z-50 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg font-bold shadow-lg transition-all"
                      aria-label="Close VibeCoder"
                    >
                      ✕ Close VibeCoder
                    </button>
                    <VibeCoder />
                  </div>
                )}

                {/* Jitterbug Visualizer - Full Screen */}
                {showJitterbug && (
                  <div className="absolute inset-0 z-40 bg-black">
                    <button
                      onClick={() => setShowJitterbug(false)}
                      className="absolute top-4 right-4 z-50 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 px-4 py-2 rounded-lg font-bold shadow-lg transition-all"
                      aria-label="Close Jitterbug Visualizer"
                    >
                      ✕ Close Jitterbug
                    </button>
                    <JitterbugVisualizer />
                  </div>
                )}

                {/* MATA Demo Dashboard - Full Screen Telemetry */}
                {showDemoDashboard && (
                  <div className="absolute inset-0 z-40 bg-[#050510]">
                    <button
                      onClick={() => setShowDemoDashboard(false)}
                      onKeyDown={(e) => handleButtonKeyDown(e, () => setShowDemoDashboard(false))}
                      className="absolute top-4 left-4 z-50 bg-[#2ecc71] hover:opacity-90 text-[#050510] px-4 py-2 rounded-lg font-bold shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#2ecc71]"
                      aria-label="Close Demo Dashboard"
                    >
                      ✕ Close Demo
                    </button>
                    <DemoDashboard />
                  </div>
                )}

                {showSproutPanel && (
                  <div className="absolute inset-0 z-40 bg-[#050510] overflow-auto">
                    <button
                      type="button"
                      onClick={() => setShowSproutPanel(false)}
                      onKeyDown={(e) => handleButtonKeyDown(e, () => setShowSproutPanel(false))}
                      className="absolute top-4 left-4 z-50 bg-[#2ecc71] hover:opacity-90 text-[#050510] px-4 py-2 rounded-lg font-bold shadow-lg transition-all focus:outline-none focus:ring-4 focus:ring-[#2ecc71] min-h-[44px]"
                      aria-label="Close P31 Sprout"
                    >
                      ✕ Back
                    </button>
                    <SproutErrorBoundary>
                      <P31SproutPanel />
                    </SproutErrorBoundary>
                  </div>
                )}
              </div>
            </div>
            )}
            </GeodesicRoomProvider>
          </GameEngineProvider>
        </ToolsForLifeProvider>
      </AssistiveTechProvider>
      </BuddyUserProvider>
    </AccessibilityProvider>
  );
}

export default App;
