"use client";

import type { LucideIcon } from "lucide-react";

/**
 * EmptyState
 *
 * Unified component for displaying empty states in purchase cards and list sections.
 * Provides consistent dashed border styling with optional icon and customizable message.
 *
 * Usage:
 * - Basic: <EmptyState message="No items purchased" />
 * - With icon: <EmptyState message="No weapons purchased" icon={Sword} />
 * - Compact: <EmptyState message="No mods installed" size="sm" />
 */

interface EmptyStateProps {
  /** The message to display */
  message: string;
  /** Optional icon to show alongside the message */
  icon?: LucideIcon;
  /** Size variant: "sm" for inline/compact, "md" for standard, "lg" for prominent */
  size?: "sm" | "md" | "lg";
  /** Additional CSS classes */
  className?: string;
}

export function EmptyState({ message, icon: Icon, size = "md", className = "" }: EmptyStateProps) {
  const sizeClasses = {
    sm: "p-2",
    md: "p-3",
    lg: "p-6",
  };

  const textSizeClasses = {
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
  };

  const iconSizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div
      className={`rounded-lg border-2 border-dashed border-zinc-200 ${sizeClasses[size]} text-center dark:border-zinc-700 ${className}`}
    >
      {Icon ? (
        <div className="flex items-center justify-center gap-2">
          <Icon className={`${iconSizeClasses[size]} text-zinc-400 dark:text-zinc-500`} />
          <p className={`${textSizeClasses[size]} text-zinc-400 dark:text-zinc-500`}>{message}</p>
        </div>
      ) : (
        <p className={`${textSizeClasses[size]} text-zinc-400 dark:text-zinc-500`}>{message}</p>
      )}
    </div>
  );
}
