/**
 * Rules Engine exports
 *
 * This file exports only client-safe code.
 * Server-side code (loader, merge, validation) should be imported
 * directly in API routes or server components.
 */

// Ruleset Context (React) - Client-safe
export {
  RulesetProvider,
  useRuleset,
  useMergedRuleset,
  useCreationMethod,
  useCreationMethods,
  useMetatypes,
  useSkills,
  useQualities,
  usePriorityTable,
  useMagicPaths,
  useTraditions,
  useMentorSpirits,
  useRituals,
  useRitualKeywords,
  useLifestyles,
  useRulesetReady,
  useRulesetStatus,
  useSpells,
  useComplexForms,
  useSpriteTypes,
  useSpritePowers,
  useContactTemplates,
  useAdeptPowers,
  useFoci,
  useSpirits,
} from "./RulesetContext";

export type {
  RulesetContextState,
  RulesetContextActions,
  RulesetContextValue,
  RulesetData,
  RulesetProviderProps,
  MetatypeData,
  SkillData,
  SkillGroupData,
  KnowledgeCategoryData,
  SkillCreationLimitsData,
  QualityData,
  PriorityTableData,
  MagicPathData,
  TraditionData,
  MentorSpiritData,
  TraditionSpiritTypes,
  MentorSpiritAdvantages,
  RitualData,
  RitualKeywordData,
  MinionStatsData,
  LifestyleData,
  SpellData,
  SpellsCatalogData,
  ComplexFormData,
  SpriteTypeData,
  SpritePowerData,
} from "./RulesetContext";

// Gameplay utilities - Client-safe
export {
  // Rating calculations
  getEffectiveRating,
  getRatingDiceBonus,
  getItemDiceBonus,
  getRatingThreshold,
  getEffectiveThreshold,
  getPerceptionBonus,
  getDefenseBonus,
  getAttackBonus,
  // Armor calculations (SR5 stacking rules)
  calculateArmorTotal,
  getTotalArmorValue,
  // Wound modifiers
  calculateWoundModifier,
} from "./gameplay";

export type {
  EffectiveRatingContext,
  RatingBonusType,
  TestThresholdType,
  ArmorCalculationResult,
} from "./gameplay";

// Skill group utilities - Client-safe
export {
  // Types
  type NormalizedGroupValue,
  // Normalization
  normalizeGroupValue,
  getGroupRating,
  isGroupBroken,
  createBrokenGroup,
  createRestoredGroup,
  // Karma costs
  SPECIALIZATION_KARMA_COST,
  calculateSkillRaiseKarmaCost,
  calculateSpecializationKarmaCost,
  // Restoration
  canRestoreGroup,
  // Budget helpers
  calculateGroupPointsSpent,
  getActiveGroups,
  getBrokenGroups,
} from "./skills";

// Modification capability system - Client-safe
export {
  // Types
  type ModifiableItem,
  type CapabilityResolutionResult,
  // Category defaults accessor
  getCategoryModificationDefaults,
  // Core resolution
  resolveModificationCapability,
  getModificationCapability,
  canAcceptModifications,
  // Mode-specific helpers
  getAvailableMounts,
  getModificationCapacity,
  getModificationSlots,
  // Compatibility checking
  isModificationAllowed,
  canInstallInSlot,
  // Mode checks
  isMountBased,
  isCapacityBased,
  isSlotBased,
} from "./modifications";
