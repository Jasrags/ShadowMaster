/**
 * Contact rules and validation
 *
 * Provides validation, state transition rules, and cost calculations
 * for social contacts.
 *
 * Capability References:
 * - "The system MUST enforce mandatory contact-specific attribute requirements"
 * - "Transitions in contact state MUST satisfy all prerequisites and resource requirements"
 * - "Social actions MUST NOT exceed the constraints defined by character's current social capital"
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import type { Character } from "../types";
import type {
  SocialContact,
  ContactStatus,
  CreateContactRequest,
  SocialCapital,
} from "../types/contacts";

// =============================================================================
// EDITION-SPECIFIC LIMITS
// =============================================================================

/**
 * Get maximum connection rating for an edition
 */
export function getMaxConnection(editionCode: string): number {
  switch (editionCode) {
    case "sr5":
      return 12;
    case "sr6":
      return 6;
    case "sr4":
    case "sr4a":
      return 6;
    default:
      return 12; // Default to SR5
  }
}

/**
 * Get maximum loyalty rating for an edition
 */
export function getMaxLoyalty(editionCode: string): number {
  switch (editionCode) {
    case "sr5":
      return 6;
    case "sr6":
      return 6;
    case "sr4":
    case "sr4a":
      return 6;
    default:
      return 6; // Universal across editions
  }
}

/**
 * Get minimum connection rating
 */
export function getMinConnection(_editionCode: string): number {
  return 1;
}

/**
 * Get minimum loyalty rating
 */
export function getMinLoyalty(_editionCode: string): number {
  return 1;
}

// =============================================================================
// CONTACT VALIDATION
// =============================================================================

/**
 * Validation result for a contact
 */
export interface ContactValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate a contact against edition rules
 *
 * @param contact - Contact data to validate
 * @param editionCode - Edition to validate against
 * @returns Validation result
 */
export function validateContact(
  contact: Partial<SocialContact> | CreateContactRequest,
  editionCode: string
): ContactValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Required fields
  if (!contact.name || contact.name.trim().length === 0) {
    errors.push("Contact name is required");
  } else if (contact.name.length > 100) {
    errors.push("Contact name must be 100 characters or less");
  }

  if (!contact.archetype || contact.archetype.trim().length === 0) {
    errors.push("Contact archetype is required");
  }

  // Connection validation
  if (contact.connection === undefined || contact.connection === null) {
    errors.push("Connection rating is required");
  } else {
    const minConn = getMinConnection(editionCode);
    const maxConn = getMaxConnection(editionCode);

    if (contact.connection < minConn) {
      errors.push(`Connection rating must be at least ${minConn}`);
    }
    if (contact.connection > maxConn) {
      errors.push(`Connection rating cannot exceed ${maxConn} for ${editionCode}`);
    }
    if (!Number.isInteger(contact.connection)) {
      errors.push("Connection rating must be a whole number");
    }
  }

  // Loyalty validation
  if (contact.loyalty === undefined || contact.loyalty === null) {
    errors.push("Loyalty rating is required");
  } else {
    const minLoy = getMinLoyalty(editionCode);
    const maxLoy = getMaxLoyalty(editionCode);

    if (contact.loyalty < minLoy) {
      errors.push(`Loyalty rating must be at least ${minLoy}`);
    }
    if (contact.loyalty > maxLoy) {
      errors.push(`Loyalty rating cannot exceed ${maxLoy} for ${editionCode}`);
    }
    if (!Number.isInteger(contact.loyalty)) {
      errors.push("Loyalty rating must be a whole number");
    }
  }

  // Warnings for edge cases
  if (contact.connection === 1 && contact.loyalty === 1) {
    warnings.push("Very low connection and loyalty - contact may not be useful");
  }

  if (contact.loyalty === 1) {
    warnings.push("Loyalty 1 contacts may betray you for minimal gain");
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate contact against campaign constraints
 *
 * @param contact - Contact to validate
 * @param socialCapital - Character's social capital with campaign constraints
 * @returns Validation result
 */
export function validateContactAgainstCampaign(
  contact: Partial<SocialContact> | CreateContactRequest,
  socialCapital: SocialCapital
): ContactValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check connection limit
  if (
    socialCapital.campaignMaxConnection !== undefined &&
    contact.connection !== undefined &&
    contact.connection > socialCapital.campaignMaxConnection
  ) {
    errors.push(
      `Connection rating ${contact.connection} exceeds campaign limit of ${socialCapital.campaignMaxConnection}`
    );
  }

  // Check loyalty limit
  if (
    socialCapital.campaignMaxLoyalty !== undefined &&
    contact.loyalty !== undefined &&
    contact.loyalty > socialCapital.campaignMaxLoyalty
  ) {
    errors.push(
      `Loyalty rating ${contact.loyalty} exceeds campaign limit of ${socialCapital.campaignMaxLoyalty}`
    );
  }

  // Check contact count limit
  if (
    socialCapital.campaignContactLimit !== undefined &&
    socialCapital.activeContacts >= socialCapital.campaignContactLimit
  ) {
    errors.push(`Campaign contact limit of ${socialCapital.campaignContactLimit} reached`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

// =============================================================================
// CONTACT BUDGET
// =============================================================================

/**
 * Calculate contact points for a contact (connection + loyalty)
 */
export function calculateContactPoints(contact: { connection: number; loyalty: number }): number {
  return contact.connection + contact.loyalty;
}

/**
 * Validate that a character can afford a new contact
 *
 * @param character - Character adding the contact
 * @param newContact - Contact to add
 * @param socialCapital - Character's current social capital
 * @returns Validation result with budget details
 */
export function validateContactBudget(
  character: Character,
  newContact: { connection: number; loyalty: number },
  socialCapital: SocialCapital | null
): {
  allowed: boolean;
  pointsRequired: number;
  pointsAvailable: number;
  reason?: string;
} {
  const pointsRequired = calculateContactPoints(newContact);

  // No social capital tracking = unlimited
  if (!socialCapital) {
    return {
      allowed: true,
      pointsRequired,
      pointsAvailable: Infinity,
    };
  }

  const pointsAvailable = socialCapital.availableContactPoints;

  if (pointsRequired > pointsAvailable) {
    return {
      allowed: false,
      pointsRequired,
      pointsAvailable,
      reason: `Insufficient contact points: need ${pointsRequired}, have ${pointsAvailable}`,
    };
  }

  return {
    allowed: true,
    pointsRequired,
    pointsAvailable,
  };
}

// =============================================================================
// STATE TRANSITIONS
// =============================================================================

/**
 * Valid state transitions for contacts
 */
const VALID_TRANSITIONS: Record<ContactStatus, ContactStatus[]> = {
  active: ["burned", "inactive", "missing", "deceased"],
  burned: ["active"], // Reactivation costs karma
  inactive: ["active", "missing", "deceased"],
  missing: ["active", "deceased"], // Found or confirmed dead
  deceased: [], // Terminal state
};

/**
 * Check if a contact state transition is valid
 *
 * @param currentStatus - Current contact status
 * @param newStatus - Desired new status
 * @returns Whether transition is allowed
 */
export function isValidTransition(currentStatus: ContactStatus, newStatus: ContactStatus): boolean {
  if (currentStatus === newStatus) {
    return true; // No-op is always valid
  }

  return VALID_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

/**
 * Check if a contact can be burned
 *
 * @param contact - Contact to check
 * @returns Result with allowed status and reason
 */
export function canBurnContact(contact: SocialContact): {
  allowed: boolean;
  reason?: string;
} {
  if (contact.status === "burned") {
    return { allowed: false, reason: "Contact is already burned" };
  }

  if (contact.status === "deceased") {
    return { allowed: false, reason: "Cannot burn a deceased contact" };
  }

  return { allowed: true };
}

/**
 * Check if a contact can be reactivated
 *
 * @param contact - Contact to check
 * @param character - Character who owns the contact
 * @returns Result with allowed status, karma cost, and reason
 */
export function canReactivateContact(
  contact: SocialContact,
  character: Character
): {
  allowed: boolean;
  karmaCost: number;
  reason?: string;
} {
  if (contact.status === "active") {
    return { allowed: false, karmaCost: 0, reason: "Contact is already active" };
  }

  if (contact.status === "deceased") {
    return { allowed: false, karmaCost: 0, reason: "Cannot reactivate deceased contact" };
  }

  const karmaCost = getReactivationCost(contact, character.editionCode);

  if (character.karmaCurrent < karmaCost) {
    return {
      allowed: false,
      karmaCost,
      reason: `Insufficient karma: need ${karmaCost}, have ${character.karmaCurrent}`,
    };
  }

  return { allowed: true, karmaCost };
}

/**
 * Calculate karma cost to reactivate a contact
 *
 * SR5 rules: Reactivating a burned contact costs (Connection + Loyalty) karma
 *
 * @param contact - Contact to reactivate
 * @param editionCode - Edition for cost calculation
 * @returns Karma cost
 */
export function getReactivationCost(contact: SocialContact, editionCode: string): number {
  switch (editionCode) {
    case "sr5":
      // SR5: Connection + Loyalty in karma
      return contact.connection + contact.loyalty;
    case "sr6":
      // SR6: Similar formula
      return contact.connection + contact.loyalty;
    default:
      return contact.connection + contact.loyalty;
  }
}

// =============================================================================
// LOYALTY/CONNECTION IMPROVEMENT
// =============================================================================

/**
 * Get cost to improve loyalty
 *
 * SR5: New rating x 2 karma
 *
 * @param currentLoyalty - Current loyalty rating
 * @param editionCode - Edition for cost calculation
 * @returns Cost details
 */
export function getLoyaltyImprovementCost(
  currentLoyalty: number,
  editionCode: string
): {
  karmaCost: number;
  nuyenCost?: number;
  timeRequired?: string;
  canImprove: boolean;
  reason?: string;
} {
  const maxLoyalty = getMaxLoyalty(editionCode);

  if (currentLoyalty >= maxLoyalty) {
    return {
      karmaCost: 0,
      canImprove: false,
      reason: `Loyalty is already at maximum (${maxLoyalty})`,
    };
  }

  const newRating = currentLoyalty + 1;

  switch (editionCode) {
    case "sr5":
      return {
        karmaCost: newRating * 2,
        timeRequired: "1 week",
        canImprove: true,
      };
    case "sr6":
      return {
        karmaCost: newRating * 2,
        canImprove: true,
      };
    default:
      return {
        karmaCost: newRating * 2,
        canImprove: true,
      };
  }
}

/**
 * Get cost to improve connection
 *
 * Connection improvements are typically narrative/GM-driven,
 * but some editions have karma costs.
 *
 * @param currentConnection - Current connection rating
 * @param editionCode - Edition for cost calculation
 * @returns Cost details
 */
export function getConnectionImprovementCost(
  currentConnection: number,
  editionCode: string
): {
  karmaCost: number;
  nuyenCost?: number;
  timeRequired?: string;
  canImprove: boolean;
  reason?: string;
} {
  const maxConnection = getMaxConnection(editionCode);

  if (currentConnection >= maxConnection) {
    return {
      karmaCost: 0,
      canImprove: false,
      reason: `Connection is already at maximum (${maxConnection})`,
    };
  }

  const newRating = currentConnection + 1;

  switch (editionCode) {
    case "sr5":
      // SR5: Connection improvement is usually narrative
      // but optional rule allows new rating x 2 karma
      return {
        karmaCost: newRating * 2,
        nuyenCost: newRating * 2000, // Helping them build influence
        timeRequired: "1 month",
        canImprove: true,
      };
    case "sr6":
      return {
        karmaCost: newRating * 2,
        canImprove: true,
      };
    default:
      return {
        karmaCost: newRating * 2,
        canImprove: true,
      };
  }
}

/**
 * Get cost to acquire a new contact post-creation
 *
 * @param connection - Contact's connection rating
 * @param loyalty - Contact's loyalty rating
 * @param editionCode - Edition for cost calculation
 * @returns Karma cost
 */
export function getNewContactCost(
  connection: number,
  loyalty: number,
  editionCode: string
): number {
  switch (editionCode) {
    case "sr5":
      // SR5: (Connection + Loyalty) karma
      return connection + loyalty;
    case "sr6":
      // SR6: Similar
      return connection + loyalty;
    default:
      return connection + loyalty;
  }
}

// =============================================================================
// SHARED CONTACT MECHANICS
// =============================================================================

/**
 * Calculate effective ratings when using a shared contact
 *
 * When a character uses another character's contact, they may have
 * reduced effectiveness.
 *
 * @param contact - The shared contact
 * @param requestingCharacterId - Character trying to use the contact
 * @param owningCharacterId - Character who owns the contact
 * @returns Effective ratings for the requesting character
 */
export function resolveSharedContact(
  contact: SocialContact,
  requestingCharacterId: string,
  owningCharacterId: string
): {
  effectiveConnection: number;
  effectiveLoyalty: number;
  favorCostMultiplier: number;
} {
  // If requesting character is the owner, full ratings apply
  if (requestingCharacterId === owningCharacterId) {
    return {
      effectiveConnection: contact.connection,
      effectiveLoyalty: contact.loyalty,
      favorCostMultiplier: 1,
    };
  }

  // Check if explicitly shared with this character
  const isExplicitlyShared =
    contact.sharedWithCharacterIds?.includes(requestingCharacterId) ?? false;

  if (isExplicitlyShared) {
    // Shared contacts have reduced loyalty for non-owners
    return {
      effectiveConnection: contact.connection,
      effectiveLoyalty: Math.max(1, contact.loyalty - 1),
      favorCostMultiplier: 1.5,
    };
  }

  // Campaign contacts have further reduced effectiveness for random users
  if (contact.group === "campaign") {
    return {
      effectiveConnection: contact.connection,
      effectiveLoyalty: Math.max(1, contact.loyalty - 2),
      favorCostMultiplier: 2,
    };
  }

  // Shouldn't reach here for properly scoped contacts
  return {
    effectiveConnection: contact.connection,
    effectiveLoyalty: 1,
    favorCostMultiplier: 2,
  };
}
