/**
 * Favor Ledger storage layer
 *
 * File-based storage for favor transactions and ledgers.
 * Ledgers are stored per character at: data/characters/{userId}/{characterId}/favor-ledger.json
 *
 * The ledger is append-only to maintain full audit trail.
 *
 * Capability References:
 * - "The 'Favor Ledger' MUST be persistent and auditable"
 * - "Social capital 'records' MUST be persistent and verifiable throughout a campaign's lifecycle"
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { ID } from "../types";
import type {
  FavorLedger,
  FavorTransaction,
  FavorTransactionType,
  CreateFavorTransactionRequest,
} from "../types/contacts";
import { ensureDirectory, readJsonFile, writeJsonFile } from "./base";

// =============================================================================
// PATH UTILITIES
// =============================================================================

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Get the directory for a character's additional data
 */
function getCharacterDataDir(userId: ID, characterId: ID): string {
  return path.join(DATA_DIR, "characters", userId, characterId);
}

/**
 * Get the favor ledger file path for a character
 */
function getFavorLedgerPath(userId: ID, characterId: ID): string {
  return path.join(getCharacterDataDir(userId, characterId), "favor-ledger.json");
}

// =============================================================================
// LEDGER OPERATIONS
// =============================================================================

/**
 * Get or create favor ledger for a character
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @returns Favor ledger (created if doesn't exist)
 */
export async function getFavorLedger(userId: ID, characterId: ID): Promise<FavorLedger> {
  const filePath = getFavorLedgerPath(userId, characterId);
  const ledger = await readJsonFile<FavorLedger>(filePath);

  if (ledger) {
    return ledger;
  }

  // Create new ledger if it doesn't exist
  return initializeFavorLedger(userId, characterId);
}

/**
 * Initialize a new favor ledger for a character
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @returns New favor ledger
 */
export async function initializeFavorLedger(userId: ID, characterId: ID): Promise<FavorLedger> {
  const dir = getCharacterDataDir(userId, characterId);
  await ensureDirectory(dir);

  const now = new Date().toISOString();

  const ledger: FavorLedger = {
    characterId,
    transactions: [],
    totalFavorsCalled: 0,
    totalFavorsOwed: 0,
    totalNuyenSpent: 0,
    totalKarmaSpent: 0,
    burnedContactsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const filePath = getFavorLedgerPath(userId, characterId);
  await writeJsonFile(filePath, ledger);

  return ledger;
}

/**
 * Add a favor transaction to the ledger
 *
 * This is an append-only operation - transactions are never modified or deleted.
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param request - Transaction data
 * @returns Created transaction
 */
export async function addFavorTransaction(
  userId: ID,
  characterId: ID,
  request: Omit<CreateFavorTransactionRequest, "contactId"> & {
    contactId: ID;
    campaignId?: ID;
    sessionId?: ID;
    serviceId?: string;
    serviceRisk?: "trivial" | "low" | "medium" | "high" | "extreme";
    thresholdRequired?: number;
    rollResult?: number;
    netHits?: number;
    success?: boolean;
    requiresGmApproval?: boolean;
  }
): Promise<FavorTransaction> {
  const ledger = await getFavorLedger(userId, characterId);
  const now = new Date().toISOString();

  const transaction: FavorTransaction = {
    id: uuidv4(),
    characterId,
    contactId: request.contactId,
    campaignId: request.campaignId,
    sessionId: request.sessionId,
    type: request.type,
    description: request.description,
    favorChange: request.favorChange,
    loyaltyChange: request.loyaltyChange,
    connectionChange: request.connectionChange,
    nuyenSpent: request.nuyenSpent,
    karmaSpent: request.karmaSpent,
    serviceType: request.serviceType,
    serviceId: request.serviceId,
    serviceRisk: request.serviceRisk,
    thresholdRequired: request.thresholdRequired,
    rollResult: request.rollResult,
    netHits: request.netHits,
    success: request.success,
    requiresGmApproval: request.requiresGmApproval ?? false,
    timestamp: now,
  };

  // Append transaction to ledger
  const updatedLedger: FavorLedger = {
    ...ledger,
    transactions: [...ledger.transactions, transaction],
    updatedAt: now,
  };

  // Update aggregates
  recalculateAggregatesInPlace(updatedLedger);

  const filePath = getFavorLedgerPath(userId, characterId);
  await writeJsonFile(filePath, updatedLedger);

  return transaction;
}

/**
 * Get all transactions for a specific contact
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param contactId - Contact ID
 * @returns Transactions involving the contact
 */
export async function getContactTransactions(
  userId: ID,
  characterId: ID,
  contactId: ID
): Promise<FavorTransaction[]> {
  const ledger = await getFavorLedger(userId, characterId);
  return ledger.transactions.filter((t) => t.contactId === contactId);
}

/**
 * Get all transactions for a specific campaign session
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param sessionId - Session ID
 * @returns Transactions from the session
 */
export async function getSessionTransactions(
  userId: ID,
  characterId: ID,
  sessionId: ID
): Promise<FavorTransaction[]> {
  const ledger = await getFavorLedger(userId, characterId);
  return ledger.transactions.filter((t) => t.sessionId === sessionId);
}

/**
 * Get transactions by type
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param type - Transaction type
 * @returns Transactions of the specified type
 */
export async function getTransactionsByType(
  userId: ID,
  characterId: ID,
  type: FavorTransactionType
): Promise<FavorTransaction[]> {
  const ledger = await getFavorLedger(userId, characterId);
  return ledger.transactions.filter((t) => t.type === type);
}

/**
 * Get transactions within a date range
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param startDate - Start of date range (inclusive)
 * @param endDate - End of date range (inclusive)
 * @returns Transactions within the range
 */
export async function getTransactionsByDateRange(
  userId: ID,
  characterId: ID,
  startDate: string,
  endDate: string
): Promise<FavorTransaction[]> {
  const ledger = await getFavorLedger(userId, characterId);
  return ledger.transactions.filter((t) => {
    return t.timestamp >= startDate && t.timestamp <= endDate;
  });
}

/**
 * Get pending GM approval transactions for a campaign
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param campaignId - Campaign ID
 * @returns Transactions awaiting approval
 */
export async function getPendingApprovals(
  userId: ID,
  characterId: ID,
  campaignId?: ID
): Promise<FavorTransaction[]> {
  const ledger = await getFavorLedger(userId, characterId);
  return ledger.transactions.filter((t) => {
    const matchesCampaign = campaignId ? t.campaignId === campaignId : true;
    return t.requiresGmApproval && t.gmApproved === undefined && matchesCampaign;
  });
}

/**
 * Approve a favor transaction (GM action)
 *
 * Note: This modifies an existing transaction, which is an exception to
 * the append-only rule for approval workflow support.
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param transactionId - Transaction ID
 * @param gmUserId - GM user ID
 * @returns Updated transaction
 */
export async function approveFavorTransaction(
  userId: ID,
  characterId: ID,
  transactionId: ID,
  gmUserId: ID
): Promise<FavorTransaction> {
  const ledger = await getFavorLedger(userId, characterId);
  const now = new Date().toISOString();

  const transactionIndex = ledger.transactions.findIndex((t) => t.id === transactionId);

  if (transactionIndex === -1) {
    throw new Error(`Transaction ${transactionId} not found`);
  }

  const transaction = ledger.transactions[transactionIndex];

  if (!transaction.requiresGmApproval) {
    throw new Error(`Transaction ${transactionId} does not require approval`);
  }

  if (transaction.gmApproved !== undefined) {
    throw new Error(`Transaction ${transactionId} has already been processed`);
  }

  const updatedTransaction: FavorTransaction = {
    ...transaction,
    gmApproved: true,
    gmApprovedBy: gmUserId,
    gmApprovedAt: now,
  };

  ledger.transactions[transactionIndex] = updatedTransaction;
  ledger.updatedAt = now;

  const filePath = getFavorLedgerPath(userId, characterId);
  await writeJsonFile(filePath, ledger);

  return updatedTransaction;
}

/**
 * Reject a favor transaction (GM action)
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param transactionId - Transaction ID
 * @param gmUserId - GM user ID
 * @param reason - Rejection reason
 * @returns Updated transaction
 */
export async function rejectFavorTransaction(
  userId: ID,
  characterId: ID,
  transactionId: ID,
  gmUserId: ID,
  reason: string
): Promise<FavorTransaction> {
  const ledger = await getFavorLedger(userId, characterId);
  const now = new Date().toISOString();

  const transactionIndex = ledger.transactions.findIndex((t) => t.id === transactionId);

  if (transactionIndex === -1) {
    throw new Error(`Transaction ${transactionId} not found`);
  }

  const transaction = ledger.transactions[transactionIndex];

  if (!transaction.requiresGmApproval) {
    throw new Error(`Transaction ${transactionId} does not require approval`);
  }

  if (transaction.gmApproved !== undefined) {
    throw new Error(`Transaction ${transactionId} has already been processed`);
  }

  const updatedTransaction: FavorTransaction = {
    ...transaction,
    gmApproved: false,
    gmApprovedBy: gmUserId,
    gmApprovedAt: now,
    rejectionReason: reason,
  };

  ledger.transactions[transactionIndex] = updatedTransaction;
  ledger.updatedAt = now;

  const filePath = getFavorLedgerPath(userId, characterId);
  await writeJsonFile(filePath, ledger);

  return updatedTransaction;
}

/**
 * Recalculate aggregate statistics for a ledger
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @returns Updated ledger with recalculated aggregates
 */
export async function recalculateAggregates(userId: ID, characterId: ID): Promise<FavorLedger> {
  const ledger = await getFavorLedger(userId, characterId);
  const now = new Date().toISOString();

  recalculateAggregatesInPlace(ledger);
  ledger.updatedAt = now;

  const filePath = getFavorLedgerPath(userId, characterId);
  await writeJsonFile(filePath, ledger);

  return ledger;
}

// =============================================================================
// QUERY HELPERS
// =============================================================================

/**
 * Calculate current favor balance with a specific contact
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param contactId - Contact ID
 * @returns Current favor balance (positive = contact owes, negative = character owes)
 */
export async function getContactFavorBalance(
  userId: ID,
  characterId: ID,
  contactId: ID
): Promise<number> {
  const transactions = await getContactTransactions(userId, characterId, contactId);

  // Only count approved transactions for balance
  return transactions
    .filter((t) => !t.requiresGmApproval || t.gmApproved === true)
    .reduce((balance, t) => balance + (t.favorChange || 0), 0);
}

/**
 * Get summary statistics for a character's social interactions
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @returns Summary statistics
 */
export async function getFavorStatistics(
  userId: ID,
  characterId: ID
): Promise<{
  totalTransactions: number;
  totalFavorsCalled: number;
  totalFavorsOwed: number;
  totalNuyenSpent: number;
  totalKarmaSpent: number;
  burnedContactsCount: number;
  pendingApprovals: number;
  mostActiveContact?: { contactId: ID; transactionCount: number };
}> {
  const ledger = await getFavorLedger(userId, characterId);

  // Count transactions per contact
  const contactTransactionCounts: Record<ID, number> = {};
  for (const t of ledger.transactions) {
    contactTransactionCounts[t.contactId] = (contactTransactionCounts[t.contactId] || 0) + 1;
  }

  // Find most active contact
  let mostActiveContact: { contactId: ID; transactionCount: number } | undefined;
  for (const [contactId, count] of Object.entries(contactTransactionCounts)) {
    if (!mostActiveContact || count > mostActiveContact.transactionCount) {
      mostActiveContact = { contactId, transactionCount: count };
    }
  }

  const pendingApprovals = ledger.transactions.filter(
    (t) => t.requiresGmApproval && t.gmApproved === undefined
  ).length;

  return {
    totalTransactions: ledger.transactions.length,
    totalFavorsCalled: ledger.totalFavorsCalled,
    totalFavorsOwed: ledger.totalFavorsOwed,
    totalNuyenSpent: ledger.totalNuyenSpent,
    totalKarmaSpent: ledger.totalKarmaSpent,
    burnedContactsCount: ledger.burnedContactsCount,
    pendingApprovals,
    mostActiveContact,
  };
}

// =============================================================================
// INTERNAL HELPERS
// =============================================================================

/**
 * Recalculate aggregates in place (mutates the ledger object)
 */
function recalculateAggregatesInPlace(ledger: FavorLedger): void {
  let totalFavorsCalled = 0;
  let totalFavorsOwed = 0;
  let totalNuyenSpent = 0;
  let totalKarmaSpent = 0;
  let burnedContactsCount = 0;

  for (const t of ledger.transactions) {
    // Only count approved transactions
    if (t.requiresGmApproval && t.gmApproved !== true) {
      continue;
    }

    // Favors called vs owed
    if (t.type === "favor_called" || t.type === "favor_granted") {
      if (t.favorChange < 0) {
        totalFavorsOwed += Math.abs(t.favorChange);
      } else {
        totalFavorsCalled += t.favorChange;
      }
    }

    // Resource spending
    totalNuyenSpent += t.nuyenSpent || 0;
    totalKarmaSpent += t.karmaSpent || 0;

    // Burned contacts
    if (t.type === "contact_burned") {
      burnedContactsCount++;
    }
  }

  ledger.totalFavorsCalled = totalFavorsCalled;
  ledger.totalFavorsOwed = totalFavorsOwed;
  ledger.totalNuyenSpent = totalNuyenSpent;
  ledger.totalKarmaSpent = totalKarmaSpent;
  ledger.burnedContactsCount = burnedContactsCount;
}
