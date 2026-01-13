/**
 * Action Executor for Action Resolution
 *
 * Executes validated actions, handles dice rolling, applies state changes,
 * and records actions to history. Provides transactional execution with
 * rollback capability.
 */

import { randomUUID } from "crypto";
import type {
  ID,
  ISODateString,
  Character,
  ActionPool,
  ActionResult,
  ActionContext,
  ActionDefinition,
  CombatSession,
  CombatParticipant,
  ActionAllocation,
  StateChange,
  EdgeActionType,
  PoolModifier,
} from "@/lib/types";
import {
  validateAction,
  validateActionEconomy,
  ValidationResult,
  ValidationError,
} from "./action-validator";
import { executeRoll, executeReroll, DEFAULT_DICE_RULES } from "./dice-engine";
import { buildActionPool } from "./pool-builder";
import * as actionHistoryStorage from "@/lib/storage/action-history";
import * as combatStorage from "@/lib/storage/combat";

// =============================================================================
// EXECUTION REQUEST/RESULT TYPES
// =============================================================================

/**
 * Request to execute an action
 */
export interface ExecutionRequest {
  /** Character performing the action */
  characterId: ID;
  /** User who owns the character */
  userId: ID;
  /** Action definition to execute */
  action: ActionDefinition;
  /** Character data (for pool building) */
  character: Character;
  /** Target of the action (if applicable) */
  targetId?: ID;
  /** Combat session context (if in combat) */
  combatSessionId?: ID;
  /** Participant ID in combat session */
  participantId?: ID;
  /** Pre-roll Edge action to apply */
  edgeAction?: EdgeActionType;
  /** Additional modifiers to apply */
  additionalModifiers?: PoolModifier[];
  /** Action context information */
  context?: ActionContext;
}

/**
 * Result of executing an action
 */
export interface ExecutionResult {
  /** Whether execution succeeded */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Validation result if validation failed */
  validation?: ValidationResult;
  /** The action result (dice roll, hits, etc.) */
  actionResult?: ActionResult;
  /** State changes that were applied */
  stateChanges: StateChange[];
  /** Audit entry ID */
  auditId?: ID;
}

/**
 * Request to reroll an action using Edge
 */
export interface RerollRequest {
  /** Character performing the reroll */
  characterId: ID;
  /** User who owns the character */
  userId: ID;
  /** ID of the action to reroll */
  actionId: ID;
  /** Edge action type for reroll (second_chance or close_call) */
  edgeAction: EdgeActionType;
  /** Combat session context (if in combat) */
  combatSessionId?: ID;
  /** Participant ID in combat session */
  participantId?: ID;
}

// =============================================================================
// STATE CHANGE TRACKING
// =============================================================================

/**
 * Collector for state changes during execution
 */
class StateChangeCollector {
  private changes: StateChange[] = [];

  add(change: StateChange): void {
    this.changes.push(change);
  }

  getChanges(): StateChange[] {
    return [...this.changes];
  }

  clear(): void {
    this.changes = [];
  }
}

// =============================================================================
// ACTION ECONOMY UPDATES
// =============================================================================

/**
 * Calculate updated action allocation after using an action
 */
export function consumeAction(current: ActionAllocation, actionType: string): ActionAllocation {
  const updated = { ...current };

  switch (actionType) {
    case "free":
      // Free actions are tracked but effectively unlimited
      if (updated.free > 0) {
        updated.free--;
      }
      break;

    case "simple":
      if (updated.simple > 0) {
        updated.simple--;
      }
      break;

    case "complex":
      // Complex action uses the complex slot or both simple slots
      if (updated.complex > 0) {
        updated.complex = 0;
        updated.simple = 0; // Complex uses both simple actions
      } else if (updated.simple >= 2) {
        updated.simple -= 2;
      }
      break;

    case "interrupt":
      updated.interrupt = false;
      break;
  }

  return updated;
}

// =============================================================================
// CORE EXECUTION
// =============================================================================

/**
 * Execute an action with full validation, rolling, and state updates
 */
export async function executeAction(request: ExecutionRequest): Promise<ExecutionResult> {
  const stateChanges = new StateChangeCollector();
  const now = new Date().toISOString();

  // 1. Get combat session if in combat
  let combatSession: CombatSession | null = null;
  let participant: CombatParticipant | null = null;

  if (request.combatSessionId) {
    combatSession = await combatStorage.getCombatSession(request.combatSessionId);
    if (!combatSession) {
      return {
        success: false,
        error: "Combat session not found",
        stateChanges: [],
      };
    }

    if (request.participantId) {
      participant = combatSession.participants.find((p) => p.id === request.participantId) ?? null;
    }
  }

  // 2. Validate the action
  const validation = validateAction(
    request.character,
    request.action,
    combatSession ?? undefined,
    request.participantId
  );

  if (!validation.valid) {
    return {
      success: false,
      error: validation.errors[0]?.message ?? "Validation failed",
      validation,
      stateChanges: [],
    };
  }

  // 3. Build the action pool
  let actionPool: ActionPool;
  if (validation.modifiedPool) {
    actionPool = validation.modifiedPool;
  } else {
    // Build pool from action config
    actionPool = buildActionPool(request.character, {
      attribute: request.action.rollConfig?.attribute,
      skill: request.action.rollConfig?.skill,
      situationalModifiers: request.additionalModifiers,
    });
  }

  // Add any additional modifiers from request
  if (request.additionalModifiers) {
    const existingTotal = actionPool.modifiers.reduce((sum, m) => sum + m.value, 0);
    const additionalTotal = request.additionalModifiers.reduce((sum, m) => sum + m.value, 0);
    actionPool = {
      ...actionPool,
      modifiers: [...actionPool.modifiers, ...request.additionalModifiers],
      totalDice: Math.max(0, actionPool.basePool + existingTotal + additionalTotal),
    };
  }

  // 4. Handle Edge action (pre-roll)
  let edgeSpent = 0;
  if (request.edgeAction === "push_the_limit") {
    const edgeValue = request.character.attributes?.edge ?? 0;
    if (edgeValue <= 0) {
      return {
        success: false,
        error: "Insufficient Edge for Push the Limit",
        stateChanges: [],
      };
    }
    edgeSpent = 1;
    // Add Edge dice to pool
    actionPool = {
      ...actionPool,
      modifiers: [
        ...actionPool.modifiers,
        {
          source: "edge",
          value: edgeValue,
          description: "Push the Limit (Edge dice)",
        },
      ],
      totalDice: actionPool.totalDice + edgeValue,
    };
  }

  // 5. Execute the roll
  const rollResult = executeRoll(actionPool.totalDice, DEFAULT_DICE_RULES, {
    limit: actionPool.limit,
    explodingSixes: request.edgeAction === "push_the_limit",
  });

  // 6. Create action result
  const actionResult: ActionResult = {
    id: randomUUID(),
    characterId: request.characterId,
    userId: request.userId,
    pool: actionPool,
    dice: rollResult.dice,
    hits: rollResult.hits,
    rawHits: rollResult.rawHits,
    ones: rollResult.ones,
    isGlitch: rollResult.isGlitch,
    isCriticalGlitch: rollResult.isCriticalGlitch,
    edgeSpent,
    edgeAction: request.edgeAction,
    rerollCount: 0,
    timestamp: now,
    context: request.context ?? {
      actionType: request.action.domain,
      skillUsed: request.action.rollConfig?.skill,
      attributeUsed: request.action.rollConfig?.attribute,
      description: request.action.name,
    },
  };

  // 7. Save action to history
  await actionHistoryStorage.saveActionResult(request.userId, request.characterId, actionResult);

  // 8. Update combat session state if applicable
  if (combatSession && participant && request.participantId) {
    // Consume the action
    const updatedActions = consumeAction(participant.actionsRemaining, request.action.type);

    stateChanges.add({
      entityId: request.participantId,
      entityType: "character",
      field: "actionsRemaining",
      previousValue: participant.actionsRemaining,
      newValue: updatedActions,
      description: `Used ${request.action.type} action: ${request.action.name}`,
    });

    await combatStorage.updateParticipantActions(
      request.combatSessionId!,
      request.participantId,
      updatedActions
    );

    // Update Edge if spent
    if (edgeSpent > 0) {
      stateChanges.add({
        entityId: request.characterId,
        entityType: "character",
        field: "edge",
        previousValue: request.character.attributes?.edge ?? 0,
        newValue: (request.character.attributes?.edge ?? 0) - edgeSpent,
        description: `Spent ${edgeSpent} Edge on ${request.edgeAction}`,
      });
    }
  }

  // 9. Apply action effects (simplified - would need effect execution logic)
  // This is where damage, conditions, etc. would be applied based on action.effects
  // For now, we just track that effects should be applied
  if (actionResult.hits > 0 && request.action.effects.length > 0) {
    for (const effect of request.action.effects) {
      stateChanges.add({
        entityId: request.targetId ?? request.characterId,
        entityType: "character",
        field: effect.type,
        previousValue: null,
        newValue: {
          effectType: effect.type,
          hits: actionResult.hits,
          description: effect.description,
        },
        description: `Effect pending: ${effect.description ?? effect.type}`,
      });
    }
  }

  return {
    success: true,
    actionResult,
    stateChanges: stateChanges.getChanges(),
    auditId: actionResult.id,
  };
}

/**
 * Execute a reroll using Edge (Second Chance or Close Call)
 */
export async function executeActionReroll(request: RerollRequest): Promise<ExecutionResult> {
  const stateChanges = new StateChangeCollector();

  // 1. Get the original action
  const originalAction = await actionHistoryStorage.getAction(
    request.userId,
    request.characterId,
    request.actionId
  );

  if (!originalAction) {
    return {
      success: false,
      error: "Original action not found",
      stateChanges: [],
    };
  }

  // 2. Validate the Edge action
  if (request.edgeAction !== "second_chance" && request.edgeAction !== "close_call") {
    return {
      success: false,
      error: "Invalid Edge action for reroll. Use second_chance or close_call.",
      stateChanges: [],
    };
  }

  // Close Call just negates glitch, doesn't reroll
  if (request.edgeAction === "close_call") {
    if (!originalAction.isGlitch && !originalAction.isCriticalGlitch) {
      return {
        success: false,
        error: "Close Call can only be used on a glitch",
        stateChanges: [],
      };
    }

    // Update the action to remove glitch
    const updatedAction = await actionHistoryStorage.updateActionResult(
      request.userId,
      request.characterId,
      request.actionId,
      {
        isGlitch: false,
        isCriticalGlitch: false,
        edgeSpent: originalAction.edgeSpent + 1,
        edgeAction: request.edgeAction,
      }
    );

    stateChanges.add({
      entityId: request.characterId,
      entityType: "character",
      field: "edge",
      previousValue: 1,
      newValue: 0,
      description: "Spent 1 Edge on Close Call",
    });

    return {
      success: true,
      actionResult: updatedAction ?? undefined,
      stateChanges: stateChanges.getChanges(),
      auditId: request.actionId,
    };
  }

  // Second Chance - reroll non-hits
  const rerollResult = executeReroll(
    originalAction.dice,
    DEFAULT_DICE_RULES,
    originalAction.pool.limit
  );

  // Create updated action result
  const updatedAction = await actionHistoryStorage.updateActionResult(
    request.userId,
    request.characterId,
    request.actionId,
    {
      dice: rerollResult.dice,
      hits: rerollResult.hits,
      rawHits: rerollResult.rawHits,
      ones: rerollResult.ones,
      isGlitch: rerollResult.isGlitch,
      isCriticalGlitch: rerollResult.isCriticalGlitch,
      edgeSpent: originalAction.edgeSpent + 1,
      edgeAction: request.edgeAction,
      rerollCount: originalAction.rerollCount + 1,
    }
  );

  stateChanges.add({
    entityId: request.characterId,
    entityType: "character",
    field: "edge",
    previousValue: 1,
    newValue: 0,
    description: "Spent 1 Edge on Second Chance",
  });

  stateChanges.add({
    entityId: request.characterId,
    entityType: "character",
    field: "actionResult.hits",
    previousValue: originalAction.hits,
    newValue: rerollResult.hits,
    description: `Second Chance reroll: ${originalAction.hits} -> ${rerollResult.hits} hits`,
  });

  return {
    success: true,
    actionResult: updatedAction ?? undefined,
    stateChanges: stateChanges.getChanges(),
    auditId: request.actionId,
  };
}

// =============================================================================
// COMBAT-SPECIFIC EXECUTION
// =============================================================================

/**
 * Execute a combat action with full combat context
 */
export async function executeCombatAction(request: ExecutionRequest): Promise<ExecutionResult> {
  // Validate combat context
  if (!request.combatSessionId || !request.participantId) {
    return {
      success: false,
      error: "Combat session and participant ID required for combat actions",
      stateChanges: [],
    };
  }

  // Delegate to main executor
  return executeAction(request);
}

/**
 * Execute a general (non-combat) action
 */
export async function executeGeneralAction(request: ExecutionRequest): Promise<ExecutionResult> {
  // Remove combat context requirement
  const generalRequest: ExecutionRequest = {
    ...request,
    combatSessionId: undefined,
    participantId: undefined,
  };

  return executeAction(generalRequest);
}

// =============================================================================
// STATE CHANGE APPLICATION
// =============================================================================

/**
 * Apply a batch of state changes
 * This would update character/session data based on the changes
 */
export async function applyStateChanges(changes: StateChange[]): Promise<void> {
  // Group changes by entity
  const byEntity = new Map<string, StateChange[]>();
  for (const change of changes) {
    const key = `${change.entityType}:${change.entityId}`;
    if (!byEntity.has(key)) {
      byEntity.set(key, []);
    }
    byEntity.get(key)!.push(change);
  }

  // Apply changes to each entity
  // This is a simplified implementation - would need actual storage updates
  for (const [key, entityChanges] of byEntity) {
    const [entityType, entityId] = key.split(":");

    // Would apply changes based on entity type
    // For now, just log that changes would be applied
    console.log(`Would apply ${entityChanges.length} changes to ${entityType} ${entityId}`);
  }
}

/**
 * Rollback state changes (for error recovery)
 */
export async function rollbackStateChanges(changes: StateChange[]): Promise<void> {
  // Apply changes in reverse, swapping previous and new values
  const reversedChanges = [...changes].reverse().map((change) => ({
    ...change,
    previousValue: change.newValue,
    newValue: change.previousValue,
    description: `Rollback: ${change.description}`,
  }));

  await applyStateChanges(reversedChanges);
}

// =============================================================================
// OPPOSED TEST EXECUTION
// =============================================================================

/**
 * Execute an opposed test between attacker and defender
 */
export async function executeOpposedTest(
  attackerRequest: ExecutionRequest,
  defenderRequest: ExecutionRequest,
  combatSessionId?: ID
): Promise<{
  attackerResult: ExecutionResult;
  defenderResult: ExecutionResult;
  netHits: number;
  winner: "attacker" | "defender" | "tie";
}> {
  // Execute attacker's action
  const attackerResult = await executeAction(attackerRequest);
  if (!attackerResult.success || !attackerResult.actionResult) {
    return {
      attackerResult,
      defenderResult: { success: false, error: "Attacker failed", stateChanges: [] },
      netHits: 0,
      winner: "defender",
    };
  }

  // Execute defender's action
  const defenderResult = await executeAction(defenderRequest);
  if (!defenderResult.success || !defenderResult.actionResult) {
    return {
      attackerResult,
      defenderResult,
      netHits: attackerResult.actionResult.hits,
      winner: "attacker",
    };
  }

  // Calculate net hits
  const attackerHits = attackerResult.actionResult.hits;
  const defenderHits = defenderResult.actionResult.hits;
  const netHits = attackerHits - defenderHits;

  let winner: "attacker" | "defender" | "tie";
  if (netHits > 0) {
    winner = "attacker";
  } else if (netHits < 0) {
    winner = "defender";
  } else {
    winner = "tie";
  }

  // Record opposed test if in combat
  if (combatSessionId) {
    await combatStorage.createOpposedTest({
      combatSessionId,
      attackerId: attackerRequest.participantId!,
      defenderId: defenderRequest.participantId!,
      mode: "synchronous",
      state: "resolved",
      attackerActionId: attackerResult.actionResult.id,
      attackerHits,
      defenderActionId: defenderResult.actionResult.id,
      defenderHits,
      netHits,
      resolvedAt: new Date().toISOString(),
    });
  }

  return {
    attackerResult,
    defenderResult,
    netHits,
    winner,
  };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Check if an action can be executed without actually executing it
 */
export async function canExecuteAction(request: Omit<ExecutionRequest, "userId">): Promise<{
  canExecute: boolean;
  validation: ValidationResult;
  estimatedPool?: ActionPool;
}> {
  let combatSession: CombatSession | null = null;

  if (request.combatSessionId) {
    combatSession = await combatStorage.getCombatSession(request.combatSessionId);
  }

  const validation = validateAction(
    request.character,
    request.action,
    combatSession ?? undefined,
    request.participantId
  );

  return {
    canExecute: validation.valid,
    validation,
    estimatedPool: validation.modifiedPool,
  };
}

/**
 * Get available actions for a character in their current state
 */
export async function getAvailableActions(
  character: Character,
  actionCatalog: ActionDefinition[],
  combatSessionId?: ID,
  participantId?: ID
): Promise<{
  eligible: ActionDefinition[];
  ineligible: { action: ActionDefinition; reasons: string[] }[];
}> {
  let combatSession: CombatSession | null = null;

  if (combatSessionId) {
    combatSession = await combatStorage.getCombatSession(combatSessionId);
  }

  const eligible: ActionDefinition[] = [];
  const ineligible: { action: ActionDefinition; reasons: string[] }[] = [];

  for (const action of actionCatalog) {
    const validation = validateAction(character, action, combatSession ?? undefined, participantId);

    if (validation.valid) {
      eligible.push(action);
    } else {
      ineligible.push({
        action,
        reasons: validation.errors.map((e) => e.message),
      });
    }
  }

  return { eligible, ineligible };
}
