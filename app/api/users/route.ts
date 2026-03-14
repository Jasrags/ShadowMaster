import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, toPublicUser, handleAdminAuthError } from "@/lib/auth/middleware";
import { getAllUsers } from "@/lib/storage/users";
import type { PublicUser } from "@/lib/types/user";

export async function GET(request: NextRequest) {
  try {
    // Require administrator role
    await requireAdmin();

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || "";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "20", 10) || 20));
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "asc";

    // Get all users
    const allUsers = await getAllUsers();

    // Convert to public users (remove passwordHash)
    let filteredUsers: PublicUser[] = allUsers.map(toPublicUser);

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.email?.toLowerCase().includes(searchLower) ||
          user.username?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filteredUsers.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case "email":
          aValue = (a.email || "").toLowerCase();
          bValue = (b.email || "").toLowerCase();
          break;
        case "username":
          aValue = (a.username || "").toLowerCase();
          bValue = (b.username || "").toLowerCase();
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
    const authResponse = handleAdminAuthError(error);
    if (authResponse) return authResponse;

    console.error("Get users error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while fetching users" },
      { status: 500 }
    );
  }
}
