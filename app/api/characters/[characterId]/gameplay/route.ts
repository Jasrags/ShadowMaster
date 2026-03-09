/**
 * API Route: /api/characters/[characterId]/gameplay
 *
 * POST - Apply gameplay actions (damage, healing, karma)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  applyDamage,
  healCharacter,
  spendKarma,
  awardKarma,
  spendNuyen,
  awardNuyen,
  retireCharacter,
  killCharacter,
} from "@/lib/storage/characters";
import { resolveCharacterForGameplay, notifyOwnerOfGMEdit } from "@/lib/auth/gm-character-access";
import { apiLogger } from "@/lib/logging";

type GameplayAction =
  | { action: "damage"; physical: number; stun: number }
  | { action: "heal"; physical: number; stun: number }
  | { action: "spendKarma"; amount: number }
  | { action: "awardKarma"; amount: number }
  | { action: "spendNuyen"; amount: number; reason?: string }
  | { action: "awardNuyen"; amount: number; reason?: string }
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

    // Resolve character with GM cross-user support
    const resolution = await resolveCharacterForGameplay(userId, characterId, "gameplay_edit");
    if (!resolution.authorized) {
      return NextResponse.json(
        { success: false, error: resolution.error },
        { status: resolution.status }
      );
    }

    const { ownerId, actorRole, campaign, isGMAccess } = resolution;
    const existing = resolution.character;

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
    let actionDesc = "";

    switch (body.action) {
      case "damage":
        character = await applyDamage(ownerId, characterId, body.physical || 0, body.stun || 0);
        actionDesc = `${body.physical || 0}P/${body.stun || 0}S damage applied`;
        break;

      case "heal":
        character = await healCharacter(ownerId, characterId, body.physical || 0, body.stun || 0);
        actionDesc = `${body.physical || 0}P/${body.stun || 0}S healed`;
        break;

      case "spendKarma":
        if (!body.amount || body.amount <= 0) {
          return NextResponse.json(
            { success: false, error: "Amount must be positive" },
            { status: 400 }
          );
        }
        character = await spendKarma(ownerId, characterId, body.amount);
        actionDesc = `${body.amount} karma spent`;
        break;

      case "awardKarma":
        if (!body.amount || body.amount <= 0) {
          return NextResponse.json(
            { success: false, error: "Amount must be positive" },
            { status: 400 }
          );
        }
        character = await awardKarma(ownerId, characterId, body.amount);
        actionDesc = `${body.amount} karma awarded`;
        break;

      case "spendNuyen":
        if (!body.amount || body.amount <= 0) {
          return NextResponse.json(
            { success: false, error: "Amount must be positive" },
            { status: 400 }
          );
        }
        character = await spendNuyen(ownerId, characterId, body.amount, body.reason);
        actionDesc = `${body.amount}¥ spent`;
        break;

      case "awardNuyen":
        if (!body.amount || body.amount <= 0) {
          return NextResponse.json(
            { success: false, error: "Amount must be positive" },
            { status: 400 }
          );
        }
        character = await awardNuyen(ownerId, characterId, body.amount);
        actionDesc = `${body.amount}¥ awarded`;
        break;

      case "retire":
        character = await retireCharacter(ownerId, characterId);
        actionDesc = "character retired";
        break;

      case "kill":
        character = await killCharacter(ownerId, characterId);
        actionDesc = "character killed";
        break;

      default:
        return NextResponse.json({ success: false, error: "Unknown action" }, { status: 400 });
    }

    // Notify owner if GM made the edit
    if (isGMAccess && campaign) {
      await notifyOwnerOfGMEdit(existing, campaign, userId, actionDesc);
    }

    return NextResponse.json({
      success: true,
      character,
      actorRole,
    });
  } catch (error) {
    const { characterId } = await params;
    apiLogger.error({ error, characterId }, "Failed to apply gameplay action");
    const message = error instanceof Error ? error.message : "Failed to apply action";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
