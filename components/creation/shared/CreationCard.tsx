"use client";

/**
 * CreationCard
 *
 * Base card component for sheet-driven creation sections.
 * Provides consistent styling with header, validation badge, and content area.
 *
 * Phase 6.1: Added collapsible functionality with localStorage persistence.
 */

import { ReactNode, useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ValidationBadge } from "./ValidationBadge";

type ValidationStatus = "valid" | "warning" | "error" | "pending";

interface CreationCardProps {
  /** Unique identifier for localStorage persistence (required if collapsible) */
  id?: string;
  title: string;
  description?: string;
  status?: ValidationStatus;
  errorCount?: number;
  warningCount?: number;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Enable collapse/expand functionality */
  collapsible?: boolean;
  /** Start in collapsed state */
  defaultCollapsed?: boolean;
  /** Summary content shown when collapsed */
  collapsedSummary?: ReactNode;
  /** Auto-collapse when status becomes valid */
  autoCollapseOnValid?: boolean;
}

const STORAGE_KEY_PREFIX = "creation-card-collapsed-";

/**
 * Get collapsed state from localStorage
 */
function getStoredCollapsedState(id: string): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
    return stored !== null ? stored === "true" : null;
  } catch {
    return null;
  }
}

/**
 * Store collapsed state in localStorage
 */
function setStoredCollapsedState(id: string, collapsed: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, String(collapsed));
  } catch {
    // Ignore storage errors
  }
}

export function CreationCard({
  id,
  title,
  description,
  status = "pending",
  errorCount = 0,
  warningCount = 0,
  headerAction,
  children,
  className = "",
  collapsible = false,
  defaultCollapsed = false,
  collapsedSummary,
  autoCollapseOnValid = false,
}: CreationCardProps) {
  // Initialize collapsed state
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (!collapsible) return false;
    if (id) {
      const stored = getStoredCollapsedState(id);
      if (stored !== null) return stored;
    }
    return defaultCollapsed;
  });

  // Track previous status for auto-collapse
  const [prevStatus, setPrevStatus] = useState(status);

  // Auto-collapse when status becomes valid
  useEffect(() => {
    if (autoCollapseOnValid && collapsible && status === "valid" && prevStatus !== "valid") {
      setIsCollapsed(true);
      if (id) setStoredCollapsedState(id, true);
    }
    setPrevStatus(status);
  }, [status, prevStatus, autoCollapseOnValid, collapsible, id]);

  // Toggle collapsed state
  const toggleCollapsed = useCallback(() => {
    if (!collapsible) return;
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (id) setStoredCollapsedState(id, newState);
  }, [collapsible, isCollapsed, id]);

  const getBorderColor = () => {
    switch (status) {
      case "valid":
        return "border-emerald-300 dark:border-emerald-500/30";
      case "warning":
        return "border-amber-300 dark:border-amber-500/30";
      case "error":
        return "border-red-300 dark:border-red-500/30";
      default:
        return "border-zinc-200 dark:border-zinc-700";
    }
  };

  const CollapseIcon = isCollapsed ? ChevronRight : ChevronDown;

  return (
    <div className={`rounded-lg border bg-white dark:bg-zinc-900 ${getBorderColor()} ${className}`}>
      {/* Header */}
      <div
        className={`flex items-start justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800 ${
          collapsible ? "cursor-pointer select-none" : ""
        }`}
        onClick={collapsible ? toggleCollapsed : undefined}
        onKeyDown={
          collapsible
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleCollapsed();
                }
              }
            : undefined
        }
        role={collapsible ? "button" : undefined}
        tabIndex={collapsible ? 0 : undefined}
        aria-expanded={collapsible ? !isCollapsed : undefined}
      >
        <div className="flex min-w-0 flex-1 items-start gap-2">
          {collapsible && (
            <CollapseIcon
              className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400 transition-transform dark:text-zinc-500"
              aria-hidden="true"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{title}</h3>
              <ValidationBadge
                status={status}
                errorCount={errorCount}
                warningCount={warningCount}
              />
            </div>
            {description && !isCollapsed && (
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
            )}
            {/* Show summary when collapsed */}
            {isCollapsed && collapsedSummary && (
              <div className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                {collapsedSummary}
              </div>
            )}
          </div>
        </div>
        {headerAction && <div onClick={(e) => e.stopPropagation()}>{headerAction}</div>}
      </div>

      {/* Content - with animation */}
      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isCollapsed ? "max-h-0" : "max-h-[5000px]"
        }`}
      >
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
