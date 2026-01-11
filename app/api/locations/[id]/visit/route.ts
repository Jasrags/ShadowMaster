import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getLocation, recordLocationVisit } from "@/lib/storage/locations";
import type { RecordVisitRequest, LocationResponse } from "@/lib/types";

/**
 * POST /api/locations/[id]/visit - Record a location visit
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<LocationResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: locationId } = await params;

    // Find location and verify access
    const { getCampaignsByUserId } = await import("@/lib/storage/campaigns");
    const userCampaigns = await getCampaignsByUserId(userId);

    let foundLocation = null;
    let foundCampaign = null;

    for (const campaign of userCampaigns) {
      const location = await getLocation(campaign.id, locationId);
      if (location) {
        foundLocation = location;
        foundCampaign = campaign;
        break;
      }
    }

    if (!foundLocation || !foundCampaign) {
      return NextResponse.json({ success: false, error: "Location not found" }, { status: 404 });
    }

    const isGM = foundCampaign.gmId === userId;

    // If location is GM-only and user is not GM, deny access
    if (foundLocation.visibility === "gm-only" && !isGM) {
      return NextResponse.json({ success: false, error: "Location not found" }, { status: 404 });
    }

    const body: RecordVisitRequest = await request.json();

    // Validate request
    if (!body.characterId) {
      return NextResponse.json(
        { success: false, error: "Character ID is required" },
        { status: 400 }
      );
    }

    const updatedLocation = await recordLocationVisit(
      foundCampaign.id,
      locationId,
      body.characterId,
      body.sessionId
    );

    // Strip GM-only content for players
    let responseLocation = updatedLocation;
    if (!isGM) {
      responseLocation = {
        ...updatedLocation,
        gmNotes: undefined,
        gmOnlyContent: undefined,
      };
    }

    return NextResponse.json({
      success: true,
      location: responseLocation,
    });
  } catch (error) {
    console.error("Record visit error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
