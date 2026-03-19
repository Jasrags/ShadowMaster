/**
 * API Route: /api/characters/[characterId]/contacts/expire-edge
 *
 * POST - Remove all unconfirmed Edge contacts (session cleanup, Run Faster p. 178)
 *
 * Called when a session ends without the player spending Karma to confirm.
 * Unconfirmed contacts are removed and Edge refresh block is lifted.
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, saveCharacter } from "@/lib/storage/characters";
import { getCharacterContacts, removeCharacterContact } from "@/lib/storage/contacts";
import { addFavorTransaction } from "@/lib/storage/favor-ledger";
import type { ExpireEdgeResponse } from "@/lib/types/contacts";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<ExpireEdgeResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { characterId } = await params;

    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Find all unconfirmed Edge contacts
    const contacts = await getCharacterContacts(userId, characterId);
    const unconfirmed = contacts.filter((c) => c.pendingKarmaConfirmation === true);

    if (unconfirmed.length === 0) {
      return NextResponse.json({
        success: true,
        expiredCount: 0,
        expiredContactIds: [],
      });
    }

    // Remove each unconfirmed contact
    const expiredContactIds: string[] = [];
    for (const contact of unconfirmed) {
      await removeCharacterContact(userId, characterId, contact.id);
      expiredContactIds.push(contact.id);

      // Record transaction
      await addFavorTransaction(userId, characterId, {
        contactId: contact.id,
        type: "status_change",
        favorChange: 0,
        description: `Edge contact "${contact.name}" expired (Karma not spent to confirm)`,
      });
    }

    // Lift Edge refresh block
    if (character.condition?.edgeRefreshBlocked) {
      const updatedCharacter = {
        ...character,
        condition: {
          ...character.condition,
          edgeRefreshBlocked: false,
        },
      };
      await saveCharacter(updatedCharacter);
    }

    return NextResponse.json({
      success: true,
      expiredCount: expiredContactIds.length,
      expiredContactIds,
    });
  } catch (error) {
    console.error("Failed to expire Edge contacts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to expire Edge contacts" },
      { status: 500 }
    );
  }
}
