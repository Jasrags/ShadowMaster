/**
 * GM approval workflow for campaign character advancements
 *
 * Handles GM approval and rejection of character advancements in campaigns.
 */

import type { Character, AdvancementRecord, Campaign } from "@/lib/types";
import type { CampaignAdvancementSettings } from "@/lib/types/campaign";

/**
 * Result of GM approval action
 */
export interface ApproveAdvancementResult {
  updatedCharacter: Character;
  updatedAdvancementRecord: AdvancementRecord;
}

/**
 * Approve an advancement record (GM only)
 *
 * @param character - Character with the advancement
 * @param advancementRecordId - ID of the advancement record to approve
 * @param gmId - GM user ID who is approving
 * @returns Updated character with advancement approved
 */
export function approveAdvancement(
  character: Character,
  advancementRecordId: string,
  gmId: string
): ApproveAdvancementResult {
  const advancementRecord = character.advancementHistory?.find(
    (a) => a.id === advancementRecordId
  );

  if (!advancementRecord) {
    throw new Error(`Advancement record ${advancementRecordId} not found`);
  }

  if (advancementRecord.gmApproved) {
    throw new Error(`Advancement record ${advancementRecordId} is already approved`);
  }

  const now = new Date().toISOString();

  const updatedAdvancementRecord: AdvancementRecord = {
    ...advancementRecord,
    gmApproved: true,
    gmApprovedBy: gmId,
    gmApprovedAt: now,
  };

  const updatedCharacter: Character = {
    ...character,
    advancementHistory: character.advancementHistory?.map((a) =>
      a.id === advancementRecordId ? updatedAdvancementRecord : a
    ) || [updatedAdvancementRecord],
  };

  return {
    updatedCharacter,
    updatedAdvancementRecord,
  };
}

/**
 * Reject an advancement record (GM only)
 *
 * Note: This doesn't actually remove the advancement - it marks it as rejected.
 * In practice, rejections might require a different workflow (e.g., deleting the advancement).
 * For now, we'll just mark it as not approved.
 *
 * @param character - Character with the advancement
 * @param advancementRecordId - ID of the advancement record to reject
 * @param gmId - GM user ID who is rejecting
 * @param reason - Optional reason for rejection
 * @returns Updated character
 */
export function rejectAdvancement(
  character: Character,
  advancementRecordId: string,
  gmId: string,
  reason?: string
): ApproveAdvancementResult {
  const advancementRecord = character.advancementHistory?.find(
    (a) => a.id === advancementRecordId
  );

  if (!advancementRecord) {
    throw new Error(`Advancement record ${advancementRecordId} not found`);
  }

  // For now, we'll just keep it as not approved
  // In a full implementation, we might want to add a rejection status
  // or remove the advancement entirely
  const updatedAdvancementRecord: AdvancementRecord = {
    ...advancementRecord,
    gmApproved: false,
    notes: reason ? `${advancementRecord.notes || ""}\nRejected: ${reason}`.trim() : advancementRecord.notes,
  };

  const updatedCharacter: Character = {
    ...character,
    advancementHistory: character.advancementHistory?.map((a) =>
      a.id === advancementRecordId ? updatedAdvancementRecord : a
    ) || [updatedAdvancementRecord],
  };

  return {
    updatedCharacter,
    updatedAdvancementRecord,
  };
}

/**
 * Check if a user is the GM of a campaign
 *
 * @param campaign - Campaign to check
 * @param userId - User ID to check
 * @returns True if user is the GM
 */
export function isCampaignGM(campaign: Campaign, userId: string): boolean {
  return campaign.gmId === userId;
}

/**
 * Check if a character requires GM approval for advancements
 *
 * @param character - Character to check
 * @param settings - Campaign advancement settings
 * @returns True if character requires GM approval
 */
export function requiresGMApproval(
  character: Character,
  settings?: CampaignAdvancementSettings
): boolean {
  if (!character.campaignId) {
    return false;
  }
  
  // If settings are not provided, default to true for safety in campaigns
  if (!settings) {
    return true;
  }
  
  return settings.requireApproval;
}

