/**
 * Budget spent value extraction for character creation.
 *
 * Pure functions that derive spent amounts from creation state
 * selections and budget data. No React dependencies.
 */

import type { PriorityTableData } from "@/lib/rules/RulesetContext";
import type { LifeModuleSelection } from "@/lib/types";
import type { BudgetTotalEntry } from "./budget-totals";
import {
  getFreeSkillsFromMagicPriority,
  calculateFreeSkillPointsUsed,
  calculateFreeSkillGroupPointsUsed,
  calculateFreePointsFromDesignations,
  type FreeSkillDesignations,
} from "@/lib/rules/skills/free-skills";
import { calculateBrokenGroupSkillPointOffset } from "@/lib/rules/skills/group-utils";
import {
  getDefaultModifiers,
  type QualityBudgetModifiers,
} from "@/lib/rules/qualities/budget-modifiers";
import {
  POINT_BUY_METATYPE_COSTS,
  POINT_BUY_MAGIC_QUALITY_COSTS,
} from "@/lib/rules/point-buy-validation";

// =============================================================================
// CONSTANTS
// =============================================================================

const SIN_COST_PER_RATING = 2500;
const LICENSE_COST_PER_RATING = 200;

// =============================================================================
// SPENT VALUE EXTRACTION
// =============================================================================

/**
 * Extract spent values from creation state budgets and selections
 *
 * Phase 4.2: Budget calculation is now derived from selections where possible,
 * reducing the need for components to update both selections AND budgets.
 */
export function extractSpentValues(
  stateBudgets: Record<string, number>,
  selections: Record<string, unknown>,
  totals: Record<string, BudgetTotalEntry>,
  priorityTable: PriorityTableData | null,
  priorities: Record<string, string> | undefined,
  skillCategories: Record<string, string | undefined>,
  skillGroupDefs: { id: string; skills: string[] }[] = [],
  qualityModifiers: QualityBudgetModifiers = getDefaultModifiers(),
  creationMethodId?: string
): Record<string, number> {
  const spent: Record<string, number> = {};

  // ============================================================================
  // ATTRIBUTE POINTS - derived from selections
  // ============================================================================

  // Core attribute points: stored directly in selections.coreAttributePointsSpent
  // This is set by AttributesCard when attributes change
  const coreAttributePointsSpent = selections.coreAttributePointsSpent as number | undefined;
  if (coreAttributePointsSpent !== undefined) {
    spent["attribute-points"] = coreAttributePointsSpent;
  } else if ("attribute-points-spent" in stateBudgets) {
    // Fallback to legacy budget field for backwards compatibility
    spent["attribute-points"] = stateBudgets["attribute-points-spent"] as number;
  }

  // Special attribute points: sum of allocated points in selections.specialAttributes
  // Each value represents points ALLOCATED (not the total attribute value)
  const specialAttributes = (selections.specialAttributes || {}) as Record<string, number>;
  spent["special-attribute-points"] = Object.values(specialAttributes).reduce(
    (sum, allocated) => sum + (allocated || 0),
    0
  );

  // ============================================================================
  // CONTACT POINTS - derived from selections
  // Cap at free pool (CHA x 3) - overflow goes to karma, not contact points
  // Quality-granted contacts (sourceQualityId set) are free and excluded
  // ============================================================================

  const contacts = (selections.contacts || []) as Array<{
    connection: number;
    loyalty: number;
    sourceQualityId?: string;
  }>;
  // Filter out quality-granted contacts (they are free)
  const paidContacts = contacts.filter((c) => !c.sourceQualityId);

  // If Friends in High Places is active, split contacts into high-connection and regular
  const highConnectionPool = totals["high-connection-contact-points"]?.total || 0;
  let highConnectionSpent = 0;
  let regularContactCost = 0;

  if (highConnectionPool > 0) {
    // High-connection contacts (Connection 8+) use the special pool first
    const highConnectionContacts = paidContacts.filter((c) => c.connection >= 8);
    const regularContacts = paidContacts.filter((c) => c.connection < 8);

    const totalHighCost = highConnectionContacts.reduce(
      (sum, c) => sum + c.connection + c.loyalty,
      0
    );
    highConnectionSpent = Math.min(totalHighCost, highConnectionPool);
    // Overflow from high-connection pool goes to regular pool
    const highConnectionOverflow = Math.max(0, totalHighCost - highConnectionPool);
    regularContactCost =
      regularContacts.reduce((sum, c) => sum + c.connection + c.loyalty, 0) +
      highConnectionOverflow;

    spent["high-connection-contact-points"] = highConnectionSpent;
  } else {
    regularContactCost = paidContacts.reduce((sum, c) => sum + c.connection + c.loyalty, 0);
  }

  const freeContactPool = totals["contact-points"]?.total || 0;
  // Only count up to the free pool - karma handles the rest
  spent["contact-points"] = Math.min(regularContactCost, freeContactPool);

  // ============================================================================
  // SPELL SLOTS - derived from selections
  // ============================================================================

  const spells = (selections.spells || []) as Array<string | { id: string }>;
  const freeSpellsTotal = totals["spell-slots"]?.total || 0;
  spent["spell-slots"] = Math.min(spells.length, freeSpellsTotal);

  // ============================================================================
  // REMAINING BUDGET MAPPINGS - still read from stateBudgets for now
  // ============================================================================

  // Power points still read from stateBudgets (adept power selection is complex)
  const remainingMappings: Record<string, string> = {
    "power-points-spent": "power-points",
  };

  for (const [stateKey, budgetId] of Object.entries(remainingMappings)) {
    if (stateKey in stateBudgets) {
      spent[budgetId] = stateBudgets[stateKey] as number;
    }
  }

  // Extract skill groups early - needed for both skill-points offset and group-points calculation
  // Handles both legacy (number) and new ({ rating, isBroken }) formats
  const skillGroups = (selections.skillGroups || {}) as Record<
    string,
    number | { rating: number; isBroken: boolean }
  >;

  // Calculate skill points spent from selections
  // Subtract rating points purchased with karma (those don't count against skill point budget)
  // Subtract free skill points from magic priority (those don't count against skill point budget)
  // Subtract broken group base ratings (already funded by group points)
  // Include specializations (1 skill point each during creation)
  const skills = (selections.skills || {}) as Record<string, number>;
  const totalSkillRatings = Object.values(skills).reduce((sum, rating) => sum + rating, 0);
  const karmaRatingPoints =
    (selections.skillKarmaSpent as { skillRatingPoints?: number } | undefined)?.skillRatingPoints ||
    0;
  const skillSpecializations = (selections.skillSpecializations || {}) as Record<string, string[]>;
  const totalSpecPoints = Object.values(skillSpecializations).reduce(
    (sum, specs) => sum + specs.length,
    0
  );

  // Calculate free skill points from magic priority
  // Use explicit designations if present, otherwise fall back to automatic allocation
  const magicPath = selections["magical-path"] as string | undefined;
  const freeSkillConfigs = getFreeSkillsFromMagicPriority(
    priorityTable,
    priorities?.magic,
    magicPath
  );
  const freeSkillDesignations = selections.freeSkillDesignations as
    | FreeSkillDesignations
    | undefined;

  // Check for explicit designations first (new system)
  // Fall back to automatic allocation (legacy system) only if no designations exist
  const hasExplicitDesignations =
    freeSkillDesignations &&
    ((freeSkillDesignations.magical && freeSkillDesignations.magical.length > 0) ||
      (freeSkillDesignations.resonance && freeSkillDesignations.resonance.length > 0) ||
      (freeSkillDesignations.active && freeSkillDesignations.active.length > 0));

  const freeSkillPoints = hasExplicitDesignations
    ? calculateFreePointsFromDesignations(skills, freeSkillConfigs, freeSkillDesignations)
    : calculateFreeSkillPointsUsed(skills, freeSkillConfigs, skillCategories);

  // Calculate broken group offset: base ratings already funded by group points
  const brokenGroupOffset = calculateBrokenGroupSkillPointOffset(
    skillGroups,
    skills,
    skillGroupDefs
  );

  spent["skill-points"] =
    totalSkillRatings + totalSpecPoints - karmaRatingPoints - freeSkillPoints - brokenGroupOffset;

  // Calculate skill group points spent from selections
  // Subtract karma-purchased group rating points - they don't count against group point budget
  // Subtract free skill group points from magic priority (aspected mages)
  const totalGroupRatings = Object.values(skillGroups).reduce<number>((sum, value) => {
    const rating = typeof value === "number" ? value : value.rating;
    return sum + rating;
  }, 0);
  const karmaGroupRatingPoints =
    (selections.skillKarmaSpent as { groupRatingPoints?: number } | undefined)?.groupRatingPoints ||
    0;

  // Calculate free skill group points from magic priority (aspected mages)
  const freeSkillGroupPoints = calculateFreeSkillGroupPointsUsed(skillGroups, freeSkillConfigs);

  spent["skill-group-points"] = totalGroupRatings - karmaGroupRatingPoints - freeSkillGroupPoints;

  // Calculate knowledge points spent from selections (languages + knowledge skills)
  // Native languages are free and do not count toward the knowledge point budget (SR5 Core)
  // Apply quality modifiers: Linguist halves language costs, education qualities halve category costs
  const languages = (selections.languages || []) as Array<{ rating: number; isNative?: boolean }>;
  const knowledgeSkills = (selections.knowledgeSkills || []) as Array<{
    rating: number;
    category?: string;
  }>;
  const languagePointsSpent = languages
    .filter((lang) => !lang.isNative)
    .reduce((sum, lang) => sum + (lang.rating || 0) * qualityModifiers.languageCostMultiplier, 0);
  const knowledgePointsSpent = knowledgeSkills.reduce((sum, skill) => {
    const category = skill.category as keyof typeof qualityModifiers.knowledgeCostMultipliers;
    const multiplier = qualityModifiers.knowledgeCostMultipliers[category] ?? 1;
    return sum + (skill.rating || 0) * multiplier;
  }, 0);
  spent["knowledge-points"] = Math.ceil(languagePointsSpent + knowledgePointsSpent);

  // Nuyen is special - calculate from all spending categories in selections
  spent["nuyen"] = calculateNuyenSpent(selections);

  // ============================================================================
  // KARMA - calculate from multiple sources
  // ============================================================================

  spent["karma"] = calculateKarmaSpent(
    stateBudgets,
    selections,
    regularContactCost,
    freeContactPool,
    creationMethodId
  );

  return spent;
}

// =============================================================================
// NUYEN CALCULATION
// =============================================================================

function calculateNuyenSpent(selections: Record<string, unknown>): number {
  const gear = (selections.gear || []) as Array<{
    cost: number;
    quantity: number;
    modifications?: Array<{ cost: number }>;
  }>;
  const weapons = (selections.weapons || []) as Array<{
    cost: number;
    quantity: number;
    modifications?: Array<{ cost: number }>;
    purchasedAmmunition?: Array<{ cost: number; quantity: number }>;
  }>;
  const armor = (selections.armor || []) as Array<{
    cost: number;
    quantity: number;
    modifications?: Array<{ cost: number }>;
  }>;
  const cyberware = (selections.cyberware || []) as Array<{
    cost: number;
    enhancements?: Array<{ cost: number }>;
  }>;
  const bioware = (selections.bioware || []) as Array<{ cost: number }>;
  const foci = (selections.foci || []) as Array<{ cost: number }>;
  const vehicles = (selections.vehicles || []) as Array<{
    cost: number;
    quantity: number;
    modifications?: Array<{ cost: number }>;
  }>;
  const drones = (selections.drones || []) as Array<{ cost: number }>;
  const rccs = (selections.rccs || []) as Array<{ cost: number }>;
  const autosofts = (selections.autosofts || []) as Array<{ cost: number }>;
  const commlinks = (selections.commlinks || []) as Array<{ cost: number }>;
  const cyberdecks = (selections.cyberdecks || []) as Array<{ cost: number }>;
  const software = (selections.software || []) as Array<{ cost: number }>;
  const drugs = (selections.drugs || []) as Array<{ cost: number; quantity: number }>;
  const toxins = (selections.toxins || []) as Array<{ cost: number; quantity: number }>;
  const identities = (selections.identities || []) as Array<{
    sin: { type: string; rating: number };
    licenses?: Array<{ type: string; rating: number }>;
    subscriptions?: Array<{ monthlyCost: number }>;
  }>;

  // Calculate gear spending
  const gearSpent = gear.reduce((sum, g) => {
    const baseCost = g.cost * (g.quantity || 1);
    const modCost = g.modifications?.reduce((m, mod) => m + mod.cost, 0) || 0;
    return sum + baseCost + modCost;
  }, 0);

  // Calculate weapons spending
  const weaponsSpent = weapons.reduce((sum, w) => {
    const baseCost = w.cost * (w.quantity || 1);
    const modCost = w.modifications?.reduce((m, mod) => m + mod.cost, 0) || 0;
    const ammoCost =
      w.purchasedAmmunition?.reduce((a, ammo) => a + ammo.cost * (ammo.quantity || 1), 0) || 0;
    return sum + baseCost + modCost + ammoCost;
  }, 0);

  // Calculate armor spending
  const armorSpent = armor.reduce((sum, a) => {
    const baseCost = a.cost * (a.quantity || 1);
    const modCost = a.modifications?.reduce((m, mod) => m + mod.cost, 0) || 0;
    return sum + baseCost + modCost;
  }, 0);

  // Calculate augmentation spending (cyberware + bioware)
  const cyberwareSpent = cyberware.reduce((sum, c) => {
    const baseCost = c.cost || 0;
    const enhCost = c.enhancements?.reduce((e, enh) => e + (enh.cost || 0), 0) || 0;
    return sum + baseCost + enhCost;
  }, 0);
  const biowareSpent = bioware.reduce((sum, b) => sum + (b.cost || 0), 0);

  // Calculate foci spending
  const fociSpent = foci.reduce((sum, f) => sum + (f.cost || 0), 0);

  // Calculate vehicles spending
  const vehiclesSpent = vehicles.reduce((sum, v) => {
    const baseCost = v.cost * (v.quantity || 1);
    const modCost = v.modifications?.reduce((m, mod) => m + mod.cost, 0) || 0;
    return sum + baseCost + modCost;
  }, 0);

  // Calculate drones, RCCs, and autosofts spending
  const dronesSpent = drones.reduce((sum, d) => sum + (d.cost || 0), 0);
  const rccsSpent = rccs.reduce((sum, r) => sum + (r.cost || 0), 0);
  const autosoftsSpent = autosofts.reduce((sum, a) => sum + (a.cost || 0), 0);

  // Calculate lifestyle spending (expanded cost + metatype modifier)
  const lifestylesList = (selections.lifestyles || []) as Array<{
    monthlyCost: number;
    prepaidMonths?: number;
    type?: string;
    modifications?: Array<{
      type: "positive" | "negative";
      modifier: number;
      modifierType: "percentage" | "flat";
    }>;
    subscriptions?: Array<{ monthlyCost: number }>;
    components?: { comfortsAndNecessities: number; security: number; neighborhood: number };
    entertainmentOptions?: Array<{ catalogId: string; name: string; quantity: number }>;
    customExpenses?: number;
    customIncome?: number;
  }>;
  const lifestyleSpent = lifestylesList.reduce((sum, ls) => {
    // Use simple inline calculation (no catalog available in this context)
    const baseCost = ls.monthlyCost;
    const modsCost = (ls.modifications || []).reduce((mSum, mod) => {
      if (mod.modifierType === "percentage") {
        return mSum + ((baseCost * mod.modifier) / 100) * (mod.type === "positive" ? 1 : -1);
      }
      return mSum + mod.modifier * (mod.type === "positive" ? 1 : -1);
    }, 0);
    const subsCost = (ls.subscriptions || []).reduce((sSum, sub) => sSum + sub.monthlyCost, 0);
    const totalMonthly = Math.max(
      0,
      baseCost + modsCost + subsCost + (ls.customExpenses || 0) - (ls.customIncome || 0)
    );
    return sum + totalMonthly * (ls.prepaidMonths || 1);
  }, 0);

  // Calculate matrix gear spending (commlinks, cyberdecks, software)
  const commlinksSpent = commlinks.reduce((sum, c) => sum + (c.cost || 0), 0);
  const cyberdecksSpent = cyberdecks.reduce((sum, d) => sum + (d.cost || 0), 0);
  const softwareSpent = software.reduce((sum, s) => sum + (s.cost || 0), 0);

  // Calculate drugs spending
  const drugsSpent = drugs.reduce((sum, d) => sum + d.cost * (d.quantity || 1), 0);

  // Calculate toxins spending
  const toxinsSpent = toxins.reduce((sum, t) => sum + t.cost * (t.quantity || 1), 0);

  // Calculate identity spending (fake SINs and licenses)
  // Fake SIN: Rating x 2,500, Fake License: Rating x 200
  const identitiesSpent = identities.reduce((sum, identity) => {
    const sinCost =
      identity.sin?.type === "fake" ? (identity.sin.rating || 0) * SIN_COST_PER_RATING : 0;
    const licensesCost =
      identity.licenses?.reduce((lSum, lic) => {
        return lSum + (lic.type === "fake" ? (lic.rating || 0) * LICENSE_COST_PER_RATING : 0);
      }, 0) || 0;
    const subscriptionsCost =
      identity.subscriptions?.reduce((sSum, sub) => sSum + (sub.monthlyCost || 0), 0) || 0;
    return sum + sinCost + licensesCost + subscriptionsCost;
  }, 0);

  // Total nuyen spent
  return (
    gearSpent +
    weaponsSpent +
    armorSpent +
    cyberwareSpent +
    biowareSpent +
    fociSpent +
    vehiclesSpent +
    dronesSpent +
    rccsSpent +
    autosoftsSpent +
    lifestyleSpent +
    commlinksSpent +
    cyberdecksSpent +
    softwareSpent +
    drugsSpent +
    toxinsSpent +
    identitiesSpent
  );
}

// =============================================================================
// KARMA CALCULATION
// =============================================================================

function calculateKarmaSpent(
  stateBudgets: Record<string, number>,
  selections: Record<string, unknown>,
  regularContactCost: number,
  freeContactPool: number,
  creationMethodId?: string
): number {
  // Quality karma: try to derive from selections first, fall back to stateBudgets
  // Quality selections store karma in each item's `karma` or `originalKarma` field
  type QualitySelectionWithKarma = { karma?: number; originalKarma?: number };
  const positiveQualities = (selections.positiveQualities || []) as QualitySelectionWithKarma[];
  const negativeQualities = (selections.negativeQualities || []) as QualitySelectionWithKarma[];

  // Calculate karma from quality selections if they have karma values
  const positiveQualitiesHaveKarma = positiveQualities.some(
    (q) => q.karma !== undefined || q.originalKarma !== undefined
  );
  const negativeQualitiesHaveKarma = negativeQualities.some(
    (q) => q.karma !== undefined || q.originalKarma !== undefined
  );

  const karmaSpentPositive = positiveQualitiesHaveKarma
    ? positiveQualities.reduce((sum, q) => sum + (q.karma ?? q.originalKarma ?? 0), 0)
    : (stateBudgets["karma-spent-positive"] as number) || 0;

  const karmaGainedNegative = negativeQualitiesHaveKarma
    ? negativeQualities.reduce((sum, q) => sum + (q.karma ?? q.originalKarma ?? 0), 0)
    : (stateBudgets["karma-gained-negative"] as number) || 0;

  // Other karma sources (still from stateBudgets for now)
  const karmaSpentGear = (stateBudgets["karma-spent-gear"] as number) || 0;
  const karmaSpentSpells = (stateBudgets["karma-spent-spells"] as number) || 0;
  const karmaSpentPowers = (stateBudgets["karma-spent-power-points"] as number) || 0;
  const karmaSpentAttributes = (stateBudgets["karma-spent-attributes"] as number) || 0;
  const karmaSpentFoci = (stateBudgets["karma-spent-foci"] as number) || 0;

  // Contact karma - derive from already-computed pool splits
  // regularContactCost already includes high-connection overflow
  const karmaSpentContacts = Math.max(0, regularContactCost - freeContactPool);

  // Calculate skill karma spent from selections.skillKarmaSpent if present
  // This tracks karma spent on breaking groups (raising skills, adding specializations),
  // and karma spent on skill groups when group points are exhausted
  const skillKarmaSpent = selections.skillKarmaSpent as
    | {
        skillRaises: Record<string, number>;
        specializations: number;
        groupRaises?: Record<string, number>;
      }
    | undefined;
  let karmaSpentSkills = (stateBudgets["karma-spent-skills"] as number) || 0;
  if (skillKarmaSpent) {
    const skillRaisesTotal = Object.values(skillKarmaSpent.skillRaises || {}).reduce(
      (sum, cost) => sum + cost,
      0
    );
    const groupRaisesTotal = Object.values(skillKarmaSpent.groupRaises || {}).reduce(
      (sum, cost) => sum + cost,
      0
    );
    karmaSpentSkills = skillRaisesTotal + (skillKarmaSpent.specializations || 0) + groupRaisesTotal;
  }

  // Life module karma: sum of karmaCost from selected modules
  const lifeModules = (selections.lifeModules || []) as readonly LifeModuleSelection[];
  const karmaSpentLifeModules = lifeModules.reduce((sum, mod) => sum + mod.karmaCost, 0);

  // Metatype and magic path karma costs apply only to non-priority methods
  // (life-modules, point-buy) where these are purchased from the karma pool.
  // Priority-based and sum-to-ten creation gets metatype/magic from priority selections for free.
  const chargesKarmaForMetatype =
    creationMethodId === "point-buy" || creationMethodId === "life-modules";

  const selectedMetatypeId = selections.metatype as string | undefined;
  const karmaSpentMetatype =
    chargesKarmaForMetatype && selectedMetatypeId
      ? (POINT_BUY_METATYPE_COSTS[selectedMetatypeId] ?? 0)
      : 0;

  const selectedMagicPath = selections["magical-path"] as string | undefined;
  const karmaSpentMagicPath =
    chargesKarmaForMetatype && selectedMagicPath && selectedMagicPath !== "mundane"
      ? (POINT_BUY_MAGIC_QUALITY_COSTS[selectedMagicPath] ?? 0)
      : 0;

  // Net karma spent = positive qualities + other spends - negative qualities gained
  return (
    karmaSpentPositive +
    karmaSpentGear +
    karmaSpentSpells +
    karmaSpentPowers +
    karmaSpentAttributes +
    karmaSpentFoci +
    karmaSpentSkills +
    karmaSpentContacts +
    karmaSpentMetatype +
    karmaSpentMagicPath +
    karmaSpentLifeModules -
    karmaGainedNegative
  );
}
