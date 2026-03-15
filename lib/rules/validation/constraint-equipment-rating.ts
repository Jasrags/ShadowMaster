/**
 * Equipment Rating Constraint Validator
 *
 * Validates equipment ratings on character gear, cyberware, and foci.
 * Also provides catalog lookup helpers for gear and cyberware items.
 */

import type {
  CreationConstraint,
  ValidationError,
  MergedRuleset,
  RatingValidationContext,
} from "@/lib/types";
import { getModule } from "../merge";
import { validateRating, validateRatingAvailability, convertLegacyRatingSpec } from "../ratings";
import { validateAllGear } from "../gear/validation";
import type {
  GearCatalogData,
  CyberwareCatalogData,
  GearItemData,
  CyberwareCatalogItemData,
} from "../loader-types";
import { findGearItemInCatalog } from "../gear/catalog-helpers";
import type { ValidationContext } from "../constraint-validation";

// =============================================================================
// HELPER FUNCTIONS FOR CATALOG LOOKUP
// =============================================================================

/**
 * Find a gear catalog item by ID or name
 */
function findGearCatalogItem(ruleset: MergedRuleset, identifier: string): GearItemData | null {
  const gearCatalog = getModule<GearCatalogData>(ruleset, "gear");
  if (!gearCatalog) return null;

  // Search GearItemData sub-arrays (browsable + hidden)
  const found = findGearItemInCatalog(
    gearCatalog,
    (item) => item.id === identifier || item.name === identifier
  );
  if (found) return found;

  // Also search non-GearItemData arrays that extend GearItemData
  const otherArrays: (GearItemData[] | undefined)[] = [
    gearCatalog.armor,
    gearCatalog.commlinks,
    gearCatalog.cyberdecks,
    gearCatalog.weapons?.melee,
    gearCatalog.weapons?.pistols,
    gearCatalog.weapons?.smgs,
    gearCatalog.weapons?.rifles,
    gearCatalog.weapons?.shotguns,
    gearCatalog.weapons?.sniperRifles,
    gearCatalog.weapons?.throwingWeapons,
    gearCatalog.weapons?.grenades,
  ];
  for (const arr of otherArrays) {
    if (!arr) continue;
    const match = arr.find((item) => item.id === identifier || item.name === identifier);
    if (match) return match;
  }

  return null;
}

/**
 * Find a cyberware catalog item by ID or name
 */
function findCyberwareCatalogItem(
  ruleset: MergedRuleset,
  identifier: string
): CyberwareCatalogItemData | null {
  const cyberwareCatalog = getModule<CyberwareCatalogData>(ruleset, "cyberware");
  if (!cyberwareCatalog) return null;

  const catalog = cyberwareCatalog.catalog || [];
  return catalog.find((item) => item.id === identifier || item.name === identifier) || null;
}

// =============================================================================
// EQUIPMENT RATING VALIDATION
// =============================================================================

/**
 * Validate equipment ratings on character gear, cyberware, and foci
 */
export function validateEquipmentRatings(
  constraint: CreationConstraint,
  context: ValidationContext
): ValidationError | null {
  const errors = validateEquipmentRatingsInternal(context);
  return errors.length > 0 ? errors[0] : null;
}

/**
 * Internal function that returns all rating validation errors
 */
function validateEquipmentRatingsInternal(context: ValidationContext): ValidationError[] {
  const errors: ValidationError[] = [];
  const { character, ruleset } = context;

  // Determine if we're in creation (stricter availability rules)
  const isCreation = character.status === "draft";
  const maxAvailability = isCreation ? 12 : undefined;

  const validationContext: RatingValidationContext = {
    maxAvailability,
    allowForbidden: !isCreation,
    allowRestricted: true,
  };

  // Validate gear ratings
  for (const item of character.gear || []) {
    if (item.rating !== undefined) {
      const catalogItem = findGearCatalogItem(ruleset, item.id || item.name);

      if (catalogItem) {
        const spec = convertLegacyRatingSpec(catalogItem);

        if (spec.rating) {
          // Validate rating is in range
          const ratingValidation = validateRating(item.rating, spec.rating, validationContext);
          if (!ratingValidation.valid) {
            errors.push({
              constraintId: "equipment-rating-range",
              field: `gear.${item.id || item.name}`,
              message: `${item.name}: ${ratingValidation.error}`,
              severity: "error",
            });
          }

          // Validate availability at creation
          if (isCreation) {
            const availValidation = validateRatingAvailability(
              spec,
              item.rating,
              validationContext
            );
            if (!availValidation.valid) {
              errors.push({
                constraintId: "equipment-rating-availability",
                field: `gear.${item.id || item.name}`,
                message: `${item.name}: ${availValidation.error}`,
                severity: "error",
              });
            }
          }
        }
      }
    }
  }

  // Validate cyberware ratings
  for (const item of character.cyberware || []) {
    if (item.rating !== undefined) {
      const catalogItem = findCyberwareCatalogItem(ruleset, item.catalogId || item.name);

      if (catalogItem) {
        const spec = convertLegacyRatingSpec(catalogItem);

        if (spec.rating) {
          const ratingValidation = validateRating(item.rating, spec.rating, validationContext);
          if (!ratingValidation.valid) {
            errors.push({
              constraintId: "cyberware-rating-range",
              field: `cyberware.${item.id || item.name}`,
              message: `${item.name}: ${ratingValidation.error}`,
              severity: "error",
            });
          }
        }
      }
    }
  }

  // Validate focus force ratings
  for (const focus of character.foci || []) {
    // Force 1-6 for starting characters
    if (isCreation && focus.force > 6) {
      errors.push({
        constraintId: "focus-force-creation",
        field: `foci.${focus.id || focus.name}`,
        message: `${focus.name}: Force cannot exceed 6 at character creation`,
        severity: "error",
      });
    }

    if (focus.force < 1) {
      errors.push({
        constraintId: "focus-force-minimum",
        field: `foci.${focus.id || focus.name}`,
        message: `${focus.name}: Force must be at least 1`,
        severity: "error",
      });
    }
  }

  // Validate all gear availability and device ratings (SR5 creation restrictions)
  // - Maximum Availability at creation: 12
  // - Maximum Device Rating at creation: 6
  // - Restricted items not allowed at creation without GM approval
  // - Forbidden items never allowed at creation
  const gearValidation = validateAllGear(character);
  for (const gearError of gearValidation.errors) {
    errors.push({
      constraintId: `gear-${gearError.code.toLowerCase().replace(/_/g, "-")}`,
      field: `${gearError.itemType}.${gearError.itemName}`,
      message: gearError.message,
      severity: "error",
    });
  }

  return errors;
}
