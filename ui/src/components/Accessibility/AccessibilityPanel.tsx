/**
 * Accessibility Panel
 * Easy-to-use settings for all users
 */

import React from 'react';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import { SimpleButton } from './SimpleButton';

export const AccessibilityPanel: React.FC = () => {
  const {
    mode,
    fontSize,
    contrast,
    audioFeedback,
    hapticFeedback,
    screenReader,
    simplifiedUI,
    voiceCommands,
    animationReduced,
    setMode,
    setFontSize,
    setContrast,
    toggleAudioFeedback,
    toggleHapticFeedback,
    toggleScreenReader,
    toggleSimplifiedUI,
    toggleVoiceCommands,
    toggleAnimationReduced,
    applyPreset,
  } = useAccessibilityStore();

  return (
    <div className="accessibility-panel">
      <h2>Accessibility Settings</h2>
      <p className="subtitle">Make P31 work for you</p>

      {/* Quick Presets */}
      <div className="presets-section">
        <h3>Quick Presets</h3>
        <div className="preset-buttons">
          <SimpleButton
            label="👶 Child Mode"
            onClick={() => applyPreset('child')}
            variant={mode === 'child' ? 'primary' : 'secondary'}
            size="large"
          />
          <SimpleButton
            label="👵 Senior Mode"
            onClick={() => applyPreset('senior')}
            variant={mode === 'senior' ? 'primary' : 'secondary'}
            size="large"
          />
          <SimpleButton
            label="⚙️ Standard"
            onClick={() => applyPreset('standard')}
            variant={mode === 'standard' ? 'primary' : 'secondary'}
            size="large"
          />
        </div>
      </div>

      {/* Font Size */}
      <div className="setting-section">
        <h3>Text Size</h3>
        <div className="setting-buttons">
          {(['small', 'medium', 'large', 'xlarge'] as const).map((size) => (
            <SimpleButton
              key={size}
              label={
                size === 'small'
                  ? 'Small'
                  : size === 'medium'
                    ? 'Medium'
                    : size === 'large'
                      ? 'Large'
                      : 'Extra Large'
              }
              onClick={() => setFontSize(size)}
              variant={fontSize === size ? 'primary' : 'secondary'}
              size="medium"
            />
          ))}
        </div>
      </div>

      {/* Contrast */}
      <div className="setting-section">
        <h3>Contrast</h3>
        <div className="setting-buttons">
          <SimpleButton
            label="Normal"
            onClick={() => setContrast('normal')}
            variant={contrast === 'normal' ? 'primary' : 'secondary'}
            size="medium"
          />
          <SimpleButton
            label="High Contrast"
            onClick={() => setContrast('high')}
            variant={contrast === 'high' ? 'primary' : 'secondary'}
            size="medium"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="toggles-section">
        <h3>Features</h3>
        <div className="toggle-list">
          <label className="toggle-item">
            <input type="checkbox" checked={audioFeedback} onChange={toggleAudioFeedback} />
            <span>Sound Feedback</span>
          </label>
          <label className="toggle-item">
            <input type="checkbox" checked={hapticFeedback} onChange={toggleHapticFeedback} />
            <span>Vibration Feedback</span>
          </label>
          <label className="toggle-item">
            <input type="checkbox" checked={screenReader} onChange={toggleScreenReader} />
            <span>Screen Reader Support</span>
          </label>
          <label className="toggle-item">
            <input type="checkbox" checked={simplifiedUI} onChange={toggleSimplifiedUI} />
            <span>Simplified Interface</span>
          </label>
          <label className="toggle-item">
            <input type="checkbox" checked={voiceCommands} onChange={toggleVoiceCommands} />
            <span>Voice Commands</span>
          </label>
          <label className="toggle-item">
            <input type="checkbox" checked={animationReduced} onChange={toggleAnimationReduced} />
            <span>Reduce Motion</span>
          </label>
        </div>
      </div>

      <style>{`
        .accessibility-panel {
          padding: 2rem;
          max-width: 800px;
          margin: 0 auto;
        }

        .subtitle {
          color: #999;
          margin-bottom: 2rem;
        }

        .presets-section,
        .setting-section,
        .toggles-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
        }

        .preset-buttons,
        .setting-buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .toggle-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .toggle-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          cursor: pointer;
        }

        .toggle-item input[type="checkbox"] {
          width: 24px;
          height: 24px;
          cursor: pointer;
        }

        .toggle-item span {
          font-size: 1.125rem;
        }
      `}</style>
    </div>
  );
};
