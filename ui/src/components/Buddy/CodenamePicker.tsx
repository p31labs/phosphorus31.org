/**
 * P31 Buddy — first-time or change codename picker.
 * Shown when user has no codename set (e.g. fallback "Builder") or when explicitly editing.
 * Codenames are the only public identifier; real names never appear here.
 */

import React, { useState } from 'react';
import { useBuddyUser } from '../../contexts/BuddyUserContext';

const CODENAME_FALLBACK = 'Builder';
const MIN_LENGTH = 1;
const MAX_LENGTH = 24;

export interface CodenamePickerProps {
  /** Show as modal overlay (true) or inline card (false) */
  modal?: boolean;
  /** Callback when codename is set or picker is skipped */
  onComplete?: () => void;
  /** Force show even if codename already set (e.g. "Change codename" flow) */
  forceOpen?: boolean;
  className?: string;
}

export function CodenamePicker({
  modal = true,
  onComplete,
  forceOpen = false,
  className = '',
}: CodenamePickerProps) {
  const { codename, setCodename, memory, loading } = useBuddyUser();
  const [input, setInput] = useState(codename === CODENAME_FALLBACK ? '' : codename);
  const [error, setError] = useState('');

  const needsPick = (memory === null || codename === CODENAME_FALLBACK) && !loading;
  const show = forceOpen || needsPick;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed.length < MIN_LENGTH) {
      setError('Pick at least one character.');
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setError(`Keep it under ${MAX_LENGTH} characters.`);
      return;
    }
    setError('');
    await setCodename(trimmed);
    onComplete?.();
  };

  if (!show) return null;

  const content = (
    <div
      className={`rounded-lg border border-[rgba(46,204,113,0.5)] bg-black/95 p-6 text-white ${className}`}
      style={{ maxWidth: '360px' }}
    >
      <h2 className="text-lg font-bold text-green-400 mb-2">Choose your codename</h2>
      <p className="text-sm text-gray-400 mb-4">
        Buddy and the rest of P31 will use this name. Only you (and your parent, if they manage settings) see it here.
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="codename-input" className="sr-only">
          Codename
        </label>
        <input
          id="codename-input"
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value.slice(0, MAX_LENGTH));
            setError('');
          }}
          placeholder="e.g. Sunny, Bear, Star"
          maxLength={MAX_LENGTH}
          autoComplete="off"
          className="w-full rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? 'codename-error' : undefined}
        />
        {error && (
          <p id="codename-error" className="mt-2 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Save codename
          </button>
          {!forceOpen && (
            <button
              type="button"
              className="rounded border border-gray-600 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={() => {
                setCodename(CODENAME_FALLBACK);
                onComplete?.();
              }}
            >
              Skip (use Builder)
            </button>
          )}
        </div>
      </form>
    </div>
  );

  if (modal) {
    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="codename-picker-title"
      >
        <div id="codename-picker-title" className="sr-only">
          Choose your codename
        </div>
        {content}
      </div>
    );
  }

  return content;
}

export default CodenamePicker;
