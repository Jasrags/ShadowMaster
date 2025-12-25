/**
 * API Route: /api/characters
 *
 * GET - List characters for the authenticated user with multi-criteria search
 * POST - Create a new character draft
 *
 * Satisfies:
 * - Requirement: "Character entities MUST be discoverable and retrievable
 *   through multi-criteria searching, filtering, and sorting"
 * - Requirement: "Character data MUST be accessible in multiple presentation formats"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import {
  createCharacterDraft,
  searchCharacters,
  type CharacterSearchOptions,
} from "@/lib/storage/characters";
import type { CharacterStatus, EditionCode, MagicalPath } from "@/lib/types";

/**
 * GET /api/characters
 *
 * Query Parameters:
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
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Parse query params
    const { searchParams } = new URL(request.url);

    // Build search options
    const searchOptions: CharacterSearchOptions = {
      userId: user.id,
    };

    // Filters
    const statusParam = searchParams.get("status");
    const editionParam = searchParams.get("edition");
    const campaignId = searchParams.get("campaignId");
    const metatype = searchParams.get("metatype");
    const magicalPath = searchParams.get("magicalPath") as MagicalPath | null;
    const searchText = searchParams.get("search");

    if (statusParam || editionParam || campaignId || metatype || magicalPath || searchText) {
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

    return NextResponse.json({
      success: true,
      characters: result.characters,
      total: result.total,
      hasMore: result.hasMore,
      limit: result.limit,
      offset: result.offset,
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
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Parse body
    const body = await request.json();
    const { editionId, editionCode, creationMethodId, name, campaignId } = body;

    // Validate required fields
    if (!editionId || !editionCode || !creationMethodId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: editionId, editionCode, creationMethodId" },
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
                description: `${user.username} created a character for the campaign: "${draft.name || 'Unnamed'}".`,
            });
            
            const campaign = await getCampaignById(campaignId);
            if (campaign) {
                await createNotification({
                    userId: campaign.gmId,
                    campaignId: campaignId,
                    type: "character_approval_requested",
                    title: "New Character",
                    message: `${user.username} created a new character "${draft.name || 'Unnamed'}" for your campaign "${campaign.title}".`,
                    actionUrl: `/campaigns/${campaignId}?tab=approvals`,
                });
            }
        } catch (activityError) {
            console.error("Failed to log character creation activity:", activityError);
        }
    }

    return NextResponse.json({
      success: true,
      character: draft,
    }, { status: 201 });
  } catch (error) {
    console.error("Failed to create character:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create character" },
      { status: 500 }
    );
  }
}

