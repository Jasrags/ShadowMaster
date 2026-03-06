/**
 * Archetypes API
 *
 * GET /api/editions/[editionCode]/archetypes - List character archetypes
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getArchetypes, searchArchetypes } from "@/lib/storage/archetypes";
import type { EditionCode } from "@/lib/types/edition";
import type { CharacterArchetype, ArchetypeCategory } from "@/lib/types/archetype";

interface ArchetypesResponse {
  success: boolean;
  archetypes: CharacterArchetype[];
  error?: string;
}

/**
 * GET /api/editions/[editionCode]/archetypes
 *
 * Query Parameters:
 * - category: Filter by category (combat, magic, technology, social)
 * - search: Search by name/description
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ editionCode: string }> }
): Promise<NextResponse<ArchetypesResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, archetypes: [], error: "Authentication required" },
        { status: 401 }
      );
    }

    const { editionCode } = await params;

    const searchParams = request.nextUrl.searchParams;
    const categoryParam = searchParams.get("category") as ArchetypeCategory | null;
    const searchQuery = searchParams.get("search");

    let archetypes;
    if (searchQuery) {
      archetypes = await searchArchetypes(editionCode as EditionCode, searchQuery);
    } else {
      archetypes = await getArchetypes(editionCode as EditionCode, categoryParam ?? undefined);
    }

    return NextResponse.json({
      success: true,
      archetypes,
    });
  } catch (error) {
    console.error("Get archetypes error:", error);
    return NextResponse.json(
      { success: false, archetypes: [], error: "An error occurred" },
      { status: 500 }
    );
  }
}
