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

// Drain calculation
export {
  calculateDrain,
  calculateDrainResistance,
  parseDrainFormula,
  getDrainType,
  calculateDrainPreview,
  formatDrainSummary,
  type DrainCalculationInput,
} from "./drain-calculator";

// Drain application
export {
  applyDrain,
  checkBurnoutRisk,
  wouldIncapacitate,
  createDrainSession,
  recordDrainEvent,
  getDrainSessionSummary,
  estimateResistanceHits,
  formatDamageCondition,
  type DrainApplicationResult,
  type DrainHistoryEntry,
  type DrainSession,
} from "./drain-application";

// Essence-Magic integration
export {
  calculateEffectiveMagic,
  canStillUseMagic,
  validateEssenceForTradition,
  getEssenceMagicState,
  previewAugmentationMagicImpact,
  validateAugmentationForMagic,
  formatEssenceMagicState,
  getMagicDegradationSummary,
  type AugmentationMagicValidation,
} from "./essence-magic-link";
