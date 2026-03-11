/**
 * Sum-to-Ten Validation
 *
 * Validates the Sum-to-Ten character creation variant where priority levels
 * are assigned point values (A=4, B=3, C=2, D=1, E=0) and must total exactly 10.
 * Unlike standard Priority, duplicate levels are allowed.
 */

import type { CreationConstraint, CreationMethod, ValidationError } from "../types";
import type { ValidationContext } from "./constraint-validation";

/**
 * Point values for each priority level in Sum-to-Ten
 */
export const SUM_TO_TEN_POINT_VALUES: Readonly<Record<string, number>> = {
  A: 4,
  B: 3,
  C: 2,
  D: 1,
  E: 0,
};

/** Required total for Sum-to-Ten */
export const SUM_TO_TEN_TOTAL = 10;

/** The five categories that must each be assigned exactly once */
export const PRIORITY_CATEGORIES = [
  "metatype",
  "attributes",
  "magic",
  "skills",
  "resources",
] as const;

export type PriorityCategory = (typeof PRIORITY_CATEGORIES)[number];

/**
 * Calculate the total point value for a set of priority assignments.
 *
 * @param priorities - Map of category to priority level (e.g. { metatype: "B", attributes: "B" })
 * @param pointValues - Map of level to point cost (defaults to SUM_TO_TEN_POINT_VALUES)
 * @returns Total point value, or null if any assignment has an unknown level
 */
export function calculatePriorityPointTotal(
  priorities: Readonly<Record<string, string>>,
  pointValues: Readonly<Record<string, number>> = SUM_TO_TEN_POINT_VALUES
): number | null {
  let total = 0;
  for (const level of Object.values(priorities)) {
    const points = pointValues[level];
    if (points === undefined) return null;
    total += points;
  }
  return total;
}

/**
 * Validate that all required categories are assigned and point values sum correctly.
 *
 * @param constraint - The constraint definition from the creation method
 * @param context - Validation context containing creation state
 * @returns ValidationError if invalid, null if valid
 */
export function validateSumToTenBudget(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const { creationState, creationMethod } = context;
  const priorities = creationState?.priorities;

  // No priorities assigned yet — skip validation (will be caught by required-selection)
  if (!priorities || Object.keys(priorities).length === 0) {
    return null;
  }

  const params = constraint.params as {
    totalBudget?: number;
    pointValues?: Record<string, number>;
    categories?: readonly string[];
  };

  const totalBudget = params.totalBudget ?? SUM_TO_TEN_TOTAL;
  const pointValues = params.pointValues ? { ...params.pointValues } : SUM_TO_TEN_POINT_VALUES;
  const requiredCategories = params.categories ?? getRequiredCategories(creationMethod);

  // Check all required categories are assigned
  const missingCategories = requiredCategories.filter((cat) => !priorities[cat]);
  if (missingCategories.length > 0) {
    return {
      constraintId: constraint.id,
      field: "priorities",
      message:
        constraint.errorMessage ||
        `Missing priority assignments for: ${missingCategories.join(", ")}`,
      severity: constraint.severity,
    };
  }

  // Calculate total
  const total = calculatePriorityPointTotal(priorities, pointValues);
  if (total === null) {
    const unknownLevels = Object.values(priorities).filter(
      (level) => pointValues[level] === undefined
    );
    return {
      constraintId: constraint.id,
      field: "priorities",
      message: `Unknown priority level(s): ${unknownLevels.join(", ")}`,
      severity: "error",
    };
  }

  // Validate total equals budget
  if (total !== totalBudget) {
    return {
      constraintId: constraint.id,
      field: "priorities",
      message:
        constraint.errorMessage ||
        `Priority points must total exactly ${totalBudget} (currently ${total})`,
      severity: constraint.severity,
    };
  }

  return null;
}

/**
 * Extract required categories from the creation method's priority step.
 */
function getRequiredCategories(creationMethod?: CreationMethod): readonly string[] {
  if (!creationMethod) return PRIORITY_CATEGORIES;

  const priorityStep = creationMethod.steps.find((s) => s.id === "priorities");
  if (priorityStep?.payload && "categories" in priorityStep.payload) {
    const categories = priorityStep.payload.categories;
    if (Array.isArray(categories)) {
      return categories.map((c) => (typeof c === "string" ? c : c.id));
    }
  }

  return PRIORITY_CATEGORIES;
}
