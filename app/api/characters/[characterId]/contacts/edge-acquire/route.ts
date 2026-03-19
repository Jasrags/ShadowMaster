/**
 * API Route: /api/characters/[characterId]/contacts/edge-acquire
 *
 * POST - Acquire a new contact via "I Know a Guy" Edge spend (Run Faster p. 178)
 *
 * Cost = 2× desired Connection Rating in Edge points.
 * Contact starts at Loyalty 1 with pendingKarmaConfirmation flag.
 * Edge does not refresh until Karma is earned.
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, saveCharacter } from "@/lib/storage/characters";
import { addCharacterContact, updateCharacterContact } from "@/lib/storage/contacts";
import { addFavorTransaction } from "@/lib/storage/favor-ledger";
import {
  validateIKnowAGuy,
  createEdgeContactSpec,
  calculateConfirmationKarmaCost,
} from "@/lib/rules/i-know-a-guy";
import type { EdgeAcquireRequest, EdgeAcquireResponse } from "@/lib/types/contacts";

/** Maximum length for user-provided fields */
const MAX_NAME_LENGTH = 200;
const MAX_ARCHETYPE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 500;

/** Maximum Connection rating in SR5 */
const MAX_CONNECTION = 12;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<EdgeAcquireResponse>> {
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

    const body = (await request.json()) as EdgeAcquireRequest;

    // Validate required fields
    if (!body.name || typeof body.name !== "string") {
      return NextResponse.json(
        { success: false, error: "name is required and must be a string" },
        { status: 400 }
      );
    }

    if (!body.archetype || typeof body.archetype !== "string") {
      return NextResponse.json(
        { success: false, error: "archetype is required and must be a string" },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(body.connection) ||
      body.connection < 1 ||
      body.connection > MAX_CONNECTION
    ) {
      return NextResponse.json(
        { success: false, error: `connection must be between 1 and ${MAX_CONNECTION}` },
        { status: 400 }
      );
    }

    const name = body.name.slice(0, MAX_NAME_LENGTH);
    const archetype = body.archetype.slice(0, MAX_ARCHETYPE_LENGTH);
    const description =
      typeof body.description === "string"
        ? body.description.slice(0, MAX_DESCRIPTION_LENGTH)
        : undefined;

    // Get current Edge points
    const currentEdge = character.condition?.edgeCurrent ?? character.specialAttributes.edge;

    // Validate Edge sufficiency
    const validation = validateIKnowAGuy({
      currentEdge,
      desiredConnection: body.connection,
    });

    if (!validation.allowed) {
      return NextResponse.json({ success: false, error: validation.reason }, { status: 400 });
    }

    // Create contact spec
    const spec = createEdgeContactSpec({
      desiredConnection: body.connection,
      archetype,
      name,
      description,
    });

    // Create contact via storage layer
    const contact = await addCharacterContact(userId, characterId, {
      name: spec.name,
      connection: spec.connection,
      loyalty: spec.loyalty,
      archetype: spec.archetype,
      description: spec.description,
    });

    // Storage layer defaults acquisitionMethod to "creation" — update to "edge"
    // and set pendingKarmaConfirmation flag
    const updatedContact = await updateCharacterContact(userId, characterId, contact.id, {
      acquisitionMethod: "edge",
      pendingKarmaConfirmation: true,
    });

    // Deduct Edge and block refresh
    const newEdge = currentEdge - validation.edgeCost;
    const updatedCharacter = {
      ...character,
      condition: {
        ...character.condition,
        edgeCurrent: newEdge,
        edgeRefreshBlocked: true,
      },
    };
    await saveCharacter(updatedCharacter);

    // Record transaction
    await addFavorTransaction(userId, characterId, {
      contactId: contact.id,
      type: "contact_acquired",
      favorChange: 0,
      description: `Acquired contact "${name}" via I Know a Guy (Edge cost: ${validation.edgeCost})`,
    });

    const karmaCostToConfirm = calculateConfirmationKarmaCost(body.connection);

    return NextResponse.json({
      success: true,
      contact: updatedContact,
      edgeSpent: validation.edgeCost,
      edgeRemaining: newEdge,
      karmaCostToConfirm,
    });
  } catch (error) {
    console.error("Failed to acquire Edge contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to acquire Edge contact" },
      { status: 500 }
    );
  }
}
