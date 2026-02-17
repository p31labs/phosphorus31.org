/**
 * Enhanced Toolbar Component
 * Organized, responsive toolbar with grouped buttons and better UX
 */

import React, { useState, useCallback } from 'react';
import './Toolbar.css';

interface ToolbarButton {
  id: string;
  label: string;
  icon?: string;
  onClick: () => void;
  isActive: boolean;
  variant?: 'primary' | 'secondary' | 'accent' | 'danger';
  group?: string;
  ariaLabel: string;
}

interface ToolbarGroup {
  id: string;
  label: string;
  buttons: ToolbarButton[];
  collapsible?: boolean;
}

interface ToolbarProps {
  buttons: ToolbarButton[];
  onButtonClick: (id: string) => void;
  simplifiedUI?: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  buttons,
  onButtonClick,
  simplifiedUI = false,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['core', 'family']));
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Group buttons by category
  const groupedButtons = React.useMemo(() => {
    const groups: Record<string, ToolbarButton[]> = {
      core: [],
      family: [],
      creative: [],
      tools: [],
      other: [],
    };

    buttons.forEach((button) => {
      const group = button.group || 'other';
      if (groups[group]) {
        groups[group].push(button);
      } else {
        groups.other.push(button);
      }
    });

    return groups;
  }, [buttons]);

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }, []);

  const getButtonClasses = (button: ToolbarButton) => {
    const base =
      'toolbar-button px-4 py-2 rounded-lg font-medium min-h-[44px] flex items-center justify-center gap-2 focus:outline-none focus:ring-4 relative';
    const variantClasses = {
      primary:
        'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-cyan-500/50 focus:ring-cyan-300',
      secondary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-300',
      accent:
        'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-purple-500/50 focus:ring-purple-300',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-300',
    };

    const variant = button.variant || 'secondary';
    const activeClass = button.isActive
      ? 'toolbar-button-active ring-2 ring-offset-2 ring-offset-black ring-white'
      : '';

    return `${base} ${variantClasses[variant]} ${activeClass}`;
  };

  const handleButtonKeyDown = useCallback((e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);

  if (simplifiedUI) {
    return (
      <div className="flex flex-wrap gap-2 p-2 bg-black bg-opacity-50">
        {buttons.slice(0, 5).map((button) => (
          <button
            key={button.id}
            onClick={() => onButtonClick(button.id)}
            onKeyDown={(e) => handleButtonKeyDown(e, () => onButtonClick(button.id))}
            className={getButtonClasses(button)}
            aria-label={button.ariaLabel}
            aria-pressed={button.isActive}
          >
            {button.icon && <span>{button.icon}</span>}
            <span className="hidden sm:inline">{button.label}</span>
          </button>
        ))}
      </div>
    );
  }

  const builderButton = buttons.find((b) => b.id === 'moleculeBuilder');

  return (
    <div className="w-full">
      {/* Mobile: P31 Builder always visible + "More" menu toggle */}
      <div className="flex flex-wrap items-center gap-2 mb-2 lg:hidden">
        {builderButton && (
          <button
            onClick={() => onButtonClick(builderButton.id)}
            onKeyDown={(e) => handleButtonKeyDown(e, () => onButtonClick(builderButton.id))}
            className={getButtonClasses(builderButton)}
            aria-label={builderButton.ariaLabel}
            aria-pressed={builderButton.isActive}
          >
            <span>{builderButton.icon}</span>
            <span>{builderButton.label}</span>
          </button>
        )}
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="mobile-menu-toggle"
          aria-label="More tools (Settings, Buffer, World Builder, etc.)"
          aria-expanded={showMobileMenu}
        >
          {showMobileMenu ? '✕ Close' : '☰ More'}
        </button>
      </div>

      {/* Desktop/Expanded Mobile View */}
      <div className={`${showMobileMenu ? 'block' : 'hidden'} lg:block`}>
        <div className="flex flex-col lg:flex-row gap-2 flex-wrap">
          {/* Core Tools (hide P31 Builder here on mobile—it's shown in the row above) */}
          {groupedButtons.core.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {groupedButtons.core.map((button) => (
                <button
                  key={button.id}
                  onClick={() => onButtonClick(button.id)}
                  onKeyDown={(e) => handleButtonKeyDown(e, () => onButtonClick(button.id))}
                  className={`${getButtonClasses(button)}${button.id === 'moleculeBuilder' ? ' hidden lg:inline-flex' : ''}`}
                  aria-label={button.ariaLabel}
                  aria-pressed={button.isActive}
                >
                  {button.icon && <span>{button.icon}</span>}
                  <span>{button.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Family Section */}
          {groupedButtons.family.length > 0 && (
            <div className="flex flex-wrap gap-2 border-l-2 border-pink-500 pl-2">
              {groupedButtons.family.map((button) => (
                <button
                  key={button.id}
                  onClick={() => onButtonClick(button.id)}
                  onKeyDown={(e) => handleButtonKeyDown(e, () => onButtonClick(button.id))}
                  className={getButtonClasses(button)}
                  aria-label={button.ariaLabel}
                  aria-pressed={button.isActive}
                >
                  {button.icon && <span>{button.icon}</span>}
                  <span>{button.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Creative Tools */}
          {groupedButtons.creative.length > 0 && (
            <div className="flex flex-wrap gap-2 border-l-2 border-purple-500 pl-2">
              {groupedButtons.creative.map((button) => (
                <button
                  key={button.id}
                  onClick={() => onButtonClick(button.id)}
                  onKeyDown={(e) => handleButtonKeyDown(e, () => onButtonClick(button.id))}
                  className={getButtonClasses(button)}
                  aria-label={button.ariaLabel}
                  aria-pressed={button.isActive}
                >
                  {button.icon && <span>{button.icon}</span>}
                  <span>{button.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Other Tools */}
          {groupedButtons.tools.length > 0 && (
            <div className="flex flex-wrap gap-2 border-l-2 border-blue-500 pl-2">
              {groupedButtons.tools.map((button) => (
                <button
                  key={button.id}
                  onClick={() => onButtonClick(button.id)}
                  onKeyDown={(e) => handleButtonKeyDown(e, () => onButtonClick(button.id))}
                  className={getButtonClasses(button)}
                  aria-label={button.ariaLabel}
                  aria-pressed={button.isActive}
                >
                  {button.icon && <span>{button.icon}</span>}
                  <span>{button.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Other */}
          {groupedButtons.other.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {groupedButtons.other.map((button) => (
                <button
                  key={button.id}
                  onClick={() => onButtonClick(button.id)}
                  onKeyDown={(e) => handleButtonKeyDown(e, () => onButtonClick(button.id))}
                  className={getButtonClasses(button)}
                  aria-label={button.ariaLabel}
                  aria-pressed={button.isActive}
                >
                  {button.icon && <span>{button.icon}</span>}
                  <span>{button.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
