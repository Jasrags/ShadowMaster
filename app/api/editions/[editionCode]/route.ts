/**
 * API Route: GET /api/editions/[editionCode]
 * 
 * Returns edition data with optional book loading.
 */

import { NextRequest, NextResponse } from "next/server";
import { getEdition, getBook, getAllBooks, getAllCreationMethods } from "@/lib/storage/editions";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ editionCode: string }> }
) {
  try {
    const { editionCode } = await params;
    const { searchParams } = new URL(request.url);
    const bookIds = searchParams.get("bookIds")?.split(",").filter(Boolean);

    // Load edition
    const edition = await getEdition(editionCode as "sr5" | "sr6" | "sr4a" | "sr4" | "sr3" | "sr2" | "sr1" | "anarchy");
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
        bookIds.map((id) => getBook(editionCode as "sr5" | "sr6" | "sr4a" | "sr4" | "sr3" | "sr2" | "sr1" | "anarchy", id))
      );
      books = books.filter(Boolean);
    } else {
      books = await getAllBooks(editionCode as "sr5" | "sr6" | "sr4a" | "sr4" | "sr3" | "sr2" | "sr1" | "anarchy");
    }

    // Load creation methods
    const creationMethods = await getAllCreationMethods(editionCode as "sr5" | "sr6" | "sr4a" | "sr4" | "sr3" | "sr2" | "sr1" | "anarchy");

    return NextResponse.json({
      success: true,
      edition,
      books,
      creationMethods,
    });
  } catch (error) {
    console.error("Failed to load edition:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load edition data" },
      { status: 500 }
    );
  }
}

