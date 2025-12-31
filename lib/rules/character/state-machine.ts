/**
 * Character State Machine
 *
 * Enforces controlled lifecycle transitions for character entities.
 * All state changes go through this module to ensure:
 * - Only valid transitions are allowed
 * - Required validations are performed
 * - Authorization is verified
 * - Audit entries are created
 *
 * Satisfies:
 * - Guarantee: "The system MUST enforce a controlled lifecycle for every character entity"
 * - Requirement: "The system MUST track and enforce character status transitions"
 */

import { v4 as uuidv4 } from "uuid";
import type { Character, CharacterStatus } from "@/lib/types/character";
import type {
  AuditEntry,
  AuditActor,
  ActorRole,
  CreateAuditEntryParams,
} from "@/lib/types/audit";
import type { ID } from "@/lib/types/core";

// =============================================================================
// VALIDATION TYPES
// =============================================================================

/**
 * Result of a validation operation
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  field?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  field?: string;
}

/**
 * Function that validates whether a character can transition
 */
export type TransitionValidator = (
  character: Character
) => ValidationResult | Promise<ValidationResult>;

// =============================================================================
// TRANSITION DEFINITIONS
// =============================================================================

/**
 * Definition of a valid state transition
 */
export interface StateTransition {
  /** Source state */
  from: CharacterStatus;
  /** Target state */
  to: CharacterStatus;
  /** Optional validator to check if transition is allowed */
  validator?: TransitionValidator;
  /** Roles that can perform this transition */
  allowedRoles: ActorRole[];
  /** Human-readable description */
  description: string;
}

/**
 * All valid state transitions in the system
 */
export const VALID_TRANSITIONS: StateTransition[] = [
  // Draft → Active: Requires character completion validation
  {
    from: "draft",
    to: "active",
    validator: validateCharacterComplete,
    allowedRoles: ["owner", "admin"],
    description: "Finalize character for play",
  },

  // Active → Retired: Owner or GM can retire
  {
    from: "active",
    to: "retired",
    allowedRoles: ["owner", "gm", "admin"],
    description: "Retire character from active play",
  },

  // Active → Deceased: Character death
  {
    from: "active",
    to: "deceased",
    allowedRoles: ["owner", "gm", "admin"],
    description: "Mark character as deceased",
  },

  // Retired → Active: Reactivate a retired character
  {
    from: "retired",
    to: "active",
    allowedRoles: ["owner", "gm", "admin"],
    description: "Return retired character to active play",
  },

  // Deceased → Active: Resurrection (requires GM approval in campaigns)
  {
    from: "deceased",
    to: "active",
    allowedRoles: ["gm", "admin"],
    description: "Resurrect deceased character (GM only)",
  },

  // =============================================================================
  // ADMIN-ONLY BACKWARD TRANSITIONS
  // These allow administrators to revert character status for corrections
  // =============================================================================

  // Active → Draft: Admin can revert to draft for major corrections
  {
    from: "active",
    to: "draft",
    allowedRoles: ["admin"],
    description: "Revert active character to draft for editing (admin only)",
  },

  // Retired → Draft: Admin can revert to draft
  {
    from: "retired",
    to: "draft",
    allowedRoles: ["admin"],
    description: "Revert retired character to draft for editing (admin only)",
  },

  // Deceased → Draft: Admin can revert to draft
  {
    from: "deceased",
    to: "draft",
    allowedRoles: ["admin"],
    description: "Revert deceased character to draft for editing (admin only)",
  },

  // Retired → Deceased: Admin can mark retired as deceased
  {
    from: "retired",
    to: "deceased",
    allowedRoles: ["admin"],
    description: "Mark retired character as deceased (admin only)",
  },

  // Deceased → Retired: Admin can mark deceased as retired instead
  {
    from: "deceased",
    to: "retired",
    allowedRoles: ["admin"],
    description: "Change deceased character to retired (admin only)",
  },
];

// =============================================================================
// TRANSITION VALIDATION
// =============================================================================

/**
 * Validates that a character has all required fields for finalization
 */
export function validateCharacterComplete(
  character: Character
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];

  // Required basic info
  if (!character.name || character.name.trim() === "") {
    errors.push({
      code: "MISSING_NAME",
      message: "Character must have a name",
      field: "name",
    });
  }

  if (!character.metatype || character.metatype.trim() === "") {
    errors.push({
      code: "MISSING_METATYPE",
      message: "Character must have a metatype selected",
      field: "metatype",
    });
  }

  // Required attributes
  if (!character.attributes || Object.keys(character.attributes).length === 0) {
    errors.push({
      code: "MISSING_ATTRIBUTES",
      message: "Character must have attributes allocated",
      field: "attributes",
    });
  }

  // Check for at least some skills
  if (!character.skills || Object.keys(character.skills).length === 0) {
    warnings.push({
      code: "NO_SKILLS",
      message: "Character has no skills selected",
      field: "skills",
    });
  }

  // Check for at least one lifestyle
  if (!character.lifestyles || character.lifestyles.length === 0) {
    errors.push({
      code: "MISSING_LIFESTYLE",
      message: "Character must have at least one lifestyle",
      field: "lifestyles",
    });
  }

  // Check for at least one identity with SIN
  if (!character.identities || character.identities.length === 0) {
    errors.push({
      code: "MISSING_IDENTITY",
      message: "Character must have at least one identity",
      field: "identities",
    });
  }

  // Magic users should have appropriate selections
  if (
    character.magicalPath &&
    character.magicalPath !== "mundane" &&
    character.magicalPath !== "aspected-mage"
  ) {
    if (character.magicalPath === "full-mage" || character.magicalPath === "mystic-adept") {
      if (!character.tradition) {
        warnings.push({
          code: "MISSING_TRADITION",
          message: "Magical character should have a tradition selected",
          field: "tradition",
        });
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Find the transition definition for a given state change
 */
export function findTransition(
  from: CharacterStatus,
  to: CharacterStatus
): StateTransition | undefined {
  return VALID_TRANSITIONS.find((t) => t.from === from && t.to === to);
}

/**
 * Check if a transition is valid (exists in the transition table)
 */
export function isValidTransition(
  from: CharacterStatus,
  to: CharacterStatus
): boolean {
  return findTransition(from, to) !== undefined;
}

/**
 * Check if an actor can perform a specific transition
 */
export function canActorPerformTransition(
  transition: StateTransition,
  actorRole: ActorRole
): boolean {
  return transition.allowedRoles.includes(actorRole);
}

// =============================================================================
// TRANSITION EXECUTION
// =============================================================================

/**
 * Result of attempting a state transition
 */
export interface TransitionResult {
  success: boolean;
  character?: Character;
  auditEntry?: AuditEntry;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
}

/**
 * Context for executing a transition
 */
export interface TransitionContext {
  actor: AuditActor;
  note?: string;
  skipValidation?: boolean; // For admin overrides only
}

/**
 * Check if a character can transition to a target state
 */
export async function canTransition(
  character: Character,
  targetStatus: CharacterStatus,
  actorRole: ActorRole
): Promise<{
  allowed: boolean;
  reason?: string;
  validation?: ValidationResult;
}> {
  // Same state - no transition needed
  if (character.status === targetStatus) {
    return { allowed: false, reason: "Character is already in this state" };
  }

  // Find the transition definition
  const transition = findTransition(character.status, targetStatus);
  if (!transition) {
    return {
      allowed: false,
      reason: `Invalid transition from ${character.status} to ${targetStatus}`,
    };
  }

  // Check authorization
  if (!canActorPerformTransition(transition, actorRole)) {
    return {
      allowed: false,
      reason: `Role '${actorRole}' is not authorized to perform this transition`,
    };
  }

  // Run validation if defined
  if (transition.validator) {
    const validation = await transition.validator(character);
    if (!validation.valid) {
      return {
        allowed: false,
        reason: "Character validation failed",
        validation,
      };
    }
    return { allowed: true, validation };
  }

  return { allowed: true };
}

/**
 * Execute a state transition on a character
 *
 * This function:
 * 1. Validates the transition is allowed
 * 2. Runs any required validators
 * 3. Updates the character status
 * 4. Creates an audit entry
 *
 * Note: This function returns the updated character but does NOT persist it.
 * The caller is responsible for saving the character to storage.
 */
export async function executeTransition(
  character: Character,
  targetStatus: CharacterStatus,
  context: TransitionContext
): Promise<TransitionResult> {
  const { actor, note, skipValidation } = context;

  // Check if transition is allowed
  const canResult = await canTransition(character, targetStatus, actor.role);

  if (!canResult.allowed && !skipValidation) {
    return {
      success: false,
      errors: canResult.validation?.errors || [
        { code: "TRANSITION_DENIED", message: canResult.reason || "Transition not allowed" },
      ],
      warnings: canResult.validation?.warnings,
    };
  }

  // Determine audit action based on transition
  const auditAction = getAuditActionForTransition(character.status, targetStatus);

  // Create audit entry
  const auditEntry = createAuditEntry({
    action: auditAction,
    actor,
    stateTransition: {
      fromStatus: character.status,
      toStatus: targetStatus,
      validationPassed: canResult.validation?.valid ?? true,
      validationErrors: canResult.validation?.errors?.map((e) => e.message),
    },
    note,
  });

  // Create updated character with new status and audit entry
  const updatedCharacter: Character = {
    ...character,
    status: targetStatus,
    updatedAt: new Date().toISOString(),
    auditLog: [...(character.auditLog || []), auditEntry],
  };

  return {
    success: true,
    character: updatedCharacter,
    auditEntry,
    warnings: canResult.validation?.warnings,
  };
}

// =============================================================================
// AUDIT HELPERS
// =============================================================================

/**
 * Map state transitions to audit actions
 */
function getAuditActionForTransition(
  from: CharacterStatus,
  to: CharacterStatus
): "finalized" | "retired" | "reactivated" | "deceased" | "updated" {
  // Forward transitions
  if (from === "draft" && to === "active") return "finalized";
  if (to === "retired") return "retired";
  if (to === "deceased") return "deceased";
  if (to === "active" && (from === "retired" || from === "deceased")) return "reactivated";

  // Backward transitions (admin only) - use "updated" as it represents a status correction
  if (to === "draft") return "updated";

  return "updated"; // Fallback for any other transitions
}

/**
 * Create an audit entry with standard fields
 */
export function createAuditEntry(params: CreateAuditEntryParams): AuditEntry {
  return {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    action: params.action,
    actor: params.actor,
    details: params.details || {},
    stateTransition: params.stateTransition,
    rulesetSnapshot: params.rulesetSnapshot,
    note: params.note,
  };
}

/**
 * Append an audit entry to a character
 * Returns a new character object (does not mutate)
 */
export function appendAuditEntry(
  character: Character,
  entry: AuditEntry
): Character {
  return {
    ...character,
    auditLog: [...(character.auditLog || []), entry],
    updatedAt: new Date().toISOString(),
  };
}

// =============================================================================
// ROLE HELPERS
// =============================================================================

/**
 * Determine the role of a user for a given character
 */
export function determineActorRole(
  userId: ID,
  character: Character,
  campaignGmId?: ID,
  isAdmin?: boolean
): ActorRole {
  if (isAdmin) return "admin";
  if (campaignGmId && userId === campaignGmId) return "gm";
  if (userId === character.ownerId) return "owner";
  return "owner"; // Default to owner for now (no player role yet)
}
