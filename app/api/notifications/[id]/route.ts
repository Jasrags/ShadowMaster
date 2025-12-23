import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { updateNotification } from "@/lib/storage/notifications";

/**
 * PATCH /api/notifications/[id] - Update individual notification (read/dismiss)
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: notificationId } = await params;
        const userId = await getSession();

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();
        const { read, dismissed } = body;

        const updated = await updateNotification(userId, notificationId, {
            read,
            dismissed
        });

        if (!updated) {
            return NextResponse.json({ error: "Notification not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            notification: updated
        });
    } catch (error) {
        console.error("Error updating notification:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
