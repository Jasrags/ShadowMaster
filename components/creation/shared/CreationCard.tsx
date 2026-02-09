"use client";

/**
 * CreationCard
 *
 * Card component for sheet-driven creation sections. Thin wrapper around BaseCard
 * that adds validation-specific features: status-based border colors, ValidationBadge,
 * and auto-collapse on valid status.
 *
 * Phase 6.1: Added collapsible functionality with localStorage persistence.
 */

import { ReactNode, useEffect, useRef, useState } from "react";
import { BaseCard } from "./BaseCard";
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

function getBorderColor(status: ValidationStatus): string {
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
  const prevStatusRef = useRef(status);
  // undefined = no force override, true = force collapse
  const [forceCollapsed, setForceCollapsed] = useState<boolean | undefined>(undefined);

  // Auto-collapse when status transitions to valid
  useEffect(() => {
    if (
      autoCollapseOnValid &&
      collapsible &&
      status === "valid" &&
      prevStatusRef.current !== "valid"
    ) {
      setForceCollapsed(true);
    }
    prevStatusRef.current = status;
  }, [status, autoCollapseOnValid, collapsible]);

  // Clear the force override after it's been applied (so user can manually toggle)
  useEffect(() => {
    if (forceCollapsed !== undefined) {
      const timer = setTimeout(() => setForceCollapsed(undefined), 0);
      return () => clearTimeout(timer);
    }
  }, [forceCollapsed]);

  return (
    <BaseCard
      id={id}
      title={title}
      description={description}
      headerAction={headerAction}
      headerExtra={
        <ValidationBadge status={status} errorCount={errorCount} warningCount={warningCount} />
      }
      className={className}
      collapsible={collapsible}
      defaultCollapsed={defaultCollapsed}
      collapsedSummary={collapsedSummary}
      borderClassName={getBorderColor(status)}
      forceCollapsed={forceCollapsed}
    >
      {children}
    </BaseCard>
  );
}
