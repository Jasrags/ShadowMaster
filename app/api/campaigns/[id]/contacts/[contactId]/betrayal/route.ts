/**
 * API Route: /api/campaigns/[id]/contacts/[contactId]/betrayal
 *
 * PATCH - Set or clear betrayal planning state (GM only)
 * GET   - Get betrayal planning state (GM only)
 *
 * This endpoint manages the GM-only betrayal planning state for Johnson contacts.
 * All operations require GM authorization. Betrayal planning data is never
 * exposed to non-GM users (filtered at the contacts list endpoint level).
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeGM } from "@/lib/auth/campaign";
import { getCampaignContact, updateCampaignContactBetrayalPlanning } from "@/lib/storage/contacts";
import type { BetrayalPlanningState } from "@/lib/types";

interface RouteParams {
  params: Promise<{ id: string; contactId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    return NextResponse.json({
      success: true,
      betrayalPlanning: contact.betrayalPlanning ?? null,
      contactId: contact.id,
      contactName: contact.name,
    });
  } catch (error) {
    console.error("Failed to get betrayal planning:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get betrayal planning" },
      { status: 500 }
    );
  }
}

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

    const body = await request.json();

    // Clear betrayal planning
    if (body.action === "clear") {
      const updatedContact = await updateCampaignContactBetrayalPlanning(
        campaignId,
        contactId,
        null
      );
      return NextResponse.json({ success: true, contact: updatedContact });
    }

    // Set betrayal planning
    if (body.action === "set") {
      if (!body.betrayalTypeId || typeof body.betrayalTypeId !== "string") {
        return NextResponse.json(
          { success: false, error: "betrayalTypeId is required" },
          { status: 400 }
        );
      }

      const planning: BetrayalPlanningState = {
        betrayalTypeId: body.betrayalTypeId,
        revealedSignals: Array.isArray(body.revealedSignals) ? body.revealedSignals : [],
        gmNotes: typeof body.gmNotes === "string" ? body.gmNotes : undefined,
        markedAt: new Date().toISOString(),
      };

      const updatedContact = await updateCampaignContactBetrayalPlanning(
        campaignId,
        contactId,
        planning
      );
      return NextResponse.json({ success: true, contact: updatedContact });
    }

    // Update revealed signals on existing planning
    if (body.action === "reveal-signal") {
      if (!contact.betrayalPlanning) {
        return NextResponse.json(
          { success: false, error: "No active betrayal planning to update" },
          { status: 400 }
        );
      }

      if (typeof body.signal !== "string") {
        return NextResponse.json({ success: false, error: "signal is required" }, { status: 400 });
      }

      const revealed = contact.betrayalPlanning.revealedSignals.includes(body.signal)
        ? contact.betrayalPlanning.revealedSignals
        : [...contact.betrayalPlanning.revealedSignals, body.signal];

      const planning: BetrayalPlanningState = {
        ...contact.betrayalPlanning,
        revealedSignals: revealed,
      };

      const updatedContact = await updateCampaignContactBetrayalPlanning(
        campaignId,
        contactId,
        planning
      );
      return NextResponse.json({ success: true, contact: updatedContact });
    }

    // Hide a previously revealed signal
    if (body.action === "hide-signal") {
      if (!contact.betrayalPlanning) {
        return NextResponse.json(
          { success: false, error: "No active betrayal planning to update" },
          { status: 400 }
        );
      }

      if (typeof body.signal !== "string") {
        return NextResponse.json({ success: false, error: "signal is required" }, { status: 400 });
      }

      const planning: BetrayalPlanningState = {
        ...contact.betrayalPlanning,
        revealedSignals: contact.betrayalPlanning.revealedSignals.filter((s) => s !== body.signal),
      };

      const updatedContact = await updateCampaignContactBetrayalPlanning(
        campaignId,
        contactId,
        planning
      );
      return NextResponse.json({ success: true, contact: updatedContact });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action. Use: set, clear, reveal-signal, hide-signal" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to update betrayal planning:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update betrayal planning" },
      { status: 500 }
    );
  }
}
