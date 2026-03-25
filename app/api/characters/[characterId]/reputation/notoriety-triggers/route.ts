/**
 * API Route: /api/characters/[characterId]/reputation/notoriety-triggers
 *
 * POST  - Apply a notoriety trigger to the character
 * PATCH - Reverse a previously applied notoriety trigger
 *
 * @see NotorietyTriggerData in lib/rules/module-payloads.ts
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import { applyNotorietyTrigger, reverseNotorietyTrigger } from "@/lib/rules/notoriety";
import type { NotorietyTriggerData } from "@/lib/rules/module-payloads";
import type { NotorietyTriggerRecord } from "@/lib/types";

/** Maximum length for session notes */
const MAX_NOTE_LENGTH = 500;

// =============================================================================
// REQUEST / RESPONSE TYPES
// =============================================================================

interface ApplyTriggerRequest {
  triggerId: string;
  triggerName: string;
  notorietyChange: number;
  source: string;
  page: number;
  sessionNote?: string;
}

interface ReverseTriggerRequest {
  recordId: string;
}

interface TriggerResponse {
  success: boolean;
  record?: NotorietyTriggerRecord;
  notoriety?: number;
  error?: string;
}

// =============================================================================
// POST — Apply a notoriety trigger
// =============================================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<TriggerResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    const body = (await request.json()) as ApplyTriggerRequest;
    const { triggerId, triggerName, notorietyChange, source, page } = body;

    if (
      typeof triggerId !== "string" ||
      !triggerId ||
      typeof triggerName !== "string" ||
      !triggerName ||
      typeof notorietyChange !== "number" ||
      typeof source !== "string" ||
      !source ||
      typeof page !== "number"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing or invalid required fields: triggerId, triggerName, notorietyChange, source, page",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(notorietyChange) || notorietyChange <= 0) {
      return NextResponse.json(
        { success: false, error: "notorietyChange must be a positive integer" },
        { status: 400 }
      );
    }

    const sessionNote =
      typeof body.sessionNote === "string" ? body.sessionNote.slice(0, MAX_NOTE_LENGTH) : undefined;

    const triggerData: NotorietyTriggerData = {
      id: triggerId,
      name: triggerName,
      description: "",
      notorietyChange,
      source,
      page,
    };

    const currentReputation = character.reputation ?? {
      streetCred: 0,
      notoriety: 0,
      publicAwareness: 0,
    };

    const result = applyNotorietyTrigger(currentReputation, triggerData, userId, sessionNote);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    await updateCharacterWithAudit(
      userId,
      characterId,
      { reputation: result.reputation },
      {
        action: "notoriety_trigger_applied",
        actor: { userId, role: "owner" },
        details: {
          triggerId,
          triggerName,
          notorietyChange,
          recordId: result.record.id,
        },
        note: sessionNote,
      }
    );

    return NextResponse.json({
      success: true,
      record: result.record,
      notoriety: result.reputation.notoriety,
    });
  } catch (error) {
    console.error("Failed to apply notoriety trigger:", error);
    return NextResponse.json(
      { success: false, error: "Failed to apply notoriety trigger" },
      { status: 500 }
    );
  }
}

// =============================================================================
// PATCH — Reverse a notoriety trigger
// =============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<TriggerResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { characterId } = await params;

    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    const body = (await request.json()) as ReverseTriggerRequest;
    const { recordId } = body;

    if (typeof recordId !== "string" || !recordId) {
      return NextResponse.json(
        { success: false, error: "Missing required field: recordId" },
        { status: 400 }
      );
    }

    const currentReputation = character.reputation ?? {
      streetCred: 0,
      notoriety: 0,
      publicAwareness: 0,
    };

    const result = reverseNotorietyTrigger(currentReputation, recordId, userId);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    await updateCharacterWithAudit(
      userId,
      characterId,
      { reputation: result.reputation },
      {
        action: "notoriety_trigger_reversed",
        actor: { userId, role: "owner" },
        details: {
          recordId,
          triggerId: result.record.triggerId,
          triggerName: result.record.triggerName,
          notorietyReduction: result.record.notorietyChange,
        },
      }
    );

    return NextResponse.json({
      success: true,
      record: result.record,
      notoriety: result.reputation.notoriety,
    });
  } catch (error) {
    console.error("Failed to reverse notoriety trigger:", error);
    return NextResponse.json(
      { success: false, error: "Failed to reverse notoriety trigger" },
      { status: 500 }
    );
  }
}
