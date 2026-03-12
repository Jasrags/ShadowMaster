export {
  resolveLifeModuleGrants,
  lookupModule,
  detectDuplicateQualities,
  applyQualityReplacements,
  EMPTY_GRANTS,
  type ResolvedLifeModuleGrants,
  type DuplicateQualityInfo,
} from "./grant-resolver";

export {
  getModuleGrantedNegativeQualities,
  calculateBuyOffCost,
  getEffectiveNegativeQualityKarma,
  type NegativeQualityKarmaBreakdown,
} from "./buy-off";

export {
  checkPrerequisites,
  getUnmetPrerequisiteNames,
  type PrerequisiteResult,
} from "./prerequisites";
