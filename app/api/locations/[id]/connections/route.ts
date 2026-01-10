import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  getLocation,
  createLocationConnection,
  getLocationConnections,
  deleteLocationConnection,
} from "@/lib/storage/locations";
import type { LocationConnection } from "@/lib/types";

/**
 * GET /api/locations/[id]/connections - List connections for a location
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ success: boolean; connections: LocationConnection[]; error?: string }>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, connections: [], error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: locationId } = await params;

    // Verify user has access to the campaign this location belongs to
    const { getCampaignsByUserId } = await import("@/lib/storage/campaigns");
    const userCampaigns = await getCampaignsByUserId(userId);

    let campaignId = "";
    for (const campaign of userCampaigns) {
      const loc = await getLocation(campaign.id, locationId);
      if (loc) {
        campaignId = campaign.id;
        break;
      }
    }

    if (!campaignId) {
      return NextResponse.json(
        { success: false, connections: [], error: "Location not found or access denied" },
        { status: 404 }
      );
    }

    const connections = await getLocationConnections(campaignId, locationId);
    return NextResponse.json({ success: true, connections });
  } catch (error) {
    console.error("Get connections error:", error);
    return NextResponse.json(
      { success: false, connections: [], error: "An error occurred" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/locations/[id]/connections - Create a new location connection (GM-only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ success: boolean; connection?: LocationConnection; error?: string }>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: fromLocationId } = await params;
    const body = await request.json();
    const { toLocationId, connectionType, description, bidirectional, metadata } = body;

    if (!toLocationId || !connectionType) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify campaign and GM status
    const { getCampaignsByUserId } = await import("@/lib/storage/campaigns");
    const userCampaigns = await getCampaignsByUserId(userId);

    let campaignId = "";
    let isGM = false;
    for (const campaign of userCampaigns) {
      const loc = await getLocation(campaign.id, fromLocationId);
      if (loc) {
        campaignId = campaign.id;
        isGM = campaign.gmId === userId;
        break;
      }
    }

    if (!campaignId) {
      return NextResponse.json({ success: false, error: "Location not found" }, { status: 404 });
    }

    if (!isGM) {
      return NextResponse.json(
        { success: false, error: "Only the GM can create connections" },
        { status: 403 }
      );
    }

    // Verify target location exists in the same campaign
    const targetLoc = await getLocation(campaignId, toLocationId);
    if (!targetLoc) {
      return NextResponse.json(
        { success: false, error: "Target location not found in this campaign" },
        { status: 400 }
      );
    }

    const connection = await createLocationConnection(campaignId, {
      fromLocationId,
      toLocationId,
      connectionType,
      description,
      bidirectional: !!bidirectional,
      metadata,
    });

    // Log activity
    try {
      const { logActivity } = await import("@/lib/storage/activity");
      await logActivity({
        campaignId,
        type: "location_updated",
        actorId: userId,
        targetId: fromLocationId,
        targetType: "location",
        targetName: "Connection created",
        description: `Created ${connectionType} connection to ${targetLoc.name}.`,
      });
    } catch (e) {
      console.error("Failed to log connection activity", e);
    }

    return NextResponse.json({ success: true, connection });
  } catch (error) {
    console.error("Create connection error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}

/**
 * DELETE /api/locations/[id]/connections - NOT IDEAL PATH, but connections don't have their own top route yet
 * Better: DELETE /api/locations/[id]/connections?connectionId=...
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
    const url = new URL(request.url);
    const connectionId = url.searchParams.get("connectionId");

    if (!connectionId) {
      return NextResponse.json({ success: false, error: "Missing connectionId" }, { status: 400 });
    }

    // Verify campaign and GM status
    const { getCampaignsByUserId } = await import("@/lib/storage/campaigns");
    const userCampaigns = await getCampaignsByUserId(userId);

    let campaignId = "";
    let isGM = false;
    for (const campaign of userCampaigns) {
      const loc = await getLocation(campaign.id, locationId);
      if (loc) {
        campaignId = campaign.id;
        isGM = campaign.gmId === userId;
        break;
      }
    }

    if (!campaignId) {
      return NextResponse.json({ success: false, error: "Location not found" }, { status: 404 });
    }

    if (!isGM) {
      return NextResponse.json(
        { success: false, error: "Only the GM can delete connections" },
        { status: 403 }
      );
    }

    await deleteLocationConnection(campaignId, connectionId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete connection error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
