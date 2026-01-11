/**
 * Campaign downtime integration for advancement
 *
 * Handles downtime period queries and per-downtime limit validation.
 */

import type { CampaignEvent, Character, AdvancementRecord, TrainingPeriod } from "@/lib/types";

/**
 * Get downtime events from a campaign
 *
 * @param events - Campaign events array
 * @returns Array of downtime events, sorted by date
 */
export function getDowntimeEvents(events: CampaignEvent[]): CampaignEvent[] {
  return events
    .filter((event) => event.type === "downtime")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Get a specific downtime event by ID
 *
 * @param events - Campaign events array
 * @param downtimeId - ID of the downtime event
 * @returns Downtime event or null if not found
 */
export function getDowntimeEventById(
  events: CampaignEvent[],
  downtimeId: string
): CampaignEvent | null {
  const downtime = events.find((event) => event.type === "downtime" && event.id === downtimeId);
  return downtime || null;
}

/**
 * Count advancements of a specific type during a downtime period
 *
 * @param character - Character to check
 * @param downtimeId - ID of the downtime period
 * @param advancementType - Type of advancement to count
 * @returns Count of advancements of this type during this downtime
 */
export function countDowntimeAdvancements(
  character: Character,
  downtimeId: string,
  advancementType: "attribute" | "skill" | "skillGroup"
): number {
  const downtimeAdvancements =
    character.advancementHistory?.filter(
      (a) =>
        a.type === advancementType &&
        a.downtimePeriodId === downtimeId &&
        a.trainingStatus !== "interrupted" // Don't count interrupted advancements
    ) || [];

  return downtimeAdvancements.length;
}

/**
 * Validate per-downtime advancement limits
 *
 * Rules:
 * - Attributes: Maximum +2 per downtime
 * - Skills: Maximum +3 per downtime
 * - Skill Groups: Maximum +1 per downtime
 *
 * @param character - Character to validate
 * @param downtimeId - ID of the downtime period
 * @param advancementType - Type of advancement being attempted
 * @returns Validation result
 */
export function validateDowntimeLimits(
  character: Character,
  downtimeId: string,
  advancementType: "attribute" | "skill" | "skillGroup"
): { valid: boolean; error?: string; currentCount: number; maxAllowed: number } {
  let maxAllowed: number;
  let typeLabel: string;

  switch (advancementType) {
    case "attribute":
      maxAllowed = 2;
      typeLabel = "attributes";
      break;
    case "skill":
      maxAllowed = 3;
      typeLabel = "skills";
      break;
    case "skillGroup":
      maxAllowed = 1;
      typeLabel = "skill groups";
      break;
  }

  const currentCount = countDowntimeAdvancements(character, downtimeId, advancementType);

  if (currentCount >= maxAllowed) {
    return {
      valid: false,
      error: `Maximum ${maxAllowed} ${typeLabel} can be advanced per downtime period (already advanced ${currentCount})`,
      currentCount,
      maxAllowed,
    };
  }

  return {
    valid: true,
    currentCount,
    maxAllowed,
  };
}

/**
 * Get all active training periods linked to a downtime event
 *
 * @param character - Character to check
 * @param downtimeId - ID of the downtime period
 * @returns Array of training periods linked to this downtime
 */
export function getDowntimeTraining(character: Character, downtimeId: string): TrainingPeriod[] {
  return character.activeTraining?.filter((t) => t.downtimePeriodId === downtimeId) || [];
}

/**
 * Get all advancements (completed and in-progress) linked to a downtime event
 *
 * @param character - Character to check
 * @param downtimeId - ID of the downtime period
 * @returns Array of advancement records linked to this downtime
 */
export function getDowntimeAdvancements(
  character: Character,
  downtimeId: string
): AdvancementRecord[] {
  return character.advancementHistory?.filter((a) => a.downtimePeriodId === downtimeId) || [];
}
