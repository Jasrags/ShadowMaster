/**
 * API Route: /api/characters/[characterId]/actions
 *
 * GET - Get action history for a character
 * POST - Roll dice and record action result
 *
 * @see /docs/capabilities/mechanics.action-resolution.md
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, spendEdge } from "@/lib/storage/characters";
import {
  getActionHistory,
  saveActionResult,
  calculateActionStats,
  queryActionHistory,
} from "@/lib/storage/action-history";
import {
  executeRoll,
  buildActionPool,
  DEFAULT_DICE_RULES,
  executePushTheLimit,
  getCurrentEdge,
  getMaxEdge,
} from "@/lib/rules/action-resolution";
import type {
  RollActionRequest,
  ActionResult,
  ActionPool,
  PoolBuildOptions,
  EdgeActionType,
} from "@/lib/types";

/**
 * GET /api/characters/[characterId]/actions
 *
 * Get action history for a character
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
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

    const { characterId } = await params;

    // Verify character ownership
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const skill = searchParams.get("skill") || undefined;
    const actionType = searchParams.get("actionType") || undefined;
    const hadGlitch = searchParams.get("hadGlitch");
    const usedEdge = searchParams.get("usedEdge");
    const includeStats = searchParams.get("includeStats") === "true";

    // Query actions
    const { actions, total } = await queryActionHistory(userId, characterId, {
      limit,
      offset,
      skill,
      actionType,
      hadGlitch: hadGlitch ? hadGlitch === "true" : undefined,
      usedEdge: usedEdge ? usedEdge === "true" : undefined,
    });

    // Calculate stats if requested
    let stats = null;
    if (includeStats) {
      stats = await calculateActionStats(userId, characterId);
    }

    return NextResponse.json({
      success: true,
      actions,
      total,
      limit,
      offset,
      hasMore: offset + actions.length < total,
      stats,
    });
  } catch (error) {
    console.error("Error getting action history:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get action history",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/characters/[characterId]/actions
 *
 * Roll dice and record action result
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
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

    const { characterId } = await params;

    // Verify character ownership
    let character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Parse request body
    const body: RollActionRequest = await request.json();

    if (!body.pool) {
      return NextResponse.json(
        { success: false, error: "Pool configuration is required" },
        { status: 400 }
      );
    }

    // Build or use provided pool
    let pool: ActionPool;
    if ("totalDice" in body.pool) {
      // Already a complete ActionPool
      pool = body.pool as ActionPool;
    } else {
      // Build from options
      pool = buildActionPool(character, body.pool as PoolBuildOptions, DEFAULT_DICE_RULES);
    }

    // Validate pool
    if (pool.totalDice < 1) {
      return NextResponse.json(
        { success: false, error: "Pool must have at least 1 die" },
        { status: 400 }
      );
    }

    // Handle Edge action (pre-roll)
    let edgeSpent = 0;
    let edgeAction: EdgeActionType | undefined;
    let rollResult;

    if (body.edgeAction === "push-the-limit") {
      // Check Edge availability
      const currentEdge = getCurrentEdge(character);
      if (currentEdge < 1) {
        return NextResponse.json({ success: false, error: "Insufficient Edge" }, { status: 400 });
      }

      // Execute Push the Limit
      const ptlResult = executePushTheLimit(character, pool, DEFAULT_DICE_RULES);
      if (!ptlResult.success || !ptlResult.rollResult) {
        return NextResponse.json(
          { success: false, error: ptlResult.error || "Push the Limit failed" },
          { status: 400 }
        );
      }

      rollResult = ptlResult.rollResult;
      pool = ptlResult.modifiedPool || pool;
      edgeSpent = ptlResult.edgeSpent;
      edgeAction = "push-the-limit";

      // Spend Edge
      character = await spendEdge(userId, characterId, edgeSpent);
    } else {
      // Normal roll
      rollResult = executeRoll(pool.totalDice, DEFAULT_DICE_RULES, {
        limit: pool.limit,
      });
    }

    // Create action result
    const actionResult: ActionResult = {
      id: uuidv4(),
      characterId,
      userId,
      pool,
      dice: rollResult.dice,
      hits: rollResult.hits,
      rawHits: rollResult.rawHits,
      ones: rollResult.ones,
      isGlitch: rollResult.isGlitch,
      isCriticalGlitch: rollResult.isCriticalGlitch,
      edgeSpent,
      edgeAction,
      rerollCount: 0,
      timestamp: new Date().toISOString(),
      context: body.context,
    };

    // Save to history
    await saveActionResult(userId, characterId, actionResult);

    return NextResponse.json({
      success: true,
      result: actionResult,
      edgeCurrent: getCurrentEdge(character),
      edgeMaximum: getMaxEdge(character),
    });
  } catch (error) {
    console.error("Error rolling action:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to roll action",
      },
      { status: 500 }
    );
  }
}
