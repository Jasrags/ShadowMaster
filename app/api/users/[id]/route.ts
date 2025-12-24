import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { getUserById, updateUser, getAllUsers, deleteUser } from "@/lib/storage/users";
import { isValidEmail, isValidUsername } from "@/lib/auth/validation";
import type { UpdateUserRequest, UpdateUserResponse, DeleteUserResponse, UserRole } from "@/lib/types/user";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<UpdateUserResponse>> {
  try {
    // Require administrator role
    await requireAdmin();

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

    // Prepare updates
    const updates: Partial<typeof existingUser> = {};
    if (body.email !== undefined) updates.email = body.email;
    if (body.username !== undefined) updates.username = body.username;
    if (body.role !== undefined) updates.role = body.role;

    // Update user
    const updatedUser = await updateUser(id, updates);

    // Return user without passwordHash
    const publicUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      role: updatedUser.role,
      createdAt: updatedUser.createdAt,
      lastLogin: updatedUser.lastLogin,
      characters: updatedUser.characters,
      failedLoginAttempts: updatedUser.failedLoginAttempts,
      lockoutUntil: updatedUser.lockoutUntil,
      sessionVersion: updatedUser.sessionVersion,
    };

    return NextResponse.json({
      success: true,
      user: publicUser,
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
    // Require administrator role
    await requireAdmin();

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
    if (existingUser.role.includes("administrator")) {
      const allUsers = await getAllUsers();
      const adminCount = allUsers.filter((u) => u.role.includes("administrator")).length;
      
      if (adminCount === 1) {
        return NextResponse.json(
          { success: false, error: "Cannot delete the last administrator" },
          { status: 400 }
        );
      }
    }

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

