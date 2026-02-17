/**
 * P31 Buddy — parent view: manage codenames, optional private real name, daily limits.
 * All UI shows codenames only; real name is optional and for parent's private reference only.
 */

import { useState } from 'react';
import { useBuddyUser } from '../../contexts/BuddyUserContext';

const PARENT_REAL_NAME_KEY = 'p31_parent_real_name'; // private, local only
const DAILY_LIMIT_KEY = 'p31_buddy_daily_limit_min';
const DEFAULT_DAILY_LIMIT = 120;

export interface ParentDashboardProps {
  onClose?: () => void;
  className?: string;
}

export function ParentDashboard({ onClose, className = '' }: ParentDashboardProps) {
  const { codename, setCodename, memory, refreshMemory } = useBuddyUser();
  const [newCodename, setNewCodename] = useState(codename);
  const [privateRealName, setPrivateRealName] = useState(() => {
    if (typeof localStorage === 'undefined') return '';
    return localStorage.getItem(PARENT_REAL_NAME_KEY) ?? '';
  });
  const [dailyLimit, setDailyLimit] = useState(() => {
    if (typeof localStorage === 'undefined') return DEFAULT_DAILY_LIMIT;
    const v = localStorage.getItem(DAILY_LIMIT_KEY);
    return v ? Math.max(0, parseInt(v, 10)) : DEFAULT_DAILY_LIMIT;
  });

  const handleSaveCodename = async () => {
    const trimmed = newCodename.trim();
    if (trimmed.length >= 1 && trimmed.length <= 24) {
      await setCodename(trimmed);
      await refreshMemory();
    }
  };

  const handleSaveRealName = () => {
    localStorage.setItem(PARENT_REAL_NAME_KEY, privateRealName.trim());
  };

  const handleSaveDailyLimit = () => {
    const n = Math.max(0, Math.min(24 * 60, dailyLimit));
    setDailyLimit(n);
    localStorage.setItem(DAILY_LIMIT_KEY, String(n));
  };

  const lastSeen = memory?.lastSeen
    ? new Date(memory.lastSeen).toLocaleDateString(undefined, { dateStyle: 'short', timeStyle: 'short' })
    : '—';

  return (
    <div
      className={`rounded-lg border border-[rgba(46,204,113,0.4)] bg-black/90 p-4 text-white ${className}`}
      role="region"
      aria-label="Parent dashboard"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-green-400">Parent dashboard</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none"
            aria-label="Close parent dashboard"
          >
            ×
          </button>
        )}
      </div>

      <div className="space-y-4">
        <section>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Codename (shown everywhere)</h3>
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="text"
              value={newCodename}
              onChange={(e) => setNewCodename(e.target.value.slice(0, 24))}
              placeholder="Codename"
              maxLength={24}
              className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white w-40 focus:border-green-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSaveCodename}
              className="rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
            >
              Update
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Last active: {lastSeen}</p>
        </section>

        <section>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Real name (private, this device only)</h3>
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="text"
              value={privateRealName}
              onChange={(e) => setPrivateRealName(e.target.value)}
              placeholder="For your reference only"
              className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white w-48 focus:border-green-500 focus:outline-none"
              aria-describedby="real-name-hint"
            />
            <button
              type="button"
              onClick={handleSaveRealName}
              className="rounded border border-gray-600 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800"
            >
              Save
            </button>
          </div>
          <p id="real-name-hint" className="text-xs text-gray-500 mt-1">
            Never synced or shown in the app. Only you see this.
          </p>
        </section>

        <section>
          <h3 className="text-sm font-medium text-gray-400 mb-2">Daily time limit (minutes)</h3>
          <div className="flex gap-2 flex-wrap items-center">
            <input
              type="number"
              min={0}
              max={1440}
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value) || 0)}
              className="rounded border border-gray-600 bg-gray-900 px-3 py-2 text-white w-24 focus:border-green-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSaveDailyLimit}
              className="rounded bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
            >
              Update
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">0 = no limit. Enforced locally (optional feature).</p>
        </section>
      </div>
    </div>
  );
}

export default ParentDashboard;
