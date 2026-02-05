/**
 * Budget Calculator Module
 *
 * Pure calculation functions for server-side nuyen and karma budget validation.
 * These functions mirror the client-side calculations in CreationBudgetContext.tsx
 * to ensure the server never trusts client-calculated values.
 *
 * Satisfies:
 * - Requirement: Server-side recalculation of nuyen/karma budgets
 * - Guarantee: Server validates all budget calculations independently
 */

import type { CreationSelections } from "@/lib/types/creation-selections";

// =============================================================================
// NUYEN CALCULATION
// =============================================================================

/**
 * Breakdown of nuyen spending by category (15 categories)
 */
export interface NuyenBreakdown {
  gear: number;
  weapons: number;
  armor: number;
  cyberware: number;
  bioware: number;
  foci: number;
  vehicles: number;
  drones: number;
  rccs: number;
  autosofts: number;
  lifestyles: number;
  commlinks: number;
  cyberdecks: number;
  software: number;
  identities: number;
  total: number;
}

/** Cost per rating point for fake SINs */
const SIN_COST_PER_RATING = 2500;

/** Cost per rating point for fake licenses */
const LICENSE_COST_PER_RATING = 200;

/**
 * Calculate total nuyen spent from creation selections.
 *
 * Extracts spending from 15 categories:
 * - gear, weapons, armor, cyberware, bioware, foci
 * - vehicles, drones, rccs, autosofts, lifestyles
 * - commlinks, cyberdecks, software, identities
 *
 * @param selections - Character creation selections
 * @returns Breakdown of nuyen spending by category plus total
 */
export function calculateNuyenSpent(selections: CreationSelections): NuyenBreakdown {
  // Type definitions for selection arrays (matching CreationBudgetContext.tsx)
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
  const lifestyles = (selections.lifestyles || []) as Array<{
    monthlyCost: number;
    prepaidMonths?: number;
  }>;
  const identities = (selections.identities || []) as Array<{
    sin: { type: string; rating: number };
    licenses?: Array<{ type: string; rating: number }>;
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

  // Calculate lifestyle spending
  const lifestyleSpent = lifestyles.reduce(
    (sum, ls) => sum + ls.monthlyCost * (ls.prepaidMonths || 1),
    0
  );

  // Calculate matrix gear spending
  const commlinksSpent = commlinks.reduce((sum, c) => sum + (c.cost || 0), 0);
  const cyberdecksSpent = cyberdecks.reduce((sum, d) => sum + (d.cost || 0), 0);
  const softwareSpent = software.reduce((sum, s) => sum + (s.cost || 0), 0);

  // Calculate identity spending (fake SINs and licenses)
  const identitiesSpent = identities.reduce((sum, identity) => {
    const sinCost =
      identity.sin?.type === "fake" ? (identity.sin.rating || 0) * SIN_COST_PER_RATING : 0;
    const licensesCost =
      identity.licenses?.reduce((lSum, lic) => {
        return lSum + (lic.type === "fake" ? (lic.rating || 0) * LICENSE_COST_PER_RATING : 0);
      }, 0) || 0;
    return sum + sinCost + licensesCost;
  }, 0);

  // Total nuyen spent
  const total =
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
    identitiesSpent;

  return {
    gear: gearSpent,
    weapons: weaponsSpent,
    armor: armorSpent,
    cyberware: cyberwareSpent,
    bioware: biowareSpent,
    foci: fociSpent,
    vehicles: vehiclesSpent,
    drones: dronesSpent,
    rccs: rccsSpent,
    autosofts: autosoftsSpent,
    lifestyles: lifestyleSpent,
    commlinks: commlinksSpent,
    cyberdecks: cyberdecksSpent,
    software: softwareSpent,
    identities: identitiesSpent,
    total,
  };
}

// =============================================================================
// KARMA CALCULATION
// =============================================================================

/**
 * Breakdown of karma spending by source (8 sources)
 */
export interface KarmaBreakdown {
  positiveQualities: number;
  /** Negative qualities give karma back (subtracted from total) */
  negativeQualities: number;
  /** Karma spent to convert to nuyen (1 karma = 2,000¥) */
  karmaToNuyen: number;
  spells: number;
  powerPoints: number;
  attributes: number;
  foci: number;
  skills: number;
  contacts: number;
  /** Net karma spent (positive sources minus negative quality refund) */
  total: number;
}

/** Maximum karma that can be converted to nuyen during creation */
export const KARMA_TO_NUYEN_LIMIT = 10;

/** Starting karma budget for SR5 character creation */
export const SR5_KARMA_BUDGET = 25;

/**
 * Calculate total karma spent from creation selections and budgets.
 *
 * Sources of karma spending:
 * - Positive qualities (cost karma)
 * - Negative qualities (give karma back)
 * - Karma-to-nuyen conversion
 * - Extra spells beyond free allotment
 * - Extra power points for adepts
 * - Attribute increases beyond priority allocation
 * - Foci bonding
 * - Skills (breaking groups, specializations)
 * - Contacts (overflow beyond CHA×3 free points)
 *
 * @param selections - Character creation selections
 * @param budgets - State budgets from creation state (contains karma spending values)
 * @returns Breakdown of karma spending by source plus net total
 */
export function calculateKarmaSpent(
  selections: CreationSelections,
  budgets: Record<string, unknown>
): KarmaBreakdown {
  // Quality karma: derive from selections first, fall back to stateBudgets
  type QualitySelectionWithKarma = { karma?: number; originalKarma?: number };
  const positiveQualities = (selections.positiveQualities || []) as QualitySelectionWithKarma[];
  const negativeQualities = (selections.negativeQualities || []) as QualitySelectionWithKarma[];

  // Check if quality selections have karma values
  const positiveQualitiesHaveKarma = positiveQualities.some(
    (q) => q.karma !== undefined || q.originalKarma !== undefined
  );
  const negativeQualitiesHaveKarma = negativeQualities.some(
    (q) => q.karma !== undefined || q.originalKarma !== undefined
  );

  const karmaSpentPositive = positiveQualitiesHaveKarma
    ? positiveQualities.reduce((sum, q) => sum + (q.karma ?? q.originalKarma ?? 0), 0)
    : (budgets["karma-spent-positive"] as number) || 0;

  const karmaGainedNegative = negativeQualitiesHaveKarma
    ? negativeQualities.reduce((sum, q) => sum + (q.karma ?? q.originalKarma ?? 0), 0)
    : (budgets["karma-gained-negative"] as number) || 0;

  // Karma-to-nuyen conversion
  const karmaSpentGear = (budgets["karma-spent-gear"] as number) || 0;

  // Other karma sources from budgets
  const karmaSpentSpells = (budgets["karma-spent-spells"] as number) || 0;
  const karmaSpentPowers = (budgets["karma-spent-power-points"] as number) || 0;
  const karmaSpentAttributes = (budgets["karma-spent-attributes"] as number) || 0;
  const karmaSpentFoci = (budgets["karma-spent-foci"] as number) || 0;

  // Contact karma - derive from selections
  // Calculate: total contact cost - free pool (CHA × 3)
  const contacts = (selections.contacts || []) as Array<{ connection: number; loyalty: number }>;
  const attributes = selections.attributes as Record<string, number> | undefined;
  const charisma = attributes?.charisma || 1;
  const freeContactKarma = charisma * 3;
  const totalContactCost = contacts.reduce((sum, c) => sum + c.connection + c.loyalty, 0);
  const karmaSpentContacts = Math.max(0, totalContactCost - freeContactKarma);

  // Skill karma - derive from skillKarmaSpent if present
  const skillKarmaSpent = selections.skillKarmaSpent as
    | {
        skillRaises: Record<string, number>;
        specializations: number;
        groupRaises?: Record<string, number>;
      }
    | undefined;
  let karmaSpentSkills = (budgets["karma-spent-skills"] as number) || 0;
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

  // Net karma spent = positive qualities + other spends - negative qualities gained
  const total =
    karmaSpentPositive +
    karmaSpentGear +
    karmaSpentSpells +
    karmaSpentPowers +
    karmaSpentAttributes +
    karmaSpentFoci +
    karmaSpentSkills +
    karmaSpentContacts -
    karmaGainedNegative;

  return {
    positiveQualities: karmaSpentPositive,
    negativeQualities: karmaGainedNegative,
    karmaToNuyen: karmaSpentGear,
    spells: karmaSpentSpells,
    powerPoints: karmaSpentPowers,
    attributes: karmaSpentAttributes,
    foci: karmaSpentFoci,
    skills: karmaSpentSkills,
    contacts: karmaSpentContacts,
    total,
  };
}
