import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getLocationTemplate } from "@/lib/storage/locations";
import type { LocationTemplate } from "@/lib/types";

/**
 * GET /api/location-templates/[id] - Get a single location template
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<{ success: boolean; template?: LocationTemplate; error?: string }>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const template = await getLocationTemplate(id);

    if (!template) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });
    }

    // Check visibility (simplified: if public or owned by user)
    if (!template.isPublic && template.createdBy !== userId) {
      return NextResponse.json({ success: false, error: "Access denied" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Get template error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
