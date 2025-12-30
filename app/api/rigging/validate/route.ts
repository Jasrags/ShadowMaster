/**
 * API Route: /api/rigging/validate
 *
 * POST - Validate a vehicle action
 *
 * Validates that a character can perform a specific vehicle action,
 * calculating dice pool and limit.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import { validateVehicleAction, getTestTypeForAction } from "@/lib/rules/rigging/action-validator";
import { calculateVehicleDicePool } from "@/lib/rules/rigging/dice-pool-calculator";
import type { VehicleActionType, RiggingState } from "@/lib/types/rigging";
import type { VehicleCatalogItem, DroneCatalogItem } from "@/lib/types/vehicles";

// =============================================================================
// Request/Response Types
// =============================================================================

interface ValidateActionRequest {
  characterId: string;
  vehicleId: string;
  actionType: VehicleActionType;
  riggingState?: RiggingState;
}

interface ValidateActionResponse {
  valid: boolean;
  errors: Array<{ code: string; message: string }>;
  warnings: Array<{ code: string; message: string }>;
  dicePool?: {
    pool: number;
    formula: string;
    limit: number;
    limitType: "handling" | "speed" | "sensor";
  };
  controlMode?: "manual" | "remote" | "jumped-in";
}

// =============================================================================
// POST - Validate Vehicle Action
// =============================================================================

export async function POST(
  request: NextRequest
): Promise<NextResponse<ValidateActionResponse | { error: string }>> {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Parse request
    const body: ValidateActionRequest = await request.json();
    const { characterId, vehicleId, actionType, riggingState } = body;

    if (!characterId || !vehicleId || !actionType) {
      return NextResponse.json(
        { error: "Missing required fields: characterId, vehicleId, actionType" },
        { status: 400 }
      );
    }

    // Get the character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { error: "Character not found" },
        { status: 404 }
      );
    }

    // Check ownership
    if (character.ownerId !== userId) {
      return NextResponse.json(
        { error: "Not authorized to access this character" },
        { status: 403 }
      );
    }

    // Find the vehicle or drone
    const vehicle = (character.vehicles ?? []).find(v => v.id === vehicleId);
    const drone = (character.drones ?? []).find(d => d.id === vehicleId);

    if (!vehicle && !drone) {
      return NextResponse.json(
        { error: "Vehicle or drone not found" },
        { status: 404 }
      );
    }

    // Validate the action
    const validation = validateVehicleAction(
      character,
      riggingState,
      actionType,
      vehicleId
    );

    // If valid, calculate dice pool
    let dicePoolResult;
    if (validation.valid) {
      const target = vehicle || drone;
      
      // Build appropriate catalog item based on whether it's a vehicle or drone
      let catalogItem: VehicleCatalogItem | DroneCatalogItem;
      
      if (drone) {
        catalogItem = {
          id: drone.id ?? vehicleId,
          name: drone.name ?? "Unknown Drone",
          size: drone.size ?? "small",
          droneType: "surveillance", // Default drone type
          handling: drone.handling ?? 4,
          speed: drone.speed ?? 3,
          acceleration: drone.acceleration ?? 2,
          body: drone.body ?? 4,
          armor: drone.armor ?? 2,
          pilot: drone.pilot ?? 3,
          sensor: drone.sensor ?? 2,
          cost: 0,
          availability: 0,
        } as DroneCatalogItem;
      } else {
        catalogItem = {
          id: target?.id ?? vehicleId,
          name: target?.name ?? "Unknown Vehicle",
          category: "cars" as const, // Default to cars for vehicles
          handling: target?.handling ?? 4,
          speed: target?.speed ?? 3,
          acceleration: target?.acceleration ?? 2,
          body: target?.body ?? 8,
          armor: target?.armor ?? 4,
          pilot: target?.pilot ?? 1,
          sensor: target?.sensor ?? 2,
          cost: 0,
          availability: 0,
        } as VehicleCatalogItem;
      }

      const testType = getTestTypeForAction(actionType);
      const poolResult = calculateVehicleDicePool(
        character,
        riggingState,
        testType,
        catalogItem,
        validation
      );

      dicePoolResult = {
        pool: poolResult.pool,
        formula: poolResult.formula,
        limit: poolResult.limit,
        limitType: poolResult.limitType,
      };
    }

    const response: ValidateActionResponse = {
      valid: validation.valid,
      errors: validation.errors.map(e => ({ code: e.code, message: e.message })),
      warnings: validation.warnings.map(w => ({ code: w.code, message: w.message })),
      dicePool: dicePoolResult,
      controlMode: validation.controlMode,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to validate action:", error);
    return NextResponse.json(
      { error: "Failed to validate action" },
      { status: 500 }
    );
  }
}
