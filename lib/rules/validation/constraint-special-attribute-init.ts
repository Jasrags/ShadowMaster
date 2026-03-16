/**
 * Special Attribute Initialization Constraint Validator
 */

import type { CreationConstraint, ValidationError } from "@/lib/types";
import { getModule } from "../merge";
import type { ValidationContext } from "../constraint-validation";

/**
 * Validate special attribute initialization
 *
 * Rules enforced:
 * - Edge starts at metatype minimum value
 * - Magic starts at priority-determined value (0 for mundane)
 * - Resonance starts at priority-determined value (0 for non-technomancers)
 *
 * Note: This validates that special attributes don't exceed their allocated values,
 * not that they equal them exactly (players can spend special attribute points).
 */
export function validateSpecialAttributeInit(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const { character, ruleset, creationState } = context;
  const params = constraint.params as {
    validateEdge?: boolean;
    validateMagic?: boolean;
    validateResonance?: boolean;
  };

  const errors: string[] = [];

  // Get metatype data for edge limits
  const metatypesModule = getModule<{
    metatypes: Array<{
      id: string;
      attributes: Record<string, { min: number; max: number }>;
    }>;
  }>(ruleset, "metatypes");

  const metatype = metatypesModule?.metatypes.find(
    (m) => m.id === character.metatype?.toLowerCase()
  );

  // Validate Edge - should be at least metatype minimum
  if (params.validateEdge !== false && metatype) {
    const edgeLimits = metatype.attributes?.edge;
    if (edgeLimits && "min" in edgeLimits) {
      const currentEdge = character.specialAttributes?.edge ?? 0;
      if (currentEdge < edgeLimits.min) {
        errors.push(`Edge must be at least ${edgeLimits.min} (metatype minimum)`);
      }
    }
  }

  // Validate Magic - for awakened characters, check against priority allocation
  if (params.validateMagic !== false) {
    const magicPath = character.magicalPath;
    const currentMagic = character.specialAttributes?.magic;

    // If mundane, magic should be undefined or 0
    if (!magicPath || magicPath === "mundane") {
      if (currentMagic !== undefined && currentMagic > 0) {
        errors.push("Mundane characters cannot have a Magic rating");
      }
    } else {
      // Awakened characters should have magic from priority
      // Get the base magic from priority table
      const magicPriority = creationState?.priorities?.magic;
      if (magicPriority && ruleset) {
        const prioritiesModule = getModule<{
          table: Record<
            string,
            {
              magic?: {
                options?: Array<{
                  path: string;
                  magicRating?: number;
                  resonanceRating?: number;
                }>;
              };
            }
          >;
        }>(ruleset, "priorities");

        if (prioritiesModule?.table?.[magicPriority]?.magic?.options) {
          const option = prioritiesModule.table[magicPriority].magic.options.find(
            (o) => o.path === magicPath
          );

          if (option?.magicRating !== undefined) {
            // Magic should be at least the priority base value
            if (currentMagic !== undefined && currentMagic < option.magicRating) {
              errors.push(
                `Magic must be at least ${option.magicRating} (from Priority ${magicPriority})`
              );
            }
          }
        }
      }
    }
  }

  // Validate Resonance - for technomancers, check against priority allocation
  if (params.validateResonance !== false) {
    const magicPath = character.magicalPath;
    const currentResonance = character.specialAttributes?.resonance;

    // If not a technomancer, resonance should be undefined or 0
    if (magicPath !== "technomancer") {
      if (currentResonance !== undefined && currentResonance > 0) {
        errors.push("Only Technomancers can have a Resonance rating");
      }
    } else {
      // Technomancers should have resonance from priority
      const magicPriority = creationState?.priorities?.magic;
      if (magicPriority && ruleset) {
        const prioritiesModule = getModule<{
          table: Record<
            string,
            {
              magic?: {
                options?: Array<{
                  path: string;
                  resonanceRating?: number;
                }>;
              };
            }
          >;
        }>(ruleset, "priorities");

        if (prioritiesModule?.table?.[magicPriority]?.magic?.options) {
          const option = prioritiesModule.table[magicPriority].magic.options.find(
            (o) => o.path === "technomancer"
          );

          if (option?.resonanceRating !== undefined) {
            // Resonance should be at least the priority base value
            if (currentResonance !== undefined && currentResonance < option.resonanceRating) {
              errors.push(
                `Resonance must be at least ${option.resonanceRating} (from Priority ${magicPriority})`
              );
            }
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    return {
      constraintId: constraint.id,
      field: "specialAttributes",
      message: constraint.errorMessage || errors.join("; "),
      severity: constraint.severity,
    };
  }

  return null;
}
