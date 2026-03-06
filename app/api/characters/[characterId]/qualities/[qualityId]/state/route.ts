/**
 * API Route: /api/characters/[characterId]/qualities/[qualityId]/state
 *
 * PATCH - Update the dynamic state of a quality (e.g., addiction doses, allergy exposure)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, updateCharacter, updateQualityDynamicState } from "@/lib/storage/characters";
import { readJsonFile } from "@/lib/storage/base";
import { initializeDynamicState } from "@/lib/rules/qualities/dynamic-state";
import type { Quality, QualitySelection } from "@/lib/types";
import path from "path";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; qualityId: string }> }
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

    const { characterId, qualityId } = await params;

    // Get character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Parse body for state updates
    const data = await request.json();
    const updates = data.updates || data; // Flexible: handle both {updates: {...}} and {...}

    if (!updates || typeof updates !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid updates format" },
        { status: 400 }
      );
    }

    // Auto-initialize dynamicState if missing
    const allSelections = [
      ...(character.positiveQualities || []),
      ...(character.negativeQualities || []),
    ];
    const targetSelection = allSelections.find(
      (s) => (typeof s === "string" ? s : s.qualityId || s.id) === qualityId
    ) as QualitySelection | undefined;

    if (targetSelection && typeof targetSelection !== "string" && !targetSelection.dynamicState) {
      // Look up the catalog quality to initialize dynamic state
      const editionCode = character.editionCode;
      const bookPath = path.join(
        process.cwd(),
        "data",
        "editions",
        editionCode,
        "core-rulebook.json"
      );
      const bookData = await readJsonFile<Record<string, unknown>>(bookPath);
      const qualitiesModule = bookData?.modules as Record<string, unknown> | undefined;
      const qualitiesPayload = (qualitiesModule?.qualities as Record<string, unknown>)?.payload as
        | { positive?: Quality[]; negative?: Quality[] }
        | undefined;
      const allCatalog = [
        ...(qualitiesPayload?.positive || []),
        ...(qualitiesPayload?.negative || []),
      ];
      const catalogQuality = allCatalog.find((q) => q.id === qualityId);

      if (catalogQuality) {
        const initialState = initializeDynamicState(catalogQuality, targetSelection);
        if (initialState) {
          // Persist initialized state on the character
          const updateQualities = (selections: QualitySelection[]) =>
            selections.map((s) => {
              const sid = typeof s === "string" ? s : s.qualityId || s.id;
              if (sid === qualityId && typeof s !== "string") {
                return { ...s, dynamicState: initialState };
              }
              return s;
            });

          await updateCharacter(userId, characterId, {
            positiveQualities: updateQualities(character.positiveQualities || []),
            negativeQualities: updateQualities(character.negativeQualities || []),
          });
        }
      }
    }

    // Update quality dynamic state
    try {
      const updatedCharacter = await updateQualityDynamicState(
        userId,
        characterId,
        qualityId,
        updates
      );

      return NextResponse.json({
        success: true,
        character: updatedCharacter,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update quality state";
      return NextResponse.json({ success: false, error: errorMessage }, { status: 400 });
    }
  } catch (error) {
    console.error("Failed to update quality state:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to update quality state";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
