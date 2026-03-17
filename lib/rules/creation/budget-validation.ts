/**
 * Budget validation for character creation.
 *
 * Pure functions that validate budget states and creation selections
 * against game rules. No React dependencies.
 */

import type { CreationState, ValidationError } from "@/lib/types";
import type { PriorityTableData } from "@/lib/rules/RulesetContext";
import type { BudgetState } from "@/lib/contexts/CreationBudgetContext";
import { LIFE_MODULES_MAX_GEAR_KARMA, LIFE_MODULES_MAX_NEGATIVE_QUALITIES } from "@/lib/types";
import {
  getFreeSkillsFromMagicPriority,
  getFreeSkillAllocationStatus,
  type FreeSkillDesignations,
} from "@/lib/rules/skills/free-skills";
import { FREE_SKILL_TYPE_LABELS } from "@/components/creation/magic-path/constants";
import {
  getDefaultModifiers,
  type QualityBudgetModifiers,
} from "@/lib/rules/qualities/budget-modifiers";

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Run validation on budgets
 */
export function validateBudgets(
  budgets: Record<string, BudgetState>,
  state: CreationState,
  priorityTable: PriorityTableData | null,
  skillCategories: Record<string, string | undefined>,
  qualityModifiers: QualityBudgetModifiers = getDefaultModifiers()
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

  // Check karma-to-nuyen conversion limit
  // Life Modules uses its own cap (200); standard priority uses dynamic cap (default 10, Born Rich -> 40)
  const karmaSpentGear = (state.budgets["karma-spent-gear"] as number) || 0;
  const isLifeModules = state.creationMethodId === "life-modules";
  const karmaToNuyenCap = isLifeModules
    ? LIFE_MODULES_MAX_GEAR_KARMA
    : qualityModifiers.karmaToNuyenCap;
  if (karmaSpentGear > karmaToNuyenCap) {
    errors.push({
      constraintId: "karma-conversion-limit",
      message: `Karma-to-nuyen conversion cannot exceed ${karmaToNuyenCap} karma (currently ${karmaSpentGear})`,
      severity: "error",
    });
  }

  // Life Modules: negative quality cap after all modules (25 Karma)
  if (isLifeModules) {
    const lmNegativeKarma = (state.budgets["negative-quality-karma-gained"] as number) || 0;
    if (lmNegativeKarma > LIFE_MODULES_MAX_NEGATIVE_QUALITIES) {
      errors.push({
        constraintId: "life-modules-negative-quality-limit",
        message: `Negative quality karma after modules cannot exceed ${LIFE_MODULES_MAX_NEGATIVE_QUALITIES} (currently ${lmNegativeKarma})`,
        severity: "error",
      });
    }
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
