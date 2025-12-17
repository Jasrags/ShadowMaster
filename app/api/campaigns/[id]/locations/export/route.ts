import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { exportLocations } from "@/lib/storage/locations";
import { getCampaignById } from "@/lib/storage/campaigns";

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
        const campaign = await getCampaignById(campaignId);

        if (!campaign) {
            return NextResponse.json(
                { success: false, error: "Campaign not found" },
                { status: 404 }
            );
        }

        // Only GM or players can export? Let's say anyone in campaign can export for now,
        // but typically GM. Let's start with GM only to be safe, or check membership.
        // For now, let's limit to members.
        const isGm = campaign.gmId === userId;
        const isPlayer = campaign.playerIds.includes(userId);

        if (!isGm && !isPlayer) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            );
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
