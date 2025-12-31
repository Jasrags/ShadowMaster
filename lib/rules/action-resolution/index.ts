/**
 * Action Resolution Module
 *
 * Exports all action resolution functionality including
 * dice rolling, pool building, and Edge actions.
 */

// Dice Engine
export {
  DEFAULT_DICE_RULES,
  rollD6,
  rollDice,
  rollDiceExploding,
  calculateHits,
  calculateHitsWithLimit,
  calculateGlitch,
  sortDiceForDisplay,
  rerollNonHits,
  executeRoll,
  executeReroll,
  expectedHits,
  glitchProbability,
  type GlitchResult,
  type RollExecutionResult,
} from "./dice-engine";

// Pool Builder
export {
  calculateWoundModifier,
  createWoundModifier,
  getAttributeValue,
  getSkillRating,
  hasSpecialization,
  calculateLimit,
  buildActionPool,
  buildSimplePool,
  addModifiersToPool,
  applyLimitToPool,
  buildAttackPool,
  buildDefensePool,
  buildResistancePool,
  buildSpellcastingPool,
  buildPerceptionPool,
  // Encumbrance integration
  createEncumbranceModifier,
  calculateEncumbrance,
  type EncumbranceState,
  // Wireless bonus integration
  createWirelessModifiers,
  createCombinedWirelessModifier,
  type WirelessContext,
  type ActiveWirelessBonuses,
  // Enhanced pool builders
  buildEnhancedActionPool,
  buildEnhancedAttackPool,
  buildEnhancedDefensePool,
  type EnhancedPoolBuildOptions,
} from "./pool-builder";

// Edge Actions
export {
  getCurrentEdge,
  getMaxEdge,
  canSpendEdge,
  canUseEdgeAction,
  executePushTheLimit,
  executeSecondChance,
  executeCloseCall,
  executeBlitz,
  executeEdgeAction,
  calculateRestorableEdge,
  canRestoreEdge,
  type EdgeActionResult,
} from "./edge-actions";

// Action Validator
export {
  ValidationErrorCodes,
  ValidationWarningCodes,
  validateCharacterState,
  validateActionEconomy,
  validatePrerequisites,
  validateCombatContext,
  calculateStateModifiers,
  validateActionEligibility,
  validateActionCost,
  validateAction,
  getActionBlockers,
  canPerformAction,
  type ValidationSeverity,
  type ValidationError,
  type ValidationWarning,
  type ValidationResult,
} from "./action-validator";

// Action Executor
export {
  consumeAction,
  type ExecutionRequest,
  type ExecutionResult,
  type RerollRequest,
} from "./action-executor";

// React Hooks (client-side only)
export {
  useActionResolver,
  useEdge,
  usePoolBuilder,
  useActionHistory,
  type UseActionResolverOptions,
  type UseActionResolverReturn,
  type UseEdgeReturn,
  type UsePoolBuilderReturn,
  type UseActionHistoryReturn,
} from "./hooks";
