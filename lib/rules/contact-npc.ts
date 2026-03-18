/**
 * Contact NPC Building Table (Run Faster p. 180)
 *
 * Connection Rating determines the amount of points for attributes,
 * skills, and cash to represent the contact's talent and resources.
 * This module provides the lookup table and a basic stat block generator
 * for building contact NPCs from their Connection rating.
 *
 * NOTE: This module is a standalone rules layer. Full NPC generation
 * with archetype-specific skill/gear allocation will be built in a
 * future integration PR using the grunt template system.
 *
 * @see /docs/capabilities/campaign.social-governance.md
 */

// =============================================================================
// TYPES
// =============================================================================

/** NPC build point entry from the Connection-based table */
export interface NpcBuildEntry {
  /** Connection rating (1-12) */
  connectionRating: number;
  /** Bonus attribute points above metatype base */
  bonusAttributePoints: number;
  /** Total active skill points */
  totalSkillPoints: number;
  /** Special attribute points (Edge, Magic, Resonance — cannot be used on regular attributes) */
  specialAttributePoints: number;
  /** Starting nuyen for gear/resources */
  nuyen: number;
}

/** Base attributes for an NPC contact */
export interface NpcBaseAttributes {
  body: number;
  agility: number;
  reaction: number;
  strength: number;
  charisma: number;
  intuition: number;
  logic: number;
  willpower: number;
}

/** Derived combat/social stats */
export interface NpcDerivedStats {
  /** Reaction + Intuition */
  initiative: number;
  /** Charisma + Willpower */
  composure: number;
  /** Charisma + Intuition */
  judgeIntentions: number;
  /** Body ÷ 2 (rounded up) + 8 */
  physicalConditionMonitor: number;
  /** Willpower ÷ 2 (rounded up) + 8 */
  stunConditionMonitor: number;
}

/** Generated stat block for a contact NPC */
export interface ContactStatBlock {
  /** Connection rating used to generate this block */
  connectionRating: number;
  /** Build points from the table */
  bonusAttributePoints: number;
  totalSkillPoints: number;
  specialAttributePoints: number;
  nuyen: number;
  /** Base metatype attributes (human average) */
  baseAttributes: NpcBaseAttributes;
  /** Derived combat/social stats */
  derived: NpcDerivedStats;
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Human average attribute value (SR5 base for all physical/mental attributes) */
const HUMAN_BASE_ATTRIBUTE = 3;

// =============================================================================
// NPC BUILD TABLE DATA (Run Faster p. 180)
// =============================================================================

const NPC_BUILD_TABLE: readonly NpcBuildEntry[] = [
  {
    connectionRating: 1,
    bonusAttributePoints: 0,
    totalSkillPoints: 14,
    specialAttributePoints: 0,
    nuyen: 6_000,
  },
  {
    connectionRating: 2,
    bonusAttributePoints: 1,
    totalSkillPoints: 18,
    specialAttributePoints: 0,
    nuyen: 50_000,
  },
  {
    connectionRating: 3,
    bonusAttributePoints: 2,
    totalSkillPoints: 22,
    specialAttributePoints: 2,
    nuyen: 140_000,
  },
  {
    connectionRating: 4,
    bonusAttributePoints: 2,
    totalSkillPoints: 26,
    specialAttributePoints: 4,
    nuyen: 175_000,
  },
  {
    connectionRating: 5,
    bonusAttributePoints: 3,
    totalSkillPoints: 26,
    specialAttributePoints: 4,
    nuyen: 225_000,
  },
  {
    connectionRating: 6,
    bonusAttributePoints: 3,
    totalSkillPoints: 30,
    specialAttributePoints: 5,
    nuyen: 250_000,
  },
  {
    connectionRating: 7,
    bonusAttributePoints: 2,
    totalSkillPoints: 34,
    specialAttributePoints: 5,
    nuyen: 275_000,
  },
  {
    connectionRating: 8,
    bonusAttributePoints: 3,
    totalSkillPoints: 34,
    specialAttributePoints: 5,
    nuyen: 275_000,
  },
  {
    connectionRating: 9,
    bonusAttributePoints: 3,
    totalSkillPoints: 38,
    specialAttributePoints: 5,
    nuyen: 300_000,
  },
  {
    connectionRating: 10,
    bonusAttributePoints: 4,
    totalSkillPoints: 38,
    specialAttributePoints: 5,
    nuyen: 375_000,
  },
  {
    connectionRating: 11,
    bonusAttributePoints: 2,
    totalSkillPoints: 42,
    specialAttributePoints: 8,
    nuyen: 450_000,
  },
  {
    connectionRating: 12,
    bonusAttributePoints: 3,
    totalSkillPoints: 46,
    specialAttributePoints: 10,
    nuyen: 500_000,
  },
];

// =============================================================================
// TABLE LOOKUP
// =============================================================================

/**
 * Get the full NPC build table (Connection 1-12).
 */
export function getNpcBuildTable(): readonly NpcBuildEntry[] {
  return NPC_BUILD_TABLE;
}

/**
 * Get the NPC build entry for a specific Connection rating.
 *
 * @param connectionRating - Connection rating (integer 1-12)
 * @returns Build entry or undefined for invalid/out-of-range ratings
 */
export function getNpcBuildEntry(connectionRating: number): NpcBuildEntry | undefined {
  if (!Number.isInteger(connectionRating)) {
    return undefined;
  }
  return NPC_BUILD_TABLE.find((e) => e.connectionRating === connectionRating);
}

// =============================================================================
// STAT BLOCK GENERATION
// =============================================================================

/**
 * Generate a base stat block for a contact NPC from their Connection rating.
 *
 * Uses human average attributes (3 for all physical/mental) as the base,
 * with bonus attribute points and derived stats calculated from the table.
 * The caller is responsible for distributing bonus attribute points and
 * skill points based on the contact's archetype.
 *
 * @param connectionRating - Connection rating (integer 1-12)
 * @returns Generated stat block
 * @throws Error if connectionRating is invalid
 */
export function generateContactStatBlock(connectionRating: number): ContactStatBlock {
  const entry = getNpcBuildEntry(connectionRating);

  if (!entry) {
    throw new Error(
      `Connection rating must be an integer between 1 and 12, got ${connectionRating}`
    );
  }

  const baseAttributes: NpcBaseAttributes = {
    body: HUMAN_BASE_ATTRIBUTE,
    agility: HUMAN_BASE_ATTRIBUTE,
    reaction: HUMAN_BASE_ATTRIBUTE,
    strength: HUMAN_BASE_ATTRIBUTE,
    charisma: HUMAN_BASE_ATTRIBUTE,
    intuition: HUMAN_BASE_ATTRIBUTE,
    logic: HUMAN_BASE_ATTRIBUTE,
    willpower: HUMAN_BASE_ATTRIBUTE,
  };

  const derived: NpcDerivedStats = {
    initiative: baseAttributes.reaction + baseAttributes.intuition,
    composure: baseAttributes.charisma + baseAttributes.willpower,
    judgeIntentions: baseAttributes.charisma + baseAttributes.intuition,
    physicalConditionMonitor: Math.ceil(baseAttributes.body / 2) + 8,
    stunConditionMonitor: Math.ceil(baseAttributes.willpower / 2) + 8,
  };

  return {
    connectionRating: entry.connectionRating,
    bonusAttributePoints: entry.bonusAttributePoints,
    totalSkillPoints: entry.totalSkillPoints,
    specialAttributePoints: entry.specialAttributePoints,
    nuyen: entry.nuyen,
    baseAttributes,
    derived,
  };
}
