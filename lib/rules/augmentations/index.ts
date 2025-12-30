/**
 * Augmentation Systems Module
 *
 * Core utilities for managing cyberware and bioware augmentations,
 * including essence calculations, grade applications, and essence hole tracking.
 */

// Essence calculations
export {
  // Constants
  ESSENCE_PRECISION,
  MAX_ESSENCE,
  ESSENCE_MIN_VIABLE,
  // Precision utilities
  roundEssence,
  formatEssence,
  // Cyberware calculations
  calculateCyberwareEssence,
  getCyberwareBaseEssence,
  // Bioware calculations
  calculateBiowareEssence,
  getBiowareBaseEssence,
  // Total calculations
  calculateCyberwareEssenceLoss,
  calculateBiowareEssenceLoss,
  calculateTotalEssenceLoss,
  calculateRemainingEssence,
  getCurrentEssence,
  // Validation
  validateEssenceViability,
  validateAugmentationEssence,
  // Full calculation
  calculateEssenceImpact,
  // Types
  type EssenceCalculation,
  type EssenceValidationResult,
} from "./essence";

// Grade utilities
export {
  // Constants
  BIOWARE_GRADE_COST_MULTIPLIERS,
  BIOWARE_GRADE_AVAILABILITY_MODIFIERS,
  // Cyberware grade functions
  getCyberwareGradeMultiplier,
  getCyberwareGradeCostMultiplier,
  getCyberwareGradeAvailabilityModifier,
  getCyberwareGradeMultipliers,
  // Bioware grade functions
  getBiowareGradeMultiplier,
  getBiowareGradeCostMultiplier,
  getBiowareGradeAvailabilityModifier,
  getBiowareGradeMultipliers,
  // Generic application
  applyGradeToEssence,
  applyGradeToCost,
  applyGradeToAvailability,
  applyGradeToAll,
  // Validation
  isValidCyberwareGrade,
  isValidBiowareGrade,
  getGradeDisplayName,
  getCyberwareGrades,
  getBiowareGrades,
  // Comparison
  compareGrades,
  isValidGradeUpgrade,
  calculateGradeUpgradeEssenceRefund,
  // Types
  type GradeMultipliers,
  type AppliedGradeValues,
} from "./grades";

// Essence hole tracking
export {
  // Core functions
  shouldTrackEssenceHole,
  calculateEssenceHole,
  calculateMagicLoss,
  getEffectiveEssenceLoss,
  // State management
  createEssenceHole,
  updateEssenceHoleOnInstall,
  updateEssenceHoleOnRemoval,
  updateEssenceHoleOnGradeUpgrade,
  // Character integration
  getCharacterEssenceHole,
  getEssenceMagicSummary,
  // Formatting
  formatEssenceHole,
  getMagicLossWarning,
  // Types
  type EssenceHoleUpdateResult,
  type EssenceMagicSummary,
} from "./essence-hole";

// Validation engine
export {
  // Constants
  DEFAULT_AUGMENTATION_RULES,
  // Main validation
  validateAugmentationInstall,
  canInstallAugmentation,
  getValidationErrorSummary,
  // Individual validators
  validateAvailabilityConstraint,
  validateAttributeBonusLimit,
  validateMutualExclusion,
  aggregateAttributeBonuses,
  // Types
  type AugmentationValidationErrorCode,
  type AugmentationValidationWarningCode,
  type AugmentationValidationError,
  type AugmentationValidationWarning,
  type AugmentationValidationResult,
  type ValidationContext,
  type SimpleValidationResult,
} from "./validation";

// Cyberlimb management
export {
  // Identification
  isCyberlimb,
  // Capacity calculations
  getBaseCyberlimbCapacity,
  calculateCyberlimbCapacity,
  calculateEnhancementCapacityUsed,
  calculateCustomizationCapacityCost,
  calculateUsedCapacity,
  // Enhancement management
  validateEnhancementFits,
  addEnhancementToLimb,
  removeEnhancementFromLimb,
  // Attribute customization
  getCyberlimbCustomizationLimits,
  validateCyberlimbCustomization,
  setCyberlimbAttribute,
  getCyberlimbEffectiveAttributes,
  // Averaging
  calculateCyberlimbAverageAttribute,
  // Creation
  createCyberlimb,
  getCyberlimbSummary,
  // Types
  type CyberlimbCustomization,
  type CyberlimbCapacityBreakdown,
  type CyberlimbValidationResult,
  type CyberlimbItem,
} from "./cyberlimb";
