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

// Drone Network Manager
export {
  createDroneNetwork,
  calculateDroneConditionMonitor,
  slaveDroneToNetwork,
  releaseDroneFromNetwork,
  releaseAllDrones,
  shareAutosoftToNetwork,
  unshareAutosoftFromNetwork,
  getEffectiveAutosoftRating,
  getEffectiveAutosofts,
  issueDroneCommand,
  issueNetworkCommand,
  clearDroneCommand,
  clearAllCommands,
  updateDronePosition,
  updateAllDronePositions,
  getDroneFromNetwork,
  getSlavedDroneCount,
  getRemainingCapacity,
  isNetworkFull,
  getDronesWithCommand,
  getJumpedInDrone,
  type DroneNetworkResult,
  type SlaveOperationResult,
  type CommandResult,
} from "./drone-network";

// Drone Condition Tracker
export {
  getDroneDamageModifier,
  getDroneConditionStatus,
  applyDroneDamage,
  applyDamageToNetworkDrone,
  repairDroneDamage,
  fullyRepairDrone,
  repairNetworkDrone,
  isDroneDestroyed,
  isDroneDisabled,
  isDroneOperational,
  isDroneLightlyDamaged,
  isDroneModeratelyDamaged,
  isDroneHeavilyDamaged,
  isDroneCriticallyDamaged,
  getDroneDamageSeverity,
  getOperationalDrones,
  getDestroyedDrones,
  getDisabledDrones,
  getOperationalDroneCount,
  getNetworkHealthSummary,
  removeDestroyedDrones,
  type DroneConditionResult,
  type DamageApplicationResult,
  type RepairResult,
} from "./drone-condition";

// Jumped-In Manager
export {
  validateJumpIn,
  jumpIn,
  jumpOut,
  calculateJumpedInInitiative,
  getInitiativeDice,
  isJumpedIn,
  getJumpedInTarget,
  getCurrentVRMode,
  getJumpedInControlBonus,
  isBodyVulnerable,
  getJumpedInDuration,
  switchVRMode,
  isHotSim,
  isColdSim,
  type JumpInResult,
  type JumpOutResult,
  type InitiativeResult,
} from "./jumped-in-manager";

// Biofeedback Handler
export {
  getBiofeedbackDamageType,
  getCurrentBiofeedbackType,
  calculateBiofeedbackFromVehicleDamage,
  calculateDumpshockDamage,
  applyBiofeedbackDamage,
  trackBiofeedbackDamage,
  handleForcedEjection,
  createDumpshockResult,
  calculateBiofeedbackResistancePool,
  reduceBiofeedbackDamage,
  getTotalBiofeedbackDamage,
  isBiofeedbackDangerous,
  getBiofeedbackWarningLevel,
  shouldWarnAboutHotSim,
  getHotSimRiskDescription,
  getColdSimBenefitsDescription,
  type BiofeedbackDamageResult,
  type ForcedEjectionResult,
} from "./biofeedback-handler";
