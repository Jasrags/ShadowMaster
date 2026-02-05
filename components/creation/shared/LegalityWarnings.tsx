"use client";

/**
 * LegalityWarnings
 *
 * Aggregated warning banner for items with legality issues.
 * Shows counts of forbidden, restricted, and over-availability items.
 * Extracted from WeaponsPanel and MatrixGearCard inline warnings.
 */

import type { ItemLegality } from "@/lib/types";
import { CREATION_CONSTRAINTS } from "@/lib/rules/gear/validation";
import { AlertTriangle } from "lucide-react";

export interface LegalityWarningItem {
  name: string;
  legality?: ItemLegality;
  availability?: number;
}

interface LegalityWarningsProps {
  items: LegalityWarningItem[];
}

export function LegalityWarnings({ items }: LegalityWarningsProps) {
  const maxAvail = CREATION_CONSTRAINTS.maxAvailabilityAtCreation;

  let forbiddenCount = 0;
  let restrictedCount = 0;
  let overAvailCount = 0;

  for (const item of items) {
    if (item.legality === "forbidden") {
      forbiddenCount++;
    } else if (item.legality === "restricted") {
      restrictedCount++;
    } else if (item.availability !== undefined && item.availability > maxAvail) {
      overAvailCount++;
    }
  }

  if (forbiddenCount === 0 && restrictedCount === 0 && overAvailCount === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {forbiddenCount > 0 && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div className="text-xs">
            <span className="font-medium text-red-700 dark:text-red-300">
              {forbiddenCount} forbidden item{forbiddenCount !== 1 ? "s" : ""}
            </span>
            <span className="text-red-600 dark:text-red-400"> - illegal to possess</span>
          </div>
        </div>
      )}
      {restrictedCount > 0 && (
        <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-2 dark:bg-amber-900/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
          <div className="text-xs">
            <span className="font-medium text-amber-700 dark:text-amber-300">
              {restrictedCount} restricted item{restrictedCount !== 1 ? "s" : ""}
            </span>
            <span className="text-amber-600 dark:text-amber-400"> - requires license</span>
          </div>
        </div>
      )}
      {overAvailCount > 0 && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 p-2 dark:bg-red-900/20">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <div className="text-xs">
            <span className="font-medium text-red-700 dark:text-red-300">
              {overAvailCount} item{overAvailCount !== 1 ? "s" : ""} over Availability {maxAvail}
            </span>
            <span className="text-red-600 dark:text-red-400">
              {" "}
              - unavailable at character creation
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
