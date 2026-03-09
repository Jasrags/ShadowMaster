/**
 * API Route: GET /api/editions/[editionCode]/content
 *
 * Returns paginated content previews for an edition.
 * Supports filtering by category and full-text search across all modules.
 *
 * Query params:
 *   - category: Filter by content category (metatypes, skills, qualities, gear, etc.)
 *   - search: Case-insensitive substring search across name, summary, category, subcategory
 *   - limit: Maximum number of items to return (default: 20, max: 100)
 *   - offset: Pagination offset (default: 0)
 */

import { NextRequest, NextResponse } from "next/server";
import { getAllBookPayloads, getEdition } from "@/lib/storage/editions";
import type { ContentPreviewItem, ContentPreviewResponse } from "@/lib/types";
import type { EditionCode } from "@/lib/types";
import { BROWSABLE_CATEGORIES, flattenModulesForSearch } from "@/lib/rules/search-index";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ editionCode: string }> }
) {
  try {
    const { editionCode } = await params;
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const search = searchParams.get("search")?.trim() || undefined;
    const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 100);
    const offset = parseInt(searchParams.get("offset") || "0");

    // Validate edition exists
    const edition = await getEdition(editionCode as EditionCode);
    if (!edition) {
      return NextResponse.json(
        { success: false, error: `Edition not found: ${editionCode}` },
        { status: 404 }
      );
    }

    // Validate category if provided
    if (category && !BROWSABLE_CATEGORIES.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid category: ${category}. Valid options: ${BROWSABLE_CATEGORIES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const payloads = await getAllBookPayloads(editionCode as EditionCode);
    let allItems: ContentPreviewItem[] = [];

    for (const payload of payloads) {
      const modules = payload.modules || {};
      const sourceBook = payload.meta.title;
      allItems.push(
        ...flattenModulesForSearch(modules as Record<string, { payload?: unknown }>, sourceBook)
      );
    }

    // Filter by category
    if (category) {
      allItems = allItems.filter((item) => item.category === category);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      allItems = allItems.filter((item) => {
        return (
          item.name.toLowerCase().includes(searchLower) ||
          item.summary?.toLowerCase().includes(searchLower) ||
          item.category?.toLowerCase().includes(searchLower) ||
          item.subcategory?.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply pagination
    const total = allItems.length;
    const items = allItems.slice(offset, offset + limit);

    const response: ContentPreviewResponse = {
      items,
      total,
      offset,
      limit,
      category: category || undefined,
      search,
    };

    return NextResponse.json({
      success: true,
      ...response,
    });
  } catch (error) {
    console.error("Failed to fetch content:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch content" }, { status: 500 });
  }
}
