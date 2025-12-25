/**
 * Type exports
 *
 * Central export point for all application types.
 */

// Core types
export type { ID, ISODateString, Metadata, MagicalPath } from "./core";

  // Edition and ruleset types
export type {
  EditionCode,
  Edition,
  BookCategory,
  Book,
  RuleModuleType,
  RuleModule,
  MergeStrategy,
  RuleOverride,
  BookPayload,
  BookModuleEntry,
  MergedRuleset,
  CyberwareCatalogItem,
  BiowareCatalogItem,
  AugmentationRules,
  // Modification catalog types
  WeaponMountType,
  ModifiableGearType,
  WeaponModificationCatalogItem,
  ArmorModificationCatalogItem,
  ModificationsCatalog,
  // Spirit types
  SpiritPower,
  Spirit,
  // Quality catalog types (re-exported from qualities.ts for convenience)
  Quality,
  QualityCatalog,
  QualityEffect,
  QualityPrerequisites,
  QualityLevel,
  SourceReference,
  DynamicStateType,
} from "./edition";

// Character types
export type {
  CharacterStatus,
  CharacterApprovalStatus,
  Character,
  KnowledgeSkill,
  LanguageSkill,
  SkillSource,
  SkillWithSource,
  AdeptPower,
  BoundSpirit,
  Lifestyle,
  LifestyleModification,
  LifestyleSubscription,
  SIN,
  License,
  Identity,
  GearItem,
  Weapon,
  ArmorItem,
  // Modification types for character gear
  WeaponMount,
  InstalledWeaponMod,
  InstalledArmorMod,
  InstalledGearMod,
  CyberwareGrade,
  CyberwareCategory,
  CyberwareItem,
  BiowareGrade,
  BiowareCategory,
  BiowareItem,
  EssenceHole,
  Vehicle,
  Contact,
  CharacterDrone,
  CharacterRCC,
  CharacterAutosoft,
  FocusItem,
  CharacterDraft,
  CreateCharacterRequest,
  UpdateCharacterRequest,
  CharacterResponse,
  CharactersListResponse,
  ContactTemplateData,
  // Advancement types
  AdvancementType,
  TrainingStatus,
  AdvancementRecord,
  TrainingPeriod,
} from "./character";

// Quality types (additional types not re-exported from edition)
export type {
  QualitySelection,
  EffectType,
  EffectTrigger,
  EffectTarget,
  EffectCondition,
  AcquisitionSource,
  QualityDynamicState,
  AddictionState,
  AllergyState,
  DependentState,
  CodeOfHonorState,
} from "./qualities";

// Cyberware/Bioware grade multipliers and modifiers
export {
  CYBERWARE_GRADE_MULTIPLIERS,
  CYBERWARE_GRADE_AVAILABILITY_MODIFIERS,
  CYBERWARE_GRADE_COST_MULTIPLIERS,
  BIOWARE_GRADE_MULTIPLIERS,
  SinnerQuality,
} from "./character";

// Spirit types enum
export { SpiritType } from "./edition";

// Creation method types
export type {
  CreationMethodType,
  CreationMethod,
  CreationStepType,
  CreationStep,
  CreationStepPayload,
  SelectStepPayload,
  PriorityStepPayload,
  PriorityCategory,
  AllocateStepPayload,
  ChooseStepPayload,
  PurchaseStepPayload,
  InfoStepPayload,
  ValidateStepPayload,
  CreationBudget,
  ConstraintType,
  CreationConstraint,
  StepDependency,
  OptionalRule,
  OptionalRuleEffect,
  SR5PriorityTable,
  SR5PriorityLevel,
  SR5MetatypePriority,
  SR5MagicPriority,
  SR5SkillsPriority,
  FreeSkillAllocation,
  CreationState,
  ValidationError,
} from "./creation";

// User types
export * from "./user";

// Vehicle & Drone catalog types (for ruleset data)
export type {
  VehicleCategory,
  HandlingRating,
  VehicleCatalogItem,
  DroneSize,
  Drone,
  DroneCatalogItem,
  RCC,
  RCCCatalogItem,
  AutosoftCategory,
  Autosoft,
  AutosoftCatalogItem,
  VehicleModCategory,
  VehicleModification,
  OwnedVehicle,
  OwnedDrone,
  OwnedRCC,
  OwnedAutosoft,
  VehiclesModuleData,
} from "./vehicles";

// Matrix Program types
export type {
  ProgramCategory,
  ProgramCatalogItem,
  ProgramsModule,
  CharacterProgram,
} from "./programs";

// Campaign types
export type {
  CampaignVisibility,
  GameplayLevel,
  CampaignStatus,
  Campaign,
  CampaignMembership,
  CampaignNote,
  CampaignSession,
  CreateCampaignRequest,
  UpdateCampaignRequest,
  CampaignResponse,
  CampaignsListResponse,
  JoinCampaignRequest,
  CampaignPost,
  CampaignEvent,
  CampaignTemplate,
  SessionRewardData,
  CampaignActivityType,
  CampaignActivityEvent,
  NotificationType,
  CampaignNotification,
} from "./campaign";

export type { CampaignAdvancementSettings } from "./campaign";

// Location types
export type {
  LocationType,
  LocationVisibility,
  LocationConnectionType,
  Location,
  LocationConnection,
  CreateLocationRequest,
  UpdateLocationRequest,
  LinkContentRequest,
  RecordVisitRequest,
  LocationResponse,
  LocationsListResponse,
  LocationDetailResponse,
  LocationFilters,
  LocationTemplate,
  CreateLocationTemplateRequest,
  LocationTemplateFilters,
} from "./location";

// Rating system types
export type {
  RatingSemanticType,
  RatingConfig,
  ScalingType,
  RatingScalingConfig,
  CatalogItemRatingSpec,
  OwnedItemRating,
  RatingCalculationResult,
  RatingValidationResult,
  RatingValidationContext,
  RatingDisplayOptions,
} from "./ratings";

// Gameplay context types
export type {
  GameplayContext,
  TestContext,
  CombatContext,
  MagicContext,
  MatrixContext,
  HealingContext,
  DamageContext,
  CostContext,
  ResolvedEffect,
} from "./gameplay";

// Audit types
export type {
  AuditAction,
  ActorRole,
  AuditActor,
  RulesetSnapshot,
  StateTransitionDetails,
  AuditEntry,
  CreateAuditEntryParams,
  AuditQueryOptions,
  // User audit types (Participant Governance)
  UserAuditAction,
  UserAuditActor,
  UserAuditEntry,
  CreateUserAuditEntryParams,
  UserAuditQueryOptions,
} from "./audit";

// Discovery types (for ruleset browsing)
export type {
  ContentCategory,
  ContentSummary,
  BookSummary,
  EditionDiscoveryMetadata,
  CreationMethodSummary,
  ContentPreviewItem,
  ContentPreviewResponse,
  EditionDiscoveryResponse,
} from "./discovery";

// NPC/Grunt types
export type {
  // Core grunt types
  GruntAttributes,
  GruntStats,
  LieutenantStats,
  GruntSpecialist,
  GruntTeamState,
  GruntTeamOptions,
  GruntVisibility,
  GruntTeam,
  ProfessionalRating,
  // Combat tracking types
  MoraleState,
  IndividualGrunt,
  IndividualGrunts,
  SimplifiedGruntsRules,
  DamageType,
  DamageResult,
  // Template types
  MoraleTier,
  GruntTemplate,
  GruntTemplateCategory,
  // API types
  CreateGruntTeamRequest,
  UpdateGruntTeamRequest,
  ApplyDamageRequest,
  BulkDamageRequest,
  SpendEdgeRequest,
  RollInitiativeRequest,
  GruntTeamResponse,
  GruntTeamsListResponse,
  GruntTeamDetailResponse,
  DamageResponse,
  BulkDamageResponse,
  InitiativeResponse,
  GruntTemplatesResponse,
  // Activity types
  GruntActivityType,
} from "./grunts";

// Grunt constants
export {
  PROFESSIONAL_RATING_DESCRIPTIONS,
  DEFAULT_MORALE_TIERS,
} from "./grunts";

// Contact and Social Governance types
export type {
  // Core contact types
  ContactStatus,
  ContactGroup,
  ContactVisibility,
  SocialContact,
  ContactArchetype,
  // Favor ledger types
  FavorTransactionType,
  FavorRiskLevel,
  FavorTransaction,
  FavorLedger,
  // Social capital types
  SocialCapital,
  SocialActionType,
  SocialModifier,
  SocialAction,
  // Favor cost table types
  FavorCostTable,
  FavorServiceDefinition,
  // API types
  CreateContactRequest,
  UpdateContactRequest,
  ContactStateChangeRequest,
  CallFavorRequest,
  CreateFavorTransactionRequest,
  NetworkingActionRequest,
  ContactResponse,
  ContactsListResponse,
  FavorLedgerResponse,
  SocialCapitalResponse,
  CallFavorResponse,
  NetworkingActionResponse,
  // Activity types
  SocialActivityType,
  // Filter types
  ContactFilters,
} from "./contacts";

// Contact visibility defaults
export {
  DEFAULT_CONTACT_VISIBILITY,
  GM_CONTACT_VISIBILITY,
} from "./contacts";

