/**
 * Campaign Combat Sessions API
 *
 * GET /api/campaigns/[id]/combat-sessions - List active combat sessions for a campaign
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeCampaign } from "@/lib/auth/campaign";
import { getActiveSessionsForCampaign } from "@/lib/storage/combat";
import type { CombatSessionsListResponse } from "@/lib/types";

/**
 * GET /api/campaigns/[id]/combat-sessions
 *
 * Returns active combat sessions for a campaign. GM only.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<CombatSessionsListResponse>> {
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

    const sessions = await getActiveSessionsForCampaign(campaignId);

    return NextResponse.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Get combat sessions error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
