/**
 * Life Modules Validation
 *
 * Validates the Life Modules character creation method from Run Faster (pp. 65-84).
 * Characters start with 750 Karma and spend it on sequential life path modules.
 *
 * Key rules:
 * - 750 Karma starting budget
 * - Active skill max: 7 (ranks above 7 lost)
 * - Knowledge skill max: 9
 * - Gear: 1 Karma per 2,000 nuyen, max 200 Karma on gear
 * - Duplicate non-stackable qualities replaced with same-cost alternative
 * - Max 25 Karma of negative qualities after all modules
 */

import type { CreationConstraint, ValidationError } from "../types";
import {
  LIFE_MODULES_KARMA_BUDGET,
  LIFE_MODULES_MAX_ACTIVE_SKILL,
  LIFE_MODULES_MAX_KNOWLEDGE_SKILL,
  LIFE_MODULES_MAX_GEAR_KARMA,
  LIFE_MODULES_MAX_NEGATIVE_QUALITIES,
} from "../types";
import type { ValidationContext } from "./constraint-validation";

// =============================================================================
// PARAMETER INTERFACES
// =============================================================================

interface LifeModulesBudgetParams {
  readonly totalBudget?: number;
  readonly maxGearKarma?: number;
  readonly maxNegativeQualities?: number;
}

interface LifeModulesSkillCapParams {
  readonly maxActiveSkill?: number;
  readonly maxKnowledgeSkill?: number;
}

// =============================================================================
// BUDGET VALIDATOR
// =============================================================================

/**
 * Validates that total karma spent on life modules + other purchases
 * does not exceed the 750 karma budget.
 */
export function validateLifeModulesBudget(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const { creationState } = context;

  if (!creationState) {
    return null;
  }

  const params = constraint.params as LifeModulesBudgetParams;
  const totalBudget = params.totalBudget ?? LIFE_MODULES_KARMA_BUDGET;
  const maxGearKarma = params.maxGearKarma ?? LIFE_MODULES_MAX_GEAR_KARMA;
  const maxNegativeQualities = params.maxNegativeQualities ?? LIFE_MODULES_MAX_NEGATIVE_QUALITIES;

  // Calculate karma spent on modules
  const moduleKarmaSpent = calculateModuleKarmaSpent(creationState);

  // Calculate karma spent on other purchases (gear, buying off negatives, etc.)
  const otherKarmaSpent = calculateOtherKarmaSpent(creationState);

  const totalSpent = moduleKarmaSpent + otherKarmaSpent;

  if (totalSpent > totalBudget) {
    return {
      constraintId: constraint.id,
      message:
        constraint.errorMessage ?? `Karma budget exceeded: ${totalSpent} / ${totalBudget} spent`,
      severity: constraint.severity,
    };
  }

  // Check gear karma cap
  const gearKarma = creationState.budgets["karma-spent-gear"] ?? 0;
  if (gearKarma > maxGearKarma) {
    return {
      constraintId: constraint.id,
      message: `Gear karma exceeded: ${gearKarma} / ${maxGearKarma} max`,
      severity: constraint.severity,
    };
  }

  // Check negative quality cap
  const negativeQualityKarma = creationState.budgets["karma-negative-qualities"] ?? 0;
  if (negativeQualityKarma > maxNegativeQualities) {
    return {
      constraintId: constraint.id,
      message: `Negative quality karma exceeded: ${negativeQualityKarma} / ${maxNegativeQualities} max after all modules`,
      severity: constraint.severity,
    };
  }

  return null;
}

// =============================================================================
// SKILL CAP VALIDATOR
// =============================================================================

/**
 * Validates that cumulative skill ranks from modules + manual allocation
 * do not exceed the life modules caps (7 for active, 9 for knowledge).
 */
export function validateLifeModulesSkillCap(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const { creationState } = context;

  if (!creationState) {
    return null;
  }

  const params = constraint.params as LifeModulesSkillCapParams;
  const maxActive = params.maxActiveSkill ?? LIFE_MODULES_MAX_ACTIVE_SKILL;
  const maxKnowledge = params.maxKnowledgeSkill ?? LIFE_MODULES_MAX_KNOWLEDGE_SKILL;

  // Check active skills
  const skills = (creationState.selections.skills ?? {}) as Record<string, number>;
  for (const [skillId, rating] of Object.entries(skills)) {
    if (rating > maxActive) {
      return {
        constraintId: constraint.id,
        message:
          constraint.errorMessage ??
          `Active skill "${skillId}" has rating ${rating}, max is ${maxActive}`,
        severity: constraint.severity,
      };
    }
  }

  // Check knowledge skills
  const knowledgeSkills = creationState.selections.knowledgeSkills ?? [];
  for (const ks of knowledgeSkills) {
    if (typeof ks === "object" && "rating" in ks && (ks.rating as number) > maxKnowledge) {
      return {
        constraintId: constraint.id,
        message:
          constraint.errorMessage ??
          `Knowledge skill "${(ks as { name: string }).name}" has rating ${(ks as { rating: number }).rating}, max is ${maxKnowledge}`,
        severity: constraint.severity,
      };
    }
  }

  return null;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Calculate total karma spent on selected life modules.
 */
function calculateModuleKarmaSpent(creationState: import("../types").CreationState): number {
  const lifeModules = creationState.selections.lifeModules;
  if (!lifeModules || lifeModules.length === 0) {
    return 0;
  }
  return lifeModules.reduce((total, mod) => total + mod.karmaCost, 0);
}

/**
 * Calculate karma spent on non-module purchases (gear, attributes, etc.).
 */
function calculateOtherKarmaSpent(creationState: import("../types").CreationState): number {
  const budgets = creationState.budgets;
  return (
    (budgets["karma-spent-attributes"] ?? 0) +
    (budgets["karma-spent-skills"] ?? 0) +
    (budgets["karma-spent-gear"] ?? 0) +
    (budgets["karma-spent-qualities"] ?? 0) +
    (budgets["karma-spent-magic"] ?? 0)
  );
}
