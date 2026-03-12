/**
 * Life Modules character creation types (Run Faster, pp. 65-84)
 *
 * Life Modules is a life-path system where characters progress through
 * nationality, formative years, teen years, further education, and
 * real-life career modules. Each module provides attributes, skills,
 * qualities, and knowledge skills.
 */

// =============================================================================
// LIFE MODULE PHASES
// =============================================================================

/**
 * Sequential phases of the Life Modules creation process.
 * Characters must complete phases in order (education/career/tour are optional/repeatable).
 */
export type LifeModulePhase =
  | "nationality" // Step 1: Where you're from
  | "formative" // Step 2: Childhood (age to 10)
  | "teen" // Step 3: Teenage years (age to 17)
  | "education" // Step 4: Further education (optional)
  | "career" // Step 5: Real life careers (multiple allowed, no repeats)
  | "tour"; // Step 6: Tours of duty (military service)

// =============================================================================
// LIFE MODULE DATA
// =============================================================================

/**
 * A single life module that can be selected during character creation.
 * Modules provide cumulative benefits (attributes, skills, qualities, etc.)
 */
export interface LifeModule {
  /** Unique identifier (kebab-case) */
  readonly id: string;

  /** Display name */
  readonly name: string;

  /** Which phase this module belongs to */
  readonly phase: LifeModulePhase;

  /** Karma cost to select this module */
  readonly karmaCost: number;

  /** Years added to character age when selected */
  readonly yearsAdded?: number;

  /** Description of this life path */
  readonly description?: string;

  /** Source book page reference */
  readonly pageReference?: string;

  /** Required prior module IDs (e.g., PI requires prior Law Enforcement) */
  readonly prerequisites?: readonly string[];

  /** Attribute points granted */
  readonly attributeModifiers?: Readonly<Record<string, number>>;

  /** Active skill ranks granted (skill ID -> ranks) */
  readonly activeSkills?: Readonly<Record<string, number>>;

  /** Skill group ranks granted (group ID -> ranks) */
  readonly skillGroups?: Readonly<Record<string, number>>;

  /** Knowledge skill ranks granted (skill name -> ranks) */
  readonly knowledgeSkills?: Readonly<Record<string, number>>;

  /** Language skills granted (language name -> ranks) */
  readonly languages?: Readonly<Record<string, number>>;

  /** Quality IDs granted (positive and negative) */
  readonly qualities?: readonly LifeModuleQualityGrant[];

  /** Contact grants */
  readonly contacts?: readonly LifeModuleContactGrant[];

  /** Sub-modules for disciplines, branches, or specializations */
  readonly subModules?: readonly LifeModule[];

  /** Whether user must pick exactly one sub-module */
  readonly requiresSubModuleSelection?: boolean;

  /** Nuyen bonus granted */
  readonly nuyenBonus?: number;

  /** Special notes or rules for this module */
  readonly notes?: string;
}

/**
 * A quality granted by a life module.
 * Duplicate non-stackable qualities must be replaced with same-cost alternative.
 */
export interface LifeModuleQualityGrant {
  /** Quality catalog ID */
  readonly id: string;

  /** Whether this is positive or negative */
  readonly type: "positive" | "negative";

  /** Optional level for multi-level qualities */
  readonly level?: number;

  /** Optional specification (e.g., language for Linguist) */
  readonly specification?: string;
}

/**
 * A contact granted by a life module.
 */
export interface LifeModuleContactGrant {
  /** Contact archetype or description */
  readonly archetype: string;

  /** Connection rating */
  readonly connection: number;

  /** Loyalty rating */
  readonly loyalty: number;
}

// =============================================================================
// NATIONALITY MODULE SPECIFICS
// =============================================================================

/**
 * Extended nationality module with regional variants.
 * Nations have multiple regional sub-modules (e.g., UCAS -> Seattle, Denver).
 */
export interface NationalityModule extends LifeModule {
  readonly phase: "nationality";

  /** The nation this belongs to */
  readonly nation: string;

  /** Primary language granted (e.g., English, Sperethiel) */
  readonly primaryLanguage: string;

  /** Optional secondary language */
  readonly secondaryLanguage?: string;
}

// =============================================================================
// EDUCATION MODULE SPECIFICS
// =============================================================================

/**
 * Institution types for further education phase.
 */
export type EducationInstitutionType =
  | "community-college"
  | "state-university"
  | "ivy-league"
  | "military-academy"
  | "trade-school";

/**
 * Discipline categories for education modules.
 */
export type EducationDisciplineCategory = "science" | "arts" | "trade";

// =============================================================================
// LIFE MODULES CATALOG
// =============================================================================

/**
 * The complete catalog of life modules, organized by phase.
 * This is the payload structure for the lifeModules rule module.
 */
export interface LifeModulesCatalog {
  /** All nationality modules (with regional sub-modules) */
  readonly nationality: readonly LifeModule[];

  /** Formative years modules (childhood, age to 10) */
  readonly formative: readonly LifeModule[];

  /** Teen years modules (age to 17) */
  readonly teen: readonly LifeModule[];

  /** Further education modules (with institution/discipline sub-modules) */
  readonly education: readonly LifeModule[];

  /** Real life career modules (with sub-specializations) */
  readonly career: readonly LifeModule[];

  /** Tours of duty modules (military service branches) */
  readonly tour: readonly LifeModule[];
}

// =============================================================================
// LIFE MODULES CREATION STATE
// =============================================================================

/**
 * Tracks a selected life module in creation state.
 * Includes the module ID, any sub-module selection, and resolved grants.
 */
export interface LifeModuleSelection {
  /** Module ID */
  readonly moduleId: string;

  /** Selected sub-module ID (if module has sub-modules) */
  readonly subModuleId?: string;

  /** Phase this selection belongs to */
  readonly phase: LifeModulePhase;

  /** Karma cost paid for this selection */
  readonly karmaCost: number;

  /** Resolved quality replacements (when duplicates are encountered) */
  readonly qualityReplacements?: readonly QualityReplacement[];
}

/**
 * When a module grants a duplicate non-stackable quality,
 * the player must replace it with a same-cost alternative.
 */
export interface QualityReplacement {
  /** Original quality ID from the module */
  readonly originalQualityId: string;

  /** Replacement quality ID chosen by the player */
  readonly replacementQualityId: string;
}

/**
 * Life Modules-specific selections stored in CreationState.selections
 */
export interface LifeModulesSelections {
  /** Ordered list of selected life modules */
  readonly lifeModules?: readonly LifeModuleSelection[];

  /** Calculated character age based on module selections */
  readonly calculatedAge?: number;
}

// =============================================================================
// LIFE MODULES CONSTANTS
// =============================================================================

/** Starting karma budget for Life Modules creation (Run Faster p. 65) */
export const LIFE_MODULES_KARMA_BUDGET = 750;

/** Maximum active skill rating at creation */
export const LIFE_MODULES_MAX_ACTIVE_SKILL = 7;

/** Maximum knowledge skill rating at creation */
export const LIFE_MODULES_MAX_KNOWLEDGE_SKILL = 9;

/** Maximum karma that can be spent on gear (1 Karma per 2,000 nuyen) */
export const LIFE_MODULES_MAX_GEAR_KARMA = 200;

/** Nuyen per karma for gear purchases */
export const LIFE_MODULES_NUYEN_PER_KARMA = 2000;

/** Maximum negative quality karma after all modules */
export const LIFE_MODULES_MAX_NEGATIVE_QUALITIES = 25;

/** Base character age (before modules add years) */
export const LIFE_MODULES_BASE_AGE = 0;

/** Nationality module karma cost */
export const NATIONALITY_KARMA_COST = 15;

/** Formative years module karma cost */
export const FORMATIVE_KARMA_COST = 40;

/** Teen years module karma cost */
export const TEEN_KARMA_COST = 50;

/** Career (Real Life) module karma cost */
export const CAREER_KARMA_COST = 100;

/** Career module years added */
export const CAREER_YEARS_ADDED = 4;

/** Tour of Duty module karma cost */
export const TOUR_KARMA_COST = 100;

/** Tour of Duty years added */
export const TOUR_YEARS_ADDED = 5;
