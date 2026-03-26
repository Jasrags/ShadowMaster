/**
 * API Route: /api/campaigns/[id]/contacts
 *
 * GET - List campaign-level shared contacts
 * POST - Create a new campaign contact (GM only)
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeGM, authorizeMember } from "@/lib/auth/campaign";
import {
  getCampaignContacts,
  createCampaignContact,
  getCharacterContacts,
} from "@/lib/storage/contacts";
import { getUserCharacters } from "@/lib/storage/characters";
import { validateContact } from "@/lib/rules/contacts";
import type { CreateContactRequest, ContactStatus, SocialContact } from "@/lib/types";

const VALID_STATUSES: readonly ContactStatus[] = [
  "active",
  "burned",
  "inactive",
  "missing",
  "deceased",
];

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: campaignId } = await params;

    const auth = await authorizeMember(campaignId, userId);
    if (!auth.authorized || !auth.campaign) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const campaign = auth.campaign;

    const isGm = auth.role === "gm";

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const archetype = searchParams.get("archetype");
    const location = searchParams.get("location");
    const statusParam = searchParams.get("status");
    const status: ContactStatus | null =
      statusParam && (VALID_STATUSES as readonly string[]).includes(statusParam)
        ? (statusParam as ContactStatus)
        : null;
    const include = searchParams.get("include"); // "all" = merged view with character contacts

    // Get campaign contacts
    let contacts = await getCampaignContacts(campaignId);

    // Build character name map for owner labels (GM merged view)
    const characterNames: Record<string, string> = {};

    // If GM requests merged view, include character contacts from all campaign members
    if (isGm && include === "all") {
      const allMemberIds = [campaign.gmId, ...campaign.playerIds];
      const characterArrays = await Promise.all(
        allMemberIds.map((memberId) => getUserCharacters(memberId))
      );
      const campaignCharacters = characterArrays
        .flat()
        .filter((char) => char.campaignId === campaignId);

      // Build name map and collect character contacts
      for (const char of campaignCharacters) {
        characterNames[char.id] = char.name;
        const charContacts = await getCharacterContacts(char.ownerId, char.id);
        contacts = [...contacts, ...charContacts];
      }
    }

    // Filter by visibility (non-GMs only see player-visible contacts)
    if (!isGm) {
      contacts = contacts.filter((c) => c.visibility.playerVisible);
    }

    // Apply filters
    if (archetype) {
      contacts = contacts.filter((c) => c.archetype.toLowerCase() === archetype.toLowerCase());
    }

    if (location) {
      contacts = contacts.filter((c) => c.location?.toLowerCase() === location.toLowerCase());
    }

    if (status) {
      contacts = contacts.filter((c) => c.status === status);
    }

    // Hide GM-only information for non-GMs
    let displayContacts: (SocialContact | Partial<SocialContact>)[] = contacts;
    if (!isGm) {
      displayContacts = contacts.map((c) => {
        const visibleContact: Partial<SocialContact> = {
          ...c,
          // Hide connection if not visible
          connection: c.visibility.showConnection ? c.connection : undefined,
          // Hide favor balance if not visible
          favorBalance: c.visibility.showFavorBalance ? c.favorBalance : undefined,
          // Never show GM notes to players
          gmNotes: undefined,
          // Never show betrayal planning to players
          betrayalPlanning: undefined,
        };
        return visibleContact;
      });
    }

    return NextResponse.json({
      success: true,
      contacts: displayContacts,
      count: displayContacts.length,
      isGm,
      characterNames: isGm ? characterNames : undefined,
    });
  } catch (error) {
    console.error("Failed to get campaign contacts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get campaign contacts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: campaignId } = await params;

    const auth = await authorizeGM(campaignId, userId);
    if (!auth.authorized || !auth.campaign) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }
    const campaign = auth.campaign;

    // Parse body
    const body = (await request.json()) as CreateContactRequest;

    // Validate contact against edition rules
    const validationResult = validateContact(body, campaign.editionCode);
    if (!validationResult.valid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid contact",
          errors: validationResult.errors,
        },
        { status: 400 }
      );
    }

    // Check for duplicate contact name in campaign
    const existingContacts = await getCampaignContacts(campaignId);
    const duplicate = existingContacts.find(
      (c) => c.name.toLowerCase() === body.name.toLowerCase()
    );
    if (duplicate) {
      return NextResponse.json(
        { success: false, error: "A campaign contact with this name already exists" },
        { status: 400 }
      );
    }

    // Create campaign contact
    const contact = await createCampaignContact(campaignId, body);

    return NextResponse.json(
      {
        success: true,
        contact,
        warnings: validationResult.warnings,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create campaign contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create campaign contact" },
      { status: 500 }
    );
  }
}
