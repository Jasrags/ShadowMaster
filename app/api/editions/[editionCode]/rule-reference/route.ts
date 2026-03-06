/**
 * API Route: GET /api/editions/[editionCode]/rule-reference
 *
 * Returns curated rule reference data for an edition.
 * Supports optional category filtering via query param.
 *
 * Query params:
 *   - category: Filter entries by category (combat, magic, matrix, etc.)
 */

import { NextRequest, NextResponse } from "next/server";
import { getEdition, getRuleReference } from "@/lib/storage/editions";
import type { EditionCode, RuleReferenceCategory } from "@/lib/types";

const VALID_CATEGORIES: RuleReferenceCategory[] = [
  "combat",
  "magic",
  "matrix",
  "rigging",
  "social",
  "environment",
  "tests",
  "equipment",
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ editionCode: string }> }
) {
  try {
    const { editionCode } = await params;
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") as RuleReferenceCategory | null;

    const edition = await getEdition(editionCode as EditionCode);
    if (!edition) {
      return NextResponse.json(
        { success: false, error: `Edition not found: ${editionCode}` },
        { status: 404 }
      );
    }

    if (category && !VALID_CATEGORIES.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid category: ${category}. Valid options: ${VALID_CATEGORIES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const data = await getRuleReference(editionCode as EditionCode);
    if (!data) {
      return NextResponse.json(
        { success: false, error: `No rule reference data found for edition: ${editionCode}` },
        { status: 404 }
      );
    }

    const entries = category ? data.entries.filter((e) => e.category === category) : data.entries;

    return NextResponse.json({
      success: true,
      data: { ...data, entries },
    });
  } catch (error) {
    console.error("Failed to fetch rule reference:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch rule reference data" },
      { status: 500 }
    );
  }
}
