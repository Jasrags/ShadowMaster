import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { authorizeGM } from "@/lib/auth/campaign";
import { importLocations } from "@/lib/storage/locations";
import type { Location } from "@/lib/types";
import { RateLimiter } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/ip";

// 10 location imports per 15 minutes per IP
const importLimiter = RateLimiter.get("location-import", { windowMs: 15 * 60 * 1000, max: 10 });

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    const ip = getClientIp(request);
    if (importLimiter.isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many import requests. Please try again later." },
        { status: 429 }
      );
    }

    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const { id: campaignId } = await params;
    const auth = await authorizeGM(campaignId, userId);
    if (!auth.authorized || !auth.campaign) {
      return NextResponse.json({ success: false, error: auth.error }, { status: auth.status });
    }

    const body = await request.json();
    if (!Array.isArray(body.locations)) {
      return NextResponse.json(
        { success: false, error: "Invalid data format. Expected { locations: Location[] }" },
        { status: 400 }
      );
    }

    const locations = await importLocations(campaignId, body.locations as Location[]);

    return NextResponse.json({
      success: true,
      count: locations.length,
    });
  } catch (error) {
    console.error("Import locations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to import locations" },
      { status: 500 }
    );
  }
}
