/**
 * API Route: /api/characters/[characterId]/contacts
 *
 * GET - List character's contacts with optional filters
 * POST - Create a new contact for the character
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import {
  getCharacterContacts,
  addCharacterContact,
} from "@/lib/storage/contacts";
import { getSocialCapital } from "@/lib/storage/social-capital";
import {
  validateContact,
  validateContactBudget,
  validateContactAgainstCampaign,
} from "@/lib/rules/contacts";
import type { CreateContactRequest, ContactStatus } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
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

    const { characterId } = await params;

    // Get character to verify ownership
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    // Parse query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const archetype = searchParams.get("archetype");
    const status = searchParams.get("status") as ContactStatus | null;
    const minConnection = searchParams.get("minConnection");
    const location = searchParams.get("location");

    // Get contacts
    let contacts = await getCharacterContacts(userId, characterId);

    // Apply filters
    if (archetype) {
      contacts = contacts.filter(
        (c) => c.archetype.toLowerCase() === archetype.toLowerCase()
      );
    }

    if (status) {
      contacts = contacts.filter((c) => c.status === status);
    }

    if (minConnection) {
      const minConn = parseInt(minConnection, 10);
      if (!isNaN(minConn)) {
        contacts = contacts.filter((c) => c.connection >= minConn);
      }
    }

    if (location) {
      contacts = contacts.filter(
        (c) => c.location?.toLowerCase() === location.toLowerCase()
      );
    }

    return NextResponse.json({
      success: true,
      contacts,
      count: contacts.length,
    });
  } catch (error) {
    console.error("Failed to get contacts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get contacts" },
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

    const { characterId } = await params;

    // Get character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    // Parse body
    const body = (await request.json()) as CreateContactRequest;

    // Validate contact against edition rules
    const validationResult = validateContact(body, character.editionCode);
    if (!validationResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid contact",
          errors: validationResult.errors,
          warnings: validationResult.warnings,
        },
        { status: 400 }
      );
    }

    // Get social capital for budget validation
    const socialCapital = await getSocialCapital(userId, characterId);

    // Validate budget
    const budgetResult = validateContactBudget(character, body, socialCapital);
    if (!budgetResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: budgetResult.reason || "Insufficient contact points",
          pointsRequired: budgetResult.pointsRequired,
          pointsAvailable: budgetResult.pointsAvailable,
        },
        { status: 400 }
      );
    }

    // Validate against campaign constraints (if applicable)
    if (socialCapital) {
      const campaignResult = validateContactAgainstCampaign(body, socialCapital);
      if (!campaignResult.valid) {
        return NextResponse.json(
          {
            success: false,
            error: "Contact violates campaign constraints",
            errors: campaignResult.errors,
          },
          { status: 400 }
        );
      }
    }

    // Check for duplicate contact name
    const existingContacts = await getCharacterContacts(userId, characterId);
    const duplicate = existingContacts.find(
      (c) => c.name.toLowerCase() === body.name.toLowerCase()
    );
    if (duplicate) {
      return NextResponse.json(
        { success: false, error: "A contact with this name already exists" },
        { status: 400 }
      );
    }

    // Create contact
    const contact = await addCharacterContact(userId, characterId, body);

    return NextResponse.json(
      {
        success: true,
        contact,
        warnings: validationResult.warnings,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create contact" },
      { status: 500 }
    );
  }
}
