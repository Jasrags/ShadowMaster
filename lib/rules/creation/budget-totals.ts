/**
 * Budget total calculation functions for character creation.
 *
 * Pure functions that compute budget totals from priority selections
 * or creation method parameters. No React dependencies.
 */

import type { GameplayLevelModifiers } from "@/lib/types/edition";
import type { PriorityTableData } from "@/lib/rules/loader-types";
import { LIFE_MODULES_KARMA_BUDGET, LIFE_MODULES_NUYEN_PER_KARMA } from "@/lib/types";
import {
  POINT_BUY_KARMA_BUDGET,
  POINT_BUY_NUYEN_PER_KARMA,
} from "@/lib/rules/point-buy-validation";

// =============================================================================
// TYPES
// =============================================================================

export type BudgetTotalEntry = {
  total: number;
  label: string;
  displayFormat?: "number" | "currency" | "decimal";
};

// =============================================================================
// BUDGET TOTAL CALCULATIONS
// =============================================================================

/**
 * Calculate total budget values from priority selections or creation method
 */
export function calculateBudgetTotals(
  priorities: Record<string, string> | undefined,
  selections: Record<string, unknown>,
  priorityTable: PriorityTableData | null,
  stateBudgets: Record<string, unknown>,
  gameplayModifiers?: GameplayLevelModifiers,
  creationMethodId?: string
): Record<string, BudgetTotalEntry> {
  // Life Modules: 750 Karma budget, gear via karma-to-nuyen conversion
  if (creationMethodId === "life-modules") {
    return calculateLifeModulesBudgetTotals(selections, stateBudgets);
  }

  // Point Buy: 800 Karma budget, gear via karma-to-nuyen conversion
  if (creationMethodId === "point-buy") {
    return calculatePointBuyBudgetTotals(selections, stateBudgets);
  }

  const totals: Record<string, BudgetTotalEntry> = {
    karma: {
      total: gameplayModifiers?.startingKarma ?? 25,
      label: "Karma",
      displayFormat: "number",
    },
  };

  if (!priorityTable || !priorities) {
    return totals;
  }

  // Attribute points from priority
  const attrPriority = priorities.attributes;
  if (attrPriority && priorityTable.table[attrPriority]) {
    const attrPoints = priorityTable.table[attrPriority].attributes;
    totals["attribute-points"] = {
      total: attrPoints || 0,
      label: "Attribute Points",
      displayFormat: "number",
    };
  }

  // Skill points from priority
  const skillPriority = priorities.skills;
  if (skillPriority && priorityTable.table[skillPriority]) {
    const skillData = priorityTable.table[skillPriority].skills;
    totals["skill-points"] = {
      total: skillData?.skillPoints || 0,
      label: "Skill Points",
      displayFormat: "number",
    };
    totals["skill-group-points"] = {
      total: skillData?.skillGroupPoints || 0,
      label: "Skill Group Points",
      displayFormat: "number",
    };
  }

  // Resources (nuyen) from priority, with gameplay level multiplier
  const resourcePriority = priorities.resources;
  if (resourcePriority && priorityTable.table[resourcePriority]) {
    const baseNuyen = priorityTable.table[resourcePriority].resources;
    const multiplier = gameplayModifiers?.resourcesMultiplier ?? 1;
    totals["nuyen"] = {
      total: Math.round((baseNuyen || 0) * multiplier),
      label: "Nuyen",
      displayFormat: "currency",
    };
  }

  // Special attribute points from metatype priority + selected metatype
  const metatypePriority = priorities.metatype;
  const selectedMetatype = selections.metatype as string;
  if (metatypePriority && selectedMetatype && priorityTable.table[metatypePriority]) {
    const metatypeData = priorityTable.table[metatypePriority].metatype;
    const specialPoints = metatypeData?.specialAttributePoints?.[selectedMetatype] || 0;
    totals["special-attribute-points"] = {
      total: specialPoints,
      label: "Special Attribute Points",
      displayFormat: "number",
    };
  }

  // Contact points = CHA x multiplier (calculated from attributes)
  const attributes = selections.attributes as Record<string, number> | undefined;
  const charisma = attributes?.charisma || 1;
  const contactMultiplier = gameplayModifiers?.contactMultiplier ?? 3;
  totals["contact-points"] = {
    total: charisma * contactMultiplier,
    label: "Contact Points",
    displayFormat: "number",
  };

  // Friends in High Places: extra CHA x 4 pool for Connection 8+ contacts
  // This is computed by the provider after qualityModifiers are available
  // We add a placeholder here that gets populated in the provider

  // Knowledge points = (INT + LOG) x 2 (calculated from attributes)
  const intuition = attributes?.intuition || 1;
  const logic = attributes?.logic || 1;
  totals["knowledge-points"] = {
    total: (intuition + logic) * 2,
    label: "Knowledge Points",
    displayFormat: "number",
  };

  // Spell slots and power points from magic priority
  const magicPriority = priorities.magic;
  const magicPath = selections["magical-path"] as string;
  if (magicPriority && priorityTable.table[magicPriority] && magicPath) {
    const magicData = priorityTable.table[magicPriority].magic;
    // Find the selected path's option to get spells/forms count
    const selectedOption = magicData?.options?.find((opt) => opt.path === magicPath);

    if (["magician", "mystic-adept", "aspected-mage"].includes(magicPath)) {
      totals["spell-slots"] = {
        total: selectedOption?.spells || 0,
        label: "Spell Points",
        displayFormat: "number",
      };
    }
    if (["adept", "mystic-adept"].includes(magicPath)) {
      // Get base magic rating from priority table (same logic as AdeptPowersCard)
      let basePowerPoints = 0;

      if (magicPriority && priorityTable?.table[magicPriority]) {
        const option = magicData?.options?.find((o) => o.path === magicPath);
        basePowerPoints = option?.magicRating || 0;
      }

      // For mystic adepts, use their allocated PP split (not base magic rating)
      if (magicPath === "mystic-adept") {
        basePowerPoints = (selections["power-points-allocation"] as number) || 0;
      }

      // Add karma-purchased power points (5 karma per PP)
      const karmaSpentPowerPoints = (stateBudgets?.["karma-spent-power-points"] as number) || 0;
      const karmaPurchasedPP = Math.floor(karmaSpentPowerPoints / 5);

      totals["power-points"] = {
        total: basePowerPoints + karmaPurchasedPP,
        label: "Power Points",
        displayFormat: "decimal",
      };
    }
  }

  return totals;
}

/**
 * Calculate budget totals for Life Modules creation method.
 * Life Modules uses a flat 750 Karma budget with no priority table.
 * Gear is purchased via karma-to-nuyen conversion (1K = 2,000).
 */
export function calculateLifeModulesBudgetTotals(
  selections: Record<string, unknown>,
  stateBudgets: Record<string, unknown>
): Record<string, BudgetTotalEntry> {
  const totals: Record<string, BudgetTotalEntry> = {
    karma: {
      total: LIFE_MODULES_KARMA_BUDGET,
      label: "Karma",
      displayFormat: "number",
    },
  };

  // Nuyen budget: derived from karma-to-nuyen conversion only
  const karmaSpentGear = (stateBudgets["karma-spent-gear"] as number) || 0;
  totals["nuyen"] = {
    total: karmaSpentGear * LIFE_MODULES_NUYEN_PER_KARMA,
    label: "Nuyen",
    displayFormat: "currency",
  };

  // Contact points: CHA x 3 (standard formula, no priority)
  const attributes = selections.attributes as Record<string, number> | undefined;
  const charisma = attributes?.charisma || 1;
  totals["contact-points"] = {
    total: charisma * 3,
    label: "Contact Points",
    displayFormat: "number",
  };

  // Knowledge points: (INT + LOG) x 2
  const intuition = attributes?.intuition || 1;
  const logic = attributes?.logic || 1;
  totals["knowledge-points"] = {
    total: (intuition + logic) * 2,
    label: "Knowledge Points",
    displayFormat: "number",
  };

  return totals;
}

/**
 * Calculate budget totals for Point Buy creation method.
 * Point Buy uses a flat 800 Karma budget with no priority table.
 * Gear is purchased via karma-to-nuyen conversion (1K = 2,000).
 */
export function calculatePointBuyBudgetTotals(
  selections: Record<string, unknown>,
  stateBudgets: Record<string, unknown>
): Record<string, BudgetTotalEntry> {
  const totals: Record<string, BudgetTotalEntry> = {
    karma: {
      total: POINT_BUY_KARMA_BUDGET,
      label: "Karma",
      displayFormat: "number",
    },
  };

  // Nuyen budget: derived from karma-to-nuyen conversion only
  const karmaSpentGear = (stateBudgets["karma-spent-gear"] as number) || 0;
  totals["nuyen"] = {
    total: karmaSpentGear * POINT_BUY_NUYEN_PER_KARMA,
    label: "Nuyen",
    displayFormat: "currency",
  };

  // Contact points: CHA x 3 (standard formula, no priority)
  const attributes = selections.attributes as Record<string, number> | undefined;
  const charisma = attributes?.charisma || 1;
  totals["contact-points"] = {
    total: charisma * 3,
    label: "Contact Points",
    displayFormat: "number",
  };

  // Knowledge points: (INT + LOG) x 2
  const intuition = attributes?.intuition || 1;
  const logic = attributes?.logic || 1;
  totals["knowledge-points"] = {
    total: (intuition + logic) * 2,
    label: "Knowledge Points",
    displayFormat: "number",
  };

  return totals;
}
