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
