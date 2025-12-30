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
  | "damage_healed"
  // Gear modification actions
  | "gear_modified";

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

// =============================================================================
// USER AUDIT TYPES (Participant Governance)
// =============================================================================

/**
 * All auditable actions on user accounts
 */
export type UserAuditAction =
  | "user_created"
  | "user_role_granted"
  | "user_role_revoked"
  | "user_email_changed"
  | "user_username_changed"
  | "user_suspended"
  | "user_reactivated"
  | "user_deleted"
  | "user_lockout_triggered"
  | "user_lockout_cleared";

/**
 * Actor who performed a user management action
 */
export interface UserAuditActor {
  userId: ID;
  role: "admin" | "system";
}

/**
 * Immutable record of a single auditable action on a user account
 */
export interface UserAuditEntry {
  /** Unique identifier for this audit entry */
  id: ID;

  /** When the action occurred */
  timestamp: ISODateString;

  /** Type of action performed */
  action: UserAuditAction;

  /** Who performed the action */
  actor: UserAuditActor;

  /** The user account affected by this action */
  targetUserId: ID;

  /** Details about the change */
  details: {
    /** Value before the change */
    previousValue?: unknown;
    /** Value after the change */
    newValue?: unknown;
    /** Reason for the action (e.g., suspension reason) */
    reason?: string;
    /** Additional context */
    [key: string]: unknown;
  };
}

/**
 * Parameters for creating a user audit entry
 */
export interface CreateUserAuditEntryParams {
  action: UserAuditAction;
  actor: UserAuditActor;
  targetUserId: ID;
  details?: UserAuditEntry["details"];
}

/**
 * Query options for retrieving user audit entries
 */
export interface UserAuditQueryOptions {
  /** Filter by action types */
  actions?: UserAuditAction[];
  /** Filter by actor */
  actorId?: ID;
  /** Filter by target user */
  targetUserId?: ID;
  /** Filter by date range */
  fromDate?: ISODateString;
  toDate?: ISODateString;
  /** Pagination offset */
  offset?: number;
  /** Limit number of results */
  limit?: number;
  /** Sort order (default: descending by timestamp) */
  order?: "asc" | "desc";
}
