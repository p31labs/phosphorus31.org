import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  ScaleIcon,
  HeartIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  CpuChipIcon,
  CommandLineIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  LockClosedIcon,
  BellAlertIcon,
  XMarkIcon,
  CloudIcon,
  BoltIcon,
  WalletIcon,
  CubeTransparentIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { path: '/', icon: HomeIcon, label: 'Dashboard' },
  { path: '/observer', icon: CommandLineIcon, label: 'Terminal' },
  { path: '/legal', icon: ScaleIcon, label: 'Legal AI' },
  { path: '/love-economy', icon: HeartIcon, label: 'L.O.V.E. Economy' },
  { path: '/medical', icon: ShieldCheckIcon, label: 'Medical Hub' },
  { path: '/google-drive', icon: CloudIcon, label: 'Google Drive' },
  { path: '/blockchain', icon: CurrencyDollarIcon, label: 'Blockchain' },
  { path: '/consciousness', icon: CpuChipIcon, label: 'Consciousness' },
  { path: '/chatbot', icon: ChatBubbleLeftRightIcon, label: 'Chatbot' },
  { path: '/family', icon: UserGroupIcon, label: 'Family Support' },
  { path: '/security', icon: LockClosedIcon, label: 'Security' },
  { path: '/alerts', icon: BellAlertIcon, label: 'Alerts' },
  { path: '/spoons', icon: BoltIcon, label: 'Spoon Budget' },
  { path: '/wallet', icon: WalletIcon, label: 'Family Wallet' },
  { path: '/game', icon: CubeTransparentIcon, label: "Constructor's Challenge" },
];

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <nav
      className={`sidebar w-64 bg-sidebar backdrop-blur-lg border-r border-border min-h-screen p-6 transition-all duration-300 ${isOpen ? 'open' : ''}`}
      aria-label="Main navigation"
    >
      {/* Mobile close button */}
      <div className="flex justify-end mb-4 md:hidden">
        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-card text-muted hover:text-main transition-colors"
          aria-label="Close navigation menu"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                isActive ? 'bg-card shadow-sm' : 'hover:bg-card/50'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted group-hover:text-primary'
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`font-medium text-sm ${
                    isActive ? 'text-main' : 'text-muted group-hover:text-main'
                  }`}
                >
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-auto pt-8 text-center text-xs text-muted">
        <p>With love and light</p>
        <p className="opacity-60">As above, so below</p>
      </div>
    </nav>
  );
};

export default Sidebar;
