"use client";

/**
 * BulkQuantitySelector Component
 *
 * Reusable component for selecting quantities of stackable/bulk items.
 * Supports pack-based multipliers (1×, 2×, 5×, 10×) and custom input
 * with toggle between packs and units mode.
 *
 * Used in:
 * - GearPurchaseModal for stackable items (RFID tags, etc.)
 * - AmmunitionModal for ammo purchases
 */

import { useState, useMemo, useCallback } from "react";
import { Package } from "lucide-react";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Pack multiplier presets */
const PACK_MULTIPLIERS = [1, 2, 5, 10] as const;

// =============================================================================
// HELPERS
// =============================================================================

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// =============================================================================
// TYPES
// =============================================================================

export interface BulkQuantitySelectorProps {
  /** Number of units per pack (e.g., 10 rounds per box, 20 tags per pack) */
  packSize: number;
  /** Label for units (e.g., "rounds", "tags", "units") */
  unitLabel: string;
  /** Cost per pack in nuyen */
  pricePerPack: number;
  /** Budget remaining for affordability checks */
  remaining: number;
  /** Currently selected number of packs */
  selectedPacks: number;
  /** Callback when pack count changes */
  onPacksChange: (packs: number) => void;
  /** Optional: Label for pack (default: "pack") */
  packLabel?: string;
}

type InputMode = "packs" | "units";

// =============================================================================
// COMPONENT
// =============================================================================

export function BulkQuantitySelector({
  packSize,
  unitLabel,
  pricePerPack,
  remaining,
  selectedPacks,
  onPacksChange,
  packLabel = "pack",
}: BulkQuantitySelectorProps) {
  const [inputMode, setInputMode] = useState<InputMode>("packs");
  const [customValue, setCustomValue] = useState<string>("");

  // Calculate derived values
  const totalUnits = selectedPacks * packSize;
  const totalCost = selectedPacks * pricePerPack;
  const canAfford = totalCost <= remaining;

  // Track if user entered units that required rounding
  const [roundedFrom, setRoundedFrom] = useState<number | null>(null);

  // Handle preset button click
  const handlePresetClick = useCallback(
    (multiplier: number) => {
      onPacksChange(multiplier);
      setCustomValue("");
      setRoundedFrom(null);
    },
    [onPacksChange]
  );

  // Handle custom input change
  const handleCustomChange = useCallback(
    (value: string) => {
      setCustomValue(value);
      const parsed = parseInt(value, 10);

      if (isNaN(parsed) || parsed <= 0) {
        return;
      }

      if (inputMode === "packs") {
        onPacksChange(parsed);
        setRoundedFrom(null);
      } else {
        // Units mode - round up to nearest pack
        const packs = Math.ceil(parsed / packSize);
        const actualUnits = packs * packSize;
        onPacksChange(packs);

        // Track if rounding occurred
        if (actualUnits !== parsed) {
          setRoundedFrom(parsed);
        } else {
          setRoundedFrom(null);
        }
      }
    },
    [inputMode, onPacksChange, packSize]
  );

  // Toggle input mode
  const toggleInputMode = useCallback(() => {
    setInputMode((prev) => (prev === "packs" ? "units" : "packs"));
    setCustomValue("");
    setRoundedFrom(null);
  }, []);

  // Check affordability for each preset
  const presetAffordability = useMemo(() => {
    return PACK_MULTIPLIERS.map((mult) => ({
      multiplier: mult,
      cost: mult * pricePerPack,
      units: mult * packSize,
      affordable: mult * pricePerPack <= remaining,
    }));
  }, [pricePerPack, packSize, remaining]);

  return (
    <div className="space-y-3">
      {/* Section Header */}
      <div className="flex items-center gap-2">
        <Package className="h-4 w-4 text-zinc-400" />
        <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
          Quantity
        </span>
        <span className="text-xs text-zinc-400 dark:text-zinc-500">
          ({packSize} {unitLabel} per {packLabel})
        </span>
      </div>

      {/* Preset Buttons Grid */}
      <div className="grid grid-cols-4 gap-2">
        {presetAffordability.map(({ multiplier, cost, units, affordable }) => {
          const isActive = selectedPacks === multiplier && customValue === "";

          return (
            <button
              key={multiplier}
              onClick={() => handlePresetClick(multiplier)}
              disabled={!affordable}
              className={`flex flex-col items-center rounded-lg border p-2 transition-all ${
                isActive
                  ? "border-amber-500 bg-amber-100 dark:border-amber-600 dark:bg-amber-900/40"
                  : affordable
                    ? "border-zinc-200 bg-white hover:border-amber-400 hover:bg-amber-50 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-amber-600 dark:hover:bg-amber-900/20"
                    : "cursor-not-allowed border-zinc-200 bg-zinc-100 opacity-50 dark:border-zinc-700 dark:bg-zinc-800"
              }`}
            >
              <span
                className={`text-sm font-semibold ${
                  isActive
                    ? "text-amber-800 dark:text-amber-200"
                    : "text-zinc-900 dark:text-zinc-100"
                }`}
              >
                {multiplier}×
              </span>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                {packLabel}
                {multiplier !== 1 ? "s" : ""}
              </span>
              <span
                className={`text-[10px] ${
                  isActive ? "text-amber-700 dark:text-amber-300" : "text-zinc-400"
                }`}
              >
                {units} {unitLabel}
              </span>
              <span
                className={`mt-0.5 text-xs font-medium ${
                  isActive
                    ? "text-amber-700 dark:text-amber-300"
                    : "text-zinc-600 dark:text-zinc-400"
                }`}
              >
                {formatCurrency(cost)}¥
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Input Section */}
      <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-700 dark:bg-zinc-800/50">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-600 dark:text-zinc-400">Custom:</span>

          {/* Input Mode Toggle */}
          <button
            onClick={toggleInputMode}
            className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
          >
            {inputMode === "packs" ? `${packLabel}s` : unitLabel}
          </button>

          {/* Input Field */}
          <input
            type="number"
            min="1"
            value={customValue}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder={inputMode === "packs" ? `# of ${packLabel}s` : `# of ${unitLabel}`}
            className="w-24 rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm text-zinc-900 placeholder-zinc-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
          />

          {/* Calculation Preview */}
          {customValue && selectedPacks > 0 && (
            <span className="ml-auto text-xs text-zinc-500 dark:text-zinc-400">
              = {totalUnits} {unitLabel}, {formatCurrency(totalCost)}¥
            </span>
          )}
        </div>

        {/* Rounding Notice */}
        {roundedFrom !== null && (
          <p className="mt-2 text-[10px] text-amber-600 dark:text-amber-400">
            Rounded up from {roundedFrom} to {totalUnits} {unitLabel} (sold per {packSize})
          </p>
        )}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between rounded-lg bg-zinc-100 px-3 py-2 dark:bg-zinc-800">
        <span className="text-sm text-zinc-600 dark:text-zinc-400">
          Total: {selectedPacks} {packLabel}
          {selectedPacks !== 1 ? "s" : ""} ({totalUnits} {unitLabel})
        </span>
        <span
          className={`text-sm font-semibold ${
            canAfford ? "text-zinc-900 dark:text-zinc-100" : "text-red-600 dark:text-red-400"
          }`}
        >
          {formatCurrency(totalCost)}¥{!canAfford && " (over budget)"}
        </span>
      </div>
    </div>
  );
}

export default BulkQuantitySelector;
