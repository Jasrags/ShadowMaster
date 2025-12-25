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
import { getUserById } from "@/lib/storage/users";
import { getCampaignById } from "@/lib/storage/campaigns";
import {
  getCampaignContacts,
  createCampaignContact,
} from "@/lib/storage/contacts";
import { validateContact } from "@/lib/rules/contacts";
import type { CreateContactRequest, ContactStatus, SocialContact } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: campaignId } = await params;

    // Get campaign
    const campaign = await getCampaignById(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Check if user is a member of the campaign
    const isMember =
      campaign.gmId === userId ||
      campaign.playerIds.includes(userId);

    if (!isMember) {
      return NextResponse.json(
        { success: false, error: "Not a member of this campaign" },
        { status: 403 }
      );
    }

    const isGm = campaign.gmId === userId;

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const archetype = searchParams.get("archetype");
    const location = searchParams.get("location");
    const status = searchParams.get("status") as ContactStatus | null;

    // Get campaign contacts
    let contacts = await getCampaignContacts(campaignId);

    // Filter by visibility (non-GMs only see player-visible contacts)
    if (!isGm) {
      contacts = contacts.filter((c) => c.visibility.playerVisible);
    }

    // Apply filters
    if (archetype) {
      contacts = contacts.filter(
        (c) => c.archetype.toLowerCase() === archetype.toLowerCase()
      );
    }

    if (location) {
      contacts = contacts.filter(
        (c) => c.location?.toLowerCase() === location.toLowerCase()
      );
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
        };
        return visibleContact;
      });
    }

    return NextResponse.json({
      success: true,
      contacts: displayContacts,
      count: displayContacts.length,
      isGm,
    });
  } catch (error) {
    console.error("Failed to get campaign contacts:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get campaign contacts" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
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

    const { id: campaignId } = await params;

    // Get campaign
    const campaign = await getCampaignById(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { success: false, error: "Campaign not found" },
        { status: 404 }
      );
    }

    // Only GM can create campaign contacts
    if (campaign.gmId !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the GM can create campaign contacts" },
        { status: 403 }
      );
    }

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
