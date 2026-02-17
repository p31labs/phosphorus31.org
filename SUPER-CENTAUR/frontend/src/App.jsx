import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// ── Route-based code splitting ─────────────────────────────────
const TheObserverDashboard = lazy(() => import('./components/TheObserverDashboard'));
const QuantumDashboard = lazy(() => import('./components/QuantumDashboard'));
const LegalPortal = lazy(() => import('./components/LegalPortal'));
const LoveEconomy = lazy(() => import('./components/LoveEconomy'));
const MedicalHub = lazy(() => import('./components/MedicalHub'));
const BlockchainConsole = lazy(() => import('./components/BlockchainConsole'));
const ConsciousnessMonitor = lazy(() => import('./components/ConsciousnessMonitor'));
const Chatbot = lazy(() => import('./components/Chatbot'));
const FamilySupport = lazy(() => import('./components/FamilySupport'));
const SecurityCenter = lazy(() => import('./components/SecurityCenter'));
const AlertsPage = lazy(() => import('./components/AlertsPage'));
const GoogleDrivePage = lazy(() => import('./components/GoogleDrivePage'));
const SpoonPage = lazy(() => import('./components/SpoonPage'));
const WalletPage = lazy(() => import('./components/WalletPage'));
const GamePage = lazy(() => import('./components/GamePage'));

const NotFound = () => (
  <div className="flex items-center justify-center h-full min-h-[50vh]">
    <div className="text-center">
      <h2 className="text-6xl font-bold gradient-text mb-4">404</h2>
      <p className="text-xl text-muted mb-6">Page not found</p>
      <a href="/" className="btn-primary px-6 py-2">Return to Dashboard</a>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<MainLayout><QuantumDashboard /></MainLayout>} />
          <Route path="/observer" element={<MainLayout><TheObserverDashboard /></MainLayout>} />
          <Route path="/legal" element={<MainLayout><LegalPortal /></MainLayout>} />
          <Route path="/love-economy" element={<MainLayout><LoveEconomy /></MainLayout>} />
          <Route path="/medical" element={<MainLayout><MedicalHub /></MainLayout>} />
          <Route path="/blockchain" element={<MainLayout><BlockchainConsole /></MainLayout>} />
          <Route path="/quantum" element={<MainLayout><QuantumDashboard /></MainLayout>} />
          <Route path="/consciousness" element={<MainLayout><ConsciousnessMonitor /></MainLayout>} />
          <Route path="/chatbot" element={<MainLayout><Chatbot /></MainLayout>} />
          <Route path="/family" element={<MainLayout><FamilySupport /></MainLayout>} />
          <Route path="/security" element={<MainLayout><SecurityCenter /></MainLayout>} />
          <Route path="/alerts" element={<MainLayout><AlertsPage /></MainLayout>} />
          <Route path="/google-drive" element={<MainLayout><GoogleDrivePage /></MainLayout>} />
          <Route path="/spoons" element={<MainLayout><SpoonPage /></MainLayout>} />
          <Route path="/wallet" element={<MainLayout><WalletPage /></MainLayout>} />
          <Route path="/game" element={<MainLayout><GamePage /></MainLayout>} />
          <Route path="*" element={<MainLayout><NotFound /></MainLayout>} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
