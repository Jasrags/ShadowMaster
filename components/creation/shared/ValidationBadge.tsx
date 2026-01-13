"use client";

/**
 * ValidationBadge
 *
 * Displays error/warning indicators for creation sections.
 * Shows a colored badge with count and icon.
 */

import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

type ValidationStatus = "valid" | "warning" | "error" | "pending";

interface ValidationBadgeProps {
  status: ValidationStatus;
  errorCount?: number;
  warningCount?: number;
  className?: string;
}

export function ValidationBadge({
  status,
  errorCount = 0,
  warningCount = 0,
  className = "",
}: ValidationBadgeProps) {
  if (status === "valid") {
    return (
      <span
        className={`flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 ${className}`}
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        <span>Complete</span>
      </span>
    );
  }

  if (status === "error") {
    return (
      <span
        className={`flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 ${className}`}
      >
        <AlertCircle className="h-3.5 w-3.5" />
        <span>
          {errorCount} error{errorCount !== 1 ? "s" : ""}
        </span>
      </span>
    );
  }

  if (status === "warning") {
    return (
      <span
        className={`flex items-center gap-1 text-xs font-medium text-amber-600 dark:text-amber-400 ${className}`}
      >
        <AlertTriangle className="h-3.5 w-3.5" />
        <span>
          {warningCount > 0
            ? `${warningCount} warning${warningCount !== 1 ? "s" : ""}`
            : "In progress"}
        </span>
      </span>
    );
  }

  // Pending state
  return (
    <span className={`text-xs font-medium text-zinc-400 dark:text-zinc-500 ${className}`}>
      Not started
    </span>
  );
}
