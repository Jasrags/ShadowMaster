/**
 * API Route: /api/characters/[characterId]
 *
 * GET - Get a specific character
 * PATCH - Update a character (draft only, status changes not allowed)
 * DELETE - Delete a character
 *
 * Uses authorization module for permission checks.
 * Status changes must go through dedicated endpoints (finalize, retire, etc.)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacter, deleteCharacter } from "@/lib/storage/characters";
import { authorizeOwnerAccess, type CharacterPermission } from "@/lib/auth/character-authorization";
import { createAuditEntry, appendAuditEntry } from "@/lib/rules/character/state-machine";

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

    const { characterId } = await params;

    // Authorize view access
    const authResult = await authorizeOwnerAccess(userId, userId, characterId, "view");

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    return NextResponse.json({
      success: true,
      character: authResult.character,
    });
  } catch (error) {
    console.error("Failed to get character:", error);
    return NextResponse.json({ success: false, error: "Failed to get character" }, { status: 500 });
  }
}

export async function PATCH(
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

    // Authorize edit access
    const authResult = await authorizeOwnerAccess(userId, userId, characterId, "edit");

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const existing = authResult.character!;

    // Parse body
    const updates = await request.json();

    // Prevent changing protected fields
    delete updates.id;
    delete updates.ownerId;
    delete updates.createdAt;
    delete updates.auditLog; // Audit log is append-only

    // CRITICAL: Prevent direct status changes via PATCH
    // Status changes must go through state machine (finalize, retire, etc.)
    if (updates.status && updates.status !== existing.status) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Status changes not allowed via PATCH. Use dedicated endpoints: /finalize, /retire, etc.",
        },
        { status: 400 }
      );
    }
    delete updates.status;

    // Validate creationState if present
    if (updates.metadata?.creationState) {
      const state = updates.metadata.creationState;

      // Ensure characterId matches
      if (state.characterId && state.characterId !== characterId) {
        return NextResponse.json(
          {
            success: false,
            error: "Validation failed: characterId mismatch in creationState",
          },
          { status: 400 }
        );
      }
    }

    // Track if this is a significant update that should be audited
    const shouldAudit = updates.name && updates.name !== existing.name;
    let characterToSave = { ...existing, ...updates };

    if (shouldAudit) {
      const auditEntry = createAuditEntry({
        action: "name_changed",
        actor: { userId, role: authResult.role },
        details: {
          previousName: existing.name,
          newName: updates.name,
        },
      });
      characterToSave = appendAuditEntry(characterToSave, auditEntry);
    }

    // Update character
    const character = await updateCharacter(userId, characterId, characterToSave);

    return NextResponse.json({
      success: true,
      character,
    });
  } catch (error) {
    console.error("Failed to update character:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update character" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Authorize delete access
    const authResult = await authorizeOwnerAccess(userId, userId, characterId, "delete");

    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    // Delete character
    await deleteCharacter(userId, characterId);

    return NextResponse.json({
      success: true,
      message: "Character deleted",
    });
  } catch (error) {
    console.error("Failed to delete character:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete character" },
      { status: 500 }
    );
  }
}
