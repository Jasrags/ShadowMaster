import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/middleware";
import { getAllUsers } from "@/lib/storage/users";
import type { UsersListResponse, PublicUser } from "@/lib/types/user";

export async function GET(request: NextRequest) {
  try {
    // Require administrator role
    await requireAdmin();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    // Get all users
    const allUsers = await getAllUsers();

    // Filter users (remove passwordHash)
    let filteredUsers: PublicUser[] = allUsers.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
      characters: user.characters,
    }));

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(searchLower) ||
          user.username.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "email":
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case "username":
          aValue = a.username.toLowerCase();
          bValue = b.username.toLowerCase();
          break;
        case "role":
          // Sort by first role, or join roles for comparison
          aValue = Array.isArray(a.role) ? a.role.sort().join(", ") : a.role;
          bValue = Array.isArray(b.role) ? b.role.sort().join(", ") : b.role;
          break;
        case "createdAt":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
      }

      if (aValue < bValue) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

    // Apply pagination
    const total = filteredUsers.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
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

    console.error("Get users error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while fetching users" },
      { status: 500 }
    );
  }
}

