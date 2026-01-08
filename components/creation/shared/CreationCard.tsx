"use client";

/**
 * CreationCard
 *
 * Base card component for sheet-driven creation sections.
 * Provides consistent styling with header, validation badge, and content area.
 */

import { ReactNode } from "react";
import { ValidationBadge } from "./ValidationBadge";

type ValidationStatus = "valid" | "warning" | "error" | "pending";

interface CreationCardProps {
  title: string;
  description?: string;
  status?: ValidationStatus;
  errorCount?: number;
  warningCount?: number;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function CreationCard({
  title,
  description,
  status = "pending",
  errorCount = 0,
  warningCount = 0,
  headerAction,
  children,
  className = "",
}: CreationCardProps) {
  const getBorderColor = () => {
    switch (status) {
      case "valid":
        return "border-emerald-200 dark:border-emerald-800";
      case "warning":
        return "border-amber-200 dark:border-amber-800";
      case "error":
        return "border-red-200 dark:border-red-800";
      default:
        return "border-zinc-200 dark:border-zinc-700";
    }
  };

  return (
    <div
      className={`rounded-lg border bg-white dark:bg-zinc-900 ${getBorderColor()} ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
            <ValidationBadge
              status={status}
              errorCount={errorCount}
              warningCount={warningCount}
            />
          </div>
          {description && (
            <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
              {description}
            </p>
          )}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </div>

      {/* Content */}
      <div className="p-4">{children}</div>
    </div>
  );
}
