/**
 * P31 Router — / (QuantumHelloWorld), /mesh (PosnerHome), sub-routes as overlays,
 * /sprout (standalone full-screen).
 */

/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QuantumHelloWorld } from '../components/QuantumHelloWorld/QuantumHelloWorld';
import { MeshLayout } from '../components/MeshLayout';
import { PosnerHome } from '../components/PosnerHome';
import { MeshView } from '../views/MeshView';
import { ScopeView } from '../views/ScopeView';
import { FoldView } from '../views/FoldView';
import { WalletView } from '../views/WalletView';
import { ChallengesView } from '../views/ChallengesView';
import { SproutView } from '../views/SproutView';
import { IdentityView } from '../views/IdentityView';
import { DomeView } from '../views/DomeView';
import { ConnectionsView } from '../views/ConnectionsView';
import { BondingView } from '../views/BondingView';
import { MoleculeHubView } from '../views/MoleculeHubView';
const StudioView = React.lazy(() => import('../views/StudioView').then(m => ({ default: m.StudioView })));
const MoleculeBuilderHero = React.lazy(() => import('../components/Molecule/MoleculeBuilderHero').then(m => ({ default: m.MoleculeBuilderHero })));
const P31MoleculeViewer = React.lazy(() => import('../components/Molecule/P31MoleculeViewer').then(m => ({ default: m.P31MoleculeViewer })));

function PosnerMeshHome() {
  return <PosnerHome><MeshView /></PosnerHome>;
}
function PosnerScope() {
  return <PosnerHome><ScopeView /></PosnerHome>;
}
function PosnerFold() {
  return <PosnerHome><FoldView /></PosnerHome>;
}
function PosnerWallet() {
  return <PosnerHome><WalletView /></PosnerHome>;
}
function PosnerChallenges() {
  return <PosnerHome><ChallengesView /></PosnerHome>;
}
function PosnerIdentity() {
  return <PosnerHome><IdentityView /></PosnerHome>;
}
function PosnerDome() {
  return <PosnerHome><DomeView /></PosnerHome>;
}
function PosnerConnections() {
  return <PosnerHome><ConnectionsView /></PosnerHome>;
}
function PosnerBonding() {
  return <PosnerHome><BondingView /></PosnerHome>;
}
function PosnerStudio() {
  return (
    <PosnerHome>
      <React.Suspense fallback={<div style={{ color: '#7878AA', padding: 24 }}>Loading Studio...</div>}>
        <StudioView />
      </React.Suspense>
    </PosnerHome>
  );
}
function PosnerMoleculeHub() {
  return <PosnerHome><MoleculeHubView /></PosnerHome>;
}
function PosnerMoleculeBuilder() {
  return (
    <PosnerHome>
      <React.Suspense fallback={<div style={{ color: '#7878AA', padding: 24 }}>Loading 3D Molecule Builder...</div>}>
        <MoleculeBuilderHero />
      </React.Suspense>
    </PosnerHome>
  );
}
function PosnerMoleculeViewer() {
  return (
    <PosnerHome>
      <React.Suspense fallback={<div style={{ color: '#7878AA', padding: 24 }}>Loading P31 Viewer...</div>}>
        <P31MoleculeViewer />
      </React.Suspense>
    </PosnerHome>
  );
}

export function P31Routes(): React.ReactElement {
  return (
    <BrowserRouter>
      {/* @ts-ignore TS2786 — React 18 / react-router-dom ReactNode compatibility */}
      <Routes>
        {/* @ts-ignore */}
        <Route path="/" element={<QuantumHelloWorld />} />

        {/* Posner molecule navigation routes */}
        {/* @ts-ignore */}
        <Route path="/mesh" element={<PosnerMeshHome />} />
        {/* @ts-ignore */}
        <Route path="/scope" element={<PosnerScope />} />
        {/* @ts-ignore */}
        <Route path="/fold" element={<PosnerFold />} />
        {/* @ts-ignore */}
        <Route path="/wallet" element={<PosnerWallet />} />
        {/* @ts-ignore */}
        <Route path="/challenges" element={<PosnerChallenges />} />
        {/* @ts-ignore */}
        <Route path="/identity" element={<PosnerIdentity />} />
        {/* @ts-ignore */}
        <Route path="/dome/:fp" element={<PosnerDome />} />
        {/* @ts-ignore */}
        <Route path="/connections" element={<PosnerConnections />} />
        {/* @ts-ignore */}
        <Route path="/bonding" element={<PosnerBonding />} />
        {/* @ts-ignore */}
        <Route path="/studio" element={<PosnerStudio />} />
        {/* Molecule hub + 3D builder + P31 viewer */}
        {/* @ts-ignore */}
        <Route path="/molecule" element={<PosnerMoleculeHub />} />
        {/* @ts-ignore */}
        <Route path="/molecule/builder" element={<PosnerMoleculeBuilder />} />
        {/* @ts-ignore */}
        <Route path="/molecule/viewer" element={<PosnerMoleculeViewer />} />

        {/* Sprout: full-screen, its own universe */}
        {/* @ts-ignore */}
        <Route path="/sprout" element={<SproutView />} />

        {/* Fallback: old MeshLayout routes for direct URL navigation */}
        {/* @ts-ignore */}
        <Route element={<MeshLayout />}>
          {/* @ts-ignore */}
          <Route path="/apps" element={<Navigate to="/apps/index.html" replace />} />
        </Route>

        {/* @ts-ignore */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
