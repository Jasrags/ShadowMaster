"use client";

/**
 * CreationErrorBoundary
 *
 * Error boundary for the character creation flow.
 * Catches React errors and displays a recovery UI instead of crashing
 * the entire page and losing unsaved work.
 *
 * Features:
 * - Shows last saved timestamp if available
 * - Provides "Try Again" button to attempt recovery
 * - Provides "Return to Characters" link as fallback
 * - Logs errors for debugging
 */

import React, { Component, ReactNode } from "react";
import { AlertCircle, RefreshCw, ArrowLeft } from "lucide-react";
import Link from "next/link";

// =============================================================================
// TYPES
// =============================================================================

interface CreationErrorBoundaryProps {
  children: ReactNode;
  /** Last saved timestamp to display in error UI */
  lastSaved?: Date | null;
  /** Character ID for potential recovery */
  characterId?: string | null;
  /** Callback when user clicks "Try Again" */
  onReset?: () => void;
}

interface CreationErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

// =============================================================================
// COMPONENT
// =============================================================================

export class CreationErrorBoundary extends Component<
  CreationErrorBoundaryProps,
  CreationErrorBoundaryState
> {
  constructor(props: CreationErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<CreationErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error for debugging
    console.error("Character creation error:", error);
    console.error("Component stack:", errorInfo.componentStack);

    this.setState({ errorInfo });

    // TODO: Send to error tracking service (e.g., Sentry)
    // if (typeof window !== "undefined" && window.Sentry) {
    //   window.Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
    // }
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    this.props.onReset?.();
  };

  formatLastSaved(): string {
    const { lastSaved } = this.props;
    if (!lastSaved) return "Unknown";

    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);

    if (seconds < 60) {
      return "Just now";
    } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else {
      return lastSaved.toLocaleTimeString();
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const { characterId } = this.props;
      const { error } = this.state;

      return (
        <div className="flex min-h-[400px] items-center justify-center p-8">
          <div className="w-full max-w-md text-center">
            {/* Error Icon */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>

            {/* Error Message */}
            <h2 className="mb-2 text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              Something went wrong
            </h2>
            <p className="mb-6 text-zinc-600 dark:text-zinc-400">
              An error occurred while loading the character creation page.
              Your progress may have been saved automatically.
            </p>

            {/* Last Saved Info */}
            <div className="mb-6 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
              <div className="text-sm text-zinc-600 dark:text-zinc-400">
                Last saved: <span className="font-medium text-zinc-900 dark:text-zinc-100">{this.formatLastSaved()}</span>
              </div>
              {characterId && (
                <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                  Character ID: {characterId}
                </div>
              )}
            </div>

            {/* Error Details (collapsed by default in production) */}
            {process.env.NODE_ENV === "development" && error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300">
                  Show error details
                </summary>
                <pre className="mt-2 overflow-auto rounded-lg bg-zinc-900 p-4 text-xs text-red-400">
                  {error.message}
                  {error.stack && (
                    <>
                      {"\n\n"}
                      {error.stack}
                    </>
                  )}
                </pre>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <Link
                href="/characters"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
              >
                <ArrowLeft className="h-4 w-4" />
                Return to Characters
              </Link>
            </div>

            {/* Recovery Suggestion */}
            {characterId && (
              <p className="mt-6 text-xs text-zinc-500 dark:text-zinc-500">
                If the error persists, try{" "}
                <Link
                  href={`/characters/create/sheet?characterId=${characterId}`}
                  className="text-emerald-600 hover:underline dark:text-emerald-400"
                >
                  reloading this character
                </Link>{" "}
                or starting a new one.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default CreationErrorBoundary;
