/**
 * Rules Engine exports
 *
 * Central export point for ruleset loading, merging, and validation.
 */

// Loader
export {
  loadRuleset,
  loadEdition,
  loadAllEditions,
  loadBook,
  loadAllBooks,
  loadCreationMethod,
  loadAllCreationMethods,
  extractModule,
  extractAllModules,
  getAvailableModuleTypes,
  extractMetatypes,
  extractSkills,
  extractQualities,
  extractPriorityTable,
  extractMagicPaths,
  extractLifestyles,
} from "./loader";

export type {
  RulesetLoadConfig,
  LoadedRuleset,
  LoadedBook,
  LoadResult,
  MetatypeData,
  SkillData,
  SkillGroupData,
  QualityData,
  PriorityTableData,
  MagicPathData,
  LifestyleData,
} from "./loader";

// Merge Engine
export {
  mergeRules,
  produceMergedRuleset,
  loadAndMergeRuleset,
  getModule,
  hasModule,
  getModuleTypes,
} from "./merge";

export type { MergeResult } from "./merge";

// Validation Engine
export {
  validateConstraint,
  validateAllConstraints,
  validateCharacter,
  validateStep,
  validateBudgetsComplete,
  calculateRemainingBudget,
  getMetatypeAttributeLimits,
  isAttributeWithinLimits,
} from "./validation";

export type { ValidationResult, ValidationContext } from "./validation";

// Ruleset Context (React)
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
  useLifestyles,
  useRulesetReady,
  useRulesetStatus,
} from "./RulesetContext";

export type {
  RulesetContextState,
  RulesetContextActions,
  RulesetContextValue,
  RulesetData,
  RulesetProviderProps,
} from "./RulesetContext";

