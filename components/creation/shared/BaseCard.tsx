"use client";

/**
 * BaseCard
 *
 * Shared structural card component used by both CreationCard (character creation)
 * and DisplayCard (character sheet view). Provides consistent styling with header,
 * optional icon, collapsible behavior with localStorage persistence, and content area.
 *
 * This is the foundation - no validation features, no theme system.
 */

import { ReactNode, useState, useEffect, useCallback } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export interface BaseCardProps {
  /** Unique identifier for localStorage persistence (required if collapsible) */
  id?: string;
  title: string;
  icon?: ReactNode;
  description?: string;
  headerAction?: ReactNode;
  /** Slot between title and actions (for ValidationBadge, status indicators, etc.) */
  headerExtra?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Enable collapse/expand functionality */
  collapsible?: boolean;
  /** Start in collapsed state */
  defaultCollapsed?: boolean;
  /** Summary content shown when collapsed */
  collapsedSummary?: ReactNode;
  /** Override default border class (default: border-zinc-200 dark:border-zinc-700) */
  borderClassName?: string;
  /** Controlled collapsed state — when set, overrides internal state and persists to localStorage */
  forceCollapsed?: boolean;
}

const STORAGE_KEY_PREFIX = "creation-card-collapsed-";

function getStoredCollapsedState(id: string): boolean | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${id}`);
    return stored !== null ? stored === "true" : null;
  } catch {
    return null;
  }
}

function setStoredCollapsedState(id: string, collapsed: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${id}`, String(collapsed));
  } catch {
    // Ignore storage errors
  }
}

export function BaseCard({
  id,
  title,
  icon,
  description,
  headerAction,
  headerExtra,
  children,
  className = "",
  collapsible = false,
  defaultCollapsed = false,
  collapsedSummary,
  borderClassName = "border-zinc-200 dark:border-zinc-700",
  forceCollapsed,
}: BaseCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (!collapsible) return false;
    if (id) {
      const stored = getStoredCollapsedState(id);
      if (stored !== null) return stored;
    }
    return defaultCollapsed;
  });

  // Sync forceCollapsed from parent (used by CreationCard for autoCollapseOnValid)
  useEffect(() => {
    if (forceCollapsed !== undefined && collapsible) {
      setIsCollapsed(forceCollapsed);
      if (id) setStoredCollapsedState(id, forceCollapsed);
    }
  }, [forceCollapsed, collapsible, id]);

  const toggleCollapsed = useCallback(() => {
    if (!collapsible) return;
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    if (id) setStoredCollapsedState(id, newState);
  }, [collapsible, isCollapsed, id]);

  const CollapseIcon = isCollapsed ? ChevronRight : ChevronDown;

  return (
    <div className={`rounded-lg border bg-white dark:bg-zinc-900 ${borderClassName} ${className}`}>
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
              {icon && <span className="shrink-0">{icon}</span>}
              <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{title}</h3>
              {headerExtra}
            </div>
            {description && !isCollapsed && (
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{description}</p>
            )}
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
