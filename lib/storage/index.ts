/**
 * Storage layer exports
 *
 * Central export point for all storage operations.
 */

// Base utilities
export {
  ensureDirectory,
  readJsonFile,
  writeJsonFile,
  deleteFile,
  listJsonFiles,
  readAllJsonFiles,
  directoryExists,
  listSubdirectories,
} from "./base";

// Edition storage
export {
  getEdition,
  getAllEditions,
  editionExists,
  getBook,
  getAllBooks,
  getCoreBook,
  getBookPayload,
  getAllBookPayloads,
  getCreationMethod,
  getAllCreationMethods,
  getDefaultCreationMethod,
} from "./editions";

// Character storage
export {
  getCharacter,
  getUserCharacters,
  getAllCharacters,
  getCharactersByStatus,
  getDraftCharacters,
  getActiveCharacters,
  getCharactersByEdition,
  getCharactersByCampaign,
  createCharacterDraft,
  updateCharacter,
  finalizeCharacter,
  deleteCharacter,
  updateCharacterAttributes,
  updateCharacterSkills,
  updateCharacterQualities,
  updateCharacterGear,
  applyDamage,
  healCharacter,
  spendKarma,
  awardKarma,
  setCharacterCampaign,
  retireCharacter,
  killCharacter,
} from "./characters";

// User storage (existing)
export {
  getUserById,
  getUserByEmail,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "./users";

