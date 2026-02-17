/**
 * P31 Web — Error boundary. Calm fallback: "Something unexpected happened" + home link.
 * Logs to console only; never shows stack traces to user.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  homeHref?: string;
}

interface State {
  hasError: boolean;
}

export class WebErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[Web ErrorBoundary]', error.message, errorInfo.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const homeHref = this.props.homeHref ?? '/';
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#050510] p-8 text-center">
          <p className="text-lg font-medium text-white">Something unexpected happened</p>
          <a
            href={homeHref}
            className="text-[#2ecc71] underline hover:no-underline"
          >
            Go home
          </a>
        </div>
      );
    }
    return this.props.children;
  }
}
