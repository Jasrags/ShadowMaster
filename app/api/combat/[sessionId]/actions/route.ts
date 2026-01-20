/**
 * API Route: /api/combat/[sessionId]/actions
 *
 * GET - Get available actions for the current participant
 * POST - Execute an action within combat context
 *
 * Satisfies:
 * - Requirement: "Participants MUST receive immediate verification of action costs,
 *   eligibility, and resulting state changes"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacterById, updateCharacter } from "@/lib/storage/characters";
import {
  getCombatSession,
  getCurrentParticipant,
  updateParticipantActions,
  updateParticipant,
} from "@/lib/storage/combat";
import { loadRuleset } from "@/lib/rules/loader";
import {
  validateAction,
  canPerformAction,
  getActionBlockers,
  consumeAction,
  executeRoll,
  buildActionPool,
  calculateStateModifiers,
  type ValidationResult,
} from "@/lib/rules/action-resolution";
import { processDamageApplication } from "@/lib/rules/action-resolution/combat";
import type {
  ActionDefinition,
  Character,
  EditionCode,
  ActionType,
  ActionAllocation,
} from "@/lib/types";

interface RouteParams {
  params: Promise<{ sessionId: string }>;
}

/**
 * GET /api/combat/[sessionId]/actions
 *
 * Get available actions for the current participant or specified participant.
 *
 * Query Parameters:
 * - participantId: Specific participant to check (optional, defaults to current)
 * - category: Filter by action category (combat, magic, matrix, social, general)
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { sessionId } = await params;
    const session = await getCombatSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Combat session not found" },
        { status: 404 }
      );
    }

    // Check access
    if (session.ownerId !== user.id) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    // Parse query params
    const { searchParams } = new URL(request.url);
    const participantId = searchParams.get("participantId");
    const category = searchParams.get("category");

    // Get participant
    let participant;
    if (participantId) {
      participant = session.participants.find((p) => p.id === participantId);
    } else {
      participant = await getCurrentParticipant(sessionId);
    }

    if (!participant) {
      return NextResponse.json({ success: false, error: "Participant not found" }, { status: 404 });
    }

    // Load ruleset
    const rulesetResult = await loadRuleset({
      editionCode: session.editionCode as EditionCode,
    });
    if (!rulesetResult.success || !rulesetResult.ruleset) {
      return NextResponse.json(
        { success: false, error: "Failed to load ruleset" },
        { status: 500 }
      );
    }
    const ruleset = rulesetResult.ruleset;

    // Get character if this is a character type
    let character: Character | null = null;
    if (participant.type === "character") {
      character = await getCharacterById(participant.entityId);
    }

    // Get all actions from ruleset books
    const allActions: ActionDefinition[] = [];
    for (const book of ruleset.books) {
      const actionsModule = book.payload.modules.actions;
      if (actionsModule?.payload) {
        const actionCategories = ["combat", "general", "magic", "matrix", "social", "vehicle"];
        for (const cat of actionCategories) {
          if (category && cat !== category) continue;
          const actions = (actionsModule.payload as Record<string, ActionDefinition[]>)[cat];
          if (Array.isArray(actions)) {
            allActions.push(...actions);
          }
        }
      }
    }

    // Categorize actions by availability
    const actionsRemaining = participant.actionsRemaining;
    const availableActions: (ActionDefinition & { canPerform: boolean; blockers: string[] })[] = [];
    const unavailableActions: (ActionDefinition & { canPerform: boolean; blockers: string[] })[] =
      [];

    for (const action of allActions) {
      // Check if action type is available
      const actionType = action.cost?.actionType || action.type;
      let hasActionEconomy = false;
      const blockers: string[] = [];

      // Check action economy
      switch (actionType) {
        case "free":
          hasActionEconomy = actionsRemaining.free > 0;
          if (!hasActionEconomy) blockers.push("No free actions remaining");
          break;
        case "simple":
          hasActionEconomy = actionsRemaining.simple > 0;
          if (!hasActionEconomy) blockers.push("No simple actions remaining");
          break;
        case "complex":
          hasActionEconomy = actionsRemaining.complex > 0;
          if (!hasActionEconomy) blockers.push("No complex actions remaining");
          break;
        case "interrupt":
          hasActionEconomy = actionsRemaining.interrupt;
          if (!hasActionEconomy) blockers.push("Interrupt already used");
          break;
      }

      // Additional validation if we have a character
      let meetsPrerequisites = true;
      if (character && hasActionEconomy) {
        meetsPrerequisites = canPerformAction(character, action, session);
        if (!meetsPrerequisites) {
          const prereqBlockers = getActionBlockers(character, action, session);
          blockers.push(...prereqBlockers);
        }
      }

      const canPerformThisAction = hasActionEconomy && meetsPrerequisites;
      const actionWithStatus = {
        ...action,
        canPerform: canPerformThisAction,
        blockers,
      };

      if (canPerformThisAction) {
        availableActions.push(actionWithStatus);
      } else {
        unavailableActions.push(actionWithStatus);
      }
    }

    return NextResponse.json({
      success: true,
      participantId: participant.id,
      participantName: participant.name,
      actionsRemaining,
      available: availableActions,
      unavailable: unavailableActions,
      totalAvailable: availableActions.length,
      totalUnavailable: unavailableActions.length,
    });
  } catch (error) {
    console.error("Failed to get available actions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get available actions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/combat/[sessionId]/actions
 *
 * Execute an action within combat context.
 *
 * Body:
 * - actionId: ID of the action to execute
 * - participantId: ID of the participant executing (optional, defaults to current)
 * - targetId: ID of target participant (for opposed tests)
 * - modifiers: Additional pool modifiers
 * - useEdge: Edge action to use (push-the-limit, second-chance, etc.)
 * - rollOverride: Manual dice (for non-automated rolls)
 * - weaponId: Weapon ID for weapon attacks
 * - firingMode: Firing mode for ranged weapons (SS, SA, BF, FA)
 * - range: Range to target in meters
 */
export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { sessionId } = await params;
    const session = await getCombatSession(sessionId);

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Combat session not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (session.ownerId !== user.id) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    // Check session is active
    if (session.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Combat session is not active" },
        { status: 400 }
      );
    }

    // Parse body
    const body = await request.json();
    const { actionId, participantId, targetId, modifiers } = body;

    // Validate required fields
    if (!actionId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: actionId" },
        { status: 400 }
      );
    }

    // Get participant
    let participant;
    if (participantId) {
      participant = session.participants.find((p) => p.id === participantId);
    } else {
      participant = await getCurrentParticipant(sessionId);
    }

    if (!participant) {
      return NextResponse.json({ success: false, error: "Participant not found" }, { status: 404 });
    }

    // Check participant is active
    if (participant.status !== "active" && participant.status !== "waiting") {
      return NextResponse.json(
        { success: false, error: "Participant cannot act" },
        { status: 400 }
      );
    }

    // Load ruleset
    const rulesetResult = await loadRuleset({
      editionCode: session.editionCode as EditionCode,
    });
    if (!rulesetResult.success || !rulesetResult.ruleset) {
      return NextResponse.json(
        { success: false, error: "Failed to load ruleset" },
        { status: 500 }
      );
    }
    const ruleset = rulesetResult.ruleset;

    // Find action from ruleset books
    let action: ActionDefinition | undefined;
    for (const book of ruleset.books) {
      const actionsModule = book.payload.modules.actions;
      if (actionsModule?.payload) {
        const actionCategories = ["combat", "general", "magic", "matrix", "social", "vehicle"];
        for (const cat of actionCategories) {
          const actions = (actionsModule.payload as Record<string, ActionDefinition[]>)[cat];
          if (Array.isArray(actions)) {
            action = actions.find((a) => a.id === actionId);
            if (action) break;
          }
        }
        if (action) break;
      }
    }

    if (!action) {
      return NextResponse.json(
        { success: false, error: `Action not found: ${actionId}` },
        { status: 404 }
      );
    }

    // Get character if this is a character type
    let character: Character | null = null;
    if (participant.type === "character") {
      character = await getCharacterById(participant.entityId);
    }

    // Validate action
    let validation: ValidationResult | null = null;
    if (character) {
      validation = validateAction(character, action, session);
      if (!validation.valid) {
        return NextResponse.json(
          {
            success: false,
            error: "Action validation failed",
            errors: validation.errors,
            warnings: validation.warnings,
          },
          { status: 400 }
        );
      }
    }

    // Determine action cost and consume it
    const actionType = (action.cost?.actionType || action.type) as ActionType;
    const newActionsRemaining = consumeAction(participant.actionsRemaining, actionType);

    // Check if action was actually consumed (by comparing values)
    const actionWasConsumed = checkActionConsumed(
      participant.actionsRemaining,
      newActionsRemaining,
      actionType
    );
    if (!actionWasConsumed) {
      return NextResponse.json(
        { success: false, error: `No ${actionType} actions remaining` },
        { status: 400 }
      );
    }

    // Update participant's remaining actions
    await updateParticipantActions(sessionId, participant.id, newActionsRemaining);

    // Build response
    const result: {
      success: boolean;
      action: ActionDefinition;
      participant: { id: string; name: string };
      actionsRemaining: ActionAllocation;
      roll?: {
        dice: number[];
        hits: number;
        glitch: { isGlitch: boolean; isCriticalGlitch: boolean };
      };
      target?: { id: string; name: string };
      defenseRoll?: {
        dice: number[];
        hits: number;
        glitch: { isGlitch: boolean; isCriticalGlitch: boolean };
      };
      netHits?: number;
      damage?: unknown;
      validation?: ValidationResult;
      warnings?: ValidationResult["warnings"];
    } = {
      success: true,
      action,
      participant: {
        id: participant.id,
        name: participant.name,
      },
      actionsRemaining: newActionsRemaining,
      validation: validation || undefined,
      warnings: validation?.warnings,
    };

    // Execute roll if character and action has roll config
    if (character && action.rollConfig) {
      const stateModifiers = calculateStateModifiers(character, action, session);
      const pool = buildActionPool(character, {
        attribute: action.rollConfig.attribute,
        skill: action.rollConfig.skill,
        situationalModifiers: [...stateModifiers, ...(modifiers || [])],
      });

      // Execute the roll
      const limit = action.rollConfig.limitType === "none" ? undefined : pool.limit;
      const rollResult = executeRoll(pool.totalDice, undefined, { limit });

      result.roll = {
        dice: rollResult.dice.map((d) => d.value),
        hits: rollResult.hits,
        glitch: {
          isGlitch: rollResult.isGlitch,
          isCriticalGlitch: rollResult.isCriticalGlitch,
        },
      };

      // Handle opposed tests
      if (action.opposedBy?.canBeOpposed && targetId) {
        const targetParticipant = session.participants.find((p) => p.id === targetId);
        if (targetParticipant) {
          result.target = {
            id: targetParticipant.id,
            name: targetParticipant.name,
          };

          // Get target character if available
          let targetCharacter: Character | null = null;
          if (targetParticipant.type === "character") {
            targetCharacter = await getCharacterById(targetParticipant.entityId);
          }

          if (targetCharacter) {
            // Build defense pool
            const defensePool = buildActionPool(targetCharacter, {
              attribute: action.opposedBy.defaultDefenseAttribute || "reaction",
              skill: action.opposedBy.defaultDefenseSkill,
            });

            const defenseRollResult = executeRoll(defensePool.totalDice);

            result.defenseRoll = {
              dice: defenseRollResult.dice.map((d) => d.value),
              hits: defenseRollResult.hits,
              glitch: {
                isGlitch: defenseRollResult.isGlitch,
                isCriticalGlitch: defenseRollResult.isCriticalGlitch,
              },
            };
            result.netHits = rollResult.hits - defenseRollResult.hits;
          }
        }
      }

      // Handle damage effects
      if (action.effects && result.netHits !== undefined && result.netHits > 0) {
        const damageEffect = action.effects.find((e) => e.type === "damage");
        if (damageEffect && targetId) {
          const targetParticipant = session.participants.find((p) => p.id === targetId);
          if (targetParticipant && targetParticipant.type === "character") {
            const targetCharacter = await getCharacterById(targetParticipant.entityId);
            if (targetCharacter) {
              // Calculate damage based on net hits
              const damageValue = result.netHits;
              const damageResult = processDamageApplication(
                targetCharacter,
                {
                  targetId: targetParticipant.id,
                  damageType: (damageEffect.damageType as "physical" | "stun") || "physical",
                  damageValue,
                  armorPenetration: 0,
                },
                0 // Resistance hits would come from a separate roll
              );

              result.damage = damageResult;

              // Update target's wound modifier
              await updateParticipant(sessionId, targetParticipant.id, {
                woundModifier: damageResult.newWoundModifier,
              });

              // Update character condition
              const newState = damageResult.conditionMonitorState;
              await updateCharacter(targetCharacter.ownerId, targetCharacter.id, {
                condition: {
                  ...targetCharacter.condition,
                  physicalDamage: newState.physicalDamage,
                  stunDamage: newState.stunDamage,
                  overflowDamage: newState.overflowDamage,
                },
              });
            }
          }
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to execute action:", error);
    return NextResponse.json(
      { success: false, error: "Failed to execute action" },
      { status: 500 }
    );
  }
}

/**
 * Check if an action was actually consumed by comparing before/after
 */
function checkActionConsumed(
  before: ActionAllocation,
  after: ActionAllocation,
  actionType: string
): boolean {
  switch (actionType) {
    case "free":
      return after.free < before.free || before.free === 0;
    case "simple":
      return after.simple < before.simple;
    case "complex":
      return after.complex < before.complex || after.simple < before.simple;
    case "interrupt":
      return !after.interrupt && before.interrupt;
    default:
      return true;
  }
}
