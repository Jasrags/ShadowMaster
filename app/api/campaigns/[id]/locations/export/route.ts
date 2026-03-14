import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { exportLocations } from "@/lib/storage/locations";
import { authorizeCampaign } from "@/lib/auth/campaign";

export async function GET(
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
    const { authorized, error, status } = await authorizeCampaign(campaignId, userId, {
      requireGM: true,
    });

    if (!authorized) {
      return NextResponse.json({ success: false, error }, { status });
    }

    const locations = await exportLocations(campaignId);

    return NextResponse.json({
      success: true,
      locations,
    });
  } catch (error) {
    console.error("Export locations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to export locations" },
      { status: 500 }
    );
  }
}
