/**
 * P31 Sprout — Error boundary. Fallback: the four feeling buttons in static mode (no WebSocket).
 * Buttons still pressable for comfort. No error text, no stack traces.
 * Icons from config/p31-icons (same as P31SproutPanel).
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { P31_SIGNAL_ICONS, P31_ICON_MIN_SIZE_PX } from '../../config/p31-icons';

const STATIC_FEELINGS = [
  { id: 'ok', icon: P31_SIGNAL_ICONS.ok.char, label: P31_SIGNAL_ICONS.ok.label },
  { id: 'break', icon: P31_SIGNAL_ICONS.break.char, label: P31_SIGNAL_ICONS.break.label },
  { id: 'hug', icon: P31_SIGNAL_ICONS.hug.char, label: P31_SIGNAL_ICONS.hug.label },
  { id: 'help', icon: P31_SIGNAL_ICONS.help.char, label: P31_SIGNAL_ICONS.help.label },
];

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SproutErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[Sprout ErrorBoundary]', error.message, errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#050510] p-8">
          <h2 className="text-xl font-medium text-white">P31 Sprout</h2>
          <p className="text-sm text-gray-500">You're safe here. The mesh holds.</p>
          <div className="grid grid-cols-2 gap-3">
            {STATIC_FEELINGS.map((f) => (
              <button
                key={f.id}
                type="button"
                className="flex flex-col items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-white transition hover:bg-white/10"
                aria-label={f.label}
              >
                <span className="text-2xl" style={{ minWidth: P31_ICON_MIN_SIZE_PX, minHeight: P31_ICON_MIN_SIZE_PX }}>{f.icon}</span>
                <span className="text-sm">{f.label}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
