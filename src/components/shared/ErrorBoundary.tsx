'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/logger';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="p-6 my-6 bg-destructive/10 text-destructive border-2 border-destructive card-depth-2 flex flex-col items-center justify-center text-center">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-xs text-muted-foreground mb-4 max-w-md leading-relaxed">
            This tool encountered an unexpected crash while processing data. No files or inputs were uploaded to any server.
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 border-2 border-destructive transition-all hover:scale-105 active:scale-95 text-xs font-bold cursor-pointer"
          >
            Reset Tool
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
export default ErrorBoundary;
