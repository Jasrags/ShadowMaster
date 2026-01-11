/**
 * Social action resolution
 *
 * Provides dice pool calculations, modifiers, and resolution for
 * social actions like networking, bribes, and legwork.
 *
 * Capability References:
 * - "The system MUST provide Authoritative resolution for social actions, including networking, bribe resolution, and favor calling"
 * - "Social interactions MUST adhere to strictly defined influence protocols and resource expenditures"
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

import type { Character } from "../types";
import type {
  SocialContact,
  SocialModifier,
  SocialActionType,
  SocialCapital,
  ContactArchetype,
} from "../types/contacts";

// =============================================================================
// SOCIAL SKILL MAPPING
// =============================================================================

/**
 * Primary skill used for each social action type
 */
const ACTION_SKILLS: Record<SocialActionType, string> = {
  networking: "etiquette",
  favor_call: "negotiation",
  bribe: "negotiation",
  legwork: "etiquette",
  introduction: "etiquette",
  reputation_boost: "con",
  damage_control: "negotiation",
  loyalty_increase: "negotiation",
  connection_boost: "etiquette",
};

/**
 * Primary attribute used for social actions
 */
const SOCIAL_ATTRIBUTE = "cha"; // Charisma

// =============================================================================
// DICE POOL CALCULATION
// =============================================================================

/**
 * Calculate the dice pool for a social action
 *
 * @param character - Character performing the action
 * @param actionType - Type of social action
 * @param contact - Target contact (if applicable)
 * @param socialCapital - Character's social capital (for modifiers)
 * @returns Dice pool and applied modifiers
 */
export function calculateSocialDicePool(
  character: Character,
  actionType: SocialActionType,
  contact?: SocialContact,
  socialCapital?: SocialCapital | null
): {
  dicePool: number;
  basePool: number;
  modifiers: SocialModifier[];
  skill: string;
  attribute: string;
} {
  const skill = ACTION_SKILLS[actionType];
  const attribute = SOCIAL_ATTRIBUTE;

  // Get base values
  const skillRating = character.skills?.[skill] || 0;
  const attributeRating = character.attributes?.[attribute] || 0;
  const basePool = skillRating + attributeRating;

  // Collect modifiers
  const modifiers = getSocialModifiers(character, contact, actionType, socialCapital);

  // Calculate total
  const modifierTotal = modifiers.reduce((sum, m) => sum + m.modifier, 0);
  const dicePool = Math.max(0, basePool + modifierTotal);

  return {
    dicePool,
    basePool,
    modifiers,
    skill,
    attribute,
  };
}

/**
 * Get all applicable social modifiers
 *
 * @param character - Character performing action
 * @param contact - Target contact (if any)
 * @param actionType - Type of action
 * @param socialCapital - Character's social capital
 * @returns Array of modifiers
 */
export function getSocialModifiers(
  character: Character,
  contact: SocialContact | undefined,
  actionType: SocialActionType,
  socialCapital?: SocialCapital | null
): SocialModifier[] {
  const modifiers: SocialModifier[] = [];

  // Contact attitude modifiers (if interacting with a contact)
  if (contact) {
    modifiers.push(...getContactAttitudeModifiers(contact));
  }

  // Reputation modifiers
  if (character.reputation) {
    modifiers.push(...getReputationModifiers(character));
  }

  // Social capital modifiers
  if (socialCapital) {
    if (socialCapital.networkingBonus && actionType === "networking") {
      modifiers.push({
        source: "Networking Bonus",
        modifier: socialCapital.networkingBonus,
        category: "quality",
      });
    }

    if (socialCapital.loyaltyBonus && actionType === "loyalty_increase") {
      modifiers.push({
        source: "Loyalty Bonus",
        modifier: socialCapital.loyaltyBonus,
        category: "quality",
      });
    }
  }

  // Action-specific modifiers
  modifiers.push(...getActionSpecificModifiers(character, actionType));

  return modifiers;
}

/**
 * Get modifiers based on contact's attitude (derived from loyalty)
 */
function getContactAttitudeModifiers(contact: SocialContact): SocialModifier[] {
  const modifiers: SocialModifier[] = [];

  // SR5 social modifiers based on attitude
  // Loyalty correlates roughly with attitude
  if (contact.loyalty >= 6) {
    modifiers.push({
      source: "Contact Attitude: Friendly",
      modifier: 2,
      category: "attitude",
      description: "Contact is highly loyal and helpful",
    });
  } else if (contact.loyalty >= 4) {
    modifiers.push({
      source: "Contact Attitude: Neutral",
      modifier: 0,
      category: "attitude",
      description: "Contact is professionally neutral",
    });
  } else if (contact.loyalty >= 2) {
    modifiers.push({
      source: "Contact Attitude: Suspicious",
      modifier: -1,
      category: "attitude",
      description: "Contact is wary of requests",
    });
  } else {
    modifiers.push({
      source: "Contact Attitude: Hostile",
      modifier: -3,
      category: "attitude",
      description: "Contact actively dislikes the character",
    });
  }

  // Favor balance modifiers
  if (contact.favorBalance < -3) {
    modifiers.push({
      source: "Heavy Debt",
      modifier: -2,
      category: "circumstance",
      description: "Contact is frustrated by owed favors",
    });
  } else if (contact.favorBalance < 0) {
    modifiers.push({
      source: "Favor Debt",
      modifier: -1,
      category: "circumstance",
      description: "Contact expects repayment",
    });
  } else if (contact.favorBalance > 3) {
    modifiers.push({
      source: "Owed Favors",
      modifier: 1,
      category: "circumstance",
      description: "Contact owes significant favors",
    });
  }

  return modifiers;
}

/**
 * Get modifiers from character reputation
 */
function getReputationModifiers(character: Character): SocialModifier[] {
  const modifiers: SocialModifier[] = [];
  const rep = character.reputation;

  if (!rep) return modifiers;

  // Street Cred provides positive modifier
  if (rep.streetCred > 0) {
    modifiers.push({
      source: "Street Cred",
      modifier: Math.min(rep.streetCred, 5), // Cap at +5
      category: "other",
      description: `Known reputation on the street (${rep.streetCred})`,
    });
  }

  // Notoriety provides negative modifier in some situations
  if (rep.notoriety > 0) {
    modifiers.push({
      source: "Notoriety",
      modifier: -Math.min(rep.notoriety, 5), // Cap at -5
      category: "other",
      description: `Bad reputation precedes you (${rep.notoriety})`,
    });
  }

  // Public Awareness makes social actions harder (recognized)
  if (rep.publicAwareness > 0) {
    modifiers.push({
      source: "Public Awareness",
      modifier: -Math.floor(rep.publicAwareness / 2),
      category: "other",
      description: `Face is too well known (${rep.publicAwareness})`,
    });
  }

  return modifiers;
}

/**
 * Get action-specific modifiers
 */
function getActionSpecificModifiers(
  character: Character,
  actionType: SocialActionType
): SocialModifier[] {
  const modifiers: SocialModifier[] = [];

  // Check for relevant qualities (simplified check)
  const allQualities = [
    ...(character.positiveQualities || []),
    ...(character.negativeQualities || []),
  ];

  for (const quality of allQualities) {
    const qualityId = quality.qualityId?.toLowerCase() || "";

    // First Impression bonus for initial contacts
    if (qualityId.includes("first-impression") && actionType === "networking") {
      modifiers.push({
        source: "First Impression",
        modifier: 2,
        category: "quality",
      });
    }

    // Blandness helps with avoiding attention
    if (qualityId.includes("blandness") && actionType === "damage_control") {
      modifiers.push({
        source: "Blandness",
        modifier: 2,
        category: "quality",
      });
    }

    // Distinctive Style makes you memorable
    if (qualityId.includes("distinctive") && actionType === "networking") {
      modifiers.push({
        source: "Distinctive Style",
        modifier: -2,
        category: "quality",
      });
    }

    // Social Stress penalty
    if (qualityId.includes("social-stress")) {
      modifiers.push({
        source: "Social Stress",
        modifier: -2,
        category: "quality",
      });
    }

    // Trustworthy bonus for loyalty actions
    if (qualityId.includes("trustworthy") && actionType === "loyalty_increase") {
      modifiers.push({
        source: "Trustworthy",
        modifier: 2,
        category: "quality",
      });
    }
  }

  return modifiers;
}

// =============================================================================
// ACTION RESOLUTION
// =============================================================================

/**
 * Resolve a networking action (finding new contacts)
 *
 * @param character - Character networking
 * @param targetArchetype - Type of contact being sought
 * @param diceRoll - Dice roll result
 * @param nuyenSpent - Nuyen spent on networking
 * @param socialCapital - Character's social capital
 * @returns Networking result
 */
export function resolveNetworking(
  character: Character,
  targetArchetype: string,
  diceRoll: number,
  nuyenSpent: number,
  socialCapital?: SocialCapital | null
): {
  success: boolean;
  contactFound: boolean;
  suggestedConnection: number;
  suggestedLoyalty: number;
  timeSpent: string;
  nuyenSpent: number;
  bonusFromNuyen: number;
} {
  // Base threshold for finding a contact
  const baseThreshold = 2;

  // Nuyen spent can reduce threshold or improve results
  const nuyenBonus = Math.floor(nuyenSpent / 500); // +1 per 500 nuyen

  // Calculate success
  const effectiveHits = diceRoll + nuyenBonus;
  const success = effectiveHits >= baseThreshold;

  // Determine contact quality based on hits
  let suggestedConnection = 1;
  let suggestedLoyalty = 1;

  if (success) {
    // Net hits above threshold improve the contact
    const netHits = effectiveHits - baseThreshold;

    // Connection based on hits (max 6 for starting contacts)
    suggestedConnection = Math.min(6, 1 + Math.floor(netHits / 2));

    // Loyalty starts at 2 for found contacts, +1 per 3 net hits
    suggestedLoyalty = Math.min(4, 2 + Math.floor(netHits / 3));
  }

  // Time spent networking
  const timeSpent = nuyenSpent >= 1000 ? "1 day" : "1 week";

  return {
    success,
    contactFound: success,
    suggestedConnection,
    suggestedLoyalty,
    timeSpent,
    nuyenSpent,
    bonusFromNuyen: nuyenBonus,
  };
}

/**
 * Resolve a bribe attempt
 *
 * @param character - Character offering the bribe
 * @param target - Target contact or "npc" for unnamed NPCs
 * @param nuyenOffered - Amount of nuyen offered
 * @param diceRoll - Dice roll result
 * @returns Bribe result
 */
export function resolveBribe(
  character: Character,
  target: SocialContact | "npc",
  nuyenOffered: number,
  diceRoll: number
): {
  success: boolean;
  accepted: boolean;
  loyaltyChange: number;
  consequences: string;
} {
  // Base threshold varies by target
  let threshold = 2;
  let loyaltyChange = 0;

  if (target !== "npc") {
    // Known contacts are harder to bribe but less likely to report
    threshold = Math.max(1, target.loyalty);

    // Bribing contacts can damage relationship
    if (diceRoll < threshold) {
      loyaltyChange = -1;
    }
  }

  // Money talks - high bribes reduce threshold
  const bribeBonus = Math.floor(nuyenOffered / 1000);
  const effectiveThreshold = Math.max(1, threshold - bribeBonus);

  const success = diceRoll >= effectiveThreshold;
  const accepted = success;

  // Determine consequences
  let consequences: string;
  if (success) {
    if (diceRoll >= threshold + 3) {
      consequences = "Enthusiastically accepted - target is pleased";
    } else {
      consequences = "Reluctantly accepted - target may remember this";
    }
  } else {
    if (diceRoll === 0) {
      consequences = "Offended - target may report the bribe attempt";
    } else {
      consequences = "Refused - target was not swayed";
    }
  }

  return {
    success,
    accepted,
    loyaltyChange,
    consequences,
  };
}

/**
 * Resolve legwork (information gathering)
 *
 * @param character - Character doing legwork
 * @param contact - Contact being asked
 * @param informationType - Type of information sought
 * @param diceRoll - Dice roll result
 * @returns Legwork result
 */
export function resolveLegwork(
  character: Character,
  contact: SocialContact,
  informationType: string,
  diceRoll: number
): {
  success: boolean;
  informationQuality: "none" | "partial" | "full" | "detailed";
  favorCost: number;
  nuyenCost: number;
  timeRequired: string;
} {
  // Threshold based on connection (higher connection = more access)
  const threshold = Math.max(1, 4 - Math.floor(contact.connection / 3));

  const success = diceRoll >= threshold;
  const netHits = diceRoll - threshold;

  // Determine information quality
  let informationQuality: "none" | "partial" | "full" | "detailed";
  if (!success) {
    informationQuality = "none";
  } else if (netHits >= 4) {
    informationQuality = "detailed";
  } else if (netHits >= 2) {
    informationQuality = "full";
  } else {
    informationQuality = "partial";
  }

  // Favor cost depends on connection
  const favorCost = success ? Math.max(1, 4 - Math.floor(contact.connection / 3)) : 0;

  // Nuyen cost (drinks, bribes, etc.)
  const nuyenCost = contact.connection * 50;

  // Time required
  const timeRequired = contact.connection >= 6 ? "1 hour" : "1 day";

  return {
    success,
    informationQuality,
    favorCost,
    nuyenCost,
    timeRequired,
  };
}

// =============================================================================
// CONSEQUENCE PROPAGATION
// =============================================================================

/**
 * Propagate consequences of a social action to other contacts and reputation
 *
 * @param character - Character who performed the action
 * @param actionType - Type of action
 * @param success - Whether action succeeded
 * @param targetContactId - Contact involved (if any)
 * @param contacts - All character contacts
 * @returns Consequences to apply
 */
export function propagateSocialConsequences(
  character: Character,
  actionType: SocialActionType,
  success: boolean,
  targetContactId: string | undefined,
  contacts: SocialContact[]
): {
  loyaltyChanges: { contactId: string; change: number }[];
  reputationChanges: { streetCred?: number; notoriety?: number };
  warnings: string[];
} {
  const loyaltyChanges: { contactId: string; change: number }[] = [];
  const reputationChanges: { streetCred?: number; notoriety?: number } = {};
  const warnings: string[] = [];

  // Burned contacts affect related contacts
  if (actionType === "damage_control" && !success && targetContactId) {
    const targetContact = contacts.find((c) => c.id === targetContactId);

    if (targetContact) {
      // Related contacts (same organization or location) may become wary
      const relatedContacts = contacts.filter(
        (c) =>
          c.id !== targetContactId &&
          c.status === "active" &&
          (c.organization === targetContact.organization || c.location === targetContact.location)
      );

      for (const related of relatedContacts.slice(0, 3)) {
        loyaltyChanges.push({ contactId: related.id, change: -1 });
        warnings.push(`${related.name} heard about the situation with ${targetContact.name}`);
      }
    }
  }

  // Successful networking in a new area can improve related contacts
  if (actionType === "networking" && success) {
    reputationChanges.streetCred = 1;
  }

  // Failed bribe attempts can hurt reputation
  if (actionType === "bribe" && !success) {
    reputationChanges.notoriety = 1;
    warnings.push("Word of your failed bribe attempt may spread");
  }

  return {
    loyaltyChanges,
    reputationChanges,
    warnings,
  };
}

// =============================================================================
// SOCIAL LIMIT
// =============================================================================

/**
 * Calculate character's Social limit
 *
 * SR5: (Charisma x 2 + Willpower + Essence) / 3, round up
 *
 * @param character - Character to calculate for
 * @param socialCapital - Social capital for modifiers
 * @returns Social limit value
 */
export function calculateSocialLimit(
  character: Character,
  socialCapital?: SocialCapital | null
): number {
  const charisma = character.attributes?.cha || 1;
  const willpower = character.attributes?.wil || 1;
  const essence = character.specialAttributes?.essence || 6;

  const baseLimit = Math.ceil((charisma * 2 + willpower + essence) / 3);

  // Apply social capital modifier
  const modifier = socialCapital?.socialLimitModifier || 0;

  return Math.max(1, baseLimit + modifier);
}
