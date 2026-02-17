/**
 * Accessibility Indicator
 * Shows current accessibility mode and quick access
 */

import React, { useState } from 'react';
import { useAccessibilityStore } from '../../stores/accessibility.store';

export const AccessibilityIndicator: React.FC = () => {
  const { mode, fontSize, contrast, simplifiedUI } = useAccessibilityStore();
  const [showTooltip, setShowTooltip] = useState(false);

  const getModeLabel = () => {
    switch (mode) {
      case 'child':
        return '👶 Child Mode';
      case 'senior':
        return '👵 Senior Mode';
      default:
        return '⚙️ Standard';
    }
  };

  return (
    <div
      className="accessibility-indicator"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="indicator-icon">♿</div>
      {showTooltip && (
        <div className="indicator-tooltip">
          <div className="tooltip-title">Accessibility Settings</div>
          <div className="tooltip-item">
            <span>Mode:</span> <strong>{getModeLabel()}</strong>
          </div>
          <div className="tooltip-item">
            <span>Text Size:</span> <strong>{fontSize}</strong>
          </div>
          <div className="tooltip-item">
            <span>Contrast:</span> <strong>{contrast}</strong>
          </div>
          <div className="tooltip-item">
            <span>Simplified:</span> <strong>{simplifiedUI ? 'Yes' : 'No'}</strong>
          </div>
          <div className="tooltip-shortcuts">
            <div>Shortcuts:</div>
            <div>Alt+1 = Child</div>
            <div>Alt+2 = Senior</div>
            <div>Alt+3 = Standard</div>
            <div>Alt+S = Toggle Simple</div>
            <div>Alt+C = Toggle Contrast</div>
          </div>
        </div>
      )}
    </div>
  );
};
