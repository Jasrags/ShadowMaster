import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignById } from "@/lib/storage/campaigns";
import {
    getLocationsByCampaign,
    createLocation,
} from "@/lib/storage/locations";
import type {
    CreateLocationRequest,
    LocationsListResponse,
    LocationResponse,
    LocationType,
    LocationVisibility,
} from "@/lib/types";

/**
 * GET /api/campaigns/[id]/locations - List all locations for a campaign
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<LocationsListResponse>> {
    try {
        const userId = await getSession();
        if (!userId) {
            return NextResponse.json(
                { success: false, locations: [], error: "Authentication required" },
                { status: 401 }
            );
        }

        const { id: campaignId } = await params;

        // Verify campaign exists and user has access
        const campaign = await getCampaignById(campaignId);
        if (!campaign) {
            return NextResponse.json(
                { success: false, locations: [], error: "Campaign not found" },
                { status: 404 }
            );
        }

        const isGM = campaign.gmId === userId;
        const isPlayer = campaign.playerIds.includes(userId);

        if (!isGM && !isPlayer) {
            return NextResponse.json(
                { success: false, locations: [], error: "Access denied" },
                { status: 403 }
            );
        }

        // Get query parameters for filtering
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get("type") as LocationType | null;
        const visibility = searchParams.get("visibility") as LocationVisibility | null;
        const tags = searchParams.get("tags")?.split(",").filter(Boolean);
        const search = searchParams.get("search");
        const parentId = searchParams.get("parentId");

        // Get locations with filters
        let locations = await getLocationsByCampaign(campaignId, {
            type: type || undefined,
            visibility: visibility || undefined,
            tags,
            search: search || undefined,
            parentId: parentId || undefined,
        });

        // Filter out GM-only locations for players
        if (!isGM) {
            locations = locations.filter((l) => l.visibility !== "gm-only");
            // Also strip GM-only content from locations
            locations = locations.map((l) => ({
                ...l,
                gmNotes: undefined,
                gmOnlyContent: undefined,
            }));
        }

        return NextResponse.json({
            success: true,
            locations,
        });
    } catch (error) {
        console.error("Get locations error:", error);
        return NextResponse.json(
            { success: false, locations: [], error: "An error occurred" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/campaigns/[id]/locations - Create a new location
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

        const { id: campaignId } = await params;

        // Verify campaign exists and user is GM
        const campaign = await getCampaignById(campaignId);
        if (!campaign) {
            return NextResponse.json(
                { success: false, error: "Campaign not found" },
                { status: 404 }
            );
        }

        if (campaign.gmId !== userId) {
            return NextResponse.json(
                { success: false, error: "Only the GM can create locations" },
                { status: 403 }
            );
        }

        const body: CreateLocationRequest = await request.json();

        // Validation
        if (!body.name || body.name.length < 1 || body.name.length > 200) {
            return NextResponse.json(
                { success: false, error: "Name must be between 1 and 200 characters" },
                { status: 400 }
            );
        }

        if (!body.type) {
            return NextResponse.json(
                { success: false, error: "Location type is required" },
                { status: 400 }
            );
        }

        if (!body.visibility) {
            return NextResponse.json(
                { success: false, error: "Visibility is required" },
                { status: 400 }
            );
        }

        // Validate security rating if provided
        if (
            body.securityRating !== undefined &&
            (body.securityRating < 1 || body.securityRating > 10)
        ) {
            return NextResponse.json(
                { success: false, error: "Security rating must be between 1 and 10" },
                { status: 400 }
            );
        }

        // Validate coordinates if provided
        if (body.coordinates) {
            if (
                body.coordinates.latitude < -90 ||
                body.coordinates.latitude > 90 ||
                body.coordinates.longitude < -180 ||
                body.coordinates.longitude > 180
            ) {
                return NextResponse.json(
                    { success: false, error: "Invalid coordinates" },
                    { status: 400 }
                );
            }
        }

        // Create location
        const location = await createLocation(campaignId, body);

        // Log activity and notify players asynchronously
        try {
            const { logActivity } = await import("@/lib/storage/activity");
            const { createNotification } = await import("@/lib/storage/notifications");
            
            // Only log if visible to players
            if (location.visibility !== "gm-only") {
                await logActivity({
                    campaignId,
                    type: "location_added",
                    actorId: userId,
                    targetId: location.id,
                    targetType: "location",
                    targetName: location.name,
                    description: `New location added: "${location.name}".`,
                });
                
                // Notify players
                for (const playerId of campaign.playerIds) {
                    await createNotification({
                        userId: playerId,
                        campaignId: campaignId,
                        type: "mentioned", // Placeholder for location highlight
                        title: "New Location Discovered",
                        message: `A new location "${location.name}" has been added to the campaign.`,
                        actionUrl: `/campaigns/${campaignId}?tab=locations`,
                    });
                }
            }
        } catch (activityError) {
            console.error("Failed to log location activity:", activityError);
        }

        return NextResponse.json({
            success: true,
            location,
        });
    } catch (error) {
        console.error("Create location error:", error);
        const errorMessage =
            error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
