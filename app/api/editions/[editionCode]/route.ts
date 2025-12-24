/**
 * API Route: GET /api/editions/[editionCode]
 * 
 * Returns edition data with optional book loading.
 * 
 * Query params:
 *   - bookIds: Comma-separated list of book IDs to load
 *   - include: Optional includes (e.g., "summary" for content summary)
 */

import { NextRequest, NextResponse } from "next/server";
import { getEdition, getBook, getAllBooks, getAllCreationMethods, getEditionContentSummary } from "@/lib/storage/editions";
import type { EditionCode } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ editionCode: string }> }
) {
  try {
    const { editionCode } = await params;
    const { searchParams } = new URL(request.url);
    const bookIds = searchParams.get("bookIds")?.split(",").filter(Boolean);
    const include = searchParams.get("include")?.split(",") || [];

    // Load edition
    const edition = await getEdition(editionCode as EditionCode);
    if (!edition) {
      return NextResponse.json(
        { success: false, error: `Edition not found: ${editionCode}` },
        { status: 404 }
      );
    }

    // Load books
    let books;
    if (bookIds && bookIds.length > 0) {
      books = await Promise.all(
        bookIds.map((id) => getBook(editionCode as EditionCode, id))
      );
      books = books.filter(Boolean);
    } else {
      books = await getAllBooks(editionCode as EditionCode);
    }

    // Load creation methods
    const creationMethods = await getAllCreationMethods(editionCode as EditionCode);

    // Build response
    const response: Record<string, unknown> = {
      success: true,
      edition,
      books,
      creationMethods,
    };

    // Optionally include content summary
    if (include.includes("summary")) {
      const contentSummary = await getEditionContentSummary(editionCode as EditionCode);
      response.contentSummary = contentSummary;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to load edition:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load edition data" },
      { status: 500 }
    );
  }
}

