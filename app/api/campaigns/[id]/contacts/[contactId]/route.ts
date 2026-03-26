/**
 * API Route: /api/campaigns/[id]/contacts/[contactId]
 *
 * PATCH - Update a campaign contact (GM only)
 *   Supports visibility toggle, loyalty overrides, and general field updates.
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeGM } from "@/lib/auth/campaign";
import { getCampaignContact, updateCampaignContact } from "@/lib/storage/contacts";
import type { ContactStatus, UpdateContactRequest } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string; contactId: string }>;
}

const MAX_NAME_LEN = 200;
const MAX_DESCRIPTION_LEN = 2000;
const MAX_GM_NOTES_LEN = 2000;
const MAX_LOYALTY = 6;
const MAX_CONNECTION = 12;
const VALID_STATUSES: readonly ContactStatus[] = [
  "active",
  "burned",
  "inactive",
  "missing",
  "deceased",
];

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: campaignId, contactId } = await params;

    const auth = await authorizeGM(campaignId, userId);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const contact = await getCampaignContact(campaignId, contactId);
    if (!contact) {
      return NextResponse.json({ success: false, error: "Contact not found" }, { status: 404 });
    }

    const body = (await request.json()) as UpdateContactRequest;

    // Validate string lengths
    if (body.name !== undefined && body.name.length > MAX_NAME_LEN) {
      return NextResponse.json(
        { success: false, error: `Name must be ${MAX_NAME_LEN} characters or less` },
        { status: 400 }
      );
    }
    if (body.description !== undefined && body.description.length > MAX_DESCRIPTION_LEN) {
      return NextResponse.json(
        { success: false, error: `Description must be ${MAX_DESCRIPTION_LEN} characters or less` },
        { status: 400 }
      );
    }
    if (body.gmNotes !== undefined && body.gmNotes.length > MAX_GM_NOTES_LEN) {
      return NextResponse.json(
        { success: false, error: `GM notes must be ${MAX_GM_NOTES_LEN} characters or less` },
        { status: 400 }
      );
    }

    // Validate numeric ranges
    if (body.loyalty !== undefined && (body.loyalty < 1 || body.loyalty > MAX_LOYALTY)) {
      return NextResponse.json(
        { success: false, error: `Loyalty must be between 1 and ${MAX_LOYALTY}` },
        { status: 400 }
      );
    }
    if (
      body.connection !== undefined &&
      (body.connection < 1 || body.connection > MAX_CONNECTION)
    ) {
      return NextResponse.json(
        { success: false, error: `Connection must be between 1 and ${MAX_CONNECTION}` },
        { status: 400 }
      );
    }

    // Validate status enum
    if (body.status !== undefined && !(VALID_STATUSES as readonly string[]).includes(body.status)) {
      return NextResponse.json({ success: false, error: "Invalid status value" }, { status: 400 });
    }

    // Validate favor balance
    if (body.favorBalance !== undefined && !Number.isFinite(body.favorBalance)) {
      return NextResponse.json({ success: false, error: "Invalid favor balance" }, { status: 400 });
    }

    // Validate loyalty overrides
    if (body.loyaltyOverrides !== undefined) {
      for (const [charId, value] of Object.entries(body.loyaltyOverrides)) {
        if (typeof charId !== "string" || charId.length === 0) {
          return NextResponse.json(
            { success: false, error: "Invalid character ID in loyalty overrides" },
            { status: 400 }
          );
        }
        if (typeof value !== "number" || value < 1 || value > MAX_LOYALTY) {
          return NextResponse.json(
            {
              success: false,
              error: `Loyalty override for ${charId} must be between 1 and ${MAX_LOYALTY}`,
            },
            { status: 400 }
          );
        }
      }
    }

    const updatedContact = await updateCampaignContact(campaignId, contactId, body);

    return NextResponse.json({ success: true, contact: updatedContact });
  } catch (error) {
    console.error("Failed to update campaign contact:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update campaign contact" },
      { status: 500 }
    );
  }
}
