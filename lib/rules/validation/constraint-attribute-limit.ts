/**
 * Attribute Limit Constraint Validator
 */

import type { CreationConstraint, ValidationError } from "@/lib/types";
import { getModule } from "../merge";
import type { ValidationContext } from "../constraint-validation";

/**
 * Validate attribute limits (e.g., only one attribute at max)
 *
 * Rules enforced:
 * - Only 1 Physical/Mental attribute can be at natural maximum at creation
 * - Exceptional Attribute quality allows 1 additional attribute at max
 * - Special attributes (Edge, Magic, Resonance) are NOT included in this limit
 */
export function validateAttributeLimit(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const { character, ruleset } = context;
  const params = constraint.params as {
    maxAtMax?: number;
    attributeId?: string;
    maxValue?: number;
  };

  // Get metatype limits from ruleset
  const metatypesModule = getModule<{
    metatypes: Array<{
      id: string;
      attributes: Record<string, { min: number; max: number }>;
    }>;
  }>(ruleset, "metatypes");

  if (!metatypesModule) return null;

  const metatype = metatypesModule.metatypes.find(
    (m) => m.id === character.metatype?.toLowerCase()
  );

  if (!metatype) return null;

  const attributeCap = context.campaign?.advancementSettings?.attributeRatingCap;

  // Check "only one attribute at max" constraint
  if (params.maxAtMax !== undefined) {
    // Check for Exceptional Attribute quality - allows one additional attribute at max
    const hasExceptionalAttribute = character.positiveQualities?.some(
      (q) => (q.qualityId || q.id) === "exceptional-attribute"
    );

    // Exceptional Attribute allows +1 to the maxAtMax count
    const effectiveMaxAtMax = hasExceptionalAttribute ? params.maxAtMax + 1 : params.maxAtMax;

    // Physical and Mental attributes that count toward the limit
    // Special attributes (edge, magic, resonance) are excluded per rules
    const physicalMentalAttributes = [
      "body",
      "agility",
      "reaction",
      "strength",
      "willpower",
      "logic",
      "intuition",
      "charisma",
    ];

    let atMaxCount = 0;

    for (const [attrId, value] of Object.entries(character.attributes || {})) {
      // Only count physical/mental attributes, not special attributes
      if (!physicalMentalAttributes.includes(attrId)) continue;

      const limit = metatype.attributes[attrId];
      if (limit && "max" in limit && value >= limit.max) {
        atMaxCount++;
      }
    }

    if (atMaxCount > effectiveMaxAtMax) {
      const qualityNote = hasExceptionalAttribute ? " (including Exceptional Attribute bonus)" : "";
      return {
        constraintId: constraint.id,
        message:
          constraint.errorMessage ||
          `Only ${effectiveMaxAtMax} Physical/Mental attribute(s) can be at natural maximum${qualityNote}`,
        severity: constraint.severity,
      };
    }
  }

  // Check specific attribute max value
  if (params.attributeId && params.maxValue !== undefined) {
    const value = character.attributes?.[params.attributeId] || 0;
    const finalMax =
      attributeCap !== undefined ? Math.min(params.maxValue, attributeCap) : params.maxValue;
    if (value > finalMax) {
      return {
        constraintId: constraint.id,
        field: params.attributeId,
        message: constraint.errorMessage || `${params.attributeId} cannot exceed ${finalMax}`,
        severity: constraint.severity,
      };
    }
  }

  return null;
}
