"use client";

/**
 * DisplayCard
 *
 * Card component for read-only character sheet display sections.
 * Thin wrapper around BaseCard with no validation, no status, no budget tracking.
 * Uses the same zinc/emerald Tailwind palette as character creation (source of truth).
 */

import { ReactNode } from "react";
import { BaseCard } from "@/components/creation/shared/BaseCard";

interface DisplayCardProps {
  id?: string;
  title: string;
  icon?: ReactNode;
  description?: string;
  headerAction?: ReactNode;
  children: ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  collapsedSummary?: ReactNode;
}

export function DisplayCard({
  id,
  title,
  icon,
  description,
  headerAction,
  children,
  className = "",
  collapsible = false,
  defaultCollapsed = false,
  collapsedSummary,
}: DisplayCardProps) {
  return (
    <BaseCard
      id={id}
      title={title}
      icon={icon}
      description={description}
      headerAction={headerAction}
      className={className}
      collapsible={collapsible}
      defaultCollapsed={defaultCollapsed}
      collapsedSummary={collapsedSummary}
    >
      {children}
    </BaseCard>
  );
}
