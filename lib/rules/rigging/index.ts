/**
 * Rigging Control Rules Module
 *
 * Exports all rigging-related validation and calculation functions.
 */

// VCR Validator
export {
  hasVehicleControlRig,
  getVehicleControlRig,
  validateJumpInRequirements,
  calculateVCRControlBonus,
  calculateVCRInitiativeBonus,
  calculateVCRBonuses,
  canPerformRiggingActions,
  getMaxVCRRating,
  type VCRValidationResult,
} from "./vcr-validator";

// RCC Validator
export {
  calculateMaxSlavedDrones,
  calculateNoiseReduction,
  calculateSharingBonus,
  hasRCC,
  getActiveRCC,
  buildRCCConfiguration,
  validateRCCConfig,
  validateDroneSlaving,
  validateAutosoftOnRCC,
  getOwnedDrones,
  getOwnedAutosofts,
  hasDrone,
  hasAutosoft,
  canRemoteControl,
  getEffectiveFirewall,
  isRCCAtCapacity,
  type RCCValidationResult,
  type DroneSlaveValidationResult,
  type AutosoftValidationResult,
} from "./rcc-validator";

// Noise Calculator
export {
  getDistanceBand,
  getDistanceNoise,
  getNoiseForDistance,
  getTerrainNoise,
  calculateTerrainNoise,
  getSpamZoneNoise,
  getStaticZoneNoise,
  calculateNoise,
  applyNoiseToPool,
  isSignalBlocked,
  getNoiseDescription,
  calculateTotalNoiseReduction,
  getDistanceDescription,
  calculateDroneNoise,
  type SpamZoneLevel,
  type StaticZoneLevel,
  type NoiseCalculationInput,
} from "./noise-calculator";
