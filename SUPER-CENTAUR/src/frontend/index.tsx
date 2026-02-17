/**
 * Game Engine Entry Point
 * 
 * This file serves as the entry point for the Constructor's Challenge game.
 * It initializes the game engine and renders the React Three Fiber application.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { Toaster } from './components/ui/Toaster'; // TODO: Implement Toaster component
import GamePage from './pages/GamePage';

// Import CSS
import './index.css';

/**
 * Game Application Component
 */
const GameApp = () => {
  return (
    <Router>
      <div className="game-app">
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/game" element={<GamePage />} />
        </Routes>
        {/* <Toaster /> TODO: Implement Toaster component */}
      </div>
    </Router>
  );
};

/**
 * Initialize and render the game
 */
const initGame = async () => {
  try {
    // Create root element if it doesn't exist
    let rootElement = document.getElementById('root');
    if (!rootElement) {
      rootElement = document.createElement('div');
      rootElement.id = 'root';
      document.body.appendChild(rootElement);
    }

    // Render the game application
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <GameApp />
      </React.StrictMode>
    );

    console.log('🎮 Constructor\'s Challenge initialized successfully!');
    console.log('🎯 Game is ready to play at http://localhost:5173/');
    console.log('💡 Use keyboard shortcuts: 1-5 (pieces), W/M/C/Q (materials), +/- (scale), G (grid), V (snap), T (test)');
    
  } catch (error) {
    console.error('Failed to initialize game:', error);
    
    // Create error display
    const errorElement = document.createElement('div');
    errorElement.innerHTML = `
      <div style="min-height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-family: Arial, sans-serif;">
        <div style="text-align: center; background: rgba(0,0,0,0.5); padding: 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2);">
          <h1 style="font-size: 2rem; margin-bottom: 20px;">Constructor's Challenge</h1>
          <p style="font-size: 1.2rem; margin-bottom: 30px;">Game Engine Failed to Initialize</p>
          <p style="color: #ff6b6b; margin-bottom: 30px;">Error: ${error.message}</p>
          <button onclick="location.reload()" style="background: #4ecdc4; color: #000; border: none; padding: 15px 30px; border-radius: 6px; font-size: 1.1rem; cursor: pointer;">Reload Game</button>
        </div>
      </div>
    `;
    
    document.body.innerHTML = '';
    document.body.appendChild(errorElement);
  }
};

// Initialize game when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGame);
} else {
  initGame();
}

// Export for potential use in other modules
export { GameApp, initGame };