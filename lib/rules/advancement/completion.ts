/**
 * Training completion logic
 *
 * Handles completing training periods and updating character stats.
 */

import type { Character, TrainingPeriod, AdvancementRecord } from "@/lib/types";

/**
 * Result of training completion
 */
export interface CompleteTrainingResult {
  updatedCharacter: Character;
  completedTrainingPeriod: TrainingPeriod;
  completedAdvancementRecord: AdvancementRecord;
}

/**
 * Complete a training period and update character stats
 *
 * This function:
 * 1. Finds the training period and associated advancement record
 * 2. Updates the character's attribute or skill to the new value
 * 3. Marks the training period as completed
 * 4. Marks the advancement record as completed
 * 5. Removes the training period from activeTraining
 * 6. Returns the updated character
 *
 * @param character - Character with active training
 * @param trainingPeriodId - ID of the training period to complete
 * @returns Updated character with stats updated and training completed
 */
export function completeTraining(
  character: Character,
  trainingPeriodId: string
): CompleteTrainingResult {
  // Find the training period
  const trainingPeriod = character.activeTraining?.find(
    (t) => t.id === trainingPeriodId
  );

  if (!trainingPeriod) {
    throw new Error(`Training period ${trainingPeriodId} not found or not active`);
  }

  // Find the associated advancement record
  const advancementRecord = character.advancementHistory?.find(
    (a) => a.id === trainingPeriod.advancementRecordId
  );

  if (!advancementRecord) {
    throw new Error(
      `Advancement record ${trainingPeriod.advancementRecordId} not found`
    );
  }

  // Check if training is already completed
  if (trainingPeriod.status === "completed") {
    throw new Error(`Training period ${trainingPeriodId} is already completed`);
  }

  // Check if training is interrupted (can't complete interrupted training directly)
  if (trainingPeriod.status === "interrupted") {
    throw new Error(
      `Training period ${trainingPeriodId} is interrupted and must be resumed first`
    );
  }

  const now = new Date().toISOString();

  // Update the training period to completed
  const completedTrainingPeriod: TrainingPeriod = {
    ...trainingPeriod,
    status: "completed",
    actualCompletionDate: now,
  };

  // Update the advancement record to completed
  const completedAdvancementRecord: AdvancementRecord = {
    ...advancementRecord,
    trainingStatus: "completed",
    completedAt: now,
  };

  // Update character stats based on advancement type
  const updatedCharacter: Character = {
    ...character,
  };

  // Update the appropriate stat (attribute or skill)
  if (advancementRecord.type === "attribute") {
    updatedCharacter.attributes = {
      ...character.attributes,
      [advancementRecord.targetId]: advancementRecord.newValue,
    };
  } else if (advancementRecord.type === "skill") {
    updatedCharacter.skills = {
      ...character.skills,
      [advancementRecord.targetId]: advancementRecord.newValue,
    };
  } else if (advancementRecord.type === "specialization") {
    // Extract specialization name from notes (format: "Specialization: {name}")
    const specializationMatch = advancementRecord.notes?.match(/^Specialization:\s*(.+)$/);
    if (specializationMatch) {
      const specializationName = specializationMatch[1].trim();
      const skillId = advancementRecord.targetId;
      const existingSpecializations = character.skillSpecializations?.[skillId] || [];
      
      // Add specialization if not already present
      if (!existingSpecializations.includes(specializationName)) {
        updatedCharacter.skillSpecializations = {
          ...character.skillSpecializations,
          [skillId]: [...existingSpecializations, specializationName],
        };
      }
    }
  } else {
    // Other advancement types (skill groups, etc.) will be handled later
    // For now, we just complete the training without stat updates
  }

  // Update advancement history (replace the record with the completed version)
  updatedCharacter.advancementHistory = character.advancementHistory?.map((a) =>
    a.id === advancementRecord.id ? completedAdvancementRecord : a
  ) || [completedAdvancementRecord];

  // Remove the completed training period from activeTraining
  updatedCharacter.activeTraining = character.activeTraining?.filter(
    (t) => t.id !== trainingPeriodId
  ) || [];

  return {
    updatedCharacter,
    completedTrainingPeriod,
    completedAdvancementRecord,
  };
}

/**
 * Get active training periods for a character
 *
 * @param character - Character to query
 * @returns Array of active training periods
 */
export function getActiveTraining(character: Character): TrainingPeriod[] {
  return character.activeTraining?.filter(
    (t) => t.status === "pending" || t.status === "in-progress"
  ) || [];
}

/**
 * Get completed training periods (from advancement history)
 *
 * @param character - Character to query
 * @returns Array of completed advancement records with their training periods
 */
export function getCompletedTraining(
  character: Character
): Array<{ advancementRecord: AdvancementRecord; trainingPeriod?: TrainingPeriod }> {
  const completed = character.advancementHistory?.filter(
    (a) => a.trainingStatus === "completed" && a.trainingRequired
  ) || [];

  // Try to find training periods for completed advancements (they may have been removed from activeTraining)
  // For now, we'll just return the advancement records
  // In a full implementation, we might store completed training periods separately or in a history
  return completed.map((record) => ({
    advancementRecord: record,
    // Training periods are removed from activeTraining when completed, so we can't look them up
    // In a future enhancement, we might store completed training periods in a separate history
  }));
}

