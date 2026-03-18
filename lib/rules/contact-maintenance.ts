/**
 * Contact Relationship Maintenance (Run Faster p. 177)
 *
 * Characters must interact with each contact every (Loyalty) months.
 * Missing the maintenance window triggers a Loyalty(2) test — failure
 * reduces Loyalty by 1, and Loyalty 0 means the contact is lost by
 * the next job.
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import type { ISODateString } from "../types/core";
import type { SocialContact } from "../types/contacts";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Threshold for the maintenance Loyalty test (Run Faster p. 177) */
const MAINTENANCE_TEST_THRESHOLD = 2;

// =============================================================================
// TYPES
// =============================================================================

/**
 * Maintenance status for a contact relationship
 */
export type MaintenanceStatusType =
  | "current" // Within maintenance window, no action needed
  | "overdue" // Past deadline, needs maintenance check
  | "at-risk" // Loyalty is 0, contact will be lost next job
  | "not-applicable"; // Non-active contact (burned, deceased, etc.)

/**
 * Result of checking a contact's maintenance status
 */
export interface MaintenanceStatus {
  /** Current maintenance status */
  status: MaintenanceStatusType;
  /** Whether the contact is past their maintenance deadline */
  overdue: boolean;
  /** When the next interaction is required. Null when not-applicable or at-risk. */
  deadline: ISODateString | null;
  /** Whether the contact is effectively lost (Loyalty 0) */
  contactLost: boolean;
}

/**
 * Result of resolving a maintenance check (GM Loyalty test)
 */
export interface MaintenanceCheckResult {
  /** Whether the maintenance check passed */
  success: boolean;
  /** Change to loyalty rating (0 on pass, -1 on fail) */
  loyaltyChange: number;
  /** The loyalty value after applying the change */
  newLoyalty: number;
  /** Whether the contact is lost (new loyalty = 0) */
  contactLost: boolean;
}

// =============================================================================
// MAINTENANCE DEADLINE
// =============================================================================

/**
 * Calculate the next maintenance deadline for a contact.
 *
 * Deadline = lastContactedAt + (Loyalty) months.
 * A Loyalty 3 contact must be interacted with every 3 months.
 *
 * @param lastContactedAt - ISO date of last interaction
 * @param loyalty - Contact's current loyalty rating
 * @returns ISO date string of the maintenance deadline
 */
export function getMaintenanceDeadline(
  lastContactedAt: ISODateString,
  loyalty: number
): ISODateString {
  const date = new Date(lastContactedAt);
  const sourceDay = date.getUTCDate();

  // Add months, then clamp to last valid day of target month
  // to avoid JavaScript's setUTCMonth overflow (e.g., Jan 31 + 1mo → Mar 2)
  date.setUTCMonth(date.getUTCMonth() + loyalty, 1); // set day=1 first to avoid overflow
  const maxDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
  date.setUTCDate(Math.min(sourceDay, maxDay));

  return date.toISOString();
}

// =============================================================================
// MAINTENANCE STATUS CHECK
// =============================================================================

/**
 * Check the maintenance status of a contact relationship.
 *
 * Determines whether a contact is current, overdue, at-risk, or
 * not applicable (non-active contacts don't need maintenance).
 *
 * @param contact - The contact to check
 * @param currentDate - Current date for comparison
 * @returns Maintenance status with deadline and risk flags
 */
export function checkMaintenanceStatus(
  contact: SocialContact,
  currentDate: ISODateString
): MaintenanceStatus {
  // Non-active contacts don't need maintenance
  if (contact.status !== "active") {
    return {
      status: "not-applicable",
      overdue: false,
      deadline: null,
      contactLost: false,
    };
  }

  // Loyalty 0 = contact is already lost
  if (contact.loyalty <= 0) {
    return {
      status: "at-risk",
      overdue: false,
      deadline: null,
      contactLost: true,
    };
  }

  // Use lastContactedAt or fall back to createdAt
  const lastInteraction = contact.lastContactedAt ?? contact.createdAt;
  const deadline = getMaintenanceDeadline(lastInteraction, contact.loyalty);

  const deadlineDate = new Date(deadline);
  const checkDate = new Date(currentDate);
  const overdue = checkDate > deadlineDate;

  return {
    status: overdue ? "overdue" : "current",
    overdue,
    deadline,
    contactLost: false,
  };
}

// =============================================================================
// MAINTENANCE CHECK RESOLUTION
// =============================================================================

/**
 * Resolve a maintenance check for an overdue contact.
 *
 * The GM rolls a Loyalty test with threshold 2. If the test fails,
 * the contact's Loyalty decreases by 1. If Loyalty reaches 0, the
 * contact is lost by the next job.
 *
 * @param currentLoyalty - Contact's current loyalty rating (must be >= 1)
 * @param hits - Number of hits rolled on the Loyalty test (must be >= 0)
 * @returns Result with loyalty change and lost status
 * @throws Error if currentLoyalty < 1 or hits < 0
 */
export function resolveMaintenanceCheck(
  currentLoyalty: number,
  hits: number
): MaintenanceCheckResult {
  if (currentLoyalty < 1) {
    throw new Error(`resolveMaintenanceCheck: currentLoyalty must be >= 1, got ${currentLoyalty}`);
  }
  if (hits < 0) {
    throw new Error(`resolveMaintenanceCheck: hits must be >= 0, got ${hits}`);
  }

  const success = hits >= MAINTENANCE_TEST_THRESHOLD;

  if (success) {
    return {
      success: true,
      loyaltyChange: 0,
      newLoyalty: currentLoyalty,
      contactLost: false,
    };
  }

  const newLoyalty = currentLoyalty - 1;

  return {
    success: false,
    loyaltyChange: -1,
    newLoyalty,
    contactLost: newLoyalty <= 0,
  };
}

// =============================================================================
// OVERDUE CONTACT DETECTION
// =============================================================================

/**
 * Find all contacts that need GM attention: overdue or at-risk (Loyalty 0).
 *
 * Only active contacts are checked — burned, deceased, inactive, and
 * missing contacts are excluded.
 *
 * @param contacts - All contacts to check
 * @param currentDate - Current date for comparison
 * @returns Array of contacts needing attention with their maintenance status
 */
export function getOverdueContacts(
  contacts: readonly SocialContact[],
  currentDate: ISODateString
): ReadonlyArray<{ contact: SocialContact; maintenanceStatus: MaintenanceStatus }> {
  return contacts
    .map((contact) => ({
      contact,
      maintenanceStatus: checkMaintenanceStatus(contact, currentDate),
    }))
    .filter(
      (result) => result.maintenanceStatus.overdue || result.maintenanceStatus.status === "at-risk"
    );
}
