/**
 * API Route: /api/characters/[characterId]/matrix
 *
 * GET - Get character's matrix equipment and current state
 * PATCH - Update matrix state (load programs, reconfigure deck, etc.)
 *
 * Satisfies:
 * - Guarantee: "Matrix identity and presence MUST be authoritative"
 * - Requirement: "The system MUST enforce mandatory hardware-specific attribute requirements"
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, updateCharacterWithAudit } from "@/lib/storage/characters";
import type {
  MatrixEquipmentResponse,
  UpdateMatrixStateRequest,
  CharacterCyberdeck,
  CyberdeckAttributeConfig,
} from "@/lib/types/matrix";
import {
  validateCyberdeckConfig,
  getActiveCyberdeck,
  getCharacterCyberdecks,
  getCharacterCommlinks,
} from "@/lib/rules/matrix/cyberdeck-validator";

// =============================================================================
// GET - Get Matrix Equipment
// =============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<MatrixEquipmentResponse | { error: string }>> {
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

    // Get matrix equipment
    const cyberdecks = getCharacterCyberdecks(character);
    const commlinks = getCharacterCommlinks(character);
    const ownedPrograms = character.programs ?? [];

    // Determine loaded programs from active deck
    const activeDeck = getActiveCyberdeck(character);
    const loadedProgramIds = new Set(activeDeck?.loadedPrograms ?? []);

    // Map programs with loaded status
    const programs = ownedPrograms.map((p) => ({
      catalogId: p.catalogId,
      name: p.name ?? p.catalogId,
      category: p.category ?? "common",
      loaded: loadedProgramIds.has(p.catalogId),
    }));

    const response: MatrixEquipmentResponse = {
      cyberdecks,
      commlinks: commlinks.map((c) => ({
        id: c.id,
        catalogId: c.catalogId,
        name: c.name,
        customName: undefined,
        deviceRating: c.deviceRating,
        dataProcessing: c.deviceRating, // In SR5, commlink DP = device rating
        firewall: c.deviceRating, // In SR5, commlink FW = device rating
        cost: 0, // Not tracking cost here
        availability: 0,
        loadedPrograms: [],
      })),
      programs,
      // matrixState would come from session storage (not persisted to character)
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to get matrix equipment:", error);
    return NextResponse.json({ error: "Failed to get matrix equipment" }, { status: 500 });
  }
}

// =============================================================================
// PATCH - Update Matrix State
// =============================================================================

interface PatchResponse {
  success: boolean;
  cyberdecks?: CharacterCyberdeck[];
  error?: string;
  validationErrors?: string[];
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
): Promise<NextResponse<PatchResponse>> {
  try {
    const { characterId } = await params;

    // Check authentication
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Get the character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json({ success: false, error: "Character not found" }, { status: 404 });
    }

    // Check ownership
    if (character.ownerId !== userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized to modify this character" },
        { status: 403 }
      );
    }

    // Parse request
    const body: UpdateMatrixStateRequest = await request.json();
    const updates: Partial<typeof character> = {};
    const auditDetails: Record<string, unknown> = {};

    // Handle deck configuration
    if (body.deckConfig) {
      const activeDeck = getActiveCyberdeck(character);
      if (!activeDeck) {
        return NextResponse.json(
          { success: false, error: "No active cyberdeck to configure" },
          { status: 400 }
        );
      }

      // Validate the configuration
      const validation = validateCyberdeckConfig(body.deckConfig, activeDeck.attributeArray);

      if (!validation.valid) {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid deck configuration",
            validationErrors: validation.errors.map((e) => e.message),
          },
          { status: 400 }
        );
      }

      // Update the deck's current config
      const updatedDecks = (character.cyberdecks ?? []).map((deck) => {
        if (deck.id === activeDeck.id || deck.catalogId === activeDeck.catalogId) {
          return {
            ...deck,
            currentConfig: body.deckConfig as CyberdeckAttributeConfig,
          };
        }
        return deck;
      });

      updates.cyberdecks = updatedDecks;
      auditDetails.deckConfigChange = {
        deckId: activeDeck.id ?? activeDeck.catalogId,
        previousConfig: activeDeck.currentConfig,
        newConfig: body.deckConfig,
      };
    }

    // Handle program loading
    if (body.loadPrograms && body.loadPrograms.length > 0) {
      const activeDeck = getActiveCyberdeck(character);
      if (!activeDeck) {
        return NextResponse.json(
          { success: false, error: "No active cyberdeck to load programs" },
          { status: 400 }
        );
      }

      const currentLoaded = new Set(activeDeck.loadedPrograms);
      const toLoad = body.loadPrograms.filter((id) => !currentLoaded.has(id));

      // Check slot limit
      const totalAfterLoad = currentLoaded.size + toLoad.length;
      if (totalAfterLoad > activeDeck.programSlots) {
        return NextResponse.json(
          {
            success: false,
            error: `Cannot load ${toLoad.length} programs. Only ${activeDeck.programSlots - currentLoaded.size} slots available.`,
          },
          { status: 400 }
        );
      }

      // Add programs to loaded list
      const newLoadedPrograms = [...activeDeck.loadedPrograms, ...toLoad];

      const updatedDecks = (character.cyberdecks ?? []).map((deck) => {
        if (deck.id === activeDeck.id || deck.catalogId === activeDeck.catalogId) {
          return {
            ...deck,
            loadedPrograms: newLoadedPrograms,
          };
        }
        return deck;
      });

      updates.cyberdecks = updatedDecks;
      auditDetails.programsLoaded = toLoad;
    }

    // Handle program unloading
    if (body.unloadPrograms && body.unloadPrograms.length > 0) {
      const activeDeck = getActiveCyberdeck(character);
      if (!activeDeck) {
        return NextResponse.json({ success: false, error: "No active cyberdeck" }, { status: 400 });
      }

      const toUnload = new Set(body.unloadPrograms);
      const newLoadedPrograms = activeDeck.loadedPrograms.filter((id) => !toUnload.has(id));

      const updatedDecks = (character.cyberdecks ?? []).map((deck) => {
        if (deck.id === activeDeck.id || deck.catalogId === activeDeck.catalogId) {
          return {
            ...deck,
            loadedPrograms: newLoadedPrograms,
          };
        }
        return deck;
      });

      updates.cyberdecks = updatedDecks;
      auditDetails.programsUnloaded = body.unloadPrograms;
    }

    // Apply updates if any
    if (Object.keys(updates).length > 0) {
      await updateCharacterWithAudit(character.ownerId, characterId, updates, {
        action: "updated",
        actor: {
          userId,
          role: "owner",
        },
        details: auditDetails,
        note: "Matrix equipment configuration updated",
      });
    }

    // Return updated cyberdecks
    const updatedCharacter = await getCharacter(userId, characterId);
    return NextResponse.json({
      success: true,
      cyberdecks: updatedCharacter?.cyberdecks,
    });
  } catch (error) {
    console.error("Failed to update matrix state:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update matrix state" },
      { status: 500 }
    );
  }
}
