/**
 * P31 Buddy — sensory settings (animation speed, particles, voice speed, contrast).
 * Persists to Buddy memory accessibility; syncs with global accessibility store where relevant.
 */

import { useBuddyUser } from '../../contexts/BuddyUserContext';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import * as buddyMemory from '../../lib/buddy/memory';

export interface SensorySettingsPanelProps {
  onClose?: () => void;
  className?: string;
}

export function SensorySettingsPanel({ onClose, className = '' }: SensorySettingsPanelProps) {
  const { userId, memory, refreshMemory } = useBuddyUser();
  const animationReduced = useAccessibilityStore((s) => s.animationReduced);
  const toggleAnimationReduced = useAccessibilityStore((s) => s.toggleAnimationReduced);
  const contrast = useAccessibilityStore((s) => s.contrast);
  const setHighContrast = useAccessibilityStore((s) => s.setHighContrast);

  const accessibility = memory?.accessibility ?? {
    switchControl: false,
    voiceSpeed: 1,
    reducedMotion: false,
    highContrast: false,
  };

  const handleVoiceSpeed = async (speed: number) => {
    const next = Math.max(0.5, Math.min(2, speed));
    await buddyMemory.updateAccessibility(userId, { voiceSpeed: next });
    await refreshMemory();
  };

  const handleReduceMotion = () => {
    toggleAnimationReduced();
    buddyMemory.updateAccessibility(userId, { reducedMotion: !animationReduced }).then(() => refreshMemory());
  };

  const handleHighContrast = () => {
    const next = contrast !== 'high';
    setHighContrast(next);
    buddyMemory.updateAccessibility(userId, { highContrast: next }).then(() => refreshMemory());
  };

  const handleSwitchControl = () => {
    buddyMemory.updateAccessibility(userId, { switchControl: !accessibility.switchControl }).then(() => refreshMemory());
  };

  return (
    <div
      className={`rounded-lg border border-[rgba(46,204,113,0.4)] bg-black/90 p-4 text-white ${className}`}
      role="region"
      aria-label="Sensory settings"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-green-400">Sensory settings</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none"
            aria-label="Close sensory settings"
          >
            ×
          </button>
        )}
      </div>

      {/* Switch control — full navigation with switch / space */}
      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={accessibility.switchControl}
            onChange={handleSwitchControl}
            className="rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500"
          />
          <span className="text-sm text-gray-300">Switch control (navigate with switch or space)</span>
        </label>
      </div>

      {/* Voice speed (TTS) */}
      <div className="mb-4">
        <label htmlFor="voice-speed" className="block text-sm text-gray-300 mb-1">
          Buddy voice speed
        </label>
        <input
          id="voice-speed"
          type="range"
          min={0.5}
          max={2}
          step={0.1}
          value={accessibility.voiceSpeed}
          onChange={(e) => handleVoiceSpeed(Number(e.target.value))}
          className="w-full accent-green-500"
          aria-valuenow={accessibility.voiceSpeed}
          aria-valuemin={0.5}
          aria-valuemax={2}
        />
        <span className="text-xs text-gray-500 ml-2">{accessibility.voiceSpeed.toFixed(1)}×</span>
      </div>

      {/* Reduced motion */}
      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={animationReduced || accessibility.reducedMotion}
            onChange={handleReduceMotion}
            className="rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500"
          />
          <span className="text-sm text-gray-300">Reduce motion</span>
        </label>
      </div>

      {/* High contrast */}
      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={contrast === 'high' || accessibility.highContrast}
            onChange={handleHighContrast}
            className="rounded border-gray-600 bg-gray-800 text-green-500 focus:ring-green-500"
          />
          <span className="text-sm text-gray-300">High contrast</span>
        </label>
      </div>

      <p className="text-xs text-gray-500">
        These settings are saved with your Buddy profile and stay on this device.
      </p>
    </div>
  );
}

export default SensorySettingsPanel;
