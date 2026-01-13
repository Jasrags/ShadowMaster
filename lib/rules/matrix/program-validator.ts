/**
 * Program Slot Validation Service
 *
 * Validates program allocation against hardware limits.
 * Ensures programs exist in the ruleset and are compatible with devices.
 */

import type { Character } from "@/lib/types";
import type { CharacterProgram } from "@/lib/types/programs";
import type {
  MatrixDeviceType,
  MatrixValidationError,
  MatrixValidationWarning,
} from "@/lib/types/matrix";
import type { LoadedRuleset, ProgramCatalogItemData } from "../loader-types";
import { getActiveCyberdeck } from "./cyberdeck-validator";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Result of program validation
 */
export interface ProgramValidationResult {
  valid: boolean;
  errors: MatrixValidationError[];
  warnings: MatrixValidationWarning[];
  slotsUsed: number;
  slotsRemaining: number;
  slotsMax: number;
}

// =============================================================================
// PROGRAM EXTRACTION
// =============================================================================

/**
 * Extract all programs from the ruleset
 */
function extractPrograms(ruleset: LoadedRuleset): ProgramCatalogItemData[] {
  const programsModule = ruleset.books
    .flatMap((book) => book.payload.modules.programs?.payload)
    .filter(Boolean)[0] as
    | {
        common?: ProgramCatalogItemData[];
        hacking?: ProgramCatalogItemData[];
        agents?: ProgramCatalogItemData[];
      }
    | undefined;

  if (!programsModule) {
    return [];
  }

  return [
    ...(programsModule.common ?? []),
    ...(programsModule.hacking ?? []),
    ...(programsModule.agents ?? []),
  ];
}

/**
 * Find a program by ID in the ruleset
 */
function findProgram(
  programId: string,
  ruleset: LoadedRuleset
): ProgramCatalogItemData | undefined {
  const programs = extractPrograms(ruleset);
  return programs.find((p) => p.id === programId);
}

// =============================================================================
// PROGRAM VALIDATION
// =============================================================================

/**
 * Validate program allocation against hardware limits
 *
 * @param character - The character to validate
 * @param programIds - IDs of programs to load
 * @param ruleset - The loaded ruleset
 * @returns Validation result
 */
export function validateProgramAllocation(
  character: Character,
  programIds: string[],
  ruleset: LoadedRuleset
): ProgramValidationResult {
  const errors: MatrixValidationError[] = [];
  const warnings: MatrixValidationWarning[] = [];

  // Get the active cyberdeck
  const deck = getActiveCyberdeck(character);

  if (!deck) {
    errors.push({
      code: "NO_CYBERDECK",
      message: "No cyberdeck found. Cannot load programs without a cyberdeck.",
    });
    return {
      valid: false,
      errors,
      warnings,
      slotsUsed: 0,
      slotsRemaining: 0,
      slotsMax: 0,
    };
  }

  const slotsMax = deck.programSlots;
  const slotsUsed = programIds.length;
  const slotsRemaining = slotsMax - slotsUsed;

  // Check slot limit
  if (slotsUsed > slotsMax) {
    errors.push({
      code: "EXCEEDS_PROGRAM_SLOTS",
      message: `Cannot load ${slotsUsed} programs. Cyberdeck only has ${slotsMax} program slots.`,
      field: "programs",
    });
  }

  // Validate each program exists
  for (const programId of programIds) {
    const program = findProgram(programId, ruleset);
    if (!program) {
      errors.push({
        code: "PROGRAM_NOT_FOUND",
        message: `Program "${programId}" not found in ruleset.`,
        field: programId,
      });
    }
  }

  // Check for duplicate programs
  const uniqueIds = new Set(programIds);
  if (uniqueIds.size !== programIds.length) {
    warnings.push({
      code: "DUPLICATE_PROGRAMS",
      message: "Duplicate programs detected. Each program can only be loaded once.",
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    slotsUsed,
    slotsRemaining: Math.max(0, slotsRemaining),
    slotsMax,
  };
}

/**
 * Validate that a program exists in the ruleset
 *
 * @param programId - The program ID to validate
 * @param ruleset - The loaded ruleset
 * @returns True if program exists
 */
export function validateProgramExists(programId: string, ruleset: LoadedRuleset): boolean {
  return findProgram(programId, ruleset) !== undefined;
}

/**
 * Get program slot limit for active device
 *
 * @param character - The character
 * @returns Number of program slots, or 0 if no deck
 */
export function getProgramSlotLimit(character: Character): number {
  const deck = getActiveCyberdeck(character);
  return deck?.programSlots ?? 0;
}

/**
 * Check if program is compatible with device type
 *
 * In SR5:
 * - Cyberdecks can run all programs
 * - Commlinks can only run common programs
 * - RCCs can run autosofts (handled separately)
 *
 * @param programId - The program ID
 * @param deviceType - The device type
 * @param ruleset - The loaded ruleset
 * @returns True if compatible
 */
export function isProgramCompatible(
  programId: string,
  deviceType: MatrixDeviceType,
  ruleset: LoadedRuleset
): boolean {
  const program = findProgram(programId, ruleset);

  if (!program) {
    return false;
  }

  switch (deviceType) {
    case "cyberdeck":
      // Cyberdecks can run all programs
      return true;

    case "commlink":
      // Commlinks can only run common programs
      return program.category === "common";

    case "rcc":
      // RCCs don't run standard programs (they run autosofts)
      return false;

    case "technomancer-living-persona":
      // Technomancers use complex forms, not programs
      return false;

    default:
      return false;
  }
}

/**
 * Get programs currently loaded on a character's device
 *
 * @param character - The character
 * @returns Array of loaded program IDs
 */
export function getLoadedPrograms(character: Character): string[] {
  const deck = getActiveCyberdeck(character);
  return deck?.loadedPrograms ?? [];
}

/**
 * Check if a program is currently loaded
 *
 * @param character - The character
 * @param programId - The program ID to check
 * @returns True if program is loaded
 */
export function isProgramLoaded(character: Character, programId: string): boolean {
  const loadedPrograms = getLoadedPrograms(character);
  return loadedPrograms.includes(programId);
}

/**
 * Get programs owned by character that are NOT currently loaded
 *
 * @param character - The character
 * @returns Array of unloaded programs
 */
export function getUnloadedPrograms(character: Character): CharacterProgram[] {
  const loadedIds = new Set(getLoadedPrograms(character));
  const ownedPrograms = character.programs ?? [];

  return ownedPrograms.filter((program) => !loadedIds.has(program.catalogId));
}

/**
 * Validate that character owns a program before loading
 *
 * @param character - The character
 * @param programId - The program ID to check
 * @returns True if character owns the program
 */
export function characterOwnsProgram(character: Character, programId: string): boolean {
  const ownedPrograms = character.programs ?? [];
  return ownedPrograms.some((p) => p.catalogId === programId);
}

/**
 * Calculate effective program slots considering running agents
 *
 * Agent programs consume slots equal to their rating.
 *
 * @param character - The character
 * @param ruleset - The loaded ruleset
 * @returns Slots used by running programs
 */
export function calculateEffectiveSlotsUsed(character: Character, ruleset: LoadedRuleset): number {
  const loadedPrograms = getLoadedPrograms(character);
  let slotsUsed = 0;

  for (const programId of loadedPrograms) {
    const program = findProgram(programId, ruleset);
    if (program?.category === "agent") {
      // Agents use slots equal to their rating
      // Find the character's owned version to get the rating
      const owned = character.programs?.find((p) => p.catalogId === programId);
      slotsUsed += owned?.rating ?? 1;
    } else {
      // Normal programs use 1 slot each
      slotsUsed += 1;
    }
  }

  return slotsUsed;
}
