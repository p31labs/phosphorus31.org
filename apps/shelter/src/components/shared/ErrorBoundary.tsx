import { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[P31 Shelter] Uncaught error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-dvh bg-void text-primary font-mono flex flex-col items-center justify-center p-8 gap-4">
          <div className="text-2xl">⬡</div>
          <h1 className="text-sm font-bold tracking-[2px] text-phosphor">SHELTER RECOVERY</h1>
          <p className="text-[10px] text-white/30 text-center max-w-xs leading-relaxed">
            Something unexpected happened. Your data is safe — everything is stored locally on your device.
          </p>
          {this.state.error && (
            <pre className="text-[9px] text-rose/60 bg-rose/[0.04] border border-rose/10 rounded-lg px-4 py-2 max-w-sm overflow-auto">
              {this.state.error.message}
            </pre>
          )}
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
            }}
            className="px-6 py-2.5 rounded-lg bg-phosphor text-void text-[10px] font-bold
              tracking-[2px] cursor-pointer font-mono border-none"
          >
            TRY AGAIN
          </button>
          <button
            onClick={() => window.location.reload()}
            className="text-[9px] text-white/20 underline cursor-pointer bg-transparent border-none font-mono"
          >
            Full reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
