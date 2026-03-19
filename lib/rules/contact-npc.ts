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

/** Supported metatypes for NPC generation */
export type NpcMetatype = "human" | "elf" | "dwarf" | "ork" | "troll";

/** Generated stat block for a contact NPC */
export interface ContactStatBlock {
  /** Connection rating used to generate this block */
  connectionRating: number;
  /** Metatype used for base attributes */
  metatype: NpcMetatype;
  /** Build points from the table */
  bonusAttributePoints: number;
  totalSkillPoints: number;
  specialAttributePoints: number;
  nuyen: number;
  /** Base metatype attributes */
  baseAttributes: NpcBaseAttributes;
  /** Derived combat/social stats */
  derived: NpcDerivedStats;
}

// =============================================================================
// METATYPE BASE ATTRIBUTES (SR5 CRB attribute minimums)
// =============================================================================

/**
 * Racial attribute minimums by metatype (SR5 Core Rulebook Table).
 *
 * Run Faster p. 180: "Distribute 18 points among the attributes,
 * starting with the minimum for the contact's metatype."
 *
 * For human contacts, we use 3 (average) rather than the racial min of 1,
 * since the Run Faster quickstats sidebar treats human NPCs as having
 * balanced attributes. Non-human metatypes use their racial minimums.
 */
const METATYPE_BASE_ATTRIBUTES: Readonly<Record<NpcMetatype, NpcBaseAttributes>> = {
  human: {
    body: 3,
    agility: 3,
    reaction: 3,
    strength: 3,
    charisma: 3,
    intuition: 3,
    logic: 3,
    willpower: 3,
  },
  elf: {
    body: 1,
    agility: 2,
    reaction: 1,
    strength: 1,
    charisma: 3,
    intuition: 1,
    logic: 1,
    willpower: 1,
  },
  dwarf: {
    body: 3,
    agility: 1,
    reaction: 1,
    strength: 3,
    charisma: 1,
    intuition: 1,
    logic: 1,
    willpower: 2,
  },
  ork: {
    body: 4,
    agility: 1,
    reaction: 1,
    strength: 3,
    charisma: 1,
    intuition: 1,
    logic: 1,
    willpower: 1,
  },
  troll: {
    body: 5,
    agility: 1,
    reaction: 1,
    strength: 5,
    charisma: 1,
    intuition: 1,
    logic: 1,
    willpower: 1,
  },
};

/**
 * Get base attributes for NPC stat block generation.
 *
 * For human contacts, returns the "average" value of 3 (per Run Faster
 * quickstats sidebar), not the racial minimum of 1. Non-human metatypes
 * return their SR5 CRB racial attribute minimums.
 *
 * Do NOT use this for character validation — use edition metatype data instead.
 *
 * @param metatype - Metatype identifier
 * @returns Base attributes for NPC generation
 * @throws Error if metatype is not recognized
 */
export function getMetatypeBaseAttributes(metatype: NpcMetatype): NpcBaseAttributes {
  const attrs = METATYPE_BASE_ATTRIBUTES[metatype];
  if (!attrs) {
    throw new Error(`Unknown metatype: ${metatype}`);
  }
  return { ...attrs };
}

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
 * Uses metatype-specific base attributes (racial minimums for non-humans,
 * average of 3 for humans). The caller is responsible for distributing
 * bonus attribute points and skill points based on the contact's archetype.
 *
 * @param connectionRating - Connection rating (integer 1-12)
 * @param metatype - Contact metatype (defaults to "human")
 * @returns Generated stat block
 * @throws Error if connectionRating is invalid
 */
export function generateContactStatBlock(
  connectionRating: number,
  metatype: NpcMetatype = "human"
): ContactStatBlock {
  const entry = getNpcBuildEntry(connectionRating);

  if (!entry) {
    throw new Error(
      `Connection rating must be an integer between 1 and 12, got ${connectionRating}`
    );
  }

  const baseAttributes = getMetatypeBaseAttributes(metatype);

  const derived = calculateDerivedStats(baseAttributes);

  return {
    connectionRating: entry.connectionRating,
    metatype,
    bonusAttributePoints: entry.bonusAttributePoints,
    totalSkillPoints: entry.totalSkillPoints,
    specialAttributePoints: entry.specialAttributePoints,
    nuyen: entry.nuyen,
    baseAttributes,
    derived,
  };
}

/**
 * Calculate derived combat/social stats from base attributes.
 *
 * Exported so callers who distribute bonus attribute points can
 * recalculate derived stats after modification.
 *
 * @param attrs - Base physical/mental attributes
 * @returns Derived combat/social stats
 */
export function calculateDerivedStats(attrs: NpcBaseAttributes): NpcDerivedStats {
  return {
    initiative: attrs.reaction + attrs.intuition,
    composure: attrs.charisma + attrs.willpower,
    judgeIntentions: attrs.charisma + attrs.intuition,
    physicalConditionMonitor: Math.ceil(attrs.body / 2) + 8,
    stunConditionMonitor: Math.ceil(attrs.willpower / 2) + 8,
  };
}
