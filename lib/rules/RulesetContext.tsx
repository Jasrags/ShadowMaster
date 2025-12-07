"use client";

/**
 * RulesetContext
 *
 * React context that provides the merged ruleset to the UI.
 * Handles loading via API, caching, and provides convenient hooks for
 * accessing ruleset data during character creation.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import type {
  EditionCode,
  MergedRuleset,
  CreationMethod,
  ID,
} from "../types";

// =============================================================================
// TYPES
// =============================================================================

/**
 * Data types for extracted ruleset data
 */
export interface MetatypeData {
  id: string;
  name: string;
  description?: string;
  attributes: Record<string, { min: number; max: number } | { base: number }>;
  racialTraits?: string[];
}

export interface SkillData {
  id: string;
  name: string;
  linkedAttribute: string;
  group?: string | null;
  canDefault?: boolean;
  category?: string;
}

export interface SkillGroupData {
  id: string;
  name: string;
  skills: string[];
}

export interface KnowledgeCategoryData {
  id: string;
  name: string;
  linkedAttribute: string;
}

export interface SkillCreationLimitsData {
  maxSkillRating: number;
  maxSkillRatingWithAptitude: number;
  freeKnowledgePoints: string;
  nativeLanguageRating: number;
}

export interface QualityData {
  id: string;
  name: string;
  karmaCost?: number;
  summary?: string;
}

export interface PriorityTableData {
  levels: string[];
  categories: Array<{ id: string; name: string; description?: string }>;
  table: Record<string, Record<string, unknown>>;
}

export interface MagicPathData {
  id: string;
  name: string;
  description?: string;
  hasMagic?: boolean;
  hasResonance?: boolean;
}

export interface LifestyleData {
  id: string;
  name: string;
  monthlyCost: number;
  startingNuyen: string;
  description?: string;
}

export interface GearItemData {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  cost: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
  rating?: number;
  description?: string;
}

export interface WeaponData extends GearItemData {
  damage: string;
  ap: number;
  reach?: number;
  accuracy?: number;
  mode?: string[];
  rc?: number;
  ammo?: number;
  blast?: string;
}

export interface ArmorData extends GearItemData {
  armorRating: number;
}

export interface CommlinkData extends GearItemData {
  deviceRating: number;
}

export interface CyberdeckData extends GearItemData {
  deviceRating: number;
  attributes: {
    attack: number;
    sleaze: number;
    dataProcessing: number;
    firewall: number;
  };
  programs: number;
}

export interface GearCatalogData {
  categories: Array<{ id: string; name: string }>;
  weapons: {
    melee: WeaponData[];
    pistols: WeaponData[];
    smgs: WeaponData[];
    rifles: WeaponData[];
    shotguns: WeaponData[];
    sniperRifles: WeaponData[];
    throwingWeapons: WeaponData[];
    grenades: WeaponData[];
  };
  armor: ArmorData[];
  commlinks: CommlinkData[];
  cyberdecks: CyberdeckData[];
  electronics: GearItemData[];
  tools: GearItemData[];
  survival: GearItemData[];
  medical: GearItemData[];
  security: GearItemData[];
  miscellaneous: GearItemData[];
  ammunition: GearItemData[];
}

export interface SpellData {
  id: string;
  name: string;
  category: "combat" | "detection" | "health" | "illusion" | "manipulation";
  type: "mana" | "physical";
  range: string;
  duration: string;
  drain: string;
  damage?: string;
  description?: string;
}

export interface SpellsCatalogData {
  combat: SpellData[];
  detection: SpellData[];
  health: SpellData[];
  illusion: SpellData[];
  manipulation: SpellData[];
}

export interface ComplexFormData {
  id: string;
  name: string;
  target: string;
  duration: string;
  fading: string;
  description?: string;
}

export interface CyberwareGradeData {
  id: string;
  name: string;
  essenceMultiplier: number;
  costMultiplier: number;
  availabilityModifier: number;
}

export interface CyberwareCatalogItemData {
  id: string;
  name: string;
  category: string;
  essenceCost: number;
  cost: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
  hasRating?: boolean;
  maxRating?: number;
  essencePerRating?: boolean;
  costPerRating?: boolean;
  capacity?: number;
  capacityCost?: number;
  capacityPerRating?: boolean;
  attributeBonuses?: Record<string, number>;
  attributeBonusesPerRating?: Record<string, number>;
  maxAttributeBonus?: number;
  initiativeDiceBonus?: number;
  initiativeDiceBonusPerRating?: number;
  description?: string;
  wirelessBonus?: string;
  page?: number;
  source?: string;
  parentType?: string;
  requirements?: string[];
}

export interface CyberwareCatalogData {
  rules: AugmentationRulesData;
  grades: CyberwareGradeData[];
  catalog: CyberwareCatalogItemData[];
}

export interface BiowareGradeData {
  id: string;
  name: string;
  essenceMultiplier: number;
  costMultiplier: number;
  availabilityModifier: number;
}

export interface BiowareCatalogItemData {
  id: string;
  name: string;
  category: string;
  essenceCost: number;
  cost: number;
  availability: number;
  restricted?: boolean;
  forbidden?: boolean;
  hasRating?: boolean;
  maxRating?: number;
  essencePerRating?: boolean;
  costPerRating?: boolean;
  attributeBonuses?: Record<string, number>;
  attributeBonusesPerRating?: Record<string, number>;
  maxAttributeBonus?: number;
  initiativeDiceBonus?: number;
  description?: string;
  page?: number;
  source?: string;
  requirements?: string[];
}

export interface BiowareCatalogData {
  grades: BiowareGradeData[];
  catalog: BiowareCatalogItemData[];
}

export interface AugmentationRulesData {
  maxEssence: number;
  maxAttributeBonus: number;
  maxAvailabilityAtCreation: number;
  trackEssenceHoles: boolean;
  magicReductionFormula: "roundUp" | "roundDown" | "exact";
}

/**
 * State of the ruleset context
 */
export interface RulesetContextState {
  /** Current edition code */
  editionCode: EditionCode | null;

  /** The merged ruleset (null if not loaded) */
  ruleset: MergedRuleset | null;

  /** Available creation methods for this edition */
  creationMethods: CreationMethod[];

  /** Currently selected creation method */
  currentCreationMethod: CreationMethod | null;

  /** Loading state */
  loading: boolean;

  /** Error message if loading failed */
  error: string | null;

  /** Whether the ruleset is ready to use */
  ready: boolean;
}

/**
 * Actions available in the context
 */
export interface RulesetContextActions {
  /** Load a ruleset for an edition */
  loadRuleset: (editionCode: EditionCode, bookIds?: ID[]) => Promise<void>;

  /** Select a creation method */
  selectCreationMethod: (methodId: ID) => void;

  /** Clear the loaded ruleset */
  clearRuleset: () => void;

  /** Refresh the current ruleset */
  refresh: () => Promise<void>;
}

/**
 * Extracted data from the ruleset for convenience
 */
export interface RulesetData {
  metatypes: MetatypeData[];
  skills: {
    activeSkills: SkillData[];
    skillGroups: SkillGroupData[];
    knowledgeCategories: KnowledgeCategoryData[];
    creationLimits: SkillCreationLimitsData;
  };
  qualities: { positive: QualityData[]; negative: QualityData[] };
  priorityTable: PriorityTableData | null;
  magicPaths: MagicPathData[];
  lifestyles: LifestyleData[];
  lifestyleModifiers: Record<string, number>;
  gear: GearCatalogData | null;
  spells: SpellsCatalogData | null;
  complexForms: ComplexFormData[];
  cyberware: CyberwareCatalogData | null;
  bioware: BiowareCatalogData | null;
  augmentationRules: AugmentationRulesData;
}

/**
 * Full context value
 */
export interface RulesetContextValue extends RulesetContextState, RulesetContextActions {
  /** Pre-extracted ruleset data */
  data: RulesetData;
}

// =============================================================================
// CONTEXT
// =============================================================================

const defaultAugmentationRules: AugmentationRulesData = {
  maxEssence: 6,
  maxAttributeBonus: 4,
  maxAvailabilityAtCreation: 12,
  trackEssenceHoles: true,
  magicReductionFormula: "roundUp",
};

const defaultData: RulesetData = {
  metatypes: [],
  skills: {
    activeSkills: [],
    skillGroups: [],
    knowledgeCategories: [],
    creationLimits: {
      maxSkillRating: 6,
      maxSkillRatingWithAptitude: 7,
      freeKnowledgePoints: "(LOG + INT) × 2",
      nativeLanguageRating: 6,
    },
  },
  qualities: { positive: [], negative: [] },
  priorityTable: null,
  magicPaths: [],
  lifestyles: [],
  lifestyleModifiers: {},
  gear: null,
  spells: null,
  complexForms: [],
  cyberware: null,
  bioware: null,
  augmentationRules: defaultAugmentationRules,
};

const defaultState: RulesetContextState = {
  editionCode: null,
  ruleset: null,
  creationMethods: [],
  currentCreationMethod: null,
  loading: false,
  error: null,
  ready: false,
};

const RulesetContext = createContext<RulesetContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

export interface RulesetProviderProps {
  children: React.ReactNode;

  /** Initial edition to load (optional) */
  initialEdition?: EditionCode;

  /** Initial book IDs to include (optional) */
  initialBookIds?: ID[];
}

export function RulesetProvider({
  children,
}: RulesetProviderProps) {
  const [state, setState] = useState<RulesetContextState>(defaultState);
  const [data, setData] = useState<RulesetData>(defaultData);

  // Load ruleset action via API
  const loadRuleset = useCallback(
    async (editionCode: EditionCode, bookIds?: ID[]) => {
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        ready: false,
      }));

      try {
        // Build API URL
        let url = `/api/rulesets/${editionCode}`;
        if (bookIds && bookIds.length > 0) {
          url += `?bookIds=${bookIds.join(",")}`;
        }

        // Fetch from API
        const response = await fetch(url);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || "Failed to load ruleset");
        }

        const { ruleset, creationMethods, extractedData } = result;
        const defaultMethod = creationMethods[0] || null;

        // Transform extracted data
        const transformedData: RulesetData = extractedData
          ? {
              metatypes: extractedData.metatypes || [],
              skills: extractedData.skills || defaultData.skills,
              qualities: extractedData.qualities || { positive: [], negative: [] },
              priorityTable: extractedData.priorityTable || null,
              magicPaths: extractedData.magicPaths || [],
              lifestyles: extractedData.lifestyles || [],
              lifestyleModifiers: extractedData.lifestyleModifiers || {},
              gear: extractedData.gear || null,
              spells: extractedData.spells || null,
              complexForms: extractedData.complexForms || [],
              cyberware: extractedData.cyberware || null,
              bioware: extractedData.bioware || null,
              augmentationRules: extractedData.augmentationRules || defaultAugmentationRules,
            }
          : defaultData;

        setState({
          editionCode,
          ruleset,
          creationMethods,
          currentCreationMethod: defaultMethod,
          loading: false,
          error: null,
          ready: true,
        });

        setData(transformedData);
      } catch (error) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : "Unknown error",
          ready: false,
        }));
      }
    },
    []
  );

  // Select creation method action
  const selectCreationMethod = useCallback(
    (methodId: ID) => {
      const method = state.creationMethods.find((m) => m.id === methodId);
      if (method) {
        setState((prev) => ({
          ...prev,
          currentCreationMethod: method,
        }));
      }
    },
    [state.creationMethods]
  );

  // Clear ruleset action
  const clearRuleset = useCallback(() => {
    setState(defaultState);
    setData(defaultData);
  }, []);

  // Refresh action
  const refresh = useCallback(async () => {
    if (state.editionCode) {
      await loadRuleset(state.editionCode);
    }
  }, [state.editionCode, loadRuleset]);

  // Memoize context value
  const contextValue = useMemo<RulesetContextValue>(
    () => ({
      ...state,
      data,
      loadRuleset,
      selectCreationMethod,
      clearRuleset,
      refresh,
    }),
    [state, data, loadRuleset, selectCreationMethod, clearRuleset, refresh]
  );

  return (
    <RulesetContext.Provider value={contextValue}>
      {children}
    </RulesetContext.Provider>
  );
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook to access the full ruleset context
 */
export function useRuleset(): RulesetContextValue {
  const context = useContext(RulesetContext);

  if (!context) {
    throw new Error("useRuleset must be used within a RulesetProvider");
  }

  return context;
}

/**
 * Hook to get just the merged ruleset
 */
export function useMergedRuleset(): MergedRuleset | null {
  const { ruleset } = useRuleset();
  return ruleset;
}

/**
 * Hook to get the current creation method
 */
export function useCreationMethod(): CreationMethod | null {
  const { currentCreationMethod } = useRuleset();
  return currentCreationMethod;
}

/**
 * Hook to get available creation methods
 */
export function useCreationMethods(): CreationMethod[] {
  const { creationMethods } = useRuleset();
  return creationMethods;
}

/**
 * Hook to get metatypes from the ruleset
 */
export function useMetatypes(): MetatypeData[] {
  const { data } = useRuleset();
  return data.metatypes;
}

/**
 * Hook to get skills from the ruleset
 */
export function useSkills(): {
  activeSkills: SkillData[];
  skillGroups: SkillGroupData[];
  knowledgeCategories: KnowledgeCategoryData[];
  creationLimits: SkillCreationLimitsData;
} {
  const { data } = useRuleset();
  return data.skills;
}

/**
 * Hook to get qualities from the ruleset
 */
export function useQualities(): { positive: QualityData[]; negative: QualityData[] } {
  const { data } = useRuleset();
  return data.qualities;
}

/**
 * Hook to get the priority table
 */
export function usePriorityTable(): PriorityTableData | null {
  const { data } = useRuleset();
  return data.priorityTable;
}

/**
 * Hook to get magic paths
 */
export function useMagicPaths(): MagicPathData[] {
  const { data } = useRuleset();
  return data.magicPaths;
}

/**
 * Hook to get lifestyles
 */
export function useLifestyles(): LifestyleData[] {
  const { data } = useRuleset();
  return data.lifestyles;
}

/**
 * Hook to check if ruleset is ready
 */
export function useRulesetReady(): boolean {
  const { ready } = useRuleset();
  return ready;
}

/**
 * Hook to get loading and error state
 */
export function useRulesetStatus(): {
  loading: boolean;
  error: string | null;
  ready: boolean;
} {
  const { loading, error, ready } = useRuleset();
  return { loading, error, ready };
}

/**
 * Hook to get gear catalog
 */
export function useGear(): GearCatalogData | null {
  const { data } = useRuleset();
  return data.gear;
}

/**
 * Hook to get lifestyle metatype modifiers
 */
export function useLifestyleModifiers(): Record<string, number> {
  const { data } = useRuleset();
  return data.lifestyleModifiers;
}

/**
 * Hook to get spells catalog
 */
export function useSpells(): SpellsCatalogData | null {
  const { data } = useRuleset();
  return data.spells;
}

/**
 * Hook to get complex forms
 */
export function useComplexForms(): ComplexFormData[] {
  const { data } = useRuleset();
  return data.complexForms;
}

/**
 * Hook to get cyberware catalog with optional filtering
 */
export function useCyberware(options?: {
  category?: string;
  maxAvailability?: number;
  excludeForbidden?: boolean;
  excludeRestricted?: boolean;
}): CyberwareCatalogData | null {
  const { data } = useRuleset();

  return useMemo(() => {
    if (!data.cyberware) return null;

    let filteredCatalog = [...data.cyberware.catalog];

    if (options?.category) {
      filteredCatalog = filteredCatalog.filter(
        (item) => item.category === options.category
      );
    }

    if (options?.maxAvailability !== undefined) {
      filteredCatalog = filteredCatalog.filter(
        (item) => item.availability <= options.maxAvailability!
      );
    }

    if (options?.excludeForbidden) {
      filteredCatalog = filteredCatalog.filter((item) => !item.forbidden);
    }

    if (options?.excludeRestricted) {
      filteredCatalog = filteredCatalog.filter((item) => !item.restricted);
    }

    return {
      ...data.cyberware,
      catalog: filteredCatalog,
    };
  }, [data.cyberware, options?.category, options?.maxAvailability, options?.excludeForbidden, options?.excludeRestricted]);
}

/**
 * Hook to get bioware catalog with optional filtering
 */
export function useBioware(options?: {
  category?: string;
  maxAvailability?: number;
  excludeForbidden?: boolean;
  excludeRestricted?: boolean;
}): BiowareCatalogData | null {
  const { data } = useRuleset();

  return useMemo(() => {
    if (!data.bioware) return null;

    let filteredCatalog = [...data.bioware.catalog];

    if (options?.category) {
      filteredCatalog = filteredCatalog.filter(
        (item) => item.category === options.category
      );
    }

    if (options?.maxAvailability !== undefined) {
      filteredCatalog = filteredCatalog.filter(
        (item) => item.availability <= options.maxAvailability!
      );
    }

    if (options?.excludeForbidden) {
      filteredCatalog = filteredCatalog.filter((item) => !item.forbidden);
    }

    if (options?.excludeRestricted) {
      filteredCatalog = filteredCatalog.filter((item) => !item.restricted);
    }

    return {
      ...data.bioware,
      catalog: filteredCatalog,
    };
  }, [data.bioware, options?.category, options?.maxAvailability, options?.excludeForbidden, options?.excludeRestricted]);
}

/**
 * Hook to get augmentation rules
 */
export function useAugmentationRules(): AugmentationRulesData {
  const { data } = useRuleset();
  return data.augmentationRules;
}

/**
 * Hook to get cyberware grades
 */
export function useCyberwareGrades(): CyberwareGradeData[] {
  const { data } = useRuleset();
  return data.cyberware?.grades || [];
}

/**
 * Hook to get bioware grades
 */
export function useBiowareGrades(): BiowareGradeData[] {
  const { data } = useRuleset();
  return data.bioware?.grades || [];
}

// =============================================================================
// ESSENCE CALCULATION UTILITIES
// =============================================================================

/**
 * Calculate the actual essence cost for a cyberware item based on grade
 */
export function calculateCyberwareEssenceCost(
  baseEssenceCost: number,
  grade: string,
  grades: CyberwareGradeData[],
  rating?: number,
  essencePerRating?: boolean
): number {
  const gradeData = grades.find((g) => g.id === grade);
  const multiplier = gradeData?.essenceMultiplier || 1.0;

  let cost = baseEssenceCost;
  if (essencePerRating && rating) {
    cost = baseEssenceCost * rating;
  }

  return Math.round(cost * multiplier * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate the actual cost for a cyberware item based on grade
 */
export function calculateCyberwareCost(
  baseCost: number,
  grade: string,
  grades: CyberwareGradeData[],
  rating?: number,
  costPerRating?: boolean
): number {
  const gradeData = grades.find((g) => g.id === grade);
  const multiplier = gradeData?.costMultiplier || 1.0;

  let cost = baseCost;
  if (costPerRating && rating) {
    cost = baseCost * rating;
  }

  return Math.round(cost * multiplier);
}

/**
 * Calculate the actual availability for a cyberware item based on grade
 */
export function calculateCyberwareAvailability(
  baseAvailability: number,
  grade: string,
  grades: CyberwareGradeData[]
): number {
  const gradeData = grades.find((g) => g.id === grade);
  const modifier = gradeData?.availabilityModifier || 0;
  return Math.max(0, baseAvailability + modifier);
}

/**
 * Calculate the actual essence cost for a bioware item based on grade
 */
export function calculateBiowareEssenceCost(
  baseEssenceCost: number,
  grade: string,
  grades: BiowareGradeData[],
  rating?: number,
  essencePerRating?: boolean
): number {
  const gradeData = grades.find((g) => g.id === grade);
  const multiplier = gradeData?.essenceMultiplier || 1.0;

  let cost = baseEssenceCost;
  if (essencePerRating && rating) {
    cost = baseEssenceCost * rating;
  }

  return Math.round(cost * multiplier * 100) / 100;
}

/**
 * Calculate the actual cost for a bioware item based on grade
 */
export function calculateBiowareCost(
  baseCost: number,
  grade: string,
  grades: BiowareGradeData[],
  rating?: number,
  costPerRating?: boolean
): number {
  const gradeData = grades.find((g) => g.id === grade);
  const multiplier = gradeData?.costMultiplier || 1.0;

  let cost = baseCost;
  if (costPerRating && rating) {
    cost = baseCost * rating;
  }

  return Math.round(cost * multiplier);
}

/**
 * Calculate the actual availability for a bioware item based on grade
 */
export function calculateBiowareAvailability(
  baseAvailability: number,
  grade: string,
  grades: BiowareGradeData[]
): number {
  const gradeData = grades.find((g) => g.id === grade);
  const modifier = gradeData?.availabilityModifier || 0;
  return Math.max(0, baseAvailability + modifier);
}

/**
 * Calculate total essence from installed augmentations
 */
export function calculateTotalEssenceLoss(
  cyberware: Array<{ essenceCost: number }>,
  bioware: Array<{ essenceCost: number }>
): number {
  const cyberTotal = cyberware.reduce((sum, item) => sum + item.essenceCost, 0);
  const bioTotal = bioware.reduce((sum, item) => sum + item.essenceCost, 0);
  return Math.round((cyberTotal + bioTotal) * 100) / 100;
}

/**
 * Calculate remaining essence
 */
export function calculateRemainingEssence(
  maxEssence: number,
  cyberware: Array<{ essenceCost: number }>,
  bioware: Array<{ essenceCost: number }>
): number {
  const loss = calculateTotalEssenceLoss(cyberware, bioware);
  return Math.round((maxEssence - loss) * 100) / 100;
}

/**
 * Calculate Magic/Resonance loss from essence loss
 */
export function calculateMagicLoss(
  essenceLoss: number,
  formula: "roundUp" | "roundDown" | "exact"
): number {
  switch (formula) {
    case "roundUp":
      return Math.ceil(essenceLoss);
    case "roundDown":
      return Math.floor(essenceLoss);
    case "exact":
      return essenceLoss;
    default:
      return Math.ceil(essenceLoss);
  }
}

/**
 * Check if an augmentation can be added based on availability limit
 */
export function canAddAugmentation(
  availability: number,
  maxAvailability: number,
  restricted?: boolean,
  forbidden?: boolean
): { allowed: boolean; reason?: string } {
  if (forbidden) {
    return { allowed: false, reason: "Forbidden items not allowed at creation" };
  }
  if (availability > maxAvailability) {
    return { allowed: false, reason: `Availability ${availability} exceeds maximum ${maxAvailability}` };
  }
  return { allowed: true };
}

/**
 * Check total attribute bonus from augmentations doesn't exceed maximum
 */
export function checkAttributeBonusLimit(
  currentBonuses: Record<string, number>,
  newBonuses: Record<string, number>,
  maxBonus: number
): { allowed: boolean; violations: string[] } {
  const violations: string[] = [];

  for (const [attr, bonus] of Object.entries(newBonuses)) {
    const current = currentBonuses[attr] || 0;
    const total = current + bonus;
    if (total > maxBonus) {
      violations.push(`${attr}: ${total} exceeds max ${maxBonus}`);
    }
  }

  return { allowed: violations.length === 0, violations };
}
