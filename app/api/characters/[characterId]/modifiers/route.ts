/**
 * API Route: /api/characters/[characterId]/modifiers
 *
 * GET  - List active modifiers
 * POST - Add a new modifier (from template or custom)
 *
 * @see Issue #114
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { validateAddModifier, getModifierTemplate, computeExpiresAt } from "@/lib/rules/modifiers";
import type { AddModifierRequest } from "@/lib/rules/modifiers";
import type { ActiveModifier, Effect } from "@/lib/types/effects";
import { randomUUID } from "crypto";

// =============================================================================
// TYPES
// =============================================================================

interface ModifierListResponse {
  success: boolean;
  modifiers: ActiveModifier[];
  error?: string;
}

interface AddModifierResponse {
  success: boolean;
  modifier?: ActiveModifier;
  error?: string;
  validationErrors?: Array<{ field: string; message: string }>;
}

// =============================================================================
// ROUTE HANDLERS
// =============================================================================

/**
 * GET - List all active modifiers for a character
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<ModifierListResponse>> {
  try {
    const { characterId } = await params;

    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, modifiers: [], error: "Unauthorized" },
        { status: 401 }
      );
    }

    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, modifiers: [], error: "Character not found" },
        { status: 404 }
      );
    }

    if (character.ownerId !== userId) {
      return NextResponse.json(
        { success: false, modifiers: [], error: "Not authorized to view this character" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      modifiers: character.activeModifiers ?? [],
    });
  } catch (error) {
    console.error("Failed to get modifiers:", error);
    return NextResponse.json(
      { success: false, modifiers: [], error: "Failed to get modifiers" },
      { status: 500 }
    );
  }
}

/**
 * POST - Add a new active modifier
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<AddModifierResponse>> {
  try {
    const { characterId } = await params;

    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    if (character.ownerId !== userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized to modify this character" },
        { status: 403 }
      );
    }

    const body: AddModifierRequest = await request.json();

    // Validate
    const validation = validateAddModifier(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: "Validation failed", validationErrors: validation.errors },
        { status: 400 }
      );
    }

    // Resolve effect from template or custom
    let name: string;
    let effect: Effect;
    let source = body.source;

    if (body.templateId) {
      const template = getModifierTemplate(body.templateId)!;
      name = template.name;
      effect = template.effect;
      source = template.source;
    } else {
      name = body.name!;
      effect = {
        id: `custom-${randomUUID().slice(0, 8)}`,
        type: body.effect!.type,
        triggers: body.effect!.triggers,
        target: {},
        value: body.effect!.value,
      };
    }

    // Build the modifier
    const now = new Date().toISOString();
    const modifier: ActiveModifier = {
      id: randomUUID(),
      name,
      source,
      effect,
      expiresAt: computeExpiresAt(body.duration),
      appliedBy: userId,
      appliedAt: now,
      notes: body.notes,
    };

    if (body.expiresAfterUses !== undefined) {
      modifier.expiresAfterUses = body.expiresAfterUses;
      modifier.remainingUses = body.expiresAfterUses;
    }

    // Append and save
    const existingModifiers = character.activeModifiers ?? [];
    await updateCharacterWithAudit(
      userId,
      characterId,
      { activeModifiers: [...existingModifiers, modifier] },
      {
        action: "modifier_applied",
        actor: { userId, role: "owner" },
        details: {
          modifierId: modifier.id,
          modifierName: name,
          source,
          effectType: effect.type,
          effectValue: typeof effect.value === "number" ? effect.value : effect.value.perRating,
          duration: body.duration,
          templateId: body.templateId,
        },
        note: `Applied modifier: ${name}`,
      }
    );

    return NextResponse.json({ success: true, modifier }, { status: 201 });
  } catch (error) {
    console.error("Failed to add modifier:", error);
    return NextResponse.json({ success: false, error: "Failed to add modifier" }, { status: 500 });
  }
}
