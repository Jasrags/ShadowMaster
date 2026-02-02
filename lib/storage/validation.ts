/**
 * Storage Layer Data Validation
 *
 * Validates data structures before writing to files to prevent:
 * - CWE-73: External Control of File Name or Path
 * - Malformed data persistence
 * - Injection via control characters
 *
 * This module provides defense-in-depth validation at the storage layer,
 * complementing API-level validation.
 */

import type {
  Location,
  LocationTemplate,
  LocationType,
  LocationVisibility,
} from "../types/location";
import type { CampaignTemplate, EditionCode } from "../types";

// =============================================================================
// CONSTANTS
// =============================================================================

/**
 * Maximum string lengths for various fields.
 * Prevents memory exhaustion and ensures reasonable data sizes.
 */
const MAX_LENGTHS = {
  name: 500,
  description: 50000,
  shortText: 1000,
  mediumText: 5000,
  url: 2048,
  tag: 100,
  id: 100,
} as const;

/**
 * Allowlisted location types
 */
const VALID_LOCATION_TYPES: readonly LocationType[] = [
  "physical",
  "matrix-host",
  "astral",
  "safe-house",
  "meeting-place",
  "corporate",
  "gang-territory",
  "residential",
  "commercial",
  "industrial",
  "underground",
  "other",
] as const;

/**
 * Allowlisted location visibility values
 */
const VALID_VISIBILITY: readonly LocationVisibility[] = ["gm-only", "players", "public"] as const;

/**
 * Control characters that should not appear in stored data.
 * Allows newlines and tabs for legitimate multi-line content.
 */
const DANGEROUS_CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/;

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Check if a string contains dangerous control characters
 */
function hasDangerousChars(value: string): boolean {
  return DANGEROUS_CONTROL_CHARS.test(value);
}

/**
 * Validate a string field with length and character checks
 */
function validateString(
  value: unknown,
  fieldName: string,
  maxLength: number,
  required: boolean = false
): string | null {
  if (value === undefined || value === null) {
    if (required) {
      return `${fieldName} is required`;
    }
    return null;
  }

  if (typeof value !== "string") {
    return `${fieldName} must be a string`;
  }

  if (value.length > maxLength) {
    return `${fieldName} exceeds maximum length of ${maxLength}`;
  }

  if (hasDangerousChars(value)) {
    return `${fieldName} contains invalid control characters`;
  }

  return null;
}

/**
 * Validate an array of strings (e.g., tags)
 */
function validateStringArray(
  value: unknown,
  fieldName: string,
  maxItemLength: number,
  maxItems: number = 100
): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (!Array.isArray(value)) {
    return `${fieldName} must be an array`;
  }

  if (value.length > maxItems) {
    return `${fieldName} exceeds maximum of ${maxItems} items`;
  }

  for (let i = 0; i < value.length; i++) {
    const error = validateString(value[i], `${fieldName}[${i}]`, maxItemLength);
    if (error) return error;
  }

  return null;
}

/**
 * Validate a URL field
 */
function validateUrl(value: unknown, fieldName: string): string | null {
  if (value === undefined || value === null) {
    return null;
  }

  if (typeof value !== "string") {
    return `${fieldName} must be a string`;
  }

  if (value.length > MAX_LENGTHS.url) {
    return `${fieldName} exceeds maximum URL length`;
  }

  // Basic URL validation - must start with http(s) or be a relative path
  if (value && !value.match(/^(https?:\/\/|\/)/)) {
    return `${fieldName} must be a valid URL`;
  }

  return null;
}

/**
 * Validate a UUID-format ID
 */
function validateId(value: unknown, fieldName: string, required: boolean = false): string | null {
  if (value === undefined || value === null) {
    if (required) {
      return `${fieldName} is required`;
    }
    return null;
  }

  if (typeof value !== "string") {
    return `${fieldName} must be a string`;
  }

  if (value.length > MAX_LENGTHS.id) {
    return `${fieldName} exceeds maximum length`;
  }

  // Allow UUID format or simple alphanumeric IDs
  if (!value.match(/^[a-zA-Z0-9_-]+$/)) {
    return `${fieldName} contains invalid characters`;
  }

  return null;
}

/**
 * Validate an enum value against an allowlist
 */
function validateEnum<T extends string>(
  value: unknown,
  fieldName: string,
  allowedValues: readonly T[],
  required: boolean = false
): string | null {
  if (value === undefined || value === null) {
    if (required) {
      return `${fieldName} is required`;
    }
    return null;
  }

  if (typeof value !== "string") {
    return `${fieldName} must be a string`;
  }

  if (!allowedValues.includes(value as T)) {
    return `${fieldName} must be one of: ${allowedValues.join(", ")}`;
  }

  return null;
}

/**
 * Validate a number within a range
 */
function validateNumber(
  value: unknown,
  fieldName: string,
  min: number,
  max: number,
  required: boolean = false
): string | null {
  if (value === undefined || value === null) {
    if (required) {
      return `${fieldName} is required`;
    }
    return null;
  }

  if (typeof value !== "number" || isNaN(value)) {
    return `${fieldName} must be a number`;
  }

  if (value < min || value > max) {
    return `${fieldName} must be between ${min} and ${max}`;
  }

  return null;
}

/**
 * Helper to collect validation errors, filtering out nulls
 */
function collectErrors(...results: (string | null)[]): string[] {
  return results.filter((e): e is string => e !== null);
}

// =============================================================================
// LOCATION VALIDATION
// =============================================================================

/**
 * Validation result type
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Validate a Location object before writing to storage.
 *
 * This provides defense-in-depth validation at the storage layer,
 * ensuring data integrity regardless of API-level validation.
 */
export function validateLocationData(data: unknown): ValidationResult {
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["Location data must be an object"] };
  }

  const loc = data as Record<string, unknown>;
  const errors: string[] = [];

  // Required fields
  errors.push(
    ...collectErrors(
      validateId(loc.id, "id", true),
      validateId(loc.campaignId, "campaignId", true),
      validateString(loc.name, "name", MAX_LENGTHS.name, true),
      validateEnum(loc.type, "type", VALID_LOCATION_TYPES, true),
      validateEnum(loc.visibility, "visibility", VALID_VISIBILITY, true)
    )
  );

  // Optional string fields
  errors.push(
    ...collectErrors(
      validateString(loc.description, "description", MAX_LENGTHS.description),
      validateString(loc.gmNotes, "gmNotes", MAX_LENGTHS.description),
      validateString(loc.address, "address", MAX_LENGTHS.shortText),
      validateString(loc.district, "district", MAX_LENGTHS.shortText),
      validateString(loc.city, "city", MAX_LENGTHS.shortText),
      validateString(loc.country, "country", MAX_LENGTHS.shortText)
    )
  );

  // URL fields
  errors.push(
    ...collectErrors(validateUrl(loc.imageUrl, "imageUrl"), validateUrl(loc.mapUrl, "mapUrl"))
  );

  // Array fields
  errors.push(
    ...collectErrors(
      validateStringArray(loc.tags, "tags", MAX_LENGTHS.tag),
      validateStringArray(loc.images, "images", MAX_LENGTHS.url, 50)
    )
  );

  // ID arrays
  const idArrayFields = [
    "childLocationIds",
    "relatedLocationIds",
    "npcIds",
    "gruntTeamIds",
    "encounterIds",
    "sessionIds",
    "visitedByCharacterIds",
  ];
  for (const field of idArrayFields) {
    if (loc[field] !== undefined) {
      errors.push(...collectErrors(validateStringArray(loc[field], field, MAX_LENGTHS.id, 1000)));
    }
  }

  // Optional ID fields
  errors.push(...collectErrors(validateId(loc.parentLocationId, "parentLocationId")));

  // Numeric fields
  errors.push(
    ...collectErrors(
      validateNumber(loc.securityRating, "securityRating", 0, 20),
      validateNumber(loc.visitCount, "visitCount", 0, Number.MAX_SAFE_INTEGER)
    )
  );

  // Coordinates validation
  if (loc.coordinates !== undefined && loc.coordinates !== null) {
    if (typeof loc.coordinates !== "object") {
      errors.push("coordinates must be an object");
    } else {
      const coords = loc.coordinates as Record<string, unknown>;
      errors.push(
        ...collectErrors(
          validateNumber(coords.latitude, "coordinates.latitude", -90, 90),
          validateNumber(coords.longitude, "coordinates.longitude", -180, 180)
        )
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// =============================================================================
// LOCATION TEMPLATE VALIDATION
// =============================================================================

/**
 * Validate a LocationTemplate object before writing to storage.
 */
export function validateLocationTemplateData(data: unknown): ValidationResult {
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["LocationTemplate data must be an object"] };
  }

  const template = data as Record<string, unknown>;
  const errors: string[] = [];

  // Required fields
  errors.push(
    ...collectErrors(
      validateId(template.id, "id", true),
      validateId(template.createdBy, "createdBy", true),
      validateString(template.name, "name", MAX_LENGTHS.name, true),
      validateEnum(template.type, "type", VALID_LOCATION_TYPES, true)
    )
  );

  // Optional fields
  errors.push(
    ...collectErrors(
      validateString(template.description, "description", MAX_LENGTHS.description),
      validateStringArray(template.tags, "tags", MAX_LENGTHS.tag)
    )
  );

  // isPublic must be boolean
  if (template.isPublic !== undefined && typeof template.isPublic !== "boolean") {
    errors.push("isPublic must be a boolean");
  }

  // usageCount must be non-negative number
  errors.push(
    ...collectErrors(validateNumber(template.usageCount, "usageCount", 0, Number.MAX_SAFE_INTEGER))
  );

  // Validate templateData if present
  if (template.templateData !== undefined) {
    if (typeof template.templateData !== "object" || template.templateData === null) {
      errors.push("templateData must be an object");
    } else {
      // Validate nested templateData fields
      const td = template.templateData as Record<string, unknown>;
      errors.push(
        ...collectErrors(
          validateString(td.name, "templateData.name", MAX_LENGTHS.name, true),
          validateEnum(td.type, "templateData.type", VALID_LOCATION_TYPES, true),
          validateEnum(td.visibility, "templateData.visibility", VALID_VISIBILITY, true),
          validateString(td.description, "templateData.description", MAX_LENGTHS.description)
        )
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// =============================================================================
// CAMPAIGN TEMPLATE VALIDATION
// =============================================================================

/**
 * Known edition codes (can be extended)
 */
const KNOWN_EDITION_CODES: readonly EditionCode[] = [
  "sr1",
  "sr2",
  "sr3",
  "sr4",
  "sr4a",
  "sr5",
  "sr6",
  "anarchy",
] as const;

/**
 * Validate a CampaignTemplate object before writing to storage.
 */
export function validateCampaignTemplateData(data: unknown): ValidationResult {
  if (!data || typeof data !== "object") {
    return { valid: false, errors: ["CampaignTemplate data must be an object"] };
  }

  const template = data as Record<string, unknown>;
  const errors: string[] = [];

  // Required fields
  errors.push(
    ...collectErrors(
      validateId(template.id, "id", true),
      validateId(template.createdBy, "createdBy", true),
      validateString(template.name, "name", MAX_LENGTHS.name, true),
      validateEnum(template.editionCode, "editionCode", KNOWN_EDITION_CODES, true)
    )
  );

  // Optional fields
  errors.push(
    ...collectErrors(validateString(template.description, "description", MAX_LENGTHS.description))
  );

  // Array fields
  errors.push(
    ...collectErrors(
      validateStringArray(template.enabledBookIds, "enabledBookIds", MAX_LENGTHS.id, 100),
      validateStringArray(
        template.enabledCreationMethodIds,
        "enabledCreationMethodIds",
        MAX_LENGTHS.id,
        50
      ),
      validateStringArray(
        template.enabledOptionalRules,
        "enabledOptionalRules",
        MAX_LENGTHS.id,
        100
      )
    )
  );

  // isPublic must be boolean
  if (template.isPublic !== undefined && typeof template.isPublic !== "boolean") {
    errors.push("isPublic must be a boolean");
  }

  // houseRules validation
  if (template.houseRules !== undefined && template.houseRules !== null) {
    if (typeof template.houseRules !== "object") {
      errors.push("houseRules must be an object");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// =============================================================================
// VALIDATED WRITE HELPER
// =============================================================================

/**
 * Error thrown when data validation fails before write
 */
export class StorageValidationError extends Error {
  constructor(
    public readonly errors: string[],
    public readonly dataType: string
  ) {
    super(`Invalid ${dataType} data: ${errors.join("; ")}`);
    this.name = "StorageValidationError";
  }
}

/**
 * Assert that validation passed, throwing if not
 */
export function assertValid(result: ValidationResult, dataType: string): void {
  if (!result.valid) {
    throw new StorageValidationError(result.errors, dataType);
  }
}
