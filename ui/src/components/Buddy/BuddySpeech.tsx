/**
 * P31 Buddy — speech bubble and optional TTS.
 * Buddy speaks to the player by codename only. Respects reduced motion and voice speed.
 */

import { useEffect, useRef } from 'react';
import { useAccessibilityStore } from '../../stores/accessibility.store';
import { useBuddyUser } from '../../contexts/BuddyUserContext';

export interface BuddySpeechProps {
  /** Message to show; use $name for codename placeholder */
  message: string;
  /** Optional TTS (uses SpeechSynthesis if enabled) */
  speak?: boolean;
  /** Duration in ms before hiding (0 = stay until dismissed) */
  autoHideMs?: number;
  onDismiss?: () => void;
  className?: string;
}

function fillCodename(text: string, codename: string): string {
  return text.replace(/\$name/g, codename);
}

export function BuddySpeech({
  message,
  speak = false,
  autoHideMs = 0,
  onDismiss,
  className = '',
}: BuddySpeechProps) {
  const { codename, memory } = useBuddyUser();
  const audioFeedback = useAccessibilityStore((s) => s.audioFeedback);
  const animationReduced = useAccessibilityStore((s) => s.animationReduced);
  const voiceSpeed = memory?.accessibility.voiceSpeed ?? 1;
  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  const displayText = fillCodename(message, codename);

  useEffect(() => {
    if (!speak || !audioFeedback || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(displayText);
    u.rate = Math.max(0.5, Math.min(2, voiceSpeed));
    u.lang = 'en-US';
    speechSynthesisRef.current = u;
    window.speechSynthesis.speak(u);
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [displayText, speak, audioFeedback, voiceSpeed]);

  useEffect(() => {
    if (autoHideMs <= 0 || !onDismiss) return;
    const t = setTimeout(onDismiss, autoHideMs);
    return () => clearTimeout(t);
  }, [autoHideMs, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Buddy says: ${displayText}`}
      className={`rounded-lg border border-[rgba(46,204,113,0.5)] bg-black/90 px-4 py-3 text-green-300 shadow-lg ${animationReduced ? '' : 'animate-in fade-in duration-300'} ${className}`}
      style={{ maxWidth: 'min(320px, 90vw)' }}
    >
      <p className="text-sm font-medium">{displayText}</p>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="mt-2 text-xs text-gray-400 hover:text-white underline focus:outline-none focus:ring-2 focus:ring-green-500 rounded"
          aria-label="Dismiss message"
        >
          Dismiss
        </button>
      )}
    </div>
  );
}

export default BuddySpeech;
