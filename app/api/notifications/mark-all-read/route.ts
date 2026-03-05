import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { markAllRead } from "@/lib/storage/notifications";

/**
 * POST /api/notifications/mark-all-read - Mark all notifications as read
 */
export async function POST(request: NextRequest) {
  try {
    const userId = await getSession();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const campaignId = body.campaignId;

    const count = await markAllRead(userId, campaignId);

    return NextResponse.json({
      success: true,
      updatedCount: count,
    });
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
