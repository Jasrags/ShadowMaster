import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, toPublicUser } from "@/lib/auth/middleware";
import { getUserById, suspendUser, reactivateUser } from "@/lib/storage/users";
import type { SuspendUserRequest, SuspendUserResponse } from "@/lib/types/user";

/**
 * POST /api/users/[id]/suspend
 * Suspend a user account (admin only)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<SuspendUserResponse>> {
  try {
    // Require administrator role and get admin user
    const adminUser = await requireAdmin();

    const { id } = await params;
    const body: SuspendUserRequest = await request.json();

    // Validate reason is provided
    if (!body.reason || body.reason.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Suspension reason is required" },
        { status: 400 }
      );
    }

    // Validate user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if already suspended
    if (existingUser.accountStatus === "suspended") {
      return NextResponse.json(
        { success: false, error: "User is already suspended" },
        { status: 400 }
      );
    }

    // Suspend the user (includes audit logging and session invalidation)
    const updatedUser = await suspendUser(id, adminUser.id, body.reason.trim());

    return NextResponse.json({
      success: true,
      user: toPublicUser(updatedUser),
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

    // Handle last-admin protection
    if (errorMessage.includes("last administrator")) {
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    console.error("Suspend user error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while suspending user" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]/suspend
 * Reactivate a suspended user account (admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<SuspendUserResponse>> {
  try {
    // Require administrator role and get admin user
    const adminUser = await requireAdmin();

    const { id } = await params;

    // Validate user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Check if not suspended
    if (existingUser.accountStatus === "active") {
      return NextResponse.json(
        { success: false, error: "User is already active" },
        { status: 400 }
      );
    }

    // Reactivate the user (includes audit logging)
    const updatedUser = await reactivateUser(id, adminUser.id);

    return NextResponse.json({
      success: true,
      user: toPublicUser(updatedUser),
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

    console.error("Reactivate user error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while reactivating user" },
      { status: 500 }
    );
  }
}
