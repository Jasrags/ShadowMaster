/**
 * Character storage layer
 *
 * Handles CRUD operations for character data.
 * Characters are stored in data/characters/{userId}/{characterId}.json
 *
 * Directory structure:
 *   data/characters/
 *     └── {userId}/
 *         ├── {characterId}.json
 *         └── {characterId}.json
 */

import path from "path";
import { v4 as uuidv4 } from "uuid";
import type {
  ID,
  Character,
  CharacterDraft,
  CharacterStatus,
  EditionCode,
  QualitySelection,
  AdvancementRecord,
  TrainingPeriod,
  AdvancementType,
  TrainingStatus,
} from "../types";
import {
  ensureDirectory,
  readJsonFile,
  writeJsonFile,
  deleteFile,
  readAllJsonFiles,
} from "./base";

const CHARACTERS_DIR = path.join(process.cwd(), "data", "characters");

/**
 * Get the directory path for a user's characters
 */
function getUserCharactersDir(userId: ID): string {
  return path.join(CHARACTERS_DIR, userId);
}

/**
 * Get the file path for a specific character
 */
function getCharacterFilePath(userId: ID, characterId: ID): string {
  return path.join(getUserCharactersDir(userId), `${characterId}.json`);
}

// =============================================================================
// READ OPERATIONS
// =============================================================================

/**
 * Get a character by ID
 */
export async function getCharacter(
  userId: ID,
  characterId: ID
): Promise<Character | null> {
  const filePath = getCharacterFilePath(userId, characterId);
  return readJsonFile<Character>(filePath);
}

/**
 * Get a character by ID without knowing the owner (for GM/admin access)
 * This iterates through all users, so use sparingly.
 */
export async function getCharacterById(
  characterId: ID
): Promise<Character | null> {
  const allCharacters = await getAllCharacters();
  return allCharacters.find((c) => c.id === characterId) || null;
}

/**
 * Get all characters for a user
 */
export async function getUserCharacters(userId: ID): Promise<Character[]> {
  const userDir = getUserCharactersDir(userId);
  return readAllJsonFiles<Character>(userDir);
}

/**
 * Get all characters across all users (admin function)
 */
export async function getAllCharacters(): Promise<Character[]> {
  const { listSubdirectories } = await import("./base");
  const userDirs = await listSubdirectories(CHARACTERS_DIR);
  const allCharacters: Character[] = [];

  for (const userId of userDirs) {
    const characters = await getUserCharacters(userId);
    allCharacters.push(...characters);
  }

  return allCharacters;
}

/**
 * Get characters by status
 */
export async function getCharactersByStatus(
  userId: ID,
  status: CharacterStatus
): Promise<Character[]> {
  const characters = await getUserCharacters(userId);
  return characters.filter((c) => c.status === status);
}

/**
 * Get draft characters for a user
 */
export async function getDraftCharacters(userId: ID): Promise<Character[]> {
  return getCharactersByStatus(userId, "draft");
}

/**
 * Get active characters for a user
 */
export async function getActiveCharacters(userId: ID): Promise<Character[]> {
  return getCharactersByStatus(userId, "active");
}

/**
 * Get characters for a specific edition
 */
export async function getCharactersByEdition(
  userId: ID,
  editionCode: EditionCode
): Promise<Character[]> {
  const characters = await getUserCharacters(userId);
  return characters.filter((c) => c.editionCode === editionCode);
}

/**
 * Get characters in a specific campaign
 */
export async function getCharactersByCampaign(
  userId: ID,
  campaignId: ID
): Promise<Character[]> {
  const characters = await getUserCharacters(userId);
  return characters.filter((c) => c.campaignId === campaignId);
}

// =============================================================================
// WRITE OPERATIONS
// =============================================================================

/**
 * Create a new character draft
 */
export async function createCharacterDraft(
  userId: ID,
  editionId: ID,
  editionCode: EditionCode,
  creationMethodId: ID,
  name?: string,
  campaignId?: ID
): Promise<CharacterDraft> {
  await ensureDirectory(getUserCharactersDir(userId));

  const now = new Date().toISOString();
  const characterId = uuidv4();

  const draft: CharacterDraft = {
    id: characterId,
    ownerId: userId,
    editionId,
    editionCode,
    creationMethodId,
    status: "draft",
    name: name || "Unnamed Character",
    createdAt: now,
    updatedAt: now,
    campaignId,

    // Initialize empty/default fields
    attributes: {},
    specialAttributes: {
      edge: 0,
      essence: 6,
    },
    skills: {},
    positiveQualities: [],
    negativeQualities: [],
    magicalPath: "mundane",
    nuyen: 0,
    startingNuyen: 0,
    gear: [],
    contacts: [],
    derivedStats: {},
    condition: {
      physicalDamage: 0,
      stunDamage: 0,
    },
    karmaTotal: 0,
    karmaCurrent: 0,
    karmaSpentAtCreation: 0,
    attachedBookIds: [],
  };

  const filePath = getCharacterFilePath(userId, characterId);
  await writeJsonFile(filePath, draft);

  return draft;
}

/**
 * Import a character from JSON
 * Generates a new ID and owner ID to avoid collisions/security issues
 */
export async function importCharacter(
  userId: ID,
  characterData: Partial<Character>
): Promise<Character> {
  await ensureDirectory(getUserCharactersDir(userId));

  const now = new Date().toISOString();
  const characterId = uuidv4();

  // Create clean character object with new ID and owner
  const character: Character = {
    ...characterData, // Spread imported data first
    id: characterId, // Overwrite ID
    ownerId: userId, // Overwrite owner
    createdAt: now, // Reset creation date
    updatedAt: now, // Reset update date
    campaignId: undefined, // Clear campaign association
  } as Character;

  // Validate critical fields
  if (!character.name || !character.editionCode || !character.creationMethodId) {
    throw new Error("Invalid character data: missing required fields");
  }

  const filePath = getCharacterFilePath(userId, characterId);
  await writeJsonFile(filePath, character);

  return character;
}

/**
 * Update a character
 */
export async function updateCharacter(
  userId: ID,
  characterId: ID,
  updates: Partial<Character>
): Promise<Character> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character with ID ${characterId} not found`);
  }

  const updatedCharacter: Character = {
    ...character,
    ...updates,
    id: character.id, // Ensure ID cannot be changed
    ownerId: character.ownerId, // Ensure owner cannot be changed
    updatedAt: new Date().toISOString(),
  };

  const filePath = getCharacterFilePath(userId, characterId);
  await writeJsonFile(filePath, updatedCharacter);

  return updatedCharacter;
}

/**
 * Finalize a draft character (change status from draft to active)
 */
export async function finalizeCharacter(
  userId: ID,
  characterId: ID
): Promise<Character> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character with ID ${characterId} not found`);
  }

  if (character.status !== "draft") {
    throw new Error(`Character ${characterId} is not a draft`);
  }

  return updateCharacter(userId, characterId, { status: "active" });
}

/**
 * Delete a character
 */
export async function deleteCharacter(userId: ID, characterId: ID): Promise<boolean> {
  const filePath = getCharacterFilePath(userId, characterId);
  return deleteFile(filePath);
}

// =============================================================================
// SPECIALIZED UPDATES
// =============================================================================

/**
 * Update character attributes
 */
export async function updateCharacterAttributes(
  userId: ID,
  characterId: ID,
  attributes: Record<string, number>
): Promise<Character> {
  return updateCharacter(userId, characterId, { attributes });
}

/**
 * Update character skills
 */
export async function updateCharacterSkills(
  userId: ID,
  characterId: ID,
  skills: Record<string, number>
): Promise<Character> {
  return updateCharacter(userId, characterId, { skills });
}

/**
 * Update character qualities
 */

/**
 * Update character qualities
 */
export async function updateCharacterQualities(
  userId: ID,
  characterId: ID,
  positiveQualities: QualitySelection[],
  negativeQualities: QualitySelection[]
): Promise<Character> {
  return updateCharacter(userId, characterId, {
    positiveQualities,
    negativeQualities,
  });
}

/**
 * Update character gear
 */
export async function updateCharacterGear(
  userId: ID,
  characterId: ID,
  gear: Character["gear"],
  nuyen: number
): Promise<Character> {
  return updateCharacter(userId, characterId, { gear, nuyen });
}

/**
 * Update quality dynamic state
 */
export async function updateQualityDynamicState(
  userId: ID,
  characterId: ID,
  qualityId: ID,
  updates: Partial<import("../types").QualityDynamicState["state"]>
): Promise<Character> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character with ID ${characterId} not found`);
  }

  const { updateDynamicState } = await import("../rules/qualities/dynamic-state");
  const updatedCharacter = updateDynamicState(character, qualityId, updates);

  return updateCharacter(userId, characterId, {
    positiveQualities: updatedCharacter.positiveQualities,
    negativeQualities: updatedCharacter.negativeQualities,
  });
}

/**
 * Apply damage to a character
 */
export async function applyDamage(
  userId: ID,
  characterId: ID,
  physicalDamage: number,
  stunDamage: number
): Promise<Character> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character with ID ${characterId} not found`);
  }

  return updateCharacter(userId, characterId, {
    condition: {
      physicalDamage: character.condition.physicalDamage + physicalDamage,
      stunDamage: character.condition.stunDamage + stunDamage,
      overflowDamage: character.condition.overflowDamage,
    },
  });
}

/**
 * Heal a character
 */
export async function healCharacter(
  userId: ID,
  characterId: ID,
  physicalHealed: number,
  stunHealed: number
): Promise<Character> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character with ID ${characterId} not found`);
  }

  return updateCharacter(userId, characterId, {
    condition: {
      physicalDamage: Math.max(0, character.condition.physicalDamage - physicalHealed),
      stunDamage: Math.max(0, character.condition.stunDamage - stunHealed),
      overflowDamage: character.condition.overflowDamage,
    },
  });
}

/**
 * Spend karma
 */
export async function spendKarma(
  userId: ID,
  characterId: ID,
  amount: number
): Promise<Character> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character with ID ${characterId} not found`);
  }

  if (character.karmaCurrent < amount) {
    throw new Error(`Not enough karma. Have: ${character.karmaCurrent}, Need: ${amount}`);
  }

  return updateCharacter(userId, characterId, {
    karmaCurrent: character.karmaCurrent - amount,
  });
}

/**
 * Award karma
 */
export async function awardKarma(
  userId: ID,
  characterId: ID,
  amount: number
): Promise<Character> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character with ID ${characterId} not found`);
  }

  return updateCharacter(userId, characterId, {
    karmaCurrent: character.karmaCurrent + amount,
    karmaTotal: character.karmaTotal + amount,
  });
}

/**
 * Set character's campaign
 */
export async function setCharacterCampaign(
  userId: ID,
  characterId: ID,
  campaignId: ID | null
): Promise<Character> {
  return updateCharacter(userId, characterId, {
    campaignId: campaignId || undefined,
  });
}

/**
 * Retire a character
 */
export async function retireCharacter(userId: ID, characterId: ID): Promise<Character> {
  return updateCharacter(userId, characterId, { status: "retired" });
}

/**
 * Mark a character as deceased
 */
export async function killCharacter(userId: ID, characterId: ID): Promise<Character> {
  return updateCharacter(userId, characterId, { status: "deceased" });
}

// =============================================================================
// ADVANCEMENT STORAGE FUNCTIONS
// =============================================================================

/**
 * Add an advancement record and optionally a training period to a character
 *
 * This is a convenience function that persists the results from advancement
 * logic functions (e.g., advanceAttribute, advanceSkill).
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param advancementRecord - Advancement record to add
 * @param trainingPeriod - Optional training period to add
 * @param karmaSpent - Karma amount spent (for updating karmaCurrent)
 * @returns Updated character
 */
export async function addAdvancementRecord(
  userId: ID,
  characterId: ID,
  advancementRecord: AdvancementRecord,
  trainingPeriod?: TrainingPeriod,
  karmaSpent?: number
): Promise<Character> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character with ID ${characterId} not found`);
  }

  // Build updates
  const updates: Partial<Character> = {
    advancementHistory: [
      ...(character.advancementHistory || []),
      advancementRecord,
    ],
  };

  // Add training period if provided
  if (trainingPeriod) {
    updates.activeTraining = [
      ...(character.activeTraining || []),
      trainingPeriod,
    ];
  }

  // Update karma if provided
  if (karmaSpent !== undefined) {
    updates.karmaCurrent = character.karmaCurrent - karmaSpent;
  }

  return updateCharacter(userId, characterId, updates);
}

/**
 * Update a training period in a character's activeTraining array
 *
 * This is used when training status changes (completion, interruption, resumption).
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param trainingPeriodId - ID of the training period to update
 * @param updates - Partial training period updates
 * @returns Updated character
 */
export async function updateTrainingPeriod(
  userId: ID,
  characterId: ID,
  trainingPeriodId: ID,
  updates: Partial<TrainingPeriod>
): Promise<Character> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character with ID ${characterId} not found`);
  }

  const trainingPeriod = character.activeTraining?.find(
    (t) => t.id === trainingPeriodId
  );

  if (!trainingPeriod) {
    throw new Error(`Training period ${trainingPeriodId} not found`);
  }

  const updatedTrainingPeriod: TrainingPeriod = {
    ...trainingPeriod,
    ...updates,
  };

  const updatedActiveTraining = character.activeTraining?.map((t) =>
    t.id === trainingPeriodId ? updatedTrainingPeriod : t
  ) || [updatedTrainingPeriod];

  return updateCharacter(userId, characterId, {
    activeTraining: updatedActiveTraining,
  });
}

/**
 * Update an advancement record in a character's advancementHistory
 *
 * Advancement records are typically immutable, but this function allows
 * updating status fields (e.g., trainingStatus, completedAt, gmApproved).
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param advancementRecordId - ID of the advancement record to update
 * @param updates - Partial advancement record updates
 * @returns Updated character
 */
export async function updateAdvancementRecord(
  userId: ID,
  characterId: ID,
  advancementRecordId: ID,
  updates: Partial<AdvancementRecord>
): Promise<Character> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character with ID ${characterId} not found`);
  }

  const advancementRecord = character.advancementHistory?.find(
    (a) => a.id === advancementRecordId
  );

  if (!advancementRecord) {
    throw new Error(`Advancement record ${advancementRecordId} not found`);
  }

  const updatedAdvancementRecord: AdvancementRecord = {
    ...advancementRecord,
    ...updates,
  };

  const updatedHistory = character.advancementHistory?.map((a) =>
    a.id === advancementRecordId ? updatedAdvancementRecord : a
  ) || [updatedAdvancementRecord];

  return updateCharacter(userId, characterId, {
    advancementHistory: updatedHistory,
  });
}

/**
 * Remove a training period from activeTraining (e.g., when training completes)
 *
 * @param userId - Character owner ID
 * @param characterId - Character ID
 * @param trainingPeriodId - ID of the training period to remove
 * @returns Updated character
 */
export async function removeTrainingPeriod(
  userId: ID,
  characterId: ID,
  trainingPeriodId: ID
): Promise<Character> {
  const character = await getCharacter(userId, characterId);
  if (!character) {
    throw new Error(`Character with ID ${characterId} not found`);
  }

  const updatedActiveTraining = character.activeTraining?.filter(
    (t) => t.id !== trainingPeriodId
  ) || [];

  return updateCharacter(userId, characterId, {
    activeTraining: updatedActiveTraining,
  });
}

/**
 * Get advancement history for a character with optional filtering
 *
 * @param character - Character to query
 * @param filters - Optional filters
 * @returns Filtered advancement records
 */
export function getAdvancementHistory(
  character: Character,
  filters?: {
    type?: AdvancementType;
    targetId?: string;
    trainingStatus?: TrainingStatus;
    downtimePeriodId?: ID;
    campaignSessionId?: ID;
    gmApproved?: boolean;
  }
): AdvancementRecord[] {
  let history = character.advancementHistory || [];

  if (filters) {
    if (filters.type) {
      history = history.filter((a) => a.type === filters.type);
    }
    if (filters.targetId) {
      history = history.filter((a) => a.targetId === filters.targetId);
    }
    if (filters.trainingStatus) {
      history = history.filter((a) => a.trainingStatus === filters.trainingStatus);
    }
    if (filters.downtimePeriodId) {
      history = history.filter((a) => a.downtimePeriodId === filters.downtimePeriodId);
    }
    if (filters.campaignSessionId) {
      history = history.filter((a) => a.campaignSessionId === filters.campaignSessionId);
    }
    if (filters.gmApproved !== undefined) {
      history = history.filter((a) => a.gmApproved === filters.gmApproved);
    }
  }

  return history;
}

/**
 * Get active training periods for a character with optional filtering
 *
 * @param character - Character to query
 * @param filters - Optional filters
 * @returns Filtered active training periods
 */
export function getActiveTrainingPeriods(
  character: Character,
  filters?: {
    type?: AdvancementType;
    targetId?: string;
    status?: TrainingStatus;
    downtimePeriodId?: ID;
  }
): TrainingPeriod[] {
  let training = character.activeTraining || [];

  // Filter by status (only pending, in-progress, or interrupted are "active")
  training = training.filter(
    (t) => t.status === "pending" || t.status === "in-progress" || t.status === "interrupted"
  );

  if (filters) {
    if (filters.type) {
      training = training.filter((t) => t.type === filters.type);
    }
    if (filters.targetId) {
      training = training.filter((t) => t.targetId === filters.targetId);
    }
    if (filters.status) {
      training = training.filter((t) => t.status === filters.status);
    }
    if (filters.downtimePeriodId) {
      training = training.filter((t) => t.downtimePeriodId === filters.downtimePeriodId);
    }
  }

  return training;
}

/**
 * Get a specific training period by ID
 *
 * @param character - Character to query
 * @param trainingPeriodId - Training period ID
 * @returns Training period or null if not found
 */
export function getTrainingPeriodById(
  character: Character,
  trainingPeriodId: ID
): TrainingPeriod | null {
  return character.activeTraining?.find((t) => t.id === trainingPeriodId) || null;
}

/**
 * Get a specific advancement record by ID
 *
 * @param character - Character to query
 * @param advancementRecordId - Advancement record ID
 * @returns Advancement record or null if not found
 */
export function getAdvancementRecordById(
  character: Character,
  advancementRecordId: ID
): AdvancementRecord | null {
  return character.advancementHistory?.find((a) => a.id === advancementRecordId) || null;
}

