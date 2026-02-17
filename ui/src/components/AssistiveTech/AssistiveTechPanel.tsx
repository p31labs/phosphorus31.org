/**
 * Assistive Technology Panel
 * UI panel for configuring assistive technology features
 */

import React from 'react';
import { useAssistiveTech } from './AssistiveTechProvider';
import { SimpleButton } from '../Accessibility/SimpleButton';

export const AssistiveTechPanel: React.FC = () => {
  const {
    config,
    updateConfig,
    announce,
    triggerHaptic,
    startVoiceControl,
    stopVoiceControl,
    startSwitchControl,
    stopSwitchControl,
  } = useAssistiveTech();

  if (!config) {
    return <div>Loading assistive technology...</div>;
  }

  return (
    <div className="assistive-tech-panel">
      <h2>Assistive Technology Settings</h2>

      {/* Screen Reader */}
      <section className="setting-section">
        <h3>Screen Reader</h3>
        <label>
          <input
            type="checkbox"
            checked={config.screenReader.enabled}
            onChange={(e) =>
              updateConfig({
                screenReader: { ...config.screenReader, enabled: e.target.checked },
              })
            }
          />
          Enable Screen Reader Support
        </label>
        <label>
          Verbosity:
          <select
            value={config.screenReader.verbosity}
            onChange={(e) =>
              updateConfig({
                screenReader: { ...config.screenReader, verbosity: e.target.value as any },
              })
            }
          >
            <option value="minimal">Minimal</option>
            <option value="normal">Normal</option>
            <option value="verbose">Verbose</option>
          </select>
        </label>
        <SimpleButton
          label="Test Announcement"
          onClick={() => announce('This is a test announcement', 'polite')}
          variant="secondary"
          size="small"
        />
      </section>

      {/* Voice Control */}
      <section className="setting-section">
        <h3>Voice Control</h3>
        <label>
          <input
            type="checkbox"
            checked={config.voiceControl.enabled}
            onChange={(e) =>
              updateConfig({
                voiceControl: { ...config.voiceControl, enabled: e.target.checked },
              })
            }
          />
          Enable Voice Control
        </label>
        <div className="button-group">
          <SimpleButton
            label="🎤 Start Voice Control"
            onClick={startVoiceControl}
            variant="primary"
            size="small"
          />
          <SimpleButton
            label="⏹️ Stop Voice Control"
            onClick={stopVoiceControl}
            variant="secondary"
            size="small"
          />
        </div>
        <p className="help-text">Say commands like "start", "stop", "pause", "resume", or "help"</p>
      </section>

      {/* Switch Control */}
      <section className="setting-section">
        <h3>Switch Control</h3>
        <label>
          <input
            type="checkbox"
            checked={config.switchControl.enabled}
            onChange={(e) =>
              updateConfig({
                switchControl: { ...config.switchControl, enabled: e.target.checked },
              })
            }
          />
          Enable Switch Control
        </label>
        <label>
          Scan Speed (ms):
          <input
            type="number"
            value={config.switchControl.scanSpeed}
            onChange={(e) =>
              updateConfig({
                switchControl: { ...config.switchControl, scanSpeed: parseInt(e.target.value) },
              })
            }
            min="100"
            max="5000"
            step="100"
          />
        </label>
        <div className="button-group">
          <SimpleButton
            label="▶️ Start Scanning"
            onClick={startSwitchControl}
            variant="primary"
            size="small"
          />
          <SimpleButton
            label="⏹️ Stop Scanning"
            onClick={stopSwitchControl}
            variant="secondary"
            size="small"
          />
        </div>
      </section>

      {/* Haptic Feedback */}
      <section className="setting-section">
        <h3>Haptic Feedback</h3>
        <label>
          <input
            type="checkbox"
            checked={config.haptic.enabled}
            onChange={(e) =>
              updateConfig({
                haptic: { ...config.haptic, enabled: e.target.checked },
              })
            }
          />
          Enable Haptic Feedback
        </label>
        <label>
          Intensity:
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.haptic.intensity}
            onChange={(e) =>
              updateConfig({
                haptic: { ...config.haptic, intensity: parseFloat(e.target.value) },
              })
            }
          />
          {config.haptic.intensity}
        </label>
        <div className="button-group">
          <SimpleButton
            label="Test Success"
            onClick={() => triggerHaptic('success')}
            variant="success"
            size="small"
          />
          <SimpleButton
            label="Test Error"
            onClick={() => triggerHaptic('error')}
            variant="danger"
            size="small"
          />
          <SimpleButton
            label="Test Warning"
            onClick={() => triggerHaptic('warning')}
            variant="warning"
            size="small"
          />
          <SimpleButton
            label="Test Info"
            onClick={() => triggerHaptic('info')}
            variant="info"
            size="small"
          />
        </div>
      </section>

      {/* Visual Aids */}
      <section className="setting-section">
        <h3>Visual Aids</h3>
        <label>
          <input
            type="checkbox"
            checked={config.visualAids.highContrast}
            onChange={(e) =>
              updateConfig({
                visualAids: { ...config.visualAids, highContrast: e.target.checked },
              })
            }
          />
          High Contrast Mode
        </label>
        <label>
          Magnification:
          <input
            type="range"
            min="1"
            max="5"
            step="0.25"
            value={config.visualAids.magnification}
            onChange={(e) =>
              updateConfig({
                visualAids: { ...config.visualAids, magnification: parseFloat(e.target.value) },
              })
            }
          />
          {config.visualAids.magnification}x
        </label>
        <label>
          Color Blind Mode:
          <select
            value={config.visualAids.colorBlindMode}
            onChange={(e) =>
              updateConfig({
                visualAids: { ...config.visualAids, colorBlindMode: e.target.value as any },
              })
            }
          >
            <option value="none">None</option>
            <option value="protanopia">Protanopia</option>
            <option value="deuteranopia">Deuteranopia</option>
            <option value="tritanopia">Tritanopia</option>
          </select>
        </label>
        <label>
          Cursor Size:
          <select
            value={config.visualAids.cursorSize}
            onChange={(e) =>
              updateConfig({
                visualAids: { ...config.visualAids, cursorSize: e.target.value as any },
              })
            }
          >
            <option value="normal">Normal</option>
            <option value="large">Large</option>
            <option value="extra-large">Extra Large</option>
          </select>
        </label>
      </section>

      {/* Cognitive Support */}
      <section className="setting-section">
        <h3>Cognitive Support</h3>
        <label>
          <input
            type="checkbox"
            checked={config.cognitive.simplifiedUI}
            onChange={(e) =>
              updateConfig({
                cognitive: { ...config.cognitive, simplifiedUI: e.target.checked },
              })
            }
          />
          Simplified UI
        </label>
        <label>
          <input
            type="checkbox"
            checked={config.cognitive.stepByStep}
            onChange={(e) =>
              updateConfig({
                cognitive: { ...config.cognitive, stepByStep: e.target.checked },
              })
            }
          />
          Step-by-Step Guidance
        </label>
        <label>
          <input
            type="checkbox"
            checked={config.cognitive.reminders}
            onChange={(e) =>
              updateConfig({
                cognitive: { ...config.cognitive, reminders: e.target.checked },
              })
            }
          />
          Reminders
        </label>
      </section>

      <style>{`
        .assistive-tech-panel {
          padding: 2rem;
          background: rgba(0, 0, 0, 0.8);
          border-radius: 12px;
          color: white;
          max-width: 800px;
          margin: 0 auto;
        }

        .assistive-tech-panel h2 {
          margin-bottom: 2rem;
          font-size: 2rem;
          color: #FF69B4;
        }

        .setting-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 105, 180, 0.3);
        }

        .setting-section h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
          color: #87CEEB;
        }

        .setting-section label {
          display: block;
          margin-bottom: 0.75rem;
          font-size: 1.125rem;
        }

        .setting-section input[type="checkbox"] {
          margin-right: 0.5rem;
          width: 20px;
          height: 20px;
        }

        .setting-section input[type="number"],
        .setting-section input[type="range"],
        .setting-section select {
          margin-left: 0.5rem;
          padding: 0.5rem;
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(0, 0, 0, 0.5);
          color: white;
        }

        .button-group {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-top: 1rem;
        }

        .help-text {
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }
      `}</style>
    </div>
  );
};
