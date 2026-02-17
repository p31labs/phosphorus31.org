import React from 'react'
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo })
    if (import.meta.env.DEV) {
      console.error('Error caught by ErrorBoundary:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-page">
          <div className="card max-w-md mx-auto text-center">
            <div className="w-16 h-16 status-error rounded-full flex items-center justify-center mx-auto mb-4">
              <ExclamationTriangleIcon className="w-8 h-8" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-main mb-2">Something went wrong</h2>
            <p className="text-muted mb-6">
              The SUPER CENTAUR system encountered an error. Your data is safe.
            </p>
            <div className="space-y-3">
              <button onClick={() => window.location.reload()} className="btn-primary w-full">
                Refresh Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
                className="btn-secondary w-full"
              >
                Try Again
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-sm text-muted cursor-pointer">Error Details</summary>
                <pre className="text-xs text-muted mt-2 p-3 bg-surface rounded-lg overflow-auto max-h-40">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
