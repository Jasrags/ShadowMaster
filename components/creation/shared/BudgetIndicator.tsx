"use client";

/**
 * BudgetIndicator
 *
 * Reusable component for displaying budget remaining/total with progress bar.
 * Supports different display formats (number, currency, percentage).
 */

interface BudgetIndicatorProps {
  label: string;
  remaining: number;
  total: number;
  displayFormat?: "number" | "currency" | "percentage";
  showProgressBar?: boolean;
  compact?: boolean;
  className?: string;
}

export function BudgetIndicator({
  label,
  remaining,
  total,
  displayFormat = "number",
  showProgressBar = true,
  compact = false,
  className = "",
}: BudgetIndicatorProps) {
  const spent = total - remaining;
  const percentUsed = total > 0 ? (spent / total) * 100 : 0;
  const isOverspent = remaining < 0;
  const isComplete = remaining === 0;

  const formatValue = (value: number) => {
    switch (displayFormat) {
      case "currency":
        return `${value.toLocaleString()}¥`;
      case "percentage":
        return `${Math.round(value)}%`;
      default:
        return value.toString();
    }
  };

  const getStatusColor = () => {
    if (isOverspent) return "text-red-600 dark:text-red-400";
    if (isComplete) return "text-emerald-600 dark:text-emerald-400";
    return "text-zinc-900 dark:text-zinc-100";
  };

  const getProgressColor = () => {
    if (isOverspent) return "bg-red-500";
    if (isComplete) return "bg-emerald-500";
    return "bg-blue-500";
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">{label}:</span>
        <span className={`text-xs font-medium ${getStatusColor()}`}>
          {formatValue(remaining)}
          <span className="text-zinc-400"> / {formatValue(total)}</span>
        </span>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">{label}</span>
        <span className={`font-medium ${getStatusColor()}`}>
          {formatValue(remaining)}
          <span className="text-zinc-400"> / {formatValue(total)}</span>
        </span>
      </div>
      {showProgressBar && (
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
          <div
            className={`h-full transition-all ${getProgressColor()}`}
            style={{
              width: `${Math.min(100, Math.max(0, percentUsed))}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}
