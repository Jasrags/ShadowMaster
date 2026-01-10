"use client";

import { AlertTriangle, Info } from "lucide-react";

/**
 * BudgetIndicator
 *
 * Unified component for displaying budget status with consistent format:
 * - Shows "X spent • Y remaining" (dual display)
 * - Progress bar shows filled portion
 * - Optional note for conversions/overflow
 * - Color coding: blue (normal), green (complete), amber (warning), red (error/overspent)
 *
 * Supports three display modes:
 * - "default": Full-width inline display with progress bar
 * - "compact": Condensed single-line for card headers
 * - "card": Bordered container with prominent remaining display (for SpellsCard, AdeptPowersCard)
 */

interface BudgetIndicatorProps {
  label: string;
  spent: number;
  total: number;
  /** Optional: override remaining (for cases where remaining != total - spent) */
  remaining?: number;
  /** "decimal2" shows 2 decimal places for power points */
  displayFormat?: "number" | "currency" | "percentage" | "decimal" | "decimal2";
  showProgressBar?: boolean;
  /** @deprecated Use mode="compact" instead */
  compact?: boolean;
  /** Display mode: default, compact (inline), or card (bordered container) */
  mode?: "default" | "compact" | "card";
  /** Optional note to show below (e.g., "+2 from karma", "includes 4k conversion") */
  note?: string;
  /** Note style: info (blue), warning (amber), error (red) */
  noteStyle?: "info" | "warning" | "error";
  /** Show overflow indicator when spent > total */
  showOverflow?: boolean;
  /** Tooltip text to show on hover (displays info icon) */
  tooltip?: string;
  /** Color variant: "default" uses blue, "positive" uses blue, "negative" uses amber, "violet" for adept powers */
  variant?: "default" | "positive" | "negative" | "violet";
  /** Show karma cost when over budget */
  karmaRequired?: number;
  /** Karma cost per unit (used in over-budget message) */
  karmaCostPerUnit?: number;
  /** Unit name for over-budget message (e.g., "spell", "power point") */
  unitName?: string;
  /** Description text to show below label */
  description?: string;
  /** Source text (e.g., "Based on Magic 6") */
  source?: string;
  className?: string;
}

export function BudgetIndicator({
  label,
  spent,
  total,
  remaining: remainingOverride,
  displayFormat = "number",
  showProgressBar = true,
  compact = false,
  mode,
  note,
  noteStyle = "info",
  showOverflow = true,
  tooltip,
  variant = "default",
  karmaRequired,
  karmaCostPerUnit,
  unitName,
  description,
  source,
  className = "",
}: BudgetIndicatorProps) {
  // Resolve mode from deprecated compact prop
  const resolvedMode = mode ?? (compact ? "compact" : "default");

  const remaining = remainingOverride ?? (total - spent);
  const percentSpent = total > 0 ? Math.min(100, Math.max(0, (spent / total) * 100)) : 0;
  const isOverspent = remaining < 0 || spent > total;
  const isComplete = remaining === 0 && total > 0;
  const hasOverflow = spent > total && showOverflow;

  const formatValue = (value: number) => {
    switch (displayFormat) {
      case "currency":
        return `${value.toLocaleString()}¥`;
      case "percentage":
        return `${Math.round(value)}%`;
      case "decimal":
        return value.toFixed(1);
      case "decimal2":
        return value.toFixed(2);
      default:
        return value.toString();
    }
  };

  // Color based on variant and status
  const getStatusColor = () => {
    if (isOverspent) return "text-red-600 dark:text-red-400";
    if (isComplete) return "text-emerald-600 dark:text-emerald-400";
    if (variant === "negative") return "text-amber-600 dark:text-amber-400";
    if (variant === "positive") return "text-blue-600 dark:text-blue-400";
    if (variant === "violet") return "text-violet-600 dark:text-violet-400";
    return "text-zinc-900 dark:text-zinc-100";
  };

  const getProgressColor = () => {
    if (isOverspent) return "bg-red-500";
    if (isComplete) return "bg-emerald-500";
    if (variant === "negative") return "bg-amber-500";
    if (variant === "positive") return "bg-blue-500";
    if (variant === "violet") return "bg-violet-500";
    return "bg-blue-500";
  };

  const getNoteColor = () => {
    switch (noteStyle) {
      case "warning":
        return "text-amber-600 dark:text-amber-400";
      case "error":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-blue-600 dark:text-blue-400";
    }
  };

  // Screen-reader only announcement for budget changes
  const srAnnouncement = isOverspent
    ? `${label}: Over budget by ${formatValue(Math.abs(remaining))}`
    : isComplete
      ? `${label}: Budget complete`
      : `${label}: ${formatValue(remaining)} remaining`;

  // Compute karma warning note if over budget and karmaRequired provided
  const karmaNote = isOverspent && karmaRequired
    ? `Requires ${karmaRequired} karma`
    : undefined;
  const finalNote = note || karmaNote;
  const finalNoteStyle = note ? noteStyle : "warning";

  // Card mode: bordered container with prominent remaining display
  if (resolvedMode === "card") {
    // Compute over-budget message with unit cost if provided
    const overBudgetMessage = isOverspent && karmaRequired && karmaCostPerUnit && unitName
      ? `${Math.abs(remaining)} ${unitName}${Math.abs(remaining) !== 1 ? "s" : ""} over free limit → ${karmaRequired} karma (${karmaCostPerUnit} karma per ${unitName})`
      : undefined;

    // Get card border and background based on variant and overspent state
    const getCardStyles = () => {
      if (isOverspent) {
        return "border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20";
      }
      return "border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50";
    };

    // Get remaining value color for card mode
    const getCardValueColor = () => {
      if (isOverspent) return "text-amber-600 dark:text-amber-400";
      if (isComplete) return "text-emerald-600 dark:text-emerald-400";
      return "text-zinc-900 dark:text-zinc-100";
    };

    return (
      <div className={`rounded-lg border p-3 ${getCardStyles()} ${className}`}>
        {/* Screen reader announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {srAnnouncement}
        </div>

        {/* Header: label and remaining value */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {label}
          </div>
          <div className={`text-lg font-bold ${getCardValueColor()}`}>
            {formatValue(remaining)}
          </div>
        </div>

        {/* Description */}
        {description && (
          <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
            {description}
          </div>
        )}

        {/* Source with "of X remaining" */}
        <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {source}
          <span className="float-right">
            of {formatValue(total)} remaining
          </span>
        </div>

        {/* Progress bar */}
        {showProgressBar && (
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700"
            role="progressbar"
            aria-valuenow={spent}
            aria-valuemin={0}
            aria-valuemax={total}
            aria-label={`${label} progress: ${formatValue(spent)} of ${formatValue(total)} spent`}
          >
            <div
              className={`h-full rounded-full transition-all ${getProgressColor()}`}
              style={{ width: `${percentSpent}%` }}
            />
          </div>
        )}

        {/* Over budget warning */}
        {overBudgetMessage && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{overBudgetMessage}</span>
          </div>
        )}

        {/* Generic note */}
        {finalNote && !overBudgetMessage && (
          <div className={`mt-2 text-xs ${finalNoteStyle === "warning" ? "text-amber-600 dark:text-amber-400" : getNoteColor()}`}>
            {finalNote}
          </div>
        )}
      </div>
    );
  }

  // Compact mode
  if (resolvedMode === "compact") {
    return (
      <div className={`space-y-1 ${className}`}>
        {/* Screen reader announcement */}
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {srAnnouncement}
        </div>
        <div className="flex items-center justify-between gap-2">
          {tooltip ? (
            <span
              className="flex cursor-help items-center gap-1 text-xs text-zinc-600 dark:text-zinc-400"
              title={tooltip}
            >
              {label}
              <Info className="h-3 w-3 text-zinc-400" aria-hidden="true" />
            </span>
          ) : (
            <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}</span>
          )}
          <span className={`text-xs font-medium ${getStatusColor()}`}>
            {formatValue(spent)} / {formatValue(total)}
          </span>
        </div>
        {showProgressBar && (
          <div
            className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
            role="progressbar"
            aria-valuenow={spent}
            aria-valuemin={0}
            aria-valuemax={total}
          >
            <div
              className={`h-full transition-all ${getProgressColor()}`}
              style={{ width: `${percentSpent}%` }}
            />
          </div>
        )}
        {finalNote && (
          <div className={`text-right text-[10px] ${finalNoteStyle === "warning" ? "text-amber-600 dark:text-amber-400" : getNoteColor()}`}>
            {finalNote}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {srAnnouncement}
      </div>
      <div className="flex items-center justify-between text-sm">
        {tooltip ? (
          <span
            className="flex cursor-help items-center gap-1 text-zinc-600 dark:text-zinc-400"
            title={tooltip}
          >
            {label}
            <Info className="h-3 w-3 text-zinc-400" aria-hidden="true" />
          </span>
        ) : (
          <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
        )}
        <span className={`font-medium ${getStatusColor()}`}>
          {formatValue(spent)} / {formatValue(total)}
        </span>
      </div>
      {(description || source) && (
        <div className="text-xs text-zinc-500 dark:text-zinc-400">
          {description && <span>{description}</span>}
          {description && source && <span> • </span>}
          {source && <span className="text-zinc-400">{source}</span>}
        </div>
      )}
      {showProgressBar && (
        <div
          className="relative h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800"
          role="progressbar"
          aria-valuenow={spent}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${label} progress: ${formatValue(spent)} of ${formatValue(total)} spent`}
        >
          <div
            className={`h-full transition-all ${getProgressColor()}`}
            style={{ width: `${percentSpent}%` }}
          />
          {/* Overflow indicator - striped pattern when over budget */}
          {hasOverflow && (
            <div
              className="absolute right-0 top-0 h-full bg-red-500"
              style={{
                width: `${Math.min(30, ((spent - total) / total) * 100)}%`,
                backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(0,0,0,0.2) 2px, rgba(0,0,0,0.2) 4px)",
              }}
            />
          )}
        </div>
      )}
      {finalNote && (
        <div className={`text-xs ${finalNoteStyle === "warning" ? "text-amber-600 dark:text-amber-400" : getNoteColor()}`}>
          {finalNote}
        </div>
      )}
    </div>
  );
}

/**
 * Legacy BudgetIndicator props adapter
 * For backward compatibility with components using remaining/total pattern
 */
interface LegacyBudgetIndicatorProps {
  label: string;
  remaining: number;
  total: number;
  displayFormat?: "number" | "currency" | "percentage";
  showProgressBar?: boolean;
  compact?: boolean;
  className?: string;
}

export function LegacyBudgetIndicator({
  label,
  remaining,
  total,
  displayFormat = "number",
  showProgressBar = true,
  compact = false,
  className = "",
}: LegacyBudgetIndicatorProps) {
  return (
    <BudgetIndicator
      label={label}
      spent={total - remaining}
      total={total}
      remaining={remaining}
      displayFormat={displayFormat}
      showProgressBar={showProgressBar}
      compact={compact}
      className={className}
    />
  );
}
