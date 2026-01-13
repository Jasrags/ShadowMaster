/**
 * Grunt Templates API
 *
 * GET /api/editions/[editionCode]/grunt-templates - List grunt templates
 *
 * @see /docs/capabilities/campaign.npc-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getGruntTemplates, searchTemplates } from "@/lib/storage/grunt-templates";
import type { EditionCode } from "@/lib/types/edition";
import type { GruntTemplatesResponse, ProfessionalRating } from "@/lib/types/grunts";

/**
 * GET /api/editions/[editionCode]/grunt-templates
 *
 * List grunt templates for an edition.
 *
 * Query Parameters:
 * - professionalRating: Filter by PR (0-6)
 * - category: Filter by category
 * - search: Search by name/description
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ editionCode: string }> }
): Promise<NextResponse<GruntTemplatesResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, templates: [], error: "Authentication required" },
        { status: 401 }
      );
    }

    const { editionCode } = await params;

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const prParam = searchParams.get("professionalRating");
    const searchQuery = searchParams.get("search");

    // Get templates
    let templates;
    if (searchQuery) {
      templates = await searchTemplates(editionCode as EditionCode, searchQuery);
    } else {
      const professionalRating = prParam
        ? (parseInt(prParam, 10) as ProfessionalRating)
        : undefined;
      templates = await getGruntTemplates(editionCode as EditionCode, professionalRating);
    }

    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("Get grunt templates error:", error);
    return NextResponse.json(
      { success: false, templates: [], error: "An error occurred" },
      { status: 500 }
    );
  }
}
