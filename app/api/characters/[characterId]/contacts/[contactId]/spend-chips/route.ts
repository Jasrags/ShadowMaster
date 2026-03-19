/**
 * API Route: /api/characters/[characterId]/contacts/[contactId]/spend-chips
 *
 * POST - Spend chips for dice bonus or loyalty improvement
 *
 * Actions:
 * - dice-bonus: Spend chips for +1 die per chip (max +4)
 * - loyalty-improvement: Spend chips + downtime to increase loyalty by 1
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import { getCharacterContact, updateCharacterContact } from "@/lib/storage/contacts";
import { addFavorTransaction } from "@/lib/storage/favor-ledger";
import { calculateChipDiceBonus, calculateLoyaltyImprovementCost } from "@/lib/rules/chips";
import { getChipCostModifier } from "@/lib/rules/relationship-qualities";
import { canOrganizationCallFavor } from "@/lib/rules/group-contacts";
import type { SocialContact } from "@/lib/types/contacts";
import type { SpendChipsRequest, SpendChipsResponse } from "@/lib/types/contacts";

/** Maximum chips that can be spent for a dice bonus (Run Faster p. 177) */
const MAX_CHIPS_FOR_DICE_BONUS = 4;

/** Maximum length for user-provided notes */
const MAX_NOTES_LENGTH = 500;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string; contactId: string }> }
): Promise<NextResponse<SpendChipsResponse>> {
  try {
    const userId = await getSession();
    if (!userId) {
      return NextResponse.json(
        { success: false, chipsSpent: 0, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, chipsSpent: 0, error: "User not found" },
        { status: 404 }
      );
    }

    const { characterId, contactId } = await params;

    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, chipsSpent: 0, error: "Character not found" },
        { status: 404 }
      );
    }

    const contact = await getCharacterContact(userId, characterId, contactId);
    if (!contact) {
      return NextResponse.json(
        { success: false, chipsSpent: 0, error: "Contact not found" },
        { status: 404 }
      );
    }

    // Organization contacts cannot use chips
    const orgCheck = canOrganizationCallFavor(contact);
    if (!orgCheck.allowed) {
      return NextResponse.json(
        { success: false, chipsSpent: 0, error: orgCheck.reason },
        { status: 400 }
      );
    }

    const body = (await request.json()) as SpendChipsRequest;
    const { action, chipsToSpend, targetLoyalty } = body;
    const notes =
      typeof body.notes === "string" ? body.notes.slice(0, MAX_NOTES_LENGTH) : undefined;

    if (action === "dice-bonus") {
      return handleDiceBonus(userId, characterId, contactId, contact, chipsToSpend, notes);
    }

    if (action === "loyalty-improvement") {
      return handleLoyaltyImprovement(
        userId,
        characterId,
        contactId,
        contact,
        targetLoyalty,
        notes
      );
    }

    return NextResponse.json(
      {
        success: false,
        chipsSpent: 0,
        error: "Invalid action. Must be 'dice-bonus' or 'loyalty-improvement'",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Failed to spend chips:", error);
    return NextResponse.json(
      { success: false, chipsSpent: 0, error: "Failed to spend chips" },
      { status: 500 }
    );
  }
}

async function handleDiceBonus(
  userId: string,
  characterId: string,
  contactId: string,
  contact: SocialContact,
  chipsToSpend: number | undefined,
  notes: string | undefined
): Promise<NextResponse<SpendChipsResponse>> {
  if (
    chipsToSpend === undefined ||
    chipsToSpend === null ||
    !Number.isInteger(chipsToSpend) ||
    chipsToSpend <= 0
  ) {
    return NextResponse.json(
      { success: false, chipsSpent: 0, error: "chipsToSpend must be a positive integer" },
      { status: 400 }
    );
  }

  if (chipsToSpend > MAX_CHIPS_FOR_DICE_BONUS) {
    return NextResponse.json(
      {
        success: false,
        chipsSpent: 0,
        error: `Cannot spend more than ${MAX_CHIPS_FOR_DICE_BONUS} chips for a dice bonus`,
      },
      { status: 400 }
    );
  }

  if (contact.favorBalance < chipsToSpend) {
    return NextResponse.json(
      {
        success: false,
        chipsSpent: 0,
        error: `Insufficient chip balance: have ${contact.favorBalance}, need ${chipsToSpend}`,
      },
      { status: 400 }
    );
  }

  const diceBonus = calculateChipDiceBonus(chipsToSpend);
  const newBalance = contact.favorBalance - chipsToSpend;

  const updatedContact = await updateCharacterContact(userId, characterId, contactId, {
    favorBalance: newBalance,
    lastContactedAt: new Date().toISOString(),
  });

  const transaction = await addFavorTransaction(userId, characterId, {
    contactId,
    type: "chip_spent_dice_bonus",
    favorChange: -chipsToSpend,
    description: `Spent ${chipsToSpend} chip(s) for +${diceBonus} dice bonus${notes ? ` — ${notes}` : ""}`,
  });

  return NextResponse.json({
    success: true,
    diceBonus,
    chipsSpent: chipsToSpend,
    contact: updatedContact,
    transaction,
  });
}

async function handleLoyaltyImprovement(
  userId: string,
  characterId: string,
  contactId: string,
  contact: SocialContact,
  targetLoyalty: number | undefined,
  notes: string | undefined
): Promise<NextResponse<SpendChipsResponse>> {
  if (targetLoyalty === undefined || targetLoyalty === null) {
    return NextResponse.json(
      { success: false, chipsSpent: 0, error: "targetLoyalty is required" },
      { status: 400 }
    );
  }

  // Check if loyalty improvement is blocked (via Intimidation)
  if (contact.loyaltyImprovementBlocked) {
    return NextResponse.json(
      {
        success: false,
        chipsSpent: 0,
        error: "Loyalty improvement is permanently blocked for this contact (Intimidation used)",
      },
      { status: 400 }
    );
  }

  // Calculate base cost
  const costResult = calculateLoyaltyImprovementCost(contact.loyalty, targetLoyalty);
  if (!costResult.valid) {
    return NextResponse.json(
      { success: false, chipsSpent: 0, error: costResult.reason },
      { status: 400 }
    );
  }

  // Apply family discount via quality modifier
  const qualities = contact.relationshipQualities ?? [];
  const qualityAdj = getChipCostModifier(costResult.chipsRequired, qualities);
  const adjustedChipCost = qualityAdj.adjustedCost;

  if (contact.favorBalance < adjustedChipCost) {
    return NextResponse.json(
      {
        success: false,
        chipsSpent: 0,
        error: `Insufficient chip balance: have ${contact.favorBalance}, need ${adjustedChipCost}`,
      },
      { status: 400 }
    );
  }

  const newBalance = contact.favorBalance - adjustedChipCost;

  const updatedContact = await updateCharacterContact(userId, characterId, contactId, {
    favorBalance: newBalance,
    loyalty: targetLoyalty,
    lastContactedAt: new Date().toISOString(),
  });

  const transaction = await addFavorTransaction(userId, characterId, {
    contactId,
    type: "chip_spent_loyalty",
    favorChange: -adjustedChipCost,
    loyaltyChange: 1,
    description: `Spent ${adjustedChipCost} chip(s) to improve loyalty ${contact.loyalty} → ${targetLoyalty}${adjustedChipCost !== costResult.chipsRequired ? ` (${qualityAdj.reason})` : ""}${notes ? ` — ${notes}` : ""}`,
  });

  return NextResponse.json({
    success: true,
    newLoyalty: targetLoyalty,
    chipsSpent: adjustedChipCost,
    contact: updatedContact,
    transaction,
  });
}
