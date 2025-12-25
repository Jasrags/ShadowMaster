/**
 * API Route: /api/characters/[characterId]/favor-ledger
 *
 * GET - Get favor ledger with transaction history
 * POST - Record a new favor transaction
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getUserById } from "@/lib/storage/users";
import { getCharacter } from "@/lib/storage/characters";
import {
  getFavorLedger,
  addFavorTransaction,
  getContactTransactions,
} from "@/lib/storage/favor-ledger";
import type { CreateFavorTransactionRequest, FavorTransaction } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
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

    const { characterId } = await params;

    // Get character to verify ownership
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const contactId = searchParams.get("contactId");
    const sessionId = searchParams.get("sessionId");

    // Get favor ledger
    const ledger = await getFavorLedger(userId, characterId);

    // Get transactions with optional filters
    let transactions: FavorTransaction[];
    if (contactId) {
      transactions = await getContactTransactions(userId, characterId, contactId);
    } else {
      transactions = ledger.transactions;
    }

    // Filter by session if specified
    if (sessionId) {
      transactions = transactions.filter((t) => t.sessionId === sessionId);
    }

    return NextResponse.json({
      success: true,
      ledger,
      transactions,
      count: transactions.length,
    });
  } catch (error) {
    console.error("Failed to get favor ledger:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get favor ledger" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ characterId: string }> }
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

    const { characterId } = await params;

    // Get character
    const character = await getCharacter(userId, characterId);
    if (!character) {
      return NextResponse.json(
        { success: false, error: "Character not found" },
        { status: 404 }
      );
    }

    // Parse body
    const body = (await request.json()) as CreateFavorTransactionRequest;

    // Validate required fields
    if (!body.contactId) {
      return NextResponse.json(
        { success: false, error: "Contact ID is required" },
        { status: 400 }
      );
    }

    if (!body.type) {
      return NextResponse.json(
        { success: false, error: "Transaction type is required" },
        { status: 400 }
      );
    }

    if (body.favorChange === undefined || body.favorChange === null) {
      return NextResponse.json(
        { success: false, error: "Favor change is required" },
        { status: 400 }
      );
    }

    // Record transaction
    const transaction = await addFavorTransaction(userId, characterId, {
      contactId: body.contactId,
      type: body.type,
      description: body.description,
      favorChange: body.favorChange,
      loyaltyChange: body.loyaltyChange,
      connectionChange: body.connectionChange,
      nuyenSpent: body.nuyenSpent,
      karmaSpent: body.karmaSpent,
      serviceType: body.serviceType,
    });

    // Get updated ledger
    const ledger = await getFavorLedger(userId, characterId);

    return NextResponse.json(
      {
        success: true,
        transaction,
        ledger,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to record transaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record transaction" },
      { status: 500 }
    );
  }
}
