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
  useLifestyles,
  useRulesetReady,
  useRulesetStatus,
  useSpells,
  useComplexForms,
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
  LifestyleData,
  SpellData,
  SpellsCatalogData,
  ComplexFormData,
} from "./RulesetContext";
