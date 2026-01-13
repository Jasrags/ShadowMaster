import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { importLocations } from "@/lib/storage/locations";
import { getCampaignById } from "@/lib/storage/campaigns";
import type { Location } from "@/lib/types";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: campaignId } = await params;
    const campaign = await getCampaignById(campaignId);

    if (!campaign) {
      return NextResponse.json({ success: false, error: "Campaign not found" }, { status: 404 });
    }

    // Only GM can import
    if (campaign.gmId !== userId) {
      return NextResponse.json(
        { success: false, error: "Only the GM can import locations" },
        { status: 403 }
      );
    }

    const body = await request.json();
    if (!Array.isArray(body.locations)) {
      return NextResponse.json(
        { success: false, error: "Invalid data format. Expected { locations: Location[] }" },
        { status: 400 }
      );
    }

    const locations = await importLocations(campaignId, body.locations as Location[]);

    return NextResponse.json({
      success: true,
      count: locations.length,
    });
  } catch (error) {
    console.error("Import locations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to import locations" },
      { status: 500 }
    );
  }
}
