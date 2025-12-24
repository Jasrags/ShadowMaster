/**
 * GM approval workflow for campaign character advancements
 *
 * Handles GM approval and rejection of character advancements in campaigns.
 */

import type { Character, AdvancementRecord, Campaign } from "@/lib/types";
import type { CampaignAdvancementSettings } from "@/lib/types/campaign";
import { applyAdvancement } from "./apply";

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
 * @returns Updated character and record
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

  // Self-approval restriction (Requirement 25)
  if (character.ownerId === gmId) {
    throw new Error("Self-approval restriction: GMs cannot approve their own character advancements.");
  }

  const now = new Date().toISOString();

  const updatedAdvancementRecord: AdvancementRecord = {
    ...advancementRecord,
    gmApproved: true,
    gmApprovedBy: gmId,
    gmApprovedAt: now,
  };

  let updatedCharacter: Character = {
    ...character,
    advancementHistory: character.advancementHistory?.map((a) =>
      a.id === advancementRecordId ? updatedAdvancementRecord : a
    ) || [updatedAdvancementRecord],
  };

  // Requirement 20: propagate mechanical changes IF training is already completed
  if (updatedAdvancementRecord.trainingStatus === "completed") {
    updatedCharacter = applyAdvancement(updatedCharacter, updatedAdvancementRecord);
  }

  return {
    updatedCharacter,
    updatedAdvancementRecord,
  };
}

/**
 * Reject an advancement record (GM only)
 *
 * @param character - Character with the advancement
 * @param advancementRecordId - ID of the advancement record to reject
 * @param gmId - GM user ID who is rejecting
 * @param reason - Mandatory reason for rejection
 * @returns Updated character
 */
export function rejectAdvancement(
  character: Character,
  advancementRecordId: string,
  gmId: string,
  reason: string
): ApproveAdvancementResult {
  if (!reason || reason.trim().length === 0) {
    throw new Error("Rejection reason is mandatory.");
  }

  const advancementRecord = character.advancementHistory?.find(
    (a) => a.id === advancementRecordId
  );

  if (!advancementRecord) {
    throw new Error(`Advancement record ${advancementRecordId} not found`);
  }

  // Self-approval restriction also applies to rejection for consistency
  if (character.ownerId === gmId) {
    throw new Error("Self-governance restriction: GMs cannot reject their own character advancements.");
  }

  const now = new Date().toISOString();

  // Requirement 30: Captured mandatory justification text
  const updatedAdvancementRecord: AdvancementRecord = {
    ...advancementRecord,
    gmApproved: false,
    rejectionReason: reason,
    gmApprovedBy: gmId,
    gmApprovedAt: now,
    notes: `${advancementRecord.notes || ""}\n[REJECTED] ${reason}`.trim(),
  };

  const updatedCharacter: Character = {
    ...character,
    advancementHistory: character.advancementHistory?.map((a) =>
      a.id === advancementRecordId ? updatedAdvancementRecord : a
    ) || [updatedAdvancementRecord],
  };

  // Requirement 36: Automatically restore character resources (Karma)
  if (advancementRecord.karmaCost > 0) {
    updatedCharacter.karmaCurrent += advancementRecord.karmaCost;
  }

  // If there was a training period, it should be removed or marked as rejected
  if (advancementRecord.trainingPeriodId) {
    updatedCharacter.activeTraining = updatedCharacter.activeTraining?.filter(
      (t) => t.id !== advancementRecord.trainingPeriodId
    );
  }

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

