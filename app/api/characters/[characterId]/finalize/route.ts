/**
 * API Route: /api/characters/[characterId]/finalize
 *
 * POST - Finalize a character draft (change status from draft to active)
 *
 * Uses the state machine to:
 * - Validate the character is complete
 * - Enforce the draft → active transition rules
 * - Create an audit trail entry
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacter } from "@/lib/storage/characters";
import { authorizeOwnerAccess } from "@/lib/auth/character-authorization";
import {
  executeTransition,
  type TransitionContext,
} from "@/lib/rules/character/state-machine";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { characterId } = await params;

    // Authorize the finalize action
    const authResult = await authorizeOwnerAccess(
      userId,
      userId, // Owner is the authenticated user
      characterId,
      "finalize"
    );

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const character = authResult.character!;

    // Check character is a draft (additional safety check)
    if (character.status !== "draft") {
      return NextResponse.json(
        { success: false, error: "Character is not a draft" },
        { status: 400 }
      );
    }

    // Execute the state transition using the state machine
    const transitionContext: TransitionContext = {
      actor: {
        userId,
        role: authResult.role,
      },
      note: "Character finalized via API",
    };

    const transitionResult = await executeTransition(
      character,
      "active",
      transitionContext
    );

    if (!transitionResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Character validation failed",
          errors: transitionResult.errors,
          warnings: transitionResult.warnings,
        },
        { status: 400 }
      );
    }

    // Persist the updated character with new status and audit entry
    const updatedCharacter = await updateCharacter(
      userId,
      characterId,
      transitionResult.character!
    );

    return NextResponse.json({
      success: true,
      character: updatedCharacter,
      warnings: transitionResult.warnings,
    });
  } catch (error) {
    console.error("Failed to finalize character:", error);
    return NextResponse.json(
      { success: false, error: "Failed to finalize character" },
      { status: 500 }
    );
  }
}
