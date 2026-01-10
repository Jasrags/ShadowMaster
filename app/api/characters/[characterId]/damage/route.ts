/**
 * API Route: /api/characters/[characterId]/damage
 *
 * POST - Apply or heal damage to a character
 *
 * Satisfies:
 * - Guarantee: "The character sheet MUST present an accurate and comprehensive
 *   reflection of the character's current state"
 * - Requirement: "Condition monitors MUST visually track physical and stun damage"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { getCampaignById } from "@/lib/storage/campaigns";
import type { Character } from "@/lib/types";

// =============================================================================
// TYPES
// =============================================================================

interface DamageRequest {
  type: "physical" | "stun" | "overflow";
  amount: number; // Positive = apply damage, negative = heal
  source?: string; // Optional description for audit log
}

interface DamageResponse {
  success: boolean;
  character: {
    condition: {
      physicalDamage: number;
      stunDamage: number;
      overflowDamage: number;
    };
    woundModifier: number;
  };
  overflow?: {
    physical: number; // Excess physical that went to overflow
    stun: number; // Stun that converted to physical
  };
  error?: string;
}

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Calculate condition monitor maximum from character attributes
 */
function calculatePhysicalMonitorMax(character: Character): number {
  const body = character.attributes?.body || 1;
  return 8 + Math.ceil(body / 2);
}

function calculateStunMonitorMax(character: Character): number {
  const willpower = character.attributes?.willpower || 1;
  return 8 + Math.ceil(willpower / 2);
}

function calculateOverflowMax(character: Character): number {
  return character.attributes?.body || 1;
}

/**
 * Calculate total wound modifier from both physical and stun damage
 * Uses base calculation without ruleset (simplified for API response)
 */
function calculateTotalWoundModifier(character: Character): number {
  const physicalDamage = character.condition?.physicalDamage || 0;
  const stunDamage = character.condition?.stunDamage || 0;

  // Standard SR5 rule: -1 per 3 boxes of damage on either track
  // Take the worst modifier from either track
  const physicalModifier = -Math.floor(physicalDamage / 3);
  const stunModifier = -Math.floor(stunDamage / 3);

  return physicalModifier + stunModifier;
}

/**
 * Apply damage with overflow logic
 */
function applyDamageWithOverflow(
  character: Character,
  type: "physical" | "stun" | "overflow",
  amount: number
): {
  condition: Character["condition"];
  overflow: { physical: number; stun: number };
} {
  const currentPhysical = character.condition?.physicalDamage || 0;
  const currentStun = character.condition?.stunDamage || 0;
  const currentOverflow = character.condition?.overflowDamage || 0;

  const physicalMax = calculatePhysicalMonitorMax(character);
  const stunMax = calculateStunMonitorMax(character);
  const overflowMax = calculateOverflowMax(character);

  let newPhysical = currentPhysical;
  let newStun = currentStun;
  let newOverflow = currentOverflow;
  let physicalOverflow = 0;
  let stunOverflow = 0;

  if (amount > 0) {
    // Applying damage
    if (type === "physical") {
      newPhysical = currentPhysical + amount;
      if (newPhysical > physicalMax) {
        physicalOverflow = newPhysical - physicalMax;
        newPhysical = physicalMax;
        newOverflow = Math.min(currentOverflow + physicalOverflow, overflowMax);
      }
    } else if (type === "stun") {
      newStun = currentStun + amount;
      if (newStun > stunMax) {
        // Excess stun converts to physical
        stunOverflow = newStun - stunMax;
        newStun = stunMax;
        newPhysical = currentPhysical + stunOverflow;
        if (newPhysical > physicalMax) {
          physicalOverflow = newPhysical - physicalMax;
          newPhysical = physicalMax;
          newOverflow = Math.min(currentOverflow + physicalOverflow, overflowMax);
        }
      }
    } else if (type === "overflow") {
      newOverflow = Math.min(currentOverflow + amount, overflowMax);
    }
  } else if (amount < 0) {
    // Healing (negative amount)
    const healAmount = Math.abs(amount);
    if (type === "physical") {
      newPhysical = Math.max(0, currentPhysical - healAmount);
    } else if (type === "stun") {
      newStun = Math.max(0, currentStun - healAmount);
    } else if (type === "overflow") {
      newOverflow = Math.max(0, currentOverflow - healAmount);
    }
  }

  return {
    condition: {
      physicalDamage: newPhysical,
      stunDamage: newStun,
      overflowDamage: newOverflow,
    },
    overflow: {
      physical: physicalOverflow,
      stun: stunOverflow,
    },
  };
}

// =============================================================================
// ROUTE HANDLER
// =============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<DamageResponse>> {
  try {
    const { characterId } = await params;

    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
          character: {
            condition: { physicalDamage: 0, stunDamage: 0, overflowDamage: 0 },
            woundModifier: 0,
          },
        },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
          character: {
            condition: { physicalDamage: 0, stunDamage: 0, overflowDamage: 0 },
            woundModifier: 0,
          },
        },
        { status: 404 }
      );
    }

    // Get the character - first try with current user as owner
    const character = await getCharacter(userId, characterId);
    let isOwner = true;

    // If not found, check if user is GM for the character's campaign
    if (!character) {
      // Character might belong to another user in a campaign the current user GMs
      // For now, we only allow owners or GMs to modify damage
      // TODO: Implement cross-user character lookup for GM access
      return NextResponse.json(
        {
          success: false,
          error: "Character not found",
          character: {
            condition: { physicalDamage: 0, stunDamage: 0, overflowDamage: 0 },
            woundModifier: 0,
          },
        },
        { status: 404 }
      );
    }

    // Validate permission: Owner can always modify, GM can modify campaign characters
    if (character.ownerId !== userId) {
      if (character.campaignId) {
        const campaign = await getCampaignById(character.campaignId);
        if (!campaign || campaign.gmId !== userId) {
          return NextResponse.json(
            {
              success: false,
              error: "Not authorized to modify this character",
              character: {
                condition: { physicalDamage: 0, stunDamage: 0, overflowDamage: 0 },
                woundModifier: 0,
              },
            },
            { status: 403 }
          );
        }
        isOwner = false;
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Not authorized to modify this character",
            character: {
              condition: { physicalDamage: 0, stunDamage: 0, overflowDamage: 0 },
              woundModifier: 0,
            },
          },
          { status: 403 }
        );
      }
    }

    // Parse request body
    const body: DamageRequest = await request.json();
    const { type, amount, source } = body;

    // Validate request
    if (!type || !["physical", "stun", "overflow"].includes(type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid damage type. Must be 'physical', 'stun', or 'overflow'",
          character: {
            condition: { physicalDamage: 0, stunDamage: 0, overflowDamage: 0 },
            woundModifier: 0,
          },
        },
        { status: 400 }
      );
    }

    if (typeof amount !== "number") {
      return NextResponse.json(
        {
          success: false,
          error: "Amount must be a number",
          character: {
            condition: { physicalDamage: 0, stunDamage: 0, overflowDamage: 0 },
            woundModifier: 0,
          },
        },
        { status: 400 }
      );
    }

    // Apply damage with overflow logic
    const { condition, overflow } = applyDamageWithOverflow(character, type, amount);

    // Update character with audit trail
    const updatedCharacter = await updateCharacterWithAudit(
      character.ownerId,
      characterId,
      { condition },
      {
        action: amount > 0 ? "damage_applied" : "damage_healed",
        actor: {
          userId,
          role: isOwner ? "owner" : "gm",
        },
        details: {
          damageType: type,
          amount,
          source: source || "manual",
          previousCondition: character.condition,
          newCondition: condition,
          actorName: user.username,
        },
        note: source ? `${amount > 0 ? "Damage" : "Healing"}: ${source}` : undefined,
      }
    );

    // Calculate wound modifier
    const woundModifier = calculateTotalWoundModifier(updatedCharacter);

    return NextResponse.json({
      success: true,
      character: {
        condition: {
          physicalDamage: condition.physicalDamage,
          stunDamage: condition.stunDamage,
          overflowDamage: condition.overflowDamage || 0,
        },
        woundModifier,
      },
      overflow: overflow.physical > 0 || overflow.stun > 0 ? overflow : undefined,
    });
  } catch (error) {
    console.error("Failed to apply damage:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to apply damage",
        character: {
          condition: { physicalDamage: 0, stunDamage: 0, overflowDamage: 0 },
          woundModifier: 0,
        },
      },
      { status: 500 }
    );
  }
}
