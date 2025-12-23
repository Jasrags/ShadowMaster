import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getUserNotifications, markAllRead, getUnreadCount } from "@/lib/storage/notifications";

/**
 * GET /api/notifications - Get user notifications
 */
export async function GET(request: NextRequest) {
    try {
        const userId = await getSession();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await getUserById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Get query parameters for filtering and pagination
        const searchParams = request.nextUrl.searchParams;
        const campaignId = searchParams.get("campaignId") || undefined;
        const unreadOnly = searchParams.get("unreadOnly") === "true";
        const limit = parseInt(searchParams.get("limit") || "50");
        const offset = parseInt(searchParams.get("offset") || "0");

        const notifications = await getUserNotifications(user.id, {
            campaignId,
            unreadOnly,
            limit,
            offset
        });

        const unreadCount = await getUnreadCount(user.id, campaignId);

        return NextResponse.json({
            success: true,
            notifications,
            unreadCount,
        });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/notifications/mark-all-read - Mark all notifications as read
 */
export async function POST(request: NextRequest) {
    try {
        const userId = await getSession();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const campaignId = body.campaignId;

        const count = await markAllRead(userId, campaignId);

        return NextResponse.json({
            success: true,
            updatedCount: count
        });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
