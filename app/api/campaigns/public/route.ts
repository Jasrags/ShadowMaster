import { NextRequest, NextResponse } from "next/server";
import { searchCampaigns } from "@/lib/storage/campaigns";
import type { Campaign } from "@/lib/types";

export const dynamic = 'force-dynamic'; // Ensure this route is always dynamic for fresh search results

/**
 * GET /api/campaigns/public
 * Search for public campaigns
 * 
 * Query Params:
 * - q: Search query (title/description)
 * - edition: Edition code
 * - level: Gameplay level
 * - tags: Comma separated tags
 */
export async function GET(request: NextRequest): Promise<NextResponse<{ success: boolean; campaigns: Campaign[]; error?: string }>> {
    try {
        const searchParams = request.nextUrl.searchParams;
        const q = searchParams.get("q") || undefined;
        const edition = searchParams.get("edition") || undefined;
        const level = searchParams.get("level") || undefined;
        const tagsParam = searchParams.get("tags");

        const tags = tagsParam ? tagsParam.split(",").filter(t => t.trim().length > 0) : undefined;

        const campaigns = await searchCampaigns({
            query: q,
            editionCode: edition,
            gameplayLevel: level,
            tags
        });

        return NextResponse.json({
            success: true,
            campaigns
        });

    } catch (error) {
        console.error("Search campaigns error:", error);
        return NextResponse.json(
            { success: false, campaigns: [], error: "Failed to search campaigns" },
            { status: 500 }
        );
    }
}
