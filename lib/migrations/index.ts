/**
 * Migrations Module
 *
 * Exports for database/character migrations.
 */

export {
  // Migration check
  needsGearStateMigration,
  // Single character migration
  migrateCharacterGearState,
  // Batch migration
  migrateCharactersGearState,
  getMigrationSummary,
  // Types
  type MigrationResult,
  type MigrationChange,
  type BatchMigrationResult,
} from "./add-gear-state";
