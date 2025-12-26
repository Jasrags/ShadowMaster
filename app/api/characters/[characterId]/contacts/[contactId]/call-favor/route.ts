/**
 * API Route: /api/characters/[characterId]/contacts/[contactId]/call-favor
 *
 * POST - Call a favor from a contact
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter, saveCharacter } from "@/lib/storage/characters";
import {
  getCharacterContact,
  updateCharacterContact,
  burnContact,
} from "@/lib/storage/contacts";
import { addFavorTransaction } from "@/lib/storage/favor-ledger";
import { loadAndMergeRuleset } from "@/lib/rules/merge";
import {
  canCallFavor,
  resolveFavorCall,
  calculateFavorCost,
  getAvailableServices,
} from "@/lib/rules/favors";
import type { FavorServiceDefinition } from "@/lib/types";

interface CallFavorRequest {
  serviceId: string;
  diceRoll: number;
  opposingRoll?: number;
  rushJob?: boolean;
  notes?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; contactId: string }> }
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

    const { characterId, contactId } = await params;

    // Get character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    // Get contact
    const contact = await getCharacterContact(userId, characterId, contactId);
    if (!contact) {
      return NextResponse.json(
        { success: false, error: "Contact not found" },
        { status: 404 }
      );
    }

    // Parse body
    const body = (await request.json()) as CallFavorRequest;
    const { serviceId, diceRoll, opposingRoll, rushJob, notes } = body;

    if (!serviceId) {
      return NextResponse.json(
        { success: false, error: "Service ID is required" },
        { status: 400 }
      );
    }

    if (typeof diceRoll !== "number" || diceRoll < 0) {
      return NextResponse.json(
        { success: false, error: "Dice roll must be a non-negative number" },
        { status: 400 }
      );
    }

    // Load ruleset for service definitions
    const mergeResult = await loadAndMergeRuleset(
      character.editionCode,
      character.attachedBookIds
    );

    if (!mergeResult.success || !mergeResult.ruleset) {
      return NextResponse.json(
        { success: false, error: mergeResult.error || "Failed to load ruleset" },
        { status: 500 }
      );
    }

    // Get favor services from ruleset modules
    // Note: This will be populated in Phase 6 (Ruleset Data)
    const favorServicesModule = mergeResult.ruleset.modules?.favorServices as
      | { services?: FavorServiceDefinition[] }
      | undefined;
    const favorServices: FavorServiceDefinition[] =
      favorServicesModule?.services || [];

    // Find the requested service
    const service = favorServices.find((s) => s.id === serviceId);
    if (!service) {
      return NextResponse.json(
        { success: false, error: `Service '${serviceId}' not found` },
        { status: 404 }
      );
    }

    // Check if contact can provide this service
    const availableServices = getAvailableServices(contact, favorServices);
    if (!availableServices.find((s) => s.id === serviceId)) {
      return NextResponse.json(
        {
          success: false,
          error: `Contact ${contact.name} cannot provide service '${service.name}'`,
        },
        { status: 400 }
      );
    }

    // Check prerequisites
    const prereqCheck = canCallFavor(contact, service, character);
    if (!prereqCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Cannot call favor",
          reasons: prereqCheck.reasons,
          warnings: prereqCheck.warnings,
        },
        { status: 400 }
      );
    }

    // Calculate costs
    const costs = calculateFavorCost(service, contact, character, rushJob);

    // Resolve the favor call
    const resolution = resolveFavorCall(
      contact,
      service,
      character,
      diceRoll,
      opposingRoll
    );

    // Apply resource costs
    const updatedCharacter = { ...character };

    if (costs.nuyenCost > 0) {
      updatedCharacter.nuyen = Math.max(0, updatedCharacter.nuyen - costs.nuyenCost);
    }

    if (costs.karmaCost > 0) {
      updatedCharacter.karmaCurrent = Math.max(
        0,
        updatedCharacter.karmaCurrent - costs.karmaCost
      );
    }

    // Save updated character
    await saveCharacter(updatedCharacter);

    // Update contact based on resolution
    let updatedContact = { ...contact };

    // Apply favor balance change
    updatedContact.favorBalance -= resolution.favorConsumed;

    // Apply loyalty change
    if (resolution.loyaltyChange !== 0) {
      updatedContact.loyalty = Math.max(
        1,
        Math.min(6, updatedContact.loyalty + resolution.loyaltyChange)
      );
    }

    updatedContact.lastContactedAt = new Date().toISOString();

    // Handle burn case
    if (resolution.burned) {
      updatedContact = await burnContact(
        userId,
        characterId,
        contactId,
        resolution.burnReason || "Contact burned due to failed favor"
      );
    } else {
      updatedContact = await updateCharacterContact(userId, characterId, contactId, {
        favorBalance: updatedContact.favorBalance,
        loyalty: updatedContact.loyalty,
        lastContactedAt: updatedContact.lastContactedAt,
      });
    }

    // Record transaction
    const transaction = await addFavorTransaction(userId, characterId, {
      contactId,
      type: resolution.success ? "favor_called" : "favor_failed",
      favorChange: -resolution.favorConsumed,
      serviceId,
      nuyenSpent: costs.nuyenCost,
      karmaSpent: costs.karmaCost,
      rollResult: diceRoll,
      success: resolution.success,
      description: `${service.name}: ${resolution.serviceResult}${notes ? ` - ${notes}` : ""}`,
    });

    return NextResponse.json({
      success: true,
      resolution: {
        success: resolution.success,
        netHits: resolution.netHits,
        serviceResult: resolution.serviceResult,
        glitch: resolution.glitch,
        criticalGlitch: resolution.criticalGlitch,
        burned: resolution.burned,
        burnReason: resolution.burnReason,
      },
      costs: {
        favor: resolution.favorConsumed,
        nuyen: costs.nuyenCost,
        karma: costs.karmaCost,
      },
      contact: updatedContact,
      transaction,
      warnings: prereqCheck.warnings,
    });
  } catch (error) {
    console.error("Failed to call favor:", error);
    return NextResponse.json(
      { success: false, error: "Failed to call favor" },
      { status: 500 }
    );
  }
}
