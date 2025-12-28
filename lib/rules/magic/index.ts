/**
 * Magic Rules Module
 *
 * Central export point for all magic-related validation and calculation functions.
 */

// Tradition validation
export {
  validateTraditionEligibility,
  getDrainAttributes,
  getTraditionSpiritTypes,
  validateMagicalPathConsistency,
  canUseMagic,
  canCastSpells,
  canUseAdeptPowers,
  canSummonSpirits,
  findTradition,
  getAvailableTraditions,
} from "./tradition-validator";

// Spell and power validation
export {
  validateSpellAllocation,
  validateAdeptPowerAllocation,
  isSpellCompatible,
  getSpellDefinition,
  getAdeptPowerDefinition,
  extractSpellsCatalog,
  extractAdeptPowersCatalog,
  getSpellsByCategory,
  getAllSpells,
  getAllAdeptPowers,
} from "./spell-validator";
