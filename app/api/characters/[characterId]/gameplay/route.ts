/**
 * API Route: /api/characters/[characterId]/gameplay
 *
 * POST - Apply gameplay actions (damage, healing, karma)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  getCharacter,
  applyDamage,
  healCharacter,
  spendKarma,
  awardKarma,
  retireCharacter,
  killCharacter,
} from "@/lib/storage/characters";

type GameplayAction =
  | { action: "damage"; physical: number; stun: number }
  | { action: "heal"; physical: number; stun: number }
  | { action: "spendKarma"; amount: number }
  | { action: "awardKarma"; amount: number }
  | { action: "retire" }
  | { action: "kill" };

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

    // Check character exists and belongs to user
    const existing = await getCharacter(userId, characterId);
    if (!existing) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Check character is active
    if (existing.status !== "active") {
      return NextResponse.json(
        { success: false, error: "Character must be active for gameplay actions" },
        { status: 400 }
      );
    }

    // Parse body
    const body: GameplayAction = await request.json();

    let character;

    switch (body.action) {
      case "damage":
        character = await applyDamage(userId, characterId, body.physical || 0, body.stun || 0);
        break;

      case "heal":
        character = await healCharacter(userId, characterId, body.physical || 0, body.stun || 0);
        break;

      case "spendKarma":
        if (!body.amount || body.amount <= 0) {
          return NextResponse.json(
            { success: false, error: "Amount must be positive" },
            { status: 400 }
          );
        }
        character = await spendKarma(userId, characterId, body.amount);
        break;

      case "awardKarma":
        if (!body.amount || body.amount <= 0) {
          return NextResponse.json(
            { success: false, error: "Amount must be positive" },
            { status: 400 }
          );
        }
        character = await awardKarma(userId, characterId, body.amount);
        break;

      case "retire":
        character = await retireCharacter(userId, characterId);
        break;

      case "kill":
        character = await killCharacter(userId, characterId);
        break;

      default:
        return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      character,
    });
  } catch (error) {
    console.error("Failed to apply gameplay action:", error);
    const message = error instanceof Error ? error.message : "Failed to apply action";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
