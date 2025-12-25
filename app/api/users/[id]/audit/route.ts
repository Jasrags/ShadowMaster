import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { getUserById } from "@/lib/storage/users";
import { getUserAuditLog } from "@/lib/storage/user-audit";
import type { UserAuditLogResponse } from "@/lib/types/user";

/**
 * GET /api/users/[id]/audit
 * Get audit log for a specific user (admin only)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<UserAuditLogResponse>> {
  try {
    // Require administrator role
    await requireAdmin();

    const { id } = await params;

    // Get query parameters for pagination
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const order = (searchParams.get("order") || "desc") as "asc" | "desc";

    // Validate user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Get audit log
    const { entries, total } = await getUserAuditLog(id, { limit, offset, order });

    return NextResponse.json({
      success: true,
      entries,
      total,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";

    // Check if it's an authentication/authorization error
    if (errorMessage === "Authentication required" || errorMessage === "Administrator access required") {
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 403 }
      );
    }

    console.error("Get user audit log error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while fetching audit log" },
      { status: 500 }
    );
  }
}
