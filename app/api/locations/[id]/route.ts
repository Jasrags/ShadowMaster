import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getLocation, updateLocation, deleteLocation } from "@/lib/storage/locations";
import type {
  UpdateLocationRequest,
  LocationResponse,
  LocationDetailResponse,
  Location,
} from "@/lib/types";

/**
 * GET /api/locations/[id] - Get location details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<LocationDetailResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: locationId } = await params;

    // We need to find the location first to get the campaignId
    // Try to find in all campaigns the user has access to
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

    // Fetch related locations (children and explicitly related)
    const relatedIds = new Set([
      ...(foundLocation.childLocationIds || []),
      ...(foundLocation.relatedLocationIds || []),
    ]);

    const relatedLocations: Location[] = [];
    for (const id of relatedIds) {
      const relLoc = await getLocation(foundCampaign.id, id);
      if (relLoc) {
        // Filter visibility for related locations
        if (relLoc.visibility === "gm-only" && !isGM) continue;

        // Strip GM content
        if (!isGM) {
          relatedLocations.push({
            ...relLoc,
            gmNotes: undefined,
            gmOnlyContent: undefined,
          });
        } else {
          relatedLocations.push(relLoc);
        }
      }
    }

    // Strip GM-only content for players
    if (!isGM) {
      foundLocation = {
        ...foundLocation,
        gmNotes: undefined,
        gmOnlyContent: undefined,
      };
    }

    return NextResponse.json({
      success: true,
      location: foundLocation,
      relatedLocations,
    });
  } catch (error) {
    console.error("Get location error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}

/**
 * PUT /api/locations/[id] - Update a location (GM-only)
 */
export async function PUT(
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
        { success: false, error: "Only the GM can update locations" },
        { status: 403 }
      );
    }

    const body: UpdateLocationRequest = await request.json();

    // Validation
    if (body.name !== undefined && (body.name.length < 1 || body.name.length > 200)) {
      return NextResponse.json(
        { success: false, error: "Name must be between 1 and 200 characters" },
        { status: 400 }
      );
    }

    if (
      body.securityRating !== undefined &&
      (body.securityRating < 1 || body.securityRating > 10)
    ) {
      return NextResponse.json(
        { success: false, error: "Security rating must be between 1 and 10" },
        { status: 400 }
      );
    }

    if (body.astralProperties) {
      if (
        body.astralProperties.manaLevel &&
        !["low", "normal", "high", "very-high"].includes(body.astralProperties.manaLevel)
      ) {
        return NextResponse.json({ success: false, error: "Invalid mana level" }, { status: 400 });
      }
      if (
        body.astralProperties.backgroundCount !== undefined &&
        (body.astralProperties.backgroundCount < 0 || body.astralProperties.backgroundCount > 20)
      ) {
        return NextResponse.json(
          { success: false, error: "Background count must be between 0 and 20" },
          { status: 400 }
        );
      }
    }

    if (body.coordinates) {
      if (
        body.coordinates.latitude < -90 ||
        body.coordinates.latitude > 90 ||
        body.coordinates.longitude < -180 ||
        body.coordinates.longitude > 180
      ) {
        return NextResponse.json({ success: false, error: "Invalid coordinates" }, { status: 400 });
      }
    }

    const updatedLocation = await updateLocation(foundCampaign.id, locationId, body);

    // Log significant changes
    try {
      const { logActivity } = await import("@/lib/storage/activity");

      if (body.visibility && body.visibility !== foundLocation.visibility) {
        await logActivity({
          campaignId: foundCampaign.id,
          type: "location_updated",
          actorId: userId,
          targetId: locationId,
          targetType: "location",
          targetName: foundLocation.name,
          description: `Visibility changed from ${foundLocation.visibility} to ${body.visibility}.`,
        });
      } else if (
        body.securityRating !== undefined &&
        body.securityRating !== foundLocation.securityRating
      ) {
        await logActivity({
          campaignId: foundCampaign.id,
          type: "location_updated",
          actorId: userId,
          targetId: locationId,
          targetType: "location",
          targetName: foundLocation.name,
          description: `Security Rating changed from ${foundLocation.securityRating ?? "N/A"} to ${body.securityRating}.`,
        });
      }
    } catch (e) {
      console.error("Failed to log location update activity", e);
    }

    return NextResponse.json({
      success: true,
      location: updatedLocation,
    });
  } catch (error) {
    console.error("Update location error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}

/**
 * DELETE /api/locations/[id] - Delete a location (GM-only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ success: boolean; error?: string }>> {
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
        { success: false, error: "Only the GM can delete locations" },
        { status: 403 }
      );
    }

    await deleteLocation(foundCampaign.id, locationId);

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete location error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
