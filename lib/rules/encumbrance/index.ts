/**
 * Encumbrance Module
 *
 * Exports for encumbrance calculation and management.
 */

export {
  // Constants
  STRENGTH_CAPACITY_MULTIPLIER,
  OVERWEIGHT_PENALTY_PER_KG,
  MAX_ENCUMBRANCE_PENALTY,
  // Weight functions
  isItemCarried,
  getItemWeight,
  calculateWeaponWeight,
  calculateArmorWeight,
  calculateGearWeight,
  calculateAmmunitionWeight,
  // Capacity functions
  calculateMaxCapacity,
  calculateEncumbrancePenalty,
  // Main calculator
  calculateEncumbrance,
  // UI helpers
  getEncumbranceStatus,
  shouldApplyEncumbrancePenalty,
} from "./calculator";
