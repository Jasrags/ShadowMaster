/**
 * Lifestyle cost calculation functions.
 *
 * Implements the Run Faster cost formula (p. 216):
 * - Each point spent on C&N/Security/Neighborhood increases monthly cost
 *   by 10% of base cost per raised level
 * - Street lifestyle exception: flat 50¥ per raised level instead of 10%
 * - Entertainment costs are added directly
 * - Lifestyle modification costs (flat/percentage) are applied
 */

import type { LifestyleData, EntertainmentOptionCatalogItem } from "../loader-types";
import type { LifestyleModificationCatalogItem } from "../module-payloads";
import type {
  LifestyleComponentSelections,
  LifestyleEntertainmentOption,
} from "../../types/character";

/**
 * Calculate the cost increase from raising component levels above base.
 *
 * Standard formula: each raised level costs 10% of the base monthly cost.
 * Street exception: flat 50¥ per raised level (costPerLevelFlat field).
 */
export function calculateComponentLevelCost(
  lifestyleData: LifestyleData,
  components: LifestyleComponentSelections
): number {
  if (!lifestyleData.components) return 0;

  const baseLevels = lifestyleData.components;
  const raisedLevels =
    Math.max(0, components.comfortsAndNecessities - baseLevels.comfortsAndNecessities.base) +
    Math.max(0, components.security - baseLevels.security.base) +
    Math.max(0, components.neighborhood - baseLevels.neighborhood.base);

  if (raisedLevels === 0) return 0;

  if (lifestyleData.costPerLevelFlat !== undefined) {
    return raisedLevels * lifestyleData.costPerLevelFlat;
  }

  return raisedLevels * (lifestyleData.monthlyCost * 0.1);
}

/**
 * Calculate the total monthly cost for an expanded lifestyle including
 * base cost, component level increases, entertainment options, and
 * modification costs.
 */
export function calculateExpandedLifestyleCost(params: {
  lifestyleData: LifestyleData;
  components?: LifestyleComponentSelections;
  entertainmentOptions?: LifestyleEntertainmentOption[];
  entertainmentCatalog?: EntertainmentOptionCatalogItem[];
  modifications?: Array<{
    type: "positive" | "negative";
    modifier: number;
    modifierType: "percentage" | "flat";
  }>;
  modificationsCatalog?: LifestyleModificationCatalogItem[];
  customExpenses?: number;
  customIncome?: number;
}): number {
  const {
    lifestyleData,
    components,
    entertainmentOptions = [],
    entertainmentCatalog = [],
    modifications = [],
    customExpenses = 0,
    customIncome = 0,
  } = params;

  const baseCost = lifestyleData.monthlyCost;

  // Component level cost increases
  const componentCost = components ? calculateComponentLevelCost(lifestyleData, components) : 0;

  // Entertainment option costs
  const entertainmentCost = entertainmentOptions.reduce((sum, opt) => {
    const catalogItem = entertainmentCatalog.find((c) => c.id === opt.catalogId);
    return sum + (catalogItem?.monthlyCost ?? 0) * opt.quantity;
  }, 0);

  // Modification costs
  const modificationCost = modifications.reduce((sum, mod) => {
    if (mod.modifierType === "percentage") {
      return sum + ((baseCost * mod.modifier) / 100) * (mod.type === "positive" ? 1 : -1);
    }
    return sum + mod.modifier * (mod.type === "positive" ? 1 : -1);
  }, 0);

  return Math.max(
    0,
    baseCost + componentCost + entertainmentCost + modificationCost + customExpenses - customIncome
  );
}
