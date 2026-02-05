"use client";

/**
 * LegalityBadge
 *
 * Small inline badge showing legality status for individual items.
 * - "F" in red for forbidden
 * - "R" in amber for restricted
 * - "!" in red when availability >12
 * - Returns null for legal items
 */

import type { ItemLegality } from "@/lib/types";
import { CREATION_CONSTRAINTS } from "@/lib/rules/gear/validation";

interface LegalityBadgeProps {
  legality?: ItemLegality;
  availability?: number;
}

export function LegalityBadge({ legality, availability }: LegalityBadgeProps) {
  if (legality === "forbidden") {
    return (
      <span
        className="shrink-0 rounded bg-red-100 px-1 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-900/40 dark:text-red-400"
        title="Forbidden - illegal to possess"
      >
        F
      </span>
    );
  }

  if (legality === "restricted") {
    return (
      <span
        className="shrink-0 rounded bg-amber-100 px-1 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
        title="Restricted - requires license"
      >
        R
      </span>
    );
  }

  if (availability !== undefined && availability > CREATION_CONSTRAINTS.maxAvailabilityAtCreation) {
    return (
      <span
        className="shrink-0 rounded bg-red-100 px-1 py-0.5 text-[10px] font-bold text-red-700 dark:bg-red-900/40 dark:text-red-400"
        title={`Availability ${availability} exceeds creation maximum of ${CREATION_CONSTRAINTS.maxAvailabilityAtCreation}`}
      >
        !
      </span>
    );
  }

  return null;
}
