/**
 * "I Know a Guy" Edge-Based Contact Acquisition (Run Faster p. 178)
 *
 * Characters can spend Edge mid-session to pull a contact from their past.
 * Cost = 2× desired Connection Rating in Edge points.
 * The contact starts at Loyalty 1 and must be confirmed with Karma
 * (Connection + Loyalty) after the mission to become permanent.
 * Edge does not refresh until Karma is earned (next session).
 *
 * Integration: SocialContact now has `pendingKarmaConfirmation` field and
 * `"edge"` acquisition method. Use `updateCharacterContact()` from the
 * storage layer to set these fields when creating Edge-acquired contacts.
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

// =============================================================================
// CONSTANTS
// =============================================================================

/** Edge cost multiplier: 2× desired Connection Rating */
const EDGE_COST_MULTIPLIER = 2;

/** Loyalty for newly acquired Edge contacts */
const EDGE_CONTACT_INITIAL_LOYALTY = 1;

/** Maximum Connection rating in SR5 */
const MAX_CONNECTION = 12;

/** Minimum Connection rating */
const MIN_CONNECTION = 1;

// =============================================================================
// TYPES
// =============================================================================

/** Validation result for I Know a Guy attempt */
export interface IKnowAGuyValidation {
  /** Whether the attempt is allowed */
  allowed: boolean;
  /** Edge cost if allowed */
  edgeCost: number;
  /** Reason if not allowed */
  reason?: string;
}

/** Specification for creating an Edge-acquired contact */
export interface EdgeContactSpec {
  /** Contact name */
  name: string;
  /** Connection rating */
  connection: number;
  /** Loyalty (always 1 for Edge contacts) */
  loyalty: 1;
  /** Contact archetype */
  archetype: string;
  /** How the contact was acquired */
  acquisitionMethod: "edge";
  /** Whether Karma confirmation is still needed */
  pendingKarmaConfirmation: true;
  /** Optional description */
  description?: string;
}

/** Validation result for Karma confirmation */
export interface KarmaConfirmationCheck {
  /** Whether confirmation is allowed */
  allowed: boolean;
  /** Karma cost to confirm */
  karmaCost: number;
  /** Reason if not allowed */
  reason?: string;
}

// =============================================================================
// EDGE COST
// =============================================================================

/**
 * Calculate the Edge cost to acquire a contact via "I Know a Guy."
 *
 * Cost = 2 × desired Connection Rating.
 *
 * @param desiredConnection - The desired Connection rating for the new contact
 * @returns Edge points required
 */
export function calculateEdgeCost(desiredConnection: number): number {
  return desiredConnection * EDGE_COST_MULTIPLIER;
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validate whether a character can use "I Know a Guy."
 *
 * Checks that the character has sufficient Edge and the desired
 * Connection is within valid range (1-12).
 *
 * @param params.currentEdge - Character's current Edge points
 * @param params.desiredConnection - Desired Connection for the new contact
 * @returns Validation result with cost breakdown
 */
export function validateIKnowAGuy(params: {
  currentEdge: number;
  desiredConnection: number;
}): IKnowAGuyValidation {
  const { currentEdge, desiredConnection } = params;

  if (desiredConnection < MIN_CONNECTION || desiredConnection > MAX_CONNECTION) {
    return {
      allowed: false,
      edgeCost: 0,
      reason: `Connection must be between ${MIN_CONNECTION} and ${MAX_CONNECTION}, got ${desiredConnection}`,
    };
  }

  const edgeCost = calculateEdgeCost(desiredConnection);

  if (currentEdge < edgeCost) {
    return {
      allowed: false,
      edgeCost,
      reason: `Insufficient Edge: need ${edgeCost}, have ${currentEdge}`,
    };
  }

  return {
    allowed: true,
    edgeCost,
  };
}

// =============================================================================
// CONTACT SPEC CREATION
// =============================================================================

/**
 * Create a specification for an Edge-acquired contact.
 *
 * The contact always starts at Loyalty 1 and is flagged as pending
 * Karma confirmation. The caller is responsible for persisting this
 * to storage.
 *
 * @param params.desiredConnection - Connection rating
 * @param params.archetype - Contact archetype
 * @param params.name - Contact name
 * @param params.description - Optional description
 * @returns Contact specification ready for creation
 */
export function createEdgeContactSpec(params: {
  desiredConnection: number;
  archetype: string;
  name: string;
  description?: string;
}): EdgeContactSpec {
  return {
    name: params.name,
    connection: params.desiredConnection,
    loyalty: EDGE_CONTACT_INITIAL_LOYALTY,
    archetype: params.archetype,
    acquisitionMethod: "edge",
    pendingKarmaConfirmation: true,
    ...(params.description !== undefined ? { description: params.description } : {}),
  };
}

// =============================================================================
// KARMA CONFIRMATION
// =============================================================================

/**
 * Calculate the Karma cost to permanently keep an Edge contact.
 *
 * Cost = Connection + Loyalty (Loyalty is always 1 for Edge contacts).
 * Must be spent after the mission or the contact is lost.
 *
 * @param connectionRating - The contact's Connection rating
 * @returns Karma cost
 */
export function calculateConfirmationKarmaCost(connectionRating: number): number {
  return connectionRating + EDGE_CONTACT_INITIAL_LOYALTY;
}

/**
 * Check whether a character can confirm an Edge contact with Karma.
 *
 * @param params.connectionRating - The contact's Connection rating
 * @param params.currentKarma - Character's available Karma
 * @returns Validation result with cost
 */
export function canConfirmEdgeContact(params: {
  connectionRating: number;
  currentKarma: number;
}): KarmaConfirmationCheck {
  const karmaCost = calculateConfirmationKarmaCost(params.connectionRating);

  if (params.currentKarma < karmaCost) {
    return {
      allowed: false,
      karmaCost,
      reason: `Insufficient karma: need ${karmaCost}, have ${params.currentKarma}`,
    };
  }

  return {
    allowed: true,
    karmaCost,
  };
}
