/**
 * Quality Budget Modifiers
 *
 * Pure-function module that calculates how certain Run Faster qualities
 * modify character creation budget calculations (karma-to-nuyen cap,
 * knowledge skill costs, language costs, skill karma costs).
 *
 * Importable from both client and server code (no React dependencies).
 */

import type { CreationSelections, QualitySelectionValue } from "@/lib/types";
import {
  getPositiveQualityIds,
  getPositiveQualities,
  getQualityId,
} from "@/lib/types/creation-selections";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Knowledge skill category multipliers.
 * Default 1.0 means full cost; 0.5 means half cost.
 */
export interface KnowledgeCostMultipliers {
  academic: number;
  street: number;
  professional: number;
  interests: number;
}

/**
 * A free contact granted by a quality (e.g., Made Man, Sensei).
 */
export interface QualityFreeContact {
  qualityId: string;
  name: string;
  connection: number;
  loyalty: number;
  type: string;
  specification?: string;
}

/**
 * Budget modifiers derived from selected qualities.
 */
export interface QualityBudgetModifiers {
  /** Maximum karma that can be converted to nuyen (default 10, Born Rich -> 40) */
  karmaToNuyenCap: number;
  /** Per-category cost multipliers for knowledge skills */
  knowledgeCostMultipliers: KnowledgeCostMultipliers;
  /** Cost multiplier for language skills (default 1.0, Linguist -> 0.5) */
  languageCostMultiplier: number;
  /** Whether Jack of All Trades is active */
  jackOfAllTrades: boolean;
  /** Whether Friends in High Places is active (extra CHA × 4 pool for Connection 8+ contacts) */
  friendsInHighPlaces: boolean;
  /** Free contacts granted by qualities (Made Man, Sensei) */
  freeContacts: QualityFreeContact[];
  /** Whether Restricted Gear is active (1 item up to Availability 24) */
  restrictedGear: boolean;
  /** Black Market Pipeline discount info, or null if not active */
  blackMarketPipeline: {
    specification: string;
    priceMultiplier: number;
    availabilityBonus: number;
  } | null;
}

// =============================================================================
// QUALITY IDS
// =============================================================================

const BORN_RICH = "born-rich";
const COLLEGE_EDUCATION = "college-education";
const SCHOOL_OF_HARD_KNOCKS = "school-of-hard-knocks";
const TECHNICAL_SCHOOL_EDUCATION = "technical-school-education";
const LINGUIST = "linguist";
const JACK_OF_ALL_TRADES = "jack-of-all-trades";
export const FRIENDS_IN_HIGH_PLACES = "friends-in-high-places";
export const MADE_MAN = "made-man";
export const SENSEI = "sensei";
export const RESTRICTED_GEAR = "restricted-gear";
export const BLACK_MARKET_PIPELINE = "black-market-pipeline";

// =============================================================================
// DEFAULTS
// =============================================================================

const DEFAULT_KARMA_TO_NUYEN_CAP = 10;
const BORN_RICH_KARMA_TO_NUYEN_CAP = 40;

/** Friends in High Places contact pool multiplier (CHA × this value) */
export const FRIENDS_IN_HIGH_PLACES_CONTACT_MULTIPLIER = 4;

/** Returns a fresh default modifiers object (avoids shared mutable reference). */
export function getDefaultModifiers(): QualityBudgetModifiers {
  return {
    karmaToNuyenCap: DEFAULT_KARMA_TO_NUYEN_CAP,
    knowledgeCostMultipliers: {
      academic: 1.0,
      street: 1.0,
      professional: 1.0,
      interests: 1.0,
    },
    languageCostMultiplier: 1.0,
    jackOfAllTrades: false,
    friendsInHighPlaces: false,
    freeContacts: [],
    restrictedGear: false,
    blackMarketPipeline: null,
  };
}

// =============================================================================
// MAIN FUNCTIONS
// =============================================================================

/**
 * Compute budget modifiers from selected qualities.
 *
 * Checks for the following Run Faster qualities:
 * - Born Rich: karma-to-nuyen cap 10 -> 40
 * - College Education: academic knowledge skills at half cost
 * - School of Hard Knocks: street knowledge skills at half cost
 * - Technical School Education: professional knowledge skills at half cost
 * - Linguist: language skills at half cost
 * - Jack of All Trades: modifies individual skill karma costs
 * - Friends in High Places: extra CHA × 4 contact pool for Connection 8+
 * - Made Man: free syndicate group contact (Connection 2, Loyalty 4)
 * - Sensei: free training contact (Connection 1, Loyalty 1)
 * - Restricted Gear: allows 1 item up to Availability 24
 * - Black Market Pipeline: 10% discount and +2 Avail for one category
 */
export function getQualityBudgetModifiers(selections: CreationSelections): QualityBudgetModifiers {
  const qualityIds = getPositiveQualityIds(selections);

  if (qualityIds.length === 0) {
    return getDefaultModifiers();
  }

  const qualitySet = new Set(qualityIds);
  const qualities = getPositiveQualities(selections);

  // Build free contacts from Made Man and Sensei
  const freeContacts: QualityFreeContact[] = [];
  for (const q of qualities) {
    const id = getQualityId(q);
    if (id === MADE_MAN || id === SENSEI) {
      freeContacts.push(buildFreeContact(id, getQualitySpecification(q)));
    }
  }

  // Build Black Market Pipeline info
  let blackMarketPipeline: QualityBudgetModifiers["blackMarketPipeline"] = null;
  if (qualitySet.has(BLACK_MARKET_PIPELINE)) {
    const bmpQuality = qualities.find((q) => getQualityId(q) === BLACK_MARKET_PIPELINE);
    const spec = bmpQuality ? getQualitySpecification(bmpQuality) : undefined;
    if (spec) {
      blackMarketPipeline = {
        specification: spec,
        priceMultiplier: 0.9,
        availabilityBonus: 2,
      };
    }
  }

  return {
    karmaToNuyenCap: qualitySet.has(BORN_RICH)
      ? BORN_RICH_KARMA_TO_NUYEN_CAP
      : DEFAULT_KARMA_TO_NUYEN_CAP,
    knowledgeCostMultipliers: {
      academic: qualitySet.has(COLLEGE_EDUCATION) ? 0.5 : 1.0,
      street: qualitySet.has(SCHOOL_OF_HARD_KNOCKS) ? 0.5 : 1.0,
      professional: qualitySet.has(TECHNICAL_SCHOOL_EDUCATION) ? 0.5 : 1.0,
      interests: 1.0,
    },
    languageCostMultiplier: qualitySet.has(LINGUIST) ? 0.5 : 1.0,
    jackOfAllTrades: qualitySet.has(JACK_OF_ALL_TRADES),
    friendsInHighPlaces: qualitySet.has(FRIENDS_IN_HIGH_PLACES),
    freeContacts,
    restrictedGear: qualitySet.has(RESTRICTED_GEAR),
    blackMarketPipeline,
  };
}

/**
 * Extract specification from a quality selection value.
 */
function getQualitySpecification(q: QualitySelectionValue): string | undefined {
  return typeof q === "string" ? undefined : q.specification;
}

/**
 * Build a free contact for a quality (Made Man or Sensei).
 * Shared by both the modifier computation and the UI side-effect.
 */
export function buildFreeContact(qualityId: string, specification?: string): QualityFreeContact {
  if (qualityId === MADE_MAN) {
    return {
      qualityId: MADE_MAN,
      name: specification ? `${specification} Contact` : "Syndicate Contact",
      connection: 2,
      loyalty: 4,
      type: "Syndicate",
      specification,
    };
  }
  return {
    qualityId: SENSEI,
    name: specification ? `${specification} Sensei` : "Sensei",
    connection: 1,
    loyalty: 1,
    type: "Training",
    specification,
  };
}

/**
 * Apply Jack of All Trades modifier to a skill karma cost.
 *
 * SR5 Run Faster rule:
 * - For each level up to and including rating 5: -1 karma per level (minimum 1)
 * - For each level above rating 5: +2 karma per level
 *
 * This applies per-level, so raising from 3 to 5 gets -1 per level = -2 total.
 * Raising from 4 to 7 gets -1 for levels 5, +2 for levels 6-7.
 *
 * @param baseCost - The base karma cost (New Rating x 2 per level)
 * @param fromRating - Starting rating
 * @param toRating - Target rating
 * @returns Adjusted karma cost (minimum 1 karma per level)
 */
export function applyJackOfAllTradesModifier(
  baseCost: number,
  fromRating: number,
  toRating: number
): number {
  if (toRating <= fromRating) return 0;

  let adjustedTotal = 0;
  for (let r = fromRating + 1; r <= toRating; r++) {
    const levelBaseCost = r * 2; // SR5: New Rating × 2
    const adjustment = r <= 5 ? -1 : 2;
    adjustedTotal += Math.max(1, levelBaseCost + adjustment);
  }
  return adjustedTotal;
}
