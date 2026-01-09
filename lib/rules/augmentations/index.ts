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
  // Type guards
  isCyberlimb,
  isCyberlimbCatalogItem,
  // Location & hierarchy validation
  checkLocationConflicts,
  validateLocationForLimbType,
  // Customization validation
  getMaxCustomization,
  validateCustomization,
  // Capacity management
  getCapacityBreakdown,
  validateCapacityAvailable,
  // Enhancement management
  validateEnhancementInstall,
  addEnhancement,
  removeEnhancement,
  // Accessory management
  validateAccessoryInstall,
  addAccessory,
  removeAccessory,
  // Physical CM bonus
  calculateTotalCMBonus,
  getLimbCMBonus,
  // Attribute calculations
  getCyberlimbStrength,
  getCyberlimbAgility,
  calculateEffectiveAttribute,
  calculateAverageAttribute,
  // Creation and validation
  createCyberlimb,
  calculateCyberlimbCosts,
  validateCyberlimbInstallation,
  // Utilities
  getCyberlimbSummary,
  toggleCyberlimbWireless,
  // Re-exported constants from types
  LIMB_HIERARCHY,
  LIMB_CM_BONUS,
  LOCATION_SIDE,
  LOCATION_LIMB_TYPE,
  LIMB_TYPE_LOCATIONS,
  getCyberlimbAvailableCapacity,
  calculateCyberlimbCapacityUsed,
  wouldReplaceExisting,
  isBlockedByExisting,
  getAffectedLocations,
  // Types
  type CyberlimbValidationResult,
  type CyberlimbCapacityBreakdown,
  type CyberlimbCustomizationOptions,
  type LocationConflictResult,
  type CyberlimbInstallResult,
  type CyberlimbItem,
  type CyberlimbLocation,
  type CyberlimbType,
  type CyberlimbAppearance,
  type CyberlimbEnhancement,
  type CyberlimbAccessory,
  type CyberlimbModificationEntry,
} from "./cyberlimb";

// Augmentation management
export {
  // Installation
  installCyberware,
  installBioware,
  // Removal
  removeCyberware,
  removeBioware,
  // Grade upgrades
  upgradeAugmentationGrade,
  // Wireless bonus management
  toggleGlobalWirelessBonus,
  getWirelessBonusState,
  aggregateActiveWirelessBonuses,
  // Derived stats integration
  aggregateAugmentationBonuses,
  // Types
  type InstallResult,
  type OperationError,
  type RemovalResult,
  type UpgradeResult,
  type WirelessBonusAggregate,
  type WirelessBonus,
  type AugmentationBonuses,
} from "./management";

// React hooks for UI integration
export {
  // Main hooks
  useCharacterAugmentations,
  useInstallAugmentation,
  useRemoveAugmentation,
  useUpgradeAugmentation,
  useValidateAugmentation,
  useAugmentationDetails,
  // Computed hooks
  useAugmentationBonuses,
  useInitiativeDiceBonus,
  useCyberwareWithCapacity,
  useRemainingCapacity,
  // Types
  type EssenceSummary,
  type AugmentationsState,
  type InstallAugmentationRequest,
  type InstallAugmentationResult,
  type RemoveAugmentationResult,
  type UpgradeAugmentationResult,
  type ValidationMessage,
  type ValidationProjection,
  type ValidateAugmentationResult,
  type MutationState,
} from "./hooks";
