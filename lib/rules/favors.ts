/**
 * Favor mechanics and resolution
 *
 * Provides favor calling, cost calculation, and resolution logic.
 *
 * Capability References:
 * - "Every favor or social service MUST be bound to a verifiable ruleset-defined cost and risk profile"
 * - "The system MUST provide Authoritative resolution for social actions"
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import type { Character } from "../types";
import type {
  SocialContact,
  FavorServiceDefinition,
  FavorTransaction,
  FavorRiskLevel,
} from "../types/contacts";

// =============================================================================
// FAVOR PREREQUISITES
// =============================================================================

/**
 * Result of checking if a favor can be called
 */
export interface FavorCallCheck {
  allowed: boolean;
  reasons: string[];
  warnings: string[];
}

/**
 * Check if a favor can be called from a contact
 *
 * @param contact - Contact being asked for the favor
 * @param service - Service being requested
 * @param character - Character calling the favor
 * @returns Check result
 */
export function canCallFavor(
  contact: SocialContact,
  service: FavorServiceDefinition,
  character: Character
): FavorCallCheck {
  const reasons: string[] = [];
  const warnings: string[] = [];

  // Contact status check
  if (contact.status !== "active") {
    reasons.push(`Contact is ${contact.status} and cannot be called upon`);
  }

  // Connection requirement
  if (contact.connection < service.minimumConnection) {
    reasons.push(
      `Contact's connection (${contact.connection}) is below the required ${service.minimumConnection}`
    );
  }

  // Loyalty requirement
  if (contact.loyalty < service.minimumLoyalty) {
    reasons.push(
      `Contact's loyalty (${contact.loyalty}) is below the required ${service.minimumLoyalty}`
    );
  }

  // Nuyen check (if service has nuyen cost)
  const nuyenCost = calculateNuyenCost(service, contact);
  if (nuyenCost > 0 && character.nuyen < nuyenCost) {
    reasons.push(`Insufficient nuyen: need ${nuyenCost}, have ${character.nuyen}`);
  }

  // Karma check (if service has karma cost)
  if (service.karmaCost && character.karmaCurrent < service.karmaCost) {
    reasons.push(
      `Insufficient karma: need ${service.karmaCost}, have ${character.karmaCurrent}`
    );
  }

  // Warnings for risky situations
  if (contact.favorBalance < 0 && service.favorCost > 0) {
    warnings.push(
      `You already owe this contact ${Math.abs(contact.favorBalance)} favors`
    );
  }

  if (contact.loyalty <= 2 && service.riskLevel !== "trivial") {
    warnings.push("Low loyalty contact may be unreliable for non-trivial requests");
  }

  if (service.burnRiskOnFailure) {
    warnings.push("Failure on this service may burn the contact");
  }

  return {
    allowed: reasons.length === 0,
    reasons,
    warnings,
  };
}

// =============================================================================
// COST CALCULATIONS
// =============================================================================

/**
 * Calculate nuyen cost for a service
 *
 * @param service - Service definition
 * @param contact - Contact providing the service
 * @returns Nuyen cost
 */
export function calculateNuyenCost(
  service: FavorServiceDefinition,
  contact: SocialContact
): number {
  if (service.nuyenCost === undefined || service.nuyenCost === null) {
    return 0;
  }

  if (typeof service.nuyenCost === "number") {
    return service.nuyenCost;
  }

  // Parse formula string
  const formula = service.nuyenCost;

  // Simple formula parsing for common patterns
  if (formula.includes("connection")) {
    // e.g., "connection * 100"
    const multiplier = parseInt(formula.split("*")[1]?.trim() || "100", 10);
    return contact.connection * multiplier;
  }

  if (formula.includes("loyalty")) {
    const multiplier = parseInt(formula.split("*")[1]?.trim() || "100", 10);
    return contact.loyalty * multiplier;
  }

  // Try to parse as number
  const parsed = parseInt(formula, 10);
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Calculate total favor cost for a service
 *
 * @param service - Service definition
 * @param contact - Contact providing service
 * @param character - Character requesting service
 * @param rushJob - Whether this is a rush job
 * @returns Complete cost breakdown
 */
export function calculateFavorCost(
  service: FavorServiceDefinition,
  contact: SocialContact,
  character: Character,
  rushJob: boolean = false
): {
  favorCost: number;
  nuyenCost: number;
  karmaCost: number;
  totalCost: { nuyen: number; karma: number; favors: number };
} {
  let nuyenCost = calculateNuyenCost(service, contact);
  const karmaCost = service.karmaCost || 0;
  const favorCost = service.favorCost;

  // Rush job multiplier
  if (rushJob && service.canRush && service.rushCostMultiplier) {
    nuyenCost = Math.ceil(nuyenCost * service.rushCostMultiplier);
  }

  return {
    favorCost,
    nuyenCost,
    karmaCost,
    totalCost: {
      nuyen: nuyenCost,
      karma: karmaCost,
      favors: favorCost,
    },
  };
}

// =============================================================================
// FAVOR RESOLUTION
// =============================================================================

/**
 * Result of resolving a favor call
 */
export interface FavorResolution {
  success: boolean;
  netHits: number;
  favorConsumed: number;
  loyaltyChange: number;
  connectionChange: number;
  burned: boolean;
  burnReason?: string;
  serviceResult?: string;
  glitch: boolean;
  criticalGlitch: boolean;
}

/**
 * Resolve a favor call
 *
 * @param contact - Contact being asked
 * @param service - Service requested
 * @param character - Character making the request
 * @param diceRoll - Player's dice roll result (hits)
 * @param opposingRoll - Opposing roll (for opposed tests)
 * @returns Resolution result
 */
export function resolveFavorCall(
  contact: SocialContact,
  service: FavorServiceDefinition,
  character: Character,
  diceRoll: number,
  opposingRoll?: number
): FavorResolution {
  let netHits: number;
  let success: boolean;

  // Determine success based on test type
  if (service.opposedTest && opposingRoll !== undefined) {
    netHits = diceRoll - opposingRoll;
    success = netHits > 0;
  } else if (service.threshold) {
    netHits = diceRoll - service.threshold;
    success = diceRoll >= service.threshold;
  } else {
    // Simple success - any hits work
    netHits = diceRoll;
    success = diceRoll > 0;
  }

  // Check for glitches (simplified - normally based on dice results)
  const glitch = diceRoll === 0;
  const criticalGlitch = glitch && contact.loyalty <= 2;

  // Calculate favor consumption
  const favorConsumed = success ? service.favorCost : Math.floor(service.favorCost / 2);

  // Calculate loyalty change
  let loyaltyChange = 0;
  if (criticalGlitch) {
    loyaltyChange = -1;
  } else if (!success && service.riskLevel === "high") {
    // Minor loyalty hit for failed high-risk requests
    loyaltyChange = contact.loyalty > 1 ? -0.5 : 0; // Half point, rounded later
  }

  // Check for burn
  let burned = false;
  let burnReason: string | undefined;

  if (criticalGlitch && service.burnRiskOnFailure) {
    burned = true;
    burnReason = "Critical glitch on risky favor burned the relationship";
  } else if (!success && service.burnRiskOnFailure && contact.loyalty <= 1) {
    burned = true;
    burnReason = "Failed risky favor from low-loyalty contact burned the relationship";
  }

  // Determine service result description
  let serviceResult: string;
  if (success) {
    if (netHits >= 4) {
      serviceResult = "Exceptional success - contact went above and beyond";
    } else if (netHits >= 2) {
      serviceResult = "Good success - service completed as expected";
    } else {
      serviceResult = "Marginal success - barely completed, may have issues";
    }
  } else {
    if (criticalGlitch) {
      serviceResult = "Critical failure - something went very wrong";
    } else if (glitch) {
      serviceResult = "Failure with complications";
    } else {
      serviceResult = "Service could not be completed";
    }
  }

  return {
    success,
    netHits,
    favorConsumed,
    loyaltyChange: Math.round(loyaltyChange),
    connectionChange: 0, // Connection rarely changes from individual favors
    burned,
    burnReason,
    serviceResult,
    glitch,
    criticalGlitch,
  };
}

// =============================================================================
// FAVOR BALANCE
// =============================================================================

/**
 * Calculate current favor balance from transactions
 *
 * @param transactions - All transactions with a contact
 * @param contactId - Contact ID to filter by
 * @returns Current favor balance
 */
export function getFavorBalance(
  transactions: FavorTransaction[],
  contactId: string
): number {
  return transactions
    .filter((t) => t.contactId === contactId)
    .filter((t) => !t.requiresGmApproval || t.gmApproved === true)
    .reduce((balance, t) => balance + (t.favorChange || 0), 0);
}

/**
 * Get all contacts the character owes favors to
 *
 * @param transactions - All favor transactions
 * @param characterId - Character ID
 * @returns Array of contacts with amounts owed
 */
export function getOwedFavors(
  transactions: FavorTransaction[],
  characterId: string
): { contactId: string; amount: number }[] {
  const balances: Record<string, number> = {};

  for (const t of transactions) {
    if (t.characterId !== characterId) continue;
    if (t.requiresGmApproval && t.gmApproved !== true) continue;

    balances[t.contactId] = (balances[t.contactId] || 0) + (t.favorChange || 0);
  }

  return Object.entries(balances)
    .filter(([_, amount]) => amount < 0)
    .map(([contactId, amount]) => ({ contactId, amount: Math.abs(amount) }))
    .sort((a, b) => b.amount - a.amount);
}

/**
 * Get all contacts that owe the character favors
 *
 * @param transactions - All favor transactions
 * @param characterId - Character ID
 * @returns Array of contacts with amounts they owe
 */
export function getOwingContacts(
  transactions: FavorTransaction[],
  characterId: string
): { contactId: string; amount: number }[] {
  const balances: Record<string, number> = {};

  for (const t of transactions) {
    if (t.characterId !== characterId) continue;
    if (t.requiresGmApproval && t.gmApproved !== true) continue;

    balances[t.contactId] = (balances[t.contactId] || 0) + (t.favorChange || 0);
  }

  return Object.entries(balances)
    .filter(([_, amount]) => amount > 0)
    .map(([contactId, amount]) => ({ contactId, amount }))
    .sort((a, b) => b.amount - a.amount);
}

// =============================================================================
// BURN RISK
// =============================================================================

/**
 * Risk multipliers by level
 */
const RISK_MULTIPLIERS: Record<FavorRiskLevel, number> = {
  trivial: 0,
  low: 0.1,
  medium: 0.25,
  high: 0.5,
  extreme: 0.75,
};

/**
 * Calculate the chance of burning a contact on failure
 *
 * @param service - Service being requested
 * @param contact - Contact providing service
 * @param rollResult - Dice roll result
 * @returns Burn chance and whether contact is burned
 */
export function calculateBurnRisk(
  service: FavorServiceDefinition,
  contact: SocialContact,
  rollResult: number
): {
  burnChance: number;
  isBurned: boolean;
} {
  if (!service.burnRiskOnFailure) {
    return { burnChance: 0, isBurned: false };
  }

  // Base risk from service level
  const baseRisk = RISK_MULTIPLIERS[service.riskLevel] || 0;

  // Loyalty reduces burn risk
  const loyaltyModifier = (6 - contact.loyalty) * 0.05; // 0-25% from loyalty

  // Failure severity increases risk
  const threshold = service.threshold || 1;
  const failureMargin = Math.max(0, threshold - rollResult);
  const failureModifier = failureMargin * 0.1; // 10% per net hit below threshold

  const burnChance = Math.min(1, baseRisk + loyaltyModifier + failureModifier);

  // Determine if burned (in real implementation, this would use random)
  // For deterministic resolution, burn if roll is 0 and chance > 0.5
  const isBurned = rollResult === 0 && burnChance >= 0.5;

  return {
    burnChance: Math.round(burnChance * 100),
    isBurned,
  };
}

// =============================================================================
// FAVOR SERVICE MATCHING
// =============================================================================

/**
 * Get services available from a contact based on their archetype
 *
 * @param contact - Contact to check
 * @param allServices - All available services from the edition
 * @returns Services this contact can provide
 */
export function getAvailableServices(
  contact: SocialContact,
  allServices: FavorServiceDefinition[]
): FavorServiceDefinition[] {
  return allServices.filter((service) => {
    // Check archetype match
    if (service.archetypeIds && service.archetypeIds.length > 0) {
      if (!contact.archetypeId || !service.archetypeIds.includes(contact.archetypeId)) {
        // Also check archetype name match (less strict)
        const archetypeMatches = service.archetypeIds.some(
          (id) => id.toLowerCase() === contact.archetype.toLowerCase()
        );
        if (!archetypeMatches) {
          return false;
        }
      }
    }

    // Check connection requirement
    if (contact.connection < service.minimumConnection) {
      return false;
    }

    return true;
  });
}

/**
 * Find best contact for a specific service
 *
 * @param contacts - Available contacts
 * @param service - Service needed
 * @returns Best contact or null if none can provide it
 */
export function findBestContactForService(
  contacts: SocialContact[],
  service: FavorServiceDefinition
): SocialContact | null {
  const eligible = contacts.filter((contact) => {
    if (contact.status !== "active") return false;
    if (contact.connection < service.minimumConnection) return false;
    if (contact.loyalty < service.minimumLoyalty) return false;
    return true;
  });

  if (eligible.length === 0) {
    return null;
  }

  // Sort by: highest loyalty first, then highest connection
  eligible.sort((a, b) => {
    if (b.loyalty !== a.loyalty) {
      return b.loyalty - a.loyalty;
    }
    return b.connection - a.connection;
  });

  return eligible[0];
}
