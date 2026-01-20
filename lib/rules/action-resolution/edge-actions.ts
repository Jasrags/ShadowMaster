/**
 * Edge Actions for Action Resolution
 *
 * Handles Edge-powered interventions like rerolls, Push the Limit,
 * and other Edge actions in Shadowrun 5th Edition.
 */

import type {
  Character,
  ActionPool,
  ActionResult,
  EdgeActionType,
  EditionDiceRules,
} from "@/lib/types";
import {
  DEFAULT_DICE_RULES,
  executeRoll,
  executeReroll,
  rollDiceExploding,
  calculateHitsWithLimit,
  calculateGlitch,
  sortDiceForDisplay,
} from "./dice-engine";
import { getAttributeValue, addModifiersToPool } from "./pool-builder";

// =============================================================================
// EDGE AVAILABILITY
// =============================================================================

/**
 * Get current Edge points available
 */
export function getCurrentEdge(character: Character): number {
  // Check condition.edgeCurrent first (runtime tracking)
  if (character.condition?.edgeCurrent !== undefined) {
    return character.condition.edgeCurrent;
  }
  // Fall back to Edge attribute (full Edge)
  return character.attributes?.edge ?? 0;
}

/**
 * Get maximum Edge points
 */
export function getMaxEdge(character: Character): number {
  return character.attributes?.edge ?? 0;
}

/**
 * Check if character can spend Edge
 */
export function canSpendEdge(character: Character, amount: number = 1): boolean {
  return getCurrentEdge(character) >= amount;
}

/**
 * Check if a specific Edge action is available
 */
export function canUseEdgeAction(
  character: Character,
  action: EdgeActionType,
  context: {
    isPreRoll?: boolean;
    isPostRoll?: boolean;
    hasGlitch?: boolean;
    currentResult?: ActionResult;
  },
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): { canUse: boolean; reason?: string } {
  const edgeConfig = rules.edgeActions?.[action];

  if (!edgeConfig) {
    return { canUse: false, reason: "Edge action not available in this edition" };
  }

  // Check Edge cost
  if (!canSpendEdge(character, edgeConfig.cost)) {
    return {
      canUse: false,
      reason: `Insufficient Edge (need ${edgeConfig.cost}, have ${getCurrentEdge(character)})`,
    };
  }

  // Check timing
  if (context.isPreRoll && !edgeConfig.preRoll) {
    return { canUse: false, reason: "This Edge action cannot be used before rolling" };
  }

  if (context.isPostRoll && !edgeConfig.postRoll) {
    return { canUse: false, reason: "This Edge action cannot be used after rolling" };
  }

  // Specific action checks
  switch (action) {
    case "second-chance":
      if (!context.currentResult) {
        return { canUse: false, reason: "No result to reroll" };
      }
      if (context.currentResult.rerollCount > 0) {
        return { canUse: false, reason: "Already used Second Chance on this roll" };
      }
      break;

    case "close-call":
      if (!context.hasGlitch) {
        return { canUse: false, reason: "No glitch to negate" };
      }
      break;
  }

  return { canUse: true };
}

// =============================================================================
// EDGE ACTION EXECUTION
// =============================================================================

/**
 * Result of an Edge action
 */
export interface EdgeActionResult {
  success: boolean;
  error?: string;
  edgeSpent: number;
  newEdgeCurrent: number;
  rollResult?: ReturnType<typeof executeRoll>;
  modifiedPool?: ActionPool;
  glitchNegated?: boolean;
}

/**
 * Execute Push the Limit (pre-roll Edge action)
 *
 * - Add Edge rating to dice pool
 * - Exploding sixes (6s reroll and add)
 * - Ignore limits for this test
 */
export function executePushTheLimit(
  character: Character,
  pool: ActionPool,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): EdgeActionResult {
  const edgeConfig = rules.edgeActions?.["push-the-limit"];
  const edgeCost = edgeConfig?.cost ?? 1;

  // Check availability
  if (!canSpendEdge(character, edgeCost)) {
    return {
      success: false,
      error: "Insufficient Edge",
      edgeSpent: 0,
      newEdgeCurrent: getCurrentEdge(character),
    };
  }

  // Add Edge to pool
  const edgeRating = getAttributeValue(character, "edge");
  const modifiedPool = addModifiersToPool(pool, {
    source: "edge",
    value: edgeRating,
    description: "Push the Limit",
  });

  // Remove limit (Push the Limit ignores limits)
  const unlimitedPool: ActionPool = {
    ...modifiedPool,
    limit: undefined,
    limitSource: undefined,
  };

  // Roll with exploding sixes
  const rollResult = executeRoll(unlimitedPool.totalDice, rules, {
    explodingSixes: true,
  });

  return {
    success: true,
    edgeSpent: edgeCost,
    newEdgeCurrent: getCurrentEdge(character) - edgeCost,
    rollResult,
    modifiedPool: unlimitedPool,
  };
}

/**
 * Execute Second Chance (post-roll Edge action)
 *
 * - Reroll all dice that did not score hits
 * - Keep original hits
 */
export function executeSecondChance(
  character: Character,
  originalResult: ActionResult,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): EdgeActionResult {
  const edgeConfig = rules.edgeActions?.["second-chance"];
  const edgeCost = edgeConfig?.cost ?? 1;

  // Check availability
  if (!canSpendEdge(character, edgeCost)) {
    return {
      success: false,
      error: "Insufficient Edge",
      edgeSpent: 0,
      newEdgeCurrent: getCurrentEdge(character),
    };
  }

  // Check if already rerolled
  if (originalResult.rerollCount > 0) {
    return {
      success: false,
      error: "Already used Second Chance on this roll",
      edgeSpent: 0,
      newEdgeCurrent: getCurrentEdge(character),
    };
  }

  // Perform reroll
  const rollResult = executeReroll(originalResult.dice, rules, originalResult.pool.limit);

  return {
    success: true,
    edgeSpent: edgeCost,
    newEdgeCurrent: getCurrentEdge(character) - edgeCost,
    rollResult,
  };
}

/**
 * Execute Close Call (post-roll Edge action)
 *
 * - Negate the effects of a glitch or critical glitch
 */
export function executeCloseCall(
  character: Character,
  result: ActionResult,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): EdgeActionResult {
  const edgeConfig = rules.edgeActions?.["close-call"];
  const edgeCost = edgeConfig?.cost ?? 1;

  // Check availability
  if (!canSpendEdge(character, edgeCost)) {
    return {
      success: false,
      error: "Insufficient Edge",
      edgeSpent: 0,
      newEdgeCurrent: getCurrentEdge(character),
    };
  }

  // Check if there's a glitch to negate
  if (!result.isGlitch && !result.isCriticalGlitch) {
    return {
      success: false,
      error: "No glitch to negate",
      edgeSpent: 0,
      newEdgeCurrent: getCurrentEdge(character),
    };
  }

  return {
    success: true,
    edgeSpent: edgeCost,
    newEdgeCurrent: getCurrentEdge(character) - edgeCost,
    glitchNegated: true,
  };
}

/**
 * Execute Blitz (pre-roll Edge action for Initiative)
 *
 * - Roll 5d6 for Initiative instead of normal dice
 */
export function executeBlitz(
  character: Character,
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): EdgeActionResult {
  const edgeConfig = rules.edgeActions?.["blitz"];
  const edgeCost = edgeConfig?.cost ?? 1;

  // Check availability
  if (!canSpendEdge(character, edgeCost)) {
    return {
      success: false,
      error: "Insufficient Edge",
      edgeSpent: 0,
      newEdgeCurrent: getCurrentEdge(character),
    };
  }

  // Roll 5d6 for initiative
  const rollResult = executeRoll(5, rules);

  return {
    success: true,
    edgeSpent: edgeCost,
    newEdgeCurrent: getCurrentEdge(character) - edgeCost,
    rollResult,
  };
}

// =============================================================================
// GENERIC EDGE ACTION DISPATCHER
// =============================================================================

/**
 * Execute any Edge action by type
 */
export function executeEdgeAction(
  action: EdgeActionType,
  character: Character,
  context: {
    pool?: ActionPool;
    result?: ActionResult;
  },
  rules: EditionDiceRules = DEFAULT_DICE_RULES
): EdgeActionResult {
  switch (action) {
    case "push-the-limit":
      if (!context.pool) {
        return {
          success: false,
          error: "Push the Limit requires a pool",
          edgeSpent: 0,
          newEdgeCurrent: getCurrentEdge(character),
        };
      }
      return executePushTheLimit(character, context.pool, rules);

    case "second-chance":
      if (!context.result) {
        return {
          success: false,
          error: "Second Chance requires a result to reroll",
          edgeSpent: 0,
          newEdgeCurrent: getCurrentEdge(character),
        };
      }
      return executeSecondChance(character, context.result, rules);

    case "close-call":
      if (!context.result) {
        return {
          success: false,
          error: "Close Call requires a result",
          edgeSpent: 0,
          newEdgeCurrent: getCurrentEdge(character),
        };
      }
      return executeCloseCall(character, context.result, rules);

    case "blitz":
      return executeBlitz(character, rules);

    case "seize-the-initiative":
    case "dead-mans-trigger":
      // These don't involve dice rolls, just Edge spending
      const edgeConfig = rules.edgeActions?.[action];
      const edgeCost = edgeConfig?.cost ?? 1;

      if (!canSpendEdge(character, edgeCost)) {
        return {
          success: false,
          error: "Insufficient Edge",
          edgeSpent: 0,
          newEdgeCurrent: getCurrentEdge(character),
        };
      }

      return {
        success: true,
        edgeSpent: edgeCost,
        newEdgeCurrent: getCurrentEdge(character) - edgeCost,
      };

    default:
      return {
        success: false,
        error: `Unknown Edge action: ${action}`,
        edgeSpent: 0,
        newEdgeCurrent: getCurrentEdge(character),
      };
  }
}

// =============================================================================
// EDGE RESTORATION
// =============================================================================

/**
 * Calculate how much Edge can be restored
 */
export function calculateRestorableEdge(character: Character): number {
  const current = getCurrentEdge(character);
  const max = getMaxEdge(character);
  return Math.max(0, max - current);
}

/**
 * Check if Edge can be restored (for scene/session start)
 */
export function canRestoreEdge(character: Character): boolean {
  return calculateRestorableEdge(character) > 0;
}
