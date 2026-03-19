/**
 * API Route: /api/characters/[characterId]/contacts/[contactId]/confirm-edge
 *
 * POST - Confirm an Edge-acquired contact by spending Karma (Run Faster p. 178)
 *
 * Karma cost = Connection + Loyalty (Loyalty is always 1 for Edge contacts).
 * Removes pendingKarmaConfirmation flag, making the contact permanent.
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, saveCharacter } from "@/lib/storage/characters";
import { getCharacterContact, updateCharacterContact } from "@/lib/storage/contacts";
import { addFavorTransaction } from "@/lib/storage/favor-ledger";
import { canConfirmEdgeContact } from "@/lib/rules/i-know-a-guy";
import type { ConfirmEdgeResponse } from "@/lib/types/contacts";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; contactId: string }> }
): Promise<NextResponse<ConfirmEdgeResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { characterId, contactId } = await params;

    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    const contact = await getCharacterContact(userId, characterId, contactId);
    if (!contact) {
      return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 });
    }

    // Must be an Edge-acquired contact pending confirmation
    if (!contact.pendingKarmaConfirmation) {
      return NextResponse.json(
        { success: false, error: "Contact is not pending Karma confirmation" },
        { status: 400 }
      );
    }

    // Validate Karma sufficiency
    const check = canConfirmEdgeContact({
      connectionRating: contact.connection,
      currentKarma: character.karmaCurrent,
    });

    if (!check.allowed) {
      return NextResponse.json({ success: false, error: check.reason }, { status: 400 });
    }

    // Deduct Karma
    const updatedCharacter = {
      ...character,
      karmaCurrent: character.karmaCurrent - check.karmaCost,
    };
    await saveCharacter(updatedCharacter);

    // Remove pending flag
    const updatedContact = await updateCharacterContact(userId, characterId, contactId, {
      pendingKarmaConfirmation: false,
    });

    // Record transaction
    await addFavorTransaction(userId, characterId, {
      contactId,
      type: "contact_acquired",
      favorChange: 0,
      karmaSpent: check.karmaCost,
      description: `Confirmed Edge contact "${contact.name}" with ${check.karmaCost} Karma`,
    });

    return NextResponse.json({
      success: true,
      contact: updatedContact,
      karmaSpent: check.karmaCost,
      karmaRemaining: updatedCharacter.karmaCurrent,
    });
  } catch (error) {
    console.error("Failed to confirm Edge contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to confirm Edge contact" },
      { status: 500 }
    );
  }
}
