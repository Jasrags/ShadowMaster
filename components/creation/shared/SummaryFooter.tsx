"use client";

/**
 * SummaryFooter
 *
 * Unified component for displaying summary information at the bottom of purchase cards.
 * Shows item count on the left and total cost/value on the right with consistent styling.
 *
 * Usage:
 * - Currency: <SummaryFooter count={5} total={12500} format="currency" />
 * - Number: <SummaryFooter count={3} total={3} format="number" label="powers" />
 * - Custom: <SummaryFooter count={2} total="0.75 PP" />
 */

interface SummaryFooterProps {
  /** Number of items */
  count: number;
  /** Total value to display (number or pre-formatted string) */
  total: number | string;
  /** Format for the total: "currency" adds ¥, "number" shows as-is, "decimal" shows 2 places */
  format?: "currency" | "number" | "decimal";
  /** Label for items (default: "item") - will be pluralized automatically */
  label?: string;
  /** Style variant: "border" uses border-top, "background" uses subtle background */
  variant?: "border" | "background";
  /** Whether to show border-top (default: true, only applies to "border" variant) */
  showBorder?: boolean;
  /** Additional CSS classes */
  className?: string;
}

function formatValue(total: number | string, format: "currency" | "number" | "decimal"): string {
  if (typeof total === "string") return total;

  switch (format) {
    case "currency":
      return `${new Intl.NumberFormat("en-US").format(total)}¥`;
    case "decimal":
      return total.toFixed(2);
    default:
      return total.toString();
  }
}

export function SummaryFooter({
  count,
  total,
  format = "currency",
  label = "item",
  variant = "border",
  showBorder = true,
  className = "",
}: SummaryFooterProps) {
  const pluralLabel = count === 1 ? label : `${label}s`;
  const formattedTotal = formatValue(total, format);

  const variantClasses =
    variant === "background"
      ? "rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800/50"
      : showBorder
        ? "border-t border-zinc-200 pt-3 dark:border-zinc-700"
        : "";

  return (
    <div className={`flex items-center justify-between ${variantClasses} ${className}`}>
      <span className="text-xs text-zinc-500 dark:text-zinc-400">
        Total: {count} {pluralLabel}
      </span>
      <span className="font-mono text-xs font-medium text-emerald-600 dark:text-emerald-400">
        {formattedTotal}
      </span>
    </div>
  );
}
