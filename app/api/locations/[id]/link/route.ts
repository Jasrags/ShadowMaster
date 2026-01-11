import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  getLocation,
  linkContentToLocation,
  unlinkContentFromLocation,
} from "@/lib/storage/locations";
import type { LinkContentRequest, LocationResponse } from "@/lib/types";

/**
 * POST /api/locations/[id]/link - Link content to a location (GM-only)
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

    // Find location and verify GM access
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

    if (foundCampaign.gmId !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the GM can link content to locations" },
        { status: 403 }
      );
    }

    const body: LinkContentRequest = await request.json();

    // Validate request
    if (!body.type || !["npc", "grunt", "encounter", "session"].includes(body.type)) {
      return NextResponse.json({ success: false, error: "Invalid content type" }, { status: 400 });
    }

    if (!body.targetId) {
      return NextResponse.json({ success: false, error: "Target ID is required" }, { status: 400 });
    }

    const updatedLocation = await linkContentToLocation(
      foundCampaign.id,
      locationId,
      body.type,
      body.targetId,
      body.hidden
    );

    return NextResponse.json({
      success: true,
      location: updatedLocation,
    });
  } catch (error) {
    console.error("Link content error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

/**
 * DELETE /api/locations/[id]/link - Unlink content from a location (GM-only)
 */
export async function DELETE(
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

    // Find location and verify GM access
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

    if (foundCampaign.gmId !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the GM can unlink content from locations" },
        { status: 403 }
      );
    }

    const body: LinkContentRequest = await request.json();

    // Validate request
    if (!body.type || !["npc", "grunt", "encounter", "session"].includes(body.type)) {
      return NextResponse.json({ success: false, error: "Invalid content type" }, { status: 400 });
    }

    if (!body.targetId) {
      return NextResponse.json({ success: false, error: "Target ID is required" }, { status: 400 });
    }

    const updatedLocation = await unlinkContentFromLocation(
      foundCampaign.id,
      locationId,
      body.type,
      body.targetId,
      body.hidden
    );

    return NextResponse.json({
      success: true,
      location: updatedLocation,
    });
  } catch (error) {
    console.error("Unlink content error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
