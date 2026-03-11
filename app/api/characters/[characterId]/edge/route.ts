/**
 * API Route: /api/characters/[characterId]/edge
 *
 * GET - Get current Edge status
 * POST - Spend or restore Edge
 *
 * @see /docs/capabilities/mechanics.action-resolution.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  spendEdge,
  restoreEdge,
  restoreFullEdge,
  getCurrentEdge,
  getMaxEdge,
} from "@/lib/storage/characters";
import { resolveCharacterForGameplay, notifyOwnerOfGMEdit } from "@/lib/auth/gm-character-access";
import type { EdgeRequest } from "@/lib/types";
import { calculateEdgeRegainAmount } from "@/lib/rules/action-resolution/edge-actions";
import { apiLogger } from "@/lib/logging";

/**
 * GET /api/characters/[characterId]/edge
 *
 * Get current Edge status
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

    const { characterId } = await params;

    // Resolve character with GM cross-user support (view permission for GET)
    const resolution = await resolveCharacterForGameplay(userId, characterId, "view");
    if (!resolution.authorized) {
      return NextResponse.json(
        { success: false, error: resolution.error },
        { status: resolution.status }
      );
    }

    const { character } = resolution;
    const current = getCurrentEdge(character);
    const maximum = getMaxEdge(character);

    return NextResponse.json({
      success: true,
      edgeCurrent: current,
      edgeMaximum: maximum,
      canSpend: current > 0,
      canRestore: current < maximum,
    });
  } catch (error) {
    console.error("Error getting Edge status:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to get Edge status",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/characters/[characterId]/edge
 *
 * Spend or restore Edge
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

    const { characterId } = await params;

    // Resolve character with GM cross-user support
    const resolution = await resolveCharacterForGameplay(userId, characterId, "gameplay_edit");
    if (!resolution.authorized) {
      return NextResponse.json(
        { success: false, error: resolution.error },
        { status: resolution.status }
      );
    }

    let { character } = resolution;
    const { ownerId, actorRole, campaign, isGMAccess } = resolution;

    // Parse request body
    const body: EdgeRequest = await request.json();

    if (!body.action) {
      return NextResponse.json(
        { success: false, error: "Action is required (spend or restore)" },
        { status: 400 }
      );
    }

    // For restore actions, calculate amount based on Daredevil quality + context
    const regainContext = body.context || "normal";
    const defaultRestoreAmount =
      body.action === "restore" ? calculateEdgeRegainAmount(character, regainContext) : 1;
    const amount = body.amount || defaultRestoreAmount;

    if (amount < 1) {
      return NextResponse.json(
        { success: false, error: "Amount must be at least 1" },
        { status: 400 }
      );
    }

    if (body.action === "spend") {
      const currentEdge = getCurrentEdge(character);
      if (currentEdge < amount) {
        return NextResponse.json(
          {
            success: false,
            error: `Insufficient Edge. Have: ${currentEdge}, Need: ${amount}`,
          },
          { status: 400 }
        );
      }

      character = await spendEdge(ownerId, characterId, amount);

      if (isGMAccess && campaign) {
        await notifyOwnerOfGMEdit(
          resolution.character,
          campaign,
          userId,
          `${amount} Edge spent`,
          body.reason
        );
      }

      return NextResponse.json({
        success: true,
        action: "spent",
        amount,
        edgeCurrent: getCurrentEdge(character),
        edgeMaximum: getMaxEdge(character),
        reason: body.reason,
        actorRole,
      });
    } else if (body.action === "restore") {
      // Check if "full" restore requested
      if (body.amount === undefined || body.amount === getMaxEdge(character)) {
        character = await restoreFullEdge(ownerId, characterId);
      } else {
        character = await restoreEdge(ownerId, characterId, amount);
      }

      if (isGMAccess && campaign) {
        await notifyOwnerOfGMEdit(
          resolution.character,
          campaign,
          userId,
          `${amount} Edge restored`,
          body.reason
        );
      }

      return NextResponse.json({
        success: true,
        action: "restored",
        amount,
        edgeCurrent: getCurrentEdge(character),
        edgeMaximum: getMaxEdge(character),
        reason: body.reason,
        actorRole,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use 'spend' or 'restore'" },
      { status: 400 }
    );
  } catch (error) {
    const { characterId } = await params;
    apiLogger.error({ error, characterId }, "Error managing Edge");
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to manage Edge",
      },
      { status: 500 }
    );
  }
}
