/**
 * Training interruption and resumption logic
 *
 * Handles pausing and resuming training periods.
 */

import type { Character, TrainingPeriod, AdvancementRecord } from "@/lib/types";

/**
 * Result of training interruption
 */
export interface InterruptTrainingResult {
  updatedCharacter: Character;
  interruptedTrainingPeriod: TrainingPeriod;
  updatedAdvancementRecord: AdvancementRecord;
}

/**
 * Result of training resumption
 */
export interface ResumeTrainingResult {
  updatedCharacter: Character;
  resumedTrainingPeriod: TrainingPeriod;
  updatedAdvancementRecord: AdvancementRecord;
}

/**
 * Interrupt a training period
 *
 * This pauses the training, allowing it to be resumed later.
 * Training progress is preserved.
 *
 * @param character - Character with active training
 * @param trainingPeriodId - ID of the training period to interrupt
 * @param reason - Optional reason for interruption
 * @returns Updated character with training interrupted
 */
export function interruptTraining(
  character: Character,
  trainingPeriodId: string,
  reason?: string
): InterruptTrainingResult {
  // Find the training period
  const trainingPeriod = character.activeTraining?.find(
    (t) => t.id === trainingPeriodId
  );

  if (!trainingPeriod) {
    throw new Error(`Training period ${trainingPeriodId} not found or not active`);
  }

  // Check if training can be interrupted
  if (trainingPeriod.status === "completed") {
    throw new Error(`Cannot interrupt completed training period ${trainingPeriodId}`);
  }

  if (trainingPeriod.status === "interrupted") {
    throw new Error(`Training period ${trainingPeriodId} is already interrupted`);
  }

  const now = new Date().toISOString();

  // Update the training period to interrupted
  const interruptedTrainingPeriod: TrainingPeriod = {
    ...trainingPeriod,
    status: "interrupted",
    interruptionDate: now,
    interruptionReason: reason,
  };

  // Find and update the associated advancement record
  const advancementRecord = character.advancementHistory?.find(
    (a) => a.id === trainingPeriod.advancementRecordId
  );

  if (!advancementRecord) {
    throw new Error(
      `Advancement record ${trainingPeriod.advancementRecordId} not found`
    );
  }

  const updatedAdvancementRecord: AdvancementRecord = {
    ...advancementRecord,
    trainingStatus: "interrupted",
  };

  // Update character
  const updatedCharacter: Character = {
    ...character,
    activeTraining: character.activeTraining?.map((t) =>
      t.id === trainingPeriodId ? interruptedTrainingPeriod : t
    ) || [interruptedTrainingPeriod],
    advancementHistory: character.advancementHistory?.map((a) =>
      a.id === advancementRecord.id ? updatedAdvancementRecord : a
    ) || [updatedAdvancementRecord],
  };

  return {
    updatedCharacter,
    interruptedTrainingPeriod,
    updatedAdvancementRecord,
  };
}

/**
 * Resume an interrupted training period
 *
 * This continues training from where it was interrupted.
 * Training progress is preserved.
 *
 * @param character - Character with interrupted training
 * @param trainingPeriodId - ID of the training period to resume
 * @returns Updated character with training resumed
 */
export function resumeTraining(
  character: Character,
  trainingPeriodId: string
): ResumeTrainingResult {
  // Find the training period
  const trainingPeriod = character.activeTraining?.find(
    (t) => t.id === trainingPeriodId
  );

  if (!trainingPeriod) {
    throw new Error(`Training period ${trainingPeriodId} not found or not active`);
  }

  // Check if training can be resumed
  if (trainingPeriod.status !== "interrupted") {
    throw new Error(
      `Training period ${trainingPeriodId} is not interrupted (status: ${trainingPeriod.status})`
    );
  }

  // Update the training period to in-progress (resuming from interruption)
  const resumedTrainingPeriod: TrainingPeriod = {
    ...trainingPeriod,
    status: "in-progress",
    // Keep interruptionDate and interruptionReason for history, but status is now in-progress
  };

  // Find and update the associated advancement record
  const advancementRecord = character.advancementHistory?.find(
    (a) => a.id === trainingPeriod.advancementRecordId
  );

  if (!advancementRecord) {
    throw new Error(
      `Advancement record ${trainingPeriod.advancementRecordId} not found`
    );
  }

  const updatedAdvancementRecord: AdvancementRecord = {
    ...advancementRecord,
    trainingStatus: "in-progress",
  };

  // Update character
  const updatedCharacter: Character = {
    ...character,
    activeTraining: character.activeTraining?.map((t) =>
      t.id === trainingPeriodId ? resumedTrainingPeriod : t
    ) || [resumedTrainingPeriod],
    advancementHistory: character.advancementHistory?.map((a) =>
      a.id === advancementRecord.id ? updatedAdvancementRecord : a
    ) || [updatedAdvancementRecord],
  };

  return {
    updatedCharacter,
    resumedTrainingPeriod,
    updatedAdvancementRecord,
  };
}

