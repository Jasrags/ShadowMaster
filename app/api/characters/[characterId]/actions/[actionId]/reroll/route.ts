/**
 * API Route: /api/characters/[characterId]/actions/[actionId]/reroll
 *
 * POST - Reroll an action using Edge (Second Chance)
 *
 * @see /docs/capabilities/mechanics.action-resolution.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, spendEdge } from "@/lib/storage/characters";
import { getAction, updateActionResult } from "@/lib/storage/action-history";
import {
  executeReroll,
  executeCloseCall,
  DEFAULT_DICE_RULES,
  getCurrentEdge,
  getMaxEdge,
  canSpendEdge,
} from "@/lib/rules/action-resolution";
import type { RerollActionRequest, EdgeActionType } from "@/lib/types";

/**
 * POST /api/characters/[characterId]/actions/[actionId]/reroll
 *
 * Reroll an action using Edge
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; actionId: string }> }
) {
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

    const { characterId, actionId } = await params;

    // Verify character ownership
    let character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Get the original action
    const originalAction = await getAction(userId, characterId, actionId);
    if (!originalAction) {
      return NextResponse.json({ success: false, error: "Action not found" }, { status: 404 });
    }

    // Parse request body
    const body: RerollActionRequest = await request.json();

    if (!body.edgeAction) {
      return NextResponse.json(
        { success: false, error: "Edge action is required" },
        { status: 400 }
      );
    }

    // Validate Edge action type
    const validPostRollActions: EdgeActionType[] = ["second-chance", "close-call"];
    if (!validPostRollActions.includes(body.edgeAction)) {
      return NextResponse.json(
        { success: false, error: "Invalid Edge action for reroll" },
        { status: 400 }
      );
    }

    // Check Edge availability
    if (!canSpendEdge(character, 1)) {
      return NextResponse.json({ success: false, error: "Insufficient Edge" }, { status: 400 });
    }

    // Handle different Edge actions
    if (body.edgeAction === "second-chance") {
      // Check if already rerolled
      if (originalAction.rerollCount > 0) {
        return NextResponse.json(
          { success: false, error: "Already used Second Chance on this roll" },
          { status: 400 }
        );
      }

      // Execute reroll
      const rerollResult = executeReroll(
        originalAction.dice,
        DEFAULT_DICE_RULES,
        originalAction.pool.limit
      );

      // Spend Edge
      character = await spendEdge(userId, characterId, 1);

      // Update the action
      const updatedAction = await updateActionResult(userId, characterId, actionId, {
        dice: rerollResult.dice,
        hits: rerollResult.hits,
        rawHits: rerollResult.rawHits,
        ones: rerollResult.ones,
        isGlitch: rerollResult.isGlitch,
        isCriticalGlitch: rerollResult.isCriticalGlitch,
        edgeSpent: originalAction.edgeSpent + 1,
        edgeAction: "second-chance",
        rerollCount: originalAction.rerollCount + 1,
        previousResultId: originalAction.id,
      });

      return NextResponse.json({
        success: true,
        result: updatedAction,
        edgeCurrent: getCurrentEdge(character),
        edgeMaximum: getMaxEdge(character),
      });
    } else if (body.edgeAction === "close-call") {
      // Check if there's a glitch to negate
      if (!originalAction.isGlitch && !originalAction.isCriticalGlitch) {
        return NextResponse.json({ success: false, error: "No glitch to negate" }, { status: 400 });
      }

      // Spend Edge
      character = await spendEdge(userId, characterId, 1);

      // Update the action to negate glitch
      const updatedAction = await updateActionResult(userId, characterId, actionId, {
        isGlitch: false,
        isCriticalGlitch: false,
        edgeSpent: originalAction.edgeSpent + 1,
        edgeAction: "close-call",
      });

      return NextResponse.json({
        success: true,
        result: updatedAction,
        glitchNegated: true,
        edgeCurrent: getCurrentEdge(character),
        edgeMaximum: getMaxEdge(character),
      });
    }

    return NextResponse.json({ success: false, error: "Unknown Edge action" }, { status: 400 });
  } catch (error) {
    console.error("Error rerolling action:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to reroll action",
      },
      { status: 500 }
    );
  }
}
