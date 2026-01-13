/**
 * API Route: /api/editions/[editionCode]/favor-costs
 *
 * GET - Get favor cost tables for an edition
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import type { FavorServiceDefinition } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ editionCode: string }> }
) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const { editionCode } = await params;

    // Load ruleset
    const mergeResult = await loadAndMergeRuleset(editionCode);

    if (!mergeResult.success || !mergeResult.ruleset) {
      return NextResponse.json(
        { success: false, error: mergeResult.error || "Failed to load edition" },
        { status: 404 }
      );
    }

    // Get favor services from ruleset modules
    // Note: This will be populated in Phase 6 (Ruleset Data)
    const favorServicesModule = mergeResult.ruleset.modules?.favorServices as
      | { services?: FavorServiceDefinition[] }
      | undefined;
    const allServices: FavorServiceDefinition[] = favorServicesModule?.services || [];

    // Parse query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const archetype = searchParams.get("archetype");
    const riskLevel = searchParams.get("riskLevel");
    const minConnection = searchParams.get("minConnection");

    let services = allServices;

    // Filter by archetype
    if (archetype) {
      const archetypeLower = archetype.toLowerCase();
      services = services.filter((s) =>
        s.archetypeIds?.some((id) => id.toLowerCase().includes(archetypeLower))
      );
    }

    // Filter by risk level
    if (riskLevel) {
      services = services.filter((s) => s.riskLevel === riskLevel);
    }

    // Filter by minimum connection
    if (minConnection) {
      const minConn = parseInt(minConnection, 10);
      if (!isNaN(minConn)) {
        services = services.filter((s) => s.minimumConnection <= minConn);
      }
    }

    // Group services by archetype for easier consumption
    const servicesByArchetype: Record<string, FavorServiceDefinition[]> = {};
    for (const service of services) {
      if (service.archetypeIds) {
        for (const archetypeId of service.archetypeIds) {
          if (!servicesByArchetype[archetypeId]) {
            servicesByArchetype[archetypeId] = [];
          }
          servicesByArchetype[archetypeId].push(service);
        }
      } else {
        // Generic services available to all
        if (!servicesByArchetype["generic"]) {
          servicesByArchetype["generic"] = [];
        }
        servicesByArchetype["generic"].push(service);
      }
    }

    return NextResponse.json({
      success: true,
      editionCode,
      services,
      servicesByArchetype,
      count: services.length,
    });
  } catch (error) {
    console.error("Failed to get favor costs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get favor costs" },
      { status: 500 }
    );
  }
}
