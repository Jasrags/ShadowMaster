/**
 * API Route: /api/characters/[characterId]/qualities/[qualityId]/state
 *
 * GET - Get current dynamic state for a quality
 * POST - Update dynamic state for a quality
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import {
  getCharacter,
  updateQualityDynamicState,
} from "@/lib/storage/characters";
import { getDynamicState } from "@/lib/rules/qualities/dynamic-state";
import type { QualityDynamicState } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; qualityId: string }> }
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

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const { characterId, qualityId } = await params;

    // Get character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    // Get dynamic state
    const state = getDynamicState(character, qualityId);
    if (!state) {
      return NextResponse.json(
        { success: false, error: "Quality does not have dynamic state" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      state,
    });
  } catch (error) {
    console.error("Failed to get quality state:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get quality state" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; qualityId: string }> }
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

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const { characterId, qualityId } = await params;

    // Get character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    // Parse body
    const body = await request.json();
    const { updates } = body;

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid updates" },
        { status: 400 }
      );
    }

    // Update dynamic state
    const updatedCharacter = await updateQualityDynamicState(
      userId,
      characterId,
      qualityId,
      updates as Partial<QualityDynamicState["state"]>
    );

    // Get updated state
    const updatedState = getDynamicState(updatedCharacter, qualityId);

    return NextResponse.json({
      success: true,
      state: updatedState,
      character: updatedCharacter,
    });
  } catch (error) {
    console.error("Failed to update quality state:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to update quality state";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

