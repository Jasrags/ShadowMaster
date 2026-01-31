"use client";

/**
 * CreationBudgetContext
 *
 * React context that provides budget state management for character creation.
 * Calculates totals from priority selections, tracks spent amounts, and
 * provides validation state with debounced updates.
 *
 * Used by both wizard and sheet-driven creation modes.
 */

import React, {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import type { CreationState, ValidationError } from "../types/creation";
import type { PriorityTableData, SkillData } from "../rules/RulesetContext";
import { useSkills } from "../rules/RulesetContext";
import {
  getFreeSkillsFromMagicPriority,
  calculateFreeSkillPointsUsed,
  calculateFreeSkillGroupPointsUsed,
  countQualifyingSkillsForFreeAllocation,
  calculateFreePointsFromDesignations,
  getFreeSkillAllocationStatus,
  type FreeSkillDesignations,
} from "../rules/skills/free-skills";
import { FREE_SKILL_TYPE_LABELS } from "@/components/creation/magic-path/constants";

// =============================================================================
// SKILL CATEGORY HELPERS
// =============================================================================

/**
 * Build a map of skill ID to category from skill data.
 * Used for determining which skills qualify for free skill allocations.
 */
function buildSkillCategoriesMap(activeSkills: SkillData[]): Record<string, string | undefined> {
  const categories: Record<string, string | undefined> = {};
  for (const skill of activeSkills) {
    categories[skill.id] = skill.category;
  }
  return categories;
}

// =============================================================================
// TYPES
// =============================================================================

/**
 * State for a single budget category
 */
export interface BudgetState {
  /** Total available (from priority selection or fixed value) */
  total: number;
  /** Amount spent so far */
  spent: number;
  /** Remaining = total - spent */
  remaining: number;
  /** Display format for UI */
  displayFormat?: "number" | "currency" | "percentage";
  /** Human-readable label */
  label: string;
}

/**
 * All budget categories tracked during creation
 */
export type BudgetId =
  | "karma"
  | "nuyen"
  | "attribute-points"
  | "special-attribute-points"
  | "skill-points"
  | "skill-group-points"
  | "knowledge-points"
  | "contact-points"
  | "spell-slots"
  | "power-points";

/**
 * Context value provided to consumers
 */
export interface CreationBudgetContextValue {
  /** All budget states keyed by budget ID */
  budgets: Record<string, BudgetState>;

  /** Update the spent amount for a budget */
  updateSpent: (budgetId: string, spent: number) => void;

  /** Current validation errors (must fix before finalize) */
  errors: ValidationError[];

  /** Current validation warnings (advisory, can proceed) */
  warnings: ValidationError[];

  /** True if no validation errors exist */
  isValid: boolean;

  /** True if character can be finalized (isValid + all required selections made) */
  canFinalize: boolean;

  /** Get a specific budget state */
  getBudget: (budgetId: string) => BudgetState | undefined;

  /** Check if a budget has remaining capacity */
  hasRemaining: (budgetId: string) => boolean;

  /** Check if a budget is overspent */
  isOverspent: (budgetId: string) => boolean;
}

/**
 * Props for the provider component
 */
export interface CreationBudgetProviderProps {
  children: React.ReactNode;
  /** Current creation state */
  creationState: CreationState;
  /** Priority table for budget calculations (SR5) */
  priorityTable: PriorityTableData | null;
  /** Callback when spent values change */
  onSpentChange?: (budgetId: string, spent: number) => void;
  /** Custom validation function */
  customValidation?: (
    budgets: Record<string, BudgetState>,
    state: CreationState
  ) => ValidationError[];
  /** Validation debounce delay in ms (default: 300) */
  validationDebounceMs?: number;
}

// =============================================================================
// CONTEXT
// =============================================================================

const CreationBudgetContext = createContext<CreationBudgetContextValue | null>(null);

// =============================================================================
// BUDGET CALCULATION HELPERS
// =============================================================================

/**
 * Calculate total budget values from priority selections
 */
function calculateBudgetTotals(
  priorities: Record<string, string> | undefined,
  selections: Record<string, unknown>,
  priorityTable: PriorityTableData | null
): Record<string, { total: number; label: string; displayFormat?: "number" | "currency" }> {
  const totals: Record<
    string,
    { total: number; label: string; displayFormat?: "number" | "currency" }
  > = {
    karma: { total: 25, label: "Karma", displayFormat: "number" },
  };

  if (!priorityTable || !priorities) {
    return totals;
  }

  // Attribute points from priority
  const attrPriority = priorities.attributes;
  if (attrPriority && priorityTable.table[attrPriority]) {
    const attrPoints = priorityTable.table[attrPriority].attributes as number;
    totals["attribute-points"] = {
      total: attrPoints || 0,
      label: "Attribute Points",
      displayFormat: "number",
    };
  }

  // Skill points from priority
  const skillPriority = priorities.skills;
  if (skillPriority && priorityTable.table[skillPriority]) {
    const skillData = priorityTable.table[skillPriority].skills as {
      skillPoints: number;
      skillGroupPoints: number;
    };
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

  // Resources (nuyen) from priority
  const resourcePriority = priorities.resources;
  if (resourcePriority && priorityTable.table[resourcePriority]) {
    const nuyen = priorityTable.table[resourcePriority].resources as number;
    totals["nuyen"] = {
      total: nuyen || 0,
      label: "Nuyen",
      displayFormat: "currency",
    };
  }

  // Special attribute points from metatype priority + selected metatype
  const metatypePriority = priorities.metatype;
  const selectedMetatype = selections.metatype as string;
  if (metatypePriority && selectedMetatype && priorityTable.table[metatypePriority]) {
    const metatypeData = priorityTable.table[metatypePriority].metatype as {
      specialAttributePoints: Record<string, number>;
    };
    const specialPoints = metatypeData?.specialAttributePoints?.[selectedMetatype] || 0;
    totals["special-attribute-points"] = {
      total: specialPoints,
      label: "Special Attribute Points",
      displayFormat: "number",
    };
  }

  // Contact points = CHA × 3 (calculated from attributes)
  const attributes = selections.attributes as Record<string, number> | undefined;
  const charisma = attributes?.charisma || 1;
  totals["contact-points"] = {
    total: charisma * 3,
    label: "Contact Points",
    displayFormat: "number",
  };

  // Knowledge points = (INT + LOG) × 2 (calculated from attributes)
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
    const magicData = priorityTable.table[magicPriority].magic as {
      options?: Array<{
        path: string;
        spells?: number;
        complexForms?: number;
        magicRating?: number;
        resonanceRating?: number;
      }>;
    };
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
      // Power points = Magic rating (from special attributes)
      const magicRating = (selections["special-attributes"] as Record<string, number>)?.magic || 0;
      totals["power-points"] = {
        total: magicRating,
        label: "Power Points",
        displayFormat: "decimal" as "number" | "currency", // Cast for now, used for PP display
      };
    }
  }

  return totals;
}

/**
 * Extract spent values from creation state budgets and selections
 *
 * Phase 4.2: Budget calculation is now derived from selections where possible,
 * reducing the need for components to update both selections AND budgets.
 */
function extractSpentValues(
  stateBudgets: Record<string, number>,
  selections: Record<string, unknown>,
  totals: Record<string, { total: number; label: string; displayFormat?: "number" | "currency" }>,
  priorityTable: PriorityTableData | null,
  priorities: Record<string, string> | undefined,
  skillCategories: Record<string, string | undefined>
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
  // Cap at free pool (CHA × 3) - overflow goes to karma, not contact points
  // ============================================================================

  const contacts = (selections.contacts || []) as Array<{
    connection: number;
    loyalty: number;
  }>;
  const totalContactCostForPoints = contacts.reduce((sum, c) => sum + c.connection + c.loyalty, 0);
  const contactAttributes = selections.attributes as Record<string, number> | undefined;
  const contactCharisma = contactAttributes?.charisma || 1;
  const freeContactPool = contactCharisma * 3;
  // Only count up to the free pool - karma handles the rest
  spent["contact-points"] = Math.min(totalContactCostForPoints, freeContactPool);

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

  // Calculate skill points spent from selections
  // Subtract rating points purchased with karma (those don't count against skill point budget)
  // Subtract free skill points from magic priority (those don't count against skill point budget)
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

  spent["skill-points"] = totalSkillRatings + totalSpecPoints - karmaRatingPoints - freeSkillPoints;

  // Calculate skill group points spent from selections
  // Handles both legacy (number) and new ({ rating, isBroken }) formats
  // Subtract karma-purchased group rating points - they don't count against group point budget
  // Subtract free skill group points from magic priority (aspected mages)
  const skillGroups = (selections.skillGroups || {}) as Record<
    string,
    number | { rating: number; isBroken: boolean }
  >;
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
  const languages = (selections.languages || []) as Array<{ rating: number }>;
  const knowledgeSkills = (selections.knowledgeSkills || []) as Array<{ rating: number }>;
  const languagePointsSpent = languages.reduce((sum, lang) => sum + (lang.rating || 0), 0);
  const knowledgePointsSpent = knowledgeSkills.reduce((sum, skill) => sum + (skill.rating || 0), 0);
  spent["knowledge-points"] = languagePointsSpent + knowledgePointsSpent;

  // Nuyen is special - calculate from all spending categories in selections
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
  const commlinks = (selections.commlinks || []) as Array<{ cost: number }>;
  const cyberdecks = (selections.cyberdecks || []) as Array<{ cost: number }>;
  const software = (selections.software || []) as Array<{ cost: number }>;
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

  // Calculate lifestyle spending (derived from selections)
  const lifestyles = (selections.lifestyles || []) as Array<{
    monthlyCost: number;
    prepaidMonths?: number;
  }>;
  const lifestyleSpent = lifestyles.reduce(
    (sum, ls) => sum + ls.monthlyCost * (ls.prepaidMonths || 1),
    0
  );

  // Calculate matrix gear spending (commlinks, cyberdecks, software)
  const commlinksSpent = commlinks.reduce((sum, c) => sum + (c.cost || 0), 0);
  const cyberdecksSpent = cyberdecks.reduce((sum, d) => sum + (d.cost || 0), 0);
  const softwareSpent = software.reduce((sum, s) => sum + (s.cost || 0), 0);

  // Calculate identity spending (fake SINs and licenses)
  // Fake SIN: Rating × 2,500¥, Fake License: Rating × 200¥
  const SIN_COST_PER_RATING = 2500;
  const LICENSE_COST_PER_RATING = 200;
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
  spent["nuyen"] =
    gearSpent +
    weaponsSpent +
    armorSpent +
    cyberwareSpent +
    biowareSpent +
    fociSpent +
    vehiclesSpent +
    lifestyleSpent +
    commlinksSpent +
    cyberdecksSpent +
    softwareSpent +
    identitiesSpent;

  // ============================================================================
  // KARMA - calculate from multiple sources
  // ============================================================================

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

  // Contact karma - derive from selections to avoid stale closure bugs
  // Calculate: total contact cost - free pool (CHA × 3)
  const attributes = selections.attributes as Record<string, number> | undefined;
  const charisma = attributes?.charisma || 1;
  const freeContactKarma = charisma * 3;
  const totalContactCost = contacts.reduce((sum, c) => sum + c.connection + c.loyalty, 0);
  const karmaSpentContacts = Math.max(0, totalContactCost - freeContactKarma);

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

  // Net karma spent = positive qualities + other spends - negative qualities gained
  spent["karma"] =
    karmaSpentPositive +
    karmaSpentGear +
    karmaSpentSpells +
    karmaSpentPowers +
    karmaSpentAttributes +
    karmaSpentFoci +
    karmaSpentSkills +
    karmaSpentContacts -
    karmaGainedNegative;

  return spent;
}

/**
 * Run validation on budgets
 */
function validateBudgets(
  budgets: Record<string, BudgetState>,
  state: CreationState,
  priorityTable: PriorityTableData | null,
  skillCategories: Record<string, string | undefined>
): { errors: ValidationError[]; warnings: ValidationError[] } {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Check for overspent budgets
  for (const [budgetId, budget] of Object.entries(budgets)) {
    if (budget.remaining < 0) {
      errors.push({
        constraintId: `${budgetId}-overspent`,
        message: `${budget.label} is overspent by ${Math.abs(budget.remaining)}`,
        severity: "error",
      });
    }
  }

  // Nuyen carryover limit (max 5,000)
  const nuyenBudget = budgets["nuyen"];
  if (nuyenBudget && nuyenBudget.remaining > 5000) {
    warnings.push({
      constraintId: "nuyen-carryover",
      message: `You can only carry over 5,000¥ to gameplay. ${nuyenBudget.remaining - 5000}¥ will be lost.`,
      severity: "warning",
    });
  }

  // Karma carryover limit (max 7)
  const karmaBudget = budgets["karma"];
  if (karmaBudget && karmaBudget.remaining > 7) {
    warnings.push({
      constraintId: "karma-carryover",
      message: `You can only carry over 7 karma to gameplay. ${karmaBudget.remaining - 7} karma will be lost.`,
      severity: "warning",
    });
  }

  // Check positive quality limit (max 25 karma)
  // Derive from selections if karma values are present, otherwise fall back to budgets
  type QualitySelectionWithKarma = { karma?: number; originalKarma?: number };
  const positiveQualities = (state.selections.positiveQualities ||
    []) as QualitySelectionWithKarma[];
  const negativeQualities = (state.selections.negativeQualities ||
    []) as QualitySelectionWithKarma[];

  const positiveQualitiesHaveKarma = positiveQualities.some(
    (q) => q.karma !== undefined || q.originalKarma !== undefined
  );
  const negativeQualitiesHaveKarma = negativeQualities.some(
    (q) => q.karma !== undefined || q.originalKarma !== undefined
  );

  const positiveKarmaSpent = positiveQualitiesHaveKarma
    ? positiveQualities.reduce((sum, q) => sum + (q.karma ?? q.originalKarma ?? 0), 0)
    : (state.budgets["karma-spent-positive"] as number) || 0;

  if (positiveKarmaSpent > 25) {
    errors.push({
      constraintId: "positive-quality-limit",
      message: `Positive qualities cannot exceed 25 karma (currently ${positiveKarmaSpent})`,
      severity: "error",
    });
  }

  // Check negative quality limit (max 25 karma gained)
  const negativeKarmaGained = negativeQualitiesHaveKarma
    ? negativeQualities.reduce((sum, q) => sum + (q.karma ?? q.originalKarma ?? 0), 0)
    : (state.budgets["karma-gained-negative"] as number) || 0;

  if (negativeKarmaGained > 25) {
    errors.push({
      constraintId: "negative-quality-limit",
      message: `Negative qualities cannot exceed 25 karma (currently ${negativeKarmaGained})`,
      severity: "error",
    });
  }

  // Check karma-to-nuyen conversion limit (max 10 karma)
  const MAX_KARMA_CONVERSION = 10;
  const karmaSpentGear = (state.budgets["karma-spent-gear"] as number) || 0;
  if (karmaSpentGear > MAX_KARMA_CONVERSION) {
    errors.push({
      constraintId: "karma-conversion-limit",
      message: `Karma-to-nuyen conversion cannot exceed ${MAX_KARMA_CONVERSION} karma (currently ${karmaSpentGear})`,
      severity: "error",
    });
  }

  // Check for unused free skills from magic priority
  const magicPath = state.selections["magical-path"] as string | undefined;
  const freeSkillConfigs = getFreeSkillsFromMagicPriority(
    priorityTable,
    state.priorities?.magic,
    magicPath
  );

  const skills = (state.selections.skills || {}) as Record<string, number>;
  const skillGroups = (state.selections.skillGroups || {}) as Record<
    string,
    number | { rating: number; isBroken: boolean }
  >;

  // Check for explicit designations (new system)
  const freeSkillDesignations = state.selections.freeSkillDesignations as
    | FreeSkillDesignations
    | undefined;
  const hasExplicitDesignations =
    freeSkillDesignations &&
    ((freeSkillDesignations.magical && freeSkillDesignations.magical.length > 0) ||
      (freeSkillDesignations.resonance && freeSkillDesignations.resonance.length > 0) ||
      (freeSkillDesignations.active && freeSkillDesignations.active.length > 0));

  // If using explicit designations, use the new validation logic
  if (hasExplicitDesignations || freeSkillConfigs.length > 0) {
    const allocationStatuses = getFreeSkillAllocationStatus(
      skills,
      freeSkillConfigs,
      freeSkillDesignations,
      FREE_SKILL_TYPE_LABELS
    );

    for (const status of allocationStatuses) {
      // Warning for unfilled slots (user hasn't designated all free skills yet)
      if (status.remainingSlots > 0) {
        warnings.push({
          constraintId: `free-skills-unfilled-${status.type}`,
          message: `${status.remainingSlots} of ${status.totalSlots} free ${status.label} not designated (rating ${status.freeRating})`,
          severity: "warning",
        });
      }

      // Warning for designated skills below free rating
      for (const below of status.belowFreeRating) {
        warnings.push({
          constraintId: `free-skill-below-rating-${below.skillId}`,
          message: `Designated skill at rating ${below.currentRating} (free provides ${below.freeRating})`,
          severity: "warning",
        });
      }
    }
  }

  // Check skill groups for aspected mages (magicalGroup config)
  for (const config of freeSkillConfigs) {
    if (config.type === "magicalGroup") {
      const qualifyingGroupIds = ["sorcery", "conjuring", "enchanting"];
      let allocatedCount = 0;

      for (const groupId of qualifyingGroupIds) {
        if (allocatedCount >= config.count) break;
        const groupValue = skillGroups[groupId];
        if (!groupValue) continue;
        const groupRating = typeof groupValue === "number" ? groupValue : groupValue.rating;
        if (groupRating >= config.rating) {
          allocatedCount++;
        }
      }

      const unusedCount = config.count - allocatedCount;
      if (unusedCount > 0) {
        const label = FREE_SKILL_TYPE_LABELS[config.type]?.label || config.type;
        warnings.push({
          constraintId: `free-skills-unused-${config.type}`,
          message: `${unusedCount} unused free ${label} at rating ${config.rating} from Magic priority`,
          severity: "warning",
        });
      }
    }
  }

  return { errors, warnings };
}

// =============================================================================
// PROVIDER COMPONENT
// =============================================================================

export function CreationBudgetProvider({
  children,
  creationState,
  priorityTable,
  onSpentChange,
  customValidation,
  validationDebounceMs = 300,
}: CreationBudgetProviderProps) {
  // Track validation state with debounce
  const [validationState, setValidationState] = useState<{
    errors: ValidationError[];
    warnings: ValidationError[];
  }>({ errors: [], warnings: [] });

  const validationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get skill data from ruleset for category lookups
  const { activeSkills } = useSkills();
  const skillCategories = useMemo(() => buildSkillCategoriesMap(activeSkills), [activeSkills]);

  // Calculate budget totals from priorities
  const budgetTotals = useMemo(
    () => calculateBudgetTotals(creationState.priorities, creationState.selections, priorityTable),
    [creationState.priorities, creationState.selections, priorityTable]
  );

  // Extract spent values from state and selections
  const spentValues = useMemo(
    () =>
      extractSpentValues(
        creationState.budgets,
        creationState.selections,
        budgetTotals,
        priorityTable,
        creationState.priorities,
        skillCategories
      ),
    [
      creationState.budgets,
      creationState.selections,
      budgetTotals,
      priorityTable,
      creationState.priorities,
      skillCategories,
    ]
  );

  // Get karma-to-nuyen conversion (2000¥ per karma)
  const karmaSpentGear = (creationState.budgets?.["karma-spent-gear"] as number) || 0;
  const KARMA_TO_NUYEN_RATE = 2000;

  // Combine into full budget states
  const budgets = useMemo(() => {
    const result: Record<string, BudgetState> = {};

    for (const [budgetId, totalData] of Object.entries(budgetTotals)) {
      const spent = spentValues[budgetId] || 0;
      let total = totalData.total;

      // Add karma-to-nuyen conversion to nuyen total
      if (budgetId === "nuyen") {
        total += karmaSpentGear * KARMA_TO_NUYEN_RATE;
      }

      result[budgetId] = {
        total,
        spent,
        remaining: total - spent,
        label: totalData.label,
        displayFormat: totalData.displayFormat,
      };
    }

    return result;
  }, [budgetTotals, spentValues, karmaSpentGear]);

  // Debounced validation
  useEffect(() => {
    if (validationTimeoutRef.current) {
      clearTimeout(validationTimeoutRef.current);
    }

    validationTimeoutRef.current = setTimeout(() => {
      let { errors, warnings } = validateBudgets(
        budgets,
        creationState,
        priorityTable,
        skillCategories
      );

      // Add custom validation if provided
      if (customValidation) {
        const customErrors = customValidation(budgets, creationState);
        errors = [...errors, ...customErrors.filter((e) => e.severity === "error")];
        warnings = [...warnings, ...customErrors.filter((e) => e.severity === "warning")];
      }

      setValidationState({ errors, warnings });
    }, validationDebounceMs);

    return () => {
      if (validationTimeoutRef.current) {
        clearTimeout(validationTimeoutRef.current);
      }
    };
  }, [
    budgets,
    creationState,
    customValidation,
    validationDebounceMs,
    priorityTable,
    skillCategories,
  ]);

  // Update spent callback - this notifies parent to update CreationState
  const updateSpent = useCallback(
    (budgetId: string, spent: number) => {
      if (onSpentChange) {
        onSpentChange(budgetId, spent);
      }
    },
    [onSpentChange]
  );

  // Helper functions
  const getBudget = useCallback(
    (budgetId: string): BudgetState | undefined => budgets[budgetId],
    [budgets]
  );

  const hasRemaining = useCallback(
    (budgetId: string): boolean => {
      const budget = budgets[budgetId];
      return budget ? budget.remaining > 0 : false;
    },
    [budgets]
  );

  const isOverspent = useCallback(
    (budgetId: string): boolean => {
      const budget = budgets[budgetId];
      return budget ? budget.remaining < 0 : false;
    },
    [budgets]
  );

  // Derived state
  const isValid = validationState.errors.length === 0;

  // Can finalize if valid and has required selections
  const canFinalize = useMemo(() => {
    if (!isValid) return false;

    // Check required selections
    const hasMetatype = !!creationState.selections.metatype;
    const hasPriorities = Object.keys(creationState.priorities || {}).length === 5;

    return hasMetatype && hasPriorities;
  }, [isValid, creationState.selections.metatype, creationState.priorities]);

  // Context value
  const value: CreationBudgetContextValue = useMemo(
    () => ({
      budgets,
      updateSpent,
      errors: validationState.errors,
      warnings: validationState.warnings,
      isValid,
      canFinalize,
      getBudget,
      hasRemaining,
      isOverspent,
    }),
    [
      budgets,
      updateSpent,
      validationState.errors,
      validationState.warnings,
      isValid,
      canFinalize,
      getBudget,
      hasRemaining,
      isOverspent,
    ]
  );

  return <CreationBudgetContext.Provider value={value}>{children}</CreationBudgetContext.Provider>;
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Access the full budget context
 */
export function useCreationBudgets(): CreationBudgetContextValue {
  const context = useContext(CreationBudgetContext);
  if (!context) {
    throw new Error("useCreationBudgets must be used within a CreationBudgetProvider");
  }
  return context;
}

/**
 * Access a specific budget by ID
 */
export function useBudget(budgetId: string): BudgetState | undefined {
  const { getBudget } = useCreationBudgets();
  return getBudget(budgetId);
}

/**
 * Access validation state only
 */
export function useCreationValidation(): {
  errors: ValidationError[];
  warnings: ValidationError[];
  isValid: boolean;
  canFinalize: boolean;
} {
  const { errors, warnings, isValid, canFinalize } = useCreationBudgets();
  return { errors, warnings, isValid, canFinalize };
}

/**
 * Check if creation is valid and can be finalized
 */
export function useCanFinalize(): boolean {
  const { canFinalize } = useCreationBudgets();
  return canFinalize;
}

// =============================================================================
// TESTABLE EXPORTS (for unit testing helper functions)
// =============================================================================

/** @internal Exported for testing only */
export const _testExports = {
  extractSpentValues,
  validateBudgets,
  calculateBudgetTotals,
};
