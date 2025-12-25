import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { getAllUserAuditEntries } from "@/lib/storage/user-audit";
import type { UserAuditAction, UserAuditEntry } from "@/lib/types/audit";

interface SystemAuditLogResponse {
  success: boolean;
  entries?: UserAuditEntry[];
  total?: number;
  error?: string;
}

/**
 * GET /api/audit/users
 * Get system-wide user audit log (admin only)
 *
 * Query parameters:
 * - limit: number (default 50)
 * - offset: number (default 0)
 * - order: "asc" | "desc" (default "desc")
 * - action: UserAuditAction (filter by specific action)
 * - actorId: string (filter by actor)
 * - targetUserId: string (filter by target user)
 * - fromDate: ISO date string (filter from date)
 * - toDate: ISO date string (filter to date)
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<SystemAuditLogResponse>> {
  try {
    // Require administrator role
    await requireAdmin();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const order = (searchParams.get("order") || "desc") as "asc" | "desc";
    const action = searchParams.get("action") as UserAuditAction | null;
    const actorId = searchParams.get("actorId");
    const targetUserId = searchParams.get("targetUserId");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    // Build query options
    const options = {
      limit,
      offset,
      order,
      ...(action && { actions: [action] }),
      ...(actorId && { actorId }),
      ...(targetUserId && { targetUserId }),
      ...(fromDate && { fromDate }),
      ...(toDate && { toDate }),
    };

    // Get audit entries
    const { entries, total } = await getAllUserAuditEntries(options);

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

    console.error("Get system audit log error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while fetching audit log" },
      { status: 500 }
    );
  }
}
