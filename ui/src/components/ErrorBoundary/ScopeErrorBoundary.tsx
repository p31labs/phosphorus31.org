/**
 * P31 Scope — Error boundary. Calm fallback: molecule mark + "Scope is restarting..." + refresh.
 * Logs to console only; never shows stack traces to user.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';

/** Inline Posner mark (avoids scope/Scope casing and legacy Scope deps). */
function PosnerMark({ className }: { className?: string }) {
  return (
    <svg width={40} height={40} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden>
      <circle cx="12" cy="6" r="2.5" fill="#2ecc71" opacity={0.4} />
      <circle cx="6" cy="18" r="2.5" fill="#60a5fa" opacity={0.4} />
      <circle cx="18" cy="18" r="2.5" fill="#2ecc71" opacity={0.4} />
      <circle cx="12" cy="12" r="2" fill="#2ecc71" opacity={0.4} />
      <line x1="12" y1="6" x2="12" y2="12" stroke="#4A4A7A" strokeWidth="0.8" opacity={0.4} />
      <line x1="6" y1="18" x2="12" y2="12" stroke="#4A4A7A" strokeWidth="0.8" opacity={0.4} />
      <line x1="18" y1="18" x2="12" y2="12" stroke="#4A4A7A" strokeWidth="0.8" opacity={0.4} />
    </svg>
  );
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ScopeErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[Scope ErrorBoundary]', error.message, errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex h-full min-h-[400px] flex-col items-center justify-center gap-4 bg-[#050510] p-8 text-center">
          <PosnerMark className="opacity-60" />
          <p className="text-lg font-medium text-white">Scope is restarting...</p>
          <p className="text-sm text-gray-500">Something unexpected happened. You can try again.</p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
            className="rounded-lg bg-[#2ecc71]/20 px-4 py-2 text-sm font-medium text-[#2ecc71] hover:bg-[#2ecc71]/30"
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
