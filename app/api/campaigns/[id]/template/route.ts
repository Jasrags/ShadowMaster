import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeGM } from "@/lib/auth/campaign";
import { saveCampaignAsTemplate } from "@/lib/storage/campaigns";

/**
 * POST /api/campaigns/[id]/template - Save campaign as template
 */
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

    const { id } = await params;
    const auth = await authorizeGM(id, userId);
    if (!auth.authorized || !auth.campaign) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.length < 3) {
      return NextResponse.json(
        { success: false, error: "Template name must be at least 3 characters" },
        { status: 400 }
      );
    }

    const template = await saveCampaignAsTemplate(id, name, userId);

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Save template error:", error);
    return NextResponse.json({ success: false, error: "An error occurred" }, { status: 500 });
  }
}
