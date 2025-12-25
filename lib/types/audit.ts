/**
 * Audit types for character lifecycle tracking
 *
 * Provides immutable audit trail for all character state changes,
 * ensuring traceability and compliance with governance requirements.
 */

import type { ID, ISODateString } from "./core";
import type { EditionCode } from "./edition";
import type { CharacterStatus } from "./character";

// =============================================================================
// AUDIT ACTIONS
// =============================================================================

/**
 * All auditable actions on a character
 */
export type AuditAction =
  // Lifecycle transitions
  | "created"
  | "finalized"
  | "retired"
  | "reactivated"
  | "deceased"
  // Character modifications
  | "updated"
  | "name_changed"
  // Advancement actions
  | "advancement_requested"
  | "advancement_applied"
  | "advancement_approved"
  | "advancement_rejected"
  | "training_started"
  | "training_completed"
  | "training_interrupted"
  // Campaign actions
  | "campaign_joined"
  | "campaign_left"
  | "approval_requested"
  | "approval_granted"
  | "approval_rejected"
  // Damage/Healing actions
  | "damage_applied"
  | "damage_healed";

// =============================================================================
// ACTOR TYPES
// =============================================================================

/**
 * Role of the actor performing the action
 */
export type ActorRole = "owner" | "gm" | "admin" | "system";

/**
 * Actor who performed an auditable action
 */
export interface AuditActor {
  userId: ID;
  role: ActorRole;
}

// =============================================================================
// AUDIT ENTRY
// =============================================================================

/**
 * Ruleset snapshot at time of audit
 * Captures which rules were active when the change occurred
 */
export interface RulesetSnapshot {
  editionCode: EditionCode;
  activeBookIds: ID[];
  version?: string;
}

/**
 * State transition details for lifecycle changes
 */
export interface StateTransitionDetails {
  fromStatus: CharacterStatus;
  toStatus: CharacterStatus;
  validationPassed?: boolean;
  validationErrors?: string[];
}

/**
 * Immutable record of a single auditable action on a character
 */
export interface AuditEntry {
  /** Unique identifier for this audit entry */
  id: ID;

  /** When the action occurred */
  timestamp: ISODateString;

  /** Type of action performed */
  action: AuditAction;

  /** Who performed the action */
  actor: AuditActor;

  /** Additional context about the action */
  details: Record<string, unknown>;

  /** State transition info (for lifecycle changes) */
  stateTransition?: StateTransitionDetails;

  /** Ruleset state at time of action */
  rulesetSnapshot?: RulesetSnapshot;

  /** Optional human-readable note */
  note?: string;
}

// =============================================================================
// AUDIT LOG OPERATIONS
// =============================================================================

/**
 * Parameters for creating an audit entry
 */
export interface CreateAuditEntryParams {
  action: AuditAction;
  actor: AuditActor;
  details?: Record<string, unknown>;
  stateTransition?: StateTransitionDetails;
  rulesetSnapshot?: RulesetSnapshot;
  note?: string;
}

/**
 * Query options for retrieving audit entries
 */
export interface AuditQueryOptions {
  /** Filter by action types */
  actions?: AuditAction[];
  /** Filter by actor */
  actorId?: ID;
  /** Filter by date range */
  fromDate?: ISODateString;
  toDate?: ISODateString;
  /** Limit number of results */
  limit?: number;
  /** Sort order (default: descending by timestamp) */
  order?: "asc" | "desc";
}
