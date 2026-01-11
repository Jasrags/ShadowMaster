/**
 * API Route: /api/characters/[characterId]/social-actions/networking
 *
 * POST - Perform a networking action to find new contacts
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, saveCharacter } from "@/lib/storage/characters";
import { getSocialCapital } from "@/lib/storage/social-capital";
import { calculateSocialDicePool, resolveNetworking } from "@/lib/rules/social-actions";
import type { CreateContactRequest } from "@/lib/types";

interface NetworkingRequest {
  targetArchetype: string;
  location?: string;
  nuyenBudget?: number;
  diceRoll: number;
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

    // Parse body
    const body = (await request.json()) as NetworkingRequest;
    const { targetArchetype, location, nuyenBudget = 0, diceRoll } = body;

    if (!targetArchetype) {
      return NextResponse.json(
        { success: false, error: "Target archetype is required" },
        { status: 400 }
      );
    }

    if (typeof diceRoll !== "number" || diceRoll < 0) {
      return NextResponse.json(
        { success: false, error: "Dice roll must be a non-negative number" },
        { status: 400 }
      );
    }

    // Validate nuyen budget
    const nuyenSpent = Math.max(0, Math.min(nuyenBudget, character.nuyen));
    if (nuyenBudget > character.nuyen) {
      return NextResponse.json(
        {
          success: false,
          error: `Insufficient nuyen. Have ${character.nuyen}, requested ${nuyenBudget}`,
        },
        { status: 400 }
      );
    }

    // Get social capital for modifiers
    const socialCapital = await getSocialCapital(userId, characterId);

    // Calculate dice pool for display/logging purposes
    const dicePoolInfo = calculateSocialDicePool(
      character,
      "networking",
      undefined, // No target contact for networking
      socialCapital
    );

    // Resolve networking action
    const result = resolveNetworking(
      character,
      targetArchetype,
      diceRoll,
      nuyenSpent,
      socialCapital
    );

    // Deduct nuyen spent
    if (nuyenSpent > 0) {
      const updatedCharacter = {
        ...character,
        nuyen: character.nuyen - nuyenSpent,
      };
      await saveCharacter(updatedCharacter);
    }

    // Build suggested contact if found
    let suggestedContact: Partial<CreateContactRequest> | undefined;
    if (result.contactFound) {
      suggestedContact = {
        name: "", // Player should name the contact
        archetype: targetArchetype,
        connection: result.suggestedConnection,
        loyalty: result.suggestedLoyalty,
        location: location || undefined,
        group: "personal",
      };
    }

    return NextResponse.json({
      success: true,
      contactFound: result.contactFound,
      suggestedContact,
      timeSpent: result.timeSpent,
      nuyenSpent: result.nuyenSpent,
      bonusFromNuyen: result.bonusFromNuyen,
      dicePool: {
        base: dicePoolInfo.basePool,
        modifiers: dicePoolInfo.modifiers,
        total: dicePoolInfo.dicePool,
        skill: dicePoolInfo.skill,
        attribute: dicePoolInfo.attribute,
      },
      message: result.contactFound
        ? `Found a potential ${targetArchetype} contact (Connection ${result.suggestedConnection}, Loyalty ${result.suggestedLoyalty})`
        : "Networking was unsuccessful. Try again later or spend more nuyen.",
    });
  } catch (error) {
    console.error("Failed to perform networking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform networking action" },
      { status: 500 }
    );
  }
}
