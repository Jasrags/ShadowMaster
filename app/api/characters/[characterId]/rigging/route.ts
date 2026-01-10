/**
 * API Route: /api/characters/[characterId]/rigging
 *
 * GET - Get character's rigging equipment details
 *
 * Returns owned vehicles, drones, RCCs, autosofts, and VCR info.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import { hasVehicleControlRig, getVehicleControlRig } from "@/lib/rules/rigging/vcr-validator";
import { hasRCC, getActiveRCC, buildRCCConfiguration } from "@/lib/rules/rigging/rcc-validator";

// =============================================================================
// Response Types
// =============================================================================

interface RiggingEquipmentSummary {
  vehicleCount: number;
  droneCount: number;
  rccCount: number;
  autosoftCount: number;
  hasVCR: boolean;
  vcrRating?: number;
  hasActiveRCC: boolean;
  maxSlavedDrones: number;
}

// =============================================================================
// GET - Get Rigging Equipment
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<RiggingEquipmentSummary | { error: string }>> {
  try {
    const { characterId } = await params;

    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get the character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ error: "Character not found" }, { status: 404 });
    }

    // Check ownership
    if (character.ownerId !== userId) {
      return NextResponse.json({ error: "Not authorized to view this character" }, { status: 403 });
    }

    // Count equipment
    const vehicleCount = (character.vehicles ?? []).length;
    const droneCount = (character.drones ?? []).length;
    const rccCount = (character.rccs ?? []).length;
    const autosoftCount = (character.autosofts ?? []).length;

    // Check for VCR
    const vcr = hasVehicleControlRig(character) ? getVehicleControlRig(character) : null;

    // Get active RCC configuration
    const activeRCC = hasRCC(character) ? getActiveRCC(character) : null;

    const maxSlavedDrones = activeRCC ? buildRCCConfiguration(activeRCC, []).maxSlavedDrones : 0;

    const response: RiggingEquipmentSummary = {
      vehicleCount,
      droneCount,
      rccCount,
      autosoftCount,
      hasVCR: vcr !== null,
      vcrRating: vcr?.rating,
      hasActiveRCC: activeRCC !== null,
      maxSlavedDrones,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to get rigging equipment:", error);
    return NextResponse.json({ error: "Failed to get rigging equipment" }, { status: 500 });
  }
}
