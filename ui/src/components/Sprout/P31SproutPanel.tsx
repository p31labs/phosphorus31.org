/**
 * P31 Sprout Panel — For the family (kids-first).
 * Feelings: I'm okay, I need a break, I need a hug, I need help.
 * When "I need help" is tapped, we signal the Buffer (no kid data).
 * Icons from config/p31-icons (child-friendly, cross-platform).
 */

import { useState } from 'react';
import { useSproutHelpStore } from '../../stores/sproutHelp.store';
import { emitSproutSignal } from '../../services/meshAdapter';
import { useMeshConnection } from '../../hooks/useMeshConnection';
import { P31_SIGNAL_ICONS, P31_SIGNAL_ICONS_EXTRA, P31_PRODUCT_ICONS, P31_ICON_MIN_SIZE_PX, P31_CONNECTION_DOT_SIZE_PX, P31_STATUS } from '../../config/p31-icons';
import './P31SproutPanel.css';

interface FeelingOption {
  id: string;
  icon: string;
  label: string;
  msg: string;
  calm?: boolean;
}

const QUICK_FEELINGS: FeelingOption[] = [
  { id: 'ok', icon: P31_SIGNAL_ICONS.ok.char, label: P31_SIGNAL_ICONS.ok.label, msg: "Got it. Take your time. 💜" },
  {
    id: 'break',
    icon: P31_SIGNAL_ICONS.break.char,
    label: P31_SIGNAL_ICONS.break.label,
    msg: "Let's keep things calm. Quiet mode on. 💚",
    calm: true,
  },
  { id: 'happy', icon: P31_SIGNAL_ICONS_EXTRA.happy.char, label: P31_SIGNAL_ICONS_EXTRA.happy.label, msg: "That's great! 🌟" },
  { id: 'quiet', icon: P31_SIGNAL_ICONS_EXTRA.quiet.char, label: P31_SIGNAL_ICONS_EXTRA.quiet.label, msg: 'Okay. No pressure. 🤫' },
  { id: 'hug', icon: P31_SIGNAL_ICONS.hug.char, label: P31_SIGNAL_ICONS.hug.label, msg: "Sending a virtual hug. You're not alone. 💜" },
  {
    id: 'help',
    icon: P31_SIGNAL_ICONS.help.char,
    label: P31_SIGNAL_ICONS.help.label,
    msg: "It's okay to need help. Someone can come. 💜",
  },
];

const DEFAULT_WINS = ['Got dressed', 'Ate breakfast'];

export function P31SproutPanel() {
  const [feeling, setFeeling] = useState<string | null>(null);
  const [wins, setWins] = useState<string[]>(DEFAULT_WINS);
  const [newWin, setNewWin] = useState('');
  const requestHelp = useSproutHelpStore((s) => s.requestHelp);
  const { reconnecting } = useMeshConnection();

  const onFeeling = (f: FeelingOption) => {
    setFeeling(f.id);
    if (f.id === 'help') {
      requestHelp(); // Surfaces in Buffer: "Someone needs help" + draft prompt. No kid data.
    }
    if (f.calm || f.id === 'break' || f.id === 'quiet') {
      emitSproutSignal('break'); // Optional: send to mesh (Whale Channel) when NODE ONE is connected.
    }
  };

  const addWin = () => {
    const t = newWin.trim();
    if (t) {
      setWins((w) => [...w, t]);
      setNewWin('');
    }
  };

  const feelingMsg = feeling ? QUICK_FEELINGS.find((f) => f.id === feeling) : null;

  return (
    <div className="p31-sprout-panel">
      {/* Reconnecting: subtle amber dot only. No error text. */}
      {reconnecting && (
        <div
          className="absolute top-4 right-4 flex items-center gap-2 font-mono text-[10px] text-amber-400"
          role="status"
          aria-live="polite"
        >
          <span className="rounded-full animate-pulse" style={{ width: P31_CONNECTION_DOT_SIZE_PX, height: P31_CONNECTION_DOT_SIZE_PX, background: P31_STATUS.connectionReconnecting, boxShadow: `0 0 6px ${P31_STATUS.connectionReconnecting}` }} aria-hidden />
          Reconnecting...
        </div>
      )}
      <h2 className="p31-sprout-title">P31 Sprout</h2>
      <p className="p31-sprout-subtitle">
        For the family. You're safe. The mesh holds. {P31_PRODUCT_ICONS.protocol}
      </p>
      <div className="p31-sprout-safe-badge" aria-hidden>
        {P31_PRODUCT_ICONS.shelter} You're safe here
      </div>

      <section className="p31-sprout-card p31-sprout-card-feelings" aria-labelledby="feelings-heading">
        <h3 id="feelings-heading" className="p31-sprout-card-label">
          How are you right now?
        </h3>
        <div className="p31-sprout-feelings-grid">
          {QUICK_FEELINGS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onFeeling(f)}
              className={`p31-sprout-feeling-btn ${feeling === f.id ? 'active' : ''}`}
              aria-pressed={feeling === f.id}
              aria-label={f.label}
            >
              <span className="p31-sprout-feeling-emoji" style={{ minWidth: P31_ICON_MIN_SIZE_PX, minHeight: P31_ICON_MIN_SIZE_PX, fontSize: '1.75rem' }}>{f.icon}</span>
              <span className="p31-sprout-feeling-label">{f.label}</span>
            </button>
          ))}
        </div>
        {feelingMsg && (
          <div className="p31-sprout-feeling-msg" role="status">
            {feelingMsg.msg}
          </div>
        )}
      </section>

      <section className="p31-sprout-card p31-sprout-card-wins" aria-labelledby="wins-heading">
        <h3 id="wins-heading" className="p31-sprout-card-label">
          Today's wins
        </h3>
        <ul className="p31-sprout-wins-list">
          {wins.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
        <div className="p31-sprout-add-win">
          <input
            type="text"
            value={newWin}
            onChange={(e) => setNewWin(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addWin()}
            placeholder="Add a win..."
            className="p31-sprout-win-input"
            aria-label="Add a win"
          />
          <button type="button" onClick={addWin} className="p31-sprout-win-add-btn">
            Add
          </button>
        </div>
      </section>

      <p className="p31-sprout-footer">For families · Kids first.</p>
    </div>
  );
}
