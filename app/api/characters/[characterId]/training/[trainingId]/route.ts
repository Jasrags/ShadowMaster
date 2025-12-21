/**
 * API Route: /api/characters/[characterId]/training/[trainingId]
 *
 * POST - Complete, interrupt, or resume a training period
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, updateCharacter } from "@/lib/storage/characters";
import {
  completeTraining,
  interruptTraining,
  resumeTraining,
} from "@/lib/rules/advancement";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; trainingId: string }> }
) {
  try {
    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const { characterId, trainingId } = await params;

    // Get character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    // Character must be active (not draft)
    if (character.status === "draft") {
      return NextResponse.json(
        { success: false, error: "Cannot manage training during character creation" },
        { status: 400 }
      );
    }

    // Parse body to determine action
    const body = await request.json();
    const { action, reason } = body;

    if (!action || typeof action !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid action (expected: 'complete', 'interrupt', or 'resume')" },
        { status: 400 }
      );
    }

    let result;
    let updatedCharacter: typeof character;

    try {
      switch (action) {
        case "complete": {
          const completionResult = completeTraining(character, trainingId);
          result = {
            completedTrainingPeriod: completionResult.completedTrainingPeriod,
            completedAdvancementRecord: completionResult.completedAdvancementRecord,
          };
          updatedCharacter = completionResult.updatedCharacter;
          break;
        }

        case "interrupt": {
          const interruptResult = interruptTraining(character, trainingId, reason);
          result = {
            interruptedTrainingPeriod: interruptResult.interruptedTrainingPeriod,
            updatedAdvancementRecord: interruptResult.updatedAdvancementRecord,
          };
          updatedCharacter = interruptResult.updatedCharacter;
          break;
        }

        case "resume": {
          const resumeResult = resumeTraining(character, trainingId);
          result = {
            resumedTrainingPeriod: resumeResult.resumedTrainingPeriod,
            updatedAdvancementRecord: resumeResult.updatedAdvancementRecord,
          };
          updatedCharacter = resumeResult.updatedCharacter;
          break;
        }

        default:
          return NextResponse.json(
            { success: false, error: `Invalid action: ${action}. Expected: 'complete', 'interrupt', or 'resume'` },
            { status: 400 }
          );
      }

      // Update character in storage
      const savedCharacter = await updateCharacter(userId, characterId, {
        attributes: updatedCharacter.attributes,
        skills: updatedCharacter.skills,
        advancementHistory: updatedCharacter.advancementHistory,
        activeTraining: updatedCharacter.activeTraining,
      });

      return NextResponse.json({
        success: true,
        character: savedCharacter,
        ...result,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : `Failed to ${action} training`;
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to manage training:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to manage training";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

