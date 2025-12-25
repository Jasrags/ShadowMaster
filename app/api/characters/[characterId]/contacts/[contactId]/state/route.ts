/**
 * API Route: /api/characters/[characterId]/contacts/[contactId]/state
 *
 * POST - Perform a state transition on a contact (burn, reactivate, mark-missing, mark-deceased)
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, saveCharacter } from "@/lib/storage/characters";
import {
  getCharacterContact,
  burnContact,
  reactivateContact,
  updateCharacterContact,
} from "@/lib/storage/contacts";
import { addFavorTransaction } from "@/lib/storage/favor-ledger";
import {
  canBurnContact,
  canReactivateContact,
  isValidTransition,
} from "@/lib/rules/contacts";
import type { ContactStatus } from "@/lib/types";

interface StateTransitionRequest {
  action: "burn" | "reactivate" | "mark-missing" | "mark-deceased";
  reason?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; contactId: string }> }
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

    const { characterId, contactId } = await params;

    // Get character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    // Get contact
    const contact = await getCharacterContact(userId, characterId, contactId);
    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 }
      );
    }

    // Parse body
    const body = (await request.json()) as StateTransitionRequest;
    const { action, reason } = body;

    if (!action || !["burn", "reactivate", "mark-missing", "mark-deceased"].includes(action)) {
      return NextResponse.json(
        { success: false, error: "Invalid action. Must be: burn, reactivate, mark-missing, or mark-deceased" },
        { status: 400 }
      );
    }

    // Determine target status
    let targetStatus: ContactStatus;
    switch (action) {
      case "burn":
        targetStatus = "burned";
        break;
      case "reactivate":
        targetStatus = "active";
        break;
      case "mark-missing":
        targetStatus = "missing";
        break;
      case "mark-deceased":
        targetStatus = "deceased";
        break;
    }

    // Check if transition is valid
    if (!isValidTransition(contact.status, targetStatus)) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot transition from ${contact.status} to ${targetStatus}`,
        },
        { status: 400 }
      );
    }

    let updatedContact;
    let transaction;
    let karmaCost = 0;

    if (action === "burn") {
      // Check burn prerequisites
      const burnCheck = canBurnContact(contact);
      if (!burnCheck.allowed) {
        return NextResponse.json(
          { success: false, error: burnCheck.reason },
          { status: 400 }
        );
      }

      // Burn the contact
      updatedContact = await burnContact(userId, characterId, contactId, reason || "No reason provided");

      // Record transaction
      transaction = await addFavorTransaction(userId, characterId, {
        contactId,
        type: "contact_burned",
        favorChange: 0,
        description: `Contact burned: ${reason || "No reason provided"}`,
      });
    } else if (action === "reactivate") {
      // Check reactivation prerequisites
      const reactivateCheck = canReactivateContact(contact, character);
      if (!reactivateCheck.allowed) {
        return NextResponse.json(
          { success: false, error: reactivateCheck.reason },
          { status: 400 }
        );
      }

      karmaCost = reactivateCheck.karmaCost;

      // Deduct karma
      const updatedCharacter = {
        ...character,
        karmaCurrent: character.karmaCurrent - karmaCost,
      };
      await saveCharacter(updatedCharacter);

      // Reactivate the contact
      updatedContact = await reactivateContact(userId, characterId, contactId);

      // Record transaction
      transaction = await addFavorTransaction(userId, characterId, {
        contactId,
        type: "contact_reactivated",
        favorChange: 0,
        karmaSpent: karmaCost,
        description: `Contact reactivated: ${reason || "Relationship mended"}`,
      });
    } else {
      // mark-missing or mark-deceased
      updatedContact = await updateCharacterContact(userId, characterId, contactId, {
        status: targetStatus,
      });

      // Record transaction
      transaction = await addFavorTransaction(userId, characterId, {
        contactId,
        type: "status_change",
        favorChange: 0,
        description: `Contact marked as ${targetStatus}: ${reason || "No details provided"}`,
      });
    }

    return NextResponse.json({
      success: true,
      contact: updatedContact,
      transaction,
      karmaCost,
    });
  } catch (error) {
    console.error("Failed to transition contact state:", error);
    return NextResponse.json(
      { success: false, error: "Failed to transition contact state" },
      { status: 500 }
    );
  }
}
