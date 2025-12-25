import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, toPublicUser } from "@/lib/auth/middleware";
import {
  getUserById,
  getAllUsers,
  deleteUser,
  updateUserRoles,
  updateUserEmail,
  updateUsername,
  isLastAdmin,
} from "@/lib/storage/users";
import { archiveUserAuditLog } from "@/lib/storage/user-audit";
import { isValidEmail, isValidUsername } from "@/lib/auth/validation";
import type { UpdateUserRequest, UpdateUserResponse, DeleteUserResponse, UserRole } from "@/lib/types/user";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<UpdateUserResponse>> {
  try {
    // Require administrator role and get admin user
    const adminUser = await requireAdmin();

    const { id } = await params;
    const body: UpdateUserRequest = await request.json();

    // Validate user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Validate email if provided
    if (body.email !== undefined) {
      if (!isValidEmail(body.email)) {
        return NextResponse.json(
          { success: false, error: "Invalid email format" },
          { status: 400 }
        );
      }
    }

    // Validate username if provided
    if (body.username !== undefined) {
      if (!isValidUsername(body.username)) {
        return NextResponse.json(
          { success: false, error: "Username must be between 3 and 50 characters" },
          { status: 400 }
        );
      }
    }

    // Validate role if provided
    if (body.role !== undefined) {
      const validRoles: UserRole[] = ["user", "administrator", "gamemaster"];

      // Validate all roles in the array
      if (!Array.isArray(body.role)) {
        return NextResponse.json(
          { success: false, error: "Role must be an array" },
          { status: 400 }
        );
      }

      if (body.role.length === 0) {
        return NextResponse.json(
          { success: false, error: "User must have at least one role" },
          { status: 400 }
        );
      }

      const invalidRoles = body.role.filter((role) => !validRoles.includes(role));
      if (invalidRoles.length > 0) {
        return NextResponse.json(
          { success: false, error: `Invalid role(s): ${invalidRoles.join(", ")}. Must be one of: user, administrator, gamemaster` },
          { status: 400 }
        );
      }

      // Check if trying to remove administrator role from last admin
      const hadAdmin = existingUser.role.includes("administrator");
      const willHaveAdmin = body.role.includes("administrator");

      if (hadAdmin && !willHaveAdmin) {
        const allUsers = await getAllUsers();
        const adminCount = allUsers.filter((u) => u.role.includes("administrator")).length;

        if (adminCount === 1) {
          return NextResponse.json(
            { success: false, error: "Cannot remove administrator role from the last administrator" },
            { status: 400 }
          );
        }
      }
    }

    // Apply updates using audit-aware functions
    let updatedUser = existingUser;

    // Update email if changed (with audit logging)
    if (body.email !== undefined && body.email !== existingUser.email) {
      updatedUser = await updateUserEmail(id, body.email, adminUser.id);
    }

    // Update username if changed (with audit logging)
    if (body.username !== undefined && body.username !== existingUser.username) {
      updatedUser = await updateUsername(id, body.username, adminUser.id);
    }

    // Update roles if changed (with audit logging)
    if (body.role !== undefined) {
      const rolesChanged =
        body.role.length !== existingUser.role.length ||
        !body.role.every((r) => existingUser.role.includes(r));

      if (rolesChanged) {
        updatedUser = await updateUserRoles(id, body.role, adminUser.id);
      }
    }

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

    // Handle last-admin protection errors
    if (errorMessage.includes("last administrator")) {
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    console.error("Update user error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while updating user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<DeleteUserResponse>> {
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

    // Prevent deletion of last administrator
    if (await isLastAdmin(id)) {
      return NextResponse.json(
        { success: false, error: "Cannot delete the last administrator" },
        { status: 400 }
      );
    }

    // Archive audit log before deletion (preserves audit trail)
    await archiveUserAuditLog(id, adminUser.id, {
      email: existingUser.email,
      username: existingUser.username,
    });

    // Delete user
    await deleteUser(id);

    return NextResponse.json({
      success: true,
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

    console.error("Delete user error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while deleting user" },
      { status: 500 }
    );
  }
}

