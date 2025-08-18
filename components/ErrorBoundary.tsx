"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Don't show error boundary for wallet connector errors
    if (error.message.includes("MetaMask") || 
        error.message.includes("Coinbase") || 
        error.message.includes("WalletConnect") ||
        error.message.includes("IndexedDB")) {
      console.warn("Wallet connector error caught, continuing normally:", error.message);
      return;
    }
  }

  public render() {
    if (this.state.hasError) {
      // Don't show error UI for wallet connector errors
      if (this.state.error?.message.includes("MetaMask") || 
          this.state.error?.message.includes("Coinbase") || 
          this.state.error?.message.includes("WalletConnect") ||
          this.state.error?.message.includes("IndexedDB")) {
        return this.props.children;
      }

      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
