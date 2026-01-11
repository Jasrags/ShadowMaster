/**
 * API Route: /api/characters
 *
 * GET - List characters for the authenticated user with multi-criteria search
 *       Supports admin mode to view ALL characters across all users
 * POST - Create a new character draft
 *
 * Satisfies:
 * - Requirement: "Character entities MUST be discoverable and retrievable
 *   through multi-criteria searching, filtering, and sorting"
 * - Requirement: "Character data MUST be accessible in multiple presentation formats"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById, getAllUsers } from "@/lib/storage/users";
import {
  createCharacterDraft,
  searchCharacters,
  type CharacterSearchOptions,
} from "@/lib/storage/characters";
import type { Character, CharacterStatus, EditionCode, MagicalPath } from "@/lib/types";

/**
 * Character with owner username for admin view
 */
interface CharacterWithOwner extends Character {
  ownerUsername?: string;
}

/**
 * GET /api/characters
 *
 * Query Parameters:
 * - admin: Set to "true" to view ALL characters (admin only)
 * - ownerId: Filter by owner ID (admin mode only)
 * - status: Filter by status (comma-separated for multiple)
 * - edition: Filter by edition code (comma-separated for multiple)
 * - campaignId: Filter by campaign
 * - metatype: Filter by metatype (case-insensitive contains)
 * - magicalPath: Filter by magical path
 * - search: Full-text search on name, metatype, magical path
 * - sortBy: Sort field (name, updatedAt, createdAt, karmaCurrent)
 * - sortOrder: Sort order (asc, desc)
 * - limit: Number of results (default: 20, max: 100)
 * - offset: Pagination offset
 * - format: Response format (summary, full)
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Parse query params
    const { searchParams } = new URL(request.url);

    // Check for admin mode
    const isAdminMode = searchParams.get("admin") === "true";
    const isAdmin = user.role.includes("administrator");

    // Admin mode requires admin role
    if (isAdminMode && !isAdmin) {
      return NextResponse.json(
        { success: false, error: "Administrator access required" },
        { status: 403 }
      );
    }

    // Build search options
    // In admin mode, don't filter by userId (get all characters)
    const searchOptions: CharacterSearchOptions = {
      userId: isAdminMode ? undefined : user.id,
    };

    // Filters
    const statusParam = searchParams.get("status");
    const editionParam = searchParams.get("edition");
    const campaignId = searchParams.get("campaignId");
    const metatype = searchParams.get("metatype");
    const magicalPath = searchParams.get("magicalPath") as MagicalPath | null;
    const searchText = searchParams.get("search");
    const ownerIdParam = searchParams.get("ownerId"); // Admin mode only

    if (
      statusParam ||
      editionParam ||
      campaignId ||
      metatype ||
      magicalPath ||
      searchText ||
      ownerIdParam
    ) {
      searchOptions.filters = {};

      if (statusParam) {
        searchOptions.filters.status = statusParam.split(",") as CharacterStatus[];
      }
      if (editionParam) {
        searchOptions.filters.edition = editionParam.split(",") as EditionCode[];
      }
      if (campaignId) {
        searchOptions.filters.campaignId = campaignId;
      }
      if (metatype) {
        searchOptions.filters.metatype = metatype;
      }
      if (magicalPath) {
        searchOptions.filters.magicalPath = magicalPath;
      }
      if (searchText) {
        searchOptions.filters.search = searchText;
      }
      // Owner filter (admin mode only)
      if (ownerIdParam && isAdminMode) {
        searchOptions.filters.ownerId = ownerIdParam;
      }
    }

    // Sorting
    const sortBy = searchParams.get("sortBy") as
      | "name"
      | "updatedAt"
      | "createdAt"
      | "karmaCurrent"
      | null;
    const sortOrder = searchParams.get("sortOrder") as "asc" | "desc" | null;

    if (sortBy || sortOrder) {
      searchOptions.sort = {
        field: sortBy || "updatedAt",
        order: sortOrder || "desc",
      };
    }

    // Pagination
    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");

    if (limitParam || offsetParam) {
      const limit = Math.min(parseInt(limitParam || "20", 10), 100); // Max 100
      const offset = parseInt(offsetParam || "0", 10);
      searchOptions.pagination = { limit, offset };
    }

    // Format
    const format = searchParams.get("format") as "summary" | "full" | null;
    if (format) {
      searchOptions.format = format;
    }

    // Execute search
    const result = await searchCharacters(searchOptions);

    // In admin mode, enrich characters with owner usernames
    let characters = result.characters;
    let ownerMap: Map<string, string> | undefined;

    if (isAdminMode) {
      // Build a map of ownerId -> username for efficiency
      const ownerIds = [...new Set(result.characters.map((c) => c.ownerId))];
      ownerMap = new Map<string, string>();

      for (const ownerId of ownerIds) {
        const owner = await getUserById(ownerId);
        ownerMap.set(ownerId, owner?.username || "Unknown");
      }

      // Enrich characters with owner username
      characters = result.characters.map((c) => ({
        ...c,
        ownerUsername: ownerMap!.get(c.ownerId) || "Unknown",
      })) as CharacterWithOwner[];
    }

    return NextResponse.json({
      success: true,
      characters,
      total: result.total,
      hasMore: result.hasMore,
      limit: result.limit,
      offset: result.offset,
      isAdminMode,
      // Include unique owners for filter dropdown (admin mode only)
      ...(isAdminMode && ownerMap
        ? {
            owners: Array.from(ownerMap.entries()).map(([id, username]) => ({ id, username })),
          }
        : {}),
    });
  } catch (error) {
    console.error("Failed to get characters:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get characters" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Parse body
    const body = await request.json();
    const { editionId, editionCode, creationMethodId, name, campaignId } = body;

    // Validate required fields
    if (!editionId || !editionCode || !creationMethodId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields: editionId, editionCode, creationMethodId",
        },
        { status: 400 }
      );
    }

    // Create draft
    const draft = await createCharacterDraft(
      user.id,
      editionId,
      editionCode as EditionCode,
      creationMethodId,
      name,
      campaignId // Pass campaign ID if provided
    );

    // Log activity and notify GM asynchronously if campaignId is present
    if (campaignId) {
      try {
        const { logActivity } = await import("@/lib/storage/activity");
        const { createNotification } = await import("@/lib/storage/notifications");
        const { getCampaignById } = await import("@/lib/storage/campaigns");

        await logActivity({
          campaignId: campaignId,
          type: "character_created",
          actorId: userId,
          targetId: draft.id,
          targetType: "character",
          targetName: draft.name || "A new character",
          description: `${user.username} created a character for the campaign: "${draft.name || "Unnamed"}".`,
        });

        const campaign = await getCampaignById(campaignId);
        if (campaign) {
          await createNotification({
            userId: campaign.gmId,
            campaignId: campaignId,
            type: "character_approval_requested",
            title: "New Character",
            message: `${user.username} created a new character "${draft.name || "Unnamed"}" for your campaign "${campaign.title}".`,
            actionUrl: `/campaigns/${campaignId}?tab=approvals`,
          });
        }
      } catch (activityError) {
        console.error("Failed to log character creation activity:", activityError);
      }
    }

    return NextResponse.json(
      {
        success: true,
        character: draft,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to create character:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create character" },
      { status: 500 }
    );
  }
}
