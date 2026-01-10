import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createLocationTemplate, getLocationTemplates } from "@/lib/storage/locations";
import type { CreateLocationTemplateRequest, LocationTemplate, LocationType } from "@/lib/types";

/**
 * GET /api/location-templates - List location templates
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse<{ success: boolean; templates: LocationTemplate[]; error?: string }>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, templates: [], error: "Authentication required" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get("type") as LocationType | null;
    const search = searchParams.get("search") || undefined;
    const publicOnly = searchParams.get("public") === "true";

    const templates = await getLocationTemplates({
      userId,
      type: type || undefined,
      search,
      public: publicOnly || undefined,
    });

    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("List templates error:", error);
    return NextResponse.json(
      { success: false, templates: [], error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/location-templates - Create a new location template
 */
export async function POST(
  request: NextRequest
): Promise<NextResponse<{ success: boolean; template?: LocationTemplate; error?: string }>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const body: CreateLocationTemplateRequest = await request.json();

    // Validate
    if (!body.name) {
      return NextResponse.json({ success: false, error: "Name is required" }, { status: 400 });
    }

    if (!body.type) {
      return NextResponse.json({ success: false, error: "Type is required" }, { status: 400 });
    }

    const template = await createLocationTemplate(userId, body);

    return NextResponse.json({
      success: true,
      template,
    });
  } catch (error) {
    console.error("Create template error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create template" },
      { status: 500 }
    );
  }
}
