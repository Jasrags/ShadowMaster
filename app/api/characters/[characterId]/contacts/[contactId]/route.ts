/**
 * API Route: /api/characters/[characterId]/contacts/[contactId]
 *
 * GET - Get a specific contact with transaction history
 * PUT - Update a contact
 * DELETE - Remove a contact
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import {
  getCharacterContact,
  updateCharacterContact,
  removeCharacterContact,
} from "@/lib/storage/contacts";
import { getContactTransactions } from "@/lib/storage/favor-ledger";
import { validateContact } from "@/lib/rules/contacts";
import type { UpdateContactRequest } from "@/lib/types";

export async function GET(
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

    // Get character to verify ownership
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

    // Get transaction history
    const transactions = await getContactTransactions(userId, characterId, contactId);

    return NextResponse.json({
      success: true,
      contact,
      transactions,
    });
  } catch (error) {
    console.error("Failed to get contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get contact" },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Get existing contact
    const existingContact = await getCharacterContact(userId, characterId, contactId);
    if (!existingContact) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 }
      );
    }

    // Parse body
    const body = (await request.json()) as UpdateContactRequest;

    // Validate updated contact
    const updatedData = {
      ...existingContact,
      ...body,
    };

    const validationResult = validateContact(updatedData, character.editionCode);
    if (!validationResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid contact update",
          errors: validationResult.errors,
        },
        { status: 400 }
      );
    }

    // Update contact
    const contact = await updateCharacterContact(userId, characterId, contactId, body);

    return NextResponse.json({
      success: true,
      contact,
      warnings: validationResult.warnings,
    });
  } catch (error) {
    console.error("Failed to update contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update contact" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Get contact to verify it exists
    const contact = await getCharacterContact(userId, characterId, contactId);
    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 }
      );
    }

    // Delete contact
    const success = await removeCharacterContact(userId, characterId, contactId);

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Failed to delete contact" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Contact deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete contact" },
      { status: 500 }
    );
  }
}
