import React from 'react';
import { Link } from 'react-router-dom';
import {
  CpuChipIcon,
  SunIcon,
  MoonIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../../context/ThemeContext';

const THEME_LABELS = {
  quantum: { next: 'Clarity (Light)', icon: SunIcon },
  clarity: { next: 'Wonky (Expressive)', icon: SparklesIcon },
  wonky: { next: 'Quantum (Dark)', icon: MoonIcon },
};

const Header = ({ systemStatus, isConnected, onMenuToggle }) => {
  const { theme, toggleTheme } = useTheme();
  const themeInfo = THEME_LABELS[theme] || THEME_LABELS.quantum;
  const ThemeIcon = themeInfo.icon;

  return (
    <header className="border-b border-border bg-sidebar backdrop-blur-lg sticky top-0 z-30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: hamburger + brand */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-lg hover:bg-card text-muted hover:text-main transition-colors"
              aria-label="Toggle navigation menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-linear-to-r from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg">
                <CpuChipIcon className="w-5 h-5 text-white" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">SUPER CENTAUR</h1>
                <p className="text-xs text-muted hidden sm:block">Quantum Brain System</p>
              </div>
            </div>

            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                isConnected ? 'status-active' : 'status-error'
              }`}
              role="status"
              aria-label={`System status: ${systemStatus}`}
            >
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-success' : 'bg-error'}`} aria-hidden="true" />
              <span className="hidden lg:inline">{systemStatus}</span>
            </div>
          </div>

          {/* Right: theme toggle + AI assistant */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-card text-muted hover:text-main transition-colors"
              aria-label={`Switch to ${themeInfo.next} theme`}
              title={`Current: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
            >
              <ThemeIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <Link to="/chatbot" className="btn-secondary flex items-center space-x-2 text-sm">
              <ChatBubbleLeftRightIcon className="w-5 h-5" aria-hidden="true" />
              <span className="hidden sm:inline">AI Assistant</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
