import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCampaignTemplates } from "@/lib/storage/campaigns";

/**
 * GET /api/campaigns/templates - List available campaign templates
 */
export async function GET(): Promise<NextResponse> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const templates = await getCampaignTemplates(userId);

    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("List templates error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
