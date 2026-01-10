/**
 * API Route: GET /api/editions
 *
 * Returns list of available editions.
 */

import { NextResponse } from "next/server";
import { getAllEditions } from "@/lib/storage/editions";

export async function GET() {
  try {
    const editions = await getAllEditions();
    return NextResponse.json({ success: true, editions });
  } catch (error) {
    console.error("Failed to load editions:", error);
    return NextResponse.json({ success: false, error: "Failed to load editions" }, { status: 500 });
  }
}
