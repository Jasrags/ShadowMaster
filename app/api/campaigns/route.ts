import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignsByUserId, createCampaign } from "@/lib/storage/campaigns";
import type { CreateCampaignRequest, CampaignsListResponse, CampaignResponse } from "@/lib/types";
import { apiLogger } from "@/lib/logging";

/**
 * GET /api/campaigns - List all campaigns the user is involved in
 */
export async function GET(request: NextRequest): Promise<NextResponse<CampaignsListResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, campaigns: [], error: "Authentication required" },
        { status: 401 }
      );
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status");
    const role = searchParams.get("role");

    // Get campaigns where user is GM or player
    let campaigns = await getCampaignsByUserId(userId);

    // Filter by status if provided
    if (status && status !== "all") {
      campaigns = campaigns.filter((c) => c.status === status);
    }

    // Filter by role if provided
    if (role === "gm") {
      campaigns = campaigns.filter((c) => c.gmId === userId);
    } else if (role === "player") {
      campaigns = campaigns.filter((c) => c.playerIds.includes(userId));
    }

    return NextResponse.json({
      success: true,
      campaigns,
    });
  } catch (error) {
    console.error("Get campaigns error:", error);
    return NextResponse.json(
      { success: false, campaigns: [], error: "An error occurred" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/campaigns - Create a new campaign
 */
export async function POST(request: NextRequest): Promise<NextResponse<CampaignResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body: CreateCampaignRequest = await request.json();

    // Validation
    if (!body.title || body.title.length < 3 || body.title.length > 100) {
      return NextResponse.json(
        { success: false, error: "Title must be between 3 and 100 characters" },
        { status: 400 }
      );
    }

    if (!body.editionCode) {
      return NextResponse.json(
        { success: false, error: "Edition code is required" },
        { status: 400 }
      );
    }

    if (!body.enabledBookIds || body.enabledBookIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one book must be enabled" },
        { status: 400 }
      );
    }

    if (!body.enabledCreationMethodIds || body.enabledCreationMethodIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "At least one creation method must be enabled" },
        { status: 400 }
      );
    }

    if (!body.gameplayLevel) {
      return NextResponse.json(
        { success: false, error: "Gameplay level is required" },
        { status: 400 }
      );
    }

    if (!body.visibility) {
      return NextResponse.json(
        { success: false, error: "Visibility is required" },
        { status: 400 }
      );
    }

    // Create campaign - user becomes GM
    const campaign = await createCampaign(userId, body);

    return NextResponse.json({
      success: true,
      campaign,
      userRole: "gm",
    });
  } catch (error) {
    apiLogger.error({ error }, "Create campaign error");
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
