/**
 * Matrix Operations Module
 *
 * Provides comprehensive matrix functionality for Shadowrun 5E including:
 * - Cyberdeck validation and configuration
 * - Program slot management
 * - Overwatch Score tracking and convergence
 * - Matrix action validation and dice pools
 * - Mark management
 */

// Cyberdeck validation
export {
  validateCyberdeckConfig,
  createDefaultConfig,
  createOffensiveConfig,
  createStealthyConfig,
  hasValidMatrixHardware,
  hasMatrixAccess,
  getActiveCyberdeck,
  getCharacterCyberdecks,
  getCharacterCommlinks,
  swapAttributes,
  calculateMatrixConditionMonitor,
  getInitiativeDiceBonus,
  getBiofeedbackDamageType,
  type CyberdeckValidationResult,
} from "./cyberdeck-validator";

// Program validation
export {
  validateProgramAllocation,
  validateProgramExists,
  getProgramSlotLimit,
  isProgramCompatible,
  getLoadedPrograms,
  isProgramLoaded,
  getUnloadedPrograms,
  characterOwnsProgram,
  calculateEffectiveSlotsUsed,
  type ProgramValidationResult,
} from "./program-validator";

// Overwatch Score calculation
export {
  rollOverwatchIncrease,
  calculateOverwatchIncrease,
  addOverwatchScore,
  checkConvergence,
  getOverwatchWarningLevel,
  handleConvergence,
  calculateDumpshockDamage,
  calculateTimeUntilAutoIncrease,
  shouldAutoIncreaseOS,
  getOverwatchStatusDescription,
  type OverwatchCalculationResult,
  type MatrixActionResult,
} from "./overwatch-calculator";

// Overwatch session tracking
export {
  startOverwatchSession,
  recordOverwatchEvent,
  endOverwatchSession,
  getCurrentScore,
  getScoreUntilConvergence,
  getConvergenceProgress,
  hasConverged,
  getSessionDuration,
  getSessionEvents,
  getLastEvent,
  calculateSessionStats,
  formatSessionSummary,
  exportSession,
  importSession,
  createSessionCollection,
  addSessionToCollection,
  updateSessionInCollection,
  getSessionById,
  getActiveSessionForCharacter,
  removeSessionFromCollection,
  getCompletedSessions,
  type OverwatchSessionStats,
  type OverwatchSessionCollection,
} from "./overwatch-tracker";

// Matrix action validation
export {
  validateMatrixAction,
  isIllegalAction,
  getMarkRequirement,
  getActionLimitAttribute,
  isActionSupportedByDevice,
  requiresVRMode,
  getMarksOnTarget as getMarksOnTargetFromAction,
  hasRequiredMarks as hasRequiredMarksFromAction,
  getRelevantPrograms,
  isProgramLoaded as isProgramLoadedFromState,
  getLoadedRelevantPrograms,
  getAvailableActions,
  categorizeActions,
  getActionRequirementsSummary,
  type MatrixActionValidation,
} from "./action-validator";

// Matrix dice pool calculation
export {
  calculateMatrixDicePool,
  calculateMatrixLimit,
  getPersonaAttribute,
  calculateProgramBonus,
  calculateNoiseModifier,
  calculateRunningSilentModifier,
  calculateHotSimBonus,
  buildHackOnTheFlyPool,
  buildBruteForcePool,
  buildMatrixPerceptionPool,
  buildDataSpikePool,
  buildEditFilePool,
  buildSnoopPool,
  buildMatrixDefensePool,
  buildMatrixResistancePool,
  type DicePoolComponent,
  type MatrixDicePoolResult,
} from "./dice-pool-calculator";

// Mark management
export {
  placeMark,
  placeMarks,
  removeMarks,
  clearAllMarks,
  removeExpiredMarks,
  findMark,
  getMarksOnTarget,
  hasRequiredMarks,
  getAllMarks,
  getMarksByType,
  countTotalMarks,
  receiveMarkOnSelf,
  removeReceivedMarks,
  getTotalMarksReceived,
  getAuthorizationLevel,
  formatMarksForDisplay,
  marksNeededForLevel,
  checkActionMarks,
  type MarkPlacementResult,
  type MarkRemovalResult,
  type PlaceMarkOptions,
} from "./mark-tracker";
