"use client";

/**
 * AugmentationItemButton
 *
 * List item button for the augmentation modal left pane.
 * Renders a single catalog item with essence, cost, and availability preview.
 */

import {
  calculateCyberwareEssenceCost,
  calculateCyberwareCost,
  calculateCyberwareAvailability,
  calculateBiowareEssenceCost,
  calculateBiowareCost,
  calculateBiowareAvailability,
  type CyberwareCatalogItemData,
  type BiowareCatalogItemData,
  type CyberwareGradeData,
  type BiowareGradeData,
} from "@/lib/rules/RulesetContext";
import type { CyberwareGrade, BiowareGrade } from "@/lib/types";
import { hasUnifiedRatings, getRatingTableValue } from "@/lib/types/ratings";
import { formatCurrency, formatEssence, getAvailabilityDisplay } from "./augmentationModalHelpers";

// =============================================================================
// TYPES
// =============================================================================

export interface AugmentationItemButtonProps {
  /** The catalog item to render */
  item: CyberwareCatalogItemData | BiowareCatalogItemData;
  /** Whether the current type is cyberware */
  isCyberware: boolean;
  /** Currently selected grade */
  grade: CyberwareGrade | BiowareGrade;
  /** Cyberware grade data from ruleset */
  cyberwareGrades: CyberwareGradeData[];
  /** Bioware grade data from ruleset */
  biowareGrades: BiowareGradeData[];
  /** Remaining nuyen budget */
  remainingNuyen: number;
  /** Remaining essence */
  remainingEssence: number;
  /** Whether this item is currently selected */
  isSelected: boolean;
  /** Click handler for selection */
  onSelect: (id: string) => void;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function AugmentationItemButton({
  item,
  isCyberware,
  grade,
  cyberwareGrades,
  biowareGrades,
  remainingNuyen,
  remainingEssence,
  isSelected,
  onSelect,
}: AugmentationItemButtonProps) {
  const isRatedItem = hasUnifiedRatings(item);

  // Get base values - for rated items, show minimum rating values
  let baseEssence: number;
  let baseCost: number;
  let baseAvail: number;

  if (isRatedItem) {
    const minRating = item.minRating ?? 1;
    const ratingValue = getRatingTableValue(item, minRating);
    baseEssence = ratingValue?.essenceCost ?? 0;
    baseCost = ratingValue?.cost ?? 0;
    baseAvail = ratingValue?.availability ?? 0;
  } else {
    baseEssence = item.essenceCost ?? 0;
    baseCost = item.cost ?? 0;
    baseAvail = item.availability ?? 0;
  }

  // Calculate display values with grade modifiers
  let displayEssence: number;
  let displayCost: number;
  let displayAvail: number;

  if (isCyberware) {
    displayEssence = calculateCyberwareEssenceCost(
      baseEssence,
      grade as CyberwareGrade,
      cyberwareGrades
    );
    displayCost = calculateCyberwareCost(baseCost, grade as CyberwareGrade, cyberwareGrades);
    displayAvail = calculateCyberwareAvailability(
      baseAvail,
      grade as CyberwareGrade,
      cyberwareGrades
    );
  } else {
    displayEssence = calculateBiowareEssenceCost(baseEssence, grade as BiowareGrade, biowareGrades);
    displayCost = calculateBiowareCost(baseCost, grade as BiowareGrade, biowareGrades);
    displayAvail = calculateBiowareAvailability(baseAvail, grade as BiowareGrade, biowareGrades);
  }

  const affordable = displayCost <= remainingNuyen;
  const fitsEssence = displayEssence <= remainingEssence;
  const isDisabled = !affordable || !fitsEssence;

  return (
    <button
      key={item.id}
      onClick={() => onSelect(item.id)}
      disabled={isDisabled}
      className={`flex w-full items-center justify-between px-4 py-2 text-left text-sm transition-colors ${
        isSelected
          ? isCyberware
            ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300"
            : "bg-pink-50 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
          : isDisabled
            ? "cursor-not-allowed bg-zinc-50 text-zinc-400 dark:bg-zinc-800/50 dark:text-zinc-500"
            : isCyberware
              ? "text-zinc-700 hover:outline hover:outline-1 hover:outline-cyan-400 dark:text-zinc-300 dark:hover:outline-cyan-500"
              : "text-zinc-700 hover:outline hover:outline-1 hover:outline-pink-400 dark:text-zinc-300 dark:hover:outline-pink-500"
      }`}
    >
      <div className="min-w-0 flex-1">
        <span className="block truncate font-medium">
          {item.name}
          {isRatedItem && (
            <span className="ml-1 font-normal text-zinc-500 dark:text-zinc-400">
              (R{item.minRating}-{item.maxRating})
            </span>
          )}
        </span>
        <div className="mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-zinc-500 dark:text-zinc-400">
          <span
            className={
              isCyberware ? "text-cyan-600 dark:text-cyan-400" : "text-pink-600 dark:text-pink-400"
            }
          >
            {formatEssence(displayEssence)}
            {isRatedItem ? "+" : ""} ESS
          </span>
          <span>
            {formatCurrency(displayCost)}
            {isRatedItem ? "+" : ""}¥
          </span>
          <span>
            Avail {getAvailabilityDisplay(displayAvail, item.legality)}
            {isRatedItem ? "+" : ""}
          </span>
        </div>
      </div>
    </button>
  );
}
