import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-page transition-colors duration-300">
      {/* Skip navigation link (accessibility) */}
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>

      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          systemStatus="Quantum Brain Active"
          isConnected={true}
          onMenuToggle={() => setSidebarOpen((prev) => !prev)}
        />
        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto" tabIndex={-1}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
