/**
 * Type exports
 *
 * Central export point for all application types.
 */

// Core types
export type { ID, ISODateString, Metadata, MagicalPath, ItemLegality } from "./core";

// Synchronization types
export type {
  DataLayerType,
  DriftSeverity,
  SyncStatus,
  LegalityStatus,
  RulesetVersionRef,
  DriftReport,
  DriftChange,
  DriftChangeType,
  AffectedItem,
  CharacterUsageContext,
  MigrationRecommendation,
  MigrationStrategy,
  MigrationOption,
  MigrationPlan,
  MigrationStep,
  MigrationAction,
  MigrationResult,
  AppliedMigration,
  MechanicalSnapshot,
  MetatypeSnapshot,
  AttributeDefinitionSnapshot,
  AttributeSnapshot,
  SkillDefinitionSnapshot,
  SkillSnapshot,
  QualityDefinitionSnapshot,
  QualitySnapshot,
  DeltaOverrides,
  TemporaryModifier,
  SyncAuditEntry,
  SyncEventType,
  AppliedChange,
  SyncAuditActor,
  StabilityShield,
  LegalityValidationResult,
  LegalityIssue,
  EncounterEligibility,
  MigrationValidationResult,
} from "./synchronization";

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

// Action Resolution types
export type {
  // Dice result types
  DiceResult,
  // Pool configuration types
  PoolModifierSource,
  PoolModifier,
  ActionPool,
  PoolBuildOptions,
  // Action result types
  ActionContext,
  ActionResult,
  // Edge action types
  EdgeActionType,
  EdgeActionConfig,
  // Edition dice rules
  EditionDiceRules,
  // Action history types
  ActionHistory,
  ActionHistoryStats,
  // API types
  RollActionRequest,
  RerollActionRequest,
  EdgeRequest,
  ActionResultResponse,
  ActionHistoryResponse,
  EdgeResponse,
  // Activity types
  ActionActivityType,
} from "./action-resolution";

// Combat session types
export type {
  // Session types
  CombatSessionStatus,
  CombatPhase,
  EnvironmentConditions,
  EnvironmentModifier,
  CombatSession,
  // Participant types
  ParticipantStatus,
  ParticipantType,
  CombatParticipant,
  ActiveCondition,
  // Action economy types
  ActionType,
  ActionAllocation,
  PendingInterrupt,
  // Initiative types
  InitiativeRoll,
  InitiativePass,
  // Opposed test types
  OpposedTestMode,
  OpposedTestState,
  OpposedTest,
  // API types
  CreateCombatSessionRequest,
  CreateParticipantRequest,
  UpdateCombatSessionRequest,
  CombatInitiativeRequest,
  ExecuteActionRequest,
  ActionModifierInput,
  CombatSessionResponse,
  CombatSessionsListResponse,
  InitiativeRollResponse,
  ActionExecutionResponse,
  StateChange,
  // Activity types
  CombatActivityType,
} from "./combat";

// Combat constants
export { DEFAULT_ACTION_ALLOCATION } from "./combat";

// Action definition types
export type {
  // Domain types
  ExecutionDomain,
  ActionSubcategory,
  // Cost types
  ResourceType,
  ResourceCost,
  ActionCost,
  // Prerequisite types
  PrerequisiteType,
  ActionPrerequisite,
  // Effect types
  ActionEffectType,
  EffectTargetType,
  EffectCalculation,
  ActionEffect,
  // Opposed test types
  OpposedTestConfig,
  // Action definition types
  ActionModifier,
  ActionDefinition,
  ActionCatalog,
  ActionFilters,
  ActionSummary,
  // API types
  GetAvailableActionsRequest,
  GetAvailableActionsResponse,
  GetActionDetailsRequest,
  GetActionDetailsResponse,
} from "./action-definitions";

// Magic system types
export type {
  // State types
  MagicState,
  SustainedSpell,
  BoundSpiritState,
  SpiritTask,
  ActiveFocus,
  // Drain types
  DrainAction,
  DrainResult,
  DrainBreakdown,
  DrainModifier,
  // Essence-Magic link
  EssenceMagicState,
  // Validation types
  TraditionValidationResult,
  SpellValidationResult,
  MagicValidationError,
  MagicValidationWarning,
  // Spell categories
  SpellCategory,
  SpellType,
} from "./magic";

// Matrix operations types
export type {
  // Connection types
  MatrixMode,
  MatrixDeviceType,
  // Attribute configuration
  CyberdeckAttributeConfig,
  // Persona
  MatrixPersona,
  // Programs
  ProgramEffectType,
  ProgramEffect,
  LoadedProgram,
  // Marks
  MarkTargetType,
  MatrixMark,
  // Overwatch
  OverwatchEvent,
  OverwatchSession,
  // Host
  HostAuthLevel,
  // Matrix state
  MatrixState,
  // Convergence
  ICSpawnData,
  ConvergenceResult,
  // Actions
  MatrixActionCategory,
  MatrixActionLegality,
  MatrixAction,
  // Validation
  MatrixValidationError,
  MatrixValidationWarning,
  // Character equipment
  CharacterCyberdeck,
  CharacterCommlink,
  // Catalog types
  CyberdeckCatalogItem,
  CommlinkCatalogItem,
  MatrixActionsModule,
  // API types
  UpdateMatrixStateRequest,
  MatrixEquipmentResponse,
  ValidateMatrixConfigRequest,
  ValidateMatrixConfigResponse,
  RecordOverwatchRequest,
  OverwatchResponse,
} from "./matrix";

// Matrix constants
export {
  OVERWATCH_THRESHOLD,
  MAX_MARKS,
  MATRIX_CONDITION_BASE,
} from "./matrix";

// Rigging control types
export type {
  // Control modes
  ControlMode,
  RiggerVRMode,
  DroneCommandType,
  // VCR
  VehicleControlRig,
  // RCC configuration
  RCCConfiguration,
  RunningAutosoft,
  // Drone network
  DroneNetwork,
  SlavedDrone,
  InstalledAutosoft,
  SharedAutosoft,
  // Jumped-in state
  JumpedInState,
  // Session state
  RiggingState,
  // Vehicle state
  ActiveVehicleState,
  VehicleModifierEffect,
  // Noise calculation
  DistanceBand,
  TerrainModifier,
  NoiseCalculation,
  // Test types
  VehicleTestType,
  VehicleActionType,
  // Validation
  RiggingValidationError,
  RiggingValidationWarning,
  // API types
  StartRiggingSessionRequest,
  UpdateRiggingStateRequest,
  RiggingEquipmentResponse,
  JumpInRequest,
  JumpInResponse,
  ValidateVehicleActionRequest,
  ValidateVehicleActionResponse,
  SlaveDroneRequest,
  SlaveDroneResponse,
  BiofeedbackResult,
  DumpshockResult,
} from "./rigging";

// Rigging constants
export {
  DRONE_SLAVE_LIMIT_MULTIPLIER,
  JUMPED_IN_INITIATIVE_BONUS,
  JUMPED_IN_HOTSIM_INITIATIVE_BONUS,
  VEHICLE_CONDITION_BASE,
  DUMPSHOCK_DAMAGE,
} from "./rigging";

// Gear State types (ADR-010: Inventory State Management)
export type {
  EquipmentReadiness,
  DeviceCondition,
  MatrixCapableDevice,
  GearState,
  AmmunitionCaliber,
  AmmunitionType,
  WeaponAmmoState,
  MagazineItem,
  AmmunitionItem,
  EncumbranceState,
  TransitionActionCost,
  StateTransitionResult,
} from "./gear-state";

// Gear State constants and functions
export {
  VALID_READINESS_STATES,
  STATE_TRANSITION_COSTS,
  DEFAULT_GEAR_STATE,
  DEFAULT_STATE_BY_CATEGORY,
  AMMO_CONSUMPTION_BY_MODE,
  calculateEncumbrancePenalty,
  isValidTransition,
  getTransitionCost,
} from "./gear-state";

// Wireless Effect types (ADR-010)
export type {
  WirelessEffectType,
  AttributeKey,
  LimitKey,
  EffectConditionType,
  WirelessEffect,
  WirelessBonusData,
  ActiveWirelessBonuses,
} from "./wireless-effects";

// Wireless Effect constants and functions
export {
  EMPTY_WIRELESS_BONUSES,
  COMMON_WIRELESS_EFFECTS,
  effectAppliesInContext,
  mergeWirelessBonuses,
  applyWirelessEffect,
} from "./wireless-effects";
