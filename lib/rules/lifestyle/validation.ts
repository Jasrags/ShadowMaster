/**
 * Lifestyle validation functions.
 *
 * Pure validators for the expanded lifestyle system:
 * - Point budget (spent ≤ available, negative option cap)
 * - Component levels (between base and limit)
 * - Entertainment requirements (minimum lifestyle, safehouse)
 */

import type { LifestyleData, EntertainmentOptionCatalogItem } from "../loader-types";
import type { LifestyleModificationCatalogItem } from "../module-payloads";
import type {
  LifestyleComponentSelections,
  LifestyleEntertainmentOption,
} from "../../types/character";

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// =============================================================================
// LIFESTYLE TIER ORDER (for minLifestyle comparison)
// =============================================================================

const LIFESTYLE_TIER_ORDER: Record<string, number> = {
  none: -1,
  street: 0,
  squatter: 1,
  low: 2,
  middle: 3,
  medium: 3, // alias
  high: 4,
  luxury: 5,
  "bolt-hole": 1, // roughly squatter-level
  traveler: 2, // roughly low-level
  commercial: 3, // roughly middle-level
};

/**
 * Check if a lifestyle tier meets the minimum requirement.
 */
export function meetsMinimumLifestyle(lifestyleId: string, minLifestyle: string): boolean {
  if (minLifestyle === "none") return true;
  const lifestyleTier = LIFESTYLE_TIER_ORDER[lifestyleId] ?? 0;
  const minTier = LIFESTYLE_TIER_ORDER[minLifestyle] ?? 0;
  return lifestyleTier >= minTier;
}

// =============================================================================
// POINT BUDGET
// =============================================================================

/**
 * Calculate total points spent on component level raises and entertainment.
 */
export function calculatePointsSpent(params: {
  lifestyleData: LifestyleData;
  components?: LifestyleComponentSelections;
  entertainmentOptions?: LifestyleEntertainmentOption[];
  entertainmentCatalog?: EntertainmentOptionCatalogItem[];
}): number {
  const {
    lifestyleData,
    components,
    entertainmentOptions = [],
    entertainmentCatalog = [],
  } = params;

  let pointsSpent = 0;

  // Points spent on component raises
  if (components && lifestyleData.components) {
    const baseLevels = lifestyleData.components;
    pointsSpent +=
      Math.max(0, components.comfortsAndNecessities - baseLevels.comfortsAndNecessities.base) +
      Math.max(0, components.security - baseLevels.security.base) +
      Math.max(0, components.neighborhood - baseLevels.neighborhood.base);
  }

  // Points spent on entertainment
  pointsSpent += entertainmentOptions.reduce((sum, opt) => {
    const catalogItem = entertainmentCatalog.find((c) => c.id === opt.catalogId);
    return sum + (catalogItem?.points ?? 0) * opt.quantity;
  }, 0);

  return pointsSpent;
}

/**
 * Validate that points spent do not exceed the available budget.
 *
 * Available points = base points + points from negative options
 *   - points consumed by positive options
 * Negative options can grant at most 2× starting points.
 */
export function validatePointBudget(params: {
  lifestyleData: LifestyleData;
  components?: LifestyleComponentSelections;
  entertainmentOptions?: LifestyleEntertainmentOption[];
  entertainmentCatalog?: EntertainmentOptionCatalogItem[];
  modifications?: LifestyleModificationCatalogItem[];
}): ValidationResult {
  const { lifestyleData, modifications = [] } = params;
  const errors: string[] = [];

  const basePoints = typeof lifestyleData.points === "number" ? lifestyleData.points : 0;

  // Points from negative options (capped at 2× base)
  const pointsFromNegatives = modifications.reduce((sum, mod) => sum + (mod.pointsGranted ?? 0), 0);
  const maxNegativePoints = basePoints * 2;
  const cappedNegativePoints = Math.min(pointsFromNegatives, maxNegativePoints);

  if (pointsFromNegatives > maxNegativePoints) {
    errors.push(
      `Negative options grant ${pointsFromNegatives} points but maximum is ${maxNegativePoints} (2× base ${basePoints})`
    );
  }

  // Points consumed by positive options
  const pointsConsumedByPositives = modifications.reduce(
    (sum, mod) => sum + (mod.pointsCost ?? 0),
    0
  );

  const totalAvailable = basePoints + cappedNegativePoints - pointsConsumedByPositives;
  const totalSpent = calculatePointsSpent(params);

  if (totalSpent > totalAvailable) {
    errors.push(`Points spent (${totalSpent}) exceeds available (${totalAvailable})`);
  }

  return { valid: errors.length === 0, errors };
}

// =============================================================================
// COMPONENT LEVELS
// =============================================================================

/**
 * Validate that each component level is between the tier's base and limit.
 */
export function validateComponentLevels(
  lifestyleData: LifestyleData,
  components: LifestyleComponentSelections
): ValidationResult {
  const errors: string[] = [];

  if (!lifestyleData.components) {
    return { valid: true, errors: [] };
  }

  const { comfortsAndNecessities, security, neighborhood } = lifestyleData.components;

  if (
    components.comfortsAndNecessities < comfortsAndNecessities.base ||
    components.comfortsAndNecessities > comfortsAndNecessities.limit
  ) {
    errors.push(
      `Comforts & Necessities (${components.comfortsAndNecessities}) must be between ${comfortsAndNecessities.base} and ${comfortsAndNecessities.limit}`
    );
  }

  if (components.security < security.base || components.security > security.limit) {
    errors.push(
      `Security (${components.security}) must be between ${security.base} and ${security.limit}`
    );
  }

  if (components.neighborhood < neighborhood.base || components.neighborhood > neighborhood.limit) {
    errors.push(
      `Neighborhood (${components.neighborhood}) must be between ${neighborhood.base} and ${neighborhood.limit}`
    );
  }

  return { valid: errors.length === 0, errors };
}

// =============================================================================
// ENTERTAINMENT REQUIREMENTS
// =============================================================================

/**
 * Validate that entertainment options meet minimum lifestyle requirements
 * and respect safehouse restrictions.
 */
export function validateEntertainmentRequirements(params: {
  lifestyleId: string;
  entertainmentOptions: LifestyleEntertainmentOption[];
  entertainmentCatalog: EntertainmentOptionCatalogItem[];
  hasSafehouseOption?: boolean;
}): ValidationResult {
  const {
    lifestyleId,
    entertainmentOptions,
    entertainmentCatalog,
    hasSafehouseOption = false,
  } = params;
  const errors: string[] = [];

  for (const opt of entertainmentOptions) {
    const catalogItem = entertainmentCatalog.find((c) => c.id === opt.catalogId);
    if (!catalogItem) {
      errors.push(`Unknown entertainment option: ${opt.catalogId}`);
      continue;
    }

    // Check minimum lifestyle
    if (!meetsMinimumLifestyle(lifestyleId, catalogItem.minLifestyle)) {
      errors.push(
        `${catalogItem.name} requires minimum lifestyle "${catalogItem.minLifestyle}" but current is "${lifestyleId}"`
      );
    }

    // Check safehouse restriction (no entertainment assets)
    if (hasSafehouseOption && catalogItem.type === "asset") {
      errors.push(`${catalogItem.name} (asset) cannot be added to a safehouse`);
    }

    // Check quantity for non-multi-purchasable items
    if (!catalogItem.purchasableMultipleTimes && opt.quantity > 1) {
      errors.push(`${catalogItem.name} can only be purchased once`);
    }
  }

  return { valid: errors.length === 0, errors };
}
