/**
 * Social Capital storage layer
 *
 * Tracks and manages social capital budgets for characters.
 * Social capital data is stored at: data/characters/{userId}/{characterId}/social-capital.json
 *
 * Capability References:
 * - "Allocation of social capital MUST be constrained by character-specific influence budgets"
 * - "The mechanical consequences of social actions MUST be automatically propagated"
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import path from "path";
import type { ID } from "../types";
import type { SocialCapital, ContactStatus } from "../types/contacts";
import { ensureDirectory, readJsonFile, writeJsonFile } from "./base";
import { getCharacterContacts, calculateContactPoints } from "./contacts";

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
 * Get the social capital file path for a character
 */
function getSocialCapitalPath(userId: ID, characterId: ID): string {
  return path.join(getCharacterDataDir(userId, characterId), "social-capital.json");
}

// =============================================================================
// SOCIAL CAPITAL OPERATIONS
// =============================================================================

/**
 * Get social capital for a character
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @returns Social capital data or null if not initialized
 */
export async function getSocialCapital(userId: ID, characterId: ID): Promise<SocialCapital | null> {
  const filePath = getSocialCapitalPath(userId, characterId);
  return readJsonFile<SocialCapital>(filePath);
}

/**
 * Get or initialize social capital for a character
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param maxPoints - Maximum contact points (if initializing)
 * @returns Social capital data
 */
export async function getOrInitializeSocialCapital(
  userId: ID,
  characterId: ID,
  maxPoints?: number
): Promise<SocialCapital> {
  const existing = await getSocialCapital(userId, characterId);

  if (existing) {
    return existing;
  }

  return initializeSocialCapital(userId, characterId, maxPoints ?? 0);
}

/**
 * Initialize social capital for a character
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param maxPoints - Maximum contact points available
 * @returns Initialized social capital
 */
export async function initializeSocialCapital(
  userId: ID,
  characterId: ID,
  maxPoints: number
): Promise<SocialCapital> {
  const dir = getCharacterDataDir(userId, characterId);
  await ensureDirectory(dir);

  const now = new Date().toISOString();

  // Calculate current usage from existing contacts
  const contacts = await getCharacterContacts(userId, characterId);

  const activeContacts = contacts.filter((c) => c.status === "active");
  const burnedContacts = contacts.filter((c) => c.status === "burned");
  const inactiveContacts = contacts.filter(
    (c) => c.status === "inactive" || c.status === "missing"
  );

  const usedPoints = activeContacts.reduce((sum, c) => sum + calculateContactPoints(c), 0);

  const socialCapital: SocialCapital = {
    characterId,
    maxContactPoints: maxPoints,
    usedContactPoints: usedPoints,
    availableContactPoints: Math.max(0, maxPoints - usedPoints),
    totalContacts: contacts.length,
    activeContacts: activeContacts.length,
    burnedContacts: burnedContacts.length,
    inactiveContacts: inactiveContacts.length,
    networkingBonus: 0,
    socialLimitModifier: 0,
    loyaltyBonus: 0,
    updatedAt: now,
  };

  const filePath = getSocialCapitalPath(userId, characterId);
  await writeJsonFile(filePath, socialCapital);

  return socialCapital;
}

/**
 * Update social capital settings
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param updates - Partial updates to social capital
 * @returns Updated social capital
 */
export async function updateSocialCapital(
  userId: ID,
  characterId: ID,
  updates: Partial<SocialCapital>
): Promise<SocialCapital> {
  const existing = await getSocialCapital(userId, characterId);

  if (!existing) {
    throw new Error(`Social capital not initialized for character ${characterId}`);
  }

  const updatedSocialCapital: SocialCapital = {
    ...existing,
    ...updates,
    characterId, // Prevent changing characterId
    updatedAt: new Date().toISOString(),
  };

  // Recalculate available points if max or used changed
  if (updates.maxContactPoints !== undefined || updates.usedContactPoints !== undefined) {
    updatedSocialCapital.availableContactPoints = Math.max(
      0,
      updatedSocialCapital.maxContactPoints - updatedSocialCapital.usedContactPoints
    );
  }

  const filePath = getSocialCapitalPath(userId, characterId);
  await writeJsonFile(filePath, updatedSocialCapital);

  return updatedSocialCapital;
}

/**
 * Recalculate social capital from current contacts
 *
 * Call this after contact changes to ensure accurate tracking.
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @returns Updated social capital
 */
export async function recalculateSocialCapital(
  userId: ID,
  characterId: ID
): Promise<SocialCapital> {
  const existing = await getSocialCapital(userId, characterId);
  const contacts = await getCharacterContacts(userId, characterId);

  const now = new Date().toISOString();

  // Count contacts by status
  const statusCounts: Record<ContactStatus, number> = {
    active: 0,
    burned: 0,
    inactive: 0,
    missing: 0,
    deceased: 0,
  };

  for (const contact of contacts) {
    statusCounts[contact.status]++;
  }

  // Calculate used points (only active contacts count)
  const activeContacts = contacts.filter((c) => c.status === "active");
  const usedPoints = activeContacts.reduce((sum, c) => sum + calculateContactPoints(c), 0);

  const maxPoints = existing?.maxContactPoints ?? 0;

  const socialCapital: SocialCapital = {
    characterId,
    maxContactPoints: maxPoints,
    usedContactPoints: usedPoints,
    availableContactPoints: Math.max(0, maxPoints - usedPoints),
    totalContacts: contacts.length,
    activeContacts: statusCounts.active,
    burnedContacts: statusCounts.burned,
    inactiveContacts: statusCounts.inactive + statusCounts.missing,
    // Preserve influence metrics from existing
    networkingBonus: existing?.networkingBonus ?? 0,
    socialLimitModifier: existing?.socialLimitModifier ?? 0,
    loyaltyBonus: existing?.loyaltyBonus ?? 0,
    // Preserve campaign constraints from existing
    campaignContactLimit: existing?.campaignContactLimit,
    campaignMaxConnection: existing?.campaignMaxConnection,
    campaignMaxLoyalty: existing?.campaignMaxLoyalty,
    updatedAt: now,
  };

  const filePath = getSocialCapitalPath(userId, characterId);
  await writeJsonFile(filePath, socialCapital);

  return socialCapital;
}

/**
 * Check if a character can afford a new contact
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param newContactPoints - Points required for new contact (connection + loyalty)
 * @returns Check result with details
 */
export async function checkContactBudget(
  userId: ID,
  characterId: ID,
  newContactPoints: number
): Promise<{
  allowed: boolean;
  available: number;
  required: number;
  wouldExceedCampaignLimit?: boolean;
}> {
  const socialCapital = await getSocialCapital(userId, characterId);

  if (!socialCapital) {
    // No social capital tracking - allow by default
    return {
      allowed: true,
      available: Infinity,
      required: newContactPoints,
    };
  }

  const available = socialCapital.availableContactPoints;
  const allowed = newContactPoints <= available;

  // Check campaign contact limit if set
  let wouldExceedCampaignLimit = false;
  if (
    socialCapital.campaignContactLimit !== undefined &&
    socialCapital.activeContacts >= socialCapital.campaignContactLimit
  ) {
    wouldExceedCampaignLimit = true;
  }

  return {
    allowed: allowed && !wouldExceedCampaignLimit,
    available,
    required: newContactPoints,
    wouldExceedCampaignLimit,
  };
}

/**
 * Set max contact points (e.g., from character creation or campaign settings)
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param maxPoints - New maximum contact points
 * @returns Updated social capital
 */
export async function setMaxContactPoints(
  userId: ID,
  characterId: ID,
  maxPoints: number
): Promise<SocialCapital> {
  const existing = await getSocialCapital(userId, characterId);

  if (!existing) {
    return initializeSocialCapital(userId, characterId, maxPoints);
  }

  return updateSocialCapital(userId, characterId, {
    maxContactPoints: maxPoints,
    availableContactPoints: Math.max(0, maxPoints - existing.usedContactPoints),
  });
}

/**
 * Set campaign constraints on social capital
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param constraints - Campaign-level constraints
 * @returns Updated social capital
 */
export async function setCampaignConstraints(
  userId: ID,
  characterId: ID,
  constraints: {
    contactLimit?: number;
    maxConnection?: number;
    maxLoyalty?: number;
  }
): Promise<SocialCapital> {
  const existing = await getSocialCapital(userId, characterId);

  if (!existing) {
    throw new Error(`Social capital not initialized for character ${characterId}`);
  }

  return updateSocialCapital(userId, characterId, {
    campaignContactLimit: constraints.contactLimit,
    campaignMaxConnection: constraints.maxConnection,
    campaignMaxLoyalty: constraints.maxLoyalty,
  });
}

/**
 * Apply influence modifiers from qualities or augmentations
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param modifiers - Influence modifiers
 * @returns Updated social capital
 */
export async function applyInfluenceModifiers(
  userId: ID,
  characterId: ID,
  modifiers: {
    networkingBonus?: number;
    socialLimitModifier?: number;
    loyaltyBonus?: number;
  }
): Promise<SocialCapital> {
  const existing = await getSocialCapital(userId, characterId);

  if (!existing) {
    throw new Error(`Social capital not initialized for character ${characterId}`);
  }

  return updateSocialCapital(userId, characterId, {
    networkingBonus: (existing.networkingBonus || 0) + (modifiers.networkingBonus || 0),
    socialLimitModifier: (existing.socialLimitModifier || 0) + (modifiers.socialLimitModifier || 0),
    loyaltyBonus: (existing.loyaltyBonus || 0) + (modifiers.loyaltyBonus || 0),
  });
}

// =============================================================================
// QUERY HELPERS
// =============================================================================

/**
 * Get a summary of social capital usage
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @returns Usage summary
 */
export async function getSocialCapitalSummary(
  userId: ID,
  characterId: ID
): Promise<{
  totalPoints: number;
  usedPoints: number;
  availablePoints: number;
  usagePercentage: number;
  contactCounts: {
    total: number;
    active: number;
    burned: number;
    inactive: number;
  };
  modifiers: {
    networkingBonus: number;
    socialLimitModifier: number;
    loyaltyBonus: number;
  };
  campaignConstraints?: {
    contactLimit?: number;
    maxConnection?: number;
    maxLoyalty?: number;
  };
}> {
  const socialCapital = await getOrInitializeSocialCapital(userId, characterId);

  const usagePercentage =
    socialCapital.maxContactPoints > 0
      ? (socialCapital.usedContactPoints / socialCapital.maxContactPoints) * 100
      : 0;

  return {
    totalPoints: socialCapital.maxContactPoints,
    usedPoints: socialCapital.usedContactPoints,
    availablePoints: socialCapital.availableContactPoints,
    usagePercentage: Math.round(usagePercentage * 10) / 10, // One decimal place
    contactCounts: {
      total: socialCapital.totalContacts,
      active: socialCapital.activeContacts,
      burned: socialCapital.burnedContacts,
      inactive: socialCapital.inactiveContacts,
    },
    modifiers: {
      networkingBonus: socialCapital.networkingBonus,
      socialLimitModifier: socialCapital.socialLimitModifier,
      loyaltyBonus: socialCapital.loyaltyBonus,
    },
    campaignConstraints:
      socialCapital.campaignContactLimit !== undefined ||
      socialCapital.campaignMaxConnection !== undefined ||
      socialCapital.campaignMaxLoyalty !== undefined
        ? {
            contactLimit: socialCapital.campaignContactLimit,
            maxConnection: socialCapital.campaignMaxConnection,
            maxLoyalty: socialCapital.campaignMaxLoyalty,
          }
        : undefined,
  };
}
