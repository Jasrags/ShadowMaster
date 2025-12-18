
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
    getLocation,
    createLocationTemplate,
} from "@/lib/storage/locations";
import type { LocationTemplate } from "@/lib/types";

/**
 * POST /api/locations/[id]/create-template - Create a template from an existing location
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ success: boolean; template?: LocationTemplate; error?: string }>> {
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
            return NextResponse.json(
                { success: false, error: "Location not found" },
                { status: 404 }
            );
        }

        if (foundCampaign.gmId !== userId) {
            return NextResponse.json(
                { success: false, error: "Only the GM can create templates from locations" },
                { status: 403 }
            );
        }

        const body: { name: string; description?: string; isPublic: boolean } = await request.json();

        if (!body.name) {
            return NextResponse.json(
                { success: false, error: "Template name is required" },
                { status: 400 }
            );
        }

        // Extract template data, excluding ID-specific fields
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const {
            id,
            campaignId,
            createdAt,
            updatedAt,
            npcIds,
            gruntTeamIds,
            encounterIds,
            sessionIds,
            visitedByCharacterIds,
            visitCount,
            firstVisitedAt,
            lastVisitedAt,
            parentLocationId,
            childLocationIds,
            relatedLocationIds,
            ...templateData
        } = foundLocation;
        /* eslint-enable @typescript-eslint/no-unused-vars */

        const template = await createLocationTemplate(userId, {
            name: body.name,
            description: body.description || templateData.description,
            type: templateData.type,
            templateData,
            tags: templateData.tags,
            isPublic: body.isPublic
        });

        return NextResponse.json({
            success: true,
            template,
        });

    } catch (error) {
        console.error("Create template from location error:", error);
        const errorMessage =
            error instanceof Error ? error.message : "An error occurred";
        return NextResponse.json(
            { success: false, error: errorMessage },
            { status: 500 }
        );
    }
}
