'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="py-12 text-center px-6">
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-red-500/10 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-base font-bold text-theme-primary mb-1">{this.props.fallbackTitle || 'Something went wrong'}</h2>
          <p className="text-sm text-theme-tertiary mb-3">This section encountered an error.</p>
          <button
            className="text-sm text-xbee-primary font-medium hover:underline"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
