/**
 * Group/Organization Contact Restrictions (Run Faster p. 179)
 *
 * Organization contacts are faceless representatives — they have no personal
 * relationship with the character. Key restrictions:
 * - Loyalty capped at 1
 * - Cannot use favors or chips (legwork and networking only)
 * - Contractual obligations; leaves a data trail
 * - Karma cost counts against positive quality limit
 *
 * NOTE: This module is a standalone rules layer. Integration with the
 * existing contact validation pipeline (`lib/rules/contacts.ts`) and
 * favor system (`lib/rules/favors.ts`) will be done in a wiring PR.
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import type { SocialContact, ContactServiceType } from "../types/contacts";

// =============================================================================
// CONSTANTS
// =============================================================================

/** Maximum loyalty for organization contacts (faceless — no personal bond) */
const ORGANIZATION_MAX_LOYALTY = 1;

/** Service types allowed for organization contacts */
const ALLOWED_ORGANIZATION_SERVICES: ReadonlySet<ContactServiceType> = new Set([
  "legwork",
  "networking",
]);

// =============================================================================
// TYPES
// =============================================================================

/** Definition of an organization that can be a group contact */
export interface OrganizationDefinition {
  /** Kebab-case identifier */
  id: string;
  /** Display name */
  name: string;
  /** Description of the organization */
  description: string;
  /** Connection bonus when using this organization */
  connectionBonus: number;
  /** Karma cost to acquire this organization as a contact */
  karmaCost: number;
}

/** Validation result for an organization contact */
export interface OrganizationValidation {
  /** Whether the contact passes organization rules */
  valid: boolean;
  /** Validation errors */
  errors: ReadonlyArray<{ field: string; message: string }>;
}

/** Result of checking if an organization contact can call a favor */
export interface OrganizationFavorCheck {
  /** Whether the favor call is allowed */
  allowed: boolean;
  /** Reason if not allowed */
  reason?: string;
}

// =============================================================================
// ORGANIZATION DATA (Run Faster p. 179)
// =============================================================================

const ORGANIZATION_DEFINITIONS: readonly OrganizationDefinition[] = [
  {
    id: "street-gang",
    name: "Street Gang",
    description: "Local street-level criminal organization",
    connectionBonus: 1,
    karmaCost: 5,
  },
  {
    id: "city-government",
    name: "City Government",
    description: "Municipal government offices and bureaucracy",
    connectionBonus: 1,
    karmaCost: 3,
  },
  {
    id: "humanis-policlub",
    name: "Humanis Policlub",
    description: "Anti-metahuman political organization",
    connectionBonus: 2,
    karmaCost: 10,
  },
  {
    id: "order-of-st-sylvester",
    name: "Order of St. Sylvester",
    description: "Catholic religious order with magical connections",
    connectionBonus: 2,
    karmaCost: 8,
  },
  {
    id: "lone-star-god",
    name: "Lone Star/GOD",
    description: "Law enforcement and Grid Overwatch Division",
    connectionBonus: 3,
    karmaCost: 12,
  },
];

// =============================================================================
// ORGANIZATION LOOKUP
// =============================================================================

/**
 * Get all available organization definitions.
 *
 * @returns Immutable array of organization definitions
 */
export function getOrganizationDefinitions(): readonly OrganizationDefinition[] {
  return ORGANIZATION_DEFINITIONS;
}

/**
 * Get a specific organization definition by ID.
 *
 * @param id - Organization identifier (kebab-case)
 * @returns Organization definition or undefined if not found
 */
export function getOrganizationDefinition(id: string): OrganizationDefinition | undefined {
  return ORGANIZATION_DEFINITIONS.find((org) => org.id === id);
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate an organization contact against group contact rules.
 *
 * Organization contacts must have Loyalty ≤ 1 (faceless).
 * Non-organization contacts pass validation unconditionally.
 *
 * @param contact - The contact to validate
 * @returns Validation result with errors
 */
export function validateOrganizationContact(contact: SocialContact): OrganizationValidation {
  // Non-organization contacts are not subject to these restrictions
  if (contact.group !== "organization") {
    return { valid: true, errors: [] };
  }

  const errors: Array<{ field: string; message: string }> = [];

  if (contact.loyalty > ORGANIZATION_MAX_LOYALTY) {
    errors.push({
      field: "loyalty",
      message: `Organization contacts cannot have Loyalty above ${ORGANIZATION_MAX_LOYALTY} (faceless contact), got ${contact.loyalty}`,
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// =============================================================================
// FAVOR/CHIP BLOCKING
// =============================================================================

/**
 * Check if an organization contact can call a favor.
 *
 * Organization contacts cannot use favors or chips — they are limited
 * to legwork and networking services only.
 *
 * @param contact - The contact being checked
 * @returns Whether the favor call is allowed
 */
export function canOrganizationCallFavor(contact: SocialContact): OrganizationFavorCheck {
  if (contact.group === "organization") {
    return {
      allowed: false,
      reason:
        "Organization contacts cannot use favors or chips — only legwork and networking services are available",
    };
  }

  return { allowed: true };
}

// =============================================================================
// SERVICE TYPE RESTRICTIONS
// =============================================================================

/**
 * Check if a service type is allowed for organization contacts.
 *
 * Only legwork and networking are permitted. All other service types
 * (swag, shadow-service, personal-favor, support) are blocked.
 *
 * @param serviceType - The service type to check
 * @returns Whether the service is allowed for organization contacts
 */
export function isAllowedServiceForOrganization(serviceType: ContactServiceType): boolean {
  return ALLOWED_ORGANIZATION_SERVICES.has(serviceType);
}
