/**
 * API Route: /api/characters/[characterId]/social-capital
 *
 * GET - Get character's social capital (budget and stats)
 * POST - Recalculate social capital from current contacts
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import {
  getSocialCapital,
  recalculateSocialCapital,
  updateSocialCapital,
} from "@/lib/storage/social-capital";
import type { SocialCapital } from "@/lib/types";

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

    // Get character to verify ownership
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Get social capital
    const socialCapital = await getSocialCapital(userId, characterId);

    // Calculate available points
    const availablePoints = socialCapital
      ? socialCapital.maxContactPoints - socialCapital.usedContactPoints
      : null;

    return NextResponse.json({
      success: true,
      socialCapital,
      availablePoints,
    });
  } catch (error) {
    console.error("Failed to get social capital:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get social capital" },
      { status: 500 }
    );
  }
}

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

    // Get character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Parse optional body for updates
    let updates: Partial<SocialCapital> = {};
    try {
      const body = await request.json();
      if (body && typeof body === "object") {
        updates = body as Partial<SocialCapital>;
      }
    } catch {
      // No body or invalid JSON - just recalculate
    }

    // Recalculate social capital
    const socialCapital = await recalculateSocialCapital(userId, characterId);

    // Apply any updates (e.g., campaign limits, modifiers)
    let finalSocialCapital = socialCapital;
    if (Object.keys(updates).length > 0) {
      finalSocialCapital = await updateSocialCapital(userId, characterId, updates);
    }

    return NextResponse.json({
      success: true,
      socialCapital: finalSocialCapital,
      availablePoints: finalSocialCapital.maxContactPoints - finalSocialCapital.usedContactPoints,
    });
  } catch (error) {
    console.error("Failed to recalculate social capital:", error);
    return NextResponse.json(
      { success: false, error: "Failed to recalculate social capital" },
      { status: 500 }
    );
  }
}
